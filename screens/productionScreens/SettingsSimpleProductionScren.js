import React, {useState, useEffect, useRef} from 'react';
import {
    Alert,
    View,
    Text,
    StyleSheet,
    Button,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    KeyboardAvoidingView
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SvgComponent from "../../components/SvgComponent";
import {
    configSVG,
    editSVG,
    settingspaperSVG,
    paginationSVG,
    productoSVG,
    papelComunSVG,
    tirada2SVG, addDateSVG
} from "../../assets/svg/svgContents";
import {COLORS} from "../../assets/defaults/settingStyles";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import {Formik} from "formik";
import * as Yup from "yup";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import {Fontisto as Icon} from "@expo/vector-icons";
import {getDatas, removeValue, storeData} from "../../data/AsyncStorageFunctions";
import {Dimensions} from 'react-native';
import BgComponent from "../../components/BackgroundComponent/BgComponent";
import CustomDateTimePicker from "../../components/FormComponents/CustomDateTimePicker";
import {timeNow} from "../../utils";

const SettingsSimpleProductionScreen = () => {
    const _svgData = settingspaperSVG;
    const _svgWidth = 60;
    const _svgHeight = 60;

    const optionsSVG = {
        svgData: productoSVG, svgWidth: '110%', svgHeight: '110%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: 0, right: 0
    };

    const confSimpleProduction = useRef();
    const inputProductRef = useRef();
    const inputPaginationRef = useRef();
    const inputTbrutaRef = useRef();
    const inputDateRef = useRef();

    const [selectedValuePaginacion, getSelectedPagination] = useState('');
    const [selectedValueProduct, getSelectedvalueProduct] = useState('');
    // const [selectedTiradaBruta, getSelectedTiradaBruta] = useState(0);
    const [selectedCoeficiente, getSelectedCoeficiente] = useState('');
    const [selectedDate, getSelectedDate] = useState('');

    const SchemaElementCalTotalproduction = Yup.object().shape({
        // inputTirBruta: FormYupSchemas.inputTirBruta,
        inputProduct: FormYupSchemas.whitespaceandchars,
        inputPagination: FormYupSchemas.pag,
        inputCoef: FormYupSchemas.medVal,
        inputDate: FormYupSchemas.dateReg
    })

    useEffect(() => {
        // getDatas('@simpleProdData')
        //     .then(r => getObjSaved([...r]))
        //     .catch(err=>console.log(err))
    }, [])

    const navigation = useNavigation();

    const bottomToast = (message) => {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
        );
    };

    const handlerSave = (obj) => {
        let getSaveObject = [];
        getDatas('@simpleProdData')
            .then(r => {
                if (r.length === 0) {
                    obj.orderID = 1;
                } else {
                    obj.orderID = r.length + 1;
                }
                getSaveObject = [...r, obj];
                const ordereObj = getSaveObject.sort((a, b) => b.orderID - a.orderID);
                storeData('@simpleProdData', ordereObj)
                    .then(r => bottomToast('Guardando...'))
                    .catch(err => bottomToast('error al guardar...'))
            })
            .catch(err => {
                // Alert.alert('error')
                // removeValue('@simpleProdData').then(r => console.log(''))
                obj.orderID = 0
                getSaveObject = [obj];
                storeData('@simpleProdData', getSaveObject)
                    .then(r => bottomToast('Guardando...'))
                    .catch(err => bottomToast('error al guardar...'))
            })
    };

    const resetValuesForm = () => {
        getSelectedPagination('');
        getSelectedvalueProduct('');
        getSelectedCoeficiente('');
        getSelectedDate('');
        inputProductRef.current.clear();
        inputPaginationRef.current.clear();
        inputTbrutaRef.current.clear();
        inputDateRef.current.clear();
        confSimpleProduction.current?.resetForm();
    }

    const configSimple = () => {
        return (
            <>
                <Formik
                    enableReinitialize
                    innerRef={confSimpleProduction}
                    initialValues={{
                        inputProduct: selectedValueProduct,
                        inputPagination: selectedValuePaginacion,
                        // inputTirBruta: selectedTiradaBruta,
                        inputCoef: selectedCoeficiente,
                        inputDate: selectedDate
                    }}
                    validationSchema={SchemaElementCalTotalproduction}
                    onSubmit={values => {
                        const obj = {
                            title: values.inputProduct,
                            id: timeNow(),
                            date: values.inputDate,
                            pagination: values.inputPagination,
                            notas: {
                                gramaje: '',
                                prevTirada: '',
                            },
                            coef: values.inputCoef,
                            cards: []
                        }
                        handlerSave(obj);
                        resetValuesForm();
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
                            <View>
                                {(errors.inputDate && touched.inputDate) &&
                                < Text
                                    style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.inputDate}</Text>
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
                                    }}
                                    placeholder={'Selecciona fecha...'}
                                    _name={'inputDate'}
                                    _onChangeText={handleChange('inputDate')}
                                    _onBlur={handleBlur('inputDate')}
                                    value={values.inputDate}
                                    onvalueChange={(itemValue) => {
                                        handleChange('inputDate')
                                        setFieldTouched('inputDate', true)
                                        setFieldValue('inputDate', itemValue)
                                    }}
                                />
                                <View>
                                    {(errors.inputProduct && touched.inputProduct) &&
                                    < Text
                                        style={{
                                            fontSize: 10,
                                            color: 'red',
                                            marginLeft: 10
                                        }}>{errors.inputProduct}</Text>
                                    }
                                    <CustomTextInput
                                        _ref={inputProductRef}
                                        svgData={productoSVG}
                                        svgWidth={50}
                                        svgHeight={50}
                                        placeholder={'Nombre...'}
                                        text={'Producto:'}
                                        // type={'numeric'}
                                        _name={'inputProduct'}
                                        _onChangeText={handleChange('inputProduct')}
                                        _onBlur={handleBlur('inputProduct')}
                                        value={values.inputProduct}
                                    />
                                </View>
                                <View>
                                    {(errors.inputPagination && touched.inputPagination) &&
                                    < Text
                                        style={{
                                            fontSize: 10,
                                            color: 'red',
                                            marginLeft: 10
                                        }}>{errors.inputPagination}</Text>
                                    }
                                    <CustomTextInput
                                        _ref={inputPaginationRef}
                                        svgData={paginationSVG}
                                        svgWidth={50}
                                        svgHeight={50}
                                        placeholder={'Valor de pag...'}
                                        text={'Paginación:'}
                                        type={'numeric'}
                                        _name={'inputPagination'}
                                        _onChangeText={handleChange('inputPagination')}
                                        _onBlur={handleBlur('inputPagination')}
                                        value={values.inputPagination}
                                    />
                                </View>
                                {/*<View>*/}
                                {/*    {(errors.inputTirBruta && touched.inputTirBruta) &&*/}
                                {/*    < Text*/}
                                {/*        style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.inputTirBruta}</Text>*/}
                                {/*    }*/}
                                {/*    <CustomTextInput*/}
                                {/*        // _ref={inputTbrutaRef}*/}
                                {/*        svgData={tirada2SVG}*/}
                                {/*        svgWidth={50}*/}
                                {/*        svgHeight={50}*/}
                                {/*        placeholder={'Ejemplares bruto...'}*/}
                                {/*        text={'Tirada bruta:'}*/}
                                {/*        type={'numeric'}*/}
                                {/*        _name={'inputTirBruta'}*/}
                                {/*        _onChangeText={handleChange('inputTirBruta')}*/}
                                {/*        _onBlur={handleBlur('inputTirBruta')}*/}
                                {/*        value={values.inputTirBruta}*/}
                                {/*    />*/}
                                {/*</View>*/}
                                <View>
                                    {(errors.inputCoef && touched.inputCoef) &&
                                    < Text
                                        style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.inputCoef}</Text>
                                    }
                                    <CustomTextInput
                                        _ref={inputTbrutaRef}
                                        svgData={tirada2SVG}
                                        svgWidth={50}
                                        svgHeight={50}
                                        placeholder={'Valor de coef...'}
                                        text={'Coeficiente:'}
                                        type={'numeric'}
                                        _name={'inputCoef'}
                                        _onChangeText={handleChange('inputCoef')}
                                        _onBlur={handleBlur('inputCoef')}
                                        value={values.inputCoef}
                                    />
                                </View>
                                {/*<View>*/}
                                {/*    {(errors.inputDate && touched.inputDate) &&*/}
                                {/*    < Text*/}
                                {/*        style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.inputDate}</Text>*/}
                                {/*    }*/}
                                {/*    <CustomDateTimePicker*/}
                                {/*        getSelectedDate={getSelectedDate}*/}
                                {/*        _ref={inputDateRef}*/}
                                {/*        svgData={addDateSVG}*/}
                                {/*        svgWidth={35}*/}
                                {/*        svgHeight={35}*/}
                                {/*        text={'Fecha: '}*/}
                                {/*        modeType={'calendar'}*/}
                                {/*        styleOptions={{*/}
                                {/*            backgroundColor: '#FFF',*/}
                                {/*            textHeaderColor: '#FF8500',*/}
                                {/*            textDefaultColor: '#FF8500',*/}
                                {/*            selectedTextColor: '#fff',*/}
                                {/*            mainColor: '#FF8500',*/}
                                {/*            textSecondaryColor: '#000',*/}
                                {/*            borderColor: '#000',*/}
                                {/*        }}*/}
                                {/*        placeholder={'Selecciona fecha...'}*/}
                                {/*        _name={'inputDate'}*/}
                                {/*        _onChangeText={handleChange('inputDate')}*/}
                                {/*        _onBlur={handleBlur('inputDate')}*/}
                                {/*        value={values.inputDate}*/}
                                {/*        onvalueChange={(itemValue) => {*/}
                                {/*            handleChange('inputDate')*/}
                                {/*            setFieldTouched('inputDate', true)*/}
                                {/*            setFieldValue('inputDate', itemValue)*/}
                                {/*        }}*/}
                                {/*    />*/}
                            </View>
                            <View style={styles.buttonsCont}>
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
                                        style={{
                                            color: COLORS.white,
                                            fontFamily: 'Anton',
                                            fontSize: 20,
                                            textShadowColor: COLORS.black,
                                            textShadowOffset: {width: 0.5, height: 0.5},
                                            textShadowRadius: 1,
                                        }}>CREAR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.touchableReset, {
                                        alignSelf: 'center',
                                        margin: 5,
                                    }]}
                                    color="#00ff45"
                                    accessibilityLabel="reset form"
                                    onPress={() => {
                                        resetValuesForm();
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: COLORS.white,
                                            fontFamily: 'Anton',
                                            fontSize: 20, textShadowColor: COLORS.black,
                                            textShadowOffset: {width: 0.5, height: 0.5},
                                            textShadowRadius: 1,
                                        }}>RESET</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </Formik>
            </>
        );
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Producción Simplificada")}
                style={{
                    backgroundColor: COLORS.white,
                    borderBottomWidth: 2,
                    borderColor: '#c2c2c2',
                    elevation: 12,
                    // margin: 10,
                    padding: 8,
                    marginBottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                <Icon name={'arrow-left'}
                      size={20}
                      color={'red'}
                      style={{
                          width: 40,
                          height: 40,
                          color: 'black',
                          // backgroundColor: 'green',
                          // borderRadius: 100,
                          textAlign: 'center',
                          textAlignVertical: 'center'
                      }}
                />
                <Text style={{
                    fontSize: 20,
                    fontFamily: 'sans-serif-medium',
                    fontWeight: 'normal',
                    color: 'rgb(28,28,28)',
                    marginLeft: 25,
                    padding: 0,
                    margin: 0
                }}>Volver atrás</Text>
            </TouchableOpacity>
            <ScrollView style={{flex: 1, backgroundColor: '#c2c2c2'}}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <View style={styles.parent}>
                        <BgComponent styleOptions={optionsStyleContSVG} svgOptions={optionsSVG}/>
                        <View style={styles.contTitle}>
                            <View style={{
                                alignSelf: 'center',
                                // width: '30%',
                                padding: 10,
                                // backgroundColor: '#FFFFFF20',
                                borderRadius: 15,
                                borderWidth: 5,
                                borderColor: COLORS.black,
                            }}>
                                <SvgComponent
                                    svgData={_svgData}
                                    svgWidth={_svgWidth}
                                    svgHeight={_svgHeight}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: COLORS.white,
                        paddingTop: 20,
                        paddingLeft: 10,
                        paddingRight: 10,
                        margin: 30,
                        borderRadius: 20,
                        minHeight: Dimensions.get('window').height / 2,
                        marginTop: Dimensions.get('window').height / -3.5,
                        elevation: 12
                    }}>
                        <Text style={styles.subtitle}>Producción Simplificada</Text>
                        {configSimple()}
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    parent: {
        flex: 1,
        margin: 0,
        padding: 10,
        paddingTop: 0,
        backgroundColor: COLORS.colorSupportter,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: Dimensions.get('window').height / 2,
        borderWidth: 1,
        borderColor: 'grey'

    },
    title: {
        fontFamily: 'Anton',
        color: COLORS.black,
        fontSize: 25,
        textShadowColor: COLORS.white,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1
    },
    subtitle: {
        fontFamily: 'Anton',
        color: COLORS.primary,
        fontSize: 24,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
        textAlign: 'center',
        marginBottom: 50
    },
    contTitle: {
        borderRadius: 5,
        margin: 15,
        padding: 15
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
    touchableReset: {
        width: 120,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FDF000",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    buttonsCont: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
export default SettingsSimpleProductionScreen;
