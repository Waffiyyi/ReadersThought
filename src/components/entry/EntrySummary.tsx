import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxconfig/store";
import { setError, clearError } from "../../reduxconfig/store";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./EntrySummary.css";

const EntrySummary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [entry, setEntry] = useState<any>(null);
  const error = useSelector((state: RootState) => state.auth.error);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      dispatch(clearError());
      const db = getFirestore();
      if (!id) {
        dispatch(setError("Entry ID not provided"));
        return;
      }
      const entryRef = doc(db, "entry", id);
      const docSnap = await getDoc(entryRef);
      if (docSnap.exists()) {
        setEntry(docSnap.data());
      } else {
        dispatch(setError("Entry not found"));
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  return (
    <div className="entry-summary-container">
      {error && <p className="error">Error: {error}</p>}
      {entry && (
        <div className="entry-details">
          <div className="details-header">
            <button className="add-entry-button">
              <Link to="/entrylist" className="back-link">&#60;</Link>
            </button>
            <p className="date">{new Date(entry.date).toDateString()}</p>
          </div>
          <p className="title"><strong>{entry.title}</strong></p>
          <p className="thought">{entry.thought}</p>
          <div className="image-grid">
            {entry.imageURLs &&
              entry.imageURLs.map((imageURL: string, index: number) => (
                <img
                  key={index}
                  src={imageURL}
                  alt={`Image ${index}`}
                  className="image"
                />
              ))}
          </div>
          <div className="edit-button-container">
            <Link to={`/edit/${id}`} className="edit-link">
              <button className="edit-button">
                <span role="img" aria-label="Edit">✏️</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrySummary;

















