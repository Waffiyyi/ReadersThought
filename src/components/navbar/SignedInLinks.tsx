import { useSelector } from "react-redux";
import { selectUser } from "../../reduxconfig/store";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { useDispatch } from 'react-redux';
import { clearUser } from '../../reduxconfig/store';
import "./Navbar.css";

function SignedInLinks() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const profileInitial = user ? user.email.charAt(0).toUpperCase() : "NN";

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



    return (
        <ul className="signed-in-links">
            <li>
                <NavLink to={"/entrylist"} className="nav-link">
                    MyThoughts
                </NavLink>
            </li>
            <li>
                <a href="/" className="nav-link" onClick={handleLogout}> 
                    LogOut
                </a>
            </li>
            <li>
                <NavLink to={"/entrylist"} className="profile-avatar">
                    {profileInitial}
                </NavLink>
            </li>
        </ul>
    );
}

export default SignedInLinks;