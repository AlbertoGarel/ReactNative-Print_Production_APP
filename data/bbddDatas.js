//DATA FOR SQLlITE

// Área del folio = 70 cm x 80 cm = 0,7 m x 0,8 m = 0,56 m2
// Área de la bobina = 1.000 cm x 140 cm = 100 m x 1,4 m = 140 m2
// Folios por bobina = 140 m2 / 0,56 m2 = 250 folios

//COEFICIENTES MEDICIÓN BOBINAS
export const COEFICIENTES_BOBINAS = [
    {"cm": 1, "coeficiente": 0.02},
    {"cm": 2, "coeficiente": 0.02},
    {"cm": 3, "coeficiente": 0.02},
    {"cm": 4, "coeficiente": 0.02},
    {"cm": 5, "coeficiente": 0.03},
    {"cm": 6, "coeficiente": 0.03},
    {"cm": 7, "coeficiente": 0.04},
    {"cm": 8, "coeficiente": 0.05},
    {"cm": 9, "coeficiente": 0.05},
    {"cm": 10, "coeficiente": 0.06},
    {"cm": 11, "coeficiente": 0.07},
    {"cm": 12, "coeficiente": 0.08},
    {"cm": 13, "coeficiente": 0.08},
    {"cm": 14, "coeficiente": 0.09},
    {"cm": 15, "coeficiente": 0.10},
    {"cm": 16, "coeficiente": 0.11},
    {"cm": 17, "coeficiente": 0.12},
    {"cm": 18, "coeficiente": 0.14},
    {"cm": 19, "coeficiente": 0.15},
    {"cm": 20, "coeficiente": 0.16},
    {"cm": 21, "coeficiente": 0.17},
    {"cm": 22, "coeficiente": 0.19},
    {"cm": 23, "coeficiente": 0.20},
    {"cm": 24, "coeficiente": 0.21},
    {"cm": 25, "coeficiente": 0.23},
    {"cm": 26, "coeficiente": 0.24},
    {"cm": 27, "coeficiente": 0.26},
    {"cm": 28, "coeficiente": 0.28},
    {"cm": 29, "coeficiente": 0.29},
    {"cm": 30, "coeficiente": 0.31},
    {"cm": 31, "coeficiente": 0.33},
    {"cm": 32, "coeficiente": 0.35},
    {"cm": 33, "coeficiente": 0.37},
    {"cm": 34, "coeficiente": 0.39},
    {"cm": 35, "coeficiente": 0.41},
    {"cm": 36, "coeficiente": 0.43},
    {"cm": 37, "coeficiente": 0.45},
    {"cm": 38, "coeficiente": 0.47},
    {"cm": 39, "coeficiente": 0.49},
    {"cm": 40, "coeficiente": 0.51},
    {"cm": 41, "coeficiente": 0.54},
    {"cm": 42, "coeficiente": 0.56},
    {"cm": 43, "coeficiente": 0.59},
    {"cm": 44, "coeficiente": 0.61},
    {"cm": 45, "coeficiente": 0.64},
    {"cm": 46, "coeficiente": 0.66},
    {"cm": 47, "coeficiente": 0.69},
    {"cm": 48, "coeficiente": 0.71},
    {"cm": 49, "coeficiente": 0.74},
    {"cm": 50, "coeficiente": 0.77},
    {"cm": 51, "coeficiente": 0.80},
    {"cm": 52, "coeficiente": 0.83},
    {"cm": 53, "coeficiente": 0.86},
    {"cm": 54, "coeficiente": 0.89},
    {"cm": 55, "coeficiente": 0.92},
    {"cm": 56, "coeficiente": 0.95},
    {"cm": 57, "coeficiente": 0.98},
    {"cm": 58, "coeficiente": 0.98},
    {"cm": 59, "coeficiente": 0.98},
    {"cm": 60, "coeficiente": 0.98}
];

//GRAMAJES DE BOBINAS
const GRAMAJES = [
    38, 40, 42, 42.5, 45, 48.8, 52, 5, 60, 65, 70, 75
];

//ESTILO MEDICIÓN
const ESTILO_MEDICION = [
    {type: 'total', value: '0.038', gramaje: 42},
    {type: 'util', value: '0.036', gramaje: 42},
    {type: 'total', value: '0.041', gramaje: 45},
    {type: 'util', value: '0.039', gramaje: 45},
];

//PAGINACION VALORES
const PAGINACION = [
    8, 16, 32, 40, 48, 56, 64, 72, 80, 88, 96
];

function calc(num) {
    if (isNaN(num)) {
        //no se dejará en input introducir un valor que no sea number
        // ni mayor de autopasters * 16
        return console.log('no es numero')
    }
    let res = num / 16;
    if (res % 1 === 0) {
        //asignará autopasters según preferencia sin incluir el definido como media
        console.log('Es número entero y resultado es: ' + res);
    } else if (res % 1 === 0.5) {
        //asignará autopasters según preferencia incluyendo el definido como media
        console.log('Es número decimal y resultado es: ' + res);
    }
}