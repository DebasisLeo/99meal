import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <div data-aos="zoom-in-up">
          <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Oops! Page Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the page you're looking for. It might have been moved or deleted.</p>

          <div data-aos="fade-up" className="mb-6">
            <img
              src="https://img.icons8.com/ios/452/404-error.png"
              alt="404 Illustration"
              className="w-40 mx-auto"
            />
          </div>

          <button
            onClick={goHome}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
