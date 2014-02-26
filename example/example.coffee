
#
# Form
#
Springform = require 'springform'

robotForm = ->
  new Springform()
    .validator (form) ->
      unless form.data.color is 'red'
        form.fieldErrors.color = 'Pick a better color'
    .validator (form) ->
      unless form.data.sound?.length > 6
        form.formError = 'That color robot should make a louder sound'
#
# Template
#
$ = (selector) ->
  document.querySelector selector
ribosprite = require '../src/ribosprite'
{render, a, br, div, h1, h3, small, text, form, raw} = require 'teacup'

$('#content').innerHTML = render ->
  div '.container', ->
    div '.row', ->
      div '.col-sm-4', ->
        h1 ->
          text 'RiBoSpriTe'
          br()
          small 'Rivets + Bootstrap +'
          br()
          small 'Springform + Teacup'
      div '.col-sm-4.text-right', ->
        a href: 'http://github.com/hurrymaplelad/ribosprite', 'View source on GitHub'

    div '.row', ->
      div '.col-sm-8', ->
        div '#simple', ->
          ribo = ribosprite
          ribo.form ->
            ribo.input type: 'text', name: 'color'
            ribo.input type: 'text', name: 'sound', label: 'What sound does it make?'
            ribo.submit()
            ribo.formHelpText()

        # - Click label to focus input
        div '#click-to-focus', ->
          ribo = ribosprite.prefixed 'ctf'
          h3 ->
            a href: '#click-to-focus', '#'
            text " Click a label to focus it's input"
          ribo.form ->
            ribo.input type: 'text', name: 'color', placeholder: 'Maybe red?'

        # - Disable submit button while processing
        div '#processing', ->
          ribo = ribosprite.prefixed 'processing'
          h3 ->
            a href: '#processing', '#'
            text " Disable submission while processing"
            br()
            small -> raw 'Both button clicking and <kbd>enter</kbd> key'
          ribo.form ->
            ribo.input type: 'text', name: 'color'
            ribo.submit()


# - Enter to submit from focused field
# - Show field specific errors next to fields with error highlight
# - Show whole form errors near the submit button

#
# Binding
#
rivets = require 'rivets'

# make properties that didn't exist before subscription appear
# in JSON.stringified output
origSubscribe = rivets.adapters['.'].subscribe
rivets.adapters['.'].subscribe = (obj, keypath, callback) ->
  obj[keypath] ?= undefined
  origSubscribe.apply @, arguments


# Simple
simpleForm = robotForm()
  .processor (done) ->
    unless simpleForm.validate().hasErrors()
      alert 'Sold!'
    done()

  .bind
    color: 'blue'
    sound: 'foo'

rivets.bind $('#simple'), simpleForm

# Click to focus
rivets.bind $('#click-to-focus'), robotForm(), config: prefix: 'rv-ctf'

# Processing
processingForm = new Springform()
  .processor (done) ->
    if window.webdriver
      window.processingFormDone = done
    else
      setTimeout done, 1500

rivets.bind $('#processing'), processingForm, config: prefix: 'rv-processing'
