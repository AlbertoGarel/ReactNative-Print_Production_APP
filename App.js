import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Alert, ImageBackground} from 'react-native';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import Routes from "./Routes";
import SplashScreen from "./screens/SplashScreen";
import * as SQLite from 'expo-sqlite';
import {openDatabase} from './dbCRUD/actionsSQL';
import Toast from "react-native-easy-toast";
import ToastMesages from "./components/ToastMessages";
import * as FileSystem from 'expo-file-system';
import {appFolder, appHTMLfolderForPdf, checkAndCreateFolder, checkExistFolder} from "./data/FileSystemFunctions";

function App() {

    const [loadScreen, setLoadScreen] = useState(true);
    // const createFolder = `${FileSystem.documentDirectory}documentsAppBobinas`;

    useEffect(() => {
        let isMounted = true;

        openDatabase()
            .then(response => showToast('CONECTANDO CON BASE DE DATOS...'))
            .catch(error => showToast('ERROR EN DB'));

        checkAndCreateFolder(appFolder)
            .then(response => response)
            .catch(err => err);
        checkAndCreateFolder(appHTMLfolderForPdf)
            .then(response => response)
            .catch(err => err);

        checkExistFolder(appFolder)
            .then(response => response)
            .catch(err => console.log(err))
        checkExistFolder(appHTMLfolderForPdf)
            .then(response => response)
            .catch(err => console.log(err))

        setTimeout(() => {
            setLoadScreen(false)
        }, 4000);

        return () => isMounted = false;
    }, []);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoadScreen(false)
    //     }, 4000);
    // });

    let toastRef;
    const showToast = (message) => {
        toastRef.show(message);
    }

    return (
        <NavigationContainer>
            {
                loadScreen ?
                    <SplashScreen/>
                    :
                    <Routes/>
            }
            <ToastMesages
                _ref={(toast) => toastRef = toast}
                _style={{backgroundColor: '#FFFFFF'}}
                _position='bottom'
                _positionValue={200}
                _fadeInDuration={150}
                _fadeOutDuration={4000}
                _opacity={1}
                _textStyle={{color: '#000000', fontFamily: 'Anton'}}
            />
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
