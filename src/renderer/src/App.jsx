import React, { useEffect, useState, useRef } from 'react';
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from './pages/Home';
import About from "./pages/About";
import { useAxiosRequest } from './hooks/useAxiosRequest';

function App() {
  const [messageFromJava, setMessageFromJava] = useState('Waiting for message...');
  const listenerAdded = useRef(false);

  const loginApi = useAxiosRequest({});

  useEffect(() => {
    if (!listenerAdded.current && window.api && window.api.onMessageFromJava) {
      listenerAdded.current = true;

      const messageListener = (event, message) => {
        console.log('Received message from Java backend:', message);
        setMessageFromJava(message);
        makeApiCall(message);
      };

      window.api.onMessageFromJava(messageListener);

      return () => {
        if (window.api && window.api.removeMessageListener) {
          window.api.removeMessageListener('message-from-java', messageListener);
        }
      };
    }
  }, []);

  // Function to make the API call
  const makeApiCall = async (data) => {
    console.log(data);
    // try {
    //   const response = await fetch('https://backend.testsprint360.com/subscription/plan/public/all', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });

    //   if (!response.ok) {
    //     throw new Error(`API call failed with status ${response.status}`);
    //   }

    //   const result = await response.json();
    //   console.log('API call result:', result);
    // } catch (error) {
    //   console.error('Error making API call:', error);
    // }


    loginApi.apiAction({
      url: 'https://backend.testsprint360.com/subscription/plan/public/all',
      method: 'GET',
      isToast: true,
      successMessage: 'API call successful',
      cb: (data) => {
        console.log(data);
      },
    });

  };

  const sendMessageToJava = () => {
    if (window.api && window.api.sendToMain) {
      window.api.sendToMain('message-to-java', 'Hello from React!');
    }
  };

  return (
    <Router>
      <nav className="fixed top-0 left-0 right-0 flex justify-center space-x-4 bg-gray-800 text-white py-4 shadow-lg z-10">
        <Link to="/" className="px-3 py-2 rounded bg-gray-900 hover:bg-gray-700">
          Home
        </Link>
        <Link to="/about" className="px-3 py-2 rounded hover:bg-gray-700 bg-gray-900">
          About
        </Link>
      </nav>
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home messageFromJava={messageFromJava} sendMessageToJava={sendMessageToJava} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
