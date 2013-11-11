/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50 */
/*global require:false, module:false*/
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    'use strict';
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    'use strict';
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var location = {
        app: 'site',
        dist: 'dist',
        staticPath: 'static'
    };
    grunt.initConfig({
        location: location,
        watch: {
            css: {
                files: ['<%= location.app %>/<%= location.staticPath %>/css/*'],
                options: { livereload: true }
            },
            self: {
                files: ['Gruntfile.js'],
                tasks: ['build'],
                options: {livereload: true}
            },
            sass: {
                files: ['src/sass/**'],
                tasks: ['compass']
            },
            json: {
                files: ['src/json/**'],
                tasks: ['build']
            },
            ejs: {
                files: ['src/ejs/**'],
                tasks: ['ejs_static']
            },
            html: {
                files: ['<%= location.app %>/**/*.html'],
                options: {livereload: true}
            },
            static: {
                files: ['src/images/**', 'src/fonts/**', 'src/resources/**'],
                tasks: ['copy', 'compass'],
                options: {livereload: true}
            }
        },
        clean: {
            all: ['site/**/*']
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, location.app)
                        ];
                    }
                }
            }
        },
        copy: {
            all: {
                files: [
                    {
                        expand:true,
                        cwd:'src/',
                        src:['images/**'],
                        dest:'<%= location.app %>/<%= location.staticPath %>/'
                    }
                ]
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        ejs_static: {
            optimize: {
                options: {
                    dest: 'site/',
                    path_to_data: 'src/json/site.json',
                    index_page: 'index',
                    parent_dirs: false
                }
            }
        },
        compass: {
            all: {
                options: {
                    httpPath: '/',
                    cssDir: "site/<%= location.staticPath %>/css",
                    sassDir: "src/sass",
                    imagesDir: "src/images",
                    javascriptsDir: "site/<%= location.staticPath %>/js",
                    fontsDir: "src/fonts",
                    outputStyle: "compressed",
                    lineComments: false,
                    colorOutput: false
                }
            }
        }
    });
    grunt.registerTask('build_html', ['clean', 'ejs_static']);
    grunt.registerTask('build', ['build_html','compass','copy']);
    grunt.registerTask('server', ['build','connect:livereload','watch']);
};
