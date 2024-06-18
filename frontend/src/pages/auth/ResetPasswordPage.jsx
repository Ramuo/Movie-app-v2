import {useState, useEffect}from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import {useResetpasswordMutation} from "../../slices/userApiSlice"

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const {token} = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [resetPassword, { isLoading}] =useResetpasswordMutation(token);

    const {userInfo} = useSelector((state) => state.auth);

    useEffect(() => {
        if(userInfo){
            navigate('/')
        };
    }, [navigate,  userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
          return toast.error("Le mot de passe ne correspond pas. Reessayer à nouveau!");
        }else{
            try {
                await resetPassword({token, password}).unwrap();
                toast.success("Votre mot de passe a été réinitialisé avec succèss.")
                navigate("/login");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="flex items-center justify-center">  
            <div className="card shrink-0 w-full max-w-lg shadow-2xl">
                <form
                onSubmit={submitHandler} 
                className="card-body"
                >
                    <h1 className='text-2xl font-semibold mb-4 '>Réinitialiser votre mot de passe</h1>
                    <div className="form-control">
                        <label className="label">
                        <span className="text-lg">Nouveau mot de passe</span>
                        </label>
                        <input 
                        type="password" 
                        className="input input-bordered" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                        <span className="text-lg">Confirmer mot de passe</span>
                        </label>
                        <input 
                        type="password" 
                        className="input input-bordered" required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary text-white">
                            {isLoading ? (
                                <span className="loading loading-dots loading-lg"></span>
                            ) : (
                                'Réinitialiser'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordPage