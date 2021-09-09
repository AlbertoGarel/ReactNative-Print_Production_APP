import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Alert} from "react-native";
import {tirada2SVG} from "../../assets/svg/svgContents";
import CustomTextInput from "../FormComponents/CustomTextInput";

const ViewPagerOne = ({stylesContPrinc}) => {

    return (
        <View style={stylesContPrinc}>
            <CustomTextInput
                // _ref={tiradaRef}
                svgData={tirada2SVG}
                svgWidth={50}
                svgHeight={50}
                placeholder={'Número de ejemplares...'}
                text={'Tirada prevista'}
                type={'numeric'}
                _name={'tirada'}
                _onChangeText={handleChange('tirada')}
                _onBlur={handleBlur('tirada')}
                value={values.tirada}
            />
        </View>
    )
}
const styles= StyleSheet.create({

})
export default ViewPagerOne;