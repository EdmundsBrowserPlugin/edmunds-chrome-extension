(function() {

    var testModules = [
        'unit/parser/default'
    ];

    QUnit.config.autostart = false;

    require.config({

        paths: {
            jquery: '../src/lib/jquery/jquery',
            underscore: '../src/lib/underscore/underscore'
        },

        shim: {
            underscore: {
                exports: '_'
            }
        }

    });

    require(testModules, QUnit.start);

}());
