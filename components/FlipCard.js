import React, {useRef, useEffect} from 'react';
import {Animated, View, StyleSheet, Pressable} from "react-native";

let contheight = 200;

function FlipCard({ContentFront, ContentBack, enabled}) {
    const flipAnimation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (enabled) flipToFront()
    }, [enabled])

    let flipRotation = 0;
    flipAnimation.addListener(({value}) => flipRotation = value);
    const flipToFrontStyle = {
        transform: [
            {
                rotateY: flipAnimation.interpolate({
                    inputRange: [0, 180],
                    outputRange: ["0deg", "180deg"]
                })
            }
        ]
    };
    const flipToBackStyle = {
        transform: [
            {
                rotateY: flipAnimation.interpolate({
                    inputRange: [0, 180],
                    outputRange: ["180deg", "360deg"]
                })
            }
        ]
    };

    const flipToFront = () => {
        Animated.timing(flipAnimation, {
            toValue: 180,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };
    const flipToBack = () => {
        Animated.timing(flipAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };


    return (
        <View style={style.cardWrapper}>
            <Pressable
                style={[style.cardWrapper]}
                onPress={() => enabled ? !!flipRotation ? flipToBack() : flipToFront() : null}
            >
                <Animated.View
                    style={{...style.cardFront, ...flipToFrontStyle, ...style.commonStyles}}

                >
                    <ContentFront/>
                    {/*<Animated.Image style={{...style.cardFront, ...flipToFrontStyle}}*/}
                    {/*                source={require("../assets/images/error.png")}*/}
                    {/*/>*/}
                </Animated.View>
                <Animated.View
                    style={{...style.cardBack, ...flipToBackStyle, ...style.commonStyles}}

                >
                    <ContentBack/>
                    {/*<Animated.Image*/}
                    {/*    style={{...style.cardBack}}*/}
                    {/*    source={require("../assets/images/browser.png")}*/}
                    {/*/>*/}
                </Animated.View>
            </Pressable>
        </View>
    );
}

const style = StyleSheet.create({
    cardWrapper: {width: '100%', height: contheight},
    cardFront: {
        backfaceVisibility: "hidden",
        position: "absolute",
        height: contheight,
        width: '100%',
        backgroundColor: '#49b6b630'
    },
    cardBack: {
        backfaceVisibility: "hidden",
        height: contheight,
        width: '100%',
        backgroundColor: '#49b6b630'
    },
    commonStyles: {
        borderRadius: 5,
    }
})
export default FlipCard;