module.exports = function(grunt){
  'use strict';

  //liveReload
  // var path = require('path');
  // var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

  // var folderMount = function folderMount(connect, point) {
  //   return connect.static(path.resolve(point));
  // };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: 'dev/js/_src/*.js',
        tasks: ['jshint', 'uglify', 'copy', 'docco'],
        options: { debounceDelay: 1000 }
      },
      sass: {
        files: ['dev/sass/*.scss'],
        tasks: ['sass', 'cssmin', 'copy']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'dev/js/_src/background.js', 'dev/js/_src/popup.js', 'dev/js/_src/options.js']
    },
    uglify: {
      options: {
        compress: {
          properties: true
        }
      },
      common: {
        files: {
          'dev/js/background.min.js': 'dev/js/_src/background.js',
          'dev/js/popup.min.js': 'dev/js/_src/popup.js',
          'dev/js/options.min.js': 'dev/js/_src/options.js'
        }
      }
    },
    sass: {
      common: {
        options: {
          style: 'expanded'
        },
        files: {
          'dev/css/common.css': 'dev/sass/common.scss'
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          'dev/css/common-min.css': 'dev/css/common.css'
        }
      }
    },
    connect: {
      // livereload: {
      //   options: {
      //     port: 9001,
      //     middleware: function(connect) {
      //       return [lrSnippet, folderMount(connect, '.')];
      //     }
      //   }
      // }
    },
    docco: {
      debug: {
        src: ['dev/js/_src/*.js'],
        options: {
          output: 'docs/js/',
          css: 'docco_custom.css'
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['dev/css/common-min.css'], dest: 'profile/css/', filter: 'isFile'}
        , {expand: true, flatten: true, src: ['dev/img/**'], dest: 'profile/img', filter: 'isFile'}
        , {expand: true, flatten: true, src: ['dev/js/*'], dest: 'profile/js', filter: 'isFile'}
        , {expand: true, flatten: true, src: ['dev/*.html', 'dev/*.json'], dest: 'profile/', filter: 'isFile'}
        , {expand: true, flatten: true, src: ['dev/font/**'] , dest: 'profile/font', filter: 'isFile'}
        ]
      }
    }// },
    // Configuration to be run (and then tested)
    // regarde: {
    //   fred: {
    //     files: 'dev/*.html',
    //     tasks: ['livereload']
    //   }
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-regarde');
  // grunt.loadNpmTasks('grunt-contrib-livereload');
  
  // grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'cssmin', 'copy', 'watch', 'livereload-start', 'connect', 'regarde']);
  grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'cssmin', 'copy', 'watch', 'connect', 'regarde', 'docco']);
};