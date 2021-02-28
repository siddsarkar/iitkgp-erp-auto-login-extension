import extractToken from './helpers/extractToken'
import authRequest from './utils/authRequest'
import getSecurityQues from './utils/getSecurityQues'

console.log('execute_c_script')

// temp
const answerdiv = document.getElementById('answer_div')
answerdiv.addEventListener('', (e) => console.log(e))

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

browser.storage.local.get().then((res) => {
    if (!res.authCredentials) {
        displayMessage(
            'You have extension to automatic login. Please fill it',
            '#715100'
        )
    } else {
        const { authCredentials } = res

        if (!authCredentials.autoLogin) {
            return displayMessage(
                'AutoLogin is turned off',
                '#4a4a4f'
            )
        }

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
        displayMessage('Logging you in..')

        const ssToken = extractToken(
            window.location.search,
            'sessionToken'
        )
        const rURL = extractToken(
            window.location.search,
            'requestedUrl'
        )
        let ans

        const fetching = getSecurityQues(authCredentials.username)
        fetching.then((str) => {
            if (str !== 'FALSE') {
                if (str === authCredentials.q1) {
                    ans = authCredentials.a1
                } else if (str === authCredentials.q2) {
                    ans = authCredentials.a2
                } else {
                    ans = authCredentials.a3
                }
                const authenticating = authRequest({
                    username: authCredentials.username,
                    password: authCredentials.password,
                    answer: ans,
                    sessionToken: ssToken,
                    requestedUrl: rURL
                })

                authenticating.then((result) => {
                    if (
                        result.status === 200 &&
                        result.statusText === 'OK' &&
                        result.redirected
                    ) {
                        // eslint-disable-next-line no-restricted-globals
                        location.href = result.url
                    } else {
                        displayMessage(
                            'Wrong Credentials set. Please update your credentials',
                            '#a4000f'
                        )
                    }
                })
            }
        })
    }
})
