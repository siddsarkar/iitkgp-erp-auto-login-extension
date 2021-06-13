export default {
    getItem: async (key, defaultValue) => {
        const value = await browser.storage.local.get(key)

        if (!value) {
            return defaultValue
        }
        return value[key]
    },
    setItem: async ({ ...values }) => {
        await browser.storage.local.set({
            ...values
        })
    },
    getAllKeys: () => browser.storage.local.get()

    // removeItem: (key) => AsyncStorage.removeItem(key),
    // multiGet: (keys) => AsyncStorage.multiGet(keys),
    // flushGetRequests: () => AsyncStorage.flushGetRequests()
}
