import React from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import HRtag from "../../components/HRtag";
import {COLORS} from "../../assets/defaults/settingStyles";

const HeaderCommonDrawer = ({
                                headerTitle,
                                headerParagraph,
                            }) => {

    return (
        <>
            <Text style={styles.title}>{headerTitle}</Text>
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
    title: {
        fontFamily: 'Anton',
        fontSize: 30,
        alignSelf: 'flex-start',
        textTransform: 'capitalize',
        color: COLORS.white,
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1
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
export default HeaderCommonDrawer;