import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView, Animated, Easing} from 'react-native';
import {Fontisto as Icon} from "@expo/vector-icons";
import {COLORS} from "../../assets/defaults/settingStyles";
import CustomTextInput from "../FormComponents/CustomTextInput";
import {editSVG} from "../../assets/svg/svgContents";
import {getDatas, removeValue} from "../../data/AsyncStorageFunctions";
import Extrainfo from "./Extrainfo";
import CardsProduction from "./CardsProduction";

const SimpleProductionContainer = ({
                                       objsaved,
                                       renderNowItem,
                                       setSeeData,
                                       seeData,
                                       updateGetStorage,
                                       setVisibleCreateCards,
                                       setInitAnimation,
                                       initAnimation,
                                       pulseAnim,
                                       handlerEditCard,
                                       handlerFullCalcModal,
                                       warningText
                                   }) => {

    const [productToRender, getProductToRender] = useState({});
    const [cardsOrdered, setCardsordered] = useState({});
    const [floatTitle, setFloatTitle] = useState(false)

    useEffect(() => {
        //interval for absolute title
           let intervalID = setInterval(function(){
                setFloatTitle(false);
                clearInterval(this)
            }, 3000)

        const getProduct = objsaved.filter(item => item.id === renderNowItem)
        getProductToRender(...getProduct);
        if (getProduct[0]) {
            if (getProduct[0].cards.length > 0) {
                setInitAnimation(false);
                const b = getProduct[0].cards.filter(item => item.restoFinal === 0);
                const c = getProduct[0].cards.filter(item => item.restoFinal !== 0);
                const d = c.sort((a, b) => a.restoFinal - b.restoFinal);
                const FirstOrder = [...b, ...d];
                const lastOrder = FirstOrder.sort((a, b) => a.autopasterNum - b.autopasterNum);
                setCardsordered(lastOrder)
                //COMPROBAR SI ESTÁN TODOS LOS CAMPOS CONSUMO COMPLETOS
                handlerFullCalcModal(getProduct);
            } else {
                setInitAnimation(true);
            }
        }
        return () => clearInterval(intervalID)
    }, [renderNowItem, objsaved]);

    const handlerFloatTitle = () => {
        setFloatTitle(true);
    };

    return (
        <>
            {renderNowItem.length > 0 && productToRender ?
                <>
                    <View style={[styles.buttonsContainer, {
                        borderTopWidth: 2,
                        borderColor: 'white',
                        justifyContent: 'space-around',
                    }]}>
                        <TouchableOpacity style={styles.touchableinfo}
                                          onPress={() => setSeeData(!seeData)}
                        >
                            <Icon name={!seeData ? 'info' : 'eye'}
                                  size={25}
                                  color={seeData ? '#c2c2c2' : COLORS.buttonEdit}
                                  style={{
                                      width: 50,
                                      height: 40,
                                      backgroundColor: '#a6eeec',
                                      borderRadius: 40,
                                      borderWidth: 2,
                                      borderColor: 'white',
                                      textAlign: 'center',
                                      textAlignVertical: 'center',
                                      elevation: 12
                                  }}
                            />
                            <Icon name={!seeData ? 'angle-down' : null}
                                  size={15}
                                  color={'white'}
                                  style={{marginTop: 0}}
                            />
                            {seeData && <Icon name={'minus-a'}
                                              size={50}
                                              color={COLORS.buttonEdit}
                                              style={{
                                                  position: 'absolute',
                                                  width: 50,
                                                  height: 50,
                                                  backgroundColor: 'transparent',
                                                  color: 'red',
                                                  borderRadius: 40,
                                                  textAlign: 'center',
                                                  textAlignVertical: 'center',
                                                  transform: [
                                                      {rotateY: "45deg"},
                                                      {rotateZ: "45deg"}
                                                  ],
                                                  elevation: 12,
                                                  top: -5
                                              }}
                            />}
                        </TouchableOpacity>
                        <View style={{flexDirection: 'column', paddingTop: 20,}}>
                            <Text style={{color: 'black', fontFamily: 'Anton'}}>Producto:{' '}
                                {productToRender.title.length > 10 ?
                                    <Icon name={'eye'}
                                          size={15}
                                          color={'#adff2f'}
                                          style={{
                                              // width: 250,
                                              // height: 50,
                                              // backgroundColor: '#a6eeec',
                                              // borderRadius: 40,
                                              // borderWidth: 2,
                                              borderColor: 'white',
                                              textAlign: 'center',
                                              textAlignVertical: 'center',
                                              elevation: 12
                                          }}
                                    />
                                    :
                                    null
                                }
                            </Text>
                            <Text style={{
                                opacity: floatTitle ? 1 : 0,
                                fontFamily: 'Anton',
                                elevation: 12,
                                position: 'absolute',
                                color: 'black',
                                bottom: 10,
                                backgroundColor: 'white',
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingLeft: 20,
                                paddingRight: 20,
                                borderRadius: 5
                            }}>{productToRender.title}</Text>
                            <Text style={[styles.titlesinfo, {flexWrap: 'wrap'}]}
                                  onPress={productToRender.title.length > 10 ? () => setFloatTitle(true) : null}
                            >
                                {productToRender.title.length > 10 ? ` ${productToRender.title.slice(0, 10)}...` : productToRender.title}
                            </Text>
                        </View>
                        <View style={{paddingTop: 20,}}>
                            <Text style={{color: 'black', fontFamily: 'Anton'}}>Fecha:</Text>
                            <Text style={styles.titlesinfo}>{productToRender.date}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handlerEditCard('', true)}
                            // onPress={() => Alert.alert('hecho')}
                        >
                            <View style={{
                                width: 50,
                                height: 50,
                                backgroundColor: 'grey',
                                borderWidth: 2,
                                borderRadius: 100,
                                borderColor: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Animated.View style={{
                                    scaleX: initAnimation ? pulseAnim : 1,
                                    scaleY: initAnimation ? pulseAnim : 1
                                }}>
                                    <Icon name={'plus-a'}
                                          size={30}
                                          color={'red'}
                                          style={{
                                              width: 40,
                                              height: 40,
                                              color: 'white',
                                              backgroundColor: 'green',
                                              borderRadius: 100,
                                              textAlign: 'center',
                                              textAlignVertical: 'center'
                                          }}
                                    />
                                </Animated.View>
                            </View>
                        </TouchableOpacity>

                    </View>
                    {
                        seeData &&
                        <>
                            <View style={{
                                backgroundColor: '#ff8500',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                // paddingBottom: 15
                            }}>
                                <Text style={{color: 'black', fontFamily: 'Anton', fontSize: 15}}>Paginación: <Text
                                    style={{color: 'white', fontSize: 18}}>{productToRender.pagination}</Text></Text>
                                <Text style={{color: 'black', fontFamily: 'Anton', fontSize: 15}}>Coeficiente: <Text
                                    style={{color: 'white', fontSize: 18}}>{productToRender.coef}</Text></Text>
                            </View>
                            <Extrainfo
                                productToRender={productToRender}
                                getProductToRender={getProductToRender}
                                updateGetStorage={updateGetStorage}
                            />
                        </>
                    }
                    <ScrollView horizontal={false}>
                        {/*{objsaved ? <Text>{JSON.stringify(objsaved)}</Text> : <Text>No hay objeto guardado</Text>}*/}
                        {
                            warningText.length !== 0 &&
                            <View style={{
                                padding: 5,
                                margin: 5,
                                backgroundColor: '#ffffbb',
                                borderRadius: 5,
                                elevation: 12,
                                borderWidth: 1,
                                borderColor: '#ff6961'
                            }}>
                                <Text style={{color: '#ff6961'}}>¡ATENCIÓN!...</Text>
                                <Text style={{
                                    fontFamily: 'Anton',
                                    fontSize: 15,
                                    textAlign: 'left',
                                    color: '#ff6961',
                                    paddingLeft: 10
                                }}>{warningText.length > 0 ? `Faltan bobinas en autopasters: ${warningText}` : `Falta bobina en autopaster: ${warningText}`}</Text>
                            </View>
                        }
                        <View style={styles.secc2}>
                            {
                                productToRender.cards.length > 0 ?
                                    <>
                                        {
                                            cardsOrdered.map((item, index) => {
                                                return <CardsProduction
                                                    key={index}
                                                    item={item}
                                                    updateGetStorage={updateGetStorage}
                                                    productToRenderId={productToRender.id}
                                                    handlerEditCard={handlerEditCard}
                                                />
                                            })
                                        }
                                        <View style={{padding: 20}}/>
                                    </>
                                    :
                                    //imagen descriptiva para configurar primer desbobinador
                                    //posible función para efecto en botón crear
                                    <View style={{
                                        flex: 1,
                                        backgroundColor: 'white',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 30
                                    }}>
                                        <Icon name={'plus-a'}
                                              size={50}
                                              color={'red'}
                                              style={{
                                                  width: 70,
                                                  height: 70,
                                                  color: 'white',
                                                  backgroundColor: 'green',
                                                  borderRadius: 100,
                                                  textAlign: 'center',
                                                  textAlignVertical: 'center'
                                              }}
                                        />
                                        <Text style={{fontSize: 20, fontFamily: 'Anton'}}>crea tu primer
                                            desbobinador</Text>
                                    </View>
                            }
                        </View>
                    </ScrollView>
                </>
                :
                //imagen descriptiva para configurar primer producto
                //posible función para efecto en botón PRINCIPAL crear
                <View style={{
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 30
                }}>
                    <Icon name={'plus-a'}
                          size={30}
                          color={'red'}
                          style={{
                              width: 70,
                              height: 70,
                              color: 'white',
                              backgroundColor: 'black',
                              borderRadius: 100,
                              textAlign: 'center',
                              textAlignVertical: 'center'
                          }}
                    />
                    <Text style={{fontSize: 20, fontFamily: 'Anton'}}>Configura tu primer producto</Text>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create(
    {
        buttonsContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#ff8500'
        },
        touchableinfo: {
            width: 40,
            position: 'absolute',
            top: -20,
            left: (Dimensions.get('window').width / 2) - (40 / 2),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        titlesinfo: {
            marginLeft: 10,
            fontSize: 20,
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 5,
            color: 'white',
        }
    }
)

export default SimpleProductionContainer;