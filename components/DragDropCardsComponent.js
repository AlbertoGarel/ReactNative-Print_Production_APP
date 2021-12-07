import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Picker} from 'react-native';
import {COLORS} from "../assets/defaults/settingStyles";
import HRtag from "./HRtag";
import {icon360SVG, move_DownSVG, move_UpSVG} from "../assets/svg/svgContents";
import SvgComponent from "./SvgComponent";

const DragDropCardsComponent = ({touc, item, individualAutopasterDataForSectionList}) => {

    const [itemsToOrder, getItemsToOreder] = useState([]);
    useEffect(() => {
        const allRollsOfThisAutopasters = individualAutopasterDataForSectionList.filter(autopast => autopast.title === item)[0].data;
        getItemsToOreder(allRollsOfThisAutopasters);
    }, [item, individualAutopasterDataForSectionList]);

    return (
        <View style={styles.container}>
            <View style={styles.contTitle}>
                <Text style={styles.title}>AUTOPASTER {item}</Text>
                <HRtag
                    borderWidth={4}
                    borderColor={COLORS.black}
                    margin={5}
                />
            </View>
            <View style={styles.twoRows}>
                <View style={styles.rowLeft}>
                    <View style={styles.contImages}>
                        <SvgComponent svgData={move_UpSVG} svgWidth={50} svgHeight={50}/>
                        <View style={{padding: 2}}/>
                        <SvgComponent svgData={move_DownSVG} svgWidth={50} svgHeight={50}/>
                    </View>
                </View>
                <View style={styles.rowRight}>
                    <Text>eworie</Text>
                    <Text>eworie</Text>
                    <Text>eworie</Text>
                    <Text>eworie</Text>
                    <Text>eworie</Text>
                    <Text>eworie</Text>
                    <Text>eworie</Text>
                    <Text>eworie</Text>
                    <Text>eworie</Text>
                </View>
            </View>


            <Text onPress={touc}>section id: </Text>
            <Text>{JSON.stringify(item)}</Text>
            <Text>{JSON.stringify(itemsToOrder)}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: COLORS.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5
    },
    contTitle: {
        width: '100%'
    },
    title: {
        color: COLORS.primary,
        textAlign: 'left',
        fontSize: 24,
        fontFamily: 'Anton'
    },
    twoRows: {
        flexDirection: 'row'
    },
    rowLeft: {
        alignSelf: 'center',
        padding: 5
    },
    contImages: {
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    rowRight: {
        flex: 1,
        backgroundColor: 'blue',
    }
});
export default DragDropCardsComponent;