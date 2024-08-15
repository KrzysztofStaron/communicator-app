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
  members: string[];
  messages: Message[];
};

export type Message = {
  author: string;
  content: string;
};

export type UserData = {
  email: string;
  id: string;
};

export class Chat {
  userID: string;
  chatID: string;
  unsub: (() => void) | undefined;
  chatData: ChatData | undefined;

  constructor(userID: string, chatId = "") {
    this.userID = userID;
    this.chatID = chatId;
  }

  public async open(callback: (chatData: ChatData) => void) {
    const ref = doc(db, "chats", this.chatID);
    const chat = await getDoc(ref);

    if (!chat.exists()) {
      throw new Error("Chat doesn't exist");
    }

    this.unsub = onSnapshot(ref, (doc: any) => {
      const data = doc.data();
      this.chatData = data;

      callback(data);
    });
  }

  public async getName() {
    if (!this.chatID) {
      throw new Error("chatID not set");
    }
    if (!this.chatData) {
      const chatDoc = await getDoc(doc(db, "chats", this.chatID));
      this.chatData = chatDoc.data() as ChatData;
    }
    const membersEmails: string[] = [];
    this.chatData.members = this.chatData.members.filter(
      (m) => m !== this.userID
    );

    for (let i = 0; i < this.chatData.members.length; i++) {
      const user = new User(this.chatData.members[i]);
      const userEmail = await user.getName();
      membersEmails.push(userEmail);
    }

    return this.chatData.chatName
      ? this.chatData.chatName
      : membersEmails.join(", ");
  }

  public async create(user: string) {
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
      chatName: "",
      members: [this.userID, user],
      messages: [],
    });

    const mineChats = await new User(this.userID).getChatsIds();
    const connectedChats = await new User(user).getChatsIds();

    await updateDoc(doc(db, "users", this.userID), {
      chats: [...mineChats, newChat.id],
    });
    await updateDoc(doc(db, "users", user), {
      chats: [...connectedChats, newChat.id],
    });

    return newChat.id;
  }

  public async close() {
    if (this.unsub) {
      this.unsub();
    }
  }

  public async send(msg: string) {
    const ref = doc(db, "chats", this.chatID);

    const data = await getDoc(ref);

    await updateDoc(ref, {
      messages: [
        ...(data!.data()?.messages || []),
        { author: this.userID, content: msg },
      ],
    });
  }
}

export class User {
  userID: string;
  email: string;

  constructor(userID: string) {
    this.userID = userID;
    this.email = "";
  }

  public async getChatsIds(): Promise<string[]> {
    const userChats = await getDoc(doc(db, "users", this.userID));
    return userChats.data()?.chats ?? [];
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

  public async getName(): Promise<string> {
    if (this.email) {
      return this.email;
    }

    const userDoc = await getDoc(doc(db, "users", this.userID));
    this.email = userDoc.data()?.email;

    return userDoc.data()?.email;
  }

  static async createUser(userID: string, email: string) {
    await setDoc(doc(db, "users", userID), { email: email, chats: [] });
  }

  static async exists(userID: string) {
    const user = await getDoc(doc(db, "users", userID));
    return user.exists();
  }
}

export class DataHelper {
  static async getUsers() {
    const users = await getDocs(collection(db, "users"));
    return users.docs.map((doc) => ({ id: doc.id, email: doc.data().email }));
  }

  static async startChat() {
    getDoc;
  }
}
