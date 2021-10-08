import React from 'react';
import {View, Text, TextInput} from 'react-native';
import BgComponent from "../BackgroundComponent/BgComponent";

const TextInputCoilRadius = ({stylesTextInput, propsAttrInput}) => {

    return (
        <View style={stylesTextInput.parent}>
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
                    onChangeText={propsAttrInput._onChangeText}
                    onBlur={propsAttrInput._onBlur}
                    value={propsAttrInput._value}
                    defaultValue={propsAttrInput._defaultValue}
                />
            </View>
        </View>
    )
}
export default TextInputCoilRadius;