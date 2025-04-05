import React from "react";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        navigate("/");
        return null;
    }

    return (
        <div className="login-container">
            <h2 className="login-heading">Login/Register to BloomHub</h2>
            <GoogleLoginButton className="google-login-button"/>
        </div>
    );
};

export default Login;
