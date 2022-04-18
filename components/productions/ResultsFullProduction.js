import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import HRtag from "../HRtag";
import SvgComponent from "../SvgComponent";
import {icon360SVG} from "../../assets/svg/svgContents";

const ResultFullProduction = ({finalCalc, item}) => {

    const [prev, setPrev] = useState(0);
    const [prevPercentage, setPrevPercentage] = useState('¿?');

    useEffect(() => {
        let is_mounted = true;
        if (is_mounted) {
            if (Object.keys(item).length > 0 && finalCalc.tiradaBruta > 0) {
                const calcprev = Math.round(item['tirada'] + item['nulls'])
                const setPerc = Math.round(((calcprev - finalCalc.tiradaBruta) / finalCalc.tiradaBruta) * 100)
                setPrev(calcprev);
                setPrevPercentage(setPerc);
            }
        }
        return () => is_mounted = false;
    }, [finalCalc, item]);

    const calcPercentage = () => {

    };

    return (
        <View style={styles.parent}>
            <View style={[styles.soon1, styles.commonCardStyle]}>
                <Text style={styles.Titles}>total tirada</Text>
                <Text style={[styles.commonText, styles.numbers]}>{finalCalc.tiradaBruta}</Text>
                <Text style={[styles.subtext]}>ejemplares</Text>
                <HRtag
                    borderWidth={2}
                    borderColor={COLORS.white}
                    margin={0}
                />
                <Text style={[styles.subtext, {textAlign: 'left'}]}>ejemplares previstos</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Text
                        style={styles.Titles}>{prev > 0 ? prev : '-'}</Text>
                    <Text style={styles.Titles}>{prevPercentage > 0 ? `+ ${prevPercentage}` : prevPercentage} %</Text>
                </View>
            </View>
            <View style={[styles.soon2, styles.commonCardStyle, styles.horizontalCards, {marginBottom: separator / 2}]}>
                <Text style={styles.Titles}>kilos tirada</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                    <Text style={[styles.commonText, styles.numbers]}>{finalCalc.kilosTirada}</Text>
                    <Text style={[styles.Titles]}>KG.</Text>
                </View>
            </View>
            <View style={[styles.soon3, styles.commonCardStyle, styles.horizontalCards]}>
                <Text style={styles.Titles}>kilos consumidos</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                    <Text style={[styles.commonText, styles.numbers]}>{finalCalc.kilosConsumidos}</Text>
                    <Text style={[styles.Titles]}>KG.</Text>
                </View>
            </View>
        </View>
    )
}

const separator = 8;

const styles = StyleSheet.create({
    parent: {
        // flex: 1,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: separator
    },
    soon1: {
        backgroundColor: '#ff6565',
        width: '48%',
        height: '100%',
    }
    , soon2: {
        backgroundColor: 'purple',
    }
    , soon3: {
        backgroundColor: '#5086c1',
    },
    horizontalCards: {
        width: '50%',
        height: '48%',
        marginLeft: separator,
    },
    commonCardStyle: {
        borderRadius: 10,
        paddingLeft: separator,
        paddingRight: separator
    },
    commonText: {
        fontFamily: 'Anton',
    },
    Titles: {
        fontFamily: 'Anton',
        fontSize: 18,
        color: COLORS.white,
        textTransform: 'capitalize'
    },
    subtext: {
        textAlign: 'right',
        fontSize: 12,
        color: COLORS.white
    },
    numbers: {
        fontSize: 30, color: COLORS.white,
        textAlign: 'center'
    }
});
export default ResultFullProduction;