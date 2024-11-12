import React, { useState, useEffect } from "react";
import { MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import styles from "./Chatbox.module.css";
import { getMessages, sendMessage } from "../../../utils/fetchFunctions";

export default function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const fetchedData = await getMessages();
      if (fetchedData && fetchedData.events) {
        const formattedMessages = fetchedData.events.map((event) => ({
          position: "right",
          type: "text",
          text: event.Content.replace(/^betrea:\s*/i, ""),
          date: new Date(),
          title: event.PubKey.slice(0, 8) + "...",
        }));
        setMessages(formattedMessages);
      }
    };
    fetchMessages();
  }, []);

  const handleSend = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        position: "right",
        type: "text",
        text: inputMessage,
        date: new Date(),
        title: "You",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");
    }
  };

  return (
    <div className={styles.container}>
      <MessageList
        className={styles.messageList}
        lockable={true}
        toBottomHeight={"100%"}
        dataSource={messages}
      />
      <Input
        placeholder="Type message here"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        rightButtons={
          <button onClick={handleSend} className={styles.sendButton}>
            Send
          </button>
        }
      />
    </div>
  );
}
