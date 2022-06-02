import React, {useEffect} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from "react-native";
import {COLORS} from "../../assets/defaults/settingStyles";

const RadioButtonComponent = ({
                                  title,
                                  data,
                                  multipleSelect,
                                  limitSelection,
                                  initialValueState,
                                  keysForData,
                                  notSelectable,
                                  _setState
                              }) => {

    useEffect(() => {
        const notselectableout = initialValueState.filter(num => num === notSelectable);
        if (initialValueState.length > limitSelection) {
            _setState([]);
        }
        if (notselectableout.length > 0) {
            const resto = initialValueState.filter(num => num !== notSelectable);
            _setState(resto)
        }

        if (limitSelection === data.length && !notSelectable) {
            _setState(data.map(item => item.autopaster_id))
        }
        if (limitSelection === data.length - 1 && notSelectable) {
            const enteras = data.filter(item => item.autopaster_id !== notSelectable);
            const autopastId = enteras.map(item => item.autopaster_id);
            _setState(autopastId)
        }
    }, [notSelectable, limitSelection]);

    if (
        // IF NOT MULTIPLE AND NO CONTAIN INITIAL VALUE (NOT 'MEDIA', ONLY 'ENTERA')
        (!multipleSelect && !initialValueState[0] ||
            //CONTAIN MULTIPLE AND NO CONTAIN LIMIT SELECTION (NOT 'ENTERA', ONLY 'MEDIA')
            (multipleSelect && !limitSelection))) {
        return null
    }

    const handlerMultipleSelection = (autopastID) => {
        const exist = initialValueState.filter(num => num === autopastID);

        if (exist.length > 0) {
            const rest = initialValueState.filter(num => num !== autopastID);
            _setState(rest)
        } else {
            if (initialValueState.length < limitSelection) {
                _setState([...initialValueState, autopastID]);
            }
        }
    }

    return (
        <View>
            <Text style={{fontFamily: 'Anton', color: COLORS.black}}>{title}:</Text>
            <View style={styles.parent}>
                {
                    multipleSelect && <View style={{
                        width: '100%',
                        padding: 5,
                        backgroundColor: COLORS.primary + '50',
                        borderRadius: 5,
                        marginTop: 3,
                        marginBottom: 3,
                    }}>
                        {/*//function for bags view*/}
                        <Text>SELECCIONA <Text style={{
                            color: COLORS.buttonEdit,
                            fontWeight: 'bold',
                            fontFamily: 'Anton'
                        }}>{limitSelection}</Text> AUTOPASTER{limitSelection > 1 ? 'S' : null}</Text>
                    </View>
                }
                {
                    data.map(item => {
                        return (
                            <TouchableWithoutFeedback key={item[keysForData.id]}
                                                      onPress={notSelectable === parseInt(item[keysForData.id]) ? null : multipleSelect ? () => handlerMultipleSelection(item[keysForData.value]) : () => _setState(item[keysForData.value])}
                            >
                                <View
                                    style={
                                        [
                                            styles.box,
                                            initialValueState.filter(num => num === item[keysForData.value])[0] === item[keysForData.value] ? styles.selected : styles.noSelected,
                                            {opacity: notSelectable === parseInt(item[keysForData.id]) ? .2 : 1}
                                        ]}>
                                    <Text
                                        style={[styles.predefText, initialValueState.filter(num => num === item[keysForData.value])[0] === item[keysForData.value] ? styles.predefTextSelected : styles.predefTextNoSelected]}>AUTOPASTER</Text>
                                    <Text style={[styles.text,
                                        initialValueState.filter(num => num === item[keysForData.value])[0] === item[keysForData.value] ? styles.textSelected : styles.textNoSelected]}
                                    >{item[keysForData.id]}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
            </View>
            <Text>limitSelection: {JSON.stringify(limitSelection)}</Text>
            <Text>!initialValueState[0]: {JSON.stringify(!initialValueState[0])}</Text>
            <Text>multipleSelect: {JSON.stringify(multipleSelect)}</Text>
            <Text>initialValueState: {JSON.stringify(initialValueState)}</Text>
        </View>
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
    predefText: {
        fontSize: 10,
        position: 'absolute',
        opacity: .5,
    },
    predefTextSelected: {
        color: 'dimgrey'
    },
    predefTextNoSelected: {
        color: COLORS.white
    }
});
export default RadioButtonComponent;