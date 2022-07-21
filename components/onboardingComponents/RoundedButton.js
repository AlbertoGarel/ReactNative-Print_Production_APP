import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import PropTypes from "prop-types";

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

RoundedButton.propTypes = {
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default RoundedButton;
