import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-gray-800">
      <Link to="/">Go Back</Link>
      <h1 className="text-4xl font-bold mb-4">
        Here profile Page content.............
      </h1>
    </div>
  );
};

export default Profile;
