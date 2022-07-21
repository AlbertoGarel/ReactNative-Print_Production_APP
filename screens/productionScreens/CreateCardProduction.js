import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {getDatas, storeData} from "../../data/AsyncStorageFunctions";
import FormCardProduction from "../../components/productions/FormCardProduction";
import {COLORS} from "../../assets/defaults/settingStyles";
import SvgComponent from "../../components/SvgComponent";
import {prodCardSVG} from "../../assets/svg/svgContents";
import {numberOfAutopasters} from "../../utils";

const CreateCardProduction = ({
                                  renderNowItem,
                                  updateGetStorage,
                                  setVisibleCreateCards,
                                  editCardItem,
                                  objsaved,
                                  wordKey,
                                  setIsFocus
                              }) => {

    const _svgData = prodCardSVG;
    const _svgWidth = 70;
    const _svgHeight = 70;

    const [product, getProduct] = useState({});
    const [otherProducts, getOtherProducts] = useState([])
    const [dataPickerAutopasters, setDataPickerAutopasters] = useState([]);

    useEffect(() => {
        getDatas('@simpleProdData')
            .then(r => {
                const restProducts = r.filter(item => item.id !== renderNowItem);
                getOtherProducts(restProducts);

                const thatProduct = r.filter(item => item.id === renderNowItem);
                getProduct(...thatProduct);

                const setNumAutopasters = Math.round(thatProduct[0].pagination);
                // const NumAutopasters = Math.round(setNumAutopasters / 16);
                const NumAutopasters = numberOfAutopasters(setNumAutopasters);

                let arrNums = [];
                for (let i = 1; i <= NumAutopasters; i++) {
                    arrNums.push(i);
                }

                setDataPickerAutopasters(arrNums);
            })
            .catch(error => console.log(error));
    }, [renderNowItem, editCardItem]);

    const addCards = (newCardObject) => {
        const clonProduct = {...product};
        clonProduct.cards = [
            ...clonProduct.cards,
            newCardObject
        ]
        const finalUpdateCards = [...otherProducts, clonProduct];
        storeData('@simpleProdData', finalUpdateCards)
            .then(r => {
                updateGetStorage();
            })
            .catch(error => console.log('error', error));
        setVisibleCreateCards(false);
    }

    return (
        <View style={[styles.parent, {backgroundColor: editCardItem.id ? COLORS.buttonEdit : COLORS.colorSupportfor}]}>
            <View style={styles.contImage}>
                <SvgComponent
                    svgData={_svgData}
                    svgWidth={_svgWidth}
                    svgHeight={_svgHeight}
                />
                <View style={styles.contTitle}>
                    <Text style={styles.titles}>{editCardItem.id ? 'EDICIÓN DE' : 'REGISTRO DE'}</Text>
                    <Text style={styles.titles}>BOBINA</Text>
                </View>
            </View>
            <FormCardProduction
                dataPickerAutopaster={dataPickerAutopasters}
                addCard={addCards}
                editCardItem={editCardItem}
                objsaved={objsaved}
                renderNowItem={renderNowItem}
                updateGetStorage={updateGetStorage}
                wordKey={wordKey}
                setIsFocus={setIsFocus}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    parent: {
        borderRadius: 5,
        padding: 5,
        elevation: 12,
    },
    contImage: {
        padding: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    contTitle: {
        backgroundColor: COLORS.cyan,
    },
    titles: {
        fontSize: 22,
        fontFamily: 'Anton',
        marginLeft: 10,
        textAlign: 'center',
        textShadowColor: COLORS.white,
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1
    }
});
export default CreateCardProduction;