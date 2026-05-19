import { create } from "zustand";
import { JWT_KEY } from "../../constants/api";

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    ws: null,
    connectWs: () => {
        const token = localStorage.getItem(JWT_KEY);
        if (!token) return;
        const ws = new WebSocket(import.meta.env.VITE_WS_URL);
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "auth", token }));
        };
        ws.onmessage = (event) => {
            const payload = JSON.parse(event.data);
            if (payload.type === "notification") {
                set((state) => ({
                    notifications: [payload.data, ...state.notifications],
                    unreadCount: state.unreadCount + 1,
                }));
            }
        };
        ws.onerror = () => {
            console.log("error");
        };
        ws.onclose = () => {
            set({ ws: null });
        };
        set({ ws });
    },
    disconnectWs: () => {
        const { ws } = get();
        if (ws) ws.close();
        set({ ws: null });
    },
    setNotifications: (notifications) => {
        const unreadCount = notifications.filter((n) => !n.read).length;
        set({ notifications, unreadCount });
    },
    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));


export default useNotificationStore;
