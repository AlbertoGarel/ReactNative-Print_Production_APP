import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import {COLORS} from "../assets/defaults/settingStyles";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Onboarding from "../screens/Onboarding";

const HomeStack = () => {

    const Stack = createStackNavigator();

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
        </Stack.Navigator>
    );
};

export default HomeStack;
