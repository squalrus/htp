module.exports = function( grunt ){

    // Project Configuration
    grunt.initConfig({
         pkg: grunt.file.readJSON( 'package.json' )

         // Uglify JS
        ,uglify: {
             options: { }
            ,dist: {
                files: {
                     // 'public/dest/file.js' : ['source.js']
                }
            }
        }

        // Compile LESS
        ,less: {
            development: {
                options: {
                    compress: true
                }
                ,files: {
                     // 'public/css/dest.min.css': 'source.less'
                }
            }
        }

        // jshint files/directories
        ,jshint: {
            all: ['htp/*.js', 'models/*.js','routes/*.js']
            ,options: {
                laxcomma: true,
                eqeqeq: true,
                quotmark: 'single',
                unused: true,
                strict: true,
                trailing: true
            }
        }

        // Watch Directories / Files
        ,watch: {
             files: ['htp/*.js', 'models/*.js','routes/*.js']
            ,tasks: ['default']
        }
    });

    // Load the plugins
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    // Default tasks
    grunt.registerTask( 'default', ['uglify', 'less', 'jshint'] );
};
