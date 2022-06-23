import express from 'express'

// TODO: create in another file
import crypto from 'crypto'
const alg = 'aes-256-cbc'
const key = crypto.scryptSync('FoCKvdLslUuB4y3E=', 'salt', 32)
const iv = crypto.randomBytes(16)

export const routes = express.Router()

// function encrypt(text: string) {
//   console.log(key.length)
//   const cipher = crypto.createCipheriv(alg, key, iv)
//   // const encrypted = cipher.update(text)
//   const encrypted = cipher.update(text, 'utf8', 'hex')

//   return encrypted
// }
function encrypt(text: string) {
  console.log(key.length, { key })
  const cipher = crypto.createCipheriv(alg, key, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  // const encrypted = cipher.update(text, 'utf8', 'hex')

  return { iv: iv.toString('hex'), encrypted, encryptedData: encrypted.toString('hex'), }
}
function decrypt(text: { encryptedData: string, iv: string }) {
  let iv = Buffer.from(text.iv, 'hex')

  let encryptedText = Buffer.from(text.encryptedData, 'hex')
  console.log({ iv, encryptedText })

  // Creating Decipher
  let decipher = crypto.createDecipheriv(alg, Buffer.from(key), iv)

  // Updating encrypted text
  let decrypted = decipher.update(encryptedText)
  console.log({ decrypted })
  decrypted = Buffer.concat([decrypted, decipher.final()])
  console.log({ decrypted })


  return decrypted.toString()
}
// function decrypt(text: string) {
//   console.log(key.length)
//   const decipher = crypto.createDecipheriv(alg, key, iv)
//   // const encrypted = cipher.update(text)
//   const plain = decipher.update(text, 'hex', 'utf8')

//   return plain
// }

routes.post('/generate', async (req, res) => {
  const { key, text } = req.body
  console.log({ text })
  const data = encrypt(text)
  return res.status(200).json({ data })
})
routes.post('/decode', async (req, res) => {
  const { text } = req.body
  console.log({ text })
  const data = decrypt(text)
  return res.status(200).json({ data })
})