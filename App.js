import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from "./Routes";
import {openDatabase} from './dbCRUD/actionsSQL';
import SplashScreen from "./screens/SplashScreen";
import {appFolder, appHTMLfolderForPdf, checkAndCreateFolder, checkExistFolder} from "./data/FileSystemFunctions";
import IntroductionScreen from "./screens/Introduction/IntroductionScreen";
import {getDatas, storeData} from "./data/AsyncStorageFunctions";
// SENTRY.IO ERRORS LOG
import * as Sentry from 'sentry-expo';
import {SENTRY_DSN} from "./projectKeys";
import {Sentry_Alert} from "./utils";

Sentry.init({
    dsn: SENTRY_DSN,//enter your sentry dsn.
    enableInExpoDevelopment: true,
    debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

function App() {

    const [loadScreen, setLoadScreen] = useState(true);
    const [firstPresentation, setFirstPresentation] = useState(true);

    useEffect(() => {
        let isMounted = true;

        getDatas('@introduction')
            .then(response => {
                if (response === false) {
                    setFirstPresentation(response)
                }
            })
            .catch((err) => {
                Sentry_Alert('App.js', '@introduction', err);
            });

        openDatabase()
            .then(response => response)
            .catch(err => Sentry_Alert('App.js', 'openDatabase', err));

        checkAndCreateFolder(appFolder)
            .then(response => response)
            .catch(err => Sentry_Alert('App.js', 'checkAndCreateFolder(appFolder)', err));
        checkAndCreateFolder(appHTMLfolderForPdf)
            .then(response => response)
            .catch(err => Sentry_Alert('App.js', 'checkAndCreateFolder(appHTMLfolderForPdf)', err));

        checkExistFolder(appFolder)
            .then(response => response)
            .catch(err => Sentry_Alert('App.js', 'checkExistFolder(appFolder)', err))
        checkExistFolder(appHTMLfolderForPdf)
            .then(response => response)
            .catch(err => Sentry_Alert('App.js', 'checkExistFolder(appHTMLfolderForPdf)', err))

        setTimeout(() => {
            setLoadScreen(false)
        }, 4000);

        return () => isMounted = false;
    }, []);

    function HandlerPresentation() {
        storeData('@introduction', false)
            .then(() => setFirstPresentation(false))
            .catch((err) => Sentry_Alert('App.js', 'HandlerPresentation', err));
    }

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

export default App;
