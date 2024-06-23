import React, {useEffect, useState} from 'react';
import Header from "../../components/UI/Header/Header";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import MyForm from "../../components/UI/MyForm/MyForm";
import {Button, FormControl, FormHelperText, InputLabel, OutlinedInput} from "@mui/material";
import MyAlert from "../../components/UI/MyAlert/MyAlert";
import {login} from "../../services/AuthService";
import {register_callback} from "../../websocket";
import {useDispatch} from "react-redux";
import {setUser} from "../../features/user/userSlice";
import classes from "./Login.module.css"

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
})


function Login(props) {
    const route = useNavigate()
    const [showNotFoundError, setShowNotFoundError] = useState(false)
    const dispatch = useDispatch()

    const handle_server_response = (message) => {
        if (message.success === true){
            message = message.user
            dispatch(setUser({username: message.username, isMaster: message.master, picture: {file: message.picture.file, data: message.picture.data}}))
            route("/")
        }
        else setShowNotFoundError(true)
    }

    useEffect(() => {
        register_callback("login", handle_server_response)
    }, [])

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        validate: (values) => {
            const errors = {}
            if (values.password.length >= 8 && /[^\w_*+!]/.test(values.password)) {
                errors.password = 'Пароль может содержать только строчные и заглавные латинские буквы, цифры и спец. символы (_*+!)'
            }
            return errors
        },
        onSubmit: async (values) => {
            login(values.username, values.password)
        }
    })

    return (
        <div>
            <Header/>
            <MyAlert showAlert={showNotFoundError} setShowAlert={setShowNotFoundError} title="Ошибка"
                     text = "Неверные имя пользователя или пароль"/>
            <MyForm style={{width: "30%", marginTop: "200px", marginLeft: "35%"}} list={[
                <h2 key="h2">Вход</h2>,
                <FormControl key="username-form" classes={classes.FormControl} style={{width: "70%", marginTop: "10px"}}>
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
                <FormControl key="password-form" style={{width: "70%", marginTop: "20px"}}>
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
                <Button style={{width: "50%", marginTop: "30px", height: "60px"}} variant="text" type="submit" key="login-button" onClick={formik.handleSubmit}>Войти</Button>
            ]}/>
        </div>
    );
}

export default Login;