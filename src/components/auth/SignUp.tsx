import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useDispatch } from "react-redux";
import { setError, setUserAuth } from "../../reduxconfig/store";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); 


  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 

    if (!email || !password || !firstName || !lastName) {
      alert("All fields must be filled");
      setLoading(false); 
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const { uid, email, displayName } = userCredential.user;
        dispatch(
          setUserAuth({
            uid,
            email,
            displayName
          })
        );
        navigate('/entrylist')
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("Email already in use");
        } else {
          alert("An error occurred");
        }
        dispatch(setError(error.message));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={`signup-container ${loading ? 'loading' : ''}`}>
      <form onSubmit={handleSubmit} className="signup-form">
        <h5 className="signup-title">Sign Up</h5>
        <div className="signup-input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="signup-input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="signup-input">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="signup-input">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="signup-button">
          <button type="submit" disabled={loading}>Signup</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

