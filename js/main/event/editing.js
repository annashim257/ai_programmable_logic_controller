/* editing.js */

const rootPath = __dirname + '/../../../../../';
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const ipcPath = resourcePath + '/js/main/ipc';
const utilPath = resourcePath + '/js/util';

const { sendByMain } = require(ipcPath + '/ipcSend');

const req = require(definePath + '/req');

const action = require(definePath + '/action');

const uconsole = require(utilPath + '/utilConsole');

// 잘라내기
exports.eventcut = function () {
    uconsole.log(action.cut);
    sendByMain(req.editAll, action.cut);
};

// 복사 
exports.eventCopy = function () {
    sendByMain(req.editAll, action.copy);
};

// 붙여넣기
exports.eventPaste = function () {
    sendByMain(req.editAll, action.paste);
};

// 삭제 
exports.eventRemove = function () {
    sendByMain(req.editAll, action.remove);
}

// 라인 삽입
exports.eventAddLine = function () {
    sendByMain(req.addLine, action.addLine);
};

// 라인 삭제 
exports.eventRemoveLine = function () {
    sendByMain(req.removeLine, action.removeLine);
};

// 셀 삽입 
exports.eventAddCell = function () {
    sendByMain(req.addCell, action.addCell);
};

// 셀 삭제 
exports.eventRemoveCell = function () {
    sendByMain(req.removeCell, action.removeCell);
};

// 실행 취소
exports.eventUndo = function () {
    sendByMain(req.editAll, action.undo);
};

// 재실행
exports.eventRedo = function () {
    sendByMain(req.editAll, action.redo);
};

// 설명문 / 레이블
exports.eventDescription = function () {
    sendByMain(req.descriptionFromMenu, "");
};

// 편집 도구
exports.eventSymbol = function(opt) {
    sendByMain(req.symbol, opt);
}