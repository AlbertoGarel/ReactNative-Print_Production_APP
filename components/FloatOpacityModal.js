import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import HRtag from "./HRtag";
import {COLORS} from "../assets/defaults/settingStyles";

const FloatOpacityModal = ({setVisibleMenu, styled, child}) => {
    return (
        <View style={styles.list}>
            <TouchableOpacity
                onPress={() => setVisibleMenu(false)}
                style={{
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 20,
                    right: 20,
                    borderWidth: 3,
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    borderColor: 'white'
                }}
            >
                < Text style={{
                    color: 'white',
                    fontSize: 30,
                    // fontFamily: 'Anton',
                }}>X</Text>
            </TouchableOpacity>
            <View style={[styles.flatParent, {...styled}]}>
                {child()}
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    list: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        height: 'auto',
        backgroundColor: '#00000090',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 13
    },
    flatParent: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10
    },
});
export default FloatOpacityModal;