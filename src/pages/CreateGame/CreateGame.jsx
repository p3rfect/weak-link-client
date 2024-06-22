import React, {useEffect} from 'react';
import * as yup from 'yup'
import {useFormik} from "formik";
import Header from "../../components/UI/Header/Header";
import MyForm from "../../components/UI/MyForm/MyForm";
import {Button, FormControl, FormHelperText, InputLabel, OutlinedInput} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {register_callback} from "../../websocket";
import {create_game} from "../../services/GameService";
import {setGame} from "../../features/game/gameSlice"

const validationSchema = yup.object({
    max_players: yup
        .number('Введите максимальное кол-во игроков')
        .required('Кол-во игроков обязательно'),
    initial_round_time: yup
        .number('Введите время первого раунда в секундах')
        .required('Время обязательно'),
    levels: yup
        .string('Введите награды за уровни (8 чисел через пробел)')
})

function CreateGame(props) {
    const route = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    const handle_server_response = (message) => {
        if (!message.hasOwnProperty("players")) message.players = []
        dispatch(setGame(message))
        route("/game")
    }

    const formik = useFormik({
        initialValues: {
            max_players: 12,
            initial_round_time: 200,
            levels: '1000 2000 5000 10000 20000 30000 40000 50000'
        },
        validationSchema: validationSchema,
        validate: (values) => {
            const errors = {}
            if (/[^\d ]/.test(values.levels)){
                errors.levels = "Поле может содержать только цифры и пробелы"
            }
            if (values.levels.split(' ').length != 8){
                errors.levels = "Кол-во уровней должно быть равно 8"
            }
            return errors
        },
        onSubmit: (values) => {
            create_game(user, Number(values.max_players), Number(values.initial_round_time), values.levels)
        }
    })

    useEffect(() => {
        register_callback("create_game", handle_server_response)
    })

    return (
        <div>
            <Header/>
            <MyForm style={{width: "30%", marginTop: "200px", marginLeft: "35%"}} list={[
                <h2 key="h2">Конфигурация игры</h2>,
                <FormControl key="number-of-players-form" style={{width: "70%", marginTop: "10px"}}>
                    <InputLabel style={formik.touched.max_players && formik.errors.max_players ? {color: "red"} : {}}>Кол-во игроков</InputLabel>
                    <OutlinedInput
                        id="max_players"
                        label="Кол-во игроков"
                        value={formik.values.max_players}
                        onChange={e => formik.handleChange(e)}
                        error={formik.touched.max_players && formik.errors.max_players}
                    />
                    <FormHelperText style={{color: "red"}}>
                        {formik.touched.max_players && formik.errors.max_players}
                    </FormHelperText>
                </FormControl>,
                <FormControl key="initial-round-time-form" style={{width: "70%", marginTop: "20px"}}>
                    <InputLabel style={formik.touched.initial_round_time && formik.errors.initial_round_time ? {color: "red"} : {}}>Время первого раунда</InputLabel>
                    <OutlinedInput
                        id="initial_round_time"
                        label="Время первого раунда"
                        value={formik.values.initial_round_time}
                        onChange={e => formik.handleChange(e)}
                        error={formik.touched.initial_round_time && formik.errors.initial_round_time}
                    />
                    <FormHelperText style={{color: "red"}}>
                        {formik.touched.initial_round_time && formik.errors.initial_round_time}
                    </FormHelperText>
                </FormControl>,
                <FormControl key="levels-form" style={{width: "70%", marginTop: "20px"}}>
                    <InputLabel style={formik.touched.levels && formik.errors.levels ? {color: "red"} : {}}>Награда за уровни</InputLabel>
                    <OutlinedInput
                        id="levels"
                        label="Награда за уровни"
                        value={formik.values.levels}
                        onChange={e => formik.handleChange(e)}
                        error={formik.touched.levels && formik.errors.levels}
                    />
                    <FormHelperText style={{color: "red"}}>
                        {formik.touched.levels && formik.errors.levels}
                    </FormHelperText>
                </FormControl>,
                <Button style={{width: "50%", marginTop: "20px", height: "60px", marginBottom: "20px"}} variant="text" type="submit" key="create-game-button" onClick={formik.handleSubmit}>Создать игру</Button>
            ]}/>
        </div>
    );
}

export default CreateGame;