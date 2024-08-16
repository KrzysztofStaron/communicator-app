import React from "react";
import { useEffect, useState } from "react";
import "../globals.css";
import { Chat, User } from "../Interfaces";
import Spinner from "../spinner/spinner";
import { FaSearch } from "react-icons/fa";
import { useCashe } from "../useCashe";
import { IoMdSettings } from "react-icons/io";
import { HexColorPicker } from "react-colorful";
import { debounce } from "lodash";
import { auth } from "../firebase";

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
  const [chats, setChats] = useCashe<string[]>("chats", []);
  const [isLoading, setIsLoading] = useState(true);
  const [chatIds, setChatIds] = useCashe<string[]>("chatIds", []);
  const [email, setEmail] = useCashe<string>("email");
  const [displayProfileSettings, setDisplayProfileSettings] = useState(false);
  const [color, setColor] = useState("#aabbcc");

  const user = new User(userId);

  const colorDebounce = debounce(() => {
    user.saveProfile(color);
  }, 300);

  useEffect(() => {
    colorDebounce();
  }, [color]);

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
      setColor(await user.getProfile());

      setIsLoading(false);
    };
    getChats();
  }, []);

  return (
    <>
      <div className="w-full flex bg-stone-900 h-8 text-lg px-2 gap-4">
        <p className="flex-grow appear">{`${email}' chats:`}</p>
        <button
          className="flex items-center justify-center"
          onClick={(e) => {
            setDisplayProfileSettings((prev) => !prev);
          }}
        >
          <IoMdSettings size={22} />
        </button>
      </div>
      <div className="flex flex-col grow justify-between">
        {displayProfileSettings ? (
          <div>
            <div className="text-left m-2 bg-stone-800 p-2 flex items-center">
              <button className="grow text-left">{email}</button>
              <div
                className="h-6 w-6 rounded-full border-2"
                style={{ backgroundColor: color }}
              ></div>
            </div>
            <div className="flex justify-center">
              <HexColorPicker color={color} onChange={setColor} />
            </div>
            <button
              onClick={(e) => {
                auth.signOut();
                window.location.href = "/";
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
};
