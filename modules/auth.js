'use strict';

const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const secret = process.env.JWT_SECRET;

class Auth {

  static generateUUID() {
    return uuidv4();
  }

  static generateToken(uuid) {
    const payload = {
      id: uuid,
    };
    const options = {
      expiresIn: '1h',
    };
    return jwt.sign(payload, secret, options);
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
      decoded = jwt.verify(token, secret);
    } catch (e) {
      decoded = false; // still false
    }
    return decoded;
  }

}

module.exports = Auth;
