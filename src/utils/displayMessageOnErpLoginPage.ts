const MESSAGE_ELEMENT_ID = 'erp_auto_login_message'

const displayMessageOnErpLoginPage = (message: string, color = '#45a1ff') => {
  if (document.getElementById(MESSAGE_ELEMENT_ID)) {
    ;(document.getElementById(MESSAGE_ELEMENT_ID) as HTMLElement).remove()
  }

  const msg = document.createElement('div') as HTMLDivElement
  msg.setAttribute('id', MESSAGE_ELEMENT_ID)
  msg.setAttribute(
    `style`,
    `background-image: linear-gradient(to right, ${color}, rgb(237,78,80));color: #ffffff;font-weight:500; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center;flex-direction:row`
  )
  msg.textContent = message

  // const text = document.createElement('span')
  // text.textContent = message

  // const closeBtn = document.createElement('button')
  // closeBtn.setAttribute('style', 'margin-left: 10px; border: none; background-color: transparent; color: #ffffff;')
  // closeBtn.textContent = 'x'

  // closeBtn.addEventListener('click', () => {
  //   msg.remove()
  // })

  // msg.append(text, closeBtn)
  document.body.prepend(msg)
}

export default displayMessageOnErpLoginPage
