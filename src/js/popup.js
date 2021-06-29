'use-strict'

/**
 * * ------------ README FIRST ----------------
 *
 * ? Only implement ui Logic here
 * ? Use `sendMessage` to execute other logic
 * ? Always use `id` in js files to mutate DOM
 * ? Always use classes to style DOM (don't use `id` in css)
 *
 * TODO: Add Changelogs
 * TODO: Fix About
 * //TODO: Add Loading View
 */

import '../sass/popup.scss'
import logger from './components/logger'
import PanelGroup from './components/panel/panelgroup'
import PanelGroupItem from './components/panel/panelgroupitem'
import PanelHeader from './components/panel/panelheader'
import getSecurityQues from './utils/getSecurityQues'
import storage from './utils/storage'

customElements.define('panel-group', PanelGroup)
customElements.define('panel-header', PanelHeader)
customElements.define('panel-group-item', PanelGroupItem)

// panel
const resetBtn = document.getElementById('resetBtn')
const cardMaximizeBtn = document.getElementById('cardMaximizeBtn')
const themeBtn = document.getElementById('darkMode').shadowRoot
const autoLoginBtn = document.getElementById('autoLogin').shadowRoot

// form
const headerIcon = document.getElementById('formHeaderIcon')
const credentialsForm = document.getElementById('credentialsForm')
const rollno = document.getElementById('rollno')
const password = document.getElementById('password')
const a1 = document.getElementById('a1')
const a2 = document.getElementById('a2')
const a3 = document.getElementById('a3')

/**
 * INITIALIZATION
 * ? getAllKeys -> checkStoredInfo -> updateUI(fill-form,set-theme) -> toggle header_icon or panel_maximize/minimize (if necessary)
 */
console.info('popup.js')

const toggleHeaderIcon = () => {
    if (document.body.classList.contains('dark')) {
        headerIcon.setAttribute(
            'src',
            browser.runtime.getURL('/assets/images/header_icon.png')
        )
    } else {
        headerIcon.setAttribute(
            'src',
            browser.runtime.getURL(
                '/assets/images/header_icon_light.png'
            )
        )
    }
}

const toggleCard = () => {
    if (
        document
            .querySelector('.panel-container')
            .classList.contains('panel-hidden')
    ) {
        document.querySelector(
            '.card-container'
        ).style = `transform: translateY(${credentialsForm.clientHeight}px)`
    } else {
        document.querySelector(
            '.card-container'
        ).style = `transform: translateY(0)`
    }
    document
        .querySelector('.card-menu-icon')
        .classList.toggle('menu-expanded')
    document
        .querySelector('.panel-container')
        .classList.toggle('panel-hidden')
}

const updateUI = (restoredSettings, onUpdated = () => {}) => {
    const { credentials, preferences } = restoredSettings

    // common updates
    document.querySelector(
        '.card-container'
    ).style = `transform: translateY(${credentialsForm.clientHeight}px)`
    document.querySelector('#extVersion').textContent =
        browser.runtime.getManifest().version

    // update theme checkbox
    themeBtn.querySelector('#darkMode').checked = preferences.darkMode
    themeBtn.querySelector('#panelGroupItemEndText').textContent =
        preferences.darkMode

    // update autologin checkbox
    autoLoginBtn.querySelector('#autoLogin').checked =
        preferences.autoLogin
    autoLoginBtn.querySelector('#panelGroupItemEndText').textContent =
        preferences.autoLogin

    if (preferences.darkMode) {
        toggleHeaderIcon()
        document.body.classList.toggle('dark')
    }

    // Minimize if all set
    const emptyFieldExists =
        credentials.rollno === '' ||
        credentials.password === '' ||
        credentials.a1 === '' ||
        credentials.q1 === 'Security Question 1' ||
        credentials.a2 === '' ||
        credentials.q2 === 'Security Question 2' ||
        credentials.a3 === '' ||
        credentials.q3 === 'Security Question 3'

    if (emptyFieldExists) {
        toggleCard()
    }

    // Set Fields
    rollno.value = credentials.rollno || ''
    password.value = credentials.password || ''
    a1.value = credentials.a1 || ''
    a2.value = credentials.a2 || ''
    a3.value = credentials.a3 || ''
    a1.placeholder = credentials.q1 || 'Security Question 1'
    a2.placeholder = credentials.q2 || 'Security Question 2'
    a3.placeholder = credentials.q3 || 'Security Question 3'

    // Set Message
    if (credentials.rollno === '') {
        logger('Enter Roll Number')
    } else if (credentials.password === '') {
        logger('Enter Password', 'warning')
        password.removeAttribute('disabled')
        password.addEventListener('keyup', () => {
            a1.removeAttribute('disabled')
            a2.removeAttribute('disabled')
            a3.removeAttribute('disabled')
            logger('Enter security answers!', 'warning')
        })
        password.removeEventListener('keyup', null)
    } else if (
        a1.value !== '' &&
        a2.value !== '' &&
        a3.value !== ''
    ) {
        a1.disabled = true
        a2.disabled = true
        a3.disabled = true
        logger(`You are all set! ${credentials.rollno}`, 'check')
    } else {
        logger('Fill security answers!', 'warning')
        a1.disabled = false
        a2.disabled = false
        a3.disabled = false
    }

    onUpdated()
}

const checkStoredInfo = (storedInfo) => {
    console.log('retrieve storage ✔', storedInfo)
    if (!storedInfo.preferences) {
        // Initialize storage then Update UI
        const credentials = {
            rollno: '',
            password: '',
            q1: 'Security Question 1',
            q2: 'Security Question 2',
            q3: 'Security Question 3',
            a1: '',
            a2: '',
            a3: ''
        }

        const preferences = {
            darkMode: false,
            autoLogin: true
        }

        updateUI({ credentials, preferences }, () => {
            console.log('update ui: default ✔')
            setTimeout(() => {
                document
                    .querySelector('.popup-loading')
                    .classList.toggle('popup-loading-hidden')
                console.log('exit loader ✔')

                console.groupEnd()
            }, 500)
        })
        storage.setItem({ credentials, preferences }).then(() => {
            console.log('initalize default storage values ✔')
        })
    } else {
        updateUI(storedInfo, () => {
            console.log('update ui: retrieved ✔')
            setTimeout(() => {
                document
                    .querySelector('.popup-loading')
                    .classList.toggle('popup-loading-hidden')
                console.log('exit loader ✔')

                console.groupEnd()
            }, 500)
        })
    }
}

cardMaximizeBtn.onclick = toggleCard
storage.getAllKeys().then(checkStoredInfo)
console.groupCollapsed('@chore/init')

/**
 * EVENT HANDLERS
 * ? keyup, formsubmit/reset, clicks
 */

const storeCredentials = () => {
    const credentials = {
        rollno: rollno.value,
        password: password.value,
        q1: a1.placeholder,
        q2: a2.placeholder,
        q3: a3.placeholder,
        a1: a1.value,
        a2: a2.value,
        a3: a3.value
    }
    storage.setItem({ credentials }).then(() => {
        console.log('updated Storage.')
    })
}

const resetCredentialsForm = () => {
    // document.getElementById('credentialsForm').reset()
    password.value = ''
    password.disabled = true

    a1.value = ''
    a1.placeholder = 'Security Question 1'
    a1.disabled = true
    a2.value = ''
    a2.placeholder = 'Security Question 2'
    a2.disabled = true
    a3.value = ''
    a3.placeholder = 'Security Question 3'
    a3.disabled = true
}

const validateRollNumber = (e) => {
    const roll = e.target.value || ''

    function loadQuestions(r) {
        function cb(message, allQuesFetched) {
            if (allQuesFetched) {
                // All Questions Loaded
                if (password.value === '') {
                    logger(`${message} Fill required info.`, 'check')
                } else if (a1 === '' || a2 === '' || a3 === '') {
                    logger('Fill Security Answers', 'warning')
                } else {
                    logger('All Set!', 'check')
                }

                // store the questions into storage
                storeCredentials()
            } else {
                // Not All Questions Loaded so recurse
                console.log(message)
                loadQuestions(r)
            }
        }

        if (
            a1.placeholder !== 'Security Question 1' &&
            a2.placeholder !== 'Security Question 2' &&
            a3.placeholder !== 'Security Question 3'
        ) {
            return cb('Question already loaded!', true)
        }

        function fetchCallback(message, gotQuestion) {
            if (gotQuestion) {
                console.log('got question:', message)
                // rollno exists and one question fetched
                if (
                    a1.placeholder === 'Security Question 1' ||
                    a2.placeholder === 'Security Question 2' ||
                    a3.placeholder === 'Security Question 3'
                ) {
                    return cb('Get next question.', false)
                }
                return cb('Got all Questions!', true)
            }

            // rollno does not exists
            console.log('rollno does not exists')
            logger(message, 'cross')
        }

        getSecurityQues(r).then((q) => {
            if (q !== 'FALSE') {
                password.removeAttribute('disabled')
                if (a1.placeholder === 'Security Question 1') {
                    a1.setAttribute('placeholder', q)
                    a1.removeAttribute('disabled')
                } else if (
                    a2.placeholder === 'Security Question 2' &&
                    q !== a1.placeholder
                ) {
                    a2.setAttribute('placeholder', q)
                    a2.removeAttribute('disabled')
                } else if (
                    q !== a1.placeholder &&
                    q !== a2.placeholder
                ) {
                    a3.setAttribute('placeholder', q)
                    a3.removeAttribute('disabled')
                }
                return fetchCallback(q, true)
            }
            return fetchCallback(
                'Roll No does not exist, Retry!',
                false
            )
        })
    }

    if (roll.length !== 9) {
        resetCredentialsForm()
        logger('Enter a valid Roll No', 'cross')
        return
    }

    const re =
        /[0-9]{2}[a-z|A-Z]{2}[0-9|a-zA-Z][a-z|A-Z0-9]{2}[0-9]{2}/ // regex for IITKGP ROLL-NUMBERS (18mi10018-19mi3pe03)
    const OK = re.exec(roll)

    if (!OK) {
        console.error(`${roll} isn't a roll number!`)
        logger('Enter a valid Roll No', 'cross')
    } else {
        console.info(`getting questions for - ${OK[0]}`)
        logger('Getting Questions..', 'warning')

        loadQuestions(roll)
    }
}

const toggleCheckBox = (e) => {
    const { target } = e
    storage.getItem('preferences').then((preferences) => {
        console.log(`curr ${target.id}:`, preferences[target.id])
        if (target.id === 'darkMode') {
            toggleHeaderIcon()
            document.body.classList.toggle('dark')
        }
        storage
            .setItem({
                preferences: {
                    ...preferences,
                    [target.id]: !preferences[target.id]
                }
            })
            .then(() => {
                console.log(
                    `set ${target.id} to:`,
                    !preferences[target.id]
                )

                target.checked = !preferences[target.id]
                document
                    .getElementById(target.id)
                    .shadowRoot.querySelector(
                        '#panelGroupItemEndText'
                    ).textContent = !preferences[target.id]
            })
    })
}

const resetForm = (e) => {
    e.preventDefault()

    resetBtn.disabled = true
    logger(
        'Are you sure!',
        'warning',
        true,
        () => {
            rollno.value = ''
            resetCredentialsForm()
            storeCredentials()
            logger('Successfully Cleared Data!')
            browser.tabs
                .create({
                    url: 'https://erp.iitkgp.ac.in/IIT_ERP3/logout.htm'
                })
                .then(() => {
                    console.log('Successfully logged Out!')
                })

            resetBtn.disabled = false
        },
        () => {
            logger('Cancelled.')
            resetBtn.disabled = false
        }
    )
}

rollno.onkeyup = validateRollNumber
password.onblur = storeCredentials
a1.onblur = storeCredentials
a2.onblur = storeCredentials
a3.onblur = storeCredentials
themeBtn.getElementById('darkMode').onclick = toggleCheckBox
autoLoginBtn.getElementById('autoLogin').onclick = toggleCheckBox
resetBtn.onclick = resetForm
credentialsForm.onsubmit = (e) => {
    e.preventDefault()
    logger(`You are all set! ${rollno.value}`, 'check')
    toggleCard()
}

/**
 *
 * TODO: WORK IN PROGRESS
 */
// eslint-disable-next-line no-unused-vars
const checkForUpdates = (e) => {
    const { shadowRoot } = e.target
    shadowRoot.querySelector('.panel-group-item-title').textContent =
        'Checking for updates...'
    shadowRoot.querySelector('#panelGroupItemStartIcon').style =
        'animation: rotate-svg-icon infinite 1s linear; fill: crimson;'

    setTimeout(() => {
        shadowRoot
            .querySelector('use')
            .setAttribute(
                'href',
                browser.runtime.getURL(`/assets/icons.svg#info`)
            )
        shadowRoot.querySelector(
            '#panelGroupItemStartIcon'
        ).style.animation = ''
        shadowRoot.querySelector(
            '#panelGroupItemStartIcon'
        ).style.fill = 'var(--secondary-icon)'

        const changlogsPanel = document.createElement('section')
        changlogsPanel.setAttribute('class', 'panel')
        changlogsPanel.setAttribute('id', 'panel-changelogs')

        document
            .querySelector('.panel-container')
            .appendChild(changlogsPanel)

        const header = new PanelHeader()
        header.href = '#panel-updates'
        header.title = 'Changelogs'
        changlogsPanel.appendChild(header)
    }, 2000)
}
// document.getElementById('updateBtn').onclick = checkForUpdates
