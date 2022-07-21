import React from 'react';
import {StyleSheet, SafeAreaView, View, Text, SectionList, Dimensions, ActivityIndicator} from "react-native";
import {COLORS} from "../assets/defaults/settingStyles";
import {semicircle2} from "../assets/svg/svgContents";
import BgComponent from "../components/BackgroundComponent/BgComponent";
import HomeHeader from "../components/headers/HomeHeader";
import Constants from 'expo-constants';
import BarcodesTypeSelection from "../components/BarcodesTypeSelection";
import UserDataComponent from "../components/UserDataComponent";
import ToastMesages from "../components/ToastMessages";
import NullCopiesComponent from "../components/NullCopiesComponent";
import ExportImportComponent from "../components/ExportImportComponent";

//BACKGROUND PROP CONST
const optionsSVG = {
    svgData: semicircle2, svgWidth: '120%', svgHeight: '110%'
};

const optionsStyleContSVG = {
    width: '100%', height: '100%', top: 0, right: 0
};

const SettingsScreen = ({navigation, setChangeButtonFunc}) => {

    const windowWidth = Dimensions.get('window').width;

    let toastRef;
    const showToast = (message) => {
        toastRef.show(message);
    };

    const dataProps = {
            swicthparent: {
                swicthparent: {
                    flex: 1,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: windowWidth / 2.5,
                }
            },
            showToast: {
                showToast
            }
        }
    ;

    const DATA = [
        {
            title: 'Datos de encabezado PDF',
            data: [<UserDataComponent props={dataProps.showToast}/>],
        },
        {
            title: 'descarte de ejemplares',
            data: [<NullCopiesComponent props={dataProps.showToast}/>],
        },
        {
            title: '\"codebars\" habilitados',
            data: [<BarcodesTypeSelection props={dataProps.swicthparent}/>],
        },
        {
            title: 'importar y exportar',
            data: [<ExportImportComponent props={dataProps.showToast}/>],
        },
    ];

    const Item = ({title}) => (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
            <BgComponent
                svgOptions={optionsSVG}
                styleOptions={optionsStyleContSVG}
            />
            <HomeHeader
                textprops={{color: COLORS.white, marginTop: 15}}
                imageBg={COLORS.white}
                titleColor={COLORS.white}
                titleSecction={"Configuación & opciones:"}
                text={'Establece "codebars" activos, datos de encabezado, importar y exportar bases de datos de otros usuarios y más.'}
            />
            <SectionList
                vertical
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => <Item title={item}/>}
                ListFooterComponent={() => <View style={{paddingVertical: 20}}/>}
                renderSectionHeader={({section: {title}}) => <Text style={styles.header}>{title}</Text>}
                ListEmptyComponent={() => <ActivityIndicator size="large" color={COLORS.buttonEdit}/>}
            />
            <ToastMesages
                _ref={(toast) => toastRef = toast}
                _style={{backgroundColor: COLORS.whitesmoke, borderWidth: 10, borderColor: COLORS.primary}}
                _position='bottom'
                _positionValue={400}
                _fadeInDuration={150}
                _fadeOutDuration={3000}
                _opacity={0.8}
                _textStyle={{color: '#000', fontFamily: 'Anton'}}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        marginHorizontal: 16,
    },
    item: {
        margin: 10,
        marginVertical: 8,
    },
    header: {
        fontSize: 18,
        color: COLORS.whitesmoke,
        textAlign: 'left',
        textTransform: 'uppercase',
        fontFamily: 'Anton',
        paddingLeft: 20,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
        backgroundColor: '#00000035',
        borderRadius: 5
    },
    title: {
        fontFamily: 'Anton',
        color: COLORS.black
    },
});

export default SettingsScreen;
