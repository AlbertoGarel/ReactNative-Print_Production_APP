import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Modal, TouchableOpacity, SectionList} from 'react-native';
import {StackedBarChart} from "react-native-chart-kit";
import {COLORS, shadowPlatform} from "../assets/defaults/settingStyles";
import {setValueForInput} from "../utils";
import TouchableIcon from "./TouchableIcon";
import {list2SVG, simpleArrowSVG} from "../assets/svg/svgContents";
import HRtag from "./HRtag";
import SvgComponent from "./SvgComponent";
import SpinnerSquares from "./SpinnerSquares";

const StackedBartChartComponent = ({data, width, textStyle}) => {

    const [FormatedFullItems, getFormatedFullItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [negative, setNegative] = useState(false)
    const [dataSelected, getDataSelected] = useState({
        data: [],
        labels: [''],
        paginacion: '',
        ediciones: '',
        ejemplares: '',
        tiradabruta: '',
        nulos: ''
    });

    useEffect(() => {
        let isMounted = true;
        if (data) {
            const grouped = data.sort((a, b) => Date.parse(b.fechaproduccion) - Date.parse(a.fechaproduccion)).reduce((acc, item, index) => {
                let mes = setValueForInput(item.fechaproduccion);
                let year = item.fechaproduccion.slice(0, 4);
                if (index === 0) {
                    //sets state with the first item sorted while the grouping is being created
                    const prevNegative = item.kilosconsumidos - item.kilostirada;
                    if (prevNegative < 0) setNegative(true);
                    getDataSelected({
                        data: [item.kilosconsumidos, (prevNegative < 0 ? null : prevNegative)],
                        labels: [item.fechaproduccion],
                        paginacion: item.paginacion,
                        ediciones: item.ediciones,
                        ejemplares: item.ejemplares,
                        tiradabruta: item.tiradabruta,
                        nulos: (item.tiradabruta - item.ejemplares)
                    })
                }
                acc[mes] ?
                    acc[mes]['data'].push(item)
                    :
                    acc[mes] = {
                        title: `${mes}, ${year}`,
                        data: [item]
                    };
                return acc;
            }, {});
            const elements = Object.values(grouped)
            getFormatedFullItems(elements);
        }

        return () => isMounted = false;
    }, [data]);

    const handlerSelectedItem = (title) => {
        const {fechaproduccion, paginacion, tiradabruta, ejemplares, ediciones, kilostirada, kilosconsumidos} = title;
        const nulos = tiradabruta - ejemplares;
        const prevNegative = kilosconsumidos - kilostirada;
        if (prevNegative < 0) setNegative(true)
        const updateState = {
            data: [kilosconsumidos, prevNegative <= 0 ? null : prevNegative],
            labels: [fechaproduccion],
            paginacion: paginacion,
            ediciones: ediciones,
            ejemplares: ejemplares,
            tiradabruta: tiradabruta,
            nulos: nulos
        };
        getDataSelected(updateState)
        setModalVisible(!modalVisible);
    }
    const Item = ({title}) => (
        <TouchableOpacity
            style={[styles.item, {justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}]}
            onPress={() => handlerSelectedItem(title)}
        >
            <View style={styles.rowCenter}>
                <Text style={[styles.title, {color: COLORS.primary}]}>{title.fechaproduccion}</Text>
                <Text style={[styles.title]}>paginación:<Text
                    style={[styles.title, {color: COLORS.primary}]}> {title.paginacion}</Text></Text>
                <Text style={[styles.title]}>ediciones:<Text
                    style={[styles.title, {color: COLORS.primary}]}> {title.ediciones}</Text></Text>
            </View>
            <SvgComponent svgWidth={20} svgHeight={20} svgData={simpleArrowSVG}/>
        </TouchableOpacity>
    );


    return (
        <>
            <Text style={textStyle}>Datos de producción por fecha</Text>
            {dataSelected.data.length > 0 ?
                <>
                    <StackedBarChart
                        style={{
                            alignSelf: 'flex-start',
                            background: 'transparent'
                        }}
                        data={{
                            labels: dataSelected.labels,
                            data: [
                                dataSelected.data,
                            ],
                            barColors: ["#d9bf7f", "#b67a80"],
                        }}
                        width={width}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            barPercentage: 1.3,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                    />
                    <View style={{...styles.contData, width: width / 2}}>
                        <View style={styles.centeredView}>
                            {negative &&
                            <View style={{backgroundColor: COLORS.white, padding: 2, margin: 2, borderRadius: 5}}>
                                <Text style={{
                                    color: 'red',
                                    fontSize: 10
                                }}>Se computaron en infome más kg. de tirada que consumidos.</Text>

                            </View>
                            }
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => handlerSelectedItem}
                            >
                                <View style={styles.centeredView}>
                                    <View style={[styles.modalView, {width: width - 20}]}>
                                        <View style={styles.contTouchable}>
                                            <TouchableOpacity
                                                style={[styles.buttonClose, styles.rowCenter]}
                                                onPress={() => setModalVisible(!modalVisible)}
                                            >
                                                <Text style={styles.closetext}>CERRAR</Text>
                                                <View style={[styles.viewX, styles.rowCenter]}>
                                                    <Text style={styles.textStyle}>X</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <SectionList
                                            sections={FormatedFullItems}
                                            keyExtractor={(item, index) => item + index}
                                            renderItem={({item}) => <Item title={item}/>}
                                            ItemSeparatorComponent={() => <HRtag borderWidth={.5}
                                                                                 borderColor={'#8f7193'}
                                                                                 margin={5}/>}
                                            renderSectionHeader={({section: {title}}) => <Text
                                                style={styles.header}>{title}</Text>}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        </View>
                        <TouchableIcon touchableStyle={[styles.touchableIcon, styles.rowCenter]}
                                       svgName={list2SVG} heightSVG={40}
                                       WidthSVG={30} text={'seleccionar fecha'} styleText={styles.touchableIconText}
                                       handlerOnPress={() => setModalVisible(!modalVisible)}
                        />
                        <View>
                            <Text style={[styles.textInfo, styles.textInfoColor1]}>Paginación: <Text
                                style={[styles.textInfo, styles.textInfoColor2]}>{dataSelected.paginacion}</Text> páginas.</Text>
                            <Text style={[styles.textInfo, styles.textInfoColor1]}>Ediciones: <Text
                                style={[styles.textInfo, styles.textInfoColor2]}>{dataSelected.ediciones}</Text></Text>
                            <Text style={[styles.textInfo, styles.textInfoColor1]}>T. bruta: <Text
                                style={[styles.textInfo, styles.textInfoColor2]}>{dataSelected.tiradabruta}</Text> ejemplares.</Text>
                            <Text style={[styles.textInfo, styles.textInfoColor1]}>Ejemplares: <Text
                                style={[styles.textInfo, styles.textInfoColor2]}>{dataSelected.ejemplares}</Text> ejemplares.</Text>
                            <Text style={[styles.textInfo, styles.textInfoColor1]}>Nulos: <Text
                                style={[styles.textInfo, styles.textInfoColor2]}>{dataSelected.nulos}</Text> ejemplares.</Text>
                        </View>
                    </View>
                </>
                :
                <View style={{width: width, height: 220}}>
                    <SpinnerSquares/>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchableIcon: {
        alignSelf: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.whitesmoke,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#8f7193',
        ...shadowPlatform
    },
    touchableIconText: {
        fontFamily: 'Anton',
        marginRight: 10,
        color: COLORS.whitesmoke
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        maxHeight: 400,
        overflow: 'hidden',
        paddingVertical: 5,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 4,
        borderColor: '#e2e2e2',
    },
    buttonClose: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 5,
        margin: 5
    },
    viewX: {
        backgroundColor: COLORS.primary,
        width: 20,
        height: 20,
        borderRadius: 5,
    },
    textStyle: {
        fontSize: 15,
        color: "white",
        fontWeight: "bold",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    container: {
        flex: 1,
        marginHorizontal: 16,
    },
    item: {
        backgroundColor: COLORS.whitesmoke,
        borderRadius: 5,
        paddingVertical: 10,
        marginVertical: 1,
    },
    header: {
        fontFamily: 'Anton',
        paddingHorizontal: 5,
        borderRadius: 5,
        paddingVertical: 5,
        color: COLORS.white,
        backgroundColor: '#8f7193',
    },
    title: {
        fontFamily: 'Anton',
        color: '#8f7193',
        paddingLeft: 15,
    },
    textInfo: {
        fontFamily: 'Anton',
        fontSize: 12,
    },
    textInfoColor1: {
        color: "#8f7193"
    },
    textInfoColor2: {
        color: COLORS.whitesmoke
    },
    contData: {
        height: 'auto',
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 10,
        borderRadius: 5
    },
    contTouchable: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    closetext: {
        fontSize: 12,
        fontFamily: 'Anton',
        marginRight: 5
    }
})
export default StackedBartChartComponent;