import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {COLORS} from "../assets/defaults/settingStyles";
import SvgComponent from "./SvgComponent";
import {searchCode} from "../assets/svg/svgContents";

const TouchableIcon = ({handlerOnPress, touchableStyle, svgName, WidthSVG, heightSVG}) => {

    return (
        <TouchableOpacity style={touchableStyle}
                          onPress={handlerOnPress}
        >
            <SvgComponent
                svgData={svgName}
                svgWidth={WidthSVG}
                svgHeight={heightSVG}
            />
        </TouchableOpacity>
    )
};
const styles = StyleSheet.create({});
export default TouchableIcon;