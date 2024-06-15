import crypto from "crypto";
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            // type: String,
            public_id: String,
            url: String,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

//TO AUTHENTICATE USER PSW
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//TO CRYPT PSW
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    };

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Generate and hash password Token
userSchema.methods.getResetTokenPassword = function (){
    //Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    //Hash token and set it to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    
    //Set token expiry
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 10mn
  
    return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;