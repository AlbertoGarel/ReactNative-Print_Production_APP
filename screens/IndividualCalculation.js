import React, {useState, useEffect, useRef} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Picker,
    ImageBackground,
    Keyboard
} from 'react-native';
import CustomTextInput from "../components/FormComponents/CustomTextInput";
import {paginationSVG, meditionSVG, radio, peso, tirada2SVG, edicionesSVG, productoSVG} from '../assets/svg/svgContents';
import SvgComponent from "../components/SvgComponent";
import {COLORS} from "../assets/defaults/settingStyles";
import MultipleSwitchSelector from "../components/MultipleSwitchSelector";
import * as SQLite from "expo-sqlite";
import {picker_medition_style, coeficienteSearchValue, picker_pagination, picker_producto} from '../dbCRUD/actionsSQL';
import {Formik} from 'formik';
import ResetButtonForm from "../components/FormComponents/ResetButtonForm";
import ToastMesages from "../components/ToastMessages";
import {FormYupSchemas} from '../components/FormComponents/YupSchemas';
import * as Yup from "yup";
import CustomPicker from "../components/FormComponents/CustomPicker";


const IndividualCalculation = () => {
    const db = SQLite.openDatabase('bobinas.db');
    const elementPrevProdctionformikRef = useRef();
    const tiradaRef = useRef();
    const EdicionesRef = useRef();
    const meditionStyleRef = useRef();
    const elementCalcBobinaFormikRef = useRef();
    const inputWeightRef = useRef();
    const inputRadioRef = useRef();
    const elementCalTotalproductionFormikRef = useRef();
    const paginationRef = useRef();
    const ProductoRef = useRef();
    const inputTbrutaRef = useRef();

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    let renderedfunction = '';

    const result = 0;
    const brutoResult = 0;
    const productResult = 500;
    const [measuramentDataDB, getMeasurementDataDB] = useState([]);

    // VALUES OF elementPrevProdction()
    const [selectedTirada, getselectedTirada] = useState('');
    const [selectedEditions, getselectedEditions] = useState('');
    // const [selectedMeasurementMetodID, setMeasurementMetodID] = useState('');
    const [selectedValueMeasurementMetod, getValueMeasurementMetod] = useState(0);

    //VALUES of elementCalcBobina()
    const [selectedInputWeigth, getSelectedInputWeigth] = useState('');
    const [selectedInputRadio, getSelectedInputRadio] = useState('');
    const [resultElementCalcBobina, setResultElementCalcBobina] = useState(0);

    //elementCalcBobina()
    const coeficienteSearch = (val) => {
        const round = Math.round(val)
        db.transaction(tx => {
            tx.executeSql(
                coeficienteSearchValue,
                [round],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        getSelectedInputRadio(_array[0].coeficiente_value);
                    } else {
                        console.log('(elementCalcBobina)Error al conectar base de datos en IndividualCalculation Component');
                    }
                }
            );
        });
    };
    //elementCalTotalproduction()
    const [paginacionDataDB, getPaginationDataDB] = useState([]);
    // const [selectedPaginationID, getSelectedPaginationID] = useState('');
    const [selectedValuePaginacion, getSelectedPagination] = useState(0);
    const [productoDataDB, getProductoDataDB] = useState([]);
    // const [selectedProductoID, getSelectedProductoID] = useState('');
    const [selectedValueProduct, getSelectedvalueProduct] = useState(0);
    const [selectedTiradaBruta, getSelectedTiradaBruta] = useState('');
    const [resultElementCalTotalproduction, setResultElementCalTotalproduction] = useState(0);

    const switchValues = [
        {label: 'Prevision de kilogramos', value: 1},
        {label: 'Bobina', value: 2},
        {label: 'Total producción', value: 3}
    ];

    const [switchValue, setSwitchValue] = useState(switchValues[0].value);
    const getMultipleSwitchValue = (val) => {
        setSwitchValue(val);
    };

    useEffect(() => {
        let isActive = true;

        //elementPrevProdction()
        db.transaction(tx => {
            tx.executeSql(
                picker_medition_style,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        getMeasurementDataDB(_array);
                    } else {
                        console.log('Error al conectar base de datos en IndividualCalculation Component');
                    }
                }
            );
        });
        //elementCalTotalproduction() pagination_table
        db.transaction(tx => {
            tx.executeSql(
                picker_pagination,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        getPaginationDataDB(_array);
                    } else {
                        console.log('Error al conectar base de datos en IndividualCalculation Component');
                    }
                }
            );
        });
        //elementCalTotalproduction() producto_table
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

        return () => {
            isActive = false;
        };
    }, []);

    //RESET BUTTON
    const resetState_elementPrevProdction = () => {
        switch (switchValue) {
            case 1://elementPrevProdction()
                //reset states
                getselectedTirada('');
                getselectedEditions('');
                // getValueMeasurementMetod(0);
                //reset to initial values
                elementPrevProdctionformikRef.current?.resetForm();
                //clear ref inputs
                tiradaRef.current.clear();
                EdicionesRef.current.clear();
                // setMeasurementMetodID(0)//empty for error display
                // getValueMeasurementMetod(0)
                // meditionStyleRef.current.value = 0;
                // console.log(meditionStyleRef.current.value)
                break;
            case 2:
                getSelectedInputWeigth('');
                getSelectedInputRadio('');
                setResultElementCalcBobina(0);
                elementCalcBobinaFormikRef.current?.resetForm();
                inputWeightRef.current.clear();
                inputRadioRef.current.clear();
                break;
            case 3:
                // getSelectedPaginationID(0);
                // getSelectedProductoID(0);
                getSelectedTiradaBruta('');
                setResultElementCalTotalproduction(0);
                elementCalTotalproductionFormikRef.current?.resetForm();
                inputTbrutaRef.current.clear();
                break;
            default:
                return null;
        }
    };

    const SchemaElementPrevProduction = Yup.object().shape({
        tirada: FormYupSchemas.tirada,
        editions: FormYupSchemas.editions,
        meditionType: FormYupSchemas.meditionType
    });

    const SchemaElementCalcBobina = Yup.object().shape({
        inputWeigth: FormYupSchemas.inputWeigth,
        inputRadio: FormYupSchemas.inputRadio
    });
    const SchemaElementCalTotalproduction = Yup.object().shape({
        inputTirBruta: FormYupSchemas.inputTirBruta,
        pickerPagination: FormYupSchemas.pickerPagination,
        pickerProducto: FormYupSchemas.pickerProducto
    })

    let toastRef;
    const showToast = (message) => {
        toastRef.show(message);
    }

    const elementPrevProdction = () => {
        renderedfunction = 'elementPrevProdction';
        return (
            <>
                <View style={styles.contTitle}>
                    <Text style={styles.titles}>PREVISION KG PRODUCCIÓN</Text>
                </View>
                <Formik
                    innerRef={elementPrevProdctionformikRef}
                    initialValues={{
                        tirada: selectedTirada,
                        editions: selectedEditions,
                        meditionType: selectedValueMeasurementMetod,
                    }}
                    validationSchema={SchemaElementPrevProduction}
                    onSubmit={values => {
                        getselectedTirada(parseInt(values.tirada));
                        getselectedEditions(parseInt(values.editions));
                        const measurementval = measuramentDataDB.filter(item => item.medition_id === values.meditionType);
                        getValueMeasurementMetod(measurementval);
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
                            <View style={{padding: 10}}>
                                {(errors.meditionType && touched.meditionType) &&
                                < Text style={{fontSize: 10, color: 'red'}}>{errors.meditionType}</Text>
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
                                            ref={meditionStyleRef}
                                            style={{
                                                borderWidth: .5,
                                                borderColor: COLORS.black,
                                            }}
                                            name={'meditionType'}
                                            itemStyle={{fontFamily: 'Anton'}}
                                            mode={'dropdown'}
                                            value={values.meditionType}
                                            selectedValue={values.meditionType}
                                            onValueChange={(itemValue) => {
                                                if (itemValue > 0) {
                                                    handleChange('meditionType')
                                                    setFieldTouched('meditionType', true)
                                                    setFieldValue('meditionType', itemValue)
                                                } else {
                                                    showToast("Debes escoger una opción válida...")
                                                }
                                            }}
                                            dataOptionsPicker={measuramentDataDB.map((item, index) => {
                                                return <Picker.Item key={index}
                                                                    label={'medición ' + item.medition_type + ' / ' + item.gramaje_value + 'g.'}
                                                                    value={item.medition_id}/>
                                            })}
                                            defaultItemLabel={'Escoge estilo de medición'}
                                        />
                                        {/*<Picker*/}
                                        {/*    ref={meditionStyleRef}*/}
                                        {/*    style={{*/}
                                        {/*        borderWidth: .5,*/}
                                        {/*        borderColor: COLORS.black,*/}
                                        {/*    }}*/}
                                        {/*    name={'meditionType'}*/}
                                        {/*    itemStyle={{fontFamily: 'Anton'}}*/}
                                        {/*    mode={'dropdown'}*/}
                                        {/*    value={values.meditionType}*/}
                                        {/*    selectedValue={values.meditionType}*/}
                                        {/*    onValueChange={(itemValue) => {*/}
                                        {/*        if (itemValue > 0) {*/}
                                        {/*            handleChange('meditionType')*/}
                                        {/*            setFieldTouched('meditionType', true)*/}
                                        {/*            setFieldValue('meditionType', itemValue)*/}
                                        {/*        } else {*/}
                                        {/*            showToast("Debes escoger una opción válida...")*/}
                                        {/*        }*/}
                                        {/*    }}*/}
                                        {/*>*/}
                                        {/*    <Picker.Item label="Elige un tipo de medición" value={0}*/}
                                        {/*                 selected*/}
                                        {/*                 fontFamily={'Anton'}*/}
                                        {/*                 color={COLORS.primary}*/}
                                        {/*    />*/}
                                        {/*    {*/}
                                        {/*        measuramentDataDB.length > 0 ?*/}
                                        {/*            measuramentDataDB.map((item, index) => {*/}
                                        {/*                return <Picker.Item key={index}*/}
                                        {/*                                    label={'medición ' + item.medition_type + ' / ' + item.gramaje_value + 'g.'}*/}
                                        {/*                                    value={item.medition_id}/>*/}
                                        {/*            })*/}
                                        {/*            :*/}
                                        {/*            <Picker.Item label="No existen datos" value={null}/>*/}
                                        {/*    }*/}
                                        {/*</Picker>*/}
                                    </View>
                                </View>
                            </View>
                            {(errors.tirada && touched.tirada) &&
                            < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.tirada}</Text>
                            }
                            <CustomTextInput
                                _ref={tiradaRef}
                                svgData={tirada2SVG}
                                svgWidth={50}
                                svgHeight={50}
                                placeholder={'Número de ejemplares...'}
                                text={'Tirada prevista'}
                                type={'numeric'}
                                _name={'tirada'}
                                _onChangeText={handleChange('tirada')}
                                _onBlur={handleBlur('tirada')}
                                value={values.tirada}
                            />
                            {(errors.editions && touched.editions) &&
                            <Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.editions}</Text>
                            }
                            <CustomTextInput
                                _ref={EdicionesRef}
                                svgData={edicionesSVG}
                                svgWidth={50}
                                svgHeight={50}
                                placeholder={'Número de ediciones...'}
                                text={'Ediciones'}
                                type={'numeric'}
                                styled={{marginBottom: 0}}
                                _name={'editions'}
                                _onChangeText={handleChange('editions')}
                                _onBlur={handleBlur('editions')}
                                value={values.editions}
                            />
                            <Text style={{fontSize: 12, color: 'red', marginLeft: 20, margin: 0}}>* +500 ejemplares por
                                tirada</Text>
                            <TouchableOpacity
                                style={[styles.touchable, {alignSelf: 'center', margin: 5, opacity: !isValid ? .1 : 1}]}
                                color="#841584"
                                accessibilityLabel="calcular resultado de bobina"
                                onPress={handleSubmit}
                                title="Submit"
                                disabled={!isValid}
                            >
                                <Text style={{color: COLORS.white, fontFamily: 'Anton', fontSize: 20}}>CALCULAR</Text>
                            </TouchableOpacity>
                            <View style={styles.results}>
                                <View
                                    style={{
                                        width: 150,
                                        height: 50,
                                        backgroundColor: COLORS.white,
                                        borderRadius: 5,
                                        padding: 10,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <Text style={{fontSize: 16, color: COLORS.primary}}>
                                        Entera:
                                    </Text>
                                    <Text style={{fontSize: 16}}>
                                        {selectedTirada &&
                                        selectedEditions &&
                                        selectedValueMeasurementMetod ?
                                            Math.round((selectedTirada + (500 * selectedEditions)) * selectedValueMeasurementMetod[0].full_value)
                                            :
                                            0} Kg
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        width: 150,
                                        height: 50,
                                        backgroundColor: COLORS.white,
                                        borderRadius: 5,
                                        padding: 10,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <Text style={{fontSize: 16, color: COLORS.primary}}>
                                        Media:
                                    </Text>
                                    <Text style={{fontSize: 16}}>
                                        {selectedTirada &&
                                        selectedEditions &&
                                        selectedValueMeasurementMetod ?
                                            Math.round((selectedTirada + (500 * selectedEditions)) * selectedValueMeasurementMetod[0].media_value)
                                            :
                                            0} Kg
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </Formik>
            </>
        );
    };

    const elementCalcBobina = () => {
        return (
            <>
                <View style={styles.contTitle}>
                    <Text style={styles.titles}>RESTO DE BOBINA</Text>
                </View>
                <Formik
                    innerRef={elementCalcBobinaFormikRef}
                    initialValues={{
                        inputWeigth: '',
                        inputRadio: ''
                    }}
                    validationSchema={SchemaElementCalcBobina}
                    onSubmit={values => {
                        getSelectedInputWeigth(parseInt(values.inputWeigth));
                        coeficienteSearch(parseInt(values.inputRadio));
                        setResultElementCalcBobina(parseInt(values.inputWeigth) * parseInt(values.inputRadio))
                    }}
                >
                    {({
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          values,
                          errors,
                          touched,
                          isValid
                      }) => (
                        <>
                            <View style={{paddingTop: 10}}>
                                {(errors.inputWeigth && touched.inputWeigth) &&
                                < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.inputWeigth}</Text>
                                }
                                <CustomTextInput
                                    _ref={inputWeightRef}
                                    svgData={peso}
                                    svgWidth={45}
                                    svgHeight={45}
                                    placeholder={'Peso en kg...'}
                                    text={'Peso de la bobina completa:'}
                                    type={'numeric'}
                                    _name={'inputWeigth'}
                                    _onChangeText={handleChange('inputWeigth')}
                                    _onBlur={handleBlur('inputWeigth')}
                                    value={values.inputWeigth}
                                />
                            </View>
                            <View>
                                {(errors.inputRadio && touched.inputRadio) &&
                                < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.inputRadio}</Text>
                                }
                                <CustomTextInput
                                    _ref={inputRadioRef}
                                    svgData={radio}
                                    svgWidth={45}
                                    svgHeight={45}
                                    placeholder={'Radio en cm...'}
                                    text={'Radio actual de la bobina:'}
                                    type={'numeric'}
                                    _name={'inputRadio'}
                                    _onChangeText={handleChange('inputRadio')}
                                    _onBlur={handleBlur('inputRadio')}
                                    value={values.inputRadio}
                                />
                            </View>
                            <View style={styles.results}>
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
                                        style={{color: COLORS.white, fontFamily: 'Anton', fontSize: 20}}>CALCULAR</Text>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        width: 150,
                                        height: 50,
                                        backgroundColor: COLORS.white,
                                        borderRadius: 5,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{fontSize: 16}}>
                                        {
                                            !isNaN(resultElementCalcBobina) ?
                                                Math.round(selectedInputRadio * selectedInputWeigth) + ' Kg'
                                                :
                                                'Error'
                                        }
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </Formik>
            </>
        );
    };

    const elementCalTotalproduction = () => {
        return (
            <>
                <View style={styles.contTitle}>
                    <Text style={styles.titles}>total de producción</Text>
                </View>
                <Formik
                    innerRef={elementCalTotalproductionFormikRef}
                    initialValues={{
                        pickerPagination: selectedValuePaginacion,
                        pickerProducto: selectedValueProduct,
                        inputTirBruta: selectedTiradaBruta,
                    }}
                    validationSchema={SchemaElementCalTotalproduction}
                    onSubmit={values => {
                        const valuePag = paginacionDataDB.filter(item => item.paginacion_id === values.pickerPagination);
                        getSelectedPagination(parseInt(valuePag[0].paginacion_value));
                        const valueProd = productoDataDB.filter(item => item.producto_id === values.pickerProducto);
                        getSelectedvalueProduct(parseInt(valueProd[0].kba_value));
                        getSelectedTiradaBruta(parseInt(values.inputTirBruta))
                        console.log('pag ', valuePag[0].paginacion_value + '/ prod ' + valueProd[0].kba_value + ' / Tbruta ' + values.inputTirBruta)
                        setResultElementCalTotalproduction(valuePag[0].paginacion_value * values.inputTirBruta * valueProd[0].kba_value)
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
                          setFieldTouched,
                          setFieldValue
                      }) => (
                        <>
                            <View style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                                {(errors.pickerPagination && touched.pickerPagination) &&
                                < Text style={{
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
                                            ref={paginationRef}
                                            style={{
                                                borderWidth: .5,
                                                borderColor: COLORS.black,
                                            }}
                                            name={'pickerPagination'}
                                            itemStyle={{fontFamily: 'Anton'}}
                                            mode={'dropdown'}
                                            selectedValue={values.pickerPagination}
                                            onValueChange={(itemValue) => {
                                                if (itemValue > 0) {
                                                    handleChange('pickerPagination')
                                                    setFieldTouched('pickerPagination', true)
                                                    setFieldValue('pickerPagination', itemValue)
                                                } else {
                                                    showToast("Debes escoger una opción válida...")
                                                }
                                            }}
                                            dataOptionsPicker={
                                                paginacionDataDB.map((item, index) => {
                                                    return <Picker.Item key={index}
                                                                        label={' ' + item.paginacion_value}
                                                                        value={item.paginacion_id}/>
                                                })
                                            }
                                            defaultItemLabel={'Escoge una paginación'}
                                        />
                                        {/*<Picker*/}
                                        {/*    ref={paginationRef}*/}
                                        {/*    style={{*/}
                                        {/*        borderWidth: .5,*/}
                                        {/*        borderColor: COLORS.black,*/}
                                        {/*    }}*/}
                                        {/*    name={'pickerPagination'}*/}
                                        {/*    itemStyle={{fontFamily: 'Anton'}}*/}
                                        {/*    mode={'dropdown'}*/}
                                        {/*    selectedValue={values.pickerPagination}*/}
                                        {/*    onValueChange={(itemValue) => {*/}
                                        {/*        if (itemValue > 0) {*/}
                                        {/*            handleChange('pickerPagination')*/}
                                        {/*            setFieldTouched('pickerPagination', true)*/}
                                        {/*            setFieldValue('pickerPagination', itemValue)*/}
                                        {/*        } else {*/}
                                        {/*            showToast("Debes escoger una opción válida...")*/}
                                        {/*        }*/}
                                        {/*    }}*/}

                                        {/*>*/}
                                        {/*    <Picker.Item label="Elige valor de paginación..." value={0}*/}
                                        {/*                 style={{fontFamily: 'Anton'}}*/}
                                        {/*                 selected*/}
                                        {/*    />*/}
                                        {/*    {paginacionDataDB.length > 0 ?*/}
                                        {/*        paginacionDataDB.map((item, index) => {*/}
                                        {/*            return <Picker.Item key={index}*/}
                                        {/*                                label={' ' + item.paginacion_value}*/}
                                        {/*                                value={item.paginacion_id}/>*/}
                                        {/*        })*/}
                                        {/*        :*/}
                                        {/*        <Picker.Item label="No existen datos" value={null}/>*/}
                                        {/*    }*/}
                                        {/*</Picker>*/}
                                    </View>
                                </View>
                            </View>
                            <View style={{padding: 10}}>
                                {(errors.pickerProducto && touched.pickerProducto) &&
                                < Text
                                    style={{fontSize: 10, color: 'red'}}>{errors.pickerProducto}</Text>
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
                                            ref={ProductoRef}
                                            style={{
                                                borderWidth: .5,
                                                borderColor: COLORS.black,
                                            }}
                                            name={'pickerProducto'}
                                            itemStyle={{fontFamily: 'Anton'}}
                                            mode={'dropdown'}
                                            selectedValue={values.pickerProducto}
                                            // selectedValue={selectedMeasurementMetod}
                                            onValueChange={(itemValue) => {
                                                if (itemValue > 0) {
                                                    handleChange('pickerProducto')
                                                    setFieldTouched('pickerProducto', true)
                                                    setFieldValue('pickerProducto', itemValue)
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
                                            defaultItemLabel={'Escoge un producto'}
                                        />
                                        {/*<Picker*/}
                                        {/*    ref={ProductoRef}*/}
                                        {/*    style={{*/}
                                        {/*        borderWidth: .5,*/}
                                        {/*        borderColor: COLORS.black,*/}
                                        {/*    }}*/}
                                        {/*    name={'pickerProducto'}*/}
                                        {/*    itemStyle={{fontFamily: 'Anton'}}*/}
                                        {/*    mode={'dropdown'}*/}
                                        {/*    selectedValue={values.pickerProducto}*/}
                                        {/*    // selectedValue={selectedMeasurementMetod}*/}
                                        {/*    onValueChange={(itemValue) => {*/}
                                        {/*        if (itemValue > 0) {*/}
                                        {/*            handleChange('pickerProducto')*/}
                                        {/*            setFieldTouched('pickerProducto', true)*/}
                                        {/*            setFieldValue('pickerProducto', itemValue)*/}
                                        {/*        } else {*/}
                                        {/*            showToast("Debes escoger una opción válida...")*/}
                                        {/*        }*/}
                                        {/*    }}*/}
                                        {/*>*/}
                                        {/*    <Picker.Item label="Elige un producto..." value={0}*/}
                                        {/*                 style={{fontFamily: 'Anton'}}*/}
                                        {/*                 selected*/}
                                        {/*    />*/}
                                        {/*    {productoDataDB.length > 0 ?*/}
                                        {/*        productoDataDB.map((item, index) => {*/}
                                        {/*            return <Picker.Item key={index}*/}
                                        {/*                                label={' ' + item.producto_name}*/}
                                        {/*                                value={item.producto_id}/>*/}
                                        {/*        })*/}
                                        {/*        :*/}
                                        {/*        <Picker.Item label="No existen datos" value={null}/>*/}
                                        {/*    }*/}
                                        {/*</Picker>*/}
                                    </View>
                                </View>
                            </View>
                            <View>
                                {(errors.inputTirBruta && touched.inputTirBruta) &&
                                < Text
                                    style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.inputTirBruta}</Text>
                                }
                                <CustomTextInput
                                    _ref={inputTbrutaRef}
                                    svgData={tirada2SVG}
                                    svgWidth={50}
                                    svgHeight={50}
                                    placeholder={'Ejemplares bruto...'}
                                    text={'Tirada bruta:'}
                                    type={'numeric'}
                                    _name={'inputTirBruta'}
                                    _onChangeText={handleChange('inputTirBruta')}
                                    _onBlur={handleBlur('inputTirBruta')}
                                    value={values.inputTirBruta}
                                />
                            </View>
                            <View style={styles.results}>
                                <TouchableOpacity
                                    style={[styles.touchable, {
                                        alignSelf: 'center',
                                        margin: 5,
                                        opacity: !isValid ? .1 : 1
                                    }]}
                                    color="#841584"
                                    accessibilityLabel="calcular resultado de bobina"
                                    onPress={handleSubmit}
                                    title="Submit"
                                    disabled={!isValid}
                                >
                                    <Text
                                        style={{color: COLORS.white, fontFamily: 'Anton', fontSize: 20}}>CALCULAR</Text>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        width: 150,
                                        height: 50,
                                        backgroundColor: COLORS.white,
                                        borderRadius: 5,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{fontSize: 20}}>
                                        {!isNaN(resultElementCalTotalproduction) ?
                                            Math.round(resultElementCalTotalproduction) + ' Kg'
                                            :
                                            'Error'
                                        }
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </Formik>
            </>
        );
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <ImageBackground source={require('../assets/images/orangegradient.jpg')} style={styles.backg}>
                <MultipleSwitchSelector
                    label_values={switchValues}
                    title={'calculos'}
                    handler={getMultipleSwitchValue}
                    textColor={COLORS.primary}
                    buttonColor={COLORS.primary}
                />
                <View style={styles.contPrinc}>
                    {switchValue === 1 ?
                        elementPrevProdction()
                        :
                        null
                    }
                    {
                        switchValue === 2 ?
                            elementCalcBobina()
                            :
                            null
                    }
                    {
                        switchValue === 3 ?
                            elementCalTotalproduction()
                            :
                            null
                    }
                    {!isKeyboardVisible &&
                    <ResetButtonForm
                        resetState_elementPrevProdction={resetState_elementPrevProdction}
                    />
                    }
                </View>
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
            </ImageBackground>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    contPrinc: {
        flex: 1,
    },
    titles: {
        fontSize: 28,
        color: COLORS.white,
        textAlign: 'left',
        textTransform: 'uppercase',
        fontFamily: 'Anton',
        marginLeft: 40,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1
    },
    results: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 5
    },
    contTitle: {
        borderRadius: 9,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.white,
        borderTopWidth: 2,
        borderTopColor: COLORS.white
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
    backg: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    }
});

export default IndividualCalculation;