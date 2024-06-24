import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CreateGame from "./pages/CreateGame/CreateGame";
import Game from "./pages/Game/Game";
import {Alert, Slide, Snackbar} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useWebSocketContext} from "./contexts/WebSocketContext/WebSocketContext";

function App() {
    const [registeredSnackbarOpen, setRegisteredSnackbarOpen] = useState(false)
    const [socket, register_callback, ready] = useWebSocketContext()
    const SlideTransition = (props) => <Slide {...props} direction="up"/>

    useEffect(() => {
        console.log(socket)
    }, [ready])

    return (
        ready
        ?
            <BrowserRouter>
                <Snackbar open={registeredSnackbarOpen}
                          autoHideDuration={4000}
                          onClose={() => setRegisteredSnackbarOpen(false)}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                          transitionDuration={300}
                          TransitionComponent={SlideTransition}>
                    <Alert
                        severity="success"
                        variant="filled"
                        sx={{width: '100%'}}
                    >
                        Пользователь успешно зарегистрирован
                    </Alert>
                </Snackbar>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register"
                           element={<Register setSnackBarOpen={() => setRegisteredSnackbarOpen(true)}/>}/>
                    <Route path="/create_game" element={<CreateGame/>}/>
                    <Route path="/game" element={<Game/>}/>
                </Routes>
            </BrowserRouter>
        :
            <div></div>
    );
}

export default App;
