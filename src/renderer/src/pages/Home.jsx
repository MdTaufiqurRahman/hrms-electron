import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { useAxiosRequest } from "../hooks/useAxiosRequest";

const Home = () => {
  const [show, setShow] = useState(false);
  const [messageFromJava, setMessageFromJava] = useState(
    "Waiting for message...",
  );
  const listenerAdded = useRef(false);

  const dummyApi = useAxiosRequest([]);

  useEffect(() => {
    if (!listenerAdded.current && window.api && window.api.onMessageFromJava) {
      listenerAdded.current = true;

      const messageListener = (event, message) => {
        console.log("Received message from Java backend:", message);
        setMessageFromJava(message);
        makeApiCall(message);
      };

      window.api.onMessageFromJava(messageListener);

      return () => {
        if (window.api && window.api.removeMessageListener) {
          window.api.removeMessageListener(
            "message-from-java",
            messageListener,
          );
        }
      };
    }
  }, []);

  // Function to make the API call
  const makeApiCall = async (data) => {
    console.log(data);
    dummyApi.apiAction({
      url: "https://backend.testsprint360.com/subscription/plan/public/all",
      method: "GET",
      isToast: true,
      successHtml: `
        <div>আপনার ছুটির আবেদনটি সফলভাবে লাইন ম্যানেজারের কাছে পাঠানো হয়েছে
        <p classname="text-blue-500 font-semibold">অনুগ্রহ করে  ছুটি মঞ্জুর হওয়ার জন্য অপেক্ষা করুন</p>
        </div>
      `,
      cb: (data) => {
        console.log(data);
      },
    });
  };

  const sendMessageToJava = () => {
    if (window.api && window.api.sendToMain) {
      window.api.sendToMain("message-to-java", "Hello from React!");
    }
  };

  useEffect(() => {
    // setShow(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 text-gray-800">
      <Link to="/">Go Back</Link>
      <h1 className="text-4xl font-bold mb-4">Home Page</h1>
      <div className="text-lg">
        Message from Java backend:
        <strong className="text-blue-500">{messageFromJava}</strong>
      </div>
      <button
        className="py-3 px-4 bg-red-600 text-white"
        onClick={sendMessageToJava}
      >
        Send Message to Java Backend
      </button>

      {show && <Loading />}
    </div>
  );
};

export default Home;
