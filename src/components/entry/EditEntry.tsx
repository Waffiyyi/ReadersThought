import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxconfig/store";
import { setError, clearError } from "../../reduxconfig/store";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  DocumentData,
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
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Button } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cyan } from "@mui/material/colors";
import ClearIcon from "@mui/icons-material/Clear";

const styles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#06b6d4",
      color: "#06b6d4",
    },
    "&:hover fieldset": {
      borderColor: "#06b6d4",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#06b6d4",
      color: "#ffffff",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#ffffff",
  },
  "& .MuiInputLabel-root": {
    color: "#ffffff",
  },
};

const EditEntry: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<EntryData>({
    id: "",
    date: "",
    title: "",
    thought: "",
    imageURLs: [],
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (id) fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      dispatch(clearError());
      const db = getFirestore();
      const entryRef = doc(db, "entry", id!);
      const docSnap = await getDoc(entryRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.userId === user?.uid) {
          setEntry(data as EntryData);
        } else {
          dispatch(setError("You are not authorized to edit this entry"));
        }
      } else {
        dispatch(setError("Entry not found"));
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(clearError());
      if (!entry.date || !entry.title.trim()) {
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
    const storage = getStorage();
    const entryRef = doc(db, "entry", id!);

    const updatedEntryData: DocumentData = { ...entry };

    if (selectedImages.length > 0) {
      const existingImageURLs = new Set(entry.imageURLs);
      const newImageURLs: string[] = [];

      for (const image of selectedImages) {
        const storageRef = ref(storage, `images/${user?.uid}/${uuidv4()}-${image.name}`);
        await uploadBytes(storageRef, image);
        const imageURL = await getDownloadURL(storageRef);

        if (!existingImageURLs.has(imageURL)) {
          newImageURLs.push(imageURL);
        }
      }

      updatedEntryData.imageURLs = [
        ...(entry.imageURLs || []),
        ...newImageURLs,
      ];
      setEntry((prevEntry) => ({
        ...prevEntry,
        imageURLs: updatedEntryData.imageURLs,
      }));
    }

    await updateDoc(entryRef, updatedEntryData);
  };

  const deleteImage = async (index: number) => {
    try {
      const imageURLToDelete = entry.imageURLs?.[index];
      if (!imageURLToDelete) return;

      const storage = getStorage();
      const imageRef = ref(storage, imageURLToDelete);
      await deleteObject(imageRef);

      const updatedImages = entry.imageURLs ? [...entry.imageURLs] : [];
      updatedImages.splice(index, 1);

      const db = getFirestore();
      const entryRef = doc(db, "entry", id!);
      await updateDoc(entryRef, { ...entry, imageURLs: updatedImages });

      setEntry({ ...entry, imageURLs: updatedImages });
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const handleImageSelect = (imageFiles: File[]) => {
    setSelectedImages((prevImages) => [...prevImages, ...imageFiles]);
  };

  const handleImageRemove = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <motion.div
            className="container mx-auto py-10 px-5 bg-gray-900 text-white h-screen flex justify-center items-center overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <ArrowBackIcon
                  sx={{ cursor: "pointer", color: cyan[500] }}
                  onClick={() => navigate("/entrylist")}
              />
              <DatePicker
                  value={entry.date ? new Date(entry.date) : null}
                  onChange={(newDate) => setEntry({ ...entry, date: newDate?.toISOString().split("T")[0] || "" })}
                  slotProps={{
                    textField: {
                      className: "w-40 bg-gray-700 text-white",
                      variant: "outlined",
                      size: "small",
                      sx: styles,
                    },
                  }}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <TextField
                    value={entry.title}
                    onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                    className="w-54 bg-gray-700 text-white"
                    variant="outlined"
                    label="Title"
                    multiline
                    rows={1}
                    sx={styles}
                />
              </div>

              <div className="mb-4">
                <TextField
                    value={entry.thought}
                    onChange={(e) => setEntry({ ...entry, thought: e.target.value })}
                    className="w-full bg-gray-700 text-white"
                    variant="outlined"
                    label="Thought"
                    multiline
                    rows={4}
                    sx={styles}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {entry.imageURLs && entry.imageURLs.length > 0 && entry.imageURLs.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                          src={url}
                          alt={`Existing ${index + 1}`}
                          className="w-full object-cover rounded-md"
                      />
                      <ClearIcon
                          sx={{ fontSize: "medium", color: "red", cursor: "pointer" }}
                          onClick={() => deleteImage(index)}
                      />
                    </div>
                ))}
                {selectedImages.length > 0 && selectedImages.map((image, index) => (
                    <div key={`selected-${index}`} className="relative">
                      <img
                          src={URL.createObjectURL(image)}
                          alt={`Selected ${index + 1}`}
                          className="w-full object-cover rounded-md"
                      />
                      <ClearIcon
                          sx={{ fontSize: "medium", color: "red", cursor: "pointer" }}
                          onClick={() => {handleImageRemove(index)}}
                      />
                    </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button
                    type="submit"
                    className="text-white py-2 px-6 rounded-lg cursor-pointer hover:bg-cyan-600 transition duration-300"
                    disabled={loading}
                    variant="contained"
                    sx={{ color: "white", backgroundColor: "rgb(59 130 246)" }}
                >
                  {loading ? (
                      <motion.div
                          className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                      />
                  ) : (
                      "Update"
                  )}
                </Button>

                <div className="ml-4">
                  <ImageUploader onImageSelect={handleImageSelect} />
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </LocalizationProvider>
  );
};

export default EditEntry;