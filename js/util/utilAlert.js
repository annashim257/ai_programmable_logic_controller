/* utilAlert.js */

// ※ render 전용 이므로 renderer process 에서만 alertWindow 를 사용 하도록 해야합니다.
//    ( util 은 공용이므로 main process 와 renderer process 모두 사용하므로 공용의 모듈은 절대 사용 금지)
// ※ 2차년도 작업 할때 util 에서는 alertWnidow를 사용하지 않아야 합니다.

const { ipcRenderer } = require("electron");

const rootPath = __dirname + '/../../../..';
const req = require(rootPath + '/src/resource/js/define/req');


var alertWindow = function (message) {
    ipcRenderer.send(req.alert, message);
}

module.exports = { alertWindow };