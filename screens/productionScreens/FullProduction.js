import React, {useEffect, useState, useRef} from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions, Image,
    Keyboard,
    SafeAreaView,
    ScrollView, SectionList,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    KeyboardAvoidingView,
} from 'react-native';
import {COLORS, shadowPlatform} from "../../assets/defaults/settingStyles";
import * as SQLite from "expo-sqlite";
import {
    autopaster_prod_data_insert,
    autopasters_prod_table_by_production,
    picker_coeficiente
} from "../../dbCRUD/actionsSQL";
import {
    CalcPrevConsKilosRollsAutopaster,
    calcValues,
    deleteItem, getScannedCode,
    groupBy,
    OriginalWeight, registerNewBobina, searchItems,
    typeBarcodeFiter, updatedataRollState,
} from "../../utils";
import {
    genericDeleteFunction,
    genericInsertFunction,
    genericTransaction, genericUpdatefunction,
    genericUpdateFunctionConfirm
} from "../../dbCRUD/actionsFunctionsCrud";
import {useNavigation} from "@react-navigation/native";
import SvgComponent from "../../components/SvgComponent";
import {
    bgSquaresSVG,
    cautionSVG,
    changeSVG,
    icon360SVG,
    searchCode,
    texturesSVG,
    tirada2SVG
} from "../../assets/svg/svgContents";
import FlipCard from "../../components/FlipCard";
import ResultFullProduction from "../../components/productions/ResultsFullProduction";
import LargeButton from "../../components/LargeButton";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import CustomTextArea from "../../components/FormComponents/CustomTextArea";
import BgRepeatSVG from "../../components/BackgroundComponent/BgRepeatSVG";
import {getDatas} from "../../data/AsyncStorageFunctions";
import {htmlDefaultTemplate} from "../../PDFtemplates/defaultTemplateHTML";
import {createAndSavePDF_HTML_file} from "../../data/FileSystemFunctions";
import ContainerSectionListItem from "../../components/productions/ContainerSectionListItem";
import TouchableIcon from "../../components/TouchableIcon";
import BottomSheetComponent from "../../components/BottomSheetComponent";
import BarcodeScannerComponent from "../../components/BarcodeScannerComponent";
import FormUsedRoll from "../../components/productions/FormUsedRoll";
import FloatOpacityModal from "../../components/FloatOpacityModal";
import DragDropCardsComponent from "../../components/DragDropCardsComponent";
import FullCardProduction from "../../components/productions/FullCardProduction";
import ModalEndProduction from "../../components/productions/ModalEndProduction";

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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const titleContHeight = 60;
let svgSquare = 100
const height = windowHeight / 1.5;
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

const FullProduction = ({route}) => {
    const principalScroll = useRef();
    // const [spin, setSpin] = useState(false);
    const navigation = useNavigation()
    const {
        item,
        autopasters,
        groupedDataSectionList,
        maxRadius,
        radiusCoefBBDD,
        autopastersLineData,
        kilosForAutopasterState,
        definedAutopasters
    } = route.params;
    // const db = SQLite.openDatabase('bobinas.db');
    const bottomSheetRef = useRef();
    const bottomSheetRollUsedRef = useRef();

    const [parentHeight, setParentHeight] = useState(false);
    //DRAG AND DROP CARDS MENU SATATES
    // const [isVisibleDropMenu, setIsVisibleDropMenu] = useState(false);
    const [itemForChangePosition, getItemForChangePosition] = useState(null);
    //SCANNER
    const [isVisible, SetIsVisible] = useState(false);
    const [isVisibleRollUsedForm, SetIsVisibleRollUsedForm] = useState(false);
    const [autopasterID, setAutopasterID] = useState('');
    const [isVisibleDropMenu, setIsVisibleDropMenu] = useState(false);
    const [spin, setSpin] = useState(false);
    //FULL DATA
    // const [itemData, getItemData] = useState({});
    // const [autopastersLineProdData, getAutopastersLineProdData] = useState([]);
    // const [productProdData, getProductProdData] = useState([]);
    // const [gramajeValues, getGramajeValues] = useState({entera: null, media: null});
    // const [coefficientDDBB, setCoefficientDDBB] = useState([]);

    //PRODUCTION SELECTED DATA
    const [scannedCodeforUsedRegisterRoll, getScannedCodeforUsedRegisterRoll] = useState('');
    // const [generalDataForRoll, setGeneralDataForRoll] = useState({});//gramaje y papel común
    const [autopastersDataProduction, getAutopastersDataProduction] = useState(autopasters);//autopasters names
    const [individualAutopasterDataForSectionList,
        getIndividualAutopasterDataForSectionList] = useState(groupedDataSectionList);// DATA for sectionList

    //STATE KILOS NEEDED FOR COMPLETE PRODUCTION (BY AUTOPASTERS).
    const [renderSectionList, setRenderSectionList] = useState(false)
    const [kilosNeeded, getKilosNeeded] = useState(kilosForAutopasterState);
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
    const [modalEndProduction, setModalEndProduction] = useState(false);

    //FINAL RESULT OF THE PRODUCTION
    const [finalCalc, setFinalCalc] = useState({
        tiradaBruta: 0,
        kilosTirada: 0,
        kilosConsumidos: 0
    });

    useEffect(() => {
        console.log('rtyrugyyrbverubvuebve', kilosForAutopasterState)
        //Search negative Kilos.
        const positiveKilos = [].concat(kilosNeeded.filter(i => i.kilosNeeded <= 0));
        if (calculationProductionButton && positiveKilos.length === 0) {
            principalScroll.current.scrollToEnd();
        }
    }, [calculationProductionButton])
    // useEffect(() => {
    //     if (!individualAutopasterDataForSectionList.length > 0) {
    //         getIndividualAutopasterDataForSectionList(groupedDataSectionList)
    //     }
    // }, [individualAutopasterDataForSectionList])

    // useEffect(() => {
    //
    // }, []);
    // const confirmDelete = React.useCallback((rollID, autopasterID) => {
    //     Alert.alert('ELIMINAR BOBINA DE AUTOPASTER.',
    //         `Puede añadirla en cualquier otro autopaster más tarde.`,
    //         [
    //             {
    //                 text: 'Cancel',
    //                 onPress: () => console.log('Cancel Pressed'),
    //                 style: 'cancel',
    //             },
    //             {
    //                 text: 'OK', onPress: () => {
    //                     handlerRemoveItem(rollID, autopasterID)
    //                     // .then(() => console.log('response', `${rollID} /// ${autopasterID}`))
    //                     setViewCardSpinner(true)
    //                 }
    //             },
    //         ]);
    // }, [])

    async function handlerRemoveItem(rollID, autopasterID) {
        try {
            await searchItems(autopasterID, individualAutopasterDataForSectionList, item)
                .then(response => deleteItem(response, rollID, item))
                .then(response => {
                    console.log('responseresponseresponseresponse', response)
                    getIndividualAutopasterDataForSectionList(response.updateItemsForSectionList)
                    console.log('kilosNeeded', kilosNeeded)
                    const updateKilos = kilosNeeded.map(autopaster => {
                        console.log('-----r------r--- loop', autopaster)
                        if (autopaster.autopaster_id === autopasterID) {
                            return {...autopaster, kilosNeeded: response.updateKilosNeededState}
                        } else {
                            return autopaster;
                        }
                    })
                    console.log('-----r------r--- finalLooped', updateKilos)
                    getKilosNeeded(updateKilos)
                })
                .catch(r => console.log(r))
        } catch (err) {
            console.log(err)
        }
    };

    async function updateCodepathSVG(codePath, bobinaID, autopasterID) {
        const {toUpdate, others} = await searchItems(autopasterID, individualAutopasterDataForSectionList);
        const updated = toUpdate.data.map((item, index) => {
            if (item.codigo_bobina === bobinaID) {
                return {...item, codepathSVG: codePath}
            } else {
                return item;
            }
        })
        getIndividualAutopasterDataForSectionList([...others, {
            title: toUpdate.title,
            data: updated
        }].sort((a, b) => a.title - b.title))
    }

    async function updateRoll(radiusState, rollID, autopasterID) {
        // console.log('radio', radiusState);
        // console.log('id', rollID);
        // console.log('autopaster_id', autopasterID);
        try {

            searchItems(autopasterID, individualAutopasterDataForSectionList, item)
                .then(response => updatedataRollState(rollID, radiusState, response, maxRadius, radiusCoefBBDD))
                .then(response => {
                    // console.log('response', response)
                    // setCalculationProductionButton(response.initCalc)
                    getIndividualAutopasterDataForSectionList(response.sectionListUpdate);
                    return response
                })
                .then(response => setCalculationProductionButton(response.initCalc))
                // .catch(err => err);
            // updatedataRollState(radiusState, item, maxRadius, radiusCoefBBDD)
        } catch (err) {
            console.log(err);
        }
    };
    //CALCULATE THE KILOS CONSUMED FROM THE GROSS LOT OF NEWSPAPERS OF PRODUCTION.
    const calcTirada = (tirBruta) => {
        tirBruta = parseInt(tirBruta);
        let resultData = {tiradaBruta: 0, kilosTirada: 0, kilosConsumidos: 0};
        const allRolls = [].concat(...individualAutopasterDataForSectionList.map(i => i.data))
        // c = [].concat(...a.map(i=> i.data)))
        resultData.kilosConsumidos = allRolls.reduce((acc, item) => acc + (parseInt(item.peso_actual) - parseInt(item.weightEnd)), 0);
        resultData.kilosTirada = Math.round(item["kba_value"] * item["paginacion_value"] * tirBruta);
        resultData.tiradaBruta = tirBruta;
        console.log('individualAutopasterDataForSectionList', individualAutopasterDataForSectionList)
        console.log('resultData, resultData', resultData)
        console.log('item', item)
        return resultData;
    };

    //HANDLER ONBLUR FOR VALIDATE INPUT. 'IS REQUIRED' IS EVALUATED. SET VISIBLE BUTTON FOR CREATE PDF.
    const ValidateTirBruta = () => {
        if (selectedTiradaBruta.length <= 0) {
            setErrors({inputTirBruta: 'El campo es requerido.'});
        } else {
            setInputirBrutaEnable(true)
            setFinalCalc(calcTirada(selectedTiradaBruta));
        }
    };

    //HANDLER ONCHANGETEXT FOR EVALUATE AND DELETE BAD CHARACTERS.
    //CLEAN ERRORS ON THE NEXT CHANGE
    function handlerOnchangeTirBruta(param) {
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
    };

    const bottomSheetHandler = () => SetIsVisible(!isVisible);
    const bottomSheetHandlerRollUsed = () => SetIsVisibleRollUsedForm(!isVisible);
    const handlerSetVibleDropMenu = () => setIsVisibleDropMenu(!isVisibleDropMenu);

    //BUTTON OPEN CAMERA FUNCTION FOR CAPTURE THE CODE OF ROLL
    function handlerAddBobina(unitID) {
        // SET STATE FOR AUTOPASTER ID.
        setAutopasterID(unitID)
        //OPEN CAMERA FOR SCAN CODE
        bottomSheetRef.current.open();
    };

    function handlerScannedCode(scannedCode) {
        getScannedCode(scannedCode, autopasterID, individualAutopasterDataForSectionList, item, definedAutopasters)
            .then(response => {
                console.log(response)
                if (response.length > 0) {
                    createThreeButtonAlert(...response);
                }
                bottomSheetRef.current.close();
            })
            .catch(err => {
                bottomSheetRef.current.close()
                console.log(err)
                alert('error, intentelo de nuevo')
            })
    };

    // //USER DETERMINES IF THE REEL TO INCLUDE IS NEW OR USED.
    const createThreeButtonAlert = (param, actionDDBB, text) => {
        let newBobina = `,\nPeso Actual: ${param.actualWeight} Kg,\nRadio: ${param.radius ? param.radius : 'Bobina completa'}`
        Alert.alert(`${text}`,
            `Código:  ${param.scanCode}${text.charAt(0) === 'B' ? newBobina : ''}`, [
                {
                    text: 'CANCELAR',
                    // onPress: () => bottomSheetRef.current.close(),
                },
                {
                    text: 'NO',
                    onPress: () => {
                        getScannedCodeforUsedRegisterRoll(param);
                        bottomSheetRollUsedRef.current.open();
                    },
                    style: 'red',
                },
                {
                    text: 'SI',
                    onPress: () => handlerRegisterRoll(param, actionDDBB, individualAutopasterDataForSectionList, item)
                },
            ]);
    };

    const setStateForRadiusChangedPosition = (arrItems) => {
        console.log(arrItems)
        console.log(kilosNeeded)
        console.log(item)
        const {tirada, nulls, media_value, full_value, produccion_id} = item
        // CalcPrevConsKilosRollsAutopaster(arrObjects, tiradaTotal, gramajeValues, productionID)
        const objectResult = CalcPrevConsKilosRollsAutopaster(arrItems, (tirada + nulls), {
            media: media_value,
            entera: full_value
        }, produccion_id);
        // const autopasterNum = arrItems[0].autopaster;
        // const distincAutopastersNum = inputRadioForRollRadius.filter(item => item.autopaster !== autopasterNum);
        // getInputRadioForRollRadius([...distincAutopastersNum, ...arrItems]);
        // const dataPromisesAll = CalcPrevConsKilosRollsAutopaster(arrItems, itemData.tirada + itemData.nulls, gramajeValues, itemData.produccion_id);
        let promisesALLforUpdateItems = [];
        objectResult.updatedItemsForPromises.forEach(item => {
            promisesALLforUpdateItems.push(genericUpdateFunctionConfirm(UPDATE_PROMISES_ALL, item));
        });
        //ADD init spinner
        setSpin(true);
        Promise.all(promisesALLforUpdateItems)
            .then(response => {
                console.log('respuesta', response);
                // updateInfoForSectionList()
                const ot = individualAutopasterDataForSectionList.filter(i => i.title !== 5);
                getIndividualAutopasterDataForSectionList([
                    ...ot,
                    {data: objectResult.updatedItemsForSection, title: 5}
                ].sort((a, b) => a.title - b.title))
                // getIndividualAutopasterDataForSectionList((prevState, nextState)=>{
                //     return [...prevState, {data: objectResult.updatedItemsForSection.sort((a,b)=> a.position - b.position), title: 5}]
                // })
                setSpin(false);
            })//END SPINNER
            .catch(err => console.log(err))
    }

    function handlerRegisterRoll(param, actionDDBB, individualAutopasterDataForSectionList, item) {
        registerNewBobina(param, actionDDBB, individualAutopasterDataForSectionList, item, kilosNeeded)
            .then(response => {
                getIndividualAutopasterDataForSectionList(response.items)
                getKilosNeeded(response.kilos)
            })
            .catch(err => console.log(err))
    };

    function handlerRegisterUsedRoll(param, actionDDBB) {
        registerNewBobina(param, actionDDBB, individualAutopasterDataForSectionList, item, kilosNeeded)
            .then(response => {
                getIndividualAutopasterDataForSectionList(response.items)
                getKilosNeeded(response.kilos)
            })
            .catch(err => console.log(err))
    }

    function handlerMoveItem(param) {
        setIsVisibleDropMenu(!isVisibleDropMenu);
        getItemForChangePosition(param);
    };


    //FOR SEND DATA TO DDBB WHEN PRODUCTION FINISH AND CREATE PDF.
    function handlerSaveDataAndSend() {
        const dataProd = {
            date: item.fecha_produccion,
            prodLine: item.linea_name,
            pagination: item.paginacion_value,
            product: item.producto_name,
            productId: item.producto_id,
            editions: item.editions,
            tirada: item.tirada,
            productionID: item.produccion_id
        };
        const rollsDataProduction = [].concat(...individualAutopasterDataForSectionList.map(i => i.data));
        const autopasterNumLine = individualAutopasterDataForSectionList.map(i => i.title).sort((a, b) => a - b);

        getDatas('@UserDataForm')
            .then(resp => {
                if (resp) {
                    return htmlDefaultTemplate(dataProd, resp, finalCalc, rollsDataProduction, autopasterNumLine, contentTextArea)
                } else {
                    throw 'noname';
                }
            })
            .then(async resp => {
                const formatedName = dataProd.date.replace(/[\-]/g, "")
                await createAndSavePDF_HTML_file(`${formatedName}_${dataProd.product}`, resp);
            })
            .then(() => {
                const request_update_AllBobinaTable =
                    `UPDATE bobina_table SET
                     peso_actual = ?, radio_actual = ?, autopaster_fk = ?
                     WHERE codigo_bobina = ?;`;
                const paramsAllsPromises = rollsDataProduction.reduce((acc, item) => {
                    acc.push([
                        genericUpdatefunction(request_update_AllBobinaTable, [
                            item.weightEnd, parseInt(item.radiusEnd), item.autopaster_fk, item.codigo_bobina
                        ])
                    ]);
                    return acc;
                }, []);
                // console.log('paramaAllsPromises', paramsAllsPromises[1])
                return new Promise.all(...paramsAllsPromises)
            })
            .then(() => {
                const insertFinalProduction = `
                INSERT INTO productresults_table VALUES (?,?,?,?,?,?,?,?,?);`
                const values = [
                    null,
                    finalCalc.tiradaBruta,
                    finalCalc.kilosTirada,
                    finalCalc.kilosConsumidos,
                    dataProd.date,
                    dataProd.tirada,
                    dataProd.pagination,
                    dataProd.productId,
                    dataProd.editions
                ]
                return genericInsertFunction(insertFinalProduction, values);
            })
            .then(() => {
                const delete_production = `
                DELETE FROM produccion_table WHERE produccion_id = ?;`
                return genericDeleteFunction(delete_production, [dataProd.productionID]);
            })
            .then((resp) => {
                setModalEndProduction(true)
            })
            .catch(err => {
                if (err === 'noname') {
                    alert('Complete DATOS DE ENCABEZADO.')
                    setTimeout(() => navigation.navigate('SettingsStack'), 2000)
                }
            })
    };

    function handlerCloseModalEndProd() {
        setModalEndProduction(false);
        navigation.navigate('Home');
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whitesmoke}}>
            <ScrollView ref={principalScroll} nestedScrollEnabled horizontal snapToEnd={false}
                        automaticallyAdjustContentInsets={false} pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0}
                        scrollEventThrottle={21}>
                {/*<ScrollView style={{width: windowWidth, backgroundColor: 'red'}}>*/}
                {/*    <Text>{JSON.stringify(maxRadiusValueDDBB)}</Text>*/}
                {/*</ScrollView>*/}
                <KeyboardAvoidingView enabled>
                    <View style={{width: windowWidth, height: windowHeight, flex: 1}}>
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
                            // borderBottomWidth: parentHeight ? 0 : 2,
                            borderBottomColor: COLORS.white,
                            backgroundColor: COLORS.primary,
                        }}>
                            <View style={{maxWidth: '50%'}}>
                                <Text style={[styles.title, {
                                    color: COLORS.white,
                                    fontSize: item.producto_name.length > 10 ? 16 : 24
                                }]}>{item.producto_name}</Text>
                            </View>
                            <Text style={[styles.title, {
                                color: COLORS.white,
                                fontSize: 15
                            }]}>fecha: {item.fecha_produccion}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            {/*WRAP SECTIONLIST WITH FORMIK*/}
                            {/*<Text>state: {JSON.stringify(individualAutopasterDataForSectionList)}</Text>*/}
                            <Text>{JSON.stringify(kilosNeeded)}</Text>
                            <SectionList
                                // extraData={renderSectionList}
                                stickySectionHeadersEnabled
                                sections={individualAutopasterDataForSectionList}
                                keyExtractor={(item, index) => item + index}
                                // renderItem={({item}) => <ContainerSectionListItem item={item} itemData={itemData}
                                //     // setStateForRadius={setStateForRadius}
                                //     // updatedataRollState={updatedataRollState}
                                //                                                   maxRadiusValueDDBB={maxRadius}
                                //                                                   inputRadioForRollRadius={inputRadioForRollRadius}
                                //     // handlerRemoveItem={confirmDelete}
                                //                                                   viewCardSpinner={viewCardSpinner}
                                //                                                   bobinaCodeForSpinner={bobinaCodeForSpinner}
                                // />}
                                renderItem={({item}) => <FullCardProduction
                                    productionID={item.production_fk}
                                    roll_autopaster={item.autopaster_fk}
                                    peso_ini={item.peso_ini}
                                    peso_actual={item.peso_actual}
                                    bobinaID={item.bobina_fk}
                                    media_defined={item.media_defined}
                                    restoPrevisto={item.resto_previsto}
                                    restoPrevistoAnteriorProduccion={item.rest_antProd}
                                    weight_End={item.weightEnd}
                                    radius={item.radio_actual}
                                    new_radius={item.radiusEnd}
                                    radio_actual={item.radio_actual}
                                    viewCardSpinner={viewCardSpinner}
                                    bobinaCodeForSpinner={bobinaCodeForSpinner}
                                    handlerRemoveItem={handlerRemoveItem}
                                    updatedataRollState={updateRoll}
                                    maxRadius={maxRadius}
                                    pos={item.position_roll}
                                    updateCodepathSVG={updateCodepathSVG}
                                />}
                                ListEmptyComponent={() => <ActivityIndicator size="large" color={COLORS.buttonEdit}/>}
                                // ListEmptyComponent={() => {
                                //     return (
                                //         <View style={styles.contWarning}>
                                //             <View style={{flex: .5}}>
                                //                 <SvgComponent svgData={cautionSVG} svgWidth={80} svgHeight={80}/>
                                //             </View>
                                //             <View style={{flex: 2}}>
                                //                 <Text style={styles.textWarning}>
                                //                     No existen bobinas asignadas.
                                //                 </Text>
                                //             </View>
                                //         </View>
                                //     )
                                // }}
                                ListFooterComponent={() => <EmptyFooter/>}
                                renderSectionHeader={({section: {data, title}}) => (
                                    <View style={styles.sectionHeader}>
                                        <Text style={[styles.headerText, {
                                            fontSize: 12
                                        }]}>
                                            UNIDAD:
                                            <Text
                                                style={{fontSize: 20, color: COLORS.buttonEdit}}> {title}</Text></Text>
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
                                                // handlerOnPress={() => handlerAddBobina(data[0].autopaster_fk)}
                                                handlerOnPress={() => handlerAddBobina(title)}
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
                                )}
                            />
                            {/*<Text>{JSON.stringify(individualAutopasterDataForSectionList)}</Text>*/}
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <ScrollView style={{height: windowHeight, width: windowWidth, backgroundColor: 'green'}}>
                    <BgRepeatSVG
                        svgOptions={optionsSVG}
                        styleOptions={optionsStyleContSVG}
                    />
                    <View style={[styles.contData]}>
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}
                                                  style={[styles.bottomdrawer, {height: windowHeight}]}>
                            {/*<View style={[styles.contData, {display: parentHeight ? 'none' : 'flex'}]}>*/}
                            <View style={[styles.contData]}>
                                <View style={{marginVertical: 30}}>
                                    {
                                        calculationProductionButton && inputirBrutaEnable ?
                                            <View style={{position: 'absolute', zIndex: 2, top: -30, left: -5}}>
                                                <SvgComponent svgData={icon360SVG} svgWidth={50} svgHeight={50}/>
                                            </View>
                                            :
                                            null
                                    }
                                    <FlipCard enabled={calculationProductionButton && inputirBrutaEnable}
                                              ContentFront={() => ShowData(item)}
                                              ContentBack={() => <ResultFullProduction finalCalc={finalCalc}
                                                                                       item={item}/>}/>
                                </View>
                                <View style={{marginBottom: 10}}>
                                    {
                                        (calculationProductionButton && inputirBrutaEnable) &&
                                        <LargeButton
                                            enabled={calculationProductionButton && inputirBrutaEnable}
                                            handlerSaveDataAndSend={calculationProductionButton && inputirBrutaEnable ? handlerSaveDataAndSend : null}/>
                                    }
                                </View>
                                <View>
                                    {(errors.inputTirBruta.length > 0) &&
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            color: 'red',
                                            marginLeft: 10
                                        }}>{errors.inputTirBruta}</Text>
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
                                <CustomTextArea toState={getContentTextArea}/>
                                {/*<Text>{JSON.stringify(kilosNeeded)}</Text>*/}
                                {/*<Text>{JSON.stringify(individualAutopasterDataForSectionList.map(t => t.title))}</Text>*/}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </ScrollView>
            <BottomSheetComponent
                ref={bottomSheetRef}
                height={height}
                openDuration={250}
                onClose={() => bottomSheetHandler()}
                onOpen={() => bottomSheetHandler()}
                children={<BarcodeScannerComponent props={{
                    isVisible: isVisible,
                    getScannedCode: handlerScannedCode,
                    onChangeTexthandler: null
                }}/>}
                isVisible={isVisible}
            />
            {/*/!*CREAR BOTTOMSHEETCOMPONENT PARA FOMULARIO ENTRADA BOBINA USADA*!/*/}
            <BottomSheetComponent
                ref={bottomSheetRollUsedRef}
                // height={Math.round(height / 1.5)}
                height={400}
                openDuration={250}
                onClose={() => bottomSheetHandlerRollUsed()}
                onOpen={() => bottomSheetHandlerRollUsed()}
                children={<FormUsedRoll props={{
                    item: scannedCodeforUsedRegisterRoll,
                    registerNewBobina: handlerRegisterUsedRoll,
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
                        inputRadioForRollRadius: individualAutopasterDataForSectionList.filter(i => i.title === itemForChangePosition)[0].data,
                        autopasterNum: itemForChangePosition,
                        setStateForRadiusChangedPosition: setStateForRadiusChangedPosition,
                        spin: spin
                    }}
                    />}
                />
            }
            {
                modalEndProduction && <ModalEndProduction
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                    nameProduction={item.producto_name}
                    handler={handlerCloseModalEndProd}
                />
            }
        </SafeAreaView>
    )

}
const styles = StyleSheet.create({
    contData: {
        // flex: 1,
        // width: windowWidth,
        height: windowHeight,
        paddingHorizontal: 5,
        // flexDirection: 'column',
        // backgroundColor: 'white'
        // justifyContent: 'space-around',
        // alignItems: 'center',
        // flexWrap: 'wrap',
        // height: '80%',
    },
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
        // flex: 1,
        width: windowWidth,
        height: 60,
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
});
export default FullProduction;

// const groupedAutopasters = data => {
//     const groupedForSectionList = data.reduce((acc, item) => {
//         acc[item.autopaster_fk] ?
//             acc[item.autopaster_fk]['data'].push(item)
//             :
//             acc[item.autopaster_fk] = {title: item.autopaster_fk, data: [item]};
//         return acc;
//     }, {});
//     return Object.values(groupedForSectionList);
// };

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

// SHOW PRODUCTION INFO
const ShowData = (item) => {
    const data = {
        Fecha: item.fecha_produccion,
        ID: item.produccion_id,
        Producto: item.producto_name,
        // Propietario: item.papel_comun_name,
        Paginación: item.paginacion_value,
        Coeficiente: item.kba_value,
        Gramaje: item.gramaje_value,
        Tirada: item.tirada,
        Nulos_previstos: item.nulls,
        Línea_de_producción: item.linea_name,
    }
    return (
        <View style={{flexDirection: 'row'}}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                alignItems: 'center',
                padding: 20
            }}>
                {
                    Object.entries(data).map(([key, value], index) => {
                        let newKey = key.includes('_') ? key.replace('_', ' ') : key;
                        return <Text
                            style={[styles.textContData, {flexBasis: index === Object.entries(data).length - 1 ? '100%' : '50%'}]}
                            key={index}>
                            <Text style={{color: COLORS.primary}}>{newKey}: </Text>{value}</Text>
                    })
                }
            </View>
        </View>
    )
};