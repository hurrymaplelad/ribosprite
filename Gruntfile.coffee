module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  grunt.initConfig
    clean: ['built/']

    connect:
      options:
        base: 'built'
      example: {}
      test:
        options:
          port: 8001

    phantom:
      test:
        options:
          port: 8002

    watchify:
      options:
        debug: true
        extensions: ['.coffee']
        transform: ['coffeeify']
        watch: true
      example:
        src: 'example/example.coffee'
        dest: 'built/example.js'

    copy:
      example:
        cwd: 'example/'
        src: [
          '*.html'
        ]
        dest: 'built/'
        expand: true

    open:
      example:
        path: 'http://localhost:8000'

    esteWatch:
      options:
        dirs: ['src/', 'example/']
        livereload: enabled: false

      html: (filepath) ->
        ['copy:example']

    simplemocha:
      all: 'test/**/*.coffee'

  grunt.registerTask 'build:example', [
    'copy:example'
    'watchify'
  ]

  grunt.registerTask 'dev', 'Start a local development server', [
    'build:example'
    'connect:example'
    'open:example'
    'esteWatch'
  ]

  grunt.registerTask 'test', [
    'build:example'
    'connect:test'
    'phantom:test'
    'simplemocha'
  ]
