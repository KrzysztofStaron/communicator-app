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
    <div>
      {users.map((user, i) =>
        name !== user ? (
          <button key={i} onClick={() => openChat(user)}>
            {user}
          </button>
        ) : null
      )}
    </div>
  );
};

export default UsersList;
