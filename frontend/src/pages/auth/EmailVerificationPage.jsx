import {useState, useEffect, useRef}from 'react';
import {useLocation, useNavigate, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {toast} from 'react-toastify';



import {
    useEmailVerificationMutation,
} from "../../slices/userApiSlice";
import {setCredentials} from "../../slices/authSlice";



const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidOTP = (otp) => {
    let valid = false;
  
    for (let val of otp) {
      valid = !isNaN(parseInt(val));
      if (!valid) break;
    }
  
    return valid;
};


const EmailVerificationPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const {userInfo} = useSelector((state) => state.auth);
    

    const [emailVerification, {isLoading}] = useEmailVerificationMutation();

    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
    const [activeOtpIndex, setActiveOtpIndex] = useState(0); 

    const inputRef = useRef();

    const focusNextInputField = (index) => {
        setActiveOtpIndex(index + 1)
    };

    const focusPrevInputField = (index) => {
        let nextIndex;
        const diff = index - 1;
        nextIndex = diff !== 0 ? diff : 0;
        setActiveOtpIndex(nextIndex)
    };

    const handleOtpChange = ({ target }) => {
        const { value } = target;
        const newOtp = [...otp];
        newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);
    
        if (!value) focusPrevInputField(currentOTPIndex);
        else focusNextInputField(currentOTPIndex);
        setOtp([...newOtp]);
    };

    const handleKeyDown = ({ key }, index) => {
        currentOTPIndex = index;
        if (key === "Backspace") {
            focusPrevInputField(currentOTPIndex);
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOtpIndex]);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect' || '/');

    useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo]);

   
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!isValidOTP(otp)) {
           toast.error("Code de vérification invalide");
        }else{
            try {
                const res = await emailVerification({userId: userInfo._id, OTP: otp.join("")}).unwrap();
                dispatch(setCredentials({...res}))
                setTimeout(navigate, 0, "/");
                toast.success("Votre adresse e-mail a été verifiée avec succès.")
            } catch (err) {
                toast.error(err?.data?.message || err.error);
               
            }
        }
    }

    return (
        <div className="flex items-center justify-center">  
            <div className="card shrink-0 w-full max-w-lg shadow-2xl">
                <form 
                onSubmit={submitHandler}
                className="card-body"
                >
                    <h1 className='text-2xl text-center font-semibold mb-8 '>Entrer le code de vérification</h1>
                    <div className="form-control flex-row justify-center items-center space-x-4">
                        {otp.map((_, index) => {
                            return <input 
                            ref={activeOtpIndex === index ? inputRef : null}
                            key={index}
                            type='number'
                            value={otp[index] || ""}
                            onChange={handleOtpChange}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className='w-12 h-12 border-2 border-gray-500 rounded focus:border-white
                            bg-transparent outline-none text-center text-xl text-white text-semibold'
                            />
                        })}
                    </div>
                    <div className="form-control mt-6 flex items-center">
                        <button className="btn btn-primary text-white w-96 " type='submit'>
                            {isLoading ? (
                                <span className="loading loading-dots loading-lg"></span>
                            ) : (
                                "Envoyer"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EmailVerificationPage;