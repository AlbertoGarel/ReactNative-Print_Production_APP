import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from "prop-types";

const ComsumptionResultCard = ({styleCopsumptionComponent, conumptionRes}) => {

    return (
        <View style={[styleCopsumptionComponent.parent,
            {backgroundColor: conumptionRes < 0 ? '#FF9999' : null}
        ]}>
            <Text style={styleCopsumptionComponent.textTitle}>Consumo:</Text>
            <Text
                style={[styleCopsumptionComponent.textWeightData, {color: conumptionRes < 0 ? 'white' : 'black'}]}
            >{conumptionRes}
                <Text
                    style={styleCopsumptionComponent.textWeightUnit}> Kg.</Text></Text>
        </View>
    )
}

ComsumptionResultCard.propTypes = {
    styleCopsumptionComponent: PropTypes.object.isRequired,
    consumptionRes: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default ComsumptionResultCard