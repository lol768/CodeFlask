import { escape_html } from './utils/html-escape';

export default class CodeSass {
  constructor(selectorOrElement, opts) {
    if (!selectorOrElement) {
      // If no selector or element is passed to CodeSass,
      // stop execution and throw error.
      throw Error('CodeSass expects a parameter which is Element or a String selector');
      return;
    }

    if (!opts) {
      // If no selector or element is passed to CodeSass,
      // stop execution and throw error.
      throw Error('CodeSass expects an object containing options as second parameter');
      return;
    }

    if (selectorOrElement.nodeType) {
      // If it is an element, assign it directly
      this.editorRoot = selectorOrElement;
    } else {
      // If it is a selector, tries to find element
      const editorRoot = document.querySelector(selectorOrElement);

      // If an element is found using this selector,
      // assign this element as the root element
      if (editorRoot) {
        this.editorRoot = editorRoot;
      }
    }

    this.opts = opts;
    this.startEditor();
  }

  startEditor() {
    // The order matters (pre > code). Don't change it
    // or things are going to break.
    this.createWrapper();
    this.createTextarea();
    this.createPre();
    this.createCode();

    this.runOptions();
    this.listenTextarea();
    this.populateDefault();
    this.updateCode(this.code);
  }

  createWrapper() {
    this.code = this.editorRoot.innerHTML;
    this.editorRoot.innerHTML = '';
    this.elWrapper = this.createElement('div', this.editorRoot);
    this.elWrapper.classList.add('codesass');
  }

  createTextarea() {
    this.elTextarea = this.createElement('textarea', this.elWrapper);
    this.elTextarea.classList.add('codesass__textarea', 'codesass__flatten');
  }

  createPre() {
    this.elPre = this.createElement('pre', this.elWrapper);
    this.elPre.classList.add('codesass__pre', 'codesass__flatten');
  }

  createCode() {
    this.elCode = this.createElement('code', this.elPre);
    this.elCode.classList.add('codesass__code', `language-${this.opts.language || 'html'}`);
  }

  createLineNumbers() {
    this.elLineNumbers = this.createElement('div', this.elWrapper);
    this.elLineNumbers.classList.add('codesass__lines');
    this.setLineNumber();
  }

  createElement(elementTag, whereToAppend) {
    const element = document.createElement(elementTag);
    whereToAppend.appendChild(element);

    return element;
  }

  runOptions() {
    this.opts.rtl = this.opts.rtl || false;
    this.opts.tabSize = this.opts.tabSize || 2;
    this.opts.enableAutocorrect = this.opts.enableAutocorrect || false;
    this.opts.lineNumbers = this.opts.lineNumbers || false;
    this.opts.defaultTheme = this.opts.defaultTheme !== false;

    if (this.opts.rtl === true) {
      this.elTextarea.setAttribute('dir', 'rtl');
      this.elPre.setAttribute('dir', 'rtl');
    }

    if (this.opts.enableAutocorrect === false) {
      this.elTextarea.setAttribute('spellcheck', 'false');
      this.elTextarea.setAttribute('autocapitalize', 'off');
      this.elTextarea.setAttribute('autocomplete', 'off');
      this.elTextarea.setAttribute('autocorrect', 'off');
    }

    if (this.opts.lineNumbers) {
      this.elWrapper.classList.add('codesass--has-line-numbers');
      this.createLineNumbers();
    }
  }

  updateLineNumbersCount() {
    let numberList = '';

    for (let i = 1; i <= this.lineNumber; i++) {
      numberList = numberList + `<span class="codesass__lines__line">${i}</span>`;
    }

    this.elLineNumbers.innerHTML = numberList;
  }

  listenTextarea() {
    this.elTextarea.addEventListener('input', (e) => {
      this.code = e.target.value;
      this.elCode.innerHTML = escape_html(e.target.value);
      this.highlight();
      setTimeout(() => {
        this.runUpdate();
        this.setLineNumber();
      }, 1);

    });

    this.elTextarea.addEventListener('keydown', (e) => {
      this.handleTabs(e);
      this.handleSelfClosingCharacters(e);
      this.handleClosingCharacters(e);
      this.handleNewLineIndentation(e);
    });

    this.elTextarea.addEventListener('scroll', (e) => {
      this.elPre.style.transform = `translate3d(-${e.target.scrollLeft}px, -${e.target.scrollTop}px, 0)`;
      if (this.elLineNumbers) {
        this.elLineNumbers.style.transform = `translate3d(0, -${e.target.scrollTop}px, 0)`;
      }
    });
  }

  handleTabs(e) {
    if (e.keyCode !== 9) {
      return;
    }
    e.preventDefault();

    const tabCode = 9;
    const pressedCode = e.keyCode;
    const selectionStart = this.elTextarea.selectionStart;
    const selectionEnd = this.elTextarea.selectionEnd;
    const newCode = `${this.code.substring(0, selectionStart)}${' '.repeat(this.opts.tabSize)}${this.code.substring(selectionEnd)}`;

    this.updateCode(newCode);
    this.elTextarea.selectionEnd = selectionEnd + this.opts.tabSize;
  }

  handleSelfClosingCharacters(e) {
    const openChars = ['(', '[', '{', '<'];
    const key = e.key;

    if (!openChars.includes(key)) {
      return;
    }

    switch(key) {
      case '(':
      this.closeCharacter(')');
      break;

      case '[':
      this.closeCharacter(']');
      break;

      case '{':
      this.closeCharacter('}');
      break;

      case '<':
      this.closeCharacter('>');
      break;
    }
  }

  handleClosingCharacters(e) {
    const closeChars = [')', ']', '}', '>'];
    const key = e.key;

    if (!closeChars.includes(key)) {
      return;
    }

    const end = this.elTextarea.selectionEnd;

    if (this.elTextarea.selectionStart !== end) {
      return;
    }

    const nextChar = this.code.substring(end, end + 1);

    if (nextChar !== key) {
      return;
    }

    e.preventDefault();

    this.elTextarea.selectionStart = this.elTextarea.selectionEnd = end + 1;
  }

  setLineNumber() {
    this.lineNumber = this.code.split('\n').length;

    if (this.opts.lineNumbers) {
      this.updateLineNumbersCount();
    }
  }

  handleNewLineIndentation(e) {
    if (e.keyCode !== 13) {
      return;
    };

    const selectionStart = this.elTextarea.selectionStart;
    const selectionEnd = this.elTextarea.selectionEnd;

    // TODO: handle this case
    if (selectionStart !== selectionEnd) {
      return;
    }

    const prevChar = this.code.substring(selectionStart - 1, selectionStart);

    const indentTrailing = prevChar === '{' || prevChar === '(' || prevChar === '[';

    const match = this.code.match(/^ +/m);
    var indentDepth = 2;
    if (match !== null) {
      indentDepth = match[0].length;
    }

    const lastNewLine = this.code.substring(0, selectionStart).lastIndexOf('\n');
    const newlineMatch = this.code.substring(lastNewLine + 1).match(/^( +)/);
    var indentLevel = 0;
    if (newlineMatch !== null) {
      indentLevel = newlineMatch[0].length;
    }

    if (indentTrailing) {
      indentLevel += indentDepth;
    }

    e.preventDefault();

    const leading = this.code.substring(0, selectionStart);
    const trailing = this.code.substring(selectionEnd);
    const indent = ' '.repeat(indentLevel);

    var newCode;
    if (indentTrailing) {
      const lastIndent = ' '.repeat(indentLevel - indentDepth);
      newCode = `${leading}\n${indent}\n${lastIndent}${trailing}`;
    } else {
      newCode = `${leading}\n${indent}${trailing}`;
    }

    this.updateCode(newCode);
    this.setLineNumber();
    this.elTextarea.selectionStart = this.elTextarea.selectionEnd = leading.length + 1 + indentLevel;
  }

  closeCharacter(closeChar) {
    const selectionStart = this.elTextarea.selectionStart;
    const selectionEnd = this.elTextarea.selectionEnd;
    const newCode = `${this.code.substring(0, selectionStart)}${closeChar}${this.code.substring(selectionEnd)}`;

    this.updateCode(newCode);
    this.elTextarea.selectionEnd = selectionEnd;
  }

  updateCode(newCode) {
    this.code = newCode;
    this.elTextarea.value = newCode;
    this.elCode.innerHTML = escape_html(newCode);
    this.highlight();
    setTimeout(this.runUpdate, 1);
  }

  updateLanguage(newLanguage) {
    const oldLanguage = this.opts.language;
    this.elCode.classList.remove(`language-${oldLanguage}`);
    this.elCode.classList.add(`language-${newLanguage}`);
    this.opts.language = newLanguage;
    this.highlight();
  }

  populateDefault() {
    this.updateCode(this.code);
  }

  highlight() {
    if (this.highlightCallback) {
      this.highlightCallback(this);
    }
  }

  setHighlightCallback(callback) {
    if (callback && {}.toString.call(callback) !== '[object Function]') {
      throw Error('CodeSass expects callback of type Function');
      return;
    }

    this.highlightCallback = callback;
  }

  onUpdate(callback) {
    if (callback && {}.toString.call(callback) !== '[object Function]') {
      throw Error('CodeSass expects callback of type Function');
      return;
    }

    this.updateCallBack = callback;
  }

  getCode() {
    return this.code;
  }

  runUpdate() {
    if (this.updateCallBack) {
      this.updateCallBack(this.code);
    }
  }
}
