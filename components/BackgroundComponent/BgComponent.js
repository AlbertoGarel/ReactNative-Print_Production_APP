import React from 'react';
import {View, StyleSheet} from 'react-native';
import SvgComponent from "../SvgComponent";
import PropTypes from 'prop-types';

const BgComponent = ({svgOptions, styleOptions}) => {

    return (
        <View style={[styles.absolut, {...styleOptions}]}>
            <SvgComponent
                {...svgOptions}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    absolut: {
        position: 'absolute'
    }
});

BgComponent.propTypes = {
    svgOptions: PropTypes.object.isRequired,
    styleOptions: PropTypes.object.isRequired,
};

export default BgComponent;