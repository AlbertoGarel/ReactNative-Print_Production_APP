import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Picker} from 'react-native';
import {COLORS} from "../assets/defaults/settingStyles";

const DragDropCardsComponent = ({touc, item}) => {



    return (
        <View style={styles.container}>
            <Text onPress={touc}>section id: </Text>
            <Text>{JSON.stringify(item)}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
export default DragDropCardsComponent;