import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('bobinas.db');

export function genericUpdatefunction(request, valueArr) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(request, valueArr,
                (_, result) => resolve(result),
                (_, err) => reject(err));
        });
    });
};

export function genericInsertFunction(request, valueArr) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(request, valueArr,
                (_, result) => resolve(result),
                (_, err) => reject(err));
        });
    });
};

export function genericUpdateFunctionConfirm(request, valueArr) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(request, valueArr,
                (_, result) => resolve(result.rowsAffected),
                (_, err) => reject(err));
        });
    });
};

export function genericDeleteFunction(request, valueArr) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(request, valueArr,
                (_, result) => resolve(result),
                (_, err) => reject(err));
        });
    });
};

