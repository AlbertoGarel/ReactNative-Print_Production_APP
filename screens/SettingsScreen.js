import React from 'react';
import {SafeAreaView, View, Text, ScrollView} from "react-native";
import {COLORS} from "../assets/defaults/settingStyles";
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Onboarding from "./Onboarding";
import HomeScreen from "./HomeScreen";
import {Fontisto as Icon} from "@expo/vector-icons";
import {semicircle2} from "../assets/svg/svgContents";
import BgComponent from "../components/BackgroundComponent/BgComponent";
import HomeHeader from "../components/headers/HomeHeader";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SettingsScreen = ({navigation}) => {
    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: semicircle2, svgWidth: '120%', svgHeight: '110%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: 0, right: 0
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background_primary,}}>
            <BgComponent
                svgOptions={optionsSVG}
                styleOptions={optionsStyleContSVG}
            />
            <HomeHeader
                textprops={{color: '#FFFFFF', marginTop: 15}}
                imageBg={'#FFFFFF'}
                titleColor={'#FFFFFF'}
                text={'SETTINGS:\n React Native tiene algunos documentos excelentes, así que después de leer esto, pensé que sería pan comido.'}
            />
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                padding: 40,
                backgroundColor: 'transparent',
            }}>
                <Text>hola settings</Text>
            </View>
        </SafeAreaView>
    );
};

export default SettingsScreen;
