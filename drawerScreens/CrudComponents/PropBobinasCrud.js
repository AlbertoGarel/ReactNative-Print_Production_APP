import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {papelComunByID, insertPapelcomun, updatePapelComunByID} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import * as Yup from "yup";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import {genericInsertFunction, genericUpdatefunction} from "../../dbCRUD/actionsFunctionsCrud";
import {Formik} from "formik";
import {COLORS} from "../../assets/defaults/settingStyles";
import HRtag from "../../components/HRtag";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import {propietarioSVG} from "../../assets/svg/svgContents";
import ResetButtonForm from "../../components/FormComponents/ResetButtonForm";
import ToastMesages from "../../components/ToastMessages";

const PropBobinasCrud = ({props}) => {

    const db = SQLite.openDatabase('bobinas.db');
    const propBobForm = useRef();
    const propBobRef = useRef();

    const [linProdState, setLinProdState] = useState();

    useEffect(() => {
        let isActive = true;
        //SET VALUES FOR UPDATE
        if (props.typeform === 'ACTUALIZAR' && props.registerID > 0 && isActive) {
            //GRAMAJE ID REQUEST
            db.transaction(tx => {
                tx.executeSql(
                    papelComunByID,
                    [props.registerID],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            //clone array
                            const responsetObj = [..._array];
                            setLinProdState(responsetObj[0].papel_comun_name)
                        } else {
                            console.log('Error al conectar base de datos en IndividualCalculation Component');
                        }
                    }
                );
            });
        }

        return () => isActive = false;
    }, []);

    const schemasValidation = Yup.object().shape({
        propBob: FormYupSchemas.linProdVal,
    });

    let toastRef;
    const showToast = (message, isError = true) => {
        if (!isError) {
            toastRef.props.style.backgroundColor = '#00ff00';
        }
        toastRef.show(message);
    };

    const formPagination = () => {
        return (
            <Formik
                enableReinitialize
                innerRef={propBobForm}
                initialValues={{
                    propBob: linProdState,
                }}
                validationSchema={schemasValidation}
                onSubmit={values => {
                    if (props.typeform === 'ACTUALIZAR' && props.registerID > 0) {
                        const updateArr = [values.propBob, props.registerID];
                        genericUpdatefunction(updatePapelComunByID, updateArr)
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
                        // row order: linea_id(ai) = null, linea_name
                        const insertArr = [null, values.propBob];
                        genericInsertFunction(insertPapelcomun, insertArr)
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
                        propBobForm.current?.resetForm();
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
                        {(errors.propBob && touched.propBob) &&
                        < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.propBob}</Text>
                        }
                        <CustomTextInput
                            _ref={propBobRef}
                            svgData={propietarioSVG}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Ingresa nombre de propiedad...'}
                            text={''}
                            type={'default'}
                            _name={'propBob'}
                            _onChangeText={handleChange('propBob')}
                            _onBlur={handleBlur('propBob')}
                            value={values.propBob}
                            _defaultValue={values.propBob}
                        />
                        {
                            !isValid &&
                            <ResetButtonForm
                                _style={{
                                    position: 'relative'
                                }}
                                resetState_elementPrevProdction={() => propBobForm.current?.resetForm()}
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
    };

    return (
        <View>
            {formPagination()}
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
export default PropBobinasCrud;