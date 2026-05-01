import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../providers/AuthProvider';
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import useCart from '../../../hooks/useCart';
import useAdmin from '../../../hooks/useAdmin';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [cart] = useCart();
    const [isAdmin] = useAdmin();
    

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error));
    };

    const navOptions = (
        <>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/menu'>Our Menu</Link></li>
            <li><Link to='/order/salad'>Our Orders</Link></li>
            <li>
            <Link 
                to={isAdmin ? "/dashboard/allusers" : "/dashboard/cart"} 
                className="flex items-center"
            >
                <FaShoppingCart className="mr-2 text-xl" />
                <span className="badge badge-secondary">+{cart.length}</span>
            </Link>
            </li>
        </>
    );

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-base-100 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="navbar py-2">

                   
                    <div className="navbar-start">
                        <div className="dropdown lg:hidden">
                            <label tabIndex={0} className="btn btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </label>

                            <ul tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                {navOptions}
                                {user ? (
                                    <>
                                        <li className="mt-2 font-medium">{user.displayName}</li>
                                        <li><button onClick={handleLogOut}>Logout</button></li>
                                    </>
                                ) : (
                                    <li><Link to="/login">Login</Link></li>
                                )}
                            </ul>
                        </div>

                        <Link to='/' className="text-2xl font-bold">Rassporium</Link>
                    </div>

                    

                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal gap-4">
                            {navOptions}
                        </ul>
                    </div>

                  
                    <div className="navbar-end">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
                                        <img
                                            src={user?.photoURL || '/public/banners/01.jpg'}
                                            alt="Profile"
                                            title={user.displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </label>

                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                    <li className="font-bold text-center py-2">{user.displayName}</li>
                                    <li><Link to="/dashboard">Dashboard</Link></li>
                                    <li>
                                        <button
                                            onClick={handleLogOut}
                                            className="flex items-center gap-2"
                                        >
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>

                        ) : (
                            <Link to="/login" className="btn btn-outline">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
