import Credential from 'models/Credential'
import { decrypt } from 'services/crypto'
import displayMessageOnErpLoginPage from 'utils/displayMessageOnErpLoginPage'
import fetchFromErp from 'utils/fetchFromErp'
import getPinFromDialog from 'utils/pinDialog'
import validateCredentials, { FieldValidationStatus } from 'utils/validateCredentials'

// Create an observer instance linked to the callback function

const login = async (res: { [key: string]: unknown }) => {
  /**
   * ?Skip if no credentials are stored or autoLogin is not enabled
   */

  if (!res.authCredentials) {
    displayMessageOnErpLoginPage('You have extension for automatic login. Please fill it', '#715100')
    return
  }

  const credentials = res.authCredentials as Credential

  if (!credentials.autoLogin) {
    displayMessageOnErpLoginPage('Automatic login is turned off!', '#4a4a4f')
    return
  }

  const fieldsValidationStatus = validateCredentials(res.authCredentials as { [key: string]: unknown })

  if (fieldsValidationStatus === FieldValidationStatus.SomeFieldIsEmpty) {
    displayMessageOnErpLoginPage('Please fill all the fields', '#4a4a4f')
    return
  }

  /**
   * ?Initialize the login process
   */

  if (fieldsValidationStatus === FieldValidationStatus.AllFieldsFilled)
    displayMessageOnErpLoginPage('Prefilling credentials! please wait...')

  const { requirePin, username } = credentials

  let pin = ''
  if (requirePin) {
    res.useAltPINDialog ? (pin = await getPinFromDialog()) : (pin = prompt('Enter your 4 digit PIN') ?? '')
  }

  let password = '',
    question = '',
    answer = ''

  const usernameInput = document.getElementById('user_id') as HTMLInputElement

  const observer = new MutationObserver(async (mutationList, observer) => {
    let [mutation] = mutationList
    let [node] = mutation.addedNodes

    question = node.nodeValue as string
    observer.disconnect()

    switch (question) {
      case credentials.q1:
        answer = credentials.a1
        break

      case credentials.q2:
        answer = credentials.a2
        break

      case credentials.q3:
        answer = credentials.a3
        break

      default:
        /**
         * !This means that the credentials are invalid
         */
        displayMessageOnErpLoginPage('Invalid username/password set! Please update your credentials', '#a4000f')
        return
    }

    if (requirePin) {
      try {
        password = await decrypt(credentials.password, pin as string)
        answer = await decrypt(answer, pin as string)
      } catch (_) {
        displayMessageOnErpLoginPage('Incorrect PIN!, Please reset if forgot or refresh page to retry.', '#a4000f')
        return
      }
    } else {
      password = credentials.password
    }

    displayMessageOnErpLoginPage('Prefilling credentials! please wait...')

    let passwordInput = document.getElementById('password') as HTMLInputElement
    let answerInput = document.getElementById('answer') as HTMLInputElement

    if (!passwordInput || !answerInput) {
      displayMessageOnErpLoginPage('Something went wrong! Please refresh page and retry', '#a4000f')
      return
    }

    passwordInput.value = password
    answerInput.value = answer

    displayMessageOnErpLoginPage("Data filled! Click 'Send OTP' to continue", '#4a4a4f')
  })

  if (usernameInput) {
    observer.observe(document.getElementById('answer_div') as Node, {
      attributes: false,
      childList: true,
      subtree: true
    })

    // make sure
    usernameInput.value = username
    usernameInput.blur()
  }
}

chrome.storage.local.get(
  {
    authCredentials: null,
    landingPage: null,
    useAltPINDialog: false
  },
  login
)
