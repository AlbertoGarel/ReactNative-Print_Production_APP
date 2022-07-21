import React, {useState, useEffect} from 'react';
import {Dimensions, Text, View, StyleSheet, ActivityIndicator, Vibration} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import {getDatas} from "../data/AsyncStorageFunctions";

const finderWidth: number = 280;
const finderHeight: number = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

// set back camera
const type = "back";

const BarcodeScannerComponent = ({props}) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [initScanState, setInitScanState] = useState(false);
    const [barcodeTypesSelected, getBarcodeTypesSelected] = useState([]);

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
                            formatSelectedTypes.push('BarCodeScanner.Constants.BarCodeType.' + codeItem.checkName);
                        }
                    });
                    getBarcodeTypesSelected(formatSelectedTypes);
                } else {
                    getBarcodeTypesSelected([{
                        "checkName": "code128",
                        "checkValue": true,
                    }])
                }
            });

            if (props.isVisible && hasPermission) {
                const initScan = setTimeout(() => {
                    setInitScanState(true);
                }, 250);

                return () => clearTimeout(initScan);
            } else {
                setInitScanState(false);
            }

            return () => isMounted = false;
        }, [hasPermission, props.isVisible]
    )

    const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {
        if (!scanned) {
            const {type, data, bounds: {origin} = {}} = scanningResult;

            const {x, y} = origin;
            if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
                setScanned(true);
                Vibration.vibrate();
                props.getScannedCode({scannedCode: data, codeType: type});
            }
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={{flex: 1, margin: 2}}>
            {
                props.isVisible && initScanState ?
                    <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
                                    type={type}
                                    barCodeTypes={
                                        barcodeTypesSelected.length > 0 ?
                                            [...barcodeTypesSelected]
                                            :
                                            //BY DEFAULT
                                            [BarCodeScanner.Constants.BarCodeType.code128]
                                    }
                                    style={[StyleSheet.absoluteFillObject, styles.container]}
                    >
                        <BarcodeMask edgeColor="#ff8500" showAnimatedLine/>
                    </BarCodeScanner>
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
    text: {
        color: 'red'
    },
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
    }
});

export default BarcodeScannerComponent;