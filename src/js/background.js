/**
 * * ------------ README FIRST ----------------
 *
 * ? Use `background.js` only to execute user actions
 * ? Follow redux pattern dispatch -> execute(here) -> respond
 *
 * TODO: Add Onboarding/Welcome Page
 * TODO: Add more functions
 */

import fetchVersionHistory from './api/addon'

/** ***********
 * FUNCTIONS *
 ************ */

/**
 * @param {string} currentVersion current version eg: "0.0.1"
 */
const fetchUpdate = async (currentVersion = '1.0') => {
    const { results } = await fetchVersionHistory()

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
