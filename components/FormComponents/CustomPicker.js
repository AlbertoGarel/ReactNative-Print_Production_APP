import React, {forwardRef} from 'react';
import {COLORS} from "../../assets/defaults/settingStyles";
import {Picker} from '@react-native-picker/picker';

const CustomPicker = (props, ref) => {

    return (
        <Picker
            ref={ref}
            {...props}
        >
            {props.defaultItemLabel && <Picker.Item label={props.defaultItemLabel} value={null}
                                                    selected
                                                    fontFamily={'Anton'}
                                                    color={props.defaultlabelcolor ? props.defaultlabelcolor : COLORS.primary}
            />}
            {
                props.dataOptionsPicker.length > 0 ?
                    props.dataOptionsPicker
                    :
                    <Picker.Item label={"No existen datos"} value={null}/>
            }
        </Picker>
    )
};
export default forwardRef(CustomPicker);