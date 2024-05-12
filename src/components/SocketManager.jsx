import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { io } from "socket.io-client";
export const socket = io("http://localhost:3001");//https://vh91xzwb-3001.uks1.devtunnels.ms/
//export const socket = io("https://vh91xzwb-3001.uks1.devtunnels.ms/");
export const charactersAtom = atom([]);
export const mapAtom = atom(null);
export const userAtom = atom(null);

export const SocketManager = () => {
    const [_characters, setCharacters] = useAtom(charactersAtom);
    const [_map, setMap] = useAtom(mapAtom);
    const [_user, setUser] = useAtom(userAtom);
    useEffect(() => {
        function onConnect() {
            console.log("connected");
        }
        function onDisconnect() {
            console.log("disconnected");
        }

        function onHello(value) {
            console.log(`Welcome id: ${value.id}`)
            setMap(value.map);
            setUser(value.id);
            console.log(value.characters[0])
            console.log(value.map)
            setCharacters(value);
        }
        function onCharacters(value) {
            setCharacters(value);
        }
        function onPlayerMove(value) {
            console.log("PlayerMoveReceived")
            setCharacters((prev) => {
                return prev.map((character) => {
                    if (character.id === value.id) {

                        return value
                    } else {

                        return character
                    }
                })
            })
        }
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("hello", onHello);
        socket.on("characters", onCharacters);
        socket.on("playerMove", onPlayerMove);


        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("hello", onHello);
            socket.off("characters", onCharacters);
            socket.off("playerMove", onPlayerMove);

        };
    }, [])
}
