import React, {useState, useEffect} from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    Image
} from 'react-native';
import Constants from 'expo-constants';// paddingTop: Constants.statusBarHeight
import {COLORS} from '../assets/defaults/settingStyles';
import HomeCard from "../components/HomeCard";
import BgComponent from "../components/BackgroundComponent/BgComponent";
import {semicircle2} from "../assets/svg/svgContents";
import HomeHeader from "../components/headers/HomeHeader";
import Caroussel from "../components/Caroussel";


const HomeScreen = ({navigation}) => {
    //ICON SIZE
    const iconSize = 40;
    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: semicircle2, svgWidth: '120%', svgHeight: '110%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: 0, right: 0
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <BgComponent
                svgOptions={optionsSVG}
                styleOptions={optionsStyleContSVG}
            />
            <HomeHeader
                textprops={{color: COLORS.white, marginTop: 15}}
                imageBg={COLORS.white}
                titleColor={COLORS.white}
                titleSecction={"#HOME"}
                text={'React Native tiene algunos documentos excelentes, así que después de leer esto, pensé que sería pan comido.'}
            />
            <Caroussel
                items={'s'}
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
                <View style={styles.subcont}>
                    <HomeCard
                        iconName={"calculator"}
                        iconSize={iconSize}
                        iconColor={COLORS.quinary}
                        cardtitle={"Cálculo individual"}
                        title="Go to Onboard"
                        navigation={navigation}
                        torender={["Cálculo Individual"]}
                    />
                </View>
                <View style={styles.subcont}>
                    <HomeCard
                        iconName={"database"}
                        iconSize={iconSize}
                        iconColor={COLORS.quinary}
                        cardtitle={"producción simple"}
                        content={"Calcula el resto final de la bobina según su radio o kg necesarios según los ejemplares."}
                        title="Go to Onboard"
                        navigation={navigation}
                        torender={['Producción Simplificada']}
                    />
                </View>
                <View style={styles.subcont}>
                    <HomeCard
                        iconName={"bell"}
                        iconSize={iconSize}
                        iconColor={COLORS.quinary}
                        cardtitle={"Cálculo"}
                        title="Go to Onboard"
                        navigation={navigation}
                        torender={['Profile', {name: 'Elena'}]}
                    />
                </View>
                <View style={styles.subcont}>
                    <HomeCard
                        iconName={"bar-chart"}
                        iconSize={iconSize}
                        iconColor={COLORS.quinary}
                        cardtitle={"Cálculos"}
                        title="Go to Onboard"
                        navigation={navigation}
                        torender={['Profile', {name: 'Elena'}]}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'flex-start'
    },
    buttons: {
        backgroundColor: 'red',
    },
    touchable: {
        backgroundColor: COLORS.white,
        marginTop: 5,
        marginBottom: 5,
        padding: 5
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 12,
    },
    subcont: {
        width: '50%',
        height: '50%',
        backgroundColor: 'transparent',
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
export default HomeScreen;