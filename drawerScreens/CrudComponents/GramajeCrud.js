import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {gramajeByID, updategramajeByID, insertGramaje} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import * as Yup from "yup";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import {genericInsertFunction, genericUpdatefunction} from "../../dbCRUD/actionsFunctionsCrud";
import {Formik} from "formik";
import {COLORS} from "../../assets/defaults/settingStyles";
import HRtag from "../../components/HRtag";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import {gramaje} from "../../assets/svg/svgContents";
import ResetButtonForm from "../../components/FormComponents/ResetButtonForm";
import ToastMesages from "../../components/ToastMessages";
import {Sentry_Alert} from "../../utils";

const GramajeCrud = ({props}) => {

    const db = SQLite.openDatabase('bobinas.db');
    const gramajeForm = useRef();
    const gramajeRef = useRef();

    const [gramajeState, setGramajeState] = useState();

    useEffect(() => {
        let isActive = true;
        //SET VALUES FOR UPDATE
        if (props.typeform === 'ACTUALIZAR' && props.registerID > 0 && isActive) {
            //GRAMAJE ID REQUEST
            db.transaction(tx => {
                tx.executeSql(
                    gramajeByID,
                    [props.registerID],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            //clone array
                            const responsetObj = [..._array];
                            setGramajeState(responsetObj[0].gramaje_value.toString())
                        }
                    }
                );
            }, err => Sentry_Alert('GramajeCrud.js', 'transaction - gramajeByID', err));
        }

        return () => isActive = false;
    }, []);

    const schemasValidation = Yup.object().shape({
        gramaje: FormYupSchemas.gramajeVal,
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
                innerRef={gramajeForm}
                initialValues={{
                    gramaje: gramajeState,
                }}
                validationSchema={schemasValidation}
                onSubmit={values => {
                    if (props.typeform === 'ACTUALIZAR' && props.registerID > 0) {
                        const updateArr = [values.gramaje, props.registerID];
                        genericUpdatefunction(updategramajeByID, updateArr)
                            .then(result => {
                                if (result.rowsAffected > 0) {
                                    showToast('Actualizado con éxito', false)
                                } else {
                                    showToast('Error al actualizar')
                                }
                            })
                            .catch(err => {
                                showToast('Error al actualizar')
                            })
                    }
                    if (props.typeform === 'CREAR') {
                        // row order: gramajeID(ai) = null, gramaje
                        const insertArr = [null, values.gramaje];
                        genericInsertFunction(insertGramaje, insertArr)
                            .then(result => {
                                if (result.rowsAffected > 0) {
                                    showToast('Creado con éxito', false)
                                } else {
                                    showToast('Error al crear registro')
                                }
                            })
                            .catch(err => {
                                showToast('Error al crear registro')
                            })
                        gramajeForm.current?.resetForm()
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
                        {(errors.gramaje && touched.gramaje) &&
                        < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.gramaje}</Text>
                        }
                        <CustomTextInput
                            _ref={gramajeRef}
                            svgData={gramaje}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Ingresa valor de gramaje...'}
                            text={''}
                            type={'numeric'}
                            _name={'gramaje'}
                            _onChangeText={handleChange('gramaje')}
                            _onBlur={handleBlur('gramaje')}
                            value={values.gramaje}
                            _defaultValue={values.gramaje}
                        />
                        {
                            !isValid &&
                            <ResetButtonForm
                                _style={{
                                    position: 'relative'
                                }}
                                resetState_elementPrevProdction={() => gramajeForm.current?.resetForm()}
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

export default GramajeCrud;