import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginServices from "../Services/LoginServices";
import Swal from "sweetalert2";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const service = new LoginServices();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!emailRegex.test(email)) return "Invalid email format.";
    return null;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!passwordRegex.test(password))
      return "Password must contain at least 1 uppercase letter, 1 number, and 1 special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = password !== confirmPassword ? "Passwords do not match." : null;

    if (emailError || passwordError || confirmPasswordError) {
      setErrors({ email: emailError, password: passwordError, confirmPassword: confirmPasswordError });
      return;
    }

    try {
        const response = await service.ForgotPassword({
            email,
            NewPassword: password,
            ConfirmPassword: confirmPassword,
          });
          
      Swal.fire({
        icon: response.data.isSuccess ? "success" : "error",
        title: response.data.isSuccess ? "Success" : "Failed",
        text: response.data.message,
        confirmButtonText: "Okay",
      });

      if (response.data.isSuccess) {
        navigate("/login");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit}>
        <h2>Reset Your Password</h2>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/login")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
