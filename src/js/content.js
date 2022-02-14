import displayMessage from './helpers/displayMessage'
import extractToken from './helpers/extractToken'
import authRequest from './utils/authRequest'
import WebCrypto from './utils/crypto'
import getSecurityQues from './utils/getSecurityQues'
import storage from './utils/storage'

console.log('execute_c_script')
;(async () => {
    // @debug
    const answerDiv = document.getElementById('answer_div')
    answerDiv.addEventListener('', (e) => console.log(e))

    const crypto = new WebCrypto()
    const storageKeys = await storage.getAllKeys()

    async function init(res) {
        if (!res.credentials) {
            return displayMessage(
                'You have extension to automatic login. Please fill it',
                '#715100'
            )
        }

        const { credentials, preferences } = res
        const { requirePin } = preferences
        let pin

        if (!preferences.autoLogin) {
            return displayMessage(
                'Automatic login is turned off!',
                '#4a4a4f'
            )
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
            if (preferences.partialFill) {
                /* fill partially filled data */
                return browser.runtime.sendMessage({
                    action: 'auto_fill'
                })
            }

            return
        }

        if (
            credentials.rollno !== '' &&
            credentials.password !== '' &&
            credentials.q1 !== 'Security Question 1' &&
            credentials.q2 !== 'Security Question 2' &&
            credentials.q3 !== 'Security Question 3' &&
            credentials.a1 !== '' &&
            credentials.a2 !== '' &&
            credentials.a3 !== ''
        ) {
            displayMessage('Logging you in! please wait...')
        }

        if (preferences.requirePin) {
            // eslint-disable-next-line no-alert
            pin = prompt('Enter your 4 digit PIN')
        }

        const ssToken = extractToken(
            window.location.search,
            'sessionToken'
        )
        const rURL = extractToken(
            window.location.search,
            'requestedUrl'
        )
        let ans
        let password

        const str = await getSecurityQues(credentials.rollno)
        if (str !== 'FALSE') {
            if (requirePin) {
                try {
                    password = await crypto.decrypt(
                        credentials.password,
                        pin
                    )
                } catch (error) {
                    return displayMessage(
                        'Invorrect PIN!, Please reset if forgot.',
                        '#a4000f'
                    )
                }
            } else {
                password = credentials.password
            }

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

    await init(storageKeys)
})()
