import mongoose from "mongoose";
import bcrypt from 'bcryptjs';


const emailVerifTokenSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        expires: 3600,
        default: Date.now()
    }
});

//TO CRYPT Token
emailVerifTokenSchema .pre('save', async function(next){
    if(!this.isModified('token')){
        next();
    };

    const salt = await bcrypt.genSalt(10);
    this.token = await bcrypt.hash(this.token, salt);
});

//To compare Token
emailVerifTokenSchema .methods.compaireToken = async function(token){
    const result = await bcrypt.compare(token, this.token);
    return result;
}


const EmailVerifToken = mongoose.model("EmailVerifToken", emailVerifTokenSchema );
export default EmailVerifToken;