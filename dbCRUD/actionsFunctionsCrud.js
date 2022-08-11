import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('bobinas.db');

export function genericTransaction(request, valueArr) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(request, valueArr,
                (_, {rows: {_array}}) => resolve(_array),
                (_, err) => reject(err));
        });
    });
};

export function genericUpdatefunction(request, valueArr) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(request, valueArr,
                (_, result) => resolve(result),
                (_, err) => reject(err));
        }, err => err);
    });
};

export function genericInsertFunction(request, valueArr) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(request, valueArr,
                (_, result) => resolve(result),
                (_, err) => reject(err));
        }, err => err);
    });
};

export function genericUpdateFunctionConfirm(request, valueArr) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(request, valueArr,
                (_, result) => resolve(result.rowsAffected));
        }, err => err);
    });
};

export function genericDeleteFunction(request, valueArr) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(request, valueArr,
                (_, result) => resolve(result),
                (_, err) => reject(err));
        }, err => err);
    });
};

