(function() {

    var testModules = [
        'unit/parser/default'
    ];

    QUnit.config.autostart = false;

    require.config({

        paths: {
        },

        shim: {
        }

    });

    require(testModules, QUnit.start);

}());
