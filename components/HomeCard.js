import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Vibration, Dimensions} from 'react-native';
import {COLORS} from '../assets/defaults/settingStyles';
import SvgComponent from "./SvgComponent";

const windowHeight = Dimensions.get('window').height;

const HomeCard = ({
                      iconName,
                      iconSize,
                      iconColor,
                      cardtitle,
                      title,
                      navigation,
                      torender
                  }) => {

    const actionHandler = (goto) => {
        Vibration.vibrate(100)
        navigation.navigate(...goto)
    }

    return (
        <TouchableOpacity
            title={title}
            style={styles.touchable}
            onPress={() => actionHandler(torender)}
        >
            <View style={[styles.contIco, {width: iconSize / .8}]}>
                <SvgComponent svgData={iconName} svgHeight={iconSize} svgWidth={iconSize} color={iconColor}/>
            </View>
            <View style={styles.conTitle}>
                <Text style={styles.title} adjustsFontSizeToFit>{cardtitle}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    contIco: {
        width: '20%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    conTitle: {
        display: windowHeight <= 650 ?  'none' : 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        backgroundColor: 'transparent'
    },
    title: {
        textAlign: 'center',
        fontFamily: "Anton"
    },
    touchable: {
        borderRadius: 10,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 12,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    }
})

export default HomeCard;
