const AuthPage = () => {
    const handleGoogleSignIn = () => {
      window.location.href = "http://localhost:5000/auth/google";
    };
  
    return (
      <div>
        <h2>Sign In</h2>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </div>
    );
  };
  
  export default AuthPage;
  