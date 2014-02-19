{renderable, div, input, label} = require 'teacup'

module.exports =
  input: (type) ->
    renderable (field) ->
      {name, id, label: labelText, prefix} = field
      div ->
        label for: id, labelText
        attrs = {id, type}
        attrs["rv-#{prefix}-value"] = "data.#{name}"
        input '.form-control', attrs
