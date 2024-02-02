import React, { useState} from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useDispatch } from "react-redux";
import { setError, setUserAuth } from "../../reduxconfig/store";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        const { uid, email, displayName } = userCredential.user;
        dispatch(
          setUserAuth({
            uid,
            email,
            displayName
          })
        );
        navigate("/entrylist");
      })
      .catch((error) => {
        alert("Invalid email or password");
        dispatch(setError(error.message));
      })
      .finally(() => setLoading(false)); 
  };

  return (
    <div className={`signin-container ${loading ? 'loading' : ''}`}>
      <form onSubmit={handleSubmit} className="signin-form">
        <h5 className="signin-title">Sign In</h5>
        <div className="signin-input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="signin-input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <div className="signin-button">
          <button type="submit" disabled={loading}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;