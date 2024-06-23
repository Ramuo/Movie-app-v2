import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';


import { useLoginMutation } from '../../slices/userApiSlice';
import { setCredentials } from '../../slices/authSlice';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [login, { isLoading }] = useLoginMutation();
  
    const { userInfo } = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect' || '/');

    useEffect(() => {
        if (userInfo) {
          navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          const res = await login({ email, password }).unwrap();
          dispatch(setCredentials({ ...res }));
          navigate("/");
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
    };



    return (
        <main className="container mx-auto hero">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left hidden md:block">
                    <h1 className="text-5xl font-bold">Le divertissement sur demande</h1>
                    <p className="py-6">Profitez du dernier succès hollywoodien, d'un classique du cinéma ou d'une émission TV (notamment les films et épisodes en 3D, HD et SD). Un film loué est disponible 30 jours après l'achat et peut être regardé plusieurs fois sur le même périphérique.</p>
                </div>
                <div className="card shrink-0 w-full max-w-lg shadow-2xl ">
                    <form 
                    onSubmit={submitHandler}
                    className="card-body">
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
                            <label className="label">
                                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}  className="text-sm"> Vous n'avez pas de compte? <span className='text-primary link link-hover'> S'inscrire</span> </Link>
                                <Link to="/forgot-password" className="text-primary  link link-hover">Mot de passe oublié?</Link>
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


export default LoginPage;