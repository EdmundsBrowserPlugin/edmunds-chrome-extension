/* global module */
module.exports = function(grunt) {
    'use strict';

    // config
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            dev: {
                src: ['src/js/**/*.js']
            },
            test: {
                src: ['test/**/*.js'],
                options: {
                    jshintrc: 'test/.jshintrc'
                }
            }
        },

        // https://github.com/brandonramirez/grunt-jsonlint
        jsonlint: {
            pkg: {
                src: ['package.json']
            },
            bower: {
                src: ['bower.json']
            },
            jshintrc: {
                src: ['.jshintrc']
            },
            manifest: {
                src: ['src/manifest.json']
            },
            locales: {
                src: ['src/_locales/**/*.json']
            }
        },

        // https://github.com/gruntjs/grunt-contrib-less
        less: {
            dev: {
                files: {
                    'src/css/app.css': 'less/app.less'
                }
            }
        },

        // https://github.com/gruntjs/grunt-contrib-qunit
        qunit: {
            all: ['test/*.html']
        },

        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            // js files
            grunt: {
                files: ['<%= jshint.grunt.src %>'],
                tasks: ['jshint:grunt']
            },
            dev: {
                files: ['<%= jshint.dev.src %>'],
                tasks: ['jshint:dev']
            },
            test: {
                files: ['<%= jshint.test.src %>'],
                tasks: ['jshint:test']
            },
            // json files
            pkg: {
                files: ['<%= jsonlint.pkg.src %>'],
                tasks: ['jsonlint:pkg']
            },
            bower: {
                files: ['<%= jsonlint.bower.src %>'],
                tasks: ['jsonlint:bower']
            },
            jshintrc: {
                files: ['<%= jsonlint.jshintrc.src %>'],
                tasks: ['jsonlint:jshintrc']
            },
            manifest: {
                files: ['<%= jsonlint.manifest.src %>'],
                tasks: ['jsonlint:manifest']
            },
            locales: {
                files: ['<%= jsonlint.locales.src %>'],
                tasks: ['jsonlint:locales']
            },
            // less
            less: {
                files: 'less/**/*.less',
                tasks: ['less']
            }
        }

    });

    // plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsonlint');

    // tasks
    grunt.registerTask('test', [
        'jshint',
        'jsonlint',
        'qunit'
    ]);

    grunt.registerTask('default', 'watch');

};
