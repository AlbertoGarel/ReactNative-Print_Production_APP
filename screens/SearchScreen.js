import React, {useRef, useState} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Text,
    ActivityIndicator
} from 'react-native';
import {search, deleteThin, searchCode, semicircle2} from "../assets/svg/svgContents";
import SvgComponent from "../components/SvgComponent";
import {COLORS} from "../assets/defaults/settingStyles";
import {search_bobina, search_bobina_fullWeight} from "../dbCRUD/actionsSQL";
import * as SQLite from "expo-sqlite";
import BgComponent from "../components/BackgroundComponent/BgComponent";
import HomeHeader from "../components/headers/HomeHeader";
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import BottomSheetComponent from "../components/remove__BottomSheetComponent";
import BarcodeScannerComponent from "../components/BarcodeScannerComponent";
import {useFocusEffect} from "@react-navigation/native";

const height = Dimensions.get('window').height / 1.5;

const SearchScreen = () => {
    const db = SQLite.openDatabase('bobinas.db');
    const searchRef = useRef();
    const bottomSheetRef = useRef();
    const [valueForSearch, setValueForSearch] = useState('');
    const [valuesDB, getValuesDB] = useState([]);
    const [hideHeader, setHideHeader] = useState(false)

    const [tableHead, setTablehead] = useState(['']);
    const [tableData, setTableData] = useState([]);

    const [isVisible, SetIsVisible] = useState(false);
    const [noResult, setNoResult] = useState(!valuesDB);

    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: semicircle2, svgWidth: '120%', svgHeight: '110%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: 0, right: 0
    };
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setNoResult(false)
            }
        }, [])
    );

    const getDataSearchForTable = (datas) => {
        setTablehead([...Object.keys(datas[0])]);
        const val = datas.map(item => {
            return [...Object.values(item)];
        });
        setTableData([...val]);
    };

    const onChangeTexthandler = (searchValue) => {
        setValueForSearch(searchValue);
        db.transaction(async tx => {
            if (searchValue === ' ') {
                await tx.executeSql(
                    search_bobina_fullWeight,
                    [],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getDataSearchForTable(_array)
                        }
                        getValuesDB(_array)
                    }
                );
            } else if (searchValue.length > 1) {
                await tx.executeSql(
                    search_bobina,
                    [
                        `%${searchValue}%`,
                        `%${searchValue}%`,
                        `%${searchValue}%`,
                        `%${searchValue}%`,
                        `%${searchValue}%`,
                        `%${searchValue}%`,
                        `%${searchValue}%`,
                        `%${searchValue}%`
                    ],
                    (_, {rows: {_array}}) => {
                        if (_array.length > 0) {
                            getDataSearchForTable(_array)
                        } else {
                            setNoResult(true)
                        }
                        getValuesDB(_array)
                    }
                );
            } else {
                getValuesDB([])
            }
        });
    };

    const cellWidth = 85;
    const cellMargin = 16;

    function numCell(data) {
        let arr = [120 + (cellMargin * 2)];
        for (let i = 0; i < data.length - 1; i++) {
            arr.push(cellWidth + (cellMargin * 2));
        }
        return arr;
    };

    const bottomSheetHandler = () => SetIsVisible(!isVisible);

    const getScannedCode = (param) => {
        onChangeTexthandler(param.scannedCode)
        setHideHeader(true);
        bottomSheetRef.current.close()
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <BgComponent
                svgOptions={optionsSVG}
                styleOptions={optionsStyleContSVG}
            />
            {!hideHeader &&
            <HomeHeader
                textprops={{color: COLORS.white, marginTop: 15}}
                imageBg={COLORS.white}
                titleColor={COLORS.white}
                titleSecction={"BÚSQUEDA"}
                text={'Realiza búsquedas de bobinas por peso, radio, código, etc. Pulsa barra espaciadora (espacio en blanco) para ver bobinas sin uso.'}
            />
            }
            <View style={{
                padding: 20,
                backgroundColor: 'transparent'
            }}>
                <View style={styles.SectionStyle}>
                    {
                        valueForSearch.length === 0 ?
                            (
                                <View style={styles.IconStyle}>
                                    <SvgComponent
                                        svgData={search}
                                        svgWidth={30}
                                        svgHeight={30}
                                    />
                                </View>
                            )
                            :
                            (
                                <TouchableOpacity style={styles.IconStyle}
                                                  onPress={() => {
                                                      searchRef.current.clear();
                                                      setValueForSearch('');
                                                      getValuesDB([]);
                                                      setHideHeader(false);
                                                      setNoResult(false)
                                                  }}
                                >
                                    <SvgComponent
                                        svgData={deleteThin}
                                        svgWidth={20}
                                        svgHeight={20}
                                    />
                                </TouchableOpacity>
                            )

                    }

                    <TextInput
                        ref={searchRef}
                        style={{flex: 1, marginLeft: 10, fontFamily: 'Anton'}}
                        placeholder={'buscador de bobinas...'}
                        name={'search'}
                        onChangeText={(valueForSearch) => {
                            onChangeTexthandler(valueForSearch);
                        }}
                        onBlur={() => {
                            setValueForSearch('');
                            setHideHeader(false);
                        }}
                        onFocus={() => setHideHeader(true)}
                        defaultValue={valueForSearch}
                    />
                    <TouchableOpacity style={[styles.IconStyle, {
                        backgroundColor: '#c2c2c2',
                        borderRadius: 5,
                        shadowColor: COLORS.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 10,
                        elevation: 12,
                    }]}
                                      onPress={() => {
                                          bottomSheetRef.current.open();
                                      }}
                    >
                        <SvgComponent
                            svgData={searchCode}
                            svgWidth={40}
                            svgHeight={40}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {
                valuesDB.length > 0 ?
                    <View style={[styles.container, {maxHeight: Dimensions.get('screen').height / 1.7}]}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ScrollView horizontal={true}>
                                <Table borderStyle={{borderColor: 'transparent'}}>
                                    <Row data={tableHead} style={styles.head}
                                         widthArr={numCell(tableHead)}
                                         textStyle={[styles.text, {color: COLORS.white, width: cellWidth}]}/>
                                    <ScrollView style={styles.dataWrapper}>
                                        {
                                            tableData.map((rowData, index) => (
                                                <TableWrapper key={index}
                                                              style={index % 2 === 0 ? styles.row : styles.row2}>
                                                    {
                                                        rowData.map((cellData, cellIndex) => (
                                                            <Cell key={cellIndex}
                                                                  data={cellData}
                                                                  textStyle={[styles.text, cellIndex === 0 ? {
                                                                      width: 120,
                                                                      textAlign: 'left'
                                                                  } : {width: cellWidth}]}/>
                                                        ))
                                                    }
                                                </TableWrapper>
                                            ))
                                        }
                                    </ScrollView>
                                </Table>
                            </ScrollView>
                        </View>
                    </View>
                    :
                    noResult && <View style={styles.contNoResult}>
                        <ActivityIndicator size="small" color={COLORS.primary}/>
                        <Text style={styles.textNoResult}>No se ha encontrado nada...</Text>
                    </View>
            }
            <BottomSheetComponent
                ref={bottomSheetRef}
                height={height}
                openDuration={250}
                onClose={() => bottomSheetHandler()}
                onOpen={() => bottomSheetHandler()}
                children={<BarcodeScannerComponent props={{
                    isVisible: isVisible,
                    getScannedCode: getScannedCode,
                }}/>}
                isVisible={isVisible}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create(
    {
        SectionStyle: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            borderWidth: .5,
            borderColor:
            COLORS.black,
            height: 60,
            borderRadius: 5,
            marginLeft: 10,
            marginBottom: 10,
            marginRight: 10
        },
        IconStyle: {
            margin: 5,
            resizeMode: 'stretch',
            alignItems: 'center',
            padding: 5,
        },
        container: {
            padding: 6,
            backgroundColor: 'transparent',
            alignSelf: 'center'
        },
        head: {
            height: 40,
            backgroundColor: COLORS.primary
        },
        text: {
            marginHorizontal: 16,
            paddingVertical: 10,
            textAlign: 'center'
        },
        row: {
            flexDirection: 'row',
            backgroundColor: COLORS.white
        }
        ,
        row2: {
            flexDirection: 'row',
            backgroundColor: '#FFAF59'
        },
        btn: {
            padding: 5,
            backgroundColor: COLORS.buttonEdit,
            borderRadius: 6,
            alignSelf: 'flex-start',
            marginLeft: 5,
        },
        btnText: {
            textAlign: 'center',
            color: COLORS.white
        },
        dataWrapper: {
            marginTop: -1
        },
        contNoResult: {
            borderRadius: 5,
            backgroundColor: '#fff',
            paddingHorizontal: 30,
            alignSelf: 'center',
            paddingVertical: 10
        },
        textNoResult: {
            textAlign: 'center',
            fontSize: 16,
            fontFamily: 'Anton'
        }
    })
;
export default SearchScreen;