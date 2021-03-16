import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Routes from "./Routes";
import SplashScreen from "./screens/SplashScreen";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("appbobbins.db");

function App() {

    const [loadScreen, setLoadScreen] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoadScreen(false)
        }, 4000);
    });

    return (
        <NavigationContainer>
            {
                loadScreen ?
                    <SplashScreen/>
                    :
                    <Routes/>
            }
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99
    },
});
export default App;
