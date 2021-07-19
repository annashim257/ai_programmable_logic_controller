// CPU 모델명
var CPU_LIT = 'CPU-LIT';
// var CPU_LIT2 = 'CPU-LIT2';

var CPUS = {
    CPU_LIT: CPU_LIT,
    // CPU_LIT2: CPU_LIT2
}

exports.CPU_LIT = CPU_LIT;
// exports.CPU_LIT2 = CPU_LIT2;

exports.CPU_NAMES = function(){
    var CPU_NAMES = [];

    for ( var key in CPUS) {
        CPU_NAMES.push( CPUS[key]);
    }

    return CPU_NAMES;
};


// 제품명
var PLC_MOD_LIT = "PLC-LIT";
// var PLC_MOD_LIT2 = "PRO-LIT2";

var PLC_MODS = {
    PLC_MOD_LIT: PLC_MOD_LIT,
    // PLC_MOD_LIT2: PLC_MOD_LIT2
}

exports.PLC_MOD_LIT = PLC_MOD_LIT;
// exports.PLC_MOD_LIT2 = PLC_MOD_LIT2;

exports.PLC_MOD_NAMES = function(){
    var PLC_MOD_NAMES = [];

    for ( var key in PLC_MODS) {
        PLC_MOD_NAMES.push( PLC_MODS[key]);
    }

    return PLC_MOD_NAMES;
};


// 네트워크 모듈 
var NET_MOD_LIT = 'NET-LIT';
var NET_MOD_LIT2 = 'NET-LIT2';

var NET_MOD_NAMES = {
    // NET_MOD_LIT: NET_MOD_LIT,
    // NET_MOD_LIT2: NET_MOD_LIT2
}

exports.NET_MOD_LIT = NET_MOD_LIT;
exports.NET_MOD_LIT2 = NET_MOD_LIT2;

exports.NET_MODS = function(){
    var NET_MOD_ARR = [];

    for ( var key in NET_MOD_NAMES) {
        NET_MOD_ARR.push(NET_MOD_NAMES[key]);
    }

    return NET_MOD_ARR;
};


// 네트워크 모듈 타입 ( 이더넷 / 시리얼 )
var NET_MOD_TYPE_ETHERNET = 'ethernet';
var NET_MOD_TYPE_SERIAL = 'serial';

exports.NET_MOD_TYPE_ETHERNET = NET_MOD_TYPE_ETHERNET;
exports.NET_MOD_TYPE_SERIAL = NET_MOD_TYPE_SERIAL;

// 네트워크 모듈 타입 선별
exports.WHAT_TYPE = function(NAME){
    switch(NAME){
        case NET_MOD_LIT:
            return NET_MOD_TYPE_ETHERNET;
        case NET_MOD_LIT2:
            return NET_MOD_TYPE_SERIAL;
    }
};
