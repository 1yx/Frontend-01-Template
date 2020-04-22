const convert = (code) => {
    if (code <= 0x7F)
        return [code];

    if (code <= 0x7FF)
        return [
            0xc0 | ((code >> 6) & 0x1F),
            0x80 | (code & 0x3F)
        ];

    if (code <= 0xFFFF) 
        return [
            0xE0 | ((code >> 12) & 0xF),
            0x80 | ((code >> 6) & 0x3F),
            0x80 | (code & 0x3F)
        ];
    
    if (code <= 0x10FFFF) 
        return [
            0xF0 | ((code >> 18) & 0x7),
            0x80 | ((code >> 12) & 0x3F),
            0x80 | ((code >> 6) & 0x3F),
            0x80 | (code & 0x3F)
        ];
    return [];
}

module.exports = (text) => {
    const codes = [];
    for (let c of text) 
        codes.push(...convert(c.codePointAt()));
    return (new Uint8Array(codes)).buffer;
}