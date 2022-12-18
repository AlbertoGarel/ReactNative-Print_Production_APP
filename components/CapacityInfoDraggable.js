import React, {useRef} from 'react';
import {Animated, PanResponder, StyleSheet, Text, View} from 'react-native';
import {COLORS, shadowPlatform} from "../assets/defaults/settingStyles";
import {moveSVG} from "../assets/svg/svgContents";
import SvgComponent from "./SvgComponent";

const CapacityInfoDraggable = ({totalCapacity}) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const {freeDisk, totalDisk} = totalCapacity;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
                });
            },
            onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: false}),
            onPanResponderRelease: () => {
                pan.flattenOffset();
            },
        })
    ).current;

    return (
        <Animated.View
            style={[styles.contInfo, {transform: [{translateX: pan.x}, {translateY: pan.y}]}]} {...panResponder.panHandlers}>
            <View style={styles.absoluteArrow}>
                <SvgComponent svgWidth={13} svgHeight={13} svgData={moveSVG} color={COLORS.black}/>
            </View>
            <Text
                style={[styles.textDiskCap, {color: COLORS.buttonEdit}]}>{(freeDisk * 0.0000000010).toFixed(2)} Gb</Text>
            <View style={{borderWidth: .5, borderColor: COLORS.primary, width: '60%'}}/>
            <Text
                style={[styles.textDiskCap, {color: COLORS.primary}]}>{Math.floor(totalDisk * 0.0000000010)} Gb</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    contInfo: {
        fontSize: 10,
        zIndex: 99,
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF9B9',
        borderRadius: 35,
        ...shadowPlatform
    },
    absoluteArrow: {
        position: 'absolute',
        top: -10,
        borderWidth: 1,
        padding: 3,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.whitesmoke,
        borderRadius: 100,
    },
    textDiskCap: {
        fontSize: 10,
        fontWeight: 'bold'
    },
});

export default CapacityInfoDraggable;