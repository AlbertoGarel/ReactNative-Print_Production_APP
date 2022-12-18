import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

const BorderedButton = ({text, styleButton, styleText, handlerFunction}) => {

    return (
        <TouchableOpacity style={styleButton}
                          onPress={handlerFunction}>
            <Text style={styleText}>{text}</Text>
        </TouchableOpacity>
    )
}
export default BorderedButton;