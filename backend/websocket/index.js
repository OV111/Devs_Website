import { WebSocketServer } from "ws";
import { joinRoom, loadLastMessages, sendMessage, removeFromRooms } from "./chatHandler.js";
import { verifyToken } from "../utils/jwtToken.js";

let wss;
export const getWss = () => wss;

export default function initWebSocketServer(server) {
  wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    console.log("Client Connected!");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "auth") {
          const decoded = verifyToken(data.token);
          if (!decoded) {
            return ws.close();
          }
          ws.userId = decoded.id;
        } else {
          if (!ws.userId) return ws.close();
          else if (data.type === "join_room") {
            // calling the joinRoom funciton and load messages
            await joinRoom(ws, data);
          } else if (data.type === "send_message") {
            await sendMessage(ws, data);
          } else if (data.type === "load_last_messages") {
            await loadLastMessages(ws);
          }
          //   else if (data.type === "leave_room") {// closing connection}
        }
      } catch (err) {
        console.log(err);
      }
    });
    ws.on("close", () => {
      removeFromRooms(ws);
    });
  });
}
