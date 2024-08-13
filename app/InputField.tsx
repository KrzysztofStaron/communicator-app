import { useState, useEffect, useRef } from "react";
import { Chat } from "./Interfaces";
import { IoIosSend } from "react-icons/io";
import { throttle } from "lodash";

const MAXHEIGHT = 96; // Max height in pixels (24px * 4)

export const InputField = ({ chat }: { chat: Chat }) => {
  const [message, setMessage] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    if (message.trim()) {
      chat.send(message.trim());
      setMessage("");
    }
  };

  // Auto-expand the textarea as the user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        MAXHEIGHT
      )}px`;
    }
  }, [message]);

  return (
    <div className="mx-2 mb-2 flex items-end bg-stone-900 rounded-2xl">
      <div className="flex-grow min-h-10 flex items-center py-2 pl-1">
        <textarea
          ref={textareaRef}
          className="bg-transparent focus:outline-none resize-none rounded-xl px-2 w-full"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent adding a new line
              send();
            }
          }}
          value={message}
          placeholder="Type your message..."
          rows={1} // Initial row count
          style={{ maxHeight: `${MAXHEIGHT}px`, overflowY: "auto" }} // Ensure textarea scrolls when max height is reached
        />
      </div>

      <button
        onClick={() => send()}
        className="h-10 w-10 flex justify-center items-center pr-1"
      >
        <IoIosSend fontSize={24} />
      </button>
    </div>
  );
};
