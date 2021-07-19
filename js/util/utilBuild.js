/* utilBuild.js */

// const exec = require('child_process').exec;

// const rootPath = __dirname + "/../../../../";
// const resourcePath = rootPath + '/src/resource';
// const utilPath = resourcePath + '/js/util';

// // const { build } = require("electron-builder");

// const uconsole = require(utilPath + '/utilConsole');
// const { readXML } = require(utilPath +'/utilFile');

// // C 언어 생성
// var generateAnsiC = (filePath) => {

//     // var filePath = '/DATA/source/plc_one.xml';

//     // TODO

//     // 1. 프로젝트 파일 (XML) 읽기 
//     var $xml = readXML(filePath);

//     // 내용 수정 
//     $xml.find('interface > inputVars > variable').attr("name", "p0002");

//     // 내용 가져오기
//     var ObjectOnProject = $xml.find('project');

//     // project 하위 값 출력 테스트 
//     uconsole.log(ObjectOnProject.html());

//     // 2. 내용 분석 


//     // 3. C 언어 생성

// }


// // GCC 컴파일 실행
// var compile = (command, consoleDebug, consoleError) => {

//     // 동기화
    
//     exec(command, (error, stdout, stderr) => {
//         var message = "";

//         if (error !== null) {
//             consoleError(error);
//         } 

//         message = stdout;
//         message += stderr;
        
//         consoleDebug(message);
//     });

// };

// module.exports = {generateAnsiC, compile};