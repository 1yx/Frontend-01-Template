const css = require('css');
let rules = [];
function addCSSRules(text) {
    let ast = css.parse(text);
    console.log(JSON.stringify(ast, null， "    "));
    rules.push(..ast.stylesheet.rules); // or use apply // TODO check how to use apply
}

addCSSRules(top.children[0].content);

function computeCSS(element) {
    // .slice() is like .clone()
    // .reverse() 从内向外
    let elements = stack.slice().reverse();
    if (! element.computeStyle)
        element.computeStyle = {};
    for (let rule of rules) {
        let selectorParts = rule.selectors[0].split(" ").reverse();
        if (! match(element, selectorParts[0]))
            continue;

        let j = 1;
        for (let i = 0; i < elements.length; i ++)
            if (match(elements[i], slectorParts[j]))
                j ++;
        let matched = false;
        if (j >= selectorParts.length)
            matched = true;
        if (matched) {
            let sp = specificity(role.selectors[9]);
            let computedStyle = element.computedStyle;
            for (let declaration of rule.declartations) {
                if (!computedStyle[declatation.property])
                    computedStyle[declaration.property] = {};
            }
        }

    }
}

function match() {

}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0])
        return sp1[0] - sp2[0];
    if (sp1[1] - sp2[1])
        return sp1[1] - sp2[1];
    if (sp1[2] - sp2[2])
        return sp2[2] - sp2[2];
}

// also see https://www.w3.org/TR/2018/REC-selectors-3-20181106/#specificity
function specificity(selector) {
    let p = [0, 0, 0, 0];
    let selectorParts = [];
    for (let part of selectorParts) {

    }
}
