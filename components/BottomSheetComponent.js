import React, {forwardRef, useState} from 'react';
import {
    StyleSheet,
    View,
    Alert
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';


const BottomSheetComponent = (props, ref) => {

    // const [isFocus, setIsFocus] = useState(false);
    //
    // //Unmount BarcodeScanner
    // useFocusEffect(
    //     React.useCallback(() => {
    //         setIsFocus(true);
    //         return () => {
    //             setIsFocus(false);
    //         };
    //     }, [])
    // );
    //
    // if (!isFocus) {
    //     Alert.alert('ver');
    //     return <></>;
    // }

    return (
        <View>
            <RBSheet
                ref={ref}
                closeOnDragDown={true}
                {...props}
            >
                {/*<View*/}
                {/*    style={{*/}
                {/*        width: '100%',*/}
                {/*        height: '100%',*/}
                {/*        backgroundColor: '#f1f3f6',*/}
                {/*        alignItems: 'center',*/}
                {/*        // paddingTop: 50,*/}
                {/*    }}*/}
                {/*>*/}
                {/*<Text style={{fontSize: 20}}>*/}
                {/*    Checkout More Apps by Akul Srivastava*/}
                {/*</Text>*/}
                {/*<TouchableOpacity*/}
                {/*    style={[styles.iconButton, {marginTop: 20}]}*/}
                {/*    onPress={() => {*/}
                {/*        Linking.openURL(*/}
                {/*            'https://play.google.com/store/apps/developer?id=Akul+Srivastava'*/}
                {/*        );*/}
                {/*    }}*/}
                {/*>*/}
                {/*    /!*<Icon name='google-play' type='font-awesome-5' />*!/*/}
                {/*    <Text style={{fontSize: 18, marginLeft: 12}}>*/}
                {/*        Google Play*/}
                {/*    </Text>*/}
                {/*</TouchableOpacity>*/}
                {props.children}
                {/*</View>*/}
            </RBSheet>
            {/*<TouchableOpacity*/}
            {/*    style={[*/}
            {/*        styles.button,*/}
            {/*        {backgroundColor: '#3B3B98', marginTop: 0},*/}
            {/*    ]}*/}
            {/*    onPress={() => {*/}
            {/*        bottomSheetRef.current.open();*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Text style={styles.submitButtonText}>More Apps</Text>*/}
            {/*</TouchableOpacity>*/}
        </View>
    )
}

const styles = StyleSheet.create({
    iconButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        marginTop: 10,
    },
    submitButtonText: {
        backgroundColor: 'red'
    }
})
export default forwardRef(BottomSheetComponent);