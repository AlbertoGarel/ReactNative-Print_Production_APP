import React, {useRef, useEffect} from 'react';
import {Animated, View, StyleSheet, Pressable} from "react-native";

// let contheight = 200;

function FlipCard({flipnow = '',ContentFront, ContentBack, enabled, contheight = 200, contweight= '100%', parentStyle={}}) {

    const flipAnimation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (enabled) {
            flipToFront()
        }else{
            flipToBack()
        }
    }, [enabled])

    useEffect(() => {
        if(!isNaN(flipnow)){
            if (flipnow) flipToFront()
            if (!flipnow) flipToBack()
        }
    }, [flipnow])

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
        <View style={{width: contweight, height: contheight, ...parentStyle}}>
            <Pressable
                style={{height: contheight}}
                onPress={() => enabled ? !!flipRotation ? flipToBack() : flipToFront() : null}
            >
                <Animated.View
                    style={{...style.cardFront, ...flipToFrontStyle, ...style.commonStyles, height: contheight, width: contweight}}

                >
                    <ContentFront/>
                    {/*<Animated.Image style={{...style.cardFront, ...flipToFrontStyle}}*/}
                    {/*                source={require("../assets/images/error.png")}*/}
                    {/*/>*/}
                </Animated.View>
                <Animated.View
                    style={{...style.cardBack, ...flipToBackStyle, ...style.commonStyles, height: contheight, width: contweight}}

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
    cardFront: {
        backfaceVisibility: "hidden",
        position: "absolute",
        backgroundColor: '#49b6b630'
    },
    cardBack: {
        backfaceVisibility: "hidden",
        backgroundColor: '#49b6b630'
    },
    commonStyles: {
        borderRadius: 5,
    }
})
export default FlipCard;