import React from 'react';
import ReactDOM from 'react-dom/client';
import {CacheProvider} from "@emotion/react";
import createCache from "@emotion/cache";
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Provider} from "react-redux";
import {persistor, store} from "./store/store";
import {PersistGate} from "redux-persist/integration/react";
import { deepmerge } from "@mui/utils";
import {THEME_ID as MATERIAL_THEME_ID} from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const cache = createCache({
    key: 'css',
    prepend: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CacheProvider value={cache}>
        <ThemeProvider theme={{[MATERIAL_THEME_ID]: darkTheme}}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <CssBaseline/>
                        <App />
                    </PersistGate>
                </Provider>
        </ThemeProvider>
    </CacheProvider>
);
