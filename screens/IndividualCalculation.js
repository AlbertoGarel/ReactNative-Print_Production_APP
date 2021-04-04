import React, {useState} from 'react';
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
import {} from "react-native-web";

const IndividualCalculation = () => {
    const result = 0;
    const brutoResult = 0;
    const productResult = 500;
    const [selectedMeasurementMetod, setMeasurementMetod] = useState();
    const [selectedKBA, setSelectedKBA] = useState();
    return (
        <SafeAreaView style={{flex: 1}}>
            <ImageBackground source={require('../assets/images/orangegradient.jpg')} style={styles.backg}>
                <ScrollView>
                    <View style={styles.contPrinc}>
                        {/*CALCULO KG PRODUCCIÓN*/}
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
                                        selectedValue={selectedMeasurementMetod}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setMeasurementMetod(itemValue)
                                        }
                                    >
                                        <Picker.Item label="Total bobina" value="0.038"/>
                                        <Picker.Item label="Útil bobina" value="0.036"/>
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
                        </View>
                        {/*BOBINA INDIVIDUAL*/}
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
                        {/*CALCULO TOTAL BRUTO*/}
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
                    </View>
                </ScrollView>
            </ImageBackground>
            <TouchableOpacity style={{
                borderRadius: 50,
                width: 70,
                height: 70,
                backgroundColor: COLORS.white,
                position: 'absolute',
                bottom: 20,
                right: 20,
                borderWidth: 5,
                borderColor: COLORS.primary,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
                shadowColor: COLORS.black,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 12,
            }}>
                <SvgComponent
                    svgData={deleteAll}
                    svgWidth={40}
                    svgHeight={40}
                />
            </TouchableOpacity>
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    contPrinc: {
        // flex: 1,
        // backgroundColor: COLORS.background_tertiary,
        paddingBottom: 100
    },
    titles: {
        fontSize: 28,
        color: COLORS.white,
        textAlign: 'left',
        textTransform: 'uppercase',
        fontFamily: 'Anton',
        marginLeft: 40
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