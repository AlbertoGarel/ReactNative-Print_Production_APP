import {Alert} from "react-native";
import {genericTransaction, genericUpdatefunction, genericUpdateFunctionConfirm} from "./dbCRUD/actionsFunctionsCrud";
import * as SQLite from "expo-sqlite";
import {autopaster_prod_data_insert, autopasters_prod_table_by_production} from "./dbCRUD/actionsSQL";

const db = SQLite.openDatabase('bobinas.db');
export const timeNow = () => {
    let now = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
};

export const formatDateYYMMDD = () => {
    let date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if (month < 10) {
        return `${year}-0${month}-${day}`
    } else {
        return `${year}-${month}-${day}`
    }
}

export const paperRollConsummption = (radius, _setState) => {
    let defradius = 0;
    let char = radius.charAt(radius.length - 1);
    if (isNaN(radius)) {
        // let char = radius.charAt(radius.length - 1);
        let deleteBadChar = radius.split(char, radius.length - 1)[0];
        if (deleteBadChar === undefined) {
            defradius = '';
        } else {
            defradius = deleteBadChar;
        }
        Alert.alert('introduce caracter numérico o punto para decimales.');
    } else {
        if (radius > 60) {
            defradius = radius.charAt(radius.length);
        } else {
            defradius = radius;
        }
    }
    // _setState(defradius);
    return defradius
}

export const numberOfAutopasters = (pagination) => {
    return Math.round(pagination / 16);
};

export const identifyAutopasters = (num) => {
    const whithMedia = num / 16
    if (whithMedia % 1 === 0) {
        //asignará autopasters según preferencia sin incluir el definido como media
        return {media: 0, entera: whithMedia}
    } else if (whithMedia % 1 === .5) {
        //asignará autopasters según preferencia incluyendo el definido como media
        // value 1 for media and defAutopasters - .5 for calc 'entera'.
        return {media: 1, entera: whithMedia - .5}
    }
};
/**
 *  Calculate weight and copies.
 *
 *  @return JavaScript object {
 *          rollweight: consumed Kilos(rollweight === 0) or leftover Kilos (rollweight !== 0),
 *          copies: to complete (rollweight === 0) or leftover copies (rollweight !== 0)
 *          }
 *
 *  @param numProd: integer (production copies + approximated expected null copies)
 *  @param pesoBob: integer (weight roll)
 *  @param coef: integer (coefficient for roll radius)
 *
 * */
export const individualProvidedWeightRollProduction = (numProd, pesoBob, coef) => {
    const returnObject = {rollweight: 0, copies: 0};
    console.log('---------------- params ---------------', `numprod:${numProd} * pesoBob:${pesoBob} * coef:${coef}`)
    // const res = Math.round((pesoBob / coef) - numProd); REPASAR CÁLCULOS....
    const res = Math.round((pesoBob / coef) - numProd);
    console.log('----------------res ---------------', res)
    if (res > 0) {
        returnObject.rollweight = Math.round(pesoBob - (numProd * coef));
        returnObject.copies = Math.round((pesoBob - (numProd * coef)) / coef);
        console.log('-------res > 0 ----------', returnObject)
    } else {
        const calcWeight = Math.round(Math.abs(res) * coef);
        const calcEjem = Math.round(calcWeight / coef);
        returnObject.copies = calcEjem;
        console.log('-------res < 0 ----------', returnObject)
    }
    console.log('----------------------------------aaa--------------------------------------------------------', returnObject)
    return returnObject;
};

/**
 *  Search and return coefficient of roll found
 *
 *  @return integer or float
 *
 *  @param meditionStyle: javascript object {}
 *  @param foundRoll: javascript object {}
 *
 * */
export const searchCoefTypeRoll = (meditionStyle, foundRoll) => {
    //media === 0 (widthwhole roll) / media === 1 (width half roll)
    const selectedCoef = foundRoll.media ? meditionStyle.media_value : meditionStyle.full_value;
    return selectedCoef;
};
/**
 *  Group items with same key value.
 *
 *  @return grouped javascript object.
 *
 *  @param arrayToGroup: array javascript object {}
 *  @param key: string of key.
 *
 * */
export const groupBy = (arrayToGroup, objKey) => {
    //Creamos un nuevo objeto donde vamos a almacenar por autopasters.
    let nuevoObjeto = {}
    //Recorremos el arreglo
    arrayToGroup.forEach(x => {
        //Si el autopaster no existe en nuevoObjeto entonces
        //lo creamos e inicializamos el arreglo de autopasters.
        if (!nuevoObjeto.hasOwnProperty(x[objKey])) {
            nuevoObjeto[x[objKey]] = []
        }

        //Agregamos los datos de las bobinas registradas en autopasters.
        nuevoObjeto[x[objKey]].push(x);
    });
    return nuevoObjeto;
};
/**
 *  Sum the values of a chosen key common to all of them. .
 *
 *  @return integer: Sum of values.
 *
 *  @param arrObject: array javaScript object {}
 *  @param objKey: string of key.
 *
 * */
export const calcValues = (arrObject, objKey) => {
    return arrObject.reduce((acc, sec) => acc + sec[objKey], 0);
}
/**
 *  Extracts the number of kilos of barcode type 128
 *
 *  @return integer: Number of kilos.
 *
 *  @param data: integer
 *
 * */
export const OriginalWeight = (data) => {
    return Math.abs((data).toString().substring(8, 12))
};
/**
 *  orders rolls and calculates kilos consumed of each one
 *
 *  @return javaScript objects collection: [{items}]
 *
 *  @param arrObjects: javaScript objects collection [{items}]
 *  @param tiradaTotal: integer
 *  @param gramajeValues: javaScript object {}
 *  @param productionID: integer
 *
 * */
export const CalcPrevConsKilosRollsAutopaster = (arrObjects, tiradaTotal, gramajeValues, productionID) => {
    //2º Ordenar de menor a mayor los que quedan por posición y recalcular kilos previsto.
    const orderedItems = arrObjects.sort((a, b) => a.position - b.position);
    //3º calcular kilos consumidos por cada uno y asignar posición.
    let isMedia = orderedItems[0].ismedia ? gramajeValues.media : gramajeValues.entera;
    let kilosPrev = Math.round(tiradaTotal * isMedia);
    // alert(kilosPrev)
    let updatedItems = [];
    let calc_kilosPrev = kilosPrev;
    orderedItems.forEach((item, index) => {
        let indice = index + 1;
        let kilos = calc_kilosPrev > item.peso_actual ? 0 : Math.abs(calc_kilosPrev - item.peso_actual);
        updatedItems.push([
                indice,
                kilos,
                productionID,
                item.codigo_bobina
            ]
        );
        item.position_roll = index + 1;
        item.resto_previsto = kilos;
        calc_kilosPrev = calc_kilosPrev >= 0 && calc_kilosPrev >= item.peso_actual
            ? calc_kilosPrev - item.peso_actual
            : 0
    });
    const kilosNeededState = orderedItems.reduce((acc, i) => {
        // return acc + i.peso_actual
        acc = acc + i.peso_actual;
        return acc - kilosPrev
    }, 0)
    console.log('-------------------r------------r--------------r-----------r-', updatedItems)
    return {
        updatedItemsForPromises: updatedItems,
        updatedItemsForSection: orderedItems,
        kilosNeedeState: kilosNeededState
    };
}
/**
 *  set string name barcode type for BBDD row.
 *
 *  @return string
 *
 *  @param type: string / integer (barcodeType scanned)
 *
 * */
export const typeBarcodeFilter = (type) => {
    switch (type) {
        case 128:
            return "CODE128";
        case 39:
            return "CODE39";
        case '128A':
            return "CODE128A";
        case '128B':
            return "CODE128B";
        case '128C':
            return "CODE128C";
        case 13:
            return "EAN13";
        case 8:
            return "EAN8";
        case 5:
            return "EAN5";
        case  2:
            return "EAN2";
        case 'UPC':
            return 'UPC';
        case 'UPCE':
            return 'UPCE';
        case 14:
            return 'ITF14';
        case 'ITF':
            return 'ITF';
        case 'MSI':
            return 'MSI';
        case 10:
            return 'MSI10';
        case 11:
            return 'MSI11';
        case 1010:
            return 'MSI1010';
        case 1110:
            return 'MSI1110';
        case 'pharmacode':
            return 'pharmacode';
        case 'codabar':
            return 'codabar';
        default:
            return 'CODE128';
    }
}

export const setValueForInput = (date) => {
    let sub = '';
    if (date.includes('-')) {
        sub = date.slice(5, 7);
    } else {
        sub = date.slice(4, 6);
    }

    switch (parseInt(sub)) {
        case 1:
            return 'Enero';
        case 2:
            return 'Febrero';
        case 3:
            return 'Marzo';
        case 4:
            return 'Abril';
        case 5:
            return 'Mayo';
        case 6:
            return 'Junio';
        case 7:
            return 'Julio';
        case 8:
            return 'Agosto';
        case 9:
            return 'Septiembre';
        case 10:
            return 'octubre';
        case 11:
            return 'Noviembre';
        case 12:
            return 'Diciembre';
        default:
            return '';

    }
}

export const setFormatDAta = async (arr) => {
    try {
        const newData = await arr.reduce((acc, item) => {
            let mes = setValueForInput(item.fechaproduccion);
            let title = mes + ' ' + item.fechaproduccion.slice(0, 4)
            acc[title] ?
                acc[title].value = item.fechaproduccion.slice(0, 7)
                :
                acc[title] = {
                    label: mes + ' ' + item.fechaproduccion.slice(0, 4),
                    value: item.fechaproduccion.slice(0, 7)
                }
            return acc
        }, {});
        return Object.values(newData)
    } catch (e) {
        alert('fallo en getLabels')
    }
};
/**
 *  Compare two arrays.
 *
 * @param a type: Array
 * @param b type: Array
 *
 * @return true/false type: boolean
 *
 * */
export const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.length > 0 && b.length > 0 &&
        a.every((val, index) => val === b[index]);
}

export async function groupedAutopasters(data) {
    console.log('---------------------------groupedautopasters----------------------------------', data)
    const innerBobinaTableAndProductData =
        `SELECT * FROM autopasters_prod_data
     INNER JOIN bobina_table ON bobina_table.codigo_bobina = ?
     WHERE autopasters_prod_data.production_fk = ?
     AND autopasters_prod_data.bobina_fk = bobina_table.codigo_bobina
     `;
    const selectLastRestoPrev =
        `
        SELECT a.resto_previsto AS 'rest_antProd' FROM autopasters_prod_data a
     INNER JOIN bobina_table ON bobina_table.codigo_bobina = ?
     WHERE a.production_fk < ?
     AND a.bobina_fk = bobina_table.codigo_bobina ORDER BY a.production_fk ASC LIMIT 1        
        `
    try {
        const extraData = {
            toSend: false,
            weightEnd: null,
            radiusEnd: '',
            codepathSVG: ''
        }
        const groupedForSectionList = data.reduce(async (acc, item) => {
            acc = await acc;
            let f = await genericTransaction(innerBobinaTableAndProductData, [item.bobina_fk ? item.bobina_fk : 0, item.production_fk])
            let last = await genericTransaction(selectLastRestoPrev, [item.bobina_fk ? item.bobina_fk : 0, item.production_fk])
            f = {...f, rest_antProd: last.length > 0 ? last[0].rest_antProd : null}
            acc[item.autopaster_fk] ?
                acc[item.autopaster_fk]['data'].push({...f[0], ...extraData})
                :
                acc[item.autopaster_fk] = {
                    title: item.autopaster_fk,
                    data: [{...f[0], ...extraData}]
                };
            acc[item.autopaster_fk].data.sort((a, b) => a.position_roll - b.position_roll);
            return acc;
        }, {});
        return Object.values(await groupedForSectionList);
    } catch (err) {
        console.log(err)
    }
};

export const callToSetData = (arrBobinasID, productionID) => {
    // let dataForStatePromise = [];
    // try {

    if (!arrBobinasID === null) {
//[codigoBobinaFK, productionFK]
        const innerBobinaTableAndProductData =
            `SELECT * FROM autopasters_prod_data
     INNER JOIN bobina_table ON bobina_table.codigo_bobina = ?
     WHERE autopasters_prod_data.production_fk = ?
     AND autopasters_prod_data.bobina_fk = bobina_table.codigo_bobina
     `;
        return genericTransaction(innerBobinaTableAndProductData, [arrBobinasID, productionID])
        // .then(response => {
        //     return {
        //         ...response[0],
        //         autopaster: response[0].autopaster_fk,
        //         bobinaID: response[0].bobina_fk || 0,
        //         radiusIni: response[0].radio_actual,
        //         radius: '',
        //         weightIni: response[0].peso_ini,
        //         weightAct: response[0].peso_actual,
        //         weightEnd: null,
        //         ismedia: response[0].media,
        //         toSend: false,
        //         position: response[0].position_roll,
        //     }
        // })
    } else {
        return ''
    }
    // } catch (e) {
    //     console.log(e)
    // }
};

export async function searchItems(autopasterID, sectionListState) {
    try {
        return await sectionListState.reduce((acc, item) => {
            if (item.title === autopasterID) {
                acc.toUpdate = item
            } else {
                acc.others = [...acc.others, item]
            }
            return acc;
        }, {toUpdate: '', others: ''});
    } catch (err) {
        console.log(err)
    }
};

export async function deleteItem(response, rollID, productionData) {
    const DELETE_ItemFromAutopasterSQL =
        `DELETE FROM autopasters_prod_data
         WHERE production_fk = ? AND bobina_fk = ?;`;
    const UPDATE_ItemFromAutopasterSQL =
        `UPDATE autopasters_prod_data SET
        bobina_fk = ?, resto_previsto = ?
        WHERE production_fk = ? AND bobina_fk = ?;`;
    const UPDATE_PROMISES_ALL =
        `UPDATE autopasters_prod_data SET
        position_roll = ?, resto_previsto = ?
        WHERE production_fk = ? AND bobina_fk = ?;`;
    try {
        const {toUpdate, others} = await response;
        let isMedia = toUpdate.data[0].media;
        let paramsAction, promisesALLforUpdateItems = [];
        const updatedGroup = await toUpdate.data.reduce(async (acc, item, index) => {
            acc = await acc;
            if (item.bobina_fk !== rollID) {
                item.radiusEnd = "";
                acc.data = [...acc.data, item]
            }
            return acc;
        }, {data: [], title: toUpdate.title})
        let updateItemsForSectionList = [];
        let updateKilosNeededState = 0;
        if (updatedGroup.data.length === 0) {
            paramsAction = [UPDATE_ItemFromAutopasterSQL, [null, null, productionData.produccion_id, rollID]];
            updatedGroup.data.push({
                "codepathSVG": "",
                "radiusEnd": "",
                "toSend": false,
                "weightEnd": null,
            });
            updateItemsForSectionList = updatedGroup;
            //reset kilos needed to negative number.
            updateKilosNeededState =
                0 - ((productionData.nulls + productionData.tirada) * (isMedia ? productionData.media_value : productionData.full_value))
        } else {
            const forPromisesAllforUpdate = CalcPrevConsKilosRollsAutopaster(
                updatedGroup.data,
                (productionData.nulls + productionData.tirada),
                {media: productionData.media_value, entera: productionData.full_value},
                productionData.produccion_id
            );
            paramsAction = [DELETE_ItemFromAutopasterSQL, [productionData.produccion_id, rollID]];
            forPromisesAllforUpdate.updatedItemsForPromises.forEach(item => {
                promisesALLforUpdateItems.push(genericUpdateFunctionConfirm(UPDATE_PROMISES_ALL, item));
            });
            updateItemsForSectionList = {
                data: forPromisesAllforUpdate.updatedItemsForSection,
                title: forPromisesAllforUpdate.updatedItemsForSection[0].autopaster_fk
            };
            // updateKilosNeededState = forPromisesAllforUpdate.kilosNeedeState.reduce((acc, i) => acc + i.peso_actual, 0);
            updateKilosNeededState = forPromisesAllforUpdate.kilosNeedeState
            // updatedItemsForPromises: updatedItems,
            //     updatedItemsForSection: [...orderedItems],
            //     kilosNeedeState: kilosNeededState
        }
        return await genericTransaction(...paramsAction)
            .then(rowsAffected => {
                if (rowsAffected === 1 && updatedGroup.data > 1) {
                    return Promise.all(...promisesALLforUpdateItems)
                }
                if (rowsAffected === 1 && updatedGroup.data === 1) {
                    return true
                }
            })
            .then(() => {
                // [...others, updatedGroup].sort((a, b) => a.title - b.title)
                console.log('updateItemsForSectionListupdateItemsForSectionListupdateItemsForSectionListupdateItemsForSectionList', updateItemsForSectionList)
                return {
                    updateItemsForSectionList: [...others, updateItemsForSectionList].sort((a, b) => a.title - b.title),
                    updateKilosNeededState: updateKilosNeededState
                }
            })
            .catch(err => console.log(err))
    } catch (err) {
        console.log(err)
    }
};

// //UPDATE ROLL STATE FOR SEND DATA TO DDBB.
export async function updatedataRollState(rollID, radiusState, items, maxRadiusValue, coefficientDDBB) {
    if (radiusState > maxRadiusValue) {
        Alert.alert('¡¡Error!!', `El radio máximo registrado en base de datos es ${maxRadiusValue} cm. Has introducido ${radiusState}.`
        );
        items.toUpdate.data[0].radiusEnd = '';
        items.toUpdate.data[0].weightEnd = '';
        items.toUpdate.data[0].toSend = false;
        return {
            sectionListUpdate: [...items.others, items.toUpdate].sort((a, b) => a.title - b.title),
            initCalc: false
        };
    } else if (radiusState === '' || radiusState === ' ' || isNaN(radiusState)) {
        Alert.alert(`Introduce un valor para realizar el cálculo.`);
        // throw error;
        items.toUpdate.data[0].radiusEnd = '';
        items.toUpdate.data[0].weightEnd = '';
        items.toUpdate.data[0].toSend = false;
        return {
            sectionListUpdate: [...items.others, items.toUpdate].sort((a, b) => a.title - b.title),
            initCalc: false
        };
    } else {
        const itemToUpdate = items.toUpdate.data.filter(i => i.bobina_fk === rollID);
        // if initial radius (new roll) is null, set max value for radius.
        const radiusNull = itemToUpdate[0].radio_actual ? itemToUpdate[0].radio_actual : maxRadiusValue;
        // ITEM DATA DEFAULT.
        let end_weight = itemToUpdate[0].weightEnd;
        let end_radius = itemToUpdate[0].radiusEnd;
        let to_send = false;
        // if (parseInt(radiusState) === 0 || radiusState === '' || radiusState === ' ') {
        if (parseInt(radiusState) === 0) {
            if (end_weight > itemToUpdate[0].peso_actual) {
                Alert.alert(`Error al introducir radio de bobina.`);
                end_radius = '';
                end_weight = '';
                to_send = false;
            } else {
                end_radius = 0;
                end_weight = 0;
                to_send = true;
            }
        } else {
            //SELECT COEFFICIENT
            const coef = coefficientDDBB.filter(item => item.medida === parseInt(radiusState));
            //calculate data for state
            //update state
            //THAT'S RIGHT
            end_radius = radiusState;
            to_send = true;
            end_weight = Math.round(coef[0].coeficiente_value * itemToUpdate[0].peso_ini);
            if (end_weight > itemToUpdate[0].peso_actual ||
                radiusState > radiusNull) {
                //IF THE INITIAL WEIGHT IS LESS THAN THE CALCULATED WEIGHT OR
                // THE FINAL WEIGHT CALCULATION BY MEANS OF YOUR RADIO RESULTS
                // TO BE LESS THAN YOUR INITIAL WEIGHT RETURN NULL.
                Alert.alert('¡¡Error!!', `Último radio conocido en ${radiusNull} cm. Has introducido ${radiusState} y excede del peso real de la bobina. Comprueba que has medido correctamente.`)
                end_radius = '';
                end_weight = null;
                to_send = false;
            }
        }

        const updateLoop = items.toUpdate.data.reduce((acc, item) => {
            acc.data = item.bobina_fk === rollID
                ? [
                    ...acc.data,
                    {
                        ...item,
                        radiusEnd: end_radius, toSend: to_send, weightEnd: end_weight
                    }]
                : [...acc.data, item]
            return acc;
        }, {data: [], title: items.toUpdate.title});
        // console.log('itemmmmm ', updateLoop)
        // console.log('itemmmmm others', items.others)
        const toReturn = [...items.others, updateLoop].sort((a, b) => a.title - b.title);
        const validforcalc = validForCalc(toReturn)

        return {sectionListUpdate: toReturn, initCalc: validforcalc};
    }
};

export function validForCalc(arrItems) {
    const values = [];
    arrItems.forEach(item => {
        item.data.forEach(i => {
            values.push(i.toSend);
        })
    })
    return values.every(value => value === true);
};

//CHECK IF THERE IS A ROLL IN THE PRODUCTION TABLE AND THE REEL TABLE TO ADD IN THIS PRODUCTION.
export async function getScannedCode(scanned, autopasterID, itemsState, productionData, autopasterLineProdData) {
    try {
        let {scannedCode, codeType} = scanned;
        if (scannedCode.length !== 16) {
            return alert('El valor numérico del código de barras no tiene el formato esperado de 16 cifras.')
        }
        scannedCode = parseInt(scannedCode);
        // const registerDadataOfBBDD = autopasterLineProdData.filter(item => item.autopaster_id === autopasterID);
        // let change_media_type = (productionData.paginacion_value / 16) % 1 === 0 ? 0 : 1;
        console.log('autopasterLineProdData', autopasterLineProdData)
        let change_media_type = autopasterLineProdData.filter(i=> i.autopaster_fk === autopasterID)[0].media_defined;
        const existInProduction = await genericTransaction(
            "SELECT * FROM autopasters_prod_data WHERE production_fk = ? AND media_defined = ?",
            [productionData.produccion_id, change_media_type]
        );
        let actionBBDD = 'insert';
        const _existInProduction = existInProduction.filter(i => i.bobina_fk === (scannedCode))
        if (_existInProduction.length > 0) {
            alert(`Esta bobina ya exite en esta producción en autopaster nº ${existInProduction[0].autopaster_fk}`)
            return [];
        }
        const isEmptyRoll = existInProduction.filter(i => (i.autopaster_fk === autopasterID) && (!i.bobina_fk))
        if (_existInProduction.length === 0 && isEmptyRoll.length > 0) {
            actionBBDD = 'update'
        }
        const existInDDBB = await genericTransaction("SELECT * FROM bobina_table WHERE codigo_bobina = ?", [scannedCode])
        let text = '';
        let regNewRoll = {};

        if (existInDDBB.length > 0) {
            text = `BOBINA REGISTRADA:\n ¿DATOS CORRECTOS?`;
            regNewRoll = {
                scanCode: existInDDBB[0].codigo_bobina,
                originalWeight: existInDDBB[0].peso_ini,
                actualWeight: existInDDBB[0].peso_actual,
                radius: existInDDBB[0].radio_actual,
                commonRole: existInDDBB[0].papel_comun_fk,
                autopaster: autopasterID,//change autopaster original for scanned
                grama: existInDDBB[0].gramaje_fk,
                isMedia: existInDDBB[0].media,
                codeType: existInDDBB[0].codeType
            }
            return [regNewRoll, actionBBDD, text];
        } else {
            text = `REGISTRO DE BOBINA:\n ¿ES NUEVA?`;
            const OrWeight = OriginalWeight(scannedCode);
            const isMedia = change_media_type;
            regNewRoll = {
                scanCode: scannedCode,
                originalWeight: OrWeight,
                actualWeight: OrWeight,
                radius: null,
                commonRole: productionData.papel_comun_id,
                autopaster: autopasterID,
                grama: productionData.gramaje_id,
                isMedia: isMedia,
                codeType: codeType
                // codeType: setCodeType // ADD ROW IN BBDD
            }
            return [regNewRoll, actionBBDD, text];
        }
    } catch (err) {
        console.log('error getScanned', err)
    }
}

// //REGISTER NEW ROLL AND UPDATE EMPTY AUTOPASTER.
export async function registerNewBobina(BobinaParams, actionDDBB, itemsState, prodData, kilosState) {
    const autopasters_prod_data_update =
        `UPDATE autopasters_prod_data
    SET bobina_fk = ?, resto_previsto = ?
    WHERE production_fk = ? AND autopaster_fk = ?;`
    ;
    // const autopasters_prod_data_update =
    //     `INSERT OR REPLACE INTO autopasters_prod_data (autopasters_prod_data_id, production_fk, autopaster_fk, bobina_fk, resto_previsto, media_defined, position_roll)
    //     VALUES (?,?,?,?,?,?,?)`
    // ;
    try {
        const de = await genericTransaction(
            `SELECT * FROM autopasters_prod_data
     INNER JOIN bobina_table ON bobina_table.codigo_bobina = autopasters_prod_data.bobina_fk
     WHERE autopasters_prod_data.production_fk = ?
     AND autopasters_prod_data.autopaster_fk = ?
     `,
            [prodData.produccion_id, BobinaParams.autopaster,]
        )
        // let getRollsAutopaster = autopastersDataProduction.filter(item => item.autopaster_fk === BobinaParams.autopaster);
        let getRollsAutopaster = await searchItems(BobinaParams.autopaster, itemsState);
        let maxPositionRoll = de.length > 0 ? de.sort((a, b) => b.position_roll - a.position_roll)[0].position_roll : 0;
        let finalPositionRoll = maxPositionRoll + 1;
        const values = Object.values(BobinaParams);
        let productionID = prodData.produccion_id;
        const AutopasterNum = BobinaParams.autopaster;
        // const kilosNeededForAutopaster = ejemplaresToKilos(prodData.tirada, prodData.nulls, (BobinaParams.isMedia ? prodData.media_value : prodData.full_value))
        const kilosNeededForAutopaster = kilosState.filter(i => i.autopaster_id === AutopasterNum)
        // CALCULATE WEIGHT FOR NEW ROLL
        let _restoPrevisto = kilosNeededForAutopaster[0].kilosNeeded >= 0 ? BobinaParams.actualWeight : BobinaParams.actualWeight - Math.abs(kilosNeededForAutopaster[0].kilosNeeded)
        let restoPrevisto = _restoPrevisto <= 0 ? 0 : _restoPrevisto;
        // CALCULATE WEIGHT FOR AUTOPASTER STATUS
        let total_kilos = {
            autopaster_id: AutopasterNum,
            kilosNeeded: BobinaParams.actualWeight - Math.abs(kilosNeededForAutopaster[0].kilosNeeded)
        };
        // UPDATE WEIGHT AUTOPASTER STATE
        const updateKilos = kilosState.map(i => {
            if (i.autopaster_id === AutopasterNum) {
                return total_kilos
            } else {
                return i
            }
        })
        const insertReplace =
            `INSERT OR REPLACE INTO bobina_table (codigo_bobina, peso_ini, peso_actual, radio_actual, papel_comun_fk, autopaster_fk, gramaje_fk, media, codeType)
     VALUES (?,?,?,?,?,?,?,?,?)`;
        let toSend;
        if (actionDDBB === 'insert') {
            alert('estamos en insert')
            toSend = await genericTransaction(insertReplace, values)
                //     .then(response => {
                //         console.log('response', response)
                //         return [
                //             null,
                //             productionID,
                //             BobinaParams.autopaster,
                //             BobinaParams.scanCode,
                //             restoPrevisto,
                //             BobinaParams.isMedia,
                //             finalPositionRoll,
                //             // productionID,
                //             // BobinaParams.autopaster,
                //         ]
                //     })
                .then(() => genericTransaction(autopaster_prod_data_insert,
                    [
                        null,
                        productionID,
                        BobinaParams.autopaster,
                        BobinaParams.scanCode,
                        restoPrevisto,
                        BobinaParams.isMedia,
                        finalPositionRoll,
                        // productionID,
                        // BobinaParams.autopaster,
                    ]))
                .then(() => genericTransaction(
                    // `SELECT * FROM autopasters_prod_data WHERE production_fk = ? AND autopaster_fk = ?;`,
                    `SELECT * FROM autopasters_prod_data
                INNER JOIN bobina_table ON bobina_table.codigo_bobina = autopasters_prod_data.bobina_fk
                WHERE autopasters_prod_data.production_fk = ?
                AND autopasters_prod_data.autopaster_fk = ?;
                `,
                    [productionID, BobinaParams.autopaster]
                ))
                .then(response => {
                    const completeItem = response.map(item => {
                        return {
                            ...item,
                            toSend: false,
                            weightEnd: null,
                            radiusEnd: '',
                            codepathSVG: ''
                        }
                    })
                    return [...getRollsAutopaster.others, {
                        data: completeItem,
                        title: AutopasterNum
                    }].sort((a, b) => a.title - b.title)
                })
                .catch(error => console.log(error))
            //     .then(() => {
            //         // updateInfoForSectionList()
            //         alert('insert')
            //     })
            //     .catch(err => console.log(err))
        }
        if (actionDDBB === 'update') {
            alert('estamos en update<')
            //evaluar si ya está en base de datos bobina_table
            toSend = await genericTransaction(insertReplace, values)
                .then(() => {
                    // genericUpdatefunction(autopasters_prod_data_update, [
                    //     null,
                    //     productionID,
                    //     BobinaParams.autopaster,
                    //     BobinaParams.scanCode,
                    //     restoPrevisto,
                    //     BobinaParams.isMedia,
                    //     finalPositionRoll
                    // ])
                    genericUpdatefunction(autopasters_prod_data_update, [
                        BobinaParams.scanCode,
                        restoPrevisto,
                        productionID,
                        AutopasterNum
                    ])
                })
                // .then(resp => console.log('posible breack', resp))
                .then(() => genericTransaction(
                    // `SELECT * FROM autopasters_prod_data WHERE production_fk = ? AND autopaster_fk = ?;`,
                    `SELECT * FROM autopasters_prod_data
                INNER JOIN bobina_table ON bobina_table.codigo_bobina = autopasters_prod_data.bobina_fk
                WHERE autopasters_prod_data.production_fk = ?
                AND autopasters_prod_data.autopaster_fk = ?;
                `,
                    [productionID, AutopasterNum]
                ))
                .then(response => {
                    const completeItem = response.map(item => {
                        return {
                            ...item,
                            toSend: false,
                            weightEnd: null,
                            radiusEnd: '',
                            codepathSVG: ''
                        }
                    })
                    return [...getRollsAutopaster.others, {
                        data: completeItem,
                        title: AutopasterNum
                    }].sort((a, b) => a.title - b.title)
                })
                .catch(error => console.log(error))
        }
        // RETURN ITEMS AND KILOSNEEDED FOR AUTOPASTER STATE.
        return {items: toSend, kilos: updateKilos}
        // return genericTransaction(autopasters_prod_table_by_production, [productionID])
        //     .then(response => groupedAutopasters(response))
    } catch (err) {
        console.log('error en registerNewBobina', err)
    }
};

export function ejemplaresToKilos(tirada, nulls, coefRoll) {
    return (tirada + nulls) * coefRoll
}

export function kilosByAutopasterCalc(itemsState, prodData, autopastersData) {
    console.log('kilosByAutopasterCalc', autopastersData)
    console.log('itemsState', itemsState)
    return itemsState.map(item => {
        let existKey = false;
        let total = autopastersData.filter(i => i.autopaster_fk === item.title);
        console.log('total', total)
        let _total = total[0].media_defined ? prodData.media_value : prodData.full_value;
        if ((prodData.paginacion_value / 16) % 1 === 0 && total[0].media_defined === 1) {
            alert('es full')
            _total = prodData.full_value;
        }
        // let _total = total[0].media ? prodData.media_value : prodData.full_value;
        if (item.data[0].bobina_fk) {
            existKey = true;
        }
        return {
            autopaster_id: item.title,
            kilosNeeded: ((existKey ? item.data.reduce((acc, i) => acc + i.peso_actual, 0) : 0) - ((prodData.tirada + prodData.nulls) * _total))
        }
    });
};

export async function kilosInThisAutopasterCalc(autopasterID, itemsTate, prodData) {
    try {
        const searchedItems = await searchItems(autopasterID, itemsTate);
        const kilosAutopasterForUpdate = searchedItems.toUpdate.reduce((acc, item) => acc + item.peso_actual, 0);
        return {
            autopaster_id: prodData.autopaster,
            kilosNeeded: kilosAutopasterForUpdate - ejemplaresToKilos(prodData.tirada, prodData.nulls, (searchedItems.toUpdate[0].isMedia ? prodData.media_value : prodData.full_value))
        }
    } catch (err) {
        console.log('error en kilosInThisAutopasterCalc')
    }
};

export function arrayNumbersToString(myArray) {
    //For insert in BBDD
    let Arraystring = myArray[0].toString();

    for (let i = 1; i < myArray.length; i++) {
        Arraystring = Arraystring + "," + myArray[i].toString();

    }
    return Arraystring
}

export function countElements(concatArrays) {
    const countedItems = concatArrays.reduce((acc, item) => {
        acc[item]
            ? acc[item] = acc[item] + 1
            : acc[item] = 1
        return acc
    }, {})
    return [countedItems];
}

export function autopastersAutomaticSelection(ProductionID, pagination, statePagination) {
    const selectedProductionResult =
        `SELECT used_autopasters FROM productresults_table 
LEFT JOIN producto_table
ON producto_table.producto_id = productresults_table.nombre_producto
LEFT JOIN paginacion_table 
ON paginacion_table.paginacion_value = productresults_table.paginacion
WHERE productresults_table.nombre_producto = ? AND paginacion_table.paginacion_id = ?;
    `;
    const paginationValue = statePagination.filter(i => i.paginacion_id === pagination)
    return genericTransaction(selectedProductionResult, [ProductionID, pagination])
        .then(response => {
            const concatenated = response.reduce((acc, item, index) => {
                let newitem = item.used_autopasters.split(/\,/g);
                return acc.concat(newitem)
            }, []);
            const itemsCounted = countElements(concatenated);
            let entries = Object.entries(itemsCounted);
            let sorted = entries.sort((a, b) => b[1] - a[1]);
            let numMaxAutopasters = numberOfAutopasters(paginationValue[0].paginacion_value);
            let autopasters = [];
            sorted.forEach((i, index) => {
                if (index < numMaxAutopasters) {
                    autopasters.push(...Object.keys(i[1]))
                }
            });
            const autopastersToIntegers = autopasters.map(i => parseInt(i))
            return autopastersToIntegers;
        })
        .catch(err => console.log('autopastersAutomaticSelection', err));
}

export function rangeCopies(numEjemplares) {
    let obj = {
        min: 0,
        max: 0
    }
    if (numEjemplares < 1000) {
        obj.max = numEjemplares + 1000
    } else {
        let rounded = Math.round(numEjemplares / 1000) * 1000;
        obj.min = rounded - 1000;
        obj.max = rounded + 1000;
    }
    return obj;
}