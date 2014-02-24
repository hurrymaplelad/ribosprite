{env} =  process
require('mocha-as-promised')()
chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
chai.use chaiAsPromised
chai.should()

wd = require 'wd'
chaiAsPromised.transferPromiseness = wd.transferPromiseness
browser = wd.promiseChainRemote(
  'localhost',
  env.WD_PORT,
  env.SAUCE_USERNAME,
  env.SAUCE_ACCESS_KEY
)

if env.VERBOSE
  browser
    .on 'status', (info) ->
      console.log info.cyan
    .on 'command', (meth, path, data) ->
      console.log ' > ' + meth.yellow, path.grey, data || ''


formatJsonWireError = (test) ->
  wireError = test.err['jsonwire-error']
  return unless wireError
  test.err = new Error "#{wireError.summary} (status #{wireError.status}) #{wireError.detail}"

before ->
  @timeout 35000
  capabilities =
    browserName: 'chrome'

  if env.SAUCE
    capabilities =
      browserName: env.BROWSER
      platform: env.PLATFORM
      version: env.VERSION
      name: "Integration - #{env.NODE_ENV}"
    if env.NODE_ENV is 'travis'
      capabilities['tunnel-identifier'] = env.TRAVIS_JOB_NUMBER
      capabilities.build = env.TRAVIS_BUILD_NUMBER
      capabilities.tags = ['travis']

  browser
    .init(capabilities)
    .get("http://localhost:#{env.PORT}")

after ->
  if failed = @currentTest?.state isnt 'passed'
    formatJsonWireError @currentTest

  if env.NODE_ENV is 'travis' and env.SAUCE
    browser.sauceJobStatus not failed

  unless failed and env.NODE_ENV is 'development'
    browser.quit()

describe 'ribosprite', ->
  describe 'with invalid initial values', ->
    describe 'submitting the form', ->
      before ->
        browser
          .elementByCssSelector('button[type=submit]')
          .click()

      it 'shows validation errors', ->
        browser
          .elementByCssSelector('[rv-value="data.color"] + .help-block')
          .text().should.eventually.contain('Pick a better color')
