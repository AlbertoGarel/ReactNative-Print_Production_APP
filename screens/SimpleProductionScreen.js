import React, {useEffect, useState, useCallback} from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Alert,
    Button,
    ToastAndroid,
    ScrollView,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput, Animated
} from "react-native";
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';
import {COLORS} from "../assets/defaults/settingStyles";
import HRtag from "../components/HRtag";
import {Fontisto as Icon} from "@expo/vector-icons";
import {Feather as IconFeather} from "@expo/vector-icons";
import {editSVG} from "../assets/svg/svgContents";
import CustomTextInput from "../components/FormComponents/CustomTextInput";
import {getDatas, removeValue, storeData} from "../data/AsyncStorageFunctions";
import FloatOpacityModal from "../components/FloatOpacityModal";
import SimpleProductionContainer from "../components/productions/SimpleProductionContainer";
import CreateCardProduction from "./productionScreens/CreateCardProduction";
import CardsProduction from "../components/productions/CardsProduction";
import FormTotalCalculationProduction from "../components/productions/FormTotalCalculationProduction";

const paddingScreen = 5;

const simpleProductionScreen = ({route, setChangeButtonFunc}) => {

    const [visiblemenu, setVisibleMenu] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [seeData, setSeeData] = useState(false);
    const [objsaved, getObjSaved] = useState([]);
    const [renderNowItem, setRenderNowItem] = useState('');
    const [visiblecreateCards, setVisibleCreateCards] = useState(false);
    const [initAnimation, setInitAnimation] = useState(true);
    //STATES FOR editCardProduction
    const [editCardItem, getEditCardItem] = useState({});
    //TATE BUTTON CALC
    const [calcButtonOpacity, setCalcButtonOpacity] = useState(false);
    const [stateModalFullcalc, setStateModalFullcalc] = useState(false);
    const [warningNoContainPaper, setWarningNoContainPaper] = useState(false);
    const [warningText, setWarningText] = useState(false);

    const handlerEditCard = (item, param) => {
        getEditCardItem(item);
        setVisibleCreateCards(param);
    }

    useFocusEffect(
        useCallback(() => {
            setIsFocus(true);
            setChangeButtonFunc(true);
            updateGetStorage();
            // removeValue('@simpleProdData').then(r => console.log('gjgj'))
            return () => {
                setIsFocus(false);
                //CHANGE BUTTON COLOR FOR CREATE SIMPLE PERODUCTION OR FULL PRODUCTION IN BOTTOM TAB NAV.
                // setChangeButtonFunc(false);

            };
        }, [])
    );

    useEffect(() => {
        if (initAnimation) {
            pulse()
        }
        updateGetStorage();
    }, [initAnimation]);

    const orderItems = (dataItems) => {
        getObjSaved([...dataItems].sort((a, b) => a.orderID - b.orderID));
    };

    const handlerFullCalcModal = (arrData) => {
        const productRendered = {...arrData[0]};
        const arrCards = productRendered.cards;
        let success = false;
        //check autopasters with at least one roll of paper without calculating
        const validateSuccess = arrCards.filter(item => item.consumo < 0 || item.consumo === '');

        //check autopasters with at least one roll of paper
        let validateContainPaperRoll = false;
        let NoContainPaperRoll = [];
        let autopastersList = [];
        const numbersOfAutopasters = arrCards.map(item => item.autopasterNum);

        for (let i = 1; i <= Math.round(productRendered.pagination / 16); i++) {
            autopastersList.push(numbersOfAutopasters.includes(i));
            if (numbersOfAutopasters.includes(i) === false) {
                NoContainPaperRoll.push(i);
            }
        }
        //set state for no contain paper roll
        let warningStr = '';
        if (NoContainPaperRoll.length > 0) {
            for (let j = 0; j < NoContainPaperRoll.length; j++) {
                if (j === 0) {
                    warningStr = NoContainPaperRoll[j];
                } else if ((0 < j) && (j < NoContainPaperRoll.length - 1)) {
                    warningStr = `${warningStr}, ${NoContainPaperRoll[j]}`;
                } else {
                    warningStr = `${warningStr} y ${NoContainPaperRoll[j]}`;
                }
            }
            validateContainPaperRoll = false;
        } else {
            validateContainPaperRoll = true;
            warningStr = '';
        }
        setWarningText(warningStr)

        //Set states
        if (validateSuccess.length === 0) {
            success = true;
        }
        if (NoContainPaperRoll.length === 0) {
            validateContainPaperRoll = true;
        }
        setCalcButtonOpacity(success);
        setWarningNoContainPaper(validateContainPaperRoll)
    }

    // const stateForFinalCalc = (obj, itemid) => {
    //     if (objsaved && itemid) {
    //         const thisProduct = obj.filter(item => item.id === itemid)[0].cards;
    //         const consumoFinal = thisProduct.reduce((accum, item) => {
    //             if (parseInt(item.consumo)) {
    //                 return accum + parseInt(item.consumo);
    //             }
    //         }, 0);
    //         setCalcButtonOpacity(!isNaN(consumoFinal))
    //         console.log('stateForFinale', consumoFinal + ' --- ' + !isNaN(consumoFinal))
    //     } else {
    //         setCalcButtonOpacity(false);
    //     }
    // }

    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    const pulse = () => {
        Animated.loop(Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 1000,
            useNativeDriver: true
        })).start(() => pulse());
    };

    const updateGetStorage = () => {
        getDatas('@simpleProdData')
            .then(r => {
                // getObjSaved([...r].sort((a,b)=> a.orderID - b.orderID));
                orderItems(r)
                if (renderNowItem.length === 0) {
                    const order = r.sort((a, b) => a.orderID - b.orderID);
                    setRenderNowItem(order[0].id);
                }
                //CALCULO DE PESO Y ACCESO A MODAL INPUT
                // stateForFinalCalc(r, renderNowItem)
            })
            .catch(err => console.log(err))
    }

    const bottomToast = (message) => {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
        );
    };

//Content extrainfo of infoButton
    const changeViewDelete = (id) => {
        if (id === renderNowItem) {
            setRenderNowItem('')
        }
    }

    // flatList and handlers
    const deleteHandler = (id) => {
        const result = objsaved.filter(item => item.id !== id);
        orderItems(result);
        if (result.length === 0) {
            setVisibleMenu(false);
            setRenderNowItem('')
        } else {
            setRenderNowItem(result[0].id);
        }
        storeData('@simpleProdData', result).then(r => orderItems(result));
        updateGetStorage();
    };

    const Item = ({title, id}) => (
        <View style={styles.menuRows}>
            <TouchableOpacity onPress={() => {
                setRenderNowItem(id);
                setVisibleMenu(false);
            }}
                              style={{
                                  width: '70%',
                              }}
            >
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                deleteHandler(id);
            }}>
                <Icon name={'trash'} size={30} color={COLORS.secondary} style={styles.icon}/>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({item}) => <Item title={item.title} id={item.id}/>;

    const ChildModal = () => {
        return (
            <>
                <Text style={styles.productsTitle}>PRODUCTOS ACTIVOS:</Text>
                <HRtag
                    borderWidth={2}
                    borderColor={COLORS.primary}
                    margin={10}
                />
                <FlatList
                    data={objsaved}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}/>
            </>
        )
    }

    const value = '1';
    const storeDatas = async (value) => {
        try {
            await AsyncStorage.setItem('@storage_Key', value)
            bottomToast('Guardando...');
        } catch (e) {
            bottomToast('Error al guardar.');
        }
    }

    const objectReneredData = (renderNowItem) => {
        const selectData = objsaved.filter(item => item.id === renderNowItem)
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => objsaved.length > 0 && setVisibleMenu(true)}>
                    <Text style={styles.textTouchable}>Listado Productos</Text>
                    {objsaved.length > 0 && <View style={styles.bubble}>
                        <Text style={{color: 'red'}}>{objsaved ? objsaved.length : null}</Text>
                    </View>}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {
                    backgroundColor: '#FF8500',
                }]}
                                  disabled={!calcButtonOpacity && !warningNoContainPaper}
                    // onPress={() => storeDatas(value)}>
                                  onPress={() => calcButtonOpacity ? setStateModalFullcalc(true) : null}>
                    <Text
                        style={[styles.textTouchable, {color: calcButtonOpacity && warningNoContainPaper ? 'white' : COLORS.primary}]}>Calcular
                        producción</Text>
                </TouchableOpacity>
            </View>
            <SimpleProductionContainer objsaved={objsaved}
                                       renderNowItem={renderNowItem}
                                       setSeeData={setSeeData}
                                       seeData={seeData}
                                       updateGetStorage={updateGetStorage}
                                       setVisibleCreateCards={setVisibleCreateCards}
                                       setInitAnimation={setInitAnimation}
                                       initAnimation={initAnimation}
                                       pulseAnim={pulseAnim}
                                       handlerEditCard={handlerEditCard}
                                       handlerFullCalcModal={handlerFullCalcModal}
                                       warningText={warningText}
            />
            {
                visiblemenu && <FloatOpacityModal
                    styled={{width: '70%'}}
                    setVisibleMenu={setVisibleMenu}
                    child={ChildModal}
                />
            }
            {
                visiblecreateCards && <FloatOpacityModal
                    styled={{width: '90%'}}
                    setVisibleMenu={setVisibleCreateCards}
                    child={() => <CreateCardProduction
                        renderNowItem={renderNowItem}
                        updateGetStorage={updateGetStorage}
                        setVisibleCreateCards={setVisibleCreateCards}
                        editCardItem={editCardItem}
                        objsaved={objsaved}
                    />}
                />
            }
            {
                stateModalFullcalc && <FloatOpacityModal
                    styled={{width: '70%', backgroundColor: 'transparent'}}
                    setVisibleMenu={() => setStateModalFullcalc(false)}
                    child={() => <FormTotalCalculationProduction
                        renderNowItem={renderNowItem}
                        objsaved={objsaved}
                        updateGetStorage={updateGetStorage}
                    />
                    }
                />
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ff8500'
    },
    bubble: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: COLORS.white,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: COLORS.buttonEdit,
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.whitesmoke,
        elevation: 12
    },
    menuRows: {
        display: 'flex',
        backgroundColor: 'whitesmoke',
        margin: 3,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    list: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        height: 'auto',
        backgroundColor: '#00000090',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    flatParent: {
        width: '70%',
        // minHeight: 400,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10
    },
    productsTitle: {
        fontSize: 20,
        fontFamily: 'Anton',
        marginLeft: 20,
        color: COLORS.dimgrey
    },
    title: {
        fontSize: 15,
        color: COLORS.secondary,
        fontFamily: 'Anton'
    },
    secc2: {
        display: 'flex',
        justifyContent: 'center',
        padding: 5,
    },
    textTouchable: {
        color: COLORS.white,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.8, height: 0.8},
        textShadowRadius: 1
    }
});
export default simpleProductionScreen;