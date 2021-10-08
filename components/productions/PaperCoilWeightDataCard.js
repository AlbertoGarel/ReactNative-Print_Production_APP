import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const PaperCoilWeightDataCard = ({stylesPeperCoilWeight, restoInicioData, restoFibalData}) => {

    return (
        <View style={stylesPeperCoilWeight.parent}>
            {/*<Text style={stylesPeperCoilWeight.textRFinal}>Peso*/}
            {/*    original: <Text style={stylesPeperCoilWeight.subText}>{restoInicioData}</Text> Kg.</Text>*/}

            <Text style={stylesPeperCoilWeight.textRFinal}>Resto
                inicial: <Text style={stylesPeperCoilWeight.subText}>{restoInicioData}</Text> Kg.</Text>
            <View style={[stylesPeperCoilWeight.subCont,{paddingLeft: 0}]}>
                <Text style={stylesPeperCoilWeight.textRFinal}>Resto Final: <Text
                    style={stylesPeperCoilWeight.subText}>{restoFibalData}</Text> Kg.</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({})
export default PaperCoilWeightDataCard;