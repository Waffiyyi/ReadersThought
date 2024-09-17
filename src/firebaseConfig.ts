import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAcNUzkHrNLkOvzTNt0xDH3c-Un9fUBjFo",
    authDomain: "readersthought-ef6bb.firebaseapp.com",
    projectId: "readersthought-ef6bb",
    storageBucket: "readersthought-ef6bb.appspot.com",
    messagingSenderId: "705275473552",
    appId: "1:705275473552:web:672a7c72a8aa68e880b215",
    measurementId: "G-SBN3ZGRHBT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
    .then(() => {

    })
    .catch((error) => {
        console.error("Error enabling local persistence:", error);
    });

export const db = getFirestore(app);