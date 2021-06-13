import handleMessageResponse from './response'
import { GET_REPOS, GET_STARRED_REPOS, SYNC_USER } from './types'

/**
 * @description Tells background script to perform action based on types
 * @param {string} action type of action
 * @param {object} data additional information like user-inputs
 */
function messageTab(action, data = {}) {
    const sending = browser.runtime.sendMessage({
        action,
        data
    })

    sending.then(handleMessageResponse, (err) => console.log(err))
}

export function userSync() {
    document
        .getElementById('user-sync-icon')
        .classList.toggle('syncing')
    messageTab(SYNC_USER)
}

export function syncRepositories() {
    const syncElement = document.getElementById('sync-repositories')

    syncElement.querySelector(
        '#sync-title-repositories'
    ).textContent = 'Syncing'
    syncElement.querySelector('#last-sync-repositories').textContent =
        ''
    syncElement
        .querySelector('#sync-icon-repositories')
        .classList.toggle('syncing')

    messageTab(GET_REPOS)
}

export function syncStarredRepositories() {
    const syncElement = document.getElementById('sync-starred')

    syncElement.querySelector('#sync-title-starred').textContent =
        'Syncing'
    syncElement.querySelector('#last-sync-starred').textContent = ''
    syncElement
        .querySelector('#sync-icon-starred')
        .classList.toggle('syncing')

    messageTab(GET_STARRED_REPOS)
}
