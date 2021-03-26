import React, {useEffect} from 'react';
import {StyleSheet, View, SafeAreaView, Alert, Button, ToastAndroid, ScrollView, Text} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

;

const simpleProductionScreen = () => {

    const bottomToast = (message) => {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
        );
    };

    const value = '1';
    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('@storage_Key', value)
            bottomToast('Guardando...');
        } catch (e) {
            bottomToast('Error al guardar.');
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView horizontal={true}
                        style={styles.secc1}>
                <View style={styles.prodCard}>
                    <Text style={styles.textcard}>Levante</Text>
                </View>
                <View style={styles.prodCard}>
                    <Text style={styles.textcard}>M. Deportivo</Text>
                </View>
            </ScrollView>
            <Button
                onPress={() => storeData(value)}
                title="save data"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
            <View style={styles.secc2}>
                <ScrollView horizontal={false}>


                </ScrollView>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    secc1: {
        flex: 1,
        padding: 2,
        backgroundColor: '#FFFFFF',
    },
    secc2: {
        flex: 10,
        backgroundColor: '#FF8000'
    },
    prodCard: {
        width: 250,
        margin: 2,
        borderWidth: 2,
        borderColor: '#FF8000',
        backgroundColor: 'purple',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textcard: {
        fontSize: 26,
        margin: 0,
        padding: 0,
        textTransform: 'uppercase'
    }
});
export default simpleProductionScreen;