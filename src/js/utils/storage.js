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
    removeItem: async (key) => {
        await browser.storage.local.remove(key)
    },
    getAllKeys: () => browser.storage.local.get(),
    removeAllKeys: async () => browser.storage.local.clear()
}
