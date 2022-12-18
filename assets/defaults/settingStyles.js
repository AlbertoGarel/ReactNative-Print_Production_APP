import {Platform} from 'react-native';
/*
* boxShadow Ios or Android
* */
const shadowPlatform =
    Platform.OS === 'ios' ?
        {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
        }
        :
        {elevation: 9}


/*
*  DEFAULT VALUES FOR STYLES AND OTHERS
* */
const COLORS = {
    white: '#FFFFFF',
    whitesmoke: '#f5f5f5',
    black: "#000000",
    // primary: "#313485",
    // primary: "#778bb3",
    primary: "#FF8000",
    // secondary: "#FFFFFF",
    secondary: "#F85F23",
    // tertiary: "#f2b332",
    tertiary: "#F2441B40",
    // quaternary: "#fe8081",
    quaternary: "#ec7c26",
    // quinary: "#4C4FA1",
    quinary: "#FA6D28",
    supportBackg1: 'rgba(242,68,27,.95)',
    background_primary: "#ffa031",
    background_secondary: "#d96100",
    background_tertiary: "#85315e",
    colorSupportprim: "#e66b00",
    colorSupportsec: "#f27600",
    colorSupportter: "#ff8a16",
    colorSupportfor: "#ff9524",
    colorSupportfiv: "#ff7514",
    contrastprim: "#00beff",
    contrastsec: "#83b5d9",
    contraster: "#afabb4",
    sliderBackground: "rgba(255, 255, 255, 0.92)",
    sliderComptenty: "#FF5000",
    hrtag: "#000",
    buttonEdit: '#73AFDB',
    success: "#5e8531",
    failed: "#853134",
    warning: "#e78c12",
    info: "#6594c1",
    dimgrey: '#696969'
}
const GRADIENT_COLORS = {
    primary: ["#FFF", "#BBDFF8"]
}

// (7.0 pulgadas): 600
const minWidthScreenTablet = 600;

export {
    COLORS,
    GRADIENT_COLORS,
    shadowPlatform,
    minWidthScreenTablet
};
