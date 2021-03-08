import React, {useEffect, useState} from 'react';
import Gallery from "react-native-image-gallery";
import {View} from "react-native";

const Slider = ({
                    sliderContParentStyles,
                    sliderContStyles,
                    arrItems,
                    navigation
                }) => {

    ///sin props
    const [items, setItems] = useState([]);

    useEffect(() => {
        let items = Array.apply(null, Array(60)).map((v, i) => {
            //Loop to make image array to show in slider
            return {
                source: {
                    uri: 'http://placehold.it/200x200?text=' + (i + 1),
                },
            };
        });
        setItems(items);
    }, []);

    ///

    return (
        <View style={{...sliderContParentStyles}}>
            <Gallery
                style={!sliderContStyles ? {flex: 1, backgroundColor: 'black'} : {...sliderContStyles}}
                initialPage="1"
                onSingleTapConfirmed={() => navigation.navigate('Profile', {name: 'Elena'})}
                //initial image to show
                images={
                    !arrItems ? items : arrItems
                }
            />
        </View>
    )
}

export default Slider;