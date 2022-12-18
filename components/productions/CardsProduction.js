import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import BgComponent from "../BackgroundComponent/BgComponent";
import {editSVG, fingerselectOrangeSVG} from "../../assets/svg/svgContents";
import SvgComponent from "../SvgComponent";
import PercentageBarCard from "./PercentageBarCard";
import {getDatas, storeData} from "../../data/AsyncStorageFunctions";
import * as SQLite from "expo-sqlite";
import {coeficienteSearchValue} from "../../dbCRUD/actionsSQL";
import {paperRollConsummption, Sentry_Alert} from "../../utils";
import PaperCoilWeightDataCard from "./PaperCoilWeightDataCard";
import TextInputCoilRadius from "../FormComponents/TextInputCoilRadius";
import ComsumptionResultCard from "./ComsumptionResultCard";

const paddingContent = 5;
const border_radius = 3;

//SVG PROP CONST
const optionsSVG = {
    svgData: fingerselectOrangeSVG, svgWidth: '100%', svgHeight: '100%', color: COLORS.primary
};
const optionsStyleContSVG = {
    width: '60%', height: '60%', top: 10, right: 0, transform: [{rotate: "180deg"}]
};

const cardColorBand = [
    '#ff0000', '#1e90ff', '#00ff00', '#6b8e23', '#ff69b4', '#bc8f8f',
    '#ffff00', '#ee82ee', '#8a2be2', '#778899',
];

const CardsProduction = ({item, updateGetStorage, productToRenderId, handlerEditCard}) => {
    const db = SQLite.openDatabase('bobinas.db');

    const [radiusState, setStateRadius] = useState('');
    const [defradiusState] = useState('');

    useEffect(() => {
        setStateRadius(item.radio);
    }, [item]);

    const calcPaperRollConsummption = (radius, id) => {
        getDatas('@simpleProdData')
            .then(r => {
                const restOfproducts = r.filter(item => item.id !== productToRenderId);
                const thisProduct = r.filter(item => item.id === productToRenderId);
                const restDataCards = thisProduct[0].cards.filter(item => item.id !== id);
                const thisDataCards = thisProduct[0].cards.filter(item => item.id === id);

                if (parseInt(radius) === 0) {
                    thisDataCards[0].radio = 0;
                    thisDataCards[0].restoFinal = 0;
                    thisDataCards[0].consumo = thisDataCards[0].restoInicio;

                    thisProduct[0].cards = [...restDataCards, ...thisDataCards];
                    const allItems = [...restOfproducts, ...thisProduct];
                    storeData('@simpleProdData', allItems)
                        .then(stored => stored)
                        .catch(err => Sentry_Alert('CardsProduction.js', 'storeData', err));
                    updateGetStorage();
                } else if (radius === '') {
                    thisDataCards[0].radio = '';
                    thisDataCards[0].restoFinal = '';
                    thisDataCards[0].consumo = '';

                    thisProduct[0].cards = [...restDataCards, ...thisDataCards];
                    const allItems = [...restOfproducts, ...thisProduct];
                    storeData('@simpleProdData', allItems)
                        .then(stored => stored)
                        .catch(err => Sentry_Alert('CardsProduction.js', 'storeData', err));
                    ;
                    updateGetStorage();
                } else {
                    db.transaction(tx => {
                        const roundedRadio = Math.round(radius);
                        tx.executeSql(
                            coeficienteSearchValue,
                            [roundedRadio],
                            (_, {rows: {_array}}) => {
                                if (_array.length > 0) {
                                    const coefValue = _array[0].coeficiente_value;
                                    thisDataCards[0].radio = roundedRadio;
                                    thisDataCards[0].restoFinal = Math.round(thisDataCards[0].pesoOriginal * coefValue);
                                    thisDataCards[0].consumo = thisDataCards[0].restoInicio - thisDataCards[0].restoFinal;

                                    thisProduct[0].cards = [...restDataCards, ...thisDataCards];
                                    const allItems = [...restOfproducts, ...thisProduct];
                                    storeData('@simpleProdData', allItems).then(r => console.log('transaction', r));
                                    updateGetStorage();
                                }
                            }
                        );
                    }, err => Sentry_Alert('CardsProduction.js', 'coeficienteSearchValue', err));
                }
                //next code
            })
            .catch(err => Sentry_Alert('CardsProduction.js', '@simpleProdData', err))
    };

    //PROPS ELEMENTS CARDS
    const stylesPeperCoilWeight = {
        parent: styles.dataWeight,
        textInicio: [styles.textTitle, {backgroundColor: 'white', paddingTop: paddingContent}],
        subCont: {padding: paddingContent + 1},
        textRFinal: styles.textTitle,
        subText: styles.textWeightData,
    };
    const stylesTextInput = {
        parent: [styles.result, {width: '25%', padding: 0}],
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
        _onChangeText: text => setStateRadius(paperRollConsummption(text)),
        _onEndEditing: () => calcPaperRollConsummption(radiusState, item.id),
        _value: radiusState.toString(),
        _defaultValue: radiusState.toString()
    };
    const styleCopsumptionComponent = {
        parent: [styles.result, {width: '25%'}],
        textWeightData: styles.textWeightData,
        textTitle: styles.textTitle,
        textWeightUnit: styles.textWeightUnit
    }

    return (
        <View style={styles.contParent}>
            <View style={[styles.subParent, {borderLeftColor: cardColorBand[item.autopasterNum - 1]}]}>
                <View style={styles.header}>
                    <View style={[styles.parentID,
                        {
                            width: '15%',
                            backgroundColor: COLORS.primary,
                            borderRadius: border_radius
                        }]}>
                        <Text style={styles.autopasterID}>{item.autopasterNum}</Text>
                    </View>
                    <View style={[styles.parentInput, {width: '33%'}]}>
                        <Text style={styles.textTitle}>Peso original:</Text>
                        <Text style={styles.textWeightData}>{item.pesoOriginal} <Text
                            style={styles.textWeightUnit}>Kg.</Text></Text>
                    </View>
                    <View style={[styles.parentInput, {width: '33%'}]}>
                        <Text style={styles.textTitle}>Código:</Text>
                        <Text style={[styles.textWeightData, {
                            borderWidth: 1,
                            borderColor: 'black',
                            paddingLeft: 5,
                            paddingRight: 5,
                        }]}>{item.code}</Text>
                    </View>
                </View>
                <View style={styles.parentWeight}>
                    <PaperCoilWeightDataCard
                        stylesPeperCoilWeight={stylesPeperCoilWeight}
                        restoInicioData={item.restoInicio}
                        restoFinalData={item.restoFinal}
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
                <View style={styles.percent}>
                    <PercentageBarCard
                        data={{
                            pesoOriginal: item.pesoOriginal,
                            restoInicio: item.restoInicio,
                            restoFinal: item.restoFinal
                        }}
                        styleParent={[styles.percent, styles.subPercent]}
                        styleSubParent={[styles.contBar, {width: '50%'}]}
                        // radiusState={radiusState}
                        updateGetStorage={updateGetStorage}
                        item={item}
                    />
                    <TouchableOpacity
                        onPress={() => handlerEditCard(item, true)}
                        style={{
                            backgroundColor: COLORS.primary,
                            borderWidth: 1,
                            borderColor: COLORS.white,
                            borderRadius: border_radius,
                            paddingTop: 2,
                            paddingBottom: 2,
                            paddingLeft: 5,
                            paddingRight: 5,
                            elevation: 12,
                        }}
                    >
                        <SvgComponent
                            svgData={editSVG}
                            svgWidth={30}
                            svgHeight={30}
                        />
                        {/*<Text style={{color: COLORS.white}}>EDIT</Text>*/}
                    </TouchableOpacity>
                </View>
                {/*///*/}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contParent: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: 'black',
        backgroundColor: 'white',
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 5,
        margin: 10,
        borderRadius: border_radius,
        shadowColor: COLORS.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 12,
    },
    subParent: {
        marginLeft: 3,
        padding: 5,
        borderLeftWidth: 8,
        // borderLeftColor: 'green',
        borderRadius: border_radius
    },
    header: {
        flex: 1,
        // backgroundColor: '#c2c2c2',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    parentWeight: {
        flex: 1,
        backgroundColor: '#ff850050',
        flexDirection: 'row',
        // borderRadius: border_radius
    },
    dataWeight: {
        width: '50%',
        alignSelf: 'flex-end',
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
    },
    autopasterID: {
        fontFamily: 'Anton',
        // backgroundColor: '#ff8500',
        color: 'white',
        padding: 5,
        fontSize: 20,
        textAlign: 'center'
    },
    contBar: {
        width: '50%',
        height: '50%',
        backgroundColor: COLORS.white,
        margin: 3,
        borderRadius: border_radius,
        borderWidth: 1,
        borderColor: COLORS.white
    },
    bar: {
        width: '50%',
        height: '100%',
        backgroundColor: '#ff8500',
        margin: 0
    }
});
export default CardsProduction;