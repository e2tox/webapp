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

exports.register = function(app) {

    // 404 page
    app.use(function(req, res, next) {
        res.status(404);
        if (req.accepts('html')) {
            res.render('404', { url: req.url, layout: false });
        }
        else if (req.accepts('json')) {
            res.send({ error: 'Page Not found' });
        }
        else {
            res.type('txt').send('Page Not found');
        }
    });

    // index
    app.get('/', function (req, res) {
        res.render('index', { name: 'I am e2tox' });
    });

    var wine = require('../controllers/wines');

    app.get('/wines', wine.findAll);
    app.get('/wines/:id', wine.findById);
    app.post('/wines', wine.addWine);
    app.put('/wines/:id', wine.updateWine);
    app.delete('/wines/:id', wine.deleteWine);

};