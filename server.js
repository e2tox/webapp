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

var app = require('./appServer/controllers/application');

//noinspection JSUnresolvedVariable
app.createServer({
    version: '0.0.1',
    port: process.env.PORT || 5000,
    authCookie: 'auth',
    cookieSalt: ':salt',
    rootDir: __dirname + '/public',
    cacheDir: __dirname + '/cache',
    scriptDir: __dirname + '/app/scripts',
    lessDir: __dirname + '/app/styles',
    viewsDir: __dirname + '/appServer/views',
    layoutsDir: __dirname + '/appServer/views/layouts',
    defaultLayout: 'site',
    partiesDir: __dirname + '/appServer/views/partials',
    silent: 'test' == process.env.NODE_ENV,
    logger: '832ce42c-6e68-49f8-9c38-7acf8eb3362a'
},
function(http, app) {
    console.log("Express server listening on port " + app.get('port'));
});
