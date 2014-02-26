(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, Springform, br, div, form, h1, origSubscribe, render, ribosprite, rivets, robotForm, small, text, _ref;

Springform = require('springform');

robotForm = new Springform().validator(function(form) {
  if (form.data.color !== 'red') {
    return form.fieldErrors.color = 'Pick a better color';
  }
}).validator(function(form) {
  var _ref;
  if (!(((_ref = form.data.sound) != null ? _ref.length : void 0) > 6)) {
    return form.formError = 'Another robot already makes that sound';
  }
});

$ = function(selector) {
  return document.querySelector(selector);
};

ribosprite = require('../src/ribosprite');

_ref = require('teacup'), render = _ref.render, br = _ref.br, div = _ref.div, h1 = _ref.h1, small = _ref.small, text = _ref.text, form = _ref.form;

$('#content').innerHTML = render(function() {
  return div('.container', function() {
    return div('.row', function() {
      return div('.col-md-9', function() {
        h1(function() {
          text('RiBoSpriTe');
          br();
          small('Rivets + Bootstrap +');
          br();
          return small('Springform + Teacup');
        });
        return ribosprite.form(function() {
          ribosprite.input({
            type: 'text',
            name: 'color'
          });
          ribosprite.input({
            type: 'text',
            name: 'sound',
            label: 'What sound does it make?'
          });
          ribosprite.formHelpText();
          return ribosprite.submit();
        });
      });
    });
  });
});

rivets = require('rivets');

origSubscribe = rivets.adapters['.'].subscribe;

rivets.adapters['.'].subscribe = function(obj, keypath, callback) {
  if (obj[keypath] == null) {
    obj[keypath] = void 0;
  }
  return origSubscribe.apply(this, arguments);
};

robotForm.submit = function(event) {
  if (event != null) {
    event.preventDefault();
  }
  if (!robotForm.validate().hasErrors()) {
    return alert('Sold!');
  }
};

robotForm.bind({
  color: 'blue',
  sound: 'foo'
});

rivets.bind($('body'), robotForm);


},{"../src/ribosprite":5,"rivets":2,"springform":3,"teacup":4}],2:[function(require,module,exports){
// Rivets.js
// version: 0.6.6
// author: Michael Richards
// license: MIT
(function() {
  var Rivets, bindMethod, unbindMethod, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Rivets = {
    binders: {},
    components: {},
    formatters: {},
    adapters: {},
    config: {
      prefix: 'rv',
      templateDelimiters: ['{', '}'],
      rootInterface: '.',
      preloadData: true,
      handler: function(context, ev, binding) {
        return this.call(context, ev, binding.view.models);
      }
    }
  };

  if ('jQuery' in window) {
    _ref = 'on' in jQuery ? ['on', 'off'] : ['bind', 'unbind'], bindMethod = _ref[0], unbindMethod = _ref[1];
    Rivets.Util = {
      bindEvent: function(el, event, handler) {
        return jQuery(el)[bindMethod](event, handler);
      },
      unbindEvent: function(el, event, handler) {
        return jQuery(el)[unbindMethod](event, handler);
      },
      getInputValue: function(el) {
        var $el;
        $el = jQuery(el);
        if ($el.attr('type') === 'checkbox') {
          return $el.is(':checked');
        } else {
          return $el.val();
        }
      }
    };
  } else {
    Rivets.Util = {
      bindEvent: (function() {
        if ('addEventListener' in window) {
          return function(el, event, handler) {
            return el.addEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.attachEvent('on' + event, handler);
        };
      })(),
      unbindEvent: (function() {
        if ('removeEventListener' in window) {
          return function(el, event, handler) {
            return el.removeEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.detachEvent('on' + event, handler);
        };
      })(),
      getInputValue: function(el) {
        var o, _i, _len, _results;
        if (el.type === 'checkbox') {
          return el.checked;
        } else if (el.type === 'select-multiple') {
          _results = [];
          for (_i = 0, _len = el.length; _i < _len; _i++) {
            o = el[_i];
            if (o.selected) {
              _results.push(o.value);
            }
          }
          return _results;
        } else {
          return el.value;
        }
      }
    };
  }

  Rivets.View = (function() {
    function View(els, models, options) {
      var k, option, v, _base, _i, _len, _ref1, _ref2, _ref3;
      this.els = els;
      this.models = models;
      this.options = options != null ? options : {};
      this.update = __bind(this.update, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.select = __bind(this.select, this);
      this.build = __bind(this.build, this);
      this.componentRegExp = __bind(this.componentRegExp, this);
      this.bindingRegExp = __bind(this.bindingRegExp, this);
      if (!(this.els.jquery || this.els instanceof Array)) {
        this.els = [this.els];
      }
      _ref1 = ['config', 'binders', 'formatters', 'adapters'];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        this[option] = {};
        if (this.options[option]) {
          _ref2 = this.options[option];
          for (k in _ref2) {
            v = _ref2[k];
            this[option][k] = v;
          }
        }
        _ref3 = Rivets[option];
        for (k in _ref3) {
          v = _ref3[k];
          if ((_base = this[option])[k] == null) {
            _base[k] = v;
          }
        }
      }
      this.build();
    }

    View.prototype.bindingRegExp = function() {
      return new RegExp("^" + this.config.prefix + "-");
    };

    View.prototype.componentRegExp = function() {
      return new RegExp("^" + (this.config.prefix.toUpperCase()) + "-");
    };

    View.prototype.build = function() {
      var bindingRegExp, buildBinding, componentRegExp, el, parse, skipNodes, _i, _len, _ref1,
        _this = this;
      this.bindings = [];
      skipNodes = [];
      bindingRegExp = this.bindingRegExp();
      componentRegExp = this.componentRegExp();
      buildBinding = function(binding, node, type, declaration) {
        var context, ctx, dependencies, keypath, options, pipe, pipes;
        options = {};
        pipes = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = declaration.split('|');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            pipe = _ref1[_i];
            _results.push(pipe.trim());
          }
          return _results;
        })();
        context = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = pipes.shift().split('<');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            ctx = _ref1[_i];
            _results.push(ctx.trim());
          }
          return _results;
        })();
        keypath = context.shift();
        options.formatters = pipes;
        if (dependencies = context.shift()) {
          options.dependencies = dependencies.split(/\s+/);
        }
        return _this.bindings.push(new Rivets[binding](_this, node, type, keypath, options));
      };
      parse = function(node) {
        var attribute, attributes, binder, childNode, delimiters, identifier, n, parser, regexp, text, token, tokens, type, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
        if (__indexOf.call(skipNodes, node) < 0) {
          if (node.nodeType === 3) {
            parser = Rivets.TextTemplateParser;
            if (delimiters = _this.config.templateDelimiters) {
              if ((tokens = parser.parse(node.data, delimiters)).length) {
                if (!(tokens.length === 1 && tokens[0].type === parser.types.text)) {
                  for (_i = 0, _len = tokens.length; _i < _len; _i++) {
                    token = tokens[_i];
                    text = document.createTextNode(token.value);
                    node.parentNode.insertBefore(text, node);
                    if (token.type === 1) {
                      buildBinding('TextBinding', text, null, token.value);
                    }
                  }
                  node.parentNode.removeChild(node);
                }
              }
            }
          } else if (componentRegExp.test(node.tagName)) {
            type = node.tagName.replace(componentRegExp, '').toLowerCase();
            _this.bindings.push(new Rivets.ComponentBinding(_this, node, type));
          } else if (node.attributes != null) {
            _ref1 = node.attributes;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              attribute = _ref1[_j];
              if (bindingRegExp.test(attribute.name)) {
                type = attribute.name.replace(bindingRegExp, '');
                if (!(binder = _this.binders[type])) {
                  _ref2 = _this.binders;
                  for (identifier in _ref2) {
                    value = _ref2[identifier];
                    if (identifier !== '*' && identifier.indexOf('*') !== -1) {
                      regexp = new RegExp("^" + (identifier.replace('*', '.+')) + "$");
                      if (regexp.test(type)) {
                        binder = value;
                      }
                    }
                  }
                }
                binder || (binder = _this.binders['*']);
                if (binder.block) {
                  _ref3 = node.childNodes;
                  for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                    n = _ref3[_k];
                    skipNodes.push(n);
                  }
                  attributes = [attribute];
                }
              }
            }
            _ref4 = attributes || node.attributes;
            for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
              attribute = _ref4[_l];
              if (bindingRegExp.test(attribute.name)) {
                type = attribute.name.replace(bindingRegExp, '');
                buildBinding('Binding', node, type, attribute.value);
              }
            }
          }
          _ref5 = (function() {
            var _len4, _n, _ref5, _results1;
            _ref5 = node.childNodes;
            _results1 = [];
            for (_n = 0, _len4 = _ref5.length; _n < _len4; _n++) {
              n = _ref5[_n];
              _results1.push(n);
            }
            return _results1;
          })();
          _results = [];
          for (_m = 0, _len4 = _ref5.length; _m < _len4; _m++) {
            childNode = _ref5[_m];
            _results.push(parse(childNode));
          }
          return _results;
        }
      };
      _ref1 = this.els;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        el = _ref1[_i];
        parse(el);
      }
    };

    View.prototype.select = function(fn) {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (fn(binding)) {
          _results.push(binding);
        }
      }
      return _results;
    };

    View.prototype.bind = function() {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(binding.bind());
      }
      return _results;
    };

    View.prototype.unbind = function() {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(binding.unbind());
      }
      return _results;
    };

    View.prototype.sync = function() {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(binding.sync());
      }
      return _results;
    };

    View.prototype.publish = function() {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.select(function(b) {
        return b.binder.publishes;
      });
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(binding.publish());
      }
      return _results;
    };

    View.prototype.update = function(models) {
      var binding, key, model, _i, _len, _ref1, _results;
      if (models == null) {
        models = {};
      }
      for (key in models) {
        model = models[key];
        this.models[key] = model;
      }
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(binding.update(models));
      }
      return _results;
    };

    return View;

  })();

  Rivets.Binding = (function() {
    function Binding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.update = __bind(this.update, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.set = __bind(this.set, this);
      this.eventHandler = __bind(this.eventHandler, this);
      this.formattedValue = __bind(this.formattedValue, this);
      this.setBinder = __bind(this.setBinder, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.model = void 0;
      this.setBinder();
    }

    Binding.prototype.setBinder = function() {
      var identifier, regexp, value, _ref1;
      if (!(this.binder = this.view.binders[this.type])) {
        _ref1 = this.view.binders;
        for (identifier in _ref1) {
          value = _ref1[identifier];
          if (identifier !== '*' && identifier.indexOf('*') !== -1) {
            regexp = new RegExp("^" + (identifier.replace('*', '.+')) + "$");
            if (regexp.test(this.type)) {
              this.binder = value;
              this.args = new RegExp("^" + (identifier.replace('*', '(.+)')) + "$").exec(this.type);
              this.args.shift();
            }
          }
        }
      }
      this.binder || (this.binder = this.view.binders['*']);
      if (this.binder instanceof Function) {
        return this.binder = {
          routine: this.binder
        };
      }
    };

    Binding.prototype.formattedValue = function(value) {
      var args, formatter, id, _i, _len, _ref1;
      _ref1 = this.formatters;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        formatter = _ref1[_i];
        args = formatter.split(/\s+/);
        id = args.shift();
        formatter = this.view.formatters[id];
        if ((formatter != null ? formatter.read : void 0) instanceof Function) {
          value = formatter.read.apply(formatter, [value].concat(__slice.call(args)));
        } else if (formatter instanceof Function) {
          value = formatter.apply(null, [value].concat(__slice.call(args)));
        }
      }
      return value;
    };

    Binding.prototype.eventHandler = function(fn) {
      var binding, handler;
      handler = (binding = this).view.config.handler;
      return function(ev) {
        return handler.call(fn, this, ev, binding);
      };
    };

    Binding.prototype.set = function(value) {
      var _ref1;
      value = value instanceof Function && !this.binder["function"] ? this.formattedValue(value.call(this.model)) : this.formattedValue(value);
      return (_ref1 = this.binder.routine) != null ? _ref1.call(this, this.el, value) : void 0;
    };

    Binding.prototype.sync = function() {
      var dependency, observer, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
      if (this.model !== this.observer.target) {
        _ref1 = this.dependencies;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          observer = _ref1[_i];
          observer.unobserve();
        }
        this.dependencies = [];
        if (((this.model = this.observer.target) != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
          _ref3 = this.options.dependencies;
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            dependency = _ref3[_j];
            observer = new Rivets.Observer(this.view, this.model, dependency, this.sync);
            this.dependencies.push(observer);
          }
        }
      }
      return this.set(this.observer.value());
    };

    Binding.prototype.publish = function() {
      var args, formatter, id, value, _i, _len, _ref1, _ref2, _ref3;
      value = Rivets.Util.getInputValue(this.el);
      _ref1 = this.formatters.slice(0).reverse();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        formatter = _ref1[_i];
        args = formatter.split(/\s+/);
        id = args.shift();
        if ((_ref2 = this.view.formatters[id]) != null ? _ref2.publish : void 0) {
          value = (_ref3 = this.view.formatters[id]).publish.apply(_ref3, [value].concat(__slice.call(args)));
        }
      }
      return this.observer.publish(value);
    };

    Binding.prototype.bind = function() {
      var dependency, observer, _i, _len, _ref1, _ref2, _ref3;
      if ((_ref1 = this.binder.bind) != null) {
        _ref1.call(this, this.el);
      }
      this.observer = new Rivets.Observer(this.view, this.view.models, this.keypath, this.sync);
      this.model = this.observer.target;
      if ((this.model != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
        _ref3 = this.options.dependencies;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          dependency = _ref3[_i];
          observer = new Rivets.Observer(this.view, this.model, dependency, this.sync);
          this.dependencies.push(observer);
        }
      }
      if (this.view.config.preloadData) {
        return this.sync();
      }
    };

    Binding.prototype.unbind = function() {
      var observer, _i, _len, _ref1, _ref2;
      if ((_ref1 = this.binder.unbind) != null) {
        _ref1.call(this, this.el);
      }
      this.observer.unobserve();
      _ref2 = this.dependencies;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        observer = _ref2[_i];
        observer.unobserve();
      }
      return this.dependencies = [];
    };

    Binding.prototype.update = function(models) {
      var _ref1;
      if (models == null) {
        models = {};
      }
      return (_ref1 = this.binder.update) != null ? _ref1.call(this, models) : void 0;
    };

    return Binding;

  })();

  Rivets.ComponentBinding = (function(_super) {
    __extends(ComponentBinding, _super);

    function ComponentBinding(view, el, type) {
      var attribute, _i, _len, _ref1, _ref2;
      this.view = view;
      this.el = el;
      this.type = type;
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.update = __bind(this.update, this);
      this.locals = __bind(this.locals, this);
      this.component = Rivets.components[this.type];
      this.attributes = {};
      this.inflections = {};
      _ref1 = this.el.attributes || [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (_ref2 = attribute.name, __indexOf.call(this.component.attributes, _ref2) >= 0) {
          this.attributes[attribute.name] = attribute.value;
        } else {
          this.inflections[attribute.name] = attribute.value;
        }
      }
    }

    ComponentBinding.prototype.sync = function() {};

    ComponentBinding.prototype.locals = function(models) {
      var inverse, key, model, path, result, _i, _len, _ref1, _ref2;
      if (models == null) {
        models = this.view.models;
      }
      result = {};
      _ref1 = this.inflections;
      for (key in _ref1) {
        inverse = _ref1[key];
        _ref2 = inverse.split('.');
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          path = _ref2[_i];
          result[key] = (result[key] || models)[path];
        }
      }
      for (key in models) {
        model = models[key];
        if (result[key] == null) {
          result[key] = model;
        }
      }
      return result;
    };

    ComponentBinding.prototype.update = function(models) {
      var _ref1;
      return (_ref1 = this.componentView) != null ? _ref1.update(this.locals(models)) : void 0;
    };

    ComponentBinding.prototype.bind = function() {
      var el, _ref1;
      if (this.componentView != null) {
        return (_ref1 = this.componentView) != null ? _ref1.bind() : void 0;
      } else {
        el = this.component.build.call(this.attributes);
        (this.componentView = new Rivets.View(el, this.locals(), this.view.options)).bind();
        return this.el.parentNode.replaceChild(el, this.el);
      }
    };

    ComponentBinding.prototype.unbind = function() {
      var _ref1;
      return (_ref1 = this.componentView) != null ? _ref1.unbind() : void 0;
    };

    return ComponentBinding;

  })(Rivets.Binding);

  Rivets.TextBinding = (function(_super) {
    __extends(TextBinding, _super);

    function TextBinding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.sync = __bind(this.sync, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
    }

    TextBinding.prototype.binder = {
      routine: function(node, value) {
        return node.data = value != null ? value : '';
      }
    };

    TextBinding.prototype.sync = function() {
      return TextBinding.__super__.sync.apply(this, arguments);
    };

    return TextBinding;

  })(Rivets.Binding);

  Rivets.KeypathParser = (function() {
    function KeypathParser() {}

    KeypathParser.parse = function(keypath, interfaces, root) {
      var char, current, index, tokens, _i, _ref1;
      tokens = [];
      current = {
        "interface": root,
        path: ''
      };
      for (index = _i = 0, _ref1 = keypath.length; _i < _ref1; index = _i += 1) {
        char = keypath.charAt(index);
        if (__indexOf.call(interfaces, char) >= 0) {
          tokens.push(current);
          current = {
            "interface": char,
            path: ''
          };
        } else {
          current.path += char;
        }
      }
      tokens.push(current);
      return tokens;
    };

    return KeypathParser;

  })();

  Rivets.TextTemplateParser = (function() {
    function TextTemplateParser() {}

    TextTemplateParser.types = {
      text: 0,
      binding: 1
    };

    TextTemplateParser.parse = function(template, delimiters) {
      var index, lastIndex, lastToken, length, substring, tokens, value;
      tokens = [];
      length = template.length;
      index = 0;
      lastIndex = 0;
      while (lastIndex < length) {
        index = template.indexOf(delimiters[0], lastIndex);
        if (index < 0) {
          tokens.push({
            type: this.types.text,
            value: template.slice(lastIndex)
          });
          break;
        } else {
          if (index > 0 && lastIndex < index) {
            tokens.push({
              type: this.types.text,
              value: template.slice(lastIndex, index)
            });
          }
          lastIndex = index + delimiters[0].length;
          index = template.indexOf(delimiters[1], lastIndex);
          if (index < 0) {
            substring = template.slice(lastIndex - delimiters[1].length);
            lastToken = tokens[tokens.length - 1];
            if ((lastToken != null ? lastToken.type : void 0) === this.types.text) {
              lastToken.value += substring;
            } else {
              tokens.push({
                type: this.types.text,
                value: substring
              });
            }
            break;
          }
          value = template.slice(lastIndex, index).trim();
          tokens.push({
            type: this.types.binding,
            value: value
          });
          lastIndex = index + delimiters[1].length;
        }
      }
      return tokens;
    };

    return TextTemplateParser;

  })();

  Rivets.Observer = (function() {
    function Observer(view, model, keypath, callback) {
      this.view = view;
      this.model = model;
      this.keypath = keypath;
      this.callback = callback;
      this.unobserve = __bind(this.unobserve, this);
      this.realize = __bind(this.realize, this);
      this.value = __bind(this.value, this);
      this.publish = __bind(this.publish, this);
      this.read = __bind(this.read, this);
      this.set = __bind(this.set, this);
      this.adapter = __bind(this.adapter, this);
      this.update = __bind(this.update, this);
      this.initialize = __bind(this.initialize, this);
      this.parse = __bind(this.parse, this);
      this.parse();
      this.initialize();
    }

    Observer.prototype.parse = function() {
      var interfaces, k, path, root, v, _ref1;
      interfaces = (function() {
        var _ref1, _results;
        _ref1 = this.view.adapters;
        _results = [];
        for (k in _ref1) {
          v = _ref1[k];
          _results.push(k);
        }
        return _results;
      }).call(this);
      if (_ref1 = this.keypath[0], __indexOf.call(interfaces, _ref1) >= 0) {
        root = this.keypath[0];
        path = this.keypath.substr(1);
      } else {
        root = this.view.config.rootInterface;
        path = this.keypath;
      }
      this.tokens = Rivets.KeypathParser.parse(path, interfaces, root);
      return this.key = this.tokens.pop();
    };

    Observer.prototype.initialize = function() {
      this.objectPath = [];
      this.target = this.realize();
      if (this.target != null) {
        return this.set(true, this.key, this.target, this.callback);
      }
    };

    Observer.prototype.update = function() {
      var next, oldValue;
      if ((next = this.realize()) !== this.target) {
        if (this.target != null) {
          this.set(false, this.key, this.target, this.callback);
        }
        if (next != null) {
          this.set(true, this.key, next, this.callback);
        }
        oldValue = this.value();
        this.target = next;
        if (this.value() !== oldValue) {
          return this.callback();
        }
      }
    };

    Observer.prototype.adapter = function(key) {
      return this.view.adapters[key["interface"]];
    };

    Observer.prototype.set = function(active, key, obj, callback) {
      var action;
      action = active ? 'subscribe' : 'unsubscribe';
      return this.adapter(key)[action](obj, key.path, callback);
    };

    Observer.prototype.read = function(key, obj) {
      return this.adapter(key).read(obj, key.path);
    };

    Observer.prototype.publish = function(value) {
      if (this.target != null) {
        return this.adapter(this.key).publish(this.target, this.key.path, value);
      }
    };

    Observer.prototype.value = function() {
      if (this.target != null) {
        return this.read(this.key, this.target);
      }
    };

    Observer.prototype.realize = function() {
      var current, index, prev, token, unreached, _i, _len, _ref1;
      current = this.model;
      unreached = null;
      _ref1 = this.tokens;
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        token = _ref1[index];
        if (current != null) {
          if (this.objectPath[index] != null) {
            if (current !== (prev = this.objectPath[index])) {
              this.set(false, token, prev, this.update);
              this.set(true, token, current, this.update);
              this.objectPath[index] = current;
            }
          } else {
            this.set(true, token, current, this.update);
            this.objectPath[index] = current;
          }
          current = this.read(token, current);
        } else {
          if (unreached == null) {
            unreached = index;
          }
          if (prev = this.objectPath[index]) {
            this.set(false, token, prev, this.update);
          }
        }
      }
      if (unreached != null) {
        this.objectPath.splice(unreached);
      }
      return current;
    };

    Observer.prototype.unobserve = function() {
      var index, obj, token, _i, _len, _ref1, _results;
      _ref1 = this.tokens;
      _results = [];
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        token = _ref1[index];
        if (obj = this.objectPath[index]) {
          _results.push(this.set(false, token, obj, this.update));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Observer;

  })();

  Rivets.binders.text = function(el, value) {
    if (el.textContent != null) {
      return el.textContent = value != null ? value : '';
    } else {
      return el.innerText = value != null ? value : '';
    }
  };

  Rivets.binders.html = function(el, value) {
    return el.innerHTML = value != null ? value : '';
  };

  Rivets.binders.show = function(el, value) {
    return el.style.display = value ? '' : 'none';
  };

  Rivets.binders.hide = function(el, value) {
    return el.style.display = value ? 'none' : '';
  };

  Rivets.binders.enabled = function(el, value) {
    return el.disabled = !value;
  };

  Rivets.binders.disabled = function(el, value) {
    return el.disabled = !!value;
  };

  Rivets.binders.checked = {
    publishes: true,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) === (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !!value;
      }
    }
  };

  Rivets.binders.unchecked = {
    publishes: true,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) !== (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !value;
      }
    }
  };

  Rivets.binders.value = {
    publishes: true,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var o, _i, _len, _ref1, _ref2, _ref3, _results;
      if (window.jQuery != null) {
        el = jQuery(el);
        if ((value != null ? value.toString() : void 0) !== ((_ref1 = el.val()) != null ? _ref1.toString() : void 0)) {
          return el.val(value != null ? value : '');
        }
      } else {
        if (el.type === 'select-multiple') {
          if (value != null) {
            _results = [];
            for (_i = 0, _len = el.length; _i < _len; _i++) {
              o = el[_i];
              _results.push(o.selected = (_ref2 = o.value, __indexOf.call(value, _ref2) >= 0));
            }
            return _results;
          }
        } else if ((value != null ? value.toString() : void 0) !== ((_ref3 = el.value) != null ? _ref3.toString() : void 0)) {
          return el.value = value != null ? value : '';
        }
      }
    }
  };

  Rivets.binders["if"] = {
    block: true,
    bind: function(el) {
      var attr, declaration;
      if (this.marker == null) {
        attr = [this.view.config.prefix, this.type].join('-').replace('--', '-');
        declaration = el.getAttribute(attr);
        this.marker = document.createComment(" rivets: " + this.type + " " + declaration + " ");
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        return el.parentNode.removeChild(el);
      }
    },
    unbind: function() {
      var _ref1;
      return (_ref1 = this.nested) != null ? _ref1.unbind() : void 0;
    },
    routine: function(el, value) {
      var key, model, models, options, _ref1;
      if (!!value === (this.nested == null)) {
        if (value) {
          models = {};
          _ref1 = this.view.models;
          for (key in _ref1) {
            model = _ref1[key];
            models[key] = model;
          }
          options = {
            binders: this.view.options.binders,
            formatters: this.view.options.formatters,
            adapters: this.view.options.adapters,
            config: this.view.options.config
          };
          (this.nested = new Rivets.View(el, models, options)).bind();
          return this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
        } else {
          el.parentNode.removeChild(el);
          this.nested.unbind();
          return delete this.nested;
        }
      }
    },
    update: function(models) {
      var _ref1;
      return (_ref1 = this.nested) != null ? _ref1.update(models) : void 0;
    }
  };

  Rivets.binders.unless = {
    block: true,
    bind: function(el) {
      return Rivets.binders["if"].bind.call(this, el);
    },
    unbind: function() {
      return Rivets.binders["if"].unbind.call(this);
    },
    routine: function(el, value) {
      return Rivets.binders["if"].routine.call(this, el, !value);
    },
    update: function(models) {
      return Rivets.binders["if"].update.call(this, models);
    }
  };

  Rivets.binders['on-*'] = {
    "function": true,
    unbind: function(el) {
      if (this.handler) {
        return Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
    },
    routine: function(el, value) {
      if (this.handler) {
        Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
      return Rivets.Util.bindEvent(el, this.args[0], this.handler = this.eventHandler(value));
    }
  };

  Rivets.binders['each-*'] = {
    block: true,
    bind: function(el) {
      var attr;
      if (this.marker == null) {
        attr = [this.view.config.prefix, this.type].join('-').replace('--', '-');
        this.marker = document.createComment(" rivets: " + this.type + " ");
        this.iterated = [];
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        return el.parentNode.removeChild(el);
      }
    },
    unbind: function(el) {
      var view, _i, _len, _ref1, _results;
      if (this.iterated != null) {
        _ref1 = this.iterated;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          _results.push(view.unbind());
        }
        return _results;
      }
    },
    routine: function(el, collection) {
      var binding, data, i, index, k, key, model, modelName, options, previous, template, v, view, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _ref4, _results;
      modelName = this.args[0];
      collection = collection || [];
      if (this.iterated.length > collection.length) {
        _ref1 = Array(this.iterated.length - collection.length);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          view = this.iterated.pop();
          view.unbind();
          this.marker.parentNode.removeChild(view.els[0]);
        }
      }
      for (index = _j = 0, _len1 = collection.length; _j < _len1; index = ++_j) {
        model = collection[index];
        data = {};
        data[modelName] = model;
        if (this.iterated[index] == null) {
          _ref2 = this.view.models;
          for (key in _ref2) {
            model = _ref2[key];
            if (data[key] == null) {
              data[key] = model;
            }
          }
          previous = this.iterated.length ? this.iterated[this.iterated.length - 1].els[0] : this.marker;
          options = {
            binders: this.view.options.binders,
            formatters: this.view.options.formatters,
            adapters: this.view.options.adapters,
            config: {}
          };
          _ref3 = this.view.options.config;
          for (k in _ref3) {
            v = _ref3[k];
            options.config[k] = v;
          }
          options.config.preloadData = true;
          template = el.cloneNode(true);
          view = new Rivets.View(template, data, options);
          view.bind();
          this.iterated.push(view);
          this.marker.parentNode.insertBefore(template, previous.nextSibling);
        } else if (this.iterated[index].models[modelName] !== model) {
          this.iterated[index].update(data);
        }
      }
      if (el.nodeName === 'OPTION') {
        _ref4 = this.view.bindings;
        _results = [];
        for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
          binding = _ref4[_k];
          if (binding.el === this.marker.parentNode && binding.type === 'value') {
            _results.push(binding.sync());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    update: function(models) {
      var data, key, model, view, _i, _len, _ref1, _results;
      data = {};
      for (key in models) {
        model = models[key];
        if (key !== this.args[0]) {
          data[key] = model;
        }
      }
      _ref1 = this.iterated;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        _results.push(view.update(data));
      }
      return _results;
    }
  };

  Rivets.binders['class-*'] = function(el, value) {
    var elClass;
    elClass = " " + el.className + " ";
    if (!value === (elClass.indexOf(" " + this.args[0] + " ") !== -1)) {
      return el.className = value ? "" + el.className + " " + this.args[0] : elClass.replace(" " + this.args[0] + " ", ' ').trim();
    }
  };

  Rivets.binders['*'] = function(el, value) {
    if (value) {
      return el.setAttribute(this.type, value);
    } else {
      return el.removeAttribute(this.type);
    }
  };

  Rivets.adapters['.'] = {
    id: '_rv',
    counter: 0,
    weakmap: {},
    weakReference: function(obj) {
      var id;
      if (obj[this.id] == null) {
        id = this.counter++;
        this.weakmap[id] = {
          callbacks: {}
        };
        Object.defineProperty(obj, this.id, {
          value: id
        });
      }
      return this.weakmap[obj[this.id]];
    },
    stubFunction: function(obj, fn) {
      var map, original, weakmap;
      original = obj[fn];
      map = this.weakReference(obj);
      weakmap = this.weakmap;
      return obj[fn] = function() {
        var callback, k, r, response, _i, _len, _ref1, _ref2, _ref3, _ref4;
        response = original.apply(obj, arguments);
        _ref1 = map.pointers;
        for (r in _ref1) {
          k = _ref1[r];
          _ref4 = (_ref2 = (_ref3 = weakmap[r]) != null ? _ref3.callbacks[k] : void 0) != null ? _ref2 : [];
          for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
            callback = _ref4[_i];
            callback();
          }
        }
        return response;
      };
    },
    observeMutations: function(obj, ref, keypath) {
      var fn, functions, map, _base, _i, _len;
      if (Array.isArray(obj)) {
        map = this.weakReference(obj);
        if (map.pointers == null) {
          map.pointers = {};
          functions = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
          for (_i = 0, _len = functions.length; _i < _len; _i++) {
            fn = functions[_i];
            this.stubFunction(obj, fn);
          }
        }
        if ((_base = map.pointers)[ref] == null) {
          _base[ref] = [];
        }
        if (__indexOf.call(map.pointers[ref], keypath) < 0) {
          return map.pointers[ref].push(keypath);
        }
      }
    },
    unobserveMutations: function(obj, ref, keypath) {
      var keypaths, _ref1;
      if (Array.isArray(obj && (obj[this.id] != null))) {
        if (keypaths = (_ref1 = this.weakReference(obj).pointers) != null ? _ref1[ref] : void 0) {
          return keypaths.splice(keypaths.indexOf(keypath), 1);
        }
      }
    },
    subscribe: function(obj, keypath, callback) {
      var callbacks, value,
        _this = this;
      callbacks = this.weakReference(obj).callbacks;
      if (callbacks[keypath] == null) {
        callbacks[keypath] = [];
        value = obj[keypath];
        Object.defineProperty(obj, keypath, {
          get: function() {
            return value;
          },
          set: function(newValue) {
            var _i, _len, _ref1;
            if (newValue !== value) {
              value = newValue;
              _ref1 = callbacks[keypath];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                callback = _ref1[_i];
                callback();
              }
              return _this.observeMutations(newValue, obj[_this.id], keypath);
            }
          }
        });
      }
      if (__indexOf.call(callbacks[keypath], callback) < 0) {
        callbacks[keypath].push(callback);
      }
      return this.observeMutations(obj[keypath], obj[this.id], keypath);
    },
    unsubscribe: function(obj, keypath, callback) {
      var callbacks;
      callbacks = this.weakmap[obj[this.id]].callbacks[keypath];
      callbacks.splice(callbacks.indexOf(callback), 1);
      return this.unobserveMutations(obj[keypath], obj[this.id], keypath);
    },
    read: function(obj, keypath) {
      return obj[keypath];
    },
    publish: function(obj, keypath, value) {
      return obj[keypath] = value;
    }
  };

  Rivets.factory = function(exports) {
    exports._ = Rivets;
    exports.binders = Rivets.binders;
    exports.components = Rivets.components;
    exports.formatters = Rivets.formatters;
    exports.adapters = Rivets.adapters;
    exports.config = Rivets.config;
    exports.configure = function(options) {
      var property, value;
      if (options == null) {
        options = {};
      }
      for (property in options) {
        value = options[property];
        Rivets.config[property] = value;
      }
    };
    return exports.bind = function(el, models, options) {
      var view;
      if (models == null) {
        models = {};
      }
      if (options == null) {
        options = {};
      }
      view = new Rivets.View(el, models, options);
      view.bind();
      return view;
    };
  };

  if (typeof exports === 'object') {
    Rivets.factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      Rivets.factory(this.rivets = exports);
      return exports;
    });
  } else {
    Rivets.factory(this.rivets = {});
  }

}).call(this);

},{}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
var Gate, Springform,
  __slice = [].slice;

Springform = (function() {
  function Springform(attrs) {
    var field, key, value, _i, _len, _ref;
    if (attrs == null) {
      attrs = {};
    }
    for (key in attrs) {
      value = attrs[key];
      this[key] = value;
    }
    if (this.fieldErrors == null) {
      this.fieldErrors = {};
    }
    this.formError = null;
    this.validators = this.validators ? this.validators.slice() : [];
    if (this.fields == null) {
      this.fields = [];
    }
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      this.fields[field.name] = field;
    }
  }

  Springform.prototype.bind = function(data) {
    this.data = data;
    return this;
  };

  Springform.prototype.prunedData = function() {
    return _(data).pick(_(this.fields).pluck('name'));
  };

  Springform.prototype.errors = function(errors) {
    if (arguments.length) {
      this.formError = errors.formError;
      this.fieldErrors = errors.fieldErrors || [];
      return this;
    } else {
      return {
        formError: this.formError,
        fieldErrors: this.fieldErrors
      };
    }
  };

  Springform.prototype.validator = function(validator) {
    this.validators.push(validator);
    return this;
  };

  Springform.prototype.validate = function(done) {
    var gate, validator, _i, _len, _ref;
    this.formError = null;
    this.fieldErrors = {};
    gate = new Gate();
    _ref = this.validators || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      validator = _ref[_i];
      if (validator.length > 1) {
        validator(this, gate.callback());
      } else {
        validator(this);
      }
    }
    gate.finished(done);
    return this;
  };

  Springform.prototype.hasErrors = function() {
    return Boolean(this.formError) || Object.keys(this.fieldErrors).some((function(_this) {
      return function(key) {
        return Boolean(_this.fieldErrors[key]);
      };
    })(this));
  };

  Springform.prototype.submit = function(event) {
    if (event != null) {
      event.preventDefault();
    }
    this.processing = true;
    return this.process((function(_this) {
      return function() {
        return _this.processing = false;
      };
    })(this));
  };

  Springform.prototype.process = function(done) {
    return done();
  };

  Springform.prototype.processor = function(process) {
    this.process = process;
    return this;
  };

  return Springform;

})();

Springform.required = function() {
  var fields;
  fields = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return function(_arg) {
    var data, field, fieldErrors, value, _i, _len, _results;
    data = _arg.data, fieldErrors = _arg.fieldErrors;
    _results = [];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      field = fields[_i];
      value = data[field];
      if (!(value || value === false)) {
        _results.push(fieldErrors[field] = 'required');
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
};

Gate = (function() {
  function Gate() {
    this.callbacks = [];
    this.returnedCount = 0;
  }

  Gate.prototype.checkDone = function() {
    if (this.returnedCount === this.callbacks.length) {
      return setTimeout(this.done, 0);
    }
  };

  Gate.prototype.callback = function() {
    var callback, called;
    called = false;
    callback = (function(_this) {
      return function() {
        if (called) {
          return;
        }
        called = true;
        _this.returnedCount += 1;
        return _this.checkDone();
      };
    })(this);
    this.callbacks.push(callback);
    return callback;
  };

  Gate.prototype.finished = function(callback) {
    this.done = callback;
    return this.checkDone();
  };

  return Gate;

})();

if (typeof module !== "undefined" && module !== null) {
  module.exports = Springform;
}

},{}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var Teacup, doctypes, elements, merge_elements, tagName, _fn, _fn1, _fn2, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  doctypes = {
    'default': '<!DOCTYPE html>',
    '5': '<!DOCTYPE html>',
    'xml': '<?xml version="1.0" encoding="utf-8" ?>',
    'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
    'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
    '1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
    'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
    'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">',
    'ce': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "ce-html-1.0-transitional.dtd">'
  };

  elements = {
    regular: 'a abbr address article aside audio b bdi bdo blockquote body button canvas caption cite code colgroup datalist dd del details dfn div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins kbd label legend li map mark menu meter nav noscript object ol optgroup option output p pre progress q rp rt ruby s samp section select small span strong sub summary sup table tbody td textarea tfoot th thead time title tr u ul video',
    raw: 'script style',
    "void": 'area base br col command embed hr img input keygen link meta param source track wbr',
    obsolete: 'applet acronym bgsound dir frameset noframes isindex listing nextid noembed plaintext rb strike xmp big blink center font marquee multicol nobr spacer tt',
    obsolete_void: 'basefont frame'
  };

  merge_elements = function() {
    var a, args, element, result, _i, _j, _len, _len1, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    result = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      a = args[_i];
      _ref = elements[a].split(' ');
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        element = _ref[_j];
        if (__indexOf.call(result, element) < 0) {
          result.push(element);
        }
      }
    }
    return result;
  };

  Teacup = (function() {
    function Teacup() {
      this.htmlOut = null;
    }

    Teacup.prototype.resetBuffer = function(html) {
      var previous;
      if (html == null) {
        html = null;
      }
      previous = this.htmlOut;
      this.htmlOut = html;
      return previous;
    };

    Teacup.prototype.render = function() {
      var args, previous, result, template;
      template = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      previous = this.resetBuffer('');
      try {
        template.apply(null, args);
      } finally {
        result = this.resetBuffer(previous);
      }
      return result;
    };

    Teacup.prototype.cede = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.render.apply(this, args);
    };

    Teacup.prototype.renderable = function(template) {
      var teacup;
      teacup = this;
      return function() {
        var args, result;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (teacup.htmlOut === null) {
          teacup.htmlOut = '';
          try {
            template.apply(this, args);
          } finally {
            result = teacup.resetBuffer();
          }
          return result;
        } else {
          return template.apply(this, args);
        }
      };
    };

    Teacup.prototype.renderAttr = function(name, value) {
      var k, v;
      if (value == null) {
        return " " + name;
      }
      if (value === false) {
        return '';
      }
      if (name === 'data' && typeof value === 'object') {
        return ((function() {
          var _results;
          _results = [];
          for (k in value) {
            v = value[k];
            _results.push(this.renderAttr("data-" + k, v));
          }
          return _results;
        }).call(this)).join('');
      }
      if (value === true) {
        value = name;
      }
      return " " + name + "=" + (this.quote(this.escape(value.toString())));
    };

    Teacup.prototype.attrOrder = ['id', 'class'];

    Teacup.prototype.renderAttrs = function(obj) {
      var name, result, value, _i, _len, _ref;
      result = '';
      _ref = this.attrOrder;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        if (!(name in obj)) {
          continue;
        }
        result += this.renderAttr(name, obj[name]);
        delete obj[name];
      }
      for (name in obj) {
        value = obj[name];
        result += this.renderAttr(name, value);
      }
      return result;
    };

    Teacup.prototype.renderContents = function(contents) {
      if (contents == null) {

      } else if (typeof contents === 'function') {
        return contents.call(this);
      } else {
        return this.text(contents);
      }
    };

    Teacup.prototype.isSelector = function(string) {
      var _ref;
      return string.length > 1 && ((_ref = string[0]) === '#' || _ref === '.');
    };

    Teacup.prototype.parseSelector = function(selector) {
      var classes, id, klass, token, _i, _len, _ref, _ref1;
      id = null;
      classes = [];
      _ref = selector.split('.');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        if (id) {
          classes.push(token);
        } else {
          _ref1 = token.split('#'), klass = _ref1[0], id = _ref1[1];
          if (klass !== '') {
            classes.push(token);
          }
        }
      }
      return {
        id: id,
        classes: classes
      };
    };

    Teacup.prototype.normalizeArgs = function(args) {
      var arg, attrs, classes, contents, id, index, selector, _i, _len;
      attrs = {};
      selector = null;
      contents = null;
      for (index = _i = 0, _len = args.length; _i < _len; index = ++_i) {
        arg = args[index];
        if (arg != null) {
          switch (typeof arg) {
            case 'string':
              if (index === 0 && this.isSelector(arg)) {
                selector = this.parseSelector(arg);
              } else {
                contents = arg;
              }
              break;
            case 'function':
            case 'number':
            case 'boolean':
              contents = arg;
              break;
            case 'object':
              if (arg.constructor === Object) {
                attrs = arg;
              } else {
                contents = arg;
              }
              break;
            default:
              contents = arg;
          }
        }
      }
      if (selector != null) {
        id = selector.id, classes = selector.classes;
        if (id != null) {
          attrs.id = id;
        }
        if (classes != null ? classes.length : void 0) {
          attrs["class"] = classes.join(' ');
        }
      }
      return {
        attrs: attrs,
        contents: contents
      };
    };

    Teacup.prototype.tag = function() {
      var args, attrs, contents, tagName, _ref;
      tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
      this.raw("<" + tagName + (this.renderAttrs(attrs)) + ">");
      this.renderContents(contents);
      return this.raw("</" + tagName + ">");
    };

    Teacup.prototype.rawTag = function() {
      var args, attrs, contents, tagName, _ref;
      tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
      this.raw("<" + tagName + (this.renderAttrs(attrs)) + ">");
      this.raw(contents);
      return this.raw("</" + tagName + ">");
    };

    Teacup.prototype.selfClosingTag = function() {
      var args, attrs, contents, tag, _ref;
      tag = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
      if (contents) {
        throw new Error("Teacup: <" + tag + "/> must not have content.  Attempted to nest " + contents);
      }
      return this.raw("<" + tag + (this.renderAttrs(attrs)) + " />");
    };

    Teacup.prototype.coffeescript = function(fn) {
      return this.raw("<script type=\"text/javascript\">(function() {\n  var __slice = [].slice,\n      __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },\n      __hasProp = {}.hasOwnProperty,\n      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };\n  (" + (fn.toString()) + ")();\n})();</script>");
    };

    Teacup.prototype.comment = function(text) {
      return this.raw("<!--" + (this.escape(text)) + "-->");
    };

    Teacup.prototype.doctype = function(type) {
      if (type == null) {
        type = 5;
      }
      return this.raw(doctypes[type]);
    };

    Teacup.prototype.ie = function(condition, contents) {
      this.raw("<!--[if " + (this.escape(condition)) + "]>");
      this.renderContents(contents);
      return this.raw("<![endif]-->");
    };

    Teacup.prototype.text = function(s) {
      if (this.htmlOut == null) {
        throw new Error("Teacup: can't call a tag function outside a rendering context");
      }
      return this.htmlOut += (s != null) && this.escape(s.toString()) || '';
    };

    Teacup.prototype.raw = function(s) {
      if (s == null) {
        return;
      }
      return this.htmlOut += s;
    };

    Teacup.prototype.escape = function(text) {
      return text.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    Teacup.prototype.quote = function(value) {
      return "\"" + value + "\"";
    };

    Teacup.prototype.tags = function() {
      var bound, boundMethodNames, method, _fn, _i, _len;
      bound = {};
      boundMethodNames = [].concat('cede coffeescript comment doctype escape ie normalizeArgs raw render renderable script tag text'.split(' '), merge_elements('regular', 'obsolete', 'raw', 'void', 'obsolete_void'));
      _fn = (function(_this) {
        return function(method) {
          return bound[method] = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return _this[method].apply(_this, args);
          };
        };
      })(this);
      for (_i = 0, _len = boundMethodNames.length; _i < _len; _i++) {
        method = boundMethodNames[_i];
        _fn(method);
      }
      return bound;
    };

    return Teacup;

  })();

  _ref = merge_elements('regular', 'obsolete');
  _fn = function(tagName) {
    return Teacup.prototype[tagName] = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.tag.apply(this, [tagName].concat(__slice.call(args)));
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    tagName = _ref[_i];
    _fn(tagName);
  }

  _ref1 = merge_elements('raw');
  _fn1 = function(tagName) {
    return Teacup.prototype[tagName] = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.rawTag.apply(this, [tagName].concat(__slice.call(args)));
    };
  };
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    tagName = _ref1[_j];
    _fn1(tagName);
  }

  _ref2 = merge_elements('void', 'obsolete_void');
  _fn2 = function(tagName) {
    return Teacup.prototype[tagName] = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.selfClosingTag.apply(this, [tagName].concat(__slice.call(args)));
    };
  };
  for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
    tagName = _ref2[_k];
    _fn2(tagName);
  }

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = new Teacup().tags();
    module.exports.Teacup = Teacup;
  } else if (typeof define === 'function' && define.amd) {
    define('teacup', [], function() {
      return new Teacup().tags();
    });
  } else {
    window.teacup = new Teacup().tags();
    window.teacup.Teacup = Teacup;
  }

}).call(this);

},{}],5:[function(require,module,exports){
var button, div, form, input, label, nameToLabel, normalizeArgs, prefixed, renderable, span, _ref;

_ref = require('teacup'), renderable = _ref.renderable, button = _ref.button, form = _ref.form, div = _ref.div, input = _ref.input, label = _ref.label, span = _ref.span, normalizeArgs = _ref.normalizeArgs;

nameToLabel = function(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(^[a-z])/g, function(str, p1) {
    return p1.toUpperCase();
  });
};

prefixed = function(prefix) {
  var normalizeFieldArgs, normalizeHelperArgs, riboPrefixed, ribosprite, rvPrefixed, _prefixed;
  if (prefix == null) {
    prefix = '';
  }
  ribosprite = {};
  _prefixed = function(namespace) {
    if (prefix) {
      return function(action) {
        return [namespace, prefix, action].join('-');
      };
    } else {
      return function(action) {
        return "" + namespace + "-" + action;
      };
    }
  };
  rvPrefixed = _prefixed('rv');
  riboPrefixed = _prefixed('ribo');
  normalizeHelperArgs = function(args) {
    var attrs, contents, name, _ref1;
    _ref1 = normalizeArgs(args), attrs = _ref1.attrs, contents = _ref1.contents;
    name = attrs.name;
    delete attrs.name;
    return {
      attrs: attrs,
      contents: contents,
      name: name
    };
  };
  normalizeFieldArgs = function(args) {
    var attrs, contents, labelText, name, _ref1;
    _ref1 = normalizeArgs(args), attrs = _ref1.attrs, contents = _ref1.contents;
    delete attrs.label;
    name = attrs.name;
    delete attrs.name;
    labelText = attrs.label;
    if (name) {
      if (labelText == null) {
        labelText = nameToLabel(name);
      }
      if (attrs.id == null) {
        attrs.id = riboPrefixed(name);
      }
    }
    return {
      attrs: attrs,
      contents: contents,
      labelText: labelText,
      name: name
    };
  };
  ribosprite.helpText = function() {
    var attrs, contents, name, _ref1;
    _ref1 = normalizeHelperArgs(arguments), attrs = _ref1.attrs, contents = _ref1.contents, name = _ref1.name;
    attrs[rvPrefixed('text')] = "fieldErrors." + name;
    return span('.help-block', attrs);
  };
  ribosprite.formHelpText = function() {
    return div('.has-error', function() {
      var attrs;
      attrs = {};
      attrs[rvPrefixed('text')] = "formError";
      return span('.help-block', attrs);
    });
  };
  ribosprite.formGroup = function() {
    var attrs, contents, name, _ref1;
    _ref1 = normalizeHelperArgs(arguments), attrs = _ref1.attrs, contents = _ref1.contents, name = _ref1.name;
    attrs[rvPrefixed('class-has-error')] = "fieldErrors." + name;
    return div('.form-group', attrs, contents);
  };
  ribosprite.input = function() {
    var attrs, contents, labelText, name, _ref1;
    _ref1 = normalizeFieldArgs(arguments), attrs = _ref1.attrs, contents = _ref1.contents, name = _ref1.name, labelText = _ref1.labelText;
    attrs[rvPrefixed('value')] = "data." + name;
    return ribosprite.formGroup({
      name: name
    }, function() {
      label('.control-label', {
        "for": attrs.id
      }, labelText);
      input('.form-control', attrs);
      return ribosprite.helpText({
        name: name
      });
    });
  };
  ribosprite.form = function() {
    var attrs, contents, _ref1;
    _ref1 = normalizeArgs(arguments), attrs = _ref1.attrs, contents = _ref1.contents;
    attrs[rvPrefixed('on-submit')] = 'submit';
    return form(attrs, contents);
  };
  ribosprite.submit = function() {
    var attrs, contents, _ref1;
    _ref1 = normalizeArgs(arguments), attrs = _ref1.attrs, contents = _ref1.contents;
    attrs.type = 'submit';
    if (contents == null) {
      contents = 'Submit';
    }
    return button('.btn.btn-default', attrs, contents);
  };
  return ribosprite;
};

module.exports = prefixed();

module.exports.prefixed = prefixed;


},{"teacup":4}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL2V4YW1wbGUvZXhhbXBsZS5jb2ZmZWUiLCIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL25vZGVfbW9kdWxlcy9yaXZldHMvZGlzdC9yaXZldHMuanMiLCIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL25vZGVfbW9kdWxlcy9zcHJpbmdmb3JtL2xpYi9zcHJpbmdmb3JtLmpzIiwiL1VzZXJzL2FkYW0vUHJvamVjdHMvcmlib3Nwcml0ZS9ub2RlX21vZHVsZXMvdGVhY3VwL2xpYi90ZWFjdXAuanMiLCIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL3NyYy9yaWJvc3ByaXRlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0lBLElBQUEseUdBQUE7O0FBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBQWIsQ0FBQTs7QUFBQSxTQUVBLEdBQWdCLElBQUEsVUFBQSxDQUFBLENBQ2QsQ0FBQyxTQURhLENBQ0gsU0FBQyxJQUFELEdBQUE7QUFDVCxFQUFBLElBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFWLEtBQW1CLEtBQTFCO1dBQ0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFqQixHQUF5QixzQkFEM0I7R0FEUztBQUFBLENBREcsQ0FJZCxDQUFDLFNBSmEsQ0FJSCxTQUFDLElBQUQsR0FBQTtBQUNULE1BQUEsSUFBQTtBQUFBLEVBQUEsSUFBQSxDQUFBLHlDQUFzQixDQUFFLGdCQUFqQixHQUEwQixDQUFqQyxDQUFBO1dBQ0UsSUFBSSxDQUFDLFNBQUwsR0FBaUIseUNBRG5CO0dBRFM7QUFBQSxDQUpHLENBRmhCLENBQUE7O0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3p3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QWtFQSxXQW5FUztBQUFBLENBUlgsQ0FBQTs7QUFBQSxNQTZFTSxDQUFDLE9BQVAsR0FBaUIsUUFBQSxDQUFBLENBN0VqQixDQUFBOztBQUFBLE1BOEVNLENBQUMsT0FBTyxDQUFDLFFBQWYsR0FBMEIsUUE5RTFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuI1xuIyBGb3JtXG4jXG5TcHJpbmdmb3JtID0gcmVxdWlyZSAnc3ByaW5nZm9ybSdcblxucm9ib3RGb3JtID0gbmV3IFNwcmluZ2Zvcm0oKVxuICAudmFsaWRhdG9yIChmb3JtKSAtPlxuICAgIHVubGVzcyBmb3JtLmRhdGEuY29sb3IgaXMgJ3JlZCdcbiAgICAgIGZvcm0uZmllbGRFcnJvcnMuY29sb3IgPSAnUGljayBhIGJldHRlciBjb2xvcidcbiAgLnZhbGlkYXRvciAoZm9ybSkgLT5cbiAgICB1bmxlc3MgZm9ybS5kYXRhLnNvdW5kPy5sZW5ndGggPiA2XG4gICAgICBmb3JtLmZvcm1FcnJvciA9ICdBbm90aGVyIHJvYm90IGFscmVhZHkgbWFrZXMgdGhhdCBzb3VuZCdcbiNcbiMgVGVtcGxhdGVcbiNcbiQgPSAoc2VsZWN0b3IpIC0+XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Igc2VsZWN0b3JcbnJpYm9zcHJpdGUgPSByZXF1aXJlICcuLi9zcmMvcmlib3Nwcml0ZSdcbntyZW5kZXIsIGJyLCBkaXYsIGgxLCBzbWFsbCwgdGV4dCwgZm9ybX0gPSByZXF1aXJlICd0ZWFjdXAnXG5cbiQoJyNjb250ZW50JykuaW5uZXJIVE1MID0gcmVuZGVyIC0+XG4gIGRpdiAnLmNvbnRhaW5lcicsIC0+XG4gICAgZGl2ICcucm93JywgLT5cbiAgICAgIGRpdiAnLmNvbC1tZC05JywgLT5cbiAgICAgICAgaDEgLT5cbiAgICAgICAgICB0ZXh0ICdSaUJvU3ByaVRlJ1xuICAgICAgICAgIGJyKClcbiAgICAgICAgICBzbWFsbCAnUml2ZXRzICsgQm9vdHN0cmFwICsnXG4gICAgICAgICAgYnIoKVxuICAgICAgICAgIHNtYWxsICdTcHJpbmdmb3JtICsgVGVhY3VwJ1xuXG4gICAgICAgIHJpYm9zcHJpdGUuZm9ybSAtPlxuICAgICAgICAgIHJpYm9zcHJpdGUuaW5wdXQgdHlwZTogJ3RleHQnLCBuYW1lOiAnY29sb3InXG4gICAgICAgICAgcmlib3Nwcml0ZS5pbnB1dCB0eXBlOiAndGV4dCcsIG5hbWU6ICdzb3VuZCcsIGxhYmVsOiAnV2hhdCBzb3VuZCBkb2VzIGl0IG1ha2U/J1xuICAgICAgICAgIHJpYm9zcHJpdGUuZm9ybUhlbHBUZXh0KClcbiAgICAgICAgICByaWJvc3ByaXRlLnN1Ym1pdCgpXG5cbiNcbiMgQmluZGluZ1xuI1xucml2ZXRzID0gcmVxdWlyZSAncml2ZXRzJ1xuXG4jIG1ha2UgcHJvcGVydGllcyB0aGF0IGRpZG4ndCBleGlzdCBiZWZvcmUgc3Vic2NyaXB0aW9uIGFwcGVhclxuIyBpbiBKU09OLnN0cmluZ2lmaWVkIG91dHB1dFxub3JpZ1N1YnNjcmliZSA9IHJpdmV0cy5hZGFwdGVyc1snLiddLnN1YnNjcmliZVxucml2ZXRzLmFkYXB0ZXJzWycuJ10uc3Vic2NyaWJlID0gKG9iaiwga2V5cGF0aCwgY2FsbGJhY2spIC0+XG4gIG9ialtrZXlwYXRoXSA/PSB1bmRlZmluZWRcbiAgb3JpZ1N1YnNjcmliZS5hcHBseSBALCBhcmd1bWVudHNcblxucm9ib3RGb3JtLnN1Ym1pdCA9IChldmVudCkgLT5cbiAgZXZlbnQ/LnByZXZlbnREZWZhdWx0KClcbiAgdW5sZXNzIHJvYm90Rm9ybS52YWxpZGF0ZSgpLmhhc0Vycm9ycygpXG4gICAgYWxlcnQgJ1NvbGQhJ1xuXG5yb2JvdEZvcm0uYmluZCBjb2xvcjogJ2JsdWUnLCBzb3VuZDogJ2Zvbydcblxucml2ZXRzLmJpbmQgJCgnYm9keScpLCByb2JvdEZvcm1cbiIsIi8vIFJpdmV0cy5qc1xuLy8gdmVyc2lvbjogMC42LjZcbi8vIGF1dGhvcjogTWljaGFlbCBSaWNoYXJkc1xuLy8gbGljZW5zZTogTUlUXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBSaXZldHMsIGJpbmRNZXRob2QsIHVuYmluZE1ldGhvZCwgX3JlZixcbiAgICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9LFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuICBSaXZldHMgPSB7XG4gICAgYmluZGVyczoge30sXG4gICAgY29tcG9uZW50czoge30sXG4gICAgZm9ybWF0dGVyczoge30sXG4gICAgYWRhcHRlcnM6IHt9LFxuICAgIGNvbmZpZzoge1xuICAgICAgcHJlZml4OiAncnYnLFxuICAgICAgdGVtcGxhdGVEZWxpbWl0ZXJzOiBbJ3snLCAnfSddLFxuICAgICAgcm9vdEludGVyZmFjZTogJy4nLFxuICAgICAgcHJlbG9hZERhdGE6IHRydWUsXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbihjb250ZXh0LCBldiwgYmluZGluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKGNvbnRleHQsIGV2LCBiaW5kaW5nLnZpZXcubW9kZWxzKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaWYgKCdqUXVlcnknIGluIHdpbmRvdykge1xuICAgIF9yZWYgPSAnb24nIGluIGpRdWVyeSA/IFsnb24nLCAnb2ZmJ10gOiBbJ2JpbmQnLCAndW5iaW5kJ10sIGJpbmRNZXRob2QgPSBfcmVmWzBdLCB1bmJpbmRNZXRob2QgPSBfcmVmWzFdO1xuICAgIFJpdmV0cy5VdGlsID0ge1xuICAgICAgYmluZEV2ZW50OiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgcmV0dXJuIGpRdWVyeShlbClbYmluZE1ldGhvZF0oZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgfSxcbiAgICAgIHVuYmluZEV2ZW50OiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgcmV0dXJuIGpRdWVyeShlbClbdW5iaW5kTWV0aG9kXShldmVudCwgaGFuZGxlcik7XG4gICAgICB9LFxuICAgICAgZ2V0SW5wdXRWYWx1ZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyICRlbDtcbiAgICAgICAgJGVsID0galF1ZXJ5KGVsKTtcbiAgICAgICAgaWYgKCRlbC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICByZXR1cm4gJGVsLmlzKCc6Y2hlY2tlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkZWwudmFsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIFJpdmV0cy5VdGlsID0ge1xuICAgICAgYmluZEV2ZW50OiAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gZWwuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKCksXG4gICAgICB1bmJpbmRFdmVudDogKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJ3JlbW92ZUV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZWwsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGVsLmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICB9KSgpLFxuICAgICAgZ2V0SW5wdXRWYWx1ZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIG8sIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICAgICAgaWYgKGVsLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICByZXR1cm4gZWwuY2hlY2tlZDtcbiAgICAgICAgfSBlbHNlIGlmIChlbC50eXBlID09PSAnc2VsZWN0LW11bHRpcGxlJykge1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBlbC5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgbyA9IGVsW19pXTtcbiAgICAgICAgICAgIGlmIChvLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goby52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZWwudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgUml2ZXRzLlZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gVmlldyhlbHMsIG1vZGVscywgb3B0aW9ucykge1xuICAgICAgdmFyIGssIG9wdGlvbiwgdiwgX2Jhc2UsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgdGhpcy5lbHMgPSBlbHM7XG4gICAgICB0aGlzLm1vZGVscyA9IG1vZGVscztcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fTtcbiAgICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgICAgIHRoaXMucHVibGlzaCA9IF9fYmluZCh0aGlzLnB1Ymxpc2gsIHRoaXMpO1xuICAgICAgdGhpcy5zeW5jID0gX19iaW5kKHRoaXMuc3luYywgdGhpcyk7XG4gICAgICB0aGlzLnVuYmluZCA9IF9fYmluZCh0aGlzLnVuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLmJpbmQgPSBfX2JpbmQodGhpcy5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMuc2VsZWN0ID0gX19iaW5kKHRoaXMuc2VsZWN0LCB0aGlzKTtcbiAgICAgIHRoaXMuYnVpbGQgPSBfX2JpbmQodGhpcy5idWlsZCwgdGhpcyk7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZ0V4cCA9IF9fYmluZCh0aGlzLmNvbXBvbmVudFJlZ0V4cCwgdGhpcyk7XG4gICAgICB0aGlzLmJpbmRpbmdSZWdFeHAgPSBfX2JpbmQodGhpcy5iaW5kaW5nUmVnRXhwLCB0aGlzKTtcbiAgICAgIGlmICghKHRoaXMuZWxzLmpxdWVyeSB8fCB0aGlzLmVscyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmVscyA9IFt0aGlzLmVsc107XG4gICAgICB9XG4gICAgICBfcmVmMSA9IFsnY29uZmlnJywgJ2JpbmRlcnMnLCAnZm9ybWF0dGVycycsICdhZGFwdGVycyddO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBvcHRpb24gPSBfcmVmMVtfaV07XG4gICAgICAgIHRoaXNbb3B0aW9uXSA9IHt9O1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zW29wdGlvbl0pIHtcbiAgICAgICAgICBfcmVmMiA9IHRoaXMub3B0aW9uc1tvcHRpb25dO1xuICAgICAgICAgIGZvciAoayBpbiBfcmVmMikge1xuICAgICAgICAgICAgdiA9IF9yZWYyW2tdO1xuICAgICAgICAgICAgdGhpc1tvcHRpb25dW2tdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3JlZjMgPSBSaXZldHNbb3B0aW9uXTtcbiAgICAgICAgZm9yIChrIGluIF9yZWYzKSB7XG4gICAgICAgICAgdiA9IF9yZWYzW2tdO1xuICAgICAgICAgIGlmICgoX2Jhc2UgPSB0aGlzW29wdGlvbl0pW2tdID09IG51bGwpIHtcbiAgICAgICAgICAgIF9iYXNlW2tdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICB9XG5cbiAgICBWaWV3LnByb3RvdHlwZS5iaW5kaW5nUmVnRXhwID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl5cIiArIHRoaXMuY29uZmlnLnByZWZpeCArIFwiLVwiKTtcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuY29tcG9uZW50UmVnRXhwID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl5cIiArICh0aGlzLmNvbmZpZy5wcmVmaXgudG9VcHBlckNhc2UoKSkgKyBcIi1cIik7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZ1JlZ0V4cCwgYnVpbGRCaW5kaW5nLCBjb21wb25lbnRSZWdFeHAsIGVsLCBwYXJzZSwgc2tpcE5vZGVzLCBfaSwgX2xlbiwgX3JlZjEsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMuYmluZGluZ3MgPSBbXTtcbiAgICAgIHNraXBOb2RlcyA9IFtdO1xuICAgICAgYmluZGluZ1JlZ0V4cCA9IHRoaXMuYmluZGluZ1JlZ0V4cCgpO1xuICAgICAgY29tcG9uZW50UmVnRXhwID0gdGhpcy5jb21wb25lbnRSZWdFeHAoKTtcbiAgICAgIGJ1aWxkQmluZGluZyA9IGZ1bmN0aW9uKGJpbmRpbmcsIG5vZGUsIHR5cGUsIGRlY2xhcmF0aW9uKSB7XG4gICAgICAgIHZhciBjb250ZXh0LCBjdHgsIGRlcGVuZGVuY2llcywga2V5cGF0aCwgb3B0aW9ucywgcGlwZSwgcGlwZXM7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgcGlwZXMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICAgICAgX3JlZjEgPSBkZWNsYXJhdGlvbi5zcGxpdCgnfCcpO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgcGlwZSA9IF9yZWYxW19pXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2gocGlwZS50cmltKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIGNvbnRleHQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICAgICAgX3JlZjEgPSBwaXBlcy5zaGlmdCgpLnNwbGl0KCc8Jyk7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBjdHggPSBfcmVmMVtfaV07XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGN0eC50cmltKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIGtleXBhdGggPSBjb250ZXh0LnNoaWZ0KCk7XG4gICAgICAgIG9wdGlvbnMuZm9ybWF0dGVycyA9IHBpcGVzO1xuICAgICAgICBpZiAoZGVwZW5kZW5jaWVzID0gY29udGV4dC5zaGlmdCgpKSB7XG4gICAgICAgICAgb3B0aW9ucy5kZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMuc3BsaXQoL1xccysvKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXMuYmluZGluZ3MucHVzaChuZXcgUml2ZXRzW2JpbmRpbmddKF90aGlzLCBub2RlLCB0eXBlLCBrZXlwYXRoLCBvcHRpb25zKSk7XG4gICAgICB9O1xuICAgICAgcGFyc2UgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHZhciBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMsIGJpbmRlciwgY2hpbGROb2RlLCBkZWxpbWl0ZXJzLCBpZGVudGlmaWVyLCBuLCBwYXJzZXIsIHJlZ2V4cCwgdGV4dCwgdG9rZW4sIHRva2VucywgdHlwZSwgdmFsdWUsIF9pLCBfaiwgX2ssIF9sLCBfbGVuLCBfbGVuMSwgX2xlbjIsIF9sZW4zLCBfbGVuNCwgX20sIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0LCBfcmVmNSwgX3Jlc3VsdHM7XG4gICAgICAgIGlmIChfX2luZGV4T2YuY2FsbChza2lwTm9kZXMsIG5vZGUpIDwgMCkge1xuICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICBwYXJzZXIgPSBSaXZldHMuVGV4dFRlbXBsYXRlUGFyc2VyO1xuICAgICAgICAgICAgaWYgKGRlbGltaXRlcnMgPSBfdGhpcy5jb25maWcudGVtcGxhdGVEZWxpbWl0ZXJzKSB7XG4gICAgICAgICAgICAgIGlmICgodG9rZW5zID0gcGFyc2VyLnBhcnNlKG5vZGUuZGF0YSwgZGVsaW1pdGVycykpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmICghKHRva2Vucy5sZW5ndGggPT09IDEgJiYgdG9rZW5zWzBdLnR5cGUgPT09IHBhcnNlci50eXBlcy50ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSB0b2tlbnMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbX2ldO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRleHQsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkQmluZGluZygnVGV4dEJpbmRpbmcnLCB0ZXh0LCBudWxsLCB0b2tlbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudFJlZ0V4cC50ZXN0KG5vZGUudGFnTmFtZSkpIHtcbiAgICAgICAgICAgIHR5cGUgPSBub2RlLnRhZ05hbWUucmVwbGFjZShjb21wb25lbnRSZWdFeHAsICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgX3RoaXMuYmluZGluZ3MucHVzaChuZXcgUml2ZXRzLkNvbXBvbmVudEJpbmRpbmcoX3RoaXMsIG5vZGUsIHR5cGUpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUuYXR0cmlidXRlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICBfcmVmMSA9IG5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYxLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgICBhdHRyaWJ1dGUgPSBfcmVmMVtfal07XG4gICAgICAgICAgICAgIGlmIChiaW5kaW5nUmVnRXhwLnRlc3QoYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdHlwZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoYmluZGluZ1JlZ0V4cCwgJycpO1xuICAgICAgICAgICAgICAgIGlmICghKGJpbmRlciA9IF90aGlzLmJpbmRlcnNbdHlwZV0pKSB7XG4gICAgICAgICAgICAgICAgICBfcmVmMiA9IF90aGlzLmJpbmRlcnM7XG4gICAgICAgICAgICAgICAgICBmb3IgKGlkZW50aWZpZXIgaW4gX3JlZjIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBfcmVmMltpZGVudGlmaWVyXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgIT09ICcqJyAmJiBpZGVudGlmaWVyLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwKFwiXlwiICsgKGlkZW50aWZpZXIucmVwbGFjZSgnKicsICcuKycpKSArIFwiJFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAocmVnZXhwLnRlc3QodHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRlciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBiaW5kZXIgfHwgKGJpbmRlciA9IF90aGlzLmJpbmRlcnNbJyonXSk7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRlci5ibG9jaykge1xuICAgICAgICAgICAgICAgICAgX3JlZjMgPSBub2RlLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmMy5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbiA9IF9yZWYzW19rXTtcbiAgICAgICAgICAgICAgICAgICAgc2tpcE5vZGVzLnB1c2gobik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzID0gW2F0dHJpYnV0ZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfcmVmNCA9IGF0dHJpYnV0ZXMgfHwgbm9kZS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgZm9yIChfbCA9IDAsIF9sZW4zID0gX3JlZjQubGVuZ3RoOyBfbCA8IF9sZW4zOyBfbCsrKSB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IF9yZWY0W19sXTtcbiAgICAgICAgICAgICAgaWYgKGJpbmRpbmdSZWdFeHAudGVzdChhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0eXBlID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZShiaW5kaW5nUmVnRXhwLCAnJyk7XG4gICAgICAgICAgICAgICAgYnVpbGRCaW5kaW5nKCdCaW5kaW5nJywgbm9kZSwgdHlwZSwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBfcmVmNSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfbGVuNCwgX24sIF9yZWY1LCBfcmVzdWx0czE7XG4gICAgICAgICAgICBfcmVmNSA9IG5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgICAgIF9yZXN1bHRzMSA9IFtdO1xuICAgICAgICAgICAgZm9yIChfbiA9IDAsIF9sZW40ID0gX3JlZjUubGVuZ3RoOyBfbiA8IF9sZW40OyBfbisrKSB7XG4gICAgICAgICAgICAgIG4gPSBfcmVmNVtfbl07XG4gICAgICAgICAgICAgIF9yZXN1bHRzMS5wdXNoKG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9yZXN1bHRzMTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfbSA9IDAsIF9sZW40ID0gX3JlZjUubGVuZ3RoOyBfbSA8IF9sZW40OyBfbSsrKSB7XG4gICAgICAgICAgICBjaGlsZE5vZGUgPSBfcmVmNVtfbV07XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHBhcnNlKGNoaWxkTm9kZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBfcmVmMSA9IHRoaXMuZWxzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBlbCA9IF9yZWYxW19pXTtcbiAgICAgICAgcGFyc2UoZWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihmbikge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBpZiAoZm4oYmluZGluZykpIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaChiaW5kaW5nLmJpbmQoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcudW5iaW5kKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZy5zeW5jKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIF9yZWYxID0gdGhpcy5zZWxlY3QoZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gYi5iaW5kZXIucHVibGlzaGVzO1xuICAgICAgfSk7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcucHVibGlzaCgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICB2YXIgYmluZGluZywga2V5LCBtb2RlbCwgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIGlmIChtb2RlbHMgPT0gbnVsbCkge1xuICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgIH1cbiAgICAgIGZvciAoa2V5IGluIG1vZGVscykge1xuICAgICAgICBtb2RlbCA9IG1vZGVsc1trZXldO1xuICAgICAgICB0aGlzLm1vZGVsc1trZXldID0gbW9kZWw7XG4gICAgICB9XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcudXBkYXRlKG1vZGVscykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICByZXR1cm4gVmlldztcblxuICB9KSgpO1xuXG4gIFJpdmV0cy5CaW5kaW5nID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEJpbmRpbmcodmlldywgZWwsIHR5cGUsIGtleXBhdGgsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICB0aGlzLmVsID0gZWw7XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgdGhpcy5rZXlwYXRoID0ga2V5cGF0aDtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fTtcbiAgICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgICAgIHRoaXMudW5iaW5kID0gX19iaW5kKHRoaXMudW5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZCA9IF9fYmluZCh0aGlzLmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5wdWJsaXNoID0gX19iaW5kKHRoaXMucHVibGlzaCwgdGhpcyk7XG4gICAgICB0aGlzLnN5bmMgPSBfX2JpbmQodGhpcy5zeW5jLCB0aGlzKTtcbiAgICAgIHRoaXMuc2V0ID0gX19iaW5kKHRoaXMuc2V0LCB0aGlzKTtcbiAgICAgIHRoaXMuZXZlbnRIYW5kbGVyID0gX19iaW5kKHRoaXMuZXZlbnRIYW5kbGVyLCB0aGlzKTtcbiAgICAgIHRoaXMuZm9ybWF0dGVkVmFsdWUgPSBfX2JpbmQodGhpcy5mb3JtYXR0ZWRWYWx1ZSwgdGhpcyk7XG4gICAgICB0aGlzLnNldEJpbmRlciA9IF9fYmluZCh0aGlzLnNldEJpbmRlciwgdGhpcyk7XG4gICAgICB0aGlzLmZvcm1hdHRlcnMgPSB0aGlzLm9wdGlvbnMuZm9ybWF0dGVycyB8fCBbXTtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107XG4gICAgICB0aGlzLm1vZGVsID0gdm9pZCAwO1xuICAgICAgdGhpcy5zZXRCaW5kZXIoKTtcbiAgICB9XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5zZXRCaW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpZGVudGlmaWVyLCByZWdleHAsIHZhbHVlLCBfcmVmMTtcbiAgICAgIGlmICghKHRoaXMuYmluZGVyID0gdGhpcy52aWV3LmJpbmRlcnNbdGhpcy50eXBlXSkpIHtcbiAgICAgICAgX3JlZjEgPSB0aGlzLnZpZXcuYmluZGVycztcbiAgICAgICAgZm9yIChpZGVudGlmaWVyIGluIF9yZWYxKSB7XG4gICAgICAgICAgdmFsdWUgPSBfcmVmMVtpZGVudGlmaWVyXTtcbiAgICAgICAgICBpZiAoaWRlbnRpZmllciAhPT0gJyonICYmIGlkZW50aWZpZXIuaW5kZXhPZignKicpICE9PSAtMSkge1xuICAgICAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cChcIl5cIiArIChpZGVudGlmaWVyLnJlcGxhY2UoJyonLCAnLisnKSkgKyBcIiRcIik7XG4gICAgICAgICAgICBpZiAocmVnZXhwLnRlc3QodGhpcy50eXBlKSkge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRlciA9IHZhbHVlO1xuICAgICAgICAgICAgICB0aGlzLmFyZ3MgPSBuZXcgUmVnRXhwKFwiXlwiICsgKGlkZW50aWZpZXIucmVwbGFjZSgnKicsICcoLispJykpICsgXCIkXCIpLmV4ZWModGhpcy50eXBlKTtcbiAgICAgICAgICAgICAgdGhpcy5hcmdzLnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmJpbmRlciB8fCAodGhpcy5iaW5kZXIgPSB0aGlzLnZpZXcuYmluZGVyc1snKiddKTtcbiAgICAgIGlmICh0aGlzLmJpbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJpbmRlciA9IHtcbiAgICAgICAgICByb3V0aW5lOiB0aGlzLmJpbmRlclxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5mb3JtYXR0ZWRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXJncywgZm9ybWF0dGVyLCBpZCwgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgX3JlZjEgPSB0aGlzLmZvcm1hdHRlcnM7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZvcm1hdHRlciA9IF9yZWYxW19pXTtcbiAgICAgICAgYXJncyA9IGZvcm1hdHRlci5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBpZCA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgZm9ybWF0dGVyID0gdGhpcy52aWV3LmZvcm1hdHRlcnNbaWRdO1xuICAgICAgICBpZiAoKGZvcm1hdHRlciAhPSBudWxsID8gZm9ybWF0dGVyLnJlYWQgOiB2b2lkIDApIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICB2YWx1ZSA9IGZvcm1hdHRlci5yZWFkLmFwcGx5KGZvcm1hdHRlciwgW3ZhbHVlXS5jb25jYXQoX19zbGljZS5jYWxsKGFyZ3MpKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0dGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICB2YWx1ZSA9IGZvcm1hdHRlci5hcHBseShudWxsLCBbdmFsdWVdLmNvbmNhdChfX3NsaWNlLmNhbGwoYXJncykpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5ldmVudEhhbmRsZXIgPSBmdW5jdGlvbihmbikge1xuICAgICAgdmFyIGJpbmRpbmcsIGhhbmRsZXI7XG4gICAgICBoYW5kbGVyID0gKGJpbmRpbmcgPSB0aGlzKS52aWV3LmNvbmZpZy5oYW5kbGVyO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwoZm4sIHRoaXMsIGV2LCBiaW5kaW5nKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgX3JlZjE7XG4gICAgICB2YWx1ZSA9IHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24gJiYgIXRoaXMuYmluZGVyW1wiZnVuY3Rpb25cIl0gPyB0aGlzLmZvcm1hdHRlZFZhbHVlKHZhbHVlLmNhbGwodGhpcy5tb2RlbCkpIDogdGhpcy5mb3JtYXR0ZWRWYWx1ZSh2YWx1ZSk7XG4gICAgICByZXR1cm4gKF9yZWYxID0gdGhpcy5iaW5kZXIucm91dGluZSkgIT0gbnVsbCA/IF9yZWYxLmNhbGwodGhpcywgdGhpcy5lbCwgdmFsdWUpIDogdm9pZCAwO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGVwZW5kZW5jeSwgb2JzZXJ2ZXIsIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICBpZiAodGhpcy5tb2RlbCAhPT0gdGhpcy5vYnNlcnZlci50YXJnZXQpIHtcbiAgICAgICAgX3JlZjEgPSB0aGlzLmRlcGVuZGVuY2llcztcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIG9ic2VydmVyID0gX3JlZjFbX2ldO1xuICAgICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107XG4gICAgICAgIGlmICgoKHRoaXMubW9kZWwgPSB0aGlzLm9ic2VydmVyLnRhcmdldCkgIT0gbnVsbCkgJiYgKChfcmVmMiA9IHRoaXMub3B0aW9ucy5kZXBlbmRlbmNpZXMpICE9IG51bGwgPyBfcmVmMi5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgX3JlZjMgPSB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzO1xuICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgZGVwZW5kZW5jeSA9IF9yZWYzW19qXTtcbiAgICAgICAgICAgIG9ic2VydmVyID0gbmV3IFJpdmV0cy5PYnNlcnZlcih0aGlzLnZpZXcsIHRoaXMubW9kZWwsIGRlcGVuZGVuY3ksIHRoaXMuc3luYyk7XG4gICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcy5wdXNoKG9ic2VydmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNldCh0aGlzLm9ic2VydmVyLnZhbHVlKCkpO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgZm9ybWF0dGVyLCBpZCwgdmFsdWUsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgdmFsdWUgPSBSaXZldHMuVXRpbC5nZXRJbnB1dFZhbHVlKHRoaXMuZWwpO1xuICAgICAgX3JlZjEgPSB0aGlzLmZvcm1hdHRlcnMuc2xpY2UoMCkucmV2ZXJzZSgpO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBmb3JtYXR0ZXIgPSBfcmVmMVtfaV07XG4gICAgICAgIGFyZ3MgPSBmb3JtYXR0ZXIuc3BsaXQoL1xccysvKTtcbiAgICAgICAgaWQgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIGlmICgoX3JlZjIgPSB0aGlzLnZpZXcuZm9ybWF0dGVyc1tpZF0pICE9IG51bGwgPyBfcmVmMi5wdWJsaXNoIDogdm9pZCAwKSB7XG4gICAgICAgICAgdmFsdWUgPSAoX3JlZjMgPSB0aGlzLnZpZXcuZm9ybWF0dGVyc1tpZF0pLnB1Ymxpc2guYXBwbHkoX3JlZjMsIFt2YWx1ZV0uY29uY2F0KF9fc2xpY2UuY2FsbChhcmdzKSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYnNlcnZlci5wdWJsaXNoKHZhbHVlKTtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlcGVuZGVuY3ksIG9ic2VydmVyLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgIGlmICgoX3JlZjEgPSB0aGlzLmJpbmRlci5iaW5kKSAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYxLmNhbGwodGhpcywgdGhpcy5lbCk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmVyID0gbmV3IFJpdmV0cy5PYnNlcnZlcih0aGlzLnZpZXcsIHRoaXMudmlldy5tb2RlbHMsIHRoaXMua2V5cGF0aCwgdGhpcy5zeW5jKTtcbiAgICAgIHRoaXMubW9kZWwgPSB0aGlzLm9ic2VydmVyLnRhcmdldDtcbiAgICAgIGlmICgodGhpcy5tb2RlbCAhPSBudWxsKSAmJiAoKF9yZWYyID0gdGhpcy5vcHRpb25zLmRlcGVuZGVuY2llcykgIT0gbnVsbCA/IF9yZWYyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgX3JlZjMgPSB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgZGVwZW5kZW5jeSA9IF9yZWYzW19pXTtcbiAgICAgICAgICBvYnNlcnZlciA9IG5ldyBSaXZldHMuT2JzZXJ2ZXIodGhpcy52aWV3LCB0aGlzLm1vZGVsLCBkZXBlbmRlbmN5LCB0aGlzLnN5bmMpO1xuICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzLnB1c2gob2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy52aWV3LmNvbmZpZy5wcmVsb2FkRGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9ic2VydmVyLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyO1xuICAgICAgaWYgKChfcmVmMSA9IHRoaXMuYmluZGVyLnVuYmluZCkgIT0gbnVsbCkge1xuICAgICAgICBfcmVmMS5jYWxsKHRoaXMsIHRoaXMuZWwpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZlci51bm9ic2VydmUoKTtcbiAgICAgIF9yZWYyID0gdGhpcy5kZXBlbmRlbmNpZXM7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYyLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIG9ic2VydmVyID0gX3JlZjJbX2ldO1xuICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIGlmIChtb2RlbHMgPT0gbnVsbCkge1xuICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoX3JlZjEgPSB0aGlzLmJpbmRlci51cGRhdGUpICE9IG51bGwgPyBfcmVmMS5jYWxsKHRoaXMsIG1vZGVscykgOiB2b2lkIDA7XG4gICAgfTtcblxuICAgIHJldHVybiBCaW5kaW5nO1xuXG4gIH0pKCk7XG5cbiAgUml2ZXRzLkNvbXBvbmVudEJpbmRpbmcgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENvbXBvbmVudEJpbmRpbmcsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBDb21wb25lbnRCaW5kaW5nKHZpZXcsIGVsLCB0eXBlKSB7XG4gICAgICB2YXIgYXR0cmlidXRlLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyO1xuICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICB0aGlzLnVuYmluZCA9IF9fYmluZCh0aGlzLnVuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLmJpbmQgPSBfX2JpbmQodGhpcy5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgICAgIHRoaXMubG9jYWxzID0gX19iaW5kKHRoaXMubG9jYWxzLCB0aGlzKTtcbiAgICAgIHRoaXMuY29tcG9uZW50ID0gUml2ZXRzLmNvbXBvbmVudHNbdGhpcy50eXBlXTtcbiAgICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgICAgdGhpcy5pbmZsZWN0aW9ucyA9IHt9O1xuICAgICAgX3JlZjEgPSB0aGlzLmVsLmF0dHJpYnV0ZXMgfHwgW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGF0dHJpYnV0ZSA9IF9yZWYxW19pXTtcbiAgICAgICAgaWYgKF9yZWYyID0gYXR0cmlidXRlLm5hbWUsIF9faW5kZXhPZi5jYWxsKHRoaXMuY29tcG9uZW50LmF0dHJpYnV0ZXMsIF9yZWYyKSA+PSAwKSB7XG4gICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmluZmxlY3Rpb25zW2F0dHJpYnV0ZS5uYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUubG9jYWxzID0gZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICB2YXIgaW52ZXJzZSwga2V5LCBtb2RlbCwgcGF0aCwgcmVzdWx0LCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyO1xuICAgICAgaWYgKG1vZGVscyA9PSBudWxsKSB7XG4gICAgICAgIG1vZGVscyA9IHRoaXMudmlldy5tb2RlbHM7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSB7fTtcbiAgICAgIF9yZWYxID0gdGhpcy5pbmZsZWN0aW9ucztcbiAgICAgIGZvciAoa2V5IGluIF9yZWYxKSB7XG4gICAgICAgIGludmVyc2UgPSBfcmVmMVtrZXldO1xuICAgICAgICBfcmVmMiA9IGludmVyc2Uuc3BsaXQoJy4nKTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIHBhdGggPSBfcmVmMltfaV07XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSAocmVzdWx0W2tleV0gfHwgbW9kZWxzKVtwYXRoXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChrZXkgaW4gbW9kZWxzKSB7XG4gICAgICAgIG1vZGVsID0gbW9kZWxzW2tleV07XG4gICAgICAgIGlmIChyZXN1bHRba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBtb2RlbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICB2YXIgX3JlZjE7XG4gICAgICByZXR1cm4gKF9yZWYxID0gdGhpcy5jb21wb25lbnRWaWV3KSAhPSBudWxsID8gX3JlZjEudXBkYXRlKHRoaXMubG9jYWxzKG1vZGVscykpIDogdm9pZCAwO1xuICAgIH07XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWwsIF9yZWYxO1xuICAgICAgaWYgKHRoaXMuY29tcG9uZW50VmlldyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAoX3JlZjEgPSB0aGlzLmNvbXBvbmVudFZpZXcpICE9IG51bGwgPyBfcmVmMS5iaW5kKCkgOiB2b2lkIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbCA9IHRoaXMuY29tcG9uZW50LmJ1aWxkLmNhbGwodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgICAgKHRoaXMuY29tcG9uZW50VmlldyA9IG5ldyBSaXZldHMuVmlldyhlbCwgdGhpcy5sb2NhbHMoKSwgdGhpcy52aWV3Lm9wdGlvbnMpKS5iaW5kKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGVsLCB0aGlzLmVsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX3JlZjE7XG4gICAgICByZXR1cm4gKF9yZWYxID0gdGhpcy5jb21wb25lbnRWaWV3KSAhPSBudWxsID8gX3JlZjEudW5iaW5kKCkgOiB2b2lkIDA7XG4gICAgfTtcblxuICAgIHJldHVybiBDb21wb25lbnRCaW5kaW5nO1xuXG4gIH0pKFJpdmV0cy5CaW5kaW5nKTtcblxuICBSaXZldHMuVGV4dEJpbmRpbmcgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFRleHRCaW5kaW5nLCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gVGV4dEJpbmRpbmcodmlldywgZWwsIHR5cGUsIGtleXBhdGgsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICB0aGlzLmVsID0gZWw7XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgdGhpcy5rZXlwYXRoID0ga2V5cGF0aDtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fTtcbiAgICAgIHRoaXMuc3luYyA9IF9fYmluZCh0aGlzLnN5bmMsIHRoaXMpO1xuICAgICAgdGhpcy5mb3JtYXR0ZXJzID0gdGhpcy5vcHRpb25zLmZvcm1hdHRlcnMgfHwgW107XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgIH1cblxuICAgIFRleHRCaW5kaW5nLnByb3RvdHlwZS5iaW5kZXIgPSB7XG4gICAgICByb3V0aW5lOiBmdW5jdGlvbihub2RlLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5kYXRhID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFRleHRCaW5kaW5nLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gVGV4dEJpbmRpbmcuX19zdXBlcl9fLnN5bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRleHRCaW5kaW5nO1xuXG4gIH0pKFJpdmV0cy5CaW5kaW5nKTtcblxuICBSaXZldHMuS2V5cGF0aFBhcnNlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBLZXlwYXRoUGFyc2VyKCkge31cblxuICAgIEtleXBhdGhQYXJzZXIucGFyc2UgPSBmdW5jdGlvbihrZXlwYXRoLCBpbnRlcmZhY2VzLCByb290KSB7XG4gICAgICB2YXIgY2hhciwgY3VycmVudCwgaW5kZXgsIHRva2VucywgX2ksIF9yZWYxO1xuICAgICAgdG9rZW5zID0gW107XG4gICAgICBjdXJyZW50ID0ge1xuICAgICAgICBcImludGVyZmFjZVwiOiByb290LFxuICAgICAgICBwYXRoOiAnJ1xuICAgICAgfTtcbiAgICAgIGZvciAoaW5kZXggPSBfaSA9IDAsIF9yZWYxID0ga2V5cGF0aC5sZW5ndGg7IF9pIDwgX3JlZjE7IGluZGV4ID0gX2kgKz0gMSkge1xuICAgICAgICBjaGFyID0ga2V5cGF0aC5jaGFyQXQoaW5kZXgpO1xuICAgICAgICBpZiAoX19pbmRleE9mLmNhbGwoaW50ZXJmYWNlcywgY2hhcikgPj0gMCkge1xuICAgICAgICAgIHRva2Vucy5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgIGN1cnJlbnQgPSB7XG4gICAgICAgICAgICBcImludGVyZmFjZVwiOiBjaGFyLFxuICAgICAgICAgICAgcGF0aDogJydcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnQucGF0aCArPSBjaGFyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0b2tlbnMucHVzaChjdXJyZW50KTtcbiAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfTtcblxuICAgIHJldHVybiBLZXlwYXRoUGFyc2VyO1xuXG4gIH0pKCk7XG5cbiAgUml2ZXRzLlRleHRUZW1wbGF0ZVBhcnNlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBUZXh0VGVtcGxhdGVQYXJzZXIoKSB7fVxuXG4gICAgVGV4dFRlbXBsYXRlUGFyc2VyLnR5cGVzID0ge1xuICAgICAgdGV4dDogMCxcbiAgICAgIGJpbmRpbmc6IDFcbiAgICB9O1xuXG4gICAgVGV4dFRlbXBsYXRlUGFyc2VyLnBhcnNlID0gZnVuY3Rpb24odGVtcGxhdGUsIGRlbGltaXRlcnMpIHtcbiAgICAgIHZhciBpbmRleCwgbGFzdEluZGV4LCBsYXN0VG9rZW4sIGxlbmd0aCwgc3Vic3RyaW5nLCB0b2tlbnMsIHZhbHVlO1xuICAgICAgdG9rZW5zID0gW107XG4gICAgICBsZW5ndGggPSB0ZW1wbGF0ZS5sZW5ndGg7XG4gICAgICBpbmRleCA9IDA7XG4gICAgICBsYXN0SW5kZXggPSAwO1xuICAgICAgd2hpbGUgKGxhc3RJbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBpbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoZGVsaW1pdGVyc1swXSwgbGFzdEluZGV4KTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMudGV4dCxcbiAgICAgICAgICAgIHZhbHVlOiB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGluZGV4ID4gMCAmJiBsYXN0SW5kZXggPCBpbmRleCkge1xuICAgICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnRleHQsXG4gICAgICAgICAgICAgIHZhbHVlOiB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXgsIGluZGV4KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxhc3RJbmRleCA9IGluZGV4ICsgZGVsaW1pdGVyc1swXS5sZW5ndGg7XG4gICAgICAgICAgaW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKGRlbGltaXRlcnNbMV0sIGxhc3RJbmRleCk7XG4gICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgICAgc3Vic3RyaW5nID0gdGVtcGxhdGUuc2xpY2UobGFzdEluZGV4IC0gZGVsaW1pdGVyc1sxXS5sZW5ndGgpO1xuICAgICAgICAgICAgbGFzdFRva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmICgobGFzdFRva2VuICE9IG51bGwgPyBsYXN0VG9rZW4udHlwZSA6IHZvaWQgMCkgPT09IHRoaXMudHlwZXMudGV4dCkge1xuICAgICAgICAgICAgICBsYXN0VG9rZW4udmFsdWUgKz0gc3Vic3RyaW5nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMudGV4dCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogc3Vic3RyaW5nXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gdGVtcGxhdGUuc2xpY2UobGFzdEluZGV4LCBpbmRleCkudHJpbSgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMuYmluZGluZyxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxhc3RJbmRleCA9IGluZGV4ICsgZGVsaW1pdGVyc1sxXS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfTtcblxuICAgIHJldHVybiBUZXh0VGVtcGxhdGVQYXJzZXI7XG5cbiAgfSkoKTtcblxuICBSaXZldHMuT2JzZXJ2ZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gT2JzZXJ2ZXIodmlldywgbW9kZWwsIGtleXBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgdGhpcy5rZXlwYXRoID0ga2V5cGF0aDtcbiAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgIHRoaXMudW5vYnNlcnZlID0gX19iaW5kKHRoaXMudW5vYnNlcnZlLCB0aGlzKTtcbiAgICAgIHRoaXMucmVhbGl6ZSA9IF9fYmluZCh0aGlzLnJlYWxpemUsIHRoaXMpO1xuICAgICAgdGhpcy52YWx1ZSA9IF9fYmluZCh0aGlzLnZhbHVlLCB0aGlzKTtcbiAgICAgIHRoaXMucHVibGlzaCA9IF9fYmluZCh0aGlzLnB1Ymxpc2gsIHRoaXMpO1xuICAgICAgdGhpcy5yZWFkID0gX19iaW5kKHRoaXMucmVhZCwgdGhpcyk7XG4gICAgICB0aGlzLnNldCA9IF9fYmluZCh0aGlzLnNldCwgdGhpcyk7XG4gICAgICB0aGlzLmFkYXB0ZXIgPSBfX2JpbmQodGhpcy5hZGFwdGVyLCB0aGlzKTtcbiAgICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZSA9IF9fYmluZCh0aGlzLmluaXRpYWxpemUsIHRoaXMpO1xuICAgICAgdGhpcy5wYXJzZSA9IF9fYmluZCh0aGlzLnBhcnNlLCB0aGlzKTtcbiAgICAgIHRoaXMucGFyc2UoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH1cblxuICAgIE9ic2VydmVyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGludGVyZmFjZXMsIGssIHBhdGgsIHJvb3QsIHYsIF9yZWYxO1xuICAgICAgaW50ZXJmYWNlcyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgICAgX3JlZjEgPSB0aGlzLnZpZXcuYWRhcHRlcnM7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoayBpbiBfcmVmMSkge1xuICAgICAgICAgIHYgPSBfcmVmMVtrXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGspO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH0pLmNhbGwodGhpcyk7XG4gICAgICBpZiAoX3JlZjEgPSB0aGlzLmtleXBhdGhbMF0sIF9faW5kZXhPZi5jYWxsKGludGVyZmFjZXMsIF9yZWYxKSA+PSAwKSB7XG4gICAgICAgIHJvb3QgPSB0aGlzLmtleXBhdGhbMF07XG4gICAgICAgIHBhdGggPSB0aGlzLmtleXBhdGguc3Vic3RyKDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdCA9IHRoaXMudmlldy5jb25maWcucm9vdEludGVyZmFjZTtcbiAgICAgICAgcGF0aCA9IHRoaXMua2V5cGF0aDtcbiAgICAgIH1cbiAgICAgIHRoaXMudG9rZW5zID0gUml2ZXRzLktleXBhdGhQYXJzZXIucGFyc2UocGF0aCwgaW50ZXJmYWNlcywgcm9vdCk7XG4gICAgICByZXR1cm4gdGhpcy5rZXkgPSB0aGlzLnRva2Vucy5wb3AoKTtcbiAgICB9O1xuXG4gICAgT2JzZXJ2ZXIucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqZWN0UGF0aCA9IFtdO1xuICAgICAgdGhpcy50YXJnZXQgPSB0aGlzLnJlYWxpemUoKTtcbiAgICAgIGlmICh0aGlzLnRhcmdldCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldCh0cnVlLCB0aGlzLmtleSwgdGhpcy50YXJnZXQsIHRoaXMuY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBPYnNlcnZlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbmV4dCwgb2xkVmFsdWU7XG4gICAgICBpZiAoKG5leHQgPSB0aGlzLnJlYWxpemUoKSkgIT09IHRoaXMudGFyZ2V0KSB7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5zZXQoZmFsc2UsIHRoaXMua2V5LCB0aGlzLnRhcmdldCwgdGhpcy5jYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5leHQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuc2V0KHRydWUsIHRoaXMua2V5LCBuZXh0LCB0aGlzLmNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBvbGRWYWx1ZSA9IHRoaXMudmFsdWUoKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBuZXh0O1xuICAgICAgICBpZiAodGhpcy52YWx1ZSgpICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JzZXJ2ZXIucHJvdG90eXBlLmFkYXB0ZXIgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLnZpZXcuYWRhcHRlcnNba2V5W1wiaW50ZXJmYWNlXCJdXTtcbiAgICB9O1xuXG4gICAgT2JzZXJ2ZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGFjdGl2ZSwga2V5LCBvYmosIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgYWN0aW9uO1xuICAgICAgYWN0aW9uID0gYWN0aXZlID8gJ3N1YnNjcmliZScgOiAndW5zdWJzY3JpYmUnO1xuICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlcihrZXkpW2FjdGlvbl0ob2JqLCBrZXkucGF0aCwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBPYnNlcnZlci5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uKGtleSwgb2JqKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGFwdGVyKGtleSkucmVhZChvYmosIGtleS5wYXRoKTtcbiAgICB9O1xuXG4gICAgT2JzZXJ2ZXIucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlcih0aGlzLmtleSkucHVibGlzaCh0aGlzLnRhcmdldCwgdGhpcy5rZXkucGF0aCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBPYnNlcnZlci5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnRhcmdldCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWQodGhpcy5rZXksIHRoaXMudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JzZXJ2ZXIucHJvdG90eXBlLnJlYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjdXJyZW50LCBpbmRleCwgcHJldiwgdG9rZW4sIHVucmVhY2hlZCwgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgY3VycmVudCA9IHRoaXMubW9kZWw7XG4gICAgICB1bnJlYWNoZWQgPSBudWxsO1xuICAgICAgX3JlZjEgPSB0aGlzLnRva2VucztcbiAgICAgIGZvciAoaW5kZXggPSBfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgaW5kZXggPSArK19pKSB7XG4gICAgICAgIHRva2VuID0gX3JlZjFbaW5kZXhdO1xuICAgICAgICBpZiAoY3VycmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKHRoaXMub2JqZWN0UGF0aFtpbmRleF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnQgIT09IChwcmV2ID0gdGhpcy5vYmplY3RQYXRoW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXQoZmFsc2UsIHRva2VuLCBwcmV2LCB0aGlzLnVwZGF0ZSk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0KHRydWUsIHRva2VuLCBjdXJyZW50LCB0aGlzLnVwZGF0ZSk7XG4gICAgICAgICAgICAgIHRoaXMub2JqZWN0UGF0aFtpbmRleF0gPSBjdXJyZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldCh0cnVlLCB0b2tlbiwgY3VycmVudCwgdGhpcy51cGRhdGUpO1xuICAgICAgICAgICAgdGhpcy5vYmplY3RQYXRoW2luZGV4XSA9IGN1cnJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLnJlYWQodG9rZW4sIGN1cnJlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh1bnJlYWNoZWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdW5yZWFjaGVkID0gaW5kZXg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwcmV2ID0gdGhpcy5vYmplY3RQYXRoW2luZGV4XSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoZmFsc2UsIHRva2VuLCBwcmV2LCB0aGlzLnVwZGF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodW5yZWFjaGVkICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5vYmplY3RQYXRoLnNwbGljZSh1bnJlYWNoZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfTtcblxuICAgIE9ic2VydmVyLnByb3RvdHlwZS51bm9ic2VydmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpbmRleCwgb2JqLCB0b2tlbiwgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIF9yZWYxID0gdGhpcy50b2tlbnM7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChpbmRleCA9IF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBpbmRleCA9ICsrX2kpIHtcbiAgICAgICAgdG9rZW4gPSBfcmVmMVtpbmRleF07XG4gICAgICAgIGlmIChvYmogPSB0aGlzLm9iamVjdFBhdGhbaW5kZXhdKSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLnNldChmYWxzZSwgdG9rZW4sIG9iaiwgdGhpcy51cGRhdGUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9ic2VydmVyO1xuXG4gIH0pKCk7XG5cbiAgUml2ZXRzLmJpbmRlcnMudGV4dCA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIGlmIChlbC50ZXh0Q29udGVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gZWwudGV4dENvbnRlbnQgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGVsLmlubmVyVGV4dCA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHMuYmluZGVycy5odG1sID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLmlubmVySFRNTCA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnO1xuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzLnNob3cgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJycgOiAnbm9uZSc7XG4gIH07XG5cbiAgUml2ZXRzLmJpbmRlcnMuaGlkZSA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnbm9uZScgOiAnJztcbiAgfTtcblxuICBSaXZldHMuYmluZGVycy5lbmFibGVkID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLmRpc2FibGVkID0gIXZhbHVlO1xuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzLmRpc2FibGVkID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLmRpc2FibGVkID0gISF2YWx1ZTtcbiAgfTtcblxuICBSaXZldHMuYmluZGVycy5jaGVja2VkID0ge1xuICAgIHB1Ymxpc2hlczogdHJ1ZSxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLmJpbmRFdmVudChlbCwgJ2NoYW5nZScsIHRoaXMucHVibGlzaCk7XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwudW5iaW5kRXZlbnQoZWwsICdjaGFuZ2UnLCB0aGlzLnB1Ymxpc2gpO1xuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICB2YXIgX3JlZjE7XG4gICAgICBpZiAoZWwudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICByZXR1cm4gZWwuY2hlY2tlZCA9ICgoX3JlZjEgPSBlbC52YWx1ZSkgIT0gbnVsbCA/IF9yZWYxLnRvU3RyaW5nKCkgOiB2b2lkIDApID09PSAodmFsdWUgIT0gbnVsbCA/IHZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQgPSAhIXZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBSaXZldHMuYmluZGVycy51bmNoZWNrZWQgPSB7XG4gICAgcHVibGlzaGVzOiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgJ2NoYW5nZScsIHRoaXMucHVibGlzaCk7XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIGlmIChlbC50eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAgIHJldHVybiBlbC5jaGVja2VkID0gKChfcmVmMSA9IGVsLnZhbHVlKSAhPSBudWxsID8gX3JlZjEudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09ICh2YWx1ZSAhPSBudWxsID8gdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZWwuY2hlY2tlZCA9ICF2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzLmJpbmRlcnMudmFsdWUgPSB7XG4gICAgcHVibGlzaGVzOiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgJ2NoYW5nZScsIHRoaXMucHVibGlzaCk7XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHZhciBvLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyLCBfcmVmMywgX3Jlc3VsdHM7XG4gICAgICBpZiAod2luZG93LmpRdWVyeSAhPSBudWxsKSB7XG4gICAgICAgIGVsID0galF1ZXJ5KGVsKTtcbiAgICAgICAgaWYgKCh2YWx1ZSAhPSBudWxsID8gdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09ICgoX3JlZjEgPSBlbC52YWwoKSkgIT0gbnVsbCA/IF9yZWYxLnRvU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGVsLnZhbCh2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlbC50eXBlID09PSAnc2VsZWN0LW11bHRpcGxlJykge1xuICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBlbC5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICBvID0gZWxbX2ldO1xuICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKG8uc2VsZWN0ZWQgPSAoX3JlZjIgPSBvLnZhbHVlLCBfX2luZGV4T2YuY2FsbCh2YWx1ZSwgX3JlZjIpID49IDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoKHZhbHVlICE9IG51bGwgPyB2YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKChfcmVmMyA9IGVsLnZhbHVlKSAhPSBudWxsID8gX3JlZjMudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZWwudmFsdWUgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBSaXZldHMuYmluZGVyc1tcImlmXCJdID0ge1xuICAgIGJsb2NrOiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgYXR0ciwgZGVjbGFyYXRpb247XG4gICAgICBpZiAodGhpcy5tYXJrZXIgPT0gbnVsbCkge1xuICAgICAgICBhdHRyID0gW3RoaXMudmlldy5jb25maWcucHJlZml4LCB0aGlzLnR5cGVdLmpvaW4oJy0nKS5yZXBsYWNlKCctLScsICctJyk7XG4gICAgICAgIGRlY2xhcmF0aW9uID0gZWwuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgICB0aGlzLm1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCIgcml2ZXRzOiBcIiArIHRoaXMudHlwZSArIFwiIFwiICsgZGVjbGFyYXRpb24gKyBcIiBcIik7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5tYXJrZXIsIGVsKTtcbiAgICAgICAgcmV0dXJuIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIHJldHVybiAoX3JlZjEgPSB0aGlzLm5lc3RlZCkgIT0gbnVsbCA/IF9yZWYxLnVuYmluZCgpIDogdm9pZCAwO1xuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICB2YXIga2V5LCBtb2RlbCwgbW9kZWxzLCBvcHRpb25zLCBfcmVmMTtcbiAgICAgIGlmICghIXZhbHVlID09PSAodGhpcy5uZXN0ZWQgPT0gbnVsbCkpIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgbW9kZWxzID0ge307XG4gICAgICAgICAgX3JlZjEgPSB0aGlzLnZpZXcubW9kZWxzO1xuICAgICAgICAgIGZvciAoa2V5IGluIF9yZWYxKSB7XG4gICAgICAgICAgICBtb2RlbCA9IF9yZWYxW2tleV07XG4gICAgICAgICAgICBtb2RlbHNba2V5XSA9IG1vZGVsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgYmluZGVyczogdGhpcy52aWV3Lm9wdGlvbnMuYmluZGVycyxcbiAgICAgICAgICAgIGZvcm1hdHRlcnM6IHRoaXMudmlldy5vcHRpb25zLmZvcm1hdHRlcnMsXG4gICAgICAgICAgICBhZGFwdGVyczogdGhpcy52aWV3Lm9wdGlvbnMuYWRhcHRlcnMsXG4gICAgICAgICAgICBjb25maWc6IHRoaXMudmlldy5vcHRpb25zLmNvbmZpZ1xuICAgICAgICAgIH07XG4gICAgICAgICAgKHRoaXMubmVzdGVkID0gbmV3IFJpdmV0cy5WaWV3KGVsLCBtb2RlbHMsIG9wdGlvbnMpKS5iaW5kKCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubWFya2VyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCB0aGlzLm1hcmtlci5uZXh0U2libGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICAgICAgdGhpcy5uZXN0ZWQudW5iaW5kKCk7XG4gICAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLm5lc3RlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIHJldHVybiAoX3JlZjEgPSB0aGlzLm5lc3RlZCkgIT0gbnVsbCA/IF9yZWYxLnVwZGF0ZShtb2RlbHMpIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHMuYmluZGVycy51bmxlc3MgPSB7XG4gICAgYmxvY2s6IHRydWUsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuYmluZGVyc1tcImlmXCJdLmJpbmQuY2FsbCh0aGlzLCBlbCk7XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5iaW5kZXJzW1wiaWZcIl0udW5iaW5kLmNhbGwodGhpcyk7XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBSaXZldHMuYmluZGVyc1tcImlmXCJdLnJvdXRpbmUuY2FsbCh0aGlzLCBlbCwgIXZhbHVlKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLmJpbmRlcnNbXCJpZlwiXS51cGRhdGUuY2FsbCh0aGlzLCBtb2RlbHMpO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHMuYmluZGVyc1snb24tKiddID0ge1xuICAgIFwiZnVuY3Rpb25cIjogdHJ1ZSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBpZiAodGhpcy5oYW5kbGVyKSB7XG4gICAgICAgIHJldHVybiBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgdGhpcy5hcmdzWzBdLCB0aGlzLmhhbmRsZXIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5oYW5kbGVyKSB7XG4gICAgICAgIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCB0aGlzLmFyZ3NbMF0sIHRoaXMuaGFuZGxlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwuYmluZEV2ZW50KGVsLCB0aGlzLmFyZ3NbMF0sIHRoaXMuaGFuZGxlciA9IHRoaXMuZXZlbnRIYW5kbGVyKHZhbHVlKSk7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzWydlYWNoLSonXSA9IHtcbiAgICBibG9jazogdHJ1ZSxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgdmFyIGF0dHI7XG4gICAgICBpZiAodGhpcy5tYXJrZXIgPT0gbnVsbCkge1xuICAgICAgICBhdHRyID0gW3RoaXMudmlldy5jb25maWcucHJlZml4LCB0aGlzLnR5cGVdLmpvaW4oJy0nKS5yZXBsYWNlKCctLScsICctJyk7XG4gICAgICAgIHRoaXMubWFya2VyID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIiByaXZldHM6IFwiICsgdGhpcy50eXBlICsgXCIgXCIpO1xuICAgICAgICB0aGlzLml0ZXJhdGVkID0gW107XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5tYXJrZXIsIGVsKTtcbiAgICAgICAgcmV0dXJuIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgdmFyIHZpZXcsIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBpZiAodGhpcy5pdGVyYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYxID0gdGhpcy5pdGVyYXRlZDtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIHZpZXcgPSBfcmVmMVtfaV07XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaCh2aWV3LnVuYmluZCgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgY29sbGVjdGlvbikge1xuICAgICAgdmFyIGJpbmRpbmcsIGRhdGEsIGksIGluZGV4LCBrLCBrZXksIG1vZGVsLCBtb2RlbE5hbWUsIG9wdGlvbnMsIHByZXZpb3VzLCB0ZW1wbGF0ZSwgdiwgdmlldywgX2ksIF9qLCBfaywgX2xlbiwgX2xlbjEsIF9sZW4yLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNCwgX3Jlc3VsdHM7XG4gICAgICBtb2RlbE5hbWUgPSB0aGlzLmFyZ3NbMF07XG4gICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbiB8fCBbXTtcbiAgICAgIGlmICh0aGlzLml0ZXJhdGVkLmxlbmd0aCA+IGNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIF9yZWYxID0gQXJyYXkodGhpcy5pdGVyYXRlZC5sZW5ndGggLSBjb2xsZWN0aW9uLmxlbmd0aCk7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBpID0gX3JlZjFbX2ldO1xuICAgICAgICAgIHZpZXcgPSB0aGlzLml0ZXJhdGVkLnBvcCgpO1xuICAgICAgICAgIHZpZXcudW5iaW5kKCk7XG4gICAgICAgICAgdGhpcy5tYXJrZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh2aWV3LmVsc1swXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaW5kZXggPSBfaiA9IDAsIF9sZW4xID0gY29sbGVjdGlvbi5sZW5ndGg7IF9qIDwgX2xlbjE7IGluZGV4ID0gKytfaikge1xuICAgICAgICBtb2RlbCA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICBkYXRhID0ge307XG4gICAgICAgIGRhdGFbbW9kZWxOYW1lXSA9IG1vZGVsO1xuICAgICAgICBpZiAodGhpcy5pdGVyYXRlZFtpbmRleF0gPT0gbnVsbCkge1xuICAgICAgICAgIF9yZWYyID0gdGhpcy52aWV3Lm1vZGVscztcbiAgICAgICAgICBmb3IgKGtleSBpbiBfcmVmMikge1xuICAgICAgICAgICAgbW9kZWwgPSBfcmVmMltrZXldO1xuICAgICAgICAgICAgaWYgKGRhdGFba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGRhdGFba2V5XSA9IG1vZGVsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBwcmV2aW91cyA9IHRoaXMuaXRlcmF0ZWQubGVuZ3RoID8gdGhpcy5pdGVyYXRlZFt0aGlzLml0ZXJhdGVkLmxlbmd0aCAtIDFdLmVsc1swXSA6IHRoaXMubWFya2VyO1xuICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBiaW5kZXJzOiB0aGlzLnZpZXcub3B0aW9ucy5iaW5kZXJzLFxuICAgICAgICAgICAgZm9ybWF0dGVyczogdGhpcy52aWV3Lm9wdGlvbnMuZm9ybWF0dGVycyxcbiAgICAgICAgICAgIGFkYXB0ZXJzOiB0aGlzLnZpZXcub3B0aW9ucy5hZGFwdGVycyxcbiAgICAgICAgICAgIGNvbmZpZzoge31cbiAgICAgICAgICB9O1xuICAgICAgICAgIF9yZWYzID0gdGhpcy52aWV3Lm9wdGlvbnMuY29uZmlnO1xuICAgICAgICAgIGZvciAoayBpbiBfcmVmMykge1xuICAgICAgICAgICAgdiA9IF9yZWYzW2tdO1xuICAgICAgICAgICAgb3B0aW9ucy5jb25maWdba10gPSB2O1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcHRpb25zLmNvbmZpZy5wcmVsb2FkRGF0YSA9IHRydWU7XG4gICAgICAgICAgdGVtcGxhdGUgPSBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgdmlldyA9IG5ldyBSaXZldHMuVmlldyh0ZW1wbGF0ZSwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgICAgdmlldy5iaW5kKCk7XG4gICAgICAgICAgdGhpcy5pdGVyYXRlZC5wdXNoKHZpZXcpO1xuICAgICAgICAgIHRoaXMubWFya2VyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRlbXBsYXRlLCBwcmV2aW91cy5uZXh0U2libGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pdGVyYXRlZFtpbmRleF0ubW9kZWxzW21vZGVsTmFtZV0gIT09IG1vZGVsKSB7XG4gICAgICAgICAgdGhpcy5pdGVyYXRlZFtpbmRleF0udXBkYXRlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZWwubm9kZU5hbWUgPT09ICdPUFRJT04nKSB7XG4gICAgICAgIF9yZWY0ID0gdGhpcy52aWV3LmJpbmRpbmdzO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmNC5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICBiaW5kaW5nID0gX3JlZjRbX2tdO1xuICAgICAgICAgIGlmIChiaW5kaW5nLmVsID09PSB0aGlzLm1hcmtlci5wYXJlbnROb2RlICYmIGJpbmRpbmcudHlwZSA9PT0gJ3ZhbHVlJykge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChiaW5kaW5nLnN5bmMoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBkYXRhLCBrZXksIG1vZGVsLCB2aWV3LCBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgZGF0YSA9IHt9O1xuICAgICAgZm9yIChrZXkgaW4gbW9kZWxzKSB7XG4gICAgICAgIG1vZGVsID0gbW9kZWxzW2tleV07XG4gICAgICAgIGlmIChrZXkgIT09IHRoaXMuYXJnc1swXSkge1xuICAgICAgICAgIGRhdGFba2V5XSA9IG1vZGVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfcmVmMSA9IHRoaXMuaXRlcmF0ZWQ7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICB2aWV3ID0gX3JlZjFbX2ldO1xuICAgICAgICBfcmVzdWx0cy5wdXNoKHZpZXcudXBkYXRlKGRhdGEpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzLmJpbmRlcnNbJ2NsYXNzLSonXSA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHZhciBlbENsYXNzO1xuICAgIGVsQ2xhc3MgPSBcIiBcIiArIGVsLmNsYXNzTmFtZSArIFwiIFwiO1xuICAgIGlmICghdmFsdWUgPT09IChlbENsYXNzLmluZGV4T2YoXCIgXCIgKyB0aGlzLmFyZ3NbMF0gKyBcIiBcIikgIT09IC0xKSkge1xuICAgICAgcmV0dXJuIGVsLmNsYXNzTmFtZSA9IHZhbHVlID8gXCJcIiArIGVsLmNsYXNzTmFtZSArIFwiIFwiICsgdGhpcy5hcmdzWzBdIDogZWxDbGFzcy5yZXBsYWNlKFwiIFwiICsgdGhpcy5hcmdzWzBdICsgXCIgXCIsICcgJykudHJpbSgpO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHMuYmluZGVyc1snKiddID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZWwuc2V0QXR0cmlidXRlKHRoaXMudHlwZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMudHlwZSk7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0cy5hZGFwdGVyc1snLiddID0ge1xuICAgIGlkOiAnX3J2JyxcbiAgICBjb3VudGVyOiAwLFxuICAgIHdlYWttYXA6IHt9LFxuICAgIHdlYWtSZWZlcmVuY2U6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGlkO1xuICAgICAgaWYgKG9ialt0aGlzLmlkXSA9PSBudWxsKSB7XG4gICAgICAgIGlkID0gdGhpcy5jb3VudGVyKys7XG4gICAgICAgIHRoaXMud2Vha21hcFtpZF0gPSB7XG4gICAgICAgICAgY2FsbGJhY2tzOiB7fVxuICAgICAgICB9O1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCB0aGlzLmlkLCB7XG4gICAgICAgICAgdmFsdWU6IGlkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMud2Vha21hcFtvYmpbdGhpcy5pZF1dO1xuICAgIH0sXG4gICAgc3R1YkZ1bmN0aW9uOiBmdW5jdGlvbihvYmosIGZuKSB7XG4gICAgICB2YXIgbWFwLCBvcmlnaW5hbCwgd2Vha21hcDtcbiAgICAgIG9yaWdpbmFsID0gb2JqW2ZuXTtcbiAgICAgIG1hcCA9IHRoaXMud2Vha1JlZmVyZW5jZShvYmopO1xuICAgICAgd2Vha21hcCA9IHRoaXMud2Vha21hcDtcbiAgICAgIHJldHVybiBvYmpbZm5dID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjYWxsYmFjaywgaywgciwgcmVzcG9uc2UsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNDtcbiAgICAgICAgcmVzcG9uc2UgPSBvcmlnaW5hbC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICAgIF9yZWYxID0gbWFwLnBvaW50ZXJzO1xuICAgICAgICBmb3IgKHIgaW4gX3JlZjEpIHtcbiAgICAgICAgICBrID0gX3JlZjFbcl07XG4gICAgICAgICAgX3JlZjQgPSAoX3JlZjIgPSAoX3JlZjMgPSB3ZWFrbWFwW3JdKSAhPSBudWxsID8gX3JlZjMuY2FsbGJhY2tzW2tdIDogdm9pZCAwKSAhPSBudWxsID8gX3JlZjIgOiBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWY0Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IF9yZWY0W19pXTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH07XG4gICAgfSxcbiAgICBvYnNlcnZlTXV0YXRpb25zOiBmdW5jdGlvbihvYmosIHJlZiwga2V5cGF0aCkge1xuICAgICAgdmFyIGZuLCBmdW5jdGlvbnMsIG1hcCwgX2Jhc2UsIF9pLCBfbGVuO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICBtYXAgPSB0aGlzLndlYWtSZWZlcmVuY2Uob2JqKTtcbiAgICAgICAgaWYgKG1hcC5wb2ludGVycyA9PSBudWxsKSB7XG4gICAgICAgICAgbWFwLnBvaW50ZXJzID0ge307XG4gICAgICAgICAgZnVuY3Rpb25zID0gWydwdXNoJywgJ3BvcCcsICdzaGlmdCcsICd1bnNoaWZ0JywgJ3NvcnQnLCAncmV2ZXJzZScsICdzcGxpY2UnXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZ1bmN0aW9ucy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgZm4gPSBmdW5jdGlvbnNbX2ldO1xuICAgICAgICAgICAgdGhpcy5zdHViRnVuY3Rpb24ob2JqLCBmbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgoX2Jhc2UgPSBtYXAucG9pbnRlcnMpW3JlZl0gPT0gbnVsbCkge1xuICAgICAgICAgIF9iYXNlW3JlZl0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX19pbmRleE9mLmNhbGwobWFwLnBvaW50ZXJzW3JlZl0sIGtleXBhdGgpIDwgMCkge1xuICAgICAgICAgIHJldHVybiBtYXAucG9pbnRlcnNbcmVmXS5wdXNoKGtleXBhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1bm9ic2VydmVNdXRhdGlvbnM6IGZ1bmN0aW9uKG9iaiwgcmVmLCBrZXlwYXRoKSB7XG4gICAgICB2YXIga2V5cGF0aHMsIF9yZWYxO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqICYmIChvYmpbdGhpcy5pZF0gIT0gbnVsbCkpKSB7XG4gICAgICAgIGlmIChrZXlwYXRocyA9IChfcmVmMSA9IHRoaXMud2Vha1JlZmVyZW5jZShvYmopLnBvaW50ZXJzKSAhPSBudWxsID8gX3JlZjFbcmVmXSA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiBrZXlwYXRocy5zcGxpY2Uoa2V5cGF0aHMuaW5kZXhPZihrZXlwYXRoKSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24ob2JqLCBrZXlwYXRoLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGNhbGxiYWNrcywgdmFsdWUsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIGNhbGxiYWNrcyA9IHRoaXMud2Vha1JlZmVyZW5jZShvYmopLmNhbGxiYWNrcztcbiAgICAgIGlmIChjYWxsYmFja3Nba2V5cGF0aF0gPT0gbnVsbCkge1xuICAgICAgICBjYWxsYmFja3Nba2V5cGF0aF0gPSBbXTtcbiAgICAgICAgdmFsdWUgPSBvYmpba2V5cGF0aF07XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleXBhdGgsIHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgX3JlZjEgPSBjYWxsYmFja3Nba2V5cGF0aF07XG4gICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IF9yZWYxW19pXTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5vYnNlcnZlTXV0YXRpb25zKG5ld1ZhbHVlLCBvYmpbX3RoaXMuaWRdLCBrZXlwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKF9faW5kZXhPZi5jYWxsKGNhbGxiYWNrc1trZXlwYXRoXSwgY2FsbGJhY2spIDwgMCkge1xuICAgICAgICBjYWxsYmFja3Nba2V5cGF0aF0ucHVzaChjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYnNlcnZlTXV0YXRpb25zKG9ialtrZXlwYXRoXSwgb2JqW3RoaXMuaWRdLCBrZXlwYXRoKTtcbiAgICB9LFxuICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbihvYmosIGtleXBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY2FsbGJhY2tzO1xuICAgICAgY2FsbGJhY2tzID0gdGhpcy53ZWFrbWFwW29ialt0aGlzLmlkXV0uY2FsbGJhY2tzW2tleXBhdGhdO1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayksIDEpO1xuICAgICAgcmV0dXJuIHRoaXMudW5vYnNlcnZlTXV0YXRpb25zKG9ialtrZXlwYXRoXSwgb2JqW3RoaXMuaWRdLCBrZXlwYXRoKTtcbiAgICB9LFxuICAgIHJlYWQ6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCkge1xuICAgICAgcmV0dXJuIG9ialtrZXlwYXRoXTtcbiAgICB9LFxuICAgIHB1Ymxpc2g6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5cGF0aF0gPSB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzLmZhY3RvcnkgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gICAgZXhwb3J0cy5fID0gUml2ZXRzO1xuICAgIGV4cG9ydHMuYmluZGVycyA9IFJpdmV0cy5iaW5kZXJzO1xuICAgIGV4cG9ydHMuY29tcG9uZW50cyA9IFJpdmV0cy5jb21wb25lbnRzO1xuICAgIGV4cG9ydHMuZm9ybWF0dGVycyA9IFJpdmV0cy5mb3JtYXR0ZXJzO1xuICAgIGV4cG9ydHMuYWRhcHRlcnMgPSBSaXZldHMuYWRhcHRlcnM7XG4gICAgZXhwb3J0cy5jb25maWcgPSBSaXZldHMuY29uZmlnO1xuICAgIGV4cG9ydHMuY29uZmlndXJlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIHByb3BlcnR5LCB2YWx1ZTtcbiAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuICAgICAgZm9yIChwcm9wZXJ0eSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHZhbHVlID0gb3B0aW9uc1twcm9wZXJ0eV07XG4gICAgICAgIFJpdmV0cy5jb25maWdbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24oZWwsIG1vZGVscywgb3B0aW9ucykge1xuICAgICAgdmFyIHZpZXc7XG4gICAgICBpZiAobW9kZWxzID09IG51bGwpIHtcbiAgICAgICAgbW9kZWxzID0ge307XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHZpZXcgPSBuZXcgUml2ZXRzLlZpZXcoZWwsIG1vZGVscywgb3B0aW9ucyk7XG4gICAgICB2aWV3LmJpbmQoKTtcbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH07XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIFJpdmV0cy5mYWN0b3J5KGV4cG9ydHMpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZnVuY3Rpb24oZXhwb3J0cykge1xuICAgICAgUml2ZXRzLmZhY3RvcnkodGhpcy5yaXZldHMgPSBleHBvcnRzKTtcbiAgICAgIHJldHVybiBleHBvcnRzO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIFJpdmV0cy5mYWN0b3J5KHRoaXMucml2ZXRzID0ge30pO1xuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNy4xXG52YXIgR2F0ZSwgU3ByaW5nZm9ybSxcbiAgX19zbGljZSA9IFtdLnNsaWNlO1xuXG5TcHJpbmdmb3JtID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBTcHJpbmdmb3JtKGF0dHJzKSB7XG4gICAgdmFyIGZpZWxkLCBrZXksIHZhbHVlLCBfaSwgX2xlbiwgX3JlZjtcbiAgICBpZiAoYXR0cnMgPT0gbnVsbCkge1xuICAgICAgYXR0cnMgPSB7fTtcbiAgICB9XG4gICAgZm9yIChrZXkgaW4gYXR0cnMpIHtcbiAgICAgIHZhbHVlID0gYXR0cnNba2V5XTtcbiAgICAgIHRoaXNba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5maWVsZEVycm9ycyA9PSBudWxsKSB7XG4gICAgICB0aGlzLmZpZWxkRXJyb3JzID0ge307XG4gICAgfVxuICAgIHRoaXMuZm9ybUVycm9yID0gbnVsbDtcbiAgICB0aGlzLnZhbGlkYXRvcnMgPSB0aGlzLnZhbGlkYXRvcnMgPyB0aGlzLnZhbGlkYXRvcnMuc2xpY2UoKSA6IFtdO1xuICAgIGlmICh0aGlzLmZpZWxkcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLmZpZWxkcyA9IFtdO1xuICAgIH1cbiAgICBfcmVmID0gdGhpcy5maWVsZHM7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBmaWVsZCA9IF9yZWZbX2ldO1xuICAgICAgdGhpcy5maWVsZHNbZmllbGQubmFtZV0gPSBmaWVsZDtcbiAgICB9XG4gIH1cblxuICBTcHJpbmdmb3JtLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUucHJ1bmVkRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfKGRhdGEpLnBpY2soXyh0aGlzLmZpZWxkcykucGx1Y2soJ25hbWUnKSk7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUuZXJyb3JzID0gZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZm9ybUVycm9yID0gZXJyb3JzLmZvcm1FcnJvcjtcbiAgICAgIHRoaXMuZmllbGRFcnJvcnMgPSBlcnJvcnMuZmllbGRFcnJvcnMgfHwgW107XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZm9ybUVycm9yOiB0aGlzLmZvcm1FcnJvcixcbiAgICAgICAgZmllbGRFcnJvcnM6IHRoaXMuZmllbGRFcnJvcnNcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIFNwcmluZ2Zvcm0ucHJvdG90eXBlLnZhbGlkYXRvciA9IGZ1bmN0aW9uKHZhbGlkYXRvcikge1xuICAgIHRoaXMudmFsaWRhdG9ycy5wdXNoKHZhbGlkYXRvcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbihkb25lKSB7XG4gICAgdmFyIGdhdGUsIHZhbGlkYXRvciwgX2ksIF9sZW4sIF9yZWY7XG4gICAgdGhpcy5mb3JtRXJyb3IgPSBudWxsO1xuICAgIHRoaXMuZmllbGRFcnJvcnMgPSB7fTtcbiAgICBnYXRlID0gbmV3IEdhdGUoKTtcbiAgICBfcmVmID0gdGhpcy52YWxpZGF0b3JzIHx8IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgdmFsaWRhdG9yID0gX3JlZltfaV07XG4gICAgICBpZiAodmFsaWRhdG9yLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdmFsaWRhdG9yKHRoaXMsIGdhdGUuY2FsbGJhY2soKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZGF0b3IodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGdhdGUuZmluaXNoZWQoZG9uZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUuaGFzRXJyb3JzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5mb3JtRXJyb3IpIHx8IE9iamVjdC5rZXlzKHRoaXMuZmllbGRFcnJvcnMpLnNvbWUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKF90aGlzLmZpZWxkRXJyb3JzW2tleV0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUuc3VibWl0ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQgIT0gbnVsbCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgdGhpcy5wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMucHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uKGRvbmUpIHtcbiAgICByZXR1cm4gZG9uZSgpO1xuICB9O1xuXG4gIFNwcmluZ2Zvcm0ucHJvdG90eXBlLnByb2Nlc3NvciA9IGZ1bmN0aW9uKHByb2Nlc3MpIHtcbiAgICB0aGlzLnByb2Nlc3MgPSBwcm9jZXNzO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBTcHJpbmdmb3JtO1xuXG59KSgpO1xuXG5TcHJpbmdmb3JtLnJlcXVpcmVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gIHJldHVybiBmdW5jdGlvbihfYXJnKSB7XG4gICAgdmFyIGRhdGEsIGZpZWxkLCBmaWVsZEVycm9ycywgdmFsdWUsIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICBkYXRhID0gX2FyZy5kYXRhLCBmaWVsZEVycm9ycyA9IF9hcmcuZmllbGRFcnJvcnM7XG4gICAgX3Jlc3VsdHMgPSBbXTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZpZWxkcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgZmllbGQgPSBmaWVsZHNbX2ldO1xuICAgICAgdmFsdWUgPSBkYXRhW2ZpZWxkXTtcbiAgICAgIGlmICghKHZhbHVlIHx8IHZhbHVlID09PSBmYWxzZSkpIHtcbiAgICAgICAgX3Jlc3VsdHMucHVzaChmaWVsZEVycm9yc1tmaWVsZF0gPSAncmVxdWlyZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9O1xufTtcblxuR2F0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gR2F0ZSgpIHtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMucmV0dXJuZWRDb3VudCA9IDA7XG4gIH1cblxuICBHYXRlLnByb3RvdHlwZS5jaGVja0RvbmUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5yZXR1cm5lZENvdW50ID09PSB0aGlzLmNhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KHRoaXMuZG9uZSwgMCk7XG4gICAgfVxuICB9O1xuXG4gIEdhdGUucHJvdG90eXBlLmNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhbGxiYWNrLCBjYWxsZWQ7XG4gICAgY2FsbGVkID0gZmFsc2U7XG4gICAgY2FsbGJhY2sgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGNhbGxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICBfdGhpcy5yZXR1cm5lZENvdW50ICs9IDE7XG4gICAgICAgIHJldHVybiBfdGhpcy5jaGVja0RvbmUoKTtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgdGhpcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgcmV0dXJuIGNhbGxiYWNrO1xuICB9O1xuXG4gIEdhdGUucHJvdG90eXBlLmZpbmlzaGVkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLmRvbmUgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gdGhpcy5jaGVja0RvbmUoKTtcbiAgfTtcblxuICByZXR1cm4gR2F0ZTtcblxufSkoKTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gU3ByaW5nZm9ybTtcbn1cbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS43LjFcbihmdW5jdGlvbigpIHtcbiAgdmFyIFRlYWN1cCwgZG9jdHlwZXMsIGVsZW1lbnRzLCBtZXJnZV9lbGVtZW50cywgdGFnTmFtZSwgX2ZuLCBfZm4xLCBfZm4yLCBfaSwgX2osIF9rLCBfbGVuLCBfbGVuMSwgX2xlbjIsIF9yZWYsIF9yZWYxLCBfcmVmMixcbiAgICBfX3NsaWNlID0gW10uc2xpY2UsXG4gICAgX19pbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbiAgZG9jdHlwZXMgPSB7XG4gICAgJ2RlZmF1bHQnOiAnPCFET0NUWVBFIGh0bWw+JyxcbiAgICAnNSc6ICc8IURPQ1RZUEUgaHRtbD4nLFxuICAgICd4bWwnOiAnPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwidXRmLThcIiA/PicsXG4gICAgJ3RyYW5zaXRpb25hbCc6ICc8IURPQ1RZUEUgaHRtbCBQVUJMSUMgXCItLy9XM0MvL0RURCBYSFRNTCAxLjAgVHJhbnNpdGlvbmFsLy9FTlwiIFwiaHR0cDovL3d3dy53My5vcmcvVFIveGh0bWwxL0RURC94aHRtbDEtdHJhbnNpdGlvbmFsLmR0ZFwiPicsXG4gICAgJ3N0cmljdCc6ICc8IURPQ1RZUEUgaHRtbCBQVUJMSUMgXCItLy9XM0MvL0RURCBYSFRNTCAxLjAgU3RyaWN0Ly9FTlwiIFwiaHR0cDovL3d3dy53My5vcmcvVFIveGh0bWwxL0RURC94aHRtbDEtc3RyaWN0LmR0ZFwiPicsXG4gICAgJ2ZyYW1lc2V0JzogJzwhRE9DVFlQRSBodG1sIFBVQkxJQyBcIi0vL1czQy8vRFREIFhIVE1MIDEuMCBGcmFtZXNldC8vRU5cIiBcImh0dHA6Ly93d3cudzMub3JnL1RSL3hodG1sMS9EVEQveGh0bWwxLWZyYW1lc2V0LmR0ZFwiPicsXG4gICAgJzEuMSc6ICc8IURPQ1RZUEUgaHRtbCBQVUJMSUMgXCItLy9XM0MvL0RURCBYSFRNTCAxLjEvL0VOXCIgXCJodHRwOi8vd3d3LnczLm9yZy9UUi94aHRtbDExL0RURC94aHRtbDExLmR0ZFwiPicsXG4gICAgJ2Jhc2ljJzogJzwhRE9DVFlQRSBodG1sIFBVQkxJQyBcIi0vL1czQy8vRFREIFhIVE1MIEJhc2ljIDEuMS8vRU5cIiBcImh0dHA6Ly93d3cudzMub3JnL1RSL3hodG1sLWJhc2ljL3hodG1sLWJhc2ljMTEuZHRkXCI+JyxcbiAgICAnbW9iaWxlJzogJzwhRE9DVFlQRSBodG1sIFBVQkxJQyBcIi0vL1dBUEZPUlVNLy9EVEQgWEhUTUwgTW9iaWxlIDEuMi8vRU5cIiBcImh0dHA6Ly93d3cub3Blbm1vYmlsZWFsbGlhbmNlLm9yZy90ZWNoL0RURC94aHRtbC1tb2JpbGUxMi5kdGRcIj4nLFxuICAgICdjZSc6ICc8IURPQ1RZUEUgaHRtbCBQVUJMSUMgXCItLy9XM0MvL0RURCBYSFRNTCAxLjAgVHJhbnNpdGlvbmFsLy9FTlwiIFwiY2UtaHRtbC0xLjAtdHJhbnNpdGlvbmFsLmR0ZFwiPidcbiAgfTtcblxuICBlbGVtZW50cyA9IHtcbiAgICByZWd1bGFyOiAnYSBhYmJyIGFkZHJlc3MgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiIGJkaSBiZG8gYmxvY2txdW90ZSBib2R5IGJ1dHRvbiBjYW52YXMgY2FwdGlvbiBjaXRlIGNvZGUgY29sZ3JvdXAgZGF0YWxpc3QgZGQgZGVsIGRldGFpbHMgZGZuIGRpdiBkbCBkdCBlbSBmaWVsZHNldCBmaWdjYXB0aW9uIGZpZ3VyZSBmb290ZXIgZm9ybSBoMSBoMiBoMyBoNCBoNSBoNiBoZWFkIGhlYWRlciBoZ3JvdXAgaHRtbCBpIGlmcmFtZSBpbnMga2JkIGxhYmVsIGxlZ2VuZCBsaSBtYXAgbWFyayBtZW51IG1ldGVyIG5hdiBub3NjcmlwdCBvYmplY3Qgb2wgb3B0Z3JvdXAgb3B0aW9uIG91dHB1dCBwIHByZSBwcm9ncmVzcyBxIHJwIHJ0IHJ1YnkgcyBzYW1wIHNlY3Rpb24gc2VsZWN0IHNtYWxsIHNwYW4gc3Ryb25nIHN1YiBzdW1tYXJ5IHN1cCB0YWJsZSB0Ym9keSB0ZCB0ZXh0YXJlYSB0Zm9vdCB0aCB0aGVhZCB0aW1lIHRpdGxlIHRyIHUgdWwgdmlkZW8nLFxuICAgIHJhdzogJ3NjcmlwdCBzdHlsZScsXG4gICAgXCJ2b2lkXCI6ICdhcmVhIGJhc2UgYnIgY29sIGNvbW1hbmQgZW1iZWQgaHIgaW1nIGlucHV0IGtleWdlbiBsaW5rIG1ldGEgcGFyYW0gc291cmNlIHRyYWNrIHdicicsXG4gICAgb2Jzb2xldGU6ICdhcHBsZXQgYWNyb255bSBiZ3NvdW5kIGRpciBmcmFtZXNldCBub2ZyYW1lcyBpc2luZGV4IGxpc3RpbmcgbmV4dGlkIG5vZW1iZWQgcGxhaW50ZXh0IHJiIHN0cmlrZSB4bXAgYmlnIGJsaW5rIGNlbnRlciBmb250IG1hcnF1ZWUgbXVsdGljb2wgbm9iciBzcGFjZXIgdHQnLFxuICAgIG9ic29sZXRlX3ZvaWQ6ICdiYXNlZm9udCBmcmFtZSdcbiAgfTtcblxuICBtZXJnZV9lbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhLCBhcmdzLCBlbGVtZW50LCByZXN1bHQsIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWY7XG4gICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgcmVzdWx0ID0gW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBhcmdzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBhID0gYXJnc1tfaV07XG4gICAgICBfcmVmID0gZWxlbWVudHNbYV0uc3BsaXQoJyAnKTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGVsZW1lbnQgPSBfcmVmW19qXTtcbiAgICAgICAgaWYgKF9faW5kZXhPZi5jYWxsKHJlc3VsdCwgZWxlbWVudCkgPCAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBUZWFjdXAgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gVGVhY3VwKCkge1xuICAgICAgdGhpcy5odG1sT3V0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnJlc2V0QnVmZmVyID0gZnVuY3Rpb24oaHRtbCkge1xuICAgICAgdmFyIHByZXZpb3VzO1xuICAgICAgaWYgKGh0bWwgPT0gbnVsbCkge1xuICAgICAgICBodG1sID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHByZXZpb3VzID0gdGhpcy5odG1sT3V0O1xuICAgICAgdGhpcy5odG1sT3V0ID0gaHRtbDtcbiAgICAgIHJldHVybiBwcmV2aW91cztcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBwcmV2aW91cywgcmVzdWx0LCB0ZW1wbGF0ZTtcbiAgICAgIHRlbXBsYXRlID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICAgIHByZXZpb3VzID0gdGhpcy5yZXNldEJ1ZmZlcignJyk7XG4gICAgICB0cnkge1xuICAgICAgICB0ZW1wbGF0ZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlc3VsdCA9IHRoaXMucmVzZXRCdWZmZXIocHJldmlvdXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5jZWRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncztcbiAgICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnJlbmRlcmFibGUgPSBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuICAgICAgdmFyIHRlYWN1cDtcbiAgICAgIHRlYWN1cCA9IHRoaXM7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzLCByZXN1bHQ7XG4gICAgICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgICBpZiAodGVhY3VwLmh0bWxPdXQgPT09IG51bGwpIHtcbiAgICAgICAgICB0ZWFjdXAuaHRtbE91dCA9ICcnO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGVhY3VwLnJlc2V0QnVmZmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnJlbmRlckF0dHIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgICAgdmFyIGssIHY7XG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCIgXCIgKyBuYW1lO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICBpZiAobmFtZSA9PT0gJ2RhdGEnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuICgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9yZXN1bHRzO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICB2ID0gdmFsdWVba107XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMucmVuZGVyQXR0cihcImRhdGEtXCIgKyBrLCB2KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfSkuY2FsbCh0aGlzKSkuam9pbignJyk7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgdmFsdWUgPSBuYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwiIFwiICsgbmFtZSArIFwiPVwiICsgKHRoaXMucXVvdGUodGhpcy5lc2NhcGUodmFsdWUudG9TdHJpbmcoKSkpKTtcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5hdHRyT3JkZXIgPSBbJ2lkJywgJ2NsYXNzJ107XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnJlbmRlckF0dHJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbmFtZSwgcmVzdWx0LCB2YWx1ZSwgX2ksIF9sZW4sIF9yZWY7XG4gICAgICByZXN1bHQgPSAnJztcbiAgICAgIF9yZWYgPSB0aGlzLmF0dHJPcmRlcjtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBuYW1lID0gX3JlZltfaV07XG4gICAgICAgIGlmICghKG5hbWUgaW4gb2JqKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSB0aGlzLnJlbmRlckF0dHIobmFtZSwgb2JqW25hbWVdKTtcbiAgICAgICAgZGVsZXRlIG9ialtuYW1lXTtcbiAgICAgIH1cbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbbmFtZV07XG4gICAgICAgIHJlc3VsdCArPSB0aGlzLnJlbmRlckF0dHIobmFtZSwgdmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5yZW5kZXJDb250ZW50cyA9IGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICBpZiAoY29udGVudHMgPT0gbnVsbCkge1xuXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZW50cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gY29udGVudHMuY2FsbCh0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoY29udGVudHMpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLmlzU2VsZWN0b3IgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHZhciBfcmVmO1xuICAgICAgcmV0dXJuIHN0cmluZy5sZW5ndGggPiAxICYmICgoX3JlZiA9IHN0cmluZ1swXSkgPT09ICcjJyB8fCBfcmVmID09PSAnLicpO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnBhcnNlU2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgdmFyIGNsYXNzZXMsIGlkLCBrbGFzcywgdG9rZW4sIF9pLCBfbGVuLCBfcmVmLCBfcmVmMTtcbiAgICAgIGlkID0gbnVsbDtcbiAgICAgIGNsYXNzZXMgPSBbXTtcbiAgICAgIF9yZWYgPSBzZWxlY3Rvci5zcGxpdCgnLicpO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIHRva2VuID0gX3JlZltfaV07XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgIGNsYXNzZXMucHVzaCh0b2tlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3JlZjEgPSB0b2tlbi5zcGxpdCgnIycpLCBrbGFzcyA9IF9yZWYxWzBdLCBpZCA9IF9yZWYxWzFdO1xuICAgICAgICAgIGlmIChrbGFzcyAhPT0gJycpIHtcbiAgICAgICAgICAgIGNsYXNzZXMucHVzaCh0b2tlbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogaWQsXG4gICAgICAgIGNsYXNzZXM6IGNsYXNzZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUubm9ybWFsaXplQXJncyA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgIHZhciBhcmcsIGF0dHJzLCBjbGFzc2VzLCBjb250ZW50cywgaWQsIGluZGV4LCBzZWxlY3RvciwgX2ksIF9sZW47XG4gICAgICBhdHRycyA9IHt9O1xuICAgICAgc2VsZWN0b3IgPSBudWxsO1xuICAgICAgY29udGVudHMgPSBudWxsO1xuICAgICAgZm9yIChpbmRleCA9IF9pID0gMCwgX2xlbiA9IGFyZ3MubGVuZ3RoOyBfaSA8IF9sZW47IGluZGV4ID0gKytfaSkge1xuICAgICAgICBhcmcgPSBhcmdzW2luZGV4XTtcbiAgICAgICAgaWYgKGFyZyAhPSBudWxsKSB7XG4gICAgICAgICAgc3dpdGNoICh0eXBlb2YgYXJnKSB7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDAgJiYgdGhpcy5pc1NlbGVjdG9yKGFyZykpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHRoaXMucGFyc2VTZWxlY3RvcihhcmcpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRzID0gYXJnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICBjb250ZW50cyA9IGFyZztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgICBpZiAoYXJnLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBhdHRycyA9IGFyZztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZW50cyA9IGFyZztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGNvbnRlbnRzID0gYXJnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNlbGVjdG9yICE9IG51bGwpIHtcbiAgICAgICAgaWQgPSBzZWxlY3Rvci5pZCwgY2xhc3NlcyA9IHNlbGVjdG9yLmNsYXNzZXM7XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYXR0cnMuaWQgPSBpZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xhc3NlcyAhPSBudWxsID8gY2xhc3Nlcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICBhdHRyc1tcImNsYXNzXCJdID0gY2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGF0dHJzOiBhdHRycyxcbiAgICAgICAgY29udGVudHM6IGNvbnRlbnRzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnRhZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MsIGF0dHJzLCBjb250ZW50cywgdGFnTmFtZSwgX3JlZjtcbiAgICAgIHRhZ05hbWUgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgX3JlZiA9IHRoaXMubm9ybWFsaXplQXJncyhhcmdzKSwgYXR0cnMgPSBfcmVmLmF0dHJzLCBjb250ZW50cyA9IF9yZWYuY29udGVudHM7XG4gICAgICB0aGlzLnJhdyhcIjxcIiArIHRhZ05hbWUgKyAodGhpcy5yZW5kZXJBdHRycyhhdHRycykpICsgXCI+XCIpO1xuICAgICAgdGhpcy5yZW5kZXJDb250ZW50cyhjb250ZW50cyk7XG4gICAgICByZXR1cm4gdGhpcy5yYXcoXCI8L1wiICsgdGFnTmFtZSArIFwiPlwiKTtcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5yYXdUYWcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBhdHRycywgY29udGVudHMsIHRhZ05hbWUsIF9yZWY7XG4gICAgICB0YWdOYW1lID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICAgIF9yZWYgPSB0aGlzLm5vcm1hbGl6ZUFyZ3MoYXJncyksIGF0dHJzID0gX3JlZi5hdHRycywgY29udGVudHMgPSBfcmVmLmNvbnRlbnRzO1xuICAgICAgdGhpcy5yYXcoXCI8XCIgKyB0YWdOYW1lICsgKHRoaXMucmVuZGVyQXR0cnMoYXR0cnMpKSArIFwiPlwiKTtcbiAgICAgIHRoaXMucmF3KGNvbnRlbnRzKTtcbiAgICAgIHJldHVybiB0aGlzLnJhdyhcIjwvXCIgKyB0YWdOYW1lICsgXCI+XCIpO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnNlbGZDbG9zaW5nVGFnID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgYXR0cnMsIGNvbnRlbnRzLCB0YWcsIF9yZWY7XG4gICAgICB0YWcgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgX3JlZiA9IHRoaXMubm9ybWFsaXplQXJncyhhcmdzKSwgYXR0cnMgPSBfcmVmLmF0dHJzLCBjb250ZW50cyA9IF9yZWYuY29udGVudHM7XG4gICAgICBpZiAoY29udGVudHMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGVhY3VwOiA8XCIgKyB0YWcgKyBcIi8+IG11c3Qgbm90IGhhdmUgY29udGVudC4gIEF0dGVtcHRlZCB0byBuZXN0IFwiICsgY29udGVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmF3KFwiPFwiICsgdGFnICsgKHRoaXMucmVuZGVyQXR0cnMoYXR0cnMpKSArIFwiIC8+XCIpO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLmNvZmZlZXNjcmlwdCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5yYXcoXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCI+KGZ1bmN0aW9uKCkge1xcbiAgdmFyIF9fc2xpY2UgPSBbXS5zbGljZSxcXG4gICAgICBfX2luZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfSxcXG4gICAgICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcXG4gICAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcXG4gIChcIiArIChmbi50b1N0cmluZygpKSArIFwiKSgpO1xcbn0pKCk7PC9zY3JpcHQ+XCIpO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLmNvbW1lbnQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5yYXcoXCI8IS0tXCIgKyAodGhpcy5lc2NhcGUodGV4dCkpICsgXCItLT5cIik7XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUuZG9jdHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAgICAgdHlwZSA9IDU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yYXcoZG9jdHlwZXNbdHlwZV0pO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLmllID0gZnVuY3Rpb24oY29uZGl0aW9uLCBjb250ZW50cykge1xuICAgICAgdGhpcy5yYXcoXCI8IS0tW2lmIFwiICsgKHRoaXMuZXNjYXBlKGNvbmRpdGlvbikpICsgXCJdPlwiKTtcbiAgICAgIHRoaXMucmVuZGVyQ29udGVudHMoY29udGVudHMpO1xuICAgICAgcmV0dXJuIHRoaXMucmF3KFwiPCFbZW5kaWZdLS0+XCIpO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnRleHQgPSBmdW5jdGlvbihzKSB7XG4gICAgICBpZiAodGhpcy5odG1sT3V0ID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGVhY3VwOiBjYW4ndCBjYWxsIGEgdGFnIGZ1bmN0aW9uIG91dHNpZGUgYSByZW5kZXJpbmcgY29udGV4dFwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmh0bWxPdXQgKz0gKHMgIT0gbnVsbCkgJiYgdGhpcy5lc2NhcGUocy50b1N0cmluZygpKSB8fCAnJztcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5yYXcgPSBmdW5jdGlvbihzKSB7XG4gICAgICBpZiAocyA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmh0bWxPdXQgKz0gcztcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5lc2NhcGUgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dC50b1N0cmluZygpLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUucXVvdGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIFwiXFxcIlwiICsgdmFsdWUgKyBcIlxcXCJcIjtcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS50YWdzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm91bmQsIGJvdW5kTWV0aG9kTmFtZXMsIG1ldGhvZCwgX2ZuLCBfaSwgX2xlbjtcbiAgICAgIGJvdW5kID0ge307XG4gICAgICBib3VuZE1ldGhvZE5hbWVzID0gW10uY29uY2F0KCdjZWRlIGNvZmZlZXNjcmlwdCBjb21tZW50IGRvY3R5cGUgZXNjYXBlIGllIG5vcm1hbGl6ZUFyZ3MgcmF3IHJlbmRlciByZW5kZXJhYmxlIHNjcmlwdCB0YWcgdGV4dCcuc3BsaXQoJyAnKSwgbWVyZ2VfZWxlbWVudHMoJ3JlZ3VsYXInLCAnb2Jzb2xldGUnLCAncmF3JywgJ3ZvaWQnLCAnb2Jzb2xldGVfdm9pZCcpKTtcbiAgICAgIF9mbiA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgICAgcmV0dXJuIGJvdW5kW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzO1xuICAgICAgICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgICAgICByZXR1cm4gX3RoaXNbbWV0aG9kXS5hcHBseShfdGhpcywgYXJncyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBib3VuZE1ldGhvZE5hbWVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIG1ldGhvZCA9IGJvdW5kTWV0aG9kTmFtZXNbX2ldO1xuICAgICAgICBfZm4obWV0aG9kKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBib3VuZDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRlYWN1cDtcblxuICB9KSgpO1xuXG4gIF9yZWYgPSBtZXJnZV9lbGVtZW50cygncmVndWxhcicsICdvYnNvbGV0ZScpO1xuICBfZm4gPSBmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgcmV0dXJuIFRlYWN1cC5wcm90b3R5cGVbdGFnTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzO1xuICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICByZXR1cm4gdGhpcy50YWcuYXBwbHkodGhpcywgW3RhZ05hbWVdLmNvbmNhdChfX3NsaWNlLmNhbGwoYXJncykpKTtcbiAgICB9O1xuICB9O1xuICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICB0YWdOYW1lID0gX3JlZltfaV07XG4gICAgX2ZuKHRhZ05hbWUpO1xuICB9XG5cbiAgX3JlZjEgPSBtZXJnZV9lbGVtZW50cygncmF3Jyk7XG4gIF9mbjEgPSBmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgcmV0dXJuIFRlYWN1cC5wcm90b3R5cGVbdGFnTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzO1xuICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICByZXR1cm4gdGhpcy5yYXdUYWcuYXBwbHkodGhpcywgW3RhZ05hbWVdLmNvbmNhdChfX3NsaWNlLmNhbGwoYXJncykpKTtcbiAgICB9O1xuICB9O1xuICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMS5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICB0YWdOYW1lID0gX3JlZjFbX2pdO1xuICAgIF9mbjEodGFnTmFtZSk7XG4gIH1cblxuICBfcmVmMiA9IG1lcmdlX2VsZW1lbnRzKCd2b2lkJywgJ29ic29sZXRlX3ZvaWQnKTtcbiAgX2ZuMiA9IGZ1bmN0aW9uKHRhZ05hbWUpIHtcbiAgICByZXR1cm4gVGVhY3VwLnByb3RvdHlwZVt0YWdOYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3M7XG4gICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgIHJldHVybiB0aGlzLnNlbGZDbG9zaW5nVGFnLmFwcGx5KHRoaXMsIFt0YWdOYW1lXS5jb25jYXQoX19zbGljZS5jYWxsKGFyZ3MpKSk7XG4gICAgfTtcbiAgfTtcbiAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjIubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgdGFnTmFtZSA9IF9yZWYyW19rXTtcbiAgICBfZm4yKHRhZ05hbWUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsID8gbW9kdWxlLmV4cG9ydHMgOiB2b2lkIDApIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IG5ldyBUZWFjdXAoKS50YWdzKCk7XG4gICAgbW9kdWxlLmV4cG9ydHMuVGVhY3VwID0gVGVhY3VwO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgndGVhY3VwJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBUZWFjdXAoKS50YWdzKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LnRlYWN1cCA9IG5ldyBUZWFjdXAoKS50YWdzKCk7XG4gICAgd2luZG93LnRlYWN1cC5UZWFjdXAgPSBUZWFjdXA7XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcbiIsIntyZW5kZXJhYmxlLCBidXR0b24sIGZvcm0sIGRpdiwgaW5wdXQsIGxhYmVsLCBzcGFuLCBub3JtYWxpemVBcmdzfSA9IHJlcXVpcmUgJ3RlYWN1cCdcblxubmFtZVRvTGFiZWwgPSAobmFtZSkgLT5cbiAgbmFtZVxuICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKVxuICAgIC5yZXBsYWNlKC8oXlthLXpdKS9nLCAoc3RyLCBwMSkgLT4gcDEudG9VcHBlckNhc2UoKSlcblxuXG5wcmVmaXhlZCA9IChwcmVmaXg9JycpIC0+XG4gIHJpYm9zcHJpdGUgPSB7fVxuXG4gIF9wcmVmaXhlZCA9IChuYW1lc3BhY2UpIC0+XG4gICAgaWYgcHJlZml4IHRoZW4gKGFjdGlvbikgLT5cbiAgICAgIFtuYW1lc3BhY2UsIHByZWZpeCwgYWN0aW9uXS5qb2luICctJ1xuICAgIGVsc2UgKGFjdGlvbikgLT5cbiAgICAgIFwiI3tuYW1lc3BhY2V9LSN7YWN0aW9ufVwiXG5cblxuICBydlByZWZpeGVkID0gX3ByZWZpeGVkICdydidcbiAgcmlib1ByZWZpeGVkID0gX3ByZWZpeGVkICdyaWJvJ1xuXG4gIG5vcm1hbGl6ZUhlbHBlckFyZ3MgPSAoYXJncykgLT5cbiAgICB7YXR0cnMsIGNvbnRlbnRzfSA9IG5vcm1hbGl6ZUFyZ3MgYXJnc1xuICAgIG5hbWUgPSBhdHRycy5uYW1lXG4gICAgZGVsZXRlIGF0dHJzLm5hbWVcbiAgICB7YXR0cnMsIGNvbnRlbnRzLCBuYW1lfVxuXG4gIG5vcm1hbGl6ZUZpZWxkQXJncyA9IChhcmdzKSAtPlxuICAgIHthdHRycywgY29udGVudHN9ID0gbm9ybWFsaXplQXJncyBhcmdzXG4gICAgZGVsZXRlIGF0dHJzLmxhYmVsXG4gICAgbmFtZSA9IGF0dHJzLm5hbWVcbiAgICBkZWxldGUgYXR0cnMubmFtZVxuICAgIGxhYmVsVGV4dCA9IGF0dHJzLmxhYmVsXG4gICAgaWYgbmFtZVxuICAgICAgbGFiZWxUZXh0ID89IG5hbWVUb0xhYmVsIG5hbWVcbiAgICAgIGF0dHJzLmlkID89IHJpYm9QcmVmaXhlZCBuYW1lXG5cbiAgICB7YXR0cnMsIGNvbnRlbnRzLCBsYWJlbFRleHQsIG5hbWV9XG5cbiAgcmlib3Nwcml0ZS5oZWxwVGV4dCA9IC0+XG4gICAge2F0dHJzLCBjb250ZW50cywgbmFtZX0gPSBub3JtYWxpemVIZWxwZXJBcmdzIGFyZ3VtZW50c1xuICAgIGF0dHJzW3J2UHJlZml4ZWQgJ3RleHQnXSA9IFwiZmllbGRFcnJvcnMuI3tuYW1lfVwiXG4gICAgc3BhbiAnLmhlbHAtYmxvY2snLCBhdHRyc1xuXG4gIHJpYm9zcHJpdGUuZm9ybUhlbHBUZXh0ID0gLT5cbiAgICBkaXYgJy5oYXMtZXJyb3InLCAtPlxuICAgICAgYXR0cnMgPSB7fVxuICAgICAgYXR0cnNbcnZQcmVmaXhlZCAndGV4dCddID0gXCJmb3JtRXJyb3JcIlxuICAgICAgc3BhbiAnLmhlbHAtYmxvY2snLCBhdHRyc1xuXG4gIHJpYm9zcHJpdGUuZm9ybUdyb3VwID0gLT5cbiAgICB7YXR0cnMsIGNvbnRlbnRzLCBuYW1lfSA9IG5vcm1hbGl6ZUhlbHBlckFyZ3MgYXJndW1lbnRzXG4gICAgYXR0cnNbcnZQcmVmaXhlZCAnY2xhc3MtaGFzLWVycm9yJ10gPSBcImZpZWxkRXJyb3JzLiN7bmFtZX1cIlxuICAgIGRpdiAnLmZvcm0tZ3JvdXAnLCBhdHRycywgY29udGVudHNcblxuICByaWJvc3ByaXRlLmlucHV0ID0gLT5cbiAgICB7YXR0cnMsIGNvbnRlbnRzLCBuYW1lLCBsYWJlbFRleHR9ID0gbm9ybWFsaXplRmllbGRBcmdzIGFyZ3VtZW50c1xuICAgIGF0dHJzW3J2UHJlZml4ZWQgJ3ZhbHVlJ10gPSBcImRhdGEuI3tuYW1lfVwiXG5cbiAgICByaWJvc3ByaXRlLmZvcm1Hcm91cCB7bmFtZX0sIC0+XG4gICAgICBsYWJlbCAnLmNvbnRyb2wtbGFiZWwnLCBmb3I6IGF0dHJzLmlkLCBsYWJlbFRleHRcbiAgICAgIGlucHV0ICcuZm9ybS1jb250cm9sJywgYXR0cnNcbiAgICAgIHJpYm9zcHJpdGUuaGVscFRleHQge25hbWV9XG5cbiAgcmlib3Nwcml0ZS5mb3JtID0gLT5cbiAgICB7YXR0cnMsIGNvbnRlbnRzfSA9IG5vcm1hbGl6ZUFyZ3MgYXJndW1lbnRzXG4gICAgYXR0cnNbcnZQcmVmaXhlZCAnb24tc3VibWl0J10gPSAnc3VibWl0J1xuICAgIGZvcm0gYXR0cnMsIGNvbnRlbnRzXG5cbiAgcmlib3Nwcml0ZS5zdWJtaXQgPSAtPlxuICAgIHthdHRycywgY29udGVudHN9ID0gbm9ybWFsaXplQXJncyBhcmd1bWVudHNcbiAgICBhdHRycy50eXBlID0gJ3N1Ym1pdCdcbiAgICBjb250ZW50cyA/PSAnU3VibWl0J1xuICAgIGJ1dHRvbiAnLmJ0bi5idG4tZGVmYXVsdCcsIGF0dHJzLCBjb250ZW50c1xuXG4gIHJpYm9zcHJpdGVcblxubW9kdWxlLmV4cG9ydHMgPSBwcmVmaXhlZCgpXG5tb2R1bGUuZXhwb3J0cy5wcmVmaXhlZCA9IHByZWZpeGVkXG5cbiJdfQ==
