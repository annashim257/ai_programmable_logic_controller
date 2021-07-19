/* build.js */
const path = require('path');

const rootPath = path.join(__dirname, '/../../../../../');
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const ipcPath = resourcePath + '/js/main/ipc';

const { sendByMain } = require(ipcPath + '/ipcSend');
const req = require(definePath + '/req');

// 빌드 시작
var eventBuild = function (plcName) {
    sendByMain(req.buildByMain, "");
};

// 재 빌드 시작
var eventRebuild = function () {
    sendByMain(req.rebuildByMain, "");
};

exports.eventBuild = eventBuild;
exports.eventRebuild = eventRebuild;
