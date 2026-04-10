import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {

    const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsopen] = useState(false);
    const [listening, setListening] = useState(false);
    const [user, setUser] = useState(null);
    const [showSettings,  setShowSettings] = useState(false);

    useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("https://logixgpt.onrender.com/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        // ✅ Only store what you need
        setUser({ name: data.name, email: data.email });
    };
         fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const getReply = async () => {
        if(!prompt.trim()) return;
        const token = localStorage.getItem("token");
        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("https://logixgpt.onrender.com//api/chat", options);

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            const data = await response.json();
            setReply(data.reply);

        } catch (err) {
            console.log("❌ Error sending message:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if(prompt && reply){
            setPrevChats(prevChats => (
                [...prevChats, {
                    role:"user",
                    content: prompt
                },{
                    role:"assistant",
                    content: reply
                }]
            ))
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsopen(!isOpen);
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if(!SpeechRecognition){
            alert("Your browser doesn't support voice input. Try Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setPrompt(transcript);
        };

        recognition.onerror = (e) => {
            console.error("Speech error:", e.error);
            setListening(false);
        };

        recognition.start();
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>Logix <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {isOpen && (
                    <div className="dropDown">
                
                    <div className="dropDownItem" onClick={() => setShowSettings(!showSettings)}>
                        <i className="fa-solid fa-gear"></i> Settings
                    </div>

                
                    {showSettings && user && (
                        <div className="userInfo">
                            <div className="userInfoItem">
                                <i className="fa-solid fa-user"></i>
                                <span>{user.name}</span>
                            </div>
                            <div className="userInfoItem">
                                <i className="fa-regular fa-envelope"></i>
                                <span>{user.email}</span>
                            </div>
                        </div>
                    )}

                    <div className="dropDownItem">
                        <i className="fa-solid fa-arrow-up"></i> Upgrade Plan
                        <span className="comingSoon">Soon</span>
                    </div>

                    <div className="dropDownItem" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>
)}

            <Chat/>

            <ScaleLoader color="#fff" loading={loading}/>

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        className="input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") getReply();
                        }}
                    />

                   
                    <div
                        id="mic"
                        onClick={startListening}
                        title={listening ? "Listening..." : "Click to speak"}
                        style={{ color: listening ? "#2dd4bf" : "white", cursor: "pointer", marginRight: "8px" }}
                    >
                        <i className={listening ? "fa-solid fa-microphone-lines" : "fa-solid fa-microphone"}></i>
                    </div>

                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    logix can make mistakes. check important info. see cookie preferences.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;