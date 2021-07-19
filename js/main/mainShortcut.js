/* shortcut.js */

const rootPath = __dirname + '/../../../..';
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const ipcPath = resourcePath + '/js/main/ipc';
const utilPath = resourcePath + '/js/util';

const { globalShortcut } = require('electron');
const { sendByMain } = require(ipcPath + '/ipcSend')
const req = require(definePath + '/req')
const action = require(definePath + '/action')
const shortcutKey = require(definePath + '/shortcutKey')
const uconsole = require(utilPath + '/utilConsole');

// 단축키 등록 함수
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

// 단축키별 정의 함수
var registShortcut = function () {

  // 디버그 창 
  register(shortcutKey.debugTool, () => {
    if (win == null) {
      console.error("win is null");
    }

    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }
  });

  // 심볼 
  // register(shortcutKey.contactP, () => {
  //   sendByMain(req.symbol, action.contactP);
  // });

  // register(shortcutKey.contactN, () => {
  //   sendByMain(req.symbol, action.contactN);
  // });

  // register(shortcutKey.coilS, () => {
  //   sendByMain(req.symbol, action.coilS);
  // });

  // register(shortcutKey.coilR, () => {
  //   sendByMain(req.symbol, action.coilR);
  // });

  // register(shortcutKey.coilP, () => {
  //   sendByMain(req.symbol, action.coilP);
  // });

  // register(shortcutKey.coilN, () => {
  //   sendByMain(req.symbol, action.coilN);
  // });

  // register(shortcutKey.openedContact, () => {
  //   sendByMain(req.symbol, action.openedContact);
  // });

  // register(shortcutKey.closedContact, () => {
  //   sendByMain(req.symbol, action.closedContact);
  // });

  // register(shortcutKey.link, () => {
  //   sendByMain(req.symbol, action.link);
  // });

  // register(shortcutKey.verticalLink, () => {
  //   sendByMain(req.symbol, action.verticalLink);
  // });

  // register(shortcutKey.funcBlock, () => {
  //   sendByMain(req.symbol, action.funcBlock);
  // });

  // register(shortcutKey.openedCoil, () => {
  //   sendByMain(req.symbol, action.openedCoil);
  // });

  // register(shortcutKey.func, () => {
  //   sendByMain(req.symbol, action.func);
  // });

  // register(shortcutKey.closedCoil, () => {
  //   sendByMain(req.symbol, action.closedCoil);
  // });

  // register(shortcutKey.esc, () => {
  //   sendByMain(req.symbol, action.esc);
  // });

}

module.exports = registShortcut;