import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import SvgComponent from "../SvgComponent";
import {deleteAll} from "../../assets/svg/svgContents";
import PropTypes from 'prop-types';

const ResetButtonForm = ({resetState_elementPrevProdction, _style}) => {

    return (
        <TouchableOpacity style={[styles.touchable, _style ? {..._style} : null]}
                          onPress={resetState_elementPrevProdction}
        >
            <View style={styles.contSVG}>
                <SvgComponent
                    svgData={deleteAll}
                    svgWidth={20}
                    svgHeight={20}
                />
            </View>
            <View style={styles.contText}>
                <Text style={styles.textButton}>Limpiar entradas</Text>
            </View>
        </TouchableOpacity>
    )
};
const styles = StyleSheet.create({
    touchable: {
        // position: 'absolute',
        bottom: 50,
        right: 5,
        borderRadius: 10,
        width: '50%',
        height: 40,
        backgroundColor: COLORS.whitesmoke,
        borderWidth: 2,
        borderColor: COLORS.whitesmoke,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 70,
        shadowColor: COLORS.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 12,
    },
    contSVG: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
    },
    contText: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.whitesmoke,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    textButton: {
        color: COLORS.secondary,
        fontSize: 13,
        textTransform: 'uppercase'
    }
});

ResetButtonForm.propTypes = {
    resetState_elementPrevProdction: PropTypes.func,
    _style: PropTypes.object,
};

export default ResetButtonForm;