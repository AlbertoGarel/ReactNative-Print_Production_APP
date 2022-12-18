import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, TouchableOpacity, Modal, Dimensions} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import {COLORS, shadowPlatform} from "../../assets/defaults/settingStyles";
import SvgComponent from "../SvgComponent";
import {formatDateYYMMDD} from "../../utils";
import PropTypes from 'prop-types';
import BgComponent from "../BackgroundComponent/BgComponent";

const date = formatDateYYMMDD();
const {width} = Dimensions.get('window');

const CustomDateTimePicker = ({
                                  text,
                                  modeType,
                                  styleOptions,
                                  svgData,
                                  svgWidth,
                                  svgHeight,
                                  _name,
                                  placeholder,
                                  _ref,
                                  _value,
                                  getSelectedDate,
                              }) => {

    const [calendarVisible, setCalendarVisible] = useState(false);

    return (
        <View>
            <View style={styles.contInput}>
                <TouchableOpacity onPress={() => setCalendarVisible(!calendarVisible)} style={styles.contButton}>
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
                           defaultValue={_value}
                           value={_value}
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={calendarVisible}
            >
                <View style={styles.centered}>
                    <View style={styles.wrap}>
                        <DatePicker
                            current={date}
                            selected={date}
                            name={_name}
                            options={styleOptions}
                            onDateChange={date => {
                                getSelectedDate(date);
                                setTimeout(() => {
                                    setCalendarVisible(!calendarVisible)
                                }, 500);
                            }}
                            mode={modeType}
                            style={{borderRadius: 10, ...shadowPlatform, borderWidth: 1, borderColor: '#b2b2b2'}}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
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
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    wrap: {
        width: width - 100,
        justifyContent: 'center',
    }
});

CustomDateTimePicker.propTypes = {
    text: PropTypes.string.isRequired,
    modeType: PropTypes.string.isRequired,
    styleOptions: PropTypes.object.isRequired,
    svgData: PropTypes.any.isRequired,
    svgWidth: PropTypes.number.isRequired,
    svgHeight: PropTypes.number.isRequired,
    _name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    _ref: PropTypes.object.isRequired,
    _value: PropTypes.string.isRequired,
    getSelectedDate: PropTypes.func.isRequired,
};

export default CustomDateTimePicker;