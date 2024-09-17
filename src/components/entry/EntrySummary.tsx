import React, { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxconfig/store";
import { setError, clearError } from "../../reduxconfig/store";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { cyan } from "@mui/material/colors";

const EntrySummary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [entry, setEntry] = useState<any>(null);
  const error = useSelector((state: RootState) => state.auth.error);
  const navigate = useNavigate();

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
      <div className="container mx-auto py-10 px-5 bg-gray-900 text-white h-screen flex justify-center items-center">
        {error && (
            <Typography variant="h6" className="text-red-500">
              Error: {error}
            </Typography>
        )}
        {entry && (
            <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <ArrowBackIcon
                    sx={{
                      cursor: "pointer",
                      color: cyan[500]
                    }} onClick={() => navigate("/entrylist")}
                />
                <Typography variant="body1" className="text-gray-400">
                  {new Date(entry.date).toDateString()}
                </Typography>
              </div>
              <Typography variant="h5" className="text-white mb-4">
                <strong>{entry.title}</strong>
              </Typography>
              <Typography variant="body1" className="text-gray-400 mb-6 break-words">
                {entry.thought}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">
                {entry.imageURLs &&
                    entry.imageURLs.map((imageURL: string, index: number) => (
                        <img
                            key={index}
                            src={imageURL}
                            alt={`Image ${index}`}
                            className="w-25 h-25 object-cover rounded-md"
                        />
                    ))}
              </div>
              <div className="flex justify-end">
                <Button
                    component={Link}
                    to={`/edit/${id}`}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{
                      color: cyan[500],
                      borderColor: cyan[500],
                      "&:hover": { borderColor: cyan[700] },
                    }}
                >
                  Edit
                </Button>
              </div>
            </div>
        )}
      </div>
  );
};

export default EntrySummary;