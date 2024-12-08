import React, { useState } from "react";
import "./Register.scss";
import Swal from "sweetalert2";
import RegisterServices from "../Services/RegisterServices"; // Service import

const Register = () => {
  const registerService = new RegisterServices(); // Instantiate the service

  const [step, setStep] = useState(1); // Step tracker: Step 1 or Step 2
  const [formData, setFormData] = useState({
    username: "", // Added username field
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    address: "",
    gstNo: "",
    contactNo: "",
  });

  const [errors, setErrors] = useState({});

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error for the field
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const { username, email, password, confirmPassword } = formData;
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!username) newErrors.username = "Username is required."; // Validate username
    else if (username.length < 3)
      newErrors.username = "Username must be at least 3 characters long.";

    if (!email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

    if (!password) newErrors.password = "Password is required.";
    else if (!passwordRegex.test(password))
      newErrors.password =
        "Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character.";

    if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required.";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // No errors
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const { storeName, address, gstNo, contactNo } = formData;
    const newErrors = {};

    if (!storeName) newErrors.storeName = "Store Name is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!gstNo) newErrors.gstNo = "GST Number is required.";
    else if (!/^[A-Z0-9]{15}$/.test(gstNo))
      newErrors.gstNo = "GST Number must be 15 characters and contain only uppercase letters and numbers.";

    if (!contactNo) newErrors.contactNo = "Contact Number is required.";
    else if (!/^[0-9]{10}$/.test(contactNo))
      newErrors.contactNo = "Contact Number must be exactly 10 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // No errors
  };

  // Move to Step 2
  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateStep2()) {
      try {
        console.log("Sending registration data:", formData);

        // Call Register service
        const response = await registerService.Register(formData);

        // Success notification
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: response.message || "Your account has been created successfully!",
          confirmButtonText: "Okay",
        });

        // Reset form and step
        setFormData({
          username: "", // Reset username field
          email: "",
          password: "",
          confirmPassword: "",
          storeName: "",
          address: "",
          gstNo: "",
          contactNo: "",
        });
        setStep(1); // Go back to Step 1
      } catch (error) {
        console.error("Error during registration:", error);

        // Error notification
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };

  return (
    <div className="register-container">
      <header>
        <h1>Milk Dairy Management System</h1>
      </header>
      <main>
        <form>
          <h2>{step === 1 ? "Step 1: User Details" : "Step 2: Store Details"}</h2>

          {step === 1 && (
            <>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
              </div>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>
              <button className="btn" onClick={handleNext}>
                Next &gt;&gt;
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label>Store Name:</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                />
                {errors.storeName && <p className="error-message">{errors.storeName}</p>}
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && <p className="error-message">{errors.address}</p>}
              </div>
              <div className="form-group">
                <label>GST Number:</label>
                <input
                  type="text"
                  name="gstNo"
                  value={formData.gstNo}
                  onChange={handleInputChange}
                />
                {errors.gstNo && <p className="error-message">{errors.gstNo}</p>}
              </div>
              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                />
                {errors.contactNo && <p className="error-message">{errors.contactNo}</p>}
              </div>
              <button className="btn" onClick={handleRegister}>
                Register
              </button>
            </>
          )}
        </form>
      </main>
      <footer>
        <p>&copy; 2022 Milk Dairy Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;
