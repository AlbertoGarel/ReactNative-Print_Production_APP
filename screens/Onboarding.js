import React, {useRef, useEffect, useState} from 'react';
import {View, StatusBar, SafeAreaView, Text} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Footer from '../components/onboardingComponents/FooterOnboarding';
import Page from '../components/onboardingComponents/Page';
import {useNavigation} from '@react-navigation/native';

const Onboarding = () => {
    const navigation = useNavigation();

    const pagerRef = useRef(null);

    const handlePageChange = pageNumber => {
        pagerRef.current.setPage(pageNumber);
    };

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            handlePageChange(0);
        });
        return unsubscribe;
    },[navigation])

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
                        <Page
                            backgroundColor="#ffc93c"
                            iconName="sun"
                            title="Welcome to the weather app"
                        />
                        <Footer
                            backgroundColor="#ffc93c"
                            rightButtonLabel="Next"
                            rightButtonPress={() => {
                                handlePageChange(1);
                            }}
                        />
                    </View>
                    <View key="2">
                        <Page
                            backgroundColor="#07689f"
                            iconName="cloud-drizzle"
                            title="Get updates on weather"
                        />
                        <Footer
                            backgroundColor="#07689f"
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
                        <Page
                            backgroundColor="#ff689f"
                            iconName="hourglass"
                            title="Last Page"
                        />
                        <Footer
                            backgroundColor="#ff689f"
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

export default Onboarding;
