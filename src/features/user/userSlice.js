import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        isMaster: false,
        isAuth: false,
        picture: {
            file: '',
            data: ''
        }
    },
    reducers: {
        setUser: (state, action) => {
            state.isMaster = action.payload.isMaster
            state.username = action.payload.username
            state.isAuth = true
            state.picture = action.payload.picture
        },
        logout: (state) => {
            state.isMaster = false
            state.username = ''
            state.isAuth = false
            state.picture = {file: '', data: ''}
        },
        setPicture: (state, action) => {
            state.picture = action.payload.picture
        }
    }
})

export const {setUser, getIsAuth, logout, setPicture} = userSlice.actions
export default userSlice.reducer