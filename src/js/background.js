/**
 * * ------------ README FIRST ----------------
 *
 * ? Use `background.js` only to execute user actions
 * ? Follow redux pattern dispatch -> execute(here) -> respond
 *
 * TODO: Add Onboarding/Welcome Page
 * TODO: Add more functions
 */

/** ***********
 * FUNCTIONS *
 ************ */

/**
 * @param {string} currentVersion current version eg: "0.0.1"
 */
const fetchUpdate = async (currentVersion = '1.0') => {
    const UPDATE_URL =
        'https://addons.mozilla.org/api/v5/addons/addon/erp-auto-login-iitkgp/versions/?page_size=1'
    const res = await fetch(UPDATE_URL, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    const { results } = await res.json()

    if (results[0].version === currentVersion) {
        return {
            type: 'success',
            message: 'You are on latest update!'
        }
    }
    return {
        type: 'warning',
        message: `Update Available - ${results[0].version}`,
        update: results[0]
    }
}

/**
 * @description handles message in redux-style
 * @returns object response that includes requested action
 */
/* eslint-disable no-unused-vars */
function messageHandler(request, sender, sendResponse) {
    if (request.action === 'update_check') {
        return fetchUpdate(
            browser.runtime.getManifest().version
        ).then((res) => ({ ...res, action: request.action }))
    }
}

browser.runtime.onMessage.addListener(messageHandler)
