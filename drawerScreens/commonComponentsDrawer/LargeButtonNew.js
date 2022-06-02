import React, {useState} from 'react';
import {Text, TouchableHighlight, View, StyleSheet, Switch, TouchableWithoutFeedback} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import {Feather as Icon} from "@expo/vector-icons";
import HRtag from "../../components/HRtag";

const LargeButtonNew = ({
                            textButton,
                            _onPress,
                            disable
                        }) => {

    return (
        <>
            {
                !disable ?
                    <TouchableHighlight onPress={() => _onPress('CREAR')}>
                        <View style={styles.button}>
                            <Icon name={'plus-circle'} size={30} color={COLORS.whitesmoke}/>
                            <Text style={styles.text}>{textButton}</Text>
                        </View>
                    </TouchableHighlight>
                    :
                    <TouchableWithoutFeedback disabled={true}>
                        <View style={[styles.button, {opacity: .5}]}>
                            <Icon name={'plus-circle'} size={30} color={COLORS.whitesmoke}/>
                            <Text style={styles.text}>{textButton}</Text>
                        </View>
                    </TouchableWithoutFeedback>
            }
            <HRtag
                borderColor={COLORS.white}
            />
        </>
    )
};
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: COLORS.primary,
        padding: 5,
        borderRadius: 10,
    },
    text: {
        fontFamily: 'Anton',
        marginLeft: 5,
        color: COLORS.whitesmoke,
        fontSize: 18
    }
});
export default LargeButtonNew;