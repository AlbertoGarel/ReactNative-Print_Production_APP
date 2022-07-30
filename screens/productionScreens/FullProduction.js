import React, {useEffect, useRef, useState} from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    InteractionManager
} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import {
    CalcPrevConsKilosRollsAutopaster,
    deleteItem,
    getScannedCode,
    handleEmail,
    registerNewBobina,
    searchItems, Sentry_Alert,
    updatedataRollState,
} from "../../utils";
import {
    genericDeleteFunction,
    genericInsertFunction,
    genericTransaction,
    genericUpdatefunction,
    genericUpdateFunctionConfirm
} from "../../dbCRUD/actionsFunctionsCrud";
import {useNavigation} from "@react-navigation/native";
import SvgComponent from "../../components/SvgComponent";
import {
    bgSquaresSVG,
    changeSVG,
    icon180SVG,
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
import TouchableIcon from "../../components/TouchableIcon";
import BottomSheetComponent from "../../components/BottomSheetComponent";
import BarcodeScannerComponent from "../../components/BarcodeScannerComponent";
import FormUsedRoll from "../../components/productions/FormUsedRoll";
import FloatOpacityModal from "../../components/FloatOpacityModal";
import DragDropCardsComponent from "../../components/DragDropCardsComponent";
import FullCardProduction from "../../components/productions/FullCardProduction";
import ModalEndProduction from "../../components/productions/ModalEndProduction";
import SpinnerSquares from "../../components/SpinnerSquares";
import HRtag from "../../components/HRtag";

const UPDATE_PROMISES_ALL =
    `UPDATE autopasters_prod_data SET
             position_roll = ?, resto_previsto = ?
             WHERE production_fk = ? AND bobina_fk = ?;`
;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const titleContHeight = 60;
let svgSquare = 100
const height = windowHeight / 2;

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
    const navigation = useNavigation()
    const {
        item,
        groupedDataSectionList,
        maxRadius,
        radiusCoefBBDD,
        kilosForAutopasterState,
        definedAutopasters
    } = route.params;

    const coefValues = {media: item.media_value, entera: item.full_value}
    const bottomSheetRef = useRef();
    const bottomSheetRollUsedRef = useRef();

    // SPINNER FULL VIEW
    const [refresh, setRefresh] = useState(false)
    //DRAG AND DROP CARDS MENU SATATES
    const [itemForChangePosition, getItemForChangePosition] = useState(null);
    //SCANNER
    const [isVisible, SetIsVisible] = useState(false);
    const [isVisibleRollUsedForm, SetIsVisibleRollUsedForm] = useState(false);
    const [autopasterID, setAutopasterID] = useState('');
    const [isVisibleDropMenu, setIsVisibleDropMenu] = useState(false);
    const [spin, setSpin] = useState(false);
    //PRODUCTION SELECTED DATA
    const [scannedCodeforUsedRegisterRoll, getScannedCodeforUsedRegisterRoll] = useState('');
    const [individualAutopasterDataForSectionList,
        getIndividualAutopasterDataForSectionList] = useState(groupedDataSectionList);// DATA for sectionList
    //STATE KILOS NEEDED FOR COMPLETE PRODUCTION (BY AUTOPASTERS).
    const [kilosNeeded, getKilosNeeded] = useState(kilosForAutopasterState);
    //STATE OF TEXTAREA
    const [contentTextArea, getContentTextArea] = useState('');
    //TO SEND
    const [calculationProductionButton, setCalculationProductionButton] = useState(false);
    //STATE INPUT VISIBLE AND ERRORS.
    const [selectedTiradaBruta, getSelectedTiradaBruta] = useState('');
    const [inputirBrutaEnable, setInputirBrutaEnable] = useState(false);
    const [errors, setErrors] = useState({
        inputTirBruta: '',
    });
    //SPINNER STATE FOR DELETE CARDS
    const [modalEndProduction, setModalEndProduction] = useState(false);

    //FINAL RESULT OF THE PRODUCTION
    const [finalCalc, setFinalCalc] = useState({
        tiradaBruta: 0,
        kilosTirada: 0,
        kilosConsumidos: 0
    });
    const [itemForSpinner, setItemForSpinner] = useState(0);

    useEffect(() => {
        //Search negative Kilos.
        new Promise((resolve) => {
            const positiveKilos = [].concat(kilosNeeded.filter(i => i.kilosNeeded <= 0));
            if (calculationProductionButton && positiveKilos.length === 0) {
                resolve(true)
            }
        }).then(resolve => resolve ? principalScroll.current.scrollToEnd() : null)
            .catch(err => Sentry_Alert('FullProduction.js', 'Promise - calc kilos', err))
    }, [calculationProductionButton])

    function confirmDelete(rollID, autopasterID) {
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
                        setItemForSpinner(rollID);
                        handlerRemoveItem(rollID, autopasterID)
                    }
                },
            ]);
    };

    function handlerRemoveItem(rollID, autopasterID) {
        searchItems(autopasterID, individualAutopasterDataForSectionList, item)
            .then(response => deleteItem(response, rollID, item))
            .then(response => {
                getIndividualAutopasterDataForSectionList(response.updateItemsForSectionList);
                const updateKilos = kilosNeeded.map(autopaster => {
                    if (autopaster.autopaster_id === autopasterID) {
                        return {...autopaster, kilosNeeded: response.updateKilosNeededState}
                    } else {
                        return autopaster;
                    }
                })
                getKilosNeeded(updateKilos)
            })
            .catch(err => {
                setItemForSpinner(0);
                Sentry_Alert('FullProduction.js', 'func - handlerRemoveItem', err)
            })
    };

    async function updateCodepathSVG(codePath, bobinaID, autopasterID) {
        const {toUpdate, others} = await searchItems(autopasterID, individualAutopasterDataForSectionList);
        const updated = toUpdate.data.map((item) => {
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

    function updateRoll(radiusState, rollID, autopasterID) {
        try {
            searchItems(autopasterID, individualAutopasterDataForSectionList, item)
                .then(response => updatedataRollState(rollID, radiusState, response, maxRadius, radiusCoefBBDD, kilosNeeded))
                .then(response => {
                    //DELAY UPDATE FOR DON´T TRUNCATE KEYBOARD ANIMATION.
                    setTimeout(() => {
                        getIndividualAutopasterDataForSectionList(response.sectionListUpdate)
                        setCalculationProductionButton(response.initCalc)
                    }, 500)
                })
        } catch (err) {
            Sentry_Alert('FullProduction.js', 'func - updateRoll', err)
        }
    };
    //CALCULATE THE KILOS CONSUMED FROM THE GROSS LOT OF NEWSPAPERS OF PRODUCTION.
    const calcTirada = (tirBruta) => {
        tirBruta = parseInt(tirBruta);
        let resultData = {tiradaBruta: 0, kilosTirada: 0, kilosConsumidos: 0};
        const allRolls = [].concat(...individualAutopasterDataForSectionList.map(i => i.data));
        resultData.kilosConsumidos = allRolls.reduce((acc, item) => acc + (parseInt(item.peso_actual) - parseInt(item.weightEnd)), 0);
        resultData.kilosTirada = Math.round(item["kba_value"] * item["paginacion_value"] * tirBruta);
        resultData.tiradaBruta = tirBruta;

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
        } else {
            defValue = param;
        }
        if (defValue === 0) {
            setCalculationProductionButton(false)
        }
        getSelectedTiradaBruta(defValue);
    };

    function bottomSheetHandler() {
        InteractionManager.runAfterInteractions(() => {
            SetIsVisible(!isVisible)
        })
    };

    function bottomSheetHandlerRollUsed() {
        SetIsVisibleRollUsedForm(!isVisible);
    };

    function handlerSetVibleDropMenu() {
        setIsVisibleDropMenu(!isVisibleDropMenu);
    };

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
                if (response) {
                    InteractionManager.runAfterInteractions(() => {
                        createThreeButtonAlert(...response);
                    })
                }
                bottomSheetRef.current.close();
            })
            .catch(err => {
                bottomSheetRef.current.close()
                Sentry_Alert('FullProduction.js', 'func - handlerScannedCode', err)
            })
    };

    // //USER DETERMINES IF THE REEL TO INCLUDE IS NEW OR USED.
    const createThreeButtonAlert = (param, actionDDBB, text) => {
        let newBobina = `,\nPeso Actual: ${param.actualWeight} Kg,\nRadio: ${param.radius ? param.radius : 'Bobina completa'}`
        Alert.alert(`${text}`,
            `Código1:  ${param.scanCode}${text.charAt(0) === 'B' ? newBobina : ''}`, [
                {
                    text: 'CANCELAR',
                    onPress: () => null,
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
                    onPress: () => {
                        setRefresh(true)
                        InteractionManager.runAfterInteractions(() => {
                            return handlerRegisterRoll(param, actionDDBB, individualAutopasterDataForSectionList, item)
                        })
                    }
                },
            ]);
    };

    const setStateForRadiusChangedPosition = async (arrItems) => {
        const {tirada, nulls, media_value, full_value, produccion_id} = item;
        const objectResult = CalcPrevConsKilosRollsAutopaster(arrItems, (tirada + nulls), {
            media: media_value,
            entera: full_value
        }, produccion_id);

        //ADD init spinner
        setSpin(true);

        const numAutopster = objectResult.updatedItemsForSection[0].autopaster_fk;
        // await Promise.all(promisesALLforUpdateItems)
        objectResult.updatedItemsForPromises.map(i => console.log('item', i))
        new Promise.all(objectResult.updatedItemsForPromises.map(i => genericUpdateFunctionConfirm(UPDATE_PROMISES_ALL, i)))
            .then(() => {
                const ot = individualAutopasterDataForSectionList.filter(i => i.title !== numAutopster);
                getIndividualAutopasterDataForSectionList([
                    ...ot,
                    {data: objectResult.updatedItemsForSection, title: numAutopster}
                ].sort((a, b) => a.title - b.title));
                //END SPINNER
                setSpin(false);
            })
            .catch(err => Sentry_Alert('FullProduction.js', 'func - setStateForRadiusChangedPosition', err))
    }

    function handlerRegisterRoll(param, actionDDBB, individualAutopasterDataForSectionList, item) {
        return registerNewBobina(param, actionDDBB, individualAutopasterDataForSectionList, item, kilosNeeded)
            .then(response => {
                getIndividualAutopasterDataForSectionList(response.items)
                getKilosNeeded(response.kilos)
                setRefresh(false)
            })
            .catch(err => Sentry_Alert('FullProduction.js', 'func - handlerRegisterRoll', err))
    };

    function handlerRegisterUsedRoll(param, actionDDBB) {
        return registerNewBobina(param, actionDDBB, individualAutopasterDataForSectionList, item, kilosNeeded)
            .then(response => {
                getIndividualAutopasterDataForSectionList(response.items)
                getKilosNeeded(response.kilos)
                setRefresh(false)
            })
            .catch(err => Sentry_Alert('FullProduction.js', 'func - handlerRegisterRoll', err))
    }

    function handlerMoveItem(param) {
        setIsVisibleDropMenu(!isVisibleDropMenu);
        getItemForChangePosition(param);
    };


    //FOR SEND DATA TO DDBB WHEN PRODUCTION FINISH AND CREATE PDF.
    async function handlerSaveDataAndSend() {
        const request_update_AllBobinaTable =
            `UPDATE bobina_table SET
                     peso_actual = ?, radio_actual = ?, autopaster_fk = ?
                     WHERE codigo_bobina = ?;`
        ;
        const insertFinalProduction = `
                INSERT INTO productresults_table VALUES (?,?,?,?,?,?,?,?,?,?);`
        ;
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
        try {
            const {email, enterprise, name} = await getDatas('@UserDataForm').then(resp => {
                if (resp) {
                    return resp
                } else {
                    new Error('noname');
                }
            })

            const promisesUPDATED = await new Promise.all(rollsDataProduction.map(item => {
                return genericUpdatefunction(request_update_AllBobinaTable, [
                    item.weightEnd, parseInt(item.radiusEnd), item.autopaster_fk, item.codigo_bobina])
            }));
            const rowsAffected = promisesUPDATED.filter(i => i.rowsAffected === 0);
            if (!rowsAffected) new Error('updateError');

            const autopastersList = individualAutopasterDataForSectionList.map(i => i.title);
            autopastersList.sort((a, b) => a - b);

            const values = [
                null,
                finalCalc.tiradaBruta,
                finalCalc.kilosTirada,
                finalCalc.kilosConsumidos,
                dataProd.date,
                dataProd.tirada,
                dataProd.pagination,
                dataProd.productId,
                dataProd.editions,
                autopastersList.toString()
            ]
            const prodStatisticsINSERT = await genericInsertFunction(insertFinalProduction, values);
            if (!prodStatisticsINSERT.rowsAffected) new Error('insertError');
            // SEARCH FOR PRODUCTIONS FROM THE SAME OWNER.
            const papelcomunID = individualAutopasterDataForSectionList[0].data[0].papel_comun_fk;
            const productions = await genericTransaction(
                `SELECT produccion_id FROM produccion_table
                        WHERE produccion_id > ? AND producto_fk = (SELECT producto_id FROM producto_table WHERE papel_comun_fk = ?)
                        ORDER BY produccion_id`,
                [dataProd.productionID, papelcomunID]
            );
            // GET FINISHED ROLLS.
            let endedRolls = [];
            individualAutopasterDataForSectionList.map(autopaster => {
                autopaster.data.forEach(roll => {
                    if (roll.weightEnd === 0) {
                        endedRolls.push({
                            id: roll.bobina_fk,
                            autopaster: roll.autopaster_fk,
                            items: autopaster.data.length,
                            prodID: roll.production_fk
                        })
                    }
                })
            })
            // GET AND DELETE FINISHED ROLLS WHEN THERE IS MORE THAN ONE AND UPDATE WHEN ONLY ONE EXISTS.
            let Promises = await endedRolls.map(i => {
                if (i.items > 1) {
                    return genericUpdatefunction(
                        `DELETE FROM autopasters_prod_data WHERE bobina_fk = ? AND autopasters_prod_data_id > ?`,
                        [i.id, dataProd.productId]
                    );
                } else {
                    return genericUpdatefunction(
                        `UPDATE autopasters_prod_data SET bobina_fk = ?, resto_previsto = ? WHERE bobina_fk = ? `,
                        [null, null, i.id]
                    );
                }
            })
            const actionsThisProd = await new Promise.all(Promises)
            // DELETE EMPTY ROLLS OF NEXT PRODUCTIONS.
            const nextProductionsID = productions.map(i => i.produccion_id);
            for (let item of nextProductionsID) {
                for (let roll of endedRolls) {
                    const response = await genericTransaction(
                        `SELECT * FROM autopasters_prod_data
                                INNER JOIN bobina_table ON bobina_table.codigo_bobina = autopasters_prod_data.bobina_fk
                                WHERE autopasters_prod_data.production_fk = ?
                                AND autopasters_prod_data.autopaster_fk = ?;`,
                        [item, roll.autopaster]
                    );
                    const actionsNextProds = response.filter(roll => roll.bobina_fk);
                    const deletedEmptyRolls = response.filter(roll => !roll.bobina_fk);
                    if (actionsNextProds.length) {
                        await new Promise.all(deletedEmptyRolls.map(i => genericDeleteFunction(`DELETE FROM autopasters_prod_data WHERE autopasters_prod_data_id = ?`, [i.autopasters_prod_data_id])))
                    } else {
                        if (response.length > 1) {
                            const deleteLessOne = deletedEmptyRolls.filter((item, index) => index > 0)
                            await new Promise.all(deleteLessOne.map(i => genericDeleteFunction(`DELETE FROM autopasters_prod_data WHERE autopasters_prod_data_id = ?`, [i.autopasters_prod_data_id])))
                        }
                    }
                }
            }
            ;

            // CREATE FILE FOR CONSULTATION WITHIN THE APP
            const dataPdf = {
                template: htmlDefaultTemplate(dataProd, {
                    name,
                    enterprise
                }, finalCalc, rollsDataProduction, autopasterNumLine, contentTextArea),
                mailtosend: email
            };

            // CREATE PDF FILES FROM HTML AND SAVE IN APP FOLDER
            const formatedName = dataProd.date.replace(/[\-]/g, "")
            const {
                nameFile,
                fileURI
            } = await createAndSavePDF_HTML_file(`${formatedName}_${dataProd.product}`, dataPdf.template);

            // CREATE OPTIONS FOR SEND EMAIL
            let options = {
                subject: `${dataProd.date}-${dataProd.product}-${dataProd.pagination}`,
                recipients: [dataPdf.mailtosend],
                body: `Informe de producción de ${dataProd.product}`,
                isHTML: false,
                attachments: [fileURI]
            };
            handleEmail(options, nameFile)

            // DELETE PRODUCTION
            const deleteRollsOnThisProd = await genericDeleteFunction('DELETE from autopasters_prod_data where production_fk = ?', [dataProd.productionID])
            if (!deleteRollsOnThisProd.rowsAffected) new Error('deleteError');
            const thisProdDelete = await genericDeleteFunction(`DELETE FROM produccion_table WHERE produccion_id = ?;`, [dataProd.productionID]);
            if (!thisProdDelete.rowsAffected) new Error('deleteError');

            // CLOSE MODAL
            setModalEndProduction(true)
        } catch (err) {
            let message = '';
            switch (err) {
                case 'noname':
                    message = 'Complete DATOS DE ENCABEZADO.';
                    navigation.navigate('Settings')
                    break;
                case 'updateError':
                    message = 'Error al actualizar';
                    break;
                case 'insertError':
                    message = 'Error al guardar';
                    break;
                case 'deleteError':
                    message = 'Error al eliminar producción';
                    break;
                case 'emailError':
                    message = 'Error al enviar informe. Intentelo manualmente desde';
                    break;
                default:
                    message = 'Error en base de datos';
            }
            alert(message)
            Sentry_Alert('FullProduction.js', 'func - handlerSaveDataAndSend', err)

        }
    };

    function handlerCloseModalEndProd() {
        setModalEndProduction(false);
        navigation.navigate('Home');
    };

    const renderItem = ({item}) => {
        return (
            <FullCardProduction
                roll_autopaster={item.autopaster_fk}
                peso_ini={item.peso_ini}
                peso_actual={item.peso_actual}
                bobinaID={item.bobina_fk}
                media_defined={item.media_defined}
                restoPrevisto={item.resto_previsto}
                restoPrevistoAnteriorProduccion={item.rest_antProd}
                weight_End={item.weightEnd}
                new_radius={item.radiusEnd}
                updatedataRollState={(e) => updateRoll(e.nativeEvent.text, item.bobina_fk, item.autopaster_fk)}
                updateCodepathSVG={item.peso_ini === item.peso_actual ? updateCodepathSVG : null}
                confirmDelete={confirmDelete}
                itemForSpinner={itemForSpinner}
                coefValues={coefValues}
            />)
    };

    const renderSectionHeader = ({section: {data, title}}) => {
        let kiloscalc = Math.round(kilosNeeded.filter(i => i.autopaster_id === title)[0].kilosNeeded);
        return (
            <View style={styles.sectionHeader}>
                <Text style={[styles.headerText, {
                    fontSize: 12
                }]}>
                    UNIDAD:
                    <Text
                        style={{fontSize: 20, color: COLORS.buttonEdit}}> {title}</Text></Text>
                {kiloscalc > 0
                    ? null
                    : <WarningKilos weightCalc={kiloscalc}/>
                }
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    {data.length > 1 && <TouchableIcon
                        handlerOnPress={() => handlerMoveItem(data[0].autopaster_fk)}
                        touchableStyle={[styles.IconStyle, styles.touchableMoveItem]}
                        svgName={changeSVG}
                        WidthSVG={40}
                        heightSVG={40}
                    />}
                    <TouchableIcon
                        handlerOnPress={() => handlerAddBobina(title)}
                        touchableStyle={[styles.IconStyle, styles.touchableAdd]}
                        svgName={searchCode}
                        WidthSVG={40}
                        heightSVG={40}
                    />
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whitesmoke}}>
            <ScrollView ref={principalScroll}
                        nestedScrollEnabled
                        horizontal
                        snapToEnd={false}
                        automaticallyAdjustContentInsets={false}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0}
                        scrollEventThrottle={21}>
                <KeyboardAvoidingView enabled behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                      style={{width: windowWidth, height: windowHeight, flex: 1}}>
                    <BgRepeatSVG
                        svgOptions={optionsSVG2}
                        styleOptions={optionsStyleContSVG2}
                    />
                    <View style={styles.header}>
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
                        {refresh && <View
                            style={styles.absoluteSpinner}><SpinnerSquares/></View>}
                        {/*<Text>{JSON.stringify(kilosNeeded)}</Text>*/}
                        <SectionList
                            initialNumToRender={1}
                            getItemLayout={(individualAutopasterDataForSectionList, index) => ({
                                index,
                                length: 218, // itemHeight is a placeholder for your amount
                                offset: index * 218,
                            })}
                            stickySectionHeadersEnabled
                            sections={individualAutopasterDataForSectionList}
                            keyExtractor={(item, index) => item + index}
                            renderItem={renderItem}
                            ListFooterComponent={EmptyFooter}
                            renderSectionHeader={renderSectionHeader}
                        />
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
                            <View style={[styles.contData]}>
                                <View style={{marginVertical: 30}}>
                                    {
                                        calculationProductionButton && inputirBrutaEnable ?
                                            <View style={{position: 'absolute', zIndex: 2, top: -30, left: -5}}>
                                                <SvgComponent svgData={icon180SVG} svgWidth={50} svgHeight={50}/>
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
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </ScrollView>
            <BottomSheetComponent
                ref={bottomSheetRef}
                height={height}
                // animationType={'slide'}
                // openDuration={550}
                openDuration={500}
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
                height={400}
                openDuration={250}
                animationType={'slide'}
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
    header: {
        height: titleContHeight,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomColor: COLORS.white,
        backgroundColor: COLORS.primary,
    },
    contData: {
        height: windowHeight,
        paddingHorizontal: 5,
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
    bottomdrawer: {},
    textContData: {
        fontFamily: 'Anton',
        color: '#858585',
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
    emptyfooter: {
        height: 150,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20
    },
    emptyfooter_image: {
        width: 40,
        height: 40
    },
    emptyfooter_text: {
        fontFamily: 'Anton',
        fontSize: 20,
        color: COLORS.white
    },
    showdata: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 20
    },
    touchableMoveItem: {
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
    },
    touchableAdd: {
        backgroundColor: COLORS.white,
        borderRadius: 5,
        shadowColor: COLORS.black,
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.8,
        shadowRadius: 3,
        borderWidth: 2,
        borderColor: COLORS.primary,
        padding: 2
    },
    absoluteSpinner: {
        position: 'absolute',
        zIndex: 9999,
        backgroundColor: '#ffffff',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});

export default FullProduction;

const EmptyFooter = () => {
    return (
        <View style={styles.emptyfooter}>
            <Image
                style={styles.emptyfooter_image}
                source={require('../../assets/images/splash/Logo_AlbertoGarel.png')}
            />
            <Text style={styles.emptyfooter_text}>#Albertogarel</Text>
        </View>
    )
};

// SHOW PRODUCTION INFO
const ShowData = (item) => {
    const data = {
        'Fecha': item.fecha_produccion,
        'ID': item.produccion_id,
        'Producto': item.producto_name,
        'Propietario': item.papel_comun_name,
        'Paginación': item.paginacion_value,
        'Coeficiente': item.kba_value,
        'Gramaje': item.gramaje_value,
        'Tirada': item.tirada,
        'Nulos previstos': item.nulls,
        'Línea de producción': item.linea_name,
    }
    return (
        <View style={{flexDirection: 'row'}}>
            <View style={styles.showdata}>
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

const WarningKilos = ({weightCalc}) => {
    return (
        <View style={{
            backgroundColor: '#FF9999',
            paddingVertical: 3,
            paddingHorizontal: 6,
            borderRadius: 5,
        }}>
            <Text>Faltan: <Text style={{color: COLORS.white}}>{Math.abs(weightCalc)}</Text> Kg</Text></View>
    )
}