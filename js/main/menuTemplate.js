/* menuTemplate.js */

/* 변수 */

const path = require('path');
const rootPath = path.join(__dirname, '/../../../..');
const resourcePath = rootPath + '/src/resource';
const mainPath = resourcePath + '/js/main';
const eventPath = resourcePath + '/js/main/event';
const definePath = resourcePath + '/js/define';

// 메뉴 이벤트 모듈 로딩
const files = require(eventPath + '/files');
const editing = require(eventPath + '/editing');
const view = require(eventPath + '/view');
const search = require(eventPath + '/search');
const build = require(eventPath + '/build');
const tool = require(eventPath + '/tool');
const running = require(eventPath + '/running');
const help = require(eventPath + '/help');
const online = require(eventPath + '/online');

const shortcutKey = require(definePath + '/shortcutKey');
const action = require(definePath + '/action');

const popupWindow = require(mainPath + '/popupWindow');

// 메뉴 템플릿 
let menuTemplate = [
  {
    label: '파일(F)',
    submenu: [
      {
        label: '새 프로젝트',
        icon: resourcePath + '/image/index/menu/menu_newProj.png',
        accelerator: shortcutKey.newProj,
        click: function (item, focusedWindow) {
          files.eventNew();
        }
      },
      {
        label: '프로젝트 열기',
        icon: resourcePath + '/image/index/menu/menu_open.png',
        accelerator: shortcutKey.open,
        click: function (item, focusedWindow) {
          files.eventOpen();
        }
      },
      {
        label: '프로젝트 저장',
        icon: resourcePath + '/image/index/menu/menu_save.png',
        accelerator: shortcutKey.save,
        click: function (item, focusedWindow) {
          files.eventSave();
        }
      },
      {
        label: '다른이름으로 저장',
        icon: resourcePath + '/image/index/menu/menu_saveAs.png',
        accelerator: shortcutKey.saveAS,
        click: function (item, focusedWindow) {
          files.eventsaveAS();
        }
      },
      {
        label: '프로젝트 닫기',
        icon: resourcePath + '/image/index/menu/menu_closeProj.png',
        accelerator: shortcutKey.closeProj,
        click: function (item, focusedWindow) {
          files.eventCloseProj();
        }
      },
      {
        label: '인쇄',
        icon: resourcePath + '/image/index/menu/menu_print.png',
        enabled:false,
        accelerator: shortcutKey.print,
        click: function (item, focusedWindow) {
          files.eventPrint();
        }
      },
      {
        label: '종료',
        icon: resourcePath + '/image/index/menu/menu_exit.png',
        accelerator: shortcutKey.exit,
        click: function (item, focusedWindow) {
          win.close();
        }
      }
    ]
  },
  {
    label: '편집(E)',
    submenu: [
      {
        label: '잘라내기',
        icon: resourcePath + '/image/index/menu/menu_cut.png',
        accelerator: shortcutKey.cut,
        click: function (item, focusedWindow) {
          editing.eventcut();
        }
      },
      {
        label: '복사',
        icon: resourcePath + '/image/index/menu/menu_copy.png',
        accelerator: shortcutKey.copy,
        click: function (item, focusedWindow) {
          editing.eventCopy();
        }
      },
      {
        label: '붙여넣기',
        icon: resourcePath + '/image/index/menu/menu_paste.png',
        accelerator: shortcutKey.paste,
        click: function (item, focusedWindow) {
          editing.eventPaste();
        }
      },
      {
        type: 'separator'
      },
      {
        label: '라인 삽입',
        icon: resourcePath + '/image/index/menu/menu_addLine.png',
        accelerator: shortcutKey.addLine,
        click: function (item, focusedWindow) {
          editing.eventAddLine();
        }
      },
      {
        label: '라인 삭제',
        icon: resourcePath + '/image/index/menu/menu_removeLine.png',
        accelerator: shortcutKey.removeLine,
        click: function (item, focusedWindow) {
          editing.eventRemoveLine();
        }
      },
      {
        label: '셀 삽입',
        icon: resourcePath + '/image/index/menu/menu_addCell.png',
        accelerator: shortcutKey.addCell,
        click: function (item, focusedWindow) {
          editing.eventAddCell();
        }
      },
      {
        label: '셀 삭제',
        icon: resourcePath + '/image/index/menu/menu_removeCell.png',
        accelerator: shortcutKey.removeCell,
        click: function (item, focusedWindow) {
          editing.eventRemoveCell();
        }
      },
      {
        label: '삭제', 
        icon: resourcePath + '/image/index/menu/menu_remove.png',
        accelerator: shortcutKey.remove,
        click: function (item, focusedWindow) {
          editing.eventRemove();
        }
      },
      {
        type: 'separator'
      },
      {
        label: '실행 취소',
        icon: resourcePath + '/image/index/menu/menu_undo.png',
        accelerator: shortcutKey.undo,
        // role: 'undo',
        click: function (item, focusedWindow) {
          editing.eventUndo();
        }
      },
      {
        label: '다시 실행',
        icon: resourcePath + '/image/index/menu/menu_redo.png',
        accelerator: shortcutKey.redo,
        // role: 'redo',
        click: function (item, focusedWindow) {
          editing.eventRedo();
        }
      },
      {
        type: 'separator'
      },
      {
        label: '설명문/레이블 편집',
        icon: resourcePath + '/image/index/menu/menu_label.png',
        click: function (item, focusedWindow) {
          editing.eventDescription();
        }
      },
      {
        type: 'separator'
      },
      {
        label: '편집 도구',
        submenu: [
          {
            label: '열린 접점',
            icon: resourcePath + '/image/index/menu/menu_openedContact.png',
            accelerator: shortcutKey.openedContact,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.openedContact,
                isShortcut: true
              });
            }
          },
          {
            label: '닫힌 접점',
            icon: resourcePath + '/image/index/menu/menu_closedContact.png',
            accelerator: shortcutKey.closedContact,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.closedContact,
                isShortcut: true
              });
            }
          },
          {
            label: 'P 접점',
            icon: resourcePath + '/image/index/menu/menu_contactP.png',
            accelerator: shortcutKey.contactP,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.contactP, 
                isShortcut: true
              });
            }
          },
          {
            label: 'N 접점',
            icon: resourcePath + '/image/index/menu/menu_contactN.png',
            accelerator: shortcutKey.contactN,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.contactN,
                isShortcut: true
              });
            }
          },
          {
            type: 'separator'
          },
          {
            label: '반전 접점',
            icon: resourcePath + '/image/index/menu/menu_reverseContact.png',
            accelerator: shortcutKey.reverseContact,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.reverseContact,
                isShortcut: true
              });
            }
          },
          {
            type: 'separator'
          },
          {
            label: '수평 연결',
            icon: resourcePath + '/image/index/menu/menu_horizontalLink.png',
            accelerator: shortcutKey.link,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.link, 
                isShortcut: true
              });
            }
          },
          {
            label: '수직 연결',
            icon: resourcePath + '/image/index/menu/menu_verticalLink.png',
            accelerator: shortcutKey.verticalLink,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.verticalLink, 
                isShortcut: true
              });
            }
          },
          {
            label: '가로선 채우기',
            icon: resourcePath + '/image/index/menu/menu_connectByLink.png',
            accelerator: shortcutKey.connectByLink,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.connectByLink,
                isShortcut: true
              });
            }
          },
          {
            type: 'separator'
          },
          {
            label: '열린 코일',
            icon: resourcePath + '/image/index/menu/menu_openedCoil.png',
            accelerator: shortcutKey.openedCoil,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.openedCoil, 
                isShortcut: true
              });
            }
          },
          {
            label: '닫힌 코일',
            icon: resourcePath + '/image/index/menu/menu_closedCoil.png',
            accelerator: shortcutKey.closedCoil,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.closedCoil, 
                isShortcut: true
              });
            }
          },
          {
            label: 'S 코일',
            icon: resourcePath + '/image/index/menu/menu_coilS.png',
            accelerator: shortcutKey.coilS,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.coilS, 
                isShortcut: true
              });
            }
          },
          {
            label: 'R 코일',
            icon: resourcePath + '/image/index/menu/menu_coilR.png',
            accelerator: shortcutKey.coilR,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.coilR, 
                isShortcut: true
              });
            }
          },
          {
            label: 'P 코일',
            icon: resourcePath + '/image/index/menu/menu_coilP.png',
            accelerator: shortcutKey.coilP,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.coilP, 
                isShortcut: true
              });
            }
          },
          {
            label: 'N 코일',
            icon: resourcePath + '/image/index/menu/menu_coilN.png',
            accelerator: shortcutKey.coilN,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.coilN, 
                isShortcut: true
              });
            }
          },
          {
            type: 'separator'
          },
          {
            label: '펑션',
            icon: resourcePath + '/image/index/menu/menu_func.png',
            accelerator: shortcutKey.func,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.func, 
                isShortcut: true
              });
            }
          },
          {
            label: '펑션 블럭',
            icon: resourcePath + '/image/index/menu/menu_funcBlock.png',
            accelerator: shortcutKey.funcBlock,
            click: function (item, focusedWindow) {
              editing.eventSymbol({
                action: action.funcBlock, 
                isShortcut: true
              });
            }
          }
        ]
      },
    ]
  },
  {
    label: '보기(V)',
    submenu: [
      {
        label: '전체화면',
        icon: resourcePath + '/image/index/menu/menu_fullScreen.png',
        accelerator: shortcutKey.fullScreen,
        click: function (item, focusedWindow) {
          if (focusedWindow.isFullScreen()) {
            focusedWindow.setFullScreen(false)
          } else if (focusedWindow) {
            focusedWindow.setFullScreen(true)
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: '화면 확대',
        icon: resourcePath + '/image/index/menu/menu_zoomIn.png',
        accelerator: shortcutKey.zoomIn,
        click: function (item, focusedWindow) {
          view.expansion();
        }
      },
      {
        label: '화면 축소',
        icon: resourcePath + '/image/index/menu/menu_zoomOut.png',
        accelerator: shortcutKey.zoomOut,
        click: function (item, focusedWindow) {
          view.reduction();
        }
      },
      {
        type: 'separator'
      },
      {
        label: '접점수 증가',
        icon: resourcePath + '/image/index/menu/menu_removeContactNum.png',
        enabled:false,
        click: function (item, focusedWindow) {
          view.addContactNum();
        }
      },
      {
        label: '접점수 감소',
        icon: resourcePath + '/image/index/menu/menu_removeContactNum.png',
        enabled:false,
        click: function (item, focusedWindow) {
          view.removeContactNum();
        }
      }
    ]
  },
  {
    label: '찾기(S)',
    submenu: [
      {
        label: '문자열 검색',
        icon: resourcePath + '/image/index/menu/menu_findStr.png',
        enabled:false,
        accelerator: shortcutKey.findStr,
        click: function (item, focusedWindow) {
          search.eventFindStr();
        }
      },
      {
        label: '문자열 바꾸기',
        icon: resourcePath + '/image/index/menu/menu_replaceStr.png',
        enabled:false,
        accelerator: shortcutKey.changeStr,
        click: function (item, focusedWindow) {
          search.eventChangeStr();
        }
      }
    ]
  },
  {
    label: '빌드(B)',
    submenu: [
      {
        label: '빌드하기',
        icon: resourcePath + '/image/index/menu/menu_build.png',
        accelerator: shortcutKey.build,
        click: function (item, focusedWindow) {
          build.eventBuild();
        }
      },
      {
        label: '다시 빌드하기',
        icon: resourcePath + '/image/index/menu/menu_rebuild.png',
        enabled:false,
        accelerator: shortcutKey.rebuild,
        click: function (item, focusedWindow) {
          build.eventRebuild();
        }
      }
    ]
  },
  {
    label: '도구(T)',
    submenu: [
      {
        label: '사용자 정의',
        icon: resourcePath + '/image/index/menu/menu_userDefine.png',
        enabled:false,
        accelerator: shortcutKey.userDefine,
        click: function (item, focusedWindow) {
          tool.eventUserDefine();
        }
      },
      {
        label: '환경 설정',
        icon: resourcePath + '/image/index/menu/menu_env.png',
        enabled:false,
        accelerator: shortcutKey.env,
        click: function (item, focusedWindow) {
          tool.eventEnv();
        }
      }
    ]
  },
  {
    label: '온라인(O)',
    submenu: [
      {
        label: '접속 시작',
        icon: resourcePath + '/image/index/menu/menu_accessStart.png',
        // accelerator: shortcutKey.userDefine,
        click: function (item, focusedWindow) {

          if (typeof projPathForMain === 'undefined') {
            popupWindow.alertWindow("접속 할 수 없습니다.");
            return;
          }

          if (projPathForMain == null || projPathForMain.trim().length == 0) {
            popupWindow.alertWindow("접속 할 수 없습니다.");
            return;
          }

          online.eventAccessStart(projPathForMain, projNameForMain);
        }
      },
      {
        label: '접속 중지',
        icon: resourcePath + '/image/index/menu/menu_accessStop.png',
        // accelerator: shortcutKey.userDefine,
        click: function (item, focusedWindow) {

          if (typeof projPathForMain === 'undefined') {
            popupWindow.alertWindow("접속 할 수 없습니다.");
            return;
          }

          if (projPathForMain == null || projPathForMain.trim().length == 0) {
            popupWindow.alertWindow("접속 할 수 없습니다.");
            return;
          }

          online.eventAccessStop();
        }
      },
      {
        label: '접속 설정',        
        icon: resourcePath + '/image/index/menu/menu_access.png',
        // accelerator: shortcutKey.userDefine,
        click: function (item, focusedWindow) {

          if (typeof projPathForMain === 'undefined') {
            popupWindow.alertWindow("프로젝트를 생성 하세요.");
            return;
          }

          if (projPathForMain == null || projPathForMain.trim().length == 0) {
            popupWindow.alertWindow("프로젝트를 생성 하세요.");
            return;
          }

          online.eventAccess(projPathForMain, projNameForMain);
        }
      },
      {
        type: 'separator'
      },
      {
        label: '파일 전송',
        icon: resourcePath + '/image/index/menu/menu_write.png',
        // accelerator: shortcutKey.env,
        click: function (item, focusedWindow) {
          online.eventWrite(projPathForMain, projNameForMain);
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'AI 모듈 다운로드',
        icon: resourcePath + '/image/index/menu/menu_downloadAIMod.png',
        // accelerator: shortcutKey.env,
        click: function (item, focusedWindow) {
          online.eventDownloadAIModule();
        }
      },
      {
        type: 'separator'
      },
      {
        label: '디바이스 모니터',
        icon: resourcePath + '/image/index/menu/menu_monitor.png',
        enabled: false,
        // accelerator: shortcutKey.env,
        click: function (item, focusedWindow) {
          online.eventDeviceMonitor();
        }
      }
    ]
  },
  {
    label: '실행(R)',
    submenu: [
      {
        label: '시작',
        icon: resourcePath + '/image/index/menu/menu_start.png',
        // accelerator: shortcutKey.run,
        click: function (item, focusedWindow) {
          running.eventRun();
        }
      },
      {
        label: '정지',
        icon: resourcePath + '/image/index/menu/menu_stop.png',
        // accelerator: shortcutKey.run,
        click: function (item, focusedWindow) {
          running.eventStop();
        }
      },
      {
        type: 'separator'
      },
      {
        label: '재 시작',
        icon: resourcePath + '/image/index/menu/menu_restart.png',
        enabled: false,
        // accelerator: shortcutKey.run,
        enabled: false,
        click: function (item, focusedWindow) {
          running.eventResume();
        }
      },
      {
        label: '일시 정지',
        icon: resourcePath + '/image/index/menu/menu_pause.png',
        enabled: false,
        // accelerator: shortcutKey.run,
        click: function (item, focusedWindow) {
          running.eventPause();
        }
      }
    ]
  },
  {
    label: '도움말(H)',
    submenu: [
      {
        label: '정보',
        icon: resourcePath + '/image/index/menu/menu_info.png',
        accelerator: shortcutKey.info,
        click: function (item, focusedWindow) {
          help.eventInfo();
        }
      }
    ]
  }
];


/* 초기화 */

module.exports = { menuTemplate };