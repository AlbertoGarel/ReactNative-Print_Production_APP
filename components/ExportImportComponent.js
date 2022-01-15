import React, {useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from "react-native";
import TouchableIcon from "./TouchableIcon";
import {exportddbbSVG, importddbbSVG} from "../assets/svg/svgContents";
import {COLORS, shadowPlatform} from "../assets/defaults/settingStyles";
import {importDataBase, sendDataBase} from "../data/FileSystemFunctions";
import SpinnerSquares from "./SpinnerSquares";

const ExportImportComponent = ({props}) => {

    return (
        <View style={styles.container}>
            <View style={styles.contChild}>
                <Text style={[styles.touchableText, styles.black]}>Exportar base de datos actual:</Text>
                <TouchableIcon touchableStyle={styles.touchable}
                               svgName={exportddbbSVG} WidthSVG={30} heightSVG={30}
                               styleText={styles.touchableText} text={'Enviar base de datos'}
                               handlerOnPress={sendDataBase}/>
            </View>
            <View style={styles.contChild}>
                <Text style={[styles.touchableText, styles.black]}>Importar base de datos actual:</Text>
                <TouchableIcon touchableStyle={styles.touchable}
                               svgName={importddbbSVG} WidthSVG={30} heightSVG={30}
                               styleText={styles.touchableText} text={'Buscar en dispositivo'}
                               handlerOnPress={() => importDataBase(props.showToast)}/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width, flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    contChild: {
        flexDirection: 'column',
        flexGrow: 1,
    },
    touchable: {
        width: 200,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.whitesmoke,
        borderRadius: 5,
        paddingVertical: 5,
        marginVertical: 10,
        // paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
        ...shadowPlatform
    },
    black: {
        color: COLORS.black
    },
    touchableText: {
        fontFamily: 'Anton',
        color: COLORS.primary
    }
})
export default ExportImportComponent;