import { init, safe_not_equal, SvelteComponent, element, space, attr, insert, append, listen, detach, get_slot_changes, get_slot_context, add_render_callback, create_bidirectional_transition, empty, group_outros, on_outro, check_outros, create_slot, bubble, assign, exclude_internal_props, run_all, to_number, noop, mount_component, get_spread_update } from 'svelte/internal';
import { fade, slide } from 'svelte/transition';

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
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
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (if_block) if_block.c();
      t = space();
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
      attr(div, "role", "alert");
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      if (if_block) if_block.m(div, null);
      append(div, t);

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
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      add_render_callback(function () {
        if (!div_transition) div_transition = create_bidirectional_transition(div, fade, ctx.transition, true);
        div_transition.run(1);
      });
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      if (!div_transition) div_transition = create_bidirectional_transition(div, fade, ctx.transition, false);
      div_transition.run(0);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        detach(div);
      }

      if (if_block) if_block.d();
      if (default_slot) default_slot.d(detaching);

      if (detaching) {
        if (div_transition) div_transition.end();
      }
    }
  };
} // (31:2) {#if toggle}


function create_if_block_1(ctx) {
  var button, span, dispose;
  return {
    c: function c() {
      button = element("button");
      span = element("span");
      span.textContent = "×";
      attr(span, "aria-hidden", "true");
      button.type = "button";
      button.className = ctx.closeClassNames;
      attr(button, "aria-label", ctx.closeAriaLabel);
      dispose = listen(button, "click", ctx.toggle);
    },
    m: function m(target, anchor) {
      insert(target, button, anchor);
      append(button, span);
    },
    p: function p(changed, ctx) {
      if (changed.closeClassNames) {
        button.className = ctx.closeClassNames;
      }

      if (changed.closeAriaLabel) {
        attr(button, "aria-label", ctx.closeAriaLabel);
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(button);
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
      if_block_anchor = empty();
    },
    m: function m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
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
        group_outros();
        on_outro(function () {
          if_block.d(1);
          if_block = null;
        });
        if_block.o(1);
        check_outros();
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
        detach(if_block_anchor);
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
      fade = _$$props$fade === void 0 ? true : _$$props$fade,
      _$$props$transition = $$props.transition,
      transition = _$$props$transition === void 0 ? {
    duration: fade ? 400 : 0
  } : _$$props$transition;
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
    if ('transition' in $$props) $$invalidate('transition', transition = $$props.transition);
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
    transition: transition,
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
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, ["class", "color", "closeClassName", "closeAriaLabel", "isOpen", "toggle", "fade", "transition"]);
    return _this;
  }

  return Alert;
}(SvelteComponent);

function create_fragment$1(ctx) {
  var span, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      span = element("span");
      if (default_slot) default_slot.c();
      span.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(span_nodes);
    },
    m: function m(target, anchor) {
      insert(target, span, anchor);

      if (default_slot) {
        default_slot.m(span, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(span);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$1($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? 'secondary' : _$$props$color,
      _$$props$pill = $$props.pill,
      pill = _$$props$pill === void 0 ? false : _$$props$pill;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('pill' in $$props) $$invalidate('pill', pill = $$props.pill);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      color: 1,
      pill: 1
    };

    if ($$dirty.className || $$dirty.color || $$dirty.pill) {
      $$invalidate('classes', classes = clsx(className, 'badge', "badge-".concat(color), pill ? 'badge-pill' : false));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, safe_not_equal, ["class", "color", "pill"]);
    return _this;
  }

  return Badge;
}(SvelteComponent);

function create_fragment$2(ctx) {
  var nav, ol, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      nav = element("nav");
      ol = element("ol");
      if (default_slot) default_slot.c();
      ol.className = ctx.listClasses;
      attr(nav, "aria-label", ctx.ariaLabel);
      nav.className = ctx.className;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(ol_nodes);
    },
    m: function m(target, anchor) {
      insert(target, nav, anchor);
      append(nav, ol);

      if (default_slot) {
        default_slot.m(ol, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.listClasses) {
        ol.className = ctx.listClasses;
      }

      if (!current || changed.ariaLabel) {
        attr(nav, "aria-label", ctx.ariaLabel);
      }

      if (!current || changed.className) {
        nav.className = ctx.className;
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
        detach(nav);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$2($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$ariaLabel = $$props.ariaLabel,
      ariaLabel = _$$props$ariaLabel === void 0 ? 'breadcrumb' : _$$props$ariaLabel,
      _$$props$listClassNam = $$props.listClassName,
      listClassName = _$$props$listClassNam === void 0 ? '' : _$$props$listClassNam;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
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
      $$invalidate('listClasses', listClasses = clsx('breadcrumb', listClassName));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$2, create_fragment$2, safe_not_equal, ["class", "ariaLabel", "listClassName"]);
    return _this;
  }

  return Breadcrumb;
}(SvelteComponent);

function create_fragment$3(ctx) {
  var li, li_aria_current_value, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      li = element("li");
      if (default_slot) default_slot.c();
      li.className = ctx.classes;
      attr(li, "aria-current", li_aria_current_value = ctx.active ? 'page' : undefined);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(li_nodes);
    },
    m: function m(target, anchor) {
      insert(target, li, anchor);

      if (default_slot) {
        default_slot.m(li, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        li.className = ctx.classes;
      }

      if ((!current || changed.active) && li_aria_current_value !== (li_aria_current_value = ctx.active ? 'page' : undefined)) {
        attr(li, "aria-current", li_aria_current_value);
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
        detach(li);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$3($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      active: 1
    };

    if ($$dirty.className || $$dirty.active) {
      $$invalidate('classes', classes = clsx(className, active ? 'active' : false, 'breadcrumb-item'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$3, create_fragment$3, safe_not_equal, ["class", "active"]);
    return _this;
  }

  return BreadcrumbItem;
}(SvelteComponent);

function create_else_block(ctx) {
  var button, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      button = element("button");
      if (default_slot) default_slot.c();
      button.id = ctx.id;
      button.className = ctx.classes;
      button.value = ctx.value;
      dispose = listen(button, "click", ctx.click_handler_1);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(button_nodes);
    },
    m: function m(target, anchor) {
      insert(target, button, anchor);

      if (default_slot) {
        default_slot.m(button, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(button);
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
} // (28:0) {#if href}


function create_if_block$1(ctx) {
  var a, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      a = element("a");
      if (default_slot) default_slot.c();
      a.id = ctx.id;
      a.className = ctx.classes;
      a.href = ctx.href;
      dispose = listen(a, "click", ctx.click_handler);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(a_nodes);
    },
    m: function m(target, anchor) {
      insert(target, a, anchor);

      if (default_slot) {
        default_slot.m(a, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        a.id = ctx.id;
      }

      if (!current || changed.classes) {
        a.className = ctx.classes;
      }

      if (!current || changed.href) {
        a.href = ctx.href;
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
        detach(a);
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
}

function create_fragment$4(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$1, create_else_block];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.href) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c: function c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m: function m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(changed, ctx);
      } else {
        group_outros();
        on_outro(function () {
          if_blocks[previous_block_index].d(1);
          if_blocks[previous_block_index] = null;
        });
        if_block.o(1);
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }

        if_block.i(1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
      if_blocks[current_block_type_index].d(detaching);

      if (detaching) {
        detach(if_block_anchor);
      }
    }
  };
}

function instance$4($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
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
      id = _$$props$id === void 0 ? '' : _$$props$id,
      _$$props$close = $$props.close,
      close = _$$props$close === void 0 ? false : _$$props$close,
      _$$props$href = $$props.href,
      href = _$$props$href === void 0 ? '' : _$$props$href;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  function click_handler_1(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('block' in $$props) $$invalidate('block', block = $$props.block);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('outline' in $$props) $$invalidate('outline', outline = $$props.outline);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('value' in $$props) $$invalidate('value', value = $$props.value);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('close' in $$props) $$invalidate('close', close = $$props.close);
    if ('href' in $$props) $$invalidate('href', href = $$props.href);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      close: 1,
      outline: 1,
      color: 1,
      size: 1,
      block: 1,
      active: 1,
      disabled: 1
    };

    if ($$dirty.className || $$dirty.close || $$dirty.outline || $$dirty.color || $$dirty.size || $$dirty.block || $$dirty.active || $$dirty.disabled) {
      $$invalidate('classes', classes = clsx(className, {
        close: close
      }, close || 'btn', close || "btn".concat(outline ? '-outline' : '', "-").concat(color), size ? "btn-".concat(size) : false, block ? 'btn-block' : false, {
        active: active,
        disabled: disabled
      }));
    }
  };

  return {
    className: className,
    active: active,
    block: block,
    disabled: disabled,
    color: color,
    outline: outline,
    size: size,
    value: value,
    id: id,
    close: close,
    href: href,
    classes: classes,
    click_handler: click_handler,
    click_handler_1: click_handler_1,
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
    init(_assertThisInitialized(_this), options, instance$4, create_fragment$4, safe_not_equal, ["class", "active", "block", "disabled", "color", "outline", "size", "value", "id", "close", "href"]);
    return _this;
  }

  return Button;
}(SvelteComponent);

function create_fragment$5(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$5($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
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
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('vertical' in $$props) $$invalidate('vertical', vertical = $$props.vertical);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      size: 1,
      vertical: 1
    };

    if ($$dirty.className || $$dirty.size || $$dirty.vertical) {
      $$invalidate('classes', classes = clsx(className, size ? "btn-group-".concat(size) : false, vertical ? 'btn-group-vertical' : 'btn-group'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$5, create_fragment$5, safe_not_equal, ["class", "size", "vertical", "id"]);
    return _this;
  }

  return ButtonGroup;
}(SvelteComponent);

function create_fragment$6(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      attr(div, "aria-label", ctx.ariaLabel);
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.ariaLabel) {
        attr(div, "aria-label", ctx.ariaLabel);
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$6($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$role = $$props.role,
      role = _$$props$role === void 0 ? 'toolbar' : _$$props$role,
      _$$props$ariaLabel = $$props.ariaLabel,
      ariaLabel = _$$props$ariaLabel === void 0 ? '' : _$$props$ariaLabel;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('role' in $$props) $$invalidate('role', role = $$props.role);
    if ('ariaLabel' in $$props) $$invalidate('ariaLabel', ariaLabel = $$props.ariaLabel);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'btn-toolbar'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$6, create_fragment$6, safe_not_equal, ["class", "role", "ariaLabel"]);
    return _this;
  }

  return ButtonToolbar;
}(SvelteComponent);

function create_fragment$7(ctx) {
  var div, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
      dispose = listen(div, "click", ctx.click_handler);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
}

function instance$7($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$inverse = $$props.inverse,
      inverse = _$$props$inverse === void 0 ? false : _$$props$inverse,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? '' : _$$props$color,
      _$$props$body = $$props.body,
      body = _$$props$body === void 0 ? false : _$$props$body,
      _$$props$outline = $$props.outline,
      outline = _$$props$outline === void 0 ? false : _$$props$outline,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('inverse' in $$props) $$invalidate('inverse', inverse = $$props.inverse);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('body' in $$props) $$invalidate('body', body = $$props.body);
    if ('outline' in $$props) $$invalidate('outline', outline = $$props.outline);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      inverse: 1,
      body: 1,
      color: 1,
      outline: 1
    };

    if ($$dirty.className || $$dirty.inverse || $$dirty.body || $$dirty.color || $$dirty.outline) {
      $$invalidate('classes', classes = clsx(className, 'card', inverse ? 'text-white' : false, body ? 'card-body' : false, color ? "".concat(outline ? 'border' : 'bg', "-").concat(color) : false));
    }
  };

  return {
    className: className,
    inverse: inverse,
    color: color,
    body: body,
    outline: outline,
    id: id,
    classes: classes,
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
    init(_assertThisInitialized(_this), options, instance$7, create_fragment$7, safe_not_equal, ["class", "inverse", "color", "body", "outline", "id"]);
    return _this;
  }

  return Card;
}(SvelteComponent);

function create_fragment$8(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$8($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'card-body'));
    }
  };

  return {
    className: className,
    id: id,
    classes: classes,
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
    init(_assertThisInitialized(_this), options, instance$8, create_fragment$8, safe_not_equal, ["class", "id"]);
    return _this;
  }

  return CardBody;
}(SvelteComponent);

function create_fragment$9(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$9($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'card-columns'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$9, create_fragment$9, safe_not_equal, ["class"]);
    return _this;
  }

  return CardColumns;
}(SvelteComponent);

function create_fragment$a(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$a($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'card-deck'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$a, create_fragment$a, safe_not_equal, ["class"]);
    return _this;
  }

  return CardDeck;
}(SvelteComponent);

function create_fragment$b(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$b($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'card-footer'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$b, create_fragment$b, safe_not_equal, ["class"]);
    return _this;
  }

  return CardFooter;
}(SvelteComponent);

function create_fragment$c(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$c($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'card-group'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$c, create_fragment$c, safe_not_equal, ["class"]);
    return _this;
  }

  return CardGroup;
}(SvelteComponent);

function create_fragment$d(ctx) {
  var div, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
      dispose = listen(div, "click", ctx.click_handler);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
}

function instance$d($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'card-header'));
    }
  };

  return {
    className: className,
    id: id,
    classes: classes,
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
    init(_assertThisInitialized(_this), options, instance$d, create_fragment$d, safe_not_equal, ["class", "id"]);
    return _this;
  }

  return CardHeader;
}(SvelteComponent);

function create_fragment$e(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$e($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'card-img-overlay'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$e, create_fragment$e, safe_not_equal, ["class"]);
    return _this;
  }

  return CardImgOverlay;
}(SvelteComponent);

function create_fragment$f(ctx) {
  var _p, current;

  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      _p = element("p");
      if (default_slot) default_slot.c();
      _p.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(p_nodes);
    },
    m: function m(target, anchor) {
      insert(target, _p, anchor);

      if (default_slot) {
        default_slot.m(_p, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        _p.className = ctx.classes;
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
        detach(_p);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$f($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'card-text'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$f, create_fragment$f, safe_not_equal, ["class"]);
    return _this;
  }

  return CardText;
}(SvelteComponent);

function create_fragment$g(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$g($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'card-title'));
    }
  };

  return {
    className: className,
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
    init(_assertThisInitialized(_this), options, instance$g, create_fragment$g, safe_not_equal, ["class"]);
    return _this;
  }

  return CardTitle;
}(SvelteComponent);

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
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = div_class_value = ctx.colClasses.join(' ');
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$h($$self, $$props, $$invalidate) {
  var _$$props = $$props,
      _$$props$class = _$$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$id = _$$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var colClasses = [];

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

  if (!colClasses.length) {
    colClasses.push('col');
  }

  if (className) {
    colClasses.push(className);
  }

  var _$$props2 = $$props,
      _$$props2$$$slots = _$$props2.$$slots,
      $$slots = _$$props2$$$slots === void 0 ? {} : _$$props2$$$slots,
      $$scope = _$$props2.$$scope;

  $$self.$set = function ($$new_props) {
    $$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$new_props) $$invalidate('$$scope', $$scope = $$new_props.$$scope);
  };

  return {
    className: className,
    id: id,
    colClasses: colClasses,
    $$props: $$props = exclude_internal_props($$props),
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
    init(_assertThisInitialized(_this), options, instance$h, create_fragment$h, safe_not_equal, ["class", "id"]);
    return _this;
  }

  return Col;
}(SvelteComponent);

function create_if_block$2(ctx) {
  var div, div_transition, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
      dispose = [listen(div, "introstart", ctx.introstart_handler), listen(div, "introend", ctx.introend_handler), listen(div, "outrostart", ctx.outrostart_handler), listen(div, "outroend", ctx.outroend_handler)];
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (default_slot && default_slot.i) default_slot.i(local);
      add_render_callback(function () {
        if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
        div_transition.run(1);
      });
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
      div_transition.run(0);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);

      if (detaching) {
        if (div_transition) div_transition.end();
      }

      run_all(dispose);
    }
  };
}

function create_fragment$i(ctx) {
  var if_block_anchor, current, dispose;
  add_render_callback(ctx.onwindowresize);
  var if_block = ctx.isOpen && create_if_block$2(ctx);
  return {
    c: function c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
      dispose = listen(window, "resize", ctx.onwindowresize);
    },
    m: function m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      if (ctx.isOpen) {
        if (if_block) {
          if_block.p(changed, ctx);
          if_block.i(1);
        } else {
          if_block = create_if_block$2(ctx);
          if_block.c();
          if_block.i(1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        on_outro(function () {
          if_block.d(1);
          if_block = null;
        });
        if_block.o(1);
        check_outros();
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
        detach(if_block_anchor);
      }

      dispose();
    }
  };
}

function instance$i($$self, $$props, $$invalidate) {
  var _$$props$isOpen = $$props.isOpen,
      isOpen = _$$props$isOpen === void 0 ? false : _$$props$isOpen,
      _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$navbar = $$props.navbar,
      navbar = _$$props$navbar === void 0 ? false : _$$props$navbar;
  var _wasOpen = isOpen;
  var windowWidth = window.innerWidth;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function introstart_handler(event) {
    bubble($$self, event);
  }

  function introend_handler(event) {
    bubble($$self, event);
  }

  function outrostart_handler(event) {
    bubble($$self, event);
  }

  function outroend_handler(event) {
    bubble($$self, event);
  }

  function onwindowresize() {
    windowWidth = window.innerWidth;
    $$invalidate('windowWidth', windowWidth);
  }

  $$self.$set = function ($$props) {
    if ('isOpen' in $$props) $$invalidate('isOpen', isOpen = $$props.isOpen);
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('navbar' in $$props) $$invalidate('navbar', navbar = $$props.navbar);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      navbar: 1,
      windowWidth: 1,
      _wasOpen: 1,
      isOpen: 1
    };

    if ($$dirty.className || $$dirty.navbar) {
      $$invalidate('classes', classes = clsx(className, // collapseClass,
      navbar && 'navbar-collapse'));
    }

    if ($$dirty.windowWidth || $$dirty.navbar || $$dirty._wasOpen || $$dirty.isOpen) {
      if (windowWidth >= 768 && navbar && _wasOpen === isOpen) {
        $$invalidate('_wasOpen', _wasOpen = isOpen);
        $$invalidate('isOpen', isOpen = true);
      } else if (windowWidth < 768) {
        $$invalidate('isOpen', isOpen = _wasOpen);
      }
    }
  };

  return {
    isOpen: isOpen,
    className: className,
    navbar: navbar,
    windowWidth: windowWidth,
    classes: classes,
    introstart_handler: introstart_handler,
    introend_handler: introend_handler,
    outrostart_handler: outrostart_handler,
    outroend_handler: outroend_handler,
    onwindowresize: onwindowresize,
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
    init(_assertThisInitialized(_this), options, instance$i, create_fragment$i, safe_not_equal, ["isOpen", "class", "navbar"]);
    return _this;
  }

  return Collapse;
}(SvelteComponent);

function create_fragment$j(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$j($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$fluid = $$props.fluid,
      fluid = _$$props$fluid === void 0 ? false : _$$props$fluid,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('fluid' in $$props) $$invalidate('fluid', fluid = $$props.fluid);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      fluid: 1
    };

    if ($$dirty.className || $$dirty.fluid) {
      $$invalidate('classes', classes = clsx(className, fluid ? 'container-fluid' : 'container'));
    }
  };

  return {
    className: className,
    fluid: fluid,
    id: id,
    classes: classes,
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
    init(_assertThisInitialized(_this), options, instance$j, create_fragment$j, safe_not_equal, ["class", "fluid", "id"]);
    return _this;
  }

  return Container;
}(SvelteComponent);

function create_fragment$k(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$k($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$row = $$props.row,
      row = _$$props$row === void 0 ? false : _$$props$row,
      _$$props$check = $$props.check,
      check = _$$props$check === void 0 ? false : _$$props$check,
      _$$props$inline = $$props.inline,
      inline = _$$props$inline === void 0 ? false : _$$props$inline,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('row' in $$props) $$invalidate('row', row = $$props.row);
    if ('check' in $$props) $$invalidate('check', check = $$props.check);
    if ('inline' in $$props) $$invalidate('inline', inline = $$props.inline);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      row: 1,
      check: 1,
      inline: 1,
      disabled: 1
    };

    if ($$dirty.className || $$dirty.row || $$dirty.check || $$dirty.inline || $$dirty.disabled) {
      $$invalidate('classes', classes = clsx(className, row ? 'row' : false, check ? 'form-check' : 'form-group', check && inline ? 'form-check-inline' : false, check && disabled ? 'disabled' : false));
    }
  };

  return {
    className: className,
    row: row,
    check: check,
    inline: inline,
    disabled: disabled,
    id: id,
    classes: classes,
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
    init(_assertThisInitialized(_this), options, instance$k, create_fragment$k, safe_not_equal, ["class", "row", "check", "inline", "disabled", "id"]);
    return _this;
  }

  return FormGroup;
}(SvelteComponent);

function create_if_block_14(ctx) {
  var select, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      select = element("select");
      if (default_slot) default_slot.c();
      select.id = ctx.id;
      select.multiple = ctx.multiple;
      select.className = ctx.classes;
      select.name = ctx.name;
      select.disabled = ctx.disabled;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(select_nodes);
    },
    m: function m(target, anchor) {
      insert(target, select, anchor);

      if (default_slot) {
        default_slot.m(select, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        select.id = ctx.id;
      }

      if (!current || changed.multiple) {
        select.multiple = ctx.multiple;
      }

      if (!current || changed.classes) {
        select.className = ctx.classes;
      }

      if (!current || changed.name) {
        select.name = ctx.name;
      }

      if (!current || changed.disabled) {
        select.disabled = ctx.disabled;
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
        detach(select);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
} // (91:29) 


function create_if_block_13(ctx) {
  var textarea, dispose;
  return {
    c: function c() {
      textarea = element("textarea");
      textarea.id = ctx.id;
      textarea.className = ctx.classes;
      textarea.name = ctx.name;
      textarea.disabled = ctx.disabled;
      dispose = listen(textarea, "input", ctx.textarea_input_handler);
    },
    m: function m(target, anchor) {
      insert(target, textarea, anchor);
      textarea.value = ctx.value;
    },
    p: function p(changed, ctx) {
      if (changed.value) textarea.value = ctx.value;

      if (changed.id) {
        textarea.id = ctx.id;
      }

      if (changed.classes) {
        textarea.className = ctx.classes;
      }

      if (changed.name) {
        textarea.name = ctx.name;
      }

      if (changed.disabled) {
        textarea.disabled = ctx.disabled;
      }
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) {
        detach(textarea);
      }

      dispose();
    }
  };
} // (64:0) {#if tag === 'input'}


function create_if_block$3(ctx) {
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
      if_block_anchor = empty();
    },
    m: function m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
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
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (if_block) if_block.d(detaching);

      if (detaching) {
        detach(if_block_anchor);
      }
    }
  };
} // (87:29) 


function create_if_block_12(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "search");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler_9);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (85:28) 


function create_if_block_11(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "color");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler_8);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (83:27) 


function create_if_block_10(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "time");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler_7);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (81:27) 


function create_if_block_9(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "date");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler_6);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (79:29) 


function create_if_block_8(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "number");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler_5);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (77:26) 


function create_if_block_7(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "url");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler_4);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (75:28) 


function create_if_block_6(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "radio");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "change", ctx.input_change_handler_1);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (73:31) 


function create_if_block_5(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "checkbox");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "change", ctx.input_change_handler);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (71:27) 


function create_if_block_4(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "file");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler_3);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
    },
    p: function p(changed, ctx) {
      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.readonly) {
        input.readOnly = ctx.readonly;
      }

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (69:28) 


function create_if_block_3(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "email");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler_2);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (67:31) 


function create_if_block_2(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "password");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler_1);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (65:1) {#if type === 'text'}


function create_if_block_1$1(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "text");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      dispose = listen(input, "input", ctx.input_input_handler);
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
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

      if (changed.classes) {
        input.className = ctx.classes;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
}

function create_fragment$l(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$3, create_if_block_13, create_if_block_14];
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
      if_block_anchor = empty();
    },
    m: function m(target, anchor) {
      if (~current_block_type_index) if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) if_blocks[current_block_type_index].p(changed, ctx);
      } else {
        if (if_block) {
          group_outros();
          on_outro(function () {
            if_blocks[previous_block_index].d(1);
            if_blocks[previous_block_index] = null;
          });
          if_block.o(1);
          check_outros();
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
        detach(if_block_anchor);
      }
    }
  };
}

function instance$l($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
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
      _$$props$value = $$props.value,
      value = _$$props$value === void 0 ? '' : _$$props$value,
      _$$props$readonly = $$props.readonly,
      readonly = _$$props$readonly === void 0 ? false : _$$props$readonly,
      _$$props$multiple = $$props.multiple,
      multiple = _$$props$multiple === void 0 ? false : _$$props$multiple,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id,
      _$$props$name = $$props.name,
      name = _$$props$name === void 0 ? '' : _$$props$name,
      _$$props$placeholder = $$props.placeholder,
      placeholder = _$$props$placeholder === void 0 ? '' : _$$props$placeholder,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled;
  var classes;
  var tag;
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
    value = to_number(this.value);
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
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
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
    if ('name' in $$props) $$invalidate('name', name = $$props.name);
    if ('placeholder' in $$props) $$invalidate('placeholder', placeholder = $$props.placeholder);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      type: 1,
      plaintext: 1,
      addon: 1,
      size: 1,
      className: 1,
      invalid: 1,
      valid: 1,
      bsSize: 1
    };

    if ($$dirty.type || $$dirty.plaintext || $$dirty.addon || $$dirty.size || $$dirty.className || $$dirty.invalid || $$dirty.valid || $$dirty.bsSize) {
      {
        var checkInput = ['radio', 'checkbox'].indexOf(type) > -1;
        var isNotaNumber = new RegExp('\\D', 'g');
        var fileInput = type === 'file';
        var textareaInput = type === 'textarea';
        var selectInput = type === 'select';
        $$invalidate('tag', tag = selectInput || textareaInput ? type : 'input');
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

        $$invalidate('classes', classes = clsx(className, invalid && 'is-invalid', valid && 'is-valid', bsSize ? "form-control-".concat(bsSize) : false, formControlClass));
      }
    }
  };

  return {
    className: className,
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
    name: name,
    placeholder: placeholder,
    disabled: disabled,
    classes: classes,
    tag: tag,
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
    init(_assertThisInitialized(_this), options, instance$l, create_fragment$l, safe_not_equal, ["class", "type", "size", "bsSize", "valid", "invalid", "plaintext", "addon", "value", "readonly", "multiple", "id", "name", "placeholder", "disabled"]);
    return _this;
  }

  return Input;
}(SvelteComponent);

function create_else_block$1(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
} // (17:0) {#if tag === 'section'}


function create_if_block$4(ctx) {
  var section, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      section = element("section");
      if (default_slot) default_slot.c();
      section.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(section_nodes);
    },
    m: function m(target, anchor) {
      insert(target, section, anchor);

      if (default_slot) {
        default_slot.m(section, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        section.className = ctx.classes;
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
        detach(section);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function create_fragment$m(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$4, create_else_block$1];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.tag === 'section') return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c: function c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m: function m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(changed, ctx);
      } else {
        group_outros();
        on_outro(function () {
          if_blocks[previous_block_index].d(1);
          if_blocks[previous_block_index] = null;
        });
        if_block.o(1);
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }

        if_block.i(1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
      if_blocks[current_block_type_index].d(detaching);

      if (detaching) {
        detach(if_block_anchor);
      }
    }
  };
}

function instance$m($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$fluid = $$props.fluid,
      fluid = _$$props$fluid === void 0 ? false : _$$props$fluid,
      _$$props$tag = $$props.tag,
      tag = _$$props$tag === void 0 ? 'div' : _$$props$tag;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('fluid' in $$props) $$invalidate('fluid', fluid = $$props.fluid);
    if ('tag' in $$props) $$invalidate('tag', tag = $$props.tag);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      fluid: 1
    };

    if ($$dirty.className || $$dirty.fluid) {
      $$invalidate('classes', classes = clsx(className, 'jumbotron', fluid ? 'jumbotron-fluid' : false));
    }
  };

  return {
    className: className,
    fluid: fluid,
    tag: tag,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Jumbotron =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Jumbotron, _SvelteComponent);

  function Jumbotron(options) {
    var _this;

    _classCallCheck(this, Jumbotron);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Jumbotron).call(this));
    init(_assertThisInitialized(_this), options, instance$m, create_fragment$m, safe_not_equal, ["class", "fluid", "tag"]);
    return _this;
  }

  return Jumbotron;
}(SvelteComponent);

function create_fragment$n(ctx) {
  var label, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      label = element("label");
      if (default_slot) default_slot.c();
      label.id = ctx.id;
      label.className = ctx.classes;
      label.htmlFor = ctx.fore;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(label_nodes);
    },
    m: function m(target, anchor) {
      insert(target, label, anchor);

      if (default_slot) {
        default_slot.m(label, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        label.id = ctx.id;
      }

      if (!current || changed.classes) {
        label.className = ctx.classes;
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
        detach(label);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$n($$self, $$props, $$invalidate) {
  var colWidths = ['xs', 'sm', 'md', 'lg', 'xl'];
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$hidden = $$props.hidden,
      hidden = _$$props$hidden === void 0 ? false : _$$props$hidden,
      _$$props$check = $$props.check,
      check = _$$props$check === void 0 ? false : _$$props$check,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$for = $$props["for"],
      fore = _$$props$for === void 0 ? '' : _$$props$for,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id,
      _$$props$xs = $$props.xs,
      xs = _$$props$xs === void 0 ? '' : _$$props$xs,
      _$$props$sm = $$props.sm,
      sm = _$$props$sm === void 0 ? '' : _$$props$sm,
      _$$props$md = $$props.md,
      md = _$$props$md === void 0 ? '' : _$$props$md,
      _$$props$lg = $$props.lg,
      lg = _$$props$lg === void 0 ? '' : _$$props$lg,
      _$$props$xl = $$props.xl,
      xl = _$$props$xl === void 0 ? '' : _$$props$xl,
      _$$props$widths = $$props.widths,
      widths = _$$props$widths === void 0 ? colWidths : _$$props$widths;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('hidden' in $$props) $$invalidate('hidden', hidden = $$props.hidden);
    if ('check' in $$props) $$invalidate('check', check = $$props.check);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('for' in $$props) $$invalidate('fore', fore = $$props["for"]);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('xs' in $$props) $$invalidate('xs', xs = $$props.xs);
    if ('sm' in $$props) $$invalidate('sm', sm = $$props.sm);
    if ('md' in $$props) $$invalidate('md', md = $$props.md);
    if ('lg' in $$props) $$invalidate('lg', lg = $$props.lg);
    if ('xl' in $$props) $$invalidate('xl', xl = $$props.xl);
    if ('widths' in $$props) $$invalidate('widths', widths = $$props.widths);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      hidden: 1,
      check: 1,
      size: 1
    };

    if ($$dirty.className || $$dirty.hidden || $$dirty.check || $$dirty.size) {
      $$invalidate('classes', classes = clsx(className, hidden ? 'sr-only' : false, check ? 'form-check-label' : false, size ? "col-form-label-".concat(size) : false // colClasses,
      // colClasses.length ? 'col-form-label' : false,
      ));
    }
  };

  return {
    className: className,
    hidden: hidden,
    check: check,
    size: size,
    fore: fore,
    id: id,
    xs: xs,
    sm: sm,
    md: md,
    lg: lg,
    xl: xl,
    widths: widths,
    classes: classes,
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
    init(_assertThisInitialized(_this), options, instance$n, create_fragment$n, safe_not_equal, ["class", "hidden", "check", "size", "for", "id", "xs", "sm", "md", "lg", "xl", "widths"]);
    return _this;
  }

  return Label;
}(SvelteComponent);

function create_fragment$o(ctx) {
  var ul, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      ul = element("ul");
      if (default_slot) default_slot.c();
      ul.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(ul_nodes);
    },
    m: function m(target, anchor) {
      insert(target, ul, anchor);

      if (default_slot) {
        default_slot.m(ul, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        ul.className = ctx.classes;
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
        detach(ul);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function getVerticalClass(vertical) {
  if (vertical === false) {
    return false;
  } else if (vertical === true || vertical === 'xs') {
    return 'flex-column';
  }

  return "flex-".concat(vertical, "-column");
}

function instance$o($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$tabs = $$props.tabs,
      tabs = _$$props$tabs === void 0 ? false : _$$props$tabs,
      _$$props$pills = $$props.pills,
      pills = _$$props$pills === void 0 ? false : _$$props$pills,
      _$$props$vertical = $$props.vertical,
      vertical = _$$props$vertical === void 0 ? false : _$$props$vertical,
      _$$props$horizontal = $$props.horizontal,
      horizontal = _$$props$horizontal === void 0 ? '' : _$$props$horizontal,
      _$$props$justified = $$props.justified,
      justified = _$$props$justified === void 0 ? false : _$$props$justified,
      _$$props$fill = $$props.fill,
      fill = _$$props$fill === void 0 ? false : _$$props$fill,
      _$$props$navbar = $$props.navbar,
      navbar = _$$props$navbar === void 0 ? false : _$$props$navbar,
      _$$props$card = $$props.card,
      card = _$$props$card === void 0 ? false : _$$props$card;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('tabs' in $$props) $$invalidate('tabs', tabs = $$props.tabs);
    if ('pills' in $$props) $$invalidate('pills', pills = $$props.pills);
    if ('vertical' in $$props) $$invalidate('vertical', vertical = $$props.vertical);
    if ('horizontal' in $$props) $$invalidate('horizontal', horizontal = $$props.horizontal);
    if ('justified' in $$props) $$invalidate('justified', justified = $$props.justified);
    if ('fill' in $$props) $$invalidate('fill', fill = $$props.fill);
    if ('navbar' in $$props) $$invalidate('navbar', navbar = $$props.navbar);
    if ('card' in $$props) $$invalidate('card', card = $$props.card);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      navbar: 1,
      horizontal: 1,
      vertical: 1,
      tabs: 1,
      card: 1,
      pills: 1,
      justified: 1,
      fill: 1
    };

    if ($$dirty.className || $$dirty.navbar || $$dirty.horizontal || $$dirty.vertical || $$dirty.tabs || $$dirty.card || $$dirty.pills || $$dirty.justified || $$dirty.fill) {
      $$invalidate('classes', classes = clsx(className, navbar ? 'navbar-nav' : 'nav', horizontal ? "justify-content-".concat(horizontal) : false, getVerticalClass(vertical), {
        'nav-tabs': tabs,
        'card-header-tabs': card && tabs,
        'nav-pills': pills,
        'card-header-pills': card && pills,
        'nav-justified': justified,
        'nav-fill': fill
      }));
    }
  };

  return {
    className: className,
    tabs: tabs,
    pills: pills,
    vertical: vertical,
    horizontal: horizontal,
    justified: justified,
    fill: fill,
    navbar: navbar,
    card: card,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Nav =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Nav, _SvelteComponent);

  function Nav(options) {
    var _this;

    _classCallCheck(this, Nav);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Nav).call(this));
    init(_assertThisInitialized(_this), options, instance$o, create_fragment$o, safe_not_equal, ["class", "tabs", "pills", "vertical", "horizontal", "justified", "fill", "navbar", "card"]);
    return _this;
  }

  return Nav;
}(SvelteComponent);

function create_fragment$p(ctx) {
  var nav, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      nav = element("nav");
      if (default_slot) default_slot.c();
      nav.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(nav_nodes);
    },
    m: function m(target, anchor) {
      insert(target, nav, anchor);

      if (default_slot) {
        default_slot.m(nav, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        nav.className = ctx.classes;
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
        detach(nav);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function getExpandClass(expand) {
  if (expand === false) {
    return false;
  } else if (expand === true || expand === 'xs') {
    return 'navbar-expand';
  }

  return "navbar-expand-".concat(expand);
}

function instance$p($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$light = $$props.light,
      light = _$$props$light === void 0 ? false : _$$props$light,
      _$$props$dark = $$props.dark,
      dark = _$$props$dark === void 0 ? false : _$$props$dark,
      _$$props$full = $$props.full,
      full = _$$props$full === void 0 ? false : _$$props$full,
      _$$props$fixed = $$props.fixed,
      fixed = _$$props$fixed === void 0 ? '' : _$$props$fixed,
      _$$props$sticky = $$props.sticky,
      sticky = _$$props$sticky === void 0 ? '' : _$$props$sticky,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? '' : _$$props$color,
      _$$props$role = $$props.role,
      role = _$$props$role === void 0 ? '' : _$$props$role,
      _$$props$expand = $$props.expand,
      expand = _$$props$expand === void 0 ? false : _$$props$expand;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('light' in $$props) $$invalidate('light', light = $$props.light);
    if ('dark' in $$props) $$invalidate('dark', dark = $$props.dark);
    if ('full' in $$props) $$invalidate('full', full = $$props.full);
    if ('fixed' in $$props) $$invalidate('fixed', fixed = $$props.fixed);
    if ('sticky' in $$props) $$invalidate('sticky', sticky = $$props.sticky);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('role' in $$props) $$invalidate('role', role = $$props.role);
    if ('expand' in $$props) $$invalidate('expand', expand = $$props.expand);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      expand: 1,
      light: 1,
      dark: 1,
      color: 1,
      fixed: 1,
      sticky: 1
    };

    if ($$dirty.className || $$dirty.expand || $$dirty.light || $$dirty.dark || $$dirty.color || $$dirty.fixed || $$dirty.sticky) {
      var _clsx;

      $$invalidate('classes', classes = clsx(className, 'navbar', getExpandClass(expand), (_clsx = {
        'navbar-light': light,
        'navbar-dark': dark
      }, _defineProperty(_clsx, "bg-".concat(color), color), _defineProperty(_clsx, "fixed-".concat(fixed), fixed), _defineProperty(_clsx, "sticky-".concat(sticky), sticky), _clsx)));
    }
  };

  return {
    className: className,
    light: light,
    dark: dark,
    full: full,
    fixed: fixed,
    sticky: sticky,
    color: color,
    role: role,
    expand: expand,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Navbar =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Navbar, _SvelteComponent);

  function Navbar(options) {
    var _this;

    _classCallCheck(this, Navbar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Navbar).call(this));
    init(_assertThisInitialized(_this), options, instance$p, create_fragment$p, safe_not_equal, ["class", "light", "dark", "full", "fixed", "sticky", "color", "role", "expand"]);
    return _this;
  }

  return Navbar;
}(SvelteComponent);

function create_fragment$q(ctx) {
  var li, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      li = element("li");
      if (default_slot) default_slot.c();
      li.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(li_nodes);
    },
    m: function m(target, anchor) {
      insert(target, li, anchor);

      if (default_slot) {
        default_slot.m(li, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        li.className = ctx.classes;
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
        detach(li);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$q($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      active: 1
    };

    if ($$dirty.className || $$dirty.active) {
      $$invalidate('classes', classes = clsx(className, 'nav-item', active ? 'active' : false));
    }
  };

  return {
    className: className,
    active: active,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var NavItem =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(NavItem, _SvelteComponent);

  function NavItem(options) {
    var _this;

    _classCallCheck(this, NavItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NavItem).call(this));
    init(_assertThisInitialized(_this), options, instance$q, create_fragment$q, safe_not_equal, ["class", "active"]);
    return _this;
  }

  return NavItem;
}(SvelteComponent);

function create_fragment$r(ctx) {
  var a, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      a = element("a");
      if (default_slot) default_slot.c();
      a.href = ctx.href;
      a.className = ctx.classes;
      dispose = [listen(a, "click", ctx.click_handler), listen(a, "click", ctx.handleClick)];
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(a_nodes);
    },
    m: function m(target, anchor) {
      insert(target, a, anchor);

      if (default_slot) {
        default_slot.m(a, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.href) {
        a.href = ctx.href;
      }

      if (!current || changed.classes) {
        a.className = ctx.classes;
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
        detach(a);
      }

      if (default_slot) default_slot.d(detaching);
      run_all(dispose);
    }
  };
}

function instance$r($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      href = $$props.href;

  function handleClick(e) {
    if (disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    if (href === '#') {
      e.preventDefault();
    }
  }

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('href' in $$props) $$invalidate('href', href = $$props.href);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      disabled: 1,
      active: 1
    };

    if ($$dirty.className || $$dirty.disabled || $$dirty.active) {
      $$invalidate('classes', classes = clsx(className, 'nav-link', {
        disabled: disabled,
        active: active
      }));
    }
  };

  return {
    className: className,
    disabled: disabled,
    active: active,
    href: href,
    handleClick: handleClick,
    classes: classes,
    click_handler: click_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var NavLink =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(NavLink, _SvelteComponent);

  function NavLink(options) {
    var _this;

    _classCallCheck(this, NavLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NavLink).call(this));
    init(_assertThisInitialized(_this), options, instance$r, create_fragment$r, safe_not_equal, ["class", "disabled", "active", "href"]);
    return _this;
  }

  return NavLink;
}(SvelteComponent);

function create_fragment$s(ctx) {
  var a, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      a = element("a");
      if (default_slot) default_slot.c();
      a.className = ctx.classes;
      a.href = ctx.href;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(a_nodes);
    },
    m: function m(target, anchor) {
      insert(target, a, anchor);

      if (default_slot) {
        default_slot.m(a, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        a.className = ctx.classes;
      }

      if (!current || changed.href) {
        a.href = ctx.href;
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
        detach(a);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$s($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$href = $$props.href,
      href = _$$props$href === void 0 ? '/' : _$$props$href;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('href' in $$props) $$invalidate('href', href = $$props.href);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'navbar-brand'));
    }
  };

  return {
    className: className,
    href: href,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var NavbarBrand =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(NavbarBrand, _SvelteComponent);

  function NavbarBrand(options) {
    var _this;

    _classCallCheck(this, NavbarBrand);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NavbarBrand).call(this));
    init(_assertThisInitialized(_this), options, instance$s, create_fragment$s, safe_not_equal, ["class", "href"]);
    return _this;
  }

  return NavbarBrand;
}(SvelteComponent);

function create_default_slot(ctx) {
  var span, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      if (!default_slot) {
        span = element("span");
      }

      if (default_slot) default_slot.c();

      if (!default_slot) {
        span.className = "navbar-toggler-icon";
      }
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(nodes);
    },
    m: function m(target, anchor) {
      if (!default_slot) {
        insert(target, span, anchor);
      } else {
        default_slot.m(target, anchor);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
      if (!default_slot) {
        if (detaching) {
          detach(span);
        }
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function create_fragment$t(ctx) {
  var current;
  var button = new Button({
    props: {
      "class": ctx.classes,
      $$slots: {
        "default": [create_default_slot]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  button.$on("click", ctx.click_handler);
  return {
    c: function c() {
      button.$$.fragment.c();
    },
    m: function m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var button_changes = {};
      if (changed.classes) button_changes["class"] = ctx.classes;
      if (changed.$$scope) button_changes.$$scope = {
        changed: changed,
        ctx: ctx
      };
      button.$set(button_changes);
    },
    i: function i(local) {
      if (current) return;
      button.$$.fragment.i(local);
      current = true;
    },
    o: function o(local) {
      button.$$.fragment.o(local);
      current = false;
    },
    d: function d(detaching) {
      button.$destroy(detaching);
    }
  };
}

function instance$t($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$type = $$props.type,
      type = _$$props$type === void 0 ? 'button' : _$$props$type;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('type' in $$props) $$invalidate('type', type = $$props.type);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'navbar-toggler'));
    }
  };

  return {
    className: className,
    type: type,
    classes: classes,
    click_handler: click_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var NavbarToggler =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(NavbarToggler, _SvelteComponent);

  function NavbarToggler(options) {
    var _this;

    _classCallCheck(this, NavbarToggler);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NavbarToggler).call(this));
    init(_assertThisInitialized(_this), options, instance$t, create_fragment$t, safe_not_equal, ["class", "type"]);
    return _this;
  }

  return NavbarToggler;
}(SvelteComponent);

function create_fragment$u(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
        detach(div);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$u($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
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
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('noGutters' in $$props) $$invalidate('noGutters', noGutters = $$props.noGutters);
    if ('form' in $$props) $$invalidate('form', form = $$props.form);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      noGutters: 1,
      form: 1
    };

    if ($$dirty.className || $$dirty.noGutters || $$dirty.form) {
      $$invalidate('classes', classes = clsx(className, noGutters ? 'no-gutters' : null, form ? 'form-row' : 'row'));
    }
  };

  return {
    className: className,
    noGutters: noGutters,
    form: form,
    id: id,
    classes: classes,
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
    init(_assertThisInitialized(_this), options, instance$u, create_fragment$u, safe_not_equal, ["class", "noGutters", "form", "id"]);
    return _this;
  }

  return Row;
}(SvelteComponent);

function create_default_slot$1(ctx) {
  var current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      if (default_slot) default_slot.c();
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(nodes);
    },
    m: function m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
      if (default_slot) default_slot.d(detaching);
    }
  };
}

function create_fragment$v(ctx) {
  var current;
  var alert_spread_levels = [{
    isOpen: ctx.isOpen
  }, {
    toggle: ctx.func
  }, ctx.$$props];
  var alert_props = {
    $$slots: {
      "default": [create_default_slot$1]
    },
    $$scope: {
      ctx: ctx
    }
  };

  for (var i = 0; i < alert_spread_levels.length; i += 1) {
    alert_props = assign(alert_props, alert_spread_levels[i]);
  }

  var alert = new Alert({
    props: alert_props
  });
  return {
    c: function c() {
      alert.$$.fragment.c();
    },
    m: function m(target, anchor) {
      mount_component(alert, target, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var alert_changes = changed.isOpen || changed.$$props ? get_spread_update(alert_spread_levels, [changed.isOpen && {
        isOpen: ctx.isOpen
      }, {
        toggle: ctx.func
      }, changed.$$props && ctx.$$props]) : {};
      if (changed.$$scope) alert_changes.$$scope = {
        changed: changed,
        ctx: ctx
      };
      alert.$set(alert_changes);
    },
    i: function i(local) {
      if (current) return;
      alert.$$.fragment.i(local);
      current = true;
    },
    o: function o(local) {
      alert.$$.fragment.o(local);
      current = false;
    },
    d: function d(detaching) {
      alert.$destroy(detaching);
    }
  };
}

function instance$v($$self, $$props, $$invalidate) {
  var _ref;

  var isOpen = true;
  var _$$props = $$props,
      _$$props$$$slots = _$$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = _$$props.$$scope;

  function func() {
    var $$result = isOpen = false;
    $$invalidate('isOpen', isOpen);
    return $$result;
  }

  $$self.$set = function ($$new_props) {
    $$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    if ('$$scope' in $$new_props) $$invalidate('$$scope', $$scope = $$new_props.$$scope);
  };

  return _ref = {
    isOpen: isOpen,
    $$props: $$props,
    func: func
  }, _defineProperty(_ref, "$$props", $$props = exclude_internal_props($$props)), _defineProperty(_ref, "$$slots", $$slots), _defineProperty(_ref, "$$scope", $$scope), _ref;
}

var UncontrolledAlert =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(UncontrolledAlert, _SvelteComponent);

  function UncontrolledAlert(options) {
    var _this;

    _classCallCheck(this, UncontrolledAlert);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UncontrolledAlert).call(this));
    init(_assertThisInitialized(_this), options, instance$v, create_fragment$v, safe_not_equal, []);
    return _this;
  }

  return UncontrolledAlert;
}(SvelteComponent);

export { Alert, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Card, CardBody, CardColumns, CardDeck, CardFooter, CardGroup, CardHeader, CardImgOverlay, CardText, CardTitle, Col, Collapse, Container, FormGroup, Input, Jumbotron, Label, Nav, NavItem, NavLink, Navbar, NavbarBrand, NavbarToggler, Row, UncontrolledAlert };
//# sourceMappingURL=sveltestrap.es.js.map
