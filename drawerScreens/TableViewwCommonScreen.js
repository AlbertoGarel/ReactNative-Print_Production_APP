import React, {useEffect, useState} from 'react';
import {ImageBackground, SafeAreaView, StyleSheet, View} from 'react-native';
import {COLORS} from "../assets/defaults/settingStyles";
import HeaderCommonDrawer from "./commonComponentsDrawer/HeaderCommonDrawer";
import LargeButtonNew from "./commonComponentsDrawer/LargeButtonNew";
import ModalCRUD from "./commonComponentsDrawer/ModalCRUD";
import Tables from "./commonComponentsDrawer/Tables";
import InfoDrawer from "./commonComponentsDrawer/InfoDrawer";
import {useNavigation} from '@react-navigation/native';

const TableViewwCommonScreen = ({props}) => {

    const navigation = useNavigation();

    const [modal, setModal] = useState(false);
    const [typeForm, setTypeForm] = useState('');
    const [openModalInfo, setOpenModalInfo] = useState(false);

    useEffect(() => {
        return navigation.addListener('blur', () => {
            setOpenModalInfo(false);
        });
    })

    function handlerModalInfo() {
        setOpenModalInfo(!openModalInfo)
    };

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
                        handlerModalInfo={handlerModalInfo}
                        info={props.info}
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
                {openModalInfo && <InfoDrawer info={props.info} handlerModalInfo={handlerModalInfo}/>}
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