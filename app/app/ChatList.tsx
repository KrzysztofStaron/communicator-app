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
  name,
  openChat,
  openUsersList,
}: {
  name: string;
  openChat: (index: string) => void;
  openUsersList: () => void;
}) => {
  const [chats, setChats] = useStorage<string[]>("chats", []);
  const [isLoading, setIsLoading] = useState(true);
  const [chatIds, setChatIds] = useState<string[]>([]);
  const [email, setEmail] = useStorage<string>("email");

  const user = new User(name);

  useEffect(() => {
    console.log("chat list");
    const getChats = async () => {
      setChats(
        await Promise.all(
          (
            await user.getChatsIds()
          ).map(async (chat) => {
            const newChat = new Chat(name, chat);
            return await newChat.getName();
          })
        )
      );
      console.log("db chats");

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
          {chats?.map((chat, index) => (
            <ChatElement
              key={index}
              name={chat}
              openChat={() => openChat(chatIds[index])}
            />
          ))}
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
