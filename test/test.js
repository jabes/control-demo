const assert = require('assert');
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const Utils = require("../src/classes/class.utils.js");

describe('Utils.serialize', () => {

  it('should return an empty string when an unexpected parameter is given', function () {
    assert.equal("", Utils.serialize(0));
    assert.equal("", Utils.serialize(true));
    assert.equal("", Utils.serialize(null));
  });

  it('should return an empty string when an empty object is given', function () {
    assert.equal("", Utils.serialize({}));
  });

  it('should return a serialize string when an object is given', function () {
    assert.equal("hello=world&num=123", Utils.serialize({hello: 'world', num: 123}));
  });

  it('should break apart characters when a string is given', function () {
    assert.equal("0=a&1=b&2=c", Utils.serialize('abc'));
  });

});
