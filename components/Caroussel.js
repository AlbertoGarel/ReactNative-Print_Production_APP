import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {COLORS} from "../assets/defaults/settingStyles";
import {useNavigation} from '@react-navigation/native';
import {formatDateYYMMDD} from "../utils";

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

    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('FullProduction', {item: item})}>
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
                    <Text>{formatDateYYMMDD()}</Text>
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