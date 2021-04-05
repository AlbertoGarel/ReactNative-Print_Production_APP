import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Picker,
    ImageBackground
} from 'react-native';
import CustomTextInput from "../components/form/CustomTextInput";
import {radio, peso, deleteAll} from '../assets/svg/svgContents';
import SvgComponent from "../components/SvgComponent";
import {COLORS, GRADIENT_COLORS} from "../assets/defaults/settingStyles";
import MultipleSwitchSelector from "../components/MultipleSwitchSelector";
import SwitchSelector from "react-native-switch-selector";
import * as SQLite from "expo-sqlite";
import {picker_medition_style} from '../dbCRUD/actionsSQL';

const IndividualCalculation = () => {
    const db = SQLite.openDatabase('bobinas.db');

    const result = 0;
    const brutoResult = 0;
    const productResult = 500;
    const [measuramentDataDB, getmMeasurementDataDB] = useState([]);
    const [selectedMeasurementMetod, setMeasurementMetod] = useState([]);
    const [selectedKBA, setSelectedKBA] = useState();

    const switchValues = [
        {label: 'Prevision de kilogramos', value: 1},
        {label: 'Bobina', value: 2},
        {label: 'Total producción', value: 3}
    ];

    const [switchValue, setSwitchValue] = useState(switchValues[0].value);
    const getMultipleSwitchValue = (val) => {
        setSwitchValue(val);
    };

    useEffect(() => {
        let isActive = true;

        db.transaction(tx => {
            tx.executeSql(
                picker_medition_style,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        getmMeasurementDataDB(_array);
                        console.log(_array)
                    } else {
                        console.log('Erro al conectar base de datos en IndividualCalculation Component')
                    }
                }
            );
        });

        return () => {
            isActive = false;
        };
    }, []);

    const elementPrevProdction = () => {
        return (
            <>
                <View style={styles.contTitle}>
                    <Text style={styles.titles}>TOTAL KG PRODUCCIÓN</Text>
                </View>
                <CustomTextInput
                    svgData={peso}
                    svgWidth={50}
                    svgHeight={50}
                    placeholder={'Número de ejemplares...'}
                    text={'Tirada prevista'}
                    type={'numeric'}
                    maxLength={4}
                />
                <CustomTextInput
                    svgData={peso}
                    svgWidth={50}
                    svgHeight={50}
                    placeholder={'Número de ediciones...'}
                    text={'Ediciones'}
                    type={'numeric'}
                    maxLength={4}
                    styled={{marginBottom: 0}}
                />
                <Text style={{fontSize: 12, color: 'red', marginLeft: 20, margin: 0}}>* +500 ejemplares por
                    tirada</Text>
                <View style={{padding: 10}}>
                    <View style={{
                        backgroundColor: COLORS.white,
                        width: '100%',
                        height: 60,
                        padding: 5,
                        borderRadius: 5,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={styles.IconStyle}>
                            <SvgComponent
                                svgData={radio}
                                svgWidth={50}
                                svgHeight={50}
                            />
                        </View>
                        <View style={{flex: 1, paddingLeft: 10}}>
                            <Picker
                                mode={'dropdown'}
                                selectedValue={selectedMeasurementMetod}
                                onValueChange={(itemValue, itemIndex) =>
                                    setMeasurementMetod(itemValue)
                                }
                            >
                                {
                                    measuramentDataDB.length > 0 ?
                                        measuramentDataDB.map(item =>{
                                          return <Picker.Item
                                              label={'medición ' + item.medition_type + ' / ' + item.gramaje_value + 'g.'}
                                                  value={item.medition_value}/>
                                        })
                                    :
                                        <Picker.Item label="No existen datos" value={null}/>
                                }
                            </Picker>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.touchable, {alignSelf: 'center', margin: 5}]}
                    onPress={() => Alert.alert('pressed...')}
                    title="CALCULAR"
                    color="#841584"
                    accessibilityLabel="calcular resultado de bobina"
                >
                    <Text style={{color: COLORS.white, fontFamily: 'Anton', fontSize: 20}}>CALCULAR</Text>
                </TouchableOpacity>
                <View style={styles.results}>
                    <View
                        style={{
                            width: 150,
                            height: 50,
                            backgroundColor: COLORS.white,
                            borderRadius: 5,
                            padding: 10,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Text style={{fontSize: 20, color: COLORS.primary}}>
                            Entera:
                        </Text>
                        <Text style={{fontSize: 20}}>
                            {productResult > 0 ? productResult + ' Kg' : 0 + ' Kg'}
                        </Text>
                    </View>
                    <View
                        style={{
                            width: 150,
                            height: 50,
                            backgroundColor: COLORS.white,
                            borderRadius: 5,
                            padding: 10,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Text style={{fontSize: 20, color: COLORS.primary}}>
                            Media:
                        </Text>
                        <Text style={{fontSize: 20}}>
                            {productResult > 0 ? (productResult / 2) + ' Kg' : 0 + ' Kg'}
                        </Text>
                    </View>
                </View></>
        );
    };

    const elementCalcBobina = (result) => {
        return (
            <>
                <View style={styles.contTitle}>
                    <Text style={styles.titles}>BOBINA</Text>
                </View>
                <CustomTextInput
                    svgData={peso}
                    svgWidth={50}
                    svgHeight={50}
                    placeholder={'Peso en kg...'}
                    text={'Peso de la bobina completa:'}
                    type={'numeric'}
                    maxLength={4}
                />
                <CustomTextInput
                    svgData={radio}
                    svgWidth={50}
                    svgHeight={50}
                    placeholder={'Radio en cm...'}
                    text={'Radio actual de la bobina:'}
                    type={'numeric'}
                    maxLength={4}
                />
                <View style={styles.results}>
                    <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => Alert.alert('pressed...')}
                        title="CALCULAR"
                        color="#841584"
                        accessibilityLabel="calcular resultado de bobina"
                    >
                        <Text style={{color: COLORS.white, fontFamily: 'Anton', fontSize: 20}}>CALCULAR</Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            width: 150,
                            height: 50,
                            backgroundColor: COLORS.white,
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{fontSize: 20}}>
                            {result.length > 0 ? result : 0}
                        </Text>
                    </View>
                </View>
            </>
        );
    };

    const elementCalTotalproduction = (brutoResult) => {
        return (
            <>
                <View style={styles.contTitle}>
                    <Text style={styles.titles}>total producción</Text>
                </View>
                <CustomTextInput
                    svgData={peso}
                    svgWidth={50}
                    svgHeight={50}
                    placeholder={'Ejemplares bruto...'}
                    text={'Tirada bruta:'}
                    type={'numeric'}
                    maxLength={4}
                />
                <CustomTextInput
                    svgData={peso}
                    svgWidth={50}
                    svgHeight={50}
                    placeholder={'Paginación...'}
                    text={'Paginación:'}
                    type={'numeric'}
                    maxLength={4}
                />
                <View style={{padding: 10}}>
                    <View style={{
                        backgroundColor: COLORS.white,
                        width: '100%',
                        height: 60,
                        padding: 5,
                        borderRadius: 5,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={styles.IconStyle}>
                            <SvgComponent
                                svgData={radio}
                                svgWidth={50}
                                svgHeight={50}
                            />
                        </View>
                        <View style={{flex: 1, paddingLeft: 10}}>
                            <Picker
                                selectedValue={selectedKBA}
                                onValueChange={(itemValue, itemIndex) =>
                                    setSelectedKBA(itemValue)
                                }
                            >
                                <Picker.Item label="Provincias" value="0.00225"/>
                                <Picker.Item label="As" value="0.00242"/>
                            </Picker>
                        </View>
                    </View>
                </View>
                <View style={styles.results}>
                    <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => Alert.alert('pressed...')}
                        title="CALCULAR"
                        color="#841584"
                        accessibilityLabel="calcular resultado de bobina"
                    >
                        <Text style={{color: COLORS.white, fontFamily: 'Anton', fontSize: 20}}>CALCULAR</Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            width: 150,
                            height: 50,
                            backgroundColor: COLORS.white,
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{fontSize: 20}}>
                            {brutoResult.length > 0 ? brutoResult : 0}
                        </Text>
                    </View>
                </View>
            </>
        );
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <ImageBackground source={require('../assets/images/orangegradient.jpg')} style={styles.backg}>
                <MultipleSwitchSelector
                    label_values={switchValues}
                    title={'calculos'}
                    handler={getMultipleSwitchValue}
                    textColor={COLORS.primary}
                    buttonColor={COLORS.primary}
                />
                <View style={styles.contPrinc}>
                    {switchValue === 1 ?
                        elementPrevProdction()
                        :
                        null
                    }
                    {
                        switchValue === 2 ?
                            elementCalcBobina(result)
                            :
                            null
                    }
                    {
                        switchValue === 3 ?
                            elementCalTotalproduction(brutoResult)
                            :
                            null
                    }
                    <TouchableOpacity style={{
                        borderRadius: 10,
                        width: '50%',
                        height: 70,
                        backgroundColor: COLORS.whitesmoke,
                        borderWidth: 2,
                        borderColor: COLORS.whitesmoke,
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                        marginRight: 20,
                        marginTop: 50,
                        shadowColor: COLORS.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 10,
                        elevation: 12,
                    }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: COLORS.white,
                            borderTopLeftRadius: 8,
                            borderBottomLeftRadius: 8
                        }}>
                            <SvgComponent
                                svgData={deleteAll}
                                svgWidth={30}
                                svgHeight={30}
                            />
                        </View>
                        <View style={{
                            flex: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: COLORS.whitesmoke,
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                        }}>
                            <Text style={{
                                color: COLORS.secondary,
                                fontSize: 13,
                                textTransform: 'uppercase'
                            }}>Limpiar entradas</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    contPrinc: {
        flex: 1,
    },
    titles: {
        fontSize: 28,
        color: COLORS.white,
        textAlign: 'left',
        textTransform: 'uppercase',
        fontFamily: 'Anton',
        marginLeft: 40,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1
    },
    results: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 5
    },
    contTitle: {
        borderRadius: 9,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.white,
        borderTopWidth: 2,
        borderTopColor: COLORS.white
    },
    touchable: {
        width: 120,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.colorSupportfiv,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    backg: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    }
});

export default IndividualCalculation;