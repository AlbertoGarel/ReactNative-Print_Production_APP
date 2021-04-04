import React, {useState} from 'react';
import {SafeAreaView, View, StyleSheet, Text, TouchableHighlight, Alert, ImageBackground} from 'react-native';
import * as SQLite from 'expo-sqlite';
import HRtag from "../components/HRtag";
import {COLORS} from "../assets/defaults/settingStyles";
import HeaderCommonDrawer from "./commonComponentsDrawer/HeaderCommonDrawer";
import LargeButtonNew from "./commonComponentsDrawer/LargeButtonNew";
import Tables from "./commonComponentsDrawer/Tables";
import PaginationScreen from "./PaginationScreen";
import {
    medition_style_table_ALL
} from '../dbCRUD/actionsSQL';

const Meditionstyle = ({props}) => {

    const [modal, setModal] = useState(false)

    const _onPress = () => {
        // Alert.alert('pressed')
        if (!modal) {
            setModal(true)
        } else {
            setModal(false)
        }
    }

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
                    />
                </View>
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
})
export default Meditionstyle;