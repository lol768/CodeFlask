[![npm version](https://badge.fury.io/js/codeflask.svg)](https://www.npmjs.com/package/codeflask)
[![Build Status](https://travis-ci.org/kazzkiq/CodeFlask.svg?branch=master)](https://travis-ci.org/kazzkiq/CodeFlask)

<p align="center">
  <img src="logo.png" width="190"><br>
    CodeFlask: A micro code-editor for awesome web pages.
</p>

<p align="center">
  <img src="code.png" width="739"> 
</p>

## Installation

You can install CodeFlask via npm:

```
npm install codeflask
```

Or use it directly in browser via cdn service:

```
https://unpkg.com/codeflask/build/codeflask.min.js
```

## Usage

```js
import CodeFlask from 'codeflask';

const flask = new CodeFlask('#my-selector', { language: 'js' });
```

Add the CSS in your existing stylesheet build process:

```css
 .codeflask {
     position: absolute;
     width: 100%;
     height: 100%;
     overflow: hidden;
}
 .codeflask, .codeflask * {
     box-sizing: border-box;
}
 .codeflask__pre {
     pointer-events: none;
     z-index: 3;
     overflow: hidden;
}
 .codeflask__textarea {
     background: none;
     border: none;
     color: #fff;
     z-index: 1;
     resize: none;
     font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
     -webkit-appearance: pre;
     caret-color: #111;
     z-index: 2;
     width: 100%;
     height: 100%;
}
 .codeflask--has-line-numbers .codeflask__textarea {
     width: calc(100% - 40px);
}
 .codeflask__code {
     display: block;
     font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
     overflow: hidden;
}
 .codeflask__flatten {
     padding: 10px;
     font-size: 13px;
     line-height: 20px;
     white-space: pre;
     position: absolute;
     top: 0;
     left: 0;
     overflow: auto;
     margin: 0 !important;
     outline: none;
     text-align: left;
}
 .codeflask--has-line-numbers .codeflask__flatten {
     width: calc(100% - 40px);
     left: 40px;
}
 .codeflask__line-highlight {
     position: absolute;
     top: 10px;
     left: 0;
     width: 100%;
     height: 20px;
     background: rgba(0,0,0,0.1);
     z-index: 1;
}
 .codeflask__lines {
     padding: 10px 4px;
     font-size: 12px;
     line-height: 20px;
     font-family: 'Cousine', monospace;
     position: absolute;
     left: 0;
     top: 0;
     width: 40px;
     height: 100%;
     text-align: right;
     color: #999;
     z-index: 2;
}
 .codeflask__lines__line {
     display: block;
}
 .codeflask.codeflask--has-line-numbers {
     padding-left: 40px;
}
 .codeflask.codeflask--has-line-numbers:before {
     content: '';
     position: absolute;
     left: 0;
     top: 0;
     width: 40px;
     height: 100%;
     background: #eee;
     z-index: 1;
}
 .codeflask {
     background: #fff;
     color: #4f559c;
}
 .codeflask .token.punctuation {
     color: #4a4a4a;
}
 .codeflask .token.keyword {
     color: #8500ff;
}
 .codeflask .token.operator {
     color: #ff5598;
}
 .codeflask .token.string {
     color: #41ad8f;
}
 .codeflask .token.comment {
     color: #9badb7;
}
 .codeflask .token.function {
     color: #8500ff;
}
 .codeflask .token.boolean {
     color: #8500ff;
}
 .codeflask .token.number {
     color: #8500ff;
}
 .codeflask .token.selector {
     color: #8500ff;
}
 .codeflask .token.property {
     color: #8500ff;
}
 .codeflask .token.tag {
     color: #8500ff;
}
 .codeflask .token.attr-value {
     color: #8500ff;
}
```

### Listening for changes in editor

```js
flask.onUpdate((code) => {
  // do something with code here.
  // this will trigger whenever the code
  // in the editor changes.
});
```

### Updating the editor programatically

```js
// This will also trigger .onUpdate()
flask.updateCode('const my_new_code_here = "Blabla"');
```

### Getting the current code from editor

```js
const code = flask.getCode();
```

### Enabling line numbers

```js
import CodeFlask from 'codeflask';

const flask = new CodeFlask('#my-selector', {
  language: 'js',
  lineNumbers: true
});
```

### Enabling rtl (right to left writing)

```js
import CodeFlask from 'codeflask';

const flask = new CodeFlask('#my-selector', {
  language: 'js',
  rtl: true
});
```

### Adding other languages support:

```js
flask.addLanguage('ruby', options)
```

This API is simply a proxy to add a new language to [Prism](http://prismjs.com/) itself (the code highlighter). The `options` parameter must be the same accepted in Prism. You can read more about it [here](http://prismjs.com/extending.html#language-definitions).

By default, CodeFlask supports the following languages (which are also the default supported in Prism):

- Markup (HTML/XML);
- CSS;
- C-like;
- JavaScript;

### Adding your own theme to CodeFlask

By default, CodeFlask comes with a simple theme made from scratch called **[CodeNoon](https://github.com/kazzkiq/CodeFlask.js/blob/master/src/styles/theme-default.js)**.

You can easily override this theme with your own by writting your own CSS and adding it to your project. If that's the case, you should also disable **CodeNoon** with the `defaultTheme` option:

```js
import CodeFlask from 'codeflask';

const flask = new CodeFlask('#my-selector', {
  language: 'js',
  defaultTheme: false
});
```

# Credits & Thanks

CodeFlask.js was made possible by awesome open-source projects such as [Prism.js](https://github.com/PrismJS/prism) and [Rollup](https://github.com/rollup/rollup).
