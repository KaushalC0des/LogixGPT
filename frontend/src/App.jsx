import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Chat from "./Chat.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function ChatPage({ providerValues }) {
  return (
    <MyContext.Provider value={providerValues}>
      <div className="app">
        <Sidebar />
        <ChatWindow />
      </div>
    </MyContext.Provider>
  );
}

function App() {

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  const token = localStorage.getItem("token");

  return (

    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/chat"
        element={
          token ? (
            <ChatPage providerValues={providerValues} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/"
        element={
          token ? <Navigate to="/chat" /> : <Navigate to="/login" />
        }
      />

    </Routes>

  );
}

export default App;
