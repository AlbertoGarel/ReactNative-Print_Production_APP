import React from 'react';
import {View} from 'react-native';
import {COLORS} from "../assets/defaults/settingStyles";

const HRtag = ({
                   borderWidth,
                   borderColor,
                   margin
               }) => {

    return (
        <View style={{
            borderWidth: !borderWidth ? 0.5 : borderWidth,
            borderColor: !borderColor ? COLORS.hrtag : borderColor,
            margin: !margin ? 10 : margin,
        }}/>
    )
};

export default HRtag;