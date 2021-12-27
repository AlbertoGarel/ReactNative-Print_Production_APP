import React, {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, SectionList, StyleSheet, Text, View} from 'react-native';
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
    sendDataSmartPhoneSVG,
    trashSVG,
    viewFileSVG
} from "../assets/svg/svgContents";
import {COLORS, shadowPlatform} from "../assets/defaults/settingStyles";
import HRtag from "../components/HRtag";
import TouchableIcon from "../components/TouchableIcon";
import {WebView} from 'react-native-webview';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DocumentsViewerScreen = ({navigation, route}) => {

    const [spinner, setSpinner] = useState(true);
    const [files, getFiles] = useState([]);
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
            .catch(err => console.log(err));
        readFolder()
            .then(response => {
                if (isMounted) {
                    getFiles(response);
                    getDataSection(group(response));
                    setSpinner(false);
                    getReload(false);
                }
            })
            .catch(err => console.log('error en profile', err));

        return () => isMounted = false;
    }, [reload]);

    // GROUP FILES FOR DATE.
    const group = (arrayToGroup) => {
        const groupedForSectionList = arrayToGroup.reduce((acc, item) => {
            const title = item.split('_')[0];
            acc[title] ?
                acc[title]['data'].push(item)
                :
                acc[title] = {title: title, data: [item]};
            return acc;
        }, {});
        return Object.values(groupedForSectionList);
    };

    const handlerDelete = (title) => {
        deleteFile(title).then(() => getReload(true));
    };

    const Item = ({title}) => (
        <View style={styles.item}>
            <View style={styles.contItem}>
                <SvgComponent svgData={pdfSVG} svgHeight={20} svgWidth={20}/>
                <Text style={styles.title}>{title.split('_')[1]}</Text>
            </View>
            <View style={styles.contItem}>
                <TouchableIcon handlerOnPress={() => handlerViewPdf(title)} heightSVG={30}
                               WidthSVG={30}
                               svgName={viewFileSVG}
                               touchableStyle={styles.touchableStyle}/>
                <TouchableIcon handlerOnPress={() => sendFile(title)} heightSVG={30} WidthSVG={30}
                               svgName={sendDataSmartPhoneSVG} touchableStyle={styles.touchableStyle}/>
                <TouchableIcon handlerOnPress={() => handlerDelete(title)} heightSVG={30} WidthSVG={30}
                               svgName={trashSVG}
                               touchableStyle={styles.touchableStyle}/>
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
                <SvgComponent svgData={pdfSVG} svgHeight={100} svgWidth={100}/>
                <Text style={styles.textEmpty}>Ningún archivo guardado</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {Object.keys(totalCapacity).length > 0 && <View style={styles.absolutePos}>
                <Text
                    style={[styles.textDiskCap, {color: COLORS.buttonEdit}]}>{(totalCapacity.freeDisk * 0.0000000010).toFixed(2)} Gb</Text>
                <View style={{borderWidth: .5, borderColor: COLORS.primary, width: '60%'}}/>
                <Text
                    style={[styles.textDiskCap, {color: COLORS.primary}]}>{Math.floor(totalCapacity.totalDisk * 0.0000000010)} Gb</Text>
            </View>}
            <SectionList
                extraData={reload}
                stickySectionHeadersEnabled
                ItemSeparatorComponent={() => <HRtag borderColor={'white'} borderWidth={2} margin={1}/>}
                sections={dataSection}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => <Item title={item}/>}
                renderSectionHeader={({section: {title}}) => <Text style={styles.header}>{title}</Text>}
            />
            {viewPDFelement.length > 0 && viewPdfContainer && <View style={styles.contwebView}>
                <View style={styles.buttonCloseCont}>
                    <TouchableIcon handlerOnPress={() => setViewPdfContainer(!viewPdfContainer)} heightSVG={30}
                                   WidthSVG={30}
                                   svgName={closeWindowSVG}
                                   touchableStyle={styles.touchableStyle}/>
                </View>
                <WebView
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
        // paddingTop: StatusBar.currentHeight,
    },
    item: {
        backgroundColor: COLORS.whitesmoke,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    header: {
        fontSize: 20,
        backgroundColor: '#fff',
        padding: 10
    },
    title: {
        fontSize: 18,
        marginLeft: 5,
        textTransform: 'capitalize'
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
    absolutePos: {
        fontSize: 10,
        zIndex: 99,
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF9B9',
        borderRadius: 35,
        ...shadowPlatform
    },
    textDiskCap: {
        fontSize: 10,
        fontWeight: 'bold'
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
    }
})
export default DocumentsViewerScreen;
