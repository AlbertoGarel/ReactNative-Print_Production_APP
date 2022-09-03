import React, {useState, useCallback} from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions, Alert, Text
} from 'react-native';
import {COLORS} from '../assets/defaults/settingStyles';
import HomeCard from "../components/HomeCard";
import BgComponent from "../components/BackgroundComponent/BgComponent";
import {
    barcharFontistotSVG,
    calculatorFontistoSVG,
    fileFontistoSVG,
    listFontistoSVG,
    semicircle2
} from "../assets/svg/svgContents";
import HomeHeader from "../components/headers/HomeHeader";
import Caroussel from "../components/Caroussel";
import {produccion_table_ALL} from "../dbCRUD/actionsSQL";
import {useFocusEffect} from "@react-navigation/native";
import {genericDeleteFunction, genericTransaction} from "../dbCRUD/actionsFunctionsCrud";
import {Sentry_Alert} from "../utils";

const {width, height} = Dimensions.get('window');
const square = height / 3
const HomeScreen = ({navigation}) => {
    //ICON SIZE
    const iconSize = height / 20;
    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: semicircle2, svgWidth: '120%', svgHeight: '110%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: 0, right: 0
    };
    const [isFocus, setIsFocus] = useState(false);
    const [productions, getProductions] = useState([]);
    const [spinnerSelected, setSpinnerSelected] = useState({item: null, spin: false});

    useFocusEffect(
        useCallback(() => {
            setIsFocus(true);
            //Production
            genericTransaction(produccion_table_ALL, [])
                .then(response => getProductions(response))
                .catch(err => Sentry_Alert('HomeScreen.js', 'produccion_table_ALL', err))
            return () => {
                handlerSpinner(false, null)
                setIsFocus(false);
            };
        }, [isFocus])
    );

    function handlerSpinner(param, item) {
        setSpinnerSelected({item: item, spin: param});
    }

    async function actionDeleteProduction(data) {
        try {
            const deleteRollsOnThisProd = await genericDeleteFunction('DELETE from autopasters_prod_data where production_fk = ?', [data.id])
            if (!deleteRollsOnThisProd.rowsAffected) throw new Error('deleteError');
            const thisProdDelete = await genericDeleteFunction(`DELETE FROM produccion_table WHERE produccion_id = ?;`, [data.id]);
            if (!thisProdDelete.rowsAffected) throw new Error('deleteError');
            const productions = await genericTransaction(produccion_table_ALL, [])
            getProductions(productions)
        } catch (err) {
            if (err === 'deleteError') {
                alert('Error al eliminar producción.')
            } else {
                alert('Error en base de datos.')
            }
            Sentry_Alert('HomeScreen.js', 'func - actionDeleteProduction', err)
        }
    }

    function deleteProduction(data) {
        Alert.alert(
            `ELIMINAR PRODUCCIÓN ${data['producto']} / pag: ${data['Paginacion']}`,
            `¿Desea eliminar esta produción?`,
            [{
                text: 'Cancelar',
                onPress: () => alert('acción cancelada.'),
                style: 'cancel',
            },
                {
                    text: 'OK', onPress: async () => {
                        await actionDeleteProduction(data);
                    }
                }]
        )
    }

    return (
        <SafeAreaView style={{flex: 1, paddingBottom: height > 500 ? 20 : 0}}>
            <BgComponent
                svgOptions={optionsSVG}
                styleOptions={optionsStyleContSVG}
            />
            <HomeHeader
                textprops={{color: COLORS.white}}
                imageBg={COLORS.white}
                titleColor={COLORS.white}
                titleSecction={"#HOME"}
                text={'Acceso a las herramientas para producción de la aplicación: producción simple (sin apoyo de base de datos), producción completa, herramientas de cálculo, etc.'}
            />
            <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                <Caroussel
                    items={productions}
                    deleteProduction={deleteProduction}
                    spinnerSelected={spinnerSelected}
                    handlerSpinner={handlerSpinner}
                />
                {productions.length > 0 && <Text style={{
                    textAlign: 'center',
                    fontFamily: 'Anton',
                    color: COLORS.white,
                    fontSize: 14,
                    textTransform: 'uppercase',
                    textShadowColor: COLORS.black,
                    textShadowOffset: {width: 2, height: 2},
                    textShadowRadius: 1
                }}>mantener pulsado para eliminar</Text>
                }
                <View style={{
                    maxWidth: square,
                    maxHeight: square,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 0,
                    backgroundColor: 'transparent',
                }}>
                    <View style={styles.subcont}>
                        <HomeCard
                            iconName={calculatorFontistoSVG}
                            iconSize={iconSize}
                            iconColor={COLORS.quinary}
                            cardtitle={"Cálculo individual"}
                            title="Go to Onboard"
                            navigation={navigation}
                            torender={["Cálculo Individual"]}
                        />
                    </View>
                    <View style={styles.subcont}>
                        <HomeCard
                            iconName={listFontistoSVG}
                            iconSize={iconSize}
                            iconColor={COLORS.quinary}
                            cardtitle={"producción simple"}
                            content={"Calcula el resto final de la bobina según su radio o kg necesarios según los ejemplares."}
                            title="Go to Onboard"
                            navigation={navigation}
                            torender={['Producción Simplificada']}
                        />
                    </View>
                    <View style={styles.subcont}>
                        <HomeCard
                            iconName={barcharFontistotSVG}
                            iconSize={iconSize}
                            iconColor={COLORS.quinary}
                            cardtitle={"Gráficas"}
                            title="Go to Onboard"
                            navigation={navigation}
                            torender={['charts']}
                        />
                    </View>
                    <View style={styles.subcont}>
                        <HomeCard
                            iconName={fileFontistoSVG}
                            iconSize={iconSize}
                            iconColor={COLORS.quinary}
                            cardtitle={"Documentos"}
                            title="Go to Onboard"
                            navigation={navigation}
                            torender={['pdf documents']}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'flex-start'
    },
    buttons: {
        backgroundColor: 'red',
    },
    touchable: {
        backgroundColor: COLORS.white,
        marginTop: 5,
        marginBottom: 5,
        padding: 5
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 12,
    },
    subcont: {
        width: '50%',
        height: '50%',
        backgroundColor: 'transparent',
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
export default HomeScreen;
