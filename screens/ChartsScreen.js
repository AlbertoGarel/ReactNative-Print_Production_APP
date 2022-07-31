import React, {useEffect, useRef, useState} from 'react';
import {
    SafeAreaView,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    PanResponder,
    ActivityIndicator,
    Image
} from 'react-native';
import {COLORS} from "../assets/defaults/settingStyles";
import {LinearGradient} from "expo-linear-gradient";
import * as SQLite from "expo-sqlite";
import LineChartComponent from "../components/LineChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import StackedBartChartComponent from "../components/StackedBartChartComponent";
import SpinnerSquares from "../components/SpinnerSquares";
import {Sentry_Alert} from "../utils";

const productresult_table =
    `SELECT a.productresult_id,
    a.tiradabruta, a.kilostirada, a.kilosconsumidos,
    a.fechaproduccion, a.ejemplares, a.paginacion,
    a.ediciones, e.producto_name AS 'nombre_producto'
    FROM productresults_table a, producto_table e
    WHERE a.nombre_producto = e.producto_id;`;

const {width} = Dimensions.get('window');
let animationActive = true;
let animationActiveRef;

const ChartsScreen = () => {

    const db = SQLite.openDatabase('bobinas.db');

    const headerScrollView = useRef({});
    const itemScrollView = useRef();
    const [active, setActive] = useState(0);
    const [dataSourceCords, setDataSourceCords] = useState([])
    //states data
    const [groupedItems, getGroupedItems] = useState(['']);
    const [itemTitles, getItemTitles] = useState([]);
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        if (!empty) {
            headerScrollView.current.scrollTo({x: dataSourceCords[active], y: 0, animated: true})
        }
        clearTimeout(animationActiveRef)
    }, [active, empty]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                productresult_table,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        const groupedData = toGroup(_array);
                        getItemTitles(Object.keys(groupedData).sort());
                        getGroupedItems(groupedData);
                        setEmpty(false)
                    } else {
                        setEmpty(true)
                    }
                }
            );
        }, err => Sentry_Alert('ChartsScreen.js', 'transaction - productresult_table', err));
    }, []);

    const panResponderOFF = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => {
                itemScrollView.current.setNativeProps({scrollEnabled: false})
            },
        })
    ).current;

    const panResponderON = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => {
                itemScrollView.current.setNativeProps({scrollEnabled: true})
            },
        })
    ).current;

    // group items
    const toGroup = (arr) => {
        return arr.reduce((acc, item) => {
            const title = item.nombre_producto
            acc[item.nombre_producto] ?
                acc[title]['data'].push(item)
                :
                acc[title] = {title: title, data: [item]}
            return acc;
        }, {});
    };

    const HandlerStateCoordenateHeaderItems = (event, index) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[index] = layout.x;
        setDataSourceCords(dataSourceCords);
    };

    const RenderHeader = ({item}) => {
        return item.map((item, index) => {
            return (
                <View key={index}
                      onLayout={(event) => HandlerStateCoordenateHeaderItems(event, index)}>
                    <TouchableOpacity
                        onPress={() => onPressHeader(index)}
                        key={item}
                        style={[styles.headerItem, {backgroundColor: active === index ? COLORS.buttonEdit + '50' : COLORS.primary + '50'}]}
                    >
                        <Text style={{
                            textTransform: 'capitalize',
                            fontFamily: 'Anton',
                            color: active === index ? COLORS.primary : '#000'
                        }}>{item}</Text>
                    </TouchableOpacity>
                    {active === index && <View style={styles.headerBar}/>}
                </View>
            )
        });
    };

    const onMomentumScrollEnd = () => {
        animationActive = true;
    };

    const onScroll = (e) => {
        const x = e.nativeEvent.contentOffset.x;
        let newIndex = Math.floor((x / width) + 0.5)
        if (active === newIndex) {
            animationActive = true;
        }
        if (active !== newIndex && animationActive) {
            setActive(newIndex)
        }
    }

    const onPressHeader = (index = 1) => {
        if (animationActiveRef) {
            clearTimeout(animationActiveRef)
        }
        if (active !== index) {
            animationActive = false
            animationActiveRef = setTimeout(() => {
                animationActive = true
            }, 200);
            itemScrollView.current.scrollTo({x: width * index, y: 0, animated: true})
            setActive(index);
        }
    };


    if (empty) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Image
                    style={{backgroundColor: 'transparent', resizeMode: 'contain'}}
                    source={require('../assets/images/graf.png')}
                />
                <Text style={{
                    fontFamily: 'Anton',
                    fontSize: 20
                }}>NO EXISTEN REGISTROS.</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{minHeight: 40}}>
                <ScrollView nestedScrollEnabled horizontal snapToEnd={false} ref={headerScrollView}
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            decelerationRate={0}
                            scrollEventThrottle={21}>
                    {itemTitles.length > 0 ? <RenderHeader item={itemTitles}/> :
                        <View style={{
                            backgroundColor: COLORS.primary + '50',
                            width: width,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}><ActivityIndicator size="small" color="#0000ff"/></View>}
                </ScrollView>
            </View>
            <ScrollView pagingEnabled horizontal alwaysBounceHorizontal={false}
                        automaticallyAdjustContentInsets={false}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        ref={itemScrollView}
                        onScroll={onScroll}>
                {groupedItems ?
                    Object.values(groupedItems).sort((a, b) => (a.title < b.title) ? -1 : ((a.title > b.title) ? 1 : 0)).map((item, index) => {
                        return (
                            <ScrollView nestedScrollEnabled key={index}
                                        contentContainerStyle={{width: width}}
                                        showsVerticalScrollIndicator={false}
                                        directionalLockEnabled={true}
                            >
                                <View style={styles.mainItem}>
                                    <View style={styles.cont1} {...panResponderON.panHandlers}>
                                        <LinearGradient colors={['#fb8c00', '#ffa726']} style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            borderRadius: 16,
                                        }}/>
                                        <PieChartComponent data={item.data} title={item.title}
                                                           textStyle={styles.titlegraf} width={width}/>
                                    </View>
                                    <View style={styles.cont2} {...panResponderON.panHandlers}>
                                        <LinearGradient colors={['#fb8c00', '#ffa726']} style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            borderRadius: 16,
                                        }}/>
                                        <StackedBartChartComponent data={item.data} width={width}
                                                                   textStyle={styles.titlegraf}/>
                                    </View>
                                    <View style={styles.cont3} {...panResponderOFF.panHandlers}>
                                        <LinearGradient colors={['#ffa726', '#fb8c00']} style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            borderRadius: 16,
                                        }}/>
                                        <LineChartComponent data={item.data} textStyle={styles.titlegraf}/>
                                    </View>
                                </View>
                            </ScrollView>
                        )
                    })
                    :
                    <SpinnerSquares/>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerScroll: {
        flexGrow: 0,
    },
    headerItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
    },
    mainItem: {
        width: width,
        borderWidth: 5,
        borderColor: '#FFF',
        backgroundColor: '#FFF',
    },
    headerBar: {
        height: 3,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: COLORS.primary,
        position: 'absolute',
        bottom: 0
    },
    cont1: {
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginVertical: 3,
        overflow: 'hidden'
    },
    cont2: {
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginVertical: 3,
        overflow: 'hidden'
    },
    cont3: {
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 16,
        marginVertical: 3,
        overflow: 'hidden',
    },
    cont4: {
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 16,
        marginVertical: 3,
        overflow: 'hidden',
    },
    titlegraf: {
        fontFamily: 'Anton',
        color: COLORS.white,
        textAlign: 'center'
    }
})
export default ChartsScreen;
