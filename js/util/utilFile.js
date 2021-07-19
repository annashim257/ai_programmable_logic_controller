/* utilFile.js */

// ※ util 은 공용이므로 main process 와 renderer process 모두 사용하므로 공용의 모듈은 절대 사용 금지입니다. 

// $ << Jquery 사용은 main process 사용 할 수 없습니다.  ( *중요한 포인트* )

const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, "/../../../../");
const resourcePath = rootPath + '/src/resource';
const utilPath = resourcePath + '/js/util';
const definePath = resourcePath + '/js/define';
const mainPath = resourcePath + '/js/main';


const config = require(definePath + '/config');

// AI 파일 목록 가져 오기
var getAiFileList = function(directory) {
    var list = [];

    fs.readdirSync(directory).forEach( function(file) {
        var temp = file.split('\.');
        var fileName = temp[0];
        var extention = temp[1];

        // example
        if ( extention === config.aiExtension) {
            list.push(fileName);
        }
    });

    return list;
}

// LD 파일 목록 가져 오기
var getLdFileList = function(directory) {
    var list = [];

    fs.readdirSync(directory).forEach( function(file) {
        var temp = file.split('\.');
        var fileName = temp[0];

        // example
        if ( fileName.indexOf("ld") !== -1 ) {
            list.push(fileName);
        }
    });

    return list;
}


// 파일 사이즈 가져 오기
var getSize = function(filePath, fileName) {
    try{
        return fs.statSync(path.join(filePath,fileName)).size;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

// 경로가 존재하는지 체크
var checkPath = function (filePath) {
    try {
        fs.statSync(filePath.trim());
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
}

// 파일 이 존재하는지 체크
var checkFile = function (filePath) {
    try {
        fs.statSync(filePath);
    } catch (err) {
        console.error(err);
        return false;
    }

    return true;
}

// 파일 스트림 가져 오기 
var createReadStream = function(filePath, fileName) {
    return fs.createReadStream(filePath+fileName);
}

// 동기적 파일 읽기
var readSync = function (filePath) {
    return fs.readFileSync(filePath, 'utf8');
};

// 비 동기적 파일 읽기
var readASync = function (filePath, callback) {
    fs.readFile(filePath, 'utf8', function (error, data) {
        callback(data);
    });
}

var writeDirectory = function(dirPath, dirName) {
    if ( fs.existsSync(dirPath) ) {
        if ( !fs.existsSync(path.join(dirPath, dirName)) ) {
            fs.mkdirSync(path.join(dirPath, dirName));
        }
    } else {
        console.error("존재하지 않는 디렉토리 입니다.");
    }
}

// 동기적 파일 쓰기
var writeSync = function (filePath, content) {
    fs.writeFileSync(filePath, content, 'utf8');
};

// 동기적 파일 삭제  (되도록 사용하지 말것.... )
var removeSync = function( filePath, fileName) {
    fs.unlinkSync(filePath + fileName);
};

// 비 동기적 파일 삭제 
var removeASync = function( filePath, fileName) {
    fs.unlink(filePath + fileName, function(err){
        if ( err !== null)
            console.error(err);
    });
};

// 비동기적 파일쓰기
var writeASync = function (filePath, content, callback) {
    fs.writeFile(filePath, content, 'utf8', function (err) {
        callback(err);
    })
}

// 파일 복사
var fileCopy = function(sourceFile, destFile) {
    fs.copyFile(sourceFile, destFile, function(err) {
        if ( typeof err !== 'undefined' && err != null ) 
            console.error("파일 복사를 실패 하였습니다. - ", err);
    });
}

// 파일 이름 변경
var fileReName = function(sourceFile, destFile) {
    fs.renameSync(sourceFile, destFile, function(err) {
        if ( typeof err !== 'undefined' && err != null ) 
            console.error("파일 이름 변경을 실패 하였습니다. - ", err);
    });
}

// 프로젝트 저장 
var fileSave = function(sourceFile, destFile, callback) {
    fs.copyFile(sourceFile, destFile, function(err) {
        if ( typeof err !== 'undefined' && err != null ) {
            callback("저장을 실패 하였습니다. \n" + err);
            return false;
        } else {
            callback("저장 되었습니다.");
            return true;
        }
    });
}

// XML Parsing ( jQuery Object )
var readXMLToObject = function (filePath) {
    var xmlString = readSync(filePath);
    var xmlDoc = $.parseXML(xmlString);
    return $(xmlDoc);
}

// XML Parsing ( Xml of String -> jQuery Object )
var readXML = function (filePath) {
    var xmlString = readSync(filePath);
    var xmlDoc = $.parseXML(xmlString);
    return $(xmlDoc).find('project').html();
}

// XML 파일 쓰기
var writeXML = function (filePath, content) {
    var xmlVer = '<?xml version="1.0" encoding="utf-8"?>\n';
    var xmlProjStart = '<project xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsd="http://www.w3.org/2001/XMLSchema">';
    var xmlProjEnd = '</project>';
    
    writeASync(filePath, xmlVer + xmlProjStart + content + xmlProjEnd, function (err) {
        if (err !== null) {
            console.error(err);
        } 
    });
}

exports.checkPath = checkPath;
exports.checkFile = checkFile;
exports.readSync = readSync;
exports.readASync =  readASync;
exports.writeSync = writeSync;
exports.writeASync = writeASync;
exports.removeSync = removeSync;
exports.removeASync = removeASync;
exports.readXMLToObject = readXMLToObject;
exports.readXML = readXML;
exports.writeXML = writeXML;
exports.fileCopy = fileCopy;
exports.fileReName = fileReName;
exports.fileSave = fileSave;
exports.getSize = getSize;
exports.getAiFileList = getAiFileList;
exports.getLdFileList = getLdFileList;
exports.createReadStream = createReadStream;
exports.writeDirectory = writeDirectory;