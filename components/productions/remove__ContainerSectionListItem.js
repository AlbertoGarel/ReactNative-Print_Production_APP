import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {COLORS, shadowPlatform} from "../../assets/defaults/settingStyles";
import {autopasters_prod_table_by_production} from "../../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import {genericTransaction, genericUpdatefunction} from "../../dbCRUD/actionsFunctionsCrud";
import FullCardProduction from "./FullCardProduction";
import {cautionSVG, icon360SVG} from "../../assets/svg/svgContents";
import SvgComponent from "../SvgComponent";
import PropTypes from "prop-types";
import BgComponent from "../BackgroundComponent/BgComponent";

//[codigoBobinaFK, productionFK]
const innerBobinaTableAndProductData =
    `SELECT * FROM autopasters_prod_data
     INNER JOIN bobina_table ON bobina_table.codigo_bobina = ?
     WHERE autopasters_prod_data.production_fk = ?
     AND autopasters_prod_data.bobina_fk = bobina_table.codigo_bobina
     `;

const Remove__ContainerSectionListItem = ({
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
    return null
    const db = SQLite.openDatabase('bobinas.db');
    const [existBobinas, getExistBobinas] = useState(null);
    const [bobinaBBDD, getBobinaBBD] = useState([]);
    //ROLL DATA
    const [rollData, getRollData] = useState([]);
    // const [codePathSVG, setCodePATHSVG] = useState('');

    // useEffect(()=>{
    //     console.log(codePathSVG)
    // },[codePathSVG ])

    // useEffect(() => {
    //     let isMounted = true;
    //
    //     getExistBobinas(item.bobina_fk);
    //     //GET BOBINAS IF EXIST
    //     if (item.bobina_fk) {
    //         const params = [item.bobina_fk, item.production_fk]
    //         db.transaction(tx => {
    //             tx.executeSql(
    //                 innerBobinaTableAndProductData,
    //                 //[codigoBobinaFK, productionFK]
    //                 params,
    //                 (_, {rows: {_array}}) => {
    //                     if (_array.length > 0) {
    //                         if (isMounted) {
    //                             console.log('.  .   .   .   .   .   .   .   .  .')
    //                             getRollData(_array);
    //                             //     const objToState = {
    //                             //         autopaster: _array[0].autopaster_fk,
    //                             //         bobinaID: _array[0].bobina_fk || 0,
    //                             //         radiusIni: _array[0].radio_actual,
    //                             //         radius: '',
    //                             //         weightIni: _array[0].peso_ini,
    //                             //         weightAct: _array[0].peso_actual,
    //                             //         weightEnd: null,
    //                             //         ismedia: _array[0].media,
    //                             //         toSend: false,
    //                             //         position: _array[0].position_roll,
    //                             //         codepathSVG: ''
    //                             //     };
    //                             // setStateForRadius(objToState)
    //                             // console.log('__________array', _array)
    //                         }
    //                     }
    //                 }, err => console.log(err)
    //             );
    //         });
    //     }
    //     return () => isMounted = false;
    // }, [item]);

    // useEffect(() => {
    //     let isMounted = true;
    //     console.log('.             .               .           .            . ', codePathSVG)
    //     if (rollData.length > 0) {
    //         let forState = [];
    //         rollData.forEach(item => {
    //             const objToState = {
    //                 autopaster: item.autopaster_fk,
    //                 bobinaID: item.bobina_fk || 0,
    //                 radiusIni: item.radio_actual,
    //                 radius: '',
    //                 weightIni: item.peso_ini,
    //                 weightAct: item.peso_actual,
    //                 weightEnd: null,
    //                 ismedia: item.media,
    //                 toSend: false,
    //                 position: item.position_roll,
    //                 codepathSVG: codePathSVG
    //             };
    //             forState.push(objToState);
    //         })
    //         setStateForRadius(...forState)
    //     }
    //     return () => isMounted = false;
    // }, [rollData]);

    // useEffect(() => {
    //     if (rollData.length && codePathSVG > 0) {
    //         //let it = inputRadioForRollRadius.filter(item => item.bobinaID === rollData[0].bobina_fk)[0]
    //         // if (inputRadioForRollRadius.length && it.length > 0) {
    //             setStateForRadius(rollData, codePathSVG)
    //         // }
    //     }
    // }, [codePathSVG, rollData])

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
    };

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
                                               // handlerCodePathSVG={setCodePATHSVG}
                                               setStateForRadius={setStateForRadius}
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

Remove__ContainerSectionListItem.propTypes = {
    svgOptions: PropTypes.object.isRequired,
    styleOptions: PropTypes.object.isRequired,
};

export default Remove__ContainerSectionListItem;