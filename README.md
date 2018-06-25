# Code*Sass*

A code editor for people who aren't afraid of HTML tags.

## Installation

You can't install Code*Sass* via npm.

Do not use it directly in browser via cdn service.

Use the built versions in the `build` folder.

## Usage

```js
import CodeSass from 'codesass';

const sass = new CodeSass('#my-selector', { language: 'js' });
```

Add the CSS in your existing stylesheet build process:

```css
 .codesass {
     position: absolute;
     width: 100%;
     height: 100%;
     overflow: hidden;
}
 .codesass, .codesass * {
     box-sizing: border-box;
}
 .codesass__pre {
     pointer-events: none;
     z-index: 3;
     overflow: hidden;
}
 .codesass__textarea {
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
 .codesass--has-line-numbers .codesass__textarea {
     width: calc(100% - 40px);
}
 .codesass__code {
     display: block;
     font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
     overflow: hidden;
}
 .codesass__flatten {
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
 .codesass--has-line-numbers .codesass__flatten {
     width: calc(100% - 40px);
     left: 40px;
}
 .codesass__line-highlight {
     position: absolute;
     top: 10px;
     left: 0;
     width: 100%;
     height: 20px;
     background: rgba(0,0,0,0.1);
     z-index: 1;
}
 .codesass__lines {
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
 .codesass__lines__line {
     display: block;
}
 .codesass.codesass--has-line-numbers {
     padding-left: 40px;
}
 .codesass.codesass--has-line-numbers:before {
     content: '';
     position: absolute;
     left: 0;
     top: 0;
     width: 40px;
     height: 100%;
     background: #eee;
     z-index: 1;
}
 .codesass {
     background: #fff;
     color: #4f559c;
}
 .codesass .token.punctuation {
     color: #4a4a4a;
}
 .codesass .token.keyword {
     color: #8500ff;
}
 .codesass .token.operator {
     color: #ff5598;
}
 .codesass .token.string {
     color: #41ad8f;
}
 .codesass .token.comment {
     color: #9badb7;
}
 .codesass .token.function {
     color: #8500ff;
}
 .codesass .token.boolean {
     color: #8500ff;
}
 .codesass .token.number {
     color: #8500ff;
}
 .codesass .token.selector {
     color: #8500ff;
}
 .codesass .token.property {
     color: #8500ff;
}
 .codesass .token.tag {
     color: #8500ff;
}
 .codesass .token.attr-value {
     color: #8500ff;
}
```

### Handling syntax highlighting

```js
sass.setHighlightCallback((sass) => {
  // get the <code> tag to highlight
  const codeElement = sass.elCode;
  // use your highlighting engine here. highlightjs is shown
  hljs.highlightBlock(codeElement);
});
```

### Listening for changes in editor

```js
sass.onUpdate((code) => {
  // do something with code here.
  // this will trigger whenever the code
  // in the editor changes.
});
```

### Updating the editor programatically

```js
// This will also trigger .onUpdate()
sass.updateCode('const my_new_code_here = "Blabla"');
```

### Getting the current code from editor

```js
const code = sass.getCode();
```

### Enabling line numbers

```js
import CodeSass from 'codesass';

const sass = new CodeSass('#my-selector', {
  language: 'js',
  lineNumbers: true
});
```

### Enabling rtl (right to left writing)

```js
import CodeSass from 'codesass';

const sass = new CodeSass('#my-selector', {
  language: 'js',
  rtl: true
});
```

### Adding other languages support

That's up to the highlighting engine, which is independent from the editor.

### Adding your own theme to CodeSass

By default, Code*Sass* comes with a simple theme made from scratch called **CodeNoon**. You can see
it in the CSS you're supposed to use above.

If you want to use your own theme, write your own CSS and include it instead. That's right, you
don't have to write JavaScript to write CSS. That doesn't even make sense!

## Credits and thanks

Code*Sass* was made possible by awesome open-source projects such as [Rollup](https://github.com/rollup/rollup).

Thanks to kazzkiq for making CodeFlask, which is a version of this project for people who *are*
afraid of HTML tags and want JavaScript to make those scary tags for them, killing Content Security
Policies.
