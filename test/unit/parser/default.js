define([
    '../../../src/js/parser/default'
], function(parser) {

    module('parser/default');

    test('test', function() {
        ok(parser.parse, 'defined');
    });

});
