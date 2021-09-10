import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from "react-native";
import {COLORS} from "../../assets/defaults/settingStyles";

const RadioButtonComponent = ({
                                  data,
                                  multipleSelect,
                                  limitSelection,
                                  initialValueState,
                                  keysForData
                              }) => {
    const [selectionData, getSelectionData] = useState();

    useEffect(() => {
        if (initialValueState) {
            getSelectionData(initialValueState);
        }

    }, [initialValueState])

    return (
        <>
            <View style={styles.parent}>
                {
                    data.map(item => {
                        return (
                            <TouchableWithoutFeedback key={item[keysForData.id]}
                                                      onPress={() => getSelectionData(item[keysForData.value])}>
                                <View
                                    style={[styles.box, selectionData === item[keysForData.value] ? styles.selected : styles.noSelected]}>
                                    <Text style={[styles.predefText, selectionData === item[keysForData.value] ? styles.predefTextSelected : styles.predefTextNoSelected]}>AUTOPASTER</Text>
                                    <Text style={[styles.text,
                                        selectionData === item[keysForData.value] ? styles.textSelected : styles.textNoSelected]}
                                    >{item[keysForData.id]}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
            </View>
            <Text>selectionData: {selectionData}</Text>
        </>
    )
};
const styles = StyleSheet.create({
    parent: {
        width: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        alignContent: 'stretch',
    },
    box: {
        borderWidth: 1,
        borderColor: 'white',
        padding: 10,
        minWidth: '32.2%',
        maxWidth: '49%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderRadius: 5,
        margin: 2
    },
    text: {
        fontSize: 12,
        fontFamily: 'Anton',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    textSelected: {
        color: COLORS.white
    },
    selected: {
        backgroundColor: COLORS.primary,
        borderWidth: 1,
        borderColor: 'black'
    },
    textNoSelected: {
        color: COLORS.black
    },
    noSelected: {
        backgroundColor: '#c2c2c2',
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    predefText:{
        fontSize: 10,
        position: 'absolute',
        opacity: .5,
    },
    predefTextSelected:{
        color: 'dimgrey'
    },
    predefTextNoSelected:{
        color: COLORS.white
    }
});
export default RadioButtonComponent;