(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, Springform, a, br, div, form, h1, h3, origSubscribe, processingForm, raw, render, ribosprite, rivets, robotForm, simpleForm, small, text, _ref;

Springform = require('springform');

robotForm = function() {
  return new Springform().validator(function(form) {
    if (form.data.color !== 'red') {
      return form.fieldErrors.color = 'Pick a better color';
    }
  }).validator(function(form) {
    var _ref;
    if (!(((_ref = form.data.sound) != null ? _ref.length : void 0) > 6)) {
      return form.formError = 'That color robot should make a louder sound';
    }
  });
};

$ = function(selector) {
  return document.querySelector(selector);
};

ribosprite = require('../src/ribosprite');

_ref = require('teacup'), render = _ref.render, a = _ref.a, br = _ref.br, div = _ref.div, h1 = _ref.h1, h3 = _ref.h3, small = _ref.small, text = _ref.text, form = _ref.form, raw = _ref.raw;

$('#content').innerHTML = render(function() {
  return div('.container', function() {
    div('.row', function() {
      div('.col-sm-4', function() {
        return h1(function() {
          text('RiBoSpriTe');
          br();
          small('Rivets + Bootstrap +');
          br();
          return small('Springform + Teacup');
        });
      });
      return div('.col-sm-4.text-right', function() {
        return a({
          href: 'http://github.com/hurrymaplelad/ribosprite'
        }, 'View source on GitHub');
      });
    });
    return div('.row', function() {
      return div('.col-sm-8', function() {
        div('#simple', function() {
          var ribo;
          ribo = ribosprite;
          return ribo.form(function() {
            ribo.input({
              type: 'text',
              name: 'color'
            });
            ribo.input({
              type: 'text',
              name: 'sound',
              label: 'What sound does it make?'
            });
            ribo.submit();
            return ribo.formHelpText();
          });
        });
        div('#click-to-focus', function() {
          var ribo;
          ribo = ribosprite.prefixed('ctf');
          h3(function() {
            a({
              href: '#click-to-focus'
            }, '#');
            return text(" Click a label to focus it's input");
          });
          return ribo.form(function() {
            return ribo.input({
              type: 'text',
              name: 'color',
              placeholder: 'Maybe red?'
            });
          });
        });
        return div('#processing', function() {
          var ribo;
          ribo = ribosprite.prefixed('processing');
          h3(function() {
            a({
              href: '#processing'
            }, '#');
            text(" Disable submission while processing");
            br();
            return small(function() {
              return raw('Both button clicking and <kbd>enter</kbd> key');
            });
          });
          return ribo.form(function() {
            ribo.input({
              type: 'text',
              name: 'color'
            });
            return ribo.submit();
          });
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

simpleForm = robotForm().processor(function(done) {
  if (!simpleForm.validate().hasErrors()) {
    alert('Sold!');
  }
  return done();
}).bind({
  color: 'blue',
  sound: 'foo'
});

rivets.bind($('#simple'), simpleForm);

rivets.bind($('#click-to-focus'), robotForm(), {
  config: {
    prefix: 'rv-ctf'
  }
});

processingForm = new Springform().processor(function(done) {
  if (window.webdriver) {
    return window.processingFormDone = done;
  } else {
    return setTimeout(done, 1500);
  }
});

rivets.bind($('#processing'), processingForm, {
  config: {
    prefix: 'rv-processing'
  }
});


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
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

Springform = (function() {
  function Springform(attrs) {
    var field, key, value, _i, _len, _ref;
    if (attrs == null) {
      attrs = {};
    }
    this.submit = __bind(this.submit, this);
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
    if (this.processing) {
      return;
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
    attrs[rvPrefixed('disabled')] = 'processing';
    return button('.btn.btn-primary', attrs, contents);
  };
  return ribosprite;
};

module.exports = prefixed();

module.exports.prefixed = prefixed;


},{"teacup":4}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL2V4YW1wbGUvZXhhbXBsZS5jb2ZmZWUiLCIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL25vZGVfbW9kdWxlcy9yaXZldHMvZGlzdC9yaXZldHMuanMiLCIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL25vZGVfbW9kdWxlcy9zcHJpbmdmb3JtL2xpYi9zcHJpbmdmb3JtLmpzIiwiL1VzZXJzL2FkYW0vUHJvamVjdHMvcmlib3Nwcml0ZS9ub2RlX21vZHVsZXMvdGVhY3VwL2xpYi90ZWFjdXAuanMiLCIvVXNlcnMvYWRhbS9Qcm9qZWN0cy9yaWJvc3ByaXRlL3NyYy9yaWJvc3ByaXRlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0lBLElBQUEsaUpBQUE7O0FBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBQWIsQ0FBQTs7QUFBQSxTQUVBLEdBQVksU0FBQSxHQUFBO1NBQ04sSUFBQSxVQUFBLENBQUEsQ0FDRixDQUFDLFNBREMsQ0FDUyxTQUFDLElBQUQsR0FBQTtBQUNULElBQUEsSUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQVYsS0FBbUIsS0FBMUI7YUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQWpCLEdBQXlCLHNCQUQzQjtLQURTO0VBQUEsQ0FEVCxDQUlGLENBQUMsU0FKQyxDQUlTLFNBQUMsSUFBRCxHQUFBO0FBQ1QsUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFBLENBQUEseUNBQXNCLENBQUUsZ0JBQWpCLEdBQTBCLENBQWpDLENBQUE7YUFDRSxJQUFJLENBQUMsU0FBTCxHQUFpQiw4Q0FEbkI7S0FEUztFQUFBLENBSlQs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ZUFBUjtHQUFSO0NBQTlDLENBeEdBLENBQUE7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDendDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFBO0FBQUEsSUFDQSxLQUFLLENBQUMsSUFBTixHQUFhLFFBRGIsQ0FBQTs7TUFFQSxXQUFZO0tBRlo7QUFBQSxJQUdBLEtBQU0sQ0FBQSxVQUFBLENBQVcsVUFBWCxDQUFBLENBQU4sR0FBK0IsWUFIL0IsQ0FBQTtXQUlBLE1BQUEsQ0FBTyxrQkFBUCxFQUEyQixLQUEzQixFQUFrQyxRQUFsQyxFQUxrQjtFQUFBLENBNURwQixDQUFBO1NBbUVBLFdBcEVTO0FBQUEsQ0FSWCxDQUFBOztBQUFBLE1BOEVNLENBQUMsT0FBUCxHQUFpQixRQUFBLENBQUEsQ0E5RWpCLENBQUE7O0FBQUEsTUErRU0sQ0FBQyxPQUFPLENBQUMsUUFBZixHQUEwQixRQS9FMUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4jXG4jIEZvcm1cbiNcblNwcmluZ2Zvcm0gPSByZXF1aXJlICdzcHJpbmdmb3JtJ1xuXG5yb2JvdEZvcm0gPSAtPlxuICBuZXcgU3ByaW5nZm9ybSgpXG4gICAgLnZhbGlkYXRvciAoZm9ybSkgLT5cbiAgICAgIHVubGVzcyBmb3JtLmRhdGEuY29sb3IgaXMgJ3JlZCdcbiAgICAgICAgZm9ybS5maWVsZEVycm9ycy5jb2xvciA9ICdQaWNrIGEgYmV0dGVyIGNvbG9yJ1xuICAgIC52YWxpZGF0b3IgKGZvcm0pIC0+XG4gICAgICB1bmxlc3MgZm9ybS5kYXRhLnNvdW5kPy5sZW5ndGggPiA2XG4gICAgICAgIGZvcm0uZm9ybUVycm9yID0gJ1RoYXQgY29sb3Igcm9ib3Qgc2hvdWxkIG1ha2UgYSBsb3VkZXIgc291bmQnXG4jXG4jIFRlbXBsYXRlXG4jXG4kID0gKHNlbGVjdG9yKSAtPlxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yIHNlbGVjdG9yXG5yaWJvc3ByaXRlID0gcmVxdWlyZSAnLi4vc3JjL3JpYm9zcHJpdGUnXG57cmVuZGVyLCBhLCBiciwgZGl2LCBoMSwgaDMsIHNtYWxsLCB0ZXh0LCBmb3JtLCByYXd9ID0gcmVxdWlyZSAndGVhY3VwJ1xuXG4kKCcjY29udGVudCcpLmlubmVySFRNTCA9IHJlbmRlciAtPlxuICBkaXYgJy5jb250YWluZXInLCAtPlxuICAgIGRpdiAnLnJvdycsIC0+XG4gICAgICBkaXYgJy5jb2wtc20tNCcsIC0+XG4gICAgICAgIGgxIC0+XG4gICAgICAgICAgdGV4dCAnUmlCb1NwcmlUZSdcbiAgICAgICAgICBicigpXG4gICAgICAgICAgc21hbGwgJ1JpdmV0cyArIEJvb3RzdHJhcCArJ1xuICAgICAgICAgIGJyKClcbiAgICAgICAgICBzbWFsbCAnU3ByaW5nZm9ybSArIFRlYWN1cCdcbiAgICAgIGRpdiAnLmNvbC1zbS00LnRleHQtcmlnaHQnLCAtPlxuICAgICAgICBhIGhyZWY6ICdodHRwOi8vZ2l0aHViLmNvbS9odXJyeW1hcGxlbGFkL3JpYm9zcHJpdGUnLCAnVmlldyBzb3VyY2Ugb24gR2l0SHViJ1xuXG4gICAgZGl2ICcucm93JywgLT5cbiAgICAgIGRpdiAnLmNvbC1zbS04JywgLT5cbiAgICAgICAgZGl2ICcjc2ltcGxlJywgLT5cbiAgICAgICAgICByaWJvID0gcmlib3Nwcml0ZVxuICAgICAgICAgIHJpYm8uZm9ybSAtPlxuICAgICAgICAgICAgcmliby5pbnB1dCB0eXBlOiAndGV4dCcsIG5hbWU6ICdjb2xvcidcbiAgICAgICAgICAgIHJpYm8uaW5wdXQgdHlwZTogJ3RleHQnLCBuYW1lOiAnc291bmQnLCBsYWJlbDogJ1doYXQgc291bmQgZG9lcyBpdCBtYWtlPydcbiAgICAgICAgICAgIHJpYm8uc3VibWl0KClcbiAgICAgICAgICAgIHJpYm8uZm9ybUhlbHBUZXh0KClcblxuICAgICAgICAjIC0gQ2xpY2sgbGFiZWwgdG8gZm9jdXMgaW5wdXRcbiAgICAgICAgZGl2ICcjY2xpY2stdG8tZm9jdXMnLCAtPlxuICAgICAgICAgIHJpYm8gPSByaWJvc3ByaXRlLnByZWZpeGVkICdjdGYnXG4gICAgICAgICAgaDMgLT5cbiAgICAgICAgICAgIGEgaHJlZjogJyNjbGljay10by1mb2N1cycsICcjJ1xuICAgICAgICAgICAgdGV4dCBcIiBDbGljayBhIGxhYmVsIHRvIGZvY3VzIGl0J3MgaW5wdXRcIlxuICAgICAgICAgIHJpYm8uZm9ybSAtPlxuICAgICAgICAgICAgcmliby5pbnB1dCB0eXBlOiAndGV4dCcsIG5hbWU6ICdjb2xvcicsIHBsYWNlaG9sZGVyOiAnTWF5YmUgcmVkPydcblxuICAgICAgICAjIC0gRGlzYWJsZSBzdWJtaXQgYnV0dG9uIHdoaWxlIHByb2Nlc3NpbmdcbiAgICAgICAgZGl2ICcjcHJvY2Vzc2luZycsIC0+XG4gICAgICAgICAgcmlibyA9IHJpYm9zcHJpdGUucHJlZml4ZWQgJ3Byb2Nlc3NpbmcnXG4gICAgICAgICAgaDMgLT5cbiAgICAgICAgICAgIGEgaHJlZjogJyNwcm9jZXNzaW5nJywgJyMnXG4gICAgICAgICAgICB0ZXh0IFwiIERpc2FibGUgc3VibWlzc2lvbiB3aGlsZSBwcm9jZXNzaW5nXCJcbiAgICAgICAgICAgIGJyKClcbiAgICAgICAgICAgIHNtYWxsIC0+IHJhdyAnQm90aCBidXR0b24gY2xpY2tpbmcgYW5kIDxrYmQ+ZW50ZXI8L2tiZD4ga2V5J1xuICAgICAgICAgIHJpYm8uZm9ybSAtPlxuICAgICAgICAgICAgcmliby5pbnB1dCB0eXBlOiAndGV4dCcsIG5hbWU6ICdjb2xvcidcbiAgICAgICAgICAgIHJpYm8uc3VibWl0KClcblxuXG4jIC0gRW50ZXIgdG8gc3VibWl0IGZyb20gZm9jdXNlZCBmaWVsZFxuIyAtIFNob3cgZmllbGQgc3BlY2lmaWMgZXJyb3JzIG5leHQgdG8gZmllbGRzIHdpdGggZXJyb3IgaGlnaGxpZ2h0XG4jIC0gU2hvdyB3aG9sZSBmb3JtIGVycm9ycyBuZWFyIHRoZSBzdWJtaXQgYnV0dG9uXG5cbiNcbiMgQmluZGluZ1xuI1xucml2ZXRzID0gcmVxdWlyZSAncml2ZXRzJ1xuXG4jIG1ha2UgcHJvcGVydGllcyB0aGF0IGRpZG4ndCBleGlzdCBiZWZvcmUgc3Vic2NyaXB0aW9uIGFwcGVhclxuIyBpbiBKU09OLnN0cmluZ2lmaWVkIG91dHB1dFxub3JpZ1N1YnNjcmliZSA9IHJpdmV0cy5hZGFwdGVyc1snLiddLnN1YnNjcmliZVxucml2ZXRzLmFkYXB0ZXJzWycuJ10uc3Vic2NyaWJlID0gKG9iaiwga2V5cGF0aCwgY2FsbGJhY2spIC0+XG4gIG9ialtrZXlwYXRoXSA/PSB1bmRlZmluZWRcbiAgb3JpZ1N1YnNjcmliZS5hcHBseSBALCBhcmd1bWVudHNcblxuXG4jIFNpbXBsZVxuc2ltcGxlRm9ybSA9IHJvYm90Rm9ybSgpXG4gIC5wcm9jZXNzb3IgKGRvbmUpIC0+XG4gICAgdW5sZXNzIHNpbXBsZUZvcm0udmFsaWRhdGUoKS5oYXNFcnJvcnMoKVxuICAgICAgYWxlcnQgJ1NvbGQhJ1xuICAgIGRvbmUoKVxuXG4gIC5iaW5kXG4gICAgY29sb3I6ICdibHVlJ1xuICAgIHNvdW5kOiAnZm9vJ1xuXG5yaXZldHMuYmluZCAkKCcjc2ltcGxlJyksIHNpbXBsZUZvcm1cblxuIyBDbGljayB0byBmb2N1c1xucml2ZXRzLmJpbmQgJCgnI2NsaWNrLXRvLWZvY3VzJyksIHJvYm90Rm9ybSgpLCBjb25maWc6IHByZWZpeDogJ3J2LWN0ZidcblxuIyBQcm9jZXNzaW5nXG5wcm9jZXNzaW5nRm9ybSA9IG5ldyBTcHJpbmdmb3JtKClcbiAgLnByb2Nlc3NvciAoZG9uZSkgLT5cbiAgICBpZiB3aW5kb3cud2ViZHJpdmVyXG4gICAgICB3aW5kb3cucHJvY2Vzc2luZ0Zvcm1Eb25lID0gZG9uZVxuICAgIGVsc2VcbiAgICAgIHNldFRpbWVvdXQgZG9uZSwgMTUwMFxuXG5yaXZldHMuYmluZCAkKCcjcHJvY2Vzc2luZycpLCBwcm9jZXNzaW5nRm9ybSwgY29uZmlnOiBwcmVmaXg6ICdydi1wcm9jZXNzaW5nJ1xuIiwiLy8gUml2ZXRzLmpzXG4vLyB2ZXJzaW9uOiAwLjYuNlxuLy8gYXV0aG9yOiBNaWNoYWVsIFJpY2hhcmRzXG4vLyBsaWNlbnNlOiBNSVRcbihmdW5jdGlvbigpIHtcbiAgdmFyIFJpdmV0cywgYmluZE1ldGhvZCwgdW5iaW5kTWV0aG9kLCBfcmVmLFxuICAgIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gICAgX19pbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH0sXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICAgIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG4gIFJpdmV0cyA9IHtcbiAgICBiaW5kZXJzOiB7fSxcbiAgICBjb21wb25lbnRzOiB7fSxcbiAgICBmb3JtYXR0ZXJzOiB7fSxcbiAgICBhZGFwdGVyczoge30sXG4gICAgY29uZmlnOiB7XG4gICAgICBwcmVmaXg6ICdydicsXG4gICAgICB0ZW1wbGF0ZURlbGltaXRlcnM6IFsneycsICd9J10sXG4gICAgICByb290SW50ZXJmYWNlOiAnLicsXG4gICAgICBwcmVsb2FkRGF0YTogdHJ1ZSxcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKGNvbnRleHQsIGV2LCBiaW5kaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwoY29udGV4dCwgZXYsIGJpbmRpbmcudmlldy5tb2RlbHMpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBpZiAoJ2pRdWVyeScgaW4gd2luZG93KSB7XG4gICAgX3JlZiA9ICdvbicgaW4galF1ZXJ5ID8gWydvbicsICdvZmYnXSA6IFsnYmluZCcsICd1bmJpbmQnXSwgYmluZE1ldGhvZCA9IF9yZWZbMF0sIHVuYmluZE1ldGhvZCA9IF9yZWZbMV07XG4gICAgUml2ZXRzLlV0aWwgPSB7XG4gICAgICBiaW5kRXZlbnQ6IGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICByZXR1cm4galF1ZXJ5KGVsKVtiaW5kTWV0aG9kXShldmVudCwgaGFuZGxlcik7XG4gICAgICB9LFxuICAgICAgdW5iaW5kRXZlbnQ6IGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICByZXR1cm4galF1ZXJ5KGVsKVt1bmJpbmRNZXRob2RdKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgIH0sXG4gICAgICBnZXRJbnB1dFZhbHVlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgJGVsO1xuICAgICAgICAkZWwgPSBqUXVlcnkoZWwpO1xuICAgICAgICBpZiAoJGVsLmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIHJldHVybiAkZWwuaXMoJzpjaGVja2VkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICRlbC52YWwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgUml2ZXRzLlV0aWwgPSB7XG4gICAgICBiaW5kRXZlbnQ6IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZWwsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgIHJldHVybiBlbC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgfSkoKSxcbiAgICAgIHVuYmluZEV2ZW50OiAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgncmVtb3ZlRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgICAgcmV0dXJuIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gZWwuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKCksXG4gICAgICBnZXRJbnB1dFZhbHVlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgbywgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgICBpZiAoZWwudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIHJldHVybiBlbC5jaGVja2VkO1xuICAgICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09ICdzZWxlY3QtbXVsdGlwbGUnKSB7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGVsLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBvID0gZWxbX2ldO1xuICAgICAgICAgICAgaWYgKG8uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChvLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlbC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBSaXZldHMuVmlldyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBWaWV3KGVscywgbW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgaywgb3B0aW9uLCB2LCBfYmFzZSwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICB0aGlzLmVscyA9IGVscztcbiAgICAgIHRoaXMubW9kZWxzID0gbW9kZWxzO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9O1xuICAgICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICAgICAgdGhpcy5wdWJsaXNoID0gX19iaW5kKHRoaXMucHVibGlzaCwgdGhpcyk7XG4gICAgICB0aGlzLnN5bmMgPSBfX2JpbmQodGhpcy5zeW5jLCB0aGlzKTtcbiAgICAgIHRoaXMudW5iaW5kID0gX19iaW5kKHRoaXMudW5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZCA9IF9fYmluZCh0aGlzLmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5zZWxlY3QgPSBfX2JpbmQodGhpcy5zZWxlY3QsIHRoaXMpO1xuICAgICAgdGhpcy5idWlsZCA9IF9fYmluZCh0aGlzLmJ1aWxkLCB0aGlzKTtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVnRXhwID0gX19iaW5kKHRoaXMuY29tcG9uZW50UmVnRXhwLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZGluZ1JlZ0V4cCA9IF9fYmluZCh0aGlzLmJpbmRpbmdSZWdFeHAsIHRoaXMpO1xuICAgICAgaWYgKCEodGhpcy5lbHMuanF1ZXJ5IHx8IHRoaXMuZWxzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHRoaXMuZWxzID0gW3RoaXMuZWxzXTtcbiAgICAgIH1cbiAgICAgIF9yZWYxID0gWydjb25maWcnLCAnYmluZGVycycsICdmb3JtYXR0ZXJzJywgJ2FkYXB0ZXJzJ107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIG9wdGlvbiA9IF9yZWYxW19pXTtcbiAgICAgICAgdGhpc1tvcHRpb25dID0ge307XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNbb3B0aW9uXSkge1xuICAgICAgICAgIF9yZWYyID0gdGhpcy5vcHRpb25zW29wdGlvbl07XG4gICAgICAgICAgZm9yIChrIGluIF9yZWYyKSB7XG4gICAgICAgICAgICB2ID0gX3JlZjJba107XG4gICAgICAgICAgICB0aGlzW29wdGlvbl1ba10gPSB2O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfcmVmMyA9IFJpdmV0c1tvcHRpb25dO1xuICAgICAgICBmb3IgKGsgaW4gX3JlZjMpIHtcbiAgICAgICAgICB2ID0gX3JlZjNba107XG4gICAgICAgICAgaWYgKChfYmFzZSA9IHRoaXNbb3B0aW9uXSlba10gPT0gbnVsbCkge1xuICAgICAgICAgICAgX2Jhc2Vba10gPSB2O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5idWlsZCgpO1xuICAgIH1cblxuICAgIFZpZXcucHJvdG90eXBlLmJpbmRpbmdSZWdFeHAgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXlwiICsgdGhpcy5jb25maWcucHJlZml4ICsgXCItXCIpO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5jb21wb25lbnRSZWdFeHAgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXlwiICsgKHRoaXMuY29uZmlnLnByZWZpeC50b1VwcGVyQ2FzZSgpKSArIFwiLVwiKTtcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5nUmVnRXhwLCBidWlsZEJpbmRpbmcsIGNvbXBvbmVudFJlZ0V4cCwgZWwsIHBhcnNlLCBza2lwTm9kZXMsIF9pLCBfbGVuLCBfcmVmMSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IFtdO1xuICAgICAgc2tpcE5vZGVzID0gW107XG4gICAgICBiaW5kaW5nUmVnRXhwID0gdGhpcy5iaW5kaW5nUmVnRXhwKCk7XG4gICAgICBjb21wb25lbnRSZWdFeHAgPSB0aGlzLmNvbXBvbmVudFJlZ0V4cCgpO1xuICAgICAgYnVpbGRCaW5kaW5nID0gZnVuY3Rpb24oYmluZGluZywgbm9kZSwgdHlwZSwgZGVjbGFyYXRpb24pIHtcbiAgICAgICAgdmFyIGNvbnRleHQsIGN0eCwgZGVwZW5kZW5jaWVzLCBrZXlwYXRoLCBvcHRpb25zLCBwaXBlLCBwaXBlcztcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICBwaXBlcyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgICAgICBfcmVmMSA9IGRlY2xhcmF0aW9uLnNwbGl0KCd8Jyk7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBwaXBlID0gX3JlZjFbX2ldO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChwaXBlLnRyaW0oKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfSkoKTtcbiAgICAgICAgY29udGV4dCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgICAgICBfcmVmMSA9IHBpcGVzLnNoaWZ0KCkuc3BsaXQoJzwnKTtcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGN0eCA9IF9yZWYxW19pXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goY3R4LnRyaW0oKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfSkoKTtcbiAgICAgICAga2V5cGF0aCA9IGNvbnRleHQuc2hpZnQoKTtcbiAgICAgICAgb3B0aW9ucy5mb3JtYXR0ZXJzID0gcGlwZXM7XG4gICAgICAgIGlmIChkZXBlbmRlbmNpZXMgPSBjb250ZXh0LnNoaWZ0KCkpIHtcbiAgICAgICAgICBvcHRpb25zLmRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcy5zcGxpdCgvXFxzKy8pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfdGhpcy5iaW5kaW5ncy5wdXNoKG5ldyBSaXZldHNbYmluZGluZ10oX3RoaXMsIG5vZGUsIHR5cGUsIGtleXBhdGgsIG9wdGlvbnMpKTtcbiAgICAgIH07XG4gICAgICBwYXJzZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZSwgYXR0cmlidXRlcywgYmluZGVyLCBjaGlsZE5vZGUsIGRlbGltaXRlcnMsIGlkZW50aWZpZXIsIG4sIHBhcnNlciwgcmVnZXhwLCB0ZXh0LCB0b2tlbiwgdG9rZW5zLCB0eXBlLCB2YWx1ZSwgX2ksIF9qLCBfaywgX2wsIF9sZW4sIF9sZW4xLCBfbGVuMiwgX2xlbjMsIF9sZW40LCBfbSwgX3JlZjEsIF9yZWYyLCBfcmVmMywgX3JlZjQsIF9yZWY1LCBfcmVzdWx0cztcbiAgICAgICAgaWYgKF9faW5kZXhPZi5jYWxsKHNraXBOb2Rlcywgbm9kZSkgPCAwKSB7XG4gICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgIHBhcnNlciA9IFJpdmV0cy5UZXh0VGVtcGxhdGVQYXJzZXI7XG4gICAgICAgICAgICBpZiAoZGVsaW1pdGVycyA9IF90aGlzLmNvbmZpZy50ZW1wbGF0ZURlbGltaXRlcnMpIHtcbiAgICAgICAgICAgICAgaWYgKCh0b2tlbnMgPSBwYXJzZXIucGFyc2Uobm9kZS5kYXRhLCBkZWxpbWl0ZXJzKSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEodG9rZW5zLmxlbmd0aCA9PT0gMSAmJiB0b2tlbnNbMF0udHlwZSA9PT0gcGFyc2VyLnR5cGVzLnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IHRva2Vucy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tfaV07XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b2tlbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGV4dCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi50eXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgYnVpbGRCaW5kaW5nKCdUZXh0QmluZGluZycsIHRleHQsIG51bGwsIHRva2VuLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50UmVnRXhwLnRlc3Qobm9kZS50YWdOYW1lKSkge1xuICAgICAgICAgICAgdHlwZSA9IG5vZGUudGFnTmFtZS5yZXBsYWNlKGNvbXBvbmVudFJlZ0V4cCwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBfdGhpcy5iaW5kaW5ncy5wdXNoKG5ldyBSaXZldHMuQ29tcG9uZW50QmluZGluZyhfdGhpcywgbm9kZSwgdHlwZSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5hdHRyaWJ1dGVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIF9yZWYxID0gbm9kZS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjEubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IF9yZWYxW19qXTtcbiAgICAgICAgICAgICAgaWYgKGJpbmRpbmdSZWdFeHAudGVzdChhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0eXBlID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZShiaW5kaW5nUmVnRXhwLCAnJyk7XG4gICAgICAgICAgICAgICAgaWYgKCEoYmluZGVyID0gX3RoaXMuYmluZGVyc1t0eXBlXSkpIHtcbiAgICAgICAgICAgICAgICAgIF9yZWYyID0gX3RoaXMuYmluZGVycztcbiAgICAgICAgICAgICAgICAgIGZvciAoaWRlbnRpZmllciBpbiBfcmVmMikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IF9yZWYyW2lkZW50aWZpZXJdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWRlbnRpZmllciAhPT0gJyonICYmIGlkZW50aWZpZXIuaW5kZXhPZignKicpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJeXCIgKyAoaWRlbnRpZmllci5yZXBsYWNlKCcqJywgJy4rJykpICsgXCIkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWdleHAudGVzdCh0eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmluZGVyID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJpbmRlciB8fCAoYmluZGVyID0gX3RoaXMuYmluZGVyc1snKiddKTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGVyLmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICBfcmVmMyA9IG5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICAgIGZvciAoX2sgPSAwLCBfbGVuMiA9IF9yZWYzLmxlbmd0aDsgX2sgPCBfbGVuMjsgX2srKykge1xuICAgICAgICAgICAgICAgICAgICBuID0gX3JlZjNbX2tdO1xuICAgICAgICAgICAgICAgICAgICBza2lwTm9kZXMucHVzaChuKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBbYXR0cmlidXRlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9yZWY0ID0gYXR0cmlidXRlcyB8fCBub2RlLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICBmb3IgKF9sID0gMCwgX2xlbjMgPSBfcmVmNC5sZW5ndGg7IF9sIDwgX2xlbjM7IF9sKyspIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlID0gX3JlZjRbX2xdO1xuICAgICAgICAgICAgICBpZiAoYmluZGluZ1JlZ0V4cC50ZXN0KGF0dHJpYnV0ZS5uYW1lKSkge1xuICAgICAgICAgICAgICAgIHR5cGUgPSBhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKGJpbmRpbmdSZWdFeHAsICcnKTtcbiAgICAgICAgICAgICAgICBidWlsZEJpbmRpbmcoJ0JpbmRpbmcnLCBub2RlLCB0eXBlLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIF9yZWY1ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIF9sZW40LCBfbiwgX3JlZjUsIF9yZXN1bHRzMTtcbiAgICAgICAgICAgIF9yZWY1ID0gbm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgX3Jlc3VsdHMxID0gW107XG4gICAgICAgICAgICBmb3IgKF9uID0gMCwgX2xlbjQgPSBfcmVmNS5sZW5ndGg7IF9uIDwgX2xlbjQ7IF9uKyspIHtcbiAgICAgICAgICAgICAgbiA9IF9yZWY1W19uXTtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMxLnB1c2gobik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX3Jlc3VsdHMxO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9tID0gMCwgX2xlbjQgPSBfcmVmNS5sZW5ndGg7IF9tIDwgX2xlbjQ7IF9tKyspIHtcbiAgICAgICAgICAgIGNoaWxkTm9kZSA9IF9yZWY1W19tXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2gocGFyc2UoY2hpbGROb2RlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIF9yZWYxID0gdGhpcy5lbHM7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGVsID0gX3JlZjFbX2ldO1xuICAgICAgICBwYXJzZShlbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIGlmIChmbihiaW5kaW5nKSkge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcuYmluZCgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZy51bmJpbmQoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaChiaW5kaW5nLnN5bmMoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgX3JlZjEgPSB0aGlzLnNlbGVjdChmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLmJpbmRlci5wdWJsaXNoZXM7XG4gICAgICB9KTtcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZy5wdWJsaXNoKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBrZXksIG1vZGVsLCBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgaWYgKG1vZGVscyA9PSBudWxsKSB7XG4gICAgICAgIG1vZGVscyA9IHt9O1xuICAgICAgfVxuICAgICAgZm9yIChrZXkgaW4gbW9kZWxzKSB7XG4gICAgICAgIG1vZGVsID0gbW9kZWxzW2tleV07XG4gICAgICAgIHRoaXMubW9kZWxzW2tleV0gPSBtb2RlbDtcbiAgICAgIH1cbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZy51cGRhdGUobW9kZWxzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIHJldHVybiBWaWV3O1xuXG4gIH0pKCk7XG5cbiAgUml2ZXRzLkJpbmRpbmcgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQmluZGluZyh2aWV3LCBlbCwgdHlwZSwga2V5cGF0aCwgb3B0aW9ucykge1xuICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICB0aGlzLmtleXBhdGggPSBrZXlwYXRoO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9O1xuICAgICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICAgICAgdGhpcy51bmJpbmQgPSBfX2JpbmQodGhpcy51bmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5iaW5kID0gX19iaW5kKHRoaXMuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLnB1Ymxpc2ggPSBfX2JpbmQodGhpcy5wdWJsaXNoLCB0aGlzKTtcbiAgICAgIHRoaXMuc3luYyA9IF9fYmluZCh0aGlzLnN5bmMsIHRoaXMpO1xuICAgICAgdGhpcy5zZXQgPSBfX2JpbmQodGhpcy5zZXQsIHRoaXMpO1xuICAgICAgdGhpcy5ldmVudEhhbmRsZXIgPSBfX2JpbmQodGhpcy5ldmVudEhhbmRsZXIsIHRoaXMpO1xuICAgICAgdGhpcy5mb3JtYXR0ZWRWYWx1ZSA9IF9fYmluZCh0aGlzLmZvcm1hdHRlZFZhbHVlLCB0aGlzKTtcbiAgICAgIHRoaXMuc2V0QmluZGVyID0gX19iaW5kKHRoaXMuc2V0QmluZGVyLCB0aGlzKTtcbiAgICAgIHRoaXMuZm9ybWF0dGVycyA9IHRoaXMub3B0aW9ucy5mb3JtYXR0ZXJzIHx8IFtdO1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgIHRoaXMubW9kZWwgPSB2b2lkIDA7XG4gICAgICB0aGlzLnNldEJpbmRlcigpO1xuICAgIH1cblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnNldEJpbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlkZW50aWZpZXIsIHJlZ2V4cCwgdmFsdWUsIF9yZWYxO1xuICAgICAgaWYgKCEodGhpcy5iaW5kZXIgPSB0aGlzLnZpZXcuYmluZGVyc1t0aGlzLnR5cGVdKSkge1xuICAgICAgICBfcmVmMSA9IHRoaXMudmlldy5iaW5kZXJzO1xuICAgICAgICBmb3IgKGlkZW50aWZpZXIgaW4gX3JlZjEpIHtcbiAgICAgICAgICB2YWx1ZSA9IF9yZWYxW2lkZW50aWZpZXJdO1xuICAgICAgICAgIGlmIChpZGVudGlmaWVyICE9PSAnKicgJiYgaWRlbnRpZmllci5pbmRleE9mKCcqJykgIT09IC0xKSB7XG4gICAgICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwKFwiXlwiICsgKGlkZW50aWZpZXIucmVwbGFjZSgnKicsICcuKycpKSArIFwiJFwiKTtcbiAgICAgICAgICAgIGlmIChyZWdleHAudGVzdCh0aGlzLnR5cGUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZGVyID0gdmFsdWU7XG4gICAgICAgICAgICAgIHRoaXMuYXJncyA9IG5ldyBSZWdFeHAoXCJeXCIgKyAoaWRlbnRpZmllci5yZXBsYWNlKCcqJywgJyguKyknKSkgKyBcIiRcIikuZXhlYyh0aGlzLnR5cGUpO1xuICAgICAgICAgICAgICB0aGlzLmFyZ3Muc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYmluZGVyIHx8ICh0aGlzLmJpbmRlciA9IHRoaXMudmlldy5iaW5kZXJzWycqJ10pO1xuICAgICAgaWYgKHRoaXMuYmluZGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmluZGVyID0ge1xuICAgICAgICAgIHJvdXRpbmU6IHRoaXMuYmluZGVyXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhcmdzLCBmb3JtYXR0ZXIsIGlkLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBfcmVmMSA9IHRoaXMuZm9ybWF0dGVycztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZm9ybWF0dGVyID0gX3JlZjFbX2ldO1xuICAgICAgICBhcmdzID0gZm9ybWF0dGVyLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGlkID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBmb3JtYXR0ZXIgPSB0aGlzLnZpZXcuZm9ybWF0dGVyc1tpZF07XG4gICAgICAgIGlmICgoZm9ybWF0dGVyICE9IG51bGwgPyBmb3JtYXR0ZXIucmVhZCA6IHZvaWQgMCkgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIHZhbHVlID0gZm9ybWF0dGVyLnJlYWQuYXBwbHkoZm9ybWF0dGVyLCBbdmFsdWVdLmNvbmNhdChfX3NsaWNlLmNhbGwoYXJncykpKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXR0ZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIHZhbHVlID0gZm9ybWF0dGVyLmFwcGx5KG51bGwsIFt2YWx1ZV0uY29uY2F0KF9fc2xpY2UuY2FsbChhcmdzKSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLmV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICB2YXIgYmluZGluZywgaGFuZGxlcjtcbiAgICAgIGhhbmRsZXIgPSAoYmluZGluZyA9IHRoaXMpLnZpZXcuY29uZmlnLmhhbmRsZXI7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZXIuY2FsbChmbiwgdGhpcywgZXYsIGJpbmRpbmcpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIHZhbHVlID0gdmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbiAmJiAhdGhpcy5iaW5kZXJbXCJmdW5jdGlvblwiXSA/IHRoaXMuZm9ybWF0dGVkVmFsdWUodmFsdWUuY2FsbCh0aGlzLm1vZGVsKSkgOiB0aGlzLmZvcm1hdHRlZFZhbHVlKHZhbHVlKTtcbiAgICAgIHJldHVybiAoX3JlZjEgPSB0aGlzLmJpbmRlci5yb3V0aW5lKSAhPSBudWxsID8gX3JlZjEuY2FsbCh0aGlzLCB0aGlzLmVsLCB2YWx1ZSkgOiB2b2lkIDA7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkZXBlbmRlbmN5LCBvYnNlcnZlciwgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgIGlmICh0aGlzLm1vZGVsICE9PSB0aGlzLm9ic2VydmVyLnRhcmdldCkge1xuICAgICAgICBfcmVmMSA9IHRoaXMuZGVwZW5kZW5jaWVzO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgb2JzZXJ2ZXIgPSBfcmVmMVtfaV07XG4gICAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgICAgaWYgKCgodGhpcy5tb2RlbCA9IHRoaXMub2JzZXJ2ZXIudGFyZ2V0KSAhPSBudWxsKSAmJiAoKF9yZWYyID0gdGhpcy5vcHRpb25zLmRlcGVuZGVuY2llcykgIT0gbnVsbCA/IF9yZWYyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICBfcmVmMyA9IHRoaXMub3B0aW9ucy5kZXBlbmRlbmNpZXM7XG4gICAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICBkZXBlbmRlbmN5ID0gX3JlZjNbX2pdO1xuICAgICAgICAgICAgb2JzZXJ2ZXIgPSBuZXcgUml2ZXRzLk9ic2VydmVyKHRoaXMudmlldywgdGhpcy5tb2RlbCwgZGVwZW5kZW5jeSwgdGhpcy5zeW5jKTtcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzLnB1c2gob2JzZXJ2ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc2V0KHRoaXMub2JzZXJ2ZXIudmFsdWUoKSk7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBmb3JtYXR0ZXIsIGlkLCB2YWx1ZSwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICB2YWx1ZSA9IFJpdmV0cy5VdGlsLmdldElucHV0VmFsdWUodGhpcy5lbCk7XG4gICAgICBfcmVmMSA9IHRoaXMuZm9ybWF0dGVycy5zbGljZSgwKS5yZXZlcnNlKCk7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGZvcm1hdHRlciA9IF9yZWYxW19pXTtcbiAgICAgICAgYXJncyA9IGZvcm1hdHRlci5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBpZCA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgaWYgKChfcmVmMiA9IHRoaXMudmlldy5mb3JtYXR0ZXJzW2lkXSkgIT0gbnVsbCA/IF9yZWYyLnB1Ymxpc2ggOiB2b2lkIDApIHtcbiAgICAgICAgICB2YWx1ZSA9IChfcmVmMyA9IHRoaXMudmlldy5mb3JtYXR0ZXJzW2lkXSkucHVibGlzaC5hcHBseShfcmVmMywgW3ZhbHVlXS5jb25jYXQoX19zbGljZS5jYWxsKGFyZ3MpKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9ic2VydmVyLnB1Ymxpc2godmFsdWUpO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGVwZW5kZW5jeSwgb2JzZXJ2ZXIsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgaWYgKChfcmVmMSA9IHRoaXMuYmluZGVyLmJpbmQpICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjEuY2FsbCh0aGlzLCB0aGlzLmVsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgUml2ZXRzLk9ic2VydmVyKHRoaXMudmlldywgdGhpcy52aWV3Lm1vZGVscywgdGhpcy5rZXlwYXRoLCB0aGlzLnN5bmMpO1xuICAgICAgdGhpcy5tb2RlbCA9IHRoaXMub2JzZXJ2ZXIudGFyZ2V0O1xuICAgICAgaWYgKCh0aGlzLm1vZGVsICE9IG51bGwpICYmICgoX3JlZjIgPSB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzKSAhPSBudWxsID8gX3JlZjIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICBfcmVmMyA9IHRoaXMub3B0aW9ucy5kZXBlbmRlbmNpZXM7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBkZXBlbmRlbmN5ID0gX3JlZjNbX2ldO1xuICAgICAgICAgIG9ic2VydmVyID0gbmV3IFJpdmV0cy5PYnNlcnZlcih0aGlzLnZpZXcsIHRoaXMubW9kZWwsIGRlcGVuZGVuY3ksIHRoaXMuc3luYyk7XG4gICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMucHVzaChvYnNlcnZlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnZpZXcuY29uZmlnLnByZWxvYWREYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JzZXJ2ZXIsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjI7XG4gICAgICBpZiAoKF9yZWYxID0gdGhpcy5iaW5kZXIudW5iaW5kKSAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYxLmNhbGwodGhpcywgdGhpcy5lbCk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmVyLnVub2JzZXJ2ZSgpO1xuICAgICAgX3JlZjIgPSB0aGlzLmRlcGVuZGVuY2llcztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjIubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgb2JzZXJ2ZXIgPSBfcmVmMltfaV07XG4gICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZGVwZW5kZW5jaWVzID0gW107XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgaWYgKG1vZGVscyA9PSBudWxsKSB7XG4gICAgICAgIG1vZGVscyA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIChfcmVmMSA9IHRoaXMuYmluZGVyLnVwZGF0ZSkgIT0gbnVsbCA/IF9yZWYxLmNhbGwodGhpcywgbW9kZWxzKSA6IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEJpbmRpbmc7XG5cbiAgfSkoKTtcblxuICBSaXZldHMuQ29tcG9uZW50QmluZGluZyA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ29tcG9uZW50QmluZGluZywgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIENvbXBvbmVudEJpbmRpbmcodmlldywgZWwsIHR5cGUpIHtcbiAgICAgIHZhciBhdHRyaWJ1dGUsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjI7XG4gICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgIHRoaXMudW5iaW5kID0gX19iaW5kKHRoaXMudW5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZCA9IF9fYmluZCh0aGlzLmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICAgICAgdGhpcy5sb2NhbHMgPSBfX2JpbmQodGhpcy5sb2NhbHMsIHRoaXMpO1xuICAgICAgdGhpcy5jb21wb25lbnQgPSBSaXZldHMuY29tcG9uZW50c1t0aGlzLnR5cGVdO1xuICAgICAgdGhpcy5hdHRyaWJ1dGVzID0ge307XG4gICAgICB0aGlzLmluZmxlY3Rpb25zID0ge307XG4gICAgICBfcmVmMSA9IHRoaXMuZWwuYXR0cmlidXRlcyB8fCBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYXR0cmlidXRlID0gX3JlZjFbX2ldO1xuICAgICAgICBpZiAoX3JlZjIgPSBhdHRyaWJ1dGUubmFtZSwgX19pbmRleE9mLmNhbGwodGhpcy5jb21wb25lbnQuYXR0cmlidXRlcywgX3JlZjIpID49IDApIHtcbiAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNbYXR0cmlidXRlLm5hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW5mbGVjdGlvbnNbYXR0cmlidXRlLm5hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUuc3luYyA9IGZ1bmN0aW9uKCkge307XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5sb2NhbHMgPSBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBpbnZlcnNlLCBrZXksIG1vZGVsLCBwYXRoLCByZXN1bHQsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjI7XG4gICAgICBpZiAobW9kZWxzID09IG51bGwpIHtcbiAgICAgICAgbW9kZWxzID0gdGhpcy52aWV3Lm1vZGVscztcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgX3JlZjEgPSB0aGlzLmluZmxlY3Rpb25zO1xuICAgICAgZm9yIChrZXkgaW4gX3JlZjEpIHtcbiAgICAgICAgaW52ZXJzZSA9IF9yZWYxW2tleV07XG4gICAgICAgIF9yZWYyID0gaW52ZXJzZS5zcGxpdCgnLicpO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYyLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgcGF0aCA9IF9yZWYyW19pXTtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IChyZXN1bHRba2V5XSB8fCBtb2RlbHMpW3BhdGhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGtleSBpbiBtb2RlbHMpIHtcbiAgICAgICAgbW9kZWwgPSBtb2RlbHNba2V5XTtcbiAgICAgICAgaWYgKHJlc3VsdFtrZXldID09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IG1vZGVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIHJldHVybiAoX3JlZjEgPSB0aGlzLmNvbXBvbmVudFZpZXcpICE9IG51bGwgPyBfcmVmMS51cGRhdGUodGhpcy5sb2NhbHMobW9kZWxzKSkgOiB2b2lkIDA7XG4gICAgfTtcblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbCwgX3JlZjE7XG4gICAgICBpZiAodGhpcy5jb21wb25lbnRWaWV3ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIChfcmVmMSA9IHRoaXMuY29tcG9uZW50VmlldykgIT0gbnVsbCA/IF9yZWYxLmJpbmQoKSA6IHZvaWQgMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsID0gdGhpcy5jb21wb25lbnQuYnVpbGQuY2FsbCh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgICAodGhpcy5jb21wb25lbnRWaWV3ID0gbmV3IFJpdmV0cy5WaWV3KGVsLCB0aGlzLmxvY2FscygpLCB0aGlzLnZpZXcub3B0aW9ucykpLmJpbmQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoZWwsIHRoaXMuZWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIHJldHVybiAoX3JlZjEgPSB0aGlzLmNvbXBvbmVudFZpZXcpICE9IG51bGwgPyBfcmVmMS51bmJpbmQoKSA6IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIENvbXBvbmVudEJpbmRpbmc7XG5cbiAgfSkoUml2ZXRzLkJpbmRpbmcpO1xuXG4gIFJpdmV0cy5UZXh0QmluZGluZyA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVGV4dEJpbmRpbmcsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBUZXh0QmluZGluZyh2aWV3LCBlbCwgdHlwZSwga2V5cGF0aCwgb3B0aW9ucykge1xuICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICB0aGlzLmtleXBhdGggPSBrZXlwYXRoO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9O1xuICAgICAgdGhpcy5zeW5jID0gX19iaW5kKHRoaXMuc3luYywgdGhpcyk7XG4gICAgICB0aGlzLmZvcm1hdHRlcnMgPSB0aGlzLm9wdGlvbnMuZm9ybWF0dGVycyB8fCBbXTtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107XG4gICAgfVxuXG4gICAgVGV4dEJpbmRpbmcucHJvdG90eXBlLmJpbmRlciA9IHtcbiAgICAgIHJvdXRpbmU6IGZ1bmN0aW9uKG5vZGUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBub2RlLmRhdGEgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVGV4dEJpbmRpbmcucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBUZXh0QmluZGluZy5fX3N1cGVyX18uc3luYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gVGV4dEJpbmRpbmc7XG5cbiAgfSkoUml2ZXRzLkJpbmRpbmcpO1xuXG4gIFJpdmV0cy5LZXlwYXRoUGFyc2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEtleXBhdGhQYXJzZXIoKSB7fVxuXG4gICAgS2V5cGF0aFBhcnNlci5wYXJzZSA9IGZ1bmN0aW9uKGtleXBhdGgsIGludGVyZmFjZXMsIHJvb3QpIHtcbiAgICAgIHZhciBjaGFyLCBjdXJyZW50LCBpbmRleCwgdG9rZW5zLCBfaSwgX3JlZjE7XG4gICAgICB0b2tlbnMgPSBbXTtcbiAgICAgIGN1cnJlbnQgPSB7XG4gICAgICAgIFwiaW50ZXJmYWNlXCI6IHJvb3QsXG4gICAgICAgIHBhdGg6ICcnXG4gICAgICB9O1xuICAgICAgZm9yIChpbmRleCA9IF9pID0gMCwgX3JlZjEgPSBrZXlwYXRoLmxlbmd0aDsgX2kgPCBfcmVmMTsgaW5kZXggPSBfaSArPSAxKSB7XG4gICAgICAgIGNoYXIgPSBrZXlwYXRoLmNoYXJBdChpbmRleCk7XG4gICAgICAgIGlmIChfX2luZGV4T2YuY2FsbChpbnRlcmZhY2VzLCBjaGFyKSA+PSAwKSB7XG4gICAgICAgICAgdG9rZW5zLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgY3VycmVudCA9IHtcbiAgICAgICAgICAgIFwiaW50ZXJmYWNlXCI6IGNoYXIsXG4gICAgICAgICAgICBwYXRoOiAnJ1xuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VycmVudC5wYXRoICs9IGNoYXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRva2Vucy5wdXNoKGN1cnJlbnQpO1xuICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9O1xuXG4gICAgcmV0dXJuIEtleXBhdGhQYXJzZXI7XG5cbiAgfSkoKTtcblxuICBSaXZldHMuVGV4dFRlbXBsYXRlUGFyc2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFRleHRUZW1wbGF0ZVBhcnNlcigpIHt9XG5cbiAgICBUZXh0VGVtcGxhdGVQYXJzZXIudHlwZXMgPSB7XG4gICAgICB0ZXh0OiAwLFxuICAgICAgYmluZGluZzogMVxuICAgIH07XG5cbiAgICBUZXh0VGVtcGxhdGVQYXJzZXIucGFyc2UgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgZGVsaW1pdGVycykge1xuICAgICAgdmFyIGluZGV4LCBsYXN0SW5kZXgsIGxhc3RUb2tlbiwgbGVuZ3RoLCBzdWJzdHJpbmcsIHRva2VucywgdmFsdWU7XG4gICAgICB0b2tlbnMgPSBbXTtcbiAgICAgIGxlbmd0aCA9IHRlbXBsYXRlLmxlbmd0aDtcbiAgICAgIGluZGV4ID0gMDtcbiAgICAgIGxhc3RJbmRleCA9IDA7XG4gICAgICB3aGlsZSAobGFzdEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZihkZWxpbWl0ZXJzWzBdLCBsYXN0SW5kZXgpO1xuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy50ZXh0LFxuICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnNsaWNlKGxhc3RJbmRleClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaW5kZXggPiAwICYmIGxhc3RJbmRleCA8IGluZGV4KSB7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMudGV4dCxcbiAgICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyBkZWxpbWl0ZXJzWzBdLmxlbmd0aDtcbiAgICAgICAgICBpbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoZGVsaW1pdGVyc1sxXSwgbGFzdEluZGV4KTtcbiAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgICBzdWJzdHJpbmcgPSB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXggLSBkZWxpbWl0ZXJzWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKChsYXN0VG9rZW4gIT0gbnVsbCA/IGxhc3RUb2tlbi50eXBlIDogdm9pZCAwKSA9PT0gdGhpcy50eXBlcy50ZXh0KSB7XG4gICAgICAgICAgICAgIGxhc3RUb2tlbi52YWx1ZSArPSBzdWJzdHJpbmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy50ZXh0LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBzdWJzdHJpbmdcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXgsIGluZGV4KS50cmltKCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5iaW5kaW5nLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyBkZWxpbWl0ZXJzWzFdLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRleHRUZW1wbGF0ZVBhcnNlcjtcblxuICB9KSgpO1xuXG4gIFJpdmV0cy5PYnNlcnZlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBPYnNlcnZlcih2aWV3LCBtb2RlbCwga2V5cGF0aCwgY2FsbGJhY2spIHtcbiAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICB0aGlzLmtleXBhdGggPSBrZXlwYXRoO1xuICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgdGhpcy51bm9ic2VydmUgPSBfX2JpbmQodGhpcy51bm9ic2VydmUsIHRoaXMpO1xuICAgICAgdGhpcy5yZWFsaXplID0gX19iaW5kKHRoaXMucmVhbGl6ZSwgdGhpcyk7XG4gICAgICB0aGlzLnZhbHVlID0gX19iaW5kKHRoaXMudmFsdWUsIHRoaXMpO1xuICAgICAgdGhpcy5wdWJsaXNoID0gX19iaW5kKHRoaXMucHVibGlzaCwgdGhpcyk7XG4gICAgICB0aGlzLnJlYWQgPSBfX2JpbmQodGhpcy5yZWFkLCB0aGlzKTtcbiAgICAgIHRoaXMuc2V0ID0gX19iaW5kKHRoaXMuc2V0LCB0aGlzKTtcbiAgICAgIHRoaXMuYWRhcHRlciA9IF9fYmluZCh0aGlzLmFkYXB0ZXIsIHRoaXMpO1xuICAgICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICAgICAgdGhpcy5pbml0aWFsaXplID0gX19iaW5kKHRoaXMuaW5pdGlhbGl6ZSwgdGhpcyk7XG4gICAgICB0aGlzLnBhcnNlID0gX19iaW5kKHRoaXMucGFyc2UsIHRoaXMpO1xuICAgICAgdGhpcy5wYXJzZSgpO1xuICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgT2JzZXJ2ZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW50ZXJmYWNlcywgaywgcGF0aCwgcm9vdCwgdiwgX3JlZjE7XG4gICAgICBpbnRlcmZhY2VzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgICBfcmVmMSA9IHRoaXMudmlldy5hZGFwdGVycztcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChrIGluIF9yZWYxKSB7XG4gICAgICAgICAgdiA9IF9yZWYxW2tdO1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKTtcbiAgICAgIGlmIChfcmVmMSA9IHRoaXMua2V5cGF0aFswXSwgX19pbmRleE9mLmNhbGwoaW50ZXJmYWNlcywgX3JlZjEpID49IDApIHtcbiAgICAgICAgcm9vdCA9IHRoaXMua2V5cGF0aFswXTtcbiAgICAgICAgcGF0aCA9IHRoaXMua2V5cGF0aC5zdWJzdHIoMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb290ID0gdGhpcy52aWV3LmNvbmZpZy5yb290SW50ZXJmYWNlO1xuICAgICAgICBwYXRoID0gdGhpcy5rZXlwYXRoO1xuICAgICAgfVxuICAgICAgdGhpcy50b2tlbnMgPSBSaXZldHMuS2V5cGF0aFBhcnNlci5wYXJzZShwYXRoLCBpbnRlcmZhY2VzLCByb290KTtcbiAgICAgIHJldHVybiB0aGlzLmtleSA9IHRoaXMudG9rZW5zLnBvcCgpO1xuICAgIH07XG5cbiAgICBPYnNlcnZlci5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vYmplY3RQYXRoID0gW107XG4gICAgICB0aGlzLnRhcmdldCA9IHRoaXMucmVhbGl6ZSgpO1xuICAgICAgaWYgKHRoaXMudGFyZ2V0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KHRydWUsIHRoaXMua2V5LCB0aGlzLnRhcmdldCwgdGhpcy5jYWxsYmFjayk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIE9ic2VydmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBuZXh0LCBvbGRWYWx1ZTtcbiAgICAgIGlmICgobmV4dCA9IHRoaXMucmVhbGl6ZSgpKSAhPT0gdGhpcy50YXJnZXQpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0ICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLnNldChmYWxzZSwgdGhpcy5rZXksIHRoaXMudGFyZ2V0LCB0aGlzLmNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5zZXQodHJ1ZSwgdGhpcy5rZXksIG5leHQsIHRoaXMuY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIG9sZFZhbHVlID0gdGhpcy52YWx1ZSgpO1xuICAgICAgICB0aGlzLnRhcmdldCA9IG5leHQ7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlKCkgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBPYnNlcnZlci5wcm90b3R5cGUuYWRhcHRlciA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMudmlldy5hZGFwdGVyc1trZXlbXCJpbnRlcmZhY2VcIl1dO1xuICAgIH07XG5cbiAgICBPYnNlcnZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oYWN0aXZlLCBrZXksIG9iaiwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBhY3Rpb247XG4gICAgICBhY3Rpb24gPSBhY3RpdmUgPyAnc3Vic2NyaWJlJyA6ICd1bnN1YnNjcmliZSc7XG4gICAgICByZXR1cm4gdGhpcy5hZGFwdGVyKGtleSlbYWN0aW9uXShvYmosIGtleS5wYXRoLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIE9ic2VydmVyLnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24oa2V5LCBvYmopIHtcbiAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIoa2V5KS5yZWFkKG9iaiwga2V5LnBhdGgpO1xuICAgIH07XG5cbiAgICBPYnNlcnZlci5wcm90b3R5cGUucHVibGlzaCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyKHRoaXMua2V5KS5wdWJsaXNoKHRoaXMudGFyZ2V0LCB0aGlzLmtleS5wYXRoLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIE9ic2VydmVyLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZCh0aGlzLmtleSwgdGhpcy50YXJnZXQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBPYnNlcnZlci5wcm90b3R5cGUucmVhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGN1cnJlbnQsIGluZGV4LCBwcmV2LCB0b2tlbiwgdW5yZWFjaGVkLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBjdXJyZW50ID0gdGhpcy5tb2RlbDtcbiAgICAgIHVucmVhY2hlZCA9IG51bGw7XG4gICAgICBfcmVmMSA9IHRoaXMudG9rZW5zO1xuICAgICAgZm9yIChpbmRleCA9IF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBpbmRleCA9ICsrX2kpIHtcbiAgICAgICAgdG9rZW4gPSBfcmVmMVtpbmRleF07XG4gICAgICAgIGlmIChjdXJyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAodGhpcy5vYmplY3RQYXRoW2luZGV4XSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudCAhPT0gKHByZXYgPSB0aGlzLm9iamVjdFBhdGhbaW5kZXhdKSkge1xuICAgICAgICAgICAgICB0aGlzLnNldChmYWxzZSwgdG9rZW4sIHByZXYsIHRoaXMudXBkYXRlKTtcbiAgICAgICAgICAgICAgdGhpcy5zZXQodHJ1ZSwgdG9rZW4sIGN1cnJlbnQsIHRoaXMudXBkYXRlKTtcbiAgICAgICAgICAgICAgdGhpcy5vYmplY3RQYXRoW2luZGV4XSA9IGN1cnJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KHRydWUsIHRva2VuLCBjdXJyZW50LCB0aGlzLnVwZGF0ZSk7XG4gICAgICAgICAgICB0aGlzLm9iamVjdFBhdGhbaW5kZXhdID0gY3VycmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudCA9IHRoaXMucmVhZCh0b2tlbiwgY3VycmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHVucmVhY2hlZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB1bnJlYWNoZWQgPSBpbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHByZXYgPSB0aGlzLm9iamVjdFBhdGhbaW5kZXhdKSB7XG4gICAgICAgICAgICB0aGlzLnNldChmYWxzZSwgdG9rZW4sIHByZXYsIHRoaXMudXBkYXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh1bnJlYWNoZWQgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9iamVjdFBhdGguc3BsaWNlKHVucmVhY2hlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9O1xuXG4gICAgT2JzZXJ2ZXIucHJvdG90eXBlLnVub2JzZXJ2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGluZGV4LCBvYmosIHRva2VuLCBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgX3JlZjEgPSB0aGlzLnRva2VucztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKGluZGV4ID0gX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IGluZGV4ID0gKytfaSkge1xuICAgICAgICB0b2tlbiA9IF9yZWYxW2luZGV4XTtcbiAgICAgICAgaWYgKG9iaiA9IHRoaXMub2JqZWN0UGF0aFtpbmRleF0pIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuc2V0KGZhbHNlLCB0b2tlbiwgb2JqLCB0aGlzLnVwZGF0ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICByZXR1cm4gT2JzZXJ2ZXI7XG5cbiAgfSkoKTtcblxuICBSaXZldHMuYmluZGVycy50ZXh0ID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgaWYgKGVsLnRleHRDb250ZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBlbC50ZXh0Q29udGVudCA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZWwuaW5uZXJUZXh0ID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzLmh0bWwgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuaW5uZXJIVE1MID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gIH07XG5cbiAgUml2ZXRzLmJpbmRlcnMuc2hvdyA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnJyA6ICdub25lJztcbiAgfTtcblxuICBSaXZldHMuYmluZGVycy5oaWRlID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICdub25lJyA6ICcnO1xuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzLmVuYWJsZWQgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuZGlzYWJsZWQgPSAhdmFsdWU7XG4gIH07XG5cbiAgUml2ZXRzLmJpbmRlcnMuZGlzYWJsZWQgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuZGlzYWJsZWQgPSAhIXZhbHVlO1xuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzLmNoZWNrZWQgPSB7XG4gICAgcHVibGlzaGVzOiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgJ2NoYW5nZScsIHRoaXMucHVibGlzaCk7XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIGlmIChlbC50eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAgIHJldHVybiBlbC5jaGVja2VkID0gKChfcmVmMSA9IGVsLnZhbHVlKSAhPSBudWxsID8gX3JlZjEudG9TdHJpbmcoKSA6IHZvaWQgMCkgPT09ICh2YWx1ZSAhPSBudWxsID8gdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZWwuY2hlY2tlZCA9ICEhdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzLnVuY2hlY2tlZCA9IHtcbiAgICBwdWJsaXNoZXM6IHRydWUsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsICdjaGFuZ2UnLCB0aGlzLnB1Ymxpc2gpO1xuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgaWYgKGVsLnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQgPSAoKF9yZWYxID0gZWwudmFsdWUpICE9IG51bGwgPyBfcmVmMS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKHZhbHVlICE9IG51bGwgPyB2YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbC5jaGVja2VkID0gIXZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBSaXZldHMuYmluZGVycy52YWx1ZSA9IHtcbiAgICBwdWJsaXNoZXM6IHRydWUsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsICdjaGFuZ2UnLCB0aGlzLnB1Ymxpc2gpO1xuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgdmFyIG8sIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVzdWx0cztcbiAgICAgIGlmICh3aW5kb3cualF1ZXJ5ICE9IG51bGwpIHtcbiAgICAgICAgZWwgPSBqUXVlcnkoZWwpO1xuICAgICAgICBpZiAoKHZhbHVlICE9IG51bGwgPyB2YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKChfcmVmMSA9IGVsLnZhbCgpKSAhPSBudWxsID8gX3JlZjEudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZWwudmFsKHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGVsLnR5cGUgPT09ICdzZWxlY3QtbXVsdGlwbGUnKSB7XG4gICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGVsLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICAgIG8gPSBlbFtfaV07XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goby5zZWxlY3RlZCA9IChfcmVmMiA9IG8udmFsdWUsIF9faW5kZXhPZi5jYWxsKHZhbHVlLCBfcmVmMikgPj0gMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgodmFsdWUgIT0gbnVsbCA/IHZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAoKF9yZWYzID0gZWwudmFsdWUpICE9IG51bGwgPyBfcmVmMy50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBlbC52YWx1ZSA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzW1wiaWZcIl0gPSB7XG4gICAgYmxvY2s6IHRydWUsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHZhciBhdHRyLCBkZWNsYXJhdGlvbjtcbiAgICAgIGlmICh0aGlzLm1hcmtlciA9PSBudWxsKSB7XG4gICAgICAgIGF0dHIgPSBbdGhpcy52aWV3LmNvbmZpZy5wcmVmaXgsIHRoaXMudHlwZV0uam9pbignLScpLnJlcGxhY2UoJy0tJywgJy0nKTtcbiAgICAgICAgZGVjbGFyYXRpb24gPSBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIHRoaXMubWFya2VyID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIiByaXZldHM6IFwiICsgdGhpcy50eXBlICsgXCIgXCIgKyBkZWNsYXJhdGlvbiArIFwiIFwiKTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLm1hcmtlciwgZWwpO1xuICAgICAgICByZXR1cm4gZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgcmV0dXJuIChfcmVmMSA9IHRoaXMubmVzdGVkKSAhPSBudWxsID8gX3JlZjEudW5iaW5kKCkgOiB2b2lkIDA7XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHZhciBrZXksIG1vZGVsLCBtb2RlbHMsIG9wdGlvbnMsIF9yZWYxO1xuICAgICAgaWYgKCEhdmFsdWUgPT09ICh0aGlzLm5lc3RlZCA9PSBudWxsKSkge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgICAgICBfcmVmMSA9IHRoaXMudmlldy5tb2RlbHM7XG4gICAgICAgICAgZm9yIChrZXkgaW4gX3JlZjEpIHtcbiAgICAgICAgICAgIG1vZGVsID0gX3JlZjFba2V5XTtcbiAgICAgICAgICAgIG1vZGVsc1trZXldID0gbW9kZWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBiaW5kZXJzOiB0aGlzLnZpZXcub3B0aW9ucy5iaW5kZXJzLFxuICAgICAgICAgICAgZm9ybWF0dGVyczogdGhpcy52aWV3Lm9wdGlvbnMuZm9ybWF0dGVycyxcbiAgICAgICAgICAgIGFkYXB0ZXJzOiB0aGlzLnZpZXcub3B0aW9ucy5hZGFwdGVycyxcbiAgICAgICAgICAgIGNvbmZpZzogdGhpcy52aWV3Lm9wdGlvbnMuY29uZmlnXG4gICAgICAgICAgfTtcbiAgICAgICAgICAodGhpcy5uZXN0ZWQgPSBuZXcgUml2ZXRzLlZpZXcoZWwsIG1vZGVscywgb3B0aW9ucykpLmJpbmQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrZXIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHRoaXMubWFya2VyLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgICB0aGlzLm5lc3RlZC51bmJpbmQoKTtcbiAgICAgICAgICByZXR1cm4gZGVsZXRlIHRoaXMubmVzdGVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgcmV0dXJuIChfcmVmMSA9IHRoaXMubmVzdGVkKSAhPSBudWxsID8gX3JlZjEudXBkYXRlKG1vZGVscykgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzLnVubGVzcyA9IHtcbiAgICBibG9jazogdHJ1ZSxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5iaW5kZXJzW1wiaWZcIl0uYmluZC5jYWxsKHRoaXMsIGVsKTtcbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLmJpbmRlcnNbXCJpZlwiXS51bmJpbmQuY2FsbCh0aGlzKTtcbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5iaW5kZXJzW1wiaWZcIl0ucm91dGluZS5jYWxsKHRoaXMsIGVsLCAhdmFsdWUpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHJldHVybiBSaXZldHMuYmluZGVyc1tcImlmXCJdLnVwZGF0ZS5jYWxsKHRoaXMsIG1vZGVscyk7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzWydvbi0qJ10gPSB7XG4gICAgXCJmdW5jdGlvblwiOiB0cnVlLFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCB0aGlzLmFyZ3NbMF0sIHRoaXMuaGFuZGxlcik7XG4gICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgUml2ZXRzLlV0aWwudW5iaW5kRXZlbnQoZWwsIHRoaXMuYXJnc1swXSwgdGhpcy5oYW5kbGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsIHRoaXMuYXJnc1swXSwgdGhpcy5oYW5kbGVyID0gdGhpcy5ldmVudEhhbmRsZXIodmFsdWUpKTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzLmJpbmRlcnNbJ2VhY2gtKiddID0ge1xuICAgIGJsb2NrOiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgYXR0cjtcbiAgICAgIGlmICh0aGlzLm1hcmtlciA9PSBudWxsKSB7XG4gICAgICAgIGF0dHIgPSBbdGhpcy52aWV3LmNvbmZpZy5wcmVmaXgsIHRoaXMudHlwZV0uam9pbignLScpLnJlcGxhY2UoJy0tJywgJy0nKTtcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwiIHJpdmV0czogXCIgKyB0aGlzLnR5cGUgKyBcIiBcIik7XG4gICAgICAgIHRoaXMuaXRlcmF0ZWQgPSBbXTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLm1hcmtlciwgZWwpO1xuICAgICAgICByZXR1cm4gZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgdmlldywgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLml0ZXJhdGVkICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjEgPSB0aGlzLml0ZXJhdGVkO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgdmlldyA9IF9yZWYxW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZpZXcudW5iaW5kKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCBjb2xsZWN0aW9uKSB7XG4gICAgICB2YXIgYmluZGluZywgZGF0YSwgaSwgaW5kZXgsIGssIGtleSwgbW9kZWwsIG1vZGVsTmFtZSwgb3B0aW9ucywgcHJldmlvdXMsIHRlbXBsYXRlLCB2LCB2aWV3LCBfaSwgX2osIF9rLCBfbGVuLCBfbGVuMSwgX2xlbjIsIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0LCBfcmVzdWx0cztcbiAgICAgIG1vZGVsTmFtZSA9IHRoaXMuYXJnc1swXTtcbiAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uIHx8IFtdO1xuICAgICAgaWYgKHRoaXMuaXRlcmF0ZWQubGVuZ3RoID4gY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgX3JlZjEgPSBBcnJheSh0aGlzLml0ZXJhdGVkLmxlbmd0aCAtIGNvbGxlY3Rpb24ubGVuZ3RoKTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGkgPSBfcmVmMVtfaV07XG4gICAgICAgICAgdmlldyA9IHRoaXMuaXRlcmF0ZWQucG9wKCk7XG4gICAgICAgICAgdmlldy51bmJpbmQoKTtcbiAgICAgICAgICB0aGlzLm1hcmtlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHZpZXcuZWxzWzBdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpbmRleCA9IF9qID0gMCwgX2xlbjEgPSBjb2xsZWN0aW9uLmxlbmd0aDsgX2ogPCBfbGVuMTsgaW5kZXggPSArK19qKSB7XG4gICAgICAgIG1vZGVsID0gY29sbGVjdGlvbltpbmRleF07XG4gICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgZGF0YVttb2RlbE5hbWVdID0gbW9kZWw7XG4gICAgICAgIGlmICh0aGlzLml0ZXJhdGVkW2luZGV4XSA9PSBudWxsKSB7XG4gICAgICAgICAgX3JlZjIgPSB0aGlzLnZpZXcubW9kZWxzO1xuICAgICAgICAgIGZvciAoa2V5IGluIF9yZWYyKSB7XG4gICAgICAgICAgICBtb2RlbCA9IF9yZWYyW2tleV07XG4gICAgICAgICAgICBpZiAoZGF0YVtrZXldID09IG51bGwpIHtcbiAgICAgICAgICAgICAgZGF0YVtrZXldID0gbW9kZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHByZXZpb3VzID0gdGhpcy5pdGVyYXRlZC5sZW5ndGggPyB0aGlzLml0ZXJhdGVkW3RoaXMuaXRlcmF0ZWQubGVuZ3RoIC0gMV0uZWxzWzBdIDogdGhpcy5tYXJrZXI7XG4gICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGJpbmRlcnM6IHRoaXMudmlldy5vcHRpb25zLmJpbmRlcnMsXG4gICAgICAgICAgICBmb3JtYXR0ZXJzOiB0aGlzLnZpZXcub3B0aW9ucy5mb3JtYXR0ZXJzLFxuICAgICAgICAgICAgYWRhcHRlcnM6IHRoaXMudmlldy5vcHRpb25zLmFkYXB0ZXJzLFxuICAgICAgICAgICAgY29uZmlnOiB7fVxuICAgICAgICAgIH07XG4gICAgICAgICAgX3JlZjMgPSB0aGlzLnZpZXcub3B0aW9ucy5jb25maWc7XG4gICAgICAgICAgZm9yIChrIGluIF9yZWYzKSB7XG4gICAgICAgICAgICB2ID0gX3JlZjNba107XG4gICAgICAgICAgICBvcHRpb25zLmNvbmZpZ1trXSA9IHY7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wdGlvbnMuY29uZmlnLnByZWxvYWREYXRhID0gdHJ1ZTtcbiAgICAgICAgICB0ZW1wbGF0ZSA9IGVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICB2aWV3ID0gbmV3IFJpdmV0cy5WaWV3KHRlbXBsYXRlLCBkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgICB2aWV3LmJpbmQoKTtcbiAgICAgICAgICB0aGlzLml0ZXJhdGVkLnB1c2godmlldyk7XG4gICAgICAgICAgdGhpcy5tYXJrZXIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGVtcGxhdGUsIHByZXZpb3VzLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLml0ZXJhdGVkW2luZGV4XS5tb2RlbHNbbW9kZWxOYW1lXSAhPT0gbW9kZWwpIHtcbiAgICAgICAgICB0aGlzLml0ZXJhdGVkW2luZGV4XS51cGRhdGUoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChlbC5ub2RlTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgX3JlZjQgPSB0aGlzLnZpZXcuYmluZGluZ3M7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2sgPSAwLCBfbGVuMiA9IF9yZWY0Lmxlbmd0aDsgX2sgPCBfbGVuMjsgX2srKykge1xuICAgICAgICAgIGJpbmRpbmcgPSBfcmVmNFtfa107XG4gICAgICAgICAgaWYgKGJpbmRpbmcuZWwgPT09IHRoaXMubWFya2VyLnBhcmVudE5vZGUgJiYgYmluZGluZy50eXBlID09PSAndmFsdWUnKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcuc3luYygpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIGRhdGEsIGtleSwgbW9kZWwsIHZpZXcsIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBkYXRhID0ge307XG4gICAgICBmb3IgKGtleSBpbiBtb2RlbHMpIHtcbiAgICAgICAgbW9kZWwgPSBtb2RlbHNba2V5XTtcbiAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5hcmdzWzBdKSB7XG4gICAgICAgICAgZGF0YVtrZXldID0gbW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF9yZWYxID0gdGhpcy5pdGVyYXRlZDtcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIHZpZXcgPSBfcmVmMVtfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2godmlldy51cGRhdGUoZGF0YSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHMuYmluZGVyc1snY2xhc3MtKiddID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgdmFyIGVsQ2xhc3M7XG4gICAgZWxDbGFzcyA9IFwiIFwiICsgZWwuY2xhc3NOYW1lICsgXCIgXCI7XG4gICAgaWYgKCF2YWx1ZSA9PT0gKGVsQ2xhc3MuaW5kZXhPZihcIiBcIiArIHRoaXMuYXJnc1swXSArIFwiIFwiKSAhPT0gLTEpKSB7XG4gICAgICByZXR1cm4gZWwuY2xhc3NOYW1lID0gdmFsdWUgPyBcIlwiICsgZWwuY2xhc3NOYW1lICsgXCIgXCIgKyB0aGlzLmFyZ3NbMF0gOiBlbENsYXNzLnJlcGxhY2UoXCIgXCIgKyB0aGlzLmFyZ3NbMF0gKyBcIiBcIiwgJyAnKS50cmltKCk7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0cy5iaW5kZXJzWycqJ10gPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBlbC5zZXRBdHRyaWJ1dGUodGhpcy50eXBlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbC5yZW1vdmVBdHRyaWJ1dGUodGhpcy50eXBlKTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzLmFkYXB0ZXJzWycuJ10gPSB7XG4gICAgaWQ6ICdfcnYnLFxuICAgIGNvdW50ZXI6IDAsXG4gICAgd2Vha21hcDoge30sXG4gICAgd2Vha1JlZmVyZW5jZTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgaWQ7XG4gICAgICBpZiAob2JqW3RoaXMuaWRdID09IG51bGwpIHtcbiAgICAgICAgaWQgPSB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgdGhpcy53ZWFrbWFwW2lkXSA9IHtcbiAgICAgICAgICBjYWxsYmFja3M6IHt9XG4gICAgICAgIH07XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHRoaXMuaWQsIHtcbiAgICAgICAgICB2YWx1ZTogaWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy53ZWFrbWFwW29ialt0aGlzLmlkXV07XG4gICAgfSxcbiAgICBzdHViRnVuY3Rpb246IGZ1bmN0aW9uKG9iaiwgZm4pIHtcbiAgICAgIHZhciBtYXAsIG9yaWdpbmFsLCB3ZWFrbWFwO1xuICAgICAgb3JpZ2luYWwgPSBvYmpbZm5dO1xuICAgICAgbWFwID0gdGhpcy53ZWFrUmVmZXJlbmNlKG9iaik7XG4gICAgICB3ZWFrbWFwID0gdGhpcy53ZWFrbWFwO1xuICAgICAgcmV0dXJuIG9ialtmbl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrLCBrLCByLCByZXNwb25zZSwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0O1xuICAgICAgICByZXNwb25zZSA9IG9yaWdpbmFsLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgICAgX3JlZjEgPSBtYXAucG9pbnRlcnM7XG4gICAgICAgIGZvciAociBpbiBfcmVmMSkge1xuICAgICAgICAgIGsgPSBfcmVmMVtyXTtcbiAgICAgICAgICBfcmVmNCA9IChfcmVmMiA9IChfcmVmMyA9IHdlYWttYXBbcl0pICE9IG51bGwgPyBfcmVmMy5jYWxsYmFja3Nba10gOiB2b2lkIDApICE9IG51bGwgPyBfcmVmMiA6IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjQubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gX3JlZjRbX2ldO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfTtcbiAgICB9LFxuICAgIG9ic2VydmVNdXRhdGlvbnM6IGZ1bmN0aW9uKG9iaiwgcmVmLCBrZXlwYXRoKSB7XG4gICAgICB2YXIgZm4sIGZ1bmN0aW9ucywgbWFwLCBfYmFzZSwgX2ksIF9sZW47XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICAgIG1hcCA9IHRoaXMud2Vha1JlZmVyZW5jZShvYmopO1xuICAgICAgICBpZiAobWFwLnBvaW50ZXJzID09IG51bGwpIHtcbiAgICAgICAgICBtYXAucG9pbnRlcnMgPSB7fTtcbiAgICAgICAgICBmdW5jdGlvbnMgPSBbJ3B1c2gnLCAncG9wJywgJ3NoaWZ0JywgJ3Vuc2hpZnQnLCAnc29ydCcsICdyZXZlcnNlJywgJ3NwbGljZSddO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZnVuY3Rpb25zLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBmbiA9IGZ1bmN0aW9uc1tfaV07XG4gICAgICAgICAgICB0aGlzLnN0dWJGdW5jdGlvbihvYmosIGZuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChfYmFzZSA9IG1hcC5wb2ludGVycylbcmVmXSA9PSBudWxsKSB7XG4gICAgICAgICAgX2Jhc2VbcmVmXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfX2luZGV4T2YuY2FsbChtYXAucG9pbnRlcnNbcmVmXSwga2V5cGF0aCkgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcC5wb2ludGVyc1tyZWZdLnB1c2goa2V5cGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVub2JzZXJ2ZU11dGF0aW9uczogZnVuY3Rpb24ob2JqLCByZWYsIGtleXBhdGgpIHtcbiAgICAgIHZhciBrZXlwYXRocywgX3JlZjE7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmogJiYgKG9ialt0aGlzLmlkXSAhPSBudWxsKSkpIHtcbiAgICAgICAgaWYgKGtleXBhdGhzID0gKF9yZWYxID0gdGhpcy53ZWFrUmVmZXJlbmNlKG9iaikucG9pbnRlcnMpICE9IG51bGwgPyBfcmVmMVtyZWZdIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIGtleXBhdGhzLnNwbGljZShrZXlwYXRocy5pbmRleE9mKGtleXBhdGgpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbihvYmosIGtleXBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY2FsbGJhY2tzLCB2YWx1ZSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgY2FsbGJhY2tzID0gdGhpcy53ZWFrUmVmZXJlbmNlKG9iaikuY2FsbGJhY2tzO1xuICAgICAgaWYgKGNhbGxiYWNrc1trZXlwYXRoXSA9PSBudWxsKSB7XG4gICAgICAgIGNhbGxiYWNrc1trZXlwYXRoXSA9IFtdO1xuICAgICAgICB2YWx1ZSA9IG9ialtrZXlwYXRoXTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5cGF0aCwge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICBfcmVmMSA9IGNhbGxiYWNrc1trZXlwYXRoXTtcbiAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gX3JlZjFbX2ldO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLm9ic2VydmVNdXRhdGlvbnMobmV3VmFsdWUsIG9ialtfdGhpcy5pZF0sIGtleXBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoX19pbmRleE9mLmNhbGwoY2FsbGJhY2tzW2tleXBhdGhdLCBjYWxsYmFjaykgPCAwKSB7XG4gICAgICAgIGNhbGxiYWNrc1trZXlwYXRoXS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9ic2VydmVNdXRhdGlvbnMob2JqW2tleXBhdGhdLCBvYmpbdGhpcy5pZF0sIGtleXBhdGgpO1xuICAgIH0sXG4gICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBjYWxsYmFja3M7XG4gICAgICBjYWxsYmFja3MgPSB0aGlzLndlYWttYXBbb2JqW3RoaXMuaWRdXS5jYWxsYmFja3Nba2V5cGF0aF07XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKSwgMSk7XG4gICAgICByZXR1cm4gdGhpcy51bm9ic2VydmVNdXRhdGlvbnMob2JqW2tleXBhdGhdLCBvYmpbdGhpcy5pZF0sIGtleXBhdGgpO1xuICAgIH0sXG4gICAgcmVhZDogZnVuY3Rpb24ob2JqLCBrZXlwYXRoKSB7XG4gICAgICByZXR1cm4gb2JqW2tleXBhdGhdO1xuICAgIH0sXG4gICAgcHVibGlzaDogZnVuY3Rpb24ob2JqLCBrZXlwYXRoLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXlwYXRoXSA9IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHMuZmFjdG9yeSA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiAgICBleHBvcnRzLl8gPSBSaXZldHM7XG4gICAgZXhwb3J0cy5iaW5kZXJzID0gUml2ZXRzLmJpbmRlcnM7XG4gICAgZXhwb3J0cy5jb21wb25lbnRzID0gUml2ZXRzLmNvbXBvbmVudHM7XG4gICAgZXhwb3J0cy5mb3JtYXR0ZXJzID0gUml2ZXRzLmZvcm1hdHRlcnM7XG4gICAgZXhwb3J0cy5hZGFwdGVycyA9IFJpdmV0cy5hZGFwdGVycztcbiAgICBleHBvcnRzLmNvbmZpZyA9IFJpdmV0cy5jb25maWc7XG4gICAgZXhwb3J0cy5jb25maWd1cmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgcHJvcGVydHksIHZhbHVlO1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICBmb3IgKHByb3BlcnR5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFsdWUgPSBvcHRpb25zW3Byb3BlcnR5XTtcbiAgICAgICAgUml2ZXRzLmNvbmZpZ1twcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBleHBvcnRzLmJpbmQgPSBmdW5jdGlvbihlbCwgbW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgdmlldztcbiAgICAgIGlmIChtb2RlbHMgPT0gbnVsbCkge1xuICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuICAgICAgdmlldyA9IG5ldyBSaXZldHMuVmlldyhlbCwgbW9kZWxzLCBvcHRpb25zKTtcbiAgICAgIHZpZXcuYmluZCgpO1xuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfTtcbiAgfTtcblxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgUml2ZXRzLmZhY3RvcnkoZXhwb3J0cyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnZXhwb3J0cyddLCBmdW5jdGlvbihleHBvcnRzKSB7XG4gICAgICBSaXZldHMuZmFjdG9yeSh0aGlzLnJpdmV0cyA9IGV4cG9ydHMpO1xuICAgICAgcmV0dXJuIGV4cG9ydHM7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgUml2ZXRzLmZhY3RvcnkodGhpcy5yaXZldHMgPSB7fSk7XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS43LjFcbnZhciBHYXRlLCBTcHJpbmdmb3JtLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX3NsaWNlID0gW10uc2xpY2U7XG5cblNwcmluZ2Zvcm0gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFNwcmluZ2Zvcm0oYXR0cnMpIHtcbiAgICB2YXIgZmllbGQsIGtleSwgdmFsdWUsIF9pLCBfbGVuLCBfcmVmO1xuICAgIGlmIChhdHRycyA9PSBudWxsKSB7XG4gICAgICBhdHRycyA9IHt9O1xuICAgIH1cbiAgICB0aGlzLnN1Ym1pdCA9IF9fYmluZCh0aGlzLnN1Ym1pdCwgdGhpcyk7XG4gICAgZm9yIChrZXkgaW4gYXR0cnMpIHtcbiAgICAgIHZhbHVlID0gYXR0cnNba2V5XTtcbiAgICAgIHRoaXNba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5maWVsZEVycm9ycyA9PSBudWxsKSB7XG4gICAgICB0aGlzLmZpZWxkRXJyb3JzID0ge307XG4gICAgfVxuICAgIHRoaXMuZm9ybUVycm9yID0gbnVsbDtcbiAgICB0aGlzLnZhbGlkYXRvcnMgPSB0aGlzLnZhbGlkYXRvcnMgPyB0aGlzLnZhbGlkYXRvcnMuc2xpY2UoKSA6IFtdO1xuICAgIGlmICh0aGlzLmZpZWxkcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLmZpZWxkcyA9IFtdO1xuICAgIH1cbiAgICBfcmVmID0gdGhpcy5maWVsZHM7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBmaWVsZCA9IF9yZWZbX2ldO1xuICAgICAgdGhpcy5maWVsZHNbZmllbGQubmFtZV0gPSBmaWVsZDtcbiAgICB9XG4gIH1cblxuICBTcHJpbmdmb3JtLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUucHJ1bmVkRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfKGRhdGEpLnBpY2soXyh0aGlzLmZpZWxkcykucGx1Y2soJ25hbWUnKSk7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUuZXJyb3JzID0gZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZm9ybUVycm9yID0gZXJyb3JzLmZvcm1FcnJvcjtcbiAgICAgIHRoaXMuZmllbGRFcnJvcnMgPSBlcnJvcnMuZmllbGRFcnJvcnMgfHwgW107XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZm9ybUVycm9yOiB0aGlzLmZvcm1FcnJvcixcbiAgICAgICAgZmllbGRFcnJvcnM6IHRoaXMuZmllbGRFcnJvcnNcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIFNwcmluZ2Zvcm0ucHJvdG90eXBlLnZhbGlkYXRvciA9IGZ1bmN0aW9uKHZhbGlkYXRvcikge1xuICAgIHRoaXMudmFsaWRhdG9ycy5wdXNoKHZhbGlkYXRvcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbihkb25lKSB7XG4gICAgdmFyIGdhdGUsIHZhbGlkYXRvciwgX2ksIF9sZW4sIF9yZWY7XG4gICAgdGhpcy5mb3JtRXJyb3IgPSBudWxsO1xuICAgIHRoaXMuZmllbGRFcnJvcnMgPSB7fTtcbiAgICBnYXRlID0gbmV3IEdhdGUoKTtcbiAgICBfcmVmID0gdGhpcy52YWxpZGF0b3JzIHx8IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgdmFsaWRhdG9yID0gX3JlZltfaV07XG4gICAgICBpZiAodmFsaWRhdG9yLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdmFsaWRhdG9yKHRoaXMsIGdhdGUuY2FsbGJhY2soKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZGF0b3IodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGdhdGUuZmluaXNoZWQoZG9uZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUuaGFzRXJyb3JzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5mb3JtRXJyb3IpIHx8IE9iamVjdC5rZXlzKHRoaXMuZmllbGRFcnJvcnMpLnNvbWUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKF90aGlzLmZpZWxkRXJyb3JzW2tleV0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUuc3VibWl0ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQgIT0gbnVsbCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJvY2Vzc2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb2Nlc3NpbmcgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLnByb2Nlc3MoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5wcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBTcHJpbmdmb3JtLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24oZG9uZSkge1xuICAgIHJldHVybiBkb25lKCk7XG4gIH07XG5cbiAgU3ByaW5nZm9ybS5wcm90b3R5cGUucHJvY2Vzc29yID0gZnVuY3Rpb24ocHJvY2Vzcykge1xuICAgIHRoaXMucHJvY2VzcyA9IHByb2Nlc3M7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIFNwcmluZ2Zvcm07XG5cbn0pKCk7XG5cblNwcmluZ2Zvcm0ucmVxdWlyZWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgcmV0dXJuIGZ1bmN0aW9uKF9hcmcpIHtcbiAgICB2YXIgZGF0YSwgZmllbGQsIGZpZWxkRXJyb3JzLCB2YWx1ZSwgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgIGRhdGEgPSBfYXJnLmRhdGEsIGZpZWxkRXJyb3JzID0gX2FyZy5maWVsZEVycm9ycztcbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZmllbGRzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBmaWVsZCA9IGZpZWxkc1tfaV07XG4gICAgICB2YWx1ZSA9IGRhdGFbZmllbGRdO1xuICAgICAgaWYgKCEodmFsdWUgfHwgdmFsdWUgPT09IGZhbHNlKSkge1xuICAgICAgICBfcmVzdWx0cy5wdXNoKGZpZWxkRXJyb3JzW2ZpZWxkXSA9ICdyZXF1aXJlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG59O1xuXG5HYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYXRlKCkge1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5yZXR1cm5lZENvdW50ID0gMDtcbiAgfVxuXG4gIEdhdGUucHJvdG90eXBlLmNoZWNrRG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnJldHVybmVkQ291bnQgPT09IHRoaXMuY2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQodGhpcy5kb25lLCAwKTtcbiAgICB9XG4gIH07XG5cbiAgR2F0ZS5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FsbGJhY2ssIGNhbGxlZDtcbiAgICBjYWxsZWQgPSBmYWxzZTtcbiAgICBjYWxsYmFjayA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoY2FsbGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgIF90aGlzLnJldHVybmVkQ291bnQgKz0gMTtcbiAgICAgICAgcmV0dXJuIF90aGlzLmNoZWNrRG9uZSgpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICByZXR1cm4gY2FsbGJhY2s7XG4gIH07XG5cbiAgR2F0ZS5wcm90b3R5cGUuZmluaXNoZWQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMuZG9uZSA9IGNhbGxiYWNrO1xuICAgIHJldHVybiB0aGlzLmNoZWNrRG9uZSgpO1xuICB9O1xuXG4gIHJldHVybiBHYXRlO1xuXG59KSgpO1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBTcHJpbmdmb3JtO1xufVxuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjcuMVxuKGZ1bmN0aW9uKCkge1xuICB2YXIgVGVhY3VwLCBkb2N0eXBlcywgZWxlbWVudHMsIG1lcmdlX2VsZW1lbnRzLCB0YWdOYW1lLCBfZm4sIF9mbjEsIF9mbjIsIF9pLCBfaiwgX2ssIF9sZW4sIF9sZW4xLCBfbGVuMiwgX3JlZiwgX3JlZjEsIF9yZWYyLFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICBfX2luZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuICBkb2N0eXBlcyA9IHtcbiAgICAnZGVmYXVsdCc6ICc8IURPQ1RZUEUgaHRtbD4nLFxuICAgICc1JzogJzwhRE9DVFlQRSBodG1sPicsXG4gICAgJ3htbCc6ICc8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJ1dGYtOFwiID8+JyxcbiAgICAndHJhbnNpdGlvbmFsJzogJzwhRE9DVFlQRSBodG1sIFBVQkxJQyBcIi0vL1czQy8vRFREIFhIVE1MIDEuMCBUcmFuc2l0aW9uYWwvL0VOXCIgXCJodHRwOi8vd3d3LnczLm9yZy9UUi94aHRtbDEvRFREL3hodG1sMS10cmFuc2l0aW9uYWwuZHRkXCI+JyxcbiAgICAnc3RyaWN0JzogJzwhRE9DVFlQRSBodG1sIFBVQkxJQyBcIi0vL1czQy8vRFREIFhIVE1MIDEuMCBTdHJpY3QvL0VOXCIgXCJodHRwOi8vd3d3LnczLm9yZy9UUi94aHRtbDEvRFREL3hodG1sMS1zdHJpY3QuZHRkXCI+JyxcbiAgICAnZnJhbWVzZXQnOiAnPCFET0NUWVBFIGh0bWwgUFVCTElDIFwiLS8vVzNDLy9EVEQgWEhUTUwgMS4wIEZyYW1lc2V0Ly9FTlwiIFwiaHR0cDovL3d3dy53My5vcmcvVFIveGh0bWwxL0RURC94aHRtbDEtZnJhbWVzZXQuZHRkXCI+JyxcbiAgICAnMS4xJzogJzwhRE9DVFlQRSBodG1sIFBVQkxJQyBcIi0vL1czQy8vRFREIFhIVE1MIDEuMS8vRU5cIiBcImh0dHA6Ly93d3cudzMub3JnL1RSL3hodG1sMTEvRFREL3hodG1sMTEuZHRkXCI+JyxcbiAgICAnYmFzaWMnOiAnPCFET0NUWVBFIGh0bWwgUFVCTElDIFwiLS8vVzNDLy9EVEQgWEhUTUwgQmFzaWMgMS4xLy9FTlwiIFwiaHR0cDovL3d3dy53My5vcmcvVFIveGh0bWwtYmFzaWMveGh0bWwtYmFzaWMxMS5kdGRcIj4nLFxuICAgICdtb2JpbGUnOiAnPCFET0NUWVBFIGh0bWwgUFVCTElDIFwiLS8vV0FQRk9SVU0vL0RURCBYSFRNTCBNb2JpbGUgMS4yLy9FTlwiIFwiaHR0cDovL3d3dy5vcGVubW9iaWxlYWxsaWFuY2Uub3JnL3RlY2gvRFREL3hodG1sLW1vYmlsZTEyLmR0ZFwiPicsXG4gICAgJ2NlJzogJzwhRE9DVFlQRSBodG1sIFBVQkxJQyBcIi0vL1czQy8vRFREIFhIVE1MIDEuMCBUcmFuc2l0aW9uYWwvL0VOXCIgXCJjZS1odG1sLTEuMC10cmFuc2l0aW9uYWwuZHRkXCI+J1xuICB9O1xuXG4gIGVsZW1lbnRzID0ge1xuICAgIHJlZ3VsYXI6ICdhIGFiYnIgYWRkcmVzcyBhcnRpY2xlIGFzaWRlIGF1ZGlvIGIgYmRpIGJkbyBibG9ja3F1b3RlIGJvZHkgYnV0dG9uIGNhbnZhcyBjYXB0aW9uIGNpdGUgY29kZSBjb2xncm91cCBkYXRhbGlzdCBkZCBkZWwgZGV0YWlscyBkZm4gZGl2IGRsIGR0IGVtIGZpZWxkc2V0IGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBmb3JtIGgxIGgyIGgzIGg0IGg1IGg2IGhlYWQgaGVhZGVyIGhncm91cCBodG1sIGkgaWZyYW1lIGlucyBrYmQgbGFiZWwgbGVnZW5kIGxpIG1hcCBtYXJrIG1lbnUgbWV0ZXIgbmF2IG5vc2NyaXB0IG9iamVjdCBvbCBvcHRncm91cCBvcHRpb24gb3V0cHV0IHAgcHJlIHByb2dyZXNzIHEgcnAgcnQgcnVieSBzIHNhbXAgc2VjdGlvbiBzZWxlY3Qgc21hbGwgc3BhbiBzdHJvbmcgc3ViIHN1bW1hcnkgc3VwIHRhYmxlIHRib2R5IHRkIHRleHRhcmVhIHRmb290IHRoIHRoZWFkIHRpbWUgdGl0bGUgdHIgdSB1bCB2aWRlbycsXG4gICAgcmF3OiAnc2NyaXB0IHN0eWxlJyxcbiAgICBcInZvaWRcIjogJ2FyZWEgYmFzZSBiciBjb2wgY29tbWFuZCBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJyxcbiAgICBvYnNvbGV0ZTogJ2FwcGxldCBhY3JvbnltIGJnc291bmQgZGlyIGZyYW1lc2V0IG5vZnJhbWVzIGlzaW5kZXggbGlzdGluZyBuZXh0aWQgbm9lbWJlZCBwbGFpbnRleHQgcmIgc3RyaWtlIHhtcCBiaWcgYmxpbmsgY2VudGVyIGZvbnQgbWFycXVlZSBtdWx0aWNvbCBub2JyIHNwYWNlciB0dCcsXG4gICAgb2Jzb2xldGVfdm9pZDogJ2Jhc2Vmb250IGZyYW1lJ1xuICB9O1xuXG4gIG1lcmdlX2VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGEsIGFyZ3MsIGVsZW1lbnQsIHJlc3VsdCwgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZjtcbiAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICByZXN1bHQgPSBbXTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGFyZ3MubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGEgPSBhcmdzW19pXTtcbiAgICAgIF9yZWYgPSBlbGVtZW50c1thXS5zcGxpdCgnICcpO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgZWxlbWVudCA9IF9yZWZbX2pdO1xuICAgICAgICBpZiAoX19pbmRleE9mLmNhbGwocmVzdWx0LCBlbGVtZW50KSA8IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIFRlYWN1cCA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBUZWFjdXAoKSB7XG4gICAgICB0aGlzLmh0bWxPdXQgPSBudWxsO1xuICAgIH1cblxuICAgIFRlYWN1cC5wcm90b3R5cGUucmVzZXRCdWZmZXIgPSBmdW5jdGlvbihodG1sKSB7XG4gICAgICB2YXIgcHJldmlvdXM7XG4gICAgICBpZiAoaHRtbCA9PSBudWxsKSB7XG4gICAgICAgIGh0bWwgPSBudWxsO1xuICAgICAgfVxuICAgICAgcHJldmlvdXMgPSB0aGlzLmh0bWxPdXQ7XG4gICAgICB0aGlzLmh0bWxPdXQgPSBodG1sO1xuICAgICAgcmV0dXJuIHByZXZpb3VzO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MsIHByZXZpb3VzLCByZXN1bHQsIHRlbXBsYXRlO1xuICAgICAgdGVtcGxhdGUgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgcHJldmlvdXMgPSB0aGlzLnJlc2V0QnVmZmVyKCcnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRlbXBsYXRlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5yZXNldEJ1ZmZlcihwcmV2aW91cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLmNlZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzO1xuICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUucmVuZGVyYWJsZSA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICB2YXIgdGVhY3VwO1xuICAgICAgdGVhY3VwID0gdGhpcztcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MsIHJlc3VsdDtcbiAgICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgIGlmICh0ZWFjdXAuaHRtbE91dCA9PT0gbnVsbCkge1xuICAgICAgICAgIHRlYWN1cC5odG1sT3V0ID0gJyc7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRlbXBsYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0ZWFjdXAucmVzZXRCdWZmZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGVtcGxhdGUuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUucmVuZGVyQXR0ciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgICB2YXIgaywgdjtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcIiBcIiArIG5hbWU7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lID09PSAnZGF0YScgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gKChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3Jlc3VsdHM7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIHYgPSB2YWx1ZVtrXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5yZW5kZXJBdHRyKFwiZGF0YS1cIiArIGssIHYpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9KS5jYWxsKHRoaXMpKS5qb2luKCcnKTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICB2YWx1ZSA9IG5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gXCIgXCIgKyBuYW1lICsgXCI9XCIgKyAodGhpcy5xdW90ZSh0aGlzLmVzY2FwZSh2YWx1ZS50b1N0cmluZygpKSkpO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLmF0dHJPcmRlciA9IFsnaWQnLCAnY2xhc3MnXTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUucmVuZGVyQXR0cnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBuYW1lLCByZXN1bHQsIHZhbHVlLCBfaSwgX2xlbiwgX3JlZjtcbiAgICAgIHJlc3VsdCA9ICcnO1xuICAgICAgX3JlZiA9IHRoaXMuYXR0ck9yZGVyO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIG5hbWUgPSBfcmVmW19pXTtcbiAgICAgICAgaWYgKCEobmFtZSBpbiBvYmopKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9IHRoaXMucmVuZGVyQXR0cihuYW1lLCBvYmpbbmFtZV0pO1xuICAgICAgICBkZWxldGUgb2JqW25hbWVdO1xuICAgICAgfVxuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICB2YWx1ZSA9IG9ialtuYW1lXTtcbiAgICAgICAgcmVzdWx0ICs9IHRoaXMucmVuZGVyQXR0cihuYW1lLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnJlbmRlckNvbnRlbnRzID0gZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgIGlmIChjb250ZW50cyA9PSBudWxsKSB7XG5cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBjb250ZW50cy5jYWxsKHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dChjb250ZW50cyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUuaXNTZWxlY3RvciA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgdmFyIF9yZWY7XG4gICAgICByZXR1cm4gc3RyaW5nLmxlbmd0aCA+IDEgJiYgKChfcmVmID0gc3RyaW5nWzBdKSA9PT0gJyMnIHx8IF9yZWYgPT09ICcuJyk7XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUucGFyc2VTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICB2YXIgY2xhc3NlcywgaWQsIGtsYXNzLCB0b2tlbiwgX2ksIF9sZW4sIF9yZWYsIF9yZWYxO1xuICAgICAgaWQgPSBudWxsO1xuICAgICAgY2xhc3NlcyA9IFtdO1xuICAgICAgX3JlZiA9IHNlbGVjdG9yLnNwbGl0KCcuJyk7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgdG9rZW4gPSBfcmVmW19pXTtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKHRva2VuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfcmVmMSA9IHRva2VuLnNwbGl0KCcjJyksIGtsYXNzID0gX3JlZjFbMF0sIGlkID0gX3JlZjFbMV07XG4gICAgICAgICAgaWYgKGtsYXNzICE9PSAnJykge1xuICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKHRva2VuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgY2xhc3NlczogY2xhc3Nlc1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5ub3JtYWxpemVBcmdzID0gZnVuY3Rpb24oYXJncykge1xuICAgICAgdmFyIGFyZywgYXR0cnMsIGNsYXNzZXMsIGNvbnRlbnRzLCBpZCwgaW5kZXgsIHNlbGVjdG9yLCBfaSwgX2xlbjtcbiAgICAgIGF0dHJzID0ge307XG4gICAgICBzZWxlY3RvciA9IG51bGw7XG4gICAgICBjb250ZW50cyA9IG51bGw7XG4gICAgICBmb3IgKGluZGV4ID0gX2kgPSAwLCBfbGVuID0gYXJncy5sZW5ndGg7IF9pIDwgX2xlbjsgaW5kZXggPSArK19pKSB7XG4gICAgICAgIGFyZyA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICBpZiAoYXJnICE9IG51bGwpIHtcbiAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBhcmcpIHtcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCAmJiB0aGlzLmlzU2VsZWN0b3IoYXJnKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gdGhpcy5wYXJzZVNlbGVjdG9yKGFyZyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGVudHMgPSBhcmc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICAgIGNvbnRlbnRzID0gYXJnO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICAgIGlmIChhcmcuY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGF0dHJzID0gYXJnO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRzID0gYXJnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgY29udGVudHMgPSBhcmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCkge1xuICAgICAgICBpZCA9IHNlbGVjdG9yLmlkLCBjbGFzc2VzID0gc2VsZWN0b3IuY2xhc3NlcztcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhdHRycy5pZCA9IGlkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGFzc2VzICE9IG51bGwgPyBjbGFzc2VzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgIGF0dHJzW1wiY2xhc3NcIl0gPSBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYXR0cnM6IGF0dHJzLFxuICAgICAgICBjb250ZW50czogY29udGVudHNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUudGFnID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgYXR0cnMsIGNvbnRlbnRzLCB0YWdOYW1lLCBfcmVmO1xuICAgICAgdGFnTmFtZSA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICBfcmVmID0gdGhpcy5ub3JtYWxpemVBcmdzKGFyZ3MpLCBhdHRycyA9IF9yZWYuYXR0cnMsIGNvbnRlbnRzID0gX3JlZi5jb250ZW50cztcbiAgICAgIHRoaXMucmF3KFwiPFwiICsgdGFnTmFtZSArICh0aGlzLnJlbmRlckF0dHJzKGF0dHJzKSkgKyBcIj5cIik7XG4gICAgICB0aGlzLnJlbmRlckNvbnRlbnRzKGNvbnRlbnRzKTtcbiAgICAgIHJldHVybiB0aGlzLnJhdyhcIjwvXCIgKyB0YWdOYW1lICsgXCI+XCIpO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnJhd1RhZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MsIGF0dHJzLCBjb250ZW50cywgdGFnTmFtZSwgX3JlZjtcbiAgICAgIHRhZ05hbWUgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgX3JlZiA9IHRoaXMubm9ybWFsaXplQXJncyhhcmdzKSwgYXR0cnMgPSBfcmVmLmF0dHJzLCBjb250ZW50cyA9IF9yZWYuY29udGVudHM7XG4gICAgICB0aGlzLnJhdyhcIjxcIiArIHRhZ05hbWUgKyAodGhpcy5yZW5kZXJBdHRycyhhdHRycykpICsgXCI+XCIpO1xuICAgICAgdGhpcy5yYXcoY29udGVudHMpO1xuICAgICAgcmV0dXJuIHRoaXMucmF3KFwiPC9cIiArIHRhZ05hbWUgKyBcIj5cIik7XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUuc2VsZkNsb3NpbmdUYWcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBhdHRycywgY29udGVudHMsIHRhZywgX3JlZjtcbiAgICAgIHRhZyA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICBfcmVmID0gdGhpcy5ub3JtYWxpemVBcmdzKGFyZ3MpLCBhdHRycyA9IF9yZWYuYXR0cnMsIGNvbnRlbnRzID0gX3JlZi5jb250ZW50cztcbiAgICAgIGlmIChjb250ZW50cykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUZWFjdXA6IDxcIiArIHRhZyArIFwiLz4gbXVzdCBub3QgaGF2ZSBjb250ZW50LiAgQXR0ZW1wdGVkIHRvIG5lc3QgXCIgKyBjb250ZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yYXcoXCI8XCIgKyB0YWcgKyAodGhpcy5yZW5kZXJBdHRycyhhdHRycykpICsgXCIgLz5cIik7XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUuY29mZmVlc2NyaXB0ID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiB0aGlzLnJhdyhcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj4oZnVuY3Rpb24oKSB7XFxuICB2YXIgX19zbGljZSA9IFtdLnNsaWNlLFxcbiAgICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9LFxcbiAgICAgIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxcbiAgICAgIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xcbiAgKFwiICsgKGZuLnRvU3RyaW5nKCkpICsgXCIpKCk7XFxufSkoKTs8L3NjcmlwdD5cIik7XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUuY29tbWVudCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJhdyhcIjwhLS1cIiArICh0aGlzLmVzY2FwZSh0ZXh0KSkgKyBcIi0tPlwiKTtcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5kb2N0eXBlID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgICAgICB0eXBlID0gNTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJhdyhkb2N0eXBlc1t0eXBlXSk7XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUuaWUgPSBmdW5jdGlvbihjb25kaXRpb24sIGNvbnRlbnRzKSB7XG4gICAgICB0aGlzLnJhdyhcIjwhLS1baWYgXCIgKyAodGhpcy5lc2NhcGUoY29uZGl0aW9uKSkgKyBcIl0+XCIpO1xuICAgICAgdGhpcy5yZW5kZXJDb250ZW50cyhjb250ZW50cyk7XG4gICAgICByZXR1cm4gdGhpcy5yYXcoXCI8IVtlbmRpZl0tLT5cIik7XG4gICAgfTtcblxuICAgIFRlYWN1cC5wcm90b3R5cGUudGV4dCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgIGlmICh0aGlzLmh0bWxPdXQgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUZWFjdXA6IGNhbid0IGNhbGwgYSB0YWcgZnVuY3Rpb24gb3V0c2lkZSBhIHJlbmRlcmluZyBjb250ZXh0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaHRtbE91dCArPSAocyAhPSBudWxsKSAmJiB0aGlzLmVzY2FwZShzLnRvU3RyaW5nKCkpIHx8ICcnO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnJhdyA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgIGlmIChzID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaHRtbE91dCArPSBzO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLmVzY2FwZSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0LnRvU3RyaW5nKCkucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgICB9O1xuXG4gICAgVGVhY3VwLnByb3RvdHlwZS5xdW90ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gXCJcXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiO1xuICAgIH07XG5cbiAgICBUZWFjdXAucHJvdG90eXBlLnRhZ3MgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib3VuZCwgYm91bmRNZXRob2ROYW1lcywgbWV0aG9kLCBfZm4sIF9pLCBfbGVuO1xuICAgICAgYm91bmQgPSB7fTtcbiAgICAgIGJvdW5kTWV0aG9kTmFtZXMgPSBbXS5jb25jYXQoJ2NlZGUgY29mZmVlc2NyaXB0IGNvbW1lbnQgZG9jdHlwZSBlc2NhcGUgaWUgbm9ybWFsaXplQXJncyByYXcgcmVuZGVyIHJlbmRlcmFibGUgc2NyaXB0IHRhZyB0ZXh0Jy5zcGxpdCgnICcpLCBtZXJnZV9lbGVtZW50cygncmVndWxhcicsICdvYnNvbGV0ZScsICdyYXcnLCAndm9pZCcsICdvYnNvbGV0ZV92b2lkJykpO1xuICAgICAgX2ZuID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICByZXR1cm4gYm91bmRbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpc1ttZXRob2RdLmFwcGx5KF90aGlzLCBhcmdzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGJvdW5kTWV0aG9kTmFtZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgbWV0aG9kID0gYm91bmRNZXRob2ROYW1lc1tfaV07XG4gICAgICAgIF9mbihtZXRob2QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJvdW5kO1xuICAgIH07XG5cbiAgICByZXR1cm4gVGVhY3VwO1xuXG4gIH0pKCk7XG5cbiAgX3JlZiA9IG1lcmdlX2VsZW1lbnRzKCdyZWd1bGFyJywgJ29ic29sZXRlJyk7XG4gIF9mbiA9IGZ1bmN0aW9uKHRhZ05hbWUpIHtcbiAgICByZXR1cm4gVGVhY3VwLnByb3RvdHlwZVt0YWdOYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3M7XG4gICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgIHJldHVybiB0aGlzLnRhZy5hcHBseSh0aGlzLCBbdGFnTmFtZV0uY29uY2F0KF9fc2xpY2UuY2FsbChhcmdzKSkpO1xuICAgIH07XG4gIH07XG4gIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgIHRhZ05hbWUgPSBfcmVmW19pXTtcbiAgICBfZm4odGFnTmFtZSk7XG4gIH1cblxuICBfcmVmMSA9IG1lcmdlX2VsZW1lbnRzKCdyYXcnKTtcbiAgX2ZuMSA9IGZ1bmN0aW9uKHRhZ05hbWUpIHtcbiAgICByZXR1cm4gVGVhY3VwLnByb3RvdHlwZVt0YWdOYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3M7XG4gICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgIHJldHVybiB0aGlzLnJhd1RhZy5hcHBseSh0aGlzLCBbdGFnTmFtZV0uY29uY2F0KF9fc2xpY2UuY2FsbChhcmdzKSkpO1xuICAgIH07XG4gIH07XG4gIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYxLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgIHRhZ05hbWUgPSBfcmVmMVtfal07XG4gICAgX2ZuMSh0YWdOYW1lKTtcbiAgfVxuXG4gIF9yZWYyID0gbWVyZ2VfZWxlbWVudHMoJ3ZvaWQnLCAnb2Jzb2xldGVfdm9pZCcpO1xuICBfZm4yID0gZnVuY3Rpb24odGFnTmFtZSkge1xuICAgIHJldHVybiBUZWFjdXAucHJvdG90eXBlW3RhZ05hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncztcbiAgICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZkNsb3NpbmdUYWcuYXBwbHkodGhpcywgW3RhZ05hbWVdLmNvbmNhdChfX3NsaWNlLmNhbGwoYXJncykpKTtcbiAgICB9O1xuICB9O1xuICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmMi5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICB0YWdOYW1lID0gX3JlZjJbX2tdO1xuICAgIF9mbjIodGFnTmFtZSk7XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwgPyBtb2R1bGUuZXhwb3J0cyA6IHZvaWQgMCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gbmV3IFRlYWN1cCgpLnRhZ3MoKTtcbiAgICBtb2R1bGUuZXhwb3J0cy5UZWFjdXAgPSBUZWFjdXA7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd0ZWFjdXAnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFRlYWN1cCgpLnRhZ3MoKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cudGVhY3VwID0gbmV3IFRlYWN1cCgpLnRhZ3MoKTtcbiAgICB3aW5kb3cudGVhY3VwLlRlYWN1cCA9IFRlYWN1cDtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwie3JlbmRlcmFibGUsIGJ1dHRvbiwgZm9ybSwgZGl2LCBpbnB1dCwgbGFiZWwsIHNwYW4sIG5vcm1hbGl6ZUFyZ3N9ID0gcmVxdWlyZSAndGVhY3VwJ1xuXG5uYW1lVG9MYWJlbCA9IChuYW1lKSAtPlxuICBuYW1lXG4gICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpXG4gICAgLnJlcGxhY2UoLyheW2Etel0pL2csIChzdHIsIHAxKSAtPiBwMS50b1VwcGVyQ2FzZSgpKVxuXG5cbnByZWZpeGVkID0gKHByZWZpeD0nJykgLT5cbiAgcmlib3Nwcml0ZSA9IHt9XG5cbiAgX3ByZWZpeGVkID0gKG5hbWVzcGFjZSkgLT5cbiAgICBpZiBwcmVmaXggdGhlbiAoYWN0aW9uKSAtPlxuICAgICAgW25hbWVzcGFjZSwgcHJlZml4LCBhY3Rpb25dLmpvaW4gJy0nXG4gICAgZWxzZSAoYWN0aW9uKSAtPlxuICAgICAgXCIje25hbWVzcGFjZX0tI3thY3Rpb259XCJcblxuXG4gIHJ2UHJlZml4ZWQgPSBfcHJlZml4ZWQgJ3J2J1xuICByaWJvUHJlZml4ZWQgPSBfcHJlZml4ZWQgJ3JpYm8nXG5cbiAgbm9ybWFsaXplSGVscGVyQXJncyA9IChhcmdzKSAtPlxuICAgIHthdHRycywgY29udGVudHN9ID0gbm9ybWFsaXplQXJncyBhcmdzXG4gICAgbmFtZSA9IGF0dHJzLm5hbWVcbiAgICBkZWxldGUgYXR0cnMubmFtZVxuICAgIHthdHRycywgY29udGVudHMsIG5hbWV9XG5cbiAgbm9ybWFsaXplRmllbGRBcmdzID0gKGFyZ3MpIC0+XG4gICAge2F0dHJzLCBjb250ZW50c30gPSBub3JtYWxpemVBcmdzIGFyZ3NcbiAgICBkZWxldGUgYXR0cnMubGFiZWxcbiAgICBuYW1lID0gYXR0cnMubmFtZVxuICAgIGRlbGV0ZSBhdHRycy5uYW1lXG4gICAgbGFiZWxUZXh0ID0gYXR0cnMubGFiZWxcbiAgICBpZiBuYW1lXG4gICAgICBsYWJlbFRleHQgPz0gbmFtZVRvTGFiZWwgbmFtZVxuICAgICAgYXR0cnMuaWQgPz0gcmlib1ByZWZpeGVkIG5hbWVcblxuICAgIHthdHRycywgY29udGVudHMsIGxhYmVsVGV4dCwgbmFtZX1cblxuICByaWJvc3ByaXRlLmhlbHBUZXh0ID0gLT5cbiAgICB7YXR0cnMsIGNvbnRlbnRzLCBuYW1lfSA9IG5vcm1hbGl6ZUhlbHBlckFyZ3MgYXJndW1lbnRzXG4gICAgYXR0cnNbcnZQcmVmaXhlZCAndGV4dCddID0gXCJmaWVsZEVycm9ycy4je25hbWV9XCJcbiAgICBzcGFuICcuaGVscC1ibG9jaycsIGF0dHJzXG5cbiAgcmlib3Nwcml0ZS5mb3JtSGVscFRleHQgPSAtPlxuICAgIGRpdiAnLmhhcy1lcnJvcicsIC0+XG4gICAgICBhdHRycyA9IHt9XG4gICAgICBhdHRyc1tydlByZWZpeGVkICd0ZXh0J10gPSBcImZvcm1FcnJvclwiXG4gICAgICBzcGFuICcuaGVscC1ibG9jaycsIGF0dHJzXG5cbiAgcmlib3Nwcml0ZS5mb3JtR3JvdXAgPSAtPlxuICAgIHthdHRycywgY29udGVudHMsIG5hbWV9ID0gbm9ybWFsaXplSGVscGVyQXJncyBhcmd1bWVudHNcbiAgICBhdHRyc1tydlByZWZpeGVkICdjbGFzcy1oYXMtZXJyb3InXSA9IFwiZmllbGRFcnJvcnMuI3tuYW1lfVwiXG4gICAgZGl2ICcuZm9ybS1ncm91cCcsIGF0dHJzLCBjb250ZW50c1xuXG4gIHJpYm9zcHJpdGUuaW5wdXQgPSAtPlxuICAgIHthdHRycywgY29udGVudHMsIG5hbWUsIGxhYmVsVGV4dH0gPSBub3JtYWxpemVGaWVsZEFyZ3MgYXJndW1lbnRzXG4gICAgYXR0cnNbcnZQcmVmaXhlZCAndmFsdWUnXSA9IFwiZGF0YS4je25hbWV9XCJcblxuICAgIHJpYm9zcHJpdGUuZm9ybUdyb3VwIHtuYW1lfSwgLT5cbiAgICAgIGxhYmVsICcuY29udHJvbC1sYWJlbCcsIGZvcjogYXR0cnMuaWQsIGxhYmVsVGV4dFxuICAgICAgaW5wdXQgJy5mb3JtLWNvbnRyb2wnLCBhdHRyc1xuICAgICAgcmlib3Nwcml0ZS5oZWxwVGV4dCB7bmFtZX1cblxuICByaWJvc3ByaXRlLmZvcm0gPSAtPlxuICAgIHthdHRycywgY29udGVudHN9ID0gbm9ybWFsaXplQXJncyBhcmd1bWVudHNcbiAgICBhdHRyc1tydlByZWZpeGVkICdvbi1zdWJtaXQnXSA9ICdzdWJtaXQnXG4gICAgZm9ybSBhdHRycywgY29udGVudHNcblxuICByaWJvc3ByaXRlLnN1Ym1pdCA9IC0+XG4gICAge2F0dHJzLCBjb250ZW50c30gPSBub3JtYWxpemVBcmdzIGFyZ3VtZW50c1xuICAgIGF0dHJzLnR5cGUgPSAnc3VibWl0J1xuICAgIGNvbnRlbnRzID89ICdTdWJtaXQnXG4gICAgYXR0cnNbcnZQcmVmaXhlZCAnZGlzYWJsZWQnXSA9ICdwcm9jZXNzaW5nJ1xuICAgIGJ1dHRvbiAnLmJ0bi5idG4tcHJpbWFyeScsIGF0dHJzLCBjb250ZW50c1xuXG4gIHJpYm9zcHJpdGVcblxubW9kdWxlLmV4cG9ydHMgPSBwcmVmaXhlZCgpXG5tb2R1bGUuZXhwb3J0cy5wcmVmaXhlZCA9IHByZWZpeGVkXG5cbiJdfQ==
