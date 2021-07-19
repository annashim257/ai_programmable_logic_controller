/* search.js */

const rootPath = __dirname + '/../../../../../';
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const ipcPath = resourcePath + '/js/main/ipc';
const utilPath = resourcePath + '/js/util';

const { sendByMain } = require(ipcPath + '/ipcSend')

const req = require(definePath + '/req')

const uconsole = require(utilPath + '/utilConsole');

// 문자열 검색
var eventFindStr = function () {
    sendByMain(req.findStr, req.findStr);
};

// 문자열 바꾸기
var eventChangeStr = function () {
    sendByMain(req.changeStr, req.changeStr);
};

exports.eventFindStr = eventFindStr;
exports.eventChangeStr = eventChangeStr;