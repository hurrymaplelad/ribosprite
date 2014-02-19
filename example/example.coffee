$ = (selector) ->
  document.querySelector selector
rivets = require 'rivets'
{render, text, b} = require 'teacup'

$('#content').innerHTML = render ->
  text 'Example'

