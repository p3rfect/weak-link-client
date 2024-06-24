import {number} from "yup";
import game from "../pages/Game/Game";

export const create_game = (socket, master, max_players, initial_round_time, levels) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "create_game",
        game: {
            master: {
                username: master.username,
            },
            max_players: max_players,
            round_time: initial_round_time,
            levels: levels.split(' ').map((level) => Number(level))
        }
    }))
}

export const join_game = (socket, user, code) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "join_game",
        user: {
            username: user.username
        },
        code: code
    }))
}

export const set_connection = (socket, user, game_id) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "set_conn",
        username: user.username,
        game_id: game_id
    }))
}

export const start_round = (socket, game_id) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "start_round",
        game_id: game_id
    }))
}

export const send_answer = (socket, answer, game_id) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "answer",
        answer: answer,
        game_id: game_id
    }))
}

export const commit_to_bank = (socket, game_id) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "commit_to_bank",
        game_id: game_id
    }))
}

export const finish_round = (socket, game_id) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "finish_round",
        game_id: game_id
    }))
}

export const reveal_request = (socket, game_id, username) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "request_poll_result",
        game_id: game_id,
        username: username
    }))
}

export const reveal = (socket, game_id, username, result) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "reveal_poll_result",
        game_id: game_id,
        username: username,
        result: result
    }))
}

export const eliminate = (socket, game_id) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "get_players_to_eliminate",
        game_id: game_id
    }))
}

export const strongest_eliminate = (socket, game_id, username) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "eliminate",
        game_id: game_id,
        username: username
    }))
}

export const request_eliminate = (socket, game_id) => {
    socket.send(JSON.stringify({
        __MESSAGE__: "request_eliminate",
        game_id: game_id
    }))
}