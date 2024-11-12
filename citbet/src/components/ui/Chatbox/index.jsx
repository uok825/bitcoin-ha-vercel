import React, { useState, useEffect } from "react";
import { MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import styles from "./Chatbox.module.css";
import { getMessages, sendMessage } from "../../../utils/fetchFunctions";

export default function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);

  useEffect(() => {
    if (!parsedUser) {
      return;
    }

    const fetchMessages = async () => {
      const fetchedData = await getMessages();
      if (fetchedData && fetchedData.events) {
        const formattedMessages = fetchedData.events
          .map((event) => ({
            position: "right",
            type: "text",
            text: event.Content.replace(/^betrea:\s*/i, ""),
            date: event.createdAt,
            title: event.PubKey.slice(0, 8) + "...",
          }))
          .sort((a, b) => a.date - b.date); // Sort by date in ascending order (oldest to newest)

        setMessages(formattedMessages); // Set messages in the desired order
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
        title: parsedUser.nostrPub.slice(0, 8) + "...",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      sendMessage(inputMessage, parsedUser.nostrSk);
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
        className={styles.input}
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
