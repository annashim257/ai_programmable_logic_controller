/* config.js */

// debug
exports.isOpenDevTool = true;   // 개발 도구 팝업창 화면 띄우기
exports.isOpenDevToolForDebug = false;   // 디버그 탭의 개발 도구 팝업창 화면 띄우기
exports.isOpenDevToolForError = false;   // 에러 탭의 개발 도구 팝업창 화면 띄우기

exports.isLog = true;           // 로그 메시지 출력
exports.isError = true;         // 에러 로그 메시지 출력

// 프로젝트 XML 기본 레이아웃 디렉토리 위치 
exports.tempProj = '/tempProj';
exports.xmlProj = '/xmlProj';

exports.progPath = "";

// 타입 정의 정의 
exports.TYPE_DESCRITPION = "description";    // 설명문
exports.TYPE_LABEL = "label";    // 레이블

// XML 파일 
exports.extension = ".xml";
exports.prefix = "temp_";

// AI 파일 
exports.aiExtension = "onnx";

// 운영체제 타입
exports.LINUX = "LINUX";
exports.WINDOW = "WINDOW";

// 현재 운영체제 
exports.OS = this.LINUX; // window / linux

// 네트워크 모듈 타입
exports.NET_TYPE_ETHERNET = "ethernet";
exports.NET_TYPE_SERIAL = "serial";

// LD 에디터 기본 값 
exports.LD_COLUMN_NUM = 10;
exports.LD_ROW_NUM = 50;