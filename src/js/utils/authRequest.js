export default function authRequest({
    username,
    password,
    answer,
    requestedUrl,
    sessionToken
}) {
    const params = `user_id=${username}&password=${password}&answer=${answer}&sessionToken=${sessionToken}&requestedUrl=${requestedUrl}`
    const requestURL =
        'https://erp.iitkgp.ac.in/SSOAdministration/auth.htm'
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
            return response
        }
        throw response.status
    })
}
