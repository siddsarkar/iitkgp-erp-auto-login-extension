export default class PanelGroupItem extends HTMLElement {
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
                .getElementById('panel-group-item-template')
                .content.cloneNode(true)
        )

        const type = this.getAttribute('type')
        const startIcon = shadowRoot.querySelector(
            '#panelGroupItemStartIcon'
        )

        const endIcon = shadowRoot.querySelector(
            '#panelGroupItemEndIcon'
        )

        startIcon.firstElementChild.setAttribute(
            'href',
            browser.runtime.getURL(
                `/assets/icons.svg#${
                    this.getAttribute('icon') || 'info'
                }`
            )
        )

        if (type === 'checkbox') {
            const endText = shadowRoot.querySelector(
                '#panelGroupItemEndText'
            )
            startIcon.style.display = 'none'
            endIcon.style.display = 'none'

            const input = document.createElement('input')
            input.setAttribute('type', 'checkbox')
            input.setAttribute('id', this.getAttribute('id'))
            shadowRoot
                .querySelector('.panel-group-item-start')
                .appendChild(input)

            endText.style.display = 'block'
        } else if (type === 'link') {
            endIcon.firstElementChild.setAttribute(
                'href',
                browser.runtime.getURL(
                    `/assets/icons.svg#chevron-right`
                )
            )
        } else if (type === 'button') {
            const endText = shadowRoot.querySelector(
                '#panelGroupItemEndText'
            )
            endIcon.style.display = 'none'
            endText.style.display = 'block'
        } else {
            shadowRoot
                .querySelector('.panel-group-item')
                .addEventListener('click', () => {
                    setTimeout(() => {
                        window.close()
                    }, 10)
                })
        }

        shadowRoot.querySelector(
            '.panel-group-item-title'
        ).textContent = this.getAttribute('title')
    }
}
