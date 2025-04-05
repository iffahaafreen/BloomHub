import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { marked } from "marked"; // use this for markdown rendering

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { sender: "bot", text: "Hi, I'm Sakhi.AI, your Companion for your needs. How can I help you today?" }
    ]);

    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]); // scroll when chat updates

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newChat = [...chat, { sender: "user", text: message }];
        setChat(newChat);

        try {
            const res = await axios.post("http://127.0.0.1:5000/api/chat", {
                message: `You are Sakhi.AI, a female companion for women. If possible, analyse tones and appear elegant and graceful in your answers. Provide concise answers in **max 10-20 lines**, avoid long paragraphs, and format your answers in Markdown.\n\nUser: ${message}`,
            });

            const reply = res.data.candidates[0].content.parts[0].text;

            setChat([...newChat, { sender: "bot", text: reply }]);
            setMessage("");
        } catch (error) {
            console.error("Error:", error);
            setChat([...newChat, { sender: "bot", text: "Oops! Something went wrong." }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <h2 className="chatbotheading">Sakhi.AI</h2>
            <div id="messageHolder" className="message-holder">
                {chat.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                        <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something..."
                rows="3"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chatbot;
