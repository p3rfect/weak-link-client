import {createSlice} from "@reduxjs/toolkit";
import {eliminate} from "../../services/GameService";

export const gameSlice = createSlice({
    name: 'user',
    initialState: {
        id: 0,
        code: '',
        levels: [],
        master: {
            id: 0,
            master: false,
            picture: {
                file: '',
                data: ''
            },
            username: '',
        },
        players: [],
        userPoll: '',
        currentLevel: 0,
        currentPlayer: 0,
        bank: 0,
        eliminationEnded: true,
        eliminated: false,
    },
    reducers: {
        setGame: (state, action) => {
            console.log(action.payload)
            state.id = action.payload.id
            state.code = action.payload.code
            state.levels = [0].concat(action.payload.levels)
            state.master = action.payload.master
            state.players = action.payload.players
            state.bank = 0
            state.currentPlayer = -2
            state.currentLevel = 0
            state.userPoll = ''
            state.eliminationEnded = true
            state.eliminated = false
        },
        addPlayer: (state, action) => {
            console.log(state.players)
            state.players.push({
                id: action.payload.id,
                master: action.payload.master,
                picture: action.payload.picture,
                username: action.payload.username,
                eliminated: false,
                revealed: false,
                pollResult: ''
            })
        },
        finish: (state) => {
            state = this.initialState
        },
        nextMove: (state, action) => {
            if (action.payload.answer){
                if (state.currentLevel < 8) state.currentLevel = state.currentLevel + 1
            }
            else{
                state.currentLevel = 0
            }
            state.currentPlayer = (state.currentPlayer + 1) % state.players.length
            while (state.players[state.currentPlayer].eliminated) state.currentPlayer = (state.currentPlayer + 1) % state.players.length
        },
        commitToBank: (state) => {
            state.bank = state.bank + state.levels[state.currentLevel]
            state.currentLevel = 0
        },
        finishRound: (state) => {
            state.players = state.players.map((player) => {
                player.revealed = false
                return player
            })
            state.eliminationEnded = false
            state.eliminated = false
            state.currentPlayer = -2
        },
        revealResult: (state, action) => {
            state.players = state.players.map((player) => {
                if (player.username === action.payload.username){
                    player.pollResult = action.payload.result
                    player.revealed = true
                }
                return player
            })
            let end = true
            for (let player of state.players){
                if (!player.eliminated && !player.revealed) end = false
            }
            state.eliminationEnded = end
        },
        setUserPoll: (state, action) => {
            state.userPoll = action.payload.userPoll
        },
        eliminatePlayer : (state, action) => {
            state.players = state.players.map((player) => {
                if (player.username === action.payload.username) player.eliminated = true;
                return player;
            })
            state.eliminated = true
        },
        startRound: (state) => {
            state.players = state.players.map((player) => {
                player.revealed = false;
                return player
            })
            state.eliminationEnded = true
            state.currentPlayer = 0
            while (state.players[state.currentPlayer].eliminated) state.currentPlayer = (state.currentPlayer + 1) % state.players.length
            state.currentLevel = 0
            state.eliminated = false
        }
    }
})

export const {setGame, addPlayer,
    finish, nextMove, commitToBank,
    finishRound, revealResult, setUserPoll,
    eliminatePlayer, startRound} = gameSlice.actions
export default gameSlice.reducer