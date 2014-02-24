
#
# Form
#
Springform = require 'springform'

robotForm = new Springform()
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
{render, br, div, h1, small, text, form} = require 'teacup'

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

        ribosprite.form ->
          ribosprite.input type: 'text', name: 'color'
          ribosprite.input type: 'text', name: 'sound', label: 'What sound does it make?'
          ribosprite.formHelpText()
          ribosprite.submit()

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

robotForm.submit = (event) ->
  event?.preventDefault()
  unless robotForm.validate().hasErrors()
    alert 'Sold!'

robotForm.bind color: 'blue', sound: 'foo'

rivets.bind $('body'), robotForm
