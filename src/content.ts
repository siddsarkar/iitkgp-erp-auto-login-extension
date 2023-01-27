import Credential from 'models/Credential'
import WebCrypto from 'services/crypto'
import displayMessageOnErpLoginPage from 'utils/displayMessageOnErpLoginPage'
import extractQueryParamFromStr from 'utils/extractQueryParamFromStr'
import fetchFromErp from 'utils/fetchFromErp'
import validateCredentials, { FieldValidationStatus } from 'utils/validateCredentials'

// create a pin dialog using html
const pinDialog = document.createElement('dialog')
pinDialog.id = 'pinDialog'
pinDialog.open = false
pinDialog.innerHTML = `
  <div class="prompt">
    Enter your 4 digit PIN
  </div>
  <form class="digit-group" data-group-name="digits" data-autosubmit="false" autocomplete="off">
	<input type="password" id="digit-1" name="digit-1" data-next="digit-2" />
    <input type="password" id="digit-2" name="digit-2" data-next="digit-3" data-previous="digit-1" />
    <input type="password" id="digit-3" name="digit-3" data-next="digit-4" data-previous="digit-2" />
    <input type="password" id="digit-4" name="digit-4"  data-previous="digit-3" />
  </form>
	<button id="pinDialogCloseBtn">Close</button>
`

const style = document.createElement('style')
style.innerHTML = `
dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 200px;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    padding: 0;
    margin: 0;
    
    background-color: #fff;
    // background-color: #0f0f1a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    background-image: url("${chrome.runtime.getURL('assets/images/ext_icon.png')}");
    background-repeat: no-repeat;
    background-position: left 10px bottom 10px;
    background-size: 50px;
    background-opacity: 0.5;
  }
  
  dialog::backdrop {
    background-color: rgba(0 0 0 / 0.5);
    backdrop-filter: blur(1px);
  }

  
.digit-group input {
  width: 30px;
  height: 50px;
  // background-color: #18182a;
  background-color: #fff;
  border: 2px solid gray;
  border-radius: 5px;
  border-opacity: 0.5;
  line-height: 50px;
  text-align: center;
  font-size: 24px;
  font-family: "Raleway", sans-serif;
  font-weight: 200;
  // color: white;
  color: black;
  margin: 0 2px;
}

.prompt {
  margin-bottom: 20px;
  font-size: 16px;
  // color: white;
  color: black;
}
#pinDialogCloseBtn {
  margin-top: 20px;
  border-radius: 5px;
  border: none;
  // color: white;
  color: black;
}
`

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
  // const pin = requirePin ? prompt('Enter your 4 digit PIN') : ''
  let pin = ''
  if (requirePin) {
    // add the elements to the DOM
    document.head.appendChild(style)
    document.body.appendChild(pinDialog)

    // show the pin dialog
    pinDialog.showModal()

    // get the pin from the dialog
    // convert above jQuery code to javascript
    const pinDialogCloseBtn = document.getElementById('pinDialogCloseBtn') as HTMLButtonElement
    pinDialogCloseBtn.addEventListener('click', () => {
      pinDialog.close()
    })
    const digitGroups = document.querySelectorAll('.digit-group')
    digitGroups.forEach((digitGroup) => {
      const inputs = digitGroup.querySelectorAll('input')
      inputs.forEach((input) => {
        input.setAttribute('maxlength', '1')
        input.addEventListener('keyup', (e) => {
          const parent = input.parentElement as any
          if (e.keyCode === 8 || e.keyCode === 37) {
            const prev = parent.querySelector(`input#${input.dataset.previous}`)
            if (prev) prev.select()
          } else if (
            (e.keyCode >= 48 && e.keyCode <= 57) ||
            (e.keyCode >= 65 && e.keyCode <= 90) ||
            (e.keyCode >= 96 && e.keyCode <= 105) ||
            e.keyCode === 39
          ) {
            const next = parent.querySelector(`input#${input.dataset.next}`)
            if (next) next.select()
            else if (parent.dataset.autosubmit) {
              // print the pin
              console.log(inputs[0].value + inputs[1].value + inputs[2].value + inputs[3].value)
              pin = inputs[0].value + inputs[1].value + inputs[2].value + inputs[3].value
              pinDialog.close()
            }
          }
        })
      })
    })

    // wait for the pin to be entered
    await new Promise((resolve) => {
      pinDialog.addEventListener('close', resolve)
    })

    // remove the pin dialog
    pinDialog.remove()

    // if the pin is not 4 digits long, then return
    if (pin.length !== 4) {
      displayMessageOnErpLoginPage('Incorrect PIN!, Please reset if forgot or refresh page to retry.', '#a4000f')
      return
    }
  }
  let password, answer

  const sessionToken = extractQueryParamFromStr(window.location.search, 'sessionToken') || undefined
  const requestedUrl = res.landingPage || extractQueryParamFromStr(window.location.search, 'requestedUrl') || undefined

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

chrome.storage.local.get(['authCredentials', 'landingPage'], login)
