import React from "react";
import { useEffect, useState } from "react";
import "../globals.css";
import { Chat, User } from "../Interfaces";
import Spinner from "../spinner/spinner";
import { FaSearch } from "react-icons/fa";
import { useStorage } from "../useStorage";

const ChatElement = ({
  name,
  openChat,
}: {
  name: string;
  openChat: () => void;
}) => {
  return (
    <button
      className="bg-stone-900 p-2 mx-2 mt-3 rounded-xl pl-2 flex justify-start"
      onClick={(e) => openChat()}
    >
      <p className="pl-2">{name}</p>
    </button>
  );
};

export const ChatList = ({
  userId,
  openChat,
  openUsersList,
}: {
  userId: string;
  openChat: (index: string) => void;
  openUsersList: () => void;
}) => {
  const [chats, setChats] = useStorage<string[]>("chats", []);
  const [isLoading, setIsLoading] = useState(true);
  const [chatIds, setChatIds] = useStorage<string[]>("chatIds", []);
  const [email, setEmail] = useStorage<string>("email");

  const user = new User(userId);

  useEffect(() => {
    const getChats = async () => {
      const ids = await user.getChatsIds();

      let newChats = [];
      for (let i = 0; i < ids.length; i++) {
        const newChat = new Chat(userId, ids[i]);
        newChats.push(await newChat.getName());
      }

      setChats(newChats);

      setChatIds(await user.getChatsIds());
      setEmail(await user.getName());

      setIsLoading(false);
    };
    getChats();
  }, []);

  return (
    <>
      <div className="w-full flex bg-stone-900 h-8 text-lg px-2 gap-4">
        <p className="flex-grow appear">{`${email}' chats:`}</p>
      </div>
      <div className="flex flex-col grow justify-between">
        <div className="flex flex-col overflow-scroll gap-1">
          {chatIds
            ? chats?.map((chat, index) => (
                <ChatElement
                  key={index}
                  name={chat}
                  openChat={() => openChat(chatIds[index])}
                />
              ))
            : null}
          {isLoading ? (
            <div className="flex w-full justify-center">
              <Spinner />
            </div>
          ) : null}
          {chats?.length === 0 && !isLoading ? (
            <p className="w-full text-center">No Chats</p>
          ) : null}
        </div>
        <button
          className="bg-stone-700 text-left p-2 m-2 flex items-center justify-between"
          onClick={() => openUsersList()}
        >
          Find Users
          <FaSearch />
        </button>
      </div>
    </>
  );
};
