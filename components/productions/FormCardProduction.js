import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ToastAndroid, Alert, Picker} from 'react-native';
import CustomDateTimePicker from "../FormComponents/CustomDateTimePicker";
import {addDateSVG, meditionSVG, paginationSVG, productoSVG, tirada2SVG} from "../../assets/svg/svgContents";
import CustomTextInput from "../FormComponents/CustomTextInput";
import {COLORS} from "../../assets/defaults/settingStyles";
import {Formik} from "formik";
import * as Yup from "yup";
import {FormYupSchemas} from "../FormComponents/YupSchemas";
import CustomPicker from "../FormComponents/CustomPicker";
import SvgComponent from "../SvgComponent";
import {timeNow} from "../../utils";
import {storeData} from "../../data/AsyncStorageFunctions";

const FormCardProduction = ({
                                dataPickerAutopaster,
                                addCard,
                                editCardItem,
                                objsaved,
                                renderNowItem,
                                updateGetStorage
                            }) => {

    const confCardProduction = useRef();
    const inputCodeRef = useRef();
    const inputPesoOrRef = useRef();
    const inputrestIniRef = useRef();
    const pickerAutopasterRef = useRef();

    const [selectedValuepickerAutopaster, getSelectedPickerAutopaster] = useState(0);
    const [selectedValuePesoOriginal, getSelectedPesoOriginal] = useState('');
    const [selectedValueCode, getSelectedvalueCode] = useState('');
    const [selectedRestIni, getSelectedRestIni] = useState('');

    const SchemaElementCalTotalproduction = Yup.object().shape({
        pickerAutopaster: FormYupSchemas.meditionType,
        inputCode: FormYupSchemas.meditionStyle,
        inputPesoOriginal: FormYupSchemas.weight,
        inputRestIni: FormYupSchemas.optionalWeight.max(Yup.ref('inputPesoOriginal'), 'Peso superior a original de bobina'),
    })

    useEffect(() => {
        if (editCardItem.id) {
            getSelectedPickerAutopaster(editCardItem.autopasterNum);
            getSelectedvalueCode(editCardItem.code);
            getSelectedPesoOriginal(editCardItem.pesoOriginal);
            getSelectedRestIni(editCardItem.restoInicio);
        }
    }, [editCardItem]);

    return (
        <View>
            <Formik
                enableReinitialize
                innerRef={confCardProduction}
                initialValues={{
                    pickerAutopaster: selectedValuepickerAutopaster,
                    inputCode: selectedValueCode,
                    inputPesoOriginal: selectedValuePesoOriginal,
                    inputRestIni: selectedRestIni,
                }}
                validationSchema={SchemaElementCalTotalproduction}
                onSubmit={values => {
                    if (editCardItem.id) {
                        const restOfproducts = objsaved.filter(item => item.id !== renderNowItem);
                        const thisProduct = objsaved.filter(item => item.id === renderNowItem);
                        const restDataCards = thisProduct[0].cards.filter(item => item.id !== editCardItem.id);
                        const thisDataCards = thisProduct[0].cards.filter(item => item.id === editCardItem.id);

                        thisDataCards[0].autopasterNum = values.pickerAutopaster;
                        thisDataCards[0].code = values.inputCode;
                        thisDataCards[0].pesoOriginal = values.inputPesoOriginal;
                        thisDataCards[0].restoInicio = values.inputRestIni === '' ? thisDataCards[0].pesoOriginal : values.inputRestIni;
                        thisDataCards[0].radio = '';
                        thisDataCards[0].consumo = '';
                        thisDataCards[0].restoFinal = '';

                        thisProduct[0].cards = [...restDataCards, ...thisDataCards];
                        const allItems = [...restOfproducts, ...thisProduct];
                        storeData('@simpleProdData', allItems).then(r => console.log(r));
                        updateGetStorage();
                    } else {
                        addCard({
                            autopasterNum: values.pickerAutopaster,
                            id: timeNow(),
                            pesoOriginal: values.inputPesoOriginal,
                            code: values.inputCode,
                            restoInicio: values.inputRestIni.length === 0 ? values.inputPesoOriginal : values.inputRestIni,
                            restoFinal: '',
                            radio: '',
                            consumo: ''
                        });
                    }
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
                            <View style={{padding: 10}}>
                                {(errors.pickerAutopaster && touched.pickerAutopaster) &&
                                < Text style={{fontSize: 10, color: 'white'}}>{errors.pickerAutopaster}</Text>
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
                                            svgData={null}
                                            svgWidth={null}
                                            svgHeight={null}
                                        />
                                    </View>
                                    <View style={{flex: 1, paddingLeft: 10}}>
                                        <CustomPicker
                                            ref={pickerAutopasterRef}
                                            style={{
                                                borderWidth: .5,
                                                borderColor: COLORS.black,
                                            }}
                                            name={'pickerAutopaster'}
                                            itemStyle={{fontFamily: 'Anton'}}
                                            mode={'dropdown'}
                                            value={values.pickerAutopaster}
                                            selectedValue={values.pickerAutopaster}
                                            onValueChange={(itemValue) => {
                                                if (itemValue > 0) {
                                                    handleChange('pickerAutopaster')
                                                    setFieldTouched('pickerAutopaster', true)
                                                    setFieldValue('pickerAutopaster', itemValue)
                                                }
                                            }}
                                            dataOptionsPicker={dataPickerAutopaster.map((item, index) => {
                                                return <Picker.Item key={index}
                                                                    label={'Autopaster ' + item}
                                                                    value={item}/>
                                            })}
                                            defaultItemLabel={'Escoge autopaster'}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View>
                                {(errors.inputCode && touched.inputCode) &&
                                < Text
                                    style={styles._errors}>{errors.inputCode}</Text>
                                }
                                <CustomTextInput
                                    _ref={inputCodeRef}
                                    svgData={null}
                                    svgWidth={null}
                                    svgHeight={null}
                                    placeholder={'Nombre...'}
                                    text={'Código identificador:'}
                                    // type={'numeric'}
                                    _name={'inputCode'}
                                    _onChangeText={handleChange('inputCode')}
                                    _onBlur={handleBlur('inputCode')}
                                    value={values.inputCode}
                                    _defaultValue={selectedValueCode}
                                />
                            </View>
                            <View>
                                {(errors.inputPesoOriginal && touched.inputPesoOriginal) &&
                                < Text
                                    style={styles._errors}>{errors.inputPesoOriginal}</Text>
                                }
                                <CustomTextInput
                                    _ref={inputPesoOrRef}
                                    svgData={null}
                                    svgWidth={null}
                                    svgHeight={null}
                                    placeholder={'Valor de pag...'}
                                    text={'Peso de origen:'}
                                    type={'numeric'}
                                    _name={'inputPesoOriginal'}
                                    _onChangeText={handleChange('inputPesoOriginal')}
                                    _onBlur={handleBlur('inputPesoOriginal')}
                                    value={values.inputPesoOriginal}
                                    _defaultValue={selectedValuePesoOriginal}
                                />
                            </View>
                            <View>
                                {(errors.inputRestIni && touched.inputRestIni) &&
                                < Text
                                    style={styles._errors}>{errors.inputRestIni}</Text>
                                }
                                <CustomTextInput
                                    _ref={inputrestIniRef}
                                    svgData={null}
                                    svgWidth={null}
                                    svgHeight={null}
                                    placeholder={'Valor de coef...'}
                                    text={'Resto inicial:'}
                                    type={'numeric'}
                                    _name={'inputRestIni'}
                                    _onChangeText={handleChange('inputRestIni')}
                                    _onBlur={handleBlur('inputRestIni')}
                                    value={values.inputRestIni}
                                    styled={{
                                        marginBottom: 0,
                                        borderBottomLeftRadius: 0,
                                        borderBottomRightRadius: 0,
                                    }}
                                    _defaultValue={selectedRestIni}
                                />
                                <Text
                                    style={{
                                        paddingLeft: 10,
                                        fontSize: 15,
                                        color: COLORS.white,
                                        backgroundColor: editCardItem.id ? COLORS.colorSupportfiv : COLORS.buttonEdit,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        borderWidth: .5,
                                        borderTopWidth: 0,
                                        borderColor: COLORS.black
                                    }}
                                >* En blanco si es nueva</Text>
                            </View>
                        </View>
                        <View style={styles.buttonsCont}>
                            <TouchableOpacity
                                style={[styles.touchable, {
                                    alignSelf: 'center',
                                    margin: 5,
                                    opacity: !isValid ? .1 : 1,
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
                                    }}>{editCardItem.id ? 'MODIFICAR' : 'CREAR'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.touchableReset, {
                                    alignSelf: 'center',
                                    margin: 5,
                                }]}
                                color="#00ff45"
                                accessibilityLabel="reset form"
                                onPress={() => {
                                    getSelectedPesoOriginal('');
                                    getSelectedvalueCode('');
                                    getSelectedRestIni('');
                                    inputCodeRef.current.clear();
                                    inputPesoOrRef.current.clear();
                                    inputrestIniRef.current.clear();
                                    confCardProduction.current?.resetForm();
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
        </View>
    )
}
const styles = StyleSheet.create({
    buttonsCont: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10
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
    _errors: {
        fontSize: 10,
        color: 'white',
        marginLeft: 10
    }
});
export default FormCardProduction;