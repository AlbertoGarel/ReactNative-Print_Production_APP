import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    StatusBar,
    Vibration,
} from "react-native";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from './assets/defaults/settingStyles'
import SettingsScreen from "./screens/SettingsScreen";
import {Fontisto as Icon} from "@expo/vector-icons";
import HomeStack from "./StacksScreens/HomeStack";
import {AdMobBanner} from "expo-ads-admob";
import Constants from 'expo-constants';
import SettingsProductionScreen from "./screens/productionScreens/SettingsProductionScreen";
import {Platform} from 'react-native';
import DataBaseScreen from "./screens/DataBaseScreen";

/**
 *  Optimize memory usage and performance
 * */
import {enableScreens} from 'react-native-screens';
import SearchScreen from "./screens/SearchScreen";
import SettingsSimpleProductionScreen from "./screens/productionScreens/SettingsSimpleProductionScren";
import * as Font from "expo-font";

enableScreens();

const Tab = createBottomTabNavigator();

const Routes = ({navigation}) => {
    const paddingTop = Constants.statusBarHeight

    const [changeButtonFunc, setChangeButtonFunc] = useState(false);
    const [isFontLoad, setIsfontLoad] = useState(false);

    useEffect(() => {
        Font.loadAsync({
            "Anton": require("./assets/fonts/Anton-Regular.ttf"),
        }).then(response => setIsfontLoad(true));
    }, [])

    const buttonChangeTabNabStyleAndfunc = () => {
        setChangeButtonFunc()
    }

    const bannerError = () => {
        console.log("An error");
        return;
    }
    return (
        <SafeAreaView style={{
            flex: 1, backgroundColor: 'transparent',
            // paddingTop: Platform.Version < 30 ? paddingTop : 0
        }}>
            <StatusBar
                animated={true}
                backgroundColor={'transparent'}
                barStyle={Platform.Version < 30 ? 'dark-content' : 'light-content'}
                showHideTransition={'slide'}
                hidden={false}
                translucent={true}
            />
            <View style={{
                width: '100%',
                backgroundColor: COLORS.supportBackg1,
            }}>
                <AdMobBanner
                    style={styles.bottomBanner}
                    bannerSize="fullBanner"
                    adUnitID="ca-app-pub-3940256099942544/6300978111"
                    // Test ID, Replace with your-admob-unit-id
                    // testDeviceID="EMULATOR"
                    didFailToReceiveAdWithError={bannerError}
                />
            </View>
            <Tab.Navigator
                initialRouteName="Feed"
                tabBarOptions={{
                    activeTintColor: "#FF8000",
                    inactiveTintColor: "#C2C2C2",
                }}>
                <Tab.Screen
                    name="HomeStack"
                    children={(props) => <HomeStack {...props} setChangeButtonFunc={setChangeButtonFunc}/>}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({color = 'red', size = 12}) => (
                            <Icon name={'home'} size={size} color={color}/>
                        ),
                        //UNMOUNT COMPONENT ONBLUR
                        // unmountOnBlur: true
                    }}
                />
                <Tab.Screen
                    name="DataBaseStack"
                    children={(props) => <DataBaseScreen {...props} navigation={'navigation'}
                                                         setChangeButtonFunc={setChangeButtonFunc}/>}
                    options={{
                        tabBarLabel: 'BBDD' +
                            '',
                        tabBarIcon: ({color = 'red', size = 12}) => (
                            <Icon name={'database'} size={size} color={color}/>
                        ),
                    }}
                    listeners={{
                        tabPress: () => {
                            // e.preventDefault(); // Use this to navigate somewhere else
                            setChangeButtonFunc(false)
                        },
                    }}
                />
                <Tab.Screen
                    name="CreateStack"
                    children={(props) => changeButtonFunc ?
                        <SettingsSimpleProductionScreen {...props} setChangeButtonFunc={setChangeButtonFunc}/> :
                        <SettingsProductionScreen {...props}/>}
                    listeners={{
                        tabPress: () => {
                            // e.preventDefault(); // Use this to navigate somewhere else
                            Vibration.vibrate(100)
                        },
                    }}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({color = 'red', size = 20}) => (
                            <View style={{
                                width: 80,
                                height: 80,
                                marginBottom: 35,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                backgroundColor: 'white',
                                borderRadius: 100,
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                            >
                                <Icon name={'plus-a'}
                                      size={30}
                                      color={color}
                                      style={{
                                          width: 70,
                                          height: 70,
                                          color: 'white',
                                          backgroundColor: changeButtonFunc ? '#000' : '#FF8000',
                                          borderRadius: 100,
                                          textAlign: 'center',
                                          textAlignVertical: 'center'
                                      }}
                                />
                            </View>
                        ),
                    }}/>
                <Tab.Screen
                    name="SearchStack"
                    children={(props) => <SearchScreen {...props} setChangeButtonFunc={setChangeButtonFunc}/>}
                    options={{
                        tabBarLabel: 'Search',
                        tabBarIcon: ({color = 'red', size = 12}) => (
                            <Icon name={'search'} size={size} color={color}/>
                        ),
                    }}
                    listeners={{
                        tabPress: () => {
                            // e.preventDefault(); // Use this to navigate somewhere else
                            setChangeButtonFunc(false)
                        },
                    }}
                />
                <Tab.Screen
                    name="SettingsStack"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({color = 'red', size = 12}) => (
                            <Icon name={'player-settings'} size={size} color={color}/>
                        ),
                        // unmountOnBlur: true
                    }}
                    listeners={{
                        tabPress: () => {
                            // e.preventDefault(); // Use this to navigate somewhere else
                            setChangeButtonFunc(false)
                        },
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    bottomBanner: {
        elevation: 12,
        alignSelf: 'center'
    },
})

export default Routes;
