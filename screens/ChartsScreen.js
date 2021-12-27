import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import SpinnerSquares from "../components/SpinnerSquares";
import {COLORS} from "../assets/defaults/settingStyles";

const {width, height} = Dimensions.get('window');

const DATA = [
    {
        produccresult_id: 1,
        tiradabruta: 2000,
        kilostirada: 500,
        kilosConsumidos: 600,
        fechaproduccion: '2021-12-23',
        ejemplares: 11500,
        paginacion: 56,
        nombre_producto: 'levante'
    },
    {
        produccresult_id: 2,
        tiradabruta: 2000,
        kilostirada: 500,
        kilosConsumidos: 600,
        fechaproduccion: '2021-12-23',
        ejemplares: 11500,
        paginacion: 56,
        nombre_producto: 'provincias'
    },
    {
        produccresult_id: 3,
        tiradabruta: 2000,
        kilostirada: 500,
        kilosConsumidos: 600,
        fechaproduccion: '2021-12-23',
        ejemplares: 11500,
        paginacion: 56,
        nombre_producto: 'levante'
    },
    {
        produccresult_id: 4,
        tiradabruta: 2000,
        kilostirada: 500,
        kilosConsumidos: 600,
        fechaproduccion: '2021-12-23',
        ejemplares: 11500,
        paginacion: 56,
        nombre_producto: 'provincias'
    },
    {
        produccresult_id: 5,
        tiradabruta: 2000,
        kilostirada: 500,
        kilosConsumidos: 600,
        fechaproduccion: '2021-12-23',
        ejemplares: 11500,
        paginacion: 56,
        nombre_producto: 'levante'
    },
    {
        produccresult_id: 6,
        tiradabruta: 2000,
        kilostirada: 500,
        kilosConsumidos: 600,
        fechaproduccion: '2021-12-23',
        ejemplares: 11500,
        paginacion: 56,
        nombre_producto: 'paraula'
    },
    {
        produccresult_id: 7,
        tiradabruta: 2000,
        kilostirada: 500,
        kilosConsumidos: 600,
        fechaproduccion: '2021-12-23',
        ejemplares: 11500,
        paginacion: 56,
        nombre_producto: 'la voz de tu comarca'
    },
]

const headers = ['Provincias', 'La voz de tu comarca', 'Levante', 'header header4', 'header5', 'header header6', 'header7', 'header header8', 'header9', 'header10']

let animationActive = true;
let animationActiveRef;
let index = 1
const ChartsScreen = () => {
    const [active, setActive] = useState(0)
    const headerScrollView = useRef({});
    const itemScrollView = useRef();
    //states data
    const [groupedItems, getGroupedItems] = useState([{'1': {data: []}}]);
    const [itemTitles, getItemTitles] = useState(['outer']);

    useEffect(() => {
        headerScrollView.current.scrollToIndex({index: active, viewPosition: 0.5})
    }, [active]);

    useEffect(() => {
        getItemTitles(Object.keys(toGroup(DATA)))
        getGroupedItems(toGroup(DATA))
        console.log('groupedItems', Object.values(groupedItems))
    }, []);

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
    }
    //Render item component
    const Item = ({item, index}) => {
        return <View style={styles.mainItem}>
            <ScrollView>
                {/*<Text>card {index + 1}</Text>*/}
                {/*{item.data ?*/}
                {/*    item.data.map((item, index) => {*/}
                {/*        return (*/}
                {/*            <View key={item.produccresult_id} style={{margin: 2,  backgroundColor: '#e2e2e2',width: index === 0 ? '97%' : '48%'}}>*/}
                {/*                <Text>Animation happens while scrolling itself</Text>*/}
                {/*                <Text>{item.produccresult_id}</Text>*/}
                {/*                <Text>{item.nombre_producto}</Text>*/}
                {/*            </View>*/}
                {/*        )*/}
                {/*    })*/}
                {/*    :*/}
                {/*    null*/}
                {/*}*/}
                <View style={styles.cont1}><Text>Nulls vs goods: Pie chart</Text></View>
                <View style={styles.cont2}><Text>Number of newspapers: Bezier Line Chart</Text></View>
                <View style={styles.cont3}><Text>Consumption: StackedBar chart</Text></View>
                <View style={styles.cont4}><Text>Date's production: Contribution graph (heatmap)</Text></View>
            </ScrollView>
        </View>

    };

    const onPressHeader = (index = 1) => {
        if (animationActiveRef) {
            clearTimeout(animationActiveRef)
        }
        if (active !== index) {
            animationActive = false
            animationActiveRef = setTimeout(() => {
                animationActive = true
            }, 400);
            itemScrollView.current.scrollToIndex({index})
            setActive(index);
        }
    }

    const onScroll = (e) => {
        const x = e.nativeEvent.contentOffset.x;
        let newIndex = Math.floor((x / width) + 0.5)
        if (active != newIndex && animationActive) {
            setActive(newIndex)
        }
    }

    const onMomentumScrollEnd = () => {
        animationActive = true;
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <FlatList
                    data={Object.keys(groupedItems)}
                    ref={headerScrollView}
                    keyExtractor={(item) => item}
                    horizontal
                    style={styles.headerScroll}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index}) => (
                        <View>
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
                    )}
                />
                <FlatList
                    data={Object.values(groupedItems)}
                    ref={itemScrollView}
                    keyExtractor={(item, index) => item.title + index}
                    horizontal
                    pagingEnabled
                    decelerationRate='fast'
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    renderItem={({item, index}) => <Item item={item} index={index}/>}
                />
            </View>
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
        // alignItems: 'center',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // justifyContent: 'space-evenly',
        // alignContent: 'stretch'
        // justifyContent: 'flex-start',

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
        backgroundColor: 'transparent',
        width: width <= 768 ? '100%' : '50%',
        height: 200,
    },
    cont2: {
        backgroundColor: 'blue',
        height: 200,
    },
    cont3: {
        backgroundColor: 'violet',
        height: 200,
    },
    cont4: {
        backgroundColor: 'greenyellow',
        height: 200,
    }
})
export default ChartsScreen;