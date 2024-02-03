import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError, clearError } from "../../reduxconfig/store";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ImageUploader from "./ImageUploader";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../reduxconfig/store";
import { v4 as uuidv4 } from 'uuid'; 
import "./Entry.css";

export interface EntryData {
  id: string;
  date: string;
  title: string;
  thought: string;
  imageURLs?: string[];
}

const Entry: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [date, setDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [thought, setThought] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleImageSelect = (imageFiles: File[]) => {
    setSelectedImages(imageFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(clearError());
    
      if (!date.trim() || !title.trim()) {
        alert("Date and title can't be null");
        return;
      }

      setLoading(true); 

      await saveDataToFirebase({
        id: uuidv4(), 
        date,
        title,
        thought,
        images: selectedImages,
        userId: user.uid 
      });

      setDate("");
      setTitle("");
      setThought("");
      setSelectedImages([]);

      navigate("/entrylist");
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      setLoading(false);
    }
  };

  const saveDataToFirebase = async ({
    id,
    date,
    title,
    thought,
    images,
    userId
  }: {
    id: string;
    date: string;
    title: string;
    thought: string;
    images: File[];
    userId: string;
  }) => {
    const db = getFirestore();
    const storage = getStorage();

    const entryData: EntryData = { id, date, title, thought };

    const imageURLs = [];

    for (const image of images) {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);

      const imageURL = await getDownloadURL(storageRef);
      imageURLs.push(imageURL);
    }

    entryData.imageURLs = imageURLs;

    await addDoc(collection(db, "entry"), { ...entryData, userId });
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <>
      <div className="input-container">
        <button onClick={() => navigate("/entrylist")} className="cancel-btn">
          &#60;
        </button>
        <input
          placeholder="Pick A Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        ></input>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title"></label>
            <textarea
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
              placeholder="Title"
            ></textarea>
          </div>
          <div>
            <label htmlFor="thought"></label>
            <textarea
              id="thought"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              className="thought-input"
              placeholder="Thought"
            ></textarea>
          </div>

          {selectedImages.length > 0 && (
            <div className="image-container">
              {selectedImages.map((image, index) => (
                <div className="b-cont" key={index}>
                  <img style={{width: `${300}px`}}
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    className="image" 
                  />
                  <button
                    className="del-but"
                    onClick={() => handleDeleteImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="d-btn-cont">
            <button type="submit" className="done-btn" disabled={loading}>
              {loading ? (
                <div className="loading-bear-animation"></div>
              ) : (
                "Done"
              )}
            </button>
          </div>
          <div className="i-btn-cont" >
            <ImageUploader onImageSelect={handleImageSelect} />
          </div>
        </form>
      </div>
    </>
  );
};

export default Entry;