/* rendererShortcut.js */

var rootPath = __dirname + '/../../../..';
var resourcePath = rootPath + '/src/resource';
var rendererPath = resourcePath + '/js/renderer';
var definePath = resourcePath + '/js/define';
const utilPath = resourcePath + '/js/util';

const uconsole = require(utilPath + '/utilConsole');

const { globalShortcut } = require('electron').remote;

var register = function (key, handler) {

  if (typeof key === 'undefined') {
    console.error("KEY 값이 존재 하지 않습니다.");
    return;
  }

  if (typeof handler === 'undefined ') {
    console.error("handler 함수 값이 존재 하지 않습니다.");
    return;
  }

  if (typeof handler != 'function') {
    console.error("handler가 함수가 아닙니다.");
    return;
  }

  globalShortcut.register(key, handler);

}


exports.register = register;
