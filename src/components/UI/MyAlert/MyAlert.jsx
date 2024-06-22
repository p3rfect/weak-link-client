import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";

const MyAlert = ({showAlert, text, title, propHandleCloseAlert, setShowAlert}) => {

    const handleCloseAlert = () => {
        setShowAlert(false)
    }

    return (
        <Dialog
            open={showAlert}
            onClose={propHandleCloseAlert !== undefined ? propHandleCloseAlert : handleCloseAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={propHandleCloseAlert !== undefined ? propHandleCloseAlert : handleCloseAlert}>Понятно</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MyAlert;