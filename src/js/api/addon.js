const ENDPOINT =
    'https://addons.mozilla.org/api/v5/addons/addon/erp-auto-login-iitkgp'

export default function fetchVersionHistory() {
    const requestURL = `${ENDPOINT}/versions/?page_size=1`
    const requestHeaders = new Headers()
    requestHeaders.append('Content-type', 'application/json')
    const driveRequest = new Request(requestURL, {
        method: 'GET',
        headers: requestHeaders
    })

    return fetch(driveRequest).then((response) => {
        if (response.ok && response.status === 200) {
            return response.json()
        }
        throw response.status
    })
}
