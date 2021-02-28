const loginid = document.getElementById('user_id')
const quesn = document.getElementById('question')
const answer = document.getElementById('answer')
const answerdiv = document.getElementById('answer_div')
const pass = document.getElementById('password')
const inject = document.getElementById('signin')

console.log('execute_autofill_script')

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
    inject.focus()
    loginid.focus()
    loginid.value = cred.username
    loginid.blur()
    pass.value = cred.password
}

browser.storage.local.get('authCredentials').then((data) => {
    if (!data.authCredentials) {
        return displayMessage('No Login Info Found!')
    }
    const { authCredentials } = data
    if (
        authCredentials.username === '' ||
        authCredentials.password === '' ||
        authCredentials.q1 === 'loading' ||
        authCredentials.q2 === 'loading' ||
        authCredentials.q3 === 'loading' ||
        authCredentials.a1 === '' ||
        authCredentials.a2 === '' ||
        authCredentials.a3 === ''
    ) {
        return displayMessage(
            'Fill out credentials, in the extension!',
            '#715100'
        )
    }
    displayMessage('Filling Info..')
    authstart(authCredentials)
})

loginid.addEventListener('blur', () => {
    const checking = setInterval(() => {
        if (answerdiv.classList.contains('hidden')) return
        browser.storage.local
            .get('authCredentials')
            .then(({ authCredentials }) => {
                if (quesn.innerHTML === authCredentials.q1) {
                    answer.value = authCredentials.a1
                    displayMessage(
                        'Filled Succesfully! Click Sign In',
                        '#058b00'
                    )
                } else if (quesn.innerHTML === authCredentials.q2) {
                    answer.value = authCredentials.a2
                    displayMessage(
                        'Filled Succesfully! Click Sign In',
                        '#058b00'
                    )
                } else if (quesn.innerHTML === authCredentials.q3) {
                    answer.value = authCredentials.a3
                    displayMessage(
                        'Filled Succesfully! Click Sign In',
                        '#058b00'
                    )
                } else {
                    displayMessage('Bad Credentials Set!')
                }
                clearInterval(checking)
            })
    }, 1000)
})
