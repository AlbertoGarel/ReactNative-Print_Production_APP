import React from 'react';
import {View, SafeAreaView} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Meditionstyle from "../drawerScreens/MeditionStyle";
import CoeficienteScreen from "../drawerScreens/CoeficienteScreen";
import PaginationScreen from "../drawerScreens/PaginationScreen";
import InitialDrawerScreen from "../drawerScreens/InitialDrawerScreen";
import {COLORS} from "../assets/defaults/settingStyles";


const DataBaseScreen = () => {
    const Drawer = createDrawerNavigator();

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                <Drawer.Navigator initialRouteName="InitialDrawerScreen"
                                  drawerContentOptions={{
                                      activeTintColor: COLORS.primary,
                                      itemStyle: {marginVertical: 1},
                                  }}
                >
                    <Drawer.Screen name="InitialDrawerScreen" component={InitialDrawerScreen}/>
                    <Drawer.Screen name="Meditionstyle" component={Meditionstyle}/>
                    <Drawer.Screen name="CoeficienteScreen" component={CoeficienteScreen}/>
                    <Drawer.Screen name="PaginationScreen" component={PaginationScreen}/>
                </Drawer.Navigator>
            </View>
        </SafeAreaView>
    )
}

export default DataBaseScreen;