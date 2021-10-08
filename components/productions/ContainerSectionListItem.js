import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import {autopasters_prod_table_by_production} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import {genericUpdatefunction} from "../../dbCRUD/actionsFunctionsCrud";

const ContainerSectionListItem = ({item, itemData}) => {
    const db = SQLite.openDatabase('bobinas.db');
    const [existBobinas, getExistBobinas] = useState(null);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            substractBobina_Fk(item);
            //GET BOBINAS IF EXIST
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM bobina_table WHERE autopaster_fk = ? AND papel_comun_fk = ? AND gramaje_fk = ?;`,
                    [5, 2, 1],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            console.log('bobina seleccionada', _array);
                            if (_array.length === 1) {
                                //update
                                const bobina = _array[0];
                                const restPrev =  (bobina.peso_ini / 0.038) ;
                                const arrUpdate = [
                                    bobina.codigo_bobina,
                                    restPrev < (itemData.tirada + itemData.nulls) ? Math.round((itemData.tirada + itemData.nulls) - restPrev) : 0,
                                    item.production_fk,
                                    item.autopaster_fk
                                ];
                                console.log('datos update' ,arrUpdate)
                                const updt = "UPDATE autopasters_prod_data SET bobina_fk = ?, resto_previsto = ? WHERE production_fk = ? AND autopaster_fk = ?;"
                                genericUpdatefunction(updt, arrUpdate)
                                    .then(r => alert('update'))
                                    .catch(err=> console.log(err))
                            } else {
                                //if MORE BOBINAS
                            }
                        } else {
                            console.log('(FullProduction)Error al conectar base de datos en FullProduction Component');
                        }
                    }
                );
            });

        }
        return () => isMounted = false;
    }, [item]);

    const substractBobina_Fk = (item) => {
        const ArrItems = Array.isArray(item) ? item : [item];
        console.log(ArrItems.map(roll => roll.bobina_fk));
        return ArrItems.map(roll => roll.bobina_fk);
    }

    if (!existBobinas) {
        return (
            <>
                <Text>{JSON.stringify(item)}</Text>
                <Text>----------------------</Text>
                <Text>{JSON.stringify(itemData)}</Text>
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
            <Text>hayyyyyy bobiiinaaass</Text>
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