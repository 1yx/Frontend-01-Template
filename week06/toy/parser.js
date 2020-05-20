const css = require('css');
const EOF = Symbol('EOF');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [
    {
        type: 'document',
        children: []
    }
];

let rules =[];

function addCssRules (text) {
    let ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}

function match (element, selector) {
    if (!selector || !element.attributes) 
        return false;
    if (selector.charAt(0) == '#') {
        let attr = element.attributes.filter(attr => attr.name === 'id')[0];
        if (attr && attr.value === selector.replace('#', ''))
            return true;
    } else if (selector.charAt = '.') {
        let attr = element.attributes.filter(attr => attr.name === 'class')[0];
        if (attr && attr.value === selector.replace('.', ''))
            return true;
    } else {
        if (elemnent.tagName === selector)
            return true;
    }
    return false;
}

function specificity (selector) {
    let p = [0, 0, 0, 0];
    let selectorParts = selector.split(' ');
    for (let part of selectorParts) {
        if (part.charAt(0) === '#')
            p[1] += 1;
        else if (part.charAt(0) === '.')
            p[2] += 1;
        else
            p[3] += 1;
    }
    return p;
}

function compare (sp1, sp2) {
    if (sp1[0] - sp2[0])
        return sp1[0] - sp2[0];
    if (sp1[1] - sp2[1])
        return sp1[1] - sp2[1];
    if (sp1[2] - sp2[2])
        return sp1[2] - sp2[2];

    return sp1[3] - sp2[3];
}

function computeCss (element) {
    let parents = stack.slice().reverse();
    if (!element.computedStyle)
        element.computedStyle = {};

    for (let rule of rules) {
        let selectorParts = rule.selectors[0].split(' ').reverse();
        if (!match(elemnet, selectorParts[0]))
            continue;
        let j = 1;
        for (let i = 0; i < parents.length; i ++) 
            if (match(parents[i], selectorParts[j]))
                j ++;
        if (j >= selectorParts.length) { // matched
            let sp = specificity(rule.selectors[0]);
            let cs = element.computedStyle;
            for (let d of rule.declarations) {
                if(!cs[d.property])
                    cs[d.property] = {};
                if (!cs[d.property.specificity] || compare(cs[d.property].specificity, sp) < 0) {
                    cs[d.property].value = d.value;
                    cs[d.property].specificity = sp;
                }
            }
        }
    }
}

// TODO: 
function emit (token) {
    let top = stack[stack.length - 1];
    if (token.type === 'startTag') {
        
    } else if (token.type === 'endTag') {

    } else if (token.type === 'text') {

    }
}

function data (ch) {
    if (ch === '<')
        return tagOpen;
    if ( ch === EOF) {
        emit({
            type: 'EOF'
        });
        return;
    }
    emit({
        type: 'text',
        content: ch
    });
    return data;
}

function tagOpen (ch) {
    if (c === '/') 
        return endTagOpen;
    if (ch.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'StartTag',
            tagName: ''
        };
        return tagName(ch);
    }
    emit({
        type: 'text',
        content: ch
    });
    return;
}

function tagName (ch) {
    if (c.match(/^[\t\n\f ]$/)) 
        return beforeAttributeName;
    if (c === '/')
        return selfClosingStartTag;
    if (c.match(/^[A-Z]$/)) {
        currentToken.tagName += ch;
        return tagName;
    }
    if (c === '>') {
        emit(currentToken);
        return data;
    }
    currentToken.tagName += ch;
    return tagName;
    
}

function beforeAttributeName (ch) {
    if (ch.match(/^[\t\n\f ]$/))
        return beforeAttributeName;
    if (ch === '/' || ch === '>' || ch === EOF) 
        return afterAttributeName;
    if (ch === '=')
        //TODO:
        return ;

    currentAttribute = {
        name: '',
        value: ''
    };
    return attributeName(ch);

}

function attributeName (ch) {
    if (ch.match(/^[\t\n\f ]$/) || ch === '/' || ch === '>' || ch === 'EOF')
        return afterAttributeName(ch)
    if (ch === '=')
        return beforeAttributeValue;
    if (ch === '\u0000')
        //TODO:
        return;
    if (ch === '"' || ch === "'" || ch === '<')
        //TODO:
        return;
    currentAttribute.name += ch;
    return attributeName;
}

function afterAttributeName (ch) {
    if (ch.match(/^[\t\n\f ]$/))
        return afterAttributeName;
    if (ch === '/') 
        return selfClosingStartTag;
    if (ch === '=')
        return beforeAttributeValue;
    if (ch === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }
    if (ch === EOF) 
        //TODO: 
        return;
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
        name: '',
        value: ''
    }
    return attributedName(ch);
}

function beforeAttributeValue (ch) {
    if (ch.match(/^[\t\n\f ]$/) || ch === '/' || ch === '>' || ch === EOF) 
        return beforeAttributeValue;
    if (ch === '"')
        return doubleQuotedAttributeValue;
    if (ch === "'")
        return singleQuotedAttributeValue;
    if (ch === '>')
        return data;
    return unquotedAtttributeValue(ch);
}

function doubleQuotedAttributeValue(ch) {
    if (ch === '"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }
    if (ch === '\u0000')
        // TODO:
        return;
    if (ch === EOF) 
        // TODO:
        return;
    currentAttribute.value += ch;
    return doubleQuotedAttributeValue;
    
}

function singleQuotedAttributeValue(ch) {
    if (ch === "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }
    if (c === '\u0000')
        // TODO:
        return;
    if (c === EOF)
        // TODO:
        return;
    currentAttribute.value += ch;
    return singleQuotedAttributeValue;
}

function afterQuotedAttributeValue(ch) {
    if (ch.match(/^[\t\n\f ]$/)) 
        return beforeAttributeName;
    if (ch === '/')
        return selfClosingStartTag;
    if (ch === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }
    if (ch === EOF) 
        // TODO:
        return;
    // TODO:
    return;    
}

function unquotedAtttributeValue(ch) {
    if (ch.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }
    if (ch === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }
    if (ch === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }
    if (ch === '\u0000') 
        // TODO: 
        return;
    if (ch === '"' || ch === "'" || ch === '<' || ch === '=' || ch === '`')
        // TODO: 
        return;
    if (ch === EOF)
        // TODO: 
        return;
    currentAttribute.value += ch;
    return unquotedAtttributeValue;
}

function selfClosingStartTag(ch) {
    if (ch === '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    }
    if (ch === EOF)
        // TODO: 
        return;
    // TODO:
    return;
}

function endTagOpen(ch) {
    if (ch.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(ch);
    }
    if (ch === '>')
        // TODO:
        return;
    if (ch === EOF)
        // TODO:
        return;
    // TODO:
    return;
}

module.exports.parseHtml = function parseHtml(html) {
    let state = data;
    for(let ch of html)
        state = state(c);
    state = state(EOF);
    return stack[0];
};