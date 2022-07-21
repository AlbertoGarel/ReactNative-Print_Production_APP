import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from "./Routes";
import {openDatabase} from './dbCRUD/actionsSQL';
import SplashScreen from "./screens/SplashScreen";
import {appFolder, appHTMLfolderForPdf, checkAndCreateFolder, checkExistFolder} from "./data/FileSystemFunctions";
import IntroductionScreen from "./screens/Introduction/IntroductionScreen";
import {getDatas, storeData} from "./data/AsyncStorageFunctions";

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
            .catch(() => {
                alert('false')
            });

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
            .then(() => setFirstPresentation(false))
            .catch(() => alert('error'))
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
