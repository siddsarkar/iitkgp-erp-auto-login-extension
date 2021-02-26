export default function extractToken(str, tokenName) {
    const m = str.match(/[#?](.*)/)
    if (!m || m.length < 1) return null
    const params = new URLSearchParams(m[1].split('#')[0])
    return params.get(tokenName)
}
