import React, {useEffect, useState} from 'react';
import {View, Text, Platform, Switch} from 'react-native';
import * as SQLite from "expo-sqlite";
import {barcodesAndroid, barcodesIos} from "../dbCRUD/actionsSQL";
import {getDatas, storeData} from "../data/AsyncStorageFunctions";
import {COLORS} from "../assets/defaults/settingStyles";

const BarcodesTypeSelection = ({props}) => {
    const db = SQLite.openDatabase('bobinas.db');

    const [isChecked, setChecked] = useState([]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            db.transaction(tx => {
                tx.executeSql(
                    Platform.OS === 'ios' ? barcodesIos : barcodesAndroid,
                    [1],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            const stateCodebarsItems = _array.map(item => {
                                return {checkName: item.barcode_name, checkValue: item.barcode_name === 'code128'}
                            });
                            //check saved checked inputs
                            getDatas('@storage_codeTypesSelected').then(saved => {
                                if (saved) {
                                    setChecked(saved);
                                } else {
                                    setChecked(stateCodebarsItems)
                                }
                            })
                                .catch(err => console.error('In SettingsScreen request @storageAsync: ', err));
                        }
                    },
                    err => console.error('In request BarcodesTypeselection', err)
                );
            });
        }

        return () => isMounted = false;
    }, []);

    const onValueChangeHandler = (name) => {
        const val = isChecked.map(item => {
            if (item.checkName === name) {
                return {checkName: item.checkName, checkValue: !item.checkValue}
            } else {
                return item
            }
        })
        setChecked(val);
        storeData('@storage_codeTypesSelected', val)
            .then(r => console.log('Guardado...'))
            .catch(err => console.log(err))
    };

    return (
        <>
            {
                isChecked.length > 0 ?
                    isChecked.map((item, index) => {
                        return <View
                            style={props.swicthparent}
                            key={item.checkName + '/' + index}>
                            <Switch
                                key={item.checkName}
                                trackColor={{false: '#767577', true: '#ffff0080'}}
                                thumbColor={item.checkValue ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => onValueChangeHandler(item.checkName)}
                                value={item.checkName === 'code128' ? true : item.checkValue}
                                chidren={item.checkName}
                                disabled={item.checkName === 'code128'}
                            />
                            <Text
                                style={{
                                    fontFamily: 'Anton',
                                    color: item.checkValue ? COLORS.black : COLORS.dimgrey
                                }}
                                key={item.checkName + index}
                            >
                                {item.checkName === 'code128' ? `${item.checkName} ` : item.checkName}
                                {item.checkName === 'code128' ?
                                    <Text style={{
                                        color: '#f5dd4b',
                                        fontSize: 10
                                    }}>( default )</Text> : null}
                            </Text>
                        </View>
                    })
                    :
                    <Text style={{fontFamily: 'Anton', fontSize: 20}}>No existen opciones</Text>
            }
        </>
    )
};

export default BarcodesTypeSelection;