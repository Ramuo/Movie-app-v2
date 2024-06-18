import {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import {useForgotpasswordMutation} from "../../slices/userApiSlice";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const [email, setEmail ] = useState("");

    const {userInfo} = useSelector((state) => state.auth);

    const [forgotpassword, {isLoading}] = useForgotpasswordMutation(); 

    useEffect(() => {
        if(userInfo){
            navigate('/')
        }
    }, [navigate,  userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await forgotpassword({ email}).unwrap();
            toast.success("Veiller vérifier votre adresse email");
            navigate('/');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="flex items-center justify-center">  
            <div className="card shrink-0 w-full max-w-lg shadow-2xl">
                <form 
                className="card-body"
                onSubmit={ submitHandler}
                >
                    <h1 className='text-2xl font-semibold mb-4 '>Vous avez oublié votre mot de passe? </h1>
                    <div className="form-control">
                        <label className="email">
                        <span className="text-lg">Veiller entrer votre adresse e-mail</span>
                        </label>
                        <input 
                        type="email" 
                        className="input input-bordered" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary text-white">
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

export default ForgotPasswordPage;