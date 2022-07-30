import React, {useState, useEffect} from 'react';
import {Dimensions, Text, View, StyleSheet, ActivityIndicator, Vibration, TouchableOpacity} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import {getDatas} from "../data/AsyncStorageFunctions";
import {Camera} from 'expo-camera';
import {CameraType, FlashMode} from "expo-camera/build/Camera.types";
import {COLORS} from "../assets/defaults/settingStyles";
import Slider from '@react-native-community/slider';
import {Sentry_Alert} from "../utils";

const finderWidth: number = 280;
const finderHeight: number = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;


const _barCodeTypes = [
    {'qr': BarCodeScanner.Constants.BarCodeType.qr},
    {'aztec': BarCodeScanner.Constants.BarCodeType.aztec},
    {'codabar': BarCodeScanner.Constants.BarCodeType.codabar},
    {'code39': BarCodeScanner.Constants.BarCodeType.code39},
    {'code93': BarCodeScanner.Constants.BarCodeType.code93},
    {'code128': BarCodeScanner.Constants.BarCodeType.code128},
    {'code39mod43': BarCodeScanner.Constants.BarCodeType.code39mod43},
    {'datamatrix': BarCodeScanner.Constants.BarCodeType.datamatrix},
    {'ean13': BarCodeScanner.Constants.BarCodeType.ean13},
    {'ean8': BarCodeScanner.Constants.BarCodeType.ean8},
    {'interleaved2of5': BarCodeScanner.Constants.BarCodeType.interleaved2of5},
    {'itf': BarCodeScanner.Constants.BarCodeType.itf14},
    {'maxicode': BarCodeScanner.Constants.BarCodeType.maxicode},
    {'pdf417': BarCodeScanner.Constants.BarCodeType.pdf417},
    {'rss14': BarCodeScanner.Constants.BarCodeType.rss14},
    {'rssexpanded': BarCodeScanner.Constants.BarCodeType.rssexpanded},
    {'upc_a': BarCodeScanner.Constants.BarCodeType.upc_a},
    {'upc_e': BarCodeScanner.Constants.BarCodeType.upc_e},
    {'upc_ean': BarCodeScanner.Constants.BarCodeType.upc_ean}
];

const BarcodeScannerComponent = ({props}) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [initScanState, setInitScanState] = useState(false);
    const [barcodeTypesSelected, getBarcodeTypesSelected] = useState([]);
    const [flashMode, setFlashMode] = useState(FlashMode.off)
    const [sliderValue, setSlidervalue] = useState(0);

    useEffect(() => {
            let isMounted = true;

            (async () => {
                const {status} = await BarCodeScanner.requestPermissionsAsync();
                if (isMounted) setHasPermission(status === 'granted');
            })();
            //GET TO asyncStorage
            getDatas('@storage_codeTypesSelected').then(r => {
                if (r) {
                    const cloneRequest = [...r];
                    const formatSelectedTypes = [];
                    cloneRequest.forEach((codeItem, index) => {
                        if (codeItem.checkValue === true) {
                            formatSelectedTypes.push(Object.values(_barCodeTypes.filter(i => codeItem.checkName === Object.keys(i)[0])[0])[0]);
                        }
                    });
                    getBarcodeTypesSelected(formatSelectedTypes);
                } else {
                    getBarcodeTypesSelected([{
                        "checkName": "itf",
                        "checkValue": true,
                    }])
                }
            })
                .catch(err => Sentry_Alert('BarcodeScannerComponent.js', 'getDatas - @storage_codeTypesSelected', err));

            if (props.isVisible && hasPermission) {
                const initScan = setTimeout(() => {
                    setInitScanState(true);
                });

                return () => clearTimeout(initScan);
            } else {
                setInitScanState(false);
            }

            return () => isMounted = false;
        }, [hasPermission, props.isVisible]
    )

    const handleBarCodeScanned = (scanningResult) => {
            if (!scanned) {
                const {type, data, bounds: {origin} = {}} = scanningResult;
                setScanned(true);
                Vibration.vibrate();
                props.getScannedCode({scannedCode: data, codeType: type});
            }
        }
    ;

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    function __handleFlashMode() {
        if (flashMode === FlashMode.off) {
            setFlashMode(FlashMode.torch)
        } else {
            setFlashMode(FlashMode.off)
        }
    }

    return (
        <View style={{flex: 1, margin: 2}}>
            {
                !scanned && props.isVisible && initScanState ?
                    <Camera
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barCodeScannerSettings={{
                            barCodeTypes: [
                                ...barcodeTypesSelected,
                            ],
                        }}
                        flashMode={flashMode}
                        style={{flex: 1}}
                        type={CameraType.back}
                        autoFocus={true}
                        zoom={sliderValue}
                    >
                        <TouchableOpacity
                            onPress={__handleFlashMode}
                            style={[styles.touchTorch, {backgroundColor: flashMode === 'off' ? COLORS.buttonEdit + 20 : '#fff'}]}
                        >
                            <Text style={{fontSize: 20}}> ⚡️ </Text>
                        </TouchableOpacity>
                        <BarcodeMask width={width / 1.5} height={height / 3} edgeColor="#ff8500" showAnimatedLine
                                     useNativeDriver={true}/>
                        <View style={{
                            backgroundColor: COLORS.buttonEdit + 20,
                            position: 'absolute',
                            width: 30,
                            top: 0,
                            bottom: 0,
                            right: 0,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Slider
                                style={{width: 200, height: 40, transform: [{rotate: "-90deg"}]}}
                                minimumValue={0}
                                maximumValue={1}
                                thumbTintColor="#FF8500"
                                minimumTrackTintColor="#FF8500"
                                maximumTrackTintColor="#FFFFFF"
                                onValueChange={value => setSlidervalue(value)}
                            />
                        </View>
                    </Camera>
                    :
                    <View
                        style={styles.actIndicator}>
                        <ActivityIndicator size="large" color="#ff8500"/>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    actIndicator: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchTorch: {
        position: 'absolute',
        left: 10,
        top: 10,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
});

export default BarcodeScannerComponent;