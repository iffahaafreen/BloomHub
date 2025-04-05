import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import axios from "axios";

const GoogleLoginButton = ({ className }) => {
    const [user, setUser] = useState(null);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                profilePic: result.user.photoURL,
                bio: "",
                interests: []
            };

            // Send user data to Flask backend
            await axios.post("http://127.0.0.1:5000/api/auth/firebase-login", userInfo);

            // Check if user profile already exists in Firestore
            const userRef = doc(db, "users", result.user.email);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, userInfo);
            } else {
                setUser(userSnap.data());
            }

            setUser(userInfo);
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
        <button className={className} onClick={handleLogin}>
            Continue with Google
        </button>
    );
};

export default GoogleLoginButton;
