'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = process.env.JWT_SECRET;
const algorithm = process.env.JWT_ALGORITHM;

class Auth {

  static generateToken(user) {
    const issued = Math.round(Date.now() / 1000);
    const expires = issued + (60 * 60 * 24); // 24 hours
    const payload = {
      iat: issued,
      exp: expires,
      user,
    };
    return jwt.sign(payload, secret, {algorithm});
  }

  static hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  static verifyPassword(password, password_hash) {
    return bcrypt.compareSync(password, password_hash);
  }

  static verifyToken(token) {
    let decoded = false;
    try {
      decoded = jwt.verify(token, secret, {algorithm});
    } catch (e) {
      decoded = false; // still false
    }
    return decoded;
  }

}

module.exports = Auth;
