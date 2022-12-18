import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Alert} from "react-native";
import CustomTextInput from "../FormComponents/CustomTextInput";
import {editSVG} from "../../assets/svg/svgContents";
import {COLORS} from "../../assets/defaults/settingStyles";
import {getDatas, storeData} from "../../data/AsyncStorageFunctions";
import PropTypes from "prop-types";
import {Sentry_Alert} from "../../utils";

const Extrainfo = ({
                       productToRender,
                       updateGetStorage
                   }) => {

    const extrainfotitle = Object.keys(productToRender.notas);

    const [inputValue, setInputValue] = useState({});

    const handlerSaveDataSecondaryObject = (principalKey, secondaryKey, inputValue) => {
        getDatas('@simpleProdData')
            .then(r => {
                const diferentData = r.filter(item => item.id !== productToRender.id)
                const referedData = r.filter(item => item.id === productToRender.id);
                const cloneReferedData = {...referedData[0]};
                const changeData = {
                    ...cloneReferedData[principalKey],
                    [secondaryKey]:
                    inputValue
                };
                const groupDataAndSave = {
                    ...cloneReferedData,
                    [principalKey]: changeData
                }
                const newGroupData = [
                    ...diferentData, groupDataAndSave
                ];
                storeData('@simpleProdData', newGroupData)
                    .then(() => updateGetStorage())
                    .catch(err => Sentry_Alert('Extrainfo.js', 'storeData - @simpleProdData', err))

            })
            .catch(err => Sentry_Alert('Extrainfo.js', 'getDatas - @simpleProdData', err));
    };

    return (
        <View style={styles.parent}>
            <View style={{flex: 1, backgroundColor: '#fff', padding: 5}}>
                <Text style={{fontFamily: 'Anton', fontSize: 20}}>NOTAS: </Text>
                <View style={{flexDirection: 'row'}}>
                    {
                        extrainfotitle.sort().map((item, index) => {

                            return <View key={index}
                                         style={{
                                             width: '50%',
                                             backgroundColor: 'white',
                                         }}>
                                <Text style={styles.text}>{item}: </Text>
                                <CustomTextInput
                                    svgData={editSVG}
                                    svgWidth={20}
                                    svgHeight={20}
                                    text={''}
                                    type={'numeric'}
                                    _name={item}
                                    _onChangeText={text => setInputValue(text)}
                                    _onBlur={() => handlerSaveDataSecondaryObject('notas', item, inputValue)}
                                    value={productToRender.notas[item]}
                                    _defaultValue={productToRender.notas[item]}
                                    styled={{
                                        height: 'auto',
                                        borderWidth: 0,
                                        backgroundColor: 'transparent',
                                        color: 'white'
                                    }}
                                    inputStyled={{borderBottomWidth: 1, borderColor: 'black', color: COLORS.primary}}
                                />
                            </View>
                        })
                    }
                </View>
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    parent: {
        width: '100%',
        backgroundColor: '#ff8500',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
    },
    text: {
        fontFamily: 'Anton',
        marginLeft: 10,
        padding: 0,
        color: 'black'
    },

});

Extrainfo.propTypes = {
    productToRender: PropTypes.object.isRequired,
    updateGetStorage: PropTypes.func.isRequired,
};

export default Extrainfo;