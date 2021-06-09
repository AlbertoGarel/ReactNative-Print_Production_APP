import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight, Modal, Alert, TouchableOpacity, SafeAreaView} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import {Feather as Icon} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import BgComponent from "../../components/BackgroundComponent/BgComponent";
import {logoNotText, semicircle2} from "../../assets/svg/svgContents";
import {Dimensions} from "react-native";

const ModalCRUD = ({modal, _onPress, header, crud, form, typeForm}) => {

    const warningcolor = ["#4486b365", "#4486b365" , "#fff"];
    const successcolor = ["#ff800065", "#ff800065" , "#fff"];
    const windowHeight = Dimensions.get('window').height;

    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: logoNotText, svgWidth: '100%', svgHeight: '100%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: windowHeight / 4, right: 0, opacity: .4
    };

    return (
        <Modal
            presentationStyle="overFullScreen"
            animationType="slide"
            visible={modal}
            // onShow={() => {
            //     Alert.alert('Modal has been opened.');
            // }}
            onRequestClose={() => {
                _onPress('REFRESHDATATABLE');
            }}
            style={{backgroundColor: 'transparent'}}
        >
            <LinearGradient
                // Background Linear Gradient
                colors={typeForm === 'ACTUALIZAR' ? warningcolor : successcolor}
                style={styles.background}
            />
            <BgComponent
                svgOptions={optionsSVG}
                styleOptions={optionsStyleContSVG}
            />
            <View style={{
                flex: 1,
                // backgroundColor: COLORS.colorSupportfiv + 70,
                borderRadius: 10,
                padding: 20,
            }}>
                {header}
                {
                    form ?
                        form
                        :
                        <Text>NAAAAADDAAAAAAA</Text>
                }
                {/*CLOSE BUTTON*/}
                <TouchableHighlight
                    style={{alignSelf: 'flex-start', position: 'absolute', bottom: 20, left: 20, borderRadius: 10,}}
                    onPress={() => {
                        _onPress('REFRESHDATATABLE');
                    }}>
                    <View style={styles.TouchableHighlightSTYLE}>
                        <Icon name={'arrow-left'} size={25} color={COLORS.whitesmoke}/>
                        <Text style={styles.textStyle}>Volver</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    TouchableHighlightSTYLE: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 10,
        elevation: 3
    },
    textStyle: {
        fontFamily: 'Anton',
        marginLeft: 5,
        color: COLORS.whitesmoke,
        fontSize: 18
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.95
    }
});
export default ModalCRUD;