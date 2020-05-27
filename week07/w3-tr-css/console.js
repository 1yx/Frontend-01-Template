let lst = document.getElementById("container").children;
let rst = [];

for (let li of lst) {
    if (li.getAttribute('data-tag').match(/css/) && li.getAttribute('data-status') === 'rem') {
         rst.push({
             name: li.children[1].innerText,
             url: li.children[1].children[0].href
         });
     }
}

console.log(JSON.stringify(rst, null, '    '));
