export default function getSecurityQues(username) {
    const params = `user_id=${username}`
    const requestURL =
        'https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm'
    const requestHeaders = new Headers()
    requestHeaders.append(
        'Content-type',
        'application/x-www-form-urlencoded'
    )

    const driveRequest = new Request(requestURL, {
        method: 'POST',
        headers: requestHeaders,
        body: params
    })

    return fetch(driveRequest).then((response) => {
        if (response.ok && response.status === 200) {
            return response.text()
        }
        throw response.status
    })
}
