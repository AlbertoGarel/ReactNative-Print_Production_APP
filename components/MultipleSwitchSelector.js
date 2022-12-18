import React from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import {COLORS} from "../assets/defaults/settingStyles";

const MultipleSwitchSelector = ({
                                    label_values,
                                    handler,
                                }) => {

    return (
        <View style={styles.contSwitch}>
            <Text style={styles.switchTitle}>Selecion de operaciones:</Text>
            <SwitchSelector options={label_values} initial={0}
                            onPress={value => handler(value)}
                            animationDuration={125}
                            textColor={COLORS.primary}
                            buttonColor={COLORS.primary}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    contSwitch: {
        width: '100%',
        backgroundColor: 'rgba(250,250,250,.4)',
        padding: 10
    },
    switchTitle: {
        fontFamily: 'Anton',
        color: COLORS.white,
        fontSize: 20,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1
    }
});

export default MultipleSwitchSelector;