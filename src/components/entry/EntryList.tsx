import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../reduxconfig/store";
import { setError } from "../../reduxconfig/store";
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { EntryData } from "./Entry";
import "./EntryList.css";

const EntryList: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null); 
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    fetchDataFromFirebase();
    setAnimate(true);
  }, []);

  const fetchDataFromFirebase = async () => {
    try {
      setError(""); 
      const db = getFirestore();
      const q = query(collection(db, "entry"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const entriesData: EntryData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateString = new Date(data.date).toDateString();
        entriesData.push({ id: doc.id, date: dateString, title: data.title, thought: data.thought });
      });
      

      entriesData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setEntries(entriesData);
    } catch (error: any) {
      setError(error.message); 
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      setDeletingId(id); 
      const db = getFirestore();
      await deleteDoc(doc(db, "entry", id));
      setEntries(entries.filter(entry => entry.id !== id));
      setDeletingId(null); 
    } catch (error: any) {
      setError(error.message); 
    }
  };

  return (
    <div className={`entry-list-container ${animate ? "slide-in" : ""}`}>
      <div className="header-container">
        <h2 className="e-li-h1">My Entries</h2>
        <button className="add-entry-button">
          <Link to="/entries" className="add-entry-link">Add an Entry</Link>
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="no-entries-message">We know you have a lot of thoughts on your mind, start writing them down now...</p>
      ) : (
        <ul className="e-li-ul">
          {entries.map((entry, index) => (
            <li key={index} className={`entry-item ${deletingId === entry.id ? "deleting" : ""}`}>
              <div className="entry-content">
                <Link to={`/entry/${entry.id}`} className="entry-link">
                  <p className="entry-date"> {entry.date}</p>
                  <p className="entry-title">{entry.title}</p>
                </Link>
              </div>
              <button className="entry-delete" onClick={() => handleDeleteEntry(entry.id)}>
                <span className="s-del">Delete</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntryList;
