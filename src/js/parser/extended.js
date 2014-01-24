define([], function() {

    /**
     * @class Parser
     * @param {Object} makeModelMap
     * @param {Object} [modelAliasMap]
     * @constructor
     *
     * @example
     * var makeModelMap = { Ford: ['F-150'] };
     * var modelAliasMap = { Ford: { 'F-150': ['F150'] } };
     *
     * var parser = new Parser(makeModelMap, modelAliasMap);
     * parser.parse('2013 Ford F150').forEach(function(vehicle) {
     *     console.log(vehicle.make);  // => Ford
     *     console.log(vehicle.model); // => F-150
     *     console.log(vehicle.year);  // => 2013
     * });
     *
     */
    function Parser(makeModelMap, modelAliasMap) {

        /**
         * @property makeModelMap
         * @type {Object}
         */
        this.makeModelMap = makeModelMap;

        /**
         * @property makes
         * @type {Array}
         */
        this.makes = Object.keys(makeModelMap);

        /**
         * @property modelAliasMap
         * @type {Object}
         */
        this.modelAliasMap = modelAliasMap;

        /**
         * @property patternsMap
         * @type {Object}
         */
        this.patternsMap = {};

        // build patterns
        this.makes.forEach(function(make) {
            var models = makeModelMap[make];
            if (!this.patternsMap[make]) {
                this.patternsMap[make] = this.buildPattern(make, models, modelAliasMap[make]);
            }
        }, this);

    }

    Parser.prototype = {

        /**
         * @method buildPattern
         * @param {String} make
         * @param {Array} models
         * @param {Object} aliasMap
         * @returns {String}
         */
        buildPattern: function(make, models, aliasMap) {
            var patterns = [],
                separator = '[\\s\\W]*', // any whitespace or non-word character
                wordBoundary = '\\b', // word boundary
                year = '\\d{4}', // 2014
                optionalYearAfter = '(?:' + separator + '(' + year + '))?',
                optionalYearBefore = '(?:(' + year + ')' + separator + ')?',
                model;
            // adding model aliases
            if (aliasMap) {
                Object.keys(aliasMap).forEach(function(model) {
                    models = models.concat(aliasMap[model]);
                });
            }
            // sort models
            // models with suffix should be found first,
            // for example "Ford F-150 Heritage" should be found instead of "Ford F-150"
            models.sort().reverse();
            // define model group
            model = separator + '(' + models.join('|') + ')' + separator;
            // add patterns
            patterns.push(wordBoundary + optionalYearBefore + '(' + make + ')' + optionalYearAfter + model + optionalYearAfter + wordBoundary);
            patterns.push(wordBoundary + optionalYearBefore + model + optionalYearBefore + '(' + make + ')' + optionalYearAfter + wordBoundary);
            return patterns.join('|');
        },

        /**
         * @method parse
         * @param {String} str
         * @returns {Array}
         */
        parse: function(str) {
            var vehicles = [],
                patterns = [],
                reg, matches;
            // collect all patterns into one
            this.makes.forEach(function(make) {
                patterns.push(this.patternsMap[make]);
            }, this);
            // parse
            reg = new RegExp(patterns.join('|'), 'gi');
            matches = str.match(reg);
            // parse vehicles one by one
            if (matches !== null) {
                matches.forEach(function(matchedStr) {
                    var vehicle = this.parseVehicle(matchedStr);
                    if (vehicle !== null) {
                        vehicles.push(vehicle);
                    }
                }, this);
            }
            return vehicles;
        },

        /**
         * @method parseVehicle
         * @param {String} str
         * @returns {Object}
         */
        parseVehicle: function(str) {
            var vehicle = {},
                foundMake, foundModel, foundYear;

            this.makes.some(function(make) {
                var pattern = this.patternsMap[make],
                    reg = new RegExp(pattern, 'i'),
                    parts = str.match(reg); // [input, year, make, year, model, year, year, model, year, make, year]
                if (parts !== null) {
                    foundMake = make;
                    foundModel = this.getModelName(make, parts[4] || parts[7]);
                    foundYear = this.getYear(parts[1] || parts[3] || parts[5] || parts[6] || parts[8] || parts[10]);
                }
                return parts !== null;
            }, this);

            if (!foundMake || !foundModel) {
                return null;
            }

            vehicle.make = foundMake;
            vehicle.model = foundModel;
            if (foundYear) {
                vehicle.year = foundYear;
            }
            return vehicle;
        },

        /**
         * @method parseSome
         * @param {Array} strings
         * @returns {Array}
         */
        parseSome: function(strings) {
            var result = [];
            if (!Array.isArray(strings)) {
                return result;
            }
            strings.some(function(str) {
                var vehicles = this.parse(str);
                if (vehicles.length !== 0) {
                    result.push(vehicles);
                    return true;
                }
            }, this);
            return result;
        },

        /**
         * @method parseEach
         * @param {Array} strings
         * @returns {Array}
         */
        parseEach: function(strings) {
            var result = [];
            if (!Array.isArray(strings)) {
                return result;
            }
            strings.forEach(function(str) {
                var vehicles = this.parse(str);
                result.push(vehicles);
            }, this);
            return result;
        },

        /**
         * @method getModelName
         * @param {String} foundMake
         * @param {String} foundModel
         * @returns {String|undefined}
         */
        getModelName: function(foundMake, foundModel) {
            var result;
            // try to find in make-model map
            this.makeModelMap[foundMake].some(function(model) {
                var isEqual = foundModel.toLowerCase() === model.toLowerCase();
                if (isEqual) {
                    result = model;
                }
                return isEqual;
            });
            // try to find in alias map
            if (!result) {
                if (this.modelAliasMap && this.modelAliasMap[foundMake]) {
                    Object.keys(this.modelAliasMap[foundMake]).some(function(model) {
                        var aliases = this.modelAliasMap[foundMake][model];
                        return aliases.some(function(alias) {
                            if (alias.toLowerCase() === foundModel.toLowerCase()) {
                                result = model;
                                return true;
                            }
                        });
                    }, this);
                }
            }
            return result;
        },

        /**
         * @method getYear
         * @param {String} foundYear
         * @returns {Number|undefined}
         */
        getYear: function(foundYear) {
            var year = parseInt(foundYear, 10);
            if (year && year > 1990) {
                return year;
            }
            return /* undefined */;
        }

    };

    return Parser;

});
