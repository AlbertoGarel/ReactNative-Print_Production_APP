import React from 'react';
import {View, StyleSheet} from 'react-native';
import SvgComponent from "../SvgComponent";

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

export default BgComponent;