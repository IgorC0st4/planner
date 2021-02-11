import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import Routes from './routes';
import SplashScreen from 'react-native-splash-screen';

import Database from './services/database';

const database = new Database();

export default function App() {
    useEffect(() => {
        database.init().then(() => {
            SplashScreen.hide();
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <Routes />
    );
};
