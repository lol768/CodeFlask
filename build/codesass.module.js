var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function escape_html(e){return String(e).replace(/[&<>"'`=\/]/g,function(e){return entityMap[e]})}var CodeSass=function(e,t){if(!e)throw Error("CodeSass expects a parameter which is Element or a String selector");if(!t)throw Error("CodeSass expects an object containing options as second parameter");if(e.nodeType)this.editorRoot=e;else{var s=document.querySelector(e);s&&(this.editorRoot=s)}this.opts=t,this.startEditor()};CodeSass.prototype.startEditor=function(){this.createWrapper(),this.createTextarea(),this.createPre(),this.createCode(),this.runOptions(),this.listenTextarea(),this.populateDefault(),this.updateCode(this.code)},CodeSass.prototype.createWrapper=function(){this.code=this.editorRoot.innerHTML,this.editorRoot.innerHTML="",this.elWrapper=this.createElement("div",this.editorRoot),this.elWrapper.classList.add("codesass")},CodeSass.prototype.createTextarea=function(){this.elTextarea=this.createElement("textarea",this.elWrapper),this.elTextarea.classList.add("codesass__textarea","codesass__flatten")},CodeSass.prototype.createPre=function(){this.elPre=this.createElement("pre",this.elWrapper),this.elPre.classList.add("codesass__pre","codesass__flatten")},CodeSass.prototype.createCode=function(){this.elCode=this.createElement("code",this.elPre),this.elCode.classList.add("codesass__code","language-"+(this.opts.language||"html"))},CodeSass.prototype.createLineNumbers=function(){this.elLineNumbers=this.createElement("div",this.elWrapper),this.elLineNumbers.classList.add("codesass__lines"),this.setLineNumber()},CodeSass.prototype.createElement=function(e,t){var s=document.createElement(e);return t.appendChild(s),s},CodeSass.prototype.runOptions=function(){this.opts.rtl=this.opts.rtl||!1,this.opts.tabSize=this.opts.tabSize||2,this.opts.enableAutocorrect=this.opts.enableAutocorrect||!1,this.opts.lineNumbers=this.opts.lineNumbers||!1,this.opts.defaultTheme=!1!==this.opts.defaultTheme,!0===this.opts.rtl&&(this.elTextarea.setAttribute("dir","rtl"),this.elPre.setAttribute("dir","rtl")),!1===this.opts.enableAutocorrect&&(this.elTextarea.setAttribute("spellcheck","false"),this.elTextarea.setAttribute("autocapitalize","off"),this.elTextarea.setAttribute("autocomplete","off"),this.elTextarea.setAttribute("autocorrect","off")),this.opts.lineNumbers&&(this.elWrapper.classList.add("codesass--has-line-numbers"),this.createLineNumbers())},CodeSass.prototype.updateLineNumbersCount=function(){for(var e="",t=1;t<=this.lineNumber;t++)e=e+'<span class="codesass__lines__line">'+t+"</span>";this.elLineNumbers.innerHTML=e},CodeSass.prototype.listenTextarea=function(){var e=this;this.elTextarea.addEventListener("input",function(t){e.code=t.target.value,e.elCode.innerHTML=escape_html(t.target.value),e.highlight(),setTimeout(function(){e.runUpdate(),e.setLineNumber()},1)}),this.elTextarea.addEventListener("keydown",function(t){e.handleTabs(t),e.handleSelfClosingCharacters(t),e.handleClosingCharacters(t),e.handleNewLineIndentation(t)}),this.elTextarea.addEventListener("scroll",function(t){e.elPre.style.transform="translate3d(-"+t.target.scrollLeft+"px, -"+t.target.scrollTop+"px, 0)",e.elLineNumbers&&(e.elLineNumbers.style.transform="translate3d(0, -"+t.target.scrollTop+"px, 0)")})},CodeSass.prototype.handleTabs=function(e){if(9===e.keyCode){e.preventDefault();e.keyCode;var t=this.elTextarea.selectionStart,s=this.elTextarea.selectionEnd,a=""+this.code.substring(0,t)+" ".repeat(this.opts.tabSize)+this.code.substring(s);this.updateCode(a),this.elTextarea.selectionEnd=s+this.opts.tabSize}},CodeSass.prototype.handleSelfClosingCharacters=function(e){var t=e.key,s={"(":")","[":"]","{":"}","<":">"}[t];s&&(this.elTextarea.selectionStart!==this.elTextarea.selectionEnd?(this.surround(t,s),e.preventDefault()):this.closeCharacter(s))},CodeSass.prototype.handleClosingCharacters=function(e){var t=e.key;if([")","]","}",">"].includes(t)){var s=this.elTextarea.selectionEnd;if(this.elTextarea.selectionStart===s)this.code.substring(s,s+1)===t&&(e.preventDefault(),this.elTextarea.selectionStart=this.elTextarea.selectionEnd=s+1)}},CodeSass.prototype.setLineNumber=function(){this.lineNumber=this.code.split("\n").length,this.opts.lineNumbers&&this.updateLineNumbersCount()},CodeSass.prototype.handleNewLineIndentation=function(e){if(13===e.keyCode){var t=this.elTextarea.selectionStart,s=this.elTextarea.selectionEnd;if(t===s){var a=this.code.substring(t-1,t),i="{"===a||"("===a||"["===a,o=this.code.match(/^\s+/m),r=2;null!==o&&(r=o[0].length);var n=this.code.substring(0,t).lastIndexOf("\n"),l=this.code.substring(n+1).match(/^(\s+)/),h=0;null!==l&&(h=l[0].length),i&&(h+=r),e.preventDefault();var c,d=this.code.substring(0,t),p=this.code.substring(s),u=" ".repeat(h);if(i)c=d+"\n"+u+"\n"+" ".repeat(h-r)+p;else c=d+"\n"+u+p;this.updateCode(c),this.setLineNumber(),this.elTextarea.selectionStart=this.elTextarea.selectionEnd=d.length+1+h}}},CodeSass.prototype.surround=function(e,t){var s=this.elTextarea.selectionStart,a=this.elTextarea.selectionEnd,i=this.code.substring(0,s),o=this.code.substring(s,a),r=""+i+e+o+t+this.code.substring(a);this.updateCode(r),this.elTextarea.selectionStart=i.length+1,this.elTextarea.selectionEnd=i.length+o.length+1},CodeSass.prototype.closeCharacter=function(e){var t=this.elTextarea.selectionStart,s=this.code.substring(t,t+1).trim();if(!s||!/\w/.test(s)){var a=""+this.code.substring(0,t)+e+this.code.substring(t);this.updateCode(a),this.elTextarea.selectionEnd=t}},CodeSass.prototype.updateCode=function(e){this.code=e,this.elTextarea.value=e,this.elCode.innerHTML=escape_html(e),this.highlight(),setTimeout(this.runUpdate,1)},CodeSass.prototype.updateLanguage=function(e){var t=this.opts.language;this.elCode.classList.remove("language-"+t),this.elCode.classList.add("language-"+e),this.opts.language=e,this.highlight()},CodeSass.prototype.populateDefault=function(){this.updateCode(this.code)},CodeSass.prototype.highlight=function(){this.highlightCallback&&this.highlightCallback(this)},CodeSass.prototype.setHighlightCallback=function(e){if(e&&"[object Function]"!=={}.toString.call(e))throw Error("CodeSass expects callback of type Function");this.highlightCallback=e},CodeSass.prototype.onUpdate=function(e){if(e&&"[object Function]"!=={}.toString.call(e))throw Error("CodeSass expects callback of type Function");this.updateCallBack=e},CodeSass.prototype.getCode=function(){return this.code},CodeSass.prototype.runUpdate=function(){this.updateCallBack&&this.updateCallBack(this.code)};export default CodeSass;
