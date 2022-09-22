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
import * as NavigationBar from "expo-navigation-bar";
import {setStatusBarHidden} from "expo-status-bar";
import {COLORS} from "./assets/defaults/settingStyles";
import {SafeAreaView, StatusBar} from "react-native";

Sentry.init({
    dsn: __DEV__ ? SENTRY_DSN : SENTRY_DSN,//enter your sentry dsn.
    enableInExpoDevelopment: true,
    debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

function App() {

    NavigationBar.setPositionAsync("relative");
    NavigationBar.setBehaviorAsync("overlay-swipe");

    const visibility = NavigationBar.useVisibility();
    useEffect(() => {
        if (visibility === "visible") {
            const interval = setTimeout(() => {
                NavigationBar.setVisibilityAsync("hidden");
            }, 3000);

            return () => {
                clearTimeout(interval);
            };
        }

    }, [visibility]);

    const [loadScreen, setLoadScreen] = useState(true);
    const [firstPresentation, setFirstPresentation] = useState(true);

    useEffect(() => {
        let isMounted = true;

        getDatas('@UserDataForm')
            .then(resolve => {
                if (!resolve) {
                    return storeData('@UserDataForm', {
                        "email": "",
                        "enterprise": "",
                        "name": "",

                    })
                }
            })
            .then(() => {
                if (__DEV__) console.log('created or exist @UserDataForm')
            })
            .catch(err => Sentry_Alert('App.js', '@UserDataForm', err));

        getDatas('@NullCopiesData')
            .then(resolve => {
                if (!resolve) {
                    return storeData('@NullCopiesData', {
                        "nullcopiesbydefault": "",
                        "nullcopiesbyedition": ""
                    })
                }
            })
            .then(() => {
                if (__DEV__) console.log('created or exist @NullCopiesData')
            })
            .catch(err => Sentry_Alert('App.js', '@NullCopiesData', err))

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

        checkExistFolder(appFolder)
            .then(response => {
                if (!response) {
                    return checkAndCreateFolder(appFolder)
                }
            })
            .then(() => {
                if (__DEV__) console.log('appFolder created or exist')
            })
            .catch(err => Sentry_Alert('App.js', 'checkExistFolder(appFolder)', err))
        checkExistFolder(appHTMLfolderForPdf)
            .then(response => {
                if (!response) {
                    return checkAndCreateFolder(appHTMLfolderForPdf)
                }
            })
            .then(() => {
                if (__DEV__) console.log('appHTMLfolderForPdf created or exist')
            })
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
            <StatusBar
                hidden={true}
            />
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
