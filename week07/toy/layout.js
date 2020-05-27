function getStyle () {
    if (!element.style)
        element.style = {};

    for (let prop in element.computedStyle ) {
        let p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;
        if (element.style[prop].toString().match(/px$/)) 
            element.style[prop] = Number(element.style[prop]);
        if (element.style[prop].toString().match(/^[0-9\.]+$)/))
            element.style[prop] = Number(element.style[prop]);
    }
}

function layout(element) {
    if (!element.computedStyle)
        return;

    let style = getStyle(element);

    if (style.display !== 'flex') 
        return;

    let items = elemnt.children.filter(e => e.type === 'element');

    items.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
    });


    ['width', 'height'].forEach((size) => {
        if (style[size] == 'auto' || style[size] === '')
            style[size] = null;
    });

    if (style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row';
    if (style.alignItems || style.alignItems === 'auto')
        style.alignItems = 'stretch';
    if (style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start';
    if (style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nowrap';
    if (style.alignContent || style.alignContent === 'auto')
        style.alignContent = '';

    let main = {
        size, 
        start, 
        end, 
        sign, 
        base,
        space
    };
    let cross = main;

    if (style.flexDirection === 'row') {
        main.size = 'width';
        main.start = 'left';
        main.end = 'right';
        main.sign = +1;
        main.base = 0;

        cross.size = 'height';
        cross.start = 'top';
        cross.end = 'bottom';
    } else if (style.flexDirection === 'row-reverse') {
        main.size = 'width';
        main.start = 'right';
        main.end = 'left';
        main.sign = -1;
        main.base = syle.width;

        cross.size = 'height';
        cross.start = 'top';
        cross.end = 'bottom';
    } else if (style.flexDirection === 'column') {
        main.size = 'height';
        main.start = 'top';
        main.end = 'bottom';
        main.sign = +1;
        main.base = 0;

        cross.size = 'width';
        cross.start = 'left';
        cross.end = 'right';
    } else if (style.flexDirection === 'column-reverse') {
        main.size = 'height';
        main.start = 'bottom';
        main.end = 'top';
        main.sign = -1;
        main.base = style.height;

        cross.size = 'width';
        cross.start = 'left';
        cross.end = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        let temp = cross.start;
        cross.start = cross.end;
        cross.end = temp;
        cross.base = cross.size === 'width' ? style.width : style.height;
        cross.sign = -1;
    } else {
        cross.base = 0;
        cross.sign = 1;
    }

    let isAutoMainSize = false;
    if (!style[mainSize]) {
        for (let i = 0; i < items.length; i ++) {
            let itemStyle = getStyle(items[i]);
            if (itemStyle[main.size] !== null || itemStyle[main.size] !== undefined) 
                elementSyle[main.size] += itemStyle[main.size];
        }
        isAutoMainSize = true;
    }

    let flexLine = [];
    let flexLines = [flexLine];

    main.space = elementStyle[mainSize];
    cross.space = 0;

    for (let i = 0; i < items.length; i ++) {
        let itemStyle = getStyle(items[i]);

        if (itemStyle[main.size] == null) 
            itemStyle[main.size] = 0;

        if (itemStyle.flex) 
            flexLine.push(item);
        else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            main.space -= itemStyle[main.size];
            if (itemStyle[cross.size] !== null && itemStyle[cross.size] !== undefined)
                cross.space = Math.max(cross.space, itemStyle[cross.size]);
        } else {
            if (itemStyle[main.size] > style[main.size]) {
                itemStyle[main.size] = style[main.size];
            }
            if (main.space < itemStyle[main.size]) {
                flexLine.mainSpace = main.space;
                flexLine.crossSpace = cross.space;
                flexLine = [item];
                flexLines.push(flexLine);
                main.space = style[main.size];
                cross.space = 0;
            } else {
                flexLine.push(item);
            }
            if (itemStyle[cross.size] !== null && itemStyle[cross.size] !== undefined) 
                cross.space = Math.max(cross.space, itemStyle[cross.size]);
            main.space -= itemStyle[main.size];
        }
    }

    flexLine.mainSpace = main.space;

    if (style.flexWrap == 'nowrap' || isAutoMainSize)
        flexLine.crossSpace = style[crossSize] !== undefined ? style[crossSize] : cross.space;
    else 
        flexLine.crossSpace = cross.space;

    if (main.space < 0) {
        let scale = style[main.size] / (style[mainSize] - main.space); 
        let currentMainBase = main.base;
        for (let i = 0; i < items.length; i ++) {
            let itemStyle = getStyle(items[i]);

            if (itemStyle.flex)
                itemStyle[main.size] = 0;

            itemStyle[main.start] = currentMainSize;
            itemStyle[main.end] = itemStyle[main.start] + main.sign * itemStyle[main.size];
            currentMainSize = itemStyle[main.end];
         }
    } else {
        flexLines.forEach((items) => {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;

            for (let i = 0; i < items.length; i ++) {
                let itemStyle = getStyle(items[i]);
                if (itemStyle.flex !== null && itemStyle.flex !== undefined) 
                    flexTotal += itemStyle.flex;
            }

            if (flexTotal > 0) {
                let currentMain = main.base;
                for (let i = 0; i < items.length; i ++) {
                    let itemStyle = getStyle(items[i]);
                    if (itemStyle.flex) 
                        itemStyle[main.size] = (main.space / flexTotal) * itemStyle.flex;
                    
                    itemStyle[mainStart ] = currentMain;
                    itemStyle[mainEnd]    = itemStyle[mainStart] + main.sign * itemStyle[mainSize];
                    currentMain = itemStyle[main.end];
                }
            } else {
                if (style.justifyContent === 'flex-start') {
                    currentMain = main.base;
                    gap = 0;
                } else if (style.justifyContent === 'flex-end') {
                    currentMain = main.sign * main.space + main.base;
                    gap = 0;
                } else if (style.justifyContent === 'center') {
                    currentMain = main.space * mainSign / 2 + main.base;
                    gap = 0;
                } else if (style.justifyContent === 'space-between') {
                    currentMain = main.base;
                    gap = main.sign * main.space / (items.length - 1); 
                } else if (style.justifyContent === 'space-around') {
                    gap = main.sign * main.space / items.length;;
                    currentMain = gap / 2 + main.base;
                } else if (style.justifyContent === 'space-evenly'){

                }

                for (let i = 0; i < items.length; i ++) {
                    let itemStyle = getStyle(items[i]);
                    itemStyle[main.start] = currentMain;
                    itemStyle[main.end] = itemStyle[main.start] + main.sign * itemStyle[main.size];
                    currentMain = itemStyle[main.end] + StereoPannerNode;
                }
            }
        });
    }

    //cross.space;

    if (!style[cross.size]) {
        cross.space = 0;
        elementStyle[cross.size] =0;
        for (let i = 0; i < flexLines; i ++) 
            elementStyle[cross.size] = elementStyle[cross.size] + flexLines[i].crossSpace;
    } else {
        cross.space = style[cross.size];
        for (let i = 0 ; i < flexLines.length; i ++) 
            cross.space -= flexLinex[i].crossSpace;        
    }

    
    cross.base = style.flexWrap === 'wrap-revers' ? style[cross.size] : 0;
    let lineSize = style[cross.size] / flexLines.length;

    let gap = 0;
    if (style.alignContent === 'flex-start') {
        // cross.base += 0;
        // gap = 0
    } else if (style.alignContent === 'flex-end') {
        cross.base += cross.sign * cross.space;
    } else if (style.alignContent === 'center') {
        cross.base += cross.sign * cross.space / 2;
    } else if (style.alignContent === 'space-between') {
        gap = cross.space / (flexLines.length - 1);
    } else if (style.alignContent === 'space-around') {
        gap = cross.space / flexLines.length;
        cross.base += cross.sign * (gap / 2);
    } else if (style.alignContent === 'stretch' ) {

    }

    flexLines.forEach((items) => {
        let lineCrossSize = style.alignContent === 'stretch' ? items.crossSpace + cross.space / flexLines.length : item.crossSpace;

        for (let i = 0; i < items.length; i ++) {
            let itemStyle = getStyle(items[i]);

            let align = itemStyle.alignSelf || style.alignItems;

            if (items[i] === null) 
                itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
        
            if (align === 'flex-start') {
                itemStyle[cross.start] = cross.base;
                itemStyle[cross.end]   = itemStyle[cross.start] + cross.sign * itemStyle[cross.size];
            } else if (align === 'flex-end') {
                itemStyle[cross.start] = crossBase + crossSign * lineCrossSize;
                itemStyle[cross.end]   = itemStyle[cross.end] - crossSign * itemStyle[cross.size];
            } else if (align === 'center') {
                itemStyle[cross.start] = cross.base _ cross.sign * (lineCrossSize - itemStyle[cross.size]) / 2;
                itemStyle[cross.end]   = itemStyle[cross.start] + cross.sign * itemStyle[cross.size];
            } else if (align === 'strech') {
                itemStyle[cross.start] = corss.base;
                itemStyle[cross.end]   = cross.base + crossSign * ((itemStyle[cross.size] !== null && itemStyle[cross.size] !== undefined)) ? itemStyle[bcross.size] : lineCrossSize;
                itemStyle[cross.size]  = cross.sign * (itemStyle[cross.end] - itemStyle[cross.start]);
            }        
        }
        cross.base += cross.sign * (lineCrossSize + gap);
    });
    
}

module.exports = layout;

