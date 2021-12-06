import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import {autopasters_prod_table_by_production} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import {genericUpdatefunction} from "../../dbCRUD/actionsFunctionsCrud";
import FullCardProduction from "./FullCardProduction";

//[codigoBobinaFK, productionFK]
const innerBobinaTableAndProductData =
    `SELECT * FROM autopasters_prod_data
     INNER JOIN bobina_table ON bobina_table.codigo_bobina = ?
     WHERE autopasters_prod_data.production_fk = ?
     AND autopasters_prod_data.bobina_fk = bobina_table.codigo_bobina
     `;

const ContainerSectionListItem = ({
                                      item,
                                      itemData,
                                      setStateForRadius,
                                      updatedataRollState,
                                      maxRadiusValueDDBB,
                                      inputRadioForRollRadius,
                                      handlerRemoveItem
                                  }) => {
    const db = SQLite.openDatabase('bobinas.db');
    const [existBobinas, getExistBobinas] = useState(null);
    const [bobinaBBDD, getBobinaBBD] = useState([]);
    //ROLL DATA
    const [rollData, getRollData] = useState([]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            getExistBobinas(item.bobina_fk);
            //GET BOBINAS IF EXIST
            if (item.bobina_fk) {
                const params = [item.bobina_fk, item.production_fk]
                db.transaction(tx => {
                    tx.executeSql(
                        innerBobinaTableAndProductData,
                        //[codigoBobinaFK, productionFK]
                        params,
                        (_, {rows: {_array}}) => {
                            if (_array.length > 0) {
                                // getRollData(..._array);
                                getRollData(_array);
                                // console.log('__________array', _array)
                            }
                        }, err => console.log(err)
                    );
                });
            }

        }
        return () => isMounted = false;
    }, [item]);

    useEffect(() => {
        if (rollData.length > 0) {
            let forState = [];
            rollData.forEach(item => {
                const objToState = {
                    autopaster: item.autopaster_fk,
                    bobinaID: item.bobina_fk || 0,
                    radiusIni: item.radio_actual,
                    radius: '',
                    weightIni: item.peso_ini,
                    weightAct: item.peso_actual,
                    weightEnd: null,
                    ismedia: item.media,
                    toSend: false,
                    position: item.position_roll
                };
                forState.push(objToState);
            })
            setStateForRadius(...forState)
        }
    }, [rollData])

    // const substractBobina_Fk = (item) => {
    //     const ArrItems = Array.isArray(item) ? item : [item];
    //     console.log(ArrItems.map(roll => roll.bobina_fk));
    //     return ArrItems.map(roll => roll.bobina_fk);
    // }


    if (!existBobinas) {
        return (
            <>
                <Text>item: {JSON.stringify(item)}</Text>
                <Text>----------------------</Text>
                <Text>itemData: {JSON.stringify(itemData)}</Text>
                <View style={styles.contWarning}>
                    <Text style={styles.textWarning}>
                        No existen bobinas para este equipo en producción.
                    </Text>
                    <Text style={styles.textWarning}>
                        Añade una.
                    </Text>
                    <Text style={styles.textWarning}>
                        autopaster: {item.autopaster_fk}
                    </Text>
                </View>
            </>
        )
    }

    return (
        <View>
            {rollData.length > 0 ?
                rollData.map((i, index) => {
                    return <FullCardProduction key={index} item={i}
                                               updatedataRollState={updatedataRollState}
                                               maxRadiusValueDDBB={maxRadiusValueDDBB}
                                               inputRadioForRollRadius={inputRadioForRollRadius}
                                               handlerRemoveItem={handlerRemoveItem}
                    />
                })
                :
                <ActivityIndicator size="large" color={COLORS.buttonEdit}/>
            }
            <Text>{JSON.stringify(rollData)}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    contWarning: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 5,
        margin: 10,
        padding: 10
    },
    textWarning: {
        textAlign: 'center',
        color: 'red',
        fontFamily: 'Anton',
        textDecorationLine: 'underline'
    }
})
export default ContainerSectionListItem;