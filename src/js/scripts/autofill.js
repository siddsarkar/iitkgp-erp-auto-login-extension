const loginid = document.getElementById('user_id')
const quesn = document.getElementById('question')
const answer = document.getElementById('answer')
const answerdiv = document.getElementById('answer_div')
const pass = document.getElementById('password')
const inject = document.getElementById('signin')
// const btn = document.getElementsByClassName('btn btn-primary')4

answerdiv.addEventListener('change', (e) => console.log(e))

/**
 * @description Displays message on top of page
 * @param {string} message
 */
function displayMessage(message, color = '#45a1ff') {
    if (document.getElementById('erpautologinmessage')) {
        document.getElementById('erpautologinmessage').remove()
    }

    const msg = document.createElement('div')
    msg.id = 'erpautologinmessage'
    msg.setAttribute(
        'style',
        `background: ${color};color: #ffffff;font-weight:500; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center;flex-direction:row`
    )
    msg.textContent = message
    document.body.prepend(msg)
}

function authstart(cred) {
    console.log('hhhu')
    inject.focus()
    loginid.focus()
    loginid.value = cred.username
    loginid.blur()
    pass.value = cred.password
    setTimeout(() => {
        if (quesn.innerHTML === cred.q1) {
            answer.value = cred.a1
            // setTimeout(() => {
            //     btn[0].click()
            // }, 100)
        } else if (quesn.innerHTML === cred.q2) {
            answer.value = cred.a2
            // setTimeout(() => {
            //     btn[0].click()
            // }, 100)
        } else if (quesn.innerHTML === cred.q3) {
            answer.value = cred.a3
            // setTimeout(() => {
            //     btn[0].click()
            // }, 100)
        } else {
            displayMessage('BAD CREDENTIALS ! Please check again!')
        }
    }, 3000)
}

browser.storage.local.get('authCredentials').then((data) => {
    if (!data.authCredentials)
        return displayMessage('No Login Info Found!')
    authstart(data.authCredentials)
})
