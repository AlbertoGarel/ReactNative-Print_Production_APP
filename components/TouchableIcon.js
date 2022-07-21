import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import SvgComponent from "./SvgComponent";

const TouchableIcon = ({handlerOnPress, touchableStyle, svgName, WidthSVG, heightSVG, text = null, styleText}) => {

    return (
        <TouchableOpacity style={touchableStyle}
                          onPress={handlerOnPress}
        >
            {text ? <Text style={styleText}>{text}</Text> : null}
            <SvgComponent
                svgData={svgName}
                svgWidth={WidthSVG}
                svgHeight={heightSVG}
            />
        </TouchableOpacity>
    )
};
export default TouchableIcon;