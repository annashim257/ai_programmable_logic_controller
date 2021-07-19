/* online.js */

const path = require('path');

const rootPath = path.join(__dirname, '/../../../../../');
const resourcePath = rootPath + '/src/resource';
const mainPath = resourcePath + '/js/main';
const ipcPath = resourcePath + '/js/main/ipc';
const definePath = resourcePath + '/js/define';

const req = require(path.join(definePath, 'req'));
const popupWindow = require(mainPath + '/popupWindow');
const { sendByMain } = require(ipcPath + '/ipcSend');

// PLC 접속 시작
exports.eventAccessStart = function (projPath, projName) {
    sendByMain(req.accessStart, "");
}

// PLC 접속 종료
exports.eventAccessStop = function () {
    sendByMain(req.accessStop, "");
}

// PLC 접속 설정 창 열기
exports.eventAccess = function (projPath, projName) {
    popupWindow.accessWindow(projPath, projName);
}

// PLC 전송 
exports.eventWrite = function (projPath, projName) {
    sendByMain(req.write, "");
}

// AI 모듈 다운로드 창 열기
exports.eventDownloadAIModule = function () {
    sendByMain(req.downloadAIModule, "");
}

// 디바이스 모니터
exports.eventDeviceMonitor = function () {
    popupWindow.eventDeviceMonitor();
}

