import React, {useEffect, useState, useCallback} from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    TouchableOpacity,
    FlatList,
    Animated
} from "react-native";
import {useFocusEffect} from '@react-navigation/native';
import {COLORS} from "../assets/defaults/settingStyles";
import HRtag from "../components/HRtag";
import {Fontisto as Icon} from "@expo/vector-icons";
import {getDatas, storeData} from "../data/AsyncStorageFunctions";
import FloatOpacityModal from "../components/FloatOpacityModal";
import SimpleProductionContainer from "../components/productions/SimpleProductionContainer";
import CreateCardProduction from "./productionScreens/CreateCardProduction";
import FormTotalCalculationProduction from "../components/productions/FormTotalCalculationProduction";

const simpleProductionScreen = ({setChangeButtonFunc}) => {

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
            // animatedArrow()
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
        let isMounted = true;
        if (initAnimation) {
            pulse()
        }
        // animatedArrow()
        updateGetStorage();

        return () => isMounted = false;
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
    };

    const pulseAnim = React.useRef(new Animated.Value(1)).current;
    const moveArrow = React.useRef(new Animated.Value(0)).current;

    const pulse = () => {
        Animated.loop(Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 1000,
            useNativeDriver: true
        })).start(() => pulse());
    };

    const animatedArrow = () => {
        Animated.loop(Animated.sequence([
            Animated.timing(moveArrow, {
                toValue: 100,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.timing(moveArrow, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            })
        ])).start()
    }
    // Animated.sequence([
    //     Animated.timing(moveArrow, {
    //         toValue: 100,
    //         duration: 500
    //     }),
    //     Animated.timing(moveArrow, {
    //         toValue: 0,
    //         duration: 200
    //     })
    // ]).start()

    const updateGetStorage = () => {
        getDatas('@simpleProdData')
            .then(r => {
                if (r) orderItems(r)

                if (renderNowItem.length === 0 && r) {
                    const order = r.sort((a, b) => a.orderID - b.orderID);
                    setRenderNowItem(order[0].id);
                }
                //CALCULO DE PESO Y ACCESO A MODAL INPUT
                // stateForFinalCalc(r, renderNowItem)
            })
            .catch(err => console.log(err))
    };

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
        storeData('@simpleProdData', result).then(() => orderItems(result));
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
    };

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
                                       moveArrow={moveArrow}
                                       animatedArrow={animatedArrow}
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