import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxconfig/store";
import { setError, clearError } from "../../reduxconfig/store";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import ImageUploader from "./ImageUploader";
import { EntryData } from "./Entry";
import { useNavigate, useParams } from "react-router-dom";
import "./EditEntry.css";

const EditEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<EntryData>({
    date: "",
    title: "",
    thought: "",
    imageURLs: [],
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 
  const error = useSelector((state: RootState) => state.auth.error);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      dispatch(clearError());
      const db = getFirestore();
      const entryRef = doc(db, "entry", id);
      const docSnap = await getDoc(entryRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data) {
         
          if (data.userId === user.uid) {
            setEntry(data as EntryData);
          } else {
            dispatch(setError("You are not authorized to edit this entry"));
          }
        }
      } else {
        dispatch(setError("Entry not found"));
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const handleImageSelect = (imageFiles: File[]) => {
    setSelectedImages(imageFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(clearError());
      if (!entry.date || !entry.title) {
        alert("Date and title can't be null");
        return;
      }
      setLoading(true); 
      await updateEntry();
      navigate(`/entry/${id}`);
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      setLoading(false); 
    }
  };

  const updateEntry = async () => {
    const db = getFirestore();
    const entryRef = doc(db, "entry", id);

    const updatedEntryData: EntryData = { ...entry };

    if (selectedImages.length > 0) {
      const storage = getStorage();
      const imageURLs = [];
      for (const image of selectedImages) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        const imageURL = await getDownloadURL(storageRef);
        imageURLs.push(imageURL);
      }
      updatedEntryData.imageURLs = imageURLs;
    }

    await updateDoc(entryRef, updatedEntryData);
  };

  const deleteImage = async (index: number) => {
    try {
      const imageURLToDelete = entry.imageURLs[index];
      const storage = getStorage();
      const imageRef = ref(storage, imageURLToDelete);
      await deleteObject(imageRef);

      const updatedImages = [...entry.imageURLs];
      updatedImages.splice(index, 1);

      const db = getFirestore();
      const entryRef = doc(db, "entry", id);
      await updateDoc(entryRef, { ...entry, imageURLs: updatedImages });

      setEntry({ ...entry, imageURLs: updatedImages });
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  return (
    <>
      <div>
       
        <form onSubmit={handleSubmit}>
          <div className="date-container">
          <button className="cancel-btn" onClick={() => navigate(`/entry/${id}`)}>
          &#60;
        </button>
            <input
              type="date"
              className="date-input"
              value={entry.date}
              onChange={(e) => setEntry({ ...entry, date: e.target.value })}
            />
          </div>
          <div className="title-container">
            <textarea
            placeholder="Title"
              className="title-input"
              value={entry.title}
              onChange={(e) => setEntry({ ...entry, title: e.target.value })}
            />
          </div>
          <div className="thought-container">
            <textarea
            placeholder="Thought"
              className="thought-input"
              value={entry.thought}
              onChange={(e) => setEntry({ ...entry, thought: e.target.value })}
            />
          </div>

          <div className="image-container">
            {entry.imageURLs &&
              entry.imageURLs.map((imageURL, index) => (
                <div key={index} className="image-item">
                  <img
                    src={imageURL}
                    alt={`Selected ${index + 1}`}
                    className="image"
                  />
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
          </div>
          {error && <p>Error: {error}</p>}
         
          <div className="button-container">
            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? (
                <div className="loading-bear-animation"></div>
              ) : (
                "Update"
              )}
            </button>
          </div>
          <div className="u-i-btn" >
            <ImageUploader onImageSelect={handleImageSelect} />
          </div>
         
        </form>
      </div>
    </>
  );
};

export default EditEntry;