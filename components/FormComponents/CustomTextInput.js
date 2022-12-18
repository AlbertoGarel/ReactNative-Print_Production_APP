import React from 'react';
import {StyleSheet, Text, TextInput, View} from "react-native";
import SvgComponent from "../SvgComponent";
import {COLORS} from "../../assets/defaults/settingStyles";
import PropTypes from 'prop-types';

const CustomTextInput = ({
                             svgData,
                             svgWidth,
                             svgHeight,
                             placeholder,
                             text,
                             type,
                             noEditable,
                             styled,
                             _ref,
                             _name,
                             _onChangeText,
                             _onBlur,
                             _defaultValue,
                             inputStyled,
                             _onEndEditing,
                             _value,
                         }) => {

    return (
        <View style={[styles.SectionStyle, styled ? styled : null, noEditable ? {backgroundColor: '#c2c2c2'} : null]}>
            <View style={styles.IconStyle}>
                <SvgComponent
                    svgData={svgData}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                />
            </View>
            <Text style={{fontFamily: 'Anton'}}>{text}</Text>
            <TextInput
                ref={_ref}
                key={_name}
                style={[{
                    flex: 1,
                    paddingLeft: 20,
                }, inputStyled ? inputStyled : null, noEditable ? {
                    fontFamily: 'Anton',
                    color: '#189AB4'
                } : {color: 'black'}]}
                placeholder={placeholder}
                keyboardType={type}
                editable={!noEditable}
                name={_name}
                onChangeText={_onChangeText}
                onBlur={_onBlur}
                onEndEditing={_onEndEditing ? (text) => _onEndEditing(text) : null}
                defaultValue={_defaultValue}
                value={_value}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: .5,
        borderColor: COLORS.black,
        height: 60,
        borderRadius: 5,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10
    },

    IconStyle: {
        margin: 5,
        resizeMode: 'stretch',
        alignItems: 'center'
    },
});

CustomTextInput.propTypes = {
    svgData: PropTypes.any,
    svgWidth: PropTypes.number,
    svgHeight: PropTypes.number,
    placeholder: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    noEditable: PropTypes.bool,
    styled: PropTypes.object,
    _ref: PropTypes.any,
    _name: PropTypes.string,
    _onChangeText: PropTypes.func,
    _onBlur: PropTypes.func,
    _defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    inputStyled: PropTypes.object,
    _onEndEditing: PropTypes.func,
    _value: PropTypes.PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

export default CustomTextInput;