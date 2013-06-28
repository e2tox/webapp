/**
 * Copyright 2013 =E.2=TOX
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

exports.createServer = function(config, callback) {

    var express = require('express'),
        exphbs  = require('express3-handlebars'),
        http = require('http'),
        io = require('socket.io'),
        logger = require('../lib/logger')(config.logger);

    var app = express();

    app.configure(function() {

        app.set('port', config.port);

        app.use(express.favicon());

        // only log for server file but static files
        app.use(express.logger());

        app.use(require('less-middleware')({
            src: config.lessDir,
            //prefix: '/stylesheets',
            dest: config.cacheDir,// + '/stylesheets',
            compress: true
        }));

        app.use(require('requirejs-middleware')({
            src: config.scriptDir,
            dest: config.cacheDir,
//            build: true,
//            debug: true,
//            defaults: {
//                preserveLicenseComments: false
//            },
            modules: {
                "/index.js": {
                    baseUrl: config.scriptDir,
                    include: "index"
                }
            }
        }));

        app.use(express.static(config.cacheDir));
        app.use(express.static(config.rootDir));

        app.use(app.router);

        app.use(express.compress());
        app.use(express.bodyParser());
        app.use(express.cookieParser(config.cookieSalt));
        app.use(express.cookieSession({key:config.authCookie,secret:config.cookieSalt,cookie:{ path: '/', httpOnly: true, maxAge: null }}));

//    // application error middleware
//    app.use(function(err, req, res, next){
//        //check error information and respond accordingly
//        logger.log({ message:err.stack });
//        res.send(500, err.stack);
//    });

        var hbs = exphbs.create({
            defaultLayout: config.defaultLayout,
            layoutsDir:config.layoutsDir,
            partialsDir:config.partiesDir,
            // Specify helpers which are only registered on this instance.
            helpers: {
                version: function () { return config.version; }
            }
        });

        app.engine('handlebars', hbs.engine);
        app.set('view engine', 'handlebars');
        app.set('views', config.viewsDir);

        app.enable('verbose errors');

        // disable them in production
        // use $ NODE_ENV=production node examples/error-pages
        if ('production' == app.settings.env) {
            app.disable('verbose errors');
        }

    });

    var site = require('../routes/site');

    // register all routes
    site.register(app);

    var server = http.createServer(app);

    io = io.listen(server);

    io.configure(function () {
        io.set('authorization', function (handshakeData, callback) {
            if (handshakeData.xdomain) {
                callback('Cross-domain connections are not allowed');
            } else {
                callback(null, true);
            }
        });
    });

    io.sockets.on('connection', function (socket) {

        socket.on('message', function (message) {
            console.log("Got message: " + message);
            var ip = socket.handshake.address.address;
            var url = message;
            io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': '***.***.***.' + ip.substring(ip.lastIndexOf('.') + 1), 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
        });

        socket.on('disconnect', function () {
            console.log("Socket disconnected");
            io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
        });

    });

    server.listen(app.get('port'), function () {
        callback(server, app);
    });

};
