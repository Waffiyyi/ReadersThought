import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useDispatch } from "react-redux";
import { setError, setUserAuth } from "../../reduxconfig/store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion

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
                        displayName,
                    })
                );
                navigate("/entrylist");
            })
            .catch((error) => {
                alert("An error occurred");
                dispatch(setError(error.message));
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 overflow-hidden px-4">
            <motion.form
                onSubmit={handleSubmit}
                initial={{ x: "-100vw", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
                className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full space-y-6 sm:mx-2"
            >
                <h5 className="text-white text-2xl font-bold sm:text-xl">Sign Up</h5>
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
                <div>
                    <label htmlFor="firstname" className="block text-gray-400">
                        First Name
                    </label>
                    <input
                        type="text"
                        className="mt-1 p-2 w-full bg-gray-700 text-white rounded-md focus:outline-none"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                    />
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-gray-400">
                        Last Name
                    </label>
                    <input
                        type="text"
                        className="mt-1 p-2 w-full bg-gray-700 text-white rounded-md focus:outline-none"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full p-2 text-white bg-blue-600 rounded-md ${
                        loading ? "opacity-50" : ""
                    }`}
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </motion.form>
        </div>
    );
};

export default SignUp;