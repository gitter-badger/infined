module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      all:   ['www/public'],
      index:  ['www/public/index.html'],
      images:   ['www/public/images/'],
      javascripts:    ['www/public/javascripts/'],
      libraries:   ['www/public/libraries/'],
      service:   ['www/public/service/'],
      stylesheets:   ['www/public/stylesheets/'],
      typescripts: ['www/public/typescripts/']
    },
    
    includereplace: {
      dist: {
        options: {},
        src: 'www/views/index.html',
        dest: 'www/views/inde.x.html'
      }
    },
    
    'html-prettyprinter': {
      single: {
        src: 'www/views/inde.x.html',
        dest: 'www/public/index.html'
      }
    },
    
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['www/images/**', 'www/javascripts/**', 'www/stylesheets/**', 'www/libraries/**', 'www/service/**'],
            cwd: 'www/',
            dest: 'public/'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            src: ['images/**'],
            cwd: 'www/',
            dest: 'www/public/'
          }
        ]
      },
      javascripts: {
        files: [
          {
            expand: true,
            src: ['javascripts/**'],
            cwd: 'www/',
            dest: 'www/public/'
          }
        ]
      },
      libraries: {
        files: [
          {
            expand: true,
            src: ['libraries/**'],
            cwd: 'www/',
            dest: 'www/public/'
          }
        ]
      },
      service: {
        files: [
          {
            expand: true,
            src: ['service/**'],
            cwd: 'www/',
            dest: 'www/public/'
          }
        ]
      },
      stylesheets: {
        files: [
          {
            expand: true,
            src: ['stylesheets/**'],
            cwd: 'www/',
            dest: 'www/public/'
          }
        ]
      }

    },

/*    
    typings: {
      dist: {
        files: [{
          expand: true,
          cwd: 'www/',
          src: ['typings/angular/**', 'typings/jquery/**'],
          dest: 'www/typings',
          ext: '.ts'
        }] 
      }  
    },
*/

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
        src: ['www/typescripts/**/*.ts'],
        dest: 'www/public/javascripts/',
        options: {
          module: 'amd', //or commonjs 
          target: 'es5', //or es3 
          rootDir: 'www/typescripts/',
          declaration: false,
          sourceMap: false
        }
      }
    },
    
    watch: {
      options: {
        livereload: true
      },
      index: {
        files: ['www/index.html', 'www/public/**'],
        tasks: ['clean:index', 'includereplace', 'html-prettyprinter']
      },
      sass: {
        files: ['www/sass/**'],
        tasks: ['clean:sass', 'sass']
      },
      stylesheets: {
        files: ['www/stylesheets/**'],
        tasks: ['clean:stylesheets', 'stylesheets']
      },
      libraries: {
        files: ['www/libraries/**'],
        tasks: ['clean:libraries', 'copy:libraries']
      },
      images: {
        files: ['www/images/**'],
        tasks: ['clean:images', 'copy:images']
      },
      javascripts: {
        files: ['www/javascripts/**'],
        tasks: ['clean:javascripts', 'javascripts']
      },
      service: {
        files: ['www/service/**'],
        tasks: ['clean:service', 'service']
      },
      typescripts: {
        files: ['www/typescripts/**'],
        tasks: ['clean:typescripts', 'typescript']
      }
    }
    
  });

  grunt.loadNpmTasks('grunt-typescript');
  
  grunt.loadNpmTasks('grunt-html-prettyprinter');
  
  grunt.loadNpmTasks('grunt-include-replace');
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-clean');

  
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('compile', ['clean:all', 'includereplace', 'html-prettyprinter', 'copy', 'sass', 'typescript']);

};