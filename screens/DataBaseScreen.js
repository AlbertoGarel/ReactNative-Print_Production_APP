import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, Image, StyleSheet, Text} from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import TableViewwCommonScreen from "../drawerScreens/TableViewwCommonScreen";
import CoeficienteScreen from "../drawerScreens/CoeficienteScreen";
import PaginationScreen from "../drawerScreens/PaginationScreen";
import InitialDrawerScreen from "../drawerScreens/InitialDrawerScreen";
import {COLORS} from "../assets/defaults/settingStyles";
import HeaderCommonDrawer from "../drawerScreens/commonComponentsDrawer/HeaderCommonDrawer";
import {
    medition_style_table_ALL,
    deleteMeditionStyle,
    coeficiente_table_ALL,
    pagination_table_ALL,
    gramaje_table_ALL,
    linea_produccion_table_ALL,
    papel_comun_table_ALL,
    kba_table_ALL,
    autopaster_table_ALL,
    producto_table_ALL,
    bobina_table_ALL,
    produccion_table_ALL,
    picker_gramaje,
    deletePaginationByID,
    deleteGramajeByID,
    deleteLinProdByID,
    deletePapelComunByID,
    deleteKbaByID,
    deleteAutopasterByID,
    deleteProductoByID
} from "../dbCRUD/actionsSQL";
import {Feather as Icon} from "@expo/vector-icons";
import MeditionStyleCrud from "../drawerScreens/CrudComponents/MeditionStyleCrud";
import {useIsFocused} from "@react-navigation/native";
import {
    NavigationContainer,
    // useFocusEffect,
} from '@react-navigation/native';
import PaginationCrud from "../drawerScreens/CrudComponents/PaginationCrud";
import GramajeCrud from "../drawerScreens/CrudComponents/GramajeCrud";
import LineasProduccionCrud from "../drawerScreens/CrudComponents/LineasProduccionCrud";
import PropBobinasCrud from "../drawerScreens/CrudComponents/PropBobinasCrud";
import CoeficienteKbaCrud from "../drawerScreens/CrudComponents/CoeficienteKbaCrud";
import AutopastersCrud from "../drawerScreens/CrudComponents/AutopastersCrud";
import ProductosCrud from "../drawerScreens/CrudComponents/ProductosCrud";

const DataBaseScreen = ({navigation}) => {
    const Drawer = createDrawerNavigator();
    const isFocused = useIsFocused();
    useEffect(() => {

    }, [isFocused]);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         alert('Screen was focused');
    //         return () => {
    //             alert('Screen was unfocused');
    //         };
    //     }, [])
    // );

    const [typeform, setTypeForm] = useState('');
    const [registerID, getRegisterID] = useState('');

    const getTypeFormForHeader = (param, id) => {
        setTypeForm(param);
        getRegisterID(id);
    };

    const meditionStyleComponentProps = {
        headerTitle: "Estilo de Medición",
        headerParagraph: "Establece la medición de la bobina incluyendo o no el mandríl o modifica sus valores.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: medition_style_table_ALL,
            deleteItem: deleteMeditionStyle
        },
        form: <MeditionStyleCrud props={{typeform, registerID}}/>,
        typeform: typeform,
        disable: false,
        getTypeFormForHeader: getTypeFormForHeader,
    };
    const coeficienteComponentProps = {
        headerTitle: "Coeficiente",
        headerParagraph: "Consulta los valores de coeficiente con los que trabaja la aplicación.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: coeficiente_table_ALL,
            deleteItem: ''
        },
        disable: true,
        crud: {
            create: picker_gramaje,
            delete: 'borrar',
            update: 'actualizar'
        },
        form: <MeditionStyleCrud/>,
    };
    const paginationComponentProps = {
        headerTitle: "Paginaciones",
        headerParagraph: "Consulta los valores de Paginación con los que trabaja la aplicación y añade segun tus necesidades.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: pagination_table_ALL,
            deleteItem: deletePaginationByID
        },
        form: <PaginationCrud props={{typeform, registerID}}/>,
        typeform: typeform,
        disable: false,
        getTypeFormForHeader: getTypeFormForHeader,
    };
    const gramajeComponentProps = {
        headerTitle: "Gramaje",
        headerParagraph: "Consulta los valores de gramaje y añade otros valores.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: gramaje_table_ALL,
            deleteItem: deleteGramajeByID
        },
        form: <GramajeCrud props={{typeform, registerID}}/>,
        typeform: typeform,
        disable: false,
        getTypeFormForHeader: getTypeFormForHeader,
    };
    const lineaproduccionComponentProps = {
        headerTitle: "Líneas de Producción",
        headerParagraph: "Consulta las líneas de producción y añade las que necesites.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: linea_produccion_table_ALL,
            deleteItem: deleteLinProdByID
        },
        form: <LineasProduccionCrud props={{typeform, registerID}}/>,
        typeform: typeform,
        disable: false,
        getTypeFormForHeader: getTypeFormForHeader,
    };
    const papelComunComponentProps = {
        headerTitle: "Propietarios de Bobinas",
        headerParagraph: "Consulta los propietarios de las bobinas y sus productos. Añade tantos como necesites.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: papel_comun_table_ALL,
            deleteItem: deletePapelComunByID
        },
        form: <PropBobinasCrud props={{typeform, registerID}}/>,
        typeform: typeform,
        disable: false,
        getTypeFormForHeader: getTypeFormForHeader,
    };
    const kbaComponentProps = {
        headerTitle: "Coeficientes KBA para Calculos de Producción",
        headerParagraph: "Consulta los coeficientes de cada producto, crea o modifica según necesites.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: kba_table_ALL,
            deleteItem: deleteKbaByID
        },
        form: <CoeficienteKbaCrud props={{typeform, registerID}}/>,
        disable: false,
        getTypeFormForHeader: getTypeFormForHeader,
    };
    const autopasterComponentProps = {
        headerTitle: "Autopasters",
        headerParagraph: "Consulta los autopasters, añade o modifica según necesites.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: autopaster_table_ALL,
            deleteItem: deleteAutopasterByID
        },
        form: <AutopastersCrud props={{typeform, registerID}}/>,
        disable: false,
        getTypeFormForHeader: getTypeFormForHeader,
    };
    const productosComponentProps = {
        headerTitle: "Productos",
        headerParagraph: "Consulta los productos, añade o modifica según necesites.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: producto_table_ALL,
            deleteItem: deleteProductoByID
        },
        form: <ProductosCrud props={{typeform, registerID}}/>,
        disable: false,
        getTypeFormForHeader: getTypeFormForHeader,
    };
    const bobinasComponentProps = {
        headerTitle: "Bobinas",
        headerParagraph: "Consulta las bobinas registradas en la aplicación.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: bobina_table_ALL,
            deleteItem: ''
        },
        disable: true,
    };
    const produccionComponentProps = {
        headerTitle: "Producciones abiertas",
        headerParagraph: "Consulta las producciones gesionadas mediante la aplicación.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: produccion_table_ALL,
            deleteItem: ''
        },
        disable: true,
    };

    const option_edit = {
        drawerIcon: () => <Icon name={'edit-3'} size={15} color={COLORS.primary}/>,
    };

    const option_vis = {
        drawerIcon: () => <Icon name={'eye'} size={15} color={COLORS.primary}/>,
    };

    const CustomSidebarMenu = (props) => {
        return (
            <SafeAreaView style={{flex: 1}}>
                <Image
                    style={[styles.image, {backgroundColor: COLORS.white}]}
                    source={require('../assets/images/splash/Logo_AlbertoGarel.png')}
                />
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            </SafeAreaView>
        );
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                <Drawer.Navigator initialRouteName="InitialDrawerScreen"
                                  drawerContentOptions={{
                                      activeTintColor: COLORS.primary,
                                      itemStyle: {marginVertical: 1},
                                  }}
                                  drawerContent={(props) => <CustomSidebarMenu {...props} />}
                >
                    <Drawer.Screen options={option_edit} name="InitialDrawerScreen" component={InitialDrawerScreen}/>
                    <Drawer.Screen options={option_edit} name="Estilo de medición"
                                   children={() => <TableViewwCommonScreen props={meditionStyleComponentProps}/>}/>
                    <Drawer.Screen options={option_vis} name="Coeficientes"
                                   children={() => <TableViewwCommonScreen props={coeficienteComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Paginaciones"
                                   children={() => <TableViewwCommonScreen props={paginationComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Gramajes del papel"
                                   children={() => <TableViewwCommonScreen props={gramajeComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Líneas de produccion"
                                   children={() => <TableViewwCommonScreen props={lineaproduccionComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Propietarios de bobinas"
                                   children={() => <TableViewwCommonScreen props={papelComunComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Coeficientes KBA"
                                   children={() => <TableViewwCommonScreen props={kbaComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Autopasters"
                                   children={() => <TableViewwCommonScreen props={autopasterComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Productos"
                                   children={() => <TableViewwCommonScreen props={productosComponentProps}/>}/>
                    <Drawer.Screen options={option_vis} name="Bobinas"
                                   children={() => <TableViewwCommonScreen props={bobinasComponentProps}/>}/>
                    <Drawer.Screen options={option_vis} name="Producciones"
                                   children={() => <TableViewwCommonScreen props={produccionComponentProps}/>}/>
                </Drawer.Navigator>
            </View>
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    image: {
        marginTop: 20,
        resizeMode: 'center',
        width: 80,
        height: 80,
        alignSelf: 'center',
    }
});
export default DataBaseScreen;