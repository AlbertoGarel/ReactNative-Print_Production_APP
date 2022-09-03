import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    SafeAreaView,
    SectionList,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    ImageBackground, StatusBar,
} from 'react-native';
import {
    deleteFile,
    diskcapacity,
    readFolder,
    readFileHTMLFromDocumentDirectory,
    sendFile
} from "../data/FileSystemFunctions";
import SpinnerSquares from "../components/SpinnerSquares";
import SvgComponent from "../components/SvgComponent";
import {
    closeWindowSVG,
    pdfSVG,
} from "../assets/svg/svgContents";
import {COLORS} from "../assets/defaults/settingStyles";
import HRtag from "../components/HRtag";
import TouchableIcon from "../components/TouchableIcon";
import {WebView} from 'react-native-webview';
import CapacityInfoDraggable from "../components/CapacityInfoDraggable";
import {Sentry_Alert, setValueForInput} from "../utils";
import seeFile from "../assets/images/seeFile.png";
import smartphone from "../assets/images/smartphone-sending.png";
import trash from "../assets/images/trashRed.png";

const windowHeight = Dimensions.get('window').height;
const elementListHeight = 34;

const DocumentsViewerScreen = () => {

    const [spinner, setSpinner] = useState(true);
    const [dataSection, getDataSection] = useState([]);
    const [reload, getReload] = useState(false);
    const [totalCapacity, getTotalCapacity] = useState({});
    const [viewPdfContainer, setViewPdfContainer] = useState(false);
    const [viewPDFelement, setViewPDFelement] = useState('');

    useEffect(() => {
        let isMounted = true;

        diskcapacity()
            .then(capacity => {
                if (isMounted) getTotalCapacity(capacity)
            })
            .catch(err => Sentry_Alert('DocumentsViewerScreen.js', 'diskcapacity', err));
        readFolder()
            .then(response => {
                if (isMounted) {
                    getDataSection(group(response));
                    setSpinner(false);
                    getReload(false);
                }
            })
            .catch(err => Sentry_Alert('DocumentsViewerScreen.js', 'readFolder', err));

        return () => isMounted = false;
    }, [reload]);

    // GROUP FILES FOR DATE.
    const group = (arrayToGroup) => {
        const groupedForSectionList = arrayToGroup.sort((a, b) => b.slice(0, 8) - a.slice(0, 8)).reduce((acc, item) => {
            const title = item.split('_')[0];
            acc[title] ?
                acc[title]['data'].push(item)
                :
                acc[title] = {
                    title: title.slice(title.length - 2, title.length) + ' de ' + setValueForInput(title) + ', ' + title.slice(0, 4),
                    data: [item]
                };
            return acc;
        }, {});
        return Object.values(groupedForSectionList).sort((a, b) => b.data[0].slice(0, 8) - a.data[0].slice(0, 8));
    };

    const handlerDelete = (title) => {
        createTwoButtonAlert(title);
    };

    function createTwoButtonAlert(title) {
        Alert.alert(
            'ELIMINAR DOCUMENTO',
            '¿Está seguro de eliminar el documento?. No podrá deshacer la acción.', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        setSpinner(true);
                        deleteFile(title).then(() => {
                            getReload(true)
                            setSpinner(false)
                        })
                    }
                },
            ]);
    };

    const Item = ({title}) => (
        <View style={styles.item}>
            <View style={styles.contItem}>
                <Text style={styles.title}>{title.split('_')[1]}</Text>
            </View>
            <View style={styles.contItem}>
                <TouchableOpacity onPress={() => handlerViewPdf(title)} touchableStyle={styles.touchableStyle}>
                    <ImageBackground resizeMode="cover" source={seeFile} style={styles.iconBackground}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sendFile(title)} touchableStyle={styles.touchableStyle}>
                    <ImageBackground resizeMode="cover" source={smartphone} style={styles.iconBackground}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlerDelete(title)} touchableStyle={styles.touchableStyle}>
                    <ImageBackground resizeMode="cover" source={trash} style={styles.iconBackground}/>
                </TouchableOpacity>
            </View>
        </View>
    );

    const handlerViewPdf = async (filename) => {
        setViewPdfContainer(!viewPdfContainer)
        // RETURN HTML FILE AS STRING
        let uri = await readFileHTMLFromDocumentDirectory(filename)
        setViewPDFelement(uri);
    }

    if (spinner) {
        return <SpinnerSquares/>
    }

    if (dataSection.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <StatusBar
                    animated={false}
                    backgroundColor={COLORS.primary}
                    barStyle={'dark-content'}
                />
                <SvgComponent svgData={pdfSVG} svgHeight={100} svgWidth={100}/>
                <Text style={styles.textEmpty}>Ningún archivo guardado</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={false}
                backgroundColor={COLORS.primary}
                barStyle={'dark-content'}
            />
            {Object.keys(totalCapacity).length > 0 && <CapacityInfoDraggable totalCapacity={totalCapacity}/>}
            <SectionList
                initialNumToRender={20}
                getItemLayout={(dataSection, index) => ({
                    index,
                    length: elementListHeight, // itemHeight is a placeholder for your amount
                    offset: index * elementListHeight,
                })}
                stickySectionHeadersEnabled
                ItemSeparatorComponent={() => <HRtag borderColor={'white'} borderWidth={2} margin={1}/>}
                sections={dataSection}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => <Item title={item}/>}
                renderSectionHeader={({section: {title}}) => <Text style={styles.header}>{title}</Text>}
            />
            {viewPDFelement.length > 0 && viewPdfContainer && <View style={styles.contwebView}>
                <View style={styles.buttonCloseCont}>
                    <TouchableIcon handlerOnPress={() => {
                        setViewPdfContainer(!viewPdfContainer)
                        setViewPDFelement('')
                    }} heightSVG={30}
                                   WidthSVG={30}
                                   svgName={closeWindowSVG}
                                   touchableStyle={styles.touchableStyle}/>
                </View>
                <WebView
                    textZoom={100}
                    style={styles.webView}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{html: viewPDFelement}}
                />
            </View>}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    item: {
        backgroundColor: COLORS.whitesmoke,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: elementListHeight
    },
    header: {
        fontSize: 20,
        backgroundColor: '#FFF',
        padding: 10,
        color: '#555459',
        fontFamily: 'Anton',
    },
    title: {
        fontSize: 18,
        marginLeft: 5,
        color: '#5b5b5f',
        fontWeight: 'bold'
    },
    textEmpty: {
        fontFamily: 'Anton', fontSize: 24, color: COLORS.primary
    },
    contItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchableStyle: {
        borderRadius: 5,
        padding: 1,
        marginRight: 5,
    },
    contwebView: {
        position: 'absolute',
        flex: 1,
        width: 'auto',
        height: windowHeight - 165,
        top: 5,
        right: 5,
        left: 5,
        margin: 'auto',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: COLORS.primary + 90,
    },
    webView: {
        flex: 1
    },
    buttonCloseCont: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: COLORS.primary + 90,
        padding: 3
    },
    iconBackground: {
        display: 'flex',
        flexDirection: 'row',
        margin: 2,
        width: 30,
        height: 30,
        marginHorizontal: 5,
    }
})

export default DocumentsViewerScreen;
