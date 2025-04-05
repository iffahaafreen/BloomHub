import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EducationalResources from "./pages/EducationalResources";
import ResourcePage from "./pages/ResourcePage";
import DiscussionForum from "./pages/DiscussionForum";
import ChatbotPage from "./pages/Chatbot";
import Login from "./pages/Login";
import NewDiscussion from "./pages/NewDiscussion";
import DiscussionChatroom from "./pages/DiscussionChatroom";
import HelplinesPage from "./pages/HelplinesPage";
import AccountPage from "./pages/AccountPage";
import './global.css'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div style={{ padding: "20px" }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route 
                            path="/" 
                            element={<ProtectedRoute><Home /></ProtectedRoute>} 
                        />
                        <Route 
                            path="/resources" 
                            element={<ProtectedRoute><EducationalResources /></ProtectedRoute>} 
                        />
                        <Route 
                            path="/discussions" 
                            element={<ProtectedRoute><DiscussionForum /></ProtectedRoute>} 
                        />
                        <Route 
                            path="/resources/:topicId" 
                            element={<ProtectedRoute><ResourcePage /></ProtectedRoute>} 
                        />
                        <Route 
                            path="/chatbot" 
                            element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} 
                        />
                        <Route 
                            path="/new-discussion" 
                            element={<ProtectedRoute><NewDiscussion /></ProtectedRoute>} 
                        />
                        <Route 
                            path="/helplines" 
                            element={<ProtectedRoute><HelplinesPage /></ProtectedRoute>} 
                        />
                        <Route 
                            path="/discussion/:discussion_id" 
                            element={<ProtectedRoute><DiscussionChatroom /></ProtectedRoute>} 
                        />
                        <Route 
                            path="/account" 
                            element={<ProtectedRoute><AccountPage /></ProtectedRoute>} 
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
