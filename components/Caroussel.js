import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {COLORS} from "../assets/defaults/settingStyles";
import {useNavigation} from '@react-navigation/native';
import {groupedAutopasters, kilosByAutopasterCalc} from "../utils";
import {genericTransaction} from "../dbCRUD/actionsFunctionsCrud";
import {
    autopasters_prod_table_by_production,
    dataProductSelectedAllInfo,
    picker_coeficiente
} from "../dbCRUD/actionsSQL";
import SpinnerSquares from "./SpinnerSquares";
import PropTypes from 'prop-types';

const Caroussel = ({items, deleteProduction, spinnerSelected, handlerSpinner}) => {

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
                    handlerSpinner(true, item.id)
                    //ORDERED ITEMS FOR POSITION_ROLL.
                    response.sort((a, b) => a.autopaster_fk - b.autopaster_fk);
                    //DATA REQUEST.
                    const coefBBDD = await genericTransaction(picker_coeficiente, []);
                    const maxRadius = await genericTransaction("SELECT MAX(medida) AS 'radiomax' FROM coeficiente_table", []);
                    const productData = await genericTransaction(dataProductSelectedAllInfo, [item.id]);
                    const grouped = await groupedAutopasters(response, item.id);
                    const AutopastersLineProdData = await genericTransaction("SELECT * FROM autopaster_table WHERE linea_fk = ?", [productData[0].linea_id]);
                    const kilosNeededForAutopaster = await kilosByAutopasterCalc(grouped, productData[0], response);

                    return {
                        radiusCoefBBDD: await coefBBDD,
                        groupedDataSectionList: await grouped,
                        autopasters: await grouped.map(i => i.title),
                        item: await productData[0],
                        maxRadius: await maxRadius[0].radiomax,
                        autopastersLineData: await AutopastersLineProdData,
                        kilosForAutopasterState: await kilosNeededForAutopaster,
                        definedAutopasters: await response
                    };
                } catch (err) {
                    console.log(err)
                }
            })
            .then(async response => {
                await navigation.navigate('FullProduction', response)
            })
            .catch(err => console.log(err));
    };


    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => updateInfoForSectionList(item)}
                              onLongPress={() => deleteProduction(item)}>
                <View style={{...styles.itemCont, height: contHeight}}
                >
                    {item.id === spinnerSelected.item && spinnerSelected.spin && <View style={styles.spinnerCont}><SpinnerSquares/></View>}
                    <Text style={styles.datetext}>{item['Fecha de creación']}</Text>
                    <Text style={styles.prodText}>
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
    itemCont: {
        backgroundColor: 'floralwhite',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerCont: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff90',
        zIndex: 999
    },
    datetext: {
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
    },
    prodText: {
        marginTop: 5,
        fontSize: 30,
        color: COLORS.secondary,
        textTransform: 'capitalize',
        textAlign: 'right'
    }
})

Caroussel.propTypes = {
    items: PropTypes.array.isRequired,
    deleteProduction: PropTypes.func.isRequired,
    spinnerSelected: PropTypes.object.isRequired,
    handlerSpinner: PropTypes.func.isRequired,
};
export default Caroussel;