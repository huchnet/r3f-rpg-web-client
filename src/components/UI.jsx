
import { socket } from "./SocketManager";
import { useAtom } from 'jotai'
import { useState } from "react";
import { cameraFixAtom } from './Global'
export const UI = () => {

    const [cameraFix, setCameraFix] = useAtom(cameraFixAtom);
    const [chatMessage, setChatMessage] = useState("");
    const sendChatMessage = () => {
        if (chatMessage === "/camera") {
            setCameraFix(!cameraFix)
            setChatMessage("");
        } else if (chatMessage.length > 0) {
            socket.emit("chatMessage", chatMessage);
            setChatMessage("");
        }
    };
    return (
        <div className="fixed inset-4 flex items-center justify-end flex-col pointer-events-none select-none">
            <div className="pointer-events-auto p-4 flex items-center space-x-4">
                <input
                    type="text"
                    className="w-56 border px-5 p-4 h-full rounded-full"
                    placeholder="Message..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {

                            sendChatMessage();
                        }
                    }}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                />
                <button
                    className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                    onClick={sendChatMessage}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}
