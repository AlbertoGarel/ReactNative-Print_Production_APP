import React from 'react';
import {TouchableOpacity, SafeAreaView, View, Text, ScrollView, StyleSheet, StatusBar, Vibration, Alert} from "react-native";
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Onboarding from "./screens/Onboarding";
import {COLORS} from './assets/defaults/settingStyles'
import SettingsScreen from "./screens/SettingsScreen";
import {Fontisto as Icon} from "@expo/vector-icons";
import HomeStack from "./StacksScreens/HomeStack";
import {AdMobBanner} from "expo-ads-admob";
import Constants from 'expo-constants';
import SvgComponent from "./components/SvgComponent";
import {semicircle2} from "./assets/svg/svgContents";
import listeners from "react-native-web/dist/exports/AppState";
import SettingsProductionScreen from "./screens/productionScreens/SettingsProductionScreen";
import {Platform} from 'react-native';
import DataBaseScreen from "./screens/DataBaseScreen";
// paddingTop: Constants.statusBarHeight
/**
 *  Optimize memory usage and performance
 * */
import {enableScreens} from 'react-native-screens';
import SearchScreen from "./screens/SearchScreen";

enableScreens();

const Tab = createBottomTabNavigator();

const Routes = ({navigation}) => {
    const paddingTop = Constants.statusBarHeight
    const buttonCreateTabNabStyle = () => {

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
                    // activeBackgroundColor: "#feb72b",
                    inactiveTintColor: "#C2C2C2",
                    // inactiveBackgroundColor: "#527318",
                }}>
                <Tab.Screen
                    name="HomeStack"
                    component={HomeStack}
                    // children={()=><HomeStack initialpage={2}/>}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({color = 'red', size = 12}) => (
                            <Icon name={'home'} size={size} color={color}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="DataBaseStack"
                    component={DataBaseScreen}
                    // children={()=><Onboarding initialpage={0}/>}
                    options={{
                        tabBarLabel: 'BBDD' +
                            '',
                        tabBarIcon: ({color = 'red', size = 12}) => (
                            <Icon name={'database'} size={size} color={color}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="CreateStack"
                    component={SettingsProductionScreen}
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
                                // onPress={Vibration.vibrate(100)}
                            >
                                <Icon name={'plus-a'}
                                      size={30}
                                      color={color}
                                      style={{
                                          width: 70,
                                          height: 70,
                                          color: 'white',
                                          backgroundColor: '#FF8000',
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
                    component={SearchScreen}
                    options={{
                        tabBarLabel: 'Search',
                        tabBarIcon: ({color = 'red', size = 12}) => (
                            <Icon name={'search'} size={size} color={color}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SettingsStack"
                    component={SettingsScreen}
                    // children={()=><Onboarding initialpage={0}/>}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({color = 'red', size = 12}) => (
                            <Icon name={'player-settings'} size={size} color={color}/>
                        ),
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
