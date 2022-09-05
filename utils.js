import {Alert} from "react-native";
import {genericTransaction, genericUpdatefunction, genericUpdateFunctionConfirm} from "./dbCRUD/actionsFunctionsCrud";
import {autopaster_prod_data_insert, dataProductSelectedAllInfo} from "./dbCRUD/actionsSQL";
import * as MailComposer from 'expo-mail-composer';
import * as Sentry from 'sentry-expo';

/**
 *  SENTRY WARNING
 *
 *  @param tag1: <string> name first tag
 *  @param tag2: <string> name second tag
 *  @param error: object error
 *
 *
 * */
export function Sentry_Alert(tag1, tag2, error) {
    const scope = new Sentry.Native.Scope();
    scope.setTag("section", "articles");
    Sentry.Native.captureException(error, scope);
}

// Área del folio = 70 cm x 80 cm = 0,7 m x 0,8 m = 0,56 m2
// Área de la bobina = 1.000 cm x 140 cm = 100 m x 1,4 m = 140 m2
// Folios por bobina = 140 m2 / 0,56 m2 = 250 folios

// SQL SENTENCES FOR UTILS FUNCTIONS
const autopasters_prod_data_update =
    `UPDATE autopasters_prod_data
    SET bobina_fk = ?, resto_previsto = ?
    WHERE production_fk = ? AND autopaster_fk = ?;`
;
const select_all_rolls_by_production_and_autopaster =
    `SELECT * FROM autopasters_prod_data
     INNER JOIN bobina_table ON bobina_table.codigo_bobina = autopasters_prod_data.bobina_fk
     WHERE autopasters_prod_data.production_fk = ?
     AND autopasters_prod_data.autopaster_fk = ?;
     `
;
const insertReplace =
    `INSERT OR REPLACE INTO bobina_table (codigo_bobina, peso_ini, peso_actual, radio_actual, papel_comun_fk, autopaster_fk, gramaje_fk, media, codeType)
     VALUES (?,?,?,?,?,?,?,?,?)`
;
const UPDATE_PROMISES_ALL =
    `UPDATE autopasters_prod_data SET
     position_roll = ?, resto_previsto = ?
     WHERE production_fk = ? AND bobina_fk = ?;`
;

/**
 *   hour : minutes : seconds : milliseconds
 *
 *   @return hour, minutes, seconds, and milliseconds
 *
 **/
export const timeNow = () => {
    let now = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
};

/**
 *   year / month / day
 *
 *   @return year, month and day
 *
 **/
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

/**
 *   year / month / day
 *
 *   @return year, month and day
 *
 **/
export const paperRollConsummption = (radius) => {
    let defradius = 0;
    let char = radius.charAt(radius.length - 1);

    if (isNaN(radius)) {
        let deleteBadChar = radius.substr(char, radius.length - 1);
        if (deleteBadChar === undefined) {
            defradius = '';
        } else {
            defradius = deleteBadChar;
        }
        Alert.alert('introduce caracter numérico.');
    } else {
        if (radius < 0) {
            defradius = null
        }
        if (radius > 60) {
            defradius = radius.charAt(radius.length);
        } else {
            defradius = Math.round(radius);
        }
    }
    return defradius
}

/**
 *  integer for full roll or float for 1/2 roll
 *
 *  @return <integer> or float.
 *
 *  @param pagination: <integer> (pagination value)
 *
 **/
export const numberOfAutopasters = (pagination) => {
    return Math.round(pagination / 16);
};

/**
 *  Identifies if autopaster is for 1/2 roll or full roll.
 *
 *  @return <javascript object> {media: , entera: }.
 *
 *  @param num: <integer> (pagination value)
 *
 **/
export const identifyAutopasters = (num) => {
    const whithMedia = num / 16;
    if (whithMedia % 1 === 0) {
        //Assign autopasters according to preference without including the one defined as average
        return {media: 0, entera: whithMedia}
    } else if (whithMedia % 1 === .5) {
        //Assign autopasters according to preference including the one defined as average
        // value 1 for media and defAutopasters - .5 for calc 'entera'.
        return {media: 1, entera: whithMedia - .5}
    }
};

/**
 *  Calculate weight and copies.
 *
 *  @return <JavaScript object> {
 *          rollweight: consumed Kilos(rollweight === 0) or leftover Kilos (rollweight !== 0),
 *          copies: to complete (rollweight === 0) or leftover copies (rollweight !== 0)
 *          }
 *
 *  @param numProd: <integer> (production copies + approximated expected null copies)
 *  @param pesoBob: <integer> (weight roll)
 *  @param coef: <integer> (coefficient for roll radius)
 *
 */
export const individualProvidedWeightRollProduction = (numProd, pesoBob, coef) => {
    const returnObject = {rollweight: 0, copies: 0};
    const res = Math.round((pesoBob / coef) - numProd);

    if (res > 0) {
        returnObject.rollweight = Math.round(pesoBob - (numProd * coef));
        returnObject.copies = Math.round((pesoBob - (numProd * coef)) / coef);
    } else {
        const calcWeight = Math.round(Math.abs(res) * coef);
        returnObject.copies = Math.round(calcWeight / coef);
    }

    return returnObject;
};

/**
 *  Search and return coefficient of roll found
 *
 *  @return <integer> or float
 *
 *  @param meditionStyle: <javascript object> {}
 *  @param foundRoll: <javascript object> {}
 *
 */
export const searchCoefTypeRoll = (meditionStyle, foundRoll) => {
    return foundRoll.media ? meditionStyle.media_value : meditionStyle.full_value;
};

/**
 *  Group items with same key value.
 *
 *  @return grouped javascript object.
 *
 *  @param arrayToGroup: <array javascript object> {}
 *  @param objKey: <string> of key.
 *
 */
export const groupBy = (arrayToGroup, objKey) => {
    //We create a new object where we are going to store by autopasters.
    let nuevoObjeto = {}
    //We go through the arrangement
    arrayToGroup.forEach(x => {
        //If the autopaster does not exist in newObject then we create it and initialize the autopaster arrangement.
        if (!nuevoObjeto.hasOwnProperty(x[objKey])) {
            nuevoObjeto[x[objKey]] = []
        }

        //We aggregate the data of the coils recorded in autopasters.
        nuevoObjeto[x[objKey]].push(x);
    });
    return nuevoObjeto;
};

/**
 *  Sum the values of a chosen key common to all of them. .
 *
 *  @return <integer>: Sum of values.
 *
 *  @param arrObject: <array javaScript object> {}
 *  @param objKey: <string> of key.
 *
 */
export const calcValues = (arrObject, objKey) => {
    return arrObject.reduce((acc, sec) => acc + sec[objKey], 0);
}

/**
 *  Extracts the number of kilos of barcode type 128
 *
 *  @return <integer>: Number of kilos.
 *
 *  @param data: <integer>
 *
 */
export const OriginalWeight = (data) => {
    return Math.abs((data).toString().substring(8, 12))
};

/**
 *  orders rolls and calculates kilos consumed of each one
 *
 *  @return javaScript objects collection: [{items}]
 *
 *  @param arrObjects: <javaScript objects collection> [{items}]
 *  @param tiradaTotal: <integer>
 *  @param gramajeValues: <javaScript object> {}
 *  @param productionID: <integer>
 *
 */
export const CalcPrevConsKilosRollsAutopaster = (arrObjects, tiradaTotal, gramajeValues, productionID) => {
    //Order from lowest to highest those that remain by position and recalculate kilos planned.
    const orderedItems = arrObjects.sort((a, b) => a.position_roll - b.position_roll);
    //Calculate kilos consumed by each one and assign position.
    let isMedia = orderedItems[0].media_defined ? gramajeValues.media : gramajeValues.entera;
    let kilosPrev = Math.round(tiradaTotal * isMedia);
    let updatedItems = [];
    let calc_kilosPrev = kilosPrev;

    orderedItems.forEach((item, index) => {
        let kilos = null;
        let indice = index + 1;

        if (item.rest_antProd !== null) {
            kilos = calc_kilosPrev > item.rest_antProd ? 0 : Math.abs(calc_kilosPrev - item.rest_antProd);
            calc_kilosPrev = calc_kilosPrev >= 0 && calc_kilosPrev >= item.rest_antProd
                ? calc_kilosPrev - item.rest_antProd
                : 0
        } else {
            kilos = calc_kilosPrev > item.peso_actual ? 0 : Math.abs(calc_kilosPrev - item.peso_actual);
            calc_kilosPrev = calc_kilosPrev >= 0 && calc_kilosPrev >= item.peso_actual
                ? calc_kilosPrev - item.peso_actual
                : 0
        }

        updatedItems.push([
                indice,
                kilos,
                productionID,
                item.codigo_bobina
            ]
        );
        // If it does not have a defined position in the reel list assigned in autopaster.
        // Avoid reassigning after moving cards (DragDrop)
        if (!item.position_roll) item.position_roll = index + 1;

        item.resto_previsto = kilos;
    });

    const kilosNeededState = orderedItems.reduce((acc, i) => {
        if (i.rest_antProd !== null) {
            acc = acc + i.rest_antProd;
        } else {
            acc = acc + i.peso_actual;
        }
        return acc - kilosPrev
    }, 0);

    return {
        updatedItemsForPromises: updatedItems,
        updatedItemsForSection: orderedItems,
        kilosNeedeState: kilosNeededState
    };
};

/**
 *  set string name barcode type for BBDD row.
 *
 *  @return string
 *
 *  @param type: <string> / <integer> (barcodeType scanned)
 *
 */
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

/**
 *  return month.
 *
 *  @return string month.
 *
 *  @param date: <string> ("yy-mm-dd")
 *
 */
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

/**
 *  Create and grouped string dates ("month year").
 *
 *  @return <array of javascript objects>.
 *
 *  @param arr: <array> of dates.
 *
 */
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
        Sentry_Alert('utils.js', 'function - setFormatDAta', err)
    }
};

/**
 *  Compare two arrays.
 *
 * @param a type: <Array>
 * @param b type: <Array>
 *
 * @return true/false type: boolean
 *
 */
export const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.length > 0 && b.length > 0 &&
        a.every((val, index) => val === b[index]);
}

/**
 *  Groups rolls by ayutopaster, calculates existing kilos by autopaster and updates predictions in database.
 *
 * @param data type: array of elements.
 * @param production_id type: <integer>.
 *
 * @return true/false type: <boolean>
 *
 */
export async function groupedAutopasters(data, production_id) {
    const innerBobinaTableAndProductData =
        `SELECT * FROM autopasters_prod_data
        INNER JOIN bobina_table ON bobina_table.codigo_bobina = ?
        WHERE autopasters_prod_data.production_fk = ?
        AND autopasters_prod_data.bobina_fk = bobina_table.codigo_bobina
        AND autopasters_prod_data.autopaster_fk = bobina_table.autopaster_fk;
        `;
    const selectLastRestoPrev =
        `
        SELECT a.resto_previsto AS 'rest_antProd' FROM autopasters_prod_data a
     INNER JOIN bobina_table ON bobina_table.codigo_bobina = ?
     WHERE a.production_fk < ?
     AND a.bobina_fk = bobina_table.codigo_bobina ORDER BY a.production_fk DESC LIMIT 1        
        `;
    try {
        const prodData = await genericTransaction(dataProductSelectedAllInfo, [production_id]);

        const extraData = {
            toSend: false,
            weightEnd: null,
            radiusEnd: '',
            codepathSVG: ''
        }
        const groupedForSectionList = data.reduce(async (acc, item) => {
            acc = await acc;
            // check if roll exists in autopaster
            let _rollInDatabase = await genericTransaction(innerBobinaTableAndProductData, [item.bobina_fk ? item.bobina_fk : 0, item.production_fk])
            let rollInDatabase = [];
            if (_rollInDatabase.length > 1) {
                rollInDatabase = _rollInDatabase.filter(i => i['bobina_fk'])
            } else {
                rollInDatabase = [..._rollInDatabase];
            }
            if (rollInDatabase.length) {
                // if exist, add rest_andProd value
                let last = await genericTransaction(selectLastRestoPrev, [item.bobina_fk ? item.bobina_fk : 0, item.production_fk])
                rollInDatabase[0].rest_antProd = last.length > 0 ? last[0].rest_antProd : null;
            }
            // if it exists, we add item with extradata. If it doesn't exist just extradata.
            acc[item.autopaster_fk] ?
                acc[item.autopaster_fk]['data'].push(rollInDatabase.length ? {...rollInDatabase[0], ...extraData} : extraData)
                :
                acc[item.autopaster_fk] = {
                    title: item.autopaster_fk,
                    data: rollInDatabase.length ? [{...rollInDatabase[0], ...extraData}] : [extraData]
                }

            if (rollInDatabase.length) {
                //if exist, calculate weight.
                const calc = await CalcPrevConsKilosRollsAutopaster(
                    acc[item.autopaster_fk].data,
                    (prodData[0].tirada + prodData[0].nulls),
                    {media: prodData[0].media_value, entera: prodData[0].full_value},
                    production_id
                );

                acc[item.autopaster_fk].data = [...calc.updatedItemsForSection];
                // update items in BBDD.
                let promisesALLforUpdateItems = [];
                calc.updatedItemsForPromises.forEach(i => {
                    promisesALLforUpdateItems.push(genericUpdateFunctionConfirm(UPDATE_PROMISES_ALL, i));
                })
                await Promise.all(promisesALLforUpdateItems)
            }
            return acc;
        }, {});

        return Object.values(await groupedForSectionList);
    } catch (err) {
        Sentry_Alert('utils.js', 'function - groupedAutopasters', err)
    }
}

/**
 *  search roll in production.
 *
 * @param autopasterID type: integer.
 * @param sectionListState type: array of grouped production javascript object.
 *
 * @return javascript object ({toUpdate: element, others: other elements of production})
 *
 */
export function searchItems(autopasterID, sectionListState) {
    return new Promise((resolve, reject) => {
        const reducer = sectionListState.reduce((acc, item) => {
            if (item.title === autopasterID) {
                acc.toUpdate = item
            } else {
                acc.others = [...acc.others, item]
            }
            return acc;
        }, {toUpdate: '', others: ''});
        resolve(reducer);
    })
};

/**
 *  Delete roll in production.
 *
 * @param response type: javsacript object ({toUpdate: element, others: other elements of production})
 * @param rollID type: integer.
 * @param productionData type: array of grouped production javascript object.
 *
 * @return javascript object {updateItemsForSectionList: sectionList data [{data: [], title: integer}] , updateKilosNeededState: {data: kg, title: autopaster_ID}})
 *
 */
export async function deleteItem(response, rollID, productionData) {
    const DELETE_ItemFromAutopasterSQL =
        `DELETE FROM autopasters_prod_data
         WHERE production_fk = ? AND bobina_fk = ?;`;
    const UPDATE_ItemFromAutopasterSQL =
        `UPDATE autopasters_prod_data SET
        bobina_fk = ?, resto_previsto = ?
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
            updateKilosNeededState = forPromisesAllforUpdate.kilosNeedeState
        }
        return await genericUpdateFunctionConfirm(...paramsAction)
            .then(rowsAffected => {
                if (rowsAffected === 1 && updatedGroup.data > 1) {
                    return Promise.all(promisesALLforUpdateItems)
                }
                if (rowsAffected === 1 && updatedGroup.data === 1) {
                    return true
                }
            })
            .then(async () => {
                return {
                    updateItemsForSectionList: [...others, updateItemsForSectionList].sort((a, b) => a.title - b.title),
                    updateKilosNeededState: updateKilosNeededState
                }
            })
    } catch (err) {
        Sentry_Alert('utils.js', 'function - deleteItem', err)
    }
};

/**
 *  To update roll in production and data base and return boolean for initiate production calculate.
 *
 * @param rollID type: <integer>.
 * @param radiusState type: <integer>
 * @param items type: <javascript object> (roll element).
 * @param maxRadiusValue type: <integer>.
 * @param coefficientDDBB type: <integer> || float.
 * @param kilosNeeded type: <array javascript object> {sutopaster_id: integer, kilosNeeded: positive integer || negative integer}
 *
 * @return javascript object {sectionListUpdate: sectionList data [{ data: [], title: integer}] , initCalc: boolean })
 *
 */
export function updatedataRollState(rollID, radiusState, items, maxRadiusValue, coefficientDDBB, kilosNeeded) {
    return new Promise((resolve, reject) => {
        if (radiusState > maxRadiusValue) {
            Alert.alert('¡¡Error!!', `El radio máximo registrado en base de datos es ${maxRadiusValue} cm. Has introducido ${radiusState}.`
            );
            items.toUpdate.data[0].radiusEnd = '';
            items.toUpdate.data[0].weightEnd = '';
            items.toUpdate.data[0].toSend = false;
            resolve({
                sectionListUpdate: [...items.others, items.toUpdate].sort((a, b) => a.title - b.title),
                initCalc: false
            })
        } else if (radiusState === '' || radiusState === ' ' || isNaN(radiusState)) {
            Alert.alert(`Introduce un valor para realizar el cálculo.`);
            items.toUpdate.data[0].radiusEnd = '';
            items.toUpdate.data[0].weightEnd = '';
            items.toUpdate.data[0].toSend = false;
            resolve({
                sectionListUpdate: [...items.others, items.toUpdate].sort((a, b) => a.title - b.title),
                initCalc: false
            })
        } else {
            const itemToUpdate = items.toUpdate.data.filter(i => i.bobina_fk === rollID);
            // if initial radius (new roll) is null, set max value for radius.
            const radiusNull = itemToUpdate[0].radio_actual ? itemToUpdate[0].radio_actual : maxRadiusValue;
            // ITEM DATA DEFAULT.
            let end_weight = itemToUpdate[0].weightEnd;
            let end_radius = itemToUpdate[0].radiusEnd;
            let to_send = false;

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

            const toReturn = [...items.others, updateLoop].sort((a, b) => a.title - b.title);
            const validforcalc = validForCalc(toReturn, kilosNeeded)

            resolve({sectionListUpdate: toReturn, initCalc: validforcalc});
        }
    })
        .catch(err => Sentry_Alert('utils.js', 'function - updatedataRollState', err))
}

/**
 *  Check if the conditions for calculating production results with the "toSend" field are met.
 *
 *  @params arrItems type: <array> sectionList for data.
 *  @params kilosNeeded type: <array> of calculation of current kilograms by autopaster.
 *
 *  @returns type: <boolean>
 */
export function validForCalc(arrItems, kilosNeeded) {
    const values = [];
    arrItems.forEach(item => {
        item.data.forEach(i => {
            values.push(i.toSend);
        })
    })

    return values.every(value => value === true)
};

/**
 *  Scan barcode and determine if it exists in the database or is a new record. ADD ROLL IN PRODUCTION.
 *
 *  @param scanned type: <javascript object> - {scannedCode, codeType}
 *  @param autopasterID type: <integer> - autopaster id.
 *  @param itemsState type: <array> - data array state of sectionList.
 *  @param productionData type: <javascript object> - production data.
 *  @param autopasterLineProdData type: <array javascript object> - production line data.
 *
 *  @returns type: array -
 */
export async function getScannedCode(scanned, autopasterID, itemsState, productionData, autopasterLineProdData) {
    try {
        let {scannedCode, codeType} = scanned;
        if (scannedCode.length !== 16) {
            alert('El valor numérico del código de barras no tiene el formato esperado de 16 cifras.')
            return false;
        }
        scannedCode = parseInt(scannedCode);
        let change_media_type = autopasterLineProdData.filter(i => i.autopaster_fk === autopasterID)[0].media_defined;
        const existInProduction = await genericTransaction(
            "SELECT * FROM autopasters_prod_data WHERE production_fk = ? AND media_defined = ?",
            [productionData.produccion_id, change_media_type]
        );
        let actionBBDD = 'insert';
        const _existInProduction = existInProduction.filter(i => i.bobina_fk === (scannedCode));
        if (_existInProduction.length > 0) {
            alert(`Esta bobina ya exite en esta producción en autopaster nº ${_existInProduction[0].autopaster_fk}`)
            return false;
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
                autopaster: autopasterID,
                grama: existInDDBB[0].gramaje_fk,
                isMedia: existInDDBB[0].media,
                codeType: existInDDBB[0].codeType
            }
        } else {
            text = `REGISTRO DE BOBINA:\n ¿ES NUEVA?`;
            const OrWeight = OriginalWeight(scannedCode);
            regNewRoll = {
                scanCode: scannedCode,
                originalWeight: OrWeight,
                actualWeight: OrWeight,
                radius: null,
                commonRole: productionData.papel_comun_id,
                autopaster: autopasterID,
                grama: productionData.gramaje_id,
                isMedia: change_media_type,
                codeType: codeType
            }
        }
        return [regNewRoll, actionBBDD, text];
    } catch (err) {
        Sentry_Alert('utils.js', 'function - getScannedCode', err)
    }
};

/**
 *  Check if autopasters contain minimum weight required to create report.
 *
 *  @params minKg type: <javascript object> - Weight calculation minimum to create report.
 *  @params contabilizedKG type: <javascript object> - Existing kilos in autopaster (kilosNeeded state).
 *  @params autopastersList type: <array object> - autopasters list.
 *
 *  @returns type: boolean
 *
 * */
export function calculateMinimunKg(minKg, contabilizedKG, autopastersList) {
    const isMedia = autopastersList.filter(i => i.media_defined);
    const resultToCalc = [].concat(contabilizedKG).map(roll => {
        if (roll.autopaster_id === isMedia.autopaster_fk) {
            return minKg.media <= roll.kilosNeeded
        } else {
            return minKg.entera <= roll.kilosNeeded
        }
    });

    return resultToCalc.every(value => value === true);
}

/**
 *  register new roll and update empty autopaster.
 *
 *  @params BobinaParams type: <javascript object> - roll data.
 *  @params actionDDBB type: <string> - "insert" || "update"
 *  @params itemsState type: <array> - data array state of sectionList.
 *  @params prodData type: <javascript object> - production data.
 *  @params kilosState type: <array> of calculation of current kilograms by autopaster.
 *
 *  @returns type: javascript object
 */
export async function registerNewBobina(BobinaParams, actionDDBB, itemsState, prodData, kilosState) {
    try {
        const de = await genericTransaction(
            select_all_rolls_by_production_and_autopaster,
            [prodData.produccion_id, BobinaParams.autopaster,]
        );
        let getRollsAutopaster = await searchItems(BobinaParams.autopaster, itemsState);
        let maxPositionRoll = de.length > 0 ? de.sort((a, b) => b.position_roll - a.position_roll)[0].position_roll : 0;
        let finalPositionRoll = maxPositionRoll + 1;
        const values = Object.values(BobinaParams);
        let productionID = prodData.produccion_id;
        const AutopasterNum = BobinaParams.autopaster;
        const kilosNeededForAutopaster = kilosState.filter(i => i.autopaster_id === AutopasterNum)
        // CALCULATE WEIGHT FOR NEW ROLL
        let _restoPrevisto = kilosNeededForAutopaster[0].kilosNeeded >= 0
            ? BobinaParams.actualWeight
            : BobinaParams.actualWeight - Math.abs(kilosNeededForAutopaster[0].kilosNeeded)
        let restoPrevisto = _restoPrevisto <= 0 ? 0 : Math.round(_restoPrevisto);

        // CALCULATE WEIGHT FOR AUTOPASTER STATUS
        let total_kilos = {
            autopaster_id: AutopasterNum,
            // kilosNeeded: kilosNeededForAutopaster[0].kilosNeeded >= 0
            //     ? BobinaParams.actualWeight + kilosNeededForAutopaster[0].kilosNeeded
            //     : BobinaParams.actualWeight - Math.abs(kilosNeededForAutopaster[0].kilosNeeded)
            kilosNeeded: kilosNeededForAutopaster[0].kilosNeeded + BobinaParams.actualWeight
        };

        // UPDATE WEIGHT AUTOPASTER STATE
        const updateKilos = kilosState.map(i => {
            if (i.autopaster_id === AutopasterNum) {
                return total_kilos
            } else {
                return i
            }
        })

        let toSend = null;
        if (actionDDBB === 'insert') {
            toSend = await genericTransaction(insertReplace, values)
                .then(() => genericTransaction(autopaster_prod_data_insert,
                    [
                        null,
                        productionID,
                        BobinaParams.autopaster,
                        BobinaParams.scanCode,
                        restoPrevisto,
                        BobinaParams.isMedia,
                        finalPositionRoll,
                    ]))
                .then(() => genericTransaction(
                    select_all_rolls_by_production_and_autopaster,
                    [productionID, BobinaParams.autopaster]
                ))
                .then(response => {
                    const addeRoll = response.filter(roll => roll.codigo_bobina === BobinaParams.scanCode)[0];
                    const complete_addedRoll = {
                        ...addeRoll,
                        toSend: false,
                        weightEnd: null,
                        radiusEnd: '',
                        codepathSVG: '',
                        rest_antProd: null
                    }
                    const completeItem = [...getRollsAutopaster.toUpdate.data, complete_addedRoll];
                    return [...getRollsAutopaster.others, {
                        data: completeItem,
                        title: AutopasterNum
                    }].sort((a, b) => a.title - b.title)
                })
        }
        if (actionDDBB === 'update') {
            //evaluate if it exists in database bobbin_table
            toSend = await genericTransaction(insertReplace, values)
                .then(() => {
                    genericUpdatefunction(autopasters_prod_data_update, [
                        BobinaParams.scanCode,
                        restoPrevisto,
                        productionID,
                        AutopasterNum
                    ])
                })
                .then(() => genericTransaction(
                    select_all_rolls_by_production_and_autopaster,
                    [productionID, AutopasterNum]
                ))
                .then(response => {
                    const completeItem = response.map(item => {
                        return {
                            ...item,
                            toSend: false,
                            weightEnd: null,
                            radiusEnd: '',
                            codepathSVG: '',
                            rest_antProd: null
                        }
                    })
                    return [...getRollsAutopaster.others, {
                        data: completeItem,
                        title: AutopasterNum
                    }].sort((a, b) => a.title - b.title)
                })
        }
        await reorganizeProduction(prodData, BobinaParams);
        // RETURN ITEMS AND KILOSNEEDED FOR AUTOPASTER STATE.
        return {items: toSend, kilos: updateKilos}
    } catch (err) {
        Sentry_Alert('utils.js', 'function - registerNewBobina', err)
    }
};

/**
 * Calculate kilos needed according to the number of copies
 *
 * @params tirada type: <integer> - num of copies
 * @params nulls type: <integer> - num of null copies
 * @params coefRoll type: <float> - measurement coefficient value
 *
 * @returns <integer>
 * */
export function ejemplaresToKilos(tirada, nulls, coefRoll) {
    return (tirada + nulls) * coefRoll
};

/**
 *  Calculates necessary and existing kilos in each autopaster.
 *
 *  @params itemsState type: <array> - data array state of sectionList.
 *  @params prodData type: <javascript object> - production data.
 *  @params autopastersData type: <array> - data array of autopasters line.
 *
 *  @returns array
 * */
export function kilosByAutopasterCalc(itemsState, prodData, autopastersData) {
    return itemsState.map(item => {
        let existKey = false;
        let total = autopastersData.filter(i => i.autopaster_fk === item.title);
        let _total = total[0].media_defined ? prodData.media_value : prodData.full_value;

        if ((prodData.paginacion_value / 16) % 1 === 0 && total[0].media_defined === 1) {
            _total = prodData.full_value;
        }

        if (item.data[0].bobina_fk) {
            existKey = true;
        }

        return {
            autopaster_id: item.title,
            kilosNeeded: ((existKey
                    ? item.data.reduce((acc, i) => {
                        if (i.rest_antProd !== null) {
                            return acc + i.rest_antProd
                        } else {
                            return acc + i.peso_actual
                        }
                    }, 0)
                    : 0
            ) - Math.round((prodData.tirada + prodData.nulls) * _total))
        }
    });
};

/**
 *  Calculates necessary and existing kilos in a single autopaster.
 *
 *  @async
 *  @params autopasterID type: <integer> - autopaster id.
 *  @params itemsTate type: <array> - data array state of sectionList.
 *  @params prodData type: <javascript object> - production data.
 *
 *  @returns array javascript object
 */
export async function kilosInThisAutopasterCalc(autopasterID, itemsTate, prodData) {
    try {
        const searchedItems = await searchItems(autopasterID, itemsTate);
        const kilosAutopasterForUpdate = searchedItems.toUpdate.reduce((acc, item) => acc + item.peso_actual, 0);
        return {
            autopaster_id: prodData.autopaster,
            kilosNeeded: kilosAutopasterForUpdate - ejemplaresToKilos(prodData.tirada, prodData.nulls, (searchedItems.toUpdate[0].isMedia ? prodData.media_value : prodData.full_value))
        }
    } catch (err) {
        Sentry_Alert('utils.js', 'function - kilosInThisAutopasterCalc', err)
    }
};

/**
 *  Convert numeric content of array to string
 *
 *  @params myArray type: <array>
 *
 *  @returns <array>
 */
export function arrayNumbersToString(myArray) {
    let Arraystring = myArray[0].toString();

    for (let i = 1; i < myArray.length; i++) {
        Arraystring = Arraystring + "," + myArray[i].toString();

    }
    return Arraystring
}

/**
 *  count equal elements in array.
 *
 *  @params concatArrays type: <array>
 *
 *  @returns <array>;
 * */
export function countElements(concatArrays) {
    const countedItems = concatArrays.reduce((acc, item) => {
        acc[item]
            ? acc[item] = acc[item] + 1
            : acc[item] = 1
        return acc
    }, {})
    return [countedItems];
};

/**
 *  Selects most used autopasters according to pagination and product.
 *
 *  @params ProductionID type: <integer> - production id.
 *  @params pagination type: <integer> - pagination.
 *  @params statePagination type: <array javscript object> - all registers of pagination database.
 *
 *  @returns array
 * */
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
            return autopasters.map(i => parseInt(i));
        })
        .catch(err => Sentry_Alert('utils.js', 'function - autopastersAutomaticSelection', err));
}

/**
 *  Sets a maximum and minimum range to search for similar productions.
 *
 *  @params numEjemplares type: integer - num of copies.
 *
 * */
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
};

/**
 *  Send email.
 *
 * @param options type: <javascript object> -  {
                subject:  <string>,
                recipients: <array>,
                body: <string>,
                isHTML: false,
                attachments: [fileURI]
            }
 * @param nameFile type: string - file name
 *
 */
export function handleEmail(options, nameFile) {
    MailComposer.composeAsync(options)
        .catch(() => new Error('emailError'))
};

/**
 *  Update rolls for subsequent productions.
 *
 *  @params item type: <javascript object> - production data.
 *  @params dataAddedRoll type: <javascript object> - roll data.
 *
 *  @returns Promise.all
 * */
export async function reorganizeProduction(item, dataAddedRoll) {
    const searchAllNextSameProductions =
        `SELECT produccion_id FROM produccion_table 
        JOIN producto_table ON producto_table.producto_id = produccion_table.producto_fk 
        WHERE produccion_table.produccion_id > ? AND producto_table.papel_comun_fk = ?`;
    const getRollsByProduccionID =
        `SELECT * FROM autopasters_prod_data WHERE production_fk = ? AND autopaster_fk = ? 
        AND media_defined = ?;`
    ;

    try {
        //get all next productions with the same owner.
        const result = await genericTransaction(searchAllNextSameProductions, [item.produccion_id, item.papel_comun_id])

        if (result.length) {
            const next_productions = await Promise.all(result.map(item => genericTransaction(getRollsByProduccionID, [item.produccion_id, dataAddedRoll.autopaster, dataAddedRoll.isMedia])))

            return Promise.all(next_productions.map(async prod => {
                    let existRoll = prod.filter(i => i.autopaster_fk === dataAddedRoll.autopaster && i['bobina_fk']);
                    let equal_roll = existRoll.filter(roll => roll.codigo_bobina === dataAddedRoll.codigo_bobina)[0];
                    if (existRoll.length > 0 && equal_roll.length === 0) {
                        //insert
                        const lastRoll = existRoll.sort((a, b) => b.position_roll - a.position_roll)[0];

                        return genericTransaction(
                            autopaster_prod_data_insert,
                            [null, lastRoll.production_fk, lastRoll.autopaster_fk, dataAddedRoll.scanCode, dataAddedRoll.actualWeight - lastRoll.resto_previsto, lastRoll.media_defined, lastRoll.position_roll + 1]
                        )
                    } else {
                        //             //update
                        //             //calculate weight
                        const data_for_this_production = await genericTransaction(
                            dataProductSelectedAllInfo,
                            [prod[0].production_fk]
                        )
                        const isMedia = !dataAddedRoll.isMedia ? data_for_this_production[0].full_value : data_for_this_production[0].media_value;
                        const weightAutopasterTotal = (data_for_this_production.tirada + data_for_this_production.nulls) * isMedia;
                        let weightPrev = dataAddedRoll.actualWeight > weightAutopasterTotal
                            ? Math.round(dataAddedRoll.actualWeight - weightAutopasterTotal)
                            : 0;

                        return genericTransaction(
                            `UPDATE autopasters_prod_data SET bobina_fk = ?, resto_previsto = ?, autopaster_fk = ? WHERE production_fk = ? AND autopasters_prod_data_id = ?`,
                            [dataAddedRoll.scanCode, weightPrev, dataAddedRoll.autopaster, prod[0].production_fk, prod[0].autopasters_prod_data_id]
                        )
                    }
                })
            );
        }
    } catch (err) {
        Sentry_Alert('utils.js', 'function - reorganizeProduction', err)
    }

};

/**
 *  SQLite common error handler.
 *
 *  @param Object error.
 *
 *  @returns <string>: custom message.
 **/
export function handlerSqliteErrors(error) {
    const handlerError = String(error).split('(')[1].split(' ', 2)[1];
    let message = '';
    if (__DEV__) console.log(error)
    switch (handlerError) {
        case '1811':
            message = 'No se puede eliminar este valor mientras siga referenciado en otra tabla.';
            break;
        case '2067':
        case '1555':
            message = 'Valor en uso. Introduzca otro diferente';
            break;
        default:
            message = 'error en la acción';
    }
    return message;
}