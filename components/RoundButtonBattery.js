import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Vibration} from "react-native";
import {COLORS} from "../assets/defaults/settingStyles";
import {LinearGradient} from "expo-linear-gradient";

const PATTERN_VIBRT = 100;

const Gradient = ({color}) => {
    return <LinearGradient colors={color} style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 16,
    }}/>
};

const RoundButtonBattery = ({
                                labels,
                                contPrimary = styles.contPrimary,
                                contButton = styles.contButton,
                                styleLabel = styles.label,
                                styleOuterButton = styles.outerButton,
                                styleTouchable = styles.touchable,
                                GradientColors = ['#efd5ff', '#515ada'],
                                defaultSelected = 0,
                                getValue
                            }) => {

    const [selected, getSelected] = useState(defaultSelected);

    const handlerGetPressed = (value) => {
        getSelected(value.value);
        getValue(value.value)
        Vibration.vibrate(PATTERN_VIBRT, false)
    }

    return (
        labels.map((item, index) => {
            return (
                <View style={contPrimary} key={index}>
                    <View style={contButton}>
                        <Text style={styleLabel}>{item}</Text>
                        <View style={styleOuterButton}>
                            <TouchableOpacity style={styleTouchable}
                                              onPress={() => handlerGetPressed({label: item, value: index})}
                            >
                                {selected === index && <Gradient color={GradientColors}/>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        })
    )
}
const styles = StyleSheet.create({
    contPrimary: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
    label: {fontFamily: 'Anton', fontSize: 12, marginBottom: 3},
    contButton: {justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5},
    outerButton: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: 'white',
        padding: 5,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    touchable: {width: 20, height: 20, borderRadius: 100, backgroundColor: COLORS.white}

});

export default RoundButtonBattery;