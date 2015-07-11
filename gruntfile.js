module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
/*      all: ['www/'],
      gfx: ['www/gfx/'],
      lib: ['www/lib/'],
      js: ['www/js/'],
      css: ['www/css/'],
      typed: ['www/typed/'],
      html: ['www/index.html']*/
    },
    
    'html-prettyinclude': {
      dist: {
        options: {},
        src: 'www/views/index.html',
        dest: 'www/views/inde.x.html'
      }
    },
    
    'html-prettyprinter': {
      single: {
        src: 'www/views/inde.x.html',
        dest: 'www/index.html'
      }
    },
    
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['lib/**', 'gfx/**', 'ws/**'],
            cwd: 'src/',
            dest: 'www/'
          }
        ]
      },
      lib: {
        files: [
          {
            expand: true,
            src: ['lib/**'],
            cwd: 'src/',
            dest: 'www/'
          }
        ]
      },
      gfx: {
        files: [
          {
            expand: true,
            src: ['gfx/**'],
            cwd: 'src/',
            dest: 'www/'
          }
        ]
      }
    },
    
    _ts: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/ts/',
          src: ['ts/angular/**', 'ts/jquery/**'],
          dest: 'www/js',
          ext: '.ts'
        }] 
      }  
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/sass/',
          src: ['*.scss'],
          dest: 'www/css',
          ext: '.css'
        }]
      }
    },
    
    typescript: {
      base: {
        src: ['src/ts/**/*.ts'],
        dest: 'www/js/',
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
      html: {
        files: ['src/index.dev.html', 'src/html/**'],
        tasks: ['clean:html', 'includereplace', 'html-prettyprinter']
      },
      sass: {
        files: ['src/sass/**'],
        tasks: ['clean:css', 'sass']
      },
      lib: {
        files: ['lib/**'],
        tasks: ['clean:lib', 'copy:lib']
      },
      gfx: {
        files: ['src/gfx/**'],
        tasks: ['clean:gfx', 'copy:gfx']
      },
      typescript: {
        files: ['src/ts/**'],
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
  grunt.registerTask('compile', ['clean:all', 'html-prettyinclude', 'html-prettyprinter', 'copy', 'sass', 'typescript']);
  // TODO build task bauen für live deployment -> Achtung livereload.js dafür auf index.dev.html entfernen, sonst wie compile

};