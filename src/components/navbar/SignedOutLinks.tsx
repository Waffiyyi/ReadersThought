import { NavLink } from "react-router-dom";
import "./Navbar.css"

function SignedOutLinks(){
    return(
        <ul className="signed-out-links">
            <li><NavLink to={'/signup'} className="nav-link">Signup</NavLink></li>
            <li><NavLink to={'/'} className="nav-link">Login</NavLink></li> 
        </ul>
    );
}

export default SignedOutLinks;