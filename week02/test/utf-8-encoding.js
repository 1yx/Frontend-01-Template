const { expect } = require('chai');
const toUTF8Buffer = require('../utf-8-encoding');

// examples https://en.wikipedia.org/wiki/UTF-8#Examples
const text = "$¢ह€한𐍈";
const buffer = toUTF8Buffer(text);
expect(new Uint8Array(buffer)).to.eql(Uint8Array.from([0x24, 0xc2, 0xa2, 0xe0, 0xa4, 0xb9, 0xe2, 0x82, 0xac, 0xed, 0x95, 0x9c, 0xf0, 0x90, 0x8d, 0x88]));
