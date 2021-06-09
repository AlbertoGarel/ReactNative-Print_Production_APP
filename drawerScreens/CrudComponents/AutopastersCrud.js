import React, {useEffect, useState, useRef} from 'react';
import {Alert, StyleSheet, View, Text, Picker, TouchableOpacity} from 'react-native';
import {pickerLineaProd, insertaAutopasterByID, autopasterByID, updateAutoasterByID} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import {FormYupSchemas} from "../../components/form/YupSchemas";
import {COLORS} from "../../assets/defaults/settingStyles";
import SvgComponent from "../../components/SvgComponent";
import {lineaprodSVG, nombre, coeficienteSVG, mediaSVG, favoriteSVG} from "../../assets/svg/svgContents";
import CustomPicker from "../../components/form/CustomPicker";
import CustomTextInput from "../../components/form/CustomTextInput";
import {Formik} from "formik";
import * as Yup from "yup";
import HRtag from "../../components/HRtag";
import ToastMesages from "../../components/ToastMessages";
import ResetButtonForm from "../../components/form/ResetButtonForm";
import {genericUpdatefunction, genericInsertFunction} from '../../dbCRUD/actionsFunctionsCrud'

const AutopastersCrud = ({props}) => {

    const db = SQLite.openDatabase('bobinas.db');
    const autopastersForm = useRef();
    const linprodRef = useRef();
    const autopasNameRef = useRef();
    const autopastPrefRef = useRef();
    const autopastContainMediaRef = useRef();
    const medRef = useRef();

    const [linProdDB, setLinProdDB] = useState([]);
    //if min value for formik is 1, in state will 0.
    const [stateLinProdFk, setStateLinProdFK] = useState(0);
    const [stateAutopastName, setStateAutopastName] = useState('');
    //for item picker values 0 and 1 (true / false ), negative value.
    const [stateAutopastContainMedia, setStateAutopastContainMedia] = useState(-1);

    useEffect(() => {
        let isActive = true;

        //SET VALUES FOR UPDATE
        if (props.typeform === 'ACTUALIZAR' && props.registerID > 0 && isActive) {
            //autopaster ID REQUEST
            db.transaction(tx => {
                tx.executeSql(
                    autopasterByID,
                    [props.registerID],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            //clone array
                            const responsetObj = [..._array];
                            // setLinProdDB(..._array);
                            setStateAutopastName(responsetObj[0].name_autopaster);
                            setStateLinProdFK(responsetObj[0].linea_fk);
                            setStateAutopastContainMedia(responsetObj[0].media)
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
                pickerLineaProd,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        setLinProdDB(_array);
                    } else {
                        console.log('Error al conectar base de datos en IndividualCalculation Component');
                    }
                }
            );
        });

        return () => isActive = false;
    }, []);

    const schemasValidation = Yup.object().shape({
        pickerLinProd: FormYupSchemas.pickerGramaje,
        autopastName: FormYupSchemas.meditionStyle,
        autopastContMed: FormYupSchemas.trueFalseBin,
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
                innerRef={autopastersForm}
                initialValues={{
                    pickerLinProd: stateLinProdFk,
                    autopastName: stateAutopastName,
                    autopastContMed: stateAutopastContainMedia
                }}
                validationSchema={schemasValidation}
                onSubmit={values => {
                    if (props.typeform === 'ACTUALIZAR' && props.registerID > 0) {
                        // row order: name_autopast = ?, autopastPref = ?, linea_fk = ?, autopast_id = ?
                        const updateArr = [values.autopastName, values.pickerLinProd, values.autopastContMed, props.registerID];
                        genericUpdatefunction(updateAutoasterByID, updateArr)
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
                        //row order: coefKbaid(ai) = null, name_autopaster, linea_fk, media
                        const insertArr = [null, values.autopastName, values.pickerLinProd, values.autopastContMed];
                        genericInsertFunction(insertaAutopasterByID, insertArr)
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
                        autopastersForm.current?.resetForm();
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
                            {(errors.pickerLinProd && touched.pickerLinProd) &&
                            < Text style={{fontSize: 10, color: 'red'}}>{errors.pickerLinProd}</Text>
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
                                    {linProdDB.length > 0 ?
                                        <CustomPicker
                                            _typeform={props.typeform}
                                            ref={linprodRef}
                                            style={{
                                                borderWidth: .5,
                                                borderColor: COLORS.black,
                                            }}
                                            name={'pickerLinProd'}
                                            itemStyle={{fontFamily: 'Anton'}}
                                            mode={'dropdown'}
                                            value={values.pickerLinProd}
                                            selectedValue={values.pickerLinProd}
                                            onValueChange={(itemValue) => {
                                                if (itemValue > 0) {
                                                    handleChange('pickerLinProd')
                                                    setFieldTouched('pickerLinProd', true)
                                                    setFieldValue('pickerLinProd', itemValue)
                                                } else {
                                                    showToast("Debes escoger una opción válida...")
                                                }
                                            }}
                                            dataOptionsPicker={linProdDB.map((item, index) => {
                                                return <Picker.Item key={index}
                                                                    label={item.linea_name}
                                                                    value={item.linea_id}/>
                                            })}
                                            defaultItemLabel={'Escoge una línea de producción...'}
                                        />
                                        :
                                        null
                                    }
                                </View>
                            </View>
                        </View>
                        {(errors.autopastName && touched.autopastName) &&
                        < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.autopastName}</Text>
                        }
                        <CustomTextInput
                            // _ref={autopasNameRef}
                            svgData={nombre}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Nombre para autopaster...'}
                            text={''}
                            type={'default'}
                            _name={'autopastName'}
                            _onChangeText={handleChange('autopastName')}
                            _onBlur={handleBlur('autopastName')}
                            value={values.autopastName}
                            _defaultValue={values.autopastName}
                        />
                        <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                            {(errors.autopastContMed && touched.autopastContMed) &&
                            < Text style={{fontSize: 10, color: 'red'}}>{errors.autopastContMed}</Text>
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
                                        svgData={mediaSVG}
                                        svgWidth={45}
                                        svgHeight={45}
                                    />
                                </View>
                                <View style={{flex: 1, paddingLeft: 10}}>
                                    {linProdDB.length > 0 ?
                                        <CustomPicker
                                            _typeform={props.typeform}
                                            ref={medRef}
                                            style={{
                                                borderWidth: .5,
                                                borderColor: COLORS.black,
                                            }}
                                            name={'autopastContMed'}
                                            itemStyle={{fontFamily: 'Anton'}}
                                            mode={'dropdown'}
                                            value={values.autopastContMed}
                                            selectedValue={values.autopastContMed}
                                            onValueChange={(itemValue) => {
                                                if (itemValue >= 0) {
                                                    handleChange('autopastContMed')
                                                    setFieldTouched('autopastContMed', true)
                                                    setFieldValue('autopastContMed', itemValue)
                                                } else {
                                                    showToast("Debes escoger una opción válida...")
                                                }
                                            }}
                                            dataOptionsPicker={[
                                                {
                                                    name: 'Entera', value: 0
                                                },
                                                {
                                                    name: 'Media', value: 1
                                                }
                                            ].map((item, index) => {
                                                return <Picker.Item key={index}
                                                                    label={item.name}
                                                                    value={item.value}/>
                                            })}
                                            defaultItemLabel={'Tipo de bobina...'}
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
                                resetState_elementPrevProdction={() => autopastersForm.current?.resetForm()}
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
    }
});
export default AutopastersCrud;