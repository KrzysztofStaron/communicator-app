import React, { useEffect, useState } from "react";
import { DataHelper } from "../Interfaces";
import { IoArrowForward } from "react-icons/io5";

const UsersList = ({
  openChat,
  name,
  openChatList,
}: {
  openChat: (user: string) => void;
  name: string;
  openChatList: () => void;
}) => {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      setUsers(await DataHelper.getUsers());
    };

    getUsers();
  }, []);
  return (
    <div className="flex flex-col">
      <button
        onClick={() => openChatList()}
        className="flex items-center justify-end mr-2 my-2"
      >
        <IoArrowForward size={24} />
      </button>
      {users.map((user, i) =>
        name !== user ? (
          <div
            className="text-left m-2 bg-stone-800 p-2 flex justify-between items-center"
            key={i}
          >
            <button onClick={() => openChat(user)} className="grow text-left">
              {user}
            </button>
            <div className="bg-green-400 h-6 w-6 rounded-full"></div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default UsersList;
