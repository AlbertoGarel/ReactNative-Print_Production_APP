import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import {COLORS} from "../assets/defaults/settingStyles";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Onboarding from "../screens/Onboarding";
import SimpleProductionScreen from "../screens/SimpleProductionScreen";
import {getFocusedRouteNameFromRoute} from '@react-navigation/native'
import IndividualCalculation from "../screens/IndividualCalculation";
import {Fontisto as Icon} from "@expo/vector-icons";

const HomeStack = ({navigation, route}) => {

    const Stack = createStackNavigator();

    // useEffect(() => {
    //     const tabHiddenRoutes = [
    //         "Producción Simplificada",
    //         "Boarding",
    //         "Profile",
    //         "Cálculo Individual"
    //     ];
    //     if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
    //         navigation.setOptions({
    //             tabBarVisible: false,
    //         });
    //     } else {
    //         navigation.setOptions({
    //             tabBarVisible: true,
    //         });
    //     }
    // }, [navigation, route]);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'App bobinas',
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerShown: false
                }}

            />
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen name="Settings" component={SettingsScreen}
                          options={{
                              title: 'App bobinas',
                              headerStyle: {
                                  backgroundColor: COLORS.primary,
                              },
                              headerTintColor: '#fff',
                              headerTitleStyle: {
                                  fontWeight: 'bold',
                              },
                              headerShown: false
                          }}
            />
            <Stack.Screen name="Boarding" component={Onboarding} options={{headerShown: false}}/>
            <Stack.Screen name="Producción Simplificada" component={SimpleProductionScreen}
                          options={{headerShown: true}}/>
            <Stack.Screen name="Cálculo Individual" component={IndividualCalculation} options={{headerShown: true}}/>
        </Stack.Navigator>
    );
};

export default HomeStack;
