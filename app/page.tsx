"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chat, ChatData, Message } from "./Interfaces";
import { MessagesRenderer } from "./MessageRenderer";
import { InputField } from "./InputField";
import { IoIosArrowBack } from "react-icons/io";
import { ChatList } from "./ChatList";
import UsersList from "./UsersList";

export default function App() {
  const [name, setName] = useState<string>("test_user_1");
  const [activeView, setActiveView] = useState<string>("Chat");
  const [chatID, setChatID] = useState<string>("chat");

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setActiveView("Debug");
      }
    });
  }, []);

  const view = () => {
    switch (activeView) {
      case "ChatList":
        return (
          <ChatList
            name={name}
            openChat={(ID: string) => {
              setChatID(ID);
              setActiveView("Chat");
            }}
            openUsersList={() => setActiveView("UsersList")}
          />
        );
      case "Chat":
        return (
          <ChatPage
            chatID={chatID}
            name={name}
            openChatsList={() => setActiveView("ChatList")}
          />
        );
      case "Debug":
        return (
          <>
            <input
              type="text"
              placeholder="name"
              className="text-black"
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={() => setActiveView("Chat")}>Log In</button>
          </>
        );
      case "UsersList":
        return (
          <UsersList
            name={name}
            openChat={(user) => {
              const createChat = async () => {
                const chatId = await new Chat(name).create(user);
                setChatID(chatId);
                setActiveView("Chat");
              };

              createChat();
            }}
          />
        );
    }
  };

  return <div className="flex w-screen h-screen flex-col">{view()}</div>;
}

const ChatPage = ({
  name,
  openChatsList,
  chatID,
}: {
  name: string;
  openChatsList: () => void;
  chatID: string;
}) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatName, setChatName] = useState("");

  const chat = new Chat(name, chatID);

  useEffect(() => {
    chat.open((doc: ChatData) => {
      setChatMessages(doc.messages);
      setChatName(doc.chatName);
    });

    return () => {
      chat.close();
    };
  }, []);

  return (
    <div className="flex w-screen h-screen flex-col">
      <div className="w-full flex bg-stone-900 h-8 text-lg px-2 gap-4">
        <button
          onClick={() => openChatsList()}
          className="flex items-center justify-center"
        >
          <IoIosArrowBack />
        </button>
        <p className="flex-grow appear">{chatName}</p>
      </div>
      <MessagesRenderer messages={chatMessages} myName={name} />
      <InputField chat={chat} />
    </div>
  );
};
