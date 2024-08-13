import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export type ChatData = {
  chatName: string;
  messages: Message[];
};

export type Message = {
  author: string;
  content: string;
};

export class Chat {
  userID: string;
  chatID: string;
  unsub: (() => void) | undefined;

  constructor(userID: string, chatId = "") {
    this.userID = userID;
    this.chatID = chatId;
  }

  public async open(callback: (chatData: ChatData) => void) {
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

  public async create(user: string) {
    console.log(user);

    const myChats = await new User(user).getChatsIds();
    const theirChats = await new User(this.userID).getChatsIds();

    const overlappingChats = myChats.filter((chatId) =>
      theirChats.includes(chatId)
    );

    if (overlappingChats.length > 0) {
      return overlappingChats[0];
    }

    const ref = collection(db, "chats");

    const newChat = await addDoc(ref, {
      chatName: user,
      messages: [],
    });

    const mineChats = await new User(this.userID).getChatsIds();
    const connectedChats = await new User(user).getChatsIds();

    setDoc(doc(db, "users", this.userID), {
      chats: [...mineChats, newChat.id],
    });
    setDoc(doc(db, "users", user), { chats: [...connectedChats, newChat.id] });

    return newChat.id;
  }

  public async close() {
    if (this.unsub) {
      console.log("uns sub");

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
}

export class User {
  userID: string;
  constructor(userID: string) {
    this.userID = userID;
  }

  public async getChatsIds(): Promise<string[]> {
    const userChats = await getDoc(doc(db, "users", this.userID));
    return userChats.data()?.chats;
  }

  public async getChats(): Promise<ChatData[]> {
    const userChats = await this.getChatsIds();

    let chats: ChatData[] = [];
    for (let i = 0; i < userChats.length; i++) {
      const chatData = await getDoc(doc(db, "chats", userChats[i]));

      chats.push(chatData.data() as ChatData);
    }

    return chats;
  }
}

export class DataHelper {
  static async getUsers() {
    const users = await getDocs(collection(db, "users"));
    return users.docs.map((doc) => doc.id);
  }

  static async startChat() {
    getDoc;
  }
}
