import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {COLORS} from "../assets/defaults/settingStyles";
import SvgComponent from "./SvgComponent";
import {pdfSVG, searchCode} from "../assets/svg/svgContents";

const LargeButton = ({handlerSaveDataAndSend, enabled}) => {

    return (
        <View style={[styles.contLargeButton,{opacity: enabled ? 1 : 0.3}]}>
            <TouchableOpacity style={styles.touchable}
                              onPress={handlerSaveDataAndSend}
                              disabled={!enabled}
            >
                <View style={styles.contIcon}>
                    <SvgComponent
                        svgData={pdfSVG}
                        svgWidth={60}
                        svgHeight={60}
                    />
                </View>
                <Text style={styles.textButton}>crear informe pdf</Text>
            </TouchableOpacity>
        </View>
    )
};
const styles = StyleSheet.create({
    contLargeButton: {
        padding: 10,
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchable: {
        width: '100%',
        padding: 5,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: '#96c4c4',
    },
    contIcon: {
        position: 'absolute',
        left: 12,
        transform: [{translateY: -12}]
    },
    textButton: {
        fontFamily: 'Anton',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: COLORS.black,
        textShadowColor: COLORS.white,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1
    }
});
export default LargeButton;