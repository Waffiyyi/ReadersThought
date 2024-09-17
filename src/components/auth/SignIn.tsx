import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useDispatch } from "react-redux";
import { setError, setUserAuth } from "../../reduxconfig/store";
import { useNavigate } from "react-router-dom";

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
                const { uid, email, displayName } = userCredential.user;
                dispatch(
                    setUserAuth({
                        uid,
                        email,
                        displayName,
                    })
                );
                navigate("/entrylist");
            })
            .catch((error) => {
                dispatch(setError(error.message));
                alert(error.message);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-8 rounded-lg max-w-md w-full space-y-6"
            >
                <h5 className="text-white text-2xl font-bold sm:text-xl">Sign In</h5>
                <div>
                    <label htmlFor="email" className="block text-gray-400">
                        Email
                    </label>
                    <input
                        type="email"
                        className="mt-1 p-2 w-full bg-gray-700 text-white rounded-md focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-400">
                        Password
                    </label>
                    <input
                        type="password"
                        className="mt-1 p-2 w-full bg-gray-700 text-white rounded-md focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full p-2 text-white bg-blue-600 rounded-md ${
                        loading ? "opacity-50" : ""
                    }`}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default SignIn;