import React, {useRef, useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Switch,
    Alert,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import PagerView from 'react-native-pager-view';
import Footer from '../../components/onboardingComponents/FooterOnboarding';
import {useNavigation} from '@react-navigation/native';
import SettingsProductionHeader from "../../components/headers/SettingsProductionHeader";
import BgComponent from "../../components/BackgroundComponent/BgComponent";
import {
    addDateSVG,
    edicionesSVG,
    lineaprodSVG,
    logo,
    meditionSVG,
    nullsSVG,
    paginationSVG,
    productoSVG,
    tirada2SVG
} from "../../assets/svg/svgContents";
import {COLORS} from "../../assets/defaults/settingStyles";
import {Formik} from "formik";
import * as Yup from "yup";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import SvgComponent from "../../components/SvgComponent";
import CustomPicker from "../../components/FormComponents/CustomPicker";
import {
    getAutopasterByLineaID,
    picker_medition_style,
    picker_producto,
    pickerLinProd
} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import ToastMesages from "../../components/ToastMessages";
import {getDatas} from "../../data/AsyncStorageFunctions";
import RadioButtonComponent from "../../components/FormComponents/RadioButtonComponent";
import {
    autopastersAutomaticSelection,
    identifyAutopasters,
    individualProvidedWeightRollProduction,
    rangeCopies,
    searchCoefTypeRoll, Sentry_Alert
} from "../../utils";
import {genericInsertFunction, genericTransaction} from "../../dbCRUD/actionsFunctionsCrud";
import CustomDateTimePicker from "../../components/FormComponents/CustomDateTimePicker";


const searchStatementAutoProdData_Table =
    `SELECT * FROM autopasters_prod_data
     INNER JOIN bobina_table ON autopasters_prod_data.bobina_fk = bobina_table.codigo_bobina
     WHERE bobina_table.autopaster_fk = ? AND bobina_table.gramaje_fk = ?
     AND bobina_table.papel_comun_fk = ? AND
     autopasters_prod_data.media_defined = ? ORDER BY autopasters_prod_data.resto_previsto DESC;`;

const searchStatementRoll =
    `SELECT * FROM bobina_table 
     WHERE NOT EXISTS(SELECT 1 FROM autopasters_prod_data WHERE (autopasters_prod_data.bobina_fk = bobina_table.codigo_bobina))
     AND bobina_table.autopaster_fk = ?
     AND bobina_table.gramaje_fk = ?
     AND bobina_table.papel_comun_fk = ?
     AND bobina_table.media = ?
     AND bobina_table.peso_actual > 0 ORDER BY bobina_table.peso_actual ASC;`

// [productionID, autopasterFK, bobinaFK, restoPrevisto(calc), mediaDefined(ismedia)]
const insertAutopastCode =
    `INSERT INTO autopasters_prod_data 
     (production_fk, autopaster_fk, bobina_fk, resto_previsto, media_defined, position_roll) 
     VALUES (?,?,?,?,?,?);`;
//[productionID, autopasterID, mediaDefined(ismedia)]
const insertWithoutRoll =
    `INSERT INTO autopasters_prod_data (production_fk, autopaster_fk, media_defined, position_roll)
    VALUES (?,?,?,?);`


const SettingsProductionScreen = () => {

    const navigation = useNavigation();

    //BASEDATA STATES
    const [papelComun, getPapelComun] = useState([]);
    const [productoDataDB, getProductoDataDB] = useState([]);
    const [lineProdDataDB, getLineProdDataDB] = useState([]);
    const [meditionDataDB, getMeditionDataDB] = useState([]);
    const [autopastersDataDB, getAutopastrsdataDB] = useState([]);

    //STATES FOR INPUT RADIO CUSTOM
    const [isMedia, setMedia] = useState(0);
    const [areEnteras, setEnteras] = useState([]);
    const [numEnteras, setNumEnteras] = useState(0);

    //INPUT VALUES STATES
    const [selectedDates, getSelectedDate] = useState('');
    const [selectedTirada, getselectedTirada] = useState('');
    const [selectedProduct, getselectedProduct] = useState(0);
    const [selectedPagination, getselectedPagination] = useState(0);
    const [selectedLinProd, getselectedLinProd] = useState(0);
    const [selectedMedition, getselectedMedition] = useState(0);
    const [selectedEditions, getselectedEditions] = useState('');
    const [selectedNulls, getselectedNulls] = useState('');
    const [spinnerPagination, setSpinnerPagination] = useState(false);
    const [isFocused, setFocused] = useState(false);

    //APP states calcAutopasters
    const [autopastersSelectedLineProd, getAutopastersSelectedLineProd] = useState([])
    const [maxPaginationOptionPickerLineSelected, getMaxPaginationOptionPickerLineSelected] = useState([])
    const [isCheckedAutomaticNulls, setCheckedAutomaticNulls] = useState(false);
    const [isCheckedAutomaticSettingsConf, setCheckedAutomaticSettingsConf] = useState(false);

    const [nullCopiesByEdition, setNullCopiesByEdition] = useState(0);
    const [nullCopiesByTiradaPercentage, setNullCopiesByTiradaPercentage] = useState(0);
    const [nullCopiesByTirada, setNullCopiesByTirada] = useState(0);
    const [isCheckedAutomaticAutopasters, setCheckedAutomaticAutopasters] = useState(false);
    const [toastColor, setToastColor] = useState('#BBFFBB')
    // const [pagenumber, setPagenumber] = useState(1);
    // REFS
    const pagerRef = useRef(null);
    const inputDateRef = useRef();
    const fullproduction = useRef();


    let toastRef;
    const showToast = (message, isError = false, callback) => {
        if (!isError) {
            setToastColor('#BBFFBB');
        } else {
            setToastColor('#ff0000');
        }
        if (callback) {
            toastRef.show(message, 1000, () => {
                navigation.navigate('HomeStack');
            });
        } else {
            toastRef.show(message);
        }

    };

    function handlePageChange(pageNumber) {
        // IMPORTANT
        //Method .setPage() re-render component. use setPageWithoutAnimation()
        pagerRef.current?.setPageWithoutAnimation(pageNumber);
        // pagerRef.current?.setPage(pageNumber);
    };
    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: logo, svgWidth: '100%', svgHeight: '100%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: 0, right: 0, opacity: .1
    };

    const db = SQLite.openDatabase('bobinas.db');

    useEffect(() => {
        const blur_unsubscribe = navigation.addListener('blur', () => {
            setFocused(false)
        });
        const focus_unsubscribe = navigation.addListener('focus', () => {
            setFocused(true)
        });

        return () => {
            blur_unsubscribe();
            focus_unsubscribe();
        }
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            //CODE FOR REFRESH BASEDATA HERE AND PAGES OF PAGEVIEWER
            handlePageChange(0);
            //PRODUCT ALL
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM producto_table',
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getPapelComun(_array);
                        }
                    }
                );
            }, err => Sentry_Alert('SettingsProductionScreen.js', 'transaction - SELECT * FROM producto_table', err));
            //PRODUCT PICKER
            db.transaction(tx => {
                tx.executeSql(
                    picker_producto,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getProductoDataDB(_array);
                        }
                    }
                );
            }, err => Sentry_Alert('SettingsProductionScreen.js', 'transaction - picker_producto', err));
            //PRODUCTION LINE
            db.transaction(tx => {
                tx.executeSql(
                    pickerLinProd,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getLineProdDataDB(_array);
                        }
                    }
                );
            }, err => Sentry_Alert('SettingsProductionScreen.js', 'transaction - pickerLinProd', err));
            //MEDITION STYLE
            db.transaction(tx => {
                tx.executeSql(
                    picker_medition_style,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getMeditionDataDB(_array);
                        } else {
                            console.log('(picker_medition_style) no se encontraron registros en SettingsProductionScreen');
                        }
                    }
                );
            }, err => Sentry_Alert('SettingsProductionScreen.js', 'transaction - picker_medition_style', err));

            //AUTOPASTERS
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM autopaster_table',
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getAutopastrsdataDB(_array);
                        } else {
                            console.log('(picker_medition_style) no se encontraron registros en SettingsProductionScreen');
                        }
                    }, () => err => console.log(err)
                );
            }, err => Sentry_Alert('SettingsProductionScreen.js', 'transaction - SELECT * FROM autopaster_table', err));

            getDatas('@NullCopiesData')
                .then(response => {
                    setNullCopiesByEdition(parseInt(response.nullcopiesbyedition));
                    setNullCopiesByTiradaPercentage(parseInt(response.nullcopiesbydefault));
                })
                .catch((err) => {
                    Sentry_Alert('SettingsProductionScreen.js', 'getDatas - @NullCopiesData', err)
                });
        });

        return unsubscribe;
    }, [
        navigation
    ]);

    useEffect(() => {
        if (maxPaginationOptionPickerLineSelected && selectedPagination) {
            db.transaction(tx => {
                tx.executeSql(
                    getAutopasterByLineaID,
                    [selectedLinProd],
                    (_, {rows: {_array}}) => {
                        if (autopastersDataDB.length > 0) {
                            getAutopastersSelectedLineProd(_array);
                            const valuePagination = maxPaginationOptionPickerLineSelected.filter(item => item.paginacion_id === selectedPagination);

                            //CHECK IF 'MEDIA BOBINA' EXIST
                            const identifyWithMedia = identifyAutopasters(valuePagination[0].paginacion_value);
                            // //GET 'MEDIA BOBINA' FOR CUSTOM RADIOS
                            if (identifyWithMedia.media === 1) {
                                const autopasterMedia = _array.filter(item => item.media);
                                if (autopasterMedia.length > 0) {
                                    setMedia(autopasterMedia[0].autopaster_id);
                                    setNumEnteras(identifyWithMedia.entera);
                                } else {
                                    getselectedPagination(0);
                                    Alert.alert(
                                        '¡¡ ATENCIÓN !!',
                                        'No existe autopaster definido para media bobina en esta lìnea de producción.' +
                                        ' Cree o asigne uno existente en el apartado de base de datos. (BBDD -> Autopasters)'
                                    )
                                }
                            } else {
                                setMedia(0);
                                setNumEnteras(identifyWithMedia.entera);
                            }
                        }
                    }, () => err => console.log(err)
                );
            }, err => Sentry_Alert('SettingsProductionScreen.js', 'transaction - getAutopasterByLineaID', err));
        } else {
            if (__DEV__) {
                console.log('no call autopasters')
            }
        }

        setSpinnerPagination(false);

    }, [maxPaginationOptionPickerLineSelected, selectedPagination]);

    const groupAuto = (obj, prodData) => {
        let getSelectedAutopasterswithrolls = [];
        const id = obj.id;
        const _enteras = obj.entera.map(item => [id, item, 0]);
        const _media = [id, obj.media, 1];
        if (!obj.media) {
            getSelectedAutopasterswithrolls = [...getSelectedAutopasterswithrolls, ..._enteras];
        } else {
            getSelectedAutopasterswithrolls = [...getSelectedAutopasterswithrolls, ..._enteras, _media];
        }

        let _gramaje = meditionDataDB.filter(i => i.medition_id === selectedMedition)[0].gramaje_id;

        db.transaction(async tx => {
            for await (let item of getSelectedAutopasterswithrolls) {
                let coefRoll = 0;
                let nowRollWeight = 0;
                let positionRoll = 1;
                let calcWeigth = {};
                let dataRollInsert = [];
                let queryParams = [item[1], _gramaje, papelComun.filter(i => i.producto_id === selectedProduct)[0].papel_comun_fk, item[2]]

                await tx.executeSql(
                    searchStatementAutoProdData_Table,
                    queryParams,
                    (_, {rows: {_array}}) => {
                        const meditionVal = meditionDataDB.filter(item => item.medition_id === selectedMedition);
                        const SumTotalCopies = parseInt(prodData.nulls) + parseInt(prodData.tirada);
                        if (_array.length > 0) {
                            // OK. INSERT 'CODIGO_BOBINA' ROLL IN autopasters_prod_data.
                            coefRoll = searchCoefTypeRoll(...meditionVal, ..._array);
                            nowRollWeight = _array[0].resto_previsto;
                            calcWeigth = individualProvidedWeightRollProduction(SumTotalCopies, nowRollWeight, coefRoll);
                            dataRollInsert = [item[0], item[1], _array[0].codigo_bobina, calcWeigth.rollweight, item[2], positionRoll]

                            genericInsertFunction(insertAutopastCode, dataRollInsert)
                                .then(response => response)
                                .catch(err => Sentry_Alert('SettingsProductionScreen.js', 'func - searchStatementAutoProdData_Table - _array.length > 0', err))
                        } else {
                            // NO OK. NEGATIVE COIL SEARCH IN PRODUCTION TABLE. SEARCH LAST ROLL IN SELECTED AUTOPASTER.
                            db.transaction(tx => {
                                tx.executeSql(
                                    searchStatementRoll,
                                    queryParams,
                                    (_, {rows: {_array}}) => {
                                        if (_array.length > 0) {
                                            // OK. INSERT 'CODIGO_BOBINA' ROLL IN autopasters_prod_data.
                                            coefRoll = searchCoefTypeRoll(...meditionVal, ..._array);
                                            nowRollWeight = _array[0].peso_actual;
                                            calcWeigth = individualProvidedWeightRollProduction(SumTotalCopies, nowRollWeight, coefRoll);
                                            dataRollInsert = [item[0], item[1], _array[0].codigo_bobina, calcWeigth.rollweight, item[2], positionRoll]

                                            // INSERT DATA.
                                            genericInsertFunction(insertAutopastCode, dataRollInsert)
                                                .then(response => response)
                                                .catch(err => Sentry_Alert('SettingsProductionScreen.js', 'func - searchStatementRoll - _array.length > 0', err))
                                        } else {
                                            // NO ROLL FOUND.
                                            const insertAutopastWithoutRoll = [...item, positionRoll];
                                            genericInsertFunction(insertWithoutRoll, insertAutopastWithoutRoll)
                                                .then(response => response)
                                                .catch(err => Sentry_Alert('SettingsProductionScreen.js', 'func - searchStatementRoll - NO ROLL FOUND', err))
                                        }
                                    }
                                );
                            })
                        }
                    }, err => Sentry_Alert('SettingsProductionScreen.js', 'transaction - searchStatementAutoProdData_Table', err)
                )
            }
        })
    };

    async function handlerSendOptionsSelected(toSendAutopastProd, toSendProd) {
        const insert_production = "INSERT INTO produccion_table (produccion_id, editions, linea_fk, medition_fk, pagination_fk, producto_fk, tirada, nulls, fecha_produccion) VALUES (?,?,?,?,?,?,?,?,?);"
        const prod_data = Object.values(toSendProd);
        //SEARCH BOBINAS FUNCTION
        try {
            const insertProd = await genericInsertFunction(insert_production, prod_data)
            if (insertProd.rowsAffected === 0) throw new Error('Error al guardar.')
            //LOOP INSERT DATA
            await groupAuto(toSendAutopastProd, toSendProd);
            showToast(
                'Producción creada con éxito.',
                false,
                true
            );

            // setTimeout(() => navigation.navigate('HomeStack'), 2000);
            resetForm();
        } catch (err) {
            if (__DEV__) console.log(err)
            showToast(err.message, true, false)
            Sentry_Alert('SettingsProductionScreen.js', 'handlerSendOptionsSelected - insert_production', err)
        }

    };

    const resetForm = () => {
        //RESET FORM AND STATES
        fullproduction.current?.resetForm();
        setMedia(0);
        setEnteras([]);
        setNumEnteras(0);
        getselectedTirada('');
        getselectedProduct(0);
        getselectedPagination(0);
        getselectedLinProd(0);
        getselectedMedition(0);
        getselectedEditions('');
        getselectedNulls('');
        getSelectedDate('');
    }

    const handlerChangeLineProd = (val) => {
        //RESET PAGE STATUS ON CHANGE LINE PRODUCTION VALUES.
        getselectedPagination(0);
        //     //RESET TO INITIAL STATE WHEN CHANGE OPTION SELECTED
        setEnteras([]);
        //GET LIMIT FOR PAGINATION OF LINE PRODUCTION SELECTED.
        const getLineProd = autopastersDataDB.filter((item => item.linea_fk === val));
        const limitPagination = getLineProd.length * 16;
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM paginacion_table WHERE paginacion_value <=?;",
                [limitPagination],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        getMaxPaginationOptionPickerLineSelected(_array);
                    }
                }
            );
        }, err => Sentry_Alert('SettingsProductionScreen.js', 'transaction - limitPagination', err));
    }

    const fullProductionSchema = Yup.object().shape({
        inputDate: FormYupSchemas.dateReg,
        tirada: FormYupSchemas.tirada,
        pickerProduct: FormYupSchemas.pickerProducto,
        pickerPagination: FormYupSchemas.pickerProducto,
        pickerlinProd: FormYupSchemas.pickerProducto,
        pickerMedition: FormYupSchemas.pickerProducto,
        inputEditions: FormYupSchemas.editions,
        inputNulls: FormYupSchemas.tirada,
        customEntera: Yup.array().length(numEnteras, `Debes seleccionar ${numEnteras}`),
        customMedia: Yup.number().test({
            name: 'customEntera',
            // eslint-disable-next-line object-shorthand
            test: function (value) {
                // You can add any logic here to generate a dynamic message

                return value < 0
                    ? this.createError({
                        message: `Falta por seleccionar 1 Autopaster`,
                        path: 'customMedia', // Fieldname
                    })
                    : true;
            },
        }),
    });

    function handlerCheckAutopasterAutoSelected() {
        if (selectedProduct && selectedPagination) {
            if (isCheckedAutomaticAutopasters) {
                setEnteras([]);
                setCheckedAutomaticAutopasters(false);
                return
            }
            setCheckedAutomaticAutopasters(!isCheckedAutomaticAutopasters)
            autopastersAutomaticSelection(selectedProduct, selectedPagination, maxPaginationOptionPickerLineSelected)
                .then(response => {
                    if (response.length === 0) {
                        setCheckedAutomaticAutopasters(false)
                        return alert('no existen registros anteriores similares.')
                    }
                    let autopasters = [...response];
                    if (isMedia !== 0) {
                        autopasters = response.filter(i => parseInt(i) !== isMedia)
                    }
                    setEnteras(autopasters)
                    setCheckedAutomaticAutopasters(true)
                })
                .catch(err => Sentry_Alert('SettingsProductionScreen.js', 'func - autopastersAutomaticSelection', err))
        } else {
            alert('completa loss campos de los apartados "paso1" y "paso 2"')
        }
    }

    const [switchTirada, setSwitchTirada] = useState(false);
    const [switchEditions, setSwitchEditions] = useState(false);

    function handlerCalcAutomaticNulls() {
        const selectAveragePreviousProductions =
            `SELECT tiradabruta, ejemplares FROM productresults_table
            WHERE ejemplares BETWEEN ? AND ? AND paginacion = ? AND nombre_producto = ? AND ediciones = ?;
            `;
        if (!maxPaginationOptionPickerLineSelected || !selectedPagination || !selectedTirada || !selectedEditions || !selectedProduct) {
            alert('completa loss campos de los apartados "paso1" y "paso 2"')
            return;
        }
        const pagValue = maxPaginationOptionPickerLineSelected.filter(i => i.paginacion_id === selectedPagination)[0].paginacion_value;
        const {min, max} = rangeCopies(selectedTirada);
        if (!isCheckedAutomaticNulls) {
            genericTransaction(selectAveragePreviousProductions, [
                min, max, pagValue, selectedProduct, selectedEditions
            ])
                .then(response => {
                    if (!response.length > 0) {
                        setCheckedAutomaticNulls(false)
                        return alert('No existen datos para calcular.');
                    } else {
                        const dif = response.reduce((acc, item) => {
                            return acc + (item.tiradabruta - item.ejemplares)
                        }, 0);
                        getselectedNulls(dif / response.length)
                    }
                })
                .catch(err => Sentry_Alert('SettingsProductionScreen.js', 'transaction  selectAveragePreviousProductions', err))
        }
        setCheckedAutomaticNulls(!isCheckedAutomaticNulls)
    };

    useEffect(() => {
        getselectedNulls('');
        let nullsByTir = ((parseInt(selectedTirada) * parseInt(nullCopiesByTiradaPercentage)) / 100);
        let nullsByEd = parseInt(nullCopiesByEdition) * parseInt(selectedEditions);

        if (isNaN(nullsByTir)) nullsByTir = 0;
        if (isNaN(nullsByEd)) nullsByEd = 0;

        if (switchTirada) {
            if (nullCopiesByTiradaPercentage === 0) {
                setTimeout(() => navigation.navigate('SettingsStack'), 2000)
                return alert('Complete "descarte de ejemplares" en el apartado "SETTINGS".')
            }
            getselectedNulls(nullsByTir)
            setNullCopiesByTirada(nullsByTir);
        }
        if (switchEditions) {
            if (nullCopiesByEdition === 0) {
                setTimeout(() => navigation.navigate('SettingsStack'), 2000);
                return alert('Complete "descarte de ejemplares" en el apartado "SETTINGS".')
            }
            getselectedNulls(nullsByEd);
        }
    }, [selectedTirada, selectedEditions, switchTirada, switchEditions, isCheckedAutomaticNulls])


    return (
        // SafeAreView don't accept padding.
        <SafeAreaView style={{flex: 1}}>
            <Formik
                enableReinitialize
                innerRef={fullproduction}
                initialValues={{
                    inputDate: selectedDates,
                    tirada: selectedTirada,
                    switchTirada: switchTirada,
                    pickerProduct: selectedProduct,
                    pickerPagination: selectedPagination,
                    pickerlinProd: selectedLinProd,
                    pickerMedition: selectedMedition,
                    inputEditions: selectedEditions,
                    inputNulls: selectedNulls,
                    customEntera: areEnteras,
                    customMedia: isMedia
                }}
                validationSchema={fullProductionSchema}
                onSubmit={async values => {
                    const create_id = Date.now();
                    const objectAutopast = {
                        id: create_id,
                        entera: areEnteras,
                        media: isMedia
                    };

                    //TO SEND BASEDATA
                    // order insert (production_id, editions, linea_fk, medition_fk, pagination_fk,
                    // producto_fk, tirada, nulls, fecha_produccion)
                    const objectProd = {
                        id: create_id,
                        editions: values.inputEditions,
                        linea: values.pickerlinProd,
                        medicion: values.pickerMedition,
                        pagination: values.pickerPagination,
                        producto: values.pickerProduct,
                        tirada: values.tirada,
                        nulls: values.inputNulls,
                        date: values.inputDate.replace(/\//g, '-'),
                    };
                    await handlerSendOptionsSelected(objectAutopast, objectProd);
                }}
            >
                {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      isValid,
                      setFieldValue,
                      setFieldTouched
                  }) => (
                    <>
                        <View style={{flex: 1}}>
                            {
                                isFocused && <StatusBar
                                    animated={false}
                                    backgroundColor={COLORS.background_primary}
                                    barStyle={'dark-content'}
                                />
                            }
                            <PagerView style={{flex: 1}}
                                       initialPage={0}
                                       ref={pagerRef}
                            >
                                <View>
                                    <View style={styles.contPrinc}>
                                        <BgComponent
                                            svgOptions={optionsSVG}
                                            styleOptions={optionsStyleContSVG}
                                        />
                                        <SettingsProductionHeader
                                            pagenumber={1}
                                            explanation={'Escoge opciones relacionadas con el producto.'}
                                        />
                                        <View style={styles.subCont}>
                                            <View>
                                                {(errors.inputDate && touched.inputDate) &&
                                                <Text
                                                    style={{
                                                        fontSize: 10,
                                                        color: 'red',
                                                        marginLeft: 10
                                                    }}>{errors.inputDate}</Text>
                                                }
                                                <CustomDateTimePicker
                                                    getSelectedDate={getSelectedDate}
                                                    _ref={inputDateRef}
                                                    svgData={addDateSVG}
                                                    svgWidth={35}
                                                    svgHeight={35}
                                                    text={'Fecha: '}
                                                    modeType={'calendar'}
                                                    styleOptions={{
                                                        backgroundColor: '#FFF',
                                                        textHeaderColor: '#FF8500',
                                                        textDefaultColor: '#FF8500',
                                                        selectedTextColor: '#fff',
                                                        mainColor: '#FF8500',
                                                        textSecondaryColor: '#000',
                                                        borderColor: '#000',
                                                        textFontSize: 12,
                                                        textHeaderFontSize: 20,
                                                        defaultFont: 'Anton',
                                                        headerFont: 'Anton',
                                                    }}
                                                    placeholder={'Selecciona fecha...'}
                                                    _name={'inputDate'}
                                                    _value={selectedDates}
                                                />
                                            </View>
                                            <View>
                                                <View style={{padding: 10}}>
                                                    {(errors.pickerlinProd && touched.pickerlinProd) &&
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            color: 'red'
                                                        }}>{errors.pickerlinProd}</Text>
                                                    }
                                                    <View style={styles.contPicker}>
                                                        <View style={styles.IconStyle}>
                                                            <SvgComponent
                                                                svgData={lineaprodSVG}
                                                                svgWidth={45}
                                                                svgHeight={45}
                                                            />
                                                        </View>
                                                        <View style={{flex: 1, paddingLeft: 10}}>
                                                            <CustomPicker
                                                                // ref={ProductoRef}
                                                                style={{
                                                                    borderWidth: .5,
                                                                    borderColor: COLORS.black,
                                                                }}
                                                                name={'pickerlinProd'}
                                                                itemStyle={{fontFamily: 'Anton'}}
                                                                mode={'dialog'}
                                                                selectedValue={values.pickerlinProd}
                                                                onValueChange={(itemValue) => {
                                                                    //RESET PAGE STATUS ON CHANGE LINE PRODUCTION VALUES.
                                                                    if (itemValue > 0) {
                                                                        handlerChangeLineProd(itemValue);
                                                                        handleChange('pickerlinProd')
                                                                        setFieldTouched('pickerlinProd', true)
                                                                        setFieldValue('pickerlinProd', itemValue)
                                                                        getselectedLinProd(itemValue)
                                                                        setSpinnerPagination(true)
                                                                    } else {
                                                                        showToast("Debes escoger una opción válida...", true)
                                                                    }
                                                                }}
                                                                dataOptionsPicker={
                                                                    lineProdDataDB.map((item, index) => {
                                                                        return <Picker.Item key={index}
                                                                                            label={' ' + item.linea_name}
                                                                                            value={item.linea_id}/>
                                                                    })
                                                                }
                                                                defaultItemLabel={'Escoge Línea de producción...'}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{padding: 10}}>
                                                    {(errors.pickerPagination && touched.pickerPagination) &&
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            color: 'red'
                                                        }}>{errors.pickerPagination}</Text>
                                                    }
                                                    <View style={styles.contPicker}>
                                                        <View style={styles.IconStyle}>
                                                            <SvgComponent
                                                                svgData={paginationSVG}
                                                                svgWidth={45}
                                                                svgHeight={45}
                                                            />
                                                        </View>
                                                        <View style={{flex: 1, paddingLeft: 10}}>
                                                            {spinnerPagination && <AbsoluteSpinner/>}
                                                            <CustomPicker
                                                                style={{
                                                                    borderWidth: .5,
                                                                    borderColor: COLORS.black,
                                                                }}
                                                                name={'pickerPagination'}
                                                                itemStyle={{fontFamily: 'Anton'}}
                                                                mode={'dialog'}
                                                                selectedValue={values.pickerPagination}
                                                                onValueChange={(itemValue) => {
                                                                    if (itemValue > 0) {
                                                                        handleChange('pickerPagination')
                                                                        setFieldTouched('pickerPagination', true)
                                                                        setFieldValue('pickerPagination', itemValue)
                                                                        getselectedPagination(itemValue)
                                                                    } else {
                                                                        showToast("Debes escoger una opción válida...", true)
                                                                    }
                                                                }}
                                                                dataOptionsPicker={
                                                                    selectedLinProd ?
                                                                        maxPaginationOptionPickerLineSelected.map((item, index) => {
                                                                            return <Picker.Item key={index}
                                                                                                label={' ' + item.paginacion_value}
                                                                                                value={item.paginacion_id}/>
                                                                        })
                                                                        :
                                                                        []
                                                                }
                                                                enabled={maxPaginationOptionPickerLineSelected.length > 0}
                                                                defaultItemLabel={maxPaginationOptionPickerLineSelected.length === 0 ? 'Paginación deshabilitada...' : 'Escoge paginación...'}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{padding: 10}}>
                                                    {(errors.pickerProduct && touched.pickerProduct) &&
                                                    < Text
                                                        style={{
                                                            fontSize: 10,
                                                            color: 'red'
                                                        }}>{errors.pickerProduct}</Text>
                                                    }
                                                    <View style={styles.contPicker}>
                                                        <View style={styles.IconStyle}>
                                                            <SvgComponent
                                                                svgData={productoSVG}
                                                                svgWidth={45}
                                                                svgHeight={45}
                                                            />
                                                        </View>
                                                        <View style={{flex: 1, paddingLeft: 10}}>
                                                            <CustomPicker
                                                                style={{
                                                                    borderWidth: .5,
                                                                    borderColor: COLORS.black,
                                                                }}
                                                                name={'pickerProduct'}
                                                                itemStyle={{fontFamily: 'Anton'}}
                                                                mode={'dialog'}
                                                                selectedValue={values.pickerProduct}
                                                                onValueChange={(itemValue) => {
                                                                    if (itemValue > 0) {
                                                                        handleChange('pickerProduct')
                                                                        setFieldTouched('pickerProduct', true)
                                                                        setFieldValue('pickerProduct', itemValue)
                                                                        getselectedProduct(itemValue)
                                                                    } else {
                                                                        showToast("Debes escoger una opción válida...", true)
                                                                    }
                                                                }}
                                                                dataOptionsPicker={
                                                                    productoDataDB.map((item, index) => {
                                                                        return <Picker.Item key={index}
                                                                                            label={' ' + item.producto_name}
                                                                                            value={item.producto_id}/>
                                                                    })
                                                                }
                                                                defaultItemLabel={'Escoge un producto...'}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{padding: 10}}>
                                                    {(errors.pickerMedition && touched.pickerMedition) &&
                                                    < Text
                                                        style={{
                                                            fontSize: 10,
                                                            color: 'red'
                                                        }}>{errors.pickerMedition}</Text>
                                                    }
                                                    <View style={styles.contPicker}>
                                                        <View style={styles.IconStyle}>
                                                            <SvgComponent
                                                                svgData={meditionSVG}
                                                                svgWidth={45}
                                                                svgHeight={45}
                                                            />
                                                        </View>
                                                        <View style={{flex: 1, paddingLeft: 10}}>
                                                            <CustomPicker
                                                                style={{
                                                                    borderWidth: .5,
                                                                    borderColor: COLORS.black,
                                                                }}
                                                                name={'pickerMedition'}
                                                                itemStyle={{fontFamily: 'Anton'}}
                                                                mode={'dialog'}
                                                                selectedValue={values.pickerMedition}
                                                                onValueChange={(itemValue) => {
                                                                    if (itemValue > 0) {
                                                                        handleChange('pickerMedition')
                                                                        setFieldTouched('pickerMedition', true)
                                                                        setFieldValue('pickerMedition', itemValue)
                                                                        getselectedMedition(itemValue)
                                                                    } else {
                                                                        showToast("Debes escoger una opción válida...", true)
                                                                    }
                                                                }}
                                                                dataOptionsPicker={
                                                                    meditionDataDB.map((item, index) => {
                                                                        return <Picker.Item key={index}
                                                                                            label={'medición ' + item.medition_type + ' / ' + item.gramaje_value + 'g.'}
                                                                                            value={item.medition_id}/>
                                                                    })
                                                                }
                                                                defaultItemLabel={'Escoge tipo de medición...'}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <Footer
                                            backgroundColor={COLORS.primary}
                                            rightButtonLabel="Next"
                                            rightButtonPress={() => {
                                                handlePageChange(1);
                                            }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <View style={styles.contPrinc}>
                                        <BgComponent
                                            svgOptions={optionsSVG}
                                            styleOptions={optionsStyleContSVG}
                                        />
                                        <SettingsProductionHeader
                                            pagenumber={2}
                                            explanation={'Introduce manualmente el número de ejemplares nulos, "descarte de ejemplares (SETTINGS)" o por estadísticas de producción'}
                                        />
                                        <View style={styles.subCont}>
                                            <View style={{marginTop: 10}}>
                                                {(errors.tirada && touched.tirada) &&
                                                <Text
                                                    style={{
                                                        fontSize: 10,
                                                        color: 'red',
                                                        marginLeft: 10
                                                    }}>{errors.tirada}</Text>
                                                }
                                                <CustomTextInput
                                                    svgData={tirada2SVG}
                                                    svgWidth={50}
                                                    svgHeight={50}
                                                    placeholder={'Número de ejemplares...'}
                                                    text={'Tirada prevista:'}
                                                    type={'numeric'}
                                                    _name={'tirada'}
                                                    _onChangeText={handleChange('tirada')}
                                                    _onBlur={handleBlur('tirada')}
                                                    _onEndEditing={() => getselectedTirada(values.tirada)}
                                                    _defaultValue={selectedTirada.toString()}
                                                    value={values.tirada}
                                                />
                                            </View>
                                            <View
                                                style={[styles.swicthparent, {opacity: switchEditions || isCheckedAutomaticNulls ? .2 : 1}]}
                                            >
                                                <Switch
                                                    style={{width: '10%'}}
                                                    trackColor={{false: '#767577', true: '#ffff0080'}}
                                                    thumbColor={!switchTirada && !isCheckedAutomaticSettingsConf ? '#f4f3f4' : '#f5dd4b'}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={() => {
                                                        if (isNaN(parseInt(selectedTirada)) || selectedTirada <= 0) {
                                                            alert('introduce una cantidad en "tirada prevista');
                                                        } else {
                                                            setSwitchTirada(!switchTirada)
                                                        }
                                                    }}
                                                    value={switchTirada}
                                                    disabled={switchEditions || isCheckedAutomaticNulls}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Anton',
                                                        color: COLORS.dimgrey,
                                                        fontSize: 13,
                                                        width: '90%'
                                                    }}
                                                >{switchTirada ?
                                                    <>Nulos por tirada: <Text
                                                        style={{color: COLORS.primary}}>{selectedTirada > 0 ? nullCopiesByTirada : '¿ ?'}</Text> Ejemplares
                                                        ( <Text
                                                            style={{color: COLORS.primary}}>{nullCopiesByTiradaPercentage}%</Text> )</>
                                                    :
                                                    <>Usar valores de descarte de "SETTINGS" para <Text
                                                        style={{color: COLORS.primary}}>tirada</Text></>}
                                                </Text>
                                                <Text>alf:{nullCopiesByTirada}</Text>
                                            </View>
                                            <View style={{marginTop: 10}}>
                                                {(errors.inputEditions && touched.inputEditions) &&
                                                <Text style={{
                                                    fontSize: 10,
                                                    color: 'red',
                                                    marginLeft: 10
                                                }}>{errors.inputEditions}</Text>
                                                }
                                                <CustomTextInput
                                                    svgData={edicionesSVG}
                                                    svgWidth={50}
                                                    svgHeight={50}
                                                    placeholder={'Número de ediciones...'}
                                                    text={'Ediciones'}
                                                    type={'numeric'}
                                                    styled={{marginBottom: 10}}
                                                    _name={'inputEditions'}
                                                    _onChangeText={handleChange('inputEditions')}
                                                    _onBlur={handleBlur('inputEditions')}
                                                    _onEndEditing={() => getselectedEditions(values.inputEditions)}
                                                    value={values.inputEditions}
                                                    _defaultValue={selectedEditions.toString()}
                                                />
                                            </View>
                                            <View
                                                style={[styles.swicthparent, {opacity: switchTirada || isCheckedAutomaticNulls ? .2 : 1}]}
                                            >
                                                <Switch
                                                    style={{width: '10%'}}
                                                    trackColor={{false: '#767577', true: '#ffff0080'}}
                                                    thumbColor={!switchEditions && !isCheckedAutomaticSettingsConf ? '#f4f3f4' : '#f5dd4b'}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={() => {
                                                        if (isNaN(parseInt(selectedEditions)) || selectedEditions <= 0) {
                                                            alert('introduce una cantidad en "ediciones');
                                                        } else {
                                                            setSwitchEditions(!switchEditions)
                                                        }
                                                    }}
                                                    value={switchEditions}
                                                    disabled={switchTirada || isCheckedAutomaticNulls}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Anton',
                                                        color: COLORS.dimgrey,
                                                        fontSize: 13,
                                                        width: '90%'
                                                    }}
                                                >{switchEditions ?
                                                    <>Nulos por edición: <Text
                                                        style={{color: COLORS.primary}}>{nullCopiesByEdition}</Text> Ejemplares
                                                        x <Text
                                                            style={{color: COLORS.primary}}>{selectedEditions > 0 ? selectedEditions : ' ¿ ?'}</Text> = <Text
                                                            style={{color: COLORS.primary}}>{nullCopiesByEdition * selectedEditions}</Text></>
                                                    :
                                                    <>Usar valores de descarte de "SETTINGS" para <Text
                                                        style={{color: COLORS.primary}}>ediciones.</Text></>}
                                                </Text>
                                            </View>
                                            <View style={{marginTop: 10}}>
                                                {(errors.inputNulls && touched.inputNulls) &&
                                                <Text style={{
                                                    fontSize: 10,
                                                    color: 'red',
                                                    marginLeft: 10
                                                }}>{errors.inputNulls}</Text>
                                                }
                                                <CustomTextInput
                                                    svgData={nullsSVG}
                                                    svgWidth={50}
                                                    svgHeight={50}
                                                    placeholder={'Ejemplares "nulos"...'}
                                                    text={'Ejemplares nulos'}
                                                    type={'numeric'}
                                                    _name={'inputNulls'}
                                                    _onChangeText={handleChange('inputNulls')}
                                                    _onBlur={handleBlur('inputNulls')}
                                                    _onEndEditing={() => getselectedNulls(values.inputNulls)}
                                                    value={values.inputNulls}
                                                    _defaultValue={selectedNulls.toString()}
                                                    noEditable={isCheckedAutomaticNulls || switchEditions || switchTirada}
                                                    styled={{
                                                        marginBottom: 0,
                                                        backgroundColor: isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf ? COLORS.primary + '50' : COLORS.white
                                                    }}
                                                    inputStyled={{color: isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf ? COLORS.black : COLORS.dimgrey + '90'}}
                                                />
                                            </View>
                                            <View
                                                style={[styles.swicthparent, {opacity: switchEditions || switchTirada ? .2 : 1}]}
                                            >
                                                <Switch
                                                    style={{width: '10%'}}
                                                    trackColor={{false: '#767577', true: '#ffff0080'}}
                                                    thumbColor={isCheckedAutomaticNulls ? '#f5dd4b' : '#f4f3f4'}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={() => handlerCalcAutomaticNulls()}
                                                    value={isCheckedAutomaticNulls}
                                                    disabled={switchEditions || switchTirada}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Anton',
                                                        color: COLORS.dimgrey,
                                                        fontSize: 13,
                                                        width: '90%'
                                                    }}
                                                >Usar estadísticas de producciones anteriores para calcular
                                                    ejemplares
                                                    "nulos" según ediciones y tirada</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Footer
                                        backgroundColor={COLORS.primary}
                                        rightButtonLabel="Next"
                                        rightButtonPress={() => {
                                            handlePageChange(2);
                                        }}
                                        leftButtonLabel="Back"
                                        leftButtonPress={() => {
                                            handlePageChange(0);
                                        }}
                                    />
                                </View>
                                <View>
                                    <View style={styles.contPrinc}>
                                        <BgComponent
                                            svgOptions={optionsSVG}
                                            styleOptions={optionsStyleContSVG}
                                        />
                                        <SettingsProductionHeader
                                            pagenumber={3}
                                            explanation={'Selecciona fecha de producción y autopasters de manera automática o manual.'}
                                        />
                                        <View style={[styles.subCont, {justifyContent: 'flex-start'}]}>
                                            <View
                                                style={styles.swicthparent}
                                            >
                                                <Switch
                                                    style={{width: '10%'}}
                                                    trackColor={{false: '#767577', true: '#ffff0080'}}
                                                    thumbColor={isCheckedAutomaticAutopasters ? '#f5dd4b' : '#f4f3f4'}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={handlerCheckAutopasterAutoSelected}
                                                    value={isCheckedAutomaticAutopasters}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Anton',
                                                        color: COLORS.dimgrey,
                                                        fontSize: 13,
                                                        width: '90%'
                                                    }}
                                                >Usar estadísticas de producciones anteriores para elección de
                                                    autopasters.</Text>
                                            </View>
                                            {selectedLinProd && selectedPagination ?
                                                <>
                                                    <View>
                                                        {/*///ENTERA///*/}
                                                        {(errors.customEntera && touched.customEntera) &&
                                                        <Text style={{
                                                            fontSize: 10,
                                                            color: 'red',
                                                            marginLeft: 10
                                                        }}>{errors.customEntera}</Text>
                                                        }
                                                        <RadioButtonComponent
                                                            title={'BOBINA ENTERA'}
                                                            data={autopastersSelectedLineProd}
                                                            keysForData={{
                                                                id: 'autopaster_id',
                                                                value: 'autopaster_id'
                                                            }}
                                                            multipleSelect={true}
                                                            limitSelection={numEnteras}
                                                            initialValueState={areEnteras}
                                                            notSelectable={isMedia}
                                                            _setState={setEnteras}
                                                        />
                                                    </View>
                                                    <View>
                                                        {/*///MEDIA///*/}
                                                        {(errors.customMedia && touched.customMedia) &&
                                                        <Text style={{
                                                            fontSize: 10,
                                                            color: 'red',
                                                            marginLeft: 10
                                                        }}>{errors.customMedia}</Text>
                                                        }
                                                        <RadioButtonComponent
                                                            title={'MEDIA BOBINA'}
                                                            data={autopastersSelectedLineProd}
                                                            keysForData={{
                                                                id: 'autopaster_id',
                                                                value: 'autopaster_id'
                                                            }}
                                                            multipleSelect={false}
                                                            limitSelection={1}
                                                            initialValueState={[isMedia]}
                                                            _setState={setMedia}
                                                        />
                                                    </View>
                                                </>
                                                :
                                                <>
                                                    <Text style={{
                                                        fontSize: 18,
                                                        fontFamily: 'Anton',
                                                        marginTop: 15,
                                                        color: COLORS.primary,
                                                    }}>
                                                        SELECCIÓN DE AUTOPASTERS:
                                                    </Text>
                                                    <View
                                                        style={{
                                                            borderColor: COLORS.buttonEdit,
                                                            borderWidth: 2,
                                                            backgroundColor: COLORS.buttonEdit + '50',
                                                            borderRadius: 5,
                                                            padding: 10,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Anton',
                                                                color: COLORS.dimgrey,
                                                                textAlign: 'center'
                                                            }}
                                                        >Escoge paginación y línea de producción para
                                                            seleccionar
                                                            autopasters.</Text>
                                                    </View>
                                                </>
                                            }
                                        </View>
                                        {!isValid && <BoxError/>
                                        }
                                    </View>
                                    <Footer
                                        backgroundColor={COLORS.success}
                                        leftButtonLabel={"Back"}
                                        leftButtonPress={() => {
                                            handlePageChange(1)
                                        }}
                                        rightButtonLabel="Continue"
                                        rightButtonPress={() => {
                                            navigation.navigate('HomeStack');
                                        }}

                                        buttonChild={() => <TouchableOpacity
                                            style={[styles.touchable, {
                                                alignSelf: 'center',
                                                marginRight: 0,
                                                opacity: !isValid ? .1 : 1
                                            }]}
                                            color="#841584"
                                            accessibilityLabel="calcular resultado de bobina"
                                            onPress={handleSubmit}
                                            title="Submit"
                                            disabled={!isValid}
                                        >
                                            <Text
                                                style={{
                                                    color: COLORS.white,
                                                    fontFamily: 'Anton',
                                                    fontSize: 20
                                                }}>CALCULAR</Text>
                                        </TouchableOpacity>}
                                    />
                                </View>
                            </PagerView>
                        </View>
                    </>
                )}
            </Formik>
            <ToastMesages
                _ref={(toast) => toastRef = toast}
                _style={{backgroundColor: toastColor}}
                _position='bottom'
                _positionValue={400}
                _fadeInDuration={150}
                _fadeOutDuration={3000}
                _opacity={0.8}
                _textStyle={{color: '#000000', fontFamily: 'Anton'}}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    contPrinc: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.white
    },
    subCont: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
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
    swicthparent: {
        paddingLeft: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    contPicker: {
        backgroundColor: COLORS.white,
        width: '100%',
        height: 60,
        padding: 5,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .5,
        borderColor: COLORS.black,
    },
    pickerAbsoluteSpinner: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: 1
    }
});

export default SettingsProductionScreen;

function AbsoluteSpinner() {
    return (
        <View style={styles.pickerAbsoluteSpinner}>
            <ActivityIndicator size="small" color={COLORS.primary}/>
        </View>
    )
}

const BoxError = () => {
    return (
        <View style={{
            margin: 5,
            width: Dimensions.get('window').width - 10,// margin * 2
            padding: 10,
            borderRadius: 5,
            backgroundColor: '#FF000020',
            position: 'absolute',
            bottom: 0,
            borderWidth: 2,
            borderColor: '#FF000070'

        }}>
            <Text style={{color: COLORS.supportBackg1, fontFamily: 'Anton'}}>ERROR:</Text>
            <Text style={{textAlign: 'center', color: COLORS.supportBackg1, fontFamily: 'Anton'}}>Revise errores o
                entradas vacías.</Text>
        </View>
    )
};
