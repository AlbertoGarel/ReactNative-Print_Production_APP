import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image} from "react-native";
import {COLORS} from "../../assets/defaults/settingStyles";
import CustomTextInput from "../FormComponents/CustomTextInput";
import {storeData} from "../../data/AsyncStorageFunctions";

const FormTotalCalculationProduction = ({
                                            renderNowItem,
                                            objsaved,
                                            updateGetStorage
                                        }) => {

    const [product, getProduct] = useState({})
    const [totalConsumptionState, setTotalConsumption] = useState(0);
    const [coef, getCoef] = useState('');
    const [pagination, getPagination] = useState('');
    const [inputsCoefError, getInputCoefError] = useState(false);
    const [inputTiradaError, getInputTiradaError] = useState(false);
    const [CalculationConsumptionTirada, getCalculationConsumptionTirada] = useState('');
    const [inputTiradaVal, setInputTiradaVal] = useState('')
    const errorMessage = 'Revisa el valor introducido';

    useEffect(() => {
        if (renderNowItem.length > 0 && objsaved) {
            const thisProduct = objsaved.filter(item => item.id === renderNowItem)
            getProduct(...thisProduct);

            const totalConsumption = thisProduct[0].cards.reduce((accum, item) => {
                return accum + parseInt(item.consumo)
            }, 0)
            setTotalConsumption(totalConsumption);
            getCoef(thisProduct[0].coef);
            getPagination(thisProduct[0].pagination);
        }

    }, [renderNowItem, objsaved]);

    const totalTirada = (coefVal, paginVal, consumptionVal) => {
        if (!isNaN(consumptionVal) && consumptionVal > 0) {
            let result = coefVal * paginVal * consumptionVal;
            getCalculationConsumptionTirada(result);
            getInputTiradaError(false);
        } else {
            getInputTiradaError(true);
        }
    };

    const validateNumber = (val) => {
        let isFalse = true;
        if (!isNaN(val) && val > 0) {
            isFalse = false;
            updateCoefStorage(val);
        }
        getInputCoefError(isFalse);
        return true;
    };

    const updateCoefStorage = (coefState) => {
        const productToUpdate = {...product};
        productToUpdate.coef = coefState;
        const restProducts = objsaved.filter(item => item.id !== productToUpdate.id);

        const productToSave = [...restProducts, productToUpdate];
        storeData('@simpleProdData', productToSave)
            .then(() => updateGetStorage())
            .catch(err => console.log(err))

    }

    return (
        <View style={styles.parent}>
            <View style={{
                padding: 10,
                backgroundColor: COLORS.white,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                alignItems: 'center',
                minHeight: 0,
            }}>
                <Text style={styles.title}>{product.title}</Text>
                <View>
                    {(inputsCoefError) &&
                    < Text
                        style={{marginLeft: 20, fontSize: 10, color: 'red'}}>{errorMessage}</Text>
                    }
                    <CustomTextInput
                        svgData={null}
                        svgWidth={null}
                        svgHeight={null}
                        placeholder={'coeficiente...'}
                        text={'Coeficiente:'}
                        type={'numeric'}
                        _name={'inputCoef'}
                        _onChangeText={(text) => getCoef(text)}
                        _onBlur={() => {
                            let isGod = validateNumber(coef)
                            if (isGod) totalTirada(coef, pagination, inputTiradaVal);
                        }}
                        value={coef}
                        _defaultValue={coef.toString()}
                        styled={{
                            borderColor: inputsCoefError ? COLORS.primary : 'red',
                            width: '100%',
                            marginBottom: 20
                        }}
                    />
                </View>
            </View>
            <View style={styles.parentForm}>
                <View style={styles.subparentForm}>
                    <Image
                        style={[styles.image, {backgroundColor: 'transparent'}]}
                        source={require('../../assets/images/splash/Logo_AlbertoGarel.png')}
                    />
                </View>
                <View>
                    {(inputTiradaError) &&
                    < Text
                        style={{marginLeft: 20, fontSize: 10, color: 'red'}}>{errorMessage}</Text>
                    }
                    {/*INSERCIÓN DE EJEMPLARES*/}
                    <CustomTextInput
                        svgData={null}
                        svgWidth={null}
                        svgHeight={null}
                        placeholder={'cantidad...'}
                        text={'Total tirada:'}
                        type={'numeric'}
                        _name={'inputTirada'}
                        _onChangeText={(text) => setInputTiradaVal(text)}
                        _onBlur={() => totalTirada(coef, pagination, inputTiradaVal)}
                        value={inputTiradaVal}
                        _defaultValue={inputTiradaVal}
                        styled={{borderColor: COLORS.primary}}
                    />
                </View>
                <View>
                    <CustomTextInput
                        svgData={null}
                        svgWidth={null}
                        svgHeight={null}
                        placeholder={'introduce total'}
                        text={'Kg tirada:'}
                        _name={'tirada'}
                        noEditable={true}
                        value={CalculationConsumptionTirada}
                        _defaultValue={CalculationConsumptionTirada ? Math.round(CalculationConsumptionTirada).toString() + ' Kg' : ''}
                        styled={{borderColor: COLORS.primary, backgroundColor: '#ff850050'}}
                        inputStyled={{color: 'black'}}
                    />
                </View>
                <View>
                    <CustomTextInput
                        svgData={null}
                        svgWidth={null}
                        svgHeight={null}
                        placeholder={'Nombre...'}
                        text={'Kg consumidos:'}
                        _name={'consumidos'}
                        noEditable={true}
                        _defaultValue={totalConsumptionState.toString() + ' Kg'}
                        styled={{borderColor: COLORS.primary, backgroundColor: '#ff850050'}}
                        inputStyled={{color: 'black'}}
                    />
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    parent: {
        backgroundColor: COLORS.white,
        borderRadius: 5,
        overflow: 'hidden',
    },
    subparentForm: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 70,
        marginTop: -40,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 12
    },
    image: {
        width: 50,
        height: 50,
    },
    title: {
        color: '#696969',
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Anton',
        borderRadius: 5,
        padding: 5,
    },
    parentForm: {
        backgroundColor: COLORS.whitesmoke,
        padding: 10,
        margin: 5,
        borderWidth: 2,
        borderColor: '#ff8500',
        borderRadius: 5,
    }
})
export default FormTotalCalculationProduction;