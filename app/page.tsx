"use client";

import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";
import { socket } from "./lib/socketClient";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessages((prev) => [...prev, { sender: userName, message }]);

    socket.emit("message", data);
  };

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, userName: userName });
      setJoined(true);
    }
  };

  return (
    <div className=" flex justify-center w-full mt-24">
      {!joined ? (
        <div className=" flex flex-col w-full max-w-3xl mx-auto items-center">
          <h1 className=" mb-4 text-2xl font-bold">Join Room</h1>
          <input
            type="text"
            placeholder="Enter you username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className=" w-64 px-4 py-2 mb-4 border-1 rounded-lg"
          />
          <input
            type="text"
            placeholder="Enter Room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-1 rounded-lg"
          />
          <button
            onClick={handleJoinRoom}
            className=" px-4 py-2 text-white bg-blue-500 rounded-lg"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className=" w-full max-w-3xl mx-auto">
          <h1 className=" font-bold text-2xl mb-4">Room: {room}</h1>
          <div className=" h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === userName}
              />
            ))}
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
