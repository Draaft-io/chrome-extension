module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                src: 'tmp/code.js',
                dest: 'dist/draaft-bookmark.min.js'
            }
        },
        cssmin: {
            dist: {
                files: {
                    'tmp/style.css': ['lib/style.css']
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('inlineCss', function() {
        grunt.file.write('tmp/code.js', grunt.file.read('lib/content.js', 'utf8').replace("{{CSS}}", grunt.file.read('tmp/style.css')));
    });

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', [
        'cssmin',
        'inlineCss',
        'uglify'
    ])

};
