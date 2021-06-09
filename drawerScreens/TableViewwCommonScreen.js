import React, {useState} from 'react';
import {SafeAreaView, View, StyleSheet, ImageBackground, Modal} from 'react-native';
import {COLORS} from "../assets/defaults/settingStyles";
import HeaderCommonDrawer from "./commonComponentsDrawer/HeaderCommonDrawer";
import LargeButtonNew from "./commonComponentsDrawer/LargeButtonNew";
import ModalCRUD from "./commonComponentsDrawer/ModalCRUD";
import Tables from "./commonComponentsDrawer/Tables";
import {LinearGradient} from "expo-linear-gradient";

const TableViewwCommonScreen = ({props}) => {

    const [modal, setModal] = useState(false);
    const [typeForm, setTypeForm] = useState('');

    const _onPress = (param, id = 0) => {
        setTypeForm(param);
        props.getTypeFormForHeader(param, id)
        if (!modal) {
            setModal(true)
        } else {
            setModal(false)
        }
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
            <ImageBackground source={require('../assets/images/orangegradient.jpg')} style={styles.image}>
                <View style={styles.parent}>
                    <HeaderCommonDrawer
                        headerTitle={props.headerTitle}
                        headerParagraph={props.headerParagraph}
                    />
                    <LargeButtonNew
                        textButton={props.textButton}
                        _onPress={_onPress}
                        disable={props.disable}
                    />
                    <Tables
                        request={props.requestDB}
                        _onPress={_onPress}
                        modal={modal}
                        disable={props.disable}
                        typeform={props.typeform}
                        // deleteByID={deleteByID}
                    />
                </View>
                <ModalCRUD
                    modal={modal}
                    _onPress={_onPress}
                    header={<HeaderCommonDrawer headerTitle={props.headerTitle}/>}
                    form={props.form}
                    typeForm={typeForm}
                />
            </ImageBackground>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    parent: {
        paddingTop: 0,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,

    },
    image: {
        flex: 1,
        resizeMode: 'cover',
    },
});

export default TableViewwCommonScreen;