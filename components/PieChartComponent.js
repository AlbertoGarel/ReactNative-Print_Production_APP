import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PieChart} from "react-native-chart-kit";
import RoundButtonBattery from "./RoundButtonBattery";
import FlipCard from "./FlipCard";
import {shadowPlatform} from "../assets/defaults/settingStyles";

const BackContentFlip = ({kgNulos, kgjefect}) => {
    return (
        <View style={styles.subcontFlip}>
            <Text style={[styles.textFlip, {color: '#FFAEBC'}]}>Kg. efectivos: {kgjefect} kg</Text>
            <Text style={[styles.textFlip, {color: '#D0DDFF'}]}>Kg. nulos: {kgNulos} kg</Text>
        </View>
    )
};

const FrontContentFlip = ({ejNulos, ejefect}) => {
    return (
        <View style={styles.subcontFlip}>
            <Text style={[styles.textFlip, {color: '#FFBD58'}]}>Ej. efectivos: {ejefect} uds.</Text>
            <Text style={[styles.textFlip, {color: '#ffead8'}]}>Ej. nulos: {ejNulos} uds.</Text>
        </View>
    )
};

const PieChartComponent = ({data, title, textStyle, width}) => {
    const [dataStateEjemplares, setDataStateEjemplares] = useState([{
        name: " Efectivos",
        ejemplares: 0,
        color: '#FFBD58',
        legendFontColor: "#000",
        legendFontSize: 13
    }, {
        name: " Nulos",
        ejemplares: 0,
        color: "#ffead8",
        legendFontColor: "#000",
        legendFontSize: 13
    }]);
    const [dataStateKilos, setDataStateKilos] = useState([{
        name: " Efectivos",
        kilos: 0,
        color: '#FFAEBC',
        legendFontColor: "#000",
        legendFontSize: 13
    }, {
        name: " Nulos",
        kilos: 0,
        color: '#D0DDFF',
        legendFontColor: "#000",
        legendFontSize: 13
    }]);
    const [stateRoundeBtn, getStateRoundeBtn] = useState(0);

    useEffect(() => {
        let isMounted = true;
        if (data) {
            const sumValues = data.reduce((acc, {ejemplares, tiradabruta, kilosconsumidos, kilostirada}) => {
                acc.ejemplaresReduce += ejemplares;
                acc.tiradaBrutaReduce += tiradabruta;
                acc.kilosconsumptionReduce += kilosconsumidos;
                acc.kilostiradaReduce += kilostirada;
                return acc
            }, {ejemplaresReduce: 0, tiradaBrutaReduce: 0, kilosconsumptionReduce: 0, kilostiradaReduce: 0});

            const updateKilos = [...dataStateKilos];
            updateKilos[0].kilos = sumValues.kilostiradaReduce
            const prevNegative = sumValues.kilosconsumptionReduce - sumValues.kilostiradaReduce;
            updateKilos[1].kilos = prevNegative < 0 ? 0 : prevNegative;
            setDataStateKilos(updateKilos);

            const updateEjemplares = [...dataStateEjemplares];
            updateEjemplares[0].ejemplares = sumValues.ejemplaresReduce
            updateEjemplares[1].ejemplares = sumValues.tiradaBrutaReduce - sumValues.ejemplaresReduce
            setDataStateEjemplares(updateEjemplares)
        }

        return () => isMounted = false;
    }, [data]);

    return (
        <>
            <Text style={textStyle}>Datos globales de consumo {title}</Text>
            <View
                style={styles.contButtons}>
                <View style={{flexDirection: 'row'}}>
                    <RoundButtonBattery labels={['Ejemplares', 'Kilogramos']} getValue={getStateRoundeBtn}/>
                </View>
                <FlipCard ContentFront={() => <FrontContentFlip ejefect={dataStateEjemplares[0].ejemplares}
                                                                ejNulos={dataStateEjemplares[1].ejemplares}/>}
                          ContentBack={() => <BackContentFlip kgjefect={dataStateKilos[0].kilos}
                                                              kgNulos={dataStateKilos[1].kilos}/>} contheight={'auto'}
                          contweight={150}
                          parentStyle={{marginRight: 10}} enabled={0} flipnow={stateRoundeBtn}/>
            </View>
            <PieChart
                data={stateRoundeBtn === 0 ? dataStateEjemplares : dataStateKilos}
                width={width}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                }}
                accessor={stateRoundeBtn === 0 ? "ejemplares" : "kilos"}
                backgroundColor={"transparent"}
            />
        </>
    )
};
const styles = StyleSheet.create({
    subcontFlip: {
        // backgroundColor: '#586383',
        backgroundColor: '#8f7193',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#C2C2C2', ...shadowPlatform
    },
    textFlip: {color: 'white', fontSize: 12, fontFamily: 'Anton'},
    contButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 5
    }
});
export default PieChartComponent;