import React, { useEffect, useState } from "react";
import { DataHelper } from "./Interfaces";

const UsersList = ({
  openChat,
  name,
}: {
  openChat: (user: string) => void;
  name: string;
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
