import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import {redirect, useNavigate} from "react-router-dom";
import Header from "../../components/UI/Header/Header";
import MyAlert from "../../components/UI/MyAlert/MyAlert";
import {useDispatch, useSelector} from "react-redux";
import {join_game} from "../../services/GameService";
import {register_callback} from "../../websocket";
import {setGame} from "../../features/game/gameSlice";
import classes from "./Home.module.css";
import MyForm from "../../components/UI/MyForm/MyForm";

function Home(props) {
    const route = useNavigate()
    const [showPermissionDeniedAlert, setShowPermissionDeniedAlert] = useState(false)
    const [showLoginAlert, setShowLoginAlert] = useState(false)
    const [showNotFoundAlert, setShowNotFoundAlert] = useState(false)
    const [showCodeDialog, setShowCodeDialog] = useState(false)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const handleCreateGame = () => {
        if (!user.isAuth) setShowLoginAlert(true)
        else if (!user.isMaster) setShowPermissionDeniedAlert(true)
        else{
            route("/create_game")
        }
    }

    const handleJoinGameResponse = (message) => {
        if (message.success === false){
            setShowNotFoundAlert(true)
        }
        else{
            dispatch(setGame(message.game))
            route("/game")
        }
    }

    const handleJoinGameRequest = (code) => {
        join_game(user, code)
    }

    const hadleCodeDialogClose = () => {
        setShowCodeDialog(false)
    }

    const handleJoinGame = () => {
        if (!user.isAuth) setShowLoginAlert(true)
        else{
            setShowCodeDialog(true)
        }
    }

    useEffect(() => {
        register_callback("join_game", handleJoinGameResponse)
    })

    return (
        <div className={classes.Wrapper}>
            <Header/>
            <Dialog
                open={showCodeDialog}
                onClose={hadleCodeDialogClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const code = formJson.code;
                        hadleCodeDialogClose();
                        handleJoinGameRequest(code)
                    },
                }}
            >
                <DialogTitle>Подключение к игре</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Введите код игры:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="code"
                        name="code"
                        label="Код игры"
                        type="code"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={hadleCodeDialogClose}>Отмена</Button>
                    <Button type="submit">Подключиться</Button>
                </DialogActions>
            </Dialog>
            <MyAlert showAlert={showPermissionDeniedAlert} setShowAlert={setShowPermissionDeniedAlert} title="Ошибка"
                text="Для данного действия необходимы права мастера"/>
            <MyAlert showAlert={showLoginAlert} setShowAlert={setShowLoginAlert} title="Ошибка"
                 text="Для данного действия необходимо войти в аккаунт"/>
            <MyAlert showAlert={showNotFoundAlert} setShowAlert={setShowNotFoundAlert} title="Ошибка"
                 text="Игра не найдена"/>
            <MyForm style={{width: "30%", alignSelf: "center"}} list={[
                <Button key="create-button" variant="outlined" onClick={handleCreateGame} className={classes.Button}>Создать игру</Button>,
                <Button key="join-button" variant="outlined" onClick={handleJoinGame} className={classes.Button}>Подключиться к игре</Button>
            ]}/>
        </div>
    );
}

export default Home;