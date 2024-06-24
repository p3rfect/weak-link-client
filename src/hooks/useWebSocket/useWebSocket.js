import {useState} from "react";

export const useWebSocket = (url) => {
    const [socket, setSocket] = useState(new WebSocket(url))
    const [ready, setReady] = useState(false)
    const onMessageHandlers = new Map()

    setInterval(() => socket.send(JSON.stringify({__MESSAGE__: "ping"})), 30000)

    socket.onopen = ((e) => {
        setReady(true)
    })

    socket.onmessage = (e) => {
        let json_message = JSON.parse(e.data)
        onMessageHandlers[json_message.__MESSAGE__](json_message)
    }

    const register_callback = (message_type, handler) => {
        onMessageHandlers[message_type] = handler
    }

    return [socket, register_callback, ready]
}