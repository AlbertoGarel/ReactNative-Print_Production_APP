import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView, ActivityIndicator} from 'react-native';
import {LineChart} from "react-native-chart-kit";
import {ForeignObject} from "react-native-svg";
import CustomPicker from "./FormComponents/CustomPicker";
import {Picker} from '@react-native-picker/picker';
import {COLORS} from "../assets/defaults/settingStyles";
import RoundButtonBattery from "./RoundButtonBattery";
import {setFormatDAta} from "../utils";

const LineChartComponent = ({data, textStyle}) => {

    const [tooltipPos, setTooltipPos] = useState({
        x: 0,
        y: 0,
        visible: false,
        value: 0,
    });

    const [fullItems, getFullItems] = useState([]);
    const [formatDataState, getFormatDataState] = useState([]);
    const [pickerValueSelected, getPickerValueSelected] = useState([]);
    const [formatedDataForChart, setFormatedDataForChart] = useState([]);

    useEffect(() => {
        let isMounted = true;
        if (data) {
            if (data.length > 1) {
                data.sort((a, b) => Date.parse(b.fechaproduccion) - Date.parse(a.fechaproduccion))
            }
            getFullItems(data);
            setFormatDAta(data).then(r => {
                getFormatDataState(r)
                getPickerValueSelected(r[0].value)
                setFormatedDataForChart(getDataForChart(data, r[0].value))
            }).catch(e => e);
        }
        return () => isMounted = false;
    }, [data]);

    const handlervalueLineChart = (RoundedBtnvalue) => {
        setFormatedDataForChart(getDataForChart(fullItems, pickerValueSelected, RoundedBtnvalue))
    };

    return (
        <View>
            <View style={styles.viewInputSelect}>
                <View style={styles.textContainer}>
                    <Text style={[textStyle, styles.text]}>Ejemplares Efectivos y Nulos por mes.</Text>
                </View>
                <View style={styles.parentButtons}>
                    <RoundButtonBattery getValue={handlervalueLineChart} labels={['estandar', 'todos']}/>
                    <View style={styles.contPicker}>
                        {formatDataState.length > 0 ? <CustomPicker
                                mode="dialog"
                                prompt={'Escoge una opción'}
                                style={{
                                    borderColor: COLORS.black,
                                    backgroundColor: 'transparent',
                                    borderWidth: 2
                                }}
                                itemStyle={{
                                    fontFamily: 'Anton'
                                }}
                                name={'pickerlabel'}
                                selectedValue={pickerValueSelected}
                                onValueChange={(itemValue) => {
                                    if (itemValue) {
                                        getPickerValueSelected(itemValue)
                                        setFormatedDataForChart(getDataForChart(fullItems, itemValue))
                                    }
                                }}
                                dataOptionsPicker={
                                    formatDataState.map((item, index) => {
                                        return <Picker.Item key={index}
                                                            label={item.label}
                                                            value={item.value}/>
                                    })
                                }
                                defaultlabelcolor={'#000'}
                            />
                            :
                            <ActivityIndicator size="small" color="#0000ff"/>}
                    </View>
                </View>
            </View>
            <View>
                <ScrollView horizontal={true}>
                    <LineChart
                        verticalLabelRotation={30}
                        data={Object.keys(formatedDataForChart).length > 0 ? {
                            labels: formatedDataForChart.labels,
                            datasets: [
                                {
                                    data: formatedDataForChart.data1,
                                    color: (opacity = 1) =>
                                        `rgba(250, 250, 250, ${opacity})`,
                                },
                                {
                                    data: formatedDataForChart.data2,
                                    color: (opacity = 1) =>
                                        `rgb(211,211,211, ${.5})`,
                                }
                            ],
                        } : {labels: [0], datasets: [{data: [0]}]}}
                        width={100 * 6} // 100 * number of elements +1 max normal mode
                        height={300}
                        // yAxisLabel=""
                        yAxisSuffix=""
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "1",
                                stroke: "#ffa726"
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 3,
                            borderRadius: 16,
                        }}
                        decorator={() => {
                            return tooltipPos.visible ? (
                                <ForeignObject x={tooltipPos.x} y={tooltipPos.y}>
                                    <View
                                        style={styles.decorator}>
                                        <Text
                                            style={styles.textDecorator}>
                                            {tooltipPos.value}
                                        </Text>
                                    </View>
                                </ForeignObject>
                            ) : null;
                        }}
                        onDataPointClick={(data) => {
                            let isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;
                            isSamePoint
                                ? setTooltipPos((previousState) => {
                                    return {
                                        ...previousState,
                                        value: data.value,
                                        visible: !previousState.visible,
                                    };
                                })
                                : setTooltipPos({
                                    x: data.x,
                                    value: data.value,
                                    y: data.y,
                                    visible: true,
                                });
                        }}
                    />
                </ScrollView>
                <View style={styles.footerCont}>
                    <Text style={[styles.footerText, styles.color1]}>ejemplares efectivos</Text>
                    <Text style={[styles.footerText, styles.color2]}>ejemplares brutos</Text>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    viewInputSelect: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: 'space-evenly',
        alignItems: 'center',
        overflow: 'hidden'
    },
    text: {
        flexWrap: "wrap"
    },
    footerCont: {
        height: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    footerText: {
        fontFamily: 'Anton',
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
        borderRadius: 5,
        textShadowColor: COLORS.black,
        fontSize: 11
    },
    color1: {
        color: '#d3d3d3'
    },
    color2: {
        color: '#fafafa'
    },
    textContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    parentButtons: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    contPicker: {
        width: '48%',
        borderWidth: 1,
        borderColor: COLORS.white,
        margin: 3,
        borderRadius: 5,
    },
    decorator: {
        width: 70,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: 2,
        borderColor: '#aaa',
        display: 'flex',
        justifyContent: 'center'
    },
    textDecorator: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
export default LineChartComponent;

const getDataForChart = (formattedPropsData, pickerVal, valNumButton = 0) => {
    const ObjectData = {labels: [], data1: [], data2: []};
    formattedPropsData.filter((item, index) => {
        if (item.fechaproduccion.includes(pickerVal)) {
            ObjectData.labels.push(item.fechaproduccion);
            ObjectData.data1.push(item.tiradabruta);
            ObjectData.data2.push(item.ejemplares);
        }
    });

    ObjectData.labels.reverse();
    ObjectData.data1.reverse();
    ObjectData.data2.reverse();

    if (valNumButton === 0 && ObjectData.labels.length > 7) {
        ObjectData.labels = ObjectData.labels.slice(ObjectData.labels.length - 7, ObjectData.labels.length);
        ObjectData.data1 = ObjectData.data1.slice(ObjectData.labels.length - 7, ObjectData.labels.length);
        ObjectData.data2 = ObjectData.data2.slice(ObjectData.labels.length - 7, ObjectData.labels.length);
    }
    return ObjectData;
}