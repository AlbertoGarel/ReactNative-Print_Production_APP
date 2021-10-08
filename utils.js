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

    if(month < 10){
        return `${year}-0${month}-${day}`
    }else{
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