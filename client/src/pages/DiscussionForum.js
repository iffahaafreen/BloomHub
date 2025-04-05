import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const DiscussionForum = () => {
    const [discussions, setDiscussions] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "discussions"));
                const now = new Date();
                
                const validDiscussions = [];
                
                for (const discussion of querySnapshot.docs) {
                    const data = discussion.data();
                    const discussionID = discussion.id;
                    const expiresAt = data.expires_at?.toDate(); // Convert Firestore timestamp
                    
                    if (!expiresAt || expiresAt > now) {
                        validDiscussions.push({ id: discussionID, ...data });
                    } else {
                        // Delete expired discussion
                        await deleteDoc(doc(db, "discussions", discussionID));
                        console.log(`Deleted expired discussion: ${discussionID}`);
                    }
                }
                
                setDiscussions(validDiscussions);
            } catch (error) {
                console.error("Error fetching discussions:", error);
            }
        };
        
        fetchDiscussions();
    }, []);
    
    return (
        <div className="forum-container">
            <h2 className="forum-title">Discussion Forum</h2>
            <button className="new-discussion-button" onClick={() => navigate("/new-discussion")}>
                Start a Discussion
            </button>
            <div className="discussions-grid">
                {discussions.map(discussion => (
                    <div 
                        key={discussion.id}
                        className="discussion-card"
                        onClick={() => navigate(`/discussion/${discussion.id}`)}
                    >
                        <h3 className="discussion-title">{discussion.title || "Untitled Discussion"}</h3>
                        <p className="discussion-excerpt">
                            {discussion.content ? discussion.content.substring(0, 100) + "..." : "No content available"}
                        </p>
                        <small className="discussion-author">By {discussion.user_email || "Unknown"}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscussionForum;