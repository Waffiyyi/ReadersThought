import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Navbar from "./components/navbar/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Entry from "./components/entry/Entry";
import EntryList from "./components/entry/EntryList";
import EntrySummary from "./components/entry/EntrySummary";
import EditEntry from "./components/entry/EditEntry"; 
import PrivateRoute from "./components/PrivateRoute";
import {useEffect} from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { setUserAuth, clearUser } from './reduxconfig/store';
import { useDispatch } from 'react-redux';



function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                dispatch(
                    setUserAuth({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                    })
                );
            } else {
                dispatch(clearUser());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route element={<PrivateRoute/>} >
           
            <Route path="/entrylist" element={<EntryList />} />
            <Route path="/entries" element={<Entry />} />
            <Route path="/entry/:id" element={<EntrySummary />} />            
            <Route path="/edit/:id" element={<EditEntry />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
