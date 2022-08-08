const displayMessageOnPopup = (
  message: string,
  type = 'info',
  actions = false,
  onClickYes = () => {},
  onclickCancel = () => {}
) => {
  const log = document.getElementById('log') as HTMLElement
  const logIcon = document.getElementById('logIcon') as HTMLElement
  const logText = document.getElementById('logText') as HTMLElement

  const status = document.getElementById('status') as HTMLElement
  const statusIcon = document.getElementById('statusIcon') as HTMLElement
  const statusText = document.getElementById('statusText') as HTMLElement

  let iconId
  log.className = type

  status.style.backgroundColor = 'yellow'
  switch (type) {
    case 'warning':
      iconId = 'warning'
      break
    case 'error':
      iconId = 'cross'
      break
    case 'success':
      iconId = 'check'
      status.style.backgroundColor = 'lightgreen'
      break

    default:
      iconId = 'info'
      break
  }

  logText.textContent = message
  logIcon.setAttribute('href', chrome.runtime.getURL(`/assets/sprite.svg#${iconId || 'info'}`))

  statusText.textContent = message
  statusIcon.setAttribute('href', chrome.runtime.getURL(`/assets/sprite.svg#${iconId || 'info'}`))

  if (actions) {
    document.querySelectorAll('.action').forEach((el) => el.remove())

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

export default displayMessageOnPopup
