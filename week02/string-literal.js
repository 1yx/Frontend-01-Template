const StringLiteral = [
    '"'  + DoubleStringCharacters +'*"',
    '\'' + SingleStringCharacters +'*\''
].join('|');

const DoubleStringCharacters = DoubleStringCharacter;

const DoubleStringCharacter = [
    `[^"\\\\(${LineTerminator})]`,
    '\\\\' + EscapeSequence,
    LineContinuation
].join('|');

const LineTerminator = [
    "\r",
    "\n",
    "\u2028",
    "\u2029"
].join('|');

const EscapeSequence = [
    CharacterEscapeSequence,
    '0(?!\d)',
    HexEscapeSequence,
    UnicodeEscapeSequence
].join('|');

const CharacterEscapeSequence = [
    SingleEscapeCharacter,
    NonEscapeCharacter
].join('|');

const SingleEscapeCharacter = `['"\\bfnrtv]`;

const NonEscapeCharacter = `[^(${EscapeCharacter})(${$LineTerminator})]`;

const EscapeCharacter = [
    SingleEscapeCharacter,
    '\d',
    'x',
    'u'
].join('|');

const HexEscapeSequence = `x${HexDigit}{2}`;

const HexDigit = '[0-9a-fA-F]';

const UnicodeEscapeSequence = `u${HexDigit}{4}`;

const LineContinuation = '\\\\' + LineTerminatorSequence;

const LineTerminatorSequence = `(\r\n)|${LineTerminator}`;

const SingleStringCharacters = SingleStringCharacter;

const SingleStringCharacter = [
    `[^'\\\\(${LineTerminator})]`,
    '\\\\' + EscapeSequence,
    LineContinuation
].join('|');

module.exports = (literal) => {
    return new RegExp('^' + StringLiteral + '$', 'i');
}