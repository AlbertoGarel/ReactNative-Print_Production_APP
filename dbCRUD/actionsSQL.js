import * as SQLite from 'expo-sqlite';
import {Asset} from "expo-asset";

const FileSystem = require("expo-file-system");

/**
 * @fileoverview Actions for CRUD db
 *
 * @author Albertogarel
 * @version 0.1
 */

/**
 *  Open database SQlite
 *
 *  @return
 *  @param pathToDatabaseFile: string
 * */
export async function openDatabase(pathToDatabaseFile: "../www/bobinas.db"): SQLite.WebSQLDatabase {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
    }
    await FileSystem.downloadAsync(
        Asset.fromModule(require("../www/bobinas.db")).uri,
        FileSystem.documentDirectory + 'SQLite/bobinas.db'
    );
    return SQLite.openDatabase('bobinas.db');
}