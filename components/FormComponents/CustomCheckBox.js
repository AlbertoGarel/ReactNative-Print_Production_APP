//0NLY ANDROID DEVICES. NOT SUPPORT BY iOS.
import Checkbox from 'expo-checkbox';
import React, {useState} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";

const CustomcheckBox = (props) => {

    return (
        <View style={styles.section}>
            <Checkbox
                {...props}
                style={styles.checkbox}
                color={
                    props.name !== 'code128' ?
                        props.value ? COLORS.buttonEdit : 'black'
                        :
                        COLORS.dimgrey
                }
            />
            <Text style={props.name === 'code128' ? styles.paragraphdefault : styles.paragraph}>{
                props.name === 'code128' ? `${props.name} (default)` : props.name
            }</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginHorizontal: 1,
        flexWrap: 'wrap',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },
    paragraph: {
        fontSize: 15,
        color: COLORS.black,
        fontFamily: 'Anton',
    },
    paragraphdefault: {
        color: '#c2c2c2',
        fontSize: 15,
        fontFamily: 'Anton',
    },
    checkbox: {
        // margin: 8,
    },
});
export default CustomcheckBox;