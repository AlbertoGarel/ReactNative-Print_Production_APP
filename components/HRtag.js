import React from 'react';
import {View} from 'react-native';

const HRtag = ({
                   borderWidth,
                   borderColor,
                   margin
               }) => {

    return (
        <View style={{
            borderWidth: !borderWidth ? 0.5 : borderWidth,
            borderColor: !borderColor ? 'black' : borderColor,
            margin: !margin ? 10 : margin,
        }}/>
    )
};

export default HRtag;