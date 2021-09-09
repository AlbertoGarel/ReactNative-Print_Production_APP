import {Alert} from "react-native";

export const timeNow = () => {
    let now = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
};

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
}