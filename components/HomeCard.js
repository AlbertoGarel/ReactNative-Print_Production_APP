import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Vibration} from 'react-native';
import {COLORS} from '../assets/defaults/settingStyles';
import SvgComponent from "./SvgComponent";


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
                <Text style={styles.title}>{cardtitle}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        display: 'flex',
        justifyContent: "flex-start",
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        borderRadius: 10,
        borderLeftWidth: 10,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 12,
    },
    contIco: {
        width: '20%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10
    },
    backgroundIcon: {
        width: '100%',
        height: '100%',
        opacity: 0.95,
        justifyContent: 'center',
        position: 'absolute',
        borderRadius: 10
    },
    icon: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        padding: 4,
    },
    conTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        backgroundColor: 'transparent'
    },
    title: {
        textAlign: 'center',
        fontFamily: "Anton"
    },
    content: {
        width: '100%',
        textAlign: 'justify',
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    hr: {
        borderBottomWidth: 2,
        marginTop: 8,
        marginBottom: 4,
        width: '100%'
    },
    touchable: {
        borderRadius: 20,
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
