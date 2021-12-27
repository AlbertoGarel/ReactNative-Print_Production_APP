import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import {COLORS} from "../assets/defaults/settingStyles";
import DocumentsViewerScreen from "../screens/DocumentsViewerScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Onboarding from "../screens/Onboarding";
import SimpleProductionScreen from "../screens/SimpleProductionScreen";
import {getFocusedRouteNameFromRoute} from '@react-navigation/native'
import IndividualCalculation from "../screens/IndividualCalculation";
import {Fontisto as Icon} from "@expo/vector-icons";
import FullProduction from "../screens/productionScreens/FullProduction";
import ChartsScreens from "../screens/ChartsScreen";

const HomeStack = ({navigation, route, setChangeButtonFunc}) => {

    const Stack = createStackNavigator();

    useEffect(() => {
        const tabHiddenRoutes = [
            "Producción Simplificada",
    //         "Boarding",
    //         "Profile",
    //         "Cálculo Individual"
        ];
        if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
            // navigation.setOptions({
            //     tabBarVisible: false,
            // });
            setChangeButtonFunc(true)
        } else {
            // navigation.setOptions({
            //     tabBarVisible: true,
            // });
            setChangeButtonFunc(false)
        }
    }, [navigation, route, setChangeButtonFunc]);


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
            <Stack.Screen name="pdf documents" component={DocumentsViewerScreen}
                          options={{
                              title: "Documentos .PDF",
                              headerStyle: {
                                  backgroundColor: COLORS.primary,
                              },
                              headerTintColor: '#fff',
                              headerTitleStyle: {
                                  fontWeight: 'bold',
                              },
                              headerShown: true
                          }}
            />
            <Stack.Screen name="charts" component={ChartsScreens}
                          options={{
                              title: "Gráficas",
                              headerStyle: {
                                  backgroundColor: COLORS.primary,
                              },
                              headerTintColor: '#fff',
                              headerTitleStyle: {
                                  fontWeight: 'bold',
                              },
                              headerShown: true
                          }}
            />
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
            <Stack.Screen name="Producción Simplificada"
                // component={SimpleProductionScreen}
                          children={(props) => <SimpleProductionScreen {...props} setChangeButtonFunc={setChangeButtonFunc}/>}
                          options={{headerShown: true}}/>
            <Stack.Screen name="Cálculo Individual" component={IndividualCalculation} options={{headerShown: true}}/>
            <Stack.Screen name="FullProduction" component={FullProduction} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

export default HomeStack;
