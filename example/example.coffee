
#
# Form
#
Springform = require 'springform'

class RobotForm extends Springform
  prefix: 'robo'
  fields: [
    {name: 'color'}
    {name: 'sound'}
  ]

  validators: [
    (form) ->
      {data, fieldErrors} = form
      unless data.color is 'red'
        fieldErrors.color = 'Pick a better color'

    (form) ->
      unless form.data.sound?.length > 6
        form.formError = 'Another robot already makes that sound'
  ]

robotForm = new RobotForm()

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
        ribosprite.form robotForm, ->
          div 'rv-robo-text': 'data.color', 'SKHDFKDJFHK'
          ribosprite.text robotForm.fields.color
          ribosprite.text robotForm.fields.sound
          ribosprite.formHelpText robotForm
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

robotForm.bind color: 'blue'

rivets.bind $('body'), robotForm,
  config: prefix: 'rv-robo'
