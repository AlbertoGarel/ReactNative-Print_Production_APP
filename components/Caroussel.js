import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, ImageBackground} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const Caroussel = ({items}) => {
    const margin = 20;
    const [activeSlide, getActiveSlide] = useState(0);
    const carouselItems = [
        {
            title: "Levante",
            text: "Text 1",
        },
        {
            title: "Provincias",
            text: "Text 2",
        },
        {
            title: "Mediterráneo",
            text: "Text 3",
        },
        {
            title: "AS",
            text: "Text 4",
        },
        {
            title: "Paraula",
            text: "Text 5",
        }
    ];
    const pagination = () => {
        return (
            <Pagination
                dotsLength={carouselItems.length}
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
                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
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
            <View style={{
                backgroundColor: 'floralwhite',
                borderRadius: 5,
                height: 110,
                // marginLeft: 5,
                // marginRight: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            >
                <Text style={{fontSize: 30}}>{item.title}</Text>
                <Text>{item.text}</Text>
            </View>

        )
    }

    return (

        items.length > 0 ?
            <View style={[styles.contPrinc, {marginLeft: margin, marginRight: margin}]}>
                <Carousel
                    layout={"default"}
                    // ref={ref => this.carousel = ref}
                    data={carouselItems}
                    sliderWidth={Dimensions.get('window').width - (margin * 2)}
                    itemWidth={200}
                    renderItem={renderItem}
                    onSnapToItem={(index) => getActiveSlide(index)}/>
                {pagination()}
            </View>
            :
            <ImageBackground
                source={require('../assets/images/paperwork.jpg')}
                style={[styles.contPrinc, {
                    marginLeft: margin,
                    marginRight: margin,
                    width: Dimensions.get('window').width - (margin * 2),
                    height: 90,
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
        color: '#FF5000',
        fontSize: 20
    },
    contemptysmall: {
        color: '#FFFFFF',
        fontSize: 12
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
})
export default Caroussel;