/* global module */
module.exports = function(grunt) {
    'use strict';

    // config
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        dir: {
            build: 'dist'
        },

        // https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            build: ['<%= dir.build %>']
        },

        // https://github.com/gruntjs/grunt-contrib-copy
        copy: {
            build: {
                files: [
                    { expand: true, cwd: 'src', src: ['_locales/**', 'data/**', 'fonts/**', 'img/**', '*.html', '*.json', 'lib/**'], dest: '<%= dir.build %>' }
                ]
            }
        },

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
            },
            tasks: {
                src: ['tasks/**/*.js']
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
                    'src/css/content.css': 'less/content.less',
                    'src/css/options.css': 'less/options.less'
                }
            },
            build: {
                files: {
                    '<%= dir.build %>/css/content.css': 'less/content.less',
                    '<%= dir.build %>/css/options.css': 'less/options.less'
                },
                options: {
                    compress: true
                }
            }
        },

        // https://github.com/gruntjs/grunt-contrib-qunit
        qunit: {
            all: ['test/*.html']
        },

        // https://github.com/gruntjs/grunt-contrib-requirejs
        requirejs: {
            build: {
                options: {
                    baseUrl: 'src/js/',
                    dir: '<%= dir.build %>/js/'
                }
            }
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadTasks('tasks');

    // tasks
    grunt.registerTask('test', [
        'jshint',
        'jsonlint',
        'qunit'
    ]);

    grunt.registerTask('build', [
        'test',
        'clean:build',
        'copy:build',
        'requirejs:build',
        'less:build'
    ]);

    grunt.registerTask('default', 'watch');

};
