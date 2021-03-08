import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as Font from 'expo-font';

const SplashScreen = () => {

    const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
    const [isFontLoad, setIsfontLoad] = useState(false)

    useEffect(() => {
        Font.loadAsync({
            "Anton": require("../assets/fonts/Anton-Regular.ttf"),
        }).then(response => setIsfontLoad(true));

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                // Background Linear Gradient
                colors={["#85ce51", "#52abb0"]}
                style={styles.background}
            />
            <Animated.Image // Special animatable View
                style={{
                    opacity: fadeAnim, // Bind opacity to animated value
                    width: 300,
                    height: 300,
                    position: 'absolute'
                }}
                source={require('../assets/images/splash/Logo_AlbertoGarel.png')}
            />
            <Text style={{
                color: 'white',
                fontSize: 35,
                position: 'absolute',
                bottom: 10,
                right: 10,
                fontFamily: isFontLoad ? "Anton" : null
            }}>#albertogarel</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundImage: ' linear-gradient(0deg, #d75cff, #94aaff)'
        // backgroundImage: 'linear-gradient(315deg, #85ce51, #52abb0)'
    },
    background: {
        width: '100%',
        height: '100%',
        opacity: 0.95,
        justifyContent: 'center',

    }
});

export default SplashScreen;
