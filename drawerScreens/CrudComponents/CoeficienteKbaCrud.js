import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {picker_gramaje, insertKba, kbaByID, updateKbaByID} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import {COLORS} from "../../assets/defaults/settingStyles";
import SvgComponent from "../../components/SvgComponent";
import {gramaje, nombre, coeficienteSVG} from "../../assets/svg/svgContents";
import CustomPicker from "../../components/FormComponents/CustomPicker";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import {Formik} from "formik";
import * as Yup from "yup";
import HRtag from "../../components/HRtag";
import ToastMesages from "../../components/ToastMessages";
import ResetButtonForm from "../../components/FormComponents/ResetButtonForm";
import {genericUpdatefunction, genericInsertFunction} from '../../dbCRUD/actionsFunctionsCrud';
import {Picker} from '@react-native-picker/picker';

const CoeficienteKbaCrud = ({props}) => {

    const db = SQLite.openDatabase('bobinas.db');
    const meditionStyleForm = useRef();
    const gramajeRef = useRef();
    const kbaRef = useRef();
    const kbaValRef = useRef();

    const [gramajeDB, setgramajeDB] = useState([]);
    const [stateKbaName, setStateKbaName] = useState('');
    const [stategramajeFk, setStateGramajeFK] = useState(0);
    const [stateKbaVal, setStateKbaVal] = useState();

    useEffect(() => {
        let isActive = true;

        //SET VALUES FOR UPDATE
        if (props.typeform === 'ACTUALIZAR' && props.registerID > 0 && isActive) {
            //GRAMAJE ID REQUEST
            db.transaction(tx => {
                tx.executeSql(
                    kbaByID,
                    [props.registerID],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            //clone array
                            const responsetObj = [..._array];
                            // setgramajeDB(..._array);
                            setStateKbaName(responsetObj[0].kba_name);
                            setStateGramajeFK(responsetObj[0].gramaje_fk);
                            setStateKbaVal(responsetObj[0].kba_value.toString());
                        } else {
                            console.log('Error al conectar base de datos en IndividualCalculation Component');
                        }
                    }
                );
            });
        }

        //GRAMAJE ALL REQUEST
        db.transaction(tx => {
            tx.executeSql(
                picker_gramaje,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        setgramajeDB(_array);
                    } else {
                        console.log('Error al conectar base de datos en IndividualCalculation Component');
                    }
                }
            );
        });

        return () => isActive = false;
    }, []);

    const schemasValidation = Yup.object().shape({
        pickerGramaje: FormYupSchemas.pickerGramaje,
        kbaname: FormYupSchemas.meditionStyle,
        kbaVal: FormYupSchemas.fullVal,
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
                    kbaname: stateKbaName,
                    kbaVal: stateKbaVal,
                }}
                validationSchema={schemasValidation}
                onSubmit={values => {
                    if (props.typeform === 'ACTUALIZAR' && props.registerID > 0) {
                        // row order: kba_name = ?, kba_value = ?, gramaje_fk = ? WHERE kba_id = ?
                        const updateArr = [values.kbaname, parseFloat(values.kbaVal), values.pickerGramaje, props.registerID];
                        genericUpdatefunction(updateKbaByID, updateArr)
                            .then(result => {
                                if (result.rowsAffected > 0) {
                                    showToast('Actualizado con éxito', false)
                                } else {
                                    showToast('Error al actualizar')
                                }
                            })
                            .catch(err => {
                                showToast('Error al actualizar')
                                console.log(err)
                            })
                    }
                    if (props.typeform === 'CREAR') {
                        //row order: coefKbaid(ai) = null, kba_name, kba_value, gramaje_fk
                        const insertArr = [null, values.kbaname, values.kbaVal, values.pickerGramaje];
                        genericInsertFunction(insertKba, insertArr)
                            .then(result => {
                                if (result.rowsAffected > 0) {
                                    showToast('Creado con éxito', false)
                                } else {
                                    showToast('Error al crear registro')
                                }
                            })
                            .catch(err => {
                                showToast('Error al crear registro')
                                console.log(err)
                            })
                        meditionStyleForm.current?.resetForm();
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
                        {(errors.kbaname && touched.kbaname) &&
                        < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.kbaname}</Text>
                        }
                        <CustomTextInput
                            _ref={kbaRef}
                            svgData={nombre}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Nombre para coeficiente...'}
                            text={''}
                            type={'default'}
                            _name={'kbaname'}
                            _onChangeText={handleChange('kbaname')}
                            _onBlur={handleBlur('kbaname')}
                            value={values.kbaname}
                            _defaultValue={values.kbaname}
                        />
                        {(errors.kbaVal && touched.kbaVal) &&
                        <Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.kbaVal}</Text>
                        }
                        <CustomTextInput
                            _ref={kbaValRef}
                            svgData={coeficienteSVG}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Valor de coeficiente...'}
                            text={''}
                            type={'numeric'}
                            _name={'kbaVal'}
                            _onChangeText={handleChange('kbaVal')}
                            _onBlur={handleBlur('kbaVal')}
                            value={values.kbaVal}
                            _defaultValue={values.kbaVal}
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
                        {/*+++*/}
                        {/*DELETE WHENFINISH CRUD*/}
                        {/*+++*/}
                        {/*<Text>{gramajeDB ? JSON.stringify(gramajeDB) : null}</Text>*/}
                        {/*++++++++++*/}
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
    }
});
export default CoeficienteKbaCrud;