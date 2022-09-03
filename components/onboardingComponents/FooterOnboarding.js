import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import RoundedButton from './RoundedButton';
import PropTypes from "prop-types";

const Footer = ({
                    backgroundColor,
                    leftButtonLabel = null,
                    leftButtonPress = null,
                    rightButtonLabel = null,
                    rightButtonPress = null,
                    buttonChild
                }) => {
    const windowWidth = useWindowDimensions().width;
    const HEIGHT = 60;
    const FOOTER_PADDING = windowWidth * 0.03;

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: leftButtonLabel ? 'space-between' : 'flex-end',
                height: HEIGHT,
                backgroundColor,
                opacity: 0.6,
                alignItems: 'center',
                paddingHorizontal: FOOTER_PADDING
            }}
        >
            {leftButtonLabel && (
                <RoundedButton label={leftButtonLabel} onPress={leftButtonPress}/>
            )}
            {buttonChild ?
                buttonChild()
                :
                <RoundedButton label={rightButtonLabel} onPress={rightButtonPress}/>
            }
        </View>
    );
};

Footer.propTypes = {
    backgroundColor: PropTypes.string,
    leftButtonLabel: PropTypes.string,
    leftButtonPress: PropTypes.func,
    rightButtonLabel: PropTypes.string,
    rightButtonPress: PropTypes.func,
    buttonChild: PropTypes.elementType,
};

export default Footer;
