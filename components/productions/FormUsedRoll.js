import React, {useState} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import * as Yup from "yup";
import {COLORS} from "../../assets/defaults/settingStyles";
import {Formik} from "formik";
import CustomTextInput from "../FormComponents/CustomTextInput";
import {peso, radio} from "../../assets/svg/svgContents";
import * as SQLite from "expo-sqlite";
import {Sentry_Alert} from "../../utils";

const FormUsedRoll = ({props}) => {
    const db = SQLite.openDatabase('bobinas.db');
    const registerUsedRollRef = React.useRef();
    const [selectedUsedRollWeight, getSelectedUsedRollWeight] = useState('');
    const [calculatedRadius, setCalculatedRadius] = useState('');
    const [activityIndicatorVisble, setActivityIndicatorVisible] = useState(false);
    const registerUsedRollSchema = Yup.object().shape({
        inputUsedRoll: Yup.number().max(props.item.originalWeight, `El valor debe ser menor que el peso de fabricación.`)
            .min(0, 'Introduce un valor v´lido')
            .required('required'),
    });

    const searchCoef = (weightAct, weightOr) => {
        setActivityIndicatorVisible(true);
        const searchCoefMinProx =
            `SELECT *
                FROM coeficiente_table
                ORDER BY ABS(coeficiente_value - ?)
                LIMIT 1`
        ;
        // FIND THE MINIMUM ROLL RADIUS VALUE
        const coefResult = (Math.round(weightAct) / Math.round(weightOr)).toFixed(2);
        db.transaction(tx => {
                tx.executeSql(
                    searchCoefMinProx,
                    [coefResult],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            //RETURN RADIUS
                            setCalculatedRadius(_array[0].medida);
                            setActivityIndicatorVisible(false);
                        }
                    }
                )
            }, err => Sentry_Alert('FormUsedRoll.js', 'transaction - searchCoefMinProx', err)
        )
    };

    return (
        <View style={{
            backgroundColor: '#C3E0E5',
            width: '100%',
            height: '100%'
        }}>
            <View style={{
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
                margin: 5,
                borderRadius: 5,
                borderBottomWidth: 2,
            }}><Text style={{
                fontSize: 20,
                fontFamily: 'Anton',
                color: COLORS.black,
            }}><Text style={{fontSize: 15, color: '#189AB4'}}>Código: </Text>{props.item.scanCode}</Text></View>
            <View style={{marginTop: 10}}>
                <Formik
                    enableReinitialize={true}
                    innerRef={registerUsedRollRef}
                    initialValues={{
                        inputUsedRoll: selectedUsedRollWeight,
                        calculatedradius: calculatedRadius
                    }}
                    validationSchema={registerUsedRollSchema}
                    onSubmit={values => {
                        const usedRollDataProps = props.item;
                        usedRollDataProps.actualWeight = Math.round(parseInt((values.inputUsedRoll)));
                        usedRollDataProps.radius = values.calculatedradius;
                        //SAVE TO BBDD.
                        props.registerNewBobina(usedRollDataProps, 'insert')
                        props.HandlerCloseRollUsedForm()
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
                            <View>
                                {(errors.inputUsedRoll && touched.inputUsedRoll) &&
                                <Text style={{
                                    fontSize: 10,
                                    color: 'red',
                                    marginLeft: 10
                                }}>{errors.inputUsedRoll}</Text>
                                }
                                <CustomTextInput
                                    svgData={peso}
                                    svgWidth={50}
                                    svgHeight={50}
                                    placeholder={'establece el peso...'}
                                    text={'Peso'}
                                    type={'numeric'}
                                    styled={{marginBottom: 10}}
                                    _name={'inputUsedRoll'}
                                    _onChangeText={handleChange('inputUsedRoll')}
                                    _onBlur={() => {
                                        handleBlur('inputUsedRoll')
                                        searchCoef(values.inputUsedRoll, props.item.originalWeight);
                                    }}
                                    _onEndEditing={() => getSelectedUsedRollWeight(values.inputUsedRoll)}
                                    value={selectedUsedRollWeight}
                                    _defaultValue={selectedUsedRollWeight}
                                />
                            </View>
                            <View>
                                {!activityIndicatorVisble ?
                                    <CustomTextInput
                                        svgData={radio}
                                        svgWidth={50}
                                        svgHeight={50}
                                        placeholder={'establece el peso...'}
                                        text={'Radio'}
                                        type={'numeric'}
                                        styled={{marginBottom: 10}}
                                        _name={'calculatedradius'}
                                        value={calculatedRadius}
                                        _defaultValue={calculatedRadius.toString()}
                                        noEditable={true}
                                    />
                                    :
                                    <ActivityIndicator size="large" color={COLORS.buttonEdit}/>
                                }
                            </View>
                            <TouchableOpacity
                                style={[styles.touchable, {
                                    alignSelf: 'center',
                                    margin: 5,
                                    opacity: !isValid ? .1 : 1
                                }]}
                                color="#841584"
                                accessibilityLabel="calcular resultado de bobina"
                                onPress={handleSubmit}
                                title="Submit"
                                disabled={!isValid}
                            >
                                <Text
                                    style={{color: COLORS.white, fontFamily: 'Anton', fontSize: 20}}>CALCULAR</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Formik>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    touchable: {
        width: 120,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.colorSupportfiv,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.white,
    }
});

export default FormUsedRoll;