import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    ImageBackground
} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import PaperCoilWeightDataCard from "./PaperCoilWeightDataCard";
import TextInputCoilRadius from "../FormComponents/TextInputCoilRadius";
import ComsumptionResultCard from "./ComsumptionResultCard";
import {cautionSVG, fingerselectOrangeSVG} from "../../assets/svg/svgContents";
import SvgComponent from "../SvgComponent";
import {paperRollConsummption} from "../../utils";
import SpinnerSquares from "../SpinnerSquares";
import CustomBarcode from "../CustomBarcode";
import logo from '../../assets/images/anterior.png';
import fondo from '../../assets/images/splash/Logo_AlbertoGarel.png';

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
                                roll_autopaster,
                                peso_ini,
                                peso_actual,
                                bobinaID,
                                media_defined,
                                restoPrevisto,
                                restoPrevistoAnteriorProduccion,
                                weight_End,
                                new_radius,
                                updateCodepathSVG,
                                confirmDelete,
                                itemForSpinner,
                                updatedataRollState,
                                coefValues,
                            }) => {
    const textTypeRoll = !media_defined ? 'Entera' : 'Media';
    let changeBackground = new_radius === '' ? '#ff000060' : '#ff850050';
    let changeColor = new_radius === '' ? '#fff' : '#000';

    //STATES
    const [radiusState, setStateRadius] = useState(new_radius);
    const [codePathSVG, setCodePATHSVG] = useState('');
    const [renderImages, setRenderImages] = useState('')
    const nullable = restoPrevistoAnteriorProduccion === null;

    useEffect(() => {
        setStateRadius(new_radius);
    }, [new_radius]);

    useEffect(() => {
        if (codePathSVG && bobinaID) {
            updateCodepathSVG(codePathSVG, bobinaID, roll_autopaster)
        }
        let setTime = null;
        if (!renderImages) {
            InteractionManager.runAfterInteractions(() => {
                setRenderImages({transform: [{scaleX: 3}]})
            });
        }
        return () => {
            if (setTime) clearTimeout(setTime)
        }
    }, [codePathSVG])

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
        editable: nullable,
        keyboardType: 'numeric',
        styled: {
            backgroundColor: changeBackground,
            color: changeColor,
            textAlign: 'center',
            fontFamily: 'Anton'
        },
        name: 'id',
        _onChangeText: text => setStateRadius(paperRollConsummption(text)),
        _onEndEditing: updatedataRollState,
        _value: radiusState.toString(),
        _defaultValue: new_radius.toString()

    };

    const styleCopsumptionComponent = {
        parent: [styles.result, {width: '25%'}],
        textWeightData: styles.textWeightData,
        textTitle: styles.textTitle,
        textWeightUnit: styles.textWeightUnit
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
        return color;
    }, [restoPrevisto]);

    if (!peso_ini) {
        return (
            <View style={styles.contWarning}>
                <View style={{flex: .5}}>
                    <SvgComponent svgData={cautionSVG} svgWidth={80} svgHeight={80}/>
                </View>
                <View style={{flex: 2}}>
                    <Text style={styles.textWarning}>
                        No existen bobinas asignadas.
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.cardparent, {backgroundColor: textTypeRoll === 'Media' ? '#cfd5e6' : COLORS.white}]}>
            {itemForSpinner === bobinaID && <View style={styles.parentSpinner}>
                <SpinnerSquares/>
            </View>
            }
            <View style={styles.numberandcode}>
                <ImageBackground resizeMode="cover" source={fondo}
                                 style={{flex: 1, ...styles.numberandcode}}>
                    <TouchableOpacity
                        onPress={() => confirmDelete(bobinaID, roll_autopaster)}
                        style={styles.touchableDelete}>
                        <ImageBackground resizeMode="cover" source={logo} style={{
                            ...styles.numauto,
                            ...styles.background
                        }}>
                        </ImageBackground>
                    </TouchableOpacity>
                    <View style={[styles.contcode, styles.centerCenter, {padding: 5, height: 70, borderRadius: 5,}]}>
                        {peso_ini === peso_actual ?
                            <CustomBarcode
                                format="ITF"
                                rollAutopaster={roll_autopaster}
                                value={bobinaID.toString()}
                                text={bobinaID.toString()}
                                style={{margin: 10, width: '100%'}}
                                textStyle={{fontWeight: 'bold'}}
                                maxWidth={Dimensions.get('window').width / 8}
                                svgStyle={renderImages}
                                height={20}
                                getCodePathSVG={setCodePATHSVG}
                                roll_autopaster={roll_autopaster}
                                background={'transparent'}
                            />
                            :
                            <Text
                                style={styles.textBarcode}>
                                {bobinaID}
                            </Text>
                        }
                    </View>
                </ImageBackground>
            </View>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={{fontFamily: 'Anton'}}>Peso original: <Text
                    style={{color: COLORS.primary}}>{peso_ini}</Text> Kg</Text>
                <Text style={{fontFamily: 'Anton'}}>Tipo de bobina: {textTypeRoll}</Text>
            </View>
            <View style={styles.parentWeight}>
                <PaperCoilWeightDataCard
                    stylesPeperCoilWeight={stylesPeperCoilWeight}
                    restoInicioData={nullable ? peso_actual : restoPrevistoAnteriorProduccion}
                    restoFinalData={weight_End}
                    styleRestPrev={!nullable}
                />
                <TextInputCoilRadius
                    stylesTextInput={stylesTextInput}
                    propsAttrInput={propsAttrInput}
                />
                <ComsumptionResultCard
                    styleCopsumptionComponent={styleCopsumptionComponent}
                    conumptionRes={new_radius.toString().length > 0 ? peso_actual - weight_End : ''}
                />
            </View>
            <View style={{...styles.compsumptionAlert, backgroundColor: warningConsumption(restoPrevisto)}}>
                <Text>{restoPrevisto > 0 ? Math.round(restoPrevisto / coefValues[textTypeRoll.toLowerCase()]) : 0} ejemplares</Text>
                <Text style={styles.compsumptionAlertText}>Resto Previsto: {restoPrevisto} Kg</Text>
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    cardparent: {
        alignSelf: 'center',
        width: '98%',
        height: 210,
        borderWidth: 2,
        borderColor: COLORS.black,
        padding: 5,
        borderRadius: 5,
        marginBottom: 5,
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
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF90',
    },
    numauto: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contcode: {
        flex: 5,
        backgroundColor: '#FFFFFF90',
        justifyContent: 'flex-end'
    },
    parentWeight: {
        backgroundColor: '#e9e5ed',
        marginTop: 5,
        flexDirection: 'row',
        borderRadius: border_radius
    },
    dataWeight: {
        width: '50%',
        alignSelf: 'center',
    },
    result: {
        padding: paddingContent,
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
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
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
    },
    textTitle: {
        fontFamily: 'Anton',
        textAlign: 'left',
        paddingLeft: 5
    },
    contWarning: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 5,
        margin: 10,
        padding: 5,
    },
    textWarning: {
        fontSize: 16,
        textAlign: 'center',
        color: COLORS.colorSupportfiv,
        fontFamily: 'Anton',
        textShadowColor: COLORS.contraster,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
    },
    parentSpinner: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: COLORS.white + 90,
        zIndex: 1
    },
    touchableDelete: {
        marginLeft: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        display: 'flex',
        flexDirection: 'row',
        margin: 2
    },
    textBarcode: {
        textAlign: 'center',
        fontWeight: 'bold',
        width: '100%',
        backgroundColor: 'transparent'
    },
    compsumptionAlert: {
        width: '100%',
        height: 30,
        flexDirection: 'row',
        // justifyContent: 'flex-end',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    },
    compsumptionAlertText: {
        color: '#020202',
        textShadowColor: COLORS.white,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
    }
})

export default FullCardProduction;
