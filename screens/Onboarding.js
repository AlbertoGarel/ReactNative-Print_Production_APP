import React, {useEffect, useRef} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import Footer from '../components/onboardingComponents/FooterOnboarding';
import Page from '../components/onboardingComponents/Page';
import {useNavigation} from '@react-navigation/native';

const Onboarding = ({initialpage}) => {
    const navigation = useNavigation();

    const pagerRef = useRef(null);

    const handlePageChange = pageNumber => {
        pagerRef.current.setPage(pageNumber);
    };

    useEffect(()=>{
        return navigation.addListener('focus', () => {
            handlePageChange(0);
        });
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
                <PagerView style={{flex: 1}}
                           initialPage={initialpage}
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
                </PagerView>
            </View>
        </SafeAreaView>
    );
};

export default Onboarding;
