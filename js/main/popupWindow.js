/* popupWindow.js */

const path = require('path');
const { BrowserWindow } = require("electron");
const os = require('os');
var { username } = os.userInfo();

const rootPath = path.join(__dirname, '/../../../..');
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';
const htmlPath = rootPath + '/src/html';
const utilPath = resourcePath + '/js/util';

const uconsole = require(utilPath + '/utilConsole');
const req = require(definePath + '/req');
const config = require(definePath + '/config');
const product = require(definePath + '/product');

/* alert */

// 알림 창 열기
var alertWindow = function (message) {

    const modalFile = htmlPath + '/popup/alert/alertWindow.html';

    var alertWin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 450,
        height: 210,
        title: '알림 !!',
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    alertWin.setMenuBarVisibility(false);   // 팝업창의 메뉴 제거 
    alertWin.on('close', () => { alertWin = null });
    alertWin.loadFile(modalFile);
    alertWin.show();

    if (config.isOpenDevTool) {
        alertWin.webContents.openDevTools();
    }

    if (typeof message !== 'undefined') {
        alertWin.webContents.on('dom-ready', () => {
            alertWin.webContents.send(req.alertWindow, message);
        });
    }

};
exports.alertWindow = alertWindow;

// 확인 창 열기
exports.confirmWindow = function (message) { 

    const modalFile = htmlPath + '/popup/alert/confirmWindow.html';

    var confirmWin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 450,
        height: 210,
        title: '확인',
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    confirmWin.setMenuBarVisibility(false);   // 팝업창의 메뉴 제거 
    confirmWin.on('close', () => { confirmWin = null });
    confirmWin.loadFile(modalFile);
    confirmWin.show();

    if (config.isOpenDevTool) {
        confirmWin.webContents.openDevTools();
    }

    if (typeof message !== 'undefined') {
        confirmWin.webContents.on('dom-ready', () => {
            confirmWin.webContents.send(req.confirmWindow, message);
        });
    }

};


/* menu */

// 기본 정보 창 열기
exports.infoWindow = function () {

    const modalFile = htmlPath + '/popup/menu/infoWindow.html';

    var infoWin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 1024,
        height: 768,
        title: '정보',
        resizable: false,        // 크기 재조정
        focusable: true,       // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    infoWin.setMenuBarVisibility(false);          // 팝업창의 메뉴 제거 
    infoWin.on('close', () => { infoWin = null });
    infoWin.loadFile(modalFile);
    infoWin.show();

    if (config.isOpenDevTool) {
        infoWin.webContents.openDevTools();
    }
};

// 새로 만들기 창 열기
exports.newProjWindow = function () {
    const modalFile = htmlPath + '/popup/menu/newProjWindow.html';

    var newProjWin = new BrowserWindow({
        title: '새 프로젝트',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 450,
        height: 510,
        resizable: false,            // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    newProjWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    newProjWin.on('close', () => { newProjWin = null });
    newProjWin.loadFile(modalFile);
    newProjWin.show();

    if (config.isOpenDevTool) {
        newProjWin.webContents.openDevTools();
    }
}

// 인쇄 창 열기
exports.printWindow = function () {
    const modalFile = htmlPath + '/popup/menu/printWindow.html';

    var printWin = new BrowserWindow({
        title: '프린트',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 500,
        height: 480,
        resizable: false,            // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    printWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    printWin.on('close', () => { printWin = null });
    printWin.loadFile(modalFile);
    printWin.show();

    if (config.isOpenDevTool) {
        printWin.webContents.openDevTools();
    }
}

// 접속 설정 창 열기
exports.accessWindow = function (projPath, projName) {
    const modalFile = htmlPath + '/popup/menu/accessWindow.html';

    var accessWin = new BrowserWindow({
        title: '접속 설정',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 500,
        height: 370,
        resizable: false,            // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    accessWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    accessWin.on('close', () => { accessWin = null });
    accessWin.loadFile(modalFile);
    accessWin.show();

    if (typeof projName !== 'undefined' && projName !== null) {
        accessWin.webContents.on('dom-ready', () => {
            accessWin.webContents.send(req.accessToAcessWindow, projPath, projName);
        });
    }

    if (config.isOpenDevTool) {
        accessWin.webContents.openDevTools();
    }
}

// 제품(LINUXIT 제품) 보기 창 열기 
exports.productWindow = function () {
    const modalFile = htmlPath + '/popup/menu/productWindow.html';

    var productWin = new BrowserWindow({
        title: '제품 정보',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 1024,
        height: 768,
        resizable: false,            // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    productWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    productWin.on('close', () => { productWin = null });
    productWin.loadFile(modalFile);

    productWin.show();

    if (config.isOpenDevTool) {
        productWin.webContents.openDevTools();
    }
}

//  AI 모듈 리스트 (다운로드) 창 열기
exports.moduleAIWindow = function (opt) {

    var url = opt.aiIp;
    // var url = "http://" + opt.aiIp + ":" + opt.aiPort

    var moduleAIWin = new BrowserWindow({
        title: 'AI 모듈 정보',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 1024,
        height: 768,
        resizable: true,            // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    moduleAIWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    moduleAIWin.on('close', () => { moduleAIWin = null });
    moduleAIWin.loadURL(url);

    moduleAIWin.show();

    moduleAIWin.webContents.session.on('will-download', (event, item, webcomtents) => {

        var nameOfItem = item.getFilename();
        var filePath;

        switch (config.OS) {
            case config.WINDOW:
                filePath = path.join(`c:\\Users\\${username}\\.aiplc`, 'ai');
                break;
            case config.LINUX:
                filePath = path.join(rootPath, 'ai');
                break;
        }

        item.setSavePath(path.join(filePath,`${nameOfItem}`));

        item.on('done', (event, state) => {
            if(state === 'completed') {
                alertWindow("다운로드 완료 되었습니다.");
            } else {
                alertWindow("다운로드 실패 하였습니다.");
            }
        });

    });
    
    if (config.isOpenDevTool) {
        moduleAIWin.webContents.openDevTools();
    }
}


/* navigation */

// PLC 생성(속성) 창 열기
exports.plcWindow = function (name) {
    const modalFile = htmlPath + '/popup/navigation/plcWindow.html';

    var plcWin = new BrowserWindow({
        title: 'PLC',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 400,
        height: 385,
        resizable: false,            // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    plcWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    plcWin.on('close', () => { plcWin = null });
    plcWin.loadFile(modalFile);
    plcWin.show();

    if (config.isOpenDevTool) {
        plcWin.webContents.openDevTools();
    }

    if (name.trim().length > 0) {
        plcWin.webContents.on('dom-ready', () => {
            plcWin.webContents.send(req.getPlcName, name);
        });
    }

};

// 펑션 생성(속성) 창 열기
exports.funcWindow = function (opt) {
    const modalFile = htmlPath + '/popup/navigation/funcWindow.html';

    var funcWin = new BrowserWindow({
        // title: '사용자 펑션 / 펑션 블럭',
        title: '사용자 펑션',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 500,
        height: 515,
        resizable: false,            // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    funcWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    funcWin.on('close', () => { funcWin = null });
    funcWin.loadFile(modalFile);
    funcWin.show();

    if (config.isOpenDevTool) {
        funcWin.webContents.openDevTools();
    }

    funcWin.webContents.on('dom-ready', () => {
        funcWin.webContents.send(req.getFunc, opt);
    });
};

// 태스크 만들기 창 열기
exports.taskWindow = function (opt) {
    const modalFile = htmlPath + '/popup/navigation/taskWindow.html';

    var taskWin = new BrowserWindow({
        title: '태스크',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 500,
        height: 370,
        resizable: false,            // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });


    taskWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    taskWin.on('close', () => { taskWin = null });
    taskWin.loadFile(modalFile);
    taskWin.show();

    if (config.isOpenDevTool) {
        taskWin.webContents.openDevTools();
    }

    taskWin.webContents.on('dom-ready', () => {
        taskWin.webContents.send(req.getTaskName, opt)
    });
};

// 네트워크 모듈 창 열기
global.netModWin;
exports.netModWindow = function (plces, netModules, networkName) {
    const modalFile = htmlPath + '/popup/navigation/netModuleWindow.html';

    netModWin = new BrowserWindow({
        title: '통신 모듈 설정',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 600,
        height: 510,
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    netModWin.setMenuBarVisibility(false);   // 팝업창의 메뉴 제거 
    netModWin.on('close', () => { netModWin = null });
    netModWin.loadFile(modalFile);
    netModWin.show();

    if (config.isOpenDevTool) {
        netModWin.webContents.openDevTools();
    }

    netModWin.webContents.on('dom-ready', () => {
        netModWin.webContents.send(req.initNetModule, plces, netModules, networkName);
    });

}

// 네트워크 모듈 창으로 메시지 전송
exports.sendToNetModWindow = function (base, slot, netMod, plcName, networkName) {
    if (typeof netModWin === 'undefined' || netModWin == null) {
        uconsole.log(typeof netModWin);
        return;
    }
    netModWin.webContents.send(req.setNetMod, base, slot, netMod, plcName, networkName);
}

// 네트워크 모듈 타입 창 열기
exports.netModuleTypeWindow = function (plcName, plcMod, networkName, baseStructures) {
    const modalFile = htmlPath + '/popup/navigation/netModuleTypeWindow.html';

    var netModTypeWin = new BrowserWindow({
        title: '통신 모듈 타입',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 350,
        height: 250,
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    netModTypeWin.setMenuBarVisibility(false);   // 팝업창의 메뉴 제거 
    netModTypeWin.on('close', () => { netModTypeWin = null });
    netModTypeWin.loadFile(modalFile);
    netModTypeWin.show();

    if (config.isOpenDevTool) {
        netModTypeWin.webContents.openDevTools();
    }

    netModTypeWin.webContents.on('dom-ready', () => {
        netModTypeWin.webContents.send(req.toNetModuleType, plcName, plcMod, networkName, baseStructures);
    });

}

// 네트워크 설정 창 열기
exports.netWindow = function (opt) {
    var modalFile;
    var height;
    
    switch (opt.netType) {
        case product.NET_MOD_TYPE_SERIAL:
            height = 560;
            modalFile = htmlPath + '/popup/navigation/serialWindow.html';
            break;
        case product.NET_MOD_TYPE_ETHERNET:
            height = 390;
            modalFile = htmlPath + '/popup/navigation/ethernetWindow.html';
            break;
    }

    var networkWin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 500,
        height: height,
        title: '기본 설정',
        resizable: false,           // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    networkWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    networkWin.on('close', () => { networkWin = null });
    networkWin.loadFile(modalFile);
    networkWin.show();

    if (config.isOpenDevTool) {
        networkWin.webContents.openDevTools();
    }

    networkWin.webContents.on('dom-ready', () => {
        networkWin.webContents.send(req.netType, opt);
    });
};

// 네트워크 고급 설정 창 열기
exports.netHighWindow = function () {
    const modalFile = htmlPath + '/popup/navigation/networkHighWindow.html';

    var networkHighWin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 500,
        height: 520,
        title: '고급 설정',
        resizable: false,            // 크기 재조정
        focusable: true,            // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    networkHighWin.setMenuBarVisibility(false);        // 팝업창의 메뉴 제거 
    networkHighWin.on('close', () => { networkHighWin = null });
    networkHighWin.loadFile(modalFile);
    networkHighWin.show();

    if (config.isOpenDevTool) {
        networkHighWin.webContents.openDevTools();
    }
};

// 모드버스 설정 창 열기
exports.modbusWindow = function (opt) {
    const modalFile = htmlPath + '/popup/navigation/modbusWindow.html';

    var modbusWin = new BrowserWindow({
        title: '모드버스 설정',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 500,
        height: 310,
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    modbusWin.setMenuBarVisibility(false);  // 팝업창의 메뉴 제거 
    modbusWin.on('close', () => { modbusWin = null });
    modbusWin.loadFile(modalFile);
    modbusWin.show();

    if (config.isOpenDevTool) {
        modbusWin.webContents.openDevTools();
    }

    modbusWin.webContents.on('dom-ready', () => {
        modbusWin.webContents.send(req.modbusNum, opt);
    });

}

// 속성 창 열기
exports.reNameWindow = function (name) {
    const modalFile = htmlPath + '/popup/navigation/reNameWindow.html';

    var reNameWin = new BrowserWindow({
        title: '속 성',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 300,
        height: 200,
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    reNameWin.setMenuBarVisibility(false);   // 팝업창의 메뉴 제거 
    reNameWin.on('close', () => { reNameWin = null });
    reNameWin.loadFile(modalFile);
    reNameWin.show();

    if (config.isOpenDevTool) {
        reNameWin.webContents.openDevTools();
    }

    reNameWin.webContents.on('dom-ready', () => {
        reNameWin.webContents.send(req.getReName, name);
    });
}

/* editor */

// 변수 선택 창 열기 ( 디바이스 변수 창 열기)
exports.variableSelectWindow = function (opt) {
    const modalFile = htmlPath + '/popup/editor/variableSelectWindow.html';

    var variableSelect = new BrowserWindow({
        title: '변수 선택',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 500,
        height: 590,
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    variableSelect.setMenuBarVisibility(false); // 팝업창의 메뉴 제거 
    variableSelect.on('close', () => { variableSelect = null });
    variableSelect.loadFile(modalFile);
    variableSelect.show();

    if (config.isOpenDevTool) {
        variableSelect.webContents.openDevTools();
    }

    variableSelect.webContents.on('dom-ready', () => {
        variableSelect.webContents.send(req.variableReturn, opt);
    });

};

global.funcSelect;
// 펑션 / 펑션 블럭 / AI 선택 창 열기 ( 디바이스 변수 창 열기)
exports.functionSelectWindow = function (nameClass) {
    const modalFile = htmlPath + '/popup/editor/functionSelectWindow.html';

    funcSelect = new BrowserWindow({
        title: '펑션 / 펑션 블럭',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 550,
        height: 780,
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    funcSelect.setMenuBarVisibility(false); // 팝업창의 메뉴 제거 
    funcSelect.on('close', () => { funcSelect = null });
    funcSelect.loadFile(modalFile);
    funcSelect.show();

    if (config.isOpenDevTool) {
        funcSelect.webContents.openDevTools();
    }

    if (typeof nameClass !== 'undefined') {
        funcSelect.webContents.on('dom-ready', () => {
            funcSelect.webContents.send(req.funcVariableReturn, nameClass);
        });
    }

};

// LD 의 설명 / 레이블 창 열기 ( 디바이스 변수 창 열기 )
exports.descriptionWindow = function (opt) {
    const modalFile = htmlPath + '/popup/editor/descriptionWindow.html';

    var descriptionWin = new BrowserWindow({
        title: '설명문',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 450,
        height: 255,
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    descriptionWin.setMenuBarVisibility(false); // 팝업창의 메뉴 제거 
    descriptionWin.on('close', () => { descriptionWin = null });
    descriptionWin.loadFile(modalFile);
    descriptionWin.show();

    if (config.isOpenDevTool) {
        descriptionWin.webContents.openDevTools();
    }

    descriptionWin.webContents.on('dom-ready', () => {
        descriptionWin.webContents.send(req.description, opt);
    });
};

// LD 의 설명 / 레이블 창 열기 ( 디바이스 변수 창 열기 )
exports.outDescriptionWindow = function (content) {
    const modalFile = htmlPath + '/popup/editor/outDescriptionWindow.html';

    var outDescriptionWin = new BrowserWindow({
        title: '출력 설명문',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        width: 450,
        height: 210,
        resizable: false,   // 크기 재조정
        focusable: true,    // 팝업창 
        frame: true,
        parent: win,
        modal: true
    });

    outDescriptionWin.setMenuBarVisibility(false); // 팝업창의 메뉴 제거 
    outDescriptionWin.on('close', () => { outDescriptionWin = null });
    outDescriptionWin.loadFile(modalFile);
    outDescriptionWin.show();

    if (config.isOpenDevTool) {
        outDescriptionWin.webContents.openDevTools();
    }

    outDescriptionWin.webContents.on('dom-ready', () => {
        outDescriptionWin.webContents.send(req.outDescription, content);
    });
};
