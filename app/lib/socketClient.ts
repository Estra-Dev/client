"use client";
import { io } from "socket.io-client";

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL
  // process.env.NEXT_PUBLIC_SOCKET_SERVER_URL_2
);
