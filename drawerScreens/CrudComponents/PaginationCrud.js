import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {paginationByID, updatePaginationByID, insertPagination} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import * as Yup from "yup";
import {FormYupSchemas} from "../../components/FormComponents/YupSchemas";
import {genericInsertFunction, genericUpdatefunction} from "../../dbCRUD/actionsFunctionsCrud";
import {Formik} from "formik";
import {COLORS} from "../../assets/defaults/settingStyles";
import HRtag from "../../components/HRtag";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import {paginationSVG} from "../../assets/svg/svgContents";
import ResetButtonForm from "../../components/FormComponents/ResetButtonForm";
import ToastMesages from "../../components/ToastMessages";
import {Sentry_Alert} from "../../utils";

const PaginationCrud = ({props}) => {

    const db = SQLite.openDatabase('bobinas.db');
    const PaginationForm = useRef();
    const paginationRef = useRef();

    const [paginationState, setPaginationState] = useState();

    useEffect(() => {
        let isActive = true;
        //SET VALUES FOR UPDATE
        if (props.typeform === 'ACTUALIZAR' && props.registerID > 0 && isActive) {
            //GRAMAJE ID REQUEST
            db.transaction(tx => {
                tx.executeSql(
                    paginationByID,
                    [props.registerID],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            //clone array
                            const responsetObj = [..._array];
                            setPaginationState(responsetObj[0].paginacion_value.toString())
                        } else {
                            console.log('Error al conectar base de datos en IndividualCalculation Component');
                        }
                    }
                );
            }, err => Sentry_Alert('PaginationCrud.js', 'transaction - paginationByID', err));
        }

        return () => isActive = false;
    }, []);

    const schemasValidation = Yup.object().shape({
        pagination: FormYupSchemas.paginationVal,
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
                innerRef={PaginationForm}
                initialValues={{
                    pagination: paginationState,
                }}
                validationSchema={schemasValidation}
                onSubmit={values => {
                    if (props.typeform === 'ACTUALIZAR' && props.registerID > 0) {
                        const updateArr = [values.pagination, props.registerID];
                        genericUpdatefunction(updatePaginationByID, updateArr)
                            .then(result => {
                                if (result.rowsAffected > 0) {
                                    showToast('Actualizado con éxito', false)
                                } else {
                                    showToast('Error al actualizar')
                                }
                            })
                            .catch(err => {
                                showToast('Error al actualizar');
                            });
                    }
                    if (props.typeform === 'CREAR') {
                        //row order: paginationid(ai) = null, pagination
                        const insertArr = [null, values.pagination];
                        genericInsertFunction(insertPagination, insertArr)
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
                        PaginationForm.current?.resetForm();
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
                        {(errors.pagination && touched.pagination) &&
                        < Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.pagination}</Text>
                        }
                        <CustomTextInput
                            _ref={paginationRef}
                            svgData={paginationSVG}
                            svgWidth={50}
                            svgHeight={50}
                            placeholder={'Ingresa valor de paginación...'}
                            text={''}
                            type={'numeric'}
                            _name={'pagination'}
                            _onChangeText={handleChange('pagination')}
                            _onBlur={handleBlur('pagination')}
                            value={values.pagination}
                            _defaultValue={values.pagination}
                        />
                        {
                            !isValid &&
                            <ResetButtonForm
                                _style={{
                                    position: 'relative'
                                }}
                                resetState_elementPrevProdction={() => PaginationForm.current?.resetForm()}
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
export default PaginationCrud;