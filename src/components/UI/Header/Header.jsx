import React, {useEffect, useState} from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import {AppBar, Button, Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import classes from "./Header.module.css";
import {logout, setPicture} from "../../../features/user/userSlice";
import MyAlert from "../MyAlert/MyAlert";
import ImageUploader from "../ImageUploader/ImageUploader";
import {update_user_pic} from "../../../services/AuthService";
import {register_callback} from "../../../websocket";

function Header() {
    const route = useNavigate();
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [showImageDialog, setShowImageDialog] = useState(false)
    const [imageData, setImageData] = useState('')

    const handleRedirect = (e) => {
        route("/" + e)
    }

    const handleLogout = () => {
        dispatch(logout())
    }

    const handleUploadImageButton = () => {
        setShowImageDialog(true)
    }

    const handleCloseDialog = () => {
        setShowImageDialog(false)
        if (imageData != '') dispatch(setPicture({picture: {file: '', data: imageData}}))
    }

    const handleSaveImageData = (data) => {
        setImageData(data)
        if (data != '') dispatch(setPicture({picture: {file: '', data: data}}))
        update_user_pic(user.username, data)
    }

    useEffect(() => {
        register_callback("change_picture", () => {})
    }, [])

    return (
        <React.Fragment>
            <CssBaseline/>
            <Dialog open={showImageDialog} onClose={handleCloseDialog}>
                <DialogTitle>Загрузка изображения</DialogTitle>
                <DialogContent style={{display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "30px"}}>
                    <ImageUploader handleClose={handleCloseDialog} data={imageData} setData={handleSaveImageData}/>
                </DialogContent>
            </Dialog>
            <AppBar style={{borderRadius: "10px", display: "flex", flexDirection: "row", alignItems: "center", height: "70px", width: "100%", paddingLeft: "1%"}}>
                <Typography variant="h6">Слабое звено</Typography>
                <Button onClick={() => handleRedirect("")} className={classes.Button}>Главная</Button>
                {!user.isAuth ?
                        <div className={classes.LoginContainer}>
                            <Button className={classes.Button} onClick={() => handleRedirect("login")}>Вход</Button>
                            <Button className={classes.Button} onClick={() => handleRedirect("register")}>Регистрация</Button>
                        </div>
                    :
                        <div className={classes.AuthContainer}>
                            <Button className={classes.Button} onClick={handleUploadImageButton}>Загрузить картинку профиля</Button>
                            <img className={classes.UserPic} src={`data:image/png;base64,${user.picture.data}`}/>
                            <Typography className={classes.Username} variant="h7">{user.username}</Typography>
                            <Button className={classes.Button} onClick={handleLogout}>Выйти</Button>
                        </div>
                }
            </AppBar>
        </React.Fragment>
    );
}

export default Header;