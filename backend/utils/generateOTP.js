

const generateOTP = (otp_length = 6) => {
    let OTP = '';
    for(let i = 1; i <= otp_length; i++){
      const randomVal = Math.round(Math.random() * 9);
      OTP += randomVal;
    }

    return OTP;
};

export default generateOTP;



// let OTP = '';
// for(let i = 0; i <= 5; i++){
//   const randomVal = Math.round(Math.random() * 9);
//   OTP += randomVal;
// }