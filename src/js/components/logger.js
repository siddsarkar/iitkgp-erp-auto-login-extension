export default function logger(
    message,
    iconId = 'info',
    actions = false,
    onClickYes = () => {},
    onclickCancel = () => {}
) {
    const log = document.getElementById('log')
    const logIcon = document.getElementById('logIcon')
    const logText = document.getElementById('logText')

    log.className = iconId
    logText.textContent = message
    logIcon.setAttribute(
        'href',
        chrome.runtime.getURL(`/assets/icons.svg#${iconId || 'info'}`)
    )

    if (actions) {
        const actionBtnYes = document.createElement('div')
        actionBtnYes.className = 'action'
        actionBtnYes.textContent = 'Yes'

        const actionBtnCancel = document.createElement('div')
        actionBtnCancel.className = 'action'
        actionBtnCancel.textContent = 'Cancel'

        log.appendChild(actionBtnYes)
        log.appendChild(actionBtnCancel)

        actionBtnYes.onclick = () => {
            log.removeChild(actionBtnYes)
            log.removeChild(actionBtnCancel)
            onClickYes()
        }

        actionBtnCancel.onclick = () => {
            log.removeChild(actionBtnYes)
            log.removeChild(actionBtnCancel)
            onclickCancel()
        }
    }
}
