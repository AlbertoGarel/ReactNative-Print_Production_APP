import React from 'react';
import {SafeAreaView, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Fontisto as Icon} from "@expo/vector-icons";
import BgComponent from "../components/BackgroundComponent/BgComponent";
import {elephant, semicircle2} from "../assets/svg/svgContents";
import {COLORS} from "../assets/defaults/settingStyles";
import HomeHeader from "../components/headers/HomeHeader";
import {DrawerActions} from '@react-navigation/native';

const InitialDrawerScreen = ({navigation}) => {
    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: semicircle2, svgWidth: '120%', svgHeight: '110%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: 0, right: 0
    };
    //IMAGE PROP CONST
    const optionsSVGimage = {
        svgData: elephant, svgWidth: '90%', svgHeight: '90%'
    };
    const optionsStyleContSVGimage = {
        width: '100%', height: "100%", top: 90, right: 0
    };
    const number = 100;

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white,}}>
            <BgComponent
                svgOptions={optionsSVG}
                styleOptions={optionsStyleContSVG}
            />
            <BgComponent
                svgOptions={optionsSVGimage}
                styleOptions={optionsStyleContSVGimage}
            />
            <HomeHeader
                textprops={{color: COLORS.white, marginTop: 15}}
                imageBg={COLORS.white}
                titleColor={COLORS.white}
                titleSecction={'BASE DE DATOS'}
                text={'Modifica los datos de las tablas para realizar operaciones y define autopasters, gramajes, valores varios y más....'}
            />
            <View style={styles.parentCont}>
                <TouchableOpacity style={[styles.contExplain, {elevation: 12}]}
                                  onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Icon name={'angle-dobule-right'} size={29} color={COLORS.primary}
                          style={styles.ico}
                    />
                    <Text style={styles.explain}>
                        Arrastra para abrir el menú
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    parentCont: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center'
    },
    contExplain: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 10
    },
    ico: {
        alignSelf: 'flex-start'
    },
    explain: {
        fontFamily: 'Anton',
        marginLeft: 10
    }
});

export default InitialDrawerScreen;