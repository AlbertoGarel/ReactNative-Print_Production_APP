import React, {forwardRef} from 'react';
import {COLORS} from "../../assets/defaults/settingStyles";
import {Picker} from '@react-native-picker/picker';

const CustomPicker = (props, ref) => {

    return (
            <Picker
                ref={ref}
                {...props}
            >
                {/*<Picker.Item label={*/}
                {/*    props.defaultItemLabel ? props.defaultItemLabel : null*/}
                {/*} value={null}*/}
                {/*             selected*/}
                {/*             fontFamily={'Anton'}*/}
                {/*             color={props.defaultlabelcolor ? props.defaultlabelcolor : COLORS.primary}*/}
                {/*/>*/}
                {props.defaultItemLabel && <Picker.Item label={props.defaultItemLabel} value={null}
                                                        selected
                                                        fontFamily={'Anton'}
                                                        color={props.defaultlabelcolor ? props.defaultlabelcolor : COLORS.primary}
                />}
                {
                    props.dataOptionsPicker.length > 0 ?
                        // props.dataOptionsPicker.map((item, index) => {
                        //     return <Picker.Item key={index}
                        //                         label={'medición ' + item.medition_type + ' / ' + item.gramaje_value + 'g.'}
                        //                         value={item.medition_id}/>
                        // })
                        props.dataOptionsPicker
                        :
                        <Picker.Item label={"No existen datos"} value={null}/>
                }
            </Picker>
        )
};
export default forwardRef(CustomPicker)