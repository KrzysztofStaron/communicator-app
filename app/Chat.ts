import { db } from "./firebase";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

export type ChatData = {
  messages: Message[];
};

export type Message = {
  content: string;
};

export class Chat {
  userID: string;
  chatID: string;
  messages: Message[];
  unsub: (() => void) | undefined;

  constructor(userID: string, chatId: string) {
    this.userID = userID;
    this.chatID = chatId;
    this.messages = [];
  }

  public async subscribe(callback: (chatData: ChatData) => void) {
    this.unsub = onSnapshot(doc(db, this.userID, this.chatID), (doc: any) => {
      const data = doc.data();
      this.messages = data.messages;
      console.log(this.messages);
      callback(data);
    });
  }

  public unsubscribe() {
    if (this.unsub) {
      this.unsub();
    }
  }

  public async send(msg: string) {
    const ref = doc(db, this.userID, this.chatID);

    const data = await getDoc(ref);

    await updateDoc(ref, {
      messages: [...data!.data()?.messages, { content: msg }],
    });
  }
}
