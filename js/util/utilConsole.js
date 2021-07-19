/* utilConsole.js */

const rootPath = __dirname + "/../../../../";
const resourcePath = rootPath + '/src/resource';
const definePath = resourcePath + '/js/define';

const config = require(definePath + '/config')

var log = function () {
    if (config.isLog) {
        var data = '';
        for (var argument of arguments) {
            data += argument + ' ';
        }
        console.log(data);
    }
}

var error = function () {
    if (config.isError) {
        var data = '';
        for (var argument of arguments) {
            data += argument + ' ';
        }
        console.error(data);
    }
}


exports.log = log;
exports.error = error;