import React, {memo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import HRtag from "../../components/HRtag";
import {COLORS} from "../../assets/defaults/settingStyles";

const HeaderCommonDrawer = ({
                                headerTitle,
                                headerParagraph,
                                handlerModalInfo,
                                info
                            }) => {

    return (
        <>
            <View style={styles.containerTitle}>
                <Text style={styles.title}>{headerTitle}</Text>
                {info && <TouchableOpacity style={styles.container} onPress={handlerModalInfo}>
                    <Image style={styles.stretch} source={require('../../assets/images/info.png')}/>
                </TouchableOpacity>}
            </View>
            {!headerParagraph ?
                null
                :
                <Text style={styles.paragraph}>
                    {headerParagraph}
                </Text>
            }
            <HRtag
                borderColor={COLORS.white}
            />
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff90',
        borderRadius: 100,
        alignSelf: 'flex-start',
        marginTop: 10
    },
    containerTitle: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    stretch: {
        width: 30,
        height: 30,
        // resizeMode: 'contain',
    },
    title: {
        fontFamily: 'Anton',
        fontSize: 30,
        alignSelf: 'flex-start',
        textTransform: 'capitalize',
        color: COLORS.white,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
        width: '80%'
    },
    paragraph: {
        color: COLORS.dimgrey,
        padding: 10,
        // backgroundColor: COLORS.white,
        borderRadius: 5
    },
    paragraph2: {
        color: COLORS.black,
        padding: 10,
        // backgroundColor: COLORS.white,
        borderRadius: 5,
        textShadowColor: COLORS.primary,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1
    }
});
export default memo(HeaderCommonDrawer);