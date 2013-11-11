(function() {

    var testModules = [
        'unit/parser/default'
    ];

    QUnit.config.autostart = false;

    require.config({

        paths: {
            jquery: '../src/js/lib/jquery/jquery',
            underscore: '../src/js/lib/underscore/underscore'
        },

        shim: {
            underscore: {
                exports: '_'
            }
        }

    });

    require(testModules, QUnit.start);

}());
