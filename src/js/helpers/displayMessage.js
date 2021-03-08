/**
 * @description Displays message on top ERP Login Page
 * @param {string} message
 * @param color
 */
export default function displayMessage(message, color = '#45a1ff') {
    if (document.getElementById('message')) {
        document.getElementById('message').remove()
    }

    const msg = document.createElement('div')
    msg.id = 'message'
    msg.setAttribute(
        'style',
        `background: ${color};color: #ffffff;font-weight:500; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center;flex-direction:row`
    )
    msg.textContent = message
    document.body.prepend(msg)
}
