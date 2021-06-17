import displayMessage from '../helpers/displayMessage'

const loginId = document.getElementById('user_id')
const question = document.getElementById('question')
const answer = document.getElementById('answer')
const answerDiv = document.getElementById('answer_div')
const pass = document.getElementById('password')
const inject = document.getElementById('signin')
// const loginBtn = document.getElementsByClassName('btn btn-primary')

answerDiv.addEventListener('change', (e) => console.log(e))

function authStart(cred) {
    inject.focus()
    loginId.focus()
    loginId.value = cred.rollno
    loginId.blur()
    pass.value = cred.password
    setTimeout(() => {
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
    }, 1000)
}

browser.storage.local.get('credentials').then((data) => {
    if (!data.credentials)
        return displayMessage('No Login Info Found!')
    authStart(data.credentials)
})

// eslint-disable-next-line no-unused-vars
// function clickLoginButton() {
//     setTimeout(() => {
//         loginBtn[0].click()
//     }, 100)
// }
