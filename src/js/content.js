import displayMessage from './helpers/displayMessage'
import extractToken from './helpers/extractToken'
import authRequest from './utils/authRequest'
import WebCrypto from './utils/crypto'
import getSecurityQues from './utils/getSecurityQues'
import storage from './utils/storage'

;(async () => {
    console.log('execute_c_script')

    // @debug
    const answerDiv = document.getElementById('answer_div')
    answerDiv.addEventListener('', (e) => console.log(e))

    const crypto = new WebCrypto()
    const storageKeys = await storage.getAllKeys()

    async function init(res) {
        if (!res.credentials) {
            displayMessage(
                'You have extension to automatic login. Please fill it',
                '#715100'
            )
        } else {
            const { credentials, preferences } = res
            let pin
            const { requirePin } = preferences

            if (!preferences.autoLogin) {
                return displayMessage(
                    'Automatic login is turned off!',
                    '#4a4a4f'
                )
            }

            if (preferences.requirePin) {
                pin = prompt('Enter your 4 digit PIN')
                console.log(pin)
            }

            if (
                credentials.rollno === '' ||
                credentials.password === '' ||
                credentials.q1 === 'Security Question 1' ||
                credentials.q2 === 'Security Question 2' ||
                credentials.q3 === 'Security Question 3' ||
                credentials.a1 === '' ||
                credentials.a2 === '' ||
                credentials.a3 === ''
            ) {
                browser.runtime.sendMessage({
                    action: 'auto_fill'
                })

                return displayMessage(
                    'Fill out credentials for automatic login!',
                    '#715100'
                )
            }
            displayMessage('Logging you in! please wait...')

            const ssToken = extractToken(
                window.location.search,
                'sessionToken'
            )
            const rURL = extractToken(
                window.location.search,
                'requestedUrl'
            )
            let ans

            const str = await getSecurityQues(credentials.rollno)
            if (str !== 'FALSE') {
                if (str === credentials.q1) {
                    ans = requirePin
                        ? await crypto.decrypt(credentials.a1, pin)
                        : credentials.a1
                } else if (str === credentials.q2) {
                    ans = requirePin
                        ? await crypto.decrypt(credentials.a2, pin)
                        : credentials.a2
                } else {
                    ans = requirePin
                        ? await crypto.decrypt(credentials.a3, pin)
                        : credentials.a3
                }

                let password
                if (requirePin) {
                    password = await crypto.decrypt(
                        credentials.password,
                        pin
                    )
                } else {
                    password = credentials.password
                }

                const result = await authRequest({
                    username: credentials.rollno,
                    password,
                    answer: ans,
                    sessionToken: ssToken,
                    requestedUrl: rURL
                })

                if (
                    result.status === 200 &&
                    result.statusText === 'OK' &&
                    result.redirected
                ) {
                    // eslint-disable-next-line no-restricted-globals
                    location.href = result.url
                } else {
                    displayMessage(
                        'Wrong Security answers set! Please update your credentials',
                        '#a4000f'
                    )
                }
            } else {
                displayMessage(
                    'Invalid username/password set! Please update your credentials',
                    '#a4000f'
                )
            }
        }
    }

    await init(storageKeys)
})()
