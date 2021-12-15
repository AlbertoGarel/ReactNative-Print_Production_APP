import React from 'react';
import {View, Text} from 'react-native';

const ComsumptionResultCard = ({styleCopsumptionComponent, conumptionRes}) => {

    return (
        <View style={[styleCopsumptionComponent.parent,
            {backgroundColor: conumptionRes < 0 ? '#FF9999' : null}]}>
            <Text style={styleCopsumptionComponent.textTitle}>Consumo:</Text>
            <Text
                style={[styleCopsumptionComponent.textWeightData, {color: conumptionRes < 0 ? 'white' : 'black'}]}>{conumptionRes}
                <Text
                    style={styleCopsumptionComponent.textWeightUnit}> Kg.</Text></Text>
        </View>
    )
}

export default React.memo(ComsumptionResultCard, (prevProps, nextProps) => {
   return (prevProps.conumptionRes === nextProps.conumptionRes)
});