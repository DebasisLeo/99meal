import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
import { AuthContext } from "../../providers/AuthProvider";

const SignUp = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then((result) => {
        console.log("User created:", result.user);

        updateUserProfile(data.name, data.photoURL)
          .then(() => {
            const userInfo = {
              name: data.name,
              email: data.email,
              photoURL: data.photoURL,
              
            };

            
            fetch("http://localhost:8000/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userInfo),
            })
              .then((res) => res.json())
              .then((result) => {
                if (result.insertedId) {
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "User created successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                  });
              
                  reset();
                  navigate("/");
              }
              });
          });
      })
      .catch((error) => {
        console.log("Signup error:", error);
      });
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">

        
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign Up Now!</h1>
          <p className="py-6">Join our community and explore our amazing food offerings.</p>
        </div>

        
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body space-y-4">

            
            <div className="form-control">
              <label className="label"><FaUser className="mr-2" /> Name</label>
              <input type="text" {...register("name", { required: true })}
                className="input input-bordered" placeholder="Enter your name" />
              {errors.name && <p className="text-red-600">Name is required</p>}
            </div>

           
            <div className="form-control">
              <label className="label"><FaImage className="mr-2" /> Photo URL</label>
              <input type="text" {...register("photoURL", { required: true })}
                className="input input-bordered" placeholder="Profile photo URL" />
              {errors.photoURL && <p className="text-red-600">Photo URL is required</p>}
            </div>

            
            <div className="form-control">
              <label className="label"><FaEnvelope className="mr-2" /> Email</label>
              <input type="email" {...register("email", { required: true })}
                className="input input-bordered" placeholder="Enter your email" />
              {errors.email && <p className="text-red-600">Email is required</p>}
            </div>

           
            <div className="form-control">
              <label className="label"><FaLock className="mr-2" /> Password</label>
              <input
                type="password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  maxLength: 20,
                  pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/
                })}
                className="input input-bordered"
                placeholder="Enter your password"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-600">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-600">Minimum 6 characters</p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-600">
                  Must include uppercase, lowercase, number & special character
                </p>
              )}
            </div>

            
            <div className="form-control mt-4">
              <input type="submit" value="Sign Up" className="btn btn-primary w-full" />
            </div>

          </form>

          <p className="px-6 pb-4">
            <small>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">Login</Link>
            </small>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
