import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 *
 * @storage asyncStorage functions
 *
 **/
//Store
export const storeData = async (storageName, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(storageName, jsonValue)
    } catch (err) {
        if (__DEV__) {
            console.error(`To save ${storageName}`, err);
        }
    }
}

//Read
export const getDatas = async (storageName) => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageName)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (err) {
        if (__DEV__) {
            console.error(`To read ${storageName}`, err);
        }
    }
}

//Delete
export const removeValue = async (storageName) => {
    try {
        await AsyncStorage.removeItem(storageName)
    } catch (err) {
        if (__DEV__) {
            console.error(`To remove ${storageName}`, err);
        }
    }

    console.log('Done.')
}