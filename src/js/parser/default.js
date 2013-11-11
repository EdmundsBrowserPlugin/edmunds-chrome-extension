define([
    'underscore'
], function(_) {

    return {

        /**
         * @param {String} make
         * @param {Array} models
         * @returns {Array}
         */
        buildPatterns: function(make, models) {
            var patterns = [],
                combinedModels = models.join('|'),
                separator = '[\\s\\W]*', // any whitespace or non-word character
                year = '\\d{4}', // 2014
                optionalYearAfter = '(?:' + separator + '(' + year + '))?',
                optionalYearBefore = '(?:(' + year + ')' + separator + ')?',
                model = separator + '(' + combinedModels + ')' + separator;
            patterns.push(optionalYearBefore + '(' + make + ')' + optionalYearAfter + model + optionalYearAfter);
            patterns.push(optionalYearBefore + model + optionalYearBefore + '(' + make + ')' + optionalYearAfter);
            return patterns;
        },

        /**
         * @param {String} str
         * @param {Array} patterns
         * @returns {Object}
         */
        parseVehicle: function(str, patterns) {
            var reg = new RegExp(patterns.join('|')),
                parts = str.match(reg); // => [input, year, make, year, model, year, year, model, year, make, year];
            if (!parts) {
                return null;
            }
            return {
                make: parts[2] || parts[9],
                model: parts[4] || parts[7],
                year: parts[1] || parts[3] || parts[5] || parts[6] || parts[8] || parts[10]
            };
        },

        /**
         * @param {String} str
         * @param {Object} makeModelsMap
         * @returns {Object}
         */
        parse: function(str, makeModelsMap) {
            var output = {};
            _.each(makeModelsMap, function(models, make) {
                var patterns = this.buildPatterns(make, models),
                    reg = new RegExp(patterns.join('|'), 'g'),
                    matches = str.match(reg);
                _.each(matches, function(str) {
                    var vehicle = this.parseVehicle(str, patterns);
                    if (!output[make]) {
                        output[make] = {};
                    }
                    if (!output[make][vehicle.model]) {
                        output[make][vehicle.model] = [];
                    }
                    if (vehicle.year) {
                        output[make][vehicle.model] = _.union(output[make][vehicle.model], vehicle.year).sort();
                    }
                }, this);
            }, this);
            return output;
        }

    };

});
