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
            <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, styleRestPrev ? {
                backgroundColor: pressed ? COLORS.buttonEdit : '#FFFACD',
                marginRight: 5
            } : null]}>
                {!pressed ?
                    <Text style={stylesPeperCoilWeight.textRFinal}>Resto
                        inicial: <Text style={stylesPeperCoilWeight.subText}>{restoInicioData}</Text> Kg.</Text>
                    :
                    <Text style={[stylesPeperCoilWeight.textRFinal, {
                        fontFamily: 'Anton',
                        // position: 'absolute',
                        left: 0,
                        padding: 4,
                        fontSize: 12,
                        top: 0
                    }]}>Previsión anterior producción</Text>
                }
                {styleRestPrev && !pressed ?
                    <Text style={{
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
                    }}
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
export default React.memo(PaperCoilWeightDataCard, (prevProps, nextProps) => {
    return (prevProps.restoInicioData === nextProps.restoInicioData &&
        prevProps.restoFinalData === nextProps.restoFinalData)
});