import React from "react";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <p>
        আপনার একাউন্টে প্রবেশ করার জন্য দয়া করে ফিঙ্গারপ্রিন্ট দিন অথবা কার্ড
        স্ক্যান করুন
      </p>
      <Link to="/home">Home</Link>
      <Link to="/profile">Profile</Link>
    </>
  );
}

export default App;
