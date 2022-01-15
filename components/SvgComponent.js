import React from "react";
import {SvgXml} from "react-native-svg";

function SvgComponent({
                          svgData,svgWidth, svgHeight, color = '#000'
                      }) {
    const svgContent = svgData;

    const ToSVGXML = () => <SvgXml xml={svgContent} width={svgWidth}
                                   height={svgHeight}  fill={color}/>;
    return <ToSVGXML/>
}

export default SvgComponent;
