require('mocha-as-promised')()
chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
chai.use chaiAsPromised
chai.should()

wd = require 'wd'
chaiAsPromised.transferPromiseness = wd.transferPromiseness
browser = wd.promiseChainRemote(
  'localhost',
  process.env.WD_PORT,
  process.env.SAUCE_USERNAME,
  process.env.SAUCE_ACCESS_KEY
)

if process.env.VERBOSE
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

  if process.env.SAUCE
    capabilities =
      browserName: process.env.BROWSER
      platform: process.env.PLATFORM
      version: process.env.VERSION
      name: "Integration - #{process.env.NODE_ENV}"
    if process.env.NODE_ENV is 'travis'
      capabilities['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER
      capabilities.build = process.env.TRAVIS_BUILD_NUMBER
      capabilities.tags = ['travis']

  browser
    .init(capabilities)
    .get("http://localhost:#{process.env.PORT}")

after ->
  if failed = @currentTest?.state is 'failed'
    formatJsonWireError @currentTest

  unless failed and process.env.NODE_ENV is 'development'
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
