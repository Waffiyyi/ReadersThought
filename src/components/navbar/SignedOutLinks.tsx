import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

function SignedOutLinks() {
    return (
        <motion.ul
            className="flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <li>
                <NavLink
                    to={'/signup'}
                    className="text-cyan-400 font-semibold hover:text-cyan-300 transition duration-300"
                >
                    Signup
                </NavLink>
            </li>
            <li>
                <NavLink
                    to={'/'}
                    className="text-cyan-400 font-semibold hover:text-cyan-300 transition duration-300"
                >
                    Login
                </NavLink>
            </li>
        </motion.ul>
    );
}

export default SignedOutLinks;