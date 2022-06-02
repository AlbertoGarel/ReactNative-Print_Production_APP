import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Alert, ImageBackground} from 'react-native';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import Routes from "./Routes";
import * as SQLite from 'expo-sqlite';
import {openDatabase} from './dbCRUD/actionsSQL';
import SplashScreen from "./screens/SplashScreen";
import {appFolder, appHTMLfolderForPdf, checkAndCreateFolder, checkExistFolder} from "./data/FileSystemFunctions";
import IntroductionScreen from "./screens/Introduction/IntroductionScreen";
import {getDatas, storeData} from "./data/AsyncStorageFunctions";

function App() {
// let i = false
    const [loadScreen, setLoadScreen] = useState(true);
    const [firstPresentation, setFirstPresentation] = useState(true);
    // const createFolder = `${FileSystem.documentDirectory}documentsAppBobinas`;

    useEffect(() => {
        let isMounted = true;

        getDatas('@introduction')
            .then(response => {
                if(response === false){
                    setFirstPresentation(response)
                }
            })
            .catch(() => {
               alert('false')
            });

        // openDatabase()
        //     .then(response => showToast('CONECTANDO CON BASE DE DATOS...'))
        //     .catch(error => showToast('ERROR EN DB'));
        openDatabase()
            .then(response => response)
            .catch(error => error);

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

    function HandlerPresentation() {
        storeData('@introduction', false)
            .then(()=> setFirstPresentation(false))
            .catch(()=> alert('error'))
    }
    // if(!i){
    //     return <SplashScreen/>
    // }

    return (
        <NavigationContainer>
            {
                loadScreen ?
                    <SplashScreen/>
                    :
                    firstPresentation
                        ? <IntroductionScreen
                            setFirstPresentation={HandlerPresentation}
                        />
                        : <Routes/>
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
