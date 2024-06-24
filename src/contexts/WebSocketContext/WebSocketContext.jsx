import {createContext, useContext} from "react";
import {useWebSocket} from "../../hooks/useWebSocket/useWebSocket";

const Context = createContext(null)

export const WebSocketContextProvider = ({children, ...props}) => {
    const context = useWebSocket(process.env.REACT_APP_SERVER_URL)
    return <Context.Provider value={context}>{children}</Context.Provider>
}

export const useWebSocketContext = () => {
    const context = useContext(Context)
    if (!context) throw new Error('Use websocket context within provider')
    return context
}