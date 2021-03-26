import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";

const SettingsProductionHeader = ({
                                      pagenumber,
                                      explanation
                                  }) => {

    return (
        <View style={styles.contPrinc}>
            <Text style={styles.title}>
                PASO {pagenumber}
            </Text>
            <Text style={styles.explanation}>
                {explanation}
            </Text>
        </View>
    )
};

const styles = StyleSheet.create({
    contPrinc: {
        width: '100%',
        minHeight: 100,
        padding: 10,
        backgroundColor: COLORS.background_primary
    },
    title: {
        fontWeight: '900',
        fontSize: 24,
        fontFamily: 'Anton',
        color: COLORS.whitesmoke
    },
    explanation: {
        fontSize: 16,
        color: COLORS.whitesmoke,
        textAlign: 'left',
    }
});

export default SettingsProductionHeader;