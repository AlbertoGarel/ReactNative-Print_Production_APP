import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
    Text,
    Dimensions,
    Image
} from 'react-native';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import {COLORS} from "../../assets/defaults/settingStyles";
import {Feather as Icon} from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import {HandlingErrorsSQLITE} from "../../dbCRUD/actionsSQL";
import {deleteMeditionStyle} from "../../dbCRUD/actionsSQL";
import {Sentry_Alert} from "../../utils";

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [],
            tableData: [],
            items: [],
            indicator: true,
            warning: false
        };
    };

    db = SQLite.openDatabase('bobinas.db');

    cellWidth = 85;
    TouchableWidth = 50;
    cellMargin = 16;

    requestDB(requestProps) {
        //'PRAGMA foreign_keys = ON;'
        this.db.exec([{sql: 'PRAGMA foreign_keys = ON;', args: []}], false, (error, resultSet) => {
        });

        this.db.transaction(tx => {
            tx.executeSql(
                requestProps,
                [],
                (_, {rows: {_array}}) => {
                    if (_array.length > 0) {
                        this.setState({
                            items: _array,
                        });
                        const val = this.state.items.map(item => {
                            return ['', ...Object.values(item)];
                        });
                        // console.log(this.state.items)
                        this.setState({
                            tableHead: ['', ...Object.keys(this.state.items[0])],
                            tableData: [...val],
                            indicator: false,
                            warning: false
                        })
                    } else {
                        this.setState({
                            indicator: false,
                            warning: true
                        })
                    }
                }
            );
        }, err => Sentry_Alert('App.js', 'transaction - requestProps', err));
    };

    componentDidMount() {
        this.requestDB(this.props.request.allItems);
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.requestDB(this.props.request.allItems);
    }

    numCell(data) {
        let arr = [this.TouchableWidth + (this.cellMargin * 2)];
        for (let i = 0; i < data.length - 1; i++) {
            arr.push(this.cellWidth + (this.cellMargin * 2));
        }
        return arr;
    };

    _alertIndex(id) {
        Alert.alert(`This is id ${id}`);
    };

    _deleteByID(param, elementID) {
        this.db.transaction(tx => {
            tx.executeSql(param,
                [elementID],
                (_, result) => {
                    console.log(result);
                    this.requestDB(this.props.request.allItems);
                },
                (_, error) => {
                    Sentry_Alert('Tables.js', 'transaction - _deleteByID', error)
                })
        })
    };

    _actionCRUD(itemID) {
        Alert.alert(
            'MODIFICAR REGISROS',
            `ELIJA UNA OPCIÓN`,
            [
                {
                    text: 'CANCEL',
                    onPress: () => console.log('Ask me later pressed')
                },
                {
                    text: 'BORRAR',
                    onPress: () => this._confirmDelete(itemID),
                    style: 'cancel'
                },
                {text: 'ACTUALIZAR', onPress: () => this.props._onPress('ACTUALIZAR', itemID)}
            ],
            {cancelable: false}
        );
    };

    _confirmDelete(itemID) {
        Alert.alert(
            'ELIMINAR REGISTRO',
            `¿ DESEA ELIMINAR REGISTRO CON ID ${itemID} ?`,
            [
                {
                    text: 'CANCELAR',
                    onPress: () => console.log('Ask me later pressed')
                },
                {
                    text: 'SÍ, ESTOY SEGURO.',
                    onPress: () => this._deleteByID(this.props.request.deleteItem, itemID),
                    style: 'cancel'
                }
                // {text: 'ACTUALIZAR', onPress: () => this.props._onPress('ACTUALIZAR', itemID)}
            ],
            {cancelable: false}
        );
    };


    render() {
        const state = this.state;

        const element = (index) => (
            !this.props.disable ?
                <TouchableOpacity onPress={() => this._actionCRUD(index[1])}
                                  style={{width: this.TouchableWidth, margin: this.cellMargin}}>
                    <View style={styles.btn}>
                        <Icon name={'edit'} size={25} color={'white'}/>
                    </View>
                </TouchableOpacity>
                :
                <TouchableOpacity disabled={true}
                                  style={{width: this.TouchableWidth, margin: this.cellMargin}}>
                    <View style={[styles.btn, {opacity: .4}]}>
                        <Icon name={'edit'} size={25} color={'white'}/>
                    </View>
                </TouchableOpacity>
        );

        return (
            !this.state.indicator ?
                <View style={[styles.container, {maxHeight: Dimensions.get('screen').height / 1.7}]}>
                    {this.state.warning ?
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image
                                style={{
                                    width: 200,
                                    height: 200,
                                    opacity: .6
                                }}
                                source={require('../../assets/images/error.png')}
                            />
                            <Text style={{
                                fontSize: 25,
                                color: "#FFF",
                                marginTop: 50,
                                fontFamily: 'Anton',
                                textShadowColor: COLORS.black,
                                textShadowOffset: {width: 0.5, height: 0.5},
                                textShadowRadius: 1
                            }}
                            >No existen registros todavía...</Text>
                        </View>
                        :
                        <ScrollView horizontal={true}>
                            <Table borderStyle={{borderColor: 'transparent'}}>
                                <Row data={state.tableHead} style={styles.head}
                                     widthArr={this.numCell(this.state.tableHead)}
                                     textStyle={[styles.text, {color: COLORS.white, width: this.cellWidth}]}/>
                                <ScrollView style={styles.dataWrapper}>
                                    {
                                        state.tableData.map((rowData, index) => (
                                            <TableWrapper key={index}
                                                          style={index % 2 === 0 ? styles.row : styles.row2}>
                                                {
                                                    rowData.map((cellData, cellIndex) => (
                                                        <Cell key={cellIndex}
                                                              data={cellIndex === 0 ? element(rowData, rowData) : cellData}
                                                              textStyle={[styles.text, {width: this.cellWidth}]}/>
                                                    ))
                                                }
                                            </TableWrapper>
                                        ))
                                    }
                                </ScrollView>
                            </Table>
                        </ScrollView>
                    }
                </View>
                :
                <ActivityIndicator size="large" color="#00ff00"/>
        );
    };
};

const styles = StyleSheet.create({
    container: {padding: 6, backgroundColor: 'transparent', alignSelf: 'center'},
    head: {height: 'auto', backgroundColor: COLORS.primary},
    text: {margin: 16, textAlign: 'center'},
    row: {flexDirection: 'row', backgroundColor: COLORS.white},
    row2: {flexDirection: 'row', backgroundColor: COLORS.primary + '20'},
    btn: {
        padding: 5,
        backgroundColor: COLORS.buttonEdit,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginLeft: 5,
    },
    btnText: {textAlign: 'center', color: COLORS.white},
    dataWrapper: {marginTop: -1},
});

export default Tables;