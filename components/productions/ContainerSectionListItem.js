import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {COLORS, shadowPlatform} from "../../assets/defaults/settingStyles";
import {autopasters_prod_table_by_production} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import {genericUpdatefunction} from "../../dbCRUD/actionsFunctionsCrud";
import FullCardProduction from "./FullCardProduction";
import {cautionSVG, icon360SVG} from "../../assets/svg/svgContents";
import SvgComponent from "../SvgComponent";

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
                                      handlerRemoveItem,
                                      viewCardSpinner,
                                      bobinaCodeForSpinner
                                  }) => {
    const db = SQLite.openDatabase('bobinas.db');
    const [existBobinas, getExistBobinas] = useState(null);
    const [bobinaBBDD, getBobinaBBD] = useState([]);
    //ROLL DATA
    const [rollData, getRollData] = useState([]);

    useEffect(() => {
        let isMounted = true;

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
                            if (isMounted) {
                                getRollData(_array);
                                // console.log('__________array', _array)
                            }
                        }
                    }, err => console.log(err)
                );
            });
        }
        return () => isMounted = false;
    }, [item]);

    useEffect(() => {
        let isMounted = true;
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
        return () => isMounted = false;
    }, [rollData])

    if (!existBobinas) {
        return (
            <View style={styles.contWarning}>
                <View style={{flex: .5}}>
                    <SvgComponent svgData={cautionSVG} svgWidth={80} svgHeight={80}/>
                </View>
                <View style={{flex: 2}}>
                    <Text style={styles.textWarning}>
                        No existen bobinas asignadas.
                    </Text>
                </View>
            </View>
        )
    }
    ;

    return (
        <View>
            {rollData.length > 0 ?
                rollData.map((i, index) => {
                    return <FullCardProduction key={index} item={i}
                                               updatedataRollState={updatedataRollState}
                                               maxRadiusValueDDBB={maxRadiusValueDDBB}
                                               inputRadioForRollRadius={inputRadioForRollRadius}
                                               handlerRemoveItem={handlerRemoveItem}
                                               viewCardSpinner={viewCardSpinner}
                                               bobinaCodeForSpinner={bobinaCodeForSpinner === i.codigo_bobina ? bobinaCodeForSpinner : null}
                    />
                })
                :
                <ActivityIndicator size="large" color={COLORS.buttonEdit}/>
            }
            {/*<Text>{JSON.stringify(rollData)}</Text>*/}
        </View>
    )
}
const styles = StyleSheet.create({
    contWarning: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 5,
        margin: 10,
        padding: 5,
        ...shadowPlatform

    },
    textWarning: {
        fontSize: 16,
        textAlign: 'center',
        color: COLORS.colorSupportfiv,
        fontFamily: 'Anton',
        textShadowColor: COLORS.contraster,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
        // textDecorationLine: 'underline'
    }
})
export default ContainerSectionListItem;