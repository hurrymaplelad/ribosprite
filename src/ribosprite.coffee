{renderable, button, form, div, input, label, span} = require 'teacup'

prefixed = (prefix, action) ->
  ['rv', prefix, action].filter(Boolean).join '-'

ribosprite = module.exports

ribosprite.helpText = renderable (field) ->
  attrs = {}
  attrs[prefixed field.prefix, 'text'] = "fieldErrors.#{field.name}"
  span '.help-block', attrs

ribosprite.formHelpText = renderable (form) ->
  div '.has-error', ->
    attrs = {}
    attrs[prefixed form.prefix, 'text'] = "formError"
    span '.help-block', attrs

ribosprite.input = (type) ->
  renderable (field) ->
    {name, id, label: labelText, prefix} = field
    attrs = {}
    attrs[prefixed prefix, 'class-has-error'] = "fieldErrors.#{name}"
    div '.form-group', attrs, ->
      label '.control-label', for: id, labelText
      attrs = {id, type}
      attrs[prefixed prefix, 'value'] = "data.#{name}"
      input '.form-control', attrs
      ribosprite.helpText field

ribosprite.text = ribosprite.input 'text'

ribosprite.form = renderable ({prefix}={}, body) ->
  attrs = {}
  attrs[prefixed prefix, 'on-submit'] = 'submit'
  form attrs, body

ribosprite.submit = renderable (buttonText='Submit') ->
  button '.btn.btn-default', type: 'submit', buttonText
