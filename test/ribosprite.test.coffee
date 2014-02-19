require('mocha-as-promised')()
chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
chai.use chaiAsPromised
chai.should()

wd = require 'wd'
chaiAsPromised.transferPromiseness = wd.transferPromiseness
browser = wd.promiseChainRemote('localhost', 8002)

describe 'ribosprite', ->
  before ->
    browser
      .init({browserName: 'chrome'})
      .get('http://localhost:8001')

  after ->
    browser.quit()

  it 'works', ->
    browser
      .elementById('content')
      .text().should.eventually.contain('Example')


