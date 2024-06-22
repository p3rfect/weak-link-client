import socket from "../websocket/index"

export const register = (username, password) => {
    socket.send(JSON.stringify({__MESSAGE__: "register", user:{username:username, password:password}}))
}

export const login = (username, password) => {
    socket.send(JSON.stringify({__MESSAGE__: "login", user: {username: username, password: password}}))
}

export const update_user_pic = (username, data) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "change_user_pic",
        username: username,
        picture: data
    }))
}