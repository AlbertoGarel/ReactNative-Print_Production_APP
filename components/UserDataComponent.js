import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions} from 'react-native';
import {Formik} from "formik";
import CustomTextInput from "./FormComponents/CustomTextInput";
import {userSVG} from "../assets/svg/svgContents";
import * as Yup from "yup";
import {FormYupSchemas} from "./FormComponents/YupSchemas";
import {COLORS} from "../assets/defaults/settingStyles";
import {getDatas, storeData} from "../data/AsyncStorageFunctions";
import ResetButtonForm from "./FormComponents/ResetButtonForm";
import ToastMesages from "./ToastMessages";

const UserDataComponent = ({props}) => {

    const UserNameRef = useRef();
    const UserDataFormRef = useRef();

    const [userNameState, setUserNameState] = useState('');

    const SchemaDataUser = Yup.object().shape({
        username: FormYupSchemas.onlyLeters
    });

    useEffect(() => {
        let isMounted = true;
        getDatas('@UserDataForm').then(name => {
            if (!name) {
                setUserNameState('');
            }
            if (name) {
                setUserNameState(name);
            }
        })
            .catch(err => Alert.alert(err))
        return () => isMounted = false;
    }, []);

    return (
        <View style={{width: Dimensions.get('window').width, flex: 1}}>
            <Formik
                enableReinitialize
                innerRef={UserDataFormRef}
                initialValues={{
                    username: userNameState
                }}
                validationSchema={SchemaDataUser}
                onSubmit={values => {
                    storeData('@UserDataForm', values.username)
                        .then(store => {
                            props.showToast('guardando...');
                        })
                        .catch(err => {
                            console.log(err)
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
                            // backgroundColor: 'red',
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}>
                            {(errors.username && touched.username) &&
                            < Text
                                style={{fontSize: 10, color: 'red', marginLeft: 10}}>{errors.username}</Text>
                            }
                            <CustomTextInput
                                // _ref={UserNameRef}
                                svgData={userSVG}
                                svgWidth={50}
                                svgHeight={50}
                                placeholder={'Ejemplares bruto...'}
                                text={'Nombre:'}
                                _name={'username'}
                                _onChangeText={handleChange('username')}
                                _onBlur={handleBlur('username')}
                                value={values.username}
                                _defaultValue={values.username}
                            />
                            <TouchableOpacity
                                style={{
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
                                    opacity: !isValid ? .1 : 1
                                }}
                                color="#841584"
                                accessibilityLabel="calcular resultado de bobina"
                                onPress={handleSubmit}
                                title="Submit"
                                disabled={!isValid}
                            >
                                <Text style={{color: COLORS.white, fontFamily: 'Anton', fontSize: 20}}>Guardar</Text>
                            </TouchableOpacity>
                            <Text style={{
                                paddingLeft: 5,
                                paddingRight: 5,
                                borderRadius: 5,
                                backgroundColor: '#ffffff',
                                color: COLORS.warning,
                                fontFamily: 'Anton',
                                alignSelf: 'flex-start'
                            }}>* Datos
                                almacenados en
                                local.</Text>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
};

const styles = StyleSheet.create({
    text: {
        color: 'green'
    }
});

export default UserDataComponent;