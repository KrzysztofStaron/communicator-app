"use client";

import { useEffect, useState } from "react";
import { Chat, ChatData, Message } from "./Chat";

const userID = "you";

const MessagesRenderer = ({ messages }: { messages: Message[] }) => {
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="grow flex flex-col gap-1 px-2 pt-2">
      {messages.map((m, i) => {
        const isMe = m.author == userID;
        const topNeighbour =
          messages[i - 1] !== undefined && messages[i - 1].author === m.author;
        const bottomNeighbour =
          messages[i + 1] !== undefined && messages[i + 1].author === m.author;
        return (
          <div
            key={i}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`py-2 min-w-8 px-4 text-center ${
                isMe
                  ? `bg-blue-500 rounded-l-3xl ${
                      topNeighbour ? "rounded-tr-md" : "rounded-tr-3xl"
                    } ${bottomNeighbour ? "rounded-br-md" : "rounded-br-3xl"}`
                  : `bg-gray-500 rounded-r-3xl ${
                      topNeighbour ? "rounded-tl-md" : "rounded-tl-3xl"
                    } ${bottomNeighbour ? "rounded-bl-md" : "rounded-bl-3xl"}`
              }`}
            >
              {m.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
const InputField = ({ chat }: { chat: Chat }) => {
  const [message, setMessage] = useState<string>("");

  const send = () => {
    chat.send(message);
    setMessage("");
  };

  return (
    <div className="bg-red-400">
      <input
        type="text"
        className="text-black"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            send();
          }
        }}
        value={message}
      />
      <button
        onClick={(e) => {
          send();
        }}
      >
        SEND
      </button>
    </div>
  );
};

export default function Home() {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const chat = new Chat("test", "chat"); // userID, chatID

  useEffect(() => {
    chat.subscribe((doc: ChatData) => {
      setChatMessages(doc.messages);
    });
  }, []);

  return (
    <div className="flex w-screen h-screen flex-col">
      <MessagesRenderer messages={chatMessages} />
      <InputField chat={chat} />
    </div>
  );
}
