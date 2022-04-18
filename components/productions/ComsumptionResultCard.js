import React from 'react';
import {View, Text} from 'react-native';

const ComsumptionResultCard = ({styleCopsumptionComponent, consumptionRes}) => {

    return (
        <View style={[styleCopsumptionComponent.parent,
            {backgroundColor: consumptionRes < 0 ? '#FF9999' : null}
            ]}>
            <Text style={styleCopsumptionComponent.textTitle}>Consumo:</Text>
            <Text
                style={[styleCopsumptionComponent.textWeightData, {color: consumptionRes < 0 ? 'white' : 'black'}]}
            >{consumptionRes}
                <Text
                    style={styleCopsumptionComponent.textWeightUnit}> Kg.</Text></Text>
        </View>
    )
}

export default React.memo(ComsumptionResultCard, (prevProps, nextProps) => {
   return (prevProps.consumptionRes === nextProps.consumptionRes)
});