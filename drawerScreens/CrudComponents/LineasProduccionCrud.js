import React, {useState, useEffect, useRef} from 'react';
import {Alert, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {insertLinProd, updateLinProdByID, linProdByID} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import * as Yup from "yup";
import {FormYupSchemas} from "../../components/form/YupSchemas";
import {genericInsertFunction, genericUpdatefunction} from "../../dbCRUD/actionsFunctionsCrud";
import {Formik} from "formik";
import {COLORS} from "../../assets/defaults/settingStyles";
import HRtag from "../../components/HRtag";
import CustomTextInput from "../../components/form/CustomTextInput";
import {lineaprodSVG} from "../../assets/svg/svgContents";
import ResetButtonForm from "../../components/form/ResetButtonForm";
import ToastMesages from "../../components/ToastMessages";

const LineasProduccionCrud = ({props}) => {

    const db = SQLite.openDatabase('bobinas.db');
    const linProdForm = useRef();
    const linProdRef = useRef();

    const [linProdState, setLinProdState] = useState();

    useEffect(() => {
        let isActive = true;
        //SET VALUES FOR UPDATE
        if (props.typeform === 'ACTUALIZAR' && props.registerID > 0 && isActive) {
            //GRAMAJE ID REQUEST
            db.transaction(tx => {
                tx.executeSql(
                    linProdByID,
                    [props.registerID],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            //clone array
                            const responsetObj = [..._array];
                            setLinProdState(responsetObj[0].linea_name)
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
        linProd: FormYupSchemas.linProdVal,
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
                innerRef={linProdForm}
                initialValues={{
                    linProd: linProdState,
                }}
                validationSchema={schemasValidation}
                onSubmit={values => {
                    if (props.typeform === 'ACTUALIZAR' && props.registerID > 0) {
                        const updateArr = [values.linProd, props.registerID];
                        genericUpdatefunction(updateLinProdByID, updateArr)
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
                        // row order: linea_id(ai) = null, linea_name
                        const insertArr = [null, values.linProd];
                        genericInsertFunction(insertLinProd, insertArr)
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
                        linProdForm.current?.resetForm();
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
                        {(errors.linProd && touched.linProd) &&
                        < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.linProd}</Text>
                        }
                        <CustomTextInput
                            _ref={linProdRef}
                            svgData={lineaprodSVG}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Ingresa nombre de línea...'}
                            text={''}
                            type={'default'}
                            _name={'linProd'}
                            _onChangeText={handleChange('linProd')}
                            _onBlur={handleBlur('linProd')}
                            value={values.linProd}
                            _defaultValue={values.linProd}
                        />
                        {
                            !isValid &&
                            <ResetButtonForm
                                _style={{
                                    position: 'relative'
                                }}
                                resetState_elementPrevProdction={() => linProdForm.current?.resetForm()}
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
export default LineasProduccionCrud;