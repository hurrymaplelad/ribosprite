require('mocha-as-promised')()
chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
chai.use chaiAsPromised
chai.should()

wd = require 'wd'
chaiAsPromised.transferPromiseness = wd.transferPromiseness
browser = wd.promiseChainRemote('localhost', process.env.WD_PORT)

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
  @timeout 10000
  browser
    .init({browserName: 'chrome'})
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
