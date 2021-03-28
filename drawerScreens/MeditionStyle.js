import React from 'react';
import {SafeAreaView, View, StyleSheet, Text, TouchableHighlight, Alert} from 'react-native';
import * as SQLite from 'expo-sqlite';
import HRtag from "../components/HRtag";
import {COLORS} from "../assets/defaults/settingStyles";

const Meditionstyle = () => {
    const db = SQLite.openDatabase('bobinas.db');

    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        // let is_mounted = true;
        // if (is_mounted) {
        db.transaction(tx => {
            tx.executeSql(
                `select * from medition_style_table;`,
                [],
                (_, {rows: {_array}}) => setItems(_array)
            );
        });
        // }
        // return () => is_mounted = false
    }, []);

    const onPress = () => {
        Alert.alert('pressed')
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
            <View style={styles.parent}>
                <Text style={styles.title}>Estilo de Medición</Text>
                <Text style={styles.parraf}>
                    Establece la medición de la bobina incluyendo o no el mandríl o modifica sus valores.
                </Text>
                <HRtag/>
                {/*button CREATE register*/}
                <View style={{
                    backgroundColor: COLORS.colorSupportfor,
                    marginBottom: 10,
                    padding: 10
                }}>
                    <TouchableHighlight onPress={onPress}>
                        <View style={{
                            alignItems: "center",
                            backgroundColor: "#DDDDDD",
                            padding: 10
                        }}>
                            <Text>Touch Here</Text>
                        </View>
                    </TouchableHighlight>
                </View>

                {/*----------*/}
                {
                    items ?
                        items.map((item, index) => {
                            return (
                                <Text key={index}>{
                                    item.medition_type
                                }</Text>
                            )
                        })
                        :
                        <Text>never</Text>
                }
            </View>
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    parent: {
        padding: 10,

    },
    title: {
        fontFamily: 'Anton',
        fontSize: 30,
        alignSelf: 'flex-start',
        textTransform: 'capitalize',
        color: COLORS.primary
    },
    parraf: {
        color: COLORS.white,
        padding: 10,
        backgroundColor: COLORS.primary + '95',
        borderRadius: 5
    },
})
export default Meditionstyle;