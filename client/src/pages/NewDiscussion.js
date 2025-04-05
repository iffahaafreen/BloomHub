import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const NewDiscussion = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return alert("Please fill in all fields!");

        try {
            await addDoc(collection(db, "discussions"), {
                title: title,
                content: content,
                user_email: user?.email || "Anonymous",
                created_at: serverTimestamp(),
                expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            });
            navigate("/discussions");
        } catch (error) {
            console.error("Error creating discussion:", error);
        }
    };

    return (
        <div className="discussion-form-container">
            <h2 className="discussion-form-heading">Start a New Discussion</h2>
            <form className="discussion-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="discussion-input"
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="discussion-textarea"
                />
                <button type="submit" className="discussion-submit-button">Create Discussion</button>
            </form>
        </div>
    );
};

export default NewDiscussion;
