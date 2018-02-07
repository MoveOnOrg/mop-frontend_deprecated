import React from 'react' // needed to get JSX in scope for text2paraJsx
import Config from './config'

export const formatDate = (date) => {
  const monthAbbr = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()
  return `${monthAbbr[monthIndex]} ${day}, ${year}`
}

export const text2paras = (str) => str.split(/\n+/)

export const ellipsize = (str, length) => {
  const re = new RegExp(`^(.{0,${length}})(\\s|$)`)
  const match = String(str).substr(0, length + 1).match(re)
  if (!match) {
    // Just in case some weirdo puts 500 characters without a space at the beginning of a petition summary
    return String(str).substr(0, length)
  }
  if (match[2].length) {
    // We matched a space instead of the end of string so add ...
    return `${match[1]}...`
  }
  return match[1]
}

export const text2paraJsx = (str) => {
  const paras = text2paras(str)
  return paras.map((paragraph, i) => {
    const paragraphKey = `p${i}`
    return (
      <p key={paragraphKey}>{paragraph}</p>
    )
  })
}

export const moNumber2base62 = (num) => {
  // This converts a number to base62, and will be used to generate petition redirect urls
  // example: 125962 => 'pju'
  // See petitionShortCode() below
  const base62 = 'BCDFoHJKLMNPQRSTVWXYZAEIOU012345p789aeiGubcdfghjklzn6qrstvwxym'
  const char62s = []
  let numLeft = num
  let tooMany = 13
  while (numLeft > 0 && --tooMany) {
    char62s.push(base62[numLeft % 62])
    numLeft = parseInt(numLeft / 62, 10)
  }
  return char62s.reverse().join('')
}

export const md5ToToken = (responseMd5) => (
  moNumber2base62(parseInt(responseMd5.slice(0, 12), 16))
)

export const petitionShortCode = (mode, petitionId, userId, responseMd5) => {
  // Returns a url that will redirect to the petition that
  // tracks the userId of the sharer along with the mode of sharing (e.g. twitter/email)
  // mirrors server-part petitions/petition_shortcode.py
  const codeParts = [((userId) ? mode : mode.toUpperCase())]
  const petitionCode = moNumber2base62(parseInt(petitionId, 10))
  codeParts.push(petitionCode)
  let ident = userId
  if (!userId) {
    if (responseMd5) {
      // This takes the first 12 chars of the md5 body, parses it from the hex,
      // and then, even as a really big number, we'll crush it into our base62
      // the server saves this token in signing, so we can match them up
      // later.  Note that we are in a 16^12 number space, so we have a LOT
      // of room even with millions of signatures to make a collision unlikely.
      ident = parseInt(responseMd5.slice(0, 12), 16)
    }
  }
  if (ident) {
    codeParts.push(moNumber2base62(parseInt(ident, 10)))
  }
  const shortCode = codeParts.join('_')
  return `${Config.BASE_URL}/p/${shortCode}`
}

export const isValidEmail = (email) => {
  const regex = /.+@.+\..+/ // Forgiving email regex
  return regex.test(email)
}
