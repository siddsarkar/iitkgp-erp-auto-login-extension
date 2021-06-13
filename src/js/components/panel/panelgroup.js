export default class PanelGroup extends HTMLElement {
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
                .getElementById('panel-group-template')
                .content.cloneNode(true)
        )

        shadowRoot.querySelector('.panel-group-label').textContent =
            this.getAttribute('label') || 'no_label'
        if (this.getAttribute('nodivider') === '') {
            shadowRoot.querySelector('.panel-group-divider').remove()
        }
    }
}
