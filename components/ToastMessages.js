import React from 'react';
import {ImageBackground, ToastAndroid} from 'react-native';
import Toast from "react-native-easy-toast";

const ToastMesages = ({
                          _ref,
                          _style,
                          _position,
                          _positionValue,
                          _fadeInDuration,
                          _fadeOutDuration,
                          _opacity,
                          _textStyle
                      }) => {

    return (
        <Toast
            ref={_ref}
            style={_style}
            position={_position}
            positionValue={_positionValue}
            fadeInDuration={_fadeInDuration}
            fadeOutDuration={_fadeOutDuration}
            opacity={_opacity}
            textStyle={_textStyle}
        />
    )
};

export default ToastMesages;