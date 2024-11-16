import React, { useState } from "react";
import LoginServices from "../Services/LoginServices";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const service = new LoginServices(); // Instantiate the correct service

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await service.Login({ email, password });
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome!",
        confirmButtonText: "Okay",
      });
      navigate("/User");
    } catch (error) {
      console.error("Error Details:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid credentials. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="login-container">
      <header className="header">
        <h1>Milk Dairy Management System</h1>
      </header>
      <main>
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <div className="links">
            <Link to="/register" className="link">Register</Link>
            <Link to="/forgot-password" className="link">Forgot Password?</Link>
          </div>
        </form>
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Milk Dairy Management System. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
