module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  grunt.initConfig
    chromedriver:
      port: 4444
    sauceconnect:
      port: 4445

    ENV: process.env
    env:
      default:
        options:
          add:
            NODE_ENV: 'development'
            WD_PORT: 8002
            PORT: 8000

      chromedriver:
        WD_PORT: '<%= chromedriver.port %>'

      test:
        PORT: 8001
      sauce:
        src: 'local.json'
        options:
          replace:
            WD_PORT: '<%= sauceconnect.port %>'
          add:
            BROWSER: 'chrome'

    clean: src: [
      'built/'
      '.grunt/'
    ]

    connect:
      options:
        base: 'built'
        port: '<%= ENV.PORT %>'
      example: {}

    phantom:
      test:
        options:
          port: '<%= ENV.WD_PORT %>'

    watchify:
      options:
        debug: true
        extensions: ['.coffee']
        transform: ['coffeeify']
        watch: false
      example:
        src: 'example/example.coffee'
        dest: 'built/example.js'

    copy:
      example:
        cwd: 'example/'
        src: [
          '*.html'
          '*.css'
        ]
        dest: 'built/'
        expand: true

    open:
      example:
        path: 'http://localhost:<%= ENV.PORT %>'

    esteWatch:
      options:
        dirs: ['src/', 'example/']
        livereload: enabled: false

      html: (filepath) ->
        ['copy:example']

      coffee: (filepath) ->
        ['watchify']

    simplemocha:
      all: 'test/**/*.coffee'

    'gh-pages':
      options:
        base: 'built'
      src: '**/*'

  grunt.registerTask 'publish:example', [
    'clean'
    'build:example'
    'gh-pages'
  ]

  grunt.registerTask 'build:example', [
    'copy:example'
    'watchify'
  ]

  grunt.registerTask 'test', 'Build and run the test suite in phantom', [
    'env:default'
    'env:test'
    'build:example'
    'connect:example'
    process.env.SAUCE and 'env:sauce' or 'phantom:test'
    'simplemocha'
  ]

  grunt.registerTask 'dev', 'Start a local development server', [
    'env:default'
    'build:example'
    'connect:example'
    'open:example'
    'esteWatch'
  ]


  grunt.registerTask 'test:dev', 'Run tests in chromedriver when development server is already running', [
    'env:default'
    'env:chromedriver'
    'ensureChromedriver'
    'simplemocha'
  ]

  grunt.registerTask 'ensureChromedriver', ->
    portchecker = require 'portchecker'
    {spawn} = require 'child_process'
    fs = require 'fs'
    done = @async()
    portchecker.isOpen grunt.config('chromedriver.port'), 'localhost', (open, port, host) ->
      if open
        grunt.log.writeln "chromedriver already running on #{host}:#{port}"
        return done()
      logfile = './chromedriver.log'
      log = fs.openSync logfile, 'a'
      grunt.log.writeln "starting chromedriver on #{host}:#{port} logging to #{logfile}"
      spawn './node_modules/.bin/start_selenium_with_chromedriver', [],
        detached: true
        stdio: ['ignore', log, log]
      done()

