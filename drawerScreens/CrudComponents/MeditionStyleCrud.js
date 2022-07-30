import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {picker_gramaje, meditionStyleByID, updateMeditionStyleByID, insertMeditionStyle} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import {COLORS} from "../../assets/defaults/settingStyles";
import SvgComponent from "../../components/SvgComponent";
import {gramaje, nombre, bobinaFull, bobinaMed} from "../../assets/svg/svgContents";
import CustomPicker from "../../components/FormComponents/CustomPicker";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import {Formik} from "formik";
import * as Yup from "yup";
import HRtag from "../../components/HRtag";
import ToastMesages from "../../components/ToastMessages";
import ResetButtonForm from "../../components/FormComponents/ResetButtonForm";
import {genericUpdatefunction, genericInsertFunction} from '../../dbCRUD/actionsFunctionsCrud';
import {Picker} from '@react-native-picker/picker';
import {Sentry_Alert} from "../../utils";

const MeditionStyleCrud = ({props}) => {

    const db = SQLite.openDatabase('bobinas.db');
    const meditionStyleForm = useRef();
    const gramajeRef = useRef();
    const medicionRef = useRef();
    const fullValRef = useRef();
    const medValRef = useRef();

    const [gramajeDB, setgramajeDB] = useState([]);
    const [statemeditionType, setStateMeditionType] = useState('');
    const [stategramajeFk, setStateGramajeFK] = useState(0);
    const [stateFullVal, setStateFullVal] = useState();
    const [stateMedlVal, setStateMedVal] = useState();

    useEffect(() => {
        let isActive = true;

        //SET VALUES FOR UPDATE
        if (props.typeform === 'ACTUALIZAR' && props.registerID > 0 && isActive) {
            //GRAMAJE ID REQUEST
            db.transaction(tx => {
                tx.executeSql(
                    meditionStyleByID,
                    [props.registerID],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            //clone array
                            const responsetObj = [..._array];
                            setStateMeditionType(responsetObj[0].medition_type);
                            setStateGramajeFK(responsetObj[0].gramaje_fk);
                            setStateFullVal(responsetObj[0].full_value.toString());
                            setStateMedVal(responsetObj[0].media_value.toString());
                        }
                    }
                );
            }, err => Sentry_Alert('MeditionStyleCrud.js', 'transaction - meditionStyleByID', err));
        }

        //GRAMAJE ALL REQUEST
        db.transaction(tx => {
            tx.executeSql(
                picker_gramaje,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        setgramajeDB(_array);
                    }
                }
            );
        }, err => Sentry_Alert('MeditionStyleCrud.js', 'transaction - picker_gramaje', err));

        return () => isActive = false;
    }, []);

    const schemasValidation = Yup.object().shape({
        pickerGramaje: FormYupSchemas.pickerGramaje,
        meditionStyle: FormYupSchemas.meditionStyle,
        fullVal: FormYupSchemas.fullVal,
        medVal: FormYupSchemas.medVal,
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
                innerRef={meditionStyleForm}
                initialValues={{
                    pickerGramaje: stategramajeFk,
                    meditionStyle: statemeditionType,
                    fullVal: stateFullVal,
                    medVal: stateMedlVal,
                }}
                validationSchema={schemasValidation}
                onSubmit={values => {
                    if (props.typeform === 'ACTUALIZAR' && props.registerID > 0) {
                        const updateArr = [values.meditionStyle, parseFloat(values.fullVal), values.pickerGramaje, parseFloat(values.medVal), props.registerID];
                        genericUpdatefunction(updateMeditionStyleByID, updateArr)
                            .then(result => {
                                if (result.rowsAffected > 0) {
                                    showToast('Actualizado con éxito', false);
                                } else {
                                    showToast('Error al actualizar');
                                }
                            })
                            .catch(err => {
                                showToast('Error al actualizar');
                            })
                    }
                    if (props.typeform === 'CREAR') {
                        //row order: meditionid(ai) = null, medition_type, full_value, gramaje_fk, media_value
                        const insertArr = [null, values.meditionStyle, values.fullVal, values.pickerGramaje, values.medVal];
                        genericInsertFunction(insertMeditionStyle, insertArr)
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
                        meditionStyleForm.current?.resetForm()
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
                        <View style={{padding: 10}}>
                            {(errors.pickerGramaje && touched.pickerGramaje) &&
                            < Text style={{fontSize: 10, color: 'red'}}>{errors.pickerGramaje}</Text>
                            }
                            <View style={style.contpicker}>
                                <View style={styles.IconStyle}>
                                    <SvgComponent
                                        svgData={gramaje}
                                        svgWidth={45}
                                        svgHeight={45}
                                    />
                                </View>
                                <View style={{flex: 1, paddingLeft: 10}}>
                                    {gramajeDB.length > 0 ?
                                        <CustomPicker
                                            _typeform={props.typeform}
                                            ref={gramajeRef}
                                            style={{
                                                borderWidth: .5,
                                                borderColor: COLORS.black,
                                            }}
                                            name={'pickerGramaje'}
                                            itemStyle={{fontFamily: 'Anton'}}
                                            mode={'dropdown'}
                                            value={values.pickerGramaje}
                                            selectedValue={values.pickerGramaje}
                                            onValueChange={(itemValue) => {
                                                if (itemValue > 0) {
                                                    handleChange('pickerGramaje')
                                                    setFieldTouched('pickerGramaje', true)
                                                    setFieldValue('pickerGramaje', itemValue)
                                                } else {
                                                    showToast("Debes escoger una opción válida...")
                                                }
                                            }}
                                            dataOptionsPicker={gramajeDB.map((item, index) => {
                                                return <Picker.Item key={index}
                                                                    label={item.gramaje_value + ' gr/cm'}
                                                                    value={item.gramaje_id}/>
                                            })}
                                            defaultItemLabel={'Escoge un gramaje'}
                                        />
                                        :
                                        null
                                    }
                                </View>
                            </View>
                        </View>
                        {(errors.meditionStyle && touched.meditionStyle) &&
                        < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.meditionStyle}</Text>
                        }
                        <CustomTextInput
                            _ref={medicionRef}
                            svgData={nombre}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Nombre para medición...'}
                            text={''}
                            // type={'numeric'}
                            _name={'meditionStyle'}
                            _onChangeText={handleChange('meditionStyle')}
                            _onBlur={handleBlur('meditionStyle')}
                            value={values.meditionStyle}
                            _defaultValue={values.meditionStyle}
                        />
                        {(errors.fullVal && touched.fullVal) &&
                        <Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.fullVal}</Text>
                        }
                        <CustomTextInput
                            _ref={fullValRef}
                            svgData={bobinaFull}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Valor bobina entera...'}
                            text={''}
                            type={'numeric'}
                            _name={'fullVal'}
                            _onChangeText={handleChange('fullVal')}
                            _onBlur={handleBlur('fullVal')}
                            value={values.fullVal}
                            _defaultValue={values.fullVal}
                        />
                        {(errors.medVal && touched.medVal) &&
                        <Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.medVal}</Text>
                        }
                        <CustomTextInput
                            _ref={medValRef}
                            svgData={bobinaMed}
                            svgWidth={40}
                            svgHeight={40}
                            placeholder={'Valor media bobina...'}
                            text={''}
                            type={'numeric'}
                            _name={'medVal'}
                            _onChangeText={handleChange('medVal')}
                            _onBlur={handleBlur('medVal')}
                            value={values.medVal}
                            _defaultValue={values.medVal}
                        />
                        {
                            !isValid &&
                            <ResetButtonForm
                                _style={{
                                    position: 'relative'
                                }}
                                resetState_elementPrevProdction={() => meditionStyleForm.current?.resetForm()}
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
};
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
    contpicker: {
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
export default MeditionStyleCrud;