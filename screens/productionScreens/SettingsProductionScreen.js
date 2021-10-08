import React, {useRef, useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Picker,
    Switch,
    Alert, Dimensions
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Footer from '../../components/onboardingComponents/FooterOnboarding';
import {useNavigation} from '@react-navigation/native';
import SettingsProductionHeader from "../../components/headers/SettingsProductionHeader";
import BgComponent from "../../components/BackgroundComponent/BgComponent";
import {
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
import {identifyAutopasters} from "../../utils";
import {genericInsertFunction} from "../../dbCRUD/actionsFunctionsCrud";

const SettingsProductionScreen = () => {

    const navigation = useNavigation();

    let toastRef;
    const showToast = (message) => {
        toastRef.show(message);
    }
    // REFS
    const pagerRef = useRef(null);
    const fullproduction = useRef();

    //BASEDATA STATES
    const [productoDataDB, getProductoDataDB] = useState([]);
    const [lineProdDataDB, getLineProdDataDB] = useState([]);
    const [meditionDataDB, getMeditionDataDB] = useState([]);
    const [autopastersDataDB, getAutopastrsdataDB] = useState([]);

    //STATES FOR INPUT RADIO CUSTOM
    const [isMedia, setMedia] = useState(0);
    const [areEnteras, setEnteras] = useState([]);
    const [numEnteras, setNumEnteras] = useState(0);

    //INPUT VALUES STATES
    const [selectedTirada, getselectedTirada] = useState('');
    const [selectedProduct, getselectedProduct] = useState(0);
    const [selectedPagination, getselectedPagination] = useState(0);
    const [selectedLinProd, getselectedLinProd] = useState(0);
    const [selectedMedition, getselectedMedition] = useState(0);
    const [selectedEditions, getselectedEditions] = useState('');
    const [selectedNulls, getselectedNulls] = useState('');

    //APP states calcAutopasters
    const [autopastersSelectedLineProd, getAutopastersSelectedLineProd] = useState([])
    const [maxPaginationOptionPickerLineSelected, getMaxPaginationOptionPickerLineSelected] = useState([])
    const [isCheckedAutomaticNulls, setCheckedAutomaticNulls] = useState(false);
    const [isCheckedAutomaticSettingsConf, setCheckedAutomaticSettingsConf] = useState(false);

    const [nullCopiesByEdition, setNullCopiesByEdition] = useState(0);
    const [nullCopiesByTiradaPercentage, setNullCopiesByTiradaPercentage] = useState(0);
    const [nullCopiesByTirada, setNullCopiesByTirada] = useState(0);
    const [isCheckedAutomaticEditions, setCheckedAutomaticEditions] = useState(false);
    const [isCheckedAutomaticAutopasters, setCheckedAutomaticAutopasters] = useState(false);

    const [pagenumber, setPagenumber] = useState('1');
    const handlePageChange = pageNumber => {
        pagerRef.current.setPage(pageNumber);
        setPagenumber(pageNumber + 1);
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
        const unsubscribe = navigation.addListener('focus', () => {
            //CODE FOR REFRESH BASEDATA HERE AND PAGES OF PAGEVIEWER
            handlePageChange(0);
            //PRODUCT
            db.transaction(tx => {
                tx.executeSql(
                    picker_producto,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getProductoDataDB(_array);
                        } else {
                            console.log('(Producto_table) Error al conectar base de datos en IndividualCalculation Component');
                        }
                    }
                );
            });
            //PRODUCTION LINE
            db.transaction(tx => {
                tx.executeSql(
                    pickerLinProd,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getLineProdDataDB(_array);
                        } else {
                            console.log('(Producto_table) Error al conectar base de datos en IndividualCalculation Component');
                        }
                    }
                );
            });
            //MEDITION STYLE
            db.transaction(tx => {
                tx.executeSql(
                    picker_medition_style,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getMeditionDataDB(_array);
                        } else {
                            console.log('(Producto_table) Error al conectar base de datos en IndividualCalculation Component');
                        }
                    }
                );
            });

            //AUTOPASTERS
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM autopaster_table',
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getAutopastrsdataDB(_array);
                        } else {
                            console.log('(Producto_table) Error al conectar base de datos en SettingsProductionScreen Component to call autopasters table');
                        }
                    }, () => err => console.log(err)
                );
            });

            getDatas('@NullCopiesData')
                .then(response => {
                    setNullCopiesByEdition(parseInt(response.nullcopiesbyedition));
                    setNullCopiesByTiradaPercentage(parseInt(response.nullcopiesbydefault));
                })
                .catch(() => {
                    showToast("Completa la configuracions de descartes en \"SETTINGS\"...")
                });
        });

        //GET AND SET VALUES FOR AUTOMATICSETTINGSDATA, AUTOMATICSTADISTICS AND ENTER VALUE MANUALLY FOR NULLS.
        if (isCheckedAutomaticSettingsConf) {
            if (!nullCopiesByTiradaPercentage || !nullCopiesByEdition) {
                showToast("Completa la configuracions de descartes en \"SETTINGS\"...")
            } else {
                let nullsByTir = ((parseInt(selectedTirada) * parseInt(nullCopiesByTiradaPercentage)) / 100);
                let nullsByEd = parseInt(nullCopiesByEdition) * parseInt(selectedEditions);
                let totalCalcSettingsNulls = nullsByTir + nullsByEd;

                if (isNaN(nullsByTir)) {
                    if (isNaN(nullsByEd)) nullsByEd = '';
                    getselectedNulls(nullsByEd)
                    setNullCopiesByTirada('¿ ?')
                }
                if (isNaN(nullsByEd)) {
                    getselectedNulls(nullsByTir);
                    setNullCopiesByTirada(nullsByTir)
                }
                if (!isNaN(nullsByTir) && !isNaN(nullsByEd)) {
                    getselectedNulls(totalCalcSettingsNulls)
                    setNullCopiesByTirada(nullsByTir)
                }
            }
        }

        /**
         * WHEN PRODUCTION STATISTICS DATA EXISTS, CREATE LOGIC TO TAKE DATA FOR SELECT AUTOPASTERS AND NULLS. IMPORTANT!!!!
         **/
        //CODE HERE
        console.log('ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt')

        return unsubscribe;
    }, [
        navigation,
        isCheckedAutomaticSettingsConf,
        // selectedTirada,
        nullCopiesByEdition,
        nullCopiesByTiradaPercentage,
        // selectedEditions,
        // selectedLinProd,
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
                        } else {
                            console.log('(Producto_table) Error al conectar base de datos en SettingsProductionScreen Component to call autopasters table');
                        }
                    }, () => err => console.log(err)
                );
            });
        } else {
            console.log('no call autopasters')
        }
    }, [maxPaginationOptionPickerLineSelected, selectedPagination]);

    const groupAuto = (obj) => {
        const [selectedAutopasterswithrolls, getSelectedAutopasterswithrolls] = useState([]);
        const id = obj.id;
        const _enteras = obj.entera.map(item => [id, item, 0]);
        const _media = [id, obj.media, 1];
        if (!obj.media) {
            getSelectedAutopasterswithrolls(_enteras);
        } else {
            getSelectedAutopasterswithrolls([..._enteras, _media]);
        }
        ;
        const gramajeFK = meditionDataDB.filter(item => item.medition_id === selectedMedition).gramaje_fk
        const propietario_fk = productoDataDB.filter(item => item.producto_id === selectedProduct).papel_comun_fk

        selectedAutopasterswithrolls.forEach((item, index) => {
            const searchStatementAutoProdData_Table =
                //change * for bobina_fk and add resto_previsto > 0 and media_defined from autopaster_data_prod table
                // valuate add column is_media in bobina_table
                `SELECT * 
                 FROM autopasters_prod_data
                 INNER JOIN bobina_table ON autopasters_prod_data.bobina_fk = bobina_table.codigo_bobina 
                 WHERE bobina_table.autopaster_fk = 5 AND bobina_table.gramaje_fk = 1 
                 AND bobina_table.papel_comun_fk = 2`
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * autopasters_prod_data",
                    toSendProd,
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            console.log('autopasters_prod_data', _array)
                        } else {
                            console.log('(Producto_table) Error al conectar base de datos en IndividualCalculation Component');
                        }
                    }
                );
            });
        })
    };

    const handlerSendOptionsSelected = (toSendProd, toSendAutopastProd) => {
        const insert_production = "INSERT INTO produccion_table (produccion_id, editions, linea_fk, medition_fk, pagination_fk, producto_fk, tirada, nulls, fecha_produccion) VALUES (?,?,?,?,?,?,?,?,date('now'));"
        const insert_autopast_prod = "INSERT INTO autopasters_prod_data (autopasters_prod_data_id, production_fk, autopaster_fk, media_defined) VALUES (NULL,?,?,?);"
        //SEARCH BOBINAS FUNCTION
        genericInsertFunction(insert_production, toSendProd)
            .then(result => {
                if (result.rowsAffected > 0) {
                    //LOOP INSERT DATA
                    let cont = 0;
                    for (const insert of toSendAutopastProd) {
                        console.log('insert', insert);
                        genericInsertFunction(insert_autopast_prod, insert)
                            .then(result => {
                                if (result.rowsAffected > 0) {
                                    if (cont === toSendAutopastProd.length) showToast('Actualizado con éxito toda la fase', false)
                                } else {
                                    showToast('Error al actualizar')
                                }
                            })
                            .catch(err => {
                                showToast('Error al actualizar')
                                console.log(err)
                            })
                        cont++;
                    }
                } else {
                    showToast('Error al actualizar')
                }
            })
            .catch(err => {
                showToast('Error al actualizar')
                console.log(err)
            })
        // db.transaction(tx => {
        //     tx.executeSql(
        //         "SELECT * autopasters_prod_data",
        //         toSendProd,
        //         (_, {rows: {_array}}) => {
        //             if (_array.length > 0) {
        //                 console.log('autopasters_prod_data', _array)
        //             } else {
        //                 console.log('(Producto_table) Error al conectar base de datos en IndividualCalculation Component');
        //             }
        //         }
        //     );
        // });
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
    }

    const handlerChangeLineProd = (val) => {
        //RESET PAGE STATUS ON CHANGE LINE PRODUCTION VALUES.
        getselectedPagination(0);
        //     //RESET TO INITIAL STATE WHEN cHANGE OPTION SELECTED
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
                    } else {
                        console.log('(Producto_table) Error al conectar base de datos en IndividualCalculation Component');
                    }
                }
            );
        });
    }

    const fullProductionSchema = Yup.object().shape({
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
    }

    return (
        // SafeAreView don't accept padding.
        <SafeAreaView style={{flex: 1}}>
            <Formik
                enableReinitialize
                innerRef={fullproduction}
                initialValues={{
                    tirada: selectedTirada === '' ? selectedTirada : parseInt(selectedTirada),
                    pickerProduct: selectedProduct,
                    pickerPagination: selectedPagination,
                    pickerlinProd: selectedLinProd,
                    pickerMedition: selectedMedition,
                    inputEditions: selectedEditions === '' ? selectedEditions : parseInt(selectedEditions),
                    inputNulls: selectedNulls === '' ? selectedNulls : parseInt(selectedNulls),
                    customEntera: areEnteras,
                    customMedia: isMedia
                }}
                validationSchema={fullProductionSchema}
                onSubmit={values => {
                    // getselectedTirada(parseInt(values.tirada));
                    // getselectedProduct(values.pickerProduct);
                    // getselectedPagination(values.pickerPagination);
                    // getselectedLinProd(values.pickerlinProd);
                    // getselectedMedition(values.pickerMedition);
                    // getselectedEditions(parseInt(values.inputEditions));
                    // getselectedNulls(parseInt(values.inputNulls));


                    const create_id = Date.now();
                    const objectAutopast = {
                        id: create_id,
                        entera: areEnteras,
                        media: isMedia
                    }

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
                    };
                    // console.log('revisar para envío', objectProd)
                    const prod_data = Object.values(objectProd);
                    console.log('revisar para envío', objectProd)
                    const autopast_prod_data = groupAuto(objectAutopast);
                    //TRANSACTION FUNCTION
                    handlerSendOptionsSelected(prod_data, autopast_prod_data)
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
                            <StatusBar
                                animated={true}
                                backgroundColor="#61dafb"
                                barStyle={'light-content'}
                                showHideTransition={'slide'}
                                hidden={true}
                            />
                            <ViewPager style={{flex: 1}}
                                       initialPage={0}
                                       ref={pagerRef}
                                       scrollEnabled={true}
                                       orientation={"horizontal"}
                                       keyboardDismissMode={'none'}
                                       showPageIndicator={true}
                            >
                                <View key="1">
                                    <View style={styles.contPrinc}>
                                        <BgComponent
                                            svgOptions={optionsSVG}
                                            styleOptions={optionsStyleContSVG}
                                        />
                                        <SettingsProductionHeader
                                            pagenumber={pagenumber}
                                            explanation={'Escoge opciones relacionadas con el producto.'}
                                        />
                                        <View style={styles.subCont}>
                                            <View style={{padding: 10}}>
                                                {(errors.pickerlinProd && touched.pickerlinProd) &&
                                                < Text
                                                    style={{
                                                        fontSize: 10,
                                                        color: 'red'
                                                    }}>{errors.pickerlinProd}</Text>
                                                }
                                                <View style={{
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
                                                }}>
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
                                                            mode={'dropdown'}
                                                            selectedValue={values.pickerlinProd}
                                                            // selectedValue={selectedMeasurementMetod}
                                                            onValueChange={(itemValue) => {
                                                                //RESET PAGE STATUS ON CHANGE LINE PRODUCTION VALUES.
                                                                // getselectedPagination(0);
                                                                if (itemValue > 0) {
                                                                    handlerChangeLineProd(itemValue);
                                                                    handleChange('pickerlinProd')
                                                                    setFieldTouched('pickerlinProd', true)
                                                                    setFieldValue('pickerlinProd', itemValue)
                                                                    getselectedLinProd(itemValue)
                                                                } else {
                                                                    showToast("Debes escoger una opción válida...")
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
                                                <View style={{
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
                                                }}>
                                                    <View style={styles.IconStyle}>
                                                        <SvgComponent
                                                            svgData={paginationSVG}
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
                                                            name={'pickerPagination'}
                                                            itemStyle={{fontFamily: 'Anton'}}
                                                            mode={'dropdown'}
                                                            selectedValue={values.pickerPagination}
                                                            // selectedValue={selectedMeasurementMetod}
                                                            onValueChange={(itemValue) => {
                                                                if (itemValue > 0) {
                                                                    handleChange('pickerPagination')
                                                                    setFieldTouched('pickerPagination', true)
                                                                    setFieldValue('pickerPagination', itemValue)
                                                                    //get Value for calc active autopasters before submit
                                                                    getselectedPagination(itemValue)
                                                                } else {
                                                                    showToast("Debes escoger una opción válida...")
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
                                                    style={{fontSize: 10, color: 'red'}}>{errors.pickerProduct}</Text>
                                                }
                                                <View style={{
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
                                                }}>
                                                    <View style={styles.IconStyle}>
                                                        <SvgComponent
                                                            svgData={productoSVG}
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
                                                            name={'pickerProduct'}
                                                            itemStyle={{fontFamily: 'Anton'}}
                                                            mode={'dropdown'}
                                                            selectedValue={values.pickerProduct}
                                                            // selectedValue={selectedMeasurementMetod}
                                                            onValueChange={(itemValue) => {
                                                                if (itemValue > 0) {
                                                                    handleChange('pickerProduct')
                                                                    setFieldTouched('pickerProduct', true)
                                                                    setFieldValue('pickerProduct', itemValue)
                                                                    getselectedProduct(itemValue)
                                                                } else {
                                                                    showToast("Debes escoger una opción válida...")
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
                                                    style={{fontSize: 10, color: 'red'}}>{errors.pickerMedition}</Text>
                                                }
                                                <View style={{
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
                                                }}>
                                                    <View style={styles.IconStyle}>
                                                        <SvgComponent
                                                            svgData={meditionSVG}
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
                                                            name={'pickerMedition'}
                                                            itemStyle={{fontFamily: 'Anton'}}
                                                            mode={'dropdown'}
                                                            selectedValue={values.pickerMedition}
                                                            // selectedValue={selectedMeasurementMetod}
                                                            onValueChange={(itemValue) => {
                                                                if (itemValue > 0) {
                                                                    handleChange('pickerMedition')
                                                                    setFieldTouched('pickerMedition', true)
                                                                    setFieldValue('pickerMedition', itemValue)
                                                                    getselectedMedition(itemValue)
                                                                } else {
                                                                    showToast("Debes escoger una opción válida...")
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
                                <View key="2">
                                    <View style={styles.contPrinc}>
                                        <BgComponent
                                            svgOptions={optionsSVG}
                                            styleOptions={optionsStyleContSVG}
                                        />
                                        <SettingsProductionHeader
                                            pagenumber={pagenumber}
                                            explanation={'Introduce manualmente el número de ejemplares nulos, "descarte de ejemplares (SETTINGS)" o por estadísticas de producción'}
                                        />
                                        <View style={styles.subCont}>
                                            <View style={{marginTop: 10}}>
                                                {(errors.tirada && touched.tirada) &&
                                                < Text
                                                    style={{
                                                        fontSize: 10,
                                                        color: 'red',
                                                        marginLeft: 10
                                                    }}>{errors.tirada}</Text>
                                                }
                                                <CustomTextInput
                                                    // _ref={inputTbrutaRef}
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
                                                style={[styles.swicthparent, {opacity: isCheckedAutomaticNulls ? .2 : 1}]}
                                                // key={item.checkName + '/' + index}
                                            >
                                                <Switch
                                                    style={{width: '10%'}}
                                                    // key={item.checkName}
                                                    trackColor={{false: '#767577', true: '#ffff0080'}}
                                                    thumbColor={isCheckedAutomaticNulls && !isCheckedAutomaticSettingsConf ? '#f4f3f4' : isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf ? '#f5dd4b' : '#f4f3f4'}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={() => setCheckedAutomaticSettingsConf(!isCheckedAutomaticSettingsConf)}
                                                    value={isCheckedAutomaticNulls ? 0 : isCheckedAutomaticSettingsConf}
                                                    // chidren={item.checkName}
                                                    disabled={isCheckedAutomaticNulls}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Anton',
                                                        color: COLORS.dimgrey,
                                                        fontSize: 13,
                                                        width: '90%'
                                                    }}
                                                    // key={item.checkName + index}
                                                >{isCheckedAutomaticSettingsConf ?
                                                    // 'Nulos por Tirada: 1000'
                                                    <>Nulos por tirada: <Text
                                                        style={{color: COLORS.primary}}>{nullCopiesByTirada}</Text> Ejemplares
                                                        ( <Text
                                                            style={{color: COLORS.primary}}>{nullCopiesByTiradaPercentage}%</Text> )</>
                                                    :
                                                    <>Usar valores de descarte de "SETTINGS" para <Text
                                                        style={{color: COLORS.primary}}>tirada</Text></>}
                                                </Text>

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
                                                    // _ref={EdicionesRef}
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
                                                <Text>{values.inputEditions}</Text>
                                            </View>
                                            <View
                                                style={[styles.swicthparent, {opacity: isCheckedAutomaticNulls ? .2 : 1}]}
                                                // key={item.checkName + '/' + index}
                                            >
                                                <Switch
                                                    style={{width: '10%'}}
                                                    // key={item.checkName}
                                                    trackColor={{false: '#767577', true: '#ffff0080'}}
                                                    thumbColor={isCheckedAutomaticNulls && !isCheckedAutomaticSettingsConf ? '#f4f3f4' : isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf ? '#f5dd4b' : '#f4f3f4'}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={() => setCheckedAutomaticSettingsConf(!isCheckedAutomaticSettingsConf)}
                                                    value={isCheckedAutomaticNulls ? 0 : isCheckedAutomaticSettingsConf}
                                                    // chidren={item.checkName}
                                                    disabled={isCheckedAutomaticNulls}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Anton',
                                                        color: COLORS.dimgrey,
                                                        fontSize: 13,
                                                        width: '90%'
                                                    }}
                                                    // key={item.checkName + index}
                                                >{isCheckedAutomaticSettingsConf ?
                                                    // 'Nulos por Tirada: 1000'
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
                                                    // _ref={EdicionesRef}
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
                                                    noEditable={isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf}
                                                    styled={{
                                                        marginBottom: 0,
                                                        backgroundColor: isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf ? COLORS.primary + '50' : COLORS.white
                                                    }}
                                                    inputStyled={{color: isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf ? COLORS.black : COLORS.dimgrey + '90'}}
                                                />
                                                {/*<Text>{selectedNulls}</Text>*/}
                                            </View>
                                            <View
                                                style={[styles.swicthparent, {opacity: isCheckedAutomaticSettingsConf ? .2 : 1}]}
                                                // key={item.checkName + '/' + index}
                                            >
                                                <Switch
                                                    style={{width: '10%'}}
                                                    // key={item.checkName}
                                                    trackColor={{false: '#767577', true: '#ffff0080'}}
                                                    thumbColor={isCheckedAutomaticNulls ? '#f5dd4b' : '#f4f3f4'}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={() => setCheckedAutomaticNulls(!isCheckedAutomaticNulls)}
                                                    value={isCheckedAutomaticNulls}
                                                    // chidren={item.checkName}
                                                    disabled={isCheckedAutomaticSettingsConf}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Anton',
                                                        color: COLORS.dimgrey,
                                                        fontSize: 13,
                                                        width: '90%'
                                                    }}
                                                    // key={item.checkName + index}
                                                >Usar estadísticas de producciones anteriores para calcular ejemplares
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
                                <View key="3">
                                    <View style={styles.contPrinc}>
                                        <BgComponent
                                            svgOptions={optionsSVG}
                                            styleOptions={optionsStyleContSVG}
                                        />
                                        <SettingsProductionHeader
                                            pagenumber={pagenumber}
                                            explanation={'Selecciona fecha de producción y autopasters de manera automática o manual.'}
                                        />
                                        <View style={[styles.subCont, {justifyContent: 'flex-start'}]}>
                                            {/*//form here*/}
                                            <View
                                                style={[styles.swicthparent]}
                                                // key={item.checkName + '/' + index}
                                            >
                                                <Switch
                                                    style={{width: '10%'}}
                                                    // key={item.checkName}
                                                    trackColor={{false: '#767577', true: '#ffff0080'}}
                                                    thumbColor={isCheckedAutomaticAutopasters ? '#f5dd4b' : '#f4f3f4'}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={() => setCheckedAutomaticAutopasters(!isCheckedAutomaticAutopasters)}
                                                    value={isCheckedAutomaticAutopasters}
                                                    // chidren={item.checkName}
                                                    // disabled={!isCheckedAutomaticAutopasters}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Anton',
                                                        color: COLORS.dimgrey,
                                                        fontSize: 13,
                                                        width: '90%'
                                                    }}
                                                    // key={item.checkName + index}
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
                                                                id: 'name_autopaster',
                                                                value: 'autopaster_id'
                                                            }}
                                                            multipleSelect={true}
                                                            limitSelection={numEnteras}
                                                            initialValueState={areEnteras}
                                                            notSelectable={isMedia}
                                                            _setState={setEnteras}
                                                            // name={'customEntera'}
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
                                                                id: 'name_autopaster',
                                                                value: 'autopaster_id'
                                                            }}
                                                            multipleSelect={false}
                                                            limitSelection={1}
                                                            initialValueState={[isMedia]}
                                                            _setState={setMedia}
                                                            // name={'customMedia'}
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
                                                        >Escoge paginación y línea de producción para seleccionar
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
                                            // onPress={() => coeficienteSearch(values.inputRadio)}
                                            // onPress={() => Alert.alert(values.inputRadio)}
                                            // title="CALCULAR"
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
                            </ViewPager>
                        </View>
                    </>
                )}
            </Formik>
            <ToastMesages
                _ref={(toast) => toastRef = toast}
                _style={{backgroundColor: '#FF0000'}}
                _position='bottom'
                _positionValue={400}
                _fadeInDuration={150}
                _fadeOutDuration={3000}
                _opacity={0.8}
                _textStyle={{color: '#FFFFFF', fontFamily: 'Anton'}}
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
    selfLeft: {
        // alignSelf: 'start'
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
    }
});

export default SettingsProductionScreen;
