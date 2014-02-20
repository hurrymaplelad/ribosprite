require('mocha-as-promised')()
chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
chai.use chaiAsPromised
chai.should()

wd = require 'wd'
chaiAsPromised.transferPromiseness = wd.transferPromiseness
browser = wd.promiseChainRemote('localhost', 8002)

before ->
  browser
    .init({browserName: 'chrome'})
    .get('http://localhost:8001')

after ->
  browser.quit()

describe 'ribosprite', ->
  describe 'with invalid initial values', ->
    describe 'submitting the form', ->
      beforeEach ->
        browser
          .elementByCssSelector('button[type=submit]')
          .click()

      it 'shows validation errors', ->
        browser
          .elementByCssSelector('#robo-color + .help-block')
          .text().should.eventually.contain('Pick a better color')
