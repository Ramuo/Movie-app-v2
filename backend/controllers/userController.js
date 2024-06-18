import crypto from "crypto";
import User from "../models/userModel.js";
import EmailVerifToken from "../models/emailVerification.js";
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import { isValidObjectId } from "mongoose";



//@desc     Login User
//@route    POST /api/auth/login
//@access   Public
const login = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified
        })
    }else{
        res.status(401);
        throw new Error("Email ou mot de passe invalide");
    };
});

//@desc     Register User
//@route    POST /api/users/register
//@access   Public
const register = asyncHandler(async(req, res)=>{
    const {name, email, password} = req.body;

    const userExist = await User.findOne({email});

    if(userExist){
        res.status(400);
        throw new Error("L'utilistaur existe déjà");
    };

    const user = new User({ name, email, password });
    await user.save();

    //Generate 6 OTP digit
    let OTP = generateOTP();
    // Store OTP in DB
    const newEmailVerificationToken = new EmailVerifToken({
      owner: user._id, 
      token: OTP
    });
    await newEmailVerificationToken.save();
    //Send the OTP to the user
    const message = `<h2> Bonjour ${user.name},</h2> <br/> <p>Voici le code de vérification de votre adresse email:</h2>${OTP}</p>` //I need to change the content of this message
    try {
      await sendEmail({
        email: user.email,
        subject: "Vérification Email",
        message
      });

      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified
      });
    } catch (error) {
        res.status(400);
        throw new Error("Une erreur s'est produite lors de votre inscription.");
    }
});

//@desc     Email Verifcation
//@route    POST /api/users/email-verification
//@access   Private
const validateEmailVerif = asyncHandler(async(req, res) => {
  const {userId, OTP} = req.body;

  if (!isValidObjectId(userId)){
    res.status(400);
    throw new Error("Aucun utilisateur trouvé avec les informations qui ont été fournies");
  };

  const user = await User.findById(userId);
  if (!user){
    res.status(404);
    throw new Error("Aucun utilisateur trouvé avec les informations qui ont été fournies.");
  };

  if (user.isVerified){
    res.status(404);
    throw new Error("L'utilisateur est déjà vérifié");
  };

  const token = await EmailVerifToken.findOne({ owner: userId });
  if (!token){
    res.status(400);
    throw new Error(" Une erreur s'est produite, token introuvable!");
  };

  const isMatched = await token.compaireToken(OTP);
  if (!isMatched ){
    res.status(400);
    throw new Error("Le code de vérification est invalide");
  };

  user.isVerified = true;
  await user.save();

  await EmailVerifToken.findByIdAndDelete(token._id);

  const message = `<h1>Bonjour ${user.name},</h1> <br/><p>Bienvenue chez movie-app</p>` //I need to change the content of this message
  try {
    await sendEmail({
      email: user.email,
      subject: "Bienvenue",
      message
    });
    res.status(200).json({
      success: true,
      data: "L'adresse E-mail a été vérifiée"
    });
  } catch (error) {
      res.status(400);
      throw new Error("Information invalide");
  };

  res.json({message: "Votre E-mail a été vérifiée"});

});

//@desc     Resend email Verifcation
//@route    POST /api/users/resend-email-verification
//@access   Private
const resendEmailValidation = asyncHandler (async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user){
    res.status(404);
    throw new Error("Aucun utilisateur trouvé avec les informations qui ont été fournies.");
  };

  if (user.isVerified){
    res.status(404);
    throw new Error("L'utilisateur est déjà vérifié");
  };

  const alreadyHasToken = await EmailVerifToken.findOne({
    owner: userId,
  });

  if (alreadyHasToken){
    res.status(400);
    throw new Error("Veiller réessayé après une heure, merci");
  };

  //Generate 6 OTP digit
  let OTP = generateOTP();

  // Store OTP in DB
  const newEmailVerificationToken = new EmailVerifToken({
    owner: user._id, 
    token: OTP
  });

  await newEmailVerificationToken.save();

  //Send the OTP to the user
  const message = `<p>Voici le code de vrification de votre email</p>: <h1>${OTP}</h1>` //I need to change the content of this message
  try {
    await sendEmail({
      email: user.email,
      subject: "Renvoyer code de vérification",
      message
    });
    res.status(200).json({
      success: true,
      data: "Un code de vérification vous a été envoyé à votre adresse e-mail"
    });
  } catch (error) {
      res.status(400);
      throw new Error("Code est invalide");
  }
  res.status(200).json({message: "Une nouveau code de vérification vous a été envoyé à votre adresse email"})
});

//@desc     Logout / Clear the cookie
//@route    POST /api/auth/logout
//@access   Private
const logout = asyncHandler(async(req, res)=>{
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Déconnecté avec succès' });
});

// @desc      Forgot password
// @route     POST /api/auth/forgotpassword
// @access    Public
const forgotPassword = asyncHandler(async(req, res) => {
  const user = await User.findOne({email: req.body.email});

  if(!user){
      res.status(404);
      throw new Error("There is no user with that email");
  };

  //Get reset token 
  const resetToken = user.getResetTokenPassword();
  console.log(resetToken); 

  await user.save({validateBeforeSave: false});

  //Create reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


  const message = getResetPasswordTemplate(user?.name, resetUrl);
           
  //Sending Email
  try {
      await sendEmail({
          email: user.email,
          subject: 'Password reset token',
          message
      });

      res.status(200).json({
          success: true,
          data: "Email sent"
      });
  } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined,
      user.resetPasswordExpire = undefined

      await user.save({validateBeforeSave: false});

      res.status(500);
      throw new Error("Email could not be sent")
  };
});

// @desc      Reset password
// @route     PUT /api/users/resetpassword/:token
// @access    Public
const  resetpassword = asyncHandler(async(req, res) => {
  //Get hashed token
  const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

  //Find the user by token only if the expiration is greatter than right now
  const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()} //Expiry is greatter than right now
  });


  if(!user){
      res.status(400);
      throw new Error("Invalid Token")
  };

  //If we find the user & the token is not expired, then set new Password 
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  console.log( user.password)

  await user.save();

  generateToken(res, user._id);

  res.status(200).json({
      _id: user._id,
      email: user.email,
      password: user.password
  });
});



export {
    register,
    validateEmailVerif,
    resendEmailValidation,
    login,
    logout,
    forgotPassword,
    resetpassword,
};
