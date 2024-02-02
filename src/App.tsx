import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Entry from "./components/entry/Entry";
import EntryList from "./components/entry/EntryList";
import EntrySummary from "./components/entry/EntrySummary";
import EditEntry from "./components/entry/EditEntry"; 
import PrivateRoute from "./components/PrivateRoute";


function App() {
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
