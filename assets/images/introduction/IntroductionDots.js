import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from "../../defaults/settingStyles";

const IntroductionDots = ({indice, datalength}) => {

    function lengthData(){
        let data = [];
        for(let i = 0 ; i <= datalength; i++){
            data.push(i)
        }
        return data;
    }

    return (
        <View style={styles.ContainerDots}>
            {
                lengthData().map((i, index)=>{
                    return (
                        <View key={index} style={[styles.dot,
                        index === indice
                            ? styles.dotSelected
                            : null
                        ]}>

                        </View>
                    )
                })
            }
        </View>
    )
}
const styles = StyleSheet.create({
    ContainerDots:{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    dot:{
        width: 15,
        height: 15,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: COLORS.primary,
        margin: 5
    },
    dotSelected:{
        backgroundColor: COLORS.primary,
        borderWidth: 1,
        borderColor: COLORS.white
    }
})
export default IntroductionDots;