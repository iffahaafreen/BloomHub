import React, { useState } from "react";
import { Link } from "react-router-dom";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <h1>BloomHub</h1>
            <div className="hamburger" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className={`nav-links ${isOpen ? "active" : ""}`}>
                <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/resources" onClick={() => setIsOpen(false)}>Educational Resources</Link>
                <Link to="/discussions" onClick={() => setIsOpen(false)}>Discussion Forum</Link>
                <Link to="/chatbot" onClick={() => setIsOpen(false)}>AI Chatbot</Link>
                <Link to="/helplines" onClick={() => setIsOpen(false)}>Helplines</Link>
                <Link to="/account" onClick={() => setIsOpen(false)}>My Account</Link>
            </div>
        </nav>
    );
};

export default Navbar;
