  // App.js
  import React from "react";
  import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
  import Login from "./components/Login";
  import UserDetails from "./components/UserDetails";
  import StoreDetails from "./components/StoreDetails";
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/Register";


  const App = () => {
    return (
      <Router>
        <Routes>
          {/* Optional: Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Login />} />
          <Route path="/User" element={<UserDetails />} />
          <Route path="/Store" element={<StoreDetails />} />
          <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

        </Routes>
      </Router>
    );
  };

  export default App;
