import {NavLink} from "react-router-dom";
import { motion } from "framer-motion";
interface SignedInLinksProps {
    profileInitial: string;
    handleLogout: () => void;
}

function SignedInLinks({ profileInitial, handleLogout }: SignedInLinksProps) {
    return (
        <motion.ul
            className="flex space-x-4 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <li>
                <NavLink
                    to={"/entrylist"}
                    className="bg-gray-700 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold"
                >
                    {profileInitial}
                </NavLink>
            </li>
            <li>
                <NavLink
                    to={"/entrylist"}
                    className="text-cyan-400 font-semibold hover:text-cyan-300 transition duration-300"
                >
                    MyThoughts
                </NavLink>
            </li>

            <li>
                <a
                    href="/"
                    className="text-cyan-400 font-semibold hover:text-cyan-300 transition duration-300"
                    onClick={handleLogout}
                >
                    LogOut
                </a>
            </li>
        </motion.ul>
    );
}
export default SignedInLinks;