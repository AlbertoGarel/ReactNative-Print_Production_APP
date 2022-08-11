import React, {forwardRef} from 'react';
import {ActivityIndicator, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const BottomSheetComponent = (props, ref) => {
    const ComponetChildren = () => props.children;

    return (
        <View>
            <RBSheet
                ref={ref}
                closeOnDragDown={true}
                closeOnPressMask={true}
                animationType='fade'
                {...props}
            >
                {props.modalVisible ?
                    <ComponetChildren/>
                    :
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'black',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <ActivityIndicator size="large" color="#ff8500"/>
                    </View>
                }
            </RBSheet>
        </View>
    )
}

export default forwardRef(BottomSheetComponent);