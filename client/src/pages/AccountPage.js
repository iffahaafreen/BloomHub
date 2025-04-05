import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const AccountPage = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState({ name: "", bio: "", interests: "", profilePic: "" });
    const [bookmarks, setBookmarks] = useState([]);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            logout();
            navigate("/login");
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userRef = doc(db, "users", user.email);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setProfile({
                        name: data.name || user.displayName || "Anonymous",
                        bio: data.bio || "",
                        interests: data.interests || "",
                        profilePic: data.profilePic || user.photoURL || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        const fetchBookmarks = async () => {
            try {
                const q = query(collection(db, "bookmarks"), where("user_email", "==", user.email));
                const snapshot = await getDocs(q);
                setBookmarks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
            }
        };

        fetchProfile();
        fetchBookmarks();
    }, [user.email]);

    const handleUpdate = async () => {
        try {
            const userRef = doc(db, "users", user.email);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    name: profile.name,
                    bio: profile.bio,
                    interests: profile.interests,
                    profilePic: profile.profilePic
                });
            } else {
                await updateDoc(userRef, {
                    name: profile.name,
                    bio: profile.bio,
                    interests: profile.interests
                });
            }

            setEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const removeBookmark = async (bookmarkId) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this bookmark?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "bookmarks", bookmarkId));
            setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
            alert("Bookmark removed successfully!");
        } catch (error) {
            console.error("Error removing bookmark:", error);
        }
    };


    return (
        <div className="page-container account-page">
            <h1 className="account-title">My Account</h1>
            
            <div className="card profile-card">
                <div className="profile-header">
                    {profile.profilePic && (
                        <img 
                            src={profile.profilePic} 
                            alt="Profile" 
                            className="profile-image" 
                        />
                    )}
                    
                    {!editing && (
                        <div className="profile-info">
                            <h2>{profile.name || "Anonymous"}</h2>
                            <p className="email">{user.email}</p>
                        </div>
                    )}
                </div>

                {editing ? (
                    <div className="profile-form">
                        <div className="form-group">
                            <label>Name:</label>
                            <input 
                                type="text" 
                                value={profile.name} 
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                            />
                        </div>

                        <div className="form-group">
                            <label>Bio:</label>
                            <textarea 
                                value={profile.bio} 
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows="4" 
                            />
                        </div>

                        <div className="form-group">
                            <label>Interests:</label>
                            <input 
                                type="text"
                                value={profile.interests}
                                onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                            />
                        </div>

                        <div className="button-group">
                            <button className="btn" onClick={handleUpdate}>Save Changes</button>
                            <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="profile-details">
                        <div className="detail-group">
                            <h3>Bio</h3>
                            <p>{profile.bio || "No bio set"}</p>
                        </div>
                        
                        <div className="detail-group">
                            <h3>Interests</h3>
                            <p>{profile.interests || "No interests added"}</p>
                        </div>
                        
                        <button className="btn" onClick={() => setEditing(true)}>Edit Profile</button> 
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>

            <div className="bookmarks-section">
                <h2 className="account-title">Bookmarked Messages</h2>
                
                {bookmarks.length > 0 ? (
                    <ul className="bookmarks-list">
                        {bookmarks.map((msg) => (
                            <li key={msg.id} className="bookmark-item card">
                                <p className="bookmark-text">{msg.text}</p>
                                <div className="bookmark-meta">
                                    <small>Saved from Discussion ID: {msg.discussion_id}</small>
                                </div>
                                <button 
                                    onClick={() => removeBookmark(msg.id)} 
                                    className="btn-remove"
                                >
                                    Remove Bookmark
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-bookmarks">No bookmarks yet.</p>
                )}
            </div>
        </div>
    );
};

export default AccountPage;