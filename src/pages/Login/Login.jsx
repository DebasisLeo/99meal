import React, { useContext, useEffect, useState } from 'react';
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha
} from 'react-simple-captcha';
import { AuthContext } from '../../providers/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const { signIn, resetPassword } = useContext(AuthContext);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then((result) => {
        const user = result.user;

        Swal.fire({
          title: "Login Successful!",
          text: "Welcome back!",
          icon: "success",
        });

        navigate(from, { replace: true });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
        });
      });
  };


  const handleForgetPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email",
      inputPlaceholder: "example@gmail.com",
      showCancelButton: true
    });

    if (email) {
      resetPassword(email)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Password Reset Email Sent!",
            text: "Please check your inbox.",
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: error.message,
          });
        });
    }
  };


  const handleValidateCaptcha = (e) => {
    const value = e.target.value;

    if (validateCaptcha(value)) {
      setDisabled(false);
      alert("Captcha Matched!");
    } else {
      setDisabled(true);
      alert("Captcha incorrect! Please try again.");
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">

        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
            quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleLogin} className="card-body">
            <fieldset className="fieldset">

              <label className="label">Email</label>
              <input type="email" name="email" className="input" placeholder="Email" required />

              <label className="label">Password</label>
              <input type="password" name="password" className="input" placeholder="Password" required />

              <div
                className="link link-hover text-blue-600 cursor-pointer"
                onClick={handleForgetPassword}
              >
                Forgot password?
              </div>

              <label className="label">
                <LoadCanvasTemplate />
              </label>

              <input
                onBlur={handleValidateCaptcha}
                type="text"
                name="captcha"
                className="input"
                placeholder="Type The Text Above"
              />

              <input
                disabled={disabled}
                type="submit"
                value="Login"
                className="btn btn-primary mt-4"
              />

            </fieldset>

            <p className="px-6">
              <small>
                New here? <Link to="/signup" className="text-blue-500">Create an account</Link>
              </small>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
