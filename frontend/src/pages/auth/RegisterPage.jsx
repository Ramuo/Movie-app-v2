import {useState, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import {useRegisterMutation} from "../../slices/userApiSlice";
import {setCredentials} from "../../slices/authSlice";

const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [register, {isLoading}] = useRegisterMutation();

    const {userInfo} = useSelector((state) => state.auth);


    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect' || '/')

    useEffect(() => {
        if(userInfo){
            navigate('/email-verification')
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Les mots de passe ne correspondent pas")
        }else{
            try {
              const res = await register({ name, email, password }).unwrap();
              dispatch(setCredentials({ ...res }));
              navigate('/email-verification');
            } catch (err) {
              toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <main className="container mx-auto hero">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left hidden md:block">
                    <h1 className="text-5xl font-bold">Divertissement</h1>
                    <p className="py-6">Regardez n'importe quel film ou émission de télévision n'importe où, n'importe quand. Profitez du dernier succès hollywoodien, d'un classique du cinéma ou d'une émission TV (notamment les films et épisodes en 3D, HD et SD).</p>
                </div>
                <div className="card shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                    <form
                    onSubmit={submitHandler} 
                    className="card-body"
                    >
                        <div className="form-control">
                            <label className="label">
                                <span className="text-xl">Nom</span>
                            </label>
                            <input 
                            type="text" 
                            className="input input-bordered" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="text-xl">Email</span>
                            </label>
                            <input 
                            type="email" 
                            className="input input-bordered" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="text-xl">Mot de passe</span>
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
                                <span className="text-xl">Confirmer mot de passe</span>
                            </label>
                            <input 
                            type="password" 
                            className="input input-bordered" 
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <label className="label">
                                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-sm"> Vous avez déjà un compte? <span className='text-primary link link-hover'> Se connecter</span> </Link>
                            </label>
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
        </main>
    )
}

export default RegisterPage