import React from "react";
import { useEffect, useState } from "react";
import "../globals.css";
import { User } from "../Interfaces";

const ChatElement = ({
  name,
  openChat,
}: {
  name: string;
  openChat: () => void;
}) => {
  return (
    <button
      className="bg-stone-900 text-left p-2 mx-2 mt-2"
      onClick={(e) => openChat()}
    >
      {name}
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
  const [chats, setChats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatIds, setChatIds] = useState<string[]>([]);

  const user = new User(name);

  useEffect(() => {
    const getChats = async () => {
      setChats(
        (await user.getChats()).map((chat) => {
          return chat.chatName
            ? chat.chatName
            : chat.members.filter((m) => m != name).join(", ");
        })
      );
      setChatIds(await user.getChatsIds());

      setIsLoading(false);
    };

    getChats();
  }, []);

  if (isLoading === true) {
    return <></>;
  }

  return (
    <div className="flex flex-col grow justify-between">
      <div className="flex flex-col overflow-scroll gap-1">
        {chats.map((chat, index) => (
          <ChatElement
            key={index}
            name={chat}
            openChat={() => openChat(chatIds[index])}
          />
        ))}
      </div>
      <button
        className="bg-stone-700 text-left p-2 m-2"
        onClick={(e) => openUsersList()}
      >
        Find Users
      </button>
    </div>
  );
};
