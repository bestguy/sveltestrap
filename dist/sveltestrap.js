'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal = require('svelte/internal');
var transition = require('svelte/transition');

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function toVal(mix) {
  var k,
      y,
      str = '';

  if (mix) {
    if (_typeof(mix) === 'object') {
      if (!!mix.push) {
        for (k = 0; k < mix.length; k++) {
          if (mix[k] && (y = toVal(mix[k]))) {
            str && (str += ' ');
            str += y;
          }
        }
      } else {
        for (k in mix) {
          if (mix[k] && (y = toVal(k))) {
            str && (str += ' ');
            str += y;
          }
        }
      }
    } else if (typeof mix !== 'boolean' && !mix.call) {
      str && (str += ' ');
      str += mix;
    }
  }

  return str;
}

function clsx () {
  var i = 0,
      x,
      str = '';

  while (i < arguments.length) {
    if (x = toVal(arguments[i++])) {
      str && (str += ' ');
      str += x;
    }
  }

  return str;
}

function create_if_block(ctx) {
  var div, t, div_transition, current;
  var if_block = ctx.toggle && create_if_block_1(ctx);
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (if_block) if_block.c();
      t = internal.space();
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
      internal.attr(div, "role", "alert");
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);
      if (if_block) if_block.m(div, null);
      internal.append(div, t);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (ctx.toggle) {
        if (if_block) {
          if_block.p(changed, ctx);
        } else {
          if_block = create_if_block_1(ctx);
          if_block.c();
          if_block.m(div, t);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }

      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      internal.add_render_callback(function () {
        if (!div_transition) div_transition = internal.create_bidirectional_transition(div, transition.fade, {}, true);
        div_transition.run(1);
      });
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      if (!div_transition) div_transition = internal.create_bidirectional_transition(div, transition.fade, {}, false);
      div_transition.run(0);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (if_block) if_block.d();
      if (default_slot) default_slot.d(detaching);

      if (detaching) {
        if (div_transition) div_transition.end();
      }
    }
  };
} // (29:2) {#if toggle}


function create_if_block_1(ctx) {
  var button, span, dispose;
  return {
    c: function c() {
      button = internal.element("button");
      span = internal.element("span");
      span.textContent = "×";
      internal.attr(span, "aria-hidden", "true");
      button.type = "button";
      button.className = ctx.closeClassNames;
      internal.attr(button, "aria-label", ctx.closeAriaLabel);
      dispose = internal.listen(button, "click", ctx.toggle);
    },
    m: function m(target, anchor) {
      internal.insert(target, button, anchor);
      internal.append(button, span);
    },
    p: function p(changed, ctx) {
      if (changed.closeClassNames) {
        button.className = ctx.closeClassNames;
      }

      if (changed.closeAriaLabel) {
        internal.attr(button, "aria-label", ctx.closeAriaLabel);
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(button);
      }

      dispose();
    }
  };
}

function create_fragment(ctx) {
  var if_block_anchor, current;
  var if_block = ctx.isOpen && create_if_block(ctx);
  return {
    c: function c() {
      if (if_block) if_block.c();
      if_block_anchor = internal.empty();
    },
    m: function m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      internal.insert(target, if_block_anchor, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      if (ctx.isOpen) {
        if (if_block) {
          if_block.p(changed, ctx);
          if_block.i(1);
        } else {
          if_block = create_if_block(ctx);
          if_block.c();
          if_block.i(1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        internal.group_outros();
        internal.on_outro(function () {
          if_block.d(1);
          if_block = null;
        });
        if_block.o(1);
        internal.check_outros();
      }
    },
    i: function i(local) {
      if (current) return;
      if (if_block) if_block.i();
      current = true;
    },
    o: function o(local) {
      if (if_block) if_block.o();
      current = false;
    },
    d: function d(detaching) {
      if (if_block) if_block.d(detaching);

      if (detaching) {
        internal.detach(if_block_anchor);
      }
    }
  };
}

function instance($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? 'success' : _$$props$color,
      _$$props$closeClassNa = $$props.closeClassName,
      closeClassName = _$$props$closeClassNa === void 0 ? '' : _$$props$closeClassNa,
      _$$props$closeAriaLab = $$props.closeAriaLabel,
      closeAriaLabel = _$$props$closeAriaLab === void 0 ? 'Close' : _$$props$closeAriaLab,
      _$$props$isOpen = $$props.isOpen,
      isOpen = _$$props$isOpen === void 0 ? true : _$$props$isOpen,
      _$$props$toggle = $$props.toggle,
      toggle = _$$props$toggle === void 0 ? undefined : _$$props$toggle,
      _$$props$fade = $$props.fade,
      fade = _$$props$fade === void 0 ? true : _$$props$fade;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('closeClassName' in $$props) $$invalidate('closeClassName', closeClassName = $$props.closeClassName);
    if ('closeAriaLabel' in $$props) $$invalidate('closeAriaLabel', closeAriaLabel = $$props.closeAriaLabel);
    if ('isOpen' in $$props) $$invalidate('isOpen', isOpen = $$props.isOpen);
    if ('toggle' in $$props) $$invalidate('toggle', toggle = $$props.toggle);
    if ('fade' in $$props) $$invalidate('fade', fade = $$props.fade);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes, closeClassNames;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      color: 1,
      toggle: 1,
      closeClassName: 1
    };

    if ($$dirty.className || $$dirty.color || $$dirty.toggle) {
      $$invalidate('classes', classes = clsx(className, 'alert', "alert-".concat(color), {
        'alert-dismissible': toggle
      }));
    }

    if ($$dirty.closeClassName) {
      $$invalidate('closeClassNames', closeClassNames = clsx('close', closeClassName));
    }
  };

  return {
    className: className,
    color: color,
    closeClassName: closeClassName,
    closeAriaLabel: closeAriaLabel,
    isOpen: isOpen,
    toggle: toggle,
    fade: fade,
    classes: classes,
    closeClassNames: closeClassNames,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Alert =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Alert, _SvelteComponent);

  function Alert(options) {
    var _this;

    _classCallCheck(this, Alert);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Alert).call(this));
    internal.init(_assertThisInitialized(_this), options, instance, create_fragment, internal.safe_not_equal, ["class", "color", "closeClassName", "closeAriaLabel", "isOpen", "toggle", "fade"]);
    return _this;
  }

  return Alert;
}(internal.SvelteComponent);

function create_fragment$1(ctx) {
  var span, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      span = internal.element("span");
      if (default_slot) default_slot.c();
      span.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(span_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, span, anchor);

      if (default_slot) {
        default_slot.m(span, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        span.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(span);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$1($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? 'secondary' : _$$props$color,
      _$$props$pill = $$props.pill,
      pill = _$$props$pill === void 0 ? false : _$$props$pill;
  var classes = '';
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('pill' in $$props) $$invalidate('pill', pill = $$props.pill);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1,
      color: 1,
      pill: 1
    };

    if ($$dirty.clazz || $$dirty.color || $$dirty.pill) {
      {
        var classNames = [];

        if (clazz) {
          classNames.push(clazz);
        }

        classNames.push('badge');
        classNames.push("badge-".concat(color));

        if (pill) {
          classNames.push('badge-pill');
        }

        $$invalidate('classes', classes = classNames.join(' '));
      }
    }
  };

  return {
    clazz: clazz,
    color: color,
    pill: pill,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Badge =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Badge, _SvelteComponent);

  function Badge(options) {
    var _this;

    _classCallCheck(this, Badge);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Badge).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, internal.safe_not_equal, ["class", "color", "pill"]);
    return _this;
  }

  return Badge;
}(internal.SvelteComponent);

function create_fragment$2(ctx) {
  var nav, ol, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      nav = internal.element("nav");
      ol = internal.element("ol");
      if (default_slot) default_slot.c();
      ol.className = ctx.listClasses;
      internal.attr(nav, "aria-label", ctx.ariaLabel);
      nav.className = ctx.clazz;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(ol_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, nav, anchor);
      internal.append(nav, ol);

      if (default_slot) {
        default_slot.m(ol, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.listClasses) {
        ol.className = ctx.listClasses;
      }

      if (!current || changed.ariaLabel) {
        internal.attr(nav, "aria-label", ctx.ariaLabel);
      }

      if (!current || changed.clazz) {
        nav.className = ctx.clazz;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(nav);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$2($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$ariaLabel = $$props.ariaLabel,
      ariaLabel = _$$props$ariaLabel === void 0 ? 'breadcrumb' : _$$props$ariaLabel,
      _$$props$listClassNam = $$props.listClassName,
      listClassName = _$$props$listClassNam === void 0 ? '' : _$$props$listClassNam;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('ariaLabel' in $$props) $$invalidate('ariaLabel', ariaLabel = $$props.ariaLabel);
    if ('listClassName' in $$props) $$invalidate('listClassName', listClassName = $$props.listClassName);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var listClasses;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      listClassName: 1
    };

    if ($$dirty.listClassName) {
      $$invalidate('listClasses', listClasses = "breadcrumb".concat(listClassName ? " ".concat(listClassName) : ''));
    }
  };

  return {
    clazz: clazz,
    ariaLabel: ariaLabel,
    listClassName: listClassName,
    listClasses: listClasses,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Breadcrumb =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Breadcrumb, _SvelteComponent);

  function Breadcrumb(options) {
    var _this;

    _classCallCheck(this, Breadcrumb);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Breadcrumb).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$2, create_fragment$2, internal.safe_not_equal, ["class", "ariaLabel", "listClassName"]);
    return _this;
  }

  return Breadcrumb;
}(internal.SvelteComponent);

function create_fragment$3(ctx) {
  var li, li_aria_current_value, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      li = internal.element("li");
      if (default_slot) default_slot.c();
      li.className = ctx.classes;
      internal.attr(li, "aria-current", li_aria_current_value = ctx.active ? 'page' : undefined);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(li_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, li, anchor);

      if (default_slot) {
        default_slot.m(li, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        li.className = ctx.classes;
      }

      if ((!current || changed.active) && li_aria_current_value !== (li_aria_current_value = ctx.active ? 'page' : undefined)) {
        internal.attr(li, "aria-current", li_aria_current_value);
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(li);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$3($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active;
  var classes = '';
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1,
      active: 1
    };

    if ($$dirty.clazz || $$dirty.active) {
      $$invalidate('classes', classes = "".concat(clazz).concat(active ? ' active' : '', " breadcrumb-item"));
    }
  };

  return {
    clazz: clazz,
    active: active,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var BreadcrumbItem =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(BreadcrumbItem, _SvelteComponent);

  function BreadcrumbItem(options) {
    var _this;

    _classCallCheck(this, BreadcrumbItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BreadcrumbItem).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$3, create_fragment$3, internal.safe_not_equal, ["class", "active"]);
    return _this;
  }

  return BreadcrumbItem;
}(internal.SvelteComponent);

function create_fragment$4(ctx) {
  var button, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      button = internal.element("button");
      if (default_slot) default_slot.c();
      button.id = ctx.id;
      button.className = ctx.classes;
      button.value = ctx.value;
      dispose = internal.listen(button, "click", ctx.click_handler);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(button_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, button, anchor);

      if (default_slot) {
        default_slot.m(button, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        button.id = ctx.id;
      }

      if (!current || changed.classes) {
        button.className = ctx.classes;
      }

      if (!current || changed.value) {
        button.value = ctx.value;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(button);
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
}

function instance$4($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$block = $$props.block,
      block = _$$props$block === void 0 ? false : _$$props$block,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? 'secondary' : _$$props$color,
      _$$props$outline = $$props.outline,
      outline = _$$props$outline === void 0 ? false : _$$props$outline,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$value = $$props.value,
      value = _$$props$value === void 0 ? '' : _$$props$value,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var classes = '';
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    internal.bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('block' in $$props) $$invalidate('block', block = $$props.block);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('outline' in $$props) $$invalidate('outline', outline = $$props.outline);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('value' in $$props) $$invalidate('value', value = $$props.value);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      outline: 1,
      color: 1,
      block: 1,
      active: 1,
      disabled: 1,
      size: 1,
      clazz: 1
    };

    if ($$dirty.outline || $$dirty.color || $$dirty.block || $$dirty.active || $$dirty.disabled || $$dirty.size || $$dirty.clazz) {
      {
        var classNames = ['btn', "btn".concat(outline ? '-outline' : '', "-").concat(color)];

        if (block) {
          classNames.push('btn-block');
        }

        if (active) {
          classNames.push('active');
        }

        if (disabled) {
          classNames.push('disabled');
        }

        if (size) {
          classNames.push("btn-".concat(size));
        }

        if (clazz) {
          classNames.push(clazz);
        }

        $$invalidate('classes', classes = classNames.join(' '));
      }
    }
  };

  return {
    clazz: clazz,
    active: active,
    block: block,
    disabled: disabled,
    color: color,
    outline: outline,
    size: size,
    value: value,
    id: id,
    classes: classes,
    click_handler: click_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Button =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Button, _SvelteComponent);

  function Button(options) {
    var _this;

    _classCallCheck(this, Button);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Button).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$4, create_fragment$4, internal.safe_not_equal, ["class", "active", "block", "disabled", "color", "outline", "size", "value", "id"]);
    return _this;
  }

  return Button;
}(internal.SvelteComponent);

function create_fragment$5(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        div.id = ctx.id;
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$5($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$vertical = $$props.vertical,
      vertical = _$$props$vertical === void 0 ? false : _$$props$vertical,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('vertical' in $$props) $$invalidate('vertical', vertical = $$props.vertical);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1,
      size: 1,
      vertical: 1
    };

    if ($$dirty.clazz || $$dirty.size || $$dirty.vertical) {
      $$invalidate('classes', classes = clsx(clazz, size ? "btn-group-".concat(size) : false, vertical ? 'btn-group-vertical' : 'btn-group'));
    }
  };

  return {
    clazz: clazz,
    size: size,
    vertical: vertical,
    id: id,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ButtonGroup =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ButtonGroup, _SvelteComponent);

  function ButtonGroup(options) {
    var _this;

    _classCallCheck(this, ButtonGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ButtonGroup).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$5, create_fragment$5, internal.safe_not_equal, ["class", "size", "vertical", "id"]);
    return _this;
  }

  return ButtonGroup;
}(internal.SvelteComponent);

function create_fragment$6(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      internal.attr(div, "aria-label", ctx.ariaLabel);
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.ariaLabel) {
        internal.attr(div, "aria-label", ctx.ariaLabel);
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$6($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$role = $$props.role,
      role = _$$props$role === void 0 ? 'toolbar' : _$$props$role,
      _$$props$ariaLabel = $$props.ariaLabel,
      ariaLabel = _$$props$ariaLabel === void 0 ? '' : _$$props$ariaLabel;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('role' in $$props) $$invalidate('role', role = $$props.role);
    if ('ariaLabel' in $$props) $$invalidate('ariaLabel', ariaLabel = $$props.ariaLabel);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classes', classes = "".concat(clazz, " btn-toolbar"));
    }
  };

  return {
    clazz: clazz,
    role: role,
    ariaLabel: ariaLabel,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ButtonToolbar =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ButtonToolbar, _SvelteComponent);

  function ButtonToolbar(options) {
    var _this;

    _classCallCheck(this, ButtonToolbar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ButtonToolbar).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$6, create_fragment$6, internal.safe_not_equal, ["class", "role", "ariaLabel"]);
    return _this;
  }

  return ButtonToolbar;
}(internal.SvelteComponent);

function create_fragment$7(ctx) {
  var div, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classNames;
      dispose = internal.listen(div, "click", ctx.click_handler);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        div.id = ctx.id;
      }

      if (!current || changed.classNames) {
        div.className = ctx.classNames;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
}

function instance$7($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$inverse = $$props.inverse,
      inverse = _$$props$inverse === void 0 ? false : _$$props$inverse,
      _$$props$block = $$props.block,
      block = _$$props$block === void 0 ? false : _$$props$block,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? '' : _$$props$color,
      _$$props$outline = $$props.outline,
      outline = _$$props$outline === void 0 ? false : _$$props$outline,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    internal.bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('inverse' in $$props) $$invalidate('inverse', inverse = $$props.inverse);
    if ('block' in $$props) $$invalidate('block', block = $$props.block);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('outline' in $$props) $$invalidate('outline', outline = $$props.outline);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classNames;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      inverse: 1,
      block: 1,
      color: 1,
      outline: 1,
      clazz: 1
    };

    if ($$dirty.inverse || $$dirty.block || $$dirty.color || $$dirty.outline || $$dirty.clazz) {
      $$invalidate('classNames', classNames = "card".concat(inverse ? ' card-inverse' : '').concat(block ? ' card-body' : '').concat(color ? "".concat(outline ? ' border' : ' bg', "-").concat(color) : '').concat(clazz ? " ".concat(clazz) : ''));
    }
  };

  return {
    clazz: clazz,
    inverse: inverse,
    block: block,
    color: color,
    outline: outline,
    id: id,
    classNames: classNames,
    click_handler: click_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Card =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Card, _SvelteComponent);

  function Card(options) {
    var _this;

    _classCallCheck(this, Card);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Card).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$7, create_fragment$7, internal.safe_not_equal, ["class", "inverse", "block", "color", "outline", "id"]);
    return _this;
  }

  return Card;
}(internal.SvelteComponent);

function create_fragment$8(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classNames;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        div.id = ctx.id;
      }

      if (!current || changed.classNames) {
        div.className = ctx.classNames;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$8($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classNames;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classNames', classNames = "card-body".concat(clazz ? " ".concat(clazz) : ''));
    }
  };

  return {
    clazz: clazz,
    id: id,
    classNames: classNames,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardBody =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardBody, _SvelteComponent);

  function CardBody(options) {
    var _this;

    _classCallCheck(this, CardBody);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardBody).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$8, create_fragment$8, internal.safe_not_equal, ["class", "id"]);
    return _this;
  }

  return CardBody;
}(internal.SvelteComponent);

function create_fragment$9(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$9($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classes', classes = "".concat(clazz, " card-columns"));
    }
  };

  return {
    clazz: clazz,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardColumns =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardColumns, _SvelteComponent);

  function CardColumns(options) {
    var _this;

    _classCallCheck(this, CardColumns);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardColumns).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$9, create_fragment$9, internal.safe_not_equal, ["class"]);
    return _this;
  }

  return CardColumns;
}(internal.SvelteComponent);

function create_fragment$a(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$a($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classes', classes = "".concat(clazz, " card-deck"));
    }
  };

  return {
    clazz: clazz,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardDeck =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardDeck, _SvelteComponent);

  function CardDeck(options) {
    var _this;

    _classCallCheck(this, CardDeck);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardDeck).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$a, create_fragment$a, internal.safe_not_equal, ["class"]);
    return _this;
  }

  return CardDeck;
}(internal.SvelteComponent);

function create_fragment$b(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$b($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classes', classes = "".concat(clazz, " card-footer"));
    }
  };

  return {
    clazz: clazz,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardFooter =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardFooter, _SvelteComponent);

  function CardFooter(options) {
    var _this;

    _classCallCheck(this, CardFooter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardFooter).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$b, create_fragment$b, internal.safe_not_equal, ["class"]);
    return _this;
  }

  return CardFooter;
}(internal.SvelteComponent);

function create_fragment$c(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$c($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classes', classes = "".concat(clazz, " card-group"));
    }
  };

  return {
    clazz: clazz,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardGroup =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardGroup, _SvelteComponent);

  function CardGroup(options) {
    var _this;

    _classCallCheck(this, CardGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardGroup).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$c, create_fragment$c, internal.safe_not_equal, ["class"]);
    return _this;
  }

  return CardGroup;
}(internal.SvelteComponent);

function create_fragment$d(ctx) {
  var div, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classNames;
      dispose = internal.listen(div, "click", ctx.click_handler);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        div.id = ctx.id;
      }

      if (!current || changed.classNames) {
        div.className = ctx.classNames;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
}

function instance$d($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    internal.bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classNames;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classNames', classNames = "card-header".concat(clazz ? " ".concat(clazz) : ''));
    }
  };

  return {
    clazz: clazz,
    id: id,
    classNames: classNames,
    click_handler: click_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardHeader =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardHeader, _SvelteComponent);

  function CardHeader(options) {
    var _this;

    _classCallCheck(this, CardHeader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardHeader).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$d, create_fragment$d, internal.safe_not_equal, ["class", "id"]);
    return _this;
  }

  return CardHeader;
}(internal.SvelteComponent);

function create_fragment$e(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$e($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classes', classes = "".concat(clazz, " card-img-overlay"));
    }
  };

  return {
    clazz: clazz,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardImgOverlay =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardImgOverlay, _SvelteComponent);

  function CardImgOverlay(options) {
    var _this;

    _classCallCheck(this, CardImgOverlay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardImgOverlay).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$e, create_fragment$e, internal.safe_not_equal, ["class"]);
    return _this;
  }

  return CardImgOverlay;
}(internal.SvelteComponent);

function create_fragment$f(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$f($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classes', classes = "".concat(clazz, " card-text"));
    }
  };

  return {
    clazz: clazz,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardText =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardText, _SvelteComponent);

  function CardText(options) {
    var _this;

    _classCallCheck(this, CardText);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardText).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$f, create_fragment$f, internal.safe_not_equal, ["class"]);
    return _this;
  }

  return CardText;
}(internal.SvelteComponent);

function create_fragment$g(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$g($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1
    };

    if ($$dirty.clazz) {
      $$invalidate('classes', classes = "".concat(clazz, " card-title"));
    }
  };

  return {
    clazz: clazz,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardTitle =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardTitle, _SvelteComponent);

  function CardTitle(options) {
    var _this;

    _classCallCheck(this, CardTitle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardTitle).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$g, create_fragment$g, internal.safe_not_equal, ["class"]);
    return _this;
  }

  return CardTitle;
}(internal.SvelteComponent);

/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = _typeof(value);

  return !!value && (type == 'object' || type == 'function');
}

var lodash_isobject = isObject;

function create_fragment$h(ctx) {
  var div, div_class_value, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = div_class_value = ctx.colClasses.join(' ');
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        div.id = ctx.id;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$h($$self, $$props, $$invalidate) {
  var _$$props = $$props,
      _$$props$class = _$$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$id = _$$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var colClasses = [];

  if (clazz) {
    colClasses.push(clazz);
  }

  var getColumnSizeClass = function getColumnSizeClass(isXs, colWidth, colSize) {
    if (colSize === true || colSize === '') {
      return isXs ? 'col' : "col-".concat(colWidth);
    } else if (colSize === 'auto') {
      return isXs ? 'col-auto' : "col-".concat(colWidth, "-auto");
    }

    return isXs ? "col-".concat(colSize) : "col-".concat(colWidth, "-").concat(colSize);
  };

  var widths = ['xs', 'sm', 'md', 'lg', 'xl'];
  widths.forEach(function (colWidth) {
    var columnProp = $$props[colWidth];

    if (!columnProp && columnProp !== '') {
      return; //no value for this width
    }

    var isXs = colWidth === 'xs';

    if (lodash_isobject(columnProp)) {
      var colSizeInterfix = isXs ? '-' : "-".concat(colWidth, "-");
      var colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

      if (columnProp.size || columnProp.size === '') {
        colClasses.push(colClass);
      }

      if (columnProp.push) {
        colClasses.push("push".concat(colSizeInterfix).concat(columnProp.push));
      }

      if (columnProp.pull) {
        colClasses.push("pull".concat(colSizeInterfix).concat(columnProp.pull));
      }

      if (columnProp.offset) {
        colClasses.push("offset".concat(colSizeInterfix).concat(columnProp.offset));
      }
    } else {
      colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    }
  });
  var _$$props2 = $$props,
      _$$props2$$$slots = _$$props2.$$slots,
      $$slots = _$$props2$$$slots === void 0 ? {} : _$$props2$$$slots,
      $$scope = _$$props2.$$scope;

  $$self.$set = function ($$new_props) {
    $$invalidate('$$props', $$props = internal.assign(internal.assign({}, $$props), $$new_props));
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$new_props) $$invalidate('$$scope', $$scope = $$new_props.$$scope);
  };

  return {
    clazz: clazz,
    id: id,
    colClasses: colClasses,
    $$props: $$props = internal.exclude_internal_props($$props),
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Col =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Col, _SvelteComponent);

  function Col(options) {
    var _this;

    _classCallCheck(this, Col);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Col).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$h, create_fragment$h, internal.safe_not_equal, ["class", "id"]);
    return _this;
  }

  return Col;
}(internal.SvelteComponent);

function create_if_block$1(ctx) {
  var div, div_transition, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      dispose = [internal.listen(div, "introstart", ctx.introstart_handler), internal.listen(div, "introend", ctx.introend_handler), internal.listen(div, "outrostart", ctx.outrostart_handler), internal.listen(div, "outroend", ctx.outroend_handler)];
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      internal.add_render_callback(function () {
        if (!div_transition) div_transition = internal.create_bidirectional_transition(div, transition.slide, {}, true);
        div_transition.run(1);
      });
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      if (!div_transition) div_transition = internal.create_bidirectional_transition(div, transition.slide, {}, false);
      div_transition.run(0);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);

      if (detaching) {
        if (div_transition) div_transition.end();
      }

      internal.run_all(dispose);
    }
  };
}

function create_fragment$i(ctx) {
  var if_block_anchor, current;
  var if_block = ctx.isOpen && create_if_block$1(ctx);
  return {
    c: function c() {
      if (if_block) if_block.c();
      if_block_anchor = internal.empty();
    },
    m: function m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      internal.insert(target, if_block_anchor, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      if (ctx.isOpen) {
        if (if_block) {
          if_block.p(changed, ctx);
          if_block.i(1);
        } else {
          if_block = create_if_block$1(ctx);
          if_block.c();
          if_block.i(1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        internal.group_outros();
        internal.on_outro(function () {
          if_block.d(1);
          if_block = null;
        });
        if_block.o(1);
        internal.check_outros();
      }
    },
    i: function i(local) {
      if (current) return;
      if (if_block) if_block.i();
      current = true;
    },
    o: function o(local) {
      if (if_block) if_block.o();
      current = false;
    },
    d: function d(detaching) {
      if (if_block) if_block.d(detaching);

      if (detaching) {
        internal.detach(if_block_anchor);
      }
    }
  };
}

function instance$i($$self, $$props, $$invalidate) {
  var _$$props$isOpen = $$props.isOpen,
      isOpen = _$$props$isOpen === void 0 ? false : _$$props$isOpen;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function introstart_handler(event) {
    internal.bubble($$self, event);
  }

  function introend_handler(event) {
    internal.bubble($$self, event);
  }

  function outrostart_handler(event) {
    internal.bubble($$self, event);
  }

  function outroend_handler(event) {
    internal.bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('isOpen' in $$props) $$invalidate('isOpen', isOpen = $$props.isOpen);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  return {
    isOpen: isOpen,
    introstart_handler: introstart_handler,
    introend_handler: introend_handler,
    outrostart_handler: outrostart_handler,
    outroend_handler: outroend_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Collapse =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Collapse, _SvelteComponent);

  function Collapse(options) {
    var _this;

    _classCallCheck(this, Collapse);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Collapse).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$i, create_fragment$i, internal.safe_not_equal, ["isOpen"]);
    return _this;
  }

  return Collapse;
}(internal.SvelteComponent);

function create_fragment$j(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classNames;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        div.id = ctx.id;
      }

      if (!current || changed.classNames) {
        div.className = ctx.classNames;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$j($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$fluid = $$props.fluid,
      fluid = _$$props$fluid === void 0 ? false : _$$props$fluid,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('fluid' in $$props) $$invalidate('fluid', fluid = $$props.fluid);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classNames;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      fluid: 1,
      clazz: 1
    };

    if ($$dirty.fluid || $$dirty.clazz) {
      $$invalidate('classNames', classNames = "container".concat(fluid ? '-fluid' : '').concat(clazz ? " ".concat(clazz) : ''));
    }
  };

  return {
    clazz: clazz,
    fluid: fluid,
    id: id,
    classNames: classNames,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Container =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Container, _SvelteComponent);

  function Container(options) {
    var _this;

    _classCallCheck(this, Container);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Container).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$j, create_fragment$j, internal.safe_not_equal, ["class", "fluid", "id"]);
    return _this;
  }

  return Container;
}(internal.SvelteComponent);

function create_fragment$k(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classNames;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        div.id = ctx.id;
      }

      if (!current || changed.classNames) {
        div.className = ctx.classNames;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$k($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? '' : _$$props$color,
      _$$props$row = $$props.row,
      row = _$$props$row === void 0 ? false : _$$props$row,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$check = $$props.check,
      check = _$$props$check === void 0 ? false : _$$props$check,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('row' in $$props) $$invalidate('row', row = $$props.row);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('check' in $$props) $$invalidate('check', check = $$props.check);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classNames;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      color: 1,
      row: 1,
      check: 1,
      disabled: 1,
      clazz: 1
    };

    if ($$dirty.color || $$dirty.row || $$dirty.check || $$dirty.disabled || $$dirty.clazz) {
      $$invalidate('classNames', classNames = "".concat(color ? "has-".concat(color) : '').concat(row ? ' row' : '').concat(check ? ' form-check' : ' form-group').concat(check && disabled ? ' disabled' : '').concat(clazz ? " ".concat(clazz) : ''));
    }
  };

  return {
    clazz: clazz,
    color: color,
    row: row,
    disabled: disabled,
    check: check,
    id: id,
    classNames: classNames,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var FormGroup =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(FormGroup, _SvelteComponent);

  function FormGroup(options) {
    var _this;

    _classCallCheck(this, FormGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormGroup).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$k, create_fragment$k, internal.safe_not_equal, ["class", "color", "row", "disabled", "check", "id"]);
    return _this;
  }

  return FormGroup;
}(internal.SvelteComponent);

function create_if_block_14(ctx) {
  var select, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      select = internal.element("select");
      if (default_slot) default_slot.c();
      select.id = ctx.id;
      select.multiple = ctx.multiple;
      select.className = ctx.combinedClasses;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(select_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, select, anchor);

      if (default_slot) {
        default_slot.m(select, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        select.id = ctx.id;
      }

      if (!current || changed.multiple) {
        select.multiple = ctx.multiple;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(select);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
} // (97:29) 


function create_if_block_13(ctx) {
  var textarea, dispose;
  return {
    c: function c() {
      textarea = internal.element("textarea");
      textarea.id = ctx.id;
      textarea.className = ctx.combinedClasses;
      dispose = internal.listen(textarea, "input", ctx.textarea_input_handler);
    },
    m: function m(target, anchor) {
      internal.insert(target, textarea, anchor);
      textarea.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) textarea.value = ctx.value;

      if (changed.id) {
        textarea.id = ctx.id;
      }
    },
    i: internal.noop,
    o: internal.noop,
    d: function d(detaching) {
      if (detaching) {
        internal.detach(textarea);
      }

      dispose();
    }
  };
} // (68:0) {#if tag === 'input'}


function create_if_block$2(ctx) {
  var if_block_anchor;

  function select_block_type_1(ctx) {
    if (ctx.type === 'text') return create_if_block_1$1;
    if (ctx.type === 'password') return create_if_block_2;
    if (ctx.type === 'email') return create_if_block_3;
    if (ctx.type === 'file') return create_if_block_4;
    if (ctx.type === 'checkbox') return create_if_block_5;
    if (ctx.type === 'radio') return create_if_block_6;
    if (ctx.type === 'url') return create_if_block_7;
    if (ctx.type === 'number') return create_if_block_8;
    if (ctx.type === 'date') return create_if_block_9;
    if (ctx.type === 'time') return create_if_block_10;
    if (ctx.type === 'color') return create_if_block_11;
    if (ctx.type === 'search') return create_if_block_12;
  }

  var current_block_type = select_block_type_1(ctx);
  var if_block = current_block_type && current_block_type(ctx);
  return {
    c: function c() {
      if (if_block) if_block.c();
      if_block_anchor = internal.empty();
    },
    m: function m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      internal.insert(target, if_block_anchor, anchor);
    },
    p: function p(changed, ctx) {
      if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
        if_block.p(changed, ctx);
      } else {
        if (if_block) if_block.d(1);
        if_block = current_block_type && current_block_type(ctx);

        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    i: internal.noop,
    o: internal.noop,
    d: function d(detaching) {
      if (if_block) if_block.d(detaching);

      if (detaching) {
        internal.detach(if_block_anchor);
      }
    }
  };
} // (91:29) 


function create_if_block_12(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "search");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler_9);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (89:28) 


function create_if_block_11(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "color");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler_8);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (87:27) 


function create_if_block_10(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "time");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler_7);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (85:27) 


function create_if_block_9(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "date");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler_6);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (83:29) 


function create_if_block_8(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "number");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler_5);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (81:26) 


function create_if_block_7(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "url");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler_4);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (79:28) 


function create_if_block_6(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "radio");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "change", ctx.input_change_handler_1);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (77:31) 


function create_if_block_5(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "checkbox");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "change", ctx.input_change_handler);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (75:27) 


function create_if_block_4(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "file");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler_3);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
    },
    p: function p(changed, ctx) {
      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (73:28) 


function create_if_block_3(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "email");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler_2);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (71:31) 


function create_if_block_2(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "password");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler_1);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
} // (69:1) {#if type === 'text'}


function create_if_block_1$1(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = internal.element("input");
      input.id = ctx.id;
      internal.attr(input, "type", "text");
      input.readOnly = ctx.readonly;
      input.className = ctx.combinedClasses;
      dispose = internal.listen(input, "input", ctx.input_input_handler);
    },
    m: function m(target, anchor) {
      internal.insert(target, input, anchor);
      input.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value && input.value !== ctx.value) input.value = ctx.value;

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(input);
      }

      dispose();
    }
  };
}

function create_fragment$l(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$2, create_if_block_13, create_if_block_14];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.tag === 'input') return 0;
    if (ctx.tag === 'textarea') return 1;
    if (ctx.tag === 'select') return 2;
    return -1;
  }

  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }

  return {
    c: function c() {
      if (if_block) if_block.c();
      if_block_anchor = internal.empty();
    },
    m: function m(target, anchor) {
      if (~current_block_type_index) if_blocks[current_block_type_index].m(target, anchor);
      internal.insert(target, if_block_anchor, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) if_blocks[current_block_type_index].p(changed, ctx);
      } else {
        if (if_block) {
          internal.group_outros();
          internal.on_outro(function () {
            if_blocks[previous_block_index].d(1);
            if_blocks[previous_block_index] = null;
          });
          if_block.o(1);
          internal.check_outros();
        }

        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
            if_block.c();
          }

          if_block.i(1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        } else {
          if_block = null;
        }
      }
    },
    i: function i(local) {
      if (current) return;
      if (if_block) if_block.i();
      current = true;
    },
    o: function o(local) {
      if (if_block) if_block.o();
      current = false;
    },
    d: function d(detaching) {
      if (~current_block_type_index) if_blocks[current_block_type_index].d(detaching);

      if (detaching) {
        internal.detach(if_block_anchor);
      }
    }
  };
}

function instance$l($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$type = $$props.type,
      type = _$$props$type === void 0 ? 'text' : _$$props$type,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? undefined : _$$props$size,
      _$$props$bsSize = $$props.bsSize,
      bsSize = _$$props$bsSize === void 0 ? undefined : _$$props$bsSize,
      _$$props$valid = $$props.valid,
      valid = _$$props$valid === void 0 ? false : _$$props$valid,
      _$$props$invalid = $$props.invalid,
      invalid = _$$props$invalid === void 0 ? false : _$$props$invalid,
      _$$props$plaintext = $$props.plaintext,
      plaintext = _$$props$plaintext === void 0 ? false : _$$props$plaintext,
      _$$props$addon = $$props.addon,
      addon = _$$props$addon === void 0 ? false : _$$props$addon,
      value = $$props.value,
      _$$props$readonly = $$props.readonly,
      readonly = _$$props$readonly === void 0 ? false : _$$props$readonly,
      _$$props$multiple = $$props.multiple,
      multiple = _$$props$multiple === void 0 ? false : _$$props$multiple,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var checkInput = ['radio', 'checkbox'].indexOf(type) > -1;
  var isNotaNumber = new RegExp('\\D', 'g');
  var fileInput = type === 'file';
  var textareaInput = type === 'textarea';
  var selectInput = type === 'select';
  var tag = selectInput || textareaInput ? type : 'input';
  var formControlClass = 'form-control';

  if (plaintext) {
    formControlClass = "".concat(formControlClass, "-plaintext");
    $$invalidate('tag', tag = 'input');
  } else if (fileInput) {
    formControlClass = "".concat(formControlClass, "-file");
  } else if (checkInput) {
    if (addon) {
      formControlClass = null;
    } else {
      formControlClass = 'form-check-input';
    }
  }

  if (size && isNotaNumber.test(size)) {
    console.warn('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.');
    $$invalidate('bsSize', bsSize = size);
    $$invalidate('size', size = undefined);
  }

  var classNames = [];

  if (clazz) {
    classNames.push(clazz);
  }

  if (invalid) {
    classNames.push('is-invalid');
  }

  if (valid) {
    classNames.push('is-valid');
  }

  if (bsSize) {
    classNames.push("form-control-".concat(bsSize));
  }

  classNames.push(formControlClass);
  var combinedClasses = classNames.join(' ');
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function input_input_handler() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_input_handler_1() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_input_handler_2() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_input_handler_3() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_change_handler() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_change_handler_1() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_input_handler_4() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_input_handler_5() {
    value = internal.to_number(this.value);
    $$invalidate('value', value);
  }

  function input_input_handler_6() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_input_handler_7() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_input_handler_8() {
    value = this.value;
    $$invalidate('value', value);
  }

  function input_input_handler_9() {
    value = this.value;
    $$invalidate('value', value);
  }

  function textarea_input_handler() {
    value = this.value;
    $$invalidate('value', value);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('type' in $$props) $$invalidate('type', type = $$props.type);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('bsSize' in $$props) $$invalidate('bsSize', bsSize = $$props.bsSize);
    if ('valid' in $$props) $$invalidate('valid', valid = $$props.valid);
    if ('invalid' in $$props) $$invalidate('invalid', invalid = $$props.invalid);
    if ('plaintext' in $$props) $$invalidate('plaintext', plaintext = $$props.plaintext);
    if ('addon' in $$props) $$invalidate('addon', addon = $$props.addon);
    if ('value' in $$props) $$invalidate('value', value = $$props.value);
    if ('readonly' in $$props) $$invalidate('readonly', readonly = $$props.readonly);
    if ('multiple' in $$props) $$invalidate('multiple', multiple = $$props.multiple);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  return {
    clazz: clazz,
    type: type,
    size: size,
    bsSize: bsSize,
    valid: valid,
    invalid: invalid,
    plaintext: plaintext,
    addon: addon,
    value: value,
    readonly: readonly,
    multiple: multiple,
    id: id,
    tag: tag,
    combinedClasses: combinedClasses,
    input_input_handler: input_input_handler,
    input_input_handler_1: input_input_handler_1,
    input_input_handler_2: input_input_handler_2,
    input_input_handler_3: input_input_handler_3,
    input_change_handler: input_change_handler,
    input_change_handler_1: input_change_handler_1,
    input_input_handler_4: input_input_handler_4,
    input_input_handler_5: input_input_handler_5,
    input_input_handler_6: input_input_handler_6,
    input_input_handler_7: input_input_handler_7,
    input_input_handler_8: input_input_handler_8,
    input_input_handler_9: input_input_handler_9,
    textarea_input_handler: textarea_input_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Input =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Input, _SvelteComponent);

  function Input(options) {
    var _this;

    _classCallCheck(this, Input);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Input).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$l, create_fragment$l, internal.safe_not_equal, ["class", "type", "size", "bsSize", "valid", "invalid", "plaintext", "addon", "value", "readonly", "multiple", "id"]);
    return _this;
  }

  return Input;
}(internal.SvelteComponent);

function create_fragment$m(ctx) {
  var label, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      label = internal.element("label");
      if (default_slot) default_slot.c();
      label.id = ctx.id;
      label.className = ctx.classNames;
      label.htmlFor = ctx.fore;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(label_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, label, anchor);

      if (default_slot) {
        default_slot.m(label, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        label.id = ctx.id;
      }

      if (!current || changed.classNames) {
        label.className = ctx.classNames;
      }

      if (!current || changed.fore) {
        label.htmlFor = ctx.fore;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(label);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$m($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$hidden = $$props.hidden,
      hidden = _$$props$hidden === void 0 ? false : _$$props$hidden,
      _$$props$check = $$props.check,
      check = _$$props$check === void 0 ? false : _$$props$check,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      fore = $$props["for"],
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('hidden' in $$props) $$invalidate('hidden', hidden = $$props.hidden);
    if ('check' in $$props) $$invalidate('check', check = $$props.check);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('for' in $$props) $$invalidate('fore', fore = $$props["for"]);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classNames;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      hidden: 1,
      check: 1,
      size: 1,
      clazz: 1
    };

    if ($$dirty.hidden || $$dirty.check || $$dirty.size || $$dirty.clazz) {
      $$invalidate('classNames', classNames = "".concat(hidden ? ' sr-only' : '').concat(check ? ' form-check-label' : '').concat(size ? "col-form-label-".concat(size) : '').concat(clazz ? " ".concat(clazz) : ''));
    }
  };

  return {
    clazz: clazz,
    hidden: hidden,
    check: check,
    size: size,
    fore: fore,
    id: id,
    classNames: classNames,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Label =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Label, _SvelteComponent);

  function Label(options) {
    var _this;

    _classCallCheck(this, Label);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Label).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$m, create_fragment$m, internal.safe_not_equal, ["class", "hidden", "check", "size", "for", "id"]);
    return _this;
  }

  return Label;
}(internal.SvelteComponent);

function create_fragment$n(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = internal.create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = internal.element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classNames;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      internal.insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(internal.get_slot_changes(default_slot_1, ctx, changed, null), internal.get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        div.id = ctx.id;
      }

      if (!current || changed.classNames) {
        div.className = ctx.classNames;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        internal.detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$n($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      clazz = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$noGutters = $$props.noGutters,
      noGutters = _$$props$noGutters === void 0 ? false : _$$props$noGutters,
      _$$props$form = $$props.form,
      form = _$$props$form === void 0 ? false : _$$props$form,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('clazz', clazz = $$props["class"]);
    if ('noGutters' in $$props) $$invalidate('noGutters', noGutters = $$props.noGutters);
    if ('form' in $$props) $$invalidate('form', form = $$props.form);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classNames;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clazz: 1,
      noGutters: 1,
      form: 1
    };

    if ($$dirty.clazz || $$dirty.noGutters || $$dirty.form) {
      $$invalidate('classNames', classNames = "".concat(clazz ? clazz : '').concat(noGutters ? ' no-gutters' : '').concat(form ? ' form-row' : ' row'));
    }
  };

  return {
    clazz: clazz,
    noGutters: noGutters,
    form: form,
    id: id,
    classNames: classNames,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Row =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Row, _SvelteComponent);

  function Row(options) {
    var _this;

    _classCallCheck(this, Row);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Row).call(this));
    internal.init(_assertThisInitialized(_this), options, instance$n, create_fragment$n, internal.safe_not_equal, ["class", "noGutters", "form", "id"]);
    return _this;
  }

  return Row;
}(internal.SvelteComponent);

// export { default as Table } from './Table.svelte';

exports.Alert = Alert;
exports.Badge = Badge;
exports.Breadcrumb = Breadcrumb;
exports.BreadcrumbItem = BreadcrumbItem;
exports.Button = Button;
exports.ButtonGroup = ButtonGroup;
exports.ButtonToolbar = ButtonToolbar;
exports.Card = Card;
exports.CardBody = CardBody;
exports.CardColumns = CardColumns;
exports.CardDeck = CardDeck;
exports.CardFooter = CardFooter;
exports.CardGroup = CardGroup;
exports.CardHeader = CardHeader;
exports.CardImgOverlay = CardImgOverlay;
exports.CardText = CardText;
exports.CardTitle = CardTitle;
exports.Col = Col;
exports.Collapse = Collapse;
exports.Container = Container;
exports.FormGroup = FormGroup;
exports.Input = Input;
exports.Label = Label;
exports.Row = Row;
//# sourceMappingURL=sveltestrap.js.map
