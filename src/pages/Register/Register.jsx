import React, {useCallback, useEffect, useState} from 'react';
import * as yup from 'yup';
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import Header from "../../components/UI/Header/Header";
import MyForm from "../../components/UI/MyForm/MyForm";
import {Alert, Button, FormControl, FormHelperText, InputLabel, OutlinedInput, Snackbar} from "@mui/material";
import {register} from "../../services/AuthService";
import MyAlert from "../../components/UI/MyAlert/MyAlert";
import {useWebSocketContext} from "../../contexts/WebSocketContext/WebSocketContext";

const validationSchema = yup.object({
    username: yup
        .string('Введите имя пользователя')
        .required('Имя пользователя обязательно')
        .max(30, 'Допустима длина до 30 символов'),
    password: yup
        .string('Введите пароль')
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .max(30, 'Допустима длина до 30 символов')
        .required('Пароль обязателен'),
    repeatedPassword: yup
        .string('Повторите пароль')
})

function Register({setSnackBarOpen, ...props}) {
    const route = useNavigate();
    const [showUserExistAlert, setShowUserExistAlert] = useState(false)
    const [socket, register_callback, ready] = useWebSocketContext()

    const handle_server_response = useCallback((message) => {
        if (message.success === true) {
            setSnackBarOpen(true)
            route("/login")
        }
        else setShowUserExistAlert(true)
    }, [route, setSnackBarOpen])

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            repeatedPassword: '',
        },
        validationSchema: validationSchema,
        validate: (values) => {
            const errors = {}
            if (values.password.length >= 8 && /[^\w_*+!]/.test(values.password)) {
                errors.password = 'Пароль может содержать только строчные и заглавные латинские буквы, цифры и спец. символы (_*+!)'
            }
            if (values.password !== values.repeatedPassword){
                errors.repeatedPassword = 'Пароли не совпадают'
            }
            return errors
        },
        onSubmit:  (values) => {
            register(socket, values.username, values.password)
        }
    })

    useEffect(() => {
        register_callback("registration", handle_server_response)
    }, [handle_server_response, register_callback])
    return (
        <div>
            <Header/>
            <MyAlert setShowAlert={setShowUserExistAlert} showAlert={showUserExistAlert} title={"Ошибка"}
                     text={"Данный пользователь уже существует"}/>
            <MyForm style={{width: "30%", marginTop: "200px", marginLeft: "35%"}} list={[
                <h2 key="h2">Регистрация</h2>,
                <FormControl variant="outlined" key="username-form" style={{width: "70%", marginTop: "20px"}}>
                    <InputLabel style={formik.touched.username && formik.errors.username ? {color: "red"} : {}}>Имя пользователя</InputLabel>
                    <OutlinedInput
                        id="username"
                        label="Имя пользователя"
                        value={formik.values.username}
                        onChange={e => formik.handleChange(e)}
                        error={formik.touched.username && formik.errors.username}
                    />
                    <FormHelperText style={{color: "red"}}>
                        {formik.touched.username && formik.errors.username}
                    </FormHelperText>
                </FormControl>,
                <FormControl variant="outlined" key="password-form" style={{width: "70%", marginTop: "20px"}}>
                    <InputLabel style={formik.touched.password && formik.errors.password ? {color: "red"} : {}}>Пароль</InputLabel>
                    <OutlinedInput
                        id="password"
                        type="password"
                        label="Пароль"
                        value={formik.values.password}
                        onChange={e => formik.handleChange(e)}
                        error={formik.touched.password && formik.errors.password}
                    />
                    <FormHelperText style={{color: "red"}}>
                        {formik.touched.password && formik.errors.password}
                    </FormHelperText>
                </FormControl>,
                <FormControl variant="outlined" key="confirm-password-form" style={{width: "70%", marginTop: "20px"}}>
                    <InputLabel style={formik.touched.repeatedPassword && formik.errors.repeatedPassword ? {color: "red"} : {}}>Повторите пароль</InputLabel>
                    <OutlinedInput
                        id="repeatedPassword"
                        type="password"
                        label="Повторите пароль"
                        value={formik.values.repeatedPassword}
                        onChange={e => formik.handleChange(e)}
                        error={formik.touched.repeatedPassword && formik.errors.repeatedPassword}
                    />
                    <FormHelperText style={{color: "red"}}>
                        {formik.touched.repeatedPassword && formik.errors.repeatedPassword}
                    </FormHelperText>
                </FormControl>,
                <Button style={{width: "50%", marginTop: "30px", height: "60px"}} variant="text" type="submit" key="reg-button" onClick={formik.handleSubmit}>Зарегистрироваться</Button>
            ]}/>
        </div>
    );
}

export default Register;