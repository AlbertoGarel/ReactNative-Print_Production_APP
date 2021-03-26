import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Routes from "./Routes";
import SplashScreen from "./screens/SplashScreen";
import * as SQLite from 'expo-sqlite';
import {openDatabase} from './dbCRUD/actionsSQL'

// const db = SQLite.openDatabase();

function App() {

    const [loadScreen, setLoadScreen] = useState(true);

    useEffect(() => {
        openDatabase()
            .then(response => Alert.alert('BBD is ok'))
            .catch(error => Alert.alert('ERROR EN DB'))
    }, []);

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
