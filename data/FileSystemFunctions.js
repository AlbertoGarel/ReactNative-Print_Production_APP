import * as FileSystem from 'expo-file-system';
import * as Print from "expo-print";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import {Platform} from 'react-native';

/**
 * FOLDER NAME FOR SAVE FILES
 * */
export const appFolder = `${FileSystem.documentDirectory}documentsAppBobinas/`;

// CREATE APP FOLDER THAT DON`T ALREADY EXIST.
/**
 *
 * CREATE FOLDER FOR SAVE FILES.
 *
 * @param type: string (folder name)
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
            // Report folder creation error, include the folder existence before and now
            const new_folder_info = await FileSystem.getInfoAsync(folder_path);
            const debug = `checkAndCreateFolder: ${
                error.message
            } old:${JSON.stringify(folder_info)} new:${JSON.stringify(
                new_folder_info
            )}`;
            console.log(debug);
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
        console.log('exist folder', info.exists)
    } catch (err) {
        return console.log('NO exist folder', err)
    }
}
/**
 *
 * READ AND LIST FILES OF FOLDER EXIST.
 *
 * @param folder_path type: string (folder name)
 * @return A Promise that resolves to an array of strings, each containing the name of a file or directory contained in the directory at fileUri.
 *
 * */
export const readFolder = async (folder_path = appFolder) => {
    try {
        return await FileSystem.readDirectoryAsync(folder_path)
    } catch (err) {
        return err
    }
};
/**
 *
 * DELETE FILES ON DOCUMENT DIRECTORY.
 *
 * @param fileName type: string (folder name)
 * @return A Promise that resolves to an array of strings, each containing the name of a file or directory contained in the directory at fileUri.
 *
 * */
export const deleteFile = async fileName => {
    await FileSystem.deleteAsync(appFolder + fileName);
}

// PRINT
/**
 *
 * CREATE PDF FILES FROM HTML AND SAVE IN APP FOLDER
 *
 * @param fileName type: string (folder name)
 * @param html type: string (HTML CODE)
 *
 * */
export const createAndSavePDF = async (fileName, html) => {
    try {
        const {uri} = await Print.printToFileAsync({html});
        await FileSystem.copyAsync({from: uri, to: appFolder + fileName + '.pdf'});
    } catch (error) {
        console.error(error);
    }
};
/**
 *
 * GET URI FOR LOCAL FILE.
 *
 * */
export const getLocalURI = async fileName => {
    try {
        await Sharing.shareAsync(appFolder + fileName, {
            UTI: '.pdf',
            mimeType: 'application/pdf'
        });
    } catch (e) {
        alert('error fileURI')
    }
}

//CAPACITY ASYNC
export const diskcapacity = async () => {
    try {
        const free = await FileSystem.getFreeDiskStorageAsync();
        const total = await FileSystem.getTotalDiskCapacityAsync();
        return {freeDisk: free, totalDisk: total}
    } catch (e) {
        console.log(e)
    }
};
