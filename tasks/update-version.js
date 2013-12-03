/* global module */
module.exports = function(grunt) {

    var readJSON = grunt.file.readJSON,
        paths = [
            'src/manifest.json',
            'package.json',
            'bower.json'
        ];

    function writeJSON(path, obj) {
        var str = JSON.stringify(obj, null, '  ') + '\n';
        grunt.log.write('Updating ' + path + ' ...');
        grunt.file.write(path, str);
        grunt.log.ok();
    }

    /**
     * Updates the version property in the JSON files
     * @example
     *   grunt update-version:1.2.3
     */
    grunt.registerTask('update-version', 'Updates the version', function(version) {
        if (!version) {
            grunt.fail.fatal('Please specify a version. e.g. grunt update-version:0.1.2');
        }
        paths.forEach(function(path) {
            var obj = readJSON(path);
            obj.version = version;
            writeJSON(path, obj);
        });
    });

};
