import React, {useRef, useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Picker,
    ImageBackground,
    Switch,
    Dimensions,
    CheckBox
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Footer from '../../components/onboardingComponents/FooterOnboarding';
// import Page from '../../components/onboardingComponents/Page';
import {useNavigation} from '@react-navigation/native';
import SettingsProductionHeader from "../../components/headers/SettingsProductionHeader";
import BgComponent from "../../components/BackgroundComponent/BgComponent";
import {
    edicionesSVG,
    lineaprodSVG,
    logo,
    meditionSVG,
    nombre,
    paginationSVG,
    productoSVG,
    tirada2SVG
} from "../../assets/svg/svgContents";
import {COLORS} from "../../assets/defaults/settingStyles";
import ViewPagerOne from "../../components/ViewpagerProduction/ViewpagerOne";
import {Formik} from "formik";
import * as Yup from "yup";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import SvgComponent from "../../components/SvgComponent";
import CustomPicker from "../../components/FormComponents/CustomPicker";
import {
    autopasterByID, getAutopasterByLineaID,
    picker_gramaje,
    picker_medition_style,
    picker_pagination,
    picker_producto,
    pickerLinProd
} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import ToastMesages from "../../components/ToastMessages";
import {getDatas, storeData} from "../../data/AsyncStorageFunctions";

const SettingsProductionScreen = () => {

    const windowWidth = Dimensions.get('window').width;

    let toastRef;
    const showToast = (message) => {
        toastRef.show(message);
    }
    // REFS
    const pagerRef = useRef(null);
    const fullproduction = useRef();

    //BASEDATA STATES
    const [productoDataDB, getProductoDataDB] = useState([]);
    const [paginationDataDB, getPaginationDataDB] = useState([]);
    const [lineProdDataDB, getLineProdDataDB] = useState([]);
    const [gramajeDataDB, getGramajeDataDB] = useState([]);
    const [meditionDataDB, getMeditionDataDB] = useState([]);
    const [autopastersDataDB, getAutopastrsdataDB] = useState([]);

    //INPUT VALUES STATES
    const [selectedPortada, getselectedPortada] = useState(0)

    const [selectedTirada, getselectedTirada] = useState('');
    const [selectedProduct, getselectedProduct] = useState(0);
    const [selectedPagination, getselectedPagination] = useState(0);
    const [selectedLinProd, getselectedLinProd] = useState(0);
    const [selectedGramaje, getselectedGramaje] = useState(0);
    const [selectedMedition, getselectedMedition] = useState(0);
    const [selectedEditions, getselectedEditions] = useState('');
    const [selectedNulls, getselectedNulls] = useState('');

    //APP states calcAutopasters
    const [isCheckedAutomaticNulls, setCheckedAutomaticNulls] = useState(false);
    const [isCheckedAutomaticSettingsConf, setCheckedAutomaticSettingsConf] = useState(false);
    const [nullCopiesByEdition, setNullCopiesByEdition] = useState(0);
    const [nullCopiesByTiradaPercentage, setNullCopiesByTiradaPercentage] = useState(0);
    const [nullCopiesByTirada, setNullCopiesByTirada] = useState(0);
    const [isCheckedAutomaticEditions, setCheckedAutomaticEditions] = useState(false);
    const [isCheckedAutomaticAutopasters, setCheckedAutomaticAutopasters] = useState(false);
    const [visibleAutopasters, setVisibleAutopasters] = useState(false);
    const [selectedPaginationValue, getSelectedPaginationValue] = useState('');
    const navigation = useNavigation();
    const [pagenumber, setPagenumber] = useState('1')
    const handlePageChange = pageNumber => {
        pagerRef.current.setPage(pageNumber);
        setPagenumber(pageNumber + 1);
    };
    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: logo, svgWidth: '100%', svgHeight: '100%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: 0, right: 0, opacity: .05
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
            //PAGINATION
            db.transaction(tx => {
                tx.executeSql(
                    picker_pagination,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getPaginationDataDB(_array);
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
            //GRAMAJE
            db.transaction(tx => {
                tx.executeSql(
                    picker_gramaje,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getGramajeDataDB(_array);
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

            getDatas('@NullCopiesData')
                .then(response => {
                    setNullCopiesByEdition(parseInt(response.nullcopiesbyedition));
                    setNullCopiesByTiradaPercentage(parseInt(response.nullcopiesbydefault));
                })
                .catch(err => {
                    showToast("Completa la configuracions de descartes en \"SETTINGS\"...")
                });
        });
        if (selectedLinProd) {
            console.log('param autopaster line', selectedLinProd)
            db.transaction(tx => {
                tx.executeSql(
                    getAutopasterByLineaID,
                    [selectedLinProd],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            console.log('render get autopasters');
                            getAutopastrsdataDB(_array);
                        } else {
                            console.log('(Producto_table) Error al conectar base de datos en SettingsProductionScreen Component to call autopasters table');
                        }
                    }, () => err => console.log(err)
                );
            });
        } else {
            console.log('no call autopasters')
        }

        //GET PAGINATION VALUE FOR CALC NUMBER OF AUTOPASTERS.
        if (selectedPagination > 0) {
            const valuePagination = paginationDataDB.filter(item => item.paginacion_id === selectedPagination);
            getSelectedPaginationValue(valuePagination[0].paginacion_value);
            console.log('pagination', valuePagination[0].paginacion_value / 16)
        }

        //GET AND SET VALUES FOR AUTOMATICSETTINGSDATA, AUTOMATICSTADISTICS AND ENTER VALUE MANUALLY FOR NULLS.
        if (isCheckedAutomaticSettingsConf) {
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
        } else {
            getselectedNulls('')
        }

        /**
         * WHEN PRODUCTION STATISTICS DATA EXISTS, CREATE LOGIC TO TAKE DATA FOR SELECT AUTOPASTERS AND NULLS. IMPORTANT!!!!
         **/
        //CODE HERE

        return unsubscribe;
    }, [
        navigation,
        selectedPagination,
        selectedNulls,
        isCheckedAutomaticSettingsConf,
        selectedTirada,
        nullCopiesByEdition,
        nullCopiesByTiradaPercentage,
        selectedEditions,
        selectedLinProd
    ]);

    const fullProductionSchema = Yup.object().shape({
        tirada: FormYupSchemas.tirada,
        pickerProduct: FormYupSchemas.pickerProducto,
        pickerPagination: FormYupSchemas.pickerProducto,
        pickerlinProd: FormYupSchemas.pickerProducto,
        pickerGramaje: FormYupSchemas.pickerProducto,
        pickerMedition: FormYupSchemas.pickerProducto,
        inputEditions: FormYupSchemas.editions,
        inputNulls: FormYupSchemas.inputTirBruta,
    });


    return (
        // SafeAreView don't accept padding.
        <SafeAreaView style={{flex: 1}}>
            <Formik
                enableReinitialize
                innerRef={fullproduction}
                initialValues={{
                    tirada: selectedTirada,
                    pickerProduct: selectedProduct,
                    pickerPagination: selectedPagination,
                    pickerlinProd: selectedLinProd,
                    pickerGramaje: selectedGramaje,
                    pickerMedition: selectedMedition,
                    inputEditions: selectedEditions,
                    inputNulls: selectedNulls,
                }}
                validationSchema={fullProductionSchema}
                onSubmit={values => {
                    getselectedTirada(parseInt(values.tirada));
                    getselectedProduct(values.pickerProduct);
                    getselectedPagination(values.pickerPagination);
                    getselectedLinProd(values.pickerlinProd);
                    getselectedGramaje(values.pickerGramaje);
                    getselectedMedition(values.pickerMedition);
                    getselectedEditions(values.inputEditions);
                    getselectedNulls(values.inputNulls);
                    const myObject = {
                        tirada: values.tirada,
                        producto: values.pickerProduct,
                        pagination: values.pickerPagination,
                        linea: values.pickerlinProd,
                        gramaje: values.pickerGramaje,
                        medicion: values.pickerMedition,
                        editions: values.inputEditions,
                        nulls: values.inputNulls
                    }
                    console.log('objeto para envío', myObject)
                    // getselectedEditions(parseInt(values.editions));
                    // const measurementval = measuramentDataDB.filter(item => item.medition_id === values.meditionType);
                    // getValueMeasurementMetod(measurementval);
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
                                        {/*<ViewPagerOne*/}
                                        {/*    stylesContPrinc={styles.subCont}*/}
                                        {/*/>*/}
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
                                                                if (itemValue > 0) {
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
                                                < Text
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
                                                                paginationDataDB.map((item, index) => {
                                                                    return <Picker.Item key={index}
                                                                                        label={' ' + item.paginacion_value}
                                                                                        value={item.paginacion_id}/>
                                                                })
                                                            }
                                                            defaultItemLabel={'Escoge paginación...'}
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
                                                            svgData={nombre}
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
                                                {(errors.pickerGramaje && touched.pickerGramaje) &&
                                                < Text
                                                    style={{fontSize: 10, color: 'red'}}>{errors.pickerGramaje}</Text>
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
                                                            name={'pickerGramaje'}
                                                            itemStyle={{fontFamily: 'Anton'}}
                                                            mode={'dropdown'}
                                                            selectedValue={values.pickerGramaje}
                                                            // selectedValue={selectedMeasurementMetod}
                                                            onValueChange={(itemValue) => {
                                                                if (itemValue > 0) {
                                                                    handleChange('pickerGramaje')
                                                                    setFieldTouched('pickerGramaje', true)
                                                                    setFieldValue('pickerGramaje', itemValue)
                                                                    getselectedGramaje(itemValue)
                                                                } else {
                                                                    showToast("Debes escoger una opción válida...")
                                                                }
                                                            }}
                                                            dataOptionsPicker={
                                                                gramajeDataDB.map((item, index) => {
                                                                    return <Picker.Item key={index}
                                                                                        label={' ' + item.gramaje_value}
                                                                                        value={item.gramaje_id}/>
                                                                })
                                                            }
                                                            defaultItemLabel={'Escoge gramaje...'}
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
                                                    _onBlur={() => {
                                                        handleBlur('tirada');
                                                        getselectedTirada(values.tirada)
                                                    }}
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
                                                    _onBlur={() => {
                                                        getselectedEditions(values.inputEditions)
                                                        handleBlur('inputEditions')
                                                    }}
                                                    value={values.editions}
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
                                                    svgData={edicionesSVG}
                                                    svgWidth={50}
                                                    svgHeight={50}
                                                    placeholder={'Ejemplares "nulos"...'}
                                                    text={'Ejemplares nulos'}
                                                    type={'numeric'}
                                                    _name={'inputNulls'}
                                                    _onChangeText={handleChange('inputNulls')}
                                                    _onBlur={handleBlur('inputNulls')}
                                                    value={values.inputNulls}
                                                    _defaultValue={selectedNulls.toString()}
                                                    noEditable={isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf}
                                                    styled={{
                                                        marginBottom: 0,
                                                        backgroundColor: isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf ? COLORS.primary + '50' : COLORS.white
                                                    }}
                                                    inputStyled={{color: isCheckedAutomaticNulls || isCheckedAutomaticSettingsConf ? COLORS.black : COLORS.dimgrey + '90'}}
                                                />
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
                                            <TouchableOpacity
                                                style={[styles.touchable, {
                                                    alignSelf: 'center',
                                                    margin: 5,
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
                                            </TouchableOpacity>
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
                                            explanation={'Texto explicativo para rellenar campos de configuración.'}
                                        />
                                        <View style={styles.subCont}>
                                            {/*//form here*/}
                                            <View
                                                style={[styles.swicthparent, {opacity: isCheckedAutomaticSettingsConf ? .2 : 1}]}
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
                                            {
                                                autopastersDataDB.length > 0 ?
                                                    autopastersDataDB.map((item, index) => {
                                                        return <Text
                                                            key={index}>{item.name_autopaster}: {item.linea_fk}</Text>
                                                    })
                                                    :
                                                    <Text>no hay autopasters</Text>
                                            }
                                        </View>
                                    </View>
                                    <Footer
                                        backgroundColor={COLORS.success}
                                        leftButtonLabel="Back"
                                        leftButtonPress={() => {
                                            handlePageChange(1);
                                        }}
                                        rightButtonLabel="Continue"
                                        rightButtonPress={() => {
                                            navigation.navigate('HomeStack');
                                        }}
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
