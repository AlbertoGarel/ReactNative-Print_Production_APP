import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import PropTypes from "prop-types";

const {width} = Dimensions.get('window');

const HomeHeader = ({
                        textprops,
                        imageBg,
                        titleColor,
                        text,
                        titleSecction
                    }) => {

    return (
        <View style={styles.parent}>
            <View style={styles.subcont}>
                <Text style={[styles.title, {color: titleColor}]}>
                    PrintingAPP<Text style={styles.minifText}>production manager</Text>
                </Text>
                <Image
                    style={[styles.image, {backgroundColor: imageBg}]}
                    source={require('../../assets/images/splash/Logo_AlbertoGarel.png')}
                />
            </View>
            {titleSecction ?
                <Text style={{
                    fontFamily: 'Anton',
                    fontSize: 20,
                    alignSelf: 'flex-start',
                    textTransform: 'capitalize',
                    color: COLORS.white,
                }}>
                    {titleSecction}
                </Text>
                :
                null
            }
            <Text
                style={[{...textprops}, {marginTop: 0}]}
            >{text}</Text>
        </View>
    )
};
const styles = StyleSheet.create({
    parent: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
        padding: 20,
        marginBottom: 10
    },
    subcont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Anton',
        fontSize: width > 768 ? 50 : 30,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 1
    },
    minifText: {
        color: COLORS.whitesmoke,
        fontSize: width > 768 ? 15 : 12
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50
    }
})

HomeHeader.propTypes = {
    textprops: PropTypes.object.isRequired,
    imageBg: PropTypes.string,
    titleColor: PropTypes.string,
    text: PropTypes.string.isRequired,
    titleSecction: PropTypes.string.isRequired,
};

export default HomeHeader;