import React, {forwardRef} from 'react';
import {View} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';


const BottomSheetComponent = (props, ref) => {

    return (
        <View>
            <RBSheet
                ref={ref}
                closeOnDragDown={true}
                {...props}
            >
                {props.children}
            </RBSheet>
        </View>
    )
}

export default forwardRef(BottomSheetComponent);