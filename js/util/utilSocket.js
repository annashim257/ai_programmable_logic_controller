/* utilSocket.js */

// ※ util 은 공용이므로 main process 와 renderer process 모두 사용하므로 공용의 모듈은 절대 사용 금지입니다. 

const net = require('net');
const path = require('path');
const fs = require('fs');

const rootPath = path.join(__dirname, "/../../../../");
const resourcePath = rootPath + '/src/resource';
const utilPath = resourcePath + '/js/util';
const rendererPath = resourcePath + '/js/renderer';
const os = require('os');
var { username } = os.userInfo();

const xmlManager = require(path.join(rendererPath, 'xmlManager'));
const uconsole = require(utilPath + '/utilConsole');

var CODE_RUN = "1";
var CODE_STOP = "2";
var CODE_DOWNLOAD = "3";
var CODE_COMPLETE = "4";
var CODE_RESUME = "5";
var CODE_PAUSE = "6";

var socket;

var projPath;
var projName;

var plcFile;
var plcSize;
var aiFile;
var aiSize;

var fileType = "plc";

// 코드 값 가져오기
var getCodeByParshing = function (packet) {
    var functionCode = packet.replace(/STX/g, '').replace(/ETX/g, '').replace(/:/g, '');

    switch (functionCode) {
        case "1":   // Start
            return "1";
        case "2":   // Stop
            return "2";
        case "3":   // Download
            return "3";
        case "4":   // Complete
            return "4";
    }

};

// 패킷 생성
var createPacket = function (code, fileName, fileSize) {
    var packet = "STX";
    switch (code) {
        case CODE_RUN:
            packet += ":1"
            return packet;
        case CODE_STOP:
            packet += ":2"
            break;
        case CODE_DOWNLOAD:
            packet += ":3" + ":" + fileName + ":" + fileSize;
            break;
        case CODE_COMPLETE:
            packet += ":4"
            break;
    }
    packet += ":ETX";
    return packet;
};

// 패킷 전송
var send = function (packet, callback) {
    if (typeof socket !== 'undefined ' && socket !== null) {
        socket.write(packet);
    } else {
        callback('접속 할 수 없습니다.');
    }
};

// 파일 전송
var sendFile = function (filePath, fileName, callback) {

    // buffer
    fs.stat(path.join(filePath, fileName), (err, stats) => {
        // 전송할 버퍼
        var buffer = new Buffer.alloc(1024);
        // 전송할 파일 크기
        var fileSize = stats.size;
        // 전송할 파일을 담을 버퍼
        var file = new Buffer.alloc(fileSize);

        // 전송할 파일을 file 버퍼에 저장
        fs.readFile(path.join(filePath, fileName), (err, data) => {

            file = Buffer.from(data);

            let temp = 0;

            // 남은 파일 크기
            let remnantSize = fileSize;

            while (remnantSize > 0) {

                if (remnantSize >= buffer.length) {
                    for (let j = 0; j < buffer.length; j++) {
                        buffer[j] = file[temp];
                        temp++;
                    }
                    remnantSize -= buffer.length;

                    // 통신 부분
                    socket.write(buffer);

                } else if (remnantSize < buffer.length) {
                    var tempBuffer = new Buffer.alloc(remnantSize);
                    for (let k = 0; k < remnantSize; k++) {
                        tempBuffer[k] = file[temp];
                        temp++;
                    }
                    remnantSize -= tempBuffer.length;

                    // 통신 부분
                    socket.write(tempBuffer);
                }

            }

            if (err !== null) {
                console.log(err);
            }

        });

    });
};

// 타겟 보드로 연결
exports.connect = function (_projPath, _projName, callback) {

    projPath = _projPath;
    projName = _projName;

    // 타겟 보드 정보 가져오기
    var data = xmlManager.readAccess(_projPath, _projName);

    fileType = 'plc';

    socket = net.connect({ host: data.plcIp, port: data.plcPort }, function () {
        this.on('data', function (data) {

            var code = getCodeByParshing(data);

            var packet;

            switch (code) {
                case "1":   // START
                case "2":   // STOP
                case "3":   // DOWNLOAD
                    if (fileType === 'plc') {
                        // PLC 파일 전송
                        sendFile(projPath + '/build/', plcFile, callback);

                        if (aiSize !== 0) {
                            fileType = 'ai';
                        }

                    } else {

                        var aiPath;

                        switch (config.OS) {
                            case config.WINDOW:
                                aiPath = path.join(`c:\\Users\\${username}\\.aiplc`, 'ai');
                                break;
                            case config.LINUX:
                                aiPath = path.join(rootPath, 'ai');
                                break;
                        }

                        // ai 파일 전송
                        setTimeout(function () {
                            sendFile(aiPath, aiFile, callback);
                        }, 200);

                        fileType = 'plc';
                    }
                    break;
                case "4":   // COMPLETE ( 전송 완료 )
                    if (fileType === 'ai') {
                        // 전송 완료 전송
                        packet = createPacket(CODE_COMPLETE);
                        send(packet, callback);

                        // ai 패킷 전송
                        setTimeout(function () {
                            send(createPacket(CODE_DOWNLOAD, aiFile, aiSize), callback);
                        }, 50);

                    } else {
                        // 전송 완료 전송
                        packet = createPacket(CODE_COMPLETE);
                        send(packet, callback);

                        progressBarStop();

                        callback("파일 전송이 완료 되었습니다.");
                    }
                    break;
                case "5":   // ERROR  ( 전송 실패 )
                    progressBarStop();
                    // callback("파일 전송을 실패 하였습니다. \n" + " code 값 오류 : " + code);
                    break;
                default:    // ERROR ( 기타 오류 )
                    progressBarStop();
                    // callback("파일 전송을 실패 하였습니다. \n" + " code 값 오류 : " + code);
                    break;
            }
        });

        this.on('connect', function () {
            // callback('접속 되었습니다.');
            console.log('접속 되었습니다.');
        });

        this.setEncoding('utf8');

        this.on('close', function () {
            progressBarStop();
            // callback('접속 종료 되었습니다.');
            console.log('접속 종료 되었습니다.');
        });

        this.on('error', function (err) {
            // callback('접속 할 수 없습니다. \n' + err);
            console.log('접속 할 수 없습니다. \n' + err);
            socket.destroy();
            socket = null;
        });
    });

};

var progressBarStop;

// 타켓 보드로 파일 전송
exports.write = function (_plcFile, _plcSize, _aiFile, _aiSize, callback, progressBarStart, _progressBarStop) {
    plcFile = _plcFile;
    plcSize = _plcSize;
    aiFile = _aiFile;
    aiSize = _aiSize;

    progressBarStop = _progressBarStop;

    progressBarStart('전송 중 ... ', '파일 전송중 입니다. 잠시만 기다려주세요.');

    send(createPacket(CODE_DOWNLOAD, plcFile, plcSize), callback);

}

// 연결 종료
exports.close = function (callback) {
    if (typeof socket !== 'undefined ' && socket !== null) {
        socket.end();
        socket.destroy();
        socket = null;
    } else {
        // callback('접속 할 수 없습니다.');
        console.log('접속 할 수 없습니다.');
    }

};

exports.send = send;
exports.sendFile = sendFile;
exports.createPacket = createPacket;