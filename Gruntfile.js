module.exports = function(grunt) {
    grunt.option('color', true);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    watch: ['index.js', 'modules/**/*.js'],
                    ext: 'js',
                    ignore: ['node_modules/**', 'modules/webserver/public/**'],
                    env: {
                        NODE_ENV: 'dev'
                    },
                    nodeArgs: ['--debug'],
                    cwd: __dirname,
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    },
                }
            }
        },
        watch: {
            files: ['*.js', '**/*.js', '*.json', '!node_modules/**', '!.git/**', '!modules/webserver/public/**', '!bower_components/**', '!test/**', 'nodemon.json'],
            tasks: ['jshint']
        },
        jshint: {
            all: ['**/*.js', '**/*.json', '*.json', '!node_modules/**', '!modules/webserver/public/**', '!bower_components/**'],
            options: {
                esversion: 6
            }
        },
        concurrent: {
            options: {
                "logConcurrentOutput": true
            },
            dev: {
                tasks: ['nodemon', 'watch']
            },
            debug: {
                tasks: ['nodemon', 'watch']
            }
        },
        simplemocha: {
            options: {
                globals: [], // Add whitelisted globals here
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },
            all: { src: ['test/**/*.js'] }
        }
    });

    // Load plugins/tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Grunt task(s).
    grunt.registerTask('default', ['jshint', 'nodemon:dev']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['simplemocha']);
};