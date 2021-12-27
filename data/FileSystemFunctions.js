import * as FileSystem from 'expo-file-system';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from 'expo-intent-launcher';

/**
 * FOLDER NAME FOR SAVE FILES
 * */
export const appFolder = `${FileSystem.documentDirectory}documentsAppBobinas/`;
export const appHTMLfolderForPdf = `${FileSystem.documentDirectory}documentsHTMLAppBobinas/`;

// FILESYSTEM
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
        return err
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
export const createAndSaveHTML = async (fileName, html) => {
    try {
        await FileSystem.writeAsStringAsync(appHTMLfolderForPdf + fileName + '.html', html);
    } catch (error) {
        console.error(error);
    }
};

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
export const createAndSavePDF = async (fileName, html) => {
    try {
        const {uri} = await Print.printToFileAsync({html});
        await FileSystem.copyAsync({from: uri, to: appFolder + fileName + '.pdf'});
    } catch (error) {
        console.error(error);
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
    } catch (e) {
        alert('error fileURI')
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
    } catch (e) {
        console.log(e)
    }
};
