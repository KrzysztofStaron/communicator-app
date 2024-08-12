import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import "./globals.css";

const ChatElement = ({
  name,
  openChat,
}: {
  name: string;
  openChat: () => void;
}) => {
  return (
    <button className="bg-stone-900" onClick={(e) => openChat()}>
      {name}
    </button>
  );
};

export const ChatList = ({ name }: { name: string }) => {
  const [chats, setChats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatIds, setChatIds] = useState<string[]>([]);

  const openChat = (index: number) => {
    console.log(chatIds[index]);
  };

  useEffect(() => {
    const getChats = async () => {
      const userChats = await getDoc(doc(db, "users", name));

      let names: string[] = [];
      for (let i = 0; i < userChats.data()?.chats.length; i++) {
        const chatData = await getDoc(
          doc(db, "chats", userChats.data()?.chats[i])
        );

        names.push(chatData.data()?.chatName);
      }

      setChats(names);
      setChatIds(userChats.data()?.chats);

      setIsLoading(false);
    };

    getChats();
  }, []);

  if (isLoading === true) {
    return <></>;
  }

  return (
    <>
      {chats.map((chat, index) => (
        <ChatElement key={index} name={chat} openChat={() => openChat(index)} />
      ))}
    </>
  );
};
