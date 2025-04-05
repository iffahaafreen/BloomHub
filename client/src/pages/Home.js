import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
        return null;
    }

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            logout();
        }
    };

    return (
        <div className="home-container">
            <h2 className="home-welcome">Welcome, {user.displayName}!</h2>
            <p className="home-description">
                Explore discussions, educational resources, and AI-powered support.
            </p>
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
};

export default Home;
