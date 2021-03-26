import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";

const RoundedButton = ({label, onPress}) => {
    return (
        <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}
            onPress={onPress}
        >
            <Text style={{
                fontSize: 22,
                color: label === 'Back' ? 'whitesmoke' : label === 'Continue' ? 'black' : 'dimgrey',
                fontWeight: 'bold'
            }}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default RoundedButton;
