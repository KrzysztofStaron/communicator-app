"use client";

import { useEffect, useState } from "react";
import { Chat, ChatData, Message } from "./Chat";

const InputField = ({ chat }: { chat: Chat }) => {
  const [message, setMessage] = useState<string>("");

  return (
    <div>
      <input
        type="text"
        className="text-black"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button onClick={(e) => chat.send(message)}>SEND</button>
    </div>
  );
};

export default function Home() {
  const [chatMessages, setChatMessages] = useState<Message[]>();

  const chat = new Chat("test", "chat"); // userID, chatID

  useEffect(() => {
    chat.subscribe((doc: ChatData) => {
      setChatMessages(doc.messages);
    });
  }, []);

  return (
    <div>
      {chatMessages?.map((m, i) => (
        <div key={i}>{m.content}</div>
      ))}
      <InputField chat={chat} />
    </div>
  );
}
