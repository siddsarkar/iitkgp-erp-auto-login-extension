export default interface AuthRequestCredentials {
  username: string
  password: string
  answer: string
  requestedUrl?: string
  sessionToken?: string
  email_otp?: string
}
