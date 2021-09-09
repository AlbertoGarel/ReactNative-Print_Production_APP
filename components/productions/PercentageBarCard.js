import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';

const PercentageBarCard = ({
                               data,
                               styleParent,
                               styleSubParent,
                               // radiusState,
                               item
                           }) => {
    const [percentage, setPercentage] = useState('')

    // const calcPercentage = (radius) => {
    //     let percent = Math.round((data.restoInicio / data.pesoOriginal) * 100);
    //     if (radius === 0) {
    //         percent = 0;
    //     }
    //     if (parseInt(data.restoFinal)) {
    //         percent = Math.round((data.restoFinal / data.pesoOriginal) * 100);
    //     }
    //     console.log('percenttt', percent)
    //     return percent;
    // }
    const colors = (radius) => {
        let percent;
        switch (true) {
            case radius <= 20:
                percent = '#FF9999';
                break;
            case radius > 20 && radius < 50:
                percent = '#FFFF99';
                break;
            case radius >= 50 && radius <= 70:
                percent = '#FFbe61';
                break;
            case radius > 70:
                percent = '#BBFFBB';
                break;
            default:
                percent = '#000';
                break;
        }
        return percent;
    }

    useEffect(() => {
        let percent = Math.round((data.restoInicio / data.pesoOriginal) * 100);
        if (item.radio === 0) {
            percent = 0;
        }
        if (parseInt(data.restoFinal)) {
            percent = Math.round((data.restoFinal / data.pesoOriginal) * 100);
        }
        setPercentage(percent);
    }, [item.radio, data])

    return (
        <View style={styleParent}>
            <View style={styleSubParent}>
                <View style={[styles.bar, {
                    width: percentage ? percentage + '%' : 0,
                    backgroundColor: colors(percentage)
                }]}/>
            </View>
            <Text style={{marginLeft: 10}}>{percentage ? percentage + '%' : '0%'}</Text>
        </View>
    )
};
const styles = StyleSheet.create({
    bar: {
        height: '100%',
        margin: 0
    }
});
export default PercentageBarCard;