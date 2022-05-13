import React from 'react';
import ReactDOM from 'react-dom'; //glue between React and the DOM, needed to mount app with ReactDOM.render
import { AuthContextProvider } from './context/AuthContext';
import { AppContextProvider } from './context/AppContext';
import App from './App';

import './index.scss';

ReactDOM.render(
    <React.StrictMode>
        <AppContextProvider>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </AppContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);