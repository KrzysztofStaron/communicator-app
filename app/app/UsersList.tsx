import React, { useEffect, useState } from "react";
import { DataHelper, User, UserData } from "../Interfaces";
import { IoArrowForward } from "react-icons/io5";
import Spinner from "../spinner/spinner";
import { useCashe } from "../useCashe";
import { FaSearch } from "react-icons/fa";
import { debounce } from "lodash";

const UsersList = ({
  openChat,
  name,
  openChatList,
}: {
  openChat: (user: string) => void;
  name: string;
  openChatList: () => void;
}) => {
  const [users, setUsers] = useCashe<UserData[]>("userList_users", []);
  const [isLoading, setIsLoading] = useState(true);
  const [queryText, setQueryText] = useState("");
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    DataHelper.getUsers(queryText).then((users) => {
      setUsers(users);
      setIsLoading(false);
    });
  }, []);

  const debouncedGetUsers = debounce(() => {
    DataHelper.getUsers(queryText).then((users) => {
      console.log(users);

      setUsers(users);
    });
  }, 500);

  useEffect(() => {
    debouncedGetUsers();
  }, [queryText]);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => openChatList()}
        className="flex items-center justify-end mr-2 my-2"
      >
        <IoArrowForward size={24} />
      </button>
      <div className="flex justify-center">
        <input
          type="text"
          className="bg-transparent border-b-2 w-8/12 focus:outline-none"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <FaSearch />
      </div>
      {users?.map((user, i) =>
        name !== user.id ? (
          <div
            className="text-left m-2 bg-stone-800 p-2 flex justify-between items-center"
            key={i}
          >
            <button
              onClick={(e) => {
                if (opening === false) {
                  setOpening(true);
                  openChat(user.id);
                }
              }}
              className="grow text-left"
            >
              {user.email}
            </button>
            <div
              className="h-6 w-6 rounded-full border-2"
              style={{ backgroundColor: user.profile }}
            ></div>
          </div>
        ) : null
      )}
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Spinner />
        </div>
      ) : null}
    </div>
  );
};

export default UsersList;
