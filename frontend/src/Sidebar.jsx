// import "./Sidebar.css";
// import logo from "./assets/logixlogo2.png";
// import { useContext, useEffect } from "react";
// import { MyContext } from "./MyContext";
// import {v1 as uuidv1} from "uuid";

// function Sidebar() {
//     const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

//     const getAllThreads = async () => {
//         try {
//             const token = localStorage.getItem("token"); 
//             const response = await fetch("https://logixgpt.onrender.com//api/thread", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             const res = await response.json();
//             const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
//             setAllThreads(filteredData);
//         } catch(err) {
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         getAllThreads();
//     }, [currThreadId]);

//     const createNewChat = () => {
//         setNewChat(true);
//         setPrompt(" ");
//         setReply(null);
//         setCurrThreadId(uuidv1());
//         setPrevChats([]);
//     };

//     const changeThread = async (newThreadId) => {
//         setCurrThreadId(newThreadId);
//         // ✅ FIX 1: token was used but never declared — added this line
//         const token = localStorage.getItem("token");
//         try {
//             const response = await fetch(`https://logixgpt.onrender.com//api/thread/${newThreadId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             const res = await response.json();
//             console.log(res);
//             setPrevChats(res);
//             setNewChat(false);
//             setReply(null);
//         } catch(err) {
//             console.log(err);
//         }
//     };

//     const deleteThread = async (threadId) => {
//         // ✅ FIX 2: Authorization header was missing — backend rejected the delete
//         const token = localStorage.getItem("token");
//         try {
//             const response = await fetch(`https://logixgpt.onrender.com//api/thread/${threadId}`, {
//                 method: "DELETE",
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             const res = await response.json();
//             console.log(res);

//             setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

//             if (threadId === currThreadId) {
//                 createNewChat();
//             }
//         } catch(err) {
//             console.log(err);
//         }
//     };

//     return (
//         <section className="sidebar">
//             <button onClick={createNewChat}>
//                 <img src={logo} alt="logix logo" className="logo"/>
//                 <span><i className="fa-solid fa-pen-to-square"></i></span>
//             </button>

//             <ul className="history">
//                 {
//                     allThreads?.map((thread, idx) => (
//                         <li key={idx}
//                             onClick={() => changeThread(thread.threadId)}
//                             className={thread.threadId === currThreadId ? "highlighted" : " "}
//                         >
//                             {thread.title}
//                             <i className="fa-solid fa-trash"
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     deleteThread(thread.threadId);
//                                 }}
//                             ></i>
//                         </li>
//                     ))
//                 }
//             </ul>

//             <div className="sign">
//                 <p>By Logix &hearts;</p>
//             </div>
//         </section>
//     );
// }

// export default Sidebar;

import "./Sidebar.css";
import logo from "./assets/logixlogo2.png";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(false); // ← mobile sidebar toggle

    const getAllThreads = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://logixgpt.onrender.com//api/thread", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setIsOpen(false); // close sidebar on mobile after action
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`https://logixgpt.onrender.com//api/thread/${newThreadId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
            setIsOpen(false); // close sidebar on mobile after selecting chat
        } catch(err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`https://logixgpt.onrender.com//api/thread/${threadId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await response.json();
            setAllThreads(prev => prev.filter(t => t.threadId !== threadId));
            if (threadId === currThreadId) createNewChat();
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <>
            {/* Hamburger button — only visible on mobile */}
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
            </button>

            {/* Overlay — clicking it closes sidebar */}
            {isOpen && <div className="sidebarOverlay" onClick={() => setIsOpen(false)}></div>}

            <section className={`sidebar ${isOpen ? "sidebarOpen" : ""}`}>
                <button onClick={createNewChat} className="newChatBtn">
                    <img src={logo} alt="logix logo" className="logo"/>
                    <span><i className="fa-solid fa-pen-to-square"></i></span>
                </button>

                <ul className="history">
                    {allThreads?.map((thread) => (
                        <li key={thread.threadId}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : ""}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))}
                </ul>

                <div className="sign">
                    <p>By Logix &hearts;</p>
                </div>
            </section>
        </>
    );
}

export default Sidebar;
