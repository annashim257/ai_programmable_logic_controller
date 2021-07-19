/* running.js */

const path = require('path');

const rootPath = path.join(__dirname, '/../../../../../');
const resourcePath = rootPath + '/src/resource';
const mainPath = resourcePath + '/js/main';
const utilPath = resourcePath + '/js/util';

const uSocket = require(utilPath + '/utilSocket');
const popupWindow = require(mainPath + '/popupWindow');

// 알림 메시지
var alertWindowbyMain = function (message) {
    popupWindow.alertWindow(message);
}

// 시작
exports.eventRun = function () {
    uSocket.send(uSocket.createPacket(uSocket.CODE_RUN), alertWindowbyMain);
};

// 정지
exports.eventStop = function () {
    uSocket.send(uSocket.createPacket(uSocket.CODE_STOP), alertWindowbyMain);
};

// 일시 정지
exports.eventResume = function () {
    uSocket.send(uSocket.createPacket(uSocket.CODE_RESUME), alertWindowbyMain);
};


// 일시 정지
exports.eventPause = function () {
    uSocket.send(uSocket.createPacket(uSocket.CODE_PAUSE), alertWindowbyMain);
}