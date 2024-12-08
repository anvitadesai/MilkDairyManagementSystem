import React, { useState } from "react";
import LoginServices from "../Services/LoginServices";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import icons

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({});
  const service = new LoginServices();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!emailRegex.test(email)) return "Invalid email format.";
    return null;
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!password) return "Password is required.";
    if (!passwordRegex.test(password))
      return "Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character.";
    return null;
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    let error = null;

    if (field === "email") {
      setEmail(value);
      error = validateEmail(value);
    } else if (field === "password") {
      setPassword(value);
      error = validatePassword(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const newErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);
    return !emailError && !passwordError;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      // Call the Login service
      const response = await service.Login({ email, password });
  
      if (response.data.isSuccess) {
        // If login is successful, save the token and navigate
        const token = response.data.token;
        localStorage.setItem("authToken", token);
  
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome!",
          confirmButtonText: "Okay",
        });
  
        navigate("/Store");
      } else {
        // Display backend error message for invalid credentials
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message || "Invalid credentials. Please try again.",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("Error Details:", error);
      // Handle unexpected errors
      Swal.fire({
        icon: "error",
        title: "An Error Occurred",
        text: "Something went wrong. Please try again later.",
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
              type="text"
              value={email}
              onInput={(e) => handleInputChange(e, "email")}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onInput={(e) => handleInputChange(e, "password")}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>

          <div className="links">
            <Link to="/register" className="link">
              Register
            </Link>
            <Link to="/forgot-password" className="link">
              Forgot Password?
            </Link>
          </div>
        </form>
      </main>
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Milk Dairy Management System. All
          Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Login;
