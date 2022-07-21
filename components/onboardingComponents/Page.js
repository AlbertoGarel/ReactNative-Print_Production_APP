import React from 'react';
import { View, Text } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import {COLORS} from "../../assets/defaults/settingStyles";
import PropTypes from "prop-types";
import BgComponent from "../BackgroundComponent/BgComponent";

const Page = ({ backgroundColor, iconName, title }) => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor
            }}
        >
            <Icon name={iconName} size={172} color={COLORS.white} />
            <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>
                    {title}
                </Text>
            </View>
        </View>
    );
};

Page.propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default Page;
