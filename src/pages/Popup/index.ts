import Credential from 'models/Credential'
import 'pages/Popup/style.css'
import WebCrypto from 'services/crypto'
import ERP from 'services/erp'
import { default as logger } from 'utils/displayMessageOnPopup'

/* Initialize Theme */
chrome.storage.local.get(['theme', 'bg'], (result) => {
  const themeSelect = document.getElementById('theme_select') as HTMLSelectElement
  const themeBg = document.getElementById('theme-bg') as HTMLInputElement

  let isDark = false
  let isBgEnabled = false

  if (result.theme === 'dark' || (!('theme' in result) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark = true
    document.documentElement.classList.add('dark')
    themeSelect.value = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    themeSelect.value = 'light'
  }

  if (result.bg === 'yes') {
    isBgEnabled = true

    if (isDark) {
      document.body.classList.toggle('bg-theme-dark')
    } else {
      document.body.classList.toggle('bg-theme')
    }
    themeBg.checked = true
  } else {
    themeBg.checked = false
  }

  themeBg.onchange = (ev) => {
    if ((ev.target as HTMLInputElement).checked) {
      isBgEnabled = true

      if (isDark) {
        document.body.classList.toggle('bg-theme-dark')
      } else {
        document.body.classList.toggle('bg-theme')
      }
    } else {
      isBgEnabled = false
      document.body.classList.remove('bg-theme')
      document.body.classList.remove('bg-theme-dark')
    }
    chrome.storage.local.set({
      bg: (ev.target as HTMLInputElement).checked ? 'yes' : 'no'
    })
  }

  themeSelect.onchange = (ev) => {
    isDark = (ev.target as HTMLInputElement).value === 'dark'

    if (isBgEnabled) {
      document.body.classList.remove('bg-theme')
      document.body.classList.remove('bg-theme-dark')

      if (isDark) {
        document.body.classList.toggle('bg-theme-dark')
      } else {
        document.body.classList.toggle('bg-theme')
      }
    }

    document.documentElement.classList.toggle('dark')
    chrome.storage.local.set({ theme: (ev.target as HTMLInputElement).value })
  }
})

/* Initialize Form */
window.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(
    {
      authCredentials: {
        requirePin: false,
        autoLogin: true,
        username: '',
        password: '',
        q1: '',
        q2: '',
        q3: '',
        a1: '',
        a2: '',
        a3: ''
      }
    },
    (result) => {
      const authCredentials = result.authCredentials
      console.log(authCredentials)

      const form = document.getElementById('form_add_user') as HTMLFormElement
      const formResetBtn = document.getElementById('reset_form') as HTMLInputElement
      const formSubmitBtn = document.getElementById('submit_form') as HTMLInputElement

      const username = document.getElementById('username') as HTMLInputElement
      const usernameSubmitBtn = document.getElementById('username_submit_button') as HTMLInputElement

      const password = document.getElementById('password') as HTMLInputElement
      const a1 = document.getElementById('question_one') as HTMLInputElement
      const a2 = document.getElementById('question_two') as HTMLInputElement
      const a3 = document.getElementById('question_three') as HTMLInputElement
      const pin = document.getElementById('pin') as HTMLInputElement

      const questions = document.querySelectorAll("input[name='question']") as NodeListOf<HTMLInputElement>
      const formToggleBtns = document.querySelectorAll('.left-button,.right-button') as NodeListOf<HTMLButtonElement>

      // Extras
      const loader = document.getElementById('loader') as HTMLDivElement
      const container = document.querySelector('.box-container') as HTMLElement
      const autoLoginToggleBtn = document.getElementById('autoLogin') as HTMLInputElement

      username.value = authCredentials.username || ''
      password.value = authCredentials.password || ''
      a1.value = authCredentials.a1 || ''
      a2.value = authCredentials.a2 || ''
      a3.value = authCredentials.a3 || ''
      a1.placeholder = authCredentials.q1 || 'Your erp question 1'
      a2.placeholder = authCredentials.q2 || 'Your erp question 2'
      a3.placeholder = authCredentials.q3 || 'Your erp question 3'
      autoLoginToggleBtn.checked = authCredentials.autoLogin

      if (authCredentials.username === '') {
        logger('Enter Roll Number')
        username.removeAttribute('disabled')
        usernameSubmitBtn.removeAttribute('disabled')
      } else {
        logger(`You are all set! ${authCredentials.username}`, 'success')

        pin.style.display = 'none'
        const smallText = document.createElement('small') as HTMLElement
        smallText.setAttribute('style', 'margin-left: 50px')
        if (authCredentials.requirePin) smallText.innerText = 'PIN is set !'
        else smallText.innerText = 'PIN is NOT set !'

        pin.after(smallText)
      }

      const emptyFieldExists =
        authCredentials.username === '' ||
        authCredentials.password === '' ||
        authCredentials.a1 === '' ||
        authCredentials.q1 === 'Your erp question 1' ||
        authCredentials.a2 === '' ||
        authCredentials.q2 === 'Your erp question 2' ||
        authCredentials.a3 === '' ||
        authCredentials.q3 === 'Your erp question 2'

      if (emptyFieldExists) {
        container.classList.toggle('right-open')
      }

      formToggleBtns.forEach((button) =>
        button.addEventListener('click', () => {
          container.classList.toggle('right-open')
        })
      )

      autoLoginToggleBtn.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLInputElement

        console.log(`curr ${target.id}:`, authCredentials[target.id])
        console.log(`set ${target.id} to:`, target.checked)

        authCredentials[target.id] = target.checked
        chrome.storage.local.set({
          authCredentials: authCredentials as Credential
        })
      })

      form.addEventListener('submit', async (e) => {
        e.preventDefault()

        loader.style.display = 'flex'
        setTimeout(() => {
          loader.style.display = 'none'
        }, 500)

        if (pin.value) {
          pin.style.display = 'none'
          const smallText = document.createElement('small')
          smallText.setAttribute('style', 'margin-left: 50px')
          smallText.innerText = 'PIN is set!'
          pin.after(smallText)

          const crypto = new WebCrypto()

          const [ans1, ans2, ans3, pass] = await Promise.all([
            crypto.encrypt(a1.value, pin.value),
            crypto.encrypt(a2.value, pin.value),
            crypto.encrypt(a3.value, pin.value),
            crypto.encrypt(password.value, pin.value)
          ])

          const encryptedCred: Credential = {
            autoLogin: authCredentials.autoLogin,
            username: username.value,
            q1: a1.placeholder,
            q2: a2.placeholder,
            q3: a3.placeholder,
            requirePin: true,
            password: pass,
            a1: ans1,
            a2: ans2,
            a3: ans3
          }

          chrome.storage.local.set({ authCredentials: encryptedCred }, () => location.reload())
        } else {
          const credentials = {
            autoLogin: authCredentials.autoLogin,
            username: username.value,
            q1: a1.placeholder,
            q2: a2.placeholder,
            q3: a3.placeholder,
            requirePin: false,
            password: password.value,
            a1: a1.value,
            a2: a2.value,
            a3: a3.value
          }

          chrome.storage.local.set({ authCredentials: credentials }, () => location.reload())
        }
      })

      formResetBtn.addEventListener('click', (e) => {
        e.preventDefault()

        logger(
          'Are you sure!',
          'warning',
          true,
          () => {
            console.log('yes')
            document.forms[0].reset()
            chrome.storage.local.remove(['authCredentials'], () => {
              location.reload()
            })
          },
          () => {
            logger('Cancelled.')
          }
        )
      })

      username.addEventListener('keyup', (e) => {
        e.preventDefault()

        if (username.value.length !== 9) {
          if (username.value.length === 8 || username.value.length === 10) {
            questions.forEach((q, i) => {
              q.placeholder = `Your erp question ${i + 1}`
              q.value = ''
              q.disabled = true
            })

            password.value = ''
            pin.value = ''

            password.disabled = true
            pin.disabled = true
          }

          return
        }
      })

      usernameSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault()

        logger('Getting questions, wait...')

        const erpUser = new ERP(username.value) as unknown as {
          getAllSecurityQues: () => Promise<boolean>
          onGetSecurityQues: (data: string) => void
        }

        erpUser.getAllSecurityQues().then((res: boolean) => {
          if (res === false) {
            logger('Invalid RollNo!', 'error')
          } else {
            logger('Questions fetched!', 'success')
            password.removeAttribute('disabled')
            pin.removeAttribute('disabled')
            formSubmitBtn.removeAttribute('disabled')
          }
        })

        let idx = 0
        erpUser.onGetSecurityQues = (q: string) => {
          questions[idx].removeAttribute('disabled')
          questions[idx].placeholder = q
          idx++
        }
      })

      setTimeout(() => {
        loader.style.display = 'none'
      }, 500)
    }
  )
})
