// xmlManager.js

const path = require('path');

const rootPath = path.join(__dirname, '/../../../..');
const srcPath = rootPath + '/src';
const resourcePath = srcPath + '/resource';
const jsPath = resourcePath + '/js';
const utilPath = jsPath + '/util';
const definePath = jsPath + '/define';

const uFile = require(utilPath + '/utilFile');
const uconsole = require(utilPath + '/utilConsole');
const product = require(definePath + '/product');
const config = require(definePath + '/config');
const action = require(definePath + '/action');

// MENU (메뉴)

// 현재 날짜 시간 포멧 문자 생성하기
var getDateFormat = function (format) {

    // 날짜 포맷 .. 
    String.prototype.string = function (len) {
        var s = '', i = 0;
        while (i++ < len) { s += this; }
        return s;
    };

    String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };

    Number.prototype.zf = function (len) { return this.toString().zf(len); };

    Date.prototype.format = function (date) {

        if (!this.valueOf()) return " ";

        var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        var d = this;

        return date.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
            switch ($1) {
                case "yyyy": return d.getFullYear();
                case "yy": return (d.getFullYear() % 1000).zf(2);
                case "MM": return (d.getMonth() + 1).zf(2);
                case "dd": return d.getDate().zf(2);
                case "E": return weekName[d.getDay()];
                case "HH": return d.getHours().zf(2);
                case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
                case "mm": return d.getMinutes().zf(2);
                case "ss": return d.getSeconds().zf(2);
                case "a/p": return d.getHours() < 12 ? "오전" : "오후";
                default: return $1;
            }
        });
    };

    return new Date().format(format);
};

var writeXML = function (projPath, fileName, projXml) {
    if (typeof projXml === 'undefined') {
        return;
    } 

    uFile.writeXML(projPath + '/' + fileName + config.extension, projXml);
};

// 새 프로젝트 생성 설정 하기 (파일 생성)
// (projPath, projName, progName, progLabel, plcMod, cpuType, progLanguage) 
exports.writeProj = function (opt) {

    var $xml = uFile.readXMLToObject(rootPath + '/xmlProj/' + opt.cpuType + config.extension);

    $xml.find('fileHeader').attr('projName', opt.projName);
    $xml.find('fileHeader').attr('cpuType', opt.cpuType);
    $xml.find('fileHeader').attr('creationDateTime', getDateFormat("yyyy-MM-ddThh:mm:ss"));

    var netModXml = '\n';

    switch (opt.plcMod) {
        case product.PLC_MOD_LIT:
            netModXml = ethernetXml(product.NET_MOD_LIT, "NewPLC", "0", "0");
            break;
        default:
            break;
    }

    // $xml.find('networks network module').attr('name', 'NewPLC');
    // $xml.find('networks network module').append(netMod);

    $xml.find('networks network').append(netModXml);
    $xml.find('pous pou').attr('name', 'NewPLC').attr('plcMod', opt.plcMod);

    // scanVar 초기값 추가
    var scanVarXml = '\n';
    scanVarXml += '        <scanVar name="' + opt.progName + '">\n';
    scanVarXml += '        </scanVar>\n';

    $xml.find('pous pou interface').append(scanVarXml);

    // scanProg 초기값 추가 
    var scanProgXml = '\n';
    switch (opt.progLanguage) {
        case 'ld':
            scanProgXml += `            <ld name="${opt.progName}" column="${config.LD_COLUMN_NUM}" row="${config.LD_ROW_NUM}" ld="ld0">\n`;
            scanProgXml += '            </ld>\n';
            break;
        case 'st':
            break;
        case 'sfc':
            break;
    }

    $xml.find('pous pou body scanProg').append(scanProgXml);

    // temp 프로젝트 파일 생성
    // uFile.writeXML(opt.projPath + '/' + config.prefix + opt.projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());

    // temp 프로젝트 파일을 프로젝트 파일로 복사
    setTimeout(function () {
        uFile.fileCopy(opt.projPath + '/' + config.prefix + opt.projName + config.extension, opt.projPath + '/' + opt.projName + config.extension);

        addProgFile({
            projPath: opt.projPath,         // 프로젝트 경로
            progLabel: "ld0",            // 초기 생성 타입
            lineNum: 50                // 초기 라인 수 
        });
    }, 1000);

};

// 프로젝트 가져오기
exports.readProj = function (projPath, projName) {

    var $xml = uFile.readXMLToObject(path.join(projPath, projName + config.extension));

    var networks = [];      // 네트워크 이름
    var plcs = [];          // PLC 이름

    $xml.find('networks network').each(function () {
        var network = {
            netMods: [] // 네트워크 모듈
        };

        network.name = $(this).attr('name');

        $(this).children().each(function () {
            network.netMods.push({
                name: $(this).attr('name'),
                plcName: $(this).attr('plcName'),
                base: $(this).attr('base'),
                slot: $(this).attr('slot'),
            });
        });

        networks.push(network);
    });

    $xml.find('pous pou').each(function () {
        var plc = {};
        plc.plcName = $(this).attr('name');
        plc.plcMod = $(this).attr('plcMod');

        plc.scanProgs = [];
        $(this).find('scanProg ld').each(function () {
            var scanProg = $(this).attr('name');
            plc.scanProgs.push(scanProg);
        });

        plc.funcProgs = [];
        $(this).find('funcProg ld').each(function () {
            var funcProg = $(this).attr('name');
            plc.funcProgs.push(funcProg);
        });

        plc.taskProgs = [];
        $(this).find('taskProg').each(function () {
            var taskProg = {
                name: $(this).attr('name'),
                num: $(this).attr('num'),
                priority: $(this).attr('priority'),
                interval: $(this).attr('interval'),
                progs: []
            };

            $(this).children().each(function () {
                taskProg.progs.push({
                    name: $(this).attr('name')
                });
            });

            plc.taskProgs.push(taskProg);
        });

        plcs.push(plc);
    });

    var isState = true;

    // temp 파일 생성
    uFile.fileCopy(path.join( projPath, projName + config.extension), path.join(projPath, config.prefix + projName + config.extension));
    
    var list = uFile.getLdFileList(projPath);

    for ( var i in list) {
        console.log("list = ",list[i]);
    }

    // ld 파일 체크
    $xml.find('ld').each(function(){

        console.log($(this).attr('ld'));

        if ( list.indexOf( $(this).attr('ld') ) == -1 ) {
            isState = false;
            return false;
        }
    });

    if (!isState) {
        return null;
    }

    return {
        projPath: projPath,
        projName: projName,
        networks: networks,
        plcs: plcs
    };
};

// 접속 설정 가져오기
exports.readAccess = function (projPath, projName) {
    var $xml = uFile.readXMLToObject(projPath + "/" + config.prefix + projName + config.extension);

    return {
        plcIp: $xml.find('connect plcServer').attr('ip'),
        plcPort: $xml.find('connect plcServer').attr('port'),
        aiIp: $xml.find('connect aiServer').attr('ip'),
        aiPort: $xml.find('connect aiServer').attr('port')
    };
};

// 접속 설정 하기 
// exports.writeAccess = function (projPath, projName, plcIp, plcPort, aiIp, aiPort) {
exports.writeAccess = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + "/" + opt.projName + config.extension);
    $xml.find('connect plcServer').attr('ip', opt.plcIp).attr('port', opt.plcPort);
    $xml.find('connect aiServer').attr('ip', opt.aiIp).attr('port', opt.aiPort);

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};



//  NAVIGATION (내비게이션)

// 프로젝트 이름 설정 하기
exports.writeNameForProj = function (projPath, projName, newName) {

    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);
    $xml.find('fileHeader').attr('projName', newName);

    // 프로젝트 이름 병경 쓰기 
    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());

    // 프로젝트 템프 파일 이름 변경하기
    uFile.fileReName(projPath + '/' + config.prefix + projName + config.extension, projPath + '/' + config.prefix + newName + config.extension);

};

// pou 설정 하기 (추가)
exports.writePlc = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var netModXml;

    switch (opt.plcMod) {
        case product.PLC_MOD_LIT:
            netModXml = ethernetXml(product.NET_MOD_LIT, opt.plcName, "0", "0");
            break;
        default:
            break;
    }

    $xml.find('networks network').each(function () {
        uconsole.log($(this).attr('name'));
        if ($(this).attr('name') === '기본 네트워크') {
            uconsole.log(netModXml);
            $xml.find('networks network').append(netModXml);
            return false;
        }
    });

    var pouXml = '\n';
    pouXml += '<pou name="' + opt.plcName + '" opt.plcMod="' + opt.plcMod + '">\n';
    pouXml += '    <parameter>\n';
    pouXml += '        <default>\n';
    pouXml += '        <cycle value=""  isActive="false"/>\n';
    pouXml += '        <watchDoc value="" isActive="false"/>\n';
    pouXml += '        <restartMode value="2"  isActive="false"/>\n';
    pouXml += '        <calculateError value="false" />\n';
    pouXml += '        <networkError value="false" />\n';
    pouXml += '        <latchArea> \n';
    pouXml += '            <input isUse="" start="" end="" />\n';
    pouXml += '            <output isUse="" start="" end="" />\n';
    pouXml += '            <general isUse="" start="" end="" />\n';
    pouXml += '            <count isUse="" start="" end="" />\n';
    pouXml += '            <timeHundred isUse="" start="" end="" />\n';
    pouXml += '            <timeTen isUse="" start="" end="" />\n';
    pouXml += '            <timeOne isUse="" start="" end="" />\n';
    pouXml += '        </latchArea>\n';
    pouXml += '        </default>\n';
    pouXml += '        <io>\n';
    pouXml += '        <base name="">\n';
    pouXml += '            <slot num="0" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '            <slot num="1" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '            <slot num="2" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '            <slot num="3" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '            <slot num="4" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '            <slot num="5" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '            <slot num="6" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '            <slot num="7" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '            <slot num="8" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '            <slot num="9" name="" filter="" emergency="" input="" output="" description=""></slot>\n';
    pouXml += '        </base>\n';
    pouXml += '        </io>\n';
    pouXml += '    </parameter>\n';
    pouXml += '    <interface>\n';
    pouXml += '        <globalVar>\n';
    pouXml += '        </globalVar>\n';
    pouXml += `        <scanVar name="NewProgram${opt.scanProgCnt}">\n`;
    pouXml += '        </scanVar>\n';
    pouXml += '    </interface>\n';
    pouXml += '    <body>\n';
    pouXml += '        <scanProg>\n';
    pouXml += `            <ld name="NewProgram${opt.scanProgCnt}" column="10" row="50" ld="ld${opt.ldCnt}">\n`;
    pouXml += '            </ld>\n';
    pouXml += '        </scanProg>\n';
    pouXml += '        <funcProg>\n';
    pouXml += '        </funcProg>\n';
    pouXml += '        <funcBlockProg>\n';
    pouXml += '        </funcBlockProg>\n';
    pouXml += '    </body>\n';
    pouXml += '    <documentation>\n';
    pouXml += '    </documentation>\n';
    pouXml += '</pou>\n';

    $xml.find('pous').append(pouXml);

    // uFile.writeXML(opt.projPath + '/' + config.prefix + opt.projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// Pou(PLC) 설정 하기 (제거)
exports.writePlcToRemove = function (projPath, projName, plcName) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    $xml.find('networks network').each(function () {
        if ($(this).attr('name').trim() === '기본 네트워크') {
            $(this).children().each(function () {
                if ($(this).attr('plcName') === plcName) {
                    $(this).remove();
                }
            });

            return false;
        }
    });

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).remove();
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());
};

// Pou(Plc) 이름 설정 하기 (수정)
exports.writeNameForPlc = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.oldPlcName) {
            $(this).attr('name', opt.plcName).attr('opt.plcMod', opt.plcMod);
        }
    });

    // uFile.writeXML(opt.projPath + '/' + config.prefix + opt.projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// scan 프로그램 설정 하기 (추가)
exports.writeScanProg = function (projPath, projName, plcName, progName, ldCnt) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    var progLabel = `ld${ldCnt}`;

    var scanProgXml = '\n';
    scanProgXml += `          <ld name="${progName}" column="${config.LD_COLUMN_NUM}" row="${config.LD_ROW_NUM}" ld="${progLabel}">\n`;
    scanProgXml += '          </ld>\n';

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body scanProg').append(scanProgXml);
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());

    // 스켄 프로그램 XML 파일 
    addProgFile({
        projPath: projPath,
        progLabel: progLabel,
        lineNum: 50
    });
};

// scan 프로그램 삭제 설정 하기 (제거)
exports.writeScanProgToRemove = function (projPath, projName, plcName, progName, progLabel) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body ScanProg ld').each(function () {
                if ($(this).attr('name').trim() === progName) {
                    $(this).remove();
                    return false;
                }
            });
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());

    // scan 프로그램의 ld(?).xml 파일 삭제
    removeProgFile(projPath, progLabel + config.extension);
};

// scan 프로그램 이름 설정 하기 (수정)
exports.writeNameForScan = function (projPath, projName, plcName, oldScanName, newScanName) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('scanProg ld').each(function () {
                if ($(this).attr('name').trim() === oldScanName) {
                    $(this).attr('name', newScanName);
                    return false;
                }
            });
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());
};


// 펑션 추가 설정 하기 (추가)
// (projPath, projName, plcName, funcName, isEnEno, returnType)
exports.writeFuncProg = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var funcProgXml = '\n';
    funcProgXml += '            <ld name="' + opt.funcName + '" funcType="' + opt.funcType + '" progLanguage="' + opt.progLanguage + '" isAi="' + opt.isAi + '" aiType="' + opt.aiType + '" isEnEno="' + opt.isEnEno + '" returnType="' + opt.returnType + '" ld="ld">\n';
    funcProgXml += '            </ld>\n';

    var funcVarXml = '\n';
    funcVarXml += '        <funcVar name="' + opt.funcName + '">\n';
    funcVarXml += '        </funcVar>\n';

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('funcProg').append(funcProgXml);
            $(this).find('interface').append(funcVarXml);
            return false;
        }
    });

    // uFile.writeXML(opt.projPath + '/' + config.prefix + opt.projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 펑션 삭제 설정 하기 (제거)
exports.writeFuncProgToRemove = function (projPath, projName, plcName, funcName) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body funcProg ld').each(function () {
                if ($(this).attr('name').trim() === funcName) {
                    $(this).remove();
                    return false;
                }
            });
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());
};

// 펑션 수정 설정 하기 (수정)
// option : (projPath, projName, plcName, oldProgName, progName, isEnEno, returnType)
exports.writeFuncProgToSet = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {

            // 로컬 변수 에서 이름 변경
            $(this).find('interface funcVar').each(function () {
                if ($(this).attr('name').trim() === opt.oldFuncName) {
                    $(this).attr('name', opt.funcName);
                    return false;
                }
            });

            // 프로그램 에서 펑션 이름 변경
            $(this).find('body funcProg ld').each(function () {
                if ($(this).attr('name').trim() === opt.oldFuncName) {
                    $(this).attr('name', opt.funcName)
                        .attr('funcType', opt.funcType)
                        .attr('progLanguage', opt.progLanguage)
                        .attr('isAi', opt.isAi)
                        .attr('aiType', opt.aiType)
                        .attr('returnType', opt.returnType)
                        .attr('isEnEno', opt.isEnEno);
                    return false;
                }
            });

        }
        return false;
    });

    // uFile.writeXML(opt.projPath + '/' + config.prefix + opt.projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 펑션 가져오기
exports.readFuncProg = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var data;
    $xml.find('pous pou').each(function () {

        uconsole.log($(this).attr('name'), opt.plcName);

        if ($(this).attr('name').trim() === opt.plcName) {
            uconsole.log(2);
            $(this).find('funcProg ld').each(function () {
                uconsole.log(3);
                if ($(this).attr('name').trim() === opt.funcName) {
                    uconsole.log(4);
                    data = {
                        funcName: $(this).attr('name'),
                        funcType: $(this).attr('funcType'),
                        progLanguage: $(this).attr('progLanguage'),
                        returnType: $(this).attr('returnType'),
                        isAi: $(this).attr('isAi'),
                        aiType: $(this).attr('aiType'),
                        isEnEno: $(this).attr('isEnEno')
                    }
                    return false;
                }
            });
            return false;
        }
    });

    return data;
};

// 펑션 블럭 설정 하기 (추가)
exports.writeFuncBlock = function (projPath, projName, plcName, funcBlockName) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    var funcXml = '\n';
    funcXml += '        <funcBlockProg>\n';
    funcXml += '          <ld name="' + funcBlockName + '">\n';
    funcXml += '          </ld>\n';
    funcXml += '        </funcBlockProg>\n';

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body').append(funcXml);
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());
};

// 펑션 블럭 삭제 설정 하기 (제거)
exports.writeFuncBlockToRemove = function (projPath, projName, plcName, funcBlockName) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body funcBlockProg ld').each(function () {
                if ($(this).attr('name').trim() === funcBlockName) {
                    $(this).remove();
                    return false;
                }
            });
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());
};


// Task 설정 하기 (추가)
exports.writeTask = function (projPath, projName, plcName, taskName, progName, num, priority, interval, ldCnt) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    var progLabel = `ld${ldCnt}`;

    var taskXml = '\n';
    taskXml += `        <taskProg name="${taskName}" num="${num}" priority="${priority}" interval="${interval}">\n`;
    taskXml += `          <ld name="${progName}" ld="${progLabel}">\n`;
    taskXml += '          </ld>\n';
    taskXml += '        </taskProg>\n';

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body').append(taskXml);
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());

    // Task 프로그램 XML 파일 생성
    addProgFile({
        projPath: projPath,         // 프로젝트 경로
        progLabel: progLabel,       // XML 파일 이름
        lineNum: 50                 // 초기 라인 수 
    });
};

// Task 설정 하기 (삭제)
exports.writeTaskToRemove = function (projPath, projName, plcName, taskName) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    // 삭제 할 ld 프로그램들
    var progLabels = [];

    $xml.find('pous pou').each(function () {

        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body taskProg').each(function () {

                if ($(this).attr('name').trim() === taskName) {

                    $(this).children('ld').each(function () {
                        progLabels.push($(this).attr('ld'));
                    });

                    $(this).remove();
                    return false;
                }
            });

            return false;
        }

    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());

    // task 프로그램의 ld(?).xml 파일들을 삭제
    for (var i in progLabels) {
        removeProgFile(projPath, progLabels[i] + config.extension);
    }

};

// Task 프로그램 이름 설정 하기 (수정)
exports.writeNameForTask = function (projPath, projName, taskName, oldTaskName, newTaskName) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body taskProg').each(function () {
                if ($(this).attr('name').trim() === taskName) {
                    $(this).find('ld').each(function () {
                        if ($(this).attr('name').trim() === oldTaskName) {
                            $(this).attr('name', newTaskName);
                        }
                    });
                    return false;
                }
            });

            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());
};

// Task 프로그램 설정 하기 (추가)
exports.writeTaskProg = function (projPath, projName, plcName, taskName, progName, ldCnt) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    var progLabel = `ld${ldCnt}`;

    var taskProgXml = '\n';
    taskProgXml += `          <ld name="${progName}" ld="${progLabel}">\n`;
    taskProgXml += '          </ld>\n';

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body taskProg').each(function () {
                if ($(this).attr('name').trim() === taskName) {
                    $(this).append(taskProgXml);
                    return false;
                }
            });

            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());

    // Task 프로그램 XML 파일 추가
    addProgFile({
        projPath: projPath,
        progLabel: progLabel,
        lineNum: 50
    });

};

// Task 프로그램 삭제 설정 하기 (삭제)
exports.writeTaskProgToRemove = function (projPath, projName, plcName, taskName, progName, progLabel) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {
            $(this).find('body taskProg').each(function () {
                if ($(this).attr('name').trim() === taskName) {
                    $(this).find('ld').each(function () {
                        if ($(this).attr('name').trim() === progName) {
                            $(this).remove();
                            return false;
                        }
                    });
                    return false;
                }
            });
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(projPath, config.prefix + projName, $xml.find('project').html());

    // Task 프로그램 XML 파일 삭제
    removeProgFile(projPath, progLabel + config.extension);
};

// Task 정보 가져오기
exports.readTask = function (projPath, projName, plcName, taskName) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    var data = {};

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === plcName) {

            $(this).find('body taskProg').each(function () {

                if ($(this).attr('name').trim() == taskName) {
                    data.plcName = plcName;
                    data.taskName = taskName;
                    data.num = $(this).attr('num');
                    data.priority = $(this).attr('priority');
                    data.interval = $(this).attr('interval');
                    return false;
                }

            });

            return false;
        }
    });

    return data;
};


// 네트워크 추가 설정 하기 (추가)
// (projPath, projName, netName)
exports.writeNet = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var network = '\n';
    var network = '    <network name="' + opt.netName + '">\n';
    network += '    </network>\n';

    $xml.find('networks').append(network);

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 네트워크 이름 설정 하기 (수정)
// (projPath, projName, oldNetName, newNetName)
exports.writeNameForNet = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('networks network').each(function () {
        if ($(this).attr('name').trim() === opt.oldName) {
            $(this).attr('name', opt.newName);
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 네트워크 삭제 설정 하기 (삭제)
// (projPath, projName, netName)
exports.writeNetToRemove = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('networks network').each(function () {
        if ($(this).attr('name').trim() === opt.netName) {
            $(this).remove();
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};


// EDITOR (에디터)

// 글로벌 변수 설정하기 (추가)
// ( option : projPath, projName, plcName, progName )
exports.writeGlobalVar = function (opt) {

    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var varXml;
    varXml = '\n';
    varXml += '        <var keyword="VAR_GLOBAL" name="" datatype="BOOL" memory="" initval="" retain="미적용" description="" ></var>\n';

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('interface globalVar').append(varXml);
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 글로벌 변수 값 설정하기 (수정)
// (option : projPath, projName, plcName, progName, rowNum, keyword, name, dataType, initVal, memory, retain, description )
exports.writeGlobalVarToSet = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var index = 0;
    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find(`interface globalVar var`).each(function () {
                if (index == opt.rowNum) {
                    $(this).attr('keyword', opt.keyword).attr('name', opt.name)
                        .attr('datatype', opt.dataType).attr('initval', opt.initVal)
                        .attr('memory', opt.memory).attr('retain', opt.retain)
                        .attr('description', opt.description);
                    return false;
                }
                index++;
            });
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 글로벌 변수 가져오기
// (option : projPath, projName, plcName, progName)
exports.readGlobalVar = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var datas = [];
    var index = 0;

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('interface globalVar').each(function () {
                $(this).find('var').each(function () {
                    var data = {
                        keyword: $(this).attr('keyword'),
                        name: $(this).attr('name'),
                        dataType: $(this).attr('datatype'),
                        initVal: $(this).attr('initval'),
                        memory: $(this).attr('memory'),
                        retain: $(this).attr('retain'),
                        description: $(this).attr('description'),
                        rowNum: index
                    };

                    datas.push(data);
                    index++;
                });
                return false;
            });
            return false;
        }
    });

    return datas;
};


// 기본 파라미터 설정 하기 
exports.writeDefualtParamToSet = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            switch (opt.id) {
                case 'cycle':
                    $(this).find('cycle').attr("value", opt.value).attr("isActive", opt.isActive);
                    break;
                case 'watchDoc':
                    $(this).find('watchDoc').attr("value", opt.value).attr("isActive", opt.isActive);
                    break;
                case 'filter':
                    $(this).find('filter').attr("value", opt.value).attr("isActive", opt.isActive);
                    break;
                case 'restartMode':
                    $(this).find('restartMode').attr("value", opt.value);
                    break;
                case 'calculateError':
                    $(this).find('calculateError').attr("isActive", opt.isActive);
                    break;
                case 'networkError':
                    $(this).find('networkError').attr("isActive", opt.isActive);
                    break;
                case 'area':
                    $(this).find('latchArea input').attr('isUse', opt.datatable[0].isUse).attr('start', opt.datatable[0].start).attr('end', opt.datatable[0].end);
                    $(this).find('latchArea output').attr('isUse', opt.datatable[1].isUse).attr('start', opt.datatable[1].start).attr('end', opt.datatable[1].end);
                    $(this).find('latchArea general').attr('isUse', opt.datatable[2].isUse).attr('start', opt.datatable[2].start).attr('end', opt.datatable[2].end);
                    $(this).find('latchArea count').attr('isUse', opt.datatable[3].isUse).attr('start', opt.datatable[3].start).attr('end', opt.datatable[3].end);
                    $(this).find('latchArea timeHundred').attr('isUse', opt.datatable[4].isUse).attr('start', opt.datatable[4].start).attr('end', opt.datatable[4].end);
                    $(this).find('latchArea timeTen').attr('isUse', opt.datatable[5].isUse).attr('start', opt.datatable[5].start).attr('end', opt.datatable[5].end);
                    $(this).find('latchArea timeOne').attr('isUse', opt.datatable[6].isUse).attr('start', opt.datatable[6].start).attr('end', opt.datatable[6].end);
                    break;
            }

            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 기본 파라미터 가져오기
// (option: projPath, projName, plcName)
exports.readDefualtParam = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var data;
    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {

            var area = [];

            area.push({
                isUse: $(this).find('latchArea input').attr('isUse') == "true" ? true : false,
                start: $(this).find('latchArea input').attr('start'),
                end: $(this).find('latchArea input').attr('end')
            });

            area.push({
                isUse: $(this).find('latchArea output').attr('isUse') == "true" ? true : false,
                start: $(this).find('latchArea output').attr('start'),
                end: $(this).find('latchArea output').attr('end')
            });

            area.push({
                isUse: $(this).find('latchArea general').attr('isUse') == "true" ? true : false,
                start: $(this).find('latchArea general').attr('start'),
                end: $(this).find('latchArea general').attr('end')
            });
            area.push({
                isUse: $(this).find('latchArea count').attr('isUse') == "true" ? true : false,
                start: $(this).find('latchArea count').attr('start'),
                end: $(this).find('latchArea count').attr('end')
            });
            area.push({
                isUse: $(this).find('latchArea timeHundred').attr('isUse') == "true" ? true : false,
                start: $(this).find('latchArea timeHundred').attr('start'),
                end: $(this).find('latchArea timeHundred').attr('end')
            });
            area.push({
                isUse: $(this).find('latchArea timeTen').attr('isUse') == "true" ? true : false,
                start: $(this).find('latchArea timeTen').attr('start'),
                end: $(this).find('latchArea timeTen').attr('end')
            })
            area.push({
                isUse: $(this).find('latchArea timeOne').attr('isUse') == "true" ? true : false,
                start: $(this).find('latchArea timeOne').attr('start'),
                end: $(this).find('latchArea timeOne').attr('end')
            });

            data = {
                cycle: {
                    value: $(this).find('cycle').attr("value"),
                    isActive: $(this).find('cycle').attr("isActive") == "true" ? true : false
                },
                watchDoc: {
                    value: $(this).find('watchDoc').attr("value"),
                    isActive: $(this).find('watchDoc').attr("isActive") == "true" ? true : false
                },
                filter: {
                    value: $(this).find('filter').attr("value"),
                    isActive: $(this).find('filter').attr("isActive") == "true" ? true : false
                },
                restartMode: $(this).find('restartMode').attr("value"),
                calculateError: $(this).find('calculateError').attr("isActive") == "true" ? true : false,
                networkError: $(this).find('networkError').attr("isActive") == "true" ? true : false,
                area: area
            }

            return false;
        }
    });

    return data;
};

// IO 파라미터 설정하기 (추가)
exports.writeIOParam = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var baseXml = '\n';
    baseXml += '          <base num="' + opt.baseNum + '" name="">\n';
    baseXml += '            <slot num="0" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '            <slot num="1" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '            <slot num="2" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '            <slot num="3" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '            <slot num="4" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '            <slot num="5" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '            <slot num="6" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '            <slot num="7" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '            <slot num="8" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '            <slot num="9" mod="" filter="" emergency="" input="" output="" description="" />\n';
    baseXml += '          </base>';

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('io').append(baseXml);
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// IO 파라미터 설정하기 (수정)
exports.writeIOParamToSet = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('io').children(`base:eq(${opt.baseNum})`).children(`slot:eq(${opt.num})`)
                .attr('num', opt.num)
                .attr('mod', opt.mod)
                .attr('filter', opt.filter)
                .attr('emergency', opt.emergency)
                .attr('input', opt.input)
                .attr('output', opt.output)
                .attr('description', opt.description);
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// IO 파라미터 설정하기 (삭제)
exports.writeIOParamToRemove = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('io').children(`base:eq(${opt.baseNum})`).remove();
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};


// IO 파라미터 가져오기
exports.readIOParamForBaseTotal = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var data = 0;
    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            data = $(this).find('io').children('base').length;
        }
    });

    return data;
};

// IO 파라미터 가져오기 (slot 정보)
exports.readIOParam = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var datas = [];
    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('io').children(`base:eq(${opt.baseNum})`).children('slot').each(function () {
                datas.push({
                    num: $(this).attr('num'),
                    mod: $(this).attr('mod'),
                    filter: $(this).attr('filter'),
                    emergency: $(this).attr('emergency'),
                    input: $(this).attr('input'),
                    output: $(this).attr('output'),
                    description: $(this).attr('description')
                });
            });
        }
    });

    return datas;
};


// 로컬 변수 설정하기 (추가)
// ( option : projPath, projName, plcName, progName )
exports.writeLocalVar = function (opt) {

    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var varXml;
    varXml = '\n';
    varXml += '        <var keyword="VAR" name="" datatype="BOOL" memory="" initval="" retain="미적용" description="" ></var>\n';

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('interface scanVar').each(function () {
                if ($(this).attr('name').trim() === opt.progName) {
                    $(this).append(varXml);
                    return false;
                }
            });
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 로컬 변수 값 설정하기 (수정)
// (option : projPath, projName, plcName, progName, rowNum, keyword, name, dataType, initVal, memory, retain, description )
exports.writeLocalVarToSet = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('interface scanVar').each(function () {
                if ($(this).attr('name').trim() === opt.progName) {
                    $(this).find(`var:eq(${opt.rowNum})`).attr('keyword', opt.keyword).attr('name', opt.name)
                        .attr('datatype', opt.dataType).attr('initval', opt.initVal)
                        .attr('memory', opt.memory).attr('retain', opt.retain)
                        .attr('description', opt.description);
                    return false;
                }
            });
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 로컬 변수 삭제 설정하기 (option : projPath, projName, plcName, progName, rowNum)
exports.writeLocalVarToRemove = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('interface scanVar').each(function () {
                if ($(this).attr('name').trim() === opt.progName) {
                    for (var i = 0; i < opt.rowNums.length; i++) {
                        $(this).find('var:eq(' + opt.rowNums[i] + ')').remove();
                    }
                    return false;
                }
            });
            return false;
        }
    });

    // uFile.writeXML(projPath + '/' + config.prefix + projName + config.extension, $xml.find('project').html());
    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 로컬 변수 가져오기 
// (option : projPath, projName, plcName, progName, rowNum)
exports.readLocalVar = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var datas = [];
    var index = 0;

    $xml.find('pous pou').each(function () {

        if ($(this).attr('name').trim() === opt.plcName) {

            $(this).find('interface scanVar').each(function () {

                if ($(this).attr('name').trim() === opt.progName) {

                    $(this).find('var').each(function () {

                        var data = {
                            keyword: $(this).attr('keyword'),
                            name: $(this).attr('name'),
                            dataType: $(this).attr('datatype'),
                            initVal: $(this).attr('initval'),
                            memory: $(this).attr('memory'),
                            retain: $(this).attr('retain'),
                            description: $(this).attr('description'),
                            rowNum: index
                        };

                        datas.push(data);
                        index++;
                    });

                    return false;
                }
            });

            return false;
        }
    });

    return datas;
};



// 함수 로컬 변수 설정하기 (추가)
// (option : projPath, projName, plcName, progName, rowNum, keyword, name, dataType, description )
exports.writeFuncLocalVar = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var varXml;
    if (typeof opt.rowNum !== 'undefined' && opt.rowNum === 0) {
        varXml = '\n';
        varXml += '        <var keyword="VAR_RETURN" name="return" datatype="' + opt.dataType + '" description="' + opt.description + '" ></var>\n';
    } else {
        varXml = '\n';
        varXml += '        <var keyword="" name="" datatype="BOOL" description="" ></var>\n';
    }

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('interface funcVar').each(function () {
                if ($(this).attr('name').trim() === opt.funcName) {
                    $(this).append(varXml);
                    return false;
                }
            });
            return false;
        }
    });

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 함수 로컬 변수 설정 하기 (수정)
// (option : projPath, projName, plcName, progName, rowNum, keyword, name, dataType, description )
exports.writeFuncLocalVarToSet = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('interface funcVar').each(function () {
                if ($(this).attr('name').trim() === opt.funcName) {
                    $(this).find(`var:eq(${opt.rowNum})`)
                        .attr('keyword', opt.keyword)
                        .attr('name', opt.name)
                        .attr('datatype', opt.dataType)
                        .attr('description', opt.description);
                    return false;
                }
            });
            return false;
        }
    });

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 함수 로컬 변수 가져 오기
// (option : projPath, projName, plcName, progName)
exports.readFuncLocalVar = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var datas = [];
    var index = 0;

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {
            $(this).find('interface funcVar').each(function () {
                if ($(this).attr('name').trim() === opt.progName) {
                    $(this).find('var').each(function () {
                        var data = {
                            keyword: $(this).attr('keyword'),
                            name: $(this).attr('name'),
                            dataType: $(this).attr('datatype'),
                            description: $(this).attr('description'),
                            rowNum: index
                        };

                        datas.push(data);
                        index++;
                    });
                    return false;
                }
            });
            return false;
        }
    });

    return datas;
};



// 함수 로컬 변수 읽기

// POPUP WINDOW (팝업창)

// 이더넷 모듈 XML 생성
var ethernetXml = function (name, plcName, base, slot) {
    var ethernet = '\n';
    ethernet += `        <ethernet name="${name}" plcName="${plcName}" base="${base}" slot="${slot}" ip="" gw="" netmask="" dns="" mid="">\n`;
    ethernet += '          <modbus>\n';
    ethernet += '            <readBit startAddress="" size="" />\n';
    ethernet += '            <writeBit startAddress="" size="" />\n';
    ethernet += '            <readWord startAddress="" size="" />\n';
    ethernet += '            <writeWord startAddress="" size="" />\n';
    ethernet += '          </modbus>\n';
    ethernet += '        </ethernet>\n';
    return ethernet;
};

// 시리얼 모듈 XML 생성
var serialXml = function (name, base, slot) {
    var serial = '\n';
    serial += `        <serial name="${name}" base="${base}" slot="${slot}"  type="" baudrate="" sbit="" pbit="" dbit="" mid="" >\n`;
    serial += '          <modbus>\n';
    serial += '            <readBit startAddress="" size="" />\n';
    serial += '            <writeBit startAddress="" size="" />\n';
    serial += '            <readWord startAddress="" size="" />\n';
    serial += '            <writeWord startAddress="" size="" />\n';
    serial += '          </modbus>\n';
    serial += '        </serial>\n';
    return serial;
};

// 네트워크 모듈 설정 하기 (추가)
exports.writeNetMod = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var netModXml = '';

    $xml.find('networks network').each(function () {
        if ($(this).attr('name').trim() === opt.netName) {
            switch (product.WHAT_TYPE(opt.netMod)) {
                case product.NET_MOD_TYPE_ETHERNET:
                    netModXml = ethernetXml(opt.netMod, opt.plcName, opt.base, opt.slot);
                    break;
                case product.NET_MOD_TYPE_SERIAL:
                    netModXml = serialXml(opt.netMod, opt.plcName, opt.base, opt.slot);
                    break;
            }
            $(this).append(netModXml);
            return false;
        }

    });

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 네트워크 모듈 설정 하기 (값 설정)
exports.writeNetModToSet = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var mod = '';
    $xml.find('networks network').each(function () {
        if ($(this).attr('name').trim() === opt.netName) {
            switch (product.WHAT_TYPE(opt.netMod)) {
                case product.NET_MOD_TYPE_ETHERNET:
                    $(this).find(opt.netType).each(function () {
                        if ($(this).attr('name') === opt.netMod && $(this).attr('base') === opt.base) {
                            uconsole.log("slotNum = ", $(this).attr('slot'));
                            if ($(this).attr('slot') === opt.slot) {
                                $(this).attr('ip', opt.ip).attr('gw', opt.gateway).attr('netmask', opt.netmask).attr('dns', opt.dns).attr('mid', opt.mid);
                                return false;
                            }
                        }
                    });
                    break;
                case product.NET_MOD_TYPE_SERIAL:
                    $(this).find(opt.netType).each(function () {
                        if ($(this).attr('name') === opt.netMod && $(this).attr('base') === opt.base) {
                            if ($(this).attr('slot') === opt.slot) {
                                $(this).attr('type', opt.type).attr('baudrate', opt.baudrate).attr('sbit', opt.sbit).attr('pbit', opt.pbit)
                                    .attr('dbit', opt.dbit).attr('dbit', opt.dbit);
                            }
                        }
                    });
                    break;
            }

            return false;
        }

    });

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 네트워크 모듈 삭제 설정 하기 (삭제)
// (base, slot, netModName, plcName, netName, projName, projPath)
exports.writeNetModToRemove = function (opt) {

    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var modType = '';
    switch (product.WHAT_TYPE(opt.netModName)) {
        case product.NET_MOD_TYPE_ETHERNET:
            modType = 'ethernet';
            break;
        case product.NET_MOD_TYPE_SERIAL:
            modType = 'serial';
            break;
        default:
            break;
    }

    $xml.find('networks network').each(function () {
        if ($(this).attr('name').trim() === opt.netName) {
            $(this).children().each(function () {
                if ($(this).attr('name').trim() === opt.netMod && $(this).attr('plcName').trim() === opt.plcName) {
                    if ($(this).attr('base') === opt.base && $(this).attr('slot') == opt.slot) {
                        $(this).remove();
                        return false;
                    }
                }
            });
            return false;
        }
    });

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 네트워크 모듈 읽기 
exports.readNetMod = function (data) {
    var $xml = uFile.readXMLToObject(data.projPath + '/' + config.prefix + data.projName + config.extension);

    var mod;

    $xml.find('networks network').each(function () {
        if ($(this).attr('name').trim() === data.netName) {
            switch (product.WHAT_TYPE(data.netMod)) {
                case product.NET_MOD_TYPE_ETHERNET:
                    $(this).find(data.netType).each(function () {
                        if ($(this).attr('name') === data.netMod && $(this).attr('base') === data.base) {
                            if ($(this).attr('slot') === data.slot) {

                                mod = {};
                                mod.ip = $(this).attr('ip');
                                mod.gateway = $(this).attr('gw');
                                mod.netmask = $(this).attr('netmask');
                                mod.dns = $(this).attr('dns');
                                mod.mid = $(this).attr('mid');

                                return false;
                            }
                        }
                    });
                    break;
                case product.NET_MOD_TYPE_SERIAL:
                    $(this).find(data.netType).each(function () {
                        if ($(this).attr('name') === data.netMod && $(this).attr('base') === data.base) {
                            if ($(this).attr('slot') === data.slot) {

                                mod = {};
                                mod.type = $(this).attr('type');
                                mod.baudrate = $(this).attr('baudrate');
                                mod.sbit = $(this).attr('sbit');
                                mod.pbit = $(this).attr('pbit');
                                mod.dbit = $(this).attr('dbit');
                                mod.mid = $(this).attr('mid');

                                return false;
                            }
                        }
                    });
                    break;
            }
            return false;
        }

    });

    return mod;
};

// 모드 버스 설정 하기 (추가)
exports.writeModbus = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find('networks network').each(function () {
        if ($(this).attr('name').trim() === opt.netName) {

            $(this).find(opt.netType).each(function () {
                if ($(this).attr('name').trim() === opt.netMod && $(this).attr('base').trim() === opt.base) {
                    if ($(this).attr('slot').trim() === opt.slot) {
                        if (opt.readBit.trim().length > 0) $(this).find('readBit').attr('startAddress', opt.readBit).attr('size', opt.readBitSize);
                        if (opt.writeBit.trim().length > 0) $(this).find('writeBit').attr('startAddress', opt.writeBit).attr('size', opt.writeBitSize);
                        if (opt.readWord.trim().length > 0) $(this).find('readWord').attr('startAddress', opt.readWord).attr('size', opt.readWordSize);
                        if (opt.writeWord.trim().length > 0) $(this).find('writeWord').attr('startAddress', opt.writeWord).attr('size', opt.writeWordSize);

                        return false;
                    }

                }
            });

            return false;
        }
    });

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// 모드 버스 설정 정보 가져 오기 
exports.readModbus = function (projPath, projName, netType, netName, netMod, base, slot) {
    var $xml = uFile.readXMLToObject(projPath + '/' + config.prefix + projName + config.extension);

    var data;

    $xml.find('networks network').each(function () {
        if ($(this).attr('name').trim() === netName) {
            $(this).find(netType).each(function () {

                if ($(this).attr('name').trim() === netMod && $(this).attr('base').trim() === base) {
                    if ($(this).attr('slot').trim() === slot) {

                        data = {};
                        data.readBit = $(this).find('readBit').attr('startAddress');
                        data.readBitSize = $(this).find('readBit').attr('size');
                        data.writeBit = $(this).find('writeBit').attr('startAddress');
                        data.writeBitSize = $(this).find('writeBit').attr('size');
                        data.readWord = $(this).find('readWord').attr('startAddress');
                        data.readWordSize = $(this).find('readWord').attr('size');
                        data.writeWord = $(this).find('writeWord').attr('startAddress');
                        data.writeWordSize = $(this).find('writeWord').attr('size');
                        return false;
                    }
                }
            });
            return false;
        }
    });

    return data;
};


// AI 설정하기 (추가)
exports.writeAiByAdd = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);
    var aiXml = `<mod name="${opt.aiName}" plcName="${opt.plcName}" />\n`;

    $xml.find("ai").children().each(function () {
        if ($(this).attr('plcName') === opt.plcName && $(this).attr('name') === opt.aiName) {
            $(this).remove();
            return false;
        }
    });

    $xml.find("ai").append(aiXml);

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// AI 설정하기 (삭제)
exports.writeAiByRemove = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    $xml.find("ai").children().each(function () {
        if ($(this).attr('plcName') === opt.plcName && $(this).attr('name') === opt.aiName) {
            $(this).remove();
            return false;
        }
    });

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};

// AI 모듈 가져오기
exports.readAi = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var datas = [];
    $xml.find("ai").children().each(function () {
        if ($(this).attr('plcName') === opt.plcName) {
            datas.push($(this).attr('name'));
        }
    });

    return datas;
}

// TODO : 2차년도에는 사용하지 말것 ( 1차년도에 펌웨어와 소프트웨어간의 심볼 정의가 안되어 있음.)
var changeSymbol = function (symbol) {
    switch (symbol) {
        case action.openedContact:
            return 'open';
        case action.closedContact:
            return 'close';
        case action.contactP:
            return 'p';
        case action.contactN:
            return 'n';
        case action.reverseContact:
            return 'not';
        case action.openedCoil:
            return 'open';
        case action.closedCoil:
            return 'close';
        case action.coilS:
            return 's';
        case action.coilR:
            return 'r';
        case action.coilP:
            return 'p';
        case action.coilN:
            return 'n';
    }
}

// rung 단위 xml 생성 
var getRungXml = function (opt) {

    var func;
    var entity;
    var i;
    var j;

    var xml = '\n';
    xml += '            <rung>\n';
    for (i in opt.element) {

        if (opt.element[i].type === "contact") {
            xml += '              <contact>\n';
            for (j in opt.element[i].entity) {
                entity = opt.element[i].entity[j];
                xml += `                <entity varName="${entity.varName}" symbol="${changeSymbol(entity.symbol)}" start="${entity.start}" />\n`;
            }
            xml += '              </contact>\n';
        } else if (opt.element[i].type === "func") {
            func = opt.element[i];
            if ( func.funcName.indexOf('AI-') !== -1 )  {
                xml += `              <func varName="${func.varName}" funcName="AIPLC" uiFuncName="${func.funcName}">\n`;
            } else {
                xml += `              <func varName="${func.varName}" funcName="${func.funcName}" uiFuncName="${func.funcName}">\n`;
            }

            for (j in func.inParam) {
                xml += `                <inParam datatype="${func.inParam[j].dataType}" name="${func.inParam[j].name}" varName="${func.inParam[j].varName}" value="${func.inParam[j].value}" isLinked="${func.inParam[j].isLinked}"/>\n`;
            }

            for (j in func.outParam) {
                xml += `                <outParam datatype="${func.outParam[j].dataType}" name="${func.outParam[j].name}" varName="${func.outParam[j].varName}" value="${func.outParam[j].value}" isLinked="${func.outParam[j].isLinked}"/>\n`;
            }
            xml += `                <return datatype="${func.return.dataType}" varName="${func.return.varName}" value="${func.return.value}" isLinked="${func.return.isLinked}"/>\n`;
            xml += '              </func>\n';
        } else if (opt.element[i].type === "coil") {
            xml += '              <coil>\n';
            for (j in opt.element[i].entity) {
                entity = opt.element[i].entity[j];
                xml += `                <entity varName="${entity.varName}" symbol="${changeSymbol(entity.symbol)}" start="false"/>\n`;
            }
            xml += '              </coil>\n';
        }
    }
    xml += '            </rung>\n';
    return xml;
};

// 프로그램 설정 하기 (rung 단위 추가하기)
// ( option : projPath, projName, plcName, progLabel, [{rung}] )
exports.writeProg = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + config.prefix + opt.projName + config.extension);

    var rungXml = '';

    for (var i in opt.rungs) {
        rungXml += getRungXml(opt.rungs[i]);
    }

    switch (opt.parentProgType) {
        case "task":
            opt.parentProgType = "taskProg";
            break;
        case "userFunc":
            opt.parentProgType = "funcProg";
            break;
    }

    var isExist = false;

    $xml.find('pous pou').each(function () {
        if ($(this).attr('name').trim() === opt.plcName) {

            // 프로그램이 있으면 삭제
            $(this).find(opt.parentProgType).children().each(function () {
                if ($(this).attr("ld") === opt.progLabel) {
                    if ($(this).children().length > 0) {
                        $(this).empty();
                    }

                    $(this).append(rungXml);
                    isExist = true;
                    return false;
                }
            });

            if (!isExist) {
                // 프로그램 추가
                var ldXml = "\n";
                ldXml += `<ld name="${opt.progName}" ld="${opt.progLabel}">`;
                ldXml += rungXml;
                ldXml += "</ld>";

                $(this).find(opt.progType).append(ldXml);
            }

            return false;
        }
    });

    writeXML(opt.projPath, config.prefix + opt.projName, $xml.find('project').html());
};




//  ========================================== ld 파일 생성 / 삭제 / 쓰기 / 읽기 ==================================================

// LD 프로그램 추가 하기
var addProgFile = function (opt) {
    var $xml = uFile.readXMLToObject(rootPath + '/xmlProj/PROGRAM' + config.extension);

    var lineXML = '\n';
    lineXML += `<ldSize row="${opt.lineNum}" col="12" />\n`;
    for (var i = 0; i < opt.lineNum; i++) {
        lineXML += `<line posX="${i}">\n`;
        lineXML += '</line>\n';
    }

    $xml.find('project').append(lineXML);

    writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
};
exports.addProgFile = addProgFile;

// LD 프로그램 파일 삭제 하기
var removeProgFile = function (projPath, fileName) {
    uFile.removeASync(projPath, fileName);
};

// 프로그램 가져 오기 ( readProg - > readLdProg)
exports.readLdProg = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var ld = {
        row: Number($xml.find('ldSize').attr('row')),
        col: Number($xml.find('ldSize').attr('col')),
        datas: []
    };

    $xml.find('line').each(function () {
        var lineData = [];
        $(this).children().each(function () {
            if ($(this).get(0).tagName === 'entity') {
                lineData.push({
                    posX: $(this).attr('posX'),             // 라인 번호 
                    posY: $(this).attr('posY'),             // 열 번호
                    varName: $(this).attr('varName'),       // 변수 이름 
                    symbol: $(this).attr('symbol'),         // 접점 기호 
                    dataType: $(this).attr('dataType'),     // 데이터 타입
                    memory: $(this).attr('memory'),         // 메모리
                    initVal: $(this).attr('initVal'),       // 데이터 타입
                    keyword: $(this).attr('keyword')        // 데이터 타입
                });
            } else if ($(this).get(0).tagName === 'rungComment') {
                lineData.push({
                    content: $(this).attr('content')        // 내용
                });
            } else if ($(this).get(0).tagName === 'rungLabel') {
                lineData.push({
                    type: $(this).attr('type'),             // label 타입
                    content: $(this).attr('content')        // 내용
                });
            } else if ($(this).get(0).tagName === 'func') {
                var funcData = {
                    varName: $(this).attr('varName'),
                    funcName: $(this).attr('funcName'),
                    posX: $(this).attr('posX'),
                    posY: $(this).attr('posY'),
                    input: [],
                    output: []
                };

                var funcEntity;
                $(this).children().each(function () {
                    if ($(this).get(0).tagName === 'inParam') {
                        
                        funcEntity = [];
                        if ( $(this).children().length > 0 ) {
                            $(this).children().each(function(){
                                funcEntity.push({
                                    varName: $(this).attr('varName'),       // 변수 이름 
                                    symbol: $(this).attr('symbol'),         // 접점 기호 
                                    dataType: $(this).attr('dataType'),     // 데이터 타입
                                    memory: $(this).attr('memory'),         // 메모리
                                    initVal: $(this).attr('initVal'),       // 데이터 타입
                                    keyword: $(this).attr('keyword')        // 데이터 타입
                                });
                            });
                        }
                        funcData.input.push({
                            varName: $(this).attr('varName'),
                            dataType: $(this).attr('dataType'),
                            entity: funcEntity
                        });

                    } else if ($(this).get(0).tagName === 'outParam') {
                        
                        funcEntity = [];
                        if ( $(this).children().length > 0 ) {
                            $(this).children().each(function(){
                                funcEntity.push({
                                    varName: $(this).attr('varName'),       // 변수 이름 
                                    symbol: $(this).attr('symbol'),         // 접점 기호 
                                    dataType: $(this).attr('dataType'),     // 데이터 타입
                                    memory: $(this).attr('memory'),         // 메모리
                                    initVal: $(this).attr('initVal'),       // 데이터 타입
                                    keyword: $(this).attr('keyword')        // 데이터 타입
                                });
                            });
                        }

                        funcData.output.push({
                            varName: $(this).attr('varName'),
                            dataType: $(this).attr('dataType'),
                            entity: funcEntity
                        });
                    } else if ($(this).get(0).tagName === 'return') {
                        funcEntity = [];
                        if ( $(this).children().length > 0 ) {
                            $(this).children().each(function(){
                                funcEntity.push({
                                    varName: $(this).attr('varName'),       // 변수 이름 
                                    symbol: $(this).attr('symbol'),         // 접점 기호 
                                    dataType: $(this).attr('dataType'),     // 데이터 타입
                                    memory: $(this).attr('memory'),         // 메모리
                                    initVal: $(this).attr('initVal'),       // 데이터 타입
                                    keyword: $(this).attr('keyword')        // 데이터 타입
                                });
                            });
                        }

                        funcData.return = {
                            varName: $(this).attr('varName'),
                            dataType: $(this).attr('dataType'),
                            entity: funcEntity
                        }
                    }
                });

                lineData.push({
                    funcData: funcData
                });
            }
        });

        ld.datas.push(lineData);
    });

    return ld;
};

// 링크 설정 하기 (추가)
exports.writeProgByAddLinks = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var linkXml = '\n';
    var posX = opt.posX;
    var posY;

    if (opt.posY.length === 0) {
        return;
    }

    for ( var i in opt.posY ){
        posY = opt.posY[i];
        linkXml +=`<entity varName="" symbol="link" dataType="" posX="${posX}" posY="${posY}" initVal="" memory="" keyword=""/>\n`;
    }

    $xml.find(`line:eq(${opt.posX})`).append(linkXml);

    writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
}

// 프로그램의 엔터티(접점 또는 코일) 설정하기 (추가)
exports.writeProgByAddEntity = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var isExist = false;
    var cellXML = `\n`;

    if (opt.symbol === 'verticalLink') {
        $xml.find(`line:eq(${opt.posX})`).children().each(function () {
            // 이미 존재 한다면 현재 추가하지 않음
            if ($(this).attr('posY') === String(opt.posY) && $(this).attr('symbol') === 'verticalLink') {
                isExist = true;
            }
        });

        if (!isExist) {
            cellXML += `<entity varName="${opt.varName}" symbol="${opt.symbol}" dataType="${opt.dataType}" posX="${opt.posX}" posY="${opt.posY}" initVal="${opt.initVal}" memory="${opt.memory}" keyword="${opt.keyword}" />\n`;
            $xml.find(`line:eq(${opt.posX})`).append(cellXML);

            writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
        }

    } else {

        $xml.find(`line:eq(${opt.posX})`).children().each(function () {
            // 이미 존재 한다면 현재 entity 다음에 추가하고 현재 entity 를 삭제
            if ($(this).attr('posY') === String(opt.posY) && $(this).attr('symbol') !== 'verticalLink') {
                cellXML += `<entity varName="${opt.varName}" symbol="${opt.symbol}" dataType="${opt.dataType}" posX="${opt.posX}" posY="${opt.posY}" initVal="${opt.initVal}" memory="${opt.memory}" keyword="${opt.keyword}" />\n`;
                $(this).after(cellXML);

                $(this).remove();
                isExist = true;
            }
        });

        if (!isExist) {
            cellXML += `<entity varName="${opt.varName}" symbol="${opt.symbol}" dataType="${opt.dataType}" posX="${opt.posX}" posY="${opt.posY}" initVal="${opt.initVal}" memory="${opt.memory}" keyword="${opt.keyword}" />\n`;
            $xml.find(`line:eq(${opt.posX})`).append(cellXML);
        }

        writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
    }

};

// 프로그램의 엔터티(접점 또는 코일) 설정하기 (삭제)
exports.writeProgByRemoveEntity = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var isExist = false;   // 삭제가 되었는지 확인 

    if (action === "vertical") {  // 수직선 만 삭제 인경우 수직선만 삭제
        $xml.find(`line:eq(${opt.posX})`).children().each(function () {
            if ($(this).attr('posY') === String(opt.posY) && $(this).attr('symbol') === 'verticalLink') {
                $(this).remove();
                isExist = true;
                return false;
            }
        });

    } else {

        $xml.find(`line:eq(${opt.posX})`).children().each(function () {
            if ($(this).attr('posY') === String(opt.posY)) {
                if (opt.action === 'replace') {
                    if ($(this).attr('symbol') !== 'verticalLink') {
                        $(this).remove();
                    }
                } else {
                    $(this).remove();
                }

                // 코일 을 삭제한 경우 
                if ($(this).attr('symbol').indexOf('Coil') > -1) {
                    $xml.find(`line:eq(${opt.posX})`).find('rungComment').remove();
                }
            }
        });

    }

    writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
};

// 프로그램의 엔터티 불러오기
exports.readProgByEntity = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var data;

    $xml.find(`line:eq(${opt.posX})`).children().each(function () {
        if ($(this).attr('posY') == String(opt.posY)) {

            data = {
                varName: $(this).attr('varName'),
                symbol: $(this).attr('symbol'),
                dataType: $(this).attr('dataType'),
                posX: $(this).attr('posX'),
                posY: $(this).attr('posY'),
                initVal: $(this).attr('initVal'),
                memory: $(this).attr('memory'),
                keyword: $(this).attr('keyword')
            }

            return false;
        }
    });

    return data;
};

// rungComment 설정 하기 (추가)
exports.writeProgByAddRungComment = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);
    var rungCommentXML = `<rungComment content="${opt.content}" ></rungComment>\n`;
    if ($xml.find(`line:eq(${opt.posX})`).children('rungComment').length > 0) {
        $xml.find(`line:eq(${opt.posX})`).children('rungComment').remove();
    }
    $xml.find(`line:eq(${opt.posX})`).append(rungCommentXML);

    writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
};

// rungComment 설정 하기 (삭제)
exports.writeProgByRemoveRungComment = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);
    if ($xml.find(`line:eq(${opt.posX})`).children('rungComment').length > 0) {
        $xml.find(`line:eq(${opt.posX})`).find('rungComment').remove();
        writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
    }
};

// rungComment 가져 오기
exports.readProgByRungComment = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);
    return $xml.find(`line:eq(${opt.posX})`).find('rungComment').attr('content');
};

// rungLabel 설정하기 (추가))
exports.writeProgByAddRungLabel = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);
    if ($xml.find(`line:eq(${opt.posX})`).find('rungLabel').length > 0) {
        $xml.find(`line:eq(${opt.posX})`).find('rungLabel').attr('type', opt.type).attr('content', opt.content);
    } else {
        var rungCommentXML = `<rungLabel type="${opt.type}" content="${opt.content}"></rungLabel>\n`;
        $xml.find(`line:eq(${opt.posX})`).append(rungCommentXML);
    }

    writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
};

// rungLabel 설정하기 (삭제)
exports.writeProgByRemoveRungLabel = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    if ($xml.find(`line:eq(${opt.posX})`).children('rungLabel').length > 0) {
        $xml.find(`line:eq(${opt.posX})`).children('rungLabel').remove();

        writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
    }
};

// rungLabel 가져 오기
exports.readProgByRungLabel = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);
    return {
        type: $xml.find(`line:eq(${opt.posX})`).find('rungLabel').attr('type'),
        content: $xml.find(`line:eq(${opt.posX})`).find('rungLabel').attr('content')
    };
};

// 프로그램의 펑션 설정하기 (추가)
exports.writeProgByAddFunc = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);
    var funcXML = `\n`;
    funcXML += `<func varName="${opt.varName}" funcName="${opt.funcName}" posX="${opt.posX}" posY="${opt.posY}">\n`;

    for (var i = 0; i < opt.input.length; i++) {
        funcXML += `<inParam dataType="${opt.input[i].dataType}" varName="${opt.input[i].varName}">\n`;
        // funcXML += `<entity varName="${opt.input[i].entity.varName}" symbol="${opt.input[i].entity.symbol}" dataType="${opt.input[i].entity.dataType}" 
        // posX="${opt.posX + i}" posY="${opt.posY - 1}" initVal="${opt.input[i].entity.initVal}" memory="${opt.input[i].entity.memory}" keyword="${opt.input[i].entity.keyword}" />\n`;
        funcXML += `</inParam>\n`;
    }

    for (var i = 0; i < opt.output.length; i++) {
        funcXML += `<outParam dataType="${opt.output[i].dataType}" varName="${opt.output[i].varName}">\n`;
        // funcXML += `<entity varName="${opt.output[i].entity.varName}" symbol="${opt.output[i].entity.symbol}" dataType="${opt.output[i].entity.dataType}" 
        // posX="${opt.posX + i}" posY="${opt.posY + 1}" initVal="${opt.output[i].entity.initVal}" memory="${opt.output[i].entity.memory}" keyword="${opt.output[i].entity.keyword}" />\n`;
        funcXML += `</outParam>\n`;
    }

    funcXML += `<return dataType="${opt.return.dataType}" varName="${opt.return.varName}">\n`;
    // funcXML += `<entity varName="${opt.return.entity.varName}" symbol="${opt.return.entity.symbol}" dataType="${opt.return.entity.dataType}" 
    //     initVal="${opt.return.entity.initVal}" memory="${opt.return.entity.memory}" keyword="${opt.return.entity.keyword}" />\n`;
    funcXML += `</return>\n`;
    funcXML += `</func>\n`;

    $xml.find(`line:eq(${opt.posX})`).append(funcXML);


    writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
};

// 프로그램의 펑션 설정하기 (삭제)
exports.writeProgByRemoveFunc = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var isExist = false;
    $xml.find(`line:eq(${opt.posX})`).children().each(function () {
        if ($(this).attr('posY') === String(opt.posY)) {
            $(this).remove();
            isExist = true;
            return false;
        }
    });

    if (isExist) {
        writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
    }
};

// 프로그램의 펑션의 파라미터 설정하기 (추가)
exports.writeProgByAddFuncEntity = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var entity = `<entity varName="${opt.entity.varName}" symbol="${opt.entity.symbol}" dataType="${opt.entity.dataType}" initVal="${opt.entity.initVal}" memory="${opt.entity.memory}" keyword="${opt.entity.keyword}" />\n`;

    $xml.find(`line:eq(${opt.posX})`).children('func').each(function () {
        if ($(this).attr('posY') === String(opt.posY)) {
            if ($(this).find(`${opt.param}:eq(${opt.index})`).children().length > 0) {
                $(this).find(`${opt.param}:eq(${opt.index})`).children().each(function () {
                    $(this).remove();
                });
            }
            $(this).find(`${opt.param}:eq(${opt.index})`).append(entity);
            return false;
        }
    });

    writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
};

// 프로그램의 펑션의 파라미터 설정하기 (삭제)
exports.writeProgByRemoveFuncEntity = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var isExist = false;
    $xml.find(`line:eq(${opt.posX})`).children('func').each(function () {
        if ($(this).attr('posY') === String(opt.posY)) {
            if ($(this).find(`${opt.param}:eq(${opt.index})`).children().length > 0) {
                $(this).find(`${opt.param}:eq(${opt.index})`).children().each(function () {
                    $(this).remove();
                    isExist = true;
                });
            }
            return false;
        }
    });

    if (isExist) {
        writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
    }
};

// 프로그램의 펑션 가져오기
exports.readProgByFunc = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var $func = $xml.find(`line:eq(${opt.posX})`).children('func');
    var data = {
        varName: $func.attr('varName'),
        funcName: $func.attr('funcName'),
        inputNum: 0,
        outputNum: 0,
        input: [],
        output: []
    };

    var entity;

    $func.children().each(function () {

        if ($(this).children().length > 0) {
            entity = {
                varName: $(this).children().attr('varName'),
                symbol: $(this).children().attr('symbol'),
                dataType: $(this).children().attr('dataType'),
                initVal: $(this).children().attr('initVal'),
                memory: $(this).children().attr('memory'),
                keyword: $(this).children().attr('keyword')
            };
        } else {
            entity = null;
        }

        if ($(this).get(0).tagName === 'inParam') {
            data.input.push({
                varName: $(this).attr('varName'),
                dataType: $(this).attr('dataType'),
                entity: entity,
            });
            data.inputNum++;
        } else if ($(this).get(0).tagName === 'outParam') {
            data.output.push({
                varName: $(this).attr('varName'),
                dataType: $(this).attr('dataType'),
                entity: entity,
            });
            data.outputNum++;
        } else if ($(this).get(0).tagName === 'return') {
            data.return = {
                varName: $(this).attr('varName'),
                dataType: $(this).attr('dataType'),
                entity: entity,
            }
            data.outputNum++;
        }
    });

    return data;
};

// 프로그램의 라인 설정하기 (추가)
exports.writeProgByAddLine = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var length = $xml.find('line').length;

    var lineXML = '\n';
    lineXML += `<line posX="${opt.posX}">\n`;
    lineXML += '</line>\n';

    $xml.find('line').each(function(){
        var posX = Number ( $(this).attr('posX') );
        if ( posX == opt.posX ) {
            $(this).before(lineXML);
            $(this).attr('posX', posX + 1 );
            $(this).children().each(function(){
                $(this).attr('posX', posX + 1 );
            });
        } else if ( posX  > opt.posX ) {
            $(this).attr('posX', posX + 1 );
            $(this).children().each(function(){
                $(this).attr('posX', posX + 1 );
            });
        }
    });

    $xml.find('ldSize').attr('row', length + 1);

    writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
};

// 프로그램의 라인 설정하기 (삭제)
exports.writeProgByRemoveLine = function (opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);

    var length = $xml.find('line').length;

    for ( var i in opt.funcs) {
        var func = funcs[i];
        $xml.find(`line:eq(${opt.func.posX})`).find('func').each(function(){
            if ( Number($(this).attr('posY')) === func.posY ) {
                $(this).remove();
                return false;
            }
        });
    }

    $xml.find('line').each(function(){
        var posX = Number($(this).attr('posX'));
        if ( posX == opt.posX ) {
            $(this).remove();
        } else if ( posX  > opt.posX ) {
            $(this).attr('posX', posX - 1 );
            $(this).children().each(function(){
                $(this).attr('posX', posX - 1 );
            });
        }
    });

    if ( length < 51) {
        var lineXML = '\n';
        lineXML += `<line posX="49">\n`;
        lineXML += '</line>\n';
        $xml.find('project').append(lineXML);
    }

    $xml.find('ldSize').attr('row', length - 1);
    writeXML(opt.projPath, opt.progLabel, $xml.find('project').html());
};

// 프로그램의 접점수 설정하기 (추가)
exports.writeProgByAddContactNum = function(opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);
    var length = $xml.find('col').length;

    $xml.find('ldSize').attr('col', length + 1);
}

// 프로그램의 접점수 설정하기 (삭제))
exports.writeProgByRemoveContactNum = function(opt) {
    var $xml = uFile.readXMLToObject(opt.projPath + '/' + opt.progLabel + config.extension);
    var length = $xml.find('col').length;

    $xml.find('ldSize').attr('col', length - 1);
}