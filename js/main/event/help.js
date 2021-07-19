/* help.js */

const rootPath = __dirname + '/../../../../../';
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const ipcPath = resourcePath + '/js/main/ipc';
const utilPath = resourcePath + '/js/util';
const mainPath = resourcePath + '/js/main';

const req = require(definePath + '/req')

const popupWindow = require(mainPath + '/popupWindow');

const uconsole = require(utilPath + '/utilConsole');

// 도움말 > 정보
var eventInfo = function () {
    popupWindow.infoWindow();
};

exports.eventInfo = eventInfo;