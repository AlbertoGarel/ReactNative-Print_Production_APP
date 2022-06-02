import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

const ImageSection = ({
                          windowWidth,
                          imageURI
                      }) => {
    const imgSquare = windowWidth / 1.2;
    return (
        <View style={styles.imagenCont}>
            <Image
                style={[styles.tinyLogo, {
                    width: imgSquare,
                    height: imgSquare,
                }]}
                // source={require('../../assets/images/introduction/basedata.png')}
                source={imageURI}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    imagenCont: {
        flex: 1.5,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tinyLogo: {}
})
export default ImageSection;