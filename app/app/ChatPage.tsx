import { useEffect } from "react";
import { Chat, ChatData, Message } from "../Interfaces";
import { useStorage } from "../useStorage";
import { IoIosArrowBack } from "react-icons/io";
import { InputField } from "./InputField";
import { MessagesRenderer } from "./MessageRenderer";

export const ChatPage = ({
  userId,
  openChatsList,
  chatID,
}: {
  userId: string;
  openChatsList: () => void;
  chatID: string;
}) => {
  const [chatMessages, setChatMessages] = useStorage<Message[]>(chatID, []);
  const [chatName, setChatName] = useStorage(`${chatID}_name`, "");

  const chat = new Chat(userId, chatID);

  useEffect(() => {
    chat.open((doc: ChatData) => {
      setChatMessages(doc.messages);
      chat.getName().then((chatName) => {
        setChatName(chatName);
      });
    });

    return () => {
      chat.close();
    };
  }, []);

  return (
    <div className="flex w-screen h-screen flex-col">
      <div className="w-full flex bg-stone-900 h-8 text-lg px-2 gap-4">
        <button
          onClick={() => openChatsList()}
          className="flex items-center justify-center"
        >
          <IoIosArrowBack />
        </button>
        {chatName === "" ? null : (
          <p className="flex-grow appear">{chatName}</p>
        )}
      </div>
      <MessagesRenderer messages={chatMessages!} myId={userId} />
      <InputField chat={chat} />
    </div>
  );
};
