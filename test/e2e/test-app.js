'use strict'

const expect = require('chai').expect;

const server = require('../test-server');

describe('CodeSass Tests', () => {
  before(() => {
    browser.url('http://localhost:8888/');
  });

  after(() => {
    server.close();
  });

  it('should open page', () => {
    const title = browser.getTitle();
    const url = browser.getUrl();
    expect(title).to.be.equals('CodeSass Test Page');
    expect(url).to.be.equals('http://localhost:8888/');
  });

  it('should create editor elements', function () {
    expect(browser.isExisting('.codesass')).to.be.true;
    expect(browser.isExisting('.codesass__pre')).to.be.true;
    expect(browser.isExisting('.codesass__textarea')).to.be.true;
    expect(browser.isExisting('.codesass__code')).to.be.true;
    expect(browser.isExisting('.codesass__flatten')).to.be.true;
    expect(browser.isExisting('.codesass__flatten')).to.be.true;
  });

  it('should enable syntax highlight', function () {
    expect(browser.isExisting('.codesass .token.punctuation')).to.be.true;
  });

  it('should render lineNumbers', function () {
    expect(browser.isExisting('.codesass .codesass__lines')).to.be.true;
    expect(browser.isExisting('.codesass .codesass__lines__line')).to.be.true;
  });

  it('should have same lineNumbers as lines of code', function () {
    $('.codesass__textarea').setValue('let it = "go";\nconst parrot = "bird";');
    expect(browser.isExisting('.codesass .codesass__lines')).to.be.true;
    const lines = $$('.codesass .codesass__lines__line');
    expect(lines.length).to.equal(2);
  });

  it('should update editor upon update', async function () {
    $('.codesass__textarea').setValue('let it = "go";');
    expect(browser.isExisting('.codesass .token.keyword'));
    expect(browser.isExisting('.codesass .token.operator'));
    expect(browser.isExisting('.codesass .token.string'));
    expect(browser.isExisting('.codesass .token.punctuation'));
  });

  it('should be instance of CodeSass', async function () {
    const isInstance = browser.execute(() => { return flask instanceof CodeSass });
    expect(isInstance.value).to.be.true;
  });

  it('.updateCode(): should update lineNumbers', async function () {
    browser.execute(() => { flask.updateCode("let age = 20"); });
    const lines = $$('.codesass .codesass__lines__line');
    expect(lines.length).to.equal(1);
  });

  it('.onUpdate(): should execute callback upon user interaction', async function () {
    $('.codesass__textarea').setValue('');
    browser.execute(() => { flask.onUpdate(code => document.title = code) });
    $('.codesass__textarea').setValue('let it = "go";');
    browser.getTitle('let it = "go";');
  });

  it('should enable rtl when rtl: true', async function () {
    browser.execute(() => {
      const test_div = document.createElement('div');
      document.body.appendChild(test_div);
      const flask_test = new CodeSass(test_div, { rtl: true });
    });
    expect(browser.isExisting('.codesass__textarea[dir="rtl"]'));
    expect(browser.isExisting('.codesass__pre[dir="rtl"]'));
  });

  it('should NOT enable rtl when rtl: false', async function () {
    browser.execute(() => {
      const test_div = document.createElement('div');
      document.body.appendChild(test_div);
      const flask_test = new CodeSass(test_div, { rtl: false });
    });
    expect(browser.isExisting('.codesass__textarea:not([dir="rtl"])'));
    expect(browser.isExisting('.codesass__pre:not([dir="rtl"])'));
  });

  it('should NOT enable rtl when rtl not set', async function () {
    browser.execute(() => {
      const test_div = document.createElement('div');
      document.body.appendChild(test_div);
      const flask_test = new CodeSass(test_div, { language: 'js' });
    });
    expect(browser.isExisting('.codesass__textarea:not([dir="rtl"])'));
    expect(browser.isExisting('.codesass__pre:not([dir="rtl"])'));
  });

  it('.getCode(): should return current code', async function () {
    $('.codesass__textarea').setValue('return "my code here"');
    const code = browser.execute(() => { return flask.getCode(); });
    expect(code.value).to.be.equals('return "my code here"');
  });
});
