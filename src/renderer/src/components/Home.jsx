import React from "react";

const Home = ({ messageFromJava, sendMessageToJava }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Home Page</h1>
      <div className="text-lg">Message from Java backend:
        <strong className="text-blue-500">{messageFromJava}</strong>
      </div>
      <button className="py-3 px-4 bg-red-600 text-white" onClick={sendMessageToJava}>Send Message to Java Backend</button>
    </div>
  );
};

export default Home;
