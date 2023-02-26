import type AuthRequestCredentials from 'models/AuthRequestCredentials'

class ERP {
  onGetSecurityQues: (question: string) => void
  isLoggedIn: () => Promise<boolean>
  logout: () => Promise<string>
  authRequest: (authCred: AuthRequestCredentials) => Promise<string>
  getSecurityQues: () => Promise<string>

  constructor(roll: string) {
    let username = roll || ''
    let password = ''
    const securityQuestions = {} as { [key: string]: string }

    Object.defineProperties(this, {
      username: {
        get() {
          return username
        }
      },

      password: {
        set(pass) {
          password = pass
        }
      },

      securityQuestions: {
        set(ques) {
          if (ques instanceof Object) {
            for (const q in ques) {
              if (Object.keys(securityQuestions).includes(q)) {
                securityQuestions[q] = ques[q]
              }
            }
          }
        },
        get() {
          return securityQuestions
        }
      },

      data: {
        get() {
          return { username, password, securityQuestions }
        }
      },

      load: {
        value(user: { username: string; password: string; securityQuestions: { [key: string]: string } }) {
          const { username: id, password: pass, securityQuestions: ques } = user

          if (id) {
            username = id
          }

          if (pass) {
            password = pass
          }

          if (ques) {
            for (const q in ques) {
              if (Object.prototype.hasOwnProperty.call(ques, q)) {
                securityQuestions[q] = ques[q]
              }
            }
          }

          console.info('user loaded:', {
            username,
            password,
            securityQuestions
          })
        }
      },

      getAllSecurityQues: {
        async value() {
          if (Object.keys(securityQuestions).length >= 3) {
            return Object.keys(securityQuestions)
          }

          let question
          try {
            question = await this.getSecurityQues(username)
          } catch (error) {
            console.error(error)
            return false
          }

          if (question === 'FALSE') {
            console.error(new Error('Invalid username'))
            return false
          }

          if (Object.keys(securityQuestions).length < 3) {
            if (!Object.keys(securityQuestions).includes(question)) {
              this.onGetSecurityQues(question)
            }

            securityQuestions[question] = ''
            await this.getAllSecurityQues()
          }

          return Object.keys(securityQuestions)
        }
      },

      login: {
        async value(options: { sessionToken?: string; requestedUrl?: string }) {
          let { requestedUrl } = options || {}
          const { sessionToken } = options || {}

          /* Set a default target url */
          if (!requestedUrl) {
            requestedUrl = 'https://erp.iitkgp.ac.in/IIT_ERP3/'
          }

          /* Check login status */
          const isLoggedIn = await this.isLoggedIn(requestedUrl)
          console.log({ isLoggedIn })
          if (isLoggedIn) {
            return requestedUrl
          }

          /* Get security question */
          let question
          try {
            question = await this.getSecurityQues(username)
          } catch (error) {
            console.error(error)
            return false
          }

          console.log('authSecurityQues:', question)

          /* Pick answer to the security question */
          const answer = securityQuestions[question] || ''

          /* Request for login */
          const redirectedUrl = await this.authRequest({
            username,
            password,
            answer,
            sessionToken,
            requestedUrl
          })

          return redirectedUrl
        }
      }
    })

    this.onGetSecurityQues = function (question: string) {
      console.log({ question })
    }

    this.logout = async function () {
      const url = 'https://erp.iitkgp.ac.in/IIT_ERP3/logout.htm'
      const response = (await processRequest(new Request(url))) as Response

      if (response.redirected) {
        return response.url
      }

      return Promise.reject(new Error('Logout failed'))
    }

    this.isLoggedIn = async function (requestedUrl?: string) {
      if (!requestedUrl) {
        requestedUrl = 'https://erp.iitkgp.ac.in/IIT_ERP3/'
      }

      const res = (await processRequest(new Request(requestedUrl))) as Response
      if (!res.redirected) {
        return true
      }

      return false
    }

    this.authRequest = async function (authCred: AuthRequestCredentials) {
      const { username, password, answer, sessionToken, requestedUrl } = authCred

      if (!username || !password || !answer) {
        throw new Error('Username or Password or Answer is missing!')
      }

      let body = `user_id=${username}&password=${password}&answer=${answer}`
      if (sessionToken) {
        body += `&sessionToken=${sessionToken}`
      }

      if (requestedUrl) {
        body += `&requestedUrl=${requestedUrl}`
      } else {
        body += '&requestedUrl=https://erp.iitkgp.ac.in/IIT_ERP3/'
      }

      const url = 'https://erp.iitkgp.ac.in/SSOAdministration/auth.htm'
      const method = 'POST'

      console.log('req_body:', body)
      const response = (await processRequest(new Request(url, { method, body }))) as Response

      if (response.redirected) {
        return response.url
      }

      return Promise.reject(new Error('Invalid credentials'))
    }

    this.getSecurityQues = async function (iitkgpLoginId?: string) {
      if (!iitkgpLoginId) {
        throw new Error('Please provide login id')
      }

      const url = 'https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm'
      const method = 'POST'
      const body = `user_id=${iitkgpLoginId}`

      const response = await processRequest(new Request(url, { method, body }))
      return response ? response.text() : 'FALSE'
    }

    const processRequest = async function (request: Request) {
      let ts = Date.now()
      const { url, method } = request
      const { pathname, search } = new URL(url)

      const response = await nativeFetch(request)
      ts -= Date.now()

      console.log(`${method + response.status}: ${-ts}ms ${pathname + search}`)

      if (response.ok && response.status === 200) {
        return response
      }

      return Promise.reject(new Error('Api returned status: ' + response.status))
    }

    const nativeFetch = function (request: Request) {
      if (request.method === 'POST') {
        request.headers.set('Content-type', 'application/x-www-form-urlencoded')
      }

      return fetch(request)
    }
  }
}

export default ERP
