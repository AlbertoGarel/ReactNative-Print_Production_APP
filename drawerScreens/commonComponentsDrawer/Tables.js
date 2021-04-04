import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
    Modal,
    TouchableHighlight,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
    Image
} from 'react-native';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import {COLORS} from "../../assets/defaults/settingStyles";
import {Feather as Icon} from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [''],
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
                        console.log(this.state.items)
                        this.setState({
                            tableHead: [...this.state.tableHead, ...Object.keys(this.state.items[0])],
                            tableData: [...val],
                            indicator: false,
                            modalVisible: false
                        })
                    } else {
                        this.setState({
                            indicator: false,
                            warning: true
                        })
                    }
                }
            );
        });
    };

    componentDidMount() {
        this.requestDB(this.props.request);
    };

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if (nextState.items.length !== this.state.items.length) {
            this.setState(this.state.items);
        }
    };

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

    render() {
        const state = this.state;

        const element = (index) => (
            !this.props.disable ?
                <TouchableOpacity onPress={() => this._alertIndex(index[1])}
                                  style={{width: this.TouchableWidth, margin: this.cellMargin}}>
                    <View style={styles.btn}>
                        <Icon name={'edit'} size={25} color={'white'}/>
                    </View>
                </TouchableOpacity>
                :
                <TouchableWithoutFeedback disabled={true}
                                          style={{width: this.TouchableWidth, margin: this.cellMargin}}>
                    <View style={[styles.btn, {opacity: .4}]}>
                        <Icon name={'edit'} size={25} color={'white'}/>
                    </View>
                </TouchableWithoutFeedback>
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
                                textShadowOffset: { width: 0.5, height: 0.5 },
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
                    <Modal
                        presentationStyle="overFullScreen"
                        animationType="slide"
                        visible={this.props.modal}
                        // onShow={() => {
                        //     Alert.alert('Modal has been opened.');
                        // }}
                        // onRequestClose={() => {
                        //     Alert.alert('Modal has been closed.');
                        // }}
                        style={{backgroundColor: 'red'}}
                    >
                        <TouchableHighlight
                            style={{backgroundColor: '#2196F3', marginTop: 10}}
                            onPress={() => {
                                this.props._onPress();
                            }}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                    </Modal>
                </View>
                :
                <ActivityIndicator size="large" color="#00ff00"/>
        );
    };
};

const styles = StyleSheet.create({
    container: {padding: 6, backgroundColor: 'transparent', alignSelf: 'center'},
    head: {height: 40, backgroundColor: COLORS.primary},
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