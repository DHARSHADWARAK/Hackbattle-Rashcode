import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true); 
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Toggle between Sign Up and Sign In forms
  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  // Simple validation for sign-up
  const validateSignUp = (email, password, confirmPassword) => {
    let errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  // Handle Sign Up
  const handleSignUp = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    const errors = validateSignUp(email, password, confirmPassword);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // TODO: Make API call to your backend for sign-up
      // For now, just navigate to home or do whatever you need
      navigate("/");
    }
  };

  // Handle Sign In
  const handleSignIn = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // TODO: Make API call to your backend for sign-in
      navigate("/");
    }
  };

  // Google OAuth handler
  const handleGoogleAuth = () => {
    // Adjust this URL if your backend runs on a different port or path
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-h-screen bg-neutral-800 flex items-center justify-center">
      <div className="relative w-[800px] h-[500px] shadow-2xl rounded-lg overflow-hidden">

        -------- SIGN UP FORM --------
        <div
          className={`absolute w-[400px] h-full top-0 transition-transform duration-700 ease-in-out z-20 ${
            isSignUp ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-10 flex flex-col justify-center h-full bg-white">
            <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSignUp}>
              {/* <input
                type="email"
                name="email"
                placeholder="Email"
                className="px-4 py-2 bg-gray-200 rounded-md focus:outline-none"
              />
              {formErrors.email && (
                <span className="text-red-500">{formErrors.email}</span>
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="px-4 py-2 bg-gray-200 rounded-md focus:outline-none"
              />
              {formErrors.password && (
                <span className="text-red-500">{formErrors.password}</span>
              )}
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="px-4 py-2 bg-gray-200 rounded-md focus:outline-none"
              />
              {formErrors.confirmPassword && (
                <span className="text-red-500">{formErrors.confirmPassword}</span>
              )} */}

              {/* Sign Up button */}
              {/* <button
                type="submit"
                className="relative overflow-hidden px-4 py-2 bg-black hover:text-black text-white rounded-md border-2 border-transparent hover:border-gray-600 transition-colors group"
              >
                <span
                  className="absolute inset-0 w-0 h-0 bg-white  transition-all duration-300 ease-out group-hover:w-full group-hover:h-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></span>
                <span className="relative z-10">Sign Up</span>
              </button> */}

              {/* Sign Up with Google button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="relative overflow-hidden px-4 py-2 bg-black hover:text-black text-white rounded-md border-2 border-transparent hover:border-gray-600 transition-colors group"
              >
                <span
                  className="absolute inset-0 w-0 h-0 bg-white  transition-all duration-300 ease-out group-hover:w-full group-hover:h-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></span>
                <span className="relative z-10">Sign Up with google</span>
              </button>
            </form>
          </div>
        </div>

        {/* -------- SIGN IN FORM -------- */}
        <div
          className={`absolute w-[400px] h-full top-0 right-0 transition-transform duration-700 ease-in-out bg-black text-white z-20 ${
            isSignUp ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="p-10 flex flex-col justify-center h-full">
            <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSignIn}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="px-4 py-2 bg-gray-700 rounded-md focus:outline-none"
              />
              {formErrors.email && (
                <span className="text-red-500">{formErrors.email}</span>
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="px-4 py-2 bg-gray-700 rounded-md focus:outline-none"
              />
              {formErrors.password && (
                <span className="text-red-500">{formErrors.password}</span>
              )}

              {/* Sign In button */}
              <button
                type="submit"
                className="relative overflow-hidden px-4 py-2 bg-white hover:text-white text-black rounded-md border-2 border-transparent hover:border-gray-600 transition-colors group"
              >
                <span
                  className="absolute inset-0 w-0 h-0 bg-black transition-all duration-300 ease-out group-hover:w-full group-hover:h-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></span>
                <span className="relative z-10">Sign In</span>
              </button>

              {/* Sign In with Google button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign In with Google
              </button>
            </form>
          </div>
        </div>

        {/* -------- OVERLAY SECTION -------- */}
        <div className="absolute hidden inset-0 w-full h-full md:flex z-10">
          <div
            className={`absolute w-[400px] h-full bg-gradient-to-r from-white to-black flex flex-col justify-center items-center transition-all duration-700 ease-in-out ${
              isSignUp ? "left-[400px] text-black" : "left-0 text-white"
            }`}
          >
            <h2 className="text-3xl font-bold mb-4">
              {isSignUp ? "Hello, Friend!" : "Welcome Back!"}
            </h2>
            {/* <p className="mb-6">
              {isSignUp
                ? "Already have an account? Sign in instead!"
                : "Don't have an account yet? Sign up now!"}
            </p> */}
            {/* <button
              onClick={toggleForm}
              className={`relative overflow-hidden px-6 py-2 bg-transparent border-2 rounded-md transition-colors text-black group ${
                isSignUp ? "border-black text-black" : "border-white text-white"
              }`}
            >
              <span
                className={`absolute inset-0 transform scale-0 transition-transform duration-300 ease-out group-hover:scale-100 ${
                  isSignUp ? "bg-white" : "bg-black"
                }`}
              ></span>
              <span
                className={`relative z-10 ${
                  isSignUp ? " text-black" : "text-white"
                }`}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
