import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login"; // ✅ Importing correctly

import Map from "./Components/Map";

import React from "react";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import './index.css';

function App() {
  return (
    <Router>
      <ReactNotifications />
      <div>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<Map />} />
          
          
          <Route path="*" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;






