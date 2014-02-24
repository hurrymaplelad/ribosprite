{renderable, button, form, div, input, label, span} = require 'teacup'


prefixed = (prefix='') ->
  ribosprite = {}

  rvPrefixed = switch
    when prefix then (action) ->
      ['rv', prefix, action].join '-'
    else (action) ->
      "rv-#{action}"

  ribosprite.helpText = (field) ->
    attrs = {}
    attrs[rvPrefixed 'text'] = "fieldErrors.#{field.name}"
    span '.help-block', attrs

  ribosprite.formHelpText = (form) ->
    div '.has-error', ->
      attrs = {}
      attrs[rvPrefixed 'text'] = "formError"
      span '.help-block', attrs

  ribosprite.input = (type) ->
    (field) ->
      {name, id, label: labelText} = field
      attrs = {}
      attrs[rvPrefixed 'class-has-error'] = "fieldErrors.#{name}"
      div '.form-group', attrs, ->
        label '.control-label', for: id, labelText
        attrs = {id, type}
        attrs[rvPrefixed 'value'] = "data.#{name}"
        input '.form-control', attrs
        ribosprite.helpText field

  ribosprite.text = ribosprite.input 'text'

  ribosprite.form = (body) ->
    attrs = {}
    attrs[rvPrefixed 'on-submit'] = 'submit'
    form attrs, body

  ribosprite.submit = (buttonText='Submit') ->
    button '.btn.btn-default', type: 'submit', buttonText

  ribosprite

module.exports = prefixed()
module.exports.prefixed = prefixed

