  // App.js
  import React from "react";
  import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
  import Login from "./components/Login";
  import UserDetails from "./components/UserDetails";




  const App = () => {
    return (
      <Router>
        <Routes>
          
          <Route path="/" element={<Login />} />
          <Route path="/User" element={<UserDetails />} />
          {/* Optional: Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  };

  export default App;
