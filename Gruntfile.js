module.exports = function (grunt) {
  var config = {
    jshint: {
      options: {
        ignores: ['node_modules/**', 'public/vendor/**', '**/*.min.js'],
        jshintrc: '.jshintrc'
      },
      gruntfile: 'Gruntfile.js',
      server: ['controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'app.js', 'config.js'],
      client: 'public/**/*.js'
    },
    less: {
      files: [{
        expand: true,
        cwd: 'public/less',
        src: '**/*.less',
        dest: 'public/css',
        ext: '.css'
      }]
    },
    cssmin: {
      files: [{
        expand: true,
        cwd: 'public/css',
        src: '**/*.css',
        dest: 'public/css',
        ext: '.min.css'
      }]
    },
    'node-inspector': {
      options: {
        'save-live-edit': true
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--debug'],
          cwd: __dirname,
          ignore: ['node_modules/', 'public/'],
          ext: 'js',
          watch: ['controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'app.js', 'config.js'],
          delay: 1,
          legacyWatch: true
        }
      }
    },
    watch: {
      all: {
        files: ['public/**/*', 'views/**', '!**/node_modules/**', '!public/vendor/**/*', '!**/*.min.*'],
        options: {
          livereload: 3006
        }
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'jshint:gruntfile'
      },
      scripts: {
        files: 'public/js/**/*.js',
        tasks: 'jshint:client'
      },
      server: {
        files: ['controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'app.js', 'config.js'],
        tasks: 'jshint:server'
      },
      less: {
        files: ['public/less/**/*.less'],
        tasks: ['less', 'cssmin']
      }
    },
    concurrent: {
      tasks: ['nodemon', 'node-inspector', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  };

  grunt.initConfig(config);

  // Load the tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint', 'less', 'cssmin', 'concurrent']);
};
