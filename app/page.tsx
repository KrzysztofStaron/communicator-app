import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

class Chat {
  userID: string;
  chatID: string;
  constructor(userID: string, chatId: string) {
    this.userID = userID;
    this.chatID = chatId;
  }
  public async connect() 
    this.unsub = onSnapshot(doc(db, this.userID, this.chatID), (doc) => {
      console.log("Current data: ", doc.data());
  });)
  }
}

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
