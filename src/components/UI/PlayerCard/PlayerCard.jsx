import React, {useEffect} from 'react';
import {Typography} from "@mui/material";
import classes from "./PlayerCard.module.css";

function PlayerCard({user, currentPlayer, index, revealed, pollResult, eliminated, ...props}) {
    return (
        <div {...props} style={{display: "flex", flexDirection: "column", border: currentPlayer == index ? "2px solid green" : "",
            boxShadow: currentPlayer == index ? "0px 0px 10px 10px rgba(0, 255, 0, .05)" : ""}} className={classes.PlayerCard}>
            <img className={classes.Picture} src={`data:image/png;base64,${user.picture.data}`} alt="avatar"
                 style={{width: props.width, height: props.height}}/>
            <Typography className={classes.Username} variant="h5" color={eliminated ? "gray" : "white"}>{eliminated ? "Выбыл" : user.username}</Typography>
            <div className={classes.Eliminate}>
                {revealed ?
                    <Typography variant="h6" style={{alignSelf: "center"}} color="red">{pollResult}</Typography>
                    :
                    <div></div>
                }
            </div>
        </div>
    );
}

export default PlayerCard;