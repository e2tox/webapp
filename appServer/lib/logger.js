
var https = require('https');

//
// Loggly (config)
//   Constructor for the Loggly object
//
var Logger = function (input) {
    this.options = {
        hostname: 'logs.loggly.com',
        port: 443,
        path: '/inputs/' + input,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

//
// function log (callback)
//   logs args to input device
//
Logger.prototype.log = function (textOrData) {

    var data;
    if (textOrData instanceof Object) {
        data = JSON.stringify(textOrData);
    }
    else {
        data = JSON.stringify({ message : textOrData });
    }

    var post = https.request(this.options, function(res) {
        //console.log("["+res.statusCode+"] " + data);
    });
    post.write(data);
    post.end();
};


module.exports = function(input) {
    return new Logger(input);
};