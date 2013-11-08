define([
    '../../../src/js/parser/default'
], function(parser) {

    module('parser/default');

    test('buildPatterns', function() {
        var actual = parser.buildPatterns('Porsche', ['Cayenne', '911']),
            expected = [
                '(?:(\\d{4})[\\s\\W]*)?(Porsche)(?:[\\s\\W]*(\\d{4}))?[\\s\\W]*(Cayenne|911)[\\s\\W]*(?:[\\s\\W]*(\\d{4}))?',
                '(?:(\\d{4})[\\s\\W]*)?[\\s\\W]*(Cayenne|911)[\\s\\W]*(?:(\\d{4})[\\s\\W]*)?(Porsche)(?:[\\s\\W]*(\\d{4}))?'
            ];
        deepEqual(actual, expected);
    });

    test('parseVehicle', function() {
        var patterns = parser.buildPatterns('Porsche', ['Cayenne']),
            expectedFull = { make: 'Porsche', model: 'Cayenne', year: '2013' },
            expectedPart = { make: 'Porsche', model: 'Cayenne', year: undefined };
        deepEqual(parser.parseVehicle('2013 Porsche Cayenne', patterns), expectedFull, 'year make model');
        deepEqual(parser.parseVehicle('2013 Cayenne Porsche', patterns), expectedFull, 'year model make');
        deepEqual(parser.parseVehicle('Porsche 2013 Cayenne', patterns), expectedFull, 'make year model');
        deepEqual(parser.parseVehicle('Porsche Cayenne 2013', patterns), expectedFull, 'make model year');
        deepEqual(parser.parseVehicle('Cayenne Porsche 2013', patterns), expectedFull, 'model make year');
        deepEqual(parser.parseVehicle('Cayenne 2013 Porsche', patterns), expectedFull, 'model year make');
        deepEqual(parser.parseVehicle('Porsche Cayenne', patterns), expectedPart, 'make model');
        deepEqual(parser.parseVehicle('Cayenne Porsche', patterns), expectedPart, 'model make');
        deepEqual(parser.parseVehicle('Porsche: Cayenne', patterns), expectedPart, 'make: model');
        equal(parser.parseVehicle('Porsche 911', patterns), null, 'not found');
    });

    test('parse', function() {
        var map = {
                Dodge: ['Avenger'],
                Porsche: ['Cayenne']
            },
            expected = {
                Porsche: {
                    Cayenne: ['2012', '2013']
                },
                Dodge: {
                    Avenger: ['2013']
                }
            };
        deepEqual(parser.parse('2013 - Porsche Cayenne Dodge 2013 Avenger Porsche Cayenne 2012', map), expected);
        deepEqual(parser.parse('Cayenne Dodge 2013', map), {});
    });

});
