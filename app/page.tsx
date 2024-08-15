"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa6";
import { auth } from "./firebase";
import { User } from "./Interfaces";

const SubmitButton = ({
  text,
  valid,
  onClick,
}: {
  text: string;
  valid: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={`justify-center w-full border-2 ${
        valid
          ? "bg-stone-800 border-transparent hover:bg-stone-700"
          : "opacity-50 border-stone-900"
      } py-1  rounded-2xl`}
      onClick={() => {
        valid ? onClick() : null;
      }}
    >
      {text}
    </button>
  );
};
const CreateAccount = ({
  setActiveView,
  password,
  setPassword,
  email,
  setEmail,
  valid,
  loginError,
}: {
  setActiveView: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  valid: boolean;
  loginError: string;
}) => {
  const [passwordCopy, setPasswordCopy] = useState("");
  const [match, setMatch] = useState(true);

  useEffect(() => {
    setMatch(password === passwordCopy);
  }, [password, passwordCopy]);

  const handleSubmit = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        User.createUser(userCredential.user.uid, email).then(() => {
          window.location.href = "/app";
        });
      })
      .catch((error: any) => {
        const errorMessage = error.message;
      });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <label>Email:</label>
        <input
          type="text"
          className="text-white focus:outline-none bg-transparent border-b-2 border-stone-400 mb-2 placeholder:text-stone-500"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="example@email.com"
        />
      </div>
      <div>
        <label>Password:</label>
        <div className="flex flex-col gap-2">
          <input
            type="password"
            className="text-white focus:outline-none bg-transparent border-b-2 border-stone-400 placeholder:text-stone-500 p-1"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
          />
          <input
            type="password"
            className={`${
              match ? "text-white" : "text-red-400"
            } focus:outline-none bg-transparent border-b-2 border-stone-400 placeholder:text-stone-500 p-1`}
            onChange={(e) => setPasswordCopy(e.target.value)}
            value={passwordCopy}
            placeholder="Repeat Password"
          />
        </div>
      </div>

      <div>
        <SubmitButton
          text="Create Account"
          valid={valid && password === passwordCopy}
          onClick={() => handleSubmit()}
        />
        <div
          className={`text-sm text-blue-100 cursor-pointer hover:text-blue-300 tansition-all duration-200 ease-in-out `}
          onClick={() => setActiveView("login")}
        >
          Log in instead
        </div>
      </div>
    </div>
  );
};

const LogIn = ({
  setActiveView,
  password,
  setPassword,
  email,
  setEmail,
  valid,
  loginError,
}: {
  setActiveView: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  valid: boolean;
  loginError: string;
}) => {
  const handleSubmit = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        // Signed in
        const user = userCredential.user;
        window.location.href = "/app";
      })
      .catch((error: any) => {
        const errorMessage = error.message;
      });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <label>Email:</label>
        <input
          type="text"
          className="text-white focus:outline-none bg-transparent border-b-2 border-stone-400 placeholder:text-stone-500"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="example@email.com"
        />
      </div>
      <div className="flex flex-col">
        <label>Password:</label>
        <input
          type="password"
          className="text-white focus:outline-none bg-transparent border-b-2 border-stone-400 p-1 placeholder:text-stone-500"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="***"
        />
      </div>
      <div>
        <SubmitButton
          text="Log In"
          valid={valid}
          onClick={() => handleSubmit()}
        />
        <div
          className={`text-sm text-blue-100 cursor-pointer hover:text-blue-300 tansition-all duration-200 ease-in-out `}
          onClick={() => setActiveView("create")}
        >
          Create account
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeView, setActiveView] = useState("login");
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const provider = new GoogleAuthProvider();
  const [loginError, setLoginError] = useState("");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "/app";
    }
  });

  const google = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const handle = async () => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const user = result.user;

          if ((await User.exists(user.uid)) === false) {
            await User.createUser(user.uid, user.email || "");
          }

          window.location.href = "/app";
        };
        handle();
      })
      .catch((error) => {
        const errorMessage = error.message;
        setLoginError(errorMessage);

        const email = error.customData.email;
      });
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValid(
      email.trim() !== "" &&
        password.trim() !== "" &&
        password.length > 7 &&
        emailRegex.test(email)
    );
  }, [email, password]);

  useEffect(() => {
    console.log(valid);
  }, [valid]);

  return (
    <div className="flex items-center justify-center w-full h-screen flex-col">
      <div className="relative top-10">
        {activeView === "login" ? (
          <LogIn
            setActiveView={setActiveView}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            valid={valid}
            loginError={loginError}
          />
        ) : (
          <CreateAccount
            setActiveView={setActiveView}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            valid={valid}
            loginError={loginError}
          />
        )}
      </div>

      <button
        className="mt-20 flex items-center gap-2 bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        onClick={() => google()}
      >
        <FaGoogle />
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default App;
