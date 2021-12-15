import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Picker, Dimensions} from 'react-native';
import {COLORS, shadowPlatform} from "../assets/defaults/settingStyles";
import HRtag from "./HRtag";
import {icon360SVG, move_DownSVG, move_UpSVG} from "../assets/svg/svgContents";
import SvgComponent from "./SvgComponent";
import {DraxProvider, DraxList, DraxViewDragStatus} from 'react-native-drax';
import {TouchableWithoutFeedback} from "react-native-web";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import {LinearGradient} from "expo-linear-gradient";
import SpinnerSquares from "./SpinnerSquares";

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
//     const [itemsToOrder, getItemsToOreder] = useState([]);
    const {autopasterNum, inputRadioForRollRadius, setStateForRadiusChangedPosition, spin} = props;
    const [rolls, getRolls] = React.useState([]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            getRolls(inputRadioForRollRadius.filter(roll => roll.autopaster === autopasterNum)
                .sort((a, b) => a.position - b.position)
            );
        }
        return () => isMounted = false;
    }, [autopasterNum, inputRadioForRollRadius]);

    const wait = (dataForState) => setTimeout(()=>{
        setStateForRadiusChangedPosition(dataForState);
    }, 300);

    useEffect(()=>{
        return ()=> clearTimeout(wait)
    },[])

    const alphabet = 'ABCD'.split('');
    const [alphaData, setAlphaData] = React.useState(alphabet);

    const calcHeightForContainer = (item) => {
        return (dragItemHeight * item.length) + (dragContainerPadding * 2) + (paddingItems * (maxViewItems * 2))
    }

    // const getBackgroundColor = (alphaIndex) => {
    //     switch (alphaIndex % 6) {
    //         case 0:
    //             return '#ffaaaa';
    //         case 1:
    //             return '#aaffaa';
    //         case 2:
    //             return '#aaaaff';
    //         case 3:
    //             return '#ffffaa';
    //         case 4:
    //             return '#ffaaff';
    //         case 5:
    //             return '#aaffff';
    //         default:
    //             return '#aaaaaa';
    //     }
    // };

    // const getItemStyleTweaks = (alphaItem) => {
    //     const alphaIndex = alphabet.indexOf(alphaItem);
    //     return {
    //         backgroundColor: getBackgroundColor(alphaIndex),
    //         height: dragItemHeight,
    //     };
    // };


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
                                                {item.weightIni === item.weightAct ?
                                                    <Barcode
                                                        format="CODE128"
                                                        value={item.bobinaID.toString()}
                                                        text={item.bobinaID.toString()}
                                                        style={{}}
                                                        maxWidth={Dimensions.get('window').width / 3}
                                                        height={dragItemHeight / 8}
                                                    />
                                                    :
                                                    <Text style={{textAlign: 'center'}}>
                                                        {item.bobinaID}
                                                    </Text>
                                                }
                                            </View>
                                            <View style={styles.betaItem}>
                                                <Text style={styles.dataText}>peso origen: {item.weightIni}</Text>
                                                <Text style={styles.dataText}>peso actual: {item.weightAct}</Text>
                                            </View>
                                            <View style={styles.prevCont}>
                                                <Text style={{fontSize: 10}}>0%</Text>
                                                <View style={{
                                                    borderRadius: 5,
                                                    height: 10,
                                                    width: '100%',
                                                    backgroundColor: 'red'
                                                }}/>
                                            </View>
                                        </View>
                                    )}
                                    // onItemReorder={({fromIndex, toIndex}) => {
                                    //     const newData = alphaData.slice();
                                    //     newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
                                    //     setAlphaData(newData);
                                    // }}
                                    keyExtractor={(item) => item.bobinaID.toString()}
                                    onItemDragStart={({index, item}) => {
                                        console.log(`Item #${index} (${item}) drag start`);
                                    }}
                                    onItemDragEnd={({
                                                        index,
                                                        item,
                                                        toIndex,
                                                        toItem
                                                    }) => {
                                        console.log(`Item #${index + 1} (${item.bobinaID}) drag ended at index ${toIndex + 1} (${toItem.bobinaID})`);
                                    }}
                                    onItemReorder={({fromIndex, toIndex}) => {
                                        const newData = rolls.slice();
                                        newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
                                        // console.log('antes', rolls)
                                        // console.log('ahora', newData)
                                        const reordered = newData.map((item, index) => {
                                            item.position = index + 1;
                                            return item;
                                        })
                                        // reordered.sort((a, b) => a.position - b.position);
                                        // reordered.forEach(item=>{
                                        //
                                        // })
                                        // setStateForRadiusChangedPosition(reordered);
                                        wait(reordered);
                                    }}
                                />
                            </View>
                        </DraxProvider>
                    }
                </View>
            </View>


            {/*<Text onPress={touc}>section id: </Text>*/}
            {/*<Text>{JSON.stringify(item)}</Text>*/}
            {/*<Text>{JSON.stringify(itemsToOrder)}</Text>*/}
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
        // backgroundColor: '#aaaaff',
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    dataText: {
        fontFamily: 'Anton',
        fontSize: 12,
    },
    toMove: {
        transform: [{scale: 1.06}, {rotateZ: '5deg'}],
        borderWidth: 2,
        borderColor: 'black',
        opacity: 0.2,
        ...shadowPlatform
    }
});
export default DragDropCardsComponent;