import crypto from 'crypto'

const SECRET = 'HANZALAH_SECRET'

export const random = (): string => {
    return crypto.randomBytes(128).toString('base64')
} 

export const authentication = (salt: string, password: string): string => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex')
}