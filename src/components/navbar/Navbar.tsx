import { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import {clearUser, RootState} from "../../reduxconfig/store";
import { motion } from "framer-motion";
import { auth } from "../../firebaseConfig";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const profileInitial = user ? user.email.charAt(0).toUpperCase() : "NN";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                dispatch(clearUser());
                navigate("/");
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <motion.nav
            className="bg-gray-900 p-4 shadow-lg  w-full "
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto mb-0 flex justify-between items-center">
                <Link
                    to="/entrylist"
                    className="text-cyan-400 text-3xl font-bold hover:text-cyan-300 transition duration-300 sm:text-xl"
                >
                    ReadersThought
                </Link>

                <div className="sm:hidden">
                    <button onClick={toggleMenu} className="text-cyan-400 focus:outline-none mt-2">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>

                <div className="hidden sm:flex items-center space-x-4">
                    {user ? <SignedInLinks profileInitial={profileInitial} handleLogout={handleLogout} /> : <SignedOutLinks />}
                </div>
            </div>

            {menuOpen && (
                <motion.div
                    className="sm:hidden bg-gray-900 text-white py-2 px-4 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {user ? (
                        <SignedInLinks profileInitial={profileInitial} handleLogout={handleLogout} />
                    ) : (
                        <SignedOutLinks />
                    )}
                </motion.div>
            )}
        </motion.nav>
    );
 }

export default Navbar;