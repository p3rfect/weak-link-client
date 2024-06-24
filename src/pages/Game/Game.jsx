import React, {useCallback, useEffect, useRef, useState} from 'react';
import PlayerCard from "../../components/UI/PlayerCard/PlayerCard";
import {useDispatch, useSelector} from "react-redux";
import Header from "../../components/UI/Header/Header";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import MyForm from "../../components/UI/MyForm/MyForm";
import classes from "./Game.module.css";
import {
    addPlayer,
    commitToBank,
    eliminatePlayer,
    finishRound,
    nextMove,
    revealResult,
    setUserPoll, startRound
} from "../../features/game/gameSlice";
import {
    commit_to_bank, eliminate,
    finish_round, request_eliminate, reveal,
    reveal_request,
    send_answer,
    set_connection,
    start_round, strongest_eliminate
} from "../../services/GameService";
import Level from "../../components/UI/Level/Level";
import {useWebSocketContext} from "../../contexts/WebSocketContext/WebSocketContext";

function Game(props) {
    const game = useSelector((state) => state.game)
    const user = useSelector((state) => state.user)
    const [isGameMaster, setIsGameMaster] = useState(false)
    const [currentLevel, setCurrentLevel] = useState(0)
    const [gameStarted, setGameStarted] = useState(false)
    const [roundNumber, setRoundNumber] = useState(0)
    const [currentPlayer, setCurrentPlayer] = useState(0)
    const [firstRound, setFirstRound] = useState(false)
    const [chooseEliminate, setChooseEliminate] = useState(false)
    const [eliminateChoices, setEliminateChoices] = useState([])
    const [eliminationChoice, setEliminationChoice] = useState('')
    const [strongestEliminate, setStrongestEliminate] = useState(true)
    const [eliminatedPlayer, setEliminatedPlayer] = useState('')
    const dispatch = useDispatch()
    const [timer, setTimer] = useState("00:00");
    const Ref = useRef(null);
    const [selectionFinished, setSelectionFinished] = useState(false)
    const [socket, register_callback, ready] = useWebSocketContext()

    const startTimer = (e) => {
        let total = e
        let minutes = Math.floor(total / 60) % 60
        let seconds = total % 60
        if (total >= 0) {
            setTimer(
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    };

    const clearTimer = (e) => {
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            e--;
            startTimer(e);
        }, 1000);
        Ref.current = id;
        setTimeout(() => {
            clearInterval(Ref.current)
            handleFinishRound()
        }, e * 1000)
    };

    const handleAddNewPlayer = useCallback((message) => {
        dispatch(addPlayer(message.user))
    }, [dispatch])

    const handleRoundStart = useCallback((message) => {
        setGameStarted(true)
        setRoundNumber(roundNumber + 1)
        setCurrentLevel(0)
        setCurrentPlayer(0)
        setFirstRound(true)
        setStrongestEliminate(false)
        setEliminatedPlayer('')
        clearTimer(message.round_time)
        dispatch(startRound())
    }, [clearTimer, dispatch, roundNumber])

    const handleAcceptAnswer = useCallback((message) => {
        dispatch(nextMove({answer: message.answer}))
    }, [dispatch])

    const handleAcceptAnswerResponse = useCallback((message) => {
        handleAcceptAnswer(message)
    }, [handleAcceptAnswer])

    const handleRightAnswer = useCallback(() => {
        send_answer(socket, true, game.id)
    }, [game.id, socket])

    const handleWrongAnswer = useCallback(() => {
        send_answer(socket,false, game.id)
    }, [game.id, socket])

    const handleRoundStartButton = () => {
        setFirstRound(true)
        start_round(socket, game.id)
    }

    const handleCommitToBankResponse = useCallback((message) => {
        dispatch(commitToBank())
    }, [dispatch])

    const handleBankButton = () => {
        commit_to_bank(game.id)
    }

    const handleFinishRoundResponse = useCallback(() => {
        dispatch(finishRound())
        setSelectionFinished(false)
        setGameStarted(false)
    }, [dispatch])

    const handleFinishRound = () => {
        setGameStarted(false)
        if (user.username === game.master.username) finish_round(socket, game.id)
    }

    const handleChangeEliminate = (e) => {
        dispatch(setUserPoll({userPoll: e.target.value}))
    }

    const handleRevealResponse = useCallback((message) => {
        dispatch(revealResult({username: message.username, result: message.result}))
        setSelectionFinished(true)
    }, [dispatch])

    const handleRevealRequest = useCallback(() => {
        reveal(socket, game.id, user.username, game.userPoll)
    }, [game.id, game.userPoll, socket, user.username])

    const handleRevealButton = () => {
        for (let player of game.players) {
            if (!player.eliminated && !player.revealed) {
                reveal_request(socket, game.id, player.username)
                break
            }
        }
    }

    const handleEliminateButton = () => {
        if (!strongestEliminate) eliminate(socket, game.id)
        else{
            request_eliminate(socket, game.id)
        }
    }

    const handlePlayerEliminated = useCallback((message) => {
        dispatch(eliminatePlayer(message))
    }, [dispatch])

    const handleChooseEliminate = useCallback((message) => {
        setChooseEliminate(true)
        setEliminateChoices(message.players)
    }, [])

    const handleChangeStrongestEliminate = (e) => {
        setEliminationChoice(e.target.value)
    }

    const handleRequestEliminate = useCallback((message) => {
        if (chooseEliminate) strongest_eliminate(socket, game.id, eliminationChoice)
        setChooseEliminate(false)
    }, [chooseEliminate, eliminationChoice, game.id, socket])

    const handleStrongestEliminate = useCallback((message) => {
        setStrongestEliminate(true)
    }, [])

    useEffect(() => {
        register_callback("player_join", handleAddNewPlayer)
        register_callback("round_started", handleRoundStart)
        register_callback("answer", handleAcceptAnswerResponse)
        register_callback("commit_to_bank", handleCommitToBankResponse)
        register_callback("finish_round", handleFinishRoundResponse)
        register_callback("reveal_poll_result", handleRevealResponse)
        register_callback("request_poll_result", handleRevealRequest)
        register_callback("player_eliminated", handlePlayerEliminated)
        register_callback("choose_eliminate", handleChooseEliminate)
        register_callback("request_eliminate", handleRequestEliminate)
        register_callback("strongest_player_eliminates", handleStrongestEliminate)
    }, [handleAcceptAnswerResponse, handleAddNewPlayer, handleCommitToBankResponse, handleFinishRoundResponse,
        handleRevealRequest, handleRevealResponse, handleRoundStart, handlePlayerEliminated, handleChooseEliminate,
        handleRequestEliminate, handleStrongestEliminate, register_callback])

    useEffect(() => {
        if (user.username === game.master.username) setIsGameMaster(true)
        set_connection(socket, user, game.id)
        console.log(game)
    }, [game, socket, user])

    return (
        <div>
            <Header/>
            <div className={classes.Wrapper}>
                <div className={classes.GameCode}>
                    {gameStarted || !isGameMaster ?
                        <MyForm list={[
                            <Typography variant="h6" key="time">Время:</Typography>,
                            <Typography variant="h4" key="time-value">{timer}</Typography>
                        ]}/>
                        :
                        <MyForm list={[
                            <Typography variant="h6" key="code">Код игры:</Typography>,
                            <Typography variant="h4" key="code-value">{game.code}</Typography>
                        ]}/>
                    }
                </div>
                <Card className={classes.GameMaster}>
                    <Typography variant="h4" style={{alignSelf: "center", marginBottom: "20px"}}>Ведущий:</Typography>
                    <img className={classes.MasterPicture} src={`data:image/png;base64,${game.master.picture.data}`}/>
                    <Typography className={classes.MasterUsername} variant="h4">{game.master.username}</Typography>
                </Card>
                <div className={classes.MasterActions}>
                    <MyForm list={
                        isGameMaster ?
                            gameStarted ?
                                [<Button style={{width: "75%", height: "50px", marginTop: "10px"}} key="right" variant="outlined" onClick={handleRightAnswer}>Верный ответ</Button>,
                                <Button style={{width: "75%", height: "50px", marginTop: "10px"}} key="wrong" variant="outlined" onClick={handleWrongAnswer}>Неверный ответ</Button>,
                                <Button style={{width: "75%", height: "50px", marginTop: "10px"}} key="bank-button" variant="outlined" onClick={handleBankButton}>Банк</Button>]
                                :
                                firstRound
                                    ?
                                    [<Button style={{width: "75%", height: "50px", marginTop: "10px"}} key="reveal" variant="outlined" onClick={handleRevealButton} disabled={game.eliminationEnded}>Показать голос</Button>,
                                     <Button style={{width: "75%", height: "50px", marginTop: "10px"}} key="start" variant="outlined" onClick={handleRoundStartButton}>Начать игру</Button>,
                                     <Button style={{width: "75%", height: "50px", marginTop: "10px"}} key="eliminate" variant="outlined" disabled={!game.eliminationEnded || game.eliminatedPlayer != ''} onClick={handleEliminateButton}>Исключение</Button>]

                                    :
                                    [<Button style={{width: "75%", height: "50px", marginTop: "10px"}} key="start" variant="outlined" onClick={handleRoundStartButton}>Начать игру</Button>]
                            :
                            [<Typography key="luck" variant="h4" style={{textAlign: "center"}}>Приятной игры!</Typography>]
                    }/>
                </div>
                <div className={classes.FirstPlayersRow}>
                    {game.players.slice(0, 6).map((player, index) =>
                        <PlayerCard key={`user${index}`} index={index} currentPlayer={game.currentPlayer} user={player} revealed={player.revealed} eliminated={player.eliminated} pollResult={player.pollResult}/>
                    )}
                </div>
                <div className={classes.GameInfo}>
                    {
                        firstRound && !gameStarted && !isGameMaster && !game.eliminationEnded
                        ?
                            <FormControl style={{width: "50%"}}>
                                <InputLabel id="eliminate-select-label">Кандидат на выбывание:</InputLabel>
                                <Select
                                    labelId="eliminate-select-label"
                                    id="eliminate-select"
                                    value={game.userPoll}
                                    label="Кандидат на выбывание:"
                                    onChange={handleChangeEliminate}
                                    inputProps={{readOnly: selectionFinished}}
                                >
                                    {game.players.filter((player) => !player.eliminated).map((player) =>
                                        <MenuItem key={`player${player.username}`} value={player.username}>{player.username}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        :
                            <div></div>
                    }
                    {
                        chooseEliminate
                        ?
                            <FormControl style={{width: "50%"}}>
                                <InputLabel id="eliminate-label">Игрок на выбывание:</InputLabel>
                                <Select
                                    labelId="eliminate-label"
                                    id="eliminate"
                                    value={eliminationChoice}
                                    label="Age"
                                    onChange={handleChangeStrongestEliminate}
                                >
                                    {eliminateChoices.map((player) =>
                                        <MenuItem key={`player${player}`} value={player}>{player}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        :
                            <div></div>
                    }
                    <Typography variant="h3">
                        {game.eliminatedPlayer != '' ?
                            `${game.eliminatedPlayer}, вы - самое слабое звено!`
                            :
                            !firstRound
                                ?
                                "Ожидание начала игры"
                                :
                                gameStarted
                                    ?
                                    "Раунд начался!"
                                    :
                                    strongestEliminate
                                        ?
                                        chooseEliminate
                                            ?
                                            "Выберите игрока для исключения"
                                            :
                                            "Самое сильное звено выбирает игрока"
                                        :
                                        "Выберите кандидата для исключения"
                        }
                    </Typography>
                </div>
                <div className={classes.SecondPlayersRow}>
                    {game.players.slice(6, 12).map((player, index) =>
                        <PlayerCard key={`user${index + 6}`} index={index + 6} currentPlayer={game.currentPlayer} user={player} eliminated={player.eliminated} revealed={player.revealed} pollResult={player.pollResult}/>
                    )}
                </div>
                <div className={classes.GameBank}>
                    <MyForm list={[
                        <Typography variant="h6" key="bank">Банк:</Typography>,
                        <Typography variant="h4" key="bank-value">{game.bank}</Typography>
                    ]}/>
                </div>
                <div className={classes.GameLevels}>
                    <MyForm list={[
                        game.levels.map((level, index) =>
                            <Level key={`level${index}`} level={level} index={index} currentLevel={game.currentLevel}/>
                        ).reverse()
                    ]}/>
                </div>
            </div>
        </div>
    );
}

export default Game;