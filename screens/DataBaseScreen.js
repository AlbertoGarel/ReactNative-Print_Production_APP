import React, {useState} from 'react';
import {View, SafeAreaView, Image, StyleSheet, ScrollView} from 'react-native';
import {
    createDrawerNavigator,
    DrawerItemList,
} from '@react-navigation/drawer';
import TableViewwCommonScreen from "../drawerScreens/TableViewwCommonScreen";
import InitialDrawerScreen from "../drawerScreens/InitialDrawerScreen";
import {COLORS} from "../assets/defaults/settingStyles";
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
    deleteProductoByID, autopasters_prod_data_TABLEALL_AS
} from "../dbCRUD/actionsSQL";
import {Feather as Icon} from "@expo/vector-icons";
import MeditionStyleCrud from "../drawerScreens/CrudComponents/MeditionStyleCrud";
import PaginationCrud from "../drawerScreens/CrudComponents/PaginationCrud";
import GramajeCrud from "../drawerScreens/CrudComponents/GramajeCrud";
import LineasProduccionCrud from "../drawerScreens/CrudComponents/LineasProduccionCrud";
import PropBobinasCrud from "../drawerScreens/CrudComponents/PropBobinasCrud";
import CoeficienteKbaCrud from "../drawerScreens/CrudComponents/CoeficienteKbaCrud";
import AutopastersCrud from "../drawerScreens/CrudComponents/AutopastersCrud";
import ProductosCrud from "../drawerScreens/CrudComponents/ProductosCrud";

const CustomSidebarMenu = (props) => {
    return (
        <ScrollView>
            <SafeAreaView style={{flex: 1, paddingBottom: 30}}>
                <Image
                    style={[styles.image, {backgroundColor: COLORS.white}]}
                    source={require('../assets/images/splash/Logo_AlbertoGarel.png')}
                />
                <DrawerItemList {...props} />
            </SafeAreaView>
        </ScrollView>
    );
};

const DataBaseScreen = ({navigation, setChangeButtonFunc}) => {

    const Drawer = createDrawerNavigator();

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
        info: [
            "Establezca la medición ( por ejamplo: sólo papel útil o desde interior del mandril ) para calcular los kilogramos restantes.",
            "Introduzca un nombre identificativo.",
            "Asigne valor para bobina de ancho completo o entera y media.",
            "Introduzca el gramaje de dicha bobina."
        ]
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
        info: [
            "*No editable.",
            "Incluye radio máximo en centímetros para bobinas de papel más utilizadas."
        ]
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
        info: [
            "Añada tantas paginaciones como necesite.",
            "8, 16, 24, 32, etc."
        ]
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
        headerTitle: "Coeficientes para Calculos total de Producción",
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
        info: [
            '*Defina de manera obligatoria un autopaster como "½ bobina" si prevé usarla en algún momento',
            'Enumere e introduzca todos los autopasters por cada línea de impresión.',
            'En el campo "nombre" solo dígitos serán admitidos.',
            'Las numeraciones asignadas serán de manera individual por autopaster. No se podrá repetir en otras líneas de producción. ',
            'Por ejemplo, si tenemos dos líneas con cuatro unidades cada una, empezaríamos usando la cifra " 1 " y acabaríamos por la cifra " 8 ".'
        ]
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
        getTypeFormForHeader: getTypeFormForHeader
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
        colorTextRow: '#FF0000'
    };
    const produccionComponentProps = {
        headerTitle: "Producciones abiertas",
        headerParagraph: "Consulta las producciones gestionadas mediante la aplicación.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: produccion_table_ALL,
            deleteItem: ''
        },
        disable: true,
        info: [
            "*No editable.",
            "Puede ver una relación de las producciones abiertas en ese momento.",
            "Al finalizar una producción se eliminará de la tabla."
        ]
    };
    const bobinasProduccionComponentProps = {
        headerTitle: "bobinas en Producciones abiertas",
        headerParagraph: "Listado de bobinas en producciones activas.",
        textButton: "Nuevo registro",
        requestDB: {
            allItems: autopasters_prod_data_TABLEALL_AS,
            deleteItem: ''
        },
        disable: true,
        info: [
            "*No editable.",
            "Puede ver una relación de bobinas que serán incluidas en las distintas producciones abiertas en ese momento.",
            "Al finalizar una producción se eliminará de la tabla."
        ]
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
                                  drawerContent={(props) => <CustomSidebarMenu {...props} />}
                >
                    <Drawer.Screen options={option_edit} name="InitialDrawerScreen" component={InitialDrawerScreen}/>
                    <Drawer.Screen options={option_vis} name="Coeficientes"
                                   children={() => <TableViewwCommonScreen props={coeficienteComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Paginaciones"
                                   children={() => <TableViewwCommonScreen props={paginationComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Gramajes del papel"
                                   children={() => <TableViewwCommonScreen props={gramajeComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Estilo de medición"
                                   children={() => <TableViewwCommonScreen props={meditionStyleComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Propietarios de bobinas"
                                   children={() => <TableViewwCommonScreen props={papelComunComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Coef. cálculo de restos"
                                   children={() => <TableViewwCommonScreen props={kbaComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Líneas de produccion"
                                   children={() => <TableViewwCommonScreen props={lineaproduccionComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Autopasters"
                                   children={() => <TableViewwCommonScreen props={autopasterComponentProps}/>}/>
                    <Drawer.Screen options={option_edit} name="Productos"
                                   children={() => <TableViewwCommonScreen props={productosComponentProps}/>}/>
                    <Drawer.Screen options={option_vis} name="Bobinas"
                                   children={() => <TableViewwCommonScreen props={bobinasComponentProps}/>}/>
                    <Drawer.Screen options={option_vis} name="Producciones"
                                   children={() => <TableViewwCommonScreen props={produccionComponentProps}/>}/>
                    <Drawer.Screen options={option_vis} name="Bobinas en producciones"
                                   children={() => <TableViewwCommonScreen props={bobinasProduccionComponentProps}/>}/>
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