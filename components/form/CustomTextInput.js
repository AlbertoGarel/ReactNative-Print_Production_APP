import React from 'react';
import {StyleSheet, Text, TextInput, View, Image} from "react-native";
import SvgComponent from "../SvgComponent";
import {SvgXml} from "react-native-svg";
import {COLORS} from "../../assets/defaults/settingStyles";

const CustomTextInput = ({
                             svgData,
                             svgWidth,
                             svgHeight,
                             placeholder,
                             text,
                             type,
                             maxLength,
                             noEditable,
                             styled,
                             _ref,
                             _name,
                             _onChangeText,
                             _onBlur
                         }) => {

    return (
        // <View style={styles.container}>

        <View style={[styles.SectionStyle, styled ? styled : null]}>
            {/*<Image source={{*/}
            {/*    uri: 'https://thumbs.dreamstime.com/z/icono-plano-de-la-cinta-m%C3%A9trica-79612608.jpg'*/}
            {/*}}*/}
            {/*       style={styles.ImageStyle}*/}
            {/*/>*/}
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
                style={{flex: 1, paddingLeft: 20}}
                placeholder={placeholder}
                keyboardType={type}
                editable={noEditable ? false : true}
                name={_name}
                onChangeText={_onChangeText}
                onBlur={_onBlur}
                // underlineColorAndroid="transparent"
            />
        </View>

        // </View>
    )
};
const styles = StyleSheet.create({
    // container: {
    //     // flex: 1,
    //     // justifyContent: 'center',
    //     // alignItems: 'center',
    //     // margin: 10
    // },

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
export default CustomTextInput;