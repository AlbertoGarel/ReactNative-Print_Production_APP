import React from "react";
import {SvgXml} from "react-native-svg";

function SvgComponent({
                          svgData,svgWidth, svgHeight
                      }) {
    const svgContent = svgData;

    const ToSVGXML = () => <SvgXml xml={svgContent} width={svgWidth} height={svgHeight}/>;
    return <ToSVGXML/>
}

export default SvgComponent;
