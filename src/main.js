'use strict';

import description from './descriptor.js';

let output = window.document.querySelector('.output');
let editor = window.document.querySelector('.editor');

let data = { toto: 'blue' };

editor.addEventListener('input', event => {
  console.log(editor.textContent);
  output.textContent = description.parseDescriptionsFile(editor.textContent, data);
});

//pas mal : ^(\w+):([\s\S]*?)(?=(^\w))
let reqListener = function () {
  let desc = this.responseText;
  // console.log(desc);
  editor.textContent = desc;
  output.textContent = description.parseDescriptionsFile(desc, data);
};

let oReq = new XMLHttpRequest();
oReq.addEventListener('load', reqListener);
oReq.open('GET', 'main.desc');
oReq.send();
