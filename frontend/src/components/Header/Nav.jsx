import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import Logo from "../../assets/images/logo.png";

import {logout} from "../../slices/authSlice";
import {useLogoutMutation} from "../../slices/userApiSlice";

const Nav = () => {
  const {userInfo} = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <nav className="bg-gray-800 mb-6">
        <div className="container mx-auto py-4">
            <div className="flex justify-between items-center">
              <Link to="/">
                <img src={Logo } alt="logo" className='h-10' />
              </Link>
                <ul className='flex items-center space-x-4'>
                    <input 
                    type="text" 
                    className='border-2 border-gray-400 p-1 bg-transparent text-lg rounded-md outline-none focus:border-white transition text-white' 
                    placeholder='Rechercher...'
                    />
                     {userInfo ? (
                      <li className='text-white font-semibold text-lg'onClick={logoutHandler} >
                          <Link>
                            Déconnection
                          </Link>
                      </li>
                    ) : (
                      <li className='text-white font-semibold text-lg'>
                          <Link to="/login">
                            Connexion
                          </Link>
                      </li>
                    )}
                </ul>
            </div>
            
        </div>
    </nav>
   
  )
}

export default Nav