import React, {useEffect} from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import classes from "./PlayerCard.module.css";

function PlayerCard({user, currentPlayer, index, revealed, pollResult, eliminated, ...props}) {
    return (
        <Card style={{border: currentPlayer == index ? "2px solid green" : "",
            boxShadow: currentPlayer == index ? "0px 0px 10px 10px rgba(0, 255, 0, .05)" : ""}} className={classes.PlayerCard}>
            <CardContent style={{display: "flex", flexDirection: "column"}}>
                <img src={`data:image/png;base64,${user.picture.data}`} className={classes.Picture} alt="avatar"/>
                <Typography className={classes.Username} variant="h5" color={eliminated ? "gray" : "white"}>{eliminated ? "Выбыл" : user.username}</Typography>
                <div className={classes.Eliminate}>
                    <Typography variant="h6" style={{alignSelf: "center"}} color="red">{revealed ? pollResult : ""}</Typography>
                </div>
            </CardContent>
        </Card>
    );
}

export default PlayerCard;