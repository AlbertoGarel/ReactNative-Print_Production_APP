import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";
import {COLORS} from '../assets/defaults/settingStyles';

const Remove__FloatActionButton = ({
                               iconName,
                               iconSize,
                               iconColor,
                               bgColor
                           }) => {

    return (
        <TouchableOpacity style={[styles.float, {
            width: iconSize + 30,
            height: iconSize + 30,
            backgroundColor: bgColor
        }]}
        onPress={()=>alert(Dimensions.get('window').height)}
        >
            <Icon name={iconName} size={iconSize} color={iconColor}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    float: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
        shadowColor: COLORS.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 13,
    }
})

export default Remove__FloatActionButton;

// EXAMPLE FOR USE
// <Remove__FloatActionButton
//     iconName={"settings"}
//     iconSize={40}
//     iconColor={COLORS.white}
//     bgColor={COLORS.info}
//     heightCalc={heightCalc}
// />
