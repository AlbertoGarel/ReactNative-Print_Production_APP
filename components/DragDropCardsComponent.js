import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Picker, Dimensions} from 'react-native';
import {COLORS, shadowPlatform} from "../assets/defaults/settingStyles";
import HRtag from "./HRtag";
import {move_DownSVG, move_UpSVG} from "../assets/svg/svgContents";
import SvgComponent from "./SvgComponent";
import {DraxProvider, DraxList, DraxViewDragStatus} from 'react-native-drax';
import Barcode from "@kichiyaki/react-native-barcode-generator";
import SpinnerSquares from "./SpinnerSquares";
import {warningConsumption} from '../utils'
import PercentageBarCard from "./productions/PercentageBarCard";

const maxViewItems = 3;
const normalViewsItems = 2
const dragItemHeight = 100;
const dragContainerPadding = 10;
const paddingItems = 4;
const marginItems = 4;

const maxHeightDraxParent = (dragItemHeight * maxViewItems) + (dragContainerPadding * 2) + (paddingItems * (maxViewItems * 2))
const heightDraxParent = (dragItemHeight * normalViewsItems) + (dragContainerPadding * 2) + (paddingItems * (maxViewItems * 2))

const DragDropCardsComponent = ({props}) => {
//FUTURE ADD PROPS: type Barcode, add PrevKilos to itemObj
    const {autopasterNum, inputRadioForRollRadius, setStateForRadiusChangedPosition, spin} = props;
    const [rolls, getRolls] = React.useState([]);

    useEffect(() => {
        let isMounted = true;
        console.log('inputRadioForRollRadius', inputRadioForRollRadius)
        if (isMounted) {
            getRolls(inputRadioForRollRadius.sort((a, b) => a.position - b.position));
        }
        return () => isMounted = false;
    }, [autopasterNum, inputRadioForRollRadius]);

    const wait = (dataForState) => setTimeout(() => {
        setStateForRadiusChangedPosition(dataForState);
    }, 300);

    useEffect(() => {
        return () => clearTimeout(wait)
    }, [])

    const calcHeightForContainer = (item) => {
        return (dragItemHeight * item.length) + (dragContainerPadding * 2) + (paddingItems * (maxViewItems * 2))
    }

    return (
        <View style={styles.parentContainer}>
            <View style={styles.contTitle}>
                <Text style={styles.title}>AUTO PASTER {autopasterNum}</Text>
                <HRtag
                    borderWidth={1}
                    borderColor={COLORS.black}
                    margin={5}
                />
                <Text style={{
                    fontFamily: 'Anton',
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
                >Intercambia la posición de cada bobina arrastrando y soltando en su nueva posición.</Text>
                <HRtag
                    borderWidth={1}
                    borderColor={COLORS.black}
                    margin={5}
                />
            </View>
            <View style={styles.twoRows}>
                <View style={styles.rowLeft}>
                    <View style={[styles.contImages, {
                        backgroundColor: COLORS.white,
                        padding: 3,
                        borderRadius: 5,
                    }]}>
                        <SvgComponent svgData={move_UpSVG} svgWidth={50} svgHeight={50}/>
                        <View style={{padding: 2}}/>
                        <SvgComponent svgData={move_DownSVG} svgWidth={50} svgHeight={50}/>
                    </View>
                </View>
                <View style={[styles.rowRight, {height: calcHeightForContainer(rolls)}]}>
                    {spin ?
                        <SpinnerSquares/>
                        :
                        <DraxProvider>
                            <View style={styles.container}>
                                <DraxList
                                    data={rolls}
                                    renderItemContent={({item}, {viewState, hover}) => (
                                        <View style={[styles.alphaItem, shadowPlatform, {
                                            height: dragItemHeight,
                                            overflow: 'hidden'
                                        }, (viewState?.dragStatus === DraxViewDragStatus.Dragging && hover) ? styles.toMove : undefined]}>
                                            <View style={{
                                                flex: 1,
                                                borderRadius: 5,
                                                backgroundColor: 'white',
                                                padding: 3,
                                                justifyContent: 'center'
                                            }}>
                                                {item.peso_ini === item.peso_actual ?
                                                    <Barcode
                                                        format="CODE128"
                                                        value={item.bobina_fk.toString()}
                                                        text={item.bobina_fk.toString()}
                                                        style={{}}
                                                        maxWidth={Dimensions.get('window').width / 3}
                                                        height={dragItemHeight / 8}
                                                    />
                                                    :
                                                    <Text style={{textAlign: 'center'}}>
                                                        {item.bobina_fk}
                                                    </Text>
                                                }
                                            </View>
                                            <View style={styles.betaItem}>
                                                <Text style={styles.dataText}>peso origen: {item.peso_ini}</Text>
                                                <Text style={styles.dataText}>peso actual: {item.peso_actual}</Text>
                                            </View>
                                            <View style={styles.prevCont}>
                                                {/*<Text style={{fontSize: 10}}>{item.resto_previsto}</Text>*/}
                                                {/*<View style={{*/}
                                                {/*    borderRadius: 5,*/}
                                                {/*    height: 10,*/}
                                                {/*    width: '100%',*/}
                                                {/*    backgroundColor: warningConsumption(item.restoPrevisto)*/}
                                                {/*}}/>*/}
                                                <PercentageBarCard
                                                    data={{
                                                        pesoOriginal: item.peso_actual,
                                                        restoInicio: item.peso_ini,
                                                        restoFinal: item.resto_previsto
                                                    }}
                                                    styleParent={[styles.percent, styles.subPercent]}
                                                    styleSubParent={[styles.contBar, {
                                                        width: '90%',
                                                        backgroundColor: COLORS.white
                                                    }]}
                                                    // radiusState={radiusState}
                                                    updateGetStorage={null}
                                                    item={item}
                                                />
                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.bobina_fk.toString()}
                                    onItemDragStart={({index, item}) => {
                                        if (__DEV__) {
                                            console.log(`Item #${index} (${item.bobina_fk}) drag start`);
                                        }
                                    }}
                                    onItemDragEnd={({
                                                        index,
                                                        item,
                                                        toIndex,
                                                        toItem
                                                    }) => {
                                        if (!toItem) {
                                            return
                                        }
                                        if (__DEV__) {
                                            console.log(`Item #${index + 1} (${item.bobina_fk}) drag ended at index ${toIndex + 1} (${toItem.bobina_fk})`);
                                        }
                                    }}
                                    onItemReorder={({fromIndex, toIndex}) => {
                                        const newData = rolls.slice();
                                        newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
                                        const reordered = newData.map((item, index) => {
                                            item.position_roll = index + 1;
                                            return item;
                                        });
                                        wait(reordered);
                                    }}
                                />
                            </View>
                        </DraxProvider>
                    }
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    parentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: COLORS.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5,
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
        flexDirection: 'row',
    },
    rowLeft: {
        alignSelf: 'center',
        padding: 5
    },
    contImages: {
        alignItems: 'center',
    },
    rowRight: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        maxHeight: maxHeightDraxParent,
        borderWidth: 2,
        borderColor: '#000000' + 50,
    },
    container: {
        padding: 10,
    },
    alphaItem: {
        backgroundColor: COLORS.buttonEdit,
        borderRadius: 8,
        margin: 4,
        padding: 4,
    },
    betaItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    prevCont: {
        flex: 1
    },
    dataText: {
        fontFamily: 'Anton',
        fontSize: 12,
        color: COLORS.black
    },
    toMove: {
        transform: [{scale: 1.06}, {rotateZ: '5deg'}],
        borderWidth: 2,
        borderColor: 'black',
        opacity: 0.2,
        ...shadowPlatform
    },
    percent: {
        flex: 1,
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingHorizontal: 3,
        backgroundColor: COLORS.buttonEdit
    },
    subPercent: {
        justifyContent: 'flex-start',
    },
    contBar: {
        width: '100%',
        height: '30%',
        backgroundColor: COLORS.white,
        margin: 3,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.white
    },
});
export default DragDropCardsComponent;