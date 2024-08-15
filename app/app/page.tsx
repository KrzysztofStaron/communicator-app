"use client";

import React, { useEffect, useState } from "react";
import { Chat } from "../Interfaces";

import { ChatList } from "./ChatList";
import UsersList from "./UsersList";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Spinner from "../spinner/spinner";
import { ChatPage } from "./ChatPage";

export default function App() {
  const [userId, setUserId] = useState<string>("");
  const [activeView, setActiveView] = useState<string>("ChatList");
  const [chatID, setChatID] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuthenticated(true);
      setUserId(user.uid);
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  });

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
            userId={userId}
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
            userId={userId}
            openChatsList={() => setActiveView("ChatList")}
          />
        );
      case "UsersList":
        return (
          <UsersList
            name={userId}
            openChat={(user) => {
              const createChat = async () => {
                const chatId = await new Chat(userId).create(user);
                setChatID(chatId);
                setActiveView("Chat");
              };

              createChat();
            }}
            openChatList={() => setActiveView("ChatList")}
          />
        );
    }
  };

  if (!authenticated) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <div className="flex w-screen h-screen flex-col">{view()}</div>;
}
