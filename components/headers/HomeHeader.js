import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const HomeHeader = ({
                        textprops,
                        imageBg,
                        titleColor,
                        text
                    }) => {

    return (
        <View style={styles.parent}>
            <View style={styles.subcont}>
                <Text style={[styles.title, {color: titleColor}]}>
                    #APPBobinas
                </Text>
                <Image
                    style={[styles.image, {backgroundColor: imageBg}]}
                    source={require('../../assets/images/splash/Logo_AlbertoGarel.png')}
                />
            </View>
            <Text
                style={{...textprops}}
            >{text}</Text>
        </View>
    )
};
const styles = StyleSheet.create({
    parent: {
        // marginTop: Constants.statusBarHeight,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
        padding: 20,
        marginBottom: 10
    },
    subcont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Anton',
        fontSize: 30,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50
    }
})
export default HomeHeader;