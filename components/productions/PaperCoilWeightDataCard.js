import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";

const PaperCoilWeightDataCard = ({stylesPeperCoilWeight, restoInicioData, restoFinalData, styleRestPrev}) => {

    const [pressed, getPressed] = useState(false)

    useEffect(() => {
        let isMounted = true;
        if (pressed) {
            isPressed();
        }
        if (!isMounted) {
            clearTimeout(isPressed);
        }
        return () => {
            clearTimeout(isPressed);
            isMounted = false
        };
    }, [pressed]);

    const isPressed = React.useCallback(() => {
        setTimeout(() => {
            getPressed(false)
        }, 3000);
    }, []);

    return (
        <View style={stylesPeperCoilWeight.parent}>
            <View style={[styles.subparent, styleRestPrev ? {
                backgroundColor: pressed ? COLORS.buttonEdit : '#FFFACD',
                marginRight: 5
            } : null]}>
                {!pressed ?
                    <Text style={stylesPeperCoilWeight.textRFinal}>Resto
                        inicial: <Text style={stylesPeperCoilWeight.subText}>{restoInicioData}</Text> Kg.</Text>
                    :
                    <Text style={[stylesPeperCoilWeight.textRFinal, styles.textrestoFinal]}>Previsión anterior
                        producción</Text>
                }
                {styleRestPrev && !pressed ?
                    <Text style={styles.textInfo}
                          onPress={() => getPressed(true)}
                    >i</Text>
                    :
                    null
                }
            </View>
            <View style={[stylesPeperCoilWeight.subCont, {paddingLeft: 0}]}>
                <Text style={stylesPeperCoilWeight.textRFinal}>Resto Final: <Text
                    style={stylesPeperCoilWeight.subText}>{restoFinalData}</Text> Kg.</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    subparent: {flexDirection: 'row', justifyContent: 'space-between'},
    textrestoFinal: {
        fontFamily: 'Anton',
        left: 0,
        padding: 4,
        fontSize: 12,
        top: 0
    },
    textInfo: {
        paddingRight: 10,
        paddingLeft: 10,
        marginRight: 2,
        fontFamily: 'Anton',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: 'white',
        color: 'red',
        textAlign: 'center'
    }
});

export default PaperCoilWeightDataCard;