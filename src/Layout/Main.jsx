import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../pages/Shared/Footer/Footer';
import Navbar from '../pages/Shared/Navbar/Navbar';

const Main = () => {
    const location=useLocation()
   const isLogin=location.pathname.includes('/login') || location.pathname.includes('/signup')
    return (
        <div>
            {isLogin || <Navbar></Navbar>}
            <main className={isLogin ? '' : 'pt-20'}>
                <Outlet></Outlet>
            </main>
            {isLogin || <Footer></Footer>}
        </div>
    );
};

export default Main;
