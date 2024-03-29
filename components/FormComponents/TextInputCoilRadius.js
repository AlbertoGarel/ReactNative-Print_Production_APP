import React from 'react';
import {View, Text, TextInput, Alert} from 'react-native';
import BgComponent from "../BackgroundComponent/BgComponent";
import PropTypes from "prop-types";

const TextInputCoilRadius = ({stylesTextInput, propsAttrInput}) => {
    let titleMessage = '!! ATENCIÓN !!'
    let message = 'No editable hasta terminar producción anterior. Resto inicial solo es una previsión.'
    return (
        <View style={stylesTextInput.parent}
              onStartShouldSetResponder={() => !propsAttrInput.editable ? Alert.alert(titleMessage, message) : null}>
            <View style={stylesTextInput.contPrinc}>
                <BgComponent
                    svgOptions={stylesTextInput.svgData.opt}
                    styleOptions={stylesTextInput.svgData.stl}
                />
                <Text style={stylesTextInput.textStyle}>Radio:</Text>
                <TextInput
                    editable={propsAttrInput.editable}
                    keyboardType={propsAttrInput.keyboardType}
                    style={propsAttrInput.styled}
                    name={propsAttrInput.name}
                    onChangeText={propsAttrInput._onChangeText }
                    onEndEditing={propsAttrInput._onEndEditing}
                    value={propsAttrInput._value}
                    defaultValue={propsAttrInput._defaultValue}
                />
            </View>
        </View>
    )
}

TextInputCoilRadius.propTypes = {
    stylesTextInput: PropTypes.object.isRequired,
    propsAttrInput: PropTypes.object.isRequired,
};

export default TextInputCoilRadius