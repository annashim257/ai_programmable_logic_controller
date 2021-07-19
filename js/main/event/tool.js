/* tool.js */

const rootPath = __dirname + '/../../../../../';
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const ipcPath = resourcePath + '/js/main/ipc';
const utilPath = resourcePath + '/js/util';

const { sendByMain } = require(ipcPath + '/ipcSend')

const req = require(definePath + '/req')

const uconsole = require(utilPath + '/utilConsole');

// 사용자 정의
var eventUserDefine = function () {
    uconsole.log('eventUserDefine');
};

// 환경 설정
var eventEnv = function () {
    uconsole.log('eventEnv');
};

exports.eventUserDefine = eventUserDefine;
exports.eventEnv = eventEnv;