import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import {COLORS} from "../assets/defaults/settingStyles";
import {Feather as Icon} from "@expo/vector-icons";

export default class PaginationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['', 'medition_name', 'medition_style', 'Head4', 'Head4', 'Head4', 'Head4'],
            tableData: [
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', 'el caballo de san roque', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3], ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],
                ['1', '2', '3', '4', 2, 2, 3],
                ['a', 'b', 'c', 'd', 2, 2, 3],

            ]
        }
    }

    cellWidth = 90;
    TouchableWidth = 40;
    cellMargin = 16;

    numCell(data) {
        let arr = [this.TouchableWidth + (this.cellMargin * 2)];
        for (let i = 0; i < data.length - 1; i++) {
            arr.push(this.cellWidth + (this.cellMargin * 2));
        }
        return arr;
    }

    _alertIndex(index) {
        Alert.alert(`This is row ${index + 1}`);
    }

    render() {
        const state = this.state;
        const element = (data, index) => (
            <TouchableOpacity onPress={() => this._alertIndex(index)} style={{width: this.TouchableWidth, margin: this.cellMargin}}>
                <View style={styles.btn}>
                    <Icon name={'edit'} size={25} color={'white'}/>
                </View>
            </TouchableOpacity>
        );

        return (
            <View style={styles.container}>
                <ScrollView horizontal={true}>
                    <Table borderStyle={{borderColor: 'transparent'}}>
                        <Row data={state.tableHead} style={styles.head} widthArr={this.numCell(this.state.tableHead)}
                             textStyle={[styles.text, {color: COLORS.white, width: this.cellWidth}]}/>
                        <ScrollView style={styles.dataWrapper}>
                            {
                                state.tableData.map((rowData, index) => (
                                    <TableWrapper key={index} style={index % 2 === 0 ? styles.row : styles.row2}>
                                        {
                                            rowData.map((cellData, cellIndex) => (
                                                <Cell key={cellIndex}
                                                      data={cellIndex === 0 ? element(cellData, index) : cellData}
                                                      textStyle={[styles.text, {width: this.cellWidth}]}/>
                                            ))
                                        }
                                    </TableWrapper>
                                ))
                            }
                        </ScrollView>
                    </Table>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 6, paddingTop: 30, backgroundColor: COLORS.white},
    head: {height: 40, backgroundColor: COLORS.primary},
    text: {margin: 6, textAlign: 'center'},
    row: {flexDirection: 'row', backgroundColor: COLORS.white},
    row2: {flexDirection: 'row', backgroundColor: COLORS.primary + '20'},
    btn: {
        padding: 5,
        // backgroundColor: COLORS.contrastprim +'90',
        backgroundColor: COLORS.buttonEdit,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginLeft: 5,
    },
    btnText: {textAlign: 'center', color: COLORS.white},
    dataWrapper: {marginTop: -1},
});