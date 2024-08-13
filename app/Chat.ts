import { db } from "./firebase";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

export type ChatData = {
  chatName: string;
  messages: Message[];
  writing: { [key: string]: number };
};

export type Message = {
  author: string;
  content: string;
};

export class Chat {
  userID: string;
  chatID: string;
  unsub: (() => void) | undefined;

  constructor(userID: string, chatId: string) {
    this.userID = userID;
    this.chatID = chatId;
  }

  public async subscribe(callback: (chatData: ChatData) => void) {
    const ref = doc(db, "chats", this.chatID);
    const chat = await getDoc(ref);

    if (chat.exists() === false) {
      return new Error("chat doesn't exist");
    }

    this.unsub = onSnapshot(ref, (doc: any) => {
      const data = doc.data();
      callback(data);
    });
  }

  public unsubscribe() {
    if (this.unsub) {
      this.unsub();
    }
  }

  public async send(msg: string) {
    const ref = doc(db, "chats", this.chatID);

    const data = await getDoc(ref);

    await updateDoc(ref, {
      messages: [
        ...data!.data()?.messages,
        { author: this.userID, content: msg },
      ],
    });
  }

  public async write(isWriting = true) {
    const ref = doc(db, "chats", this.chatID);
    console.log("write");

    const payload = isWriting ? Date.now() : Infinity;

    await updateDoc(ref, {
      writing: {
        [this.userID]: payload,
      },
    });
  }
}
