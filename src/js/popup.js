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
 */

import '../css/popup.scss'
import getSecurityQues from './utils/getSecurityQues'

/** ***************
 * HTML ELEMENTS *
 **************** */

// Core Logic Dependencies
const usernameInput = document.querySelector('#username')
const passwordInput = document.querySelector('#password')
const _a1 = document.querySelector('#a1')
const _a2 = document.querySelector('#a2')
const _a3 = document.querySelector('#a3')

// Message Elements
const log = document.getElementById('log')
const logClass = document.getElementById('log-class')
const logIcon = document.getElementById('log-icon')

// checkboxes
const themeBtn = document.getElementById('theme')
const themeInfo = document.getElementById('theme-info')
const auto = document.getElementById('auto-login')
const autoInfo = document.getElementById('auto-login-info')

// Click Handlers
const reset = document.getElementById('reset')

// Update
const updateBtn = document.getElementById('update')
const updateInfo = document.getElementById('update-info')

// Set Copyright Text
document.getElementById(
    'copyright'
).textContent = `Copyright©${new Date().getFullYear()}`
document.getElementById(
    'ext-version'
).textContent = browser.runtime.getManifest().version

/** **************
 * DEVELOP AREA *
 *************** */

// disable context menu
document.oncontextmenu = () => false

const hIcon = document.getElementById('form-header-icon')
const closeForm = document.getElementById('form-done')
const mBtn = document.getElementById('maximize-btn')
const panelContainer = document.getElementById('panel-container')

closeForm.onclick = () => {
    document.body.classList.toggle('all-set')
    if (document.body.classList.contains('all-set')) {
        panelContainer.style.display = 'flex'
    } else {
        panelContainer.style.display = 'none'
    }
}

mBtn.onclick = () => {
    document.body.classList.toggle('all-set')
    if (document.body.classList.contains('all-set')) {
        panelContainer.style.display = 'flex'
    } else {
        panelContainer.style.display = 'none'
    }
}

document.querySelectorAll('.quick-link').forEach((element) => {
    element.addEventListener('click', () => {
        setTimeout(() => {
            window.close()
        }, 10)
    })
})

/** ****************
 * POPUP UI PAINT *
 ***************** */

/**
 * @description updates ext-storage on user interactions
 */
function storeSettings() {
    browser.storage.local.set({
        authCredentials: {
            username: usernameInput.value,
            password: passwordInput.value,
            q1: _a1.placeholder,
            a1: _a1.value,
            q2: _a2.placeholder,
            a2: _a2.value,
            q3: _a3.placeholder,
            a3: _a3.value,
            dark: themeBtn.checked,
            autoLogin: auto.checked
        }
    })
}

/**
 * @description desplays message on ui
 * @param {String} message messsge to display
 * @param {String} iconId id of svg icon to use
 */
function logger(message, iconId = 'info') {
    log.textContent = message
    logClass.className = iconId
    logIcon.setAttribute(
        'href',
        browser.runtime.getURL(`/assets/icons.svg#${iconId}`)
    )
}

/**
 * @description Popup UI First Paint
 * @param {Object} restoredSettings Storage Object
 */
function updateUI(restoredSettings) {
    const { authCredentials } = restoredSettings

    // Set theme
    if (!authCredentials.dark) {
        document.body.className = ''
        themeBtn.checked = false
        themeInfo.textContent = 'off'
    } else {
        themeInfo.textContent = 'on'
        themeBtn.checked = true
        hIcon.setAttribute(
            'src',
            browser.runtime.getURL(
                '/assets/images/header_icon_light.png'
            )
        )
        document.body.className = 'dark'
    }

    auto.checked = authCredentials.autoLogin

    if (authCredentials.autoLogin) {
        autoInfo.textContent = 'on'
    } else {
        autoInfo.textContent = 'off'
    }

    // Minimize if all set
    if (
        authCredentials.username !== '' &&
        authCredentials.password !== '' &&
        authCredentials.q1 !== 'loading' &&
        authCredentials.q2 !== 'loading' &&
        authCredentials.q3 !== 'loading' &&
        authCredentials.a1 !== '' &&
        authCredentials.a2 !== '' &&
        authCredentials.a3 !== ''
    ) {
        document.body.classList.toggle('all-set')
        if (document.body.classList.contains('all-set')) {
            panelContainer.style.display = 'flex'
        } else {
            panelContainer.style.display = 'none'
        }
    }

    // Set Fields
    usernameInput.value = authCredentials.username || ''
    passwordInput.value = authCredentials.password || ''
    _a1.value = authCredentials.a1 || ''
    _a2.value = authCredentials.a2 || ''
    _a3.value = authCredentials.a3 || ''
    _a1.placeholder = authCredentials.q1 || 'loading'
    _a2.placeholder = authCredentials.q2 || 'loading'
    _a3.placeholder = authCredentials.q3 || 'loading'

    // Set Message
    if (authCredentials.username === '') {
        logger('Enter Roll Number')
    } else if (authCredentials.password === '') {
        logger('Enter Password', 'warning')
        passwordInput.removeAttribute('disabled')
        passwordInput.addEventListener('keyup', () => {
            _a1.removeAttribute('disabled')
            _a2.removeAttribute('disabled')
            _a3.removeAttribute('disabled')
            logger('Enter security answers!', 'warning')
        })
        passwordInput.removeEventListener('keyup', null)
    } else if (
        _a1.value !== '' &&
        _a2.value !== '' &&
        _a3.value !== ''
    ) {
        _a1.setAttribute('disabled', true)
        _a2.setAttribute('disabled', true)
        _a3.setAttribute('disabled', true)
        logger(
            `You are all set! ${authCredentials.username}`,
            'check'
        )
    } else {
        logger('Fill security answers!', 'warning')
        _a1.removeAttribute('disabled')
        _a2.removeAttribute('disabled')
        _a3.removeAttribute('disabled')
    }
}

/** ************
 * CORE LOGIC *
 ************* */

/**
 * @description network req done here
 * @param {Function} cb Callback function
 */
async function getQuestions(cb) {
    if (
        _a1.placeholder !== 'loading' &&
        _a2.placeholder !== 'loading' &&
        _a3.placeholder !== 'loading'
    ) {
        return cb('Question already loaded!', true)
    }

    /**
     * @description Callback after fetch request
     * @param {String} message error msg from fetch
     * @param {Boolean} done success/failure of fetch (valid/invalid rollno)
     */
    function httpCallback(message, done) {
        if (done) {
            // fetch success and rollno exist

            if (
                _a1.placeholder === 'loading' ||
                _a2.placeholder === 'loading' ||
                _a3.placeholder === 'loading'
            ) {
                return cb('Re call getquestion', false)
            }
            return cb('Got all Questions!', true)
        }
        // Invalid rollno (does not exist)

        logger(message, 'cross')
    }

    const q = await getSecurityQues(usernameInput.value) // Question or FALSE

    if (q !== 'FALSE') {
        passwordInput.removeAttribute('disabled')
        if (_a1.placeholder === 'loading') {
            _a1.placeholder = q
            _a1.removeAttribute('disabled')
        } else if (
            _a2.placeholder === 'loading' &&
            q !== _a1.placeholder
        ) {
            _a2.placeholder = q
            _a2.removeAttribute('disabled')
        } else if (q !== _a1.placeholder && q !== _a2.placeholder) {
            _a3.placeholder = q
            _a3.removeAttribute('disabled')
        }
        return httpCallback('Got a Question', true)
    }
    return httpCallback('Roll No does not exist, Retry!', false)
}

/**
 * @description Caller for `getQuestions` untill we get all 3 questions
 * @param {String} message message from `httpCallback`
 * @param {Boolean} done tells if all messages loaded.
 */
function questionsCallback(message, done) {
    if (done) {
        // All Questions Loaded

        if (passwordInput.value === '') {
            logger(`${message} Fill required info.`, 'check')
        } else if (
            _a1.value === '' ||
            _a2.value === '' ||
            _a3.value === ''
        ) {
            logger('Fill Security Answers', 'warning')
        } else {
            logger('All Set!', 'check')
        }
        storeSettings()
    } else {
        // Not All Questions Loaded

        getQuestions(questionsCallback)
    }
}

/** ***********
 * UTILITIES *
 ************ */

/**
 * @description Error Logger
 * @param {*} e error
 */
function onError(e) {
    console.error(e)
}

/**
 * @description Checks/initializes extension storage
 * @param {Object} storedSettings Storage Object
 */
function checkStoredSettings(storedSettings) {
    if (!storedSettings.authCredentials) {
        // Initialize storage then Update UI

        const authCredentials = {
            username: '',
            password: '',
            q1: 'loading',
            q2: 'loading',
            q3: 'loading',
            a1: '',
            a2: '',
            a3: '',
            dark: false,
            autoLogin: true
        }
        browser.storage.local
            .set({ authCredentials })
            .then(() => updateUI({ authCredentials }), onError)
    } else {
        // updateUI with stored data

        updateUI(storedSettings)
    }
}

/** **********
 * HANDLERS *
 *********** */

/**
 * @description handles reset-click
 */
function resetHandler() {
    const actionBtnYes = document.createElement('div')
    actionBtnYes.className = 'action'
    actionBtnYes.textContent = 'Yes'
    const actionBtnCancel = document.createElement('div')
    actionBtnCancel.className = 'action'
    actionBtnCancel.textContent = 'Cancel'
    logClass.appendChild(actionBtnYes)
    logClass.appendChild(actionBtnCancel)
    logger('Are you sure!', 'warning')
    reset.setAttribute('disabled', true)

    actionBtnYes.onclick = () => {
        reset.removeAttribute('disabled')
        logClass.removeChild(actionBtnYes)
        logClass.removeChild(actionBtnCancel)
        usernameInput.value = ''
        passwordInput.value = ''
        _a1.value = ''
        _a2.value = ''
        _a3.value = ''
        _a1.placeholder = 'loading'
        _a2.placeholder = 'loading'
        _a3.placeholder = 'loading'
        passwordInput.setAttribute('disabled', true)
        _a1.setAttribute('disabled', true)
        _a2.setAttribute('disabled', true)
        _a3.setAttribute('disabled', true)

        browser.storage.local
            .set({
                authCredentials: {
                    username: '',
                    password: '',
                    q1: 'loading',
                    q2: 'loading',
                    q3: 'loading',
                    a1: '',
                    a2: '',
                    a3: '',
                    dark: false,
                    autoLogin: true
                }
            })
            .then(() => {
                logger('Data Cleared!', 'check')
                browser.tabs
                    .create({
                        url:
                            'https://erp.iitkgp.ac.in/IIT_ERP3/logout.htm'
                    })
                    .then(() => {
                        console.log('Successfully logged Out!')
                    }, onError)
            })
    }

    actionBtnCancel.onclick = () => {
        reset.removeAttribute('disabled')

        logClass.removeChild(actionBtnYes)
        logClass.removeChild(actionBtnCancel)
        logger('Cancelled!')
    }
}

/**
 * @description toggles dark mode
 */
/* eslint-disable no-unused-vars */
function toggleDark() {
    if (document.body.classList.contains('dark')) {
        themeInfo.textContent = 'off'
        hIcon.setAttribute(
            'src',
            browser.runtime.getURL('/assets/images/header_icon.png')
        )
    } else {
        themeInfo.textContent = 'on'

        hIcon.setAttribute(
            'src',
            browser.runtime.getURL(
                '/assets/images/header_icon_light.png'
            )
        )
    }
    document.body.classList.toggle('dark')
}

/**
 * @description get current theme from storage and inverse it
 * @param {object} curr Storage
 * @param {string} id target checkbox's id
 */
function updateCheckBox(curr, id) {
    const { authCredentials } = curr

    if (id === 'theme') {
        browser.storage.local.set({
            authCredentials: {
                ...authCredentials,
                dark: !authCredentials.dark
            }
        })

        toggleDark()
    } else if (id === 'auto-login') {
        browser.storage.local.set({
            authCredentials: {
                ...authCredentials,
                autoLogin: !authCredentials.autoLogin
            }
        })
        if (authCredentials.autoLogin) {
            autoInfo.textContent = 'off'
        } else autoInfo.textContent = 'on'
    }
}

/** ***************
 * REDUX-PATTERN *
 **************** */

/**
 * @description handles response w.r.t action
 */
function handleMessageResponse(response) {
    if (response.action === 'update_check') {
        const { update, message, type } = response
        updateInfo.textContent = ''
        document.getElementById('update-btn').textContent = message

        if (update) {
            document.getElementById(
                'update-default-icon'
            ).style.display = 'none'
            document.getElementById(
                'update-found-icon'
            ).style.display = 'block'
            document.getElementById('update-btn').setAttribute =
                'disabled'
            const whatsnew = document.createElement('p')
            whatsnew.id = 'update_checked'
            whatsnew.className = 'panel-card-label'
            whatsnew.innerText = update.release_notes['en-US']

            document
                .getElementById('panel-update')
                .appendChild(whatsnew)
        } else {
            document.getElementById(
                'update-default-icon'
            ).style.display = 'none'
            document.getElementById(
                'no-update-found-icon'
            ).style.display = 'block'
        }
    }
}

/**
 * @description Validate Roll Number and initiate logic `getQuestions`
 */
function testRoll() {
    if (usernameInput.value.length !== 9) {
        if (
            usernameInput.value.length === 8 ||
            usernameInput.value.length === 10
        ) {
            _a1.placeholder = 'loading'
            _a2.placeholder = 'loading'
            _a3.placeholder = 'loading'
            _a1.value = ''
            _a2.value = ''
            _a3.value = ''
            passwordInput.value = ''
        }
        logger('Enter a valid Roll No', 'cross')
        return
    }
    const re = /[0-9]{2}[a-z|A-Z]{2}[0-9|a-z|A-Z]{1}[a-z|A-Z|0-9]{2}[0-9]{2}/ // ? regex for IITKGP ROLL-NUMBERS (18mi10018-19mi3pe03)
    const OK = re.exec(usernameInput.value)
    if (!OK) {
        // console.error(usernameInput.value + " isn't a roll number!");
        logger('Enter a valid Roll No', 'cross')
    } else {
        // console.log("roll number is " + OK[0]);
        logger('Getting Questions..', 'warning')
        getQuestions(questionsCallback)
    }
}

/**
 * @param {string} action action update_check
 * @param {string} msg any
 */
function messageTab(action, msg = '') {
    const sending = browser.runtime.sendMessage({
        action,
        query: msg
    })
    sending.then(handleMessageResponse, (err) =>
        console.log(`Error: ${err}`)
    )
}

/** ********************
 * ACTION CONTROLLERS *
 ********************* */

// Initialize
browser.storage.local.get().then(checkStoredSettings, onError)

// Listen Events
reset.addEventListener('click', resetHandler)
usernameInput.addEventListener('keyup', testRoll)
passwordInput.addEventListener('blur', storeSettings)
_a1.addEventListener('blur', storeSettings)
_a2.addEventListener('blur', storeSettings)
_a3.addEventListener('blur', storeSettings)

auto.onclick = () => {
    const getData = browser.storage.local.get()
    getData.then((data) => updateCheckBox(data, 'auto-login'))
}

themeBtn.onclick = () => {
    const getData = browser.storage.local.get()
    getData.then((data) => updateCheckBox(data, 'theme'))
}

updateBtn.onclick = () => {
    if (document.getElementById('update_checked')) {
        document.getElementById('update_checked').remove()
        updateInfo.textContent = 'checking..'
        messageTab('update_check')
    } else {
        updateInfo.textContent = 'checking..'
        messageTab('update_check')
    }
}
