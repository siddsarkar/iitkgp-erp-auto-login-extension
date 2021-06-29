import displayMessage from './helpers/displayMessage'
import extractToken from './helpers/extractToken'
import authRequest from './utils/authRequest'
import getSecurityQues from './utils/getSecurityQues'
import storage from './utils/storage'

console.log('execute_c_script')

// @debug
const answerDiv = document.getElementById('answer_div')
answerDiv.addEventListener('', (e) => console.log(e))

storage.getAllKeys().then((res) => {
    if (!res.credentials) {
        displayMessage(
            'You have extension to automatic login. Please fill it',
            '#715100'
        )
    } else {
        const { credentials, preferences } = res

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

        const fetching = getSecurityQues(credentials.rollno)
        fetching.then((str) => {
            if (str !== 'FALSE') {
                if (str === credentials.q1) {
                    ans = credentials.a1
                } else if (str === credentials.q2) {
                    ans = credentials.a2
                } else {
                    ans = credentials.a3
                }
                const authenticating = authRequest({
                    username: credentials.rollno,
                    password: credentials.password,
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
                            'Wrong Security answers set! Please update your credentials',
                            '#a4000f'
                        )
                    }
                })
            } else {
                displayMessage(
                    'Invalid username/password set! Please update your credentials',
                    '#a4000f'
                )
            }
        })
    }
})
