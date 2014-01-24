define([
    '../../../src/js/parser/extended',
    'text!../../../src/data/make-models.json',
    'text!../../../src/data/model-alias-map.json'
], function(Parser, makeModelMapJSON, modelAliasMapJSON) {

    var makeModelMap = JSON.parse(makeModelMapJSON),
        modelAliasMap = JSON.parse(modelAliasMapJSON),
        parser;

    module('parser/extended', {
        setup: function() {
            parser = new Parser(makeModelMap, modelAliasMap);
        }
    });

    test('parseVehicle', function() {
        var expectedFull = { make: 'Ford', model: 'F-150', year: 2013 },
            expectedPartial = { make: 'Ford', model: 'F-150' },
            expectedWithModelSuffix = { make: 'Ford', model: 'F-150 Heritage', year: 2013 },
            tests = [
                { str: '2013 Ford F-150', expected: expectedFull, message: 'year make model' },
                { str: '2013 F-150 Ford', expected: expectedFull, message: 'year model make' },
                { str: 'Ford F-150 2013', expected: expectedFull, message: 'make model year' },
                { str: 'Ford 2013 F-150', expected: expectedFull, message: 'make year model' },
                { str: 'F-150 2013 Ford', expected: expectedFull, message: 'model year make' },
                { str: 'F-150 Ford 2013', expected: expectedFull, message: 'model make year' },
                { str: '2013 ford f-150', expected: expectedFull, message: 'case-insensitive' },
                { str: '2013 Ford F150 ', expected: expectedFull, message: 'model alias' },
                { str: 'Ford F-150', expected: expectedPartial, message: 'make model without year' },
                { str: 'F-150 Ford', expected: expectedPartial, message: 'model make without year' },
                { str: '2013 Ford F-150 Heritage', expected: expectedWithModelSuffix, message: 'model with suffix should be found first' },
                { str: 'http://edmunds.com/ford/f-150/2013', expected: expectedFull, message: 'url format example' },
                { str: 'Ford / F-150 / 2013', expected: expectedFull, message: 'breadcrumb example' },
                { str: '2013 - Ford : F-150', expected: expectedFull, message: 'various seprators' },
                { str: 'Ford : F-150 4WD SuperCre', expected: expectedPartial, message: 'ebay search result format' },
                { str: 'Porsche 912', expected: null, message: 'should be null' },
                // preventing matches in case when the model name matches with the beginning of another word
                { str: 'BMW Mazda', expected: null, message: 'should be null' }
            ];
        // how many assertions are expected to run
        expect(tests.length);
        // run tests
        tests.forEach(function(test) {
            var result = parser.parseVehicle(test.str);
            deepEqual(result, test.expected, test.message);
        });
    });

    test('parse', function() {
        var expected1 = [
                { make: 'Porsche', model: 'Cayenne', year: 2013 },
                { make: 'Dodge', model: 'Avenger', year: 2013 },
                { make: 'Porsche', model: 'Panamera' }
            ],
            expected2 = [ /* empty array */ ],
            tests = [
                { str: '2013 - Porsche Cayenne Dodge 2013 Avenger Porsche Panamera', expected: expected1, message: '' },
                { str: 'Cayenne Dodge 2013', expected: expected2, message: '' }
            ];
        // how many assertions are expected to run
        expect(tests.length);
        // run tests
        tests.forEach(function(test) {
            var result = parser.parse(test.str, makeModelMap);
            deepEqual(result, test.expected, test.message);
        });
    });

});
