const MESSAGE_ELEMENT_ID = 'erp_auto_login_message'

const displayMessageOnErpLoginPage = (message: string, color = '#45a1ff') => {
  if (document.getElementById(MESSAGE_ELEMENT_ID)) {
    ;(document.getElementById(MESSAGE_ELEMENT_ID) as HTMLElement).remove()
  }

  const msg = document.createElement('div') as HTMLDivElement
  msg.setAttribute('id', MESSAGE_ELEMENT_ID)
  msg.setAttribute(
    'style',
    `background: ${color};color: #ffffff;font-weight:500; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center;flex-direction:row`
  )
  msg.textContent = message
  document.body.prepend(msg)
}

export default displayMessageOnErpLoginPage
