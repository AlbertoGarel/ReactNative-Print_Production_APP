import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import BorderedButton from "../../components/BorderedButton";

const InfoDrawer = ({info, handlerModalInfo}) => {

    return (
        <View style={styles.absoluteinfo}>
            <View style={styles.parentinfo}>
                <View style={styles.conttitle}>
                    <Text style={styles.titleinfo}>INFORMACIÓN</Text>
                </View>
                <View style={{flex: 2}}>
                    <ScrollView style={styles.scrollview}>
                        {
                            info.map((i, index) => {
                                return i[0] === '*'
                                    ? <Text key={index}
                                            style={[styles.text, styles.specialtext]}>{`${index + 1}.- ${i.split('*')[1]}`}</Text>
                                    : <Text key={index} style={styles.text}>{`${index + 1}.- ${i}`}</Text>
                            })
                        }
                    </ScrollView>
                </View>
                <BorderedButton styleText={{
                    fontFamily: 'Anton',
                    textAlign: 'center',
                    fontSize: 20,
                }} styleButton={{
                    borderWidth: 4,
                    borderColor: COLORS.secondary,
                    width: 200,
                    alignSelf: 'center',
                    borderRadius: 5,
                    margin: 5
                }} handlerFunction={handlerModalInfo} text={'SALIR'}/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    absoluteinfo: {
        position: 'absolute',
        display: 'flex',
        // alignSelf: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: '#00000090',
    },
    parentinfo: {
        width: '95%',
        height: '90%',
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
    },
    conttitle: {
        padding: 10,
        backgroundColor: COLORS.primary,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
    titleinfo: {
        fontSize: 30,
        fontFamily: 'Anton',
        textAlign: 'center',
        color: 'white',
    },
    scrollview: {
        marginTop: 10,
        padding: 10,
    },
    text: {
        fontSize: 17,
        fontFamily: 'Anton',
        textAlign: 'justify',
        marginBottom: 10,
    },
    specialtext: {
        textTransform: 'uppercase',
        color: '#FF0000'
    }
})
export default InfoDrawer;