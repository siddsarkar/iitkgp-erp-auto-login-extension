import displayMessage from '../helpers/displayMessage'
import WebCrypto from '../utils/crypto'
import storage from '../utils/storage'

console.log('filling partial data...')
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
;(async () => {
    const crypto = new WebCrypto()
    const storageKeys = await storage.getAllKeys()

    console.log(storageKeys)

    const loginId = document.getElementById('user_id')
    const question = document.getElementById('question')
    const answer = document.getElementById('answer')
    const pass = document.getElementById('password')
    const inject = document.getElementById('signin')
    // const loginBtn = document.getElementsByClassName('btn btn-primary')

    async function authStart(res) {
        const { credentials: cred, preferences } = res

        inject.focus()
        loginId.focus()
        loginId.value = cred.rollno
        loginId.blur()

        await sleep(1000)

        if (!preferences.requirePin) {
            pass.value = cred.password

            if (question.innerHTML === cred.q1) {
                answer.value = cred.a1
                // clickLoginButton()
            } else if (question.innerHTML === cred.q2) {
                answer.value = cred.a2
                // clickLoginButton()
            } else if (question.innerHTML === cred.q3) {
                answer.value = cred.a3
                // clickLoginButton()
            } else {
                displayMessage('Credentials not set!')
            }
        } else {
            const pin = prompt('Please enter your 4 digit pin')
            try {
                pass.value = await crypto.decrypt(cred.password, pin)

                if (question.innerHTML === cred.q1) {
                    answer.value = await crypto.decrypt(cred.a1, pin)
                    // clickLoginButton()
                } else if (question.innerHTML === cred.q2) {
                    answer.value = await crypto.decrypt(cred.a2, pin)

                    // clickLoginButton()
                } else if (question.innerHTML === cred.q3) {
                    answer.value = await crypto.decrypt(cred.a3, pin)

                    // clickLoginButton()
                } else {
                    displayMessage('Credentials not set!')
                }
            } catch (error) {
                displayMessage('Incorrect PIN!')
            }
        }
    }

    if (!storageKeys.credentials)
        return displayMessage('No Login Info Found!')
    authStart(storageKeys)
})()

// eslint-disable-next-line no-unused-vars
// function clickLoginButton() {
//     setTimeout(() => {
//         loginBtn[0].click()
//     }, 100)
// }
