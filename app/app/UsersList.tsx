import React, { useEffect, useState } from "react";
import { DataHelper, User, UserData } from "../Interfaces";
import { IoArrowForward } from "react-icons/io5";
import Spinner from "../spinner/spinner";

const UsersList = ({
  openChat,
  name,
  openChatList,
}: {
  openChat: (user: string) => void;
  name: string;
  openChatList: () => void;
}) => {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      setUsers(await DataHelper.getUsers());
    };

    getUsers();
  }, []);

  if (users.length === 0) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <button
        onClick={() => openChatList()}
        className="flex items-center justify-end mr-2 my-2"
      >
        <IoArrowForward size={24} />
      </button>
      {users.map((user, i) =>
        name !== user.id ? (
          <div
            className="text-left m-2 bg-stone-800 p-2 flex justify-between items-center"
            key={i}
          >
            <button
              onClick={() => openChat(user.id)}
              className="grow text-left"
            >
              {user.email}
            </button>
            <div className="bg-green-400 h-6 w-6 rounded-full"></div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default UsersList;
