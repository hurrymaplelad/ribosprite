{renderable, button, form, div, input, label, span, normalizeArgs} = require 'teacup'

nameToLabel = (name) ->
  name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(^[a-z])/g, (str, p1) -> p1.toUpperCase())


prefixed = (prefix='') ->
  ribosprite = {}

  _prefixed = (namespace) ->
    if prefix then (action) ->
      [namespace, prefix, action].join '-'
    else (action) ->
      "#{namespace}-#{action}"


  rvPrefixed = _prefixed 'rv'
  riboPrefixed = _prefixed 'ribo'

  normalizeHelperArgs = (args) ->
    {attrs, contents} = normalizeArgs args
    name = attrs.name
    delete attrs.name
    {attrs, contents, name}

  normalizeFieldArgs = (args) ->
    {attrs, contents} = normalizeArgs args
    delete attrs.label
    name = attrs.name
    delete attrs.name
    labelText = attrs.label
    if name
      labelText ?= nameToLabel name
      attrs.id ?= riboPrefixed name

    {attrs, contents, labelText, name}

  ribosprite.helpText = ->
    {attrs, contents, name} = normalizeHelperArgs arguments
    attrs[rvPrefixed 'text'] = "fieldErrors.#{name}"
    span '.help-block', attrs

  ribosprite.formHelpText = ->
    div '.has-error', ->
      attrs = {}
      attrs[rvPrefixed 'text'] = "formError"
      span '.help-block', attrs

  ribosprite.formGroup = ->
    {attrs, contents, name} = normalizeHelperArgs arguments
    attrs[rvPrefixed 'class-has-error'] = "fieldErrors.#{name}"
    div '.form-group', attrs, contents

  ribosprite.input = ->
    {attrs, contents, name, labelText} = normalizeFieldArgs arguments
    attrs[rvPrefixed 'value'] = "data.#{name}"

    ribosprite.formGroup {name}, ->
      label '.control-label', for: attrs.id, labelText
      input '.form-control', attrs
      ribosprite.helpText {name}

  ribosprite.form = ->
    {attrs, contents} = normalizeArgs arguments
    attrs[rvPrefixed 'on-submit'] = 'submit'
    form attrs, contents

  ribosprite.submit = ->
    {attrs, contents} = normalizeArgs arguments
    attrs.type = 'submit'
    contents ?= 'Submit'
    attrs[rvPrefixed 'disabled'] = 'processing'
    button '.btn.btn-primary', attrs, contents

  ribosprite

module.exports = prefixed()
module.exports.prefixed = prefixed

