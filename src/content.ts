import Credential from 'models/Credential'
import WebCrypto from 'services/crypto'
import displayMessageOnErpLoginPage from 'utils/displayMessageOnErpLoginPage'
import extractQueryParamFromStr from 'utils/extractQueryParamFromStr'
import fetchFromErp from 'utils/fetchFromErp'
import validateCredentials, { FieldValidationStatus } from 'utils/validateCredentials'

// Initialize the crypto service
const c = new WebCrypto()

// Execute the login request
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
    displayMessageOnErpLoginPage('Logging you in! please wait...')

  const { requirePin, username } = credentials
  const pin = requirePin ? prompt('Enter your 4 digit PIN') : ''

  let password, answer

  const sessionToken = extractQueryParamFromStr(window.location.search, 'sessionToken') || undefined
  const requestedUrl = extractQueryParamFromStr(window.location.search, 'requestedUrl') || undefined

  const questionRes = await fetchFromErp('/SSOAdministration/getSecurityQues.htm', `user_id=${username}`)
  const question = (await questionRes.text()) ?? 'FALSE'

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
      password = await c.decrypt(credentials.password, pin as string)
      answer = await c.decrypt(answer, pin as string)
    } catch (_) {
      displayMessageOnErpLoginPage('Incorrect PIN!, Please reset if forgot or refresh page to retry.', '#a4000f')
      return
    }
  } else {
    password = credentials.password
  }

  const result = await fetchFromErp(
    '/SSOAdministration/auth.htm',
    `user_id=${username}&password=${password}&answer=${answer}&requestedUrl=${requestedUrl}&sessionToken=${sessionToken}`
  )

  if (result.status === 200 && result.statusText === 'OK' && result.redirected) location.href = result.url
  else displayMessageOnErpLoginPage('Wrong credentials set! Please update your credentials', '#a4000f')
}

chrome.storage.local.get('authCredentials', login)
