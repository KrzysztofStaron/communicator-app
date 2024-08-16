import { useEffect, useState } from "react";
import {
  Chat,
  ChatData,
  ChatSettings,
  DataHelper,
  Message,
  themes,
} from "../Interfaces";
import { useCashe } from "../useCashe";
import { IoIosArrowBack, IoMdSettings } from "react-icons/io";
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
  const [chatMessages, setChatMessages] = useCashe<Message[]>(chatID, []);
  const [chatName, setChatName] = useCashe(`${chatID}_name`, "");

  const [displaySettings, setDisplaySettings] = useState(false);

  const [settings, setSettings] = useCashe<ChatSettings>(
    `${chatID}_settings`,
    DataHelper.emptyChatSettings()
  );

  const chat = new Chat(userId, chatID);

  useEffect(() => {
    chat.open((doc: ChatData) => {
      setChatMessages(doc.messages);
      setSettings(doc.settings);
      chat.getName().then((name) => setChatName(name));
    });

    return () => {
      chat.close();
    };
  }, []);

  return (
    <div className="flex w-screen h-screen flex-col">
      <div className="w-full flex bg-stone-900 h-8 text-lg px-2 gap-4">
        <button
          onClick={() => {
            chat.saveSettings(settings);
            openChatsList();
          }}
          className="flex items-center justify-center"
        >
          <IoIosArrowBack />
        </button>
        {chatName === "" ? (
          <p className="flex-grow"></p>
        ) : (
          <p className="flex-grow appear">{chatName}</p>
        )}
        <button
          className="flex items-center justify-center"
          onClick={(e) => {
            setDisplaySettings((prev) => !prev);
            chat.saveSettings(settings);
          }}
        >
          <IoMdSettings size={22} />
        </button>
      </div>
      {displaySettings ? (
        <Settings chat={chat} setDisplaySettings={setDisplaySettings} />
      ) : (
        <>
          <MessagesRenderer
            messages={chatMessages!}
            myId={userId}
            theme={themes[settings?.theme || 0]}
          />
          <InputField chat={chat} />
        </>
      )}
    </div>
  );
};

const Settings = ({
  chat,
  setDisplaySettings,
}: {
  chat: Chat;
  setDisplaySettings: (b: boolean) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {themes.map((t, i) => {
        return (
          <div className="flex justify-center items-center">
            <div className={`${t.secondary} w-5 h-5 rounded-full`}></div>
            <button
              onClick={() => {
                chat.setTheme(i);
                setDisplaySettings(false);
              }}
              className="w-32"
              key={i}
            >
              {t.name}
            </button>
            <div className={`${t.primary} w-5 h-5 rounded-full`}></div>
          </div>
        );
      })}
    </div>
  );
};
