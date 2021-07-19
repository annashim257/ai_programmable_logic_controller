/* editorTab.js */

var rootPath = __dirname + '/../../../..';
var resourcePath = rootPath + '/src/resource';
var rendererPath = resourcePath + '/js/renderer';
var definePath = resourcePath + '/js/define';
const utilPath = resourcePath + '/js/util';

const uconsole = require(utilPath + '/utilConsole');
const req = require(definePath + '/req');
const rendererShortcut = require(rendererPath + '/rendererShortcut');


const config = require(definePath + '/config');

// tabGroup
const TabGroup = require("electron-tabs");

// Drag and Drop
const dragula = require("dragula");

// Define the instance of the tab group (container)
let tabGroup = new TabGroup({
    ready: function (tabGroup) {
        dragula([tabGroup.tabContainer], {
            direction: "horizontal"
        });
    }
});

// 탭의 중복 체크하기
var checkDuplication = function (label) {
    var tabs = tabGroup.getTabs();
    if (tabs !== null) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].webview.id.trim() == label) {
                tabs[i].activate(); // 중복인 경우 해당 탭을 활성화 
                return true;
            }
        }
    }

    return false;
}

// 탭 추가하기
var addTab = function (opt) {
    if (checkDuplication(opt.progLabel)) {
        return;
    }

    let tab = tabGroup.addTab({
        title: opt.title,
        src: opt.url,
        visible: true,
        active: true,
        webviewAttributes: {
            nodeintegration: true
        }
    });

    // tab 의 클래스 이름 추가
    tab.webview.classList.add(opt.className);
    tab.webview.id = opt.progLabel;

    tab.webview.addEventListener('dom-ready', () => {
        tab.webview.insertCSS(`
            html, body, input, label, select, option, button{ 
                cursor: url(../../../../../src/resource/image/default_org.png), auto
            }
        `
        );
        var editorTab = document.querySelector('#' + opt.progLabel);
        editorTab.send(req.editor, opt);
        if (config.isOpenDevTool) {
            tab.webview.openDevTools();
        }
    });

};

// 탭 삭제하기
var removeTab = function (label) {

    if (typeof label === 'undefined') {
        console.error("className 값이 존재하지 않습니다.");
        return;
    }

    tabGroup.eachTab(function (currnetTab) {
        var tabid = currnetTab.webview.id;

        if (tabid == label) {
            currnetTab.close();
            return;
        }
    });

}

// 탭의 이름 수정
var modifyTabTitle = function (label, title) {

    if (typeof label === 'undefined') {
        console.error("className 값이 존재하지 않습니다.");
        return;
    }
    uconsole.log("label = " + label);

    tabGroup.eachTab(function (currnetTab) {

        var tabid = currnetTab.webview.id;

        uconsole.log("tabid = " + tabid);
        if (tabid == label) {
            currnetTab.setTitle(title);
            return;
        }
    });
}

// plc 이름에 의한 탭 제목 변경
var modifyTabTitleByPlc = function (oldPlcName, newPlcName) {
    if (typeof oldPlcName === 'undefined') {
        console.error("oldPlcName 값이 존재하지 않습니다.");
        return;
    }

    if (typeof newPlcName === 'undefined') {
        console.error("newPlcName 값이 존재하지 않습니다.");
        return;
    }

    tabGroup.eachTab(function (currnetTab) {
        var title = currnetTab.getTitle();
        var arr = title.split("\.");

        if (arr[0].trim() == oldPlcName) {
            currnetTab.setTitle(newPlcName + "." + arr[1]);
        }
    });
};

// 모든 탭 삭제하기
var removeAll = function () {
    tabGroup.eachTab(function (currnetTab) {
        currnetTab.close();
    });
};

// 현재 활성화 탭 가져오기
var getActiveTab = function () {
    return tabGroup.getActiveTab();
};

module.exports = { addTab, removeTab, removeAll, getActiveTab, modifyTabTitle, modifyTabTitleByPlc };
