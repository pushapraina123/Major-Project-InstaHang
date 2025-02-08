import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Signup } from "./Components/Signup";
import { Login } from "./Components/Login";
import Navbar from "./Components/Navbar"; 
import ChatApp from "./Components/Chat";
import { useState } from "react";
import React from "react";
import './index.css';

function App() {
  return (
    <Router>
      <div>
          
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/navbar" element={<Navbar/>}/>
          <Route path="/chat" element={<ChatApp />} />
          <Route path="*" element={<Signup />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;




