require.config({
    paths: {
        jquery: 'vendor/jquery-1.10.1'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});


require(['app'], function (app, $) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
});
