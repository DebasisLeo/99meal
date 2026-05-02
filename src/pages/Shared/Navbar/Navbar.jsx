import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaShoppingCart, FaHome, FaUtensils, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { motion } from "framer-motion";
import useCart from "../../../hooks/useCart";
import useAdmin from "../../../hooks/useAdmin";

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isAdmin] = useAdmin();
  const [cart] = useCart();

  const handleLogOut = () => {
    logOut()
      .then(() => { })
      .catch(error => console.log(error));
  }

  const navOptions = <>
    <li>
      <Link to="/" className="flex items-center">
        <FaHome className="mr-2" /> Home
      </Link>
    </li>
    <li>
      <Link to="/menu" className="flex items-center">
        <FaUtensils className="mr-2" /> Our Menu
      </Link>
    </li>
    <li>
      <Link to="/order/salad" className="flex items-center">
        <FaUtensils className="mr-2" /> Order Food
      </Link>
    </li>
    {
      user && isAdmin && <li><Link to="/dashboard/adminHome" className="flex items-center">
        <FaHome className="mr-2" /> Admin Dashboard
      </Link></li>
    }
    {
      user && !isAdmin && <li><Link to="/dashboard/userHome" className="flex items-center">
        <FaHome className="mr-2" /> User Dashboard
      </Link></li>
    }
    <li>
      <Link to="/dashboard/cart" className="flex items-center">
        <button className="btn flex items-center">
          <FaShoppingCart className="mr-2 text-xl" />
          <div className="badge badge-secondary">{cart.length}</div>
        </button>
      </Link>
    </li>
    {
      user ? <>
        <motion.button
          onClick={handleLogOut}
          className="btn btn-ghost flex items-center"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <FaSignOutAlt className="mr-2" /> LogOut
        </motion.button>
      </> : <>
        <li><Link to="/login" className="flex items-center">
          <FaSignInAlt className="mr-2" /> Login
        </Link></li>
      </>
    }
  </>

  return (
    <motion.div
      className="navbar fixed z-10 bg-opacity-30 max-w-screen-xl bg-black text-white shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            {navOptions}
          </ul>
        </div>
        <motion.a
          className="btn btn-ghost normal-case text-xl"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Culinary Crave
        </motion.a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navOptions}
        </ul>
      </div>

      <div className="navbar-end">
        <motion.a
          className="btn"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Get started
        </motion.a>
      </div>
    </motion.div>
  );
};

export default NavBar;