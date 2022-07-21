import React, {useState, useRef} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, View, Dimensions} from "react-native";
import ImageSection from "./ImageSection";
import TextContainer from "./TextContainer";
import IntroductionFooter from "./IntroductionFooter";
import {introdata} from "../../data/introductionData";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const IntroductionScreen = ({setFirstPresentation}) => {
    const [indx, getIndx] = useState(0);
    const slider = useRef(null);

    function handleScrollEnd(e) {
        if (!e) {
            return
        }
        const {nativeEvent} = e;
        if (nativeEvent && nativeEvent.contentOffset) {
            let currentSlide = 0;
            if (nativeEvent.contentOffset.x === 0) {
                getIndx(currentSlide)
            } else {
                const approxCurrentSlide = nativeEvent.contentOffset.x / windowWidth
                currentSlide = parseInt(Math.ceil(approxCurrentSlide.toFixed(2)))
                getIndx(currentSlide)
            }
        }
    }

    function handlerButtons(typeButton) {

        if (typeButton === 'back') {
            getIndx(indx - 1);
            slider.current.scrollTo({x: windowWidth * (indx - 1), y: 0, animated: true})
        }
        if (typeButton === 'next' && indx < (introdata.length) - 1) {
            getIndx(indx + 1);
            slider.current.scrollTo({x: windowWidth * (indx + 1), y: 0, animated: true})
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                <ScrollView
                    style={{width: windowWidth, height: '100%'}}
                    ref={slider}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScrollEnd}
                >
                    {introdata.map((i, index) => {
                        return (
                            <View key={index} style={styles.parent}>
                                <ImageSection
                                    windowWidth={windowWidth}
                                    imageURI={i.image}
                                />
                                <TextContainer
                                    title={i.title}
                                    text={i.text}
                                />
                            </View>
                        )
                    })
                    }
                </ScrollView>
                <IntroductionFooter
                    indice={indx}
                    datalength={introdata.length - 1}
                    handler={handlerButtons}
                    setFirstPresentation={setFirstPresentation}
                />
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    parent: {
        flex: 1,
        flexDirection: 'column',
        width: windowWidth,
        height: 'auto',
        backgroundColor: '#ff0000'
    }
});

export default IntroductionScreen;