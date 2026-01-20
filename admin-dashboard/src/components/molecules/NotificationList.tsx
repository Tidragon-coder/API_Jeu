import { useNotification } from "../../context/NotificationContext";

export default function NotificationList() {
    const { notifications } = useNotification();

    return (
        <div className="fixed top-4 right-4 px-4 mt-14 space-y-3 z-50">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`text-white px-4 py-2 rounded-lg shadow-md ${n.type === "success" && "bg-green-500"
                    } ${n.type === "warning" && "bg-yellow-500"} ${
                        n.type === "error" && "bg-red-500"
                    } ${n.type === "info" && "bg-blue-400"}`}
                >

                {n.type === "success" && "✅"} {n.type === "warning" && "⚠️"} {n.type === "error" && "❌"} {n.type === "info" && "ℹ️"}
                    {n.message}
                </div>
            ))}
        </div>
    );
}
