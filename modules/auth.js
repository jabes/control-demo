'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = process.env.JWT_SECRET;
const algorithm = process.env.JWT_ALGORITHM;

module.exports = {

  generateToken(user) {
    const issued = Math.round(Date.now() / 1000);
    const expires = issued + (60 * 60 * 24); // 24 hours
    const payload = {
      iat: issued,
      exp: expires,
      user,
    };
    return jwt.sign(payload, secret, {algorithm});
  },

  hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  },

  verifyPassword(password, password_hash) {
    return bcrypt.compareSync(password, password_hash);
  },

  decodeToken(token) {
    let decoded = false;
    try {
      decoded = jwt.verify(token, secret, {algorithm});
    } catch (e) {
      decoded = false; // still false
    }
    return decoded;
  },

  isTokenExpired(decoded) {
    const now = Math.round(Date.now() / 1000);
    const exp = decoded.exp;
    return (exp - now) < 0;
  },

  isTokenValid(token) {
    const decoded = this.decodeToken(token);
    if (decoded) {
      const expired = this.isTokenExpired(decoded);
      if (!expired) return true;
    }
    return false;
  },

};
