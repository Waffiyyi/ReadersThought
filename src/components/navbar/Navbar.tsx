import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import "./Navbar.css";
import { selectUser } from "../../reduxconfig/store";

function Navbar() {
  const user = useSelector(selectUser);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={'/entries'} className="navbar-brand">ReadersThought</Link>
        <div className="navbar-links">
          {user ? <SignedInLinks /> : <SignedOutLinks />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
