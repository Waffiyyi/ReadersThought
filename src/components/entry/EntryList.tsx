import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../reduxconfig/store";
import { setError } from "../../reduxconfig/store";
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { EntryData } from "./Entry";

const EntryList: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("user", user)

  useEffect(() => {
    if(user){
    fetchDataFromFirebase();
    }
    setAnimate(true);
  }, [user]);

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

      entriesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setEntries(entriesData);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
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
      <div className={`container mx-auto py-10 px-5 bg-gray-900 text-white h-screen overflow-hidden transition-all duration-500 ease-in-out ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-cyan-500">My Entries</h2>
          <Link to="/entries">
            <button className="bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition duration-300">
              Add an Entry
            </button>
          </Link>
        </div>

        {/* Loading Screen */}
        {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <svg
                    className="animate-spin h-10 w-10 text-cyan-500 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                  <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                  ></circle>
                  <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-cyan-400 mt-4">Loading your entries...</p>
              </div>
            </div>
        ) : (
            <>
              {entries.length === 0 ? (
                  <p className="text-center text-gray-400 text-lg">
                    We know you have a lot of thoughts on your mind, start writing them down now...
                  </p>
              ) : (
                  <div className="max-h-[60vh] overflow-y-auto">
                    <ul className="space-y-4">
                      {entries.map((entry, index) => (
                          <li
                              key={index}
                              className={`flex justify-between items-center bg-gray-800 rounded-lg p-4 transition duration-300 ease-in-out ${
                                  deletingId === entry.id ? "opacity-50" : "hover:bg-gray-700"
                              }`}
                          >
                            <Link to={`/entry/${entry.id}`} className="flex flex-col w-full">
                              <p className="text-sm text-gray-400">{entry.date}</p>
                              <p className="text-lg font-medium text-cyan-300">{entry.title}</p>
                            </Link>
                            <button
                                className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-500 transition duration-300"
                                onClick={() => handleDeleteEntry(entry.id)}
                                disabled={deletingId === entry.id}
                            >
                              {deletingId === entry.id ? "Deleting..." : "Delete"}
                            </button>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </>
        )}
      </div>
  );
};

export default EntryList;