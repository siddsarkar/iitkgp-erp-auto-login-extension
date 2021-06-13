import * as types from './types'

class Link {
    constructor() {
        this.element = document
            .getElementById('link-template')
            .content.cloneNode(true)
    }

    set textContent(title) {
        this.element.querySelector(
            '.panel-content-link-title'
        ).textContent = title
    }

    set icon(iconName) {
        this.element
            .querySelector('.primary-icon')
            .setAttribute('href', `/assets/defs.svg#${iconName}`)
    }

    set url(url) {
        this.element.querySelector('a').href = url
    }

    get node() {
        this.element
            .querySelector('.panel-content-link')
            .classList.add('dynamic')
        return this.element
    }
}

export default function handleMessageResponse(response) {
    switch (response.action) {
        case types.SYNC_USER:
            {
                const syncElement =
                    document.getElementById('user-sync-icon')
                syncElement.classList.toggle('syncing')
                syncElement
                    .querySelector('use')
                    .setAttribute(
                        'href',
                        browser.runtime.getURL(
                            '/assets/defs.svg#check'
                        )
                    )
            }
            break
        case types.GET_STARRED_REPOS:
            {
                console.log(response.payload)
                const { payload } = response
                if (!payload) {
                    const syncElement =
                        document.getElementById('sync-starred')
                    syncElement.querySelector(
                        '#sync-title-starred'
                    ).textContent = 'Sync Now'
                    syncElement.querySelector(
                        '#last-sync-starred'
                    ).textContent = `Last synced ${new Date().toISOString()}`
                    syncElement
                        .querySelector('#sync-icon-starred')
                        .classList.toggle('syncing')
                    return
                }
                document
                    .getElementById('starred-content')
                    .querySelectorAll('.panel-content-link.dynamic')
                    .forEach((ele) => ele.remove())

                for (let i = 0; i < payload.length; i += 1) {
                    const starLink = new Link()
                    starLink.icon = 'star'
                    starLink.textContent = payload[i].name
                    starLink.url = payload[i].html_url

                    document
                        .getElementById('starred-content')
                        .appendChild(starLink.node)
                }

                const syncElement =
                    document.getElementById('sync-starred')
                syncElement.querySelector(
                    '#sync-title-starred'
                ).textContent = 'Sync Now'
                syncElement.querySelector(
                    '#last-sync-starred'
                ).textContent = `Last synced ${new Date().toISOString()}`
                syncElement
                    .querySelector('#sync-icon-starred')
                    .classList.toggle('syncing')
            }
            break
        case types.GET_REPOS:
            {
                console.log(response.payload)
                const { payload } = response

                document
                    .getElementById('repositories-content')
                    .querySelectorAll('.panel-content-link.dynamic')
                    .forEach((ele) => ele.remove())

                for (let i = 0; i < payload.length; i += 1) {
                    const repoLink = new Link()
                    repoLink.icon = payload[i].fork ? 'fork' : 'repo'
                    repoLink.textContent = payload[i].name
                    repoLink.url = payload[i].html_url

                    document
                        .getElementById('repositories-content')
                        .appendChild(repoLink.node)
                }

                const syncElement = document.getElementById(
                    'sync-repositories'
                )
                syncElement.querySelector(
                    '#sync-title-repositories'
                ).textContent = 'Sync Now'
                syncElement.querySelector(
                    '#last-sync-repositories'
                ).textContent = `Last synced ${new Date().toISOString()}`
                syncElement
                    .querySelector('#sync-icon-repositories')
                    .classList.toggle('syncing')
            }
            break
        default:
            break
    }
}
