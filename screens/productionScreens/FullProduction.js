import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    SectionList,
    ActivityIndicator, Image
} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import {Fontisto as Icon} from "@expo/vector-icons";
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
    bgSquaresSVG,
    fingerselectOrangeSVG, searchCode,
    semicircle2,
    sunTornadoSVG,
    texturesSVG
} from "../../assets/svg/svgContents";
import * as SQLite from "expo-sqlite";
import {autopasters_prod_table_all, autopasters_prod_table_by_production} from "../../dbCRUD/actionsSQL";
import {storeData} from "../../data/AsyncStorageFunctions";
import BarcodesTypeSelection from "../../components/BarcodesTypeSelection";
import FullCardProduction from "../../components/productions/FullCardProduction";
import BgComponent from "../../components/BackgroundComponent/BgComponent";
import BorderedButton from "../../components/BorderedButton";
import BgRepeatSVG from "../../components/BackgroundComponent/BgRepeatSVG";
import SvgComponent from "../../components/SvgComponent";
import BarcodeScannerComponent from "../../components/BarcodeScannerComponent";
import BottomSheetComponent from "../../components/BottomSheetComponent";
import ContainerSectionListItem from "../../components/productions/ContainerSectionListItem";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const titleContHeight = 60;
let svgSquare = 100
const height = windowHeight / 1.5;

const FullProduction = ({route}) => {
    const db = SQLite.openDatabase('bobinas.db');
    const bottomSheetRef = useRef();

    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: bgSquaresSVG, svgWidth: svgSquare, svgHeight: svgSquare
    };
    const optionsSVG2 = {
        svgData: texturesSVG, svgWidth: svgSquare, svgHeight: svgSquare
    };

    const optionsStyleContSVG = {
        backgroundColor: 'white'
    };
    const optionsStyleContSVG2 = {
        backgroundColor: '#ff850050'
    };

    const tabBarHeight = useBottomTabBarHeight();
    const {item} = route.params;

    const [parentHeight, setParentHeight] = useState(false);
    //SCANNER
    const [isVisible, SetIsVisible] = useState(false);
    const [valueForSearch, setValueForSearch] = useState('');
    //FULL DATA
    const [itemData, getItemData] = useState({});
    const [autopastersLineProdData, getAutopastersLineProdData] = useState([]);
    const [productProdData, getProductProdData] = useState([])

    //PRODUCTION SELECTED DATA
    const [autopastersDataProduction, getAutopastersDataProduction] = useState([]);
    const [individualAutopasterDataForSectionList,
        getIndividualAutopasterDataForSectionList] = useState([]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            // console.log('item to render to fullProduction', item.id)
            //GET ITEM DATA
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM produccion_table WHERE produccion_id = ?",
                    [item.id],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getItemData(..._array);
                            const lineaId = _array[0].linea_fk;
                            const productoId = _array[0].producto_fk
                            //GET AUTOPASTER LIST
                            db.transaction(tx => {
                                tx.executeSql(
                                    "SELECT * FROM producto_table WHERE producto_id = ?",
                                    [productoId],
                                    (_, {rows: {_array}}) => {
                                        if (_array.length > 0) {
                                            getProductProdData(_array);
                                        } else {
                                            console.log('(FullProduction)Error al conectar base de datos en FullProduction Component');
                                        }
                                    }
                                );
                            });
                            //GET PRODUCT DATA
                            db.transaction(tx => {
                                tx.executeSql(
                                    "SELECT * FROM autopaster_table WHERE linea_fk = ?",
                                    [lineaId],
                                    (_, {rows: {_array}}) => {
                                        if (_array.length > 0) {
                                            getAutopastersLineProdData(_array);
                                        } else {
                                            console.log('(FullProduction)Error al conectar base de datos en FullProduction Component');
                                        }
                                    }
                                );
                            });
                        } else {
                            console.log('(FullProduction)Error al conectar base de datos en FullProduction Component');
                        }
                    }
                );
            });
            //GET AUTOPASTERS PRODUCTION
            db.transaction(tx => {
                tx.executeSql(
                    autopasters_prod_table_by_production,
                    [item.id],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getAutopastersDataProduction(_array);
                        } else {
                            console.log('(FullProduction)Error al conectar base de datos en FullProduction Component');
                        }
                    }
                );
            });
        }
        return () => isMounted = false;
    }, [item]);

    useEffect(() => {
        //GET IIDIVIDUAL INFO AUTOPASTERS
        let data_autopasters_sectionList = [];
        for (let autopaster of autopastersDataProduction) {
            let autopasterFiltered = autopastersLineProdData.filter(autopast => autopast.autopaster_id === autopaster.autopaster_fk);
            data_autopasters_sectionList = [
                ...data_autopasters_sectionList,
                {
                    title: autopasterFiltered.length > 0 ? autopasterFiltered[0].name_autopaster : '',
                    data: [autopaster]
                }
            ];
        }
        if (data_autopasters_sectionList.length > 0) {
            getIndividualAutopasterDataForSectionList(data_autopasters_sectionList)
        }
    }, [autopastersLineProdData, autopastersDataProduction])

    const ShowData = () => {
        return Object.entries(item).map(([key, value], index) => {
            return <Text style={[styles.textContData, {textAlign: index % 2 === 0 ? 'left' : 'left'}]} key={index}>
                <Text style={{color: COLORS.primary}}>{`${key}: `}</Text>{value}</Text>
        });
    };

    const handlerAddBobina = (unitID) => {
// alert(autopasterID+ '<-- autID--||--prodD -->' +  productionID);
        //OPEN CAMERA FOR SCAN CODE
        bottomSheetRef.current.open();
        // console.log('item', item)
        console.log('itemData', itemData)
        // console.log('productData', productProdData)
        // console.log('autopasterID', autopasterID)
        // console.log('valueForSearch', valueForSearch)
        // constants
        const valueDatacode = valueForSearch;
        const autopasterId = unitID;
    };

    const getDataCode = (dataCode) => {
        console.log('datacodeeeeeeeeeeeeeeeeeeee', dataCode);
    }

    const bottomSheetHandler = () => SetIsVisible(!isVisible);
    const getScannedCode = (param) => {
        setValueForSearch(param);
    }

    const EmptyFooter = () => {
        return (
            <View style={{
                // width: '100%',
                height: 150,
                // marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                // alignItems: 'center',
                padding: 20
            }}
            >
                <Image
                    style={{
                        width: 40,
                        height: 40
                    }}
                    source={require('../../assets/images/splash/Logo_AlbertoGarel.png')}
                />
                <Text style={{
                    fontFamily: 'Anton',
                    fontSize: 20,
                    color: COLORS.white
                }}>#Albertogarel</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whitesmoke}}>
            <BgRepeatSVG
                svgOptions={optionsSVG}
                styleOptions={optionsStyleContSVG}
            />
            <View style={[styles.parent, {
                bottom: !parentHeight ? 20 : 0,
                position: !parentHeight ? 'absolute' : 'relative',
                height: !parentHeight ? 'auto' : 60,
            }]}>
                <BgRepeatSVG
                    svgOptions={optionsSVG2}
                    styleOptions={optionsStyleContSVG2}
                />
                <View style={{
                    height: titleContHeight,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    borderBottomWidth: parentHeight ? 0 : 2,
                    borderBottomColor: COLORS.white,
                    backgroundColor: COLORS.primary,
                }}>
                    <View style={{maxWidth: '50%'}}>
                        <Text style={[styles.title, {
                            color: COLORS.white,
                            fontSize: item.producto.length > 10 ? 16 : 24
                        }]}>{item.producto}</Text>
                    </View>
                    <Text style={[styles.title, {
                        color: COLORS.white,
                        fontSize: 15
                    }]}>fecha: {item['Fecha de creación']}</Text>
                </View>
                <View style={styles.content}>
                    <SectionList
                        sections={individualAutopasterDataForSectionList}
                        extraData={individualAutopasterDataForSectionList}
                        keyExtractor={(item, index) => item + index}
                        // renderItem={({item}) => <FullCardProduction item={item}/>}
                        // renderItem={({item}) => <FullCardProduction item={item}/>}
                        renderItem={({item}) => <ContainerSectionListItem item={item} itemData={itemData}/>}
                        ListEmptyComponent={() => <ActivityIndicator size="large" color={COLORS.buttonEdit}/>}
                        ListFooterComponent={() => <EmptyFooter/>}
                        renderSectionHeader={({section: {data, title}}) => (
                            <>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.headerText, {
                                        fontSize: 12
                                    }]}>
                                        UNIDAD:
                                        <Text style={{fontSize: 20, color: COLORS.buttonEdit}}> {title}</Text></Text>
                                    <TouchableOpacity style={[styles.IconStyle, {
                                        backgroundColor: COLORS.white,
                                        borderRadius: 5,
                                        shadowColor: COLORS.black,
                                        shadowOffset: {width: 0, height: 2},
                                        shadowOpacity: 0.8,
                                        shadowRadius: 10,
                                        elevation: 12,
                                        borderWidth: 2,
                                        borderColor: COLORS.primary,
                                        padding: 2
                                    }]}
                                                      onPress={() => {
                                                          handlerAddBobina(data[0].autopaster_fk);
                                                      }}
                                    >
                                        <SvgComponent
                                            svgData={searchCode}
                                            svgWidth={40}
                                            svgHeight={40}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    />
                    {/*<Text>{JSON.stringify(individualAutopasterDataForSectionList)}</Text>*/}
                </View>
            </View>
            <View style={[styles.bottomdrawer, {height: windowHeight}]}>
                <View style={[styles.contData, {display: !parentHeight ? 'none' : 'flex'}]}>
                    <ShowData/>
                </View>
            </View>
            {/*<TouchableOpacity style={[styles.buttonData, {top: windowHeight - (tabBarHeight * 2.3)}]}*/}
            <TouchableOpacity style={[styles.buttonData, {bottom: 0}]}
                              onPress={() => setParentHeight(!parentHeight)}>
                <Icon name={'arrow-expand'} size={25} color={COLORS.background_tertiary} style={styles.icon}/>
                <Text style={{fontFamily: 'Anton'}}>CALCULAR</Text>
            </TouchableOpacity>
            <BottomSheetComponent
                ref={bottomSheetRef}
                height={height}
                openDuration={250}
                onClose={() => bottomSheetHandler()}
                onOpen={() => bottomSheetHandler()}
                children={<BarcodeScannerComponent props={{
                    isVisible: isVisible,
                    getScannedCode: setValueForSearch,
                    // onChangeTexthandler: null
                }}/>}
                isVisible={isVisible}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    parent: {
        // flex: 1,
        position: 'absolute',
        // width: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 100,
        backgroundColor: COLORS.primary,
        // marginBottom: 20,
        borderBottomLeftRadius: 130,
        elevation: 12,
        overflow: 'hidden',
    },
    title: {
        textTransform: 'capitalize',
        textAlign: 'center',
        textShadowColor: COLORS.black,
        textShadowOffset: {width: 0.8, height: 0.8},
        textShadowRadius: 1
    },
    content: {
        padding: 10,
    },
    bottomdrawer: {
        // position: 'absolute',
        // height: windowHeight,
        // backgroundColor: 'red'
    },
    contData: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    textContData: {
        fontFamily: 'Anton',
        color: '#858585',
        width: '50%',
    },
    buttonData: {
        position: 'absolute',
        left: 5
    },
    icon: {
        marginLeft: 10,
    },
    sectionHeader: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingLeft: 5,
        marginTop: 20,
        marginBottom: 5,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.white,
        elevation: 12,
    },
    headerText: {
        color: COLORS.black,
        fontFamily: 'Anton',
        textTransform: 'capitalize',

    },
    headerTextBtn: {
        color: COLORS.white,
    },
    addBobiButton: {
        backgroundColor: COLORS.supportBackg1,
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.white
    },
    contButtons: {
        padding: 5,
        backgroundColor: 'black',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-evenly",
    }
})
export default FullProduction;