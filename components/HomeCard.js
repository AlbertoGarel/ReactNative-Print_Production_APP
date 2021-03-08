import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Vibration, Animated} from 'react-native';
import {COLORS, GRADIENT_COLORS} from '../assets/defaults/settingStyles';
import {Fontisto as Icon} from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';
import * as Font from "expo-font";


const HomeCard = ({
                      iconName,
                      iconSize,
                      iconColor,
                      idcolor,
                      cardtitle,
                      content,
                      title,
                      navigation,
                      torender
                  }) => {

    const [isFontLoad, setIsfontLoad] = useState(false)

    const actionHandler = (goto) => {
        Vibration.vibrate(100)
        navigation.navigate(...goto)
    }

    useEffect(() => {
        Font.loadAsync({
            "Anton": require("../assets/fonts/Anton-Regular.ttf"),
        }).then(response => setIsfontLoad(true));
    }, []);

    return (
        <TouchableOpacity
            title={title}
            style={{
                borderRadius: 20,
                backgroundColor: '#FFF',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 12,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 140,
                minHeight: 140
            }}
            onPress={() => actionHandler(torender)}
        >
            <View style={[styles.contIco, {width: iconSize / .8}]}>
                <Icon name={iconName} size={iconSize} color={iconColor} style={styles.icon}/>
            </View>
            <View style={styles.conTitle}>
                <Text style={[styles.title, {fontFamily: isFontLoad ? "Anton" : null}]}>{cardtitle}</Text>
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
        backgroundColor: '#FFF',
        shadowColor: '#000',
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
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 18,
        textAlign: 'center'
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
    }
})

export default HomeCard;
