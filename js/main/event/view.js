/* view.js */

const rootPath = __dirname + '/../../../../../';
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const ipcPath = resourcePath + '/js/main/ipc';
const utilPath = resourcePath + '/js/util';

const { sendByMain } = require(ipcPath + '/ipcSend')

const req = require(definePath + '/req')

const uconsole = require(utilPath + '/utilConsole');

//  화면 확대 하기
exports.expansion = function () {
    sendByMain(req.expansion, req.expansion);
};

// 화면 축소 하기
exports.reduction = function () {
    sendByMain(req.reduction, req.expansion);
}

// 접점수 증가
exports.addContactNum = function () {
    sendByMain(req.addContactNum, req.addContactNum);
}

// 접점수 삭제
exports.removeContactNum = function () {
    sendByMain(req.removeContactNum, req.removeContactNum);
}
