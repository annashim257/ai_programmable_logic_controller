/* consoleTab.js */

var rootPath = __dirname + '/../../../..';
var resourcePath = rootPath + '/src/resource';
var definePath = resourcePath + '/js/define';
const utilPath = resourcePath + '/js/util';

const uconsole = require(utilPath + '/utilConsole');
const DebugTabGroup = require("electron-tabs");
const { BrowserWindow } = require('electron').remote;
const config = require(definePath + '/config');

// Define the instance of the tab group (container)
let debugTabGroup = new DebugTabGroup({
    tabContainerSelector: ".etabs-tabs-info",
    buttonsContainerSelector: ".etabs-buttons-info",
    viewContainerSelector: ".etabs-views-info",
    viewClass: "etabs-views-info"
});

let debugTab;
let errorTab;

// 디버그 탭 추가 설정 함수
var _addDebugTab = function () {

    debugTab = debugTabGroup.addTab({
        title: "디버그",
        src: "src/html/frame/article/tab/consoleDebug.html",
        visible: true,
        closable: false,
        active: true,
        ready: function () {
        },
        webviewAttributes: {
            nodeintegration: true,
            webviewTag: true
        }
    });

    debugTab.webview.classList.add('consoleDebug');

    debugTab.webview.addEventListener('dom-ready', () => {
        debugTab.webview.insertCSS(`html, body { cursor: url(../../../../../src/resource/image/default_org.png), auto !important;}`);
        if (config.isOpenDevToolForDebug) {
            debugTab.webview.openDevTools();
        }
    });


    debugTab.on("close", (tab) => {
        debugTab = null;
    });

    debugTab.on("active", (tab) => {
        // debugTab 정보 초기화 

    });
}

// 디버그 탭 추가 함수 
var addDebugTab = function () {
    if (typeof debugTab === 'undefined') {
        _addDebugTab();
    } else if (debugTab === null) {
        _addDebugTab();
    }
};


// 에러 탭 추가 설정 함수
var _addErrorTab = function () {

    errorTab = debugTabGroup.addTab({
        title: "에러",
        src: "src/html/frame/article/tab/consoleError.html",
        visible: true,
        closable: false,
        webviewAttributes: {
            nodeintegration: true,
            webviewTag: true
        }
    });

    errorTab.webview.classList.add('consoleError');

    errorTab.webview.addEventListener('dom-ready', () => {
        errorTab.webview.insertCSS(`html, body{ cursor: url(../../../../../src/resource/image/default_org.png), auto !important;}`);
        if (config.isOpenDevToolForError) {
            errorTab.webview.openDevTools();
        }
    });

    errorTab.on("close", (tab) => {
        errorTab = null;
    });

    errorTab.on("active", (tab) => {
        // errorTab 정보 초기화

    });

}

// 에러 탭 추가 함수
var addErrorTab = function (tabName, url) {
    if (typeof errorTab === 'undefined') {
        _addErrorTab();
    } else if (errorTab === null) {
        _addErrorTab();
    }

};

exports.addDebugTab = addDebugTab;
exports.addErrorTab = addErrorTab;