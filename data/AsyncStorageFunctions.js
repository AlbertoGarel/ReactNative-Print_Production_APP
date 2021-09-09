//DATA FOR SQLlITE

// Área del folio = 70 cm x 80 cm = 0,7 m x 0,8 m = 0,56 m2
// Área de la bobina = 1.000 cm x 140 cm = 100 m x 1,4 m = 140 m2
// Folios por bobina = 140 m2 / 0,56 m2 = 250 folios

import AsyncStorage from "@react-native-async-storage/async-storage";

export function calcAutopasters(num) {
    if (isNaN(num)) {
        //no se dejará en input introducir un valor que no sea number
        // ni mayor de autopasters * 16
        return console.log('no es numero')
    }
    let res = num / 16;
    if (res % 1 === 0) {
        //asignará autopasters según preferencia sin incluir el definido como media
        console.log('Es número entero y resultado es: ' + res);
        return res;
    } else if (res % 1 === 0.5) {
        //asignará autopasters según preferencia incluyendo el definido como media
        console.log('Es número decimal y resultado es: ' + res);
        return res;
    }
}

/**
 *
 * @storage asyncStorage functions
 *
 **/
//Store
export const storeData = async (storageName, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(storageName, jsonValue)
    } catch (e) {
        console.error(`To save ${storageName}`, e);
    }
}

//Read
export const getDatas = async (storageName) => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageName)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error(`To read ${storageName}`, e);
    }
}

//Delete
export const removeValue = async (storageName) => {
    try {
        await AsyncStorage.removeItem(storageName)
    } catch(e) {
        // remove error
    }

    console.log('Done.')
}