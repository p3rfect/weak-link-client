import React from 'react';
import {Typography} from "@mui/material";

function Level({index, currentLevel, level, ...props}) {
    return (
        <div>
            <Typography variant="h4" color={index == currentLevel ? "green" : "white"} style={{marginTop: "10px"}}>{level}</Typography>
        </div>
    );
}

export default Level;