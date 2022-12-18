import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import PropTypes from "prop-types";

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
        minHeight: 50,
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

SettingsProductionHeader.propTypes = {
    pagenumber: PropTypes.number,
    explanation: PropTypes.string.isRequired,
};

export default SettingsProductionHeader;