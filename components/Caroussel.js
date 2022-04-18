import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {COLORS} from "../assets/defaults/settingStyles";
import {useNavigation} from '@react-navigation/native';
import {callToSetData, formatDateYYMMDD, groupedAutopasters, kilosByAutopasterCalc} from "../utils";
import {genericTransaction} from "../dbCRUD/actionsFunctionsCrud";
import {autopasters_prod_table_by_production, picker_coeficiente} from "../dbCRUD/actionsSQL";

const dataProductSelected =
    `SELECT a.linea_id, a.linea_name,b.medition_id, b.full_value, b.media_value, c.paginacion_value, d.producto_id, d.producto_name,
    f.kba_value, g.gramaje_value, g.gramaje_id, h.papel_comun_name, h.papel_comun_id, e.produccion_id, e.editions, e.tirada, e.nulls, e.fecha_produccion, b.full_value, b.media_value
    FROM linea_produccion_table a, medition_style_table b, paginacion_table c, producto_table d, kba_table f, gramaje_table g, papel_comun_table h
    INNER JOIN produccion_table e
    WHERE a.linea_id = e.linea_fk AND
    b.medition_id = e.medition_fk AND 
    c.paginacion_id = e.pagination_fk AND 
    d.producto_id = e.producto_fk AND
    f.kba_id = d.cociente_total_fk AND
    f.gramaje_fk = g.gramaje_id AND
    h.papel_comun_id = d.papel_comun_fk AND e.produccion_id = ?`
;

const Caroussel = ({items}) => {

    const navigation = useNavigation();
    const contHeight = 130;
    const margin = 20;
    const [activeSlide, getActiveSlide] = useState(0);

    const pagination = () => {
        return (
            <Pagination
                dotsLength={items.length}
                activeDotIndex={activeSlide}
                containerStyle={{
                    backgroundColor: 'transparent',
                    width: Dimensions.get('window').width - (margin * 2),
                    marginTop: -20
                }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: COLORS.sliderBackground
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    const updateInfoForSectionList = async (item) => {
        //GET AUTOPASTERS PRODUCTION
        genericTransaction(autopasters_prod_table_by_production, [item.id])
            .then(async response => {
                try {
                    //ORDERED ITEMS FOR POSITION_ROLL.
                    response.sort((a, b) => a.autopaster_fk - b.autopaster_fk);
                    //DATA REQUEST.
                    const coefBBDD = await genericTransaction(picker_coeficiente, []);
                    const maxRadius = await genericTransaction("SELECT MAX(medida) AS 'radiomax' FROM coeficiente_table", []);
                    const productData = await genericTransaction(dataProductSelected, [item.id]);
                    const grouped = await groupedAutopasters(response);
                    const AutopastersLineProdData = await genericTransaction("SELECT * FROM autopaster_table WHERE linea_fk = ?",[productData[0].linea_id]);
                    const kilosNeededForAutopaster = await kilosByAutopasterCalc(grouped, productData[0], response);
                    console.log('grouped', grouped)
                    return {
                        radiusCoefBBDD: coefBBDD,
                        groupedDataSectionList: grouped,
                        autopasters: grouped.map(i => i.title),
                        item: productData[0],
                        maxRadius: maxRadius[0].radiomax,
                        autopastersLineData: AutopastersLineProdData,
                        kilosForAutopasterState: kilosNeededForAutopaster,
                        definedAutopasters: response
                    };
                } catch (err) {
                    console.log(err)
                }
            })
            .then(async response => await navigation.navigate('FullProduction', response))
            .catch(err => console.log(err));
    };

    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => updateInfoForSectionList(item)}>
                <View style={{
                    backgroundColor: 'floralwhite',
                    borderRadius: 5,
                    height: contHeight,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                >
                    {
                        formatDateYYMMDD() !== item['Fecha de creación'] ?
                            <View style={{
                                width: 20,
                                height: 20,
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                backgroundColor: 'red',
                                borderRadius: 100,
                                elevation: 12
                            }}/>
                            :
                            null
                    }
                    <Text style={{
                        width: '100%',
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        backgroundColor: 'floralwhite',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        padding: 3,
                        paddingLeft: 10,
                        color: '#a2a2a2',
                        elevation: 2
                    }}>{item['Fecha de creación']}</Text>
                    <Text style={{
                        marginTop: 5,
                        fontSize: 30,
                        textTransform: 'capitalize',
                        textAlign: 'right'
                    }}>
                        {item.producto.length > 10 ?
                            item.producto.substr(0, 10) + '...'
                            :
                            item.producto
                        }
                    </Text>
                    <Text>Paginación: {item.Paginacion}</Text>
                    <Text>{item['Fecha de creación']}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        items.length > 0 ?
            <View style={[styles.contPrinc, {marginLeft: margin, marginRight: margin}]}>
                <Carousel
                    layout={"default"}
                    data={items}
                    sliderWidth={Dimensions.get('window').width - (margin * 2)}
                    itemWidth={200}
                    renderItem={renderItem}
                    onSnapToItem={(index) => getActiveSlide(index)}/>
                {pagination()}
            </View>
            :
            <ImageBackground
                source={require('../assets/images/splash/Logo_AlbertoGarel.png')}
                style={[styles.contPrinc, {
                    marginLeft: margin,
                    marginRight: margin,
                    width: Dimensions.get('window').width - (margin * 2),
                    height: contHeight,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }]}>
                <Text style={styles.contempty}>Sin produccion planificada</Text>
                <Text style={styles.contemptysmall}>Crea producciones con el botón + de la barra inferior</Text>
            </ImageBackground>
    )
};
const styles = StyleSheet.create({
    contPrinc: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    contempty: {
        fontFamily: 'Anton',
        color: COLORS.black,
        fontSize: 20
    },
    contemptysmall: {
        fontFamily: 'Anton',
        color: COLORS.white,
        fontSize: 12
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
})
export default Caroussel;