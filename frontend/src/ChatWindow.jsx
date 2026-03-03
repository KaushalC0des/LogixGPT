import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {

    const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsopen] = useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
         console.log("message:", prompt, "threadId:", currThreadId);

        const options = {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            message: prompt,
            threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:5000/api/chat", options);
            const data = await response.json();

            console.log("🤖 AI reply (from backend):", data.reply); // ✅ This will print in browser console

            // If you want to store it in state:
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
    }

    return (
            <div className="chatWindow">
                <div className="navbar">
                    <span>Logix <i className=" fa-solid fa-chevron-down"></i></span>
            
                    <div className="userIconDiv" onClick={handleProfileClick}>
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    </div>
                </div>

                {
                    isOpen &&
                    <div className="dropDown">
                        <div className="dropDownItem"> <i class="fa-solid fa-gear"></i> Settings</div>
                          <div className="dropDownItem" > <i class="fa-solid fa-arrow-up"></i> Upgrade Plan </div>
                        <div className="dropDownItem"> <i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                    </div>
                }
                
                <Chat/>

                <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

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

                        <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                    </div>
                    <p className="info">
                        logix can make mistakes. check important info. see cookie prefrences.
                    </p>
                </div>
            </div>
    )
}

export default ChatWindow;