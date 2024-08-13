import { useEffect, useRef } from "react";
import { Message } from "./Interfaces";
import "./typing.css";

export const MessagesRenderer = ({
  messages,
  myName,
  writing,
}: {
  messages: Message[];
  myName: string;
  writing?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (writing === false) {
      return;
    }

    if (containerRef.current) {
      const scrollHeight = containerRef.current.scrollHeight;
      const scrollTop = containerRef.current.scrollTop;
      const clientHeight = containerRef.current.clientHeight;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceToBottom < 40) {
        containerRef.current.scrollTop = scrollHeight;
      }
    }
  }, [writing]);

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
            className={`flex appear ${
              isMe ? "justify-end" : "justify-start"
            } break-words`}
          >
            <div
              className={`py-2 min-w-8 px-4 ${
                isMe
                  ? `bg-blue-600 rounded-l-3xl ml-20 ${
                      topNeighbour ? "rounded-tr-md" : "rounded-tr-3xl"
                    } ${bottomNeighbour ? "rounded-br-md" : "rounded-br-3xl"}`
                  : `bg-stone-600 rounded-r-3xl mr-20 ${
                      topNeighbour ? "rounded-tl-md" : "rounded-tl-3xl"
                    } ${bottomNeighbour ? "rounded-bl-md" : "rounded-bl-3xl"}`
              }`}
            >
              {m.content}
            </div>
          </div>
        );
      })}
      {writing ? (
        <div
          className={`flex appear break-words py-2 min-w-8 px-4 rounded-2xl bg-stone-600 w-min mt-1`}
        >
          <span className="circle scaling"></span>
          <span className="circle scaling"></span>
          <span className="circle scaling"></span>
        </div>
      ) : null}
    </div>
  );
};
