(function() {

    var testModules = [
        'unit/parser/default',
        'unit/parser/extended'
    ];

    QUnit.config.autostart = false;

    require.config({

        paths: {
            text: '../src/lib/requirejs/text'
        },

        shim: {
        }

    });

    require(testModules, QUnit.start);

}());
