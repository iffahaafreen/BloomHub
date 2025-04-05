import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>BloomHub</h1>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/resources">Educational Resources</Link>
                <Link to="/discussions">Discussion Forum</Link>
                <Link to="/chatbot">AI Chatbot</Link>
                <Link to="/helplines">Helplines</Link>
                <Link to="/account">My Account</Link>
            </div>
        </nav>
    );
};

export default Navbar;
