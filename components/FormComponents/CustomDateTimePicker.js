import React, {useState} from 'react';
import {View, Alert, Button, Platform, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import CustomTextInput from "./CustomTextInput";
import {addDateSVG, tirada2SVG} from "../../assets/svg/svgContents";
import {COLORS} from "../../assets/defaults/settingStyles";
import SvgComponent from "../SvgComponent";

const CustomDateTimePicker = ({
                                  text,
                                  modeType,
                                  styleOptions,
                                  svgData,
                                  svgWidth,
                                  svgHeight,
                                  _name,
                                  _onChangeText,
                                  _onBlur,
                                  placeholder,
                                  _ref,
                                  _value,
                                  getSelectedDate
                              }) => {

    const [selectedDateState, setSelectedDateState] = useState('');
    const [calendarVisible, setCalendarVisible] = useState(false);

    const dateNow = () => {
        let now = new Date();
        let _year = now.getFullYear();
        let _month = now.getMonth() + 1;
        let comleteMonth = _month.length > 1 ? _month : `0${_month}`;
        let _day = now.getDate();
        let comleteDay = _day.length > 1 ? _day : `0${_day}`;

        return `${_year}-${comleteMonth}-${comleteDay}`
    };

    return (
        <View>
            <View style={styles.contInput}>
                <TouchableOpacity onPress={() => setCalendarVisible(true)} style={styles.contButton}>
                    <SvgComponent
                        svgData={svgData}
                        svgWidth={svgWidth}
                        svgHeight={svgHeight}
                    />
                </TouchableOpacity>
                <Text style={{fontFamily: 'Anton'}}>{text}</Text>
                <TextInput style={styles.input}
                           ref={_ref}
                           key={_name}
                           editable={false}
                           placeholder={placeholder}
                           defaultValue={selectedDateState}
                           value={selectedDateState}
                />
            </View>
            {calendarVisible && <DatePicker
                current={dateNow()}
                name={_name}
                options={styleOptions}
                onSelectedChange={date => {
                    setSelectedDateState(date);
                    getSelectedDate(date);
                    setTimeout(() => {
                        setCalendarVisible(false)
                    }, 500)
                }}
                mode={modeType}
            />
            }
        </View>
    );
};
const styles = StyleSheet.create({
    parent: {
        borderWidth: 2,
        borderColor: 'red'
    },
    contInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: .5,
        borderColor: COLORS.black,
        height: 60,
        borderRadius: 5,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10
    },
    input: {
        flex: 1,
        paddingLeft: 20
    },
    contButton: {
        display: 'flex',
        justifyContent: 'center',
        padding: 10,
        margin: 5,
        elevation: 5,
        borderRadius: 5,
        resizeMode: 'stretch',
        alignItems: 'center',
        backgroundColor: COLORS.primary
    }
});
export default CustomDateTimePicker;