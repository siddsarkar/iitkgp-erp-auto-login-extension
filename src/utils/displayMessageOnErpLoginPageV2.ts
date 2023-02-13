const MESSAGE_ELEMENT_ID = 'erp_auto_login_message'

function displayMessageOnErpLoginPageV2(errorMessage: string, color = '#45a1ff') {
  if (document.getElementById(MESSAGE_ELEMENT_ID)) (document.getElementById(MESSAGE_ELEMENT_ID) as HTMLElement).remove()

  const msg = document.createElement('div')
  msg.textContent = errorMessage.toString()
  msg.id = 'popup-error'
  msg.setAttribute(
    'style',
    `z-Index: 2147483647 !important;
      position: fixed !important;
      top: 20px !important;
      left: 20px !important;
      right: 20px !important;
      border-radius: 8px !important;
      font-size: 14px !important;
      font-weight: 400;
      // background-color: rgba(42, 42, 46, 1.0) !important;
      background-color: ${color} !important;
      padding: 10px 12px !important;
      text-align: center !important;
      color: #fff !important;`
  )

  document.body.append(msg)
  setTimeout(msg.remove.bind(msg), 5000)
}

export default displayMessageOnErpLoginPageV2
