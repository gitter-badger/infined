module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      all:   ['www/public'],
      images:   ['www/public/images/'],
      libraries:   ['www/public/libraries/'],
      scripts:    ['www/public/javascripts/'],
      styles:   ['www/public/stylessheets/'],
      types: ['www/public/types/'],
      views:  ['www/public/index.html']
    },
    
    'index-prettyinclude': {
      dist: {
        options: {},
        src: 'www/views/index.html',
        dest: 'www/views/inde.x.html'
      }
    },
    
    'index-prettyprinter': {
      single: {
        src: 'www/views/inde.x.html',
        dest: 'www/index.html'
      }
    },
    
    'public': {
      main: {
        files: [
          {
            expand: true,
            src: ['www/libraries/**', 'www/images/**', 'www/services/**'],
            cwd: 'www/',
            dest: 'public/'
          }
        ]
      },
      libraries: {
        files: [
          {
            expand: true,
            src: ['libraries/**'],
            cwd: 'www/',
            dest: 'public/libraries/'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            src: ['images/**'],
            cwd: 'www/',
            dest: 'public/images/'
          }
        ]
      }
    },
    
    types: {
      dist: {
        files: [{
          expand: true,
          cwd: 'www/',
          src: ['types/angular/**', 'types/jquery/**'],
          dest: 'www/public/javascripts',
          ext: '.ts'
        }] 
      }  
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'www/sass/',
          src: ['*.scss'],
          dest: 'www/public/stylesheets',
          ext: '.css'
        }]
      }
    },
    
    typescript: {
      base: {
        src: ['www/types/**/*.ts'],
        dest: 'www/public/javascripts/',
        options: {
          module: 'amd', //or commonjs 
          target: 'es5', //or es3 
          basePath: 'src/ts/',
          declaration: false,
          sourceMap: false
        }
      }
    },
    
    watch: {
      options: {
        livereload: true
      },
      views: {
        files: ['www/index.html', 'www/public/**'],
        tasks: ['clean:views', 'html-prettyinclude', 'html-prettyprinter']
      },
      sass: {
        files: ['www/sass/**'],
        tasks: ['clean:css', 'sass']
      },
      libraries: {
        files: ['www/libraries/**'],
        tasks: ['clean:lib', 'copy:libraries']
      },
      images: {
        files: ['www/images/**'],
        tasks: ['clean:gfx', 'copy:images']
      },
      typescript: {
        files: ['www/types/**'],
        tasks: ['clean:js', 'typescript']
      }
    }
    
  });

  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-html-prettyprinter');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-typescript');
  
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('compile', ['clean:all', 'index-prettyinclude', 'index-prettyprinter', 'public', 'sass', 'typescript']);

};