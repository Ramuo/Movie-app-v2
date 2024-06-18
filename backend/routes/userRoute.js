import express from 'express';
import {
    register,
    validateEmailVerif,
    resendEmailValidation,
    login,
    logout,
    forgotPassword,
    resetpassword,
} from '../controllers/userController.js';
import {protect, admin} from '../middleware/authMiddleware.js';
import checkObjectId from "../middleware/checkObjectId.js"

const router = express.Router();


router.route('/login').post(login);
router.route('/register').post(register);
router.route('/email-verification').post(validateEmailVerif);
router.route('/resend-email-verification').post(resendEmailValidation);
router.route('/logout').post(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").put(resetpassword);


export default router;