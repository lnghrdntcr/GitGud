const crypto = require('crypto')
const CRYPTO_ALGO = 'aes-256-cbc'

/**
 * Encrypts the given string
 * @param {string} msg
 * @returns {object} The enctypted string, along with its initialization vector
 */
function encode(msg) {
  const iv = crypto.randomBytes(16)

  let cipher = crypto.createCipheriv(
    CRYPTO_ALGO,
    Buffer.from(process.env.CRYPTO_KEY),
    iv
  )
  let encrypted = cipher.update(msg)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
}

/**
 * Decrypts the given string
 * @param {string} msg
 * @returns {string} The decrypted token
 */

function decode(msg) {
  console.log(typeof msg)
  const iv = Buffer.from(msg.iv, 'hex')
  const encryptedText = Buffer.from(msg.encryptedData, 'hex')
  let decipher = crypto.createDecipheriv(
    CRYPTO_ALGO,
    Buffer.from(process.env.CRYPTO_KEY),
    iv
  )
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

module.exports = {
  encode,
  decode
}
