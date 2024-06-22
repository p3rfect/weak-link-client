import React, {useState} from 'react';
import {Button} from "@mui/material";

function ImageUploader({handleClose, data, setData, ...props}) {

    const handleChange = (e) => {
        let file = e.target.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onload = _handleReaderLoaded.bind(this)
            reader.readAsBinaryString(file)
        }
    }

    const _handleReaderLoaded = e => {
        let binaryString = e.target.result;
        setData(btoa(binaryString))
        handleClose()
    }

    return (
        <div>
            <Button
                variant="contained"
                component="label"
            >
                Upload File
                <input
                    type="file"
                    name="image"
                    accept=".jpg, .jpeg, .png"
                    hidden
                    onChange={e => handleChange(e)}
                />
            </Button>
        </div>
    );
}

export default ImageUploader;