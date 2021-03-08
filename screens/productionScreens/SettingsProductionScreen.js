import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, View, StatusBar, SafeAreaView, Text} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Footer from '../../components/onboardingComponents/FooterOnboarding';
// import Page from '../../components/onboardingComponents/Page';
import {useNavigation} from '@react-navigation/native';
import SettingsProductionHeader from "../../components/headers/SettingsProductionHeader";
import BgComponent from "../../components/BackgroundComponent/BgComponent";
import {logo} from "../../assets/svg/svgContents";

const SettingsProductionScreen = () => {
    const navigation = useNavigation();
    const pagerRef = useRef(null);
    const [pagenumber, setPagenumber] = useState('1')
    const handlePageChange = pageNumber => {
        pagerRef.current.setPage(pageNumber);
        setPagenumber(pageNumber + 1);
    };
    //BACKGROUND PROP CONST
    const optionsSVG = {
        svgData: logo, svgWidth: '100%', svgHeight: '100%'
    };
    const optionsStyleContSVG = {
        width: '100%', height: '100%', top: 0, right: 0, opacity: .05
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            handlePageChange(0);
        });
        return unsubscribe;
    }, [navigation])

    return (
        // SafeAreView don't accept padding.
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                <StatusBar
                    animated={true}
                    backgroundColor="#61dafb"
                    barStyle={'light-content'}
                    showHideTransition={'slide'}
                    hidden={true}
                />
                <ViewPager style={{flex: 1}}
                           initialPage={0}
                           ref={pagerRef}
                           scrollEnabled={true}
                           orientation={"horizontal"}
                           keyboardDismissMode={'none'}
                           showPageIndicator={true}
                >
                    <View key="1">
                        <View style={styles.contPrinc}>
                            <BgComponent
                                svgOptions={optionsSVG}
                                styleOptions={optionsStyleContSVG}
                            />
                            <SettingsProductionHeader
                                pagenumber={pagenumber}
                                explanation={'Texto explicativo para rellenar campos de configuración.'}
                            />
                        </View>
                        <Footer
                            backgroundColor="#FA6D28"
                            rightButtonLabel="Next"
                            rightButtonPress={() => {
                                handlePageChange(1);
                            }}
                        />
                    </View>
                    <View key="2">
                        <View style={styles.contPrinc}>
                            <BgComponent
                                svgOptions={optionsSVG}
                                styleOptions={optionsStyleContSVG}
                            />
                            <SettingsProductionHeader
                                pagenumber={pagenumber}
                                explanation={'Texto explicativo para rellenar campos de configuración.'}
                            />
                        </View>
                        <Footer
                            backgroundColor="#F85F23"
                            rightButtonLabel="Next"
                            rightButtonPress={() => {
                                handlePageChange(2);
                            }}
                            leftButtonLabel="Back"
                            leftButtonPress={() => {
                                handlePageChange(0);
                            }}
                        />
                    </View>
                    <View key="3">
                        <View style={styles.contPrinc}>
                            <BgComponent
                                svgOptions={optionsSVG}
                                styleOptions={optionsStyleContSVG}
                            />
                            <SettingsProductionHeader
                                pagenumber={pagenumber}
                                explanation={'Texto explicativo para rellenar campos de configuración.'}
                            />
                        </View>
                        <Footer
                            backgroundColor="#F2441B"
                            leftButtonLabel="Back"
                            leftButtonPress={() => {
                                handlePageChange(1);
                            }}
                            rightButtonLabel="Continue"
                            rightButtonPress={() => {
                                navigation.navigate('HomeStack');
                            }}
                        />
                    </View>
                </ViewPager>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    contPrinc: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
});

export default SettingsProductionScreen;
