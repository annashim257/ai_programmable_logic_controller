/* ipcReceive.js */
const ProgressBar = require('electron-progressbar');
const path = require('path');

const rootPath = __dirname + '/../../../../../';
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const utilPath = resourcePath + '/js/util';
const mainPath = resourcePath + '/js/main';
const eventPath = mainPath + '/event';

// renderer 프로세스에 전송하기 위한 메시지 함수
const { sendByMain, sendByMainForProjName, sendByMainForPlcName, sendByMainForNetMod } = require(mainPath + '/ipc/ipcSend');

// 압업창 띄우기 모듈 
const popupWindow = require(mainPath + '/popupWindow');

// IPC 통신 모듈
const { ipcMain } = require('electron');

// IPC 변수 모듈
const req = require(definePath + '/req');

// 메뉴 이벤트 모듈
const files = require(eventPath + '/files');
const editing = require(eventPath + '/editing');
const view = require(eventPath + '/view');
const search = require(eventPath + '/search');
const build = require(eventPath + '/build');
const tool = require(eventPath + '/tool');
const running = require(eventPath + '/running');
const help = require(eventPath + '/help');

// 새 프로젝트 생성
ipcMain.on(req.newProj, function (event, message) {
    files.eventNew();
});

// 열기
ipcMain.on(req.open, function (event, message) {
    files.eventOpen();
});

// 저장
ipcMain.on(req.save, function (event, message) {
    files.eventSave();
});

// 다른이름으로 저장
ipcMain.on(req.saveAS, function (event, message) {
    files.eventsaveAS();
});

// 프로젝트 닫기
ipcMain.on(req.closeProj, function (event, message) {
    files.eventCloseProj();
});

// 인쇄
ipcMain.on(req.print, function (event, message) {
    files.eventPrint();
});

// 잘라내기
ipcMain.on(req.cut, function (event, message) {
    editing.eventcut();
});

// 복사
ipcMain.on(req.copy, function (event, message) {
    editing.eventCopy();
});

// 붙여넣기
ipcMain.on(req.paste, function (event, message) {
    editing.eventPaste();
});

// 삭제
ipcMain.on(req.remove, function (event, message) {
    editing.eventRemove();
});

// 라인 추가
ipcMain.on(req.addLine, function (event, message) {
    editing.eventAddLine();
});

// 라인 삭제
ipcMain.on(req.removeLine, function (event, message) {
    editing.eventRemoveLine();
});

// cell 추가
ipcMain.on(req.addCell, function (event, message) {
    editing.eventAddCell();
});

// cell 삭제
ipcMain.on(req.removeCell, function (event, message) {
    editing.eventRemoveCell();
});

// 실행 취소
ipcMain.on(req.undo, function (event, message) {
    editing.eventUndo();
});

// 다시 실행
ipcMain.on(req.redo, function (event, message) {
    editing.eventRedo();
});

// 설명문 / 라벨 편집 
ipcMain.on(req.description, function (event, opt) {
    editing.eventDescription(opt.type, opt.content);
});

// 편집 도구 
ipcMain.on(req.symbol, function (event, action, opt) {
    editing.eventSymbol(action, opt);
});


// 화면 확대 보기
ipcMain.on(req.zoomIn, function (event, message) {
    view.expansion();
});

// 화면 축소
ipcMain.on(req.zoomOut, function (event, message) {
    view.reduction();
});

// 접점수 증가
ipcMain.on(req.addContactNum, function (event, message) {
    view.addContactNum();
});

// 접점수 감소
ipcMain.on(req.removeContactNum, function (event, message) {
    view.removeContactNum();
});

// 문자열 검색
ipcMain.on(req.findStr, function (event, message) {
    search.eventFindStr();
});

// 문자열 검색
ipcMain.on(req.changeStr, function (event, message) {
    search.eventChangeStr();
});

// 빌드 하기
ipcMain.on(req.build, function (event, message) {
    build.eventBuild();
});

// 다시 빌드하기
ipcMain.on(req.rebuild, function (event, message) {
    build.eventRebuild();
});

// 사용자 정의
ipcMain.on(req.userDefine, function (event, message) {
    tool.eventUserDefine();
});

// 환경 설정
ipcMain.on(req.env, function (event, message) {
    tool.eventEnv();
});

// 실행
ipcMain.on(req.run, function (event, message) {
    running.eventRun();
});

// 도움말 정보
ipcMain.on(req.info, function (event, message) {
    help.eventInfo();
});


// Plc 이름
ipcMain.on(req.setPlcName, function (event, plcName, productName) {
    sendByMainForPlcName(req.setPlcName, plcName, productName);
});

// 함수 이름
ipcMain.on(req.setFunc, function (event, data) {
    sendByMain(req.setFunc, data);
});

// 태스크 이름
ipcMain.on(req.setTaskName, function (event, data) {
    sendByMain(req.setTaskName, data);
});

// 속성 이름
ipcMain.on(req.setReName, function (event, message) {
    sendByMain(req.setReName, message);
});

// 새 프로젝트 이름 및 제품 
ipcMain.on(req.setNewProj, function (event, _projPath, _projName, progName, plcMod, cpuType, progLanguage) {

    projPathForMain = _projPath;
    projNameForMain = _projName;

    // 새 프로젝트 정보를 네비게이션 으로 전송
    sendByMainForProjName(req.setNewProj, _projPath, _projName, progName, plcMod, cpuType, progLanguage);
});

// 프로젝트 이름 변경
ipcMain.on(req.setProjName, function (event, _projName) {
    projNameForMain = _projName;
});

// 네트워크 모듈 설정
ipcMain.on(req.setNetMod, function (event, base, slot, netMod, plcName, networkName) {
    sendByMainForNetMod(req.setNetMod, base, slot, netMod, plcName, networkName);
});

// 네트워크 모듈 제거
ipcMain.on(req.removeNetMod, function (event, base, slot, netMod, plcName, networkName) {
    sendByMainForNetMod(req.removeNetMod, base, slot, netMod, plcName, networkName);
});



// 로컬 변수 선택
ipcMain.on(req.variableSelect, function (event, localVarClass) {
    sendByMain(req.variableSelect, localVarClass);
});

// 펑션 변수 선택
ipcMain.on(req.funcVariableSelect, function (event, funcVarClass) {
    sendByMain(req.funcVariableSelect, funcVarClass);
});

// 펑션 유효성 체크
ipcMain.on(req.validFunc, function (event, maxNum) {
    sendByMain(req.validFunc, maxNum);
});

// 펑션 유효성 체크 결과 
ipcMain.on(req.validFuncReturn, function (event, opt) {
    funcSelect.webContents.send(req.validFuncReturn, opt);
});

// 디버그 정보 전송
ipcMain.on(req.debugWindow, function (event, message) {
    sendByMain(req.debugWindow, message);
});

// 오류 정보 전송
ipcMain.on(req.errorWindow, function (event, message) {
    sendByMain(req.errorWindow, message);
});


// 알림 창 열기
ipcMain.on(req.alert, function (event, message) {
    popupWindow.alertWindow(message);
});

// 제품 보기 창 열기
ipcMain.on(req.productViewToMain, function (event, message) {
    popupWindow.productWindow();
});

// PLC 모듈 생성(속성) 창 열기
ipcMain.on(req.plcWindowToMain, function (event, message) {
    popupWindow.plcWindow(message);
});

// 펑션 생성(속성) 창 열기
ipcMain.on(req.funcWindowToMain, function (event, opt) {
    popupWindow.funcWindow(opt);
});

// 태스크 생성(속성) 창 열기
ipcMain.on(req.tastWindowToMain, function (event, opt) {
    popupWindow.taskWindow(opt);
});

// 네트워크 모듈 생성 창 열기
ipcMain.on(req.netModWindowToMain, function (event, plces, netModules, networkName) {
    popupWindow.netModWindow(plces, netModules, networkName);
});

// 네트워크 모듈 로 메시지 전송
ipcMain.on(req.sendToNetModWindow, function (event, base, slot, netMod, plcName, networkName) {
    popupWindow.sendToNetModWindow(base, slot, netMod, plcName, networkName);
});

// 네트워크 모듈 타입 생성 창 열기
ipcMain.on(req.netModTypeWindowToMain, function (event, plcName, plcMod, networkName, baseStructures) {
    popupWindow.netModuleTypeWindow(plcName, plcMod, networkName, baseStructures);
});

// 네트워크 창 열기
ipcMain.on(req.netWindowToMain, function (event, netType) {
    popupWindow.netWindow(netType);
});

// 네트워크 고급 창 열기
ipcMain.on(req.netHighWindowToMain, function (event, message) {
    popupWindow.netHighWindow();
});

// 모드버스 창 열기
ipcMain.on(req.modbusWindowToMain, function (event, opt) {
    popupWindow.modbusWindow(opt);
});

// 이름 변경 창 열기
ipcMain.on(req.reNameWindowToMain, function (event, message) {
    popupWindow.reNameWindow(message);
});

// 변수 선택 창 열기
ipcMain.on(req.funcSelectWindowToMain, function (event, nameClass) {
    popupWindow.functionSelectWindow(nameClass);
});

// 변수 선택 창 열기
ipcMain.on(req.variableSelectWindowToMain, function (event, opt) {
    popupWindow.variableSelectWindow(opt);
});

// 설명문 / 라벨 창 열기
ipcMain.on(req.descriptionWindowToMain, function (event, opt) {
    popupWindow.descriptionWindow(opt);
});

// 설명문 값 설정
ipcMain.on(req.setDescription, function (event, opt) {
    sendByMain(req.setDescription, opt);
});

// 출력 설명문 창 열기
ipcMain.on(req.outDescriptionWindowToMain, function (event, content) {
    popupWindow.outDescriptionWindow(content);
});

// 설명문 값 설정
ipcMain.on(req.setOutDescription, function (event, content) {
    sendByMain(req.setOutDescription, content);
});

// 온라인 - 접속 설정 
ipcMain.on(req.setAccess, function(event, opt){
    sendByMain(req.setAccess, opt);
})

// 온라인 - AI 모듈 다운로드
ipcMain.on(req.downloadAIModule, function(event, opt) {
    popupWindow.moduleAIWindow(opt);
});

var progressBar;

//  프로그레스 바 실행
var progressBarStart = function (text, detail) {
    progressBar = new ProgressBar({
        text: text,
        detail: detail,
        // style:{
        //     bar: {
        //         'width':'800px',
        //         'background-color':'#000000'
        //     },
        //     value: {
        //         'background-color':'#000000'
        //     }
        // },
        browserWindow: {
            parent: win,
            webPreferences: {
                nodeIntegration: true,
            },
        },
    });

    progressBar
        .on('completed', function () {
            progressBar.detail = '완료 되었습니다. 종료 합니다.';
        })
        .on('progress', function (value) {
            progressBar.detail = ` 처리중입니다 ... `;
        })
        .on('aborted', function () {
            // console.info(` 중단됨 ...`);
            progressBar.detail = ` 중단되었습니다. `;
        });
};

ipcMain.on(req.progressBarStart, function (event, opt) {
    progressBarStart(opt.text, opt.detail);
});


// 프로그래스 바 멈춤
var progressBarStop = function () {
    progressBar.setCompleted();
};

ipcMain.on(req.progressBarStop, function (event) {
    progressBarStop();
});



// 1차년도 과제용
//  ========================

ipcMain.on(req.writeProgExampleFromReturn, function (event, opt) {
    sendByMain(req.writeProgExampleFromReturn, opt);
});

ipcMain.on(req.writeProgExample, function (event, opt) {
    sendByMain(req.writeProgExample, opt);
});
//  ========================