async function fetchFromErp(endpoint: string, params: string) {
  const requestURL = 'https://erp.iitkgp.ac.in' + endpoint
  const requestHeaders = new Headers()
  requestHeaders.append('Content-type', 'application/x-www-form-urlencoded')

  const driveRequest = new Request(requestURL, {
    method: 'POST',
    headers: requestHeaders,
    body: params
  })

  return fetch(driveRequest)
}

export default fetchFromErp
