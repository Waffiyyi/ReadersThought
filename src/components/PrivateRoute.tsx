import {  Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebaseConfig"; 


const PrivateRoute = () => {
  const user = auth.currentUser;
  const isAuthenticated = !!user;
  
  return (
  
    isAuthenticated != true ? <Navigate to="/" replace /> : <Outlet/>
  
  );
};

export default PrivateRoute;