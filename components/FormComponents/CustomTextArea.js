import React from 'react';
import {StyleSheet, View, TextInput, Text} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import PropTypes from 'prop-types';

const CustomTextArea = ({toState}) => {

    return (
        <View style={styles.MainContainer}>
            <Text style={styles.title}>OBSERVACIONES:</Text>
            <TextInput
                style={styles.TextInputStyleClass}
                underlineColorAndroid="transparent"
                placeholder={"  Introduce aquí tus observaciones..."}
                onChangeText={(text) => toState(text)}
                // placeholderTextColor={"#9E9E9E"}
                placeholderTextColor={COLORS.primary}
                numberOfLines={5}
                multiline={true}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    MainContainer: {
        width: '100%',
    },
    title: {
        textAlign: 'left',
        fontFamily: 'Anton',
        color: COLORS.black,
    },
    TextInputStyleClass: {
        padding: 15,
        margin: 5,
        borderRadius: 5,
        backgroundColor: "#FF850050",
    }
});

CustomTextArea.propTypes = {
    toState: PropTypes.func.isRequired,
};

export default CustomTextArea;