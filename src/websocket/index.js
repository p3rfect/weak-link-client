const socket = new WebSocket('ws://localhost:8080')

let onMessageHandlers = new Map()

setInterval(() => socket.send(JSON.stringify({__MESSAGE__: "ping"})), 30000)

socket.onmessage = (e) => {
    let json_message = JSON.parse(e.data)
    onMessageHandlers[json_message.__MESSAGE__](json_message)
}

export const register_callback = (message_type, handler) => {
    onMessageHandlers[message_type] = handler
}

export default socket