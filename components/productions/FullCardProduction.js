import React, {useState, useEffect, memo} from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableOpacity} from 'react-native';
import {COLORS, shadowPlatform} from "../../assets/defaults/settingStyles";
import PaperCoilWeightDataCard from "./PaperCoilWeightDataCard";
import TextInputCoilRadius from "../FormComponents/TextInputCoilRadius";
import ComsumptionResultCard from "./ComsumptionResultCard";
import {changeSVG, fingerselectOrangeSVG, outStackSVG} from "../../assets/svg/svgContents";
import SvgComponent from "../SvgComponent";
import {paperRollConsummption} from "../../utils";
import {autopasters_prod_table_by_production} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import Barcode from '@kichiyaki/react-native-barcode-generator';
import SpinnerSquares from "../SpinnerSquares";
import CustomBarcode from "../CustomBarcode";

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

const FullCardProduction = ({
                                item,
                                updatedataRollState,
                                inputRadioForRollRadius,
                                handlerRemoveItem,
                                viewCardSpinner,
                                bobinaCodeForSpinner,
                                // handlerCodePathSVG,
                                setStateForRadius
                            }) => {
    const db = SQLite.openDatabase('bobinas.db');
    //STATES
    const [radiusState, setStateRadius] = useState('');
    const [itemData, setItemData] = useState({});
    const [restoPrevistoAnteriorProduccion, setRestoPrevistoAnteriorProduccion] = useState('');
    // const [viewCardSpinner, setViewCardSpinner] = useState(false);
    const [codePathSVG, setCodePATHSVG] = useState('');
    // const handlerCodePathSVG = () => setCodePATHSVG;

    useEffect(() => {
        let isMounted = true;

        const objToState = {
            autopaster: item.autopaster_fk,
            bobinaID: item.bobina_fk || 0,
            radiusIni: item.radio_actual,
            radius: '',
            weightIni: item.peso_ini,
            weightAct: item.peso_actual,
            weightEnd: null,
            ismedia: item.media,
            toSend: false,
            position: item.position_roll,
        };
        setStateForRadius(objToState, codePathSVG);

        //saber si existe esta bobina en producción anterior para seleccionar resto_prevsto si existe.
        if (restoPrevistoAnteriorProduccion.length > 0 && codePathSVG.length === 0) {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT resto_previsto FROM autopasters_prod_data WHERE production_fk < ? AND bobina_fk = ?;",
                    [item.production_fk, item.codigo_bobina],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            // console.log('resto previsto', _array);
                            if (isMounted) {
                                setRestoPrevistoAnteriorProduccion(_array[0].resto_previsto);
                            }
                        }
                        // else {
                        //     console.log('NO EXISTEN restos previstos FullCardComponent');
                        // }
                    }
                );
            });
        }
        // console.log(item)
        return () => isMounted = false;
    }, [item, codePathSVG])

    useEffect(() => {
        let isMounted = true;
        if (inputRadioForRollRadius.length > 0) {
            const bobinaCode = item.codigo_bobina;
            // //FOR TO STRENGTHEN AUTENTICITY OF ROLL CODE IN CASE IT IS REPEATED.
            const autopasterId = item.autopaster_fk;
            const itemToUpdate = inputRadioForRollRadius.filter(item => item.bobinaID === bobinaCode && item.autopaster === autopasterId);

            if (itemToUpdate) {
                setItemData(...itemToUpdate);
            }
            if (Object.keys(itemToUpdate).length > 0) {
                const getRadius = itemToUpdate[0].radius;
                setStateRadius(getRadius);
            }
        }
        return () => isMounted = false;
    }, [inputRadioForRollRadius]);

    // useEffect(() => {
    //     const objToState = {
    //         autopaster: item.autopaster_fk,
    //         bobinaID: item.bobina_fk || 0,
    //         radiusIni: item.radio_actual,
    //         radius: '',
    //         weightIni: item.peso_ini,
    //         weightAct: item.peso_actual,
    //         weightEnd: null,
    //         ismedia: item.media,
    //         toSend: false,
    //         position: item.position_roll,
    //         codepathSVG: ''
    //     };
    //     setStateForRadius(objToState);
    // }, [item])

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
        editable: !restoPrevistoAnteriorProduccion,
        keyboardType: 'numeric',
        styled: {
            backgroundColor: '#ff850050',
            textAlign: 'center',
            fontFamily: 'Anton'
        },
        name: 'id',
        _onChangeText: text => paperRollConsummption(text, setStateRadius),
        _onBlur: () => updatedataRollState(radiusState, item),
        _value: radiusState.toString(),
        _defaultValue: radiusState.toString()
    };
    const styleCopsumptionComponent = {
        parent: [styles.result, {width: '25%'}],
        textWeightData: styles.textWeightData,
        textTitle: styles.textTitle,
        textWeightUnit: styles.textWeightUnit
    };

    const ActionsButton = () => {
        return (
            <TouchableOpacity onPress={() => handlerRemoveItem(itemData)} style={{width: 50, margin: 3}}>
                <View style={{
                    padding: 5,
                    backgroundColor: COLORS.buttonEdit + '50',
                    borderRadius: 6,
                    alignSelf: 'flex-start',
                    marginLeft: 5,
                }}>
                    <SvgComponent
                        svgData={outStackSVG}
                        svgWidth={25}
                        svgHeight={25}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    const textTypeRoll = (param) => {
        let strMessage = param ? 'Media' : 'Entera'
        return <Text style={{color: COLORS.primary}}>{strMessage}</Text>
    };

    const warningConsumption = React.useMemo(() => (kilos) => {
        const value = parseInt(kilos);
        let color = '';
        switch (true) {
            case value <= 60:
                color = '#FF9999';
                break;
            case value > 60 && value <= 100:
                color = '#FFFF99';
                break;
            case value > 100:
                color = '#BBFFBB'
                break;
            default:
                color = '#FFbe61'
                break;
        }
        ;
        return color;
    }, [item.resto_previsto]);

    return (
        <View style={[styles.cardparent, {backgroundColor: item.media_defined ? '#ECFAFA' : COLORS.white}]}>
            {bobinaCodeForSpinner && viewCardSpinner && <View style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                backgroundColor: COLORS.white + 90,
                zIndex: 1
            }}>
                <SpinnerSquares/>
            </View>
            }
            <View style={styles.numberandcode}>
                {/*<View style={styles.numauto}><Text style={{color: COLORS.white}}>1</Text></View>*/}
                <ActionsButton/>
                <View style={[styles.contcode, styles.centerCenter, {padding: 5, minHeight: 70}]}>
                    {item.peso_ini === item.peso_actual ?
                        <CustomBarcode
                            format="CODE128"
                            value={item.bobina_fk.toString()}
                            text={item.bobina_fk.toString()}
                            style={{margin: 10}}
                            textStyle={{fontWeight: 'bold'}}
                            maxWidth={Dimensions.get('window').width / 2}
                            height={20}
                            getCodePathSVG={setCodePATHSVG}
                        />
                        :
                        <Text
                            style={{textAlign: 'center', fontWeight: 'bold'}}>
                            {item.bobina_fk}
                        </Text>
                    }
                </View>
            </View>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={{fontFamily: 'Anton'}}>Peso original: <Text
                    style={{color: COLORS.primary}}>{item.peso_ini}</Text> Kg</Text>
                <Text style={{fontFamily: 'Anton'}}>Tipo de bobina: {textTypeRoll(item.media_defined)}</Text>
            </View>
            <View style={styles.parentWeight}>
                <PaperCoilWeightDataCard
                    stylesPeperCoilWeight={stylesPeperCoilWeight}
                    restoInicioData={restoPrevistoAnteriorProduccion > 0 ? restoPrevistoAnteriorProduccion : itemData ? itemData.weightAct : ''}
                    restoFinalData={itemData ? itemData.weightEnd : ''}
                    styleRestPrev={restoPrevistoAnteriorProduccion > 0}
                />
                <TextInputCoilRadius
                    stylesTextInput={stylesTextInput}
                    propsAttrInput={propsAttrInput}
                />
                <ComsumptionResultCard
                    styleCopsumptionComponent={styleCopsumptionComponent}
                    conumptionRes={itemData ? (itemData.radius !== '' ? itemData.weightAct - itemData.weightEnd : '') : ''}
                />
            </View>
            {/*((buttons-*/}
            <View style={{
                width: '100%',
                height: 30,
                backgroundColor: warningConsumption(item.resto_previsto),
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: 5,
            }}>
                <Text style={{
                    color: '#020202',
                    textShadowColor: COLORS.white,
                    textShadowOffset: {width: 0.5, height: 0.5},
                    textShadowRadius: 1
                }}>Resto Previsto: {item.resto_previsto} Kg</Text>
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    cardparent: {
        width: '100%',
        borderWidth: 2,
        borderColor: COLORS.black,
        padding: 5,
        borderRadius: 5,
        marginBottom: 5,
        ...shadowPlatform
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
        justifyContent: 'flex-end',
        alignItems: 'center'
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
        textAlign: 'left',
        paddingLeft: 5
    }
})
export default FullCardProduction;