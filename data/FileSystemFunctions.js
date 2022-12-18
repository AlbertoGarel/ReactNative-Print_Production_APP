import * as FileSystem from 'expo-file-system';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from 'expo-document-picker';
import * as SQLite from "expo-sqlite";
import {Alert} from 'react-native';
import {arrayEquals, Sentry_Alert} from "../utils";

/**
 * FOLDER NAME FOR SAVE FILES
 * */
export const appFolder = `${FileSystem.documentDirectory}documentsAppBobinas/`;
export const appHTMLfolderForPdf = `${FileSystem.documentDirectory}documentsHTMLAppBobinas/`;
export const dataBaseFolder = FileSystem.documentDirectory + 'SQLite'

// FILESYSTEM
/**
 *
 * CREATE FOLDER FOR SAVE FILES.
 *
 * @param folder_path type: string (folder name)
 *
 * */
export const checkAndCreateFolder = async (folder_path = appFolder) => {
    const folder_info = await FileSystem.getInfoAsync(folder_path);
    if (!Boolean(folder_info.exists)) {
        // Create folder
        try {
            await FileSystem.makeDirectoryAsync(folder_path, {
                intermediates: true
            })
        } catch (error) {
            if (__DEV__) {
                // Report folder creation error, include the folder existence before and now
                const new_folder_info = await FileSystem.getInfoAsync(folder_path);
                const debug = `checkAndCreateFolder: ${
                    error.message
                } old:${JSON.stringify(folder_info)} new:${JSON.stringify(
                    new_folder_info
                )}`;
                console.log(debug);
            }
            Sentry_Alert('FileSystemFunctions.js', 'checkAndCreateFolder', error)
        }
    }
};

/**
 *
 * CHECK FOLDER EXIST.
 *
 * @param folder_path type: string (folder name)
 *
 * */
export const checkExistFolder = async (folder_path = appFolder) => {
    try {
        let info = await FileSystem.getInfoAsync(folder_path)
        return info.exists;
    } catch (err) {
        Sentry_Alert('FileSystemFunctions.js', 'checkExistFolder', err)
    }
};

/**
 *
 * READ AND LIST FILES OF FOLDER EXIST.
 *
 * @param folder_path type: string (file pdf name)
 * @return A Promise that resolves to an array of strings, each containing the name of a file or directory contained in the directory at fileUri.
 *
 * */
export const readFolder = async (folder_path = appFolder) => {
    try {
        return await FileSystem.readDirectoryAsync(folder_path)
    } catch (err) {
        Sentry_Alert('FileSystemFunctions.js', 'readFolder', err)
    }
};

/**
 *
 * DELETE FILES ON DOCUMENT DIRECTORY.
 *
 * @param fileName type: string (file pdf name)
 *
 * */
export const deleteFile = async fileName => {
    //DELETE PDF AND HTML FILE.
    const changeExt = fileName.replace('.pdf', '.html');
    await FileSystem.deleteAsync(appFolder + fileName);
    await FileSystem.deleteAsync(appHTMLfolderForPdf + changeExt);
};

/**
 *
 * CREATE HTML FILES AND SAVE IN HTML APP FOLDER FOR USE EN WEBVIEW COMPONENT AS STRING.
 *
 * @param fileName type: string (folder name)
 * @param html type: string (HTML CODE)
 *
 * */
// export const createAndSaveHTML = async (fileName, html) => {
//     try {
//         await FileSystem.writeAsStringAsync(appHTMLfolderForPdf + fileName + '.html', html);
//     } catch (error) {
//         console.error(error);
//     }
// };

/**
 * READ AS STRING STORED HTML FILE.
 *
 * @param fileName type: string (file pdf name)
 *
 * @return html as string.
 * */
export const readFileHTMLFromDocumentDirectory = async fileName => {
    const changeExt = fileName.replace('.pdf', '.html');
    return await FileSystem.readAsStringAsync(appHTMLfolderForPdf + changeExt, {encoding: FileSystem.EncodingType.UTF8})
};

// PRINT
/**
 *
 * CREATE PDF FILES FROM HTML AND SAVE IN APP FOLDER
 *
 * @param fileName type: string (file pdf name)
 * @param html type: string (HTML CODE)
 *
 * */
export const createAndSavePDF_HTML_file = async (fileName, html) => {
    try {
        const contentPath = await FileSystem.readDirectoryAsync(appFolder);
        const searchEqualName = contentPath.filter(i => i.split(/[\(\.]/)[0] === fileName);
        const finallyName = searchEqualName.length > 0 ? `${fileName}(${searchEqualName.length})` : fileName;
        const {uri} = await Print.printToFileAsync({html});
        await FileSystem.copyAsync({from: uri, to: appFolder + finallyName + '.pdf'});
        await FileSystem.writeAsStringAsync(appHTMLfolderForPdf + finallyName + '.html', html);
        return {
            nameFile: finallyName + '.pdf',
            fileURI: appFolder + finallyName + '.pdf'
        }
    } catch (error) {
        Sentry_Alert('FileSystemFunctions.js', 'createAndSavePDF_HTML_file', error)
    }
};

// SHARE PDF FILE.
/**
 * SHARE LOCAL FILE.
 *
 * @param fileName type: string (file pdf name)
 *
 * */
export const sendFile = async fileName => {
    try {
        await Sharing.shareAsync(appFolder + fileName, {
            UTI: '.pdf',
            mimeType: 'application/pdf'
        });
    } catch (err) {
        Sentry_Alert('FileSystemFunctions.js', 'sendFile', err)
    }
};

//CAPACITY ASYNC
/**
 * GETS TOTAL AND AVAILABLE INTERNAL DISK STORAGE, IN BYTES.
 *
 * @return js object {freeDisk: number, totalDisk: number}
 *
 * */
export const diskcapacity = async () => {
    try {
        const free = await FileSystem.getFreeDiskStorageAsync();
        const total = await FileSystem.getTotalDiskCapacityAsync();
        return {freeDisk: free, totalDisk: total}
    } catch (err) {
        Sentry_Alert('FileSystemFunctions.js', 'diskcapacity', err)
    }
};
/**
 *
 * SHARE LOCAL FILE.
 *
 * */
export const sendDataBase = async () => {
    try {
        await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/bobinas.db');
    } catch (err) {
        Sentry_Alert('FileSystemFunctions.js', 'sendDataBase', err)
    }
};
/**
 *
 * IMPORT LOCAL DATABASE FILE.
 *
 * */
export const importDataBase = async (fakeMessage) => {
    try {
        let sql = 'SELECT * FROM sqlite_master WHERE type = "table"'
        const databaseToImport = await DocumentPicker.getDocumentAsync({
            type: "application/octet-stream",
            copyToCacheDirectory: true,
            multiple: false
        })

        if (databaseToImport.type !== 'success') {
            // throw 1 // return for not display innecessary alert.
            return;
        }

        const Importedversion = SQLite.openDatabase(databaseToImport);
        const db = SQLite.openDatabase('bobinas.db');

        // CHECK DATABASE VERSION. IF ARE DISTINCT NO CONTINUE
        if (Importedversion.version !== db.version) {
            if (Importedversion.version > db.version) {
                throw new Error(2);
            } else if (Importedversion.version < db.version) {
                throw new Error(3);
            } else {
                throw new Error(4);
            }
        }
        //READ DIRECTORY DOCUMENTPICKER CACHE.
        const documentpickerfolder = await FileSystem.readDirectoryAsync((`${FileSystem.cacheDirectory}DocumentPicker`))

        //CREATE FOLDER IN FileSystem.documentDirectory FOR UPLOADED DATABASE FILE.
        if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/imported')).exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite/imported');
        }

        // COPY AND RENAME FILE TO UPLOADED DATABASE FILE.
        await FileSystem.copyAsync({
            from: FileSystem.cacheDirectory + 'DocumentPicker/' + documentpickerfolder[0],
            to: FileSystem.documentDirectory + 'SQLite/imported/imported.db'
        });

        // CHECK EXIST CREATED FILE IN DOCUMENTDIRECTORY/IMPORTED.
        if (await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/imported/imported.db')) {
            const importedDb = SQLite.openDatabase('imported/imported.db')

            let promise1 = new Promise((resolve, reject) => {
                importedDb.transaction((tx) => {
                    tx.executeSql(sql, [],
                        (_, result) => resolve(result.rows._array.map(i => i.name)),
                        (_, err) => reject(err));
                }, err => Sentry_Alert('FileSystemFunctions.js', 'transaction - promise1', err));
            });
            let promise2 = new Promise((resolve, reject) => {
                db.transaction((tx) => {
                    tx.executeSql(sql, [],
                        (_, result) => resolve(result.rows._array.map(i => i.name)),
                        (_, err) => reject(err));
                }, err => Sentry_Alert('FileSystemFunctions.js', 'transaction - promise2', err));
            });

            //RESOLVE PROMISES
            const promiseAllResult = await Promise.all([promise1, promise2]);

            //SUBSTRACT "ANDROID METADATA" AND COMPARE ARRAY TABLE COLUMN NAMES.
            const areEquals = await arrayEquals(
                promiseAllResult[0].filter(i => i !== "android_metadata"),
                promiseAllResult[1].filter(i => i !== "android_metadata")
            );

            if (areEquals) {
                // EQUALS COPY DATABASE FILE TO DEFAULT DIRECTORY.
                Alert.alert('¡¡ATENCIÓN', 'Se dispone a instalar una base de datos distinta. ¿está de acuerdo?', [
                    {
                        text: 'Cancelar',
                        onPress: () => alert('Importación de base de datos cancelada por usuario.'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: async () => {
                            await FileSystem.copyAsync({
                                from: FileSystem.documentDirectory + 'SQLite/imported/imported.db',
                                to: FileSystem.documentDirectory + 'SQLite/bobinas.db'
                            });
                            setTimeout(() => {
                                fakeMessage('Instalación completa')
                            }, 1000);
                        }
                    },
                ]);
            } else {
                throw new Error(5);
            }
        }
    } catch (e) {
        let message = '';
        switch (e.message) {
            case 1:
                message = 'Importación de base de datos cancelada por ususario.'
                break;
            case 2:
                message = '¡¡ERROR!!, versión de base de datos no compatible. Versión posterior.'
                break;
            case 3:
                message = '¡¡ERROR!!, versión de base de datos no compatible.  Versión anterior.'
                break;
            case 4:
            case 5:
            default:
                message = '¡¡ERROR!! Base de datos incompatible';
        }
        alert(message);
    } finally {
        // CLEAN CACHE FOLDER IF EXIST
        if ((await FileSystem.getInfoAsync(FileSystem.cacheDirectory + 'DocumentPicker')).exists) {
            await FileSystem.deleteAsync(FileSystem.cacheDirectory + 'DocumentPicker');
        }
    }
}