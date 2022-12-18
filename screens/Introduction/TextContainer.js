import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";

const TextContainer = ({text, title}) => {

    return (
        <View style={styles.imagenCont}>
            <Text style={styles.title}>{title}</Text>
            <View style={{width: '100%', display: 'flex'}}>
                {
                    text.map((i, index) => <Text style={styles.text} key={index}>{`\t\t${i}`}</Text>)
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    imagenCont: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        // paddingBottom: 100
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        fontFamily: 'Anton',
        textTransform: 'uppercase',
        color: COLORS.colorSupportfiv,
    },
    text: {
        fontWeight: 'bold',
        lineHeight: 22,
        fontSize: 16,
        textAlign: 'justify',
    }
})

export default TextContainer;