import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {pickerPapelcomun, pickerKBA, insertProducto, updateProductoByID, produtoByID} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import {COLORS} from "../../assets/defaults/settingStyles";
import SvgComponent from "../../components/SvgComponent";
import {nombre, coeficienteSVG, papelComunSVG} from "../../assets/svg/svgContents";
import CustomPicker from "../../components/FormComponents/CustomPicker";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import {Formik} from "formik";
import * as Yup from "yup";
import HRtag from "../../components/HRtag";
import ToastMesages from "../../components/ToastMessages";
import ResetButtonForm from "../../components/FormComponents/ResetButtonForm";
import {genericUpdatefunction, genericInsertFunction} from '../../dbCRUD/actionsFunctionsCrud';
import {Picker} from '@react-native-picker/picker';

const ProductosCrud = ({props}) => {

    const db = SQLite.openDatabase('bobinas.db');
    const productosForm = useRef();
    const coefProdRef = useRef();
    const papelComRef = useRef();

    const [coeficienteDB, setCoeficienteDB] = useState([]);
    const [papelComDB, setPapelComDB] = useState([]);
    const [productName, setStateProductName] = useState('');
    //if min value for formik is 1, in state will 0.
    const [coefProdFk, setStateCoefProdFk] = useState(0);
    //for item picker values 0 and 1 (true / false ), empty state.
    const [statePapelCom, setStatePapelCom] = useState(0);

    useEffect(() => {
        let isActive = true;

        //SET VALUES FOR UPDATE
        if (props.typeform === 'ACTUALIZAR' && props.registerID > 0 && isActive) {
            //producto ID REQUEST
            db.transaction(tx => {
                tx.executeSql(
                    produtoByID,
                    [props.registerID],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            //clone array
                            const responsetObj = [..._array];
                            setStateProductName(responsetObj[0].producto_name);
                            setStateCoefProdFk(responsetObj[0].cociente_total_fk);
                            setStatePapelCom(responsetObj[0].papel_comun_fk)
                        } else {
                            console.log('Error al conectar base de datos en IndividualCalculation Component');
                        }
                    }
                );
            });
        }

        //COEFICIENTE ALL REQUEST
        db.transaction(tx => {
            tx.executeSql(
                pickerKBA,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        setCoeficienteDB(_array);
                    } else {
                        console.log('Error al conectar base de datos en IndividualCalculation Component');
                    }
                }
            );
        });

        // ALL REQUEST
        db.transaction(tx => {
            tx.executeSql(
                pickerPapelcomun,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        setPapelComDB(_array);
                    } else {
                        console.log('Error al conectar base de datos en IndividualCalculation Component');
                    }
                }
            );
        });

        return () => isActive = false;
    }, []);

    const schemasValidation = Yup.object().shape({
        productName: FormYupSchemas.meditionStyle,
        pickerCoefProd: FormYupSchemas.pickerGramaje,
        pickerPapelComProd: FormYupSchemas.pickerGramaje,
    });

    let toastRef;
    const showToast = (message, isError = true) => {
        if (!isError) {
            toastRef.props.style.backgroundColor = '#00ff00';
        }
        toastRef.show(message);
    }

    const insertdata = () => {
        return (
            <Formik
                enableReinitialize
                innerRef={productosForm}
                initialValues={{
                    productName: productName,
                    pickerCoefProd: coefProdFk,
                    pickerPapelComProd: statePapelCom
                }}
                validationSchema={schemasValidation}
                onSubmit={values => {
                    if (props.typeform === 'ACTUALIZAR' && props.registerID > 0) {
                        const updateArr = [values.productName, values.pickerCoefProd, values.pickerPapelComProd, props.registerID];
                        genericUpdatefunction(updateProductoByID, updateArr)
                            .then(result => {
                                if (result.rowsAffected > 0) {
                                    showToast('Actualizado con éxito', false)
                                } else {
                                    showToast('Error al actualizar')
                                }
                            })
                            .catch(err => {
                                showToast('Error al actualizar');
                            })
                    }
                    if (props.typeform === 'CREAR') {
                        //row order: coefKbaid(ai) = null, producto_name, coeficiente_total_fk, papel_comun_fk
                        const insertArr = [null, values.productName, values.pickerCoefProd, values.pickerPapelComProd];
                        genericInsertFunction(insertProducto, insertArr)
                            .then(result => {
                                if (result.rowsAffected > 0) {
                                    showToast('Creado con éxito', false)
                                } else {
                                    showToast('Error al crear registro')
                                }
                            })
                            .catch(err => {
                                showToast('Error al crear registro');
                            })
                        productosForm.current?.resetForm();
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
                      setFieldValue,
                      setFieldTouched
                  }) => (
                    <>
                        <TouchableOpacity
                            style={[styles.button, {opacity: !isValid ? .1 : 1}]}
                            onPress={handleSubmit}
                            title="Submit"
                            disabled={!isValid}
                        >
                            <Text style={styles.textButton}>{props.typeform + ' REGISTRO'}</Text>
                        </TouchableOpacity>
                        <HRtag borderColor={COLORS.whitesmoke}/>
                        {(errors.productName && touched.productName) &&
                        < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.productName}</Text>
                        }
                        <CustomTextInput
                            svgData={nombre}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Nombre para producto...'}
                            text={''}
                            type={'default'}
                            _name={'productName'}
                            _onChangeText={handleChange('productName')}
                            _onBlur={handleBlur('productName')}
                            value={values.productName}
                            _defaultValue={values.productName}
                        />
                        <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                            {(errors.pickerCoefProd && touched.pickerCoefProd) &&
                            < Text style={{fontSize: 10, color: 'red'}}>{errors.pickerCoefProd}</Text>
                            }
                            <View style={styles.contPicker}>
                                <View style={styles.IconStyle}>
                                    <SvgComponent
                                        svgData={coeficienteSVG}
                                        svgWidth={45}
                                        svgHeight={45}
                                    />
                                </View>
                                <View style={{flex: 1, paddingLeft: 10}}>
                                    {coeficienteDB.length > 0 ?
                                        <CustomPicker
                                            _typeform={props.typeform}
                                            ref={coefProdRef}
                                            style={{
                                                borderWidth: .5,
                                                borderColor: COLORS.black,
                                            }}
                                            name={'pickerCoefProd'}
                                            itemStyle={{fontFamily: 'Anton'}}
                                            mode={'dropdown'}
                                            value={values.pickerCoefProd}
                                            selectedValue={values.pickerCoefProd}
                                            onValueChange={(itemValue) => {
                                                if (itemValue > 0) {
                                                    handleChange('pickerCoefProd')
                                                    setFieldTouched('pickerCoefProd', true)
                                                    setFieldValue('pickerCoefProd', itemValue)
                                                } else {
                                                    showToast("Debes escoger una opción válida...")
                                                }
                                            }}
                                            dataOptionsPicker={coeficienteDB.map((item, index) => {
                                                return <Picker.Item key={index}
                                                                    label={item.kba_name + ': ' + item.kba_value}
                                                                    value={item.kba_id}/>
                                            })}
                                            defaultItemLabel={'Escoge un coeficiente KBA...'}
                                        />
                                        :
                                        null
                                    }
                                </View>
                            </View>
                        </View>
                        {(errors.autopastPref && touched.autopastPref) &&
                        <Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.autopastPref}</Text>
                        }
                        <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                            {(errors.pickerPapelComProd && touched.pickerPapelComProd) &&
                            < Text style={{fontSize: 10, color: 'red'}}>{errors.pickerPapelComProd}</Text>
                            }
                            <View style={{
                                backgroundColor: COLORS.white,
                                width: '100%',
                                height: 60,
                                padding: 10,
                                borderRadius: 5,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: .5,
                                borderColor: COLORS.black,
                            }}>
                                <View style={styles.IconStyle}>
                                    <SvgComponent
                                        svgData={papelComunSVG}
                                        svgWidth={45}
                                        svgHeight={45}
                                    />
                                </View>
                                <View style={{flex: 1, paddingLeft: 10}}>
                                    {papelComDB.length > 0 ?
                                        <CustomPicker
                                            _typeform={props.typeform}
                                            ref={papelComRef}
                                            style={{
                                                borderWidth: .5,
                                                borderColor: COLORS.black,
                                            }}
                                            name={'pickerPapelComProd'}
                                            itemStyle={{fontFamily: 'Anton'}}
                                            mode={'dropdown'}
                                            value={values.pickerPapelComProd}
                                            selectedValue={values.pickerPapelComProd}
                                            onValueChange={(itemValue) => {
                                                if (itemValue >= 0) {
                                                    handleChange('pickerPapelComProd')
                                                    setFieldTouched('pickerPapelComProd', true)
                                                    setFieldValue('pickerPapelComProd', itemValue)
                                                } else {
                                                    showToast("Debes escoger una opción válida...")
                                                }
                                            }}
                                            dataOptionsPicker={papelComDB.map((item, index) => {
                                                return <Picker.Item key={index}
                                                                    label={item.papel_comun_name}
                                                                    value={item.papel_comun_id}/>
                                            })}
                                            defaultItemLabel={'Escoge papel común...'}
                                        />
                                        :
                                        null
                                    }
                                </View>
                            </View>
                        </View>
                        {
                            !isValid &&
                            <ResetButtonForm
                                _style={{
                                    position: 'relative'
                                }}
                                resetState_elementPrevProdction={() => productosForm.current?.resetForm()}
                            />
                        }
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
                    </>
                )}
            </Formik>
        )
    }

    return (
        <View>
            {insertdata()}
        </View>
    );
}
const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        padding: 10,
    },
    textButton: {
        textAlign: 'center',
        fontFamily: 'Anton',
        fontSize: 17,
        color: COLORS.white
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
    }
});
export default ProductosCrud;