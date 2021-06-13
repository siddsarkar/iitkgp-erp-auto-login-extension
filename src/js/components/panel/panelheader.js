'use-strict'

export default class PanelHeader extends HTMLElement {
    set href(val) {
        if (val) {
            this.shadowRoot.querySelector('a').href = val
        }
    }

    /**
     * @param {string} val
     */
    set title(val) {
        if (val) {
            this.shadowRoot.querySelector(
                '.panel-header-title'
            ).textContent = val
        }
    }

    constructor() {
        super()
        const shadowRoot = this.attachShadow({ mode: 'open' })

        const link = document.createElement('link')
        link.setAttribute('type', 'text/css')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute(
            'href',
            browser.runtime.getURL('css/popup.css')
        )

        shadowRoot.appendChild(link)
        shadowRoot.appendChild(
            document
                .getElementById('panel-header-template')
                .content.cloneNode(true)
        )

        shadowRoot.querySelector('a').href = this.getAttribute('href')
        shadowRoot.querySelector('.panel-header-title').textContent =
            this.getAttribute('title')
    }
}
