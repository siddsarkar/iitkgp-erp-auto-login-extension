export default {
    getItem: (key) =>
        new Promise((resolve) =>
            chrome.storage.local.get([key], (res) => resolve(res))
        ),
    setItem: ({ ...values }) =>
        new Promise((resolve) =>
            chrome.storage.local.set(
                {
                    ...values
                },
                () => resolve()
            )
        ),
    removeItem: (key) =>
        new Promise((resolve) =>
            chrome.storage.local.remove([key], (res) => resolve(res))
        ),
    getAllKeys: () =>
        new Promise((resolve) =>
            chrome.storage.local.get(null, (res) => resolve(res))
        ),
    removeAllKeys: () => chrome.storage.local.clear()
}
