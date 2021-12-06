import React from 'react';
import {StyleSheet, View, TextInput, Platform, Text, Keyboard} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";

const CustomTextArea = ({toState}) => {

    return (
        <View style={styles.MainContainer}>
            <Text style={styles.title}>OBSERVACIONES:</Text>
            <TextInput
                style={styles.TextInputStyleClass}
                underlineColorAndroid="transparent"
                placeholder={"  Introduce aquí tus observaciones..."}
                onChangeText={(text)=>toState(text)}
                // placeholderTextColor={"#9E9E9E"}
                placeholderTextColor={COLORS.primary}
                numberOfLines={5}
                multiline={true}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    MainContainer: {
        width: '100%',
        // paddingTop: (Platform.OS) === 'ios' ? 20 : 10,
    },
    title:{
        textAlign: 'left',
        fontFamily: 'Anton',
        color: COLORS.black,
    },
    TextInputStyleClass: {
        padding: 15,
        margin: 5,
        borderRadius: 5,
        backgroundColor: "#FF850050",
    }
});
export default CustomTextArea;