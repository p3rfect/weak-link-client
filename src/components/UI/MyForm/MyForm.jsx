import React from 'react';
import classes from "./MyForm.module.css";

const MyForm = ({list, authForm, handleSubmit, playerCards, ...props}) => {
    return (
        <div {...props} className={classes.MyForm}>
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
    );
};

export default MyForm;