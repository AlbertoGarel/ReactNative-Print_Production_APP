import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated, Image, Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as Font from 'expo-font';
import logoSocial from '../assets/images/splash/socialPymes_Imagotipo_blanco.png'
import mylogo from '../assets/images/splash/Logo_AlbertoGarel.png'
import {COLORS} from "../assets/defaults/settingStyles";

let screenWidth = Dimensions.get('screen').width;
let screenHeight = Dimensions.get('screen').height;

const SplashScreen = () => {
    const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
    const [isFontLoad, setIsfontLoad] = useState(false)

    useEffect(() => {
        let isMuounted = true;

        if (isMuounted) {
            Font.loadAsync({
                "Anton": require("../assets/fonts/Anton-Regular.ttf"),
            }).then(() => setIsfontLoad(true));

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true
            }).start();
        }
        return () => isMuounted = false;
    }, []);

    return (
        <View style={[styles.container, {width: screenWidth, height: screenHeight}]}>
            <LinearGradient
                // Background Linear Gradient
                colors={["#F6990595", "#F4FD5350"]}
                style={[styles.background]}
            />
            <View style={{width: screenWidth, flexDirection: 'row', marginTop: 10}}>
                <Image source={logoSocial} style={{
                    flex: 1,
                    aspectRatio: 10,
                    resizeMode: 'contain',
                }}/>
            </View>
            <Animated.Image // Special animatable View
                style={{
                    resizeMode: 'contain',
                    opacity: fadeAnim, // Bind opacity to animated value
                    width: screenWidth,
                    height: screenHeight / 2,
                }}
                source={require('../assets/images/splash/logo_PrintingAPP.png')}
            />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}>
                <Image source={mylogo} style={{
                    width: 50,
                    height: 50,
                }}/>
                <Text style={{
                    paddingBottom: 10,
                    paddingRight: 20,
                    color:  COLORS.black,
                    fontSize: 35,
                    fontFamily: isFontLoad ? "Anton" : null,
                }}>albertogarel</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.95,

    }
});

export default SplashScreen;
