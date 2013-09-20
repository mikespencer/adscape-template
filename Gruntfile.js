var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var cheerio = require('cheerio');
var sys = require('sys');
var exec = require('child_process').exec;

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  //display build times:
  require('time-grunt')(grunt);

  var yeomanConfig = {
    app: 'src',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      temp: {
        files: [{
          dot: true,
          src: [
            '.tmp'
          ]
        }]
      }
    },
    useminPrepare: {
      options: {
        dest: '<%= yeoman.dist %>'
      },
      html: '<%= yeoman.app %>/index.html'
    },
    usemin: {
      options: {
        dirs: ['<%= yeoman.dist %>']
      },
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/css/{,*/}*.css']
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'img/{,*/}*.{webp,gif}',
            'css/fonts/*',
            'js/main.js',
            'js/lib/Modernizr.min.js'
          ]
        }]
      }
    },
    concat: {
      dist: {
        options: {
          banner: '<!-- AD ID: %eaid! -->' +
            '<!-- adscape-template -->' +
            '\n\n',
          process: {
            data: {
              urls: {
                css: 'http://css.washingtonpost.com/wp-srv/ad/public/adscape-template/dist/css/style.min.css',
                js: 'http://js.washingtonpost.com/wp-srv/ad/public/adscape-template/dist/js/main.min.js'
              },
              adid: parseInt('%eaid!', 10) || false,
              imageURL: '[%BackgroundImage%]',
              clickTracker: '%%CLICK_URL_UNESC%%',
              clickTrackerEsc: '%%CLICK_URL_ESC%%',
              clickTag: '%%DEST_URL%%',
              colHeight: '[%CollapsedHeight%]px',
              expHeight: '[%ExpandedHeight%]px',
              skinTopMargin: '[%SkinTopMargin%]px',
              timeOpen: '[%AutoTimeOpen%]',
              auto: '[%Auto%]',
              bodyBgColor: '[%BodyBackgroundColor%]',

              autoExpDelay: '[%AutoExpandDelay%]',
              expandLanguage: '[%ExpandLanguage%]',
              closeLanguage: '[%CloseLanguage%]',
              fullWidthColPushdown: '[%FullWidthCollapsedPushdown%]',

              collapsedMessageHTML: '[%CollapsedMessageHTML%]',
              collapsedMessageCSS: '[%CollapsedMessageCSS%]',
              expandedMessageHTML: '[%ExpandedMessageHTML%]',
              expandedMessageCSS: '[%ExpandedMessageCSS%]',

              impressionPixels: ['[%3rdPartyImpressionPixel%]'],
              trackExpClick: '[%3rdPartyExpandClickPixel%]',
              trackCloseClick: '[%3rdPartyCollapseClickPixel%]',

              pageContainer: '[%PageContainerSelector%]',
              pushdownContainer: '[%PushdownContainerSelector%]',
              pageStyleOverrides: '[%PageStyleOverrides%]',
              animSpeed: '[%AnimationSpeedJS%]',
              JSOverrides: '[%JSOverrides%]'
            }
          }
        },
        files: {
          '<%= yeoman.dist %>/dfp.html': '<%= yeoman.dist %>/index.html'
        }
      },
      dev: {
        options: {
          banner: '<!DOCTYPE html>\n<html>\n<head>\n  <title><%= pkg.name %>: Test Page</title>\n</head>\n<body>\n\n',
          footer: '\n\n</body>\n</html>',
          process: {
            data: {
              urls: {
                css: 'css/style.min.css',
                js: 'js/main.min.js'
              },
              imageURL: 'img/bg.jpg',
              clickTracker: '',
              clickTrackerEsc: '',
              clickTag: 'http://www.example.com',
              colHeight: '60px',
              expHeight: '468px',
              skinTopMargin: '30px',
              timeOpen: '7000',
              auto: true,
              bodyBgColor: '#ffffff',

              autoExpDelay: 1000,
              expandLanguage: 'Click to Expand',
              closeLanguage: 'Close [x]',
              fullWidthColPushdown: true,

              collapsedMessageHTML: 'Collapsed Message Here',
              collapsedMessageCSS:
                "textShadow: '2px 2px #000'," +
                "position: 'absolute'," +
                "bottom: '5px'," +
                "left: '5px'," +
                "fontSize: '36px'," +
                "color: '#fff'," +
                "lineHeight: '1'",

              expandedMessageHTML: 'Expanded Message Here',
              expandedMessageCSS:
                "textShadow: '2px 2px #000'," +
                "position: 'absolute'," +
                "bottom: '5px'," +
                "left: '5px'," +
                "fontSize: '36px'," +
                "color: '#fff'," +
                "lineHeight: '1'",

              impressionPixels: '',
              trackExpClick: '',
              trackCloseClick: '',

              pageContainer: '#shell',
              pushdownContainer: '#slug_pushdown',
              pageStyleOverrides: '',
              animSpeed: 500,
              JSOverrides: ''
            }
          }
        },
        files: {
          '<%= yeoman.dist %>/index.html': '<%= yeoman.dist %>/index.html'
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          //removeComments: true
          //collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    rev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      dist: {
        files: [{
          src: [
            '<%= yeoman.dist %>/js/main.min.js',
            '<%= yeoman.dist %>/css/style.min.css',
            'img/**/*.{jpg,jpeg,gif,png}',
            'fonts/**/*.{eot,svg,ttf,woff}'
          ]
        }]
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= yeoman.dist %>/'
        }]
      }
    },
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['<%= yeoman.app %>/js/*.js']
      }
    },
    uglify: {
      options: {
        banner: '/* Built <%= grunt.template.today("mm-dd-yyyy") %> */\n',
        sourceMap: '<%= yeoman.dist %>/js/main.map.js'
        //sourceMapRoot: '<%= yeoman.dist %>/',
        //sourceMappingURL: 'main.map.js'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/js/main.min.js': ['<%= yeoman.app %>/js/lib/Modernizr.min.js', '<%= yeoman.app %>/js/main.js']
        }
      }
    },
    cssmin: {
      options: {
        banner: '/* Built <%= grunt.template.today("mm-dd-yyyy") %> */',
        report: 'gzip'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/css/style.min.css': ['<%= yeoman.app %>/css/style.css']
        }
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },
    concurrent: {
      dist: [
        'jshint:src',
        'compass:dist',
        'imagemin:dist'
        //'uglify',
        //'cssmin',
        //'htmlmin'
      ]
    },
    watch: {
      options: {
        nospawn: true
      },
      build_html: {
        files: ['<%= yeoman.app %>/**/*.html'],
        tasks: ['build']
      },
      build_js: {
        files: ['<%= yeoman.app %>/js/**/*.js'],
        tasks: ['build']
      },
      build_css: {
        files: ['<%= yeoman.app %>/sass/**/*.sass'],
        tasks: ['build']
      },
      tests: {
        files: ['test/**/*'],
        tasks: ['test']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.dist %>/**/*'
        ]
      }
    },
    connect: {
      options: {
        port: 5000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, './dist')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    qunit: {
      index: ['test/index.html']
    },
    absolute: {
      dist: {
        src: '<%= yeoman.dist %>/dfp.html',
        path: 'wp-srv/ad/public/adscape-template/dist',
        www: 'http://www.washingtonpost.com',
        css: 'http://css.washingtonpost.com',
        img: 'http://img.wpdigital.net',
        js: 'http://js.washingtonpost.com'
      }
    }
  });

  grunt.registerMultiTask('absolute', 'Make URLs absolute', function(){

    console.log('Transforming relative URL\'s --> absolute URL\'s for: ' + this.data.src);

    var data = this.data;
    var src = data.src;
    var defaultBase = 'http://www.washingtonpost.com';
    var path = data.path.replace(/^\//, '').replace(/\/$/, '');
    var urls = {
      www: (data.www ? data.www.replace(/\/$/, '') : defaultBase) + '/' + path,
      img: (data.img ? data.img.replace(/\/$/, '') : defaultBase) + '/' + path,
      js: (data.js ? data.js.replace(/\/$/, '') : defaultBase) + '/' + path,
      css: (data.css ? data.css.replace(/\/$/, '') : defaultBase) + '/' + path
    };

    var $ = cheerio.load(grunt.file.read(data.src));


    $('script').each(function(){
      var src = $(this).attr('src'), newSrc;
      if(src && !/^http|^\/\/\:/.test(src)){
        newSrc = urls.js + '/' + src.replace(/^\//, '');
        $(this).attr('src', newSrc);
      }
    });

    $('img').each(function(){
      var src = $(this).attr('src'), newSrc;
      if(src && !/^http|^\/\/\:/.test(src)){
        newSrc = urls.img + '/' + src.replace(/^\//, '');
        $(this).attr('src', newSrc);
      }
    });

    $('link').each(function(){
      var href = $(this).attr('href'), newHref;
      if(href && !/^http|^\/\/\:/.test(href)){
        newHref = urls.css + '/' + href.replace(/^\//, '');
        $(this).attr('href', newHref);
      }
    });

    //remove testing elements:
    $('.dev-element').remove();

    grunt.file.write(data.src, $.html());
  });

  grunt.registerTask('default', ['build', 'test', 'server']);

  grunt.registerTask('test', ['qunit']);

  grunt.registerTask('build', [
    'jshint:src',
    'clean:dist',
    'concurrent:dist',
    //'useminPrepare',
    //'concat',
    'uglify',
    'cssmin',
    'htmlmin',
    'copy:dist',
    //'imagemin',
    //'rev:dist',
    //'usemin',
    'concat:dist',
    'concat:dev',
    'absolute:dist',
    'test'
  ]);

  grunt.registerTask('server', [
    //'clean',
    //'concurrent:server',
    //'autoprefixer',
    'connect:livereload',
    'open',
    'watch'
  ]);

  //NOT USED ANY MORE
  /*
  grunt.registerTask('push', 'Copy files to production build', function(target){
    if(target === 'prod'){
      var prod = '~/wp-ad-scripts/adscape-template/dist';
      //clean out old files
      var preClean = 'rm -rf ' + prod;
      //copy the ./dist dir
      var copy = 'cp -R ./dist ' + prod;
      //remove unnecessary files
      var postClean = 'rm -rf ' + prod + '/*.html ' + prod + '/img';

      console.log('Copying ./dist to ~/wp-ad-scripts/adscape-template/dist');

      exec([preClean, copy, postClean].join(' && '));
    }
  });
  */

};
