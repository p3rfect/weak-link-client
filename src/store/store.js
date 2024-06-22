import {combineReducers, configureStore} from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice.js"
import gameReducer from "../features/game/gameSlice.js"
import { persistReducer, persistStore } from 'redux-persist'
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session'

const persistConfig = {
    key: 'root',
    storage: storageSession,
}

const rootReducer = combineReducers({
    user: userReducer,
    game: gameReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store)