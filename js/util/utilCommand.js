// utilCommand.js

const exec = require('child_process').exec;

// const rootPath = __dirname + "/../../../../";
// const resourcePath = rootPath + '/src/resource';
// const utilPath = resourcePath + '/js/util';
// const uconsole = require(utilPath + '/utilConsole');

// GCC 컴파일 실행
var compile = (command, consoleDebug, consoleError, progressBarStop) => {

    // 동기화
    exec(command, (error, stdout, stderr) => {
        // if (error !== null) {
        //     consoleError(unescape(error));
        // } 

        if (stderr !== null) {
            consoleError(unescape(stderr));
        }

        consoleDebug(unescape(stdout));

        progressBarStop();
    });

};

exports.compile = compile;