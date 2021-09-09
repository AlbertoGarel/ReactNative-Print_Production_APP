import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableOpacity, Alert} from 'react-native';
import {Formik} from "formik";
import {getDatas, removeValue, storeData} from "../data/AsyncStorageFunctions";
import CustomTextInput from "./FormComponents/CustomTextInput";
import {userSVG} from "../assets/svg/svgContents";
import {COLORS} from "../assets/defaults/settingStyles";
import * as Yup from "yup";
import {FormYupSchemas} from "./FormComponents/YupSchemas";

const NullCopiesComponent = ({props}) => {
    const nullCopiesFormRef = useRef();

    const [nullCopiesByEdition, setNullCopiesByEdition] = useState(0);
    const [nullCopiesByDefault, setNullCopiesByDefault] = useState(0);

    useEffect(() => {
        let _isActive = true;
        // removeValue('@NullCopiesData').then(r => r)
        getDatas('@NullCopiesData')
            .then(response => {
                setNullCopiesByEdition(response.nullcopiesbyedition);
                setNullCopiesByDefault(response.nullcopiesbydefault);
            })
            .catch(err => {
                storeData('@NullCopiesData', storeObjResult).then(r => r)
            });

        return () => _isActive = false;
    }, []);

    const storeObjResult = {
        nullcopiesbyedition: 0,
        nullcopiesbydefault: 0
    }

    const SchemaNullCopies = Yup.object().shape({
        nullcopiesbyedition: FormYupSchemas.onlyNumbersNullCopies,
        nullcopiesbydefault: FormYupSchemas.onlyNumbersPercentage,
    });

    return (
        <View style={{width: Dimensions.get('window').width, flex: 1}}>
            <Formik
                enableReinitialize
                innerRef={nullCopiesFormRef}
                initialValues={{
                    nullcopiesbyedition: Math.round(nullCopiesByEdition),
                    nullcopiesbydefault: Math.round(nullCopiesByDefault)
                }}
                validationSchema={SchemaNullCopies}
                onSubmit={values => {
                    storeObjResult.nullcopiesbyedition = values.nullcopiesbyedition
                    storeObjResult.nullcopiesbydefault = values.nullcopiesbydefault

                    storeData('@NullCopiesData', storeObjResult)
                        .then(store => {
                            setNullCopiesByEdition(values.nullcopiesbyedition);
                            setNullCopiesByDefault(values.nullcopiesbydefault);
                            props.showToast('guardando...');
                        })
                        .catch(err => {
                            props.showToast('ERROOOOOOOR');
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
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}>
                            <View
                                style={
                                    (errors.nullcopiesbyedition && touched.nullcopiesbyedition) && {
                                        backgroundColor: '#ffffff',
                                        paddingTop: 5,
                                        borderRadius: 5,
                                    } ||
                                    (errors.nullcopiesbydefault && touched.nullcopiesbyedition) && {
                                        backgroundColor: '#ffffff',
                                        paddingTop: 15,
                                        borderRadius: 5
                                    }
                                }>
                                {(errors.nullcopiesbyedition && touched.nullcopiesbyedition) &&
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color: 'red',
                                        marginLeft: 10,
                                        paddingLeft: 5,
                                    }}>{errors.nullcopiesbyedition}</Text>
                                }
                                <CustomTextInput
                                    svgData={userSVG}
                                    svgWidth={50}
                                    svgHeight={50}
                                    // placeholder={'Ejemplares bruto...'}
                                    text={'Por edición:'}
                                    type={'numeric'}
                                    _name={'nullcopiesbyedition'}
                                    _onChangeText={handleChange('nullcopiesbyedition')}
                                    _onBlur={handleBlur('nullcopiesbyedition')}
                                    value={values.nullcopiesbyedition}
                                    _defaultValue={values.nullcopiesbyedition.toString()}
                                />
                                {(errors.nullcopiesbydefault && touched.nullcopiesbydefault) &&
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color: 'red',
                                        marginLeft: 10,
                                        paddingLeft: 5,
                                    }}>{errors.nullcopiesbydefault}</Text>
                                }
                                <CustomTextInput
                                    svgData={userSVG}
                                    svgWidth={50}
                                    svgHeight={50}
                                    // placeholder={'Ejemplares bruto...'}
                                    text={'Por tirada %:'}
                                    type={'numeric'}
                                    _name={'nullcopiesbydefault'}
                                    _onChangeText={handleChange('nullcopiesbydefault')}
                                    _onBlur={handleBlur('nullcopiesbydefault')}
                                    value={values.nullcopiesbydefault}
                                    _defaultValue={values.nullcopiesbydefault.toString()}
                                />
                                <View style={{paddingLeft: 20}}>
                                    <Text style={[styles.exampleTitle, styles.exampleComp]}>Ejemplo: </Text>
                                    <Text style={[styles.example, styles.exampleComp]}>con 1000 ejemplares serían nulos:
                                        <Text style={{color: COLORS.buttonEdit}}> {(1000 * nullCopiesByDefault) / 100}</Text>
                                    </Text>
                                    <Text style={[styles.example, styles.exampleComp]}>con 10.000 ejemplares serían
                                        nulos:
                                        <Text style={{color: COLORS.buttonEdit}}> {(10000 * nullCopiesByDefault) / 100}</Text>
                                    </Text>
                                </View>
                            </View>
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
                            }}
                            >* Datos almacenados en local.</Text>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
};
const styles = StyleSheet.create({
    exampleTitle: {
        textTransform: 'uppercase',
    },
    example: {
        marginLeft: 20,

    },
    exampleComp: {
        color: COLORS.black,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 12
    }
});
export default NullCopiesComponent;