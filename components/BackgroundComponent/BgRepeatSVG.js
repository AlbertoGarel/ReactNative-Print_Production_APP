import React from 'react';
import {Dimensions, View} from 'react-native';
import SvgComponent from "../SvgComponent";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BgRepeatSVG = ({styleOptions, svgOptions}) => {
    let numSVGAnchor = Math.round(windowWidth / svgOptions.svgWidth);
    let numSVGheight = Math.round(windowHeight / svgOptions.svgHeight);

    let totalToRepeat = numSVGAnchor + (numSVGheight * numSVGAnchor);
    let items = []
    const repeated = () => {
        for (let i = 0; i < totalToRepeat; i++) {
            items.push(<SvgComponent key={i}
                                     {...svgOptions}
            />)
        }
        return items;
    }
    return (
        <View style={[{
            // backgroundColor: 'white',
            width: numSVGAnchor * 100,
            heigth: numSVGheight * 100,
            position: 'absolute',
            // flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            overflow: 'hidden'
        }, {...styleOptions}]}>
            {repeated()}
        </View>
    )
};

export default BgRepeatSVG;