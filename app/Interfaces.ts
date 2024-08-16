import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy, // Add this line
} from "firebase/firestore";

export type Theme = {
  name: string;
  primary: string;
  secondary: string;
};

export type ChatData = {
  members: string[];
  settings: ChatSettings;
  messages: Message[];
};

export type Message = {
  author: string;
  content: string;
};

export type UserData = {
  email: string;
  profile: string;
  id: string;
};

export type ChatSettings = {
  chatName: string;
  theme: number;
};

export const themes: Theme[] = [
  {
    name: "standart",
    primary: "bg-blue-600",
    secondary: "bg-stone-600",
  },
  {
    name: "dark",
    primary: "bg-gray-900",
    secondary: "bg-stone-800",
  },
  {
    name: "love",
    primary: "bg-pink-700",
    secondary: "bg-rose-800",
  },
  {
    name: "citrus",
    primary: "bg-yellow-800",
    secondary: "bg-green-800",
  },
];

export class Chat {
  userID: string;
  chatID: string;
  unsub: (() => void) | undefined;
  chatData: ChatData | undefined;

  constructor(userID: string, chatId = "") {
    this.userID = userID;
    this.chatID = chatId;
  }

  public async setTheme(theme: number) {
    const ref = doc(db, "chats", this.chatID);

    await updateDoc(ref, { settings: { theme: theme } });
  }

  public async getSettings() {
    const ref = doc(db, "chats", this.chatID);
    const chat = await getDoc(ref);

    if (!chat.exists()) {
      throw new Error("Chat doesn't exist");
    }

    return chat.data() as ChatSettings;
  }

  public async saveSettings(set: ChatSettings | any) {
    const ref = doc(db, "chats", this.chatID);

    await updateDoc(ref, { settings: set });
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

  public async getEmail() {
    if (!this.chatID) {
      throw new Error("chatID not set");
    }
    if (!this.chatData) {
      const chatDoc = await getDoc(doc(db, "chats", this.chatID));
      this.chatData = chatDoc.data() as ChatData;
    }
    const membersEmails: string[] = [];
    const members = this.chatData.members.filter((m) => m !== this.userID);
    for (const memberID of members) {
      const user = new User(memberID);
      const userEmail = await user.getName();
      membersEmails.push(userEmail);
    }

    return membersEmails.join(", ");
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
    const members = this.chatData.members.filter((m) => m !== this.userID);

    for (let i = 0; i < members.length; i++) {
      const user = new User(members[i]);
      const userEmail = await user.getName();
      membersEmails.push(userEmail);
    }

    return this.chatData.settings?.chatName
      ? this.chatData.settings?.chatName
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
      ...DataHelper.emptyChatData(),
      members: [this.userID, user],
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

  public async saveProfile(profile: string) {
    const ref = doc(db, "users", this.userID);

    await updateDoc(ref, { profile: profile });
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
    await setDoc(doc(db, "users", userID), {
      email: email,
      chats: [],
      profile: "",
    });
  }

  static async exists(userID: string) {
    const user = await getDoc(doc(db, "users", userID));
    return user.exists();
  }
}

export class DataHelper {
  static async getUsers(queryText: string) {
    const ref = collection(db, "users");
    const q = query(ref, where("email", ">=", queryText), orderBy("email")); // Add orderBy("email") to sort the results
    const users = await getDocs(q);
    return users.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email,
      profile: doc.data().profile,
    }));
  }

  static emptyChatSettings(): ChatSettings {
    return {
      chatName: "",
      theme: 0,
    };
  }

  static emptyChatData(): ChatData {
    return {
      members: [],
      settings: DataHelper.emptyChatSettings(),
      messages: [],
    };
  }
}
