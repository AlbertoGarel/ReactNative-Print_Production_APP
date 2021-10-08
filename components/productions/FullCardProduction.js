import React from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableOpacity} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import PaperCoilWeightDataCard from "./PaperCoilWeightDataCard";
import TextInputCoilRadius from "../FormComponents/TextInputCoilRadius";
import ComsumptionResultCard from "./ComsumptionResultCard";
import {fingerselectOrangeSVG} from "../../assets/svg/svgContents";
import {Feather as Icon} from "@expo/vector-icons";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const titleContHeight = 60;
const paddingContent = 5;
const border_radius = 3;
//SVG PROP CONST
const optionsSVG = {
    svgData: fingerselectOrangeSVG, svgWidth: '100%', svgHeight: '100%'
};
const optionsStyleContSVG = {
    width: '60%', height: '60%', top: 10, right: 0, transform: [{rotate: "180deg"}]
};

const FullCardProduction = ({item}) => {

//PROPS ELEMENTS CARDS
    const stylesPeperCoilWeight = {
        parent: styles.dataWeight,
        textInicio: [styles.textTitle, {backgroundColor: 'white', paddingTop: paddingContent}],
        subCont: {padding: paddingContent + 1},
        textRFinal: styles.textTitle,
        subText: styles.textWeightData,
    };
    const stylesTextInput = {
        parent: [styles.result, {width: '25%', padding: 0, alignSelf: 'center'}],
        contPrinc: {
            borderRadius: border_radius,
            borderWidth: 2,
            borderColor: COLORS.primary,
            padding: paddingContent,
        },
        svgData: {opt: optionsSVG, stl: optionsStyleContSVG},
        textStyle: styles.textTitle,
        textWeight: styles.textWeightData,
        textWeightUnit: styles.textWeightUnit
    };
    const propsAttrInput = {
        editable: true,
        keyboardType: 'numeric',
        styled: {
            backgroundColor: '#ff850050',
            textAlign: 'center',
            fontFamily: 'Anton'
        },
        name: 'id',
        // _onChangeText: text => paperRollConsummption(text, setStateRadius),
        // _onBlur: () => calcPaperRollConsummption(radiusState, item.id),
        // _value: radiusState.toString(),
        // _defaultValue: radiusState.toString()
    };
    const styleCopsumptionComponent = {
        parent: [styles.result, {width: '25%'}],
        textWeightData: styles.textWeightData,
        textTitle: styles.textTitle,
        textWeightUnit: styles.textWeightUnit
    };

    const ButtonDelete = () => {
        return (
            <TouchableOpacity onPress={() => alert('pressed bottom button')} style={{width: 50, margin: 3}}>
                <View style={{
                    padding: 5,
                    backgroundColor: COLORS.buttonEdit,
                    borderRadius: 6,
                    alignSelf: 'flex-start',
                    marginLeft: 5,
                }}>
                    <Icon name={'edit'} size={25} color={'white'}/>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <>
            {/*<View style={styles.numauto}><Text style={{color: COLORS.white}}>1</Text></View>*/}
            <View style={styles.cardparent}>
                <View style={styles.numberandcode}>
                    {/*<View style={styles.numauto}><Text style={{color: COLORS.white}}>1</Text></View>*/}
                    <ButtonDelete/>
                    <View style={[styles.contcode, styles.centerCenter]}><Text
                        style={{textAlign: 'center'}}>123456789012</Text></View>
                </View>
                <View style={styles.parentWeight}>
                    <PaperCoilWeightDataCard
                        stylesPeperCoilWeight={stylesPeperCoilWeight}
                        restoInicioData={item.restoInicio}
                        restoFibalData={item.restoFinal}
                    />
                    <TextInputCoilRadius
                        stylesTextInput={stylesTextInput}
                        propsAttrInput={propsAttrInput}
                    />
                    <ComsumptionResultCard
                        styleCopsumptionComponent={styleCopsumptionComponent}
                        conumptionRes={item.consumo}
                    />
                </View>
                {/*((buttons-*/}
                <View style={{
                    width: '100%',
                    height: 30,
                    backgroundColor: COLORS.secondary,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    <Text>avisos para estado bobina</Text>
                </View>
            </View>
        </>
    )
};
const styles = StyleSheet.create({
    cardparent: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.black,
        padding: 5
    },
    centerCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flexWrap: 'wrap'
    },
    numberandcode: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    numauto: {
        width: windowWidth / 2,
        minHeight: windowWidth / 20,
        // borderRadius: 50,
        backgroundColor: COLORS.buttonEdit,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.black,
    },
    contcode: {
        borderWidth: 2,
        borderColor: COLORS.black,
        width: windowWidth / 1.3,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end'
    },
    parentWeight: {
        backgroundColor: '#ff850050',
        marginTop: 5,
        flexDirection: 'row',
        borderRadius: border_radius
    },
    dataWeight: {
        width: '50%',
        // alignSelf: 'flex-end',
        alignSelf: 'center',
        // backgroundColor: 'green',
        // padding: paddingContent,
        // borderRadius: border_radius
    },
    result: {
        // backgroundColor: '#ff850050',
        padding: paddingContent,
        // borderRadius: border_radius
    },
    percent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#c2c2c2',
        borderBottomLeftRadius: border_radius,
        borderBottomRightRadius: border_radius,
        padding: 3
    },
    subPercent: {
        justifyContent: 'flex-start',
    },
    parentID: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        padding: 2,
        borderRadius: border_radius
    },
    parentInput: {
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        // borderWidth: 1,
        // borderColor: 'black',
        // backgroundColor: 'white',
        paddingLeft: 2,
        marginBottom: 5,
        borderRadius: border_radius
    },
    textWeightUnit: {
        color: 'black'
    },
    textWeightData: {
        fontFamily: 'Anton',
        color: COLORS.primary,
        alignSelf: 'center'
        // textAlign: 'center'
    },
    textTitle: {
        fontFamily: 'Anton',
        textAlign: 'left'
    }
})
export default FullCardProduction;