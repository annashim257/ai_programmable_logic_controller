/* files.js */

// 3rd-part 모듈
const path = require('path');
const { dialog } = require('electron');

const rootPath = __dirname + '/../../../../..';
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const ipcPath = resourcePath + '/js/main/ipc';
const utilPath = resourcePath + '/js/util';
const mainPath = resourcePath + '/js/main';

// 자체 모듈
const { sendByMain } = require(ipcPath + '/ipcSend')
const req = require(definePath + '/req')
const action = require(definePath + '/action')
const config = require(definePath + '/config')
const popupWindow = require(mainPath + '/popupWindow');
const uFile = require(utilPath + '/utilFile');
const uconsole = require(utilPath + '/utilConsole');

// 알림 메시지
var alertWindowbyMain = function (message) {
    popupWindow.alertWindow(message);
}

// 새로 생성
exports.eventNew = function () {
    popupWindow.newProjWindow();
}

// 프로젝트 열기 ( = 폴더 열기 ) 
exports.eventOpen = function () {
    const options = {
        title: '프로젝트 열기',
        properties: ['openFile'],
        filters: [
            { name: "xml", extensions: ["xml"] }
        ]
    }

    dialog.showOpenDialog(options).then(function (result) {
        var filePath = result.filePaths[0];

        if ( typeof filePath === 'undefined' || filePath.length === 0) {
            return;
        }
        
        var arr;
        switch (config.OS) {
            case config.LINUX:
                arr = filePath.split('/');
                projNameForMain = arr[arr.length - 1].split('\.')[0];
                projPathForMain = filePath.replace( '/' + projNameForMain + config.extension , '');
                break;
            case config.WINDOW:
                arr = filePath.split('\\');
                projNameForMain = arr[arr.length - 1].split('\.')[0];
                projPathForMain = filePath.replace( '\\' + projNameForMain + config.extension , '');
                break;
        }

        sendByMain(req.openToNavigation , {
            projPath: projPathForMain, 
            projName: projNameForMain 
        });

    }).then(function (err) {
        if (typeof err !== 'undefined') {
            uconsole.log(err);
        }
    })

};

// 프로젝트 저장 
var eventSave = function(){
    if (typeof projNameForMain === 'undefined' || projNameForMain.trim().length == 0) {
        alertWindowbyMain('프로젝트를 저장 할 수 없습니다.');
        return;
    }

    uFile.fileSave(
        path.join(projPathForMain, config.prefix + projNameForMain + config.extension),
        path.join(projPathForMain, projNameForMain + config.extension),
        alertWindowbyMain
    );
}
exports.eventSave = eventSave;

// 프로젝트 다른이름으로 저장
exports.eventsaveAS = function () {

    if (typeof projNameForMain === 'undefined' || projNameForMain.trim().length == 0) {
        alertWindowbyMain('프로젝트를 저장 할 수 없습니다.');
        return;
    }

    const options = {
        title: '다른이름으로 저장',
        properties: ['createDirectory'],
        filters: [
            { name: "xml", extensions: ["xml"] }
        ]
    }

    dialog.showSaveDialog(options).then(function (result) {
        var fileName = result.filePath;
        if ( fileName.trim().length > 0  ) {
            uFile.fileSave(path.join(projPathForMain, config.prefix + projNameForMain + config.extension), fileName, alertWindowbyMain);
        }
    }).then(function (err) {
        if (typeof err !== 'undefined') {
            console.error(err);
        }
    })
};

// 프로젝트 닫기
exports.eventCloseProj = function () {
    // navigaciton / editor / console 프로세스으로 전송

    options = {
        type: 'question',  //종류
        buttons: ['예', '아니오', '취소'],  //버튼 스타일
        defaultId: 2,  //고유 아이디
        title: '제목',  //제목
        message: '프로젝트를 저장 하시겠습니까?',
        detail: '',
    };

    dialog.showMessageBox(options).then(function(res){
      
      if (res.response === 0 ) {    // 예 

        sendByMain(req.closeProj, action.clear);
      } else if (res.response === 1 ) {     // 아니오

        sendByMain(req.closeProj, action.clear);
      }

    });

    
};

// 인쇄
exports.eventPrint = function () {
    // index 프로세스로 전송
    // popupWindow.printWindow();
    alertWindowbyMain("개발 진행중 입니다.....");
};

