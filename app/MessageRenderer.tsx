import { useEffect, useRef } from "react";
import { Message } from "./Chat";

export const MessagesRenderer = ({
  messages,
  myName,
}: {
  messages: Message[];
  myName: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="grow flex flex-col gap-1 px-2 pt-2 overflow-scroll my-2"
      ref={containerRef}
    >
      {messages.map((m, i) => {
        const isMe = m.author == myName;
        const topNeighbour =
          messages[i - 1] !== undefined && messages[i - 1].author === m.author;
        const bottomNeighbour =
          messages[i + 1] !== undefined && messages[i + 1].author === m.author;
        return (
          <div
            key={i}
            className={`flex showWindow ${
              isMe ? "justify-end" : "justify-start"
            } break-words`}
          >
            <div
              className={`py-2 min-w-8 px-4 ${
                isMe
                  ? `bg-blue-600 rounded-l-3xl ml-20 ${
                      topNeighbour ? "rounded-tr-md" : "rounded-tr-3xl"
                    } ${bottomNeighbour ? "rounded-br-md" : "rounded-br-3xl"}`
                  : `bg-gray-500 rounded-r-3xl mr-20 ${
                      topNeighbour ? "rounded-tl-md" : "rounded-tl-3xl"
                    } ${bottomNeighbour ? "rounded-bl-md" : "rounded-bl-3xl"}`
              }`}
            >
              {m.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
