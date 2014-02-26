
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
        form.formError = 'Another robot already makes that sound'
#
# Template
#
$ = (selector) ->
  document.querySelector selector
ribosprite = require '../src/ribosprite'
{render, a, br, div, h1, h2, small, text, form} = require 'teacup'

$('#content').innerHTML = render ->
  div '.container', ->
    div '.row', ->
      div '.col-md-9', ->
        h1 ->
          text 'RiBoSpriTe'
          br()
          small 'Rivets + Bootstrap +'
          br()
          small 'Springform + Teacup'

        div '#simple', ->
          ribo = ribosprite
          ribo.form ->
            ribo.input type: 'text', name: 'color'
            ribo.input type: 'text', name: 'sound', label: 'What sound does it make?'
            ribo.formHelpText()
            ribo.submit()

        div '#click-to-focus', ->
          ribo = ribosprite.prefixed 'ctf'
          h2 ->
            a href: '#click-to-focus', '#'
            text " Click a label to focus it's input"
          ribo.form ->
            ribo.input type: 'text', name: 'color', placeholder: 'Maybe red?'
# - Enter to submit from focused field
# - Prevent submit while processing
# - Disable submit button while processing
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
  .processor ->
    unless simpleForm.validate().hasErrors()
      alert 'Sold!'
  .bind
    color: 'blue'
    sound: 'foo'

rivets.bind $('#simple'), simpleForm

# Click to focus
rivets.bind $('#click-to-focus'), robotForm(), config: prefix: 'ctf'
