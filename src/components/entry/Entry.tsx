import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setError, clearError} from "../../reduxconfig/store";
import {getFirestore, collection, addDoc} from "firebase/firestore";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import ImageUploader from "./ImageUploader";
import {useNavigate} from "react-router-dom";
import {RootState} from "../../reduxconfig/store";
import {v4 as uuidv4} from "uuid";
import {motion} from "framer-motion";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {TextField, Button} from "@mui/material";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {LocalizationProvider} from "@mui/x-date-pickers";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {cyan} from "@mui/material/colors";
import ClearIcon from '@mui/icons-material/Clear';

export interface EntryData {
    id: string;
    date: string;
    title: string;
    thought: string;
    imageURLs?: string[];
}

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

const Entry: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [date, setDate] = useState<Date | null>(null);
    const [title, setTitle] = useState<string>("");
    const [thought, setThought] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleImageSelect = (imageFiles: File[]) => {
        setSelectedImages((prevImages) => [...prevImages, ...imageFiles]);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(clearError());

            if (!date || !title.trim()) {
                alert("Date and title can't be null");
                return;
            }

            setLoading(true);

            await saveDataToFirebase({
                id: uuidv4(),
                date: date.toISOString().split('T')[0],
                title,
                thought,
                images: selectedImages,
                userId: user.uid,
            });

            setDate(null);
            setTitle("");
            setThought("");
            setSelectedImages([]);

            navigate("/entrylist");
        } catch (error: any) {
            dispatch(setError(error.message));
            alert(error.message)
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
                                          userId,
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

        const entryData: EntryData = {id, date, title, thought};

        const imageURLs: string[] = [];


        for (const image of images) {
            const storageRef = ref(storage, `images/${userId}/${uuidv4()}-${image.name}`);
            await uploadBytes(storageRef, image);
            const imageURL = await getDownloadURL(storageRef);
            imageURLs.push(imageURL);
        }

        entryData.imageURLs = imageURLs;

        await addDoc(collection(db, "entry"), {...entryData, userId});
    };

    const handleDeleteImage = (indexToDelete: number) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((_, index) => index !== indexToDelete)
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <motion.div
                className="mx-auto py-10 px-5 bg-gray-900 text-white min-h-screen flex justify-center items-center"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <ArrowBackIcon
                            sx={{
                                cursor: "pointer",
                                color: cyan[500]
                            }} onClick={() => navigate("/entrylist")}
                        />
                        <DatePicker
                            value={date}
                            onChange={(newDate) => setDate(newDate)}
                            slotProps={{
                                textField: {
                                    className: "w-40 bg-gray-700 text-white",
                                    variant: "outlined",
                                    size: "small",
                                    sx: styles
                                },
                            }}
                        />
                    </div >

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <TextField
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-54 bg-gray-700 text-white"
                                variant="outlined"
                                label="Title"
                                multiline
                                rows={1}

                                sx={styles}
                            />
                        </div >

                        <div className="mb-4">
                            <TextField
                                value={thought}
                                onChange={(e) => setThought(e.target.value)}
                                className="w-full bg-gray-700 text-white"
                                variant="outlined"
                                label="Thought"
                                multiline
                                rows={4}
                                sx={styles}
                            />
                        </div >

                        {selectedImages.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {selectedImages.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Selected ${index + 1}`}
                                            className="w-full object-cover rounded-md"
                                        />
                                        <ClearIcon sx={{fontSize:"medium", color:"red", cursor:"pointer"}} onClick={() => handleDeleteImage(index)}/>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-6">
                            <Button
                                type="submit"
                                className="text-white py-2 px-6 rounded-lg cursor-pointer hover:bg-cyan-600 transition duration-300"
                                disabled={loading}
                                variant="contained"
                                sx={{color: "white",
                                    backgroundColor:"rgb(59 130 246)"
                            }}
                            >
                                {loading ? (
                                    <motion.div
                                        className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                        }}
                                    />
                                ) : (
                                    "Done"
                                )}
                            </Button>

                            <div className="ml-4">
                                <ImageUploader onImageSelect={handleImageSelect}/>
                            </div >
                        </div >
                    </form >
                </div >
            </motion.div >
        </LocalizationProvider >
    );
};

export default Entry;