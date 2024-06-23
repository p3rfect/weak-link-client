import React from 'react';
import classes from "./MyForm.module.css";
import {Card, CardContent} from "@mui/material";

const MyForm = ({list, authForm, handleSubmit, playerCards, ...props}) => {
    return (
        <Card {...props}>
            <CardContent>
                <div className={classes.MyForm}>
                    <form onSubmit={handleSubmit} >
                        <div className={classes.FieldsContainer} style={playerCards ? {display: "flex", flexDirection: "row"} : {}}>
                            {list.map(e => {
                                let x = e
                                if (e.tag === "TextField") x.className = classes.InputItem
                                return x;
                            })}
                        </div>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
};

export default MyForm;