import React from 'react';
import {StyleSheet, View} from 'react-native';
import BorderedButton from "../../components/BorderedButton";
import {COLORS} from "../../assets/defaults/settingStyles";
import IntroductionDots from "../../assets/images/introduction/IntroductionDots";

const IntroductionFooter = ({indice, datalength, handler, setFirstPresentation}) => {
    const change = datalength === indice;
    return (
        <>
            <View style={{backgroundColor: 'white', width: '100%'}}>
                <IntroductionDots
                    indice={indice}
                    datalength={datalength}
                />
            </View>
            <View style={[styles.imagenCont, indice === 0 ? styles.imagenContEnd : null]}>
                {indice > 0 && <BorderedButton
                    text={'BACK'} handlerFunction={() => handler('back')} styleButton={styles.button}
                    styleText={styles.textButton}
                />}
                {indice <= datalength && <BorderedButton
                    text={!change ? "NEXT" : "EXIT"}
                    handlerFunction={!change ? () => handler('next') : setFirstPresentation}
                    styleButton={[styles.button, !change ? null : styles.exitAction]}
                    styleText={[styles.textButton, change ? {color: COLORS.colorSupportfiv} : null]}
                />
                }
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    imagenCont: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: COLORS.colorSupportfiv,
        paddingVertical: 15
    },
    imagenContEnd: {
        justifyContent: 'flex-end'
    },
    button: {
        width: 120,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.colorSupportfiv,
        borderRadius: 5,
        borderWidth: 4,
        borderColor: COLORS.white,
    },
    exitAction: {
        backgroundColor: COLORS.white,
    },
    textButton: {
        color: 'white',
        fontWeight: 'bold'
    }
})

export default IntroductionFooter;