import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

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
        backgroundColor: '#F85F2350'
    },
    title: {
        fontWeight: '900',
        fontSize: 24,
        fontFamily: 'Anton',
        color: 'grey'
    },
    explanation: {
        fontSize: 16,
        color: 'dimgrey',
        textAlign: 'left',
    }
});

export default SettingsProductionHeader;