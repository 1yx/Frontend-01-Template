const NumericLiteral = [
    DecimalLiteral,
    HexIntegerLiteral
].join('|');

const DecimalLiteral = [
    DecimalIntegerLiteral + '\\.' + DecimalDigits + ExponentPart,
    '\\.' + DecimalDigits + ExponentPart,
    DecimalIntegerLiteral + ExponentPart
].join('|');

const DecimalIntegerLiteral = [
    '0',
    NonZeroDigit + DecimalDigits
].join('|');

const NonZeroDigit = '[0-9]';

const DecimalDigits = '\d+';

const ExponentPart = ExponentIndicator + SignedInteger;

const ExponentIndicator = '[eE]';

const SignedInteger = '[+-]?' + DecimalDigits;

const HexIntegerLiteral = '0[x|X]' + HexDigit + '+';

const HexDigit = '[0-9a-fA-F]';

module.exprots = () => {
    return new RegExp('^' + NumericLiteral + '$', 'i');
}