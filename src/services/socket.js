import { io } from "socket.io-client";

const URL_SOCKET_SERVER = "http://localhost:4000/";
const socket = io(URL_SOCKET_SERVER, { transports: ["websocket"] });

export default socket;
