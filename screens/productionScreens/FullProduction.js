import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import {Fontisto as Icon} from "@expo/vector-icons";
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {fingerselectOrangeSVG, tirada2SVG} from "../../assets/svg/svgContents";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import BgComponent from "../../components/BackgroundComponent/BgComponent";
import {paperRollConsummption} from "../../utils";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const titleContHeight = 60

const paddingContent = 5;
const border_radius = 3;

const FullProduction = ({route}) => {
    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: fingerselectOrangeSVG, svgWidth: '100%', svgHeight: '100%'
    };
    const optionsStyleContSVG = {
        width: '60%', height: '60%', top: 10, right: 0, transform: [{rotate: "180deg"}]
    };

    const tabBarHeight = useBottomTabBarHeight();
    const {item} = route.params;
    // const windowWidth = Dimensions.get('window').width;
    // const windowHeight = Dimensions.get('window').height;
    const heightParentDefault = windowHeight - 80;

    const [parentHeight, setParentHeight] = useState(false);

    const ShowData = () => {
        return Object.entries(item).map(([key, value], index) => {
            return <Text style={[styles.textContData, {textAlign: index % 2 === 0 ? 'left' : 'left'}]} key={index}>
                <Text style={{color: COLORS.primary}}>{`${key}: `}</Text>{value}</Text>
        });
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whitesmoke}}>
            <View style={[styles.parent, {height: !parentHeight ? heightParentDefault : titleContHeight}]}>
                <View style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    borderBottomWidth: parentHeight ? 0 : 2,
                    borderBottomColor: 'white'
                }}>
                    <Text style={[styles.title, {color: COLORS.white}]}>{item.producto}</Text>
                    <Text style={[styles.title, {
                        color: COLORS.white,
                        fontSize: 15
                    }]}>fecha: {item['Fecha de creación']}</Text>
                </View>
                <View style={styles.content}>
                    {/*///CARD///*/}
                    <View style={styles.cardparent}>
                        <View style={[styles.numberandcode, styles.rowBetween]}>
                            <View style={styles.numauto}><Text style={{color: COLORS.white}}>1</Text></View>
                            <View style={[styles.contcode, styles.centerCenter]}><Text
                                style={{textAlign: 'center'}}>123456789012</Text></View>
                        </View>
                        {/*//newComponent*/}
                        <View style={styles.parentWeight}>
                            <View style={styles.dataWeight}>
                                <Text
                                    style={[styles.textTitle, {backgroundColor: 'white', paddingTop: paddingContent}]}>Resto
                                    inicial: <Text style={styles.textWeightData}>{item.restoInicio}</Text> Kg.</Text>
                                <View style={{padding: paddingContent + 1}}>
                                    <Text style={styles.textTitle}>Resto Final: <Text
                                        style={styles.textWeightData}>{item.restoFinal}</Text> Kg.</Text>
                                </View>
                            </View>
                            <View style={[styles.result, {width: '25%', padding: 0}]}>
                                <View style={{
                                    borderRadius: border_radius,
                                    borderWidth: 2,
                                    borderColor: COLORS.primary,
                                    padding: paddingContent
                                }}>
                                    <BgComponent
                                        svgOptions={optionsSVG}
                                        styleOptions={optionsStyleContSVG}
                                    />
                                    <Text style={styles.textTitle}>Radio:</Text>
                                    {/*<Text style={styles.textWeightData}>200 <Text style={styles.textWeightUnit}>Kg.</Text></Text>*/}
                                    <TextInput
                                        editable
                                        keyboardType={'numeric'}
                                        style={{
                                            backgroundColor: '#ff850050',
                                            textAlign: 'center',
                                            fontFamily: 'Anton'
                                        }}
                                        name={'id'}
                                        // onChangeText={text => paperRollConsummption(text, setStateRadius)}
                                        // // onBlur={() => Alert.alert(radiusState.toString())}
                                        // onBlur={() => calcPaperRollConsummption(radiusState, item.id)}
                                        // value={radiusState.toString()}
                                        // defaultValue={radiusState.toString()}
                                    />
                                </View>
                            </View>
                            <View style={[styles.result, {
                                width: '25%',
                                backgroundColor: item.consumo < 0 ? '#FF9999' : null
                            }]}>
                                <Text style={styles.textTitle}>Consumo:</Text>
                                <Text
                                    style={[styles.textWeightData, {color: item.consumo < 0 ? 'white' : 'black'}]}>{item.consumo}
                                    <Text
                                        style={styles.textWeightUnit}>Kg.</Text></Text>
                            </View>
                        </View>
                    </View>
                    {/*//newComponent*/}
                    {/*///CARD///*/}
                </View>
            </View>
            <View style={[styles.bottomdrawer, {height: windowHeight - tabBarHeight}]}>
                <View style={styles.contData}>
                    <ShowData/>
                </View>
            </View>
            <TouchableOpacity style={[styles.buttonData, {top: windowHeight - (tabBarHeight * 2.3)}]}
                              onPress={() => setParentHeight(!parentHeight)}>
                <Icon name={'arrow-expand'} size={25} color={COLORS.background_tertiary} style={styles.icon}/>
                <Text style={{fontFamily: 'Anton'}}>CALCULAR</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    parent: {
        // flex: 1,
        backgroundColor: COLORS.primary,
        marginBottom: 20,
        borderBottomLeftRadius: 130,
        elevation: 12,
        overflow: 'hidden'
    },
    title: {
        textTransform: 'capitalize',
        textAlign: 'right',
        fontSize: 24,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.8, height: 0.8},
        textShadowRadius: 1
    },
    content: {
        padding: 10
    },
    bottomdrawer: {
        // position: 'absolute',
        // height: windowHeight,
        // backgroundColor: 'red'
    },
    contData: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    textContData: {
        fontFamily: 'Anton',
        color: '#858585',
        width: '50%',
    },
    buttonData: {
        position: 'absolute',
        left: 5
    },
    icon: {
        marginLeft: 10,
    },
    // CARD
    cardparent: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.black,
        padding: 5
    },
    centerCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flexWrap: 'wrap'
    },
    numberandcode: {},
    numauto: {
        width: windowWidth / 10,
        height: windowWidth / 10,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contcode: {
        borderWidth: 2,
        borderColor: COLORS.black,
        width: windowWidth / 1.3,

    },
    parentWeight: {
        // backgroundColor: '#ff850050',
        marginTop: 5,
        flexDirection: 'row',
        // borderRadius: border_radius
    },
    dataWeight: {
        width: '50%',
        alignSelf: 'flex-end',
        // backgroundColor: 'green',
        // padding: paddingContent,
        // borderRadius: border_radius
    },
    result: {
        // backgroundColor: '#ff850050',
        padding: paddingContent,
        // borderRadius: border_radius
    },
    percent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#c2c2c2',
        borderBottomLeftRadius: border_radius,
        borderBottomRightRadius: border_radius,
        padding: 3
    },
    subPercent: {
        justifyContent: 'flex-start',
    },
    parentID: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        padding: 2,
        borderRadius: border_radius
    },
    parentInput: {
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        // borderWidth: 1,
        // borderColor: 'black',
        // backgroundColor: 'white',
        paddingLeft: 2,
        marginBottom: 5,
        borderRadius: border_radius
    },
    textWeightUnit: {
        color: 'black'
    },
    textWeightData: {
        fontFamily: 'Anton',
        color: COLORS.primary,
        alignSelf: 'center'
        // textAlign: 'center'
    },
    textTitle: {
        fontFamily: 'Anton',
        textAlign: 'left'
    }
})
export default FullProduction;