import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    SectionList,
    ActivityIndicator,
    Image,
    Alert,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import {COLORS, shadowPlatform} from "../../assets/defaults/settingStyles";
import {Fontisto as Icon} from "@expo/vector-icons";
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
    bgSquaresSVG, changeSVG, edicionesSVG,
    fingerselectOrangeSVG, icon360SVG, searchCode,
    semicircle2,
    sunTornadoSVG,
    texturesSVG, tirada2SVG
} from "../../assets/svg/svgContents";
import * as SQLite from "expo-sqlite";
import {
    autopaster_prod_data_insert,
    autopasters_prod_table_all,
    autopasters_prod_table_by_production, insertBobina,
    picker_coeficiente
} from "../../dbCRUD/actionsSQL";
import {storeData} from "../../data/AsyncStorageFunctions";
import BarcodesTypeSelection from "../../components/BarcodesTypeSelection";
import FullCardProduction from "../../components/productions/FullCardProduction";
import BgComponent from "../../components/BackgroundComponent/BgComponent";
import BorderedButton from "../../components/BorderedButton";
import BgRepeatSVG from "../../components/BackgroundComponent/BgRepeatSVG";
import SvgComponent from "../../components/SvgComponent";
import BarcodeScannerComponent from "../../components/BarcodeScannerComponent";
import BottomSheetComponent from "../../components/BottomSheetComponent";
import ContainerSectionListItem from "../../components/productions/ContainerSectionListItem";
import {
    CalcPrevConsKilosRollsAutopaster,
    calcValues,
    groupBy,
    OriginalWeight,
    paperRollConsummption, typeBarcodeFiter
} from "../../utils";
import {
    genericDeleteFunction,
    genericInsertFunction,
    genericUpdatefunction,
    genericUpdateFunctionConfirm
} from "../../dbCRUD/actionsFunctionsCrud";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import {Formik} from "formik";
import * as Yup from "yup";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import FormUsedRoll from "../../components/productions/FormUsedRoll";
import LargeButton from "../../components/LargeButton";
import CustomTextArea from "../../components/FormComponents/CustomTextArea";
import yupObject from "@babel/core/lib/config/validation/options";
import FlipCard from "../../components/FlipCard";
import ResultFullProduction from "../../components/productions/ResultsFullProduction";
import {useNavigation} from "@react-navigation/native";
import FloatOpacityModal from "../../components/FloatOpacityModal";
import DragDropCardsComponent from "../../components/DragDropCardsComponent";
import TouchableIcon from "../../components/TouchableIcon";
import SpinnerSquares from "../../components/SpinnerSquares";
import {htmlDefaultTemplate} from "../../PDFtemplates/defaultTemplateHTML";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const titleContHeight = 60;
let svgSquare = 100
const height = windowHeight / 1.5;

const searchTypeMeditionDataInBBDD =
    `SELECT * FROM medition_style_table
    WHERE medition_style_table.gramaje_fk = (SELECT gramaje_id FROM gramaje_table WHERE gramaje_value = ?)
    AND medition_style_table.medition_type = ?`
;
const dataProductSelected =
    `SELECT * FROM producto_table
    JOIN kba_table ON producto_table.cociente_total_fk = kba_table.kba_id
    WHERE producto_table.producto_name = ?`
;
const autopasters_prod_data_update =
    `UPDATE autopasters_prod_data
    SET bobina_fk = ?, resto_previsto = ?
    WHERE production_fk = ? AND autopaster_fk = ?;`
;
const UPDATE_PROMISES_ALL =
    `UPDATE autopasters_prod_data SET
             position_roll = ?, resto_previsto = ?
             WHERE production_fk = ? AND bobina_fk = ?;`
const UPDATE_ItemFromAutopasterSQL =
    `UPDATE autopasters_prod_data SET
             bobina_fk = ?, resto_previsto = ?
             WHERE production_fk = ? AND bobina_fk = ?;`
const DELETE_ItemFromAutopasterSQL =
    `DELETE FROM autopasters_prod_data 
                 WHERE production_fk = ? AND bobina_fk = ?;`

const FullProduction = ({route}) => {
    const [spin, setSpin] = useState(false);
    const navigation = useNavigation();
    const db = SQLite.openDatabase('bobinas.db');

    useEffect(() => {
        db.exec([{sql: 'PRAGMA foreign_keys = ON;', args: []}], false, () =>
            console.log('Foreign keys turned on')
        );
    }, [])

    const bottomSheetRef = useRef();
    const bottomSheetRollUsedRef = useRef();

    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: bgSquaresSVG, svgWidth: svgSquare, svgHeight: svgSquare
    };
    const optionsSVG2 = {
        svgData: texturesSVG, svgWidth: svgSquare, svgHeight: svgSquare
    };

    const optionsStyleContSVG = {
        backgroundColor: 'white'
    };
    const optionsStyleContSVG2 = {
        backgroundColor: '#ff850050'
    };

    const tabBarHeight = useBottomTabBarHeight();
    const {item} = route.params;

    const [parentHeight, setParentHeight] = useState(false);
    //DRAG AND DROP CARDS MENU SATATES
    const [isVisibleDropMenu, setIsVisibleDropMenu] = useState(false);
    const [itemForChangePosition, getItemForChangePosition] = useState(null);
    //SCANNER
    const [isVisible, SetIsVisible] = useState(false);
    const [isVisibleRollUsedForm, SetIsVisibleRollUsedForm] = useState(false);
    const [autopasterID, setAutopasterID] = useState('');
    //FULL DATA
    const [itemData, getItemData] = useState({});
    const [autopastersLineProdData, getAutopastersLineProdData] = useState([]);
    const [productProdData, getProductProdData] = useState([]);
    const [gramajeValues, getGramajeValues] = useState({entera: null, media: null});
    const [coefficientDDBB, setCoefficientDDBB] = useState([]);
    const [maxRadiusValueDDBB, getMaxRadiusValueDDBB] = useState(0);

    //PRODUCTION SELECTED DATA
    const [scannedCodeforUsedRegisterRoll, getScannedCodeforUsedRegisterRoll] = useState('');
    const [generalDataForRoll, setGeneralDataForRoll] = useState({});
    const [autopastersDataProduction, getAutopastersDataProduction] = useState([]);
    const [individualAutopasterDataForSectionList,
        getIndividualAutopasterDataForSectionList] = useState([]);

    //STATE KILOS NEEDED FOR COMPLETE PRODUCTION (BY AUTOPASTERS).
    const [kilosNeeded, getKilosNeeded] = useState([]);
    //STATE OF TEXTAREA
    const [contentTextArea, getContentTextArea] = useState('');
    //DATA OF INPUTRADIUS FOR SEND TO BBDD
    const [inputRadioForRollRadius, getInputRadioForRollRadius] = useState([]);
    //TO SEND
    const [calculationProductionButton, setCalculationProductionButton] = useState(false);
    //STATE INPUT VISIBLE AND ERRORS.
    const [selectedTiradaBruta, getSelectedTiradaBruta] = useState('');
    const [inputirBrutaEnable, setInputirBrutaEnable] = useState(false);
    const [errors, setErrors] = useState({
        inputTirBruta: '',
    });
    //SPINNER STATE FOR DELETE CARDS
    const [viewCardSpinner, setViewCardSpinner] = useState(false);
    const [bobinaCodeForSpinner, setBobinaCodeForSpinner] = useState(false);

    //FINAL RESULT OF THE PRODUCTION
    const [finalCalc, setFinalCalc] = useState({
        tiradaBruta: 0,
        kilosTirada: 0,
        kilosConsumidos: 0
    })

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            //GET COEFFICIENT_TABLE
            getValuesDataMeditionSelected(item)
            db.transaction(tx => {
                tx.executeSql(
                    picker_coeficiente,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            setCoefficientDDBB(_array);
                            //GET MAX RADIUS VALUE IN BBDD.
                            const medidasRadius_Arr = _array.map(item => item.medida);
                            const maxRadius = Math.max(...medidasRadius_Arr);
                            getMaxRadiusValueDDBB(maxRadius);
                        }
                    }
                )
            });
            //GET ITEM DATA
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM produccion_table WHERE produccion_id = ?",
                    [item.id],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getItemData(..._array);
                            const lineaId = _array[0].linea_fk;
                            const productoId = _array[0].producto_fk;
                            //GET AUTOPASTER LIST
                            db.transaction(tx => {
                                tx.executeSql(
                                    "SELECT * FROM producto_table WHERE producto_id = ?",
                                    [productoId],
                                    (_, {rows: {_array}}) => {
                                        if (_array.length > 0) {
                                            getProductProdData(_array);
                                        } else {
                                            console.log('(producto_table)Error al conectar base de datos en FullProduction Component');
                                        }
                                    }
                                );
                            });
                            //GET PRODUCT DATA
                            db.transaction(tx => {
                                tx.executeSql(
                                    "SELECT * FROM autopaster_table WHERE linea_fk = ?",
                                    [lineaId],
                                    (_, {rows: {_array}}) => {
                                        if (_array.length > 0) {
                                            getAutopastersLineProdData(_array);
                                        } else {
                                            console.log('(autopaster_table)Error al conectar base de datos en FullProduction Component');
                                        }
                                    }
                                );
                            });
                        } else {
                            console.log('(err gen)Error al conectar base de datos en FullProduction Component');
                        }
                    }
                );
            });
            //GET DATA FOR BOBINA AND PRODUCTION
            db.transaction(tx => {
                    tx.executeSql(
                        dataProductSelected,
                        //[gramajeValue (integer), gramajeType (string)]
                        [item.producto],
                        (_, {rows: {_array}}) => {
                            if (_array.length > 0) {
                                const objectData = {..._array[0]}
                                setGeneralDataForRoll({
                                    gramajeRoll: objectData.gramaje_fk,
                                    papelComun: objectData.papel_comun_fk
                                });
                            }
                        }
                    )
                }, err => console.log('error getValuesDataMeditionSelected on fullProduction', err)
            )
            //GET AUTOPASTERS PRODUCTION
            updateInfoForSectionList();
        }
        console.log('render item')
        return () => isMounted = false;
    }, [item]);

    useEffect(() => {
        let isMounted = true;
        //GET INDIVIDUAL INFO AUTOPASTERS
        const groupedForSectionList = autopastersDataProduction.reduce((acc, item) => {
            acc[item.autopaster_fk] ?
                acc[item.autopaster_fk]['data'].push(item)
                :
                acc[item.autopaster_fk] = {title: item.autopaster_fk, data: [item]};
            return acc;
        }, {});
        const ForSectionListData = Object.values(groupedForSectionList);
        getIndividualAutopasterDataForSectionList(ForSectionListData)

        return () => isMounted = false
    }, [autopastersDataProduction]);

    useEffect(() => {
        let isMounted = true
        if (inputRadioForRollRadius.length > 0) {
            let groupedRollsByAutopaster = groupBy(inputRadioForRollRadius, 'autopaster');
            if (Object.keys(groupedRollsByAutopaster).length > 0) {
                const keys = Object.keys(groupedRollsByAutopaster);
                let autopaster = []
                for (let item of keys) {
                    let getisMedia = autopastersDataProduction.filter(res => parseInt(item) === parseInt(res.autopaster_fk));
                    console.log('jhjshjshjhjhfsjfs', getisMedia)
                    let total = itemData.tirada + itemData.nulls;
                    let isMedia = getisMedia[0].media_defined ? gramajeValues.media : gramajeValues.entera;
                    autopaster = [
                        ...autopaster,
                        {
                            [item]:
                            calcValues(groupedRollsByAutopaster[item], 'weightAct')
                            -
                            Math.round(total * isMedia)
                        }]
                }
                getKilosNeeded(autopaster);
            }
        }
        return () => isMounted = false
    }, [inputRadioForRollRadius]);

    const updateInfoForSectionList = () => {
        //GET AUTOPASTERS PRODUCTION
        db.transaction(tx => {
            tx.executeSql(
                autopasters_prod_table_by_production,
                [item.id],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        //ORDERED ITEMS FOR POSITION_ROLL.
                        _array.sort((a, b) => a.position_roll - b.position_roll);
                        getAutopastersDataProduction(_array);
                        //set spinner card to false
                        setViewCardSpinner(false)
                        //update kilos for prduction;
                    } else {
                        console.log('NO EXISTEN bobinas en AUTOPASTERS');
                    }
                }
            );
        });
    }

    const setStateForRadius = (item, svgPathCode) => {
        let {autopaster, bobinaID} = item;

        let otherItems = inputRadioForRollRadius.filter(roll => roll.bobinaID !== bobinaID);
        let thisItem = inputRadioForRollRadius.filter(roll => roll.bobinaID === bobinaID);
        if (thisItem.length === 0) {
            item.codepathSVG = svgPathCode || 0;
            getInputRadioForRollRadius([...otherItems, item])
        } else {
            thisItem[0].codepathSVG = svgPathCode || 0;
            getInputRadioForRollRadius([...otherItems, ...thisItem]);
        }

    };
    const setStateForRadiusChangedPosition = (arrItems) => {
        const autopasterNum = arrItems[0].autopaster;
        const distincAutopastersNum = inputRadioForRollRadius.filter(item => item.autopaster !== autopasterNum);
        getInputRadioForRollRadius([...distincAutopastersNum, ...arrItems]);
        const dataPromisesAll = CalcPrevConsKilosRollsAutopaster(arrItems, itemData.tirada + itemData.nulls, gramajeValues, itemData.produccion_id);
        let promisesALLforUpdateItems = [];
        dataPromisesAll.forEach(item => {
            promisesALLforUpdateItems.push(genericUpdateFunctionConfirm(UPDATE_PROMISES_ALL, item));
        });
        //ADD init spinner
        setSpin(true);
        Promise.all(promisesALLforUpdateItems)
            .then(response => {
                console.log(response);
                updateInfoForSectionList()
                setSpin(false);
            })//END SPINNER
            .catch(err => console.log(err))
    }

    //CHECK RADIUS STATE OF ALL ROLLS IS COMPLETE, ALL AUTOPASTERS HAVE A ROLLS AND
    // ALL ROLLS HAVE KILOS NEEDED
    const isValidForCalc = () => {
        const autopastersNames = autopastersDataProduction.map(item => item.autopaster_fk).sort((a, b) => a - b);
        const groupedAutopasters = individualAutopasterDataForSectionList.map(auto => auto.title).sort((a, b) => a - b);
        const autopasters = autopastersNames.filter((auto, index) => item === groupedAutopasters[index]);
        //CHECK DATA FOR TRUE
        const everyAutopasters = autopasters.every(item => item === true)
        const everyToSend = inputRadioForRollRadius.every(item => item.toSend === true);
        const everyKilosComplete = kilosNeeded.every(item => Object.values(item)[0] >= 0);
        if (everyToSend && everyKilosComplete && everyAutopasters) {
            setCalculationProductionButton(true);
            setParentHeight(true);
        } else {
            setCalculationProductionButton(false);
            setParentHeight(false);
        }
    };

    //UPDATE ROLL STATE FOR SEND DATA TO DDBB.
    const updatedataRollState = (radiusState, item) => {//radiusState: integer / radiusState: js object {}
        // js object state
        //   {
        //     autopaster: rollData.autopaster_fk,
        //     bobinaID: rollData.bobina_fk,
        //     radiusIni: rollData.radio_actual,
        //     radius: '',
        //     weightIni: rollData.peso_ini,
        //     weightAct:  rollData.peso_actual,
        //     weightEnd: null,
        //     ismedia: rollData.media,
        //     toSend: false,
        //    }
        // return false;
        if (radiusState > maxRadiusValueDDBB) {
            Alert.alert('¡¡Error!!', `El radio máximo registrado en base de datos es ${maxRadiusValueDDBB} cm. Has introducido ${radiusState}.`
            );
        } else {
            // if initial radius (new roll) is null, set max value for radius.
            const radiusNull = item.radio_actual ? item.radio_actual : maxRadiusValueDDBB;
            // ITEM DATA
            const originWeight = item.peso_ini;
            const actualWeight = item.peso_actual;
            const bobinaCode = item.codigo_bobina;
            //FOR TO STRENGTHEN AUTENTICITY OF ROLL CODE IN CASE IT IS REPEATED.
            const autopasterId = item.autopaster_fk;
            //STATE ITEMS
            const itemToUpdate = inputRadioForRollRadius.filter(item => item.bobinaID === bobinaCode && item.autopaster === autopasterId);
            const othersItems = inputRadioForRollRadius.filter(item => item.bobinaID !== bobinaCode);
            if (radiusState <= 0) {
                itemToUpdate[0].radius = 0;
                itemToUpdate[0].weightEnd = 0;
                itemToUpdate[0].toSend = true;
                if (itemToUpdate[0].weightEnd > itemToUpdate[0].weightAct ||
                    itemToUpdate[0].radius > itemToUpdate[0].radiusIni) {
                    Alert.alert(`Error al introducir radio de bobina.`)
                } else {
                    getInputRadioForRollRadius([...othersItems, ...itemToUpdate]);
                }
            } else {
                //SELECT COEFFICIENT
                const coef = coefficientDDBB.filter(item => item.medida === parseInt(radiusState));
                //calculate data for state
                const radius = radiusState;
                const calcWeight = Math.round(coef[0].coeficiente_value * originWeight);
                //update state
                itemToUpdate[0].weightEnd = calcWeight;
                if (itemToUpdate[0].weightEnd > itemToUpdate[0].weightAct ||
                    radiusState > radiusNull) {
                    //IF THE INITIAL WEIGHT IS LESS THAN THE CALCULATED WEIGHT OR
                    // THE FINAL WEIGHT CALCULATION BY MEANS OF YOUR RADIO RESULTS
                    // TO BE LESS THAN YOUR INITIAL WEIGHT RETURN NULL.
                    Alert.alert('¡¡Error!!', `Último radio conocido en ${radiusNull} cm. Has introducido ${radiusState} y excede del peso real de la bobina.`)
                    itemToUpdate[0].radius = '';
                    itemToUpdate[0].weightEnd = null;
                    itemToUpdate[0].toSend = false;
                    getInputRadioForRollRadius([...othersItems, ...itemToUpdate]);
                } else {
                    //THAT'S RIGHT
                    itemToUpdate[0].radius = radius;
                    itemToUpdate[0].toSend = true;
                    getInputRadioForRollRadius([...othersItems, ...itemToUpdate]);
                }
            }
        }
        //STATE FOR PRODUCTION CALCULATION ACTION
        isValidForCalc()
    };

    //GET VALUE MEDITION OF PRODUCT.
    const getValuesDataMeditionSelected = React.useCallback((item) => {
        //GET TYPE OF MEDITION SELECTED FOR GET VALUE IN BBDD( MEDIA <> ENTERA )
        const typeMedition = item["Tipo de medicion"];
        const typeMeditionSelected = typeMedition.split(' ')[0];
        const gramajeMeditionSelected = parseInt(typeMedition.split(' ')[1]);

        db.transaction(tx => {
                tx.executeSql(
                    searchTypeMeditionDataInBBDD,
                    //[gramajeValue (integer), gramajeType (string)]
                    [gramajeMeditionSelected, typeMeditionSelected],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getGramajeValues(
                                {entera: _array[0].full_value, media: _array[0].media_value}
                            )
                        }
                    }
                )
            }, err => console.log('error getValuesDataMeditionSelected on fullProduction', err)
        )
    }, []);

    // SHOW PRODUCTION INFO
    const ShowData = () => {
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{
                    flex: 1, flexWrap: 'wrap', padding: 20
                }}>
                    {
                        Object.entries(item).map(([key, value], index) => {
                            return <Text style={[styles.textContData, {textAlign: 'left', marginRight: 10}]}
                                         key={index}>
                                <Text style={{color: COLORS.primary}}>{`${key}: `}</Text>{value}</Text>
                        })
                    }
                </View>
            </View>
        )
    };

    //BUTTON OPEN CAMERA FUNCTION FOR CAPTURE THE CODE OF ROLL
    const handlerAddBobina = (unitID) => {
        // SET STATE FOR AUTOPASTER ID.
        setAutopasterID(unitID)
        //OPEN CAMERA FOR SCAN CODE
        bottomSheetRef.current.open();
    };

    const bottomSheetHandler = React.useCallback(() => SetIsVisible(!isVisible), []);
    const bottomSheetHandlerRollUsed = React.useCallback(() => SetIsVisibleRollUsedForm(!isVisible), []);
    const handlerSetVibleDropMenu = React.useCallback(() => setIsVisibleDropMenu(!isVisibleDropMenu), []);

    //CHECK IF THERE IS A ROLL IN THE PRODUCTION TABLE AND THE REEL TABLE TO ADD IN THIS PRODUCTION.
    const getScannedCode = (scanned) => {
        //itemData => {
        //   "editions": 1,
        //   "fecha_produccion": "2021-11-01",
        //   "linea_fk": 1,
        //   "medition_fk": 1,
        //   "nulls": 1234,
        //   "pagination_fk": 4,
        //   "produccion_id": 1635771082521,
        //   "producto_fk": 2,
        //   "tirada": 12345,
        // }
        // autopastersDataProduction => (array object)  [
        //   Object {
        //     "autopaster_fk": 5,
        //     "autopasters_prod_data_id": 1,
        //     "bobina_fk": 3057060377853,
        //     "media_defined": 0,
        //     "production_fk": 1635771082521,
        //     "resto_previsto": 184,
        //   },
        //   Object {
        //     "autopaster_fk": 10,
        //     "autopasters_prod_data_id": 2,
        //     "bobina_fk": 987654321,
        //     "media_defined": 0,
        //     "production_fk": 1635771082521,
        //     "resto_previsto": 84,
        //   },
        // ]
        let {scannedCode, codeType} = scanned;
        // alert(scannedCode)
        if (scannedCode.length !== 16) {
            return alert('El valor numérico del código de barras no tiene el formato esperado de 16 cifras.')
        }
        scannedCode = parseInt(scannedCode);
        let setCodeType = typeBarcodeFiter(codeType)
        const existRollInProduction = autopastersDataProduction.filter(item => item['bobina_fk'] === scannedCode);
        if (existRollInProduction.length > 0) {
            alert(`Esta bobina ya exite en esta producción en autopaster nº ${existRollInProduction[0].autopaster_fk}`)
        } else {
            //SEARCH IF is media or not.
            const selectAutopaster = autopastersDataProduction.filter(auto => auto.autopaster_fk === autopasterID);
            // SEARCH ROLL IN PRODUCTIONS TABLE
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM autopasters_prod_data WHERE production_fk < ? AND bobina_FK = ? AND resto_previsto > ? AND media_defined = ?",
                    //[productionID, scannedCode, 0, isMedia]
                    [itemData.produccion_id, scannedCode, 0, selectAutopaster[0].media_defined],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            // console.log('esto es lo encontrado en production', _array);
                        } else {
                            // NO EXISTEN bobinas en production
                            tx.executeSql(
                                "SELECT * FROM bobina_table WHERE codigo_bobina = ?",
                                //[scannedCode]
                                [scannedCode],
                                (_, {rows: {_array}}) => {
                                    if (_array.length > 0) {
                                        // esto es lo encontrado bobina_table
                                        const text = `BOBINA REGISTRADA:\n ¿DATOS CORRECTOS?`;
                                        const registerDadataOfBBDD = autopastersDataProduction.filter(item => item.autopaster_fk === autopasterID);
                                        const actionBBDD = registerDadataOfBBDD[0].bobina_fk ? 'insert' : 'update';
                                        const regNewRoll = {
                                            scanCode: _array[0].codigo_bobina,
                                            originalWeight: _array[0].peso_ini,
                                            actualWeight: _array[0].peso_actual,
                                            radius: _array[0].radio_actual,
                                            commonRole: _array[0].papel_comun_fk,
                                            autopaster: autopasterID,//change autopaster original for scanned
                                            grama: _array[0].gramaje_fk,
                                            isMedia: _array[0].media,
                                            // codeType: setCodeType // ADD ROW IN BBDD
                                        }
                                        createThreeButtonAlert(regNewRoll, actionBBDD, text);
                                    } else {
                                        const text = `REGISTRO DE BOBINA:\n ¿ES NUEVA?`;
                                        const OrWeight = OriginalWeight(scannedCode);
                                        const registerDadataOfBBDD = autopastersDataProduction.filter(item => item.autopaster_fk === autopasterID);
                                        const isMedia = registerDadataOfBBDD[0].media_defined;
                                        const actionBBDD = registerDadataOfBBDD[0].bobina_fk ? 'insert' : 'update';
                                        const regNewRoll = {
                                            scanCode: parseInt(scannedCode),
                                            originalWeight: OrWeight,
                                            actualWeight: OrWeight,
                                            radius: null,
                                            commonRole: generalDataForRoll.papelComun,
                                            autopaster: autopasterID,
                                            grama: generalDataForRoll.gramajeRoll,
                                            isMedia: isMedia,
                                            // codeType: setCodeType // ADD ROW IN BBDD
                                        }
                                        createThreeButtonAlert(regNewRoll, actionBBDD, text);
                                    }
                                }
                            );
                        }
                    }
                );
            }, error => console.log('error BBDD', error));
            bottomSheetRef.current.close()
        }
    }

    //USER DETERMINES IF THE REEL TO INCLUDE IS NEW OR USED.
    const createThreeButtonAlert = (param, actionDDBB, text) => {
        let newBobina = `,\nPeso Actual: ${param.actualWeight} Kg,\nRadio: ${param.radius ? param.radius : 'Bobina completa'}`
        Alert.alert(`${text}`,
            `Código:  ${param.scanCode}${text.charAt(0) === 'B' ? newBobina : ''}`, [
                {
                    text: 'CANCELAR',
                    onPress: () => bottomSheetRef.current.close(),
                },
                {
                    text: 'NO',
                    onPress: () => {
                        getScannedCodeforUsedRegisterRoll(param);
                        bottomSheetRollUsedRef.current.open();

                    },
                    style: 'red',
                },
                {text: 'SI', onPress: () => registerNewBobina(param, actionDDBB)},
            ]);
    }

    //REGISTER NEW ROLL AND UPDATE EMPTY AUTOPASTER.
    const registerNewBobina = (BobinaParams, actionDDBB) => {
        let getRollsAutopaster = autopastersDataProduction.filter(item => item.autopaster_fk === BobinaParams.autopaster);
        let maxPositionRoll = getRollsAutopaster.sort((a, b) => b.position_roll - a.position_roll)[0].position_roll || 0;
        let finalPositionRoll = maxPositionRoll + 1;
        const values = Object.values(BobinaParams);
        let productionID = item.id;
        const AutopasterNum = BobinaParams.autopaster;
        const getKilosNeededForAutopaster = kilosNeeded.filter(item => item[AutopasterNum]);

        let total_kilos = '';
        if (getKilosNeededForAutopaster.length === 0) {
            total_kilos = itemData.tirada + itemData.nulls;
        } else {
            total_kilos = Object.values(getKilosNeededForAutopaster[0])[0];
        }

        let restoPrevisto = 0
        if (total_kilos >= 0) {
            restoPrevisto = BobinaParams.actualWeight
        } else {
            restoPrevisto = BobinaParams.actualWeight - Math.abs(total_kilos);
        }
        const insertReplace =
            `INSERT OR REPLACE INTO bobina_table (codigo_bobina, peso_ini, peso_actual, radio_actual, papel_comun_fk, autopaster_fk, gramaje_fk, media)
     VALUES (?,?,?,?,?,?,?,?)`;
        if (actionDDBB === 'insert') {
            genericInsertFunction(insertReplace, values)
                .then(response => {
                    console.log('response', response)
                    const valuesPropData = [
                        null,
                        productionID,
                        BobinaParams.autopaster,
                        BobinaParams.scanCode,
                        restoPrevisto,
                        BobinaParams.isMedia,
                        finalPositionRoll
                    ];

                    return valuesPropData
                })
                .then(resp => genericInsertFunction(autopaster_prod_data_insert, resp))
                .then(() => updateInfoForSectionList())
                .catch(err => console.log(err))
        }
        if (actionDDBB === 'update') {
            //evaluar si ya está en base de datos bobina_table
            genericInsertFunction(insertReplace, values)
                .then(resp => {
                    let total = itemData.tirada + itemData.nulls;
                    let isMedia = BobinaParams.media_defined ? gramajeValues.media : gramajeValues.entera;
                    const valuesPropData = [
                        BobinaParams.scanCode,
                        Math.round(BobinaParams.actualWeight - (total * isMedia)),
                        productionID,
                        BobinaParams.autopaster,
                    ]
                    return valuesPropData
                    // genericUpdatefunction(autopasters_prod_data_update, valuesPropData)
                    //     .then(response => updateInfoForSectionList())
                    //     .catch(error => error)
                })
                .then(resp => genericUpdatefunction(autopasters_prod_data_update, resp))
                .then(() => updateInfoForSectionList())
                .catch(error => error)
        }
        // SET FALSE SO AS NOT TO CALCULATE PRODUCTION WITHOUT THIS ROLL.
        setCalculationProductionButton(false);
    };

    const EmptyFooter = () => {
        return (
            <View style={{
                // width: '100%',
                height: 150,
                // marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                // alignItems: 'center',
                padding: 20
            }}
            >
                <Image
                    style={{
                        width: 40,
                        height: 40
                    }}
                    source={require('../../assets/images/splash/Logo_AlbertoGarel.png')}
                />
                <Text style={{
                    fontFamily: 'Anton',
                    fontSize: 20,
                    color: COLORS.white
                }}>#Albertogarel</Text>
            </View>
        )
    };


    //CALCULATE THE KILOS CONSUMED FROM THE GROSS LOT OF NEWSPAPERS OF PRODUCTION.
    const calcTirada = React.useCallback((tirBruta) => {
        tirBruta = parseInt(tirBruta);
        let resultData = {tiradaBruta: 0, kilosTirada: 0, kilosConsumidos: 0};
        resultData.kilosConsumidos = inputRadioForRollRadius.reduce((acc, item) => acc + (parseInt(item.weightAct) - parseInt(item.weightEnd)), 0);
        resultData.kilosTirada = Math.round(item["Cociente producto"] * item["Paginacion"] * tirBruta);
        resultData.tiradaBruta = tirBruta;

        return resultData;
    }, []);

    //HANDLER ONCHANGETEXT FOR EVALUATE AND DELETE BAD CHARACTERS.
    //CLEAN ERRORS ON THE NEXT CHANGE
    const handlerOnchangeTirBruta = React.useCallback((param) => {
        setErrors({inputTirBruta: ''});
        let char = param.charAt(param.length - 1);
        let deleteBadChar = param.split(char, param.length - 1)[0];
        let defValue;
        if (char === '') {
            setInputirBrutaEnable(false)
        }
        if (char === ' ') {
            setErrors({inputTirBruta: 'Espacios en blanco no son permitidos.(autocorregido)'});
            getSelectedTiradaBruta(param.split(char, param.length - 1)[0]);
            return;
        }
        if (isNaN(param)) {
            if (deleteBadChar === undefined) {
                defValue = '';
            } else {
                defValue = deleteBadChar;
            }
            setErrors({inputTirBruta: 'introduce caracter numérico o punto para decimales.(autocorregido)'})
            // Alert.alert('introduce caracter numérico o punto para decimales.');
        } else {
            defValue = param;
        }
        if (defValue === 0) {
            setCalculationProductionButton(false)
        }
        getSelectedTiradaBruta(defValue);
    }, []);

    //HANDLER ONBLUR FOR VALIDATE INPUT. 'IS REQUIRED' IS EVALUATED. SET VISIBLE BUTTON FOR CREATE PDF.
    const ValidateTirBruta = () => {
        if (selectedTiradaBruta.length <= 0) {
            setErrors({inputTirBruta: 'El campo es requerido.'});
        } else {
            setInputirBrutaEnable(true)
            setFinalCalc(calcTirada(selectedTiradaBruta));
        }
    };

    const confirmDelete = (param) => {
        Alert.alert('ELIMINAR BOBINA DE AUTOPASTER.',
            `Puede añadirla en cualquier otro autopaster más tarde.`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        handlerRemoveItem(param)
                        setViewCardSpinner(true)
                    }
                },
            ]);
    }

    const handlerRemoveItem = (param) => {
        let paramsAction = [];
        let promisesALLforUpdateItems = [];
        //1º con param obtenemos la bobina que queremos eliminar y la sacamos de tabla autopasters_prod_data.
        // Nos aseguramos que recalcula el peso total esperado del autopaster.
        const productionID = itemData.produccion_id;
        const thisAutopaster = param.autopaster;
        const bobinaForRemoveID = param.bobinaID;// console.log('individualAutopasterDataForSectionList', individualAutopasterDataForSectionList)
        // get bobina code for spinner card
        setItemForSpinnerCard(bobinaForRemoveID)
        //2º saber si existe una o más bobinas.
        const allRollsOfThisAutopasters = individualAutopasterDataForSectionList.filter(item => item.title === thisAutopaster)[0].data;
        const ArrLength = allRollsOfThisAutopasters.length; // console.log('allRollsOfThisAutopasters', allRollsOfThisAutopasters)
        if (ArrLength > 1) {
            // UPDATES ITEM DATA IN AUTOPASTERS_PROD_DATA TABLE WHEN THE LENGTH OF THE COLECTION GREATER THAN ONE.
            paramsAction = [DELETE_ItemFromAutopasterSQL, [productionID, bobinaForRemoveID]];
            //1º remove the required item from the collection and pass the rest to function to recalculate kilos.
            const rollsThisAutopasters = inputRadioForRollRadius.filter(item => item.autopaster === thisAutopaster);
            const restOfItems = rollsThisAutopasters.filter(item => item.bobinaID !== bobinaForRemoveID);
            let total = itemData.tirada + itemData.nulls;
            //Save return data to variable.
            const forPromisesAllforUpdate = CalcPrevConsKilosRollsAutopaster(restOfItems, total, gramajeValues, productionID);

            forPromisesAllforUpdate.forEach(item => {
                promisesALLforUpdateItems.push(genericUpdateFunctionConfirm(UPDATE_PROMISES_ALL, item));
            });
        } else {
            // UPDATES ITEM DATA IN AUTOPASTERS_PROD_DATA TABLE WHEN THE LENGTH OF THE COLECTION EQUALS TO ONE.
            paramsAction = [UPDATE_ItemFromAutopasterSQL, [null, null, productionID, bobinaForRemoveID]];

        }
        genericDeleteFunction(...paramsAction)
            .then(resolve => resolve.rowsAffected)
            .then(rowsAffected => {
                if (rowsAffected === 1 && ArrLength > 1) {
                    // updateInfoForSectionList();
                    // alert('item eliminado')
                    return Promise.all(...promisesALLforUpdateItems)
                }
                if (rowsAffected === 1 && ArrLength === 1) {
                    return true
                }
            })
            .then(() => {
                getInputRadioForRollRadius(inputRadioForRollRadius.filter(item => item.bobinaID !== bobinaForRemoveID))
                updateInfoForSectionList()
            })
            // .then(() => setViewCardSpinner(false))
            .catch(err => console.log(err))
    };

    const setItemForSpinnerCard = React.useCallback((bobinaForRemoveID) => {
        setBobinaCodeForSpinner(bobinaForRemoveID);
    }, []);

    const handlerMoveItem = (param) => {
        //true for view drag&drop container
        setIsVisibleDropMenu(!isVisibleDropMenu);
        //1º con param obtenemos la bobina que queremos mover de posición y el autopaster.
        //   se le añadirá un borde o background a la tarjeta movible para diferenciarla.
        getItemForChangePosition(param);
        // console.log('param', param)
        //2º A partir del id de autopaster obtendremos las bobinas en el. si el autopaster sólo tiene una,
        //   no se abrirá  modal y el icono permanecerá opaco.

        //3º con id de autopaster obtenemos las bobinas y ordenamos según su posición.

        //4º procesamos los cambios de manera inmediata al acabar el movimiento, recalculando peso de cada una según su posición
        //   y actualizamos BBDD.
    };

    //FOR SEND DATA TO DDBB WHEN PRODUCTION FINISH AND CREATE PDF.
    const handlerSaveDataAndSend = () => {
        const dataProd = {
            date: item["Fecha de creación"],
            prodLine: item["Linea produccion"],
            pagination: item["Paginación"],
            product: item["producto"],
            editions: item["Ediciones"]
        }
        const rollsDataProduction = [...inputRadioForRollRadius];//FULL DATA ROLL OF END PRODUCTION.
        const extraDataObject = generalDataForRoll;//gramaje value & papel_comun value
        const autopasterNumLine = autopastersLineProdData.map(i => i.name_autopaster).sort((a, b) => a - b);
        const productionDataObject = productProdData[0]
        // console.log('item', item)// item["Fecha de creación"],item["Linea produccion"], item["Paginación"]
        // console.log('finalCalc', finalCalc)// finalCalc.kilosConsumidos, finalCalc.kilosTirada, finalCalc.tiradaBruta
        // console.log('rollsDataProduction', rollsDataProduction)
        // console.log('extraDataObject', extraDataObject)
        // console.log('productionDataObject', productionDataObject)
        // console.log('inputRadioForRollRadius', inputRadioForRollRadius)
        console.log('_______________html', htmlDefaultTemplate(item, finalCalc, inputRadioForRollRadius, autopasterNumLine))
        const request_update_AllBobinaTable =
            `UPDATE bobina_table SET
             peso_actual = ?, radio_actual = ?, autopaster_fk = ?
             WHERE codigo_bobina = ?;`
        const deleteProduction =
            `DELETE FROM produccion_table
            WHERE produccion_id = ?`;
        const arrPromiseAll = [];
        rollsDataProduction.forEach(roll => {
            arrPromiseAll.push(genericUpdateFunctionConfirm(request_update_AllBobinaTable, [roll.weightEnd, parseInt(roll.radius), roll.autopaster, roll.bobinaID]))
        });
        // GET DATA OF PRODUCTION FOR PDF.


        // ACTION FOR SAVE ROLLS DATA AND DELETE PRODUCTION.
        // Promise.all(...arrPromiseAll)
        //     .then(response => {
        //         if (response.every(item => item === 1)) {
        //             return genericDeleteFunction(deleteProduction, [item.id])
        //         } else {
        //             alert('fallo al insertar')
        //         }
        //     })
        //     .then(response => navigation.navigate('Home', {itemID: item.id}))
        //     .catch(err => console.log(err))
        // navigation.navigate('Home', {item: item.id})
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whitesmoke}}>
            <BgRepeatSVG
                svgOptions={optionsSVG}
                styleOptions={optionsStyleContSVG}
            />
            <View style={[styles.parent, {
                bottom: !parentHeight ? 20 : 0,
                position: !parentHeight ? 'absolute' : 'relative',
                height: !parentHeight ? 'auto' : 60,
            }]}>
                <BgRepeatSVG
                    svgOptions={optionsSVG2}
                    styleOptions={optionsStyleContSVG2}
                />
                <View style={{
                    height: titleContHeight,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    borderBottomWidth: parentHeight ? 0 : 2,
                    borderBottomColor: COLORS.white,
                    backgroundColor: COLORS.primary,
                }}>
                    <View style={{maxWidth: '50%'}}>
                        <Text style={[styles.title, {
                            color: COLORS.white,
                            fontSize: item.producto.length > 10 ? 16 : 24
                        }]}>{item.producto}</Text>
                    </View>
                    <Text style={[styles.title, {
                        color: COLORS.white,
                        fontSize: 15
                    }]}>fecha: {item['Fecha de creación']}</Text>
                </View>
                <View style={styles.content}>
                    {/*WRAP SECTIONLIST WITH FORMIK*/}
                    <SectionList
                        stickySectionHeadersEnabled
                        sections={individualAutopasterDataForSectionList}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({item}) => <ContainerSectionListItem item={item} itemData={itemData}
                                                                          setStateForRadius={setStateForRadius}
                                                                          updatedataRollState={updatedataRollState}
                                                                          maxRadiusValueDDBB={maxRadiusValueDDBB}
                                                                          inputRadioForRollRadius={inputRadioForRollRadius}
                                                                          handlerRemoveItem={confirmDelete}
                                                                          viewCardSpinner={viewCardSpinner}
                                                                          bobinaCodeForSpinner={bobinaCodeForSpinner}
                        />}
                        ListEmptyComponent={() => <ActivityIndicator size="large" color={COLORS.buttonEdit}/>}
                        ListFooterComponent={() => <EmptyFooter/>}
                        renderSectionHeader={({section: {data, title}}) => (
                            <>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.headerText, {
                                        fontSize: 12
                                    }]}>
                                        UNIDAD:
                                        <Text style={{fontSize: 20, color: COLORS.buttonEdit}}> {title}</Text></Text>
                                    <View style={{display: 'flex', flexDirection: 'row'}}>
                                        {data.length > 1 && <TouchableIcon
                                            // handlerOnPress={handlerSetVibleDropMenu}
                                            handlerOnPress={() => handlerMoveItem(data[0].autopaster_fk)}
                                            touchableStyle={[styles.IconStyle, {
                                                backgroundColor: COLORS.white,
                                                borderRadius: 5,
                                                shadowColor: COLORS.black,
                                                shadowOffset: {width: -2, height: 4},
                                                shadowOpacity: 0.8,
                                                shadowRadius: 3,
                                                borderWidth: 2,
                                                borderColor: COLORS.primary,
                                                padding: 2,
                                                marginRight: 5,
                                            }]}
                                            svgName={changeSVG}
                                            WidthSVG={40}
                                            heightSVG={40}
                                        />}
                                        <TouchableIcon
                                            handlerOnPress={() => handlerAddBobina(data[0].autopaster_fk)}
                                            touchableStyle={[styles.IconStyle, {
                                                backgroundColor: COLORS.white,
                                                borderRadius: 5,
                                                shadowColor: COLORS.black,
                                                shadowOffset: {width: -2, height: 4},
                                                shadowOpacity: 0.8,
                                                shadowRadius: 3,
                                                borderWidth: 2,
                                                borderColor: COLORS.primary,
                                                padding: 2
                                            }]}
                                            svgName={searchCode}
                                            WidthSVG={40}
                                            heightSVG={40}
                                        />
                                    </View>
                                </View>
                            </>
                        )}
                    />
                    {/*<Text>{JSON.stringify(individualAutopasterDataForSectionList)}</Text>*/}
                </View>
            </View>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}
                                      style={[styles.bottomdrawer, {height: windowHeight}]}>
                <View style={[styles.contData, {display: !parentHeight ? 'none' : 'flex'}]}>
                    <View style={{marginTop: 30, marginBottom: 10}}>
                        {
                            calculationProductionButton && inputirBrutaEnable ?
                                <View style={{position: 'absolute', zIndex: 2, top: -30, left: -5}}>
                                    <SvgComponent svgData={icon360SVG} svgWidth={50} svgHeight={50}/>
                                </View>
                                :
                                null
                        }
                        <FlipCard enabled={calculationProductionButton && inputirBrutaEnable}
                                  ContentFront={ShowData}
                                  ContentBack={() => <ResultFullProduction finalCalc={finalCalc} item={item}/>}/>
                    </View>
                    <View style={{marginBottom: 10}}>
                        {/*{*/}
                        {/*    (calculationProductionButton && inputirBrutaEnable) &&*/}
                        <LargeButton
                            enabled={calculationProductionButton && inputirBrutaEnable}
                            handlerSaveDataAndSend={calculationProductionButton && inputirBrutaEnable ? handlerSaveDataAndSend : null}/>
                        {/*}*/}
                    </View>
                    <View>
                        {(errors.inputTirBruta.length > 0) &&
                        <Text
                            style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.inputTirBruta}</Text>
                        }
                        <CustomTextInput
                            // _ref={inputTbrutaRef}
                            svgData={tirada2SVG}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'  Ejemplares bruto...'}
                            text={'Tirada bruta:'}
                            type={'numeric'}
                            noEditable={!calculationProductionButton}
                            _name={'inputTirBruta'}
                            _onChangeText={text => handlerOnchangeTirBruta(text)}
                            _onBlur={ValidateTirBruta}
                            _value={selectedTiradaBruta}
                        />
                    </View>
                    {/*<CustomTextArea toState={getContentTextArea}/>*/}
                    <Text>{JSON.stringify(inputRadioForRollRadius)}</Text>
                    <Text>{JSON.stringify(kilosNeeded)}</Text>
                    {/*<Text>{JSON.stringify(individualAutopasterDataForSectionList.map(t => t.title))}</Text>*/}
                </View>
            </TouchableWithoutFeedback>
            {/*<TouchableOpacity style={[styles.buttonData, {top: windowHeight - (tabBarHeight * 2.3)}]}*/}
            <TouchableOpacity style={[styles.buttonData, {bottom: 0}]}
                              onPress={() => {
                                  Keyboard.dismiss()
                                  setParentHeight(!parentHeight)
                              }}>
                <Icon name={'arrow-expand'} size={25}
                      color={calculationProductionButton ? '#4afde7' : COLORS.background_tertiary} style={styles.icon}/>
                <Text style={{
                    fontFamily: 'Anton',
                    alignSelf: 'center'
                }}>{calculationProductionButton ? 'CALCULAR' : 'DETALLES'}</Text>
            </TouchableOpacity>
            {/*------BARCODESCANNER COMPONENT-----*/}
            <BottomSheetComponent
                ref={bottomSheetRef}
                height={height}
                openDuration={250}
                onClose={() => bottomSheetHandler()}
                onOpen={() => bottomSheetHandler()}
                children={<BarcodeScannerComponent props={{
                    isVisible: isVisible,
                    getScannedCode: getScannedCode,
                    // onChangeTexthandler: null
                }}/>}
                isVisible={isVisible}
            />
            {/*CREAR BOTTOMSHEETCOMPONENT PARA FOMULARIO ENTRADA BOBINA USADA*/}
            <BottomSheetComponent
                ref={bottomSheetRollUsedRef}
                // height={Math.round(height / 1.5)}
                height={400}
                openDuration={250}
                onClose={() => bottomSheetHandlerRollUsed()}
                onOpen={() => bottomSheetHandlerRollUsed()}
                children={<FormUsedRoll props={{
                    item: scannedCodeforUsedRegisterRoll,
                    registerNewBobina: registerNewBobina,
                    HandlerCloseRollUsedForm: () => bottomSheetRollUsedRef.current.close()
                }}/>}
                isVisible={isVisibleRollUsedForm}
            />
            {
                isVisibleDropMenu && <FloatOpacityModal
                    setVisibleMenu={handlerSetVibleDropMenu}
                    styled={{
                        // height: Dimensions.get('window').height / 1.6,
                        height: 'auto',
                        width: Dimensions.get('window').width - 10,
                        backgroundColor: COLORS.whitesmoke
                    }}
                    child={() => <DragDropCardsComponent props={{
                        inputRadioForRollRadius: inputRadioForRollRadius,
                        autopasterNum: itemForChangePosition,
                        setStateForRadiusChangedPosition: setStateForRadiusChangedPosition,
                        spin: spin
                    }}
                    />}
                />
            }
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    parent: {
        // flex: 1,
        position: 'absolute',
        // width: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 100,
        backgroundColor: COLORS.primary,
        // marginBottom: 20,
        borderBottomLeftRadius: 130,
        overflow: 'hidden',
        ...shadowPlatform
    },
    title: {
        textTransform: 'capitalize',
        textAlign: 'center',
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.8, height: 0.8},
        textShadowRadius: 1
    },
    content: {
        padding: 10,
    },
    bottomdrawer: {
        // position: 'absolute',
        // height: windowHeight,
        // backgroundColor: 'red'
    },
    contData: {
        margin: 10,
        flexDirection: 'column',
        // justifyContent: 'space-around',
        // alignItems: 'center',
        // flexWrap: 'wrap',
        height: '80%',
    },
    textContData: {
        fontFamily: 'Anton',
        color: '#858585',
        // width: '50%',
        fontSize: 14
    },
    buttonData: {
        position: 'absolute',
        left: 5,
    },
    icon: {
        marginLeft: 10,
    },
    sectionHeader: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e9e5ed',
        padding: 3,
        marginTop: 0,
        marginBottom: 5,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.white,
        ...shadowPlatform
    },
    headerText: {
        color: COLORS.black,
        fontFamily: 'Anton',
        textTransform: 'capitalize',
    },
    headerTextBtn: {
        color: COLORS.white,
    },
    addBobiButton: {
        backgroundColor: COLORS.supportBackg1,
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.white
    },
    contButtons: {
        padding: 5,
        backgroundColor: 'black',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-evenly",
    },
    touchable: {
        width: 120,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.colorSupportfiv,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
})
export default FullProduction;