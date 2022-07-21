import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {Formik} from "formik";
import CustomTextInput from "./FormComponents/CustomTextInput";
import {emailSVG, enterpriseSVG, userSVG} from "../assets/svg/svgContents";
import * as Yup from "yup";
import {FormYupSchemas} from "./FormComponents/YupSchemas";
import {COLORS} from "../assets/defaults/settingStyles";
import {getDatas, storeData} from "../data/AsyncStorageFunctions";

const UserDataComponent = ({props}) => {

    const UserDataFormRef = useRef();

    const [userNameState, setUserNameState] = useState('');
    const [enterpriseNameState, setEnterpriseNameState] = useState('');
    const [emailState, setEmailState] = useState('');

    const SchemaDataUser = Yup.object().shape({
        username: FormYupSchemas.onlyLeters,
        enterprisename: FormYupSchemas.onlyLeters,
        email: FormYupSchemas.email
    });

    useEffect(() => {
        let isMounted = true;
        getDatas('@UserDataForm').then(obj => {
            if (!obj) {
                setUserNameState('');
                setEnterpriseNameState('')
                setEmailState('')
            }
            if (obj) {
                setUserNameState(obj.name);
                setEnterpriseNameState(obj.enterprise)
                setEmailState(obj.email)
            }
        })
            .catch(err => console.log(err))
        return () => isMounted = false;
    }, []);

    return (
        <View style={{width: Dimensions.get('window').width, flex: 1}}>
            <Formik
                enableReinitialize
                innerRef={UserDataFormRef}
                initialValues={{
                    username: userNameState,
                    enterprisename: enterpriseNameState,
                    email: emailState
                }}
                validationSchema={SchemaDataUser}
                onSubmit={values => {
                    storeData('@UserDataForm', {
                        name: values.username,
                        enterprise: values.enterprisename,
                        email: values.email
                    })
                        .then(() => {
                            props.showToast('guardando...');
                        })
                        .catch(err => {
                            if (__DEV__) {
                                console.log(err)
                            }
                        })
                }}
            >
                {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      isValid
                  }) => (
                    <>
                        <View style={{
                            width: Dimensions.get('window').width - 20,
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}>
                            {(errors.username && touched.username) &&
                            < Text
                                style={styles.stylErrors}>{errors.username}</Text>
                            }
                            <CustomTextInput
                                svgData={userSVG}
                                svgWidth={50}
                                svgHeight={50}
                                placeholder={'Nombre de operario...'}
                                text={'Operario:'}
                                _name={'username'}
                                _onChangeText={handleChange('username')}
                                _onBlur={handleBlur('username')}
                                value={values.username}
                                _defaultValue={values.username}
                            />
                            {(errors.enterprisename && touched.enterprisename) &&
                            < Text
                                style={styles.stylErrors}>{errors.enterprisename}</Text>
                            }
                            <CustomTextInput
                                svgData={enterpriseSVG}
                                svgWidth={50}
                                svgHeight={50}
                                placeholder={'Nombre de empresa...'}
                                text={'Empresa:'}
                                _name={'enterprisename'}
                                _onChangeText={handleChange('enterprisename')}
                                _onBlur={handleBlur('enterprisename')}
                                value={values.enterprisename}
                                _defaultValue={values.enterprisename}
                            />
                            {(errors.email && touched.email) &&
                            <Text
                                style={styles.stylErrors}>{errors.email}</Text>
                            }
                            <CustomTextInput
                                svgData={emailSVG}
                                svgWidth={45}
                                svgHeight={45}
                                placeholder={'email...'}
                                text={'Email:'}
                                _name={'email'}
                                _onChangeText={handleChange('email')}
                                _onBlur={handleBlur('email')}
                                value={values.email}
                                _defaultValue={values.email}
                            />
                            <TouchableOpacity
                                style={{...styles.touchable, opacity: !isValid ? .1 : 1}}
                                color="#841584"
                                accessibilityLabel="calcular resultado de bobina"
                                onPress={handleSubmit}
                                title="Submit"
                                disabled={!isValid}
                            >
                                <Text style={{color: COLORS.white, fontFamily: 'Anton', fontSize: 20}}>Guardar</Text>
                            </TouchableOpacity>
                            <Text style={styles.textStorage}>* Datos
                                almacenados en
                                local.</Text>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: 'green'
    },
    stylErrors: {
        alignSelf: 'center',
        // borderRadius: 5,
        width: '95%',
        fontSize: 10,
        backgroundColor: 'white',
        color: 'red',
        paddingLeft: 10
    },
    touchable: {
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.colorSupportfiv,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.white,
        alignSelf: 'flex-end',
        margin: 5,
    },
    textStorage: {
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        color: COLORS.warning,
        fontFamily: 'Anton',
        alignSelf: 'flex-start'
    }
});

export default UserDataComponent;