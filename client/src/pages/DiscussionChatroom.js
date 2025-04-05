import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const DiscussionChatroom = () => {
    const { discussion_id } = useParams();
    const { user } = useAuth();
    const [discussion, setDiscussion] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                const discussionRef = doc(db, "discussions", discussion_id);
                const docSnap = await getDoc(discussionRef);

                if (docSnap.exists()) {
                    setDiscussion(docSnap.data());
                    setMessages(docSnap.data().replies || []);
                } else {
                    console.error("Discussion not found!");
                }
            } catch (error) {
                console.error("Error fetching discussion:", error);
            }
        };

        fetchDiscussion();
    }, [discussion_id]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const discussionRef = doc(db, "discussions", discussion_id);
            await updateDoc(discussionRef, {
                replies: arrayUnion({
                    user_email: user.email,
                    text: newMessage,
                    created_at: new Date().toISOString()
                })
            });

            setMessages([...messages, { user_email: user.email, text: newMessage }]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const bookmarkMessage = async (message) => {
        try {
            const q = query(
                collection(db, "bookmarks"),
                where("user_email", "==", user.email),
                where("text", "==", message.text),
                where("discussion_id", "==", discussion_id)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                alert("You have already bookmarked this message!");
                return;
            }

            // If not bookmarked, add it
            await addDoc(collection(db, "bookmarks"), {
                user_email: user.email,
                discussion_id: discussion_id,
                text: message.text,
                created_at: new Date().toISOString()
            });

            alert("Message bookmarked!");
        } catch (error) {
            console.error("Error bookmarking message:", error);
        }
    };

    if (!discussion) return <p>Loading chatroom...</p>;

    return (
        <div className="chatroom-container">
            <h2 className="chatroom-title">{discussion.title}</h2>
            <p className="chatroom-content">{discussion.content}</p>
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.user_email === user.email ? "own-message" : "other-message"}`}>
                        <strong className="message-sender">{msg.user_email === user.email ? "You" : msg.user_email}</strong>
                        <p className="message-text">{msg.text}</p>
                        <button className="bookmark-button" onClick={() => bookmarkMessage(msg)}> Bookmark </button>
                    </div>
                ))}
            </div>
            <div className="message-input-container">
                <input 
                    type="text" 
                    className="message-input"
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..." 
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default DiscussionChatroom;