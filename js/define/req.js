/* req.js */

/* ALERT */

exports.alert = "alert";
exports.alertWindow = "alertWindow";



// MENU CALL

exports.newProj = "newProj"; // 새로 만들기
exports.open = "open"; // 열기
exports.save = "save"; // 저장
exports.saveAS = "saveAS"; // 다른이름으로 저장
exports.closeProj = "closeProj"; // 프로젝트 닫기
exports.print = "print"; // 인쇄
exports.cut = "cut"; // 잘라내기
exports.copy = "copy"; // 복사
exports.paste = "paste"; // 붙이기
exports.remove = "remove"; // 삭제

exports.addLine = "addLine"; // 라인 추가
exports.removeLine = "removeLine"; // 라인 삭제
exports.addCell = "addCell"; // 셀 추가
exports.removeCell = "removeCell"; // 셀 삭제

exports.addContact = "addContact"; // 접점 추가 
exports.removeContact = "removeContact"; // 접점 삭제

exports.undo = "undo"; // 실행 취소
exports.redo = "redo"; // 다시 실행

exports.findStr = "findStr"; // 문자열 검색
exports.changeStr = "changeStr"; // 문자열 바꾸기

exports.build = "build"; // 빌드 하기
exports.buildByMain = "buildByMain"; // 빌드 하기
exports.rebuild = "rebuild"; // 다시 빌드하기
exports.rebuildByMain = "rebuildByMain"; // 다시 빌드하기

exports.userDefine = "userDefine"; // 사용자 정의
exports.env = "env"; // 환경 설정

exports.setAccess = "setAccess";    // 접속 설정 값 저장 
exports.accessStart = "accessStart"; // 접속 설정 시작
exports.accessStop = "accessStop"; // 접속 설정 중지
exports.write = "write"; // 쓰기
exports.downloadAIModule = "downloadAIModule"; // AI 모듈 다운로드

exports.run = "run"; // 실행
exports.stop = "stop"; // 정지
exports.resume = "resume"; // 재시작
exports.pause = "pause"; // 일시 정지

exports.info = "info"; // 도움말의 정보 

exports.zoomIn = "zoomIn"; // 확대
exports.zoomOut = "zoomOut"; // 축소
exports.addContactNum = "addContactNum"; // 접점수 증가
exports.removeContactNum = "removeContactNum"; // 접점수 감소

exports.expansion = "expansion"; // 확대
exports.reduction = "reduction"; // 축소

exports.openToNavigation = "openToNavigation" // 프로젝트  열기 > Navigation 전달
exports.accessToAcessWindow = "accessToAcessWindow" // 접속 설정 > 접속 설정 창 전달


// NAVIGATION
exports.setTaskName = "setTaskName"   // 태스크 이름 설정
exports.getTaskName = "getTaskName"   // 태스크 이름 가져오기
exports.setFunc = "setFunc"   // 함수 이름 설정
exports.getFunc = "getFunc"   // 함수 이름 가져오기
exports.setPlcName = "setPlcName"   // PLC 이름 설정
exports.getPlcName = "getPlcName"   // PLC 이름 가져오기
exports.setReName = "setReName"   // 이름 변경 설정
exports.getReName = "getReName"   // 이름 변경 가져오기
exports.setNewProj = "setNewProj"   // 프로젝트 이름 설정
exports.setProjName = "setProjName"   // 프로젝트 이름 변경

exports.setNetMod = "setNetMod"   // 네트워크 모듈 설정
exports.removeNetMod = "removeNetMod"   // 네트워크 모듈 삭제
exports.initNetModule = "initNetModule"   // 네트워크 모듈 불러오기

exports.toNetModuleType = "toNetModuleType" // NetModueType 으로 정보(PLC 이름, PLC 모듈이름, 네트워크 이름) 가져오기 

exports.modbusNum = "modbusNum" // 모드버스 선택 번호

exports.plcWindowToMain = "plcWindow"  // plc 창 열기
exports.funcWindowToMain = "funcWindowToMain";    // 펑션 창 열기
exports.tastWindowToMain = "tastWindowToMain";    // 태스크 창 열기
exports.netModWindowToMain = "netModWindowToMain";    // 네트워크 모듈 창 열기
exports.sendToNetModWindow = "sendToNetModWindow";    // 네트워크 모듈로 메시지 전송
exports.netModTypeWindowToMain = "netModTypeWindowToMain";    // 네트워크 모듈 타입 창 열기
exports.netWindowToMain = "netWindowToMain";    // 네트워크 창 열기
exports.netHighWindowToMain = "netHighWindowToMain";    // 네트워크 고급 창 열기
exports.modbusWindowToMain = "modbusWindowToMain";    // 모드버스 창 열기
exports.reNameWindowToMain = "reNameWindowToMain";    // 이름 변경 창 열기

exports.netType = "netType" // 네트워크 타입

// EDITOR
exports.editor = "editor"; // 쓰기

exports.symbol = "symbol"; // editLd 로 변경 필요
exports.editAll = "editAll"; // 에디터 전체

exports.description = "description" // LD 로 부터 설명문 받아오기
exports.setDescription = "setDescription" // LD에 설명문 설정
exports.descriptionFromMenu = "descriptionFromMenu" // 메뉴로 부터 설명문 창 열기

exports.outDescription = "description" // LD 로 부터 출력 설명문 받아오기
exports.setOutDescription = "setOutDescription" // LD 에 출력 설명문 설정

exports.variableSelect = "variableSelect" // 로컬 변수 선택

exports.validFunc = "validFunc" // 펑션 변수 유효성 체크
exports.validFuncReturn = "validFuncReturn" // 펑션 변수 유효성 체크

exports.funcVariableSelect = "funcVariableSelect" // 펑션 변수 선택
exports.variableReturn = "variableReturn" // 로컬 변수 선택 돌려 받기
exports.funcVariableReturn = "funcVariableReturn" // 펑션 변수 선택 돌려 받기

exports.funcSelectWindowToMain = "funcSelectWindowToMain" // 펑션 변수 선택 창 열기
exports.variableSelectWindowToMain = "variableSelectWindowToMain" // 변수 선택 창 열기
exports.descriptionWindowToMain = "descriptionWindowToMain";    // 설명문 - 라벨 창 열기
exports.outDescriptionWindowToMain = "outDescriptionWindowToMain";    // 출력 설명문 - 창 열기


// CONSONE
exports.debugWindow = "debugWindow"; // 디버깅창
exports.errorWindow = "errorWindow"; // 에러창
exports.echo = "echo"; // 쓰기
exports.infoDebug = "infoDebug";
exports.clear = "clear";

exports.productViewToMain = "productViewToMain";    // 제품보기

exports.progressBarStart = "progressBarStart";
exports.progressBarStop = "progressBarStop";



// 1차년도 과제용
exports.writeProgExample = "writeProgExample";
exports.writeProgExampleFromReturn = "writeProgExampleFromReturn";