import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface Notification {
    id: number;
    message: string;
    type: "success" | "warning" | "error" | "info";
}

interface NotificationContextType {
    notifications: Notification[];
    notify: (message: string, type: "success" | "warning" | "error" | "info") => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notify = (message: string, type: "success" | "warning" | "error" | "info") => {
        const id = Date.now(); // 👈 on garde l'ID
        setNotifications((prev) => [
            ...prev,
            { id, message, type }
        ]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id)); // 👈 utiliser le même ID
        }, 3000); // 3s
    };

    return (
        <NotificationContext.Provider value={{ notifications, notify }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification doit être utilisé dans un NotificationProvider");
    }
    return context;
}
