import {Alert} from "react-native";

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
    if (isNaN(radius)) {
        let char = radius.charAt(radius.length - 1);
        let deleteBadChar = radius.split(char, radius.length - 1)[0];
        if (deleteBadChar === undefined) {
            defradius = '';
        } else {
            defradius = deleteBadChar;
        }
        Alert.alert('introduce caracter numérico o punto para decimales.');
    } else {
        defradius = radius;
    }
    _setState(defradius);
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
    const res = Math.round((pesoBob / coef) - numProd);

    if (res > 0) {
        returnObject.rollweight = Math.round(pesoBob - (numProd * coef));
        returnObject.copies = Math.round((pesoBob - (numProd * coef)) / coef);
    } else {
        const calcWeight = Math.round(Math.abs(res) * coef);
        const calcEjem = Math.round(calcWeight / coef);
        returnObject.copies = calcEjem;
    }
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
    orderedItems.forEach((item, index) => {
        let calc_kilosPrev = kilosPrev - item.weightAct;
        updatedItems.push([
                index + 1,
                calc_kilosPrev <= 0 ? Math.abs(kilosPrev - item.weightAct) : 0,
                productionID,
                item.bobinaID
            ]
        );
        kilosPrev = calc_kilosPrev <= 0 ? 0 : calc_kilosPrev;
    })
    return updatedItems;
}
/**
 *  set string name barcode type for BBDD row.
 *
 *  @return string
 *
 *  @param type: string / integer (barcodeType scanned)
 *
 * */
export const typeBarcodeFiter = (type) => {
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
 *  TAKES PRODUCTION DATA AND RETURNS HTML STRING TO CREATE PDF.
 *
 *  @return html string
 *
 *  @param type: string / integer (barcodeType scanned)
 *
 * */
export const createHMLstring = (HTMLtemplate, ) => {

};