/* ipcSend.js */

const rootPath = __dirname + '/../../../../../';
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const utilPath = resourcePath + '/js/util';

const uconsole = require(utilPath + '/utilConsole');

const req = require(definePath + '/req')



// Main 에서 renderer 에게 이벤트 메시지 전송 ( Project Name 정보 던달 )
var sendByMainForProjName = function (requestName, projPath, projName, progName, plcMod, cpuType, progLanguage ) {
    win.webContents.send(requestName, projPath, projName, progName, plcMod, cpuType, progLanguage );
};

// Main 에서 renderer 에게 이벤트 메시지 전송 ( Plc Name 정보 전달 )
var sendByMainForPlcName = function (requestName, plcName, productName) {
    win.webContents.send(requestName, plcName, productName);
};

// Main 에서 renderer 에게 이벤트 메시지 전송 ( Network Module 정보 전달 )
var sendByMainForNetMod = function (requestName, base, slot, netMod, plcName, networkName) {
    win.webContents.send(requestName, base, slot, netMod, plcName, networkName );
};


// Main 에서 renderer 에게 이벤트 메시지 전송  ( 문자열 전송 )
var sendByMain = function (requestName, message) {
    win.webContents.send(requestName, message);
};

module.exports = { sendByMain, sendByMainForProjName, sendByMainForPlcName, sendByMainForNetMod};
