import jwt from 'jsonwebtoken'
import url from './../config/config.js'

const generateToken = (id) => {
  console.log(url.JWT_SECRET)
  return jwt.sign({ id }, url.JWT_SECRET, {
    expiresIn: '30d',
  })
}

export default generateToken
