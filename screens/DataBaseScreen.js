import React from 'react';
import {View, SafeAreaView} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Meditionstyle from "../drawerScreens/MeditionStyle";
import CoeficienteScreen from "../drawerScreens/CoeficienteScreen";
import PaginationScreen from "../drawerScreens/PaginationScreen";
import InitialDrawerScreen from "../drawerScreens/InitialDrawerScreen";
import {COLORS} from "../assets/defaults/settingStyles";
import HeaderCommonDrawer from "../drawerScreens/commonComponentsDrawer/HeaderCommonDrawer";
import {
    medition_style_table_ALL,
    coeficiente_table_ALL,
    pagination_table_ALL,
    gramaje_table_ALL,
    linea_produccion_table_ALL,
    papel_comun_table_ALL,
    kba_table_ALL,
    autopaster_table_ALL,
    producto_table_ALL,
    bobina_table_ALL,
    produccion_table_ALL
} from "../dbCRUD/actionsSQL";
import {Feather as Icon} from "@expo/vector-icons";


const DataBaseScreen = () => {
    const Drawer = createDrawerNavigator();
    const meditionStyleComponentProps = {
        headerTitle: "Estilo de Medición",
        headerParagraph: "Establece la medición de la bobina incluyendo o no el mandríl o modifica sus valores.",
        textButton: "Nuevo registro",
        requestDB: medition_style_table_ALL,
        disable: false
    };
    const coeficienteComponentProps = {
        headerTitle: "Coeficiente",
        headerParagraph: "Consulta los valores de coeficiente con los que trabaja la aplicación.",
        textButton: "Nuevo registro",
        requestDB: coeficiente_table_ALL,
        disable: true
    };
    const paginationComponentProps = {
        headerTitle: "Paginaciones",
        headerParagraph: "Consulta los valores de Paginación con los que trabaja la aplicación y añade segun tus necesidades.",
        textButton: "Nuevo registro",
        requestDB: pagination_table_ALL,
        disable: false
    };
    const gramajeComponentProps = {
        headerTitle: "Gramaje",
        headerParagraph: "Consulta los valores de gramaje y añade otros valores.",
        textButton: "Nuevo registro",
        requestDB: gramaje_table_ALL,
        disable: false
    };
    const lineaproduccionComponentProps = {
        headerTitle: "Líneas de Producción",
        headerParagraph: "Consulta las líneas de producción y añade las que necesites.",
        textButton: "Nuevo registro",
        requestDB: linea_produccion_table_ALL,
        disable: false
    };
    const papelComunComponentProps = {
        headerTitle: "Propietarios de Bobinas",
        headerParagraph: "Consulta los propietarios de las bobinas y sus productos. Añade tantos como necesites.",
        textButton: "Nuevo registro",
        requestDB: papel_comun_table_ALL,
        disable: false
    };
    const kbaComponentProps = {
        headerTitle: "Coeficientes KBA para Calculos de Producción",
        headerParagraph: "Consulta los coeficientes de cada producto, crea o modifica según necesites.",
        textButton: "Nuevo registro",
        requestDB: kba_table_ALL,
        disable: false
    };
    const autopasterComponentProps = {
        headerTitle: "Autopasters",
        headerParagraph: "Consulta los autopasters, añade o modifica según necesites.",
        textButton: "Nuevo registro",
        requestDB: autopaster_table_ALL,
        disable: false
    };
    const productosComponentProps = {
        headerTitle: "Productos",
        headerParagraph: "Consulta los productos, añade o modifica según necesites.",
        textButton: "Nuevo registro",
        requestDB: producto_table_ALL,
        disable: false
    };
    const bobinasComponentProps = {
        headerTitle: "Bobinas",
        headerParagraph: "Consulta las bobinas registradas en la aplicación.",
        textButton: "Nuevo registro",
        requestDB: bobina_table_ALL,
        disable: true
    };
    const produccionComponentProps = {
        headerTitle: "Producciones abiertas",
        headerParagraph: "Consulta las producciones gesionadas mediante la aplicación.",
        textButton: "Nuevo registro",
        requestDB: produccion_table_ALL,
        disable: true
    };

    const option_edit = {
        drawerIcon: () => <Icon name={'edit-3'} size={15} color={COLORS.primary}/>,
    };

    const option_vis = {
        drawerIcon: () => <Icon name={'eye'} size={15} color={COLORS.primary}/>,
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                <Drawer.Navigator initialRouteName="InitialDrawerScreen"
                                  drawerContentOptions={{
                                      activeTintColor: COLORS.primary,
                                      itemStyle: {marginVertical: 1},
                                  }}
                >
                    <Drawer.Screen options={option_edit} name="InitialDrawerScreen" component={InitialDrawerScreen}/>
                    <Drawer.Screen options={option_edit} name="Estilo de medición"
                                   children={() => <Meditionstyle props={meditionStyleComponentProps}/>}/>
                    <Drawer.Screen options={option_vis} name="Coeficientes"
                                   children={() => <Meditionstyle props={coeficienteComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Paginaciones"
                                   children={() => <Meditionstyle props={paginationComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Gramajes del papel"
                                   children={() => <Meditionstyle props={gramajeComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Líneas de produccion"
                                   children={() => <Meditionstyle props={lineaproduccionComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Propietarios de bobinas"
                                   children={() => <Meditionstyle props={papelComunComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Coeficientes KBA"
                                   children={() => <Meditionstyle props={kbaComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Autopasters"
                                   children={() => <Meditionstyle props={autopasterComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Productos"
                                   children={() => <Meditionstyle props={productosComponentProps}/>}/>
                    <Drawer.Screen options={option_vis} name="Bobinas"
                                   children={() => <Meditionstyle props={bobinasComponentProps}/>}/>
                    <Drawer.Screen options={option_vis} name="Producciones"
                                   children={() => <Meditionstyle props={produccionComponentProps}/>}/>
                </Drawer.Navigator>
            </View>
        </SafeAreaView>
    )
};

export default DataBaseScreen;