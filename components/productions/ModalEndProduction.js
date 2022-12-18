import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Text, Image, Animated} from 'react-native';
import {COLORS} from "../../assets/defaults/settingStyles";
import BorderedButton from "../BorderedButton";

const ModalEndProduction = ({
                                windowWidth,
                                windowHeight,
                                nameProduction,
                                handler
                            }) => {

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim])

    return (
        <View style={[styles.parent, {width: windowWidth, height: windowHeight}]}>
            <View style={[styles.content, {width: windowWidth / 1.2, height: windowHeight / 1.5}]}>
                <View style={styles.header}>
                    <Text style={styles.title}>{nameProduction}</Text>
                </View>
                <View style={styles.body}>
                    <Image resizeMode='contain' style={styles.image}
                           source={require('../../assets/images/clipboards.png')}/>
                    <Animated.Image resizeMode='contain' style={{...styles.imageAbsolute, opacity: fadeAnim}}
                                    source={require('../../assets/images/check.png')}/>
                </View>
                <View style={styles.action}>
                    <Text style={styles.text}>Informe creado en "Documentos". Producción
                        eliminada de la base de datos.</Text>
                    <BorderedButton
                        text={"volver a inicio"}
                        styleButton={styles.button}
                        styleText={styles.textButton}
                        handlerFunction={handler}
                    />
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        backgroundColor: '#00000050',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 5
    },
    header: {
        padding: 5,
        width: '100%',
    },
    body: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.whitesmoke,
        borderRadius: 10,
    },
    action: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    title: {
        fontSize: 18,
        textTransform: 'uppercase',
        color: COLORS.primary,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    image: {
        width: '100%'
    },
    imageAbsolute: {
        position: 'absolute',
        width: '50%'
    },
    button: {
        backgroundColor: COLORS.primary,
        marginVertical: 0,
        padding: 10,
        borderRadius: 5
    },
    textButton: {
        color: COLORS.white,
        textTransform: 'uppercase',
        textAlign: 'center',

    },
    text: {
        textAlign: 'justify',
        fontWeight: 'bold',
        padding: 20
    }
});
export default ModalEndProduction;