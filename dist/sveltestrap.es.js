import { init, safe_not_equal, SvelteComponent, element, space, attr, insert, append, listen, detach, get_slot_changes, get_slot_context, add_render_callback, create_bidirectional_transition, empty, group_outros, on_outro, check_outros, create_slot, assign, exclude_internal_props, bubble, add_binding_callback, mount_component, noop, run_all, text, set_data, subscribe, to_number, set_style, svg_element, get_spread_update } from 'svelte/internal';
import { fade, slide } from 'svelte/transition';
import { writable } from 'svelte/store';
import { onMount, onDestroy } from 'svelte';

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

function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
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

function create_else_block(ctx) {
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
} // (18:0) {#if href}


function create_if_block$1(ctx) {
  var a, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      a = element("a");
      if (default_slot) default_slot.c();
      a.href = ctx.href;
      a.className = ctx.classes;
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
    }
  };
}

function create_fragment$1(ctx) {
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

function instance$1($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? 'secondary' : _$$props$color,
      _$$props$pill = $$props.pill,
      pill = _$$props$pill === void 0 ? false : _$$props$pill,
      _$$props$href = $$props.href,
      href = _$$props$href === void 0 ? undefined : _$$props$href;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('pill' in $$props) $$invalidate('pill', pill = $$props.pill);
    if ('href' in $$props) $$invalidate('href', href = $$props.href);
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
    href: href,
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
    init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, safe_not_equal, ["class", "color", "pill", "href"]);
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

function create_else_block$1(ctx) {
  var button, button_aria_label_value, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  var if_block = ctx.close && create_if_block_2(ctx);
  return {
    c: function c() {
      button = element("button");

      if (!default_slot) {
        if (if_block) if_block.c();
      }

      if (default_slot) default_slot.c();
      button.id = ctx.id;
      button.className = ctx.classes;
      button.value = ctx.value;
      attr(button, "aria-label", button_aria_label_value = ctx.ariaLabel || ctx.defaultAriaLabel);
      button.style.cssText = ctx.style;
      dispose = listen(button, "click", ctx.click_handler_1);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(button_nodes);
    },
    m: function m(target, anchor) {
      insert(target, button, anchor);

      if (!default_slot) {
        if (if_block) if_block.m(button, null);
      } else {
        default_slot.m(button, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (!default_slot) {
        if (ctx.close) {
          if (!if_block) {
            if_block = create_if_block_2(ctx);
            if_block.c();
            if_block.m(button, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      }

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

      if ((!current || changed.ariaLabel || changed.defaultAriaLabel) && button_aria_label_value !== (button_aria_label_value = ctx.ariaLabel || ctx.defaultAriaLabel)) {
        attr(button, "aria-label", button_aria_label_value);
      }

      if (!current || changed.style) {
        button.style.cssText = ctx.style;
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

      if (!default_slot) {
        if (if_block) if_block.d();
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
} // (33:0) {#if href}


function create_if_block$2(ctx) {
  var a, a_aria_label_value, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  var if_block = ctx.close && create_if_block_1$1(ctx);
  return {
    c: function c() {
      a = element("a");

      if (!default_slot) {
        if (if_block) if_block.c();
      }

      if (default_slot) default_slot.c();
      a.id = ctx.id;
      a.className = ctx.classes;
      a.href = ctx.href;
      attr(a, "aria-label", a_aria_label_value = ctx.ariaLabel || ctx.defaultAriaLabel);
      a.style.cssText = ctx.style;
      dispose = listen(a, "click", ctx.click_handler);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(a_nodes);
    },
    m: function m(target, anchor) {
      insert(target, a, anchor);

      if (!default_slot) {
        if (if_block) if_block.m(a, null);
      } else {
        default_slot.m(a, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (!default_slot) {
        if (ctx.close) {
          if (!if_block) {
            if_block = create_if_block_1$1(ctx);
            if_block.c();
            if_block.m(a, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      }

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

      if ((!current || changed.ariaLabel || changed.defaultAriaLabel) && a_aria_label_value !== (a_aria_label_value = ctx.ariaLabel || ctx.defaultAriaLabel)) {
        attr(a, "aria-label", a_aria_label_value);
      }

      if (!current || changed.style) {
        a.style.cssText = ctx.style;
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

      if (!default_slot) {
        if (if_block) if_block.d();
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
} // (58:3) {#if close}


function create_if_block_2(ctx) {
  var span;
  return {
    c: function c() {
      span = element("span");
      span.textContent = "×";
      attr(span, "aria-hidden", "true");
    },
    m: function m(target, anchor) {
      insert(target, span, anchor);
    },
    d: function d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
} // (43:3) {#if close}


function create_if_block_1$1(ctx) {
  var span;
  return {
    c: function c() {
      span = element("span");
      span.textContent = "×";
      attr(span, "aria-hidden", "true");
    },
    m: function m(target, anchor) {
      insert(target, span, anchor);
    },
    d: function d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}

function create_fragment$4(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$2, create_else_block$1];
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
  var _$$props = $$props,
      _$$props$class = _$$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$active = _$$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$block = _$$props.block,
      block = _$$props$block === void 0 ? false : _$$props$block,
      _$$props$disabled = _$$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$color = _$$props.color,
      color = _$$props$color === void 0 ? 'secondary' : _$$props$color,
      _$$props$outline = _$$props.outline,
      outline = _$$props$outline === void 0 ? false : _$$props$outline,
      _$$props$size = _$$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$value = _$$props.value,
      value = _$$props$value === void 0 ? '' : _$$props$value,
      _$$props$id = _$$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id,
      _$$props$close = _$$props.close,
      close = _$$props$close === void 0 ? false : _$$props$close,
      _$$props$href = _$$props.href,
      href = _$$props$href === void 0 ? '' : _$$props$href,
      _$$props$style = _$$props.style,
      style = _$$props$style === void 0 ? '' : _$$props$style;
  var _$$props2 = $$props,
      _$$props2$$$slots = _$$props2.$$slots,
      $$slots = _$$props2$$$slots === void 0 ? {} : _$$props2$$$slots,
      $$scope = _$$props2.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  function click_handler_1(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$new_props) {
    $$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
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
    if ('style' in $$props) $$invalidate('style', style = $$props.style);
    if ('$$scope' in $$new_props) $$invalidate('$$scope', $$scope = $$new_props.$$scope);
  };

  var ariaLabel, classes, defaultAriaLabel;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      $$props: 1,
      className: 1,
      close: 1,
      outline: 1,
      color: 1,
      size: 1,
      block: 1,
      active: 1,
      disabled: 1
    };
    $$invalidate('ariaLabel', ariaLabel = $$props['aria-label']);

    if ($$dirty.className || $$dirty.close || $$dirty.outline || $$dirty.color || $$dirty.size || $$dirty.block || $$dirty.active || $$dirty.disabled) {
      $$invalidate('classes', classes = clsx(className, {
        close: close
      }, close || 'btn', close || "btn".concat(outline ? '-outline' : '', "-").concat(color), size ? "btn-".concat(size) : false, block ? 'btn-block' : false, {
        active: active,
        disabled: disabled
      }));
    }

    if ($$dirty.close) {
      $$invalidate('defaultAriaLabel', defaultAriaLabel = close ? 'Close' : null);
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
    style: style,
    ariaLabel: ariaLabel,
    classes: classes,
    defaultAriaLabel: defaultAriaLabel,
    click_handler: click_handler,
    click_handler_1: click_handler_1,
    $$props: $$props = exclude_internal_props($$props),
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
    init(_assertThisInitialized(_this), options, instance$4, create_fragment$4, safe_not_equal, ["class", "active", "block", "disabled", "color", "outline", "size", "value", "id", "close", "href", "style"]);
    return _this;
  }

  return Button;
}(SvelteComponent);

var context = writable({});

function create_else_block$2(ctx) {
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

      add_binding_callback(function () {
        return ctx.div_binding(div, null);
      });
      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (changed.items) {
        ctx.div_binding(null, div);
        ctx.div_binding(div, null);
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
      ctx.div_binding(null, div);
    }
  };
} // (60:0) {#if nav}


function create_if_block$3(ctx) {
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

      add_binding_callback(function () {
        return ctx.li_binding(li, null);
      });
      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (changed.items) {
        ctx.li_binding(null, li);
        ctx.li_binding(li, null);
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
      ctx.li_binding(null, li);
    }
  };
}

function create_fragment$5(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$3, create_else_block$2];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.nav) return 0;
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

function instance$5($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$direction = $$props.direction,
      direction = _$$props$direction === void 0 ? 'down' : _$$props$direction,
      _$$props$group = $$props.group,
      group = _$$props$group === void 0 ? false : _$$props$group,
      _$$props$isOpen = $$props.isOpen,
      isOpen = _$$props$isOpen === void 0 ? false : _$$props$isOpen,
      _$$props$nav = $$props.nav,
      nav = _$$props$nav === void 0 ? false : _$$props$nav,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$addonType = $$props.addonType,
      addonType = _$$props$addonType === void 0 ? false : _$$props$addonType,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$toggle = $$props.toggle,
      toggle = _$$props$toggle === void 0 ? undefined : _$$props$toggle,
      _$$props$inNavbar = $$props.inNavbar,
      inNavbar = _$$props$inNavbar === void 0 ? false : _$$props$inNavbar,
      _$$props$setActiveFro = $$props.setActiveFromChild,
      setActiveFromChild = _$$props$setActiveFro === void 0 ? false : _$$props$setActiveFro,
      _$$props$dropup = $$props.dropup,
      dropup = _$$props$dropup === void 0 ? false : _$$props$dropup;
  var validDirections = ['up', 'down', 'left', 'right'];

  if (validDirections.indexOf(direction) === -1) {
    throw new Error("Invalid direction sent: '".concat(direction, "' is not one of 'up', 'down', 'left', 'right'"));
  }

  var component;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function li_binding($$node, check) {
    component = $$node;
    $$invalidate('component', component);
  }

  function div_binding($$node, check) {
    component = $$node;
    $$invalidate('component', component);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('direction' in $$props) $$invalidate('direction', direction = $$props.direction);
    if ('group' in $$props) $$invalidate('group', group = $$props.group);
    if ('isOpen' in $$props) $$invalidate('isOpen', isOpen = $$props.isOpen);
    if ('nav' in $$props) $$invalidate('nav', nav = $$props.nav);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('addonType' in $$props) $$invalidate('addonType', addonType = $$props.addonType);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('toggle' in $$props) $$invalidate('toggle', toggle = $$props.toggle);
    if ('inNavbar' in $$props) $$invalidate('inNavbar', inNavbar = $$props.inNavbar);
    if ('setActiveFromChild' in $$props) $$invalidate('setActiveFromChild', setActiveFromChild = $$props.setActiveFromChild);
    if ('dropup' in $$props) $$invalidate('dropup', dropup = $$props.dropup);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var subItemIsActive, classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      setActiveFromChild: 1,
      component: 1,
      className: 1,
      direction: 1,
      nav: 1,
      active: 1,
      subItemIsActive: 1,
      addonType: 1,
      group: 1,
      size: 1,
      isOpen: 1,
      toggle: 1,
      dropup: 1,
      inNavbar: 1
    };

    if ($$dirty.setActiveFromChild || $$dirty.component) {
      $$invalidate('subItemIsActive', subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === 'function' && component.querySelector('.active')));
    }

    if ($$dirty.className || $$dirty.direction || $$dirty.nav || $$dirty.active || $$dirty.setActiveFromChild || $$dirty.subItemIsActive || $$dirty.addonType || $$dirty.group || $$dirty.size || $$dirty.isOpen) {
      var _clsx;

      $$invalidate('classes', classes = clsx(className, direction !== 'down' && "drop".concat(direction), nav && active ? 'active' : false, setActiveFromChild && subItemIsActive ? 'active' : false, (_clsx = {}, _defineProperty(_clsx, "input-group-".concat(addonType), addonType), _defineProperty(_clsx, 'btn-group', group), _defineProperty(_clsx, "btn-group-".concat(size), !!size), _defineProperty(_clsx, "dropdown", !group && !addonType), _defineProperty(_clsx, "show", isOpen), _defineProperty(_clsx, 'nav-item', nav), _clsx)));
    }

    if ($$dirty.toggle || $$dirty.isOpen || $$dirty.direction || $$dirty.dropup || $$dirty.inNavbar) {
      {
        context.update(function () {
          return {
            toggle: toggle,
            isOpen: isOpen,
            direction: direction === 'down' && dropup ? 'up' : direction,
            inNavbar: inNavbar
          };
        });
      }
    }
  };

  return {
    className: className,
    disabled: disabled,
    direction: direction,
    group: group,
    isOpen: isOpen,
    nav: nav,
    active: active,
    addonType: addonType,
    size: size,
    toggle: toggle,
    inNavbar: inNavbar,
    setActiveFromChild: setActiveFromChild,
    dropup: dropup,
    component: component,
    classes: classes,
    li_binding: li_binding,
    div_binding: div_binding,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Dropdown =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Dropdown, _SvelteComponent);

  function Dropdown(options) {
    var _this;

    _classCallCheck(this, Dropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dropdown).call(this));
    init(_assertThisInitialized(_this), options, instance$5, create_fragment$5, safe_not_equal, ["class", "disabled", "direction", "group", "isOpen", "nav", "active", "addonType", "size", "toggle", "inNavbar", "setActiveFromChild", "dropup"]);
    return _this;
  }

  return Dropdown;
}(SvelteComponent);

function create_default_slot(ctx) {
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

function create_fragment$6(ctx) {
  var current;
  var dropdown = new Dropdown({
    props: {
      group: true,
      "class": ctx.className,
      disabled: ctx.disabled,
      direction: ctx.direction,
      isOpen: ctx.isOpen,
      nav: ctx.nav,
      active: ctx.active,
      addonType: ctx.addonType,
      size: ctx.size,
      toggle: ctx.toggle,
      inNavbar: ctx.inNavbar,
      setActiveFromChild: ctx.setActiveFromChild,
      dropup: ctx.dropup,
      $$slots: {
        "default": [create_default_slot]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  dropdown.$on("click", ctx.click_handler);
  return {
    c: function c() {
      dropdown.$$.fragment.c();
    },
    m: function m(target, anchor) {
      mount_component(dropdown, target, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var dropdown_changes = {};
      if (changed.className) dropdown_changes["class"] = ctx.className;
      if (changed.disabled) dropdown_changes.disabled = ctx.disabled;
      if (changed.direction) dropdown_changes.direction = ctx.direction;
      if (changed.isOpen) dropdown_changes.isOpen = ctx.isOpen;
      if (changed.nav) dropdown_changes.nav = ctx.nav;
      if (changed.active) dropdown_changes.active = ctx.active;
      if (changed.addonType) dropdown_changes.addonType = ctx.addonType;
      if (changed.size) dropdown_changes.size = ctx.size;
      if (changed.toggle) dropdown_changes.toggle = ctx.toggle;
      if (changed.inNavbar) dropdown_changes.inNavbar = ctx.inNavbar;
      if (changed.setActiveFromChild) dropdown_changes.setActiveFromChild = ctx.setActiveFromChild;
      if (changed.dropup) dropdown_changes.dropup = ctx.dropup;
      if (changed.$$scope) dropdown_changes.$$scope = {
        changed: changed,
        ctx: ctx
      };
      dropdown.$set(dropdown_changes);
    },
    i: function i(local) {
      if (current) return;
      dropdown.$$.fragment.i(local);
      current = true;
    },
    o: function o(local) {
      dropdown.$$.fragment.o(local);
      current = false;
    },
    d: function d(detaching) {
      dropdown.$destroy(detaching);
    }
  };
}

function instance$6($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$direction = $$props.direction,
      direction = _$$props$direction === void 0 ? 'down' : _$$props$direction,
      _$$props$group = $$props.group,
      group = _$$props$group === void 0 ? false : _$$props$group,
      _$$props$isOpen = $$props.isOpen,
      isOpen = _$$props$isOpen === void 0 ? false : _$$props$isOpen,
      _$$props$nav = $$props.nav,
      nav = _$$props$nav === void 0 ? false : _$$props$nav,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$addonType = $$props.addonType,
      addonType = _$$props$addonType === void 0 ? false : _$$props$addonType,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$toggle = $$props.toggle,
      toggle = _$$props$toggle === void 0 ? undefined : _$$props$toggle,
      _$$props$inNavbar = $$props.inNavbar,
      inNavbar = _$$props$inNavbar === void 0 ? false : _$$props$inNavbar,
      _$$props$setActiveFro = $$props.setActiveFromChild,
      setActiveFromChild = _$$props$setActiveFro === void 0 ? false : _$$props$setActiveFro,
      _$$props$dropup = $$props.dropup,
      dropup = _$$props$dropup === void 0 ? false : _$$props$dropup;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('direction' in $$props) $$invalidate('direction', direction = $$props.direction);
    if ('group' in $$props) $$invalidate('group', group = $$props.group);
    if ('isOpen' in $$props) $$invalidate('isOpen', isOpen = $$props.isOpen);
    if ('nav' in $$props) $$invalidate('nav', nav = $$props.nav);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('addonType' in $$props) $$invalidate('addonType', addonType = $$props.addonType);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('toggle' in $$props) $$invalidate('toggle', toggle = $$props.toggle);
    if ('inNavbar' in $$props) $$invalidate('inNavbar', inNavbar = $$props.inNavbar);
    if ('setActiveFromChild' in $$props) $$invalidate('setActiveFromChild', setActiveFromChild = $$props.setActiveFromChild);
    if ('dropup' in $$props) $$invalidate('dropup', dropup = $$props.dropup);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  return {
    className: className,
    disabled: disabled,
    direction: direction,
    group: group,
    isOpen: isOpen,
    nav: nav,
    active: active,
    addonType: addonType,
    size: size,
    toggle: toggle,
    inNavbar: inNavbar,
    setActiveFromChild: setActiveFromChild,
    dropup: dropup,
    click_handler: click_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ButtonDropdown =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ButtonDropdown, _SvelteComponent);

  function ButtonDropdown(options) {
    var _this;

    _classCallCheck(this, ButtonDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ButtonDropdown).call(this));
    init(_assertThisInitialized(_this), options, instance$6, create_fragment$6, safe_not_equal, ["class", "disabled", "direction", "group", "isOpen", "nav", "active", "addonType", "size", "toggle", "inNavbar", "setActiveFromChild", "dropup"]);
    return _this;
  }

  return ButtonDropdown;
}(SvelteComponent);

function create_fragment$7(ctx) {
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

function instance$7($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$7, create_fragment$7, safe_not_equal, ["class", "size", "vertical", "id"]);
    return _this;
  }

  return ButtonGroup;
}(SvelteComponent);

function create_fragment$8(ctx) {
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

function instance$8($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$8, create_fragment$8, safe_not_equal, ["class", "role", "ariaLabel"]);
    return _this;
  }

  return ButtonToolbar;
}(SvelteComponent);

function create_fragment$9(ctx) {
  var div, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
      div.style.cssText = ctx.style;
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

      if (!current || changed.style) {
        div.style.cssText = ctx.style;
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

function instance$9($$self, $$props, $$invalidate) {
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
      id = _$$props$id === void 0 ? '' : _$$props$id,
      _$$props$style = $$props.style,
      style = _$$props$style === void 0 ? '' : _$$props$style;
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
    if ('style' in $$props) $$invalidate('style', style = $$props.style);
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
    style: style,
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
    init(_assertThisInitialized(_this), options, instance$9, create_fragment$9, safe_not_equal, ["class", "inverse", "color", "body", "outline", "id", "style"]);
    return _this;
  }

  return Card;
}(SvelteComponent);

function create_fragment$a(ctx) {
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

function instance$a($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$a, create_fragment$a, safe_not_equal, ["class", "id"]);
    return _this;
  }

  return CardBody;
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
    init(_assertThisInitialized(_this), options, instance$b, create_fragment$b, safe_not_equal, ["class"]);
    return _this;
  }

  return CardColumns;
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
    init(_assertThisInitialized(_this), options, instance$c, create_fragment$c, safe_not_equal, ["class"]);
    return _this;
  }

  return CardDeck;
}(SvelteComponent);

function create_fragment$d(ctx) {
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

function instance$d($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$d, create_fragment$d, safe_not_equal, ["class"]);
    return _this;
  }

  return CardFooter;
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
    init(_assertThisInitialized(_this), options, instance$e, create_fragment$e, safe_not_equal, ["class"]);
    return _this;
  }

  return CardGroup;
}(SvelteComponent);

function create_else_block$3(ctx) {
  var div, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.id = ctx.id;
      div.className = ctx.classes;
      dispose = listen(div, "click", ctx.click_handler_1);
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
} // (15:0) {#if tag === 'h3'}


function create_if_block$4(ctx) {
  var h3, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      h3 = element("h3");
      if (default_slot) default_slot.c();
      h3.id = ctx.id;
      h3.className = ctx.classes;
      dispose = listen(h3, "click", ctx.click_handler);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(h3_nodes);
    },
    m: function m(target, anchor) {
      insert(target, h3, anchor);

      if (default_slot) {
        default_slot.m(h3, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        h3.id = ctx.id;
      }

      if (!current || changed.classes) {
        h3.className = ctx.classes;
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
        detach(h3);
      }

      if (default_slot) default_slot.d(detaching);
      dispose();
    }
  };
}

function create_fragment$f(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$4, create_else_block$3];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.tag === 'h3') return 0;
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

function instance$f($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id,
      _$$props$tag = $$props.tag,
      tag = _$$props$tag === void 0 ? 'div' : _$$props$tag;
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
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('tag' in $$props) $$invalidate('tag', tag = $$props.tag);
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
    tag: tag,
    classes: classes,
    click_handler: click_handler,
    click_handler_1: click_handler_1,
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
    init(_assertThisInitialized(_this), options, instance$f, create_fragment$f, safe_not_equal, ["class", "id", "tag"]);
    return _this;
  }

  return CardHeader;
}(SvelteComponent);

function create_fragment$g(ctx) {
  var img;
  return {
    c: function c() {
      img = element("img");
      img.className = ctx.classes;
      img.src = ctx.src;
      img.alt = ctx.alt;
    },
    m: function m(target, anchor) {
      insert(target, img, anchor);
    },
    p: function p(changed, ctx) {
      if (changed.classes) {
        img.className = ctx.classes;
      }

      if (changed.src) {
        img.src = ctx.src;
      }

      if (changed.alt) {
        img.alt = ctx.alt;
      }
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) {
        detach(img);
      }
    }
  };
}

function instance$g($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$top = $$props.top,
      top = _$$props$top === void 0 ? false : _$$props$top,
      _$$props$bottom = $$props.bottom,
      bottom = _$$props$bottom === void 0 ? false : _$$props$bottom,
      src = $$props.src,
      _$$props$alt = $$props.alt,
      alt = _$$props$alt === void 0 ? '' : _$$props$alt;
  var classes = '';

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('top' in $$props) $$invalidate('top', top = $$props.top);
    if ('bottom' in $$props) $$invalidate('bottom', bottom = $$props.bottom);
    if ('src' in $$props) $$invalidate('src', src = $$props.src);
    if ('alt' in $$props) $$invalidate('alt', alt = $$props.alt);
  };

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      top: 1,
      bottom: 1,
      className: 1
    };

    if ($$dirty.top || $$dirty.bottom || $$dirty.className) {
      {
        var cardImgClassName = 'card-img';

        if (top) {
          cardImgClassName = 'card-img-top';
        }

        if (bottom) {
          cardImgClassName = 'card-img-bottom';
        }

        $$invalidate('classes', classes = clsx(className, cardImgClassName));
      }
    }
  };

  return {
    className: className,
    top: top,
    bottom: bottom,
    src: src,
    alt: alt,
    classes: classes
  };
}

var CardImg =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardImg, _SvelteComponent);

  function CardImg(options) {
    var _this;

    _classCallCheck(this, CardImg);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardImg).call(this));
    init(_assertThisInitialized(_this), options, instance$g, create_fragment$g, safe_not_equal, ["class", "top", "bottom", "src", "alt"]);
    return _this;
  }

  return CardImg;
}(SvelteComponent);

function create_fragment$h(ctx) {
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

function instance$h($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$h, create_fragment$h, safe_not_equal, ["class"]);
    return _this;
  }

  return CardImgOverlay;
}(SvelteComponent);

function create_fragment$i(ctx) {
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

function instance$i($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$href = $$props.href,
      href = _$$props$href === void 0 ? '' : _$$props$href;
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
      $$invalidate('classes', classes = clsx(className, 'card-link'));
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

var CardLink =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardLink, _SvelteComponent);

  function CardLink(options) {
    var _this;

    _classCallCheck(this, CardLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardLink).call(this));
    init(_assertThisInitialized(_this), options, instance$i, create_fragment$i, safe_not_equal, ["class", "href"]);
    return _this;
  }

  return CardLink;
}(SvelteComponent);

function create_fragment$j(ctx) {
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

function instance$j($$self, $$props, $$invalidate) {
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
      $$invalidate('classes', classes = clsx(className, 'card-subtitle'));
    }
  };

  return {
    className: className,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CardSubtitle =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CardSubtitle, _SvelteComponent);

  function CardSubtitle(options) {
    var _this;

    _classCallCheck(this, CardSubtitle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CardSubtitle).call(this));
    init(_assertThisInitialized(_this), options, instance$j, create_fragment$j, safe_not_equal, ["class"]);
    return _this;
  }

  return CardSubtitle;
}(SvelteComponent);

function create_fragment$k(ctx) {
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

function instance$k($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$k, create_fragment$k, safe_not_equal, ["class"]);
    return _this;
  }

  return CardText;
}(SvelteComponent);

function create_fragment$l(ctx) {
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

function instance$l($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$l, create_fragment$l, safe_not_equal, ["class"]);
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

function getColumnSizeClass(isXs, colWidth, colSize) {
  if (colSize === true || colSize === '') {
    return isXs ? 'col' : "col-".concat(colWidth);
  } else if (colSize === 'auto') {
    return isXs ? 'col-auto' : "col-".concat(colWidth, "-auto");
  }

  return isXs ? "col-".concat(colSize) : "col-".concat(colWidth, "-").concat(colSize);
}

function create_fragment$m(ctx) {
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

function instance$m($$self, $$props, $$invalidate) {
  var _$$props = $$props,
      _$$props$class = _$$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$id = _$$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
  var colClasses = [];
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
    init(_assertThisInitialized(_this), options, instance$m, create_fragment$m, safe_not_equal, ["class", "id"]);
    return _this;
  }

  return Col;
}(SvelteComponent);

function create_if_block$5(ctx) {
  var div, div_transition, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
      dispose = [listen(div, "introstart", ctx.introstart_handler), listen(div, "introend", ctx.introend_handler), listen(div, "outrostart", ctx.outrostart_handler), listen(div, "outroend", ctx.outroend_handler), listen(div, "introstart", ctx.onEntering), listen(div, "introend", ctx.onEntered), listen(div, "outrostart", ctx.onExiting), listen(div, "outroend", ctx.onExited)];
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

function create_fragment$n(ctx) {
  var if_block_anchor, current, dispose;
  add_render_callback(ctx.onwindowresize);
  var if_block = ctx.isOpen && create_if_block$5(ctx);
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
          if_block = create_if_block$5(ctx);
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

function instance$n($$self, $$props, $$invalidate) {
  var noop = function noop() {
    return undefined;
  };

  var _$$props$isOpen = $$props.isOpen,
      isOpen = _$$props$isOpen === void 0 ? false : _$$props$isOpen,
      _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$navbar = $$props.navbar,
      navbar = _$$props$navbar === void 0 ? false : _$$props$navbar,
      _$$props$onEntering = $$props.onEntering,
      onEntering = _$$props$onEntering === void 0 ? noop : _$$props$onEntering,
      _$$props$onEntered = $$props.onEntered,
      onEntered = _$$props$onEntered === void 0 ? noop : _$$props$onEntered,
      _$$props$onExiting = $$props.onExiting,
      onExiting = _$$props$onExiting === void 0 ? noop : _$$props$onExiting,
      _$$props$onExited = $$props.onExited,
      onExited = _$$props$onExited === void 0 ? noop : _$$props$onExited;
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
    if ('onEntering' in $$props) $$invalidate('onEntering', onEntering = $$props.onEntering);
    if ('onEntered' in $$props) $$invalidate('onEntered', onEntered = $$props.onEntered);
    if ('onExiting' in $$props) $$invalidate('onExiting', onExiting = $$props.onExiting);
    if ('onExited' in $$props) $$invalidate('onExited', onExited = $$props.onExited);
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
    onEntering: onEntering,
    onEntered: onEntered,
    onExiting: onExiting,
    onExited: onExited,
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
    init(_assertThisInitialized(_this), options, instance$n, create_fragment$n, safe_not_equal, ["isOpen", "class", "navbar", "onEntering", "onEntered", "onExiting", "onExited"]);
    return _this;
  }

  return Collapse;
}(SvelteComponent);

function create_fragment$o(ctx) {
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

function instance$o($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$o, create_fragment$o, safe_not_equal, ["class", "fluid", "id"]);
    return _this;
  }

  return Container;
}(SvelteComponent);

function create_else_block$4(ctx) {
  var div, input, input_type_value, t0, label_1, t1, t2, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      input = element("input");
      t0 = space();
      label_1 = element("label");
      t1 = text(ctx.label);
      t2 = space();
      if (default_slot) default_slot.c();
      input.id = ctx.id;
      attr(input, "type", input_type_value = ctx.type === 'switch' ? 'checkbox' : ctx.type);
      input.className = ctx.customControlClasses;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      input.placeholder = ctx.placeholder;
      label_1.className = "custom-control-label";
      label_1.htmlFor = ctx.labelHtmlFor;
      div.className = ctx.wrapperClasses;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      append(div, input);
      append(div, t0);
      append(div, label_1);
      append(label_1, t1);
      append(div, t2);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (!current || changed.id) {
        input.id = ctx.id;
      }

      if ((!current || changed.type) && input_type_value !== (input_type_value = ctx.type === 'switch' ? 'checkbox' : ctx.type)) {
        attr(input, "type", input_type_value);
      }

      if (!current || changed.customControlClasses) {
        input.className = ctx.customControlClasses;
      }

      if (!current || changed.name) {
        input.name = ctx.name;
      }

      if (!current || changed.disabled) {
        input.disabled = ctx.disabled;
      }

      if (!current || changed.placeholder) {
        input.placeholder = ctx.placeholder;
      }

      if (!current || changed.label) {
        set_data(t1, ctx.label);
      }

      if (!current || changed.labelHtmlFor) {
        label_1.htmlFor = ctx.labelHtmlFor;
      }

      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.wrapperClasses) {
        div.className = ctx.wrapperClasses;
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
} // (66:71) 


function create_if_block_2$1(ctx) {
  var input;
  return {
    c: function c() {
      input = element("input");
      attr(input, "type", ctx.type);
      input.id = ctx.id;
      input.className = ctx.combinedClasses;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      input.placeholder = ctx.placeholder;
    },
    m: function m(target, anchor) {
      insert(target, input, anchor);
    },
    p: function p(changed, ctx) {
      if (changed.type) {
        attr(input, "type", ctx.type);
      }

      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.combinedClasses) {
        input.className = ctx.combinedClasses;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
      }
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }
    }
  };
} // (61:26) 


function create_if_block_1$2(ctx) {
  var div,
      input,
      t0,
      label_1,
      t1_value = ctx.label || 'Choose file',
      t1;
  return {
    c: function c() {
      div = element("div");
      input = element("input");
      t0 = space();
      label_1 = element("label");
      t1 = text(t1_value);
      input.id = ctx.id;
      attr(input, "type", "file");
      input.className = ctx.fileClasses;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      input.placeholder = ctx.placeholder;
      label_1.className = "custom-file-label";
      label_1.htmlFor = ctx.labelHtmlFor;
      div.className = ctx.customClass;
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      append(div, input);
      append(div, t0);
      append(div, label_1);
      append(label_1, t1);
    },
    p: function p(changed, ctx) {
      if (changed.id) {
        input.id = ctx.id;
      }

      if (changed.fileClasses) {
        input.className = ctx.fileClasses;
      }

      if (changed.name) {
        input.name = ctx.name;
      }

      if (changed.disabled) {
        input.disabled = ctx.disabled;
      }

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
      }

      if (changed.label && t1_value !== (t1_value = ctx.label || 'Choose file')) {
        set_data(t1, t1_value);
      }

      if (changed.labelHtmlFor) {
        label_1.htmlFor = ctx.labelHtmlFor;
      }

      if (changed.customClass) {
        div.className = ctx.customClass;
      }
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
} // (57:0) {#if type === 'select'}


function create_if_block$6(ctx) {
  var select, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      select = element("select");
      if (default_slot) default_slot.c();
      select.id = ctx.id;
      select.className = ctx.combinedClasses;
      select.name = ctx.name;
      select.disabled = ctx.disabled;
      attr(select, "placeholder", ctx.placeholder);
      select.multiple = ctx.multiple;
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

      if (!current || changed.combinedClasses) {
        select.className = ctx.combinedClasses;
      }

      if (!current || changed.name) {
        select.name = ctx.name;
      }

      if (!current || changed.disabled) {
        select.disabled = ctx.disabled;
      }

      if (!current || changed.placeholder) {
        attr(select, "placeholder", ctx.placeholder);
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
        detach(select);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function create_fragment$p(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$6, create_if_block_1$2, create_if_block_2$1, create_else_block$4];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.type === 'select') return 0;
    if (ctx.type === 'file') return 1;
    if (ctx.type !== 'checkbox' && ctx.type !== 'radio' && ctx.type !== 'switch') return 2;
    return 3;
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

function instance$p($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$name = $$props.name,
      name = _$$props$name === void 0 ? '' : _$$props$name,
      _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id,
      type = $$props.type,
      _$$props$label = $$props.label,
      label = _$$props$label === void 0 ? '' : _$$props$label,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$inline = $$props.inline,
      inline = _$$props$inline === void 0 ? false : _$$props$inline,
      _$$props$valid = $$props.valid,
      valid = _$$props$valid === void 0 ? false : _$$props$valid,
      _$$props$invalid = $$props.invalid,
      invalid = _$$props$invalid === void 0 ? false : _$$props$invalid,
      _$$props$multiple = $$props.multiple,
      multiple = _$$props$multiple === void 0 ? false : _$$props$multiple,
      _$$props$bsSize = $$props.bsSize,
      bsSize = _$$props$bsSize === void 0 ? '' : _$$props$bsSize,
      _$$props$placeholder = $$props.placeholder,
      placeholder = _$$props$placeholder === void 0 ? '' : _$$props$placeholder,
      _$$props$for = $$props["for"],
      htmlFor = _$$props$for === void 0 ? '' : _$$props$for;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('name' in $$props) $$invalidate('name', name = $$props.name);
    if ('id' in $$props) $$invalidate('id', id = $$props.id);
    if ('type' in $$props) $$invalidate('type', type = $$props.type);
    if ('label' in $$props) $$invalidate('label', label = $$props.label);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('inline' in $$props) $$invalidate('inline', inline = $$props.inline);
    if ('valid' in $$props) $$invalidate('valid', valid = $$props.valid);
    if ('invalid' in $$props) $$invalidate('invalid', invalid = $$props.invalid);
    if ('multiple' in $$props) $$invalidate('multiple', multiple = $$props.multiple);
    if ('bsSize' in $$props) $$invalidate('bsSize', bsSize = $$props.bsSize);
    if ('placeholder' in $$props) $$invalidate('placeholder', placeholder = $$props.placeholder);
    if ('for' in $$props) $$invalidate('htmlFor', htmlFor = $$props["for"]);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var customClass, validationClassNames, combinedClasses, fileClasses, wrapperClasses, customControlClasses, labelHtmlFor;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      type: 1,
      bsSize: 1,
      invalid: 1,
      valid: 1,
      customClass: 1,
      validationClassNames: 1,
      inline: 1,
      htmlFor: 1,
      id: 1
    };

    if ($$dirty.className || $$dirty.type || $$dirty.bsSize) {
      $$invalidate('customClass', customClass = clsx(className, "custom-".concat(type), bsSize ? "custom-".concat(type, "-").concat(bsSize) : false));
    }

    if ($$dirty.invalid || $$dirty.valid) {
      $$invalidate('validationClassNames', validationClassNames = clsx(invalid && 'is-invalid', valid && 'is-valid'));
    }

    if ($$dirty.customClass || $$dirty.validationClassNames) {
      $$invalidate('combinedClasses', combinedClasses = clsx(customClass, validationClassNames));
    }

    if ($$dirty.validationClassNames) {
      $$invalidate('fileClasses', fileClasses = clsx(validationClassNames, 'custom-file-input'));
    }

    if ($$dirty.customClass || $$dirty.inline) {
      $$invalidate('wrapperClasses', wrapperClasses = clsx(customClass, 'custom-control', {
        'custom-control-inline': inline
      }));
    }

    if ($$dirty.validationClassNames) {
      $$invalidate('customControlClasses', customControlClasses = clsx(validationClassNames, 'custom-control-input'));
    }

    if ($$dirty.htmlFor || $$dirty.id) {
      $$invalidate('labelHtmlFor', labelHtmlFor = htmlFor || id);
    }
  };

  return {
    className: className,
    name: name,
    id: id,
    type: type,
    label: label,
    disabled: disabled,
    inline: inline,
    valid: valid,
    invalid: invalid,
    multiple: multiple,
    bsSize: bsSize,
    placeholder: placeholder,
    htmlFor: htmlFor,
    customClass: customClass,
    combinedClasses: combinedClasses,
    fileClasses: fileClasses,
    wrapperClasses: wrapperClasses,
    customControlClasses: customControlClasses,
    labelHtmlFor: labelHtmlFor,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var CustomInput =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(CustomInput, _SvelteComponent);

  function CustomInput(options) {
    var _this;

    _classCallCheck(this, CustomInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomInput).call(this));
    init(_assertThisInitialized(_this), options, instance$p, create_fragment$p, safe_not_equal, ["class", "name", "id", "type", "label", "disabled", "inline", "valid", "invalid", "multiple", "bsSize", "placeholder", "for"]);
    return _this;
  }

  return CustomInput;
}(SvelteComponent);

function create_else_block$5(ctx) {
  var button, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      button = element("button");
      if (default_slot) default_slot.c();
      button.className = ctx.classes;
      dispose = [listen(button, "click", ctx.click_handler_3), listen(button, "click", ctx.handleItemClick)];
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

      if (!current || changed.classes) {
        button.className = ctx.classes;
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
      run_all(dispose);
    }
  };
} // (48:15) 


function create_if_block_2$2(ctx) {
  var a, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      a = element("a");
      if (default_slot) default_slot.c();
      a.href = ctx.href;
      a.className = ctx.classes;
      dispose = [listen(a, "click", ctx.click_handler_2), listen(a, "click", ctx.handleItemClick)];
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
} // (44:18) 


function create_if_block_1$3(ctx) {
  var div, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
      dispose = [listen(div, "click", ctx.click_handler_1), listen(div, "click", ctx.handleItemClick)];
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
      run_all(dispose);
    }
  };
} // (39:0) {#if header}


function create_if_block$7(ctx) {
  var h6, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      h6 = element("h6");
      if (default_slot) default_slot.c();
      h6.className = ctx.classes;
      dispose = [listen(h6, "click", ctx.click_handler), listen(h6, "click", ctx.handleItemClick)];
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(h6_nodes);
    },
    m: function m(target, anchor) {
      insert(target, h6, anchor);

      if (default_slot) {
        default_slot.m(h6, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        h6.className = ctx.classes;
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
        detach(h6);
      }

      if (default_slot) default_slot.d(detaching);
      run_all(dispose);
    }
  };
}

function create_fragment$q(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$7, create_if_block_1$3, create_if_block_2$2, create_else_block$5];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.header) return 0;
    if (ctx.divider) return 1;
    if (ctx.href) return 2;
    return 3;
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

function instance$q($$self, $$props, $$invalidate) {
  var $context;
  subscribe($$self, context, function ($$value) {
    $context = $$value;
    $$invalidate('$context', $context);
  });
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$divider = $$props.divider,
      divider = _$$props$divider === void 0 ? false : _$$props$divider,
      _$$props$header = $$props.header,
      header = _$$props$header === void 0 ? false : _$$props$header,
      _$$props$toggle = $$props.toggle,
      toggle = _$$props$toggle === void 0 ? true : _$$props$toggle,
      _$$props$href = $$props.href,
      href = _$$props$href === void 0 ? '' : _$$props$href;

  function handleItemClick(e) {
    if (disabled || header || divider) {
      e.preventDefault();
      return;
    }

    if (toggle) {
      $context.toggle(e);
    }
  }

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  function click_handler_1(event) {
    bubble($$self, event);
  }

  function click_handler_2(event) {
    bubble($$self, event);
  }

  function click_handler_3(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('divider' in $$props) $$invalidate('divider', divider = $$props.divider);
    if ('header' in $$props) $$invalidate('header', header = $$props.header);
    if ('toggle' in $$props) $$invalidate('toggle', toggle = $$props.toggle);
    if ('href' in $$props) $$invalidate('href', href = $$props.href);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      disabled: 1,
      divider: 1,
      header: 1,
      active: 1
    };

    if ($$dirty.className || $$dirty.disabled || $$dirty.divider || $$dirty.header || $$dirty.active) {
      $$invalidate('classes', classes = clsx(className, {
        disabled: disabled,
        'dropdown-item': !divider && !header,
        active: active,
        'dropdown-header': header,
        'dropdown-divider': divider
      }));
    }
  };

  return {
    className: className,
    active: active,
    disabled: disabled,
    divider: divider,
    header: header,
    toggle: toggle,
    href: href,
    handleItemClick: handleItemClick,
    classes: classes,
    click_handler: click_handler,
    click_handler_1: click_handler_1,
    click_handler_2: click_handler_2,
    click_handler_3: click_handler_3,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var DropdownItem =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(DropdownItem, _SvelteComponent);

  function DropdownItem(options) {
    var _this;

    _classCallCheck(this, DropdownItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DropdownItem).call(this));
    init(_assertThisInitialized(_this), options, instance$q, create_fragment$q, safe_not_equal, ["class", "active", "disabled", "divider", "header", "toggle", "href"]);
    return _this;
  }

  return DropdownItem;
}(SvelteComponent);

function create_fragment$r(ctx) {
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

function instance$r($$self, $$props, $$invalidate) {
  var $context;
  subscribe($$self, context, function ($$value) {
    $context = $$value;
    $$invalidate('$context', $context);
  });
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$right = $$props.right,
      right = _$$props$right === void 0 ? false : _$$props$right,
      _$$props$flip = $$props.flip,
      flip = _$$props$flip === void 0 ? true : _$$props$flip,
      _$$props$persist = $$props.persist,
      persist = _$$props$persist === void 0 ? false : _$$props$persist;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('right' in $$props) $$invalidate('right', right = $$props.right);
    if ('flip' in $$props) $$invalidate('flip', flip = $$props.flip);
    if ('persist' in $$props) $$invalidate('persist', persist = $$props.persist);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      right: 1,
      $context: 1
    };

    if ($$dirty.className || $$dirty.right || $$dirty.$context) {
      $$invalidate('classes', classes = clsx(className, 'dropdown-menu', {
        'dropdown-menu-right': right,
        show: $context.isOpen
      }));
    }
  };

  return {
    className: className,
    right: right,
    flip: flip,
    persist: persist,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var DropdownMenu =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(DropdownMenu, _SvelteComponent);

  function DropdownMenu(options) {
    var _this;

    _classCallCheck(this, DropdownMenu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DropdownMenu).call(this));
    init(_assertThisInitialized(_this), options, instance$r, create_fragment$r, safe_not_equal, ["class", "right", "flip", "persist"]);
    return _this;
  }

  return DropdownMenu;
}(SvelteComponent);

function create_else_block$6(ctx) {
  var current;
  var button = new Button({
    props: {
      "class": ctx.classes,
      color: ctx.color,
      size: ctx.size,
      outline: ctx.outline,
      $$slots: {
        "default": [create_default_slot$1]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  button.$on("click", ctx.click_handler_2);
  button.$on("click", ctx.toggleButton);
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
      if (changed.color) button_changes.color = ctx.color;
      if (changed.size) button_changes.size = ctx.size;
      if (changed.outline) button_changes.outline = ctx.outline;
      if (changed.$$scope || changed.ariaLabel) button_changes.$$scope = {
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
} // (49:25) 


function create_if_block_1$4(ctx) {
  var span1, span0, t, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      span1 = element("span");

      if (!default_slot) {
        span0 = element("span");
        t = text(ctx.ariaLabel);
      }

      if (default_slot) default_slot.c();

      if (!default_slot) {
        span0.className = "sr-only";
      }

      span1.className = ctx.classes;
      attr(span1, "color", ctx.color);
      attr(span1, "size", ctx.size);
      dispose = [listen(span1, "click", ctx.click_handler_1), listen(span1, "click", ctx.toggleButton)];
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(span1_nodes);
    },
    m: function m(target, anchor) {
      insert(target, span1, anchor);

      if (!default_slot) {
        append(span1, span0);
        append(span0, t);
      } else {
        default_slot.m(span1, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (!default_slot) {
        if (!current || changed.ariaLabel) {
          set_data(t, ctx.ariaLabel);
        }
      }

      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        span1.className = ctx.classes;
      }

      if (!current || changed.color) {
        attr(span1, "color", ctx.color);
      }

      if (!current || changed.size) {
        attr(span1, "size", ctx.size);
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
        detach(span1);
      }

      if (default_slot) default_slot.d(detaching);
      run_all(dispose);
    }
  };
} // (43:0) {#if nav}


function create_if_block$8(ctx) {
  var a, span, t, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      a = element("a");

      if (!default_slot) {
        span = element("span");
        t = text(ctx.ariaLabel);
      }

      if (default_slot) default_slot.c();

      if (!default_slot) {
        span.className = "sr-only";
      }

      a.href = "#nav";
      a.className = ctx.classes;
      dispose = [listen(a, "click", ctx.click_handler), listen(a, "click", ctx.toggleButton)];
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(a_nodes);
    },
    m: function m(target, anchor) {
      insert(target, a, anchor);

      if (!default_slot) {
        append(a, span);
        append(span, t);
      } else {
        default_slot.m(a, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (!default_slot) {
        if (!current || changed.ariaLabel) {
          set_data(t, ctx.ariaLabel);
        }
      }

      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
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
} // (56:1) <Button on:click on:click="{toggleButton}" class="{classes}" {color} {size} {outline}>


function create_default_slot$1(ctx) {
  var span, t, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      if (!default_slot) {
        span = element("span");
        t = text(ctx.ariaLabel);
      }

      if (default_slot) default_slot.c();

      if (!default_slot) {
        span.className = "sr-only";
      }
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(nodes);
    },
    m: function m(target, anchor) {
      if (!default_slot) {
        insert(target, span, anchor);
        append(span, t);
      } else {
        default_slot.m(target, anchor);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (!default_slot) {
        if (!current || changed.ariaLabel) {
          set_data(t, ctx.ariaLabel);
        }
      }

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

function create_fragment$s(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$8, create_if_block_1$4, create_else_block$6];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.nav) return 0;
    if (ctx.tag === 'span') return 1;
    return 2;
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

function instance$s($$self, $$props, $$invalidate) {
  var $context;
  subscribe($$self, context, function ($$value) {
    $context = $$value;
    $$invalidate('$context', $context);
  });
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$caret = $$props.caret,
      caret = _$$props$caret === void 0 ? false : _$$props$caret,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? 'secondary' : _$$props$color,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$ariaHaspopup = $$props.ariaHaspopup,
      ariaHaspopup = _$$props$ariaHaspopup === void 0 ? false : _$$props$ariaHaspopup,
      _$$props$ariaLabel = $$props.ariaLabel,
      ariaLabel = _$$props$ariaLabel === void 0 ? 'Toggle Dropdown' : _$$props$ariaLabel,
      _$$props$split = $$props.split,
      split = _$$props$split === void 0 ? false : _$$props$split,
      _$$props$nav = $$props.nav,
      nav = _$$props$nav === void 0 ? false : _$$props$nav,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$tag = $$props.tag,
      tag = _$$props$tag === void 0 ? null : _$$props$tag,
      _$$props$outline = $$props.outline,
      outline = _$$props$outline === void 0 ? false : _$$props$outline;

  function toggleButton(e) {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (nav) {
      e.preventDefault();
    }

    $context.toggle(e);
  }

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  function click_handler_1(event) {
    bubble($$self, event);
  }

  function click_handler_2(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('caret' in $$props) $$invalidate('caret', caret = $$props.caret);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('ariaHaspopup' in $$props) $$invalidate('ariaHaspopup', ariaHaspopup = $$props.ariaHaspopup);
    if ('ariaLabel' in $$props) $$invalidate('ariaLabel', ariaLabel = $$props.ariaLabel);
    if ('split' in $$props) $$invalidate('split', split = $$props.split);
    if ('nav' in $$props) $$invalidate('nav', nav = $$props.nav);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('tag' in $$props) $$invalidate('tag', tag = $$props.tag);
    if ('outline' in $$props) $$invalidate('outline', outline = $$props.outline);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      caret: 1,
      split: 1,
      nav: 1
    };

    if ($$dirty.className || $$dirty.caret || $$dirty.split || $$dirty.nav) {
      $$invalidate('classes', classes = clsx(className, {
        'dropdown-toggle': caret || split,
        'dropdown-toggle-split': split,
        'nav-link': nav
      }));
    }
  };

  return {
    className: className,
    caret: caret,
    color: color,
    disabled: disabled,
    ariaHaspopup: ariaHaspopup,
    ariaLabel: ariaLabel,
    split: split,
    nav: nav,
    size: size,
    tag: tag,
    outline: outline,
    toggleButton: toggleButton,
    classes: classes,
    click_handler: click_handler,
    click_handler_1: click_handler_1,
    click_handler_2: click_handler_2,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var DropdownToggle =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(DropdownToggle, _SvelteComponent);

  function DropdownToggle(options) {
    var _this;

    _classCallCheck(this, DropdownToggle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DropdownToggle).call(this));
    init(_assertThisInitialized(_this), options, instance$s, create_fragment$s, safe_not_equal, ["class", "caret", "color", "disabled", "ariaHaspopup", "ariaLabel", "split", "nav", "size", "tag", "outline"]);
    return _this;
  }

  return DropdownToggle;
}(SvelteComponent);

function create_fragment$t(ctx) {
  var form, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      form = element("form");
      if (default_slot) default_slot.c();
      form.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(form_nodes);
    },
    m: function m(target, anchor) {
      insert(target, form, anchor);

      if (default_slot) {
        default_slot.m(form, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        form.className = ctx.classes;
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
        detach(form);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$t($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$inline = $$props.inline,
      inline = _$$props$inline === void 0 ? false : _$$props$inline;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('inline' in $$props) $$invalidate('inline', inline = $$props.inline);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      inline: 1
    };

    if ($$dirty.className || $$dirty.inline) {
      $$invalidate('classes', classes = clsx(className, inline ? 'form-inline' : false));
    }
  };

  return {
    className: className,
    inline: inline,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Form =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Form, _SvelteComponent);

  function Form(options) {
    var _this;

    _classCallCheck(this, Form);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Form).call(this));
    init(_assertThisInitialized(_this), options, instance$t, create_fragment$t, safe_not_equal, ["class", "inline"]);
    return _this;
  }

  return Form;
}(SvelteComponent);

function create_fragment$u(ctx) {
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

function instance$u($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$valid = $$props.valid,
      valid = _$$props$valid === void 0 ? undefined : _$$props$valid,
      _$$props$tooltip = $$props.tooltip,
      tooltip = _$$props$tooltip === void 0 ? false : _$$props$tooltip;
  var classes;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('valid' in $$props) $$invalidate('valid', valid = $$props.valid);
    if ('tooltip' in $$props) $$invalidate('tooltip', tooltip = $$props.tooltip);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      tooltip: 1,
      className: 1,
      valid: 1
    };

    if ($$dirty.tooltip || $$dirty.className || $$dirty.valid) {
      {
        var validMode = tooltip ? 'tooltip' : 'feedback';
        $$invalidate('classes', classes = clsx(className, valid ? "valid-".concat(validMode) : "invalid-".concat(validMode)));
      }
    }
  };

  return {
    className: className,
    valid: valid,
    tooltip: tooltip,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var FormFeedback =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(FormFeedback, _SvelteComponent);

  function FormFeedback(options) {
    var _this;

    _classCallCheck(this, FormFeedback);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormFeedback).call(this));
    init(_assertThisInitialized(_this), options, instance$u, create_fragment$u, safe_not_equal, ["class", "valid", "tooltip"]);
    return _this;
  }

  return FormFeedback;
}(SvelteComponent);

function create_else_block$7(ctx) {
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
} // (23:0) {#if tag === 'fieldset'}


function create_if_block$9(ctx) {
  var fieldset, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      fieldset = element("fieldset");
      if (default_slot) default_slot.c();
      fieldset.id = ctx.id;
      fieldset.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(fieldset_nodes);
    },
    m: function m(target, anchor) {
      insert(target, fieldset, anchor);

      if (default_slot) {
        default_slot.m(fieldset, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.id) {
        fieldset.id = ctx.id;
      }

      if (!current || changed.classes) {
        fieldset.className = ctx.classes;
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
        detach(fieldset);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function create_fragment$v(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$9, create_else_block$7];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.tag === 'fieldset') return 0;
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

function instance$v($$self, $$props, $$invalidate) {
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
      id = _$$props$id === void 0 ? '' : _$$props$id,
      _$$props$tag = $$props.tag,
      tag = _$$props$tag === void 0 ? null : _$$props$tag;
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
    if ('tag' in $$props) $$invalidate('tag', tag = $$props.tag);
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
    tag: tag,
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
    init(_assertThisInitialized(_this), options, instance$v, create_fragment$v, safe_not_equal, ["class", "row", "check", "inline", "disabled", "id", "tag"]);
    return _this;
  }

  return FormGroup;
}(SvelteComponent);

function create_fragment$w(ctx) {
  var small, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      small = element("small");
      if (default_slot) default_slot.c();
      small.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(small_nodes);
    },
    m: function m(target, anchor) {
      insert(target, small, anchor);

      if (default_slot) {
        default_slot.m(small, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        small.className = ctx.classes;
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
        detach(small);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$w($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$inline = $$props.inline,
      inline = _$$props$inline === void 0 ? false : _$$props$inline,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? 'muted' : _$$props$color;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('inline' in $$props) $$invalidate('inline', inline = $$props.inline);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      inline: 1,
      color: 1
    };

    if ($$dirty.className || $$dirty.inline || $$dirty.color) {
      $$invalidate('classes', classes = clsx(className, !inline ? 'form-text' : false, color ? "text-".concat(color) : false));
    }
  };

  return {
    className: className,
    inline: inline,
    color: color,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var FormText =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(FormText, _SvelteComponent);

  function FormText(options) {
    var _this;

    _classCallCheck(this, FormText);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormText).call(this));
    init(_assertThisInitialized(_this), options, instance$w, create_fragment$w, safe_not_equal, ["class", "inline", "color"]);
    return _this;
  }

  return FormText;
}(SvelteComponent);

function create_if_block_15(ctx) {
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
} // (93:29) 


function create_if_block_14(ctx) {
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


function create_if_block$a(ctx) {
  var if_block_anchor;

  function select_block_type_1(ctx) {
    if (ctx.type === 'text') return create_if_block_1$5;
    if (ctx.type === 'password') return create_if_block_2$3;
    if (ctx.type === 'email') return create_if_block_3;
    if (ctx.type === 'file') return create_if_block_4;
    if (ctx.type === 'checkbox') return create_if_block_5;
    if (ctx.type === 'radio') return create_if_block_6;
    if (ctx.type === 'url') return create_if_block_7;
    if (ctx.type === 'number') return create_if_block_8;
    if (ctx.type === 'date') return create_if_block_9;
    if (ctx.type === 'time') return create_if_block_10;
    if (ctx.type === 'datetime') return create_if_block_11;
    if (ctx.type === 'color') return create_if_block_12;
    if (ctx.type === 'search') return create_if_block_13;
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
} // (89:29) 


function create_if_block_13(ctx) {
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
      input.placeholder = ctx.placeholder;
      dispose = listen(input, "input", ctx.input_input_handler_10);
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (87:28) 


function create_if_block_12(ctx) {
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(input);
      }

      dispose();
    }
  };
} // (85:31) 


function create_if_block_11(ctx) {
  var input, dispose;
  return {
    c: function c() {
      input = element("input");
      input.id = ctx.id;
      attr(input, "type", "datetime");
      input.readOnly = ctx.readonly;
      input.className = ctx.classes;
      input.name = ctx.name;
      input.disabled = ctx.disabled;
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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


function create_if_block_2$3(ctx) {
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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


function create_if_block_1$5(ctx) {
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
      input.placeholder = ctx.placeholder;
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

      if (changed.placeholder) {
        input.placeholder = ctx.placeholder;
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

function create_fragment$x(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$a, create_if_block_14, create_if_block_15];
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

function instance$x($$self, $$props, $$invalidate) {
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

  function input_input_handler_10() {
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
    input_input_handler_10: input_input_handler_10,
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
    init(_assertThisInitialized(_this), options, instance$x, create_fragment$x, safe_not_equal, ["class", "type", "size", "bsSize", "valid", "invalid", "plaintext", "addon", "value", "readonly", "multiple", "id", "name", "placeholder", "disabled"]);
    return _this;
  }

  return Input;
}(SvelteComponent);

function create_fragment$y(ctx) {
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

function instance$y($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      size: 1
    };

    if ($$dirty.className || $$dirty.size) {
      $$invalidate('classes', classes = clsx(className, 'input-group', size ? "input-group-".concat(size) : null));
    }
  };

  return {
    className: className,
    size: size,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var InputGroup =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(InputGroup, _SvelteComponent);

  function InputGroup(options) {
    var _this;

    _classCallCheck(this, InputGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputGroup).call(this));
    init(_assertThisInitialized(_this), options, instance$y, create_fragment$y, safe_not_equal, ["class", "size"]);
    return _this;
  }

  return InputGroup;
}(SvelteComponent);

function create_fragment$z(ctx) {
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

function instance$z($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      addonType = $$props.addonType;

  if (['prepend', 'append'].indexOf(addonType) === -1) {
    throw new Error("addonType must be one of 'prepend', 'append'. Received '".concat(addonType, "' instead."));
  }

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('addonType' in $$props) $$invalidate('addonType', addonType = $$props.addonType);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      addonType: 1
    };

    if ($$dirty.className || $$dirty.addonType) {
      $$invalidate('classes', classes = clsx(className, "input-group-".concat(addonType)));
    }
  };

  return {
    className: className,
    addonType: addonType,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var InputGroupAddon =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(InputGroupAddon, _SvelteComponent);

  function InputGroupAddon(options) {
    var _this;

    _classCallCheck(this, InputGroupAddon);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputGroupAddon).call(this));
    init(_assertThisInitialized(_this), options, instance$z, create_fragment$z, safe_not_equal, ["class", "addonType"]);
    return _this;
  }

  return InputGroupAddon;
}(SvelteComponent);

function create_default_slot$2(ctx) {
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

function create_fragment$A(ctx) {
  var current;
  var dropdown = new Dropdown({
    props: {
      "class": ctx.className,
      addonType: ctx.addonType,
      toggle: ctx.toggle,
      isOpen: ctx.isOpen,
      $$slots: {
        "default": [create_default_slot$2]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      dropdown.$$.fragment.c();
    },
    m: function m(target, anchor) {
      mount_component(dropdown, target, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var dropdown_changes = {};
      if (changed.className) dropdown_changes["class"] = ctx.className;
      if (changed.addonType) dropdown_changes.addonType = ctx.addonType;
      if (changed.toggle) dropdown_changes.toggle = ctx.toggle;
      if (changed.isOpen) dropdown_changes.isOpen = ctx.isOpen;
      if (changed.$$scope) dropdown_changes.$$scope = {
        changed: changed,
        ctx: ctx
      };
      dropdown.$set(dropdown_changes);
    },
    i: function i(local) {
      if (current) return;
      dropdown.$$.fragment.i(local);
      current = true;
    },
    o: function o(local) {
      dropdown.$$.fragment.o(local);
      current = false;
    },
    d: function d(detaching) {
      dropdown.$destroy(detaching);
    }
  };
}

function instance$A($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      addonType = $$props.addonType,
      toggle = $$props.toggle,
      isOpen = $$props.isOpen;

  if (['prepend', 'append'].indexOf(addonType) === -1) {
    throw new Error("addonType must be one of 'prepend', 'append'. Received '".concat(addonType, "' instead."));
  }

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('addonType' in $$props) $$invalidate('addonType', addonType = $$props.addonType);
    if ('toggle' in $$props) $$invalidate('toggle', toggle = $$props.toggle);
    if ('isOpen' in $$props) $$invalidate('isOpen', isOpen = $$props.isOpen);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  return {
    className: className,
    addonType: addonType,
    toggle: toggle,
    isOpen: isOpen,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var InputGroupButtonDropdown =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(InputGroupButtonDropdown, _SvelteComponent);

  function InputGroupButtonDropdown(options) {
    var _this;

    _classCallCheck(this, InputGroupButtonDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputGroupButtonDropdown).call(this));
    init(_assertThisInitialized(_this), options, instance$A, create_fragment$A, safe_not_equal, ["class", "addonType", "toggle", "isOpen"]);
    return _this;
  }

  return InputGroupButtonDropdown;
}(SvelteComponent);

function create_fragment$B(ctx) {
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

function instance$B($$self, $$props, $$invalidate) {
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
      $$invalidate('classes', classes = clsx(className, 'input-group-text'));
    }
  };

  return {
    className: className,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var InputGroupText =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(InputGroupText, _SvelteComponent);

  function InputGroupText(options) {
    var _this;

    _classCallCheck(this, InputGroupText);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputGroupText).call(this));
    init(_assertThisInitialized(_this), options, instance$B, create_fragment$B, safe_not_equal, ["class"]);
    return _this;
  }

  return InputGroupText;
}(SvelteComponent);

function create_else_block$8(ctx) {
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


function create_if_block$b(ctx) {
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

function create_fragment$C(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$b, create_else_block$8];
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

function instance$C($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$C, create_fragment$C, safe_not_equal, ["class", "fluid", "tag"]);
    return _this;
  }

  return Jumbotron;
}(SvelteComponent);

function create_fragment$D(ctx) {
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

function instance$D($$self, $$props, $$invalidate) {
  var colWidths = ['xs', 'sm', 'md', 'lg', 'xl'];
  var _$$props = $$props,
      _$$props$class = _$$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$hidden = _$$props.hidden,
      hidden = _$$props$hidden === void 0 ? false : _$$props$hidden,
      _$$props$check = _$$props.check,
      check = _$$props$check === void 0 ? false : _$$props$check,
      _$$props$size = _$$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$for = _$$props["for"],
      fore = _$$props$for === void 0 ? '' : _$$props$for,
      _$$props$id = _$$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id,
      _$$props$xs = _$$props.xs,
      xs = _$$props$xs === void 0 ? '' : _$$props$xs,
      _$$props$sm = _$$props.sm,
      sm = _$$props$sm === void 0 ? '' : _$$props$sm,
      _$$props$md = _$$props.md,
      md = _$$props$md === void 0 ? '' : _$$props$md,
      _$$props$lg = _$$props.lg,
      lg = _$$props$lg === void 0 ? '' : _$$props$lg,
      _$$props$xl = _$$props.xl,
      xl = _$$props$xl === void 0 ? '' : _$$props$xl,
      _$$props$widths = _$$props.widths,
      widths = _$$props$widths === void 0 ? colWidths : _$$props$widths;
  var colClasses = [];
  colWidths.forEach(function (colWidth) {
    var columnProp = $$props[colWidth];

    if (!columnProp && columnProp !== '') {
      return;
    }

    var isXs = colWidth === 'xs';
    var colClass;

    if (lodash_isobject(columnProp)) {
      var _clsx;

      var colSizeInterfix = isXs ? '-' : "-".concat(colWidth, "-");
      colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      colClasses.push(clsx((_clsx = {}, _defineProperty(_clsx, colClass, columnProp.size || columnProp.size === ''), _defineProperty(_clsx, "order".concat(colSizeInterfix).concat(columnProp.order), columnProp.order || columnProp.order === 0), _defineProperty(_clsx, "offset".concat(colSizeInterfix).concat(columnProp.offset), columnProp.offset || columnProp.offset === 0), _clsx)));
    } else {
      colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });
  var _$$props2 = $$props,
      _$$props2$$$slots = _$$props2.$$slots,
      $$slots = _$$props2$$$slots === void 0 ? {} : _$$props2$$$slots,
      $$scope = _$$props2.$$scope;

  $$self.$set = function ($$new_props) {
    $$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
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
    if ('$$scope' in $$new_props) $$invalidate('$$scope', $$scope = $$new_props.$$scope);
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
      $$invalidate('classes', classes = clsx(className, hidden ? 'sr-only' : false, check ? 'form-check-label' : false, size ? "col-form-label-".concat(size) : false, colClasses, colClasses.length ? 'col-form-label' : false));
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
    $$props: $$props = exclude_internal_props($$props),
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
    init(_assertThisInitialized(_this), options, instance$D, create_fragment$D, safe_not_equal, ["class", "hidden", "check", "size", "for", "id", "xs", "sm", "md", "lg", "xl", "widths"]);
    return _this;
  }

  return Label;
}(SvelteComponent);

function create_fragment$E(ctx) {
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

function instance$E($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$flush = $$props.flush,
      flush = _$$props$flush === void 0 ? false : _$$props$flush;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('flush' in $$props) $$invalidate('flush', flush = $$props.flush);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      flush: 1
    };

    if ($$dirty.className || $$dirty.flush) {
      $$invalidate('classes', classes = clsx(className, 'list-group', flush ? 'list-group-flush' : false));
    }
  };

  return {
    className: className,
    flush: flush,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ListGroup =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ListGroup, _SvelteComponent);

  function ListGroup(options) {
    var _this;

    _classCallCheck(this, ListGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ListGroup).call(this));
    init(_assertThisInitialized(_this), options, instance$E, create_fragment$E, safe_not_equal, ["class", "flush"]);
    return _this;
  }

  return ListGroup;
}(SvelteComponent);

function create_else_block$9(ctx) {
  var li, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      li = element("li");
      if (default_slot) default_slot.c();
      li.className = ctx.classes;
      attr(li, "disabled", ctx.disabled);
      attr(li, "active", ctx.active);
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

      if (!current || changed.disabled) {
        attr(li, "disabled", ctx.disabled);
      }

      if (!current || changed.active) {
        attr(li, "active", ctx.active);
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
} // (27:27) 


function create_if_block_1$6(ctx) {
  var button, current, dispose;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      button = element("button");
      if (default_slot) default_slot.c();
      button.className = ctx.classes;
      button.type = "button";
      button.disabled = ctx.disabled;
      attr(button, "active", ctx.active);
      dispose = listen(button, "click", ctx.click_handler);
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

      if (!current || changed.classes) {
        button.className = ctx.classes;
      }

      if (!current || changed.disabled) {
        button.disabled = ctx.disabled;
      }

      if (!current || changed.active) {
        attr(button, "active", ctx.active);
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
} // (23:0) {#if href}


function create_if_block$c(ctx) {
  var a, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      a = element("a");
      if (default_slot) default_slot.c();
      a.className = ctx.classes;
      a.href = ctx.href;
      attr(a, "disabled", ctx.disabled);
      attr(a, "active", ctx.active);
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

      if (!current || changed.disabled) {
        attr(a, "disabled", ctx.disabled);
      }

      if (!current || changed.active) {
        attr(a, "active", ctx.active);
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

function create_fragment$F(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$c, create_if_block_1$6, create_else_block$9];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.href) return 0;
    if (ctx.tag === 'button') return 1;
    return 2;
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

function instance$F($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? '' : _$$props$color,
      _$$props$action = $$props.action,
      action = _$$props$action === void 0 ? false : _$$props$action,
      _$$props$href = $$props.href,
      href = _$$props$href === void 0 ? null : _$$props$href,
      _$$props$tag = $$props.tag,
      tag = _$$props$tag === void 0 ? null : _$$props$tag;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('action' in $$props) $$invalidate('action', action = $$props.action);
    if ('href' in $$props) $$invalidate('href', href = $$props.href);
    if ('tag' in $$props) $$invalidate('tag', tag = $$props.tag);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      active: 1,
      disabled: 1,
      action: 1,
      color: 1
    };

    if ($$dirty.className || $$dirty.active || $$dirty.disabled || $$dirty.action || $$dirty.color) {
      $$invalidate('classes', classes = clsx(className, active ? 'active' : false, disabled ? 'disabled' : false, action ? 'list-group-item-action' : false, color ? "list-group-item-".concat(color) : false, 'list-group-item'));
    }
  };

  return {
    className: className,
    active: active,
    disabled: disabled,
    color: color,
    action: action,
    href: href,
    tag: tag,
    classes: classes,
    click_handler: click_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ListGroupItem =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ListGroupItem, _SvelteComponent);

  function ListGroupItem(options) {
    var _this;

    _classCallCheck(this, ListGroupItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ListGroupItem).call(this));
    init(_assertThisInitialized(_this), options, instance$F, create_fragment$F, safe_not_equal, ["class", "active", "disabled", "color", "action", "href", "tag"]);
    return _this;
  }

  return ListGroupItem;
}(SvelteComponent);

function create_fragment$G(ctx) {
  var h5, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      h5 = element("h5");
      if (default_slot) default_slot.c();
      h5.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(h5_nodes);
    },
    m: function m(target, anchor) {
      insert(target, h5, anchor);

      if (default_slot) {
        default_slot.m(h5, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        h5.className = ctx.classes;
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
        detach(h5);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function instance$G($$self, $$props, $$invalidate) {
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
      $$invalidate('classes', classes = clsx(className, 'list-group-item-heading'));
    }
  };

  return {
    className: className,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ListGroupItemHeading =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ListGroupItemHeading, _SvelteComponent);

  function ListGroupItemHeading(options) {
    var _this;

    _classCallCheck(this, ListGroupItemHeading);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ListGroupItemHeading).call(this));
    init(_assertThisInitialized(_this), options, instance$G, create_fragment$G, safe_not_equal, ["class"]);
    return _this;
  }

  return ListGroupItemHeading;
}(SvelteComponent);

function create_fragment$H(ctx) {
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

function instance$H($$self, $$props, $$invalidate) {
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
      $$invalidate('classes', classes = clsx(className, 'list-group-item-text'));
    }
  };

  return {
    className: className,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ListGroupItemText =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ListGroupItemText, _SvelteComponent);

  function ListGroupItemText(options) {
    var _this;

    _classCallCheck(this, ListGroupItemText);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ListGroupItemText).call(this));
    init(_assertThisInitialized(_this), options, instance$H, create_fragment$H, safe_not_equal, ["class"]);
    return _this;
  }

  return ListGroupItemText;
}(SvelteComponent);

function create_else_block$a(ctx) {
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
} // (46:15) 


function create_if_block_3$1(ctx) {
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
} // (44:24) 


function create_if_block_2$4(ctx) {
  var img;
  return {
    c: function c() {
      img = element("img");
      img.className = ctx.classes;
      img.src = ctx.src;
      img.alt = ctx.alt;
    },
    m: function m(target, anchor) {
      insert(target, img, anchor);
    },
    p: function p(changed, ctx) {
      if (changed.classes) {
        img.className = ctx.classes;
      }

      if (changed.src) {
        img.src = ctx.src;
      }

      if (changed.alt) {
        img.alt = ctx.alt;
      }
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) {
        detach(img);
      }
    }
  };
} // (40:15) 


function create_if_block_1$7(ctx) {
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
} // (36:0) {#if heading}


function create_if_block$d(ctx) {
  var h4, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      h4 = element("h4");
      if (default_slot) default_slot.c();
      h4.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(h4_nodes);
    },
    m: function m(target, anchor) {
      insert(target, h4, anchor);

      if (default_slot) {
        default_slot.m(h4, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        h4.className = ctx.classes;
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
        detach(h4);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
}

function create_fragment$I(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$d, create_if_block_1$7, create_if_block_2$4, create_if_block_3$1, create_else_block$a];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.heading) return 0;
    if (ctx.href) return 1;
    if (ctx.src || ctx.object) return 2;
    if (ctx.list) return 3;
    return 4;
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

function instance$I($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$body = $$props.body,
      body = _$$props$body === void 0 ? false : _$$props$body,
      _$$props$bottom = $$props.bottom,
      bottom = _$$props$bottom === void 0 ? false : _$$props$bottom,
      _$$props$heading = $$props.heading,
      heading = _$$props$heading === void 0 ? false : _$$props$heading,
      _$$props$left = $$props.left,
      left = _$$props$left === void 0 ? false : _$$props$left,
      _$$props$list = $$props.list,
      list = _$$props$list === void 0 ? false : _$$props$list,
      _$$props$middle = $$props.middle,
      middle = _$$props$middle === void 0 ? false : _$$props$middle,
      _$$props$object = $$props.object,
      object = _$$props$object === void 0 ? false : _$$props$object,
      _$$props$right = $$props.right,
      right = _$$props$right === void 0 ? false : _$$props$right,
      _$$props$top = $$props.top,
      top = _$$props$top === void 0 ? false : _$$props$top,
      _$$props$href = $$props.href,
      href = _$$props$href === void 0 ? '' : _$$props$href,
      _$$props$src = $$props.src,
      src = _$$props$src === void 0 ? '' : _$$props$src,
      _$$props$alt = $$props.alt,
      alt = _$$props$alt === void 0 ? '' : _$$props$alt;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('body' in $$props) $$invalidate('body', body = $$props.body);
    if ('bottom' in $$props) $$invalidate('bottom', bottom = $$props.bottom);
    if ('heading' in $$props) $$invalidate('heading', heading = $$props.heading);
    if ('left' in $$props) $$invalidate('left', left = $$props.left);
    if ('list' in $$props) $$invalidate('list', list = $$props.list);
    if ('middle' in $$props) $$invalidate('middle', middle = $$props.middle);
    if ('object' in $$props) $$invalidate('object', object = $$props.object);
    if ('right' in $$props) $$invalidate('right', right = $$props.right);
    if ('top' in $$props) $$invalidate('top', top = $$props.top);
    if ('href' in $$props) $$invalidate('href', href = $$props.href);
    if ('src' in $$props) $$invalidate('src', src = $$props.src);
    if ('alt' in $$props) $$invalidate('alt', alt = $$props.alt);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      body: 1,
      heading: 1,
      left: 1,
      right: 1,
      top: 1,
      bottom: 1,
      middle: 1,
      object: 1,
      list: 1
    };

    if ($$dirty.className || $$dirty.body || $$dirty.heading || $$dirty.left || $$dirty.right || $$dirty.top || $$dirty.bottom || $$dirty.middle || $$dirty.object || $$dirty.list) {
      $$invalidate('classes', classes = clsx(className, {
        'media-body': body,
        'media-heading': heading,
        'media-left': left,
        'media-right': right,
        'media-top': top,
        'media-bottom': bottom,
        'media-middle': middle,
        'media-object': object,
        'media-list': list,
        media: !body && !heading && !left && !right && !top && !bottom && !middle && !object && !list
      }));
    }
  };

  return {
    className: className,
    body: body,
    bottom: bottom,
    heading: heading,
    left: left,
    list: list,
    middle: middle,
    object: object,
    right: right,
    top: top,
    href: href,
    src: src,
    alt: alt,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Media =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Media, _SvelteComponent);

  function Media(options) {
    var _this;

    _classCallCheck(this, Media);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Media).call(this));
    init(_assertThisInitialized(_this), options, instance$I, create_fragment$I, safe_not_equal, ["class", "body", "bottom", "heading", "left", "list", "middle", "object", "right", "top", "href", "src", "alt"]);
    return _this;
  }

  return Media;
}(SvelteComponent);

function create_fragment$J(ctx) {
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

function instance$J($$self, $$props, $$invalidate) {
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
      $$invalidate('classes', classes = clsx(className, 'modal-body'));
    }
  };

  return {
    className: className,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ModalBody =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ModalBody, _SvelteComponent);

  function ModalBody(options) {
    var _this;

    _classCallCheck(this, ModalBody);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModalBody).call(this));
    init(_assertThisInitialized(_this), options, instance$J, create_fragment$J, safe_not_equal, ["class"]);
    return _this;
  }

  return ModalBody;
}(SvelteComponent);

function create_fragment$K(ctx) {
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

function instance$K($$self, $$props, $$invalidate) {
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
      $$invalidate('classes', classes = clsx(className, 'modal-footer'));
    }
  };

  return {
    className: className,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ModalFooter =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ModalFooter, _SvelteComponent);

  function ModalFooter(options) {
    var _this;

    _classCallCheck(this, ModalFooter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModalFooter).call(this));
    init(_assertThisInitialized(_this), options, instance$K, create_fragment$K, safe_not_equal, ["class"]);
    return _this;
  }

  return ModalFooter;
}(SvelteComponent);

var get_close_slot_changes = function get_close_slot_changes(_ref) {
  _objectDestructuringEmpty(_ref);

  return {};
};

var get_close_slot_context = function get_close_slot_context(_ref2) {
  _objectDestructuringEmpty(_ref2);

  return {};
};

var get_content_slot_changes = function get_content_slot_changes(_ref3) {
  _objectDestructuringEmpty(_ref3);

  return {};
};

var get_content_slot_context = function get_content_slot_context(_ref4) {
  _objectDestructuringEmpty(_ref4);

  return {};
}; // (23:2) {#if typeof toggle === 'function'}


function create_if_block$e(ctx) {
  var button, span, t, dispose;
  return {
    c: function c() {
      button = element("button");
      span = element("span");
      t = text(ctx.closeIcon);
      attr(span, "aria-hidden", "true");
      button.type = "button";
      button.className = "close";
      attr(button, "aria-label", ctx.closeAriaLabel);
      dispose = listen(button, "click", ctx.toggle);
    },
    m: function m(target, anchor) {
      insert(target, button, anchor);
      append(button, span);
      append(span, t);
    },
    p: function p(changed, ctx) {
      if (changed.closeIcon) {
        set_data(t, ctx.closeIcon);
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

function create_fragment$L(ctx) {
  var div, h5, t, current;
  var content_slot_1 = ctx.$$slots.content;
  var content_slot = create_slot(content_slot_1, ctx, get_content_slot_context);
  var close_slot_1 = ctx.$$slots.close;
  var close_slot = create_slot(close_slot_1, ctx, get_close_slot_context);
  var if_block = typeof ctx.toggle === 'function' && create_if_block$e(ctx);
  return {
    c: function c() {
      div = element("div");
      h5 = element("h5");
      if (content_slot) content_slot.c();
      t = space();

      if (!close_slot) {
        if (if_block) if_block.c();
      }

      if (close_slot) close_slot.c();
      h5.className = "modal-title";
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (content_slot) content_slot.l(h5_nodes);
      if (close_slot) close_slot.l(div_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      append(div, h5);

      if (content_slot) {
        content_slot.m(h5, null);
      }

      append(div, t);

      if (!close_slot) {
        if (if_block) if_block.m(div, null);
      } else {
        close_slot.m(div, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (content_slot && content_slot.p && changed.$$scope) {
        content_slot.p(get_slot_changes(content_slot_1, ctx, changed, get_content_slot_changes), get_slot_context(content_slot_1, ctx, get_content_slot_context));
      }

      if (!close_slot) {
        if (typeof ctx.toggle === 'function') {
          if (if_block) {
            if_block.p(changed, ctx);
          } else {
            if_block = create_if_block$e(ctx);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      }

      if (close_slot && close_slot.p && changed.$$scope) {
        close_slot.p(get_slot_changes(close_slot_1, ctx, changed, get_close_slot_changes), get_slot_context(close_slot_1, ctx, get_close_slot_context));
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (content_slot && content_slot.i) content_slot.i(local);
      if (close_slot && close_slot.i) close_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (content_slot && content_slot.o) content_slot.o(local);
      if (close_slot && close_slot.o) close_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        detach(div);
      }

      if (content_slot) content_slot.d(detaching);

      if (!close_slot) {
        if (if_block) if_block.d();
      }

      if (close_slot) close_slot.d(detaching);
    }
  };
}

function instance$L($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$toggle = $$props.toggle,
      toggle = _$$props$toggle === void 0 ? undefined : _$$props$toggle,
      _$$props$closeAriaLab = $$props.closeAriaLabel,
      closeAriaLabel = _$$props$closeAriaLab === void 0 ? 'Close' : _$$props$closeAriaLab,
      _$$props$charCode = $$props.charCode,
      charCode = _$$props$charCode === void 0 ? 215 : _$$props$charCode;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('toggle' in $$props) $$invalidate('toggle', toggle = $$props.toggle);
    if ('closeAriaLabel' in $$props) $$invalidate('closeAriaLabel', closeAriaLabel = $$props.closeAriaLabel);
    if ('charCode' in $$props) $$invalidate('charCode', charCode = $$props.charCode);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var closeIcon, classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      charCode: 1,
      className: 1
    };

    if ($$dirty.charCode) {
      $$invalidate('closeIcon', closeIcon = typeof charCode === 'number' ? String.fromCharCode(charCode) : charCode);
    }

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'modal-header'));
    }
  };

  return {
    className: className,
    toggle: toggle,
    closeAriaLabel: closeAriaLabel,
    charCode: charCode,
    closeIcon: closeIcon,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ModalHeader =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ModalHeader, _SvelteComponent);

  function ModalHeader(options) {
    var _this;

    _classCallCheck(this, ModalHeader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModalHeader).call(this));
    init(_assertThisInitialized(_this), options, instance$L, create_fragment$L, safe_not_equal, ["class", "toggle", "closeAriaLabel", "charCode"]);
    return _this;
  }

  return ModalHeader;
}(SvelteComponent);

function create_fragment$M(ctx) {
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

function instance$M($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$M, create_fragment$M, safe_not_equal, ["class", "tabs", "pills", "vertical", "horizontal", "justified", "fill", "navbar", "card"]);
    return _this;
  }

  return Nav;
}(SvelteComponent);

function create_fragment$N(ctx) {
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

function instance$N($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$N, create_fragment$N, safe_not_equal, ["class", "light", "dark", "full", "fixed", "sticky", "color", "role", "expand"]);
    return _this;
  }

  return Navbar;
}(SvelteComponent);

function create_fragment$O(ctx) {
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

function instance$O($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$O, create_fragment$O, safe_not_equal, ["class", "active"]);
    return _this;
  }

  return NavItem;
}(SvelteComponent);

function create_fragment$P(ctx) {
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

function instance$P($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$href = $$props.href,
      href = _$$props$href === void 0 ? '#' : _$$props$href;

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
    init(_assertThisInitialized(_this), options, instance$P, create_fragment$P, safe_not_equal, ["class", "disabled", "active", "href"]);
    return _this;
  }

  return NavLink;
}(SvelteComponent);

function create_fragment$Q(ctx) {
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

function instance$Q($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$Q, create_fragment$Q, safe_not_equal, ["class", "href"]);
    return _this;
  }

  return NavbarBrand;
}(SvelteComponent);

function create_default_slot$3(ctx) {
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

function create_fragment$R(ctx) {
  var current;
  var button = new Button({
    props: {
      "class": ctx.classes,
      $$slots: {
        "default": [create_default_slot$3]
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

function instance$R($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$R, create_fragment$R, safe_not_equal, ["class", "type"]);
    return _this;
  }

  return NavbarToggler;
}(SvelteComponent);

function create_fragment$S(ctx) {
  var nav, ul, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      nav = element("nav");
      ul = element("ul");
      if (default_slot) default_slot.c();
      ul.className = ctx.listClasses;
      nav.className = ctx.classes;
      attr(nav, "aria-label", ctx.ariaLabel);
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(ul_nodes);
    },
    m: function m(target, anchor) {
      insert(target, nav, anchor);
      append(nav, ul);

      if (default_slot) {
        default_slot.m(ul, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.listClasses) {
        ul.className = ctx.listClasses;
      }

      if (!current || changed.classes) {
        nav.className = ctx.classes;
      }

      if (!current || changed.ariaLabel) {
        attr(nav, "aria-label", ctx.ariaLabel);
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

function instance$S($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$listClassNam = $$props.listClassName,
      listClassName = _$$props$listClassNam === void 0 ? '' : _$$props$listClassNam,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$ariaLabel = $$props.ariaLabel,
      ariaLabel = _$$props$ariaLabel === void 0 ? 'pagination' : _$$props$ariaLabel;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('listClassName' in $$props) $$invalidate('listClassName', listClassName = $$props.listClassName);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('ariaLabel' in $$props) $$invalidate('ariaLabel', ariaLabel = $$props.ariaLabel);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes, listClasses;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      listClassName: 1,
      size: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className));
    }

    if ($$dirty.listClassName || $$dirty.size) {
      $$invalidate('listClasses', listClasses = clsx(listClassName, 'pagination', _defineProperty({}, "pagination-".concat(size), !!size)));
    }
  };

  return {
    className: className,
    listClassName: listClassName,
    size: size,
    ariaLabel: ariaLabel,
    classes: classes,
    listClasses: listClasses,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Pagination =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Pagination, _SvelteComponent);

  function Pagination(options) {
    var _this;

    _classCallCheck(this, Pagination);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Pagination).call(this));
    init(_assertThisInitialized(_this), options, instance$S, create_fragment$S, safe_not_equal, ["class", "listClassName", "size", "ariaLabel"]);
    return _this;
  }

  return Pagination;
}(SvelteComponent);

function create_fragment$T(ctx) {
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

function instance$T($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      active: 1,
      disabled: 1
    };

    if ($$dirty.className || $$dirty.active || $$dirty.disabled) {
      $$invalidate('classes', classes = clsx(className, 'page-item', {
        active: active,
        disabled: disabled
      }));
    }
  };

  return {
    className: className,
    active: active,
    disabled: disabled,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var PaginationItem =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(PaginationItem, _SvelteComponent);

  function PaginationItem(options) {
    var _this;

    _classCallCheck(this, PaginationItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PaginationItem).call(this));
    init(_assertThisInitialized(_this), options, instance$T, create_fragment$T, safe_not_equal, ["class", "active", "disabled"]);
    return _this;
  }

  return PaginationItem;
}(SvelteComponent);

function create_else_block$b(ctx) {
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
} // (49:1) {#if previous || next || first || last}


function create_if_block$f(ctx) {
  var span0, t0, t1, span1, t2, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      span0 = element("span");

      if (!default_slot) {
        t0 = text(ctx.defaultCaret);
      }

      if (default_slot) default_slot.c();
      t1 = space();
      span1 = element("span");
      t2 = text(ctx.realLabel);
      attr(span0, "aria-hidden", "true");
      span1.className = "sr-only";
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(span0_nodes);
    },
    m: function m(target, anchor) {
      insert(target, span0, anchor);

      if (!default_slot) {
        append(span0, t0);
      } else {
        default_slot.m(span0, null);
      }

      insert(target, t1, anchor);
      insert(target, span1, anchor);
      append(span1, t2);
      current = true;
    },
    p: function p(changed, ctx) {
      if (!default_slot) {
        if (!current || changed.defaultCaret) {
          set_data(t0, ctx.defaultCaret);
        }
      }

      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.realLabel) {
        set_data(t2, ctx.realLabel);
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
        detach(span0);
      }

      if (default_slot) default_slot.d(detaching);

      if (detaching) {
        detach(t1);
        detach(span1);
      }
    }
  };
}

function create_fragment$U(ctx) {
  var a, current_block_type_index, if_block, current, dispose;
  var if_block_creators = [create_if_block$f, create_else_block$b];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.previous || ctx.next || ctx.first || ctx.last) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c: function c() {
      a = element("a");
      if_block.c();
      a.className = ctx.classes;
      a.href = ctx.href;
      dispose = listen(a, "click", ctx.click_handler);
    },
    m: function m(target, anchor) {
      insert(target, a, anchor);
      if_blocks[current_block_type_index].m(a, null);
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
        if_block.m(a, null);
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
      if (if_block) if_block.i();
      current = true;
    },
    o: function o(local) {
      if (if_block) if_block.o();
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        detach(a);
      }

      if_blocks[current_block_type_index].d();
      dispose();
    }
  };
}

function instance$U($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$next = $$props.next,
      next = _$$props$next === void 0 ? false : _$$props$next,
      _$$props$previous = $$props.previous,
      previous = _$$props$previous === void 0 ? false : _$$props$previous,
      _$$props$first = $$props.first,
      first = _$$props$first === void 0 ? false : _$$props$first,
      _$$props$last = $$props.last,
      last = _$$props$last === void 0 ? false : _$$props$last,
      _$$props$ariaLabel = $$props.ariaLabel,
      ariaLabel = _$$props$ariaLabel === void 0 ? '' : _$$props$ariaLabel,
      _$$props$href = $$props.href,
      href = _$$props$href === void 0 ? '' : _$$props$href;
  var defaultAriaLabel;
  var defaultCaret;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('next' in $$props) $$invalidate('next', next = $$props.next);
    if ('previous' in $$props) $$invalidate('previous', previous = $$props.previous);
    if ('first' in $$props) $$invalidate('first', first = $$props.first);
    if ('last' in $$props) $$invalidate('last', last = $$props.last);
    if ('ariaLabel' in $$props) $$invalidate('ariaLabel', ariaLabel = $$props.ariaLabel);
    if ('href' in $$props) $$invalidate('href', href = $$props.href);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes, realLabel;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      previous: 1,
      next: 1,
      first: 1,
      last: 1,
      ariaLabel: 1,
      defaultAriaLabel: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'page-link'));
    }

    if ($$dirty.previous || $$dirty.next || $$dirty.first || $$dirty.last) {
      if (previous) {
        $$invalidate('defaultAriaLabel', defaultAriaLabel = 'Previous');
      } else if (next) {
        $$invalidate('defaultAriaLabel', defaultAriaLabel = 'Next');
      } else if (first) {
        $$invalidate('defaultAriaLabel', defaultAriaLabel = 'First');
      } else if (last) {
        $$invalidate('defaultAriaLabel', defaultAriaLabel = 'Last');
      }
    }

    if ($$dirty.ariaLabel || $$dirty.defaultAriaLabel) {
      $$invalidate('realLabel', realLabel = ariaLabel || defaultAriaLabel);
    }

    if ($$dirty.previous || $$dirty.next || $$dirty.first || $$dirty.last) {
      if (previous) {
        $$invalidate('defaultCaret', defaultCaret = "\u2039");
      } else if (next) {
        $$invalidate('defaultCaret', defaultCaret = "\u203A");
      } else if (first) {
        $$invalidate('defaultCaret', defaultCaret = "\xAB");
      } else if (last) {
        $$invalidate('defaultCaret', defaultCaret = "\xBB");
      }
    }
  };

  return {
    className: className,
    next: next,
    previous: previous,
    first: first,
    last: last,
    ariaLabel: ariaLabel,
    href: href,
    defaultCaret: defaultCaret,
    classes: classes,
    realLabel: realLabel,
    click_handler: click_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var PaginationLink =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(PaginationLink, _SvelteComponent);

  function PaginationLink(options) {
    var _this;

    _classCallCheck(this, PaginationLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PaginationLink).call(this));
    init(_assertThisInitialized(_this), options, instance$U, create_fragment$U, safe_not_equal, ["class", "next", "previous", "first", "last", "ariaLabel", "href"]);
    return _this;
  }

  return PaginationLink;
}(SvelteComponent);

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;
/** `Object#toString` result references. */

var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */

var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */

var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */

var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */

var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */

var freeParseInt = parseInt;
/** Used for built-in method references. */

var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var objectToString = objectProto.toString;
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
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
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

function isObject$1(value) {
  var type = _typeof(value);

  return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */


function isObjectLike(value) {
  return !!value && _typeof(value) == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */


function isSymbol(value) {
  return _typeof(value) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */


function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  if (isObject$1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$1(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

var lodash_tonumber = toNumber;

function create_else_block_1(ctx) {
  var div, current_block_type_index, if_block, current;
  var if_block_creators = [create_if_block_2$5, create_else_block_2];
  var if_blocks = [];

  function select_block_type_2(ctx) {
    if (ctx.multi) return 0;
    return 1;
  }

  current_block_type_index = select_block_type_2(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c: function c() {
      div = element("div");
      if_block.c();
      div.className = ctx.classes;
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      current = true;
    },
    p: function p(changed, ctx) {
      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_2(ctx);

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
        if_block.m(div, null);
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
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
      if (detaching) {
        detach(div);
      }

      if_blocks[current_block_type_index].d();
    }
  };
} // (32:0) {#if bar}


function create_if_block$g(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block_1$8, create_else_block$c];
  var if_blocks = [];

  function select_block_type_1(ctx) {
    if (ctx.multi) return 0;
    return 1;
  }

  current_block_type_index = select_block_type_1(ctx);
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
      current_block_type_index = select_block_type_1(ctx);

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
} // (51:2) {:else}


function create_else_block_2(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.progressBarClasses;
      set_style(div, "width", "" + ctx.percent + "%");
      attr(div, "role", "progressbar");
      attr(div, "aria-valuenow", ctx.value);
      attr(div, "aria-valuemin", "0");
      attr(div, "aria-valuemax", ctx.max);
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

      if (!current || changed.progressBarClasses) {
        div.className = ctx.progressBarClasses;
      }

      if (!current || changed.percent) {
        set_style(div, "width", "" + ctx.percent + "%");
      }

      if (!current || changed.value) {
        attr(div, "aria-valuenow", ctx.value);
      }

      if (!current || changed.max) {
        attr(div, "aria-valuemax", ctx.max);
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
} // (49:2) {#if multi}


function create_if_block_2$5(ctx) {
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
} // (35:1) {:else}


function create_else_block$c(ctx) {
  var div, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.progressBarClasses;
      set_style(div, "width", "" + ctx.percent + "%");
      attr(div, "role", "progressbar");
      attr(div, "aria-valuenow", ctx.value);
      attr(div, "aria-valuemin", "0");
      attr(div, "aria-valuemax", ctx.max);
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

      if (!current || changed.progressBarClasses) {
        div.className = ctx.progressBarClasses;
      }

      if (!current || changed.percent) {
        set_style(div, "width", "" + ctx.percent + "%");
      }

      if (!current || changed.value) {
        attr(div, "aria-valuenow", ctx.value);
      }

      if (!current || changed.max) {
        attr(div, "aria-valuemax", ctx.max);
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
} // (33:1) {#if multi}


function create_if_block_1$8(ctx) {
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

function create_fragment$V(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$g, create_else_block_1];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.bar) return 0;
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

function instance$V($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$bar = $$props.bar,
      bar = _$$props$bar === void 0 ? false : _$$props$bar,
      _$$props$multi = $$props.multi,
      multi = _$$props$multi === void 0 ? false : _$$props$multi,
      _$$props$value = $$props.value,
      value = _$$props$value === void 0 ? 0 : _$$props$value,
      _$$props$max = $$props.max,
      max = _$$props$max === void 0 ? 100 : _$$props$max,
      _$$props$animated = $$props.animated,
      animated = _$$props$animated === void 0 ? false : _$$props$animated,
      _$$props$striped = $$props.striped,
      striped = _$$props$striped === void 0 ? false : _$$props$striped,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? '' : _$$props$color,
      _$$props$barClassName = $$props.barClassName,
      barClassName = _$$props$barClassName === void 0 ? '' : _$$props$barClassName;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('bar' in $$props) $$invalidate('bar', bar = $$props.bar);
    if ('multi' in $$props) $$invalidate('multi', multi = $$props.multi);
    if ('value' in $$props) $$invalidate('value', value = $$props.value);
    if ('max' in $$props) $$invalidate('max', max = $$props.max);
    if ('animated' in $$props) $$invalidate('animated', animated = $$props.animated);
    if ('striped' in $$props) $$invalidate('striped', striped = $$props.striped);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('barClassName' in $$props) $$invalidate('barClassName', barClassName = $$props.barClassName);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes, progressBarClasses, percent;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      bar: 1,
      barClassName: 1,
      animated: 1,
      color: 1,
      striped: 1,
      value: 1,
      max: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'progress'));
    }

    if ($$dirty.bar || $$dirty.className || $$dirty.barClassName || $$dirty.animated || $$dirty.color || $$dirty.striped) {
      $$invalidate('progressBarClasses', progressBarClasses = clsx('progress-bar', bar ? className || barClassName : barClassName, animated ? 'progress-bar-animated' : null, color ? "bg-".concat(color) : null, striped || animated ? 'progress-bar-striped' : null));
    }

    if ($$dirty.value || $$dirty.max) {
      $$invalidate('percent', percent = lodash_tonumber(value) / lodash_tonumber(max) * 100);
    }
  };

  return {
    className: className,
    bar: bar,
    multi: multi,
    value: value,
    max: max,
    animated: animated,
    striped: striped,
    color: color,
    barClassName: barClassName,
    classes: classes,
    progressBarClasses: progressBarClasses,
    percent: percent,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Progress =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Progress, _SvelteComponent);

  function Progress(options) {
    var _this;

    _classCallCheck(this, Progress);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Progress).call(this));
    init(_assertThisInitialized(_this), options, instance$V, create_fragment$V, safe_not_equal, ["class", "bar", "multi", "value", "max", "animated", "striped", "color", "barClassName"]);
    return _this;
  }

  return Progress;
}(SvelteComponent);

function create_fragment$W(ctx) {
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

function instance$W($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$W, create_fragment$W, safe_not_equal, ["class", "noGutters", "form", "id"]);
    return _this;
  }

  return Row;
}(SvelteComponent);

function create_fragment$X(ctx) {
  var div, span, t, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      span = element("span");

      if (!default_slot) {
        t = text("Loading...");
      }

      if (default_slot) default_slot.c();
      span.className = "sr-only";
      attr(div, "role", "status");
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(span_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      append(div, span);

      if (!default_slot) {
        append(span, t);
      } else {
        default_slot.m(span, null);
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

function instance$X($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$type = $$props.type,
      type = _$$props$type === void 0 ? 'border' : _$$props$type,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? '' : _$$props$color;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('type' in $$props) $$invalidate('type', type = $$props.type);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('color' in $$props) $$invalidate('color', color = $$props.color);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      size: 1,
      type: 1,
      color: 1
    };

    if ($$dirty.className || $$dirty.size || $$dirty.type || $$dirty.color) {
      $$invalidate('classes', classes = clsx(className, size ? "spinner-".concat(type, "-").concat(size) : false, "spinner-".concat(type), color ? "text-".concat(color) : false));
    }
  };

  return {
    className: className,
    type: type,
    size: size,
    color: color,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Spinner =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Spinner, _SvelteComponent);

  function Spinner(options) {
    var _this;

    _classCallCheck(this, Spinner);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Spinner).call(this));
    init(_assertThisInitialized(_this), options, instance$X, create_fragment$X, safe_not_equal, ["class", "type", "size", "color"]);
    return _this;
  }

  return Spinner;
}(SvelteComponent);

function create_else_block$d(ctx) {
  var table, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      table = element("table");
      if (default_slot) default_slot.c();
      table.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(table_nodes);
    },
    m: function m(target, anchor) {
      insert(target, table, anchor);

      if (default_slot) {
        default_slot.m(table, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        table.className = ctx.classes;
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
        detach(table);
      }

      if (default_slot) default_slot.d(detaching);
    }
  };
} // (29:0) {#if responsive}


function create_if_block$h(ctx) {
  var div, table, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      table = element("table");
      if (default_slot) default_slot.c();
      table.className = ctx.classes;
      div.className = ctx.responsiveClassName;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(table_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      append(div, table);

      if (default_slot) {
        default_slot.m(table, null);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.classes) {
        table.className = ctx.classes;
      }

      if (!current || changed.responsiveClassName) {
        div.className = ctx.responsiveClassName;
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

function create_fragment$Y(ctx) {
  var current_block_type_index, if_block, if_block_anchor, current;
  var if_block_creators = [create_if_block$h, create_else_block$d];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.responsive) return 0;
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

function instance$Y($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$bordered = $$props.bordered,
      bordered = _$$props$bordered === void 0 ? false : _$$props$bordered,
      _$$props$borderless = $$props.borderless,
      borderless = _$$props$borderless === void 0 ? false : _$$props$borderless,
      _$$props$striped = $$props.striped,
      striped = _$$props$striped === void 0 ? false : _$$props$striped,
      _$$props$dark = $$props.dark,
      dark = _$$props$dark === void 0 ? false : _$$props$dark,
      _$$props$hover = $$props.hover,
      hover = _$$props$hover === void 0 ? false : _$$props$hover,
      _$$props$responsive = $$props.responsive,
      responsive = _$$props$responsive === void 0 ? false : _$$props$responsive;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('bordered' in $$props) $$invalidate('bordered', bordered = $$props.bordered);
    if ('borderless' in $$props) $$invalidate('borderless', borderless = $$props.borderless);
    if ('striped' in $$props) $$invalidate('striped', striped = $$props.striped);
    if ('dark' in $$props) $$invalidate('dark', dark = $$props.dark);
    if ('hover' in $$props) $$invalidate('hover', hover = $$props.hover);
    if ('responsive' in $$props) $$invalidate('responsive', responsive = $$props.responsive);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes, responsiveClassName;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      size: 1,
      bordered: 1,
      borderless: 1,
      striped: 1,
      dark: 1,
      hover: 1,
      responsive: 1
    };

    if ($$dirty.className || $$dirty.size || $$dirty.bordered || $$dirty.borderless || $$dirty.striped || $$dirty.dark || $$dirty.hover) {
      $$invalidate('classes', classes = clsx(className, 'table', size ? 'table-' + size : false, bordered ? 'table-bordered' : false, borderless ? 'table-borderless' : false, striped ? 'table-striped' : false, dark ? 'table-dark' : false, hover ? 'table-hover' : false));
    }

    if ($$dirty.responsive) {
      $$invalidate('responsiveClassName', responsiveClassName = responsive === true ? 'table-responsive' : "table-responsive-".concat(responsive));
    }
  };

  return {
    className: className,
    size: size,
    bordered: bordered,
    borderless: borderless,
    striped: striped,
    dark: dark,
    hover: hover,
    responsive: responsive,
    classes: classes,
    responsiveClassName: responsiveClassName,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Table =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Table, _SvelteComponent);

  function Table(options) {
    var _this;

    _classCallCheck(this, Table);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Table).call(this));
    init(_assertThisInitialized(_this), options, instance$Y, create_fragment$Y, safe_not_equal, ["class", "size", "bordered", "borderless", "striped", "dark", "hover", "responsive"]);
    return _this;
  }

  return Table;
}(SvelteComponent);

var context$1 = writable({});

function create_fragment$Z(ctx) {
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

function instance$Z($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      activeTab = $$props.activeTab;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('activeTab' in $$props) $$invalidate('activeTab', activeTab = $$props.activeTab);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      activeTab: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx('tab-content', className));
    }

    if ($$dirty.activeTab) {
      context$1.update(function () {
        return {
          activeTabId: activeTab
        };
      });
    }
  };

  return {
    className: className,
    activeTab: activeTab,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var TabContent =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(TabContent, _SvelteComponent);

  function TabContent(options) {
    var _this;

    _classCallCheck(this, TabContent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TabContent).call(this));
    init(_assertThisInitialized(_this), options, instance$Z, create_fragment$Z, safe_not_equal, ["class", "activeTab"]);
    return _this;
  }

  return TabContent;
}(SvelteComponent);

function create_fragment$_(ctx) {
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

function instance$_($$self, $$props, $$invalidate) {
  var $context;
  subscribe($$self, context$1, function ($$value) {
    $context = $$value;
    $$invalidate('$context', $context);
  });
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      activeTab = $$props.activeTab,
      tabId = $$props.tabId;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('activeTab' in $$props) $$invalidate('activeTab', activeTab = $$props.activeTab);
    if ('tabId' in $$props) $$invalidate('tabId', tabId = $$props.tabId);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      tabId: 1,
      $context: 1
    };

    if ($$dirty.className || $$dirty.tabId || $$dirty.$context) {
      $$invalidate('classes', classes = clsx('tab-pane', className, {
        active: tabId === $context.activeTabId
      }));
    }
  };

  return {
    className: className,
    activeTab: activeTab,
    tabId: tabId,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var TabPane =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(TabPane, _SvelteComponent);

  function TabPane(options) {
    var _this;

    _classCallCheck(this, TabPane);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TabPane).call(this));
    init(_assertThisInitialized(_this), options, instance$_, create_fragment$_, safe_not_equal, ["class", "activeTab", "tabId"]);
    return _this;
  }

  return TabPane;
}(SvelteComponent);

function create_if_block$i(ctx) {
  var div, div_transition, current;
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);
  return {
    c: function c() {
      div = element("div");
      if (default_slot) default_slot.c();
      div.className = ctx.classes;
      attr(div, "role", "alert");
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
        if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
        div_transition.run(1);
      });
      current = true;
    },
    o: function o(local) {
      if (default_slot && default_slot.o) default_slot.o(local);
      if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
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
    }
  };
}

function create_fragment$$(ctx) {
  var if_block_anchor, current;
  var if_block = ctx.isOpen && create_if_block$i(ctx);
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
          if_block = create_if_block$i(ctx);
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

function instance$$($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$fade = $$props.fade,
      fade = _$$props$fade === void 0 ? true : _$$props$fade,
      _$$props$isOpen = $$props.isOpen,
      isOpen = _$$props$isOpen === void 0 ? true : _$$props$isOpen;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('fade' in $$props) $$invalidate('fade', fade = $$props.fade);
    if ('isOpen' in $$props) $$invalidate('isOpen', isOpen = $$props.isOpen);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      isOpen: 1
    };

    if ($$dirty.className || $$dirty.isOpen) {
      $$invalidate('classes', classes = clsx(className, 'toast', {
        show: isOpen
      }));
    }
  };

  return {
    className: className,
    fade: fade,
    isOpen: isOpen,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var Toast =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(Toast, _SvelteComponent);

  function Toast(options) {
    var _this;

    _classCallCheck(this, Toast);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Toast).call(this));
    init(_assertThisInitialized(_this), options, instance$$, create_fragment$$, safe_not_equal, ["class", "fade", "isOpen"]);
    return _this;
  }

  return Toast;
}(SvelteComponent);

function create_fragment$10(ctx) {
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

function instance$10($$self, $$props, $$invalidate) {
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
      $$invalidate('classes', classes = clsx(className, 'toast-body'));
    }
  };

  return {
    className: className,
    classes: classes,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ToastBody =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ToastBody, _SvelteComponent);

  function ToastBody(options) {
    var _this;

    _classCallCheck(this, ToastBody);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ToastBody).call(this));
    init(_assertThisInitialized(_this), options, instance$10, create_fragment$10, safe_not_equal, ["class"]);
    return _this;
  }

  return ToastBody;
}(SvelteComponent);

var get_icon_slot_changes = function get_icon_slot_changes(_ref) {
  _objectDestructuringEmpty(_ref);

  return {};
};

var get_icon_slot_context = function get_icon_slot_context(_ref2) {
  _objectDestructuringEmpty(_ref2);

  return {};
}; // (38:1) {:else}


function create_else_block$e(ctx) {
  var current;
  var icon_slot_1 = ctx.$$slots.icon;
  var icon_slot = create_slot(icon_slot_1, ctx, get_icon_slot_context);
  return {
    c: function c() {
      if (icon_slot) icon_slot.c();
    },
    l: function l(nodes) {
      if (icon_slot) icon_slot.l(nodes);
    },
    m: function m(target, anchor) {
      if (icon_slot) {
        icon_slot.m(target, anchor);
      }

      current = true;
    },
    p: function p(changed, ctx) {
      if (icon_slot && icon_slot.p && changed.$$scope) {
        icon_slot.p(get_slot_changes(icon_slot_1, ctx, changed, get_icon_slot_changes), get_slot_context(icon_slot_1, ctx, get_icon_slot_context));
      }
    },
    i: function i(local) {
      if (current) return;
      if (icon_slot && icon_slot.i) icon_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (icon_slot && icon_slot.o) icon_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (icon_slot) icon_slot.d(detaching);
    }
  };
} // (26:1) {#if icon}


function create_if_block_2$6(ctx) {
  var svg, rect, svg_class_value;
  return {
    c: function c() {
      svg = svg_element("svg");
      rect = svg_element("rect");
      attr(rect, "fill", "currentColor");
      attr(rect, "width", "100%");
      attr(rect, "height", "100%");
      attr(svg, "class", svg_class_value = "rounded text-".concat(ctx.icon));
      attr(svg, "width", "20");
      attr(svg, "height", "20");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "preserveAspectRatio", "xMidYMid slice");
      attr(svg, "focusable", "false");
      attr(svg, "role", "img");
    },
    m: function m(target, anchor) {
      insert(target, svg, anchor);
      append(svg, rect);
    },
    p: function p(changed, ctx) {
      if (changed.icon && svg_class_value !== (svg_class_value = "rounded text-".concat(ctx.icon))) {
        attr(svg, "class", svg_class_value);
      }
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) {
        detach(svg);
      }
    }
  };
} // (46:18) 


function create_if_block_1$9(ctx) {
  var button, span, t, dispose;
  return {
    c: function c() {
      button = element("button");
      span = element("span");
      t = text(ctx.closeIcon);
      attr(span, "aria-hidden", "true");
      button.type = "button";
      button.className = "close";
      attr(button, "aria-label", ctx.closeAriaLabel);
      dispose = listen(button, "click", ctx.toggle);
    },
    m: function m(target, anchor) {
      insert(target, button, anchor);
      append(button, span);
      append(span, t);
    },
    p: function p(changed, ctx) {
      if (changed.closeIcon) {
        set_data(t, ctx.closeIcon);
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
} // (44:1) {#if close}


function create_if_block$j(ctx) {
  var t;
  return {
    c: function c() {
      t = text(ctx.close);
    },
    m: function m(target, anchor) {
      insert(target, t, anchor);
    },
    p: function p(changed, ctx) {
      if (changed.close) {
        set_data(t, ctx.close);
      }
    },
    d: function d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}

function create_fragment$11(ctx) {
  var div, current_block_type_index, if_block0, t0, strong, t1, current;
  var if_block_creators = [create_if_block_2$6, create_else_block$e];
  var if_blocks = [];

  function select_block_type(ctx) {
    if (ctx.icon) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  var default_slot_1 = ctx.$$slots["default"];
  var default_slot = create_slot(default_slot_1, ctx, null);

  function select_block_type_1(ctx) {
    if (ctx.close) return create_if_block$j;
    if (ctx.toggle) return create_if_block_1$9;
  }

  var current_block_type = select_block_type_1(ctx);
  var if_block1 = current_block_type && current_block_type(ctx);
  return {
    c: function c() {
      div = element("div");
      if_block0.c();
      t0 = space();
      strong = element("strong");
      if (default_slot) default_slot.c();
      t1 = space();
      if (if_block1) if_block1.c();
      strong.className = ctx.tagClassName;
      div.className = ctx.classes;
    },
    l: function l(nodes) {
      if (default_slot) default_slot.l(strong_nodes);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      append(div, t0);
      append(div, strong);

      if (default_slot) {
        default_slot.m(strong, null);
      }

      append(div, t1);
      if (if_block1) if_block1.m(div, null);
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
        if_block0.o(1);
        check_outros();
        if_block0 = if_blocks[current_block_type_index];

        if (!if_block0) {
          if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block0.c();
        }

        if_block0.i(1);
        if_block0.m(div, t0);
      }

      if (default_slot && default_slot.p && changed.$$scope) {
        default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
      }

      if (!current || changed.tagClassName) {
        strong.className = ctx.tagClassName;
      }

      if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
        if_block1.p(changed, ctx);
      } else {
        if (if_block1) if_block1.d(1);
        if_block1 = current_block_type && current_block_type(ctx);

        if (if_block1) {
          if_block1.c();
          if_block1.m(div, null);
        }
      }

      if (!current || changed.classes) {
        div.className = ctx.classes;
      }
    },
    i: function i(local) {
      if (current) return;
      if (if_block0) if_block0.i();
      if (default_slot && default_slot.i) default_slot.i(local);
      current = true;
    },
    o: function o(local) {
      if (if_block0) if_block0.o();
      if (default_slot && default_slot.o) default_slot.o(local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) {
        detach(div);
      }

      if_blocks[current_block_type_index].d();
      if (default_slot) default_slot.d(detaching);
      if (if_block1) if_block1.d();
    }
  };
}

function instance$11($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$icon = $$props.icon,
      icon = _$$props$icon === void 0 ? null : _$$props$icon,
      _$$props$toggle = $$props.toggle,
      toggle = _$$props$toggle === void 0 ? null : _$$props$toggle,
      _$$props$closeAriaLab = $$props.closeAriaLabel,
      closeAriaLabel = _$$props$closeAriaLab === void 0 ? 'Close' : _$$props$closeAriaLab,
      _$$props$charCode = $$props.charCode,
      charCode = _$$props$charCode === void 0 ? 215 : _$$props$charCode,
      _$$props$close = $$props.close,
      close = _$$props$close === void 0 ? null : _$$props$close;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('icon' in $$props) $$invalidate('icon', icon = $$props.icon);
    if ('toggle' in $$props) $$invalidate('toggle', toggle = $$props.toggle);
    if ('closeAriaLabel' in $$props) $$invalidate('closeAriaLabel', closeAriaLabel = $$props.closeAriaLabel);
    if ('charCode' in $$props) $$invalidate('charCode', charCode = $$props.charCode);
    if ('close' in $$props) $$invalidate('close', close = $$props.close);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  var classes, tagClassName, closeIcon;

  $$self.$$.update = function () {
    var $$dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      className: 1,
      icon: 1,
      charCode: 1
    };

    if ($$dirty.className) {
      $$invalidate('classes', classes = clsx(className, 'toast-header'));
    }

    if ($$dirty.icon) {
      $$invalidate('tagClassName', tagClassName = clsx('mr-auto', {
        "ml-2": icon != null
      }));
    }

    if ($$dirty.charCode) {
      $$invalidate('closeIcon', closeIcon = typeof charCode === 'number' ? String.fromCharCode(charCode) : charCode);
    }
  };

  return {
    className: className,
    icon: icon,
    toggle: toggle,
    closeAriaLabel: closeAriaLabel,
    charCode: charCode,
    close: close,
    classes: classes,
    tagClassName: tagClassName,
    closeIcon: closeIcon,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var ToastHeader =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(ToastHeader, _SvelteComponent);

  function ToastHeader(options) {
    var _this;

    _classCallCheck(this, ToastHeader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ToastHeader).call(this));
    init(_assertThisInitialized(_this), options, instance$11, create_fragment$11, safe_not_equal, ["class", "icon", "toggle", "closeAriaLabel", "charCode", "close"]);
    return _this;
  }

  return ToastHeader;
}(SvelteComponent);

function create_default_slot$4(ctx) {
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

function create_fragment$12(ctx) {
  var current;
  var alert_spread_levels = [{
    isOpen: ctx.isOpen
  }, {
    toggle: ctx.func
  }, ctx.$$props];
  var alert_props = {
    $$slots: {
      "default": [create_default_slot$4]
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

function instance$12($$self, $$props, $$invalidate) {
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
    init(_assertThisInitialized(_this), options, instance$12, create_fragment$12, safe_not_equal, []);
    return _this;
  }

  return UncontrolledAlert;
}(SvelteComponent);

function create_default_slot$5(ctx) {
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

function create_fragment$13(ctx) {
  var current;
  var buttondropdown = new ButtonDropdown({
    props: {
      isOpen: ctx.isOpen,
      toggle: ctx.func,
      "class": ctx.className,
      disabled: ctx.disabled,
      group: ctx.group,
      nav: ctx.nav,
      active: ctx.active,
      addonType: ctx.addonType,
      size: ctx.size,
      inNavbar: ctx.inNavbar,
      setActiveFromChild: ctx.setActiveFromChild,
      dropup: ctx.dropup,
      $$slots: {
        "default": [create_default_slot$5]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      buttondropdown.$$.fragment.c();
    },
    m: function m(target, anchor) {
      mount_component(buttondropdown, target, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var buttondropdown_changes = {};
      if (changed.isOpen) buttondropdown_changes.isOpen = ctx.isOpen;
      if (changed.className) buttondropdown_changes["class"] = ctx.className;
      if (changed.disabled) buttondropdown_changes.disabled = ctx.disabled;
      if (changed.group) buttondropdown_changes.group = ctx.group;
      if (changed.nav) buttondropdown_changes.nav = ctx.nav;
      if (changed.active) buttondropdown_changes.active = ctx.active;
      if (changed.addonType) buttondropdown_changes.addonType = ctx.addonType;
      if (changed.size) buttondropdown_changes.size = ctx.size;
      if (changed.inNavbar) buttondropdown_changes.inNavbar = ctx.inNavbar;
      if (changed.setActiveFromChild) buttondropdown_changes.setActiveFromChild = ctx.setActiveFromChild;
      if (changed.dropup) buttondropdown_changes.dropup = ctx.dropup;
      if (changed.$$scope) buttondropdown_changes.$$scope = {
        changed: changed,
        ctx: ctx
      };
      buttondropdown.$set(buttondropdown_changes);
    },
    i: function i(local) {
      if (current) return;
      buttondropdown.$$.fragment.i(local);
      current = true;
    },
    o: function o(local) {
      buttondropdown.$$.fragment.o(local);
      current = false;
    },
    d: function d(detaching) {
      buttondropdown.$destroy(detaching);
    }
  };
}

function instance$13($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$direction = $$props.direction,
      direction = _$$props$direction === void 0 ? 'down' : _$$props$direction,
      _$$props$group = $$props.group,
      group = _$$props$group === void 0 ? false : _$$props$group,
      _$$props$nav = $$props.nav,
      nav = _$$props$nav === void 0 ? false : _$$props$nav,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$addonType = $$props.addonType,
      addonType = _$$props$addonType === void 0 ? false : _$$props$addonType,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$toggle = $$props.toggle,
      toggle = _$$props$toggle === void 0 ? undefined : _$$props$toggle,
      _$$props$inNavbar = $$props.inNavbar,
      inNavbar = _$$props$inNavbar === void 0 ? false : _$$props$inNavbar,
      _$$props$setActiveFro = $$props.setActiveFromChild,
      setActiveFromChild = _$$props$setActiveFro === void 0 ? false : _$$props$setActiveFro,
      _$$props$dropup = $$props.dropup,
      dropup = _$$props$dropup === void 0 ? false : _$$props$dropup,
      _$$props$defaultOpen = $$props.defaultOpen,
      defaultOpen = _$$props$defaultOpen === void 0 ? false : _$$props$defaultOpen;
  var isOpen = defaultOpen;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function func() {
    var $$result = isOpen = !isOpen;
    $$invalidate('isOpen', isOpen);
    return $$result;
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('direction' in $$props) $$invalidate('direction', direction = $$props.direction);
    if ('group' in $$props) $$invalidate('group', group = $$props.group);
    if ('nav' in $$props) $$invalidate('nav', nav = $$props.nav);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('addonType' in $$props) $$invalidate('addonType', addonType = $$props.addonType);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('toggle' in $$props) $$invalidate('toggle', toggle = $$props.toggle);
    if ('inNavbar' in $$props) $$invalidate('inNavbar', inNavbar = $$props.inNavbar);
    if ('setActiveFromChild' in $$props) $$invalidate('setActiveFromChild', setActiveFromChild = $$props.setActiveFromChild);
    if ('dropup' in $$props) $$invalidate('dropup', dropup = $$props.dropup);
    if ('defaultOpen' in $$props) $$invalidate('defaultOpen', defaultOpen = $$props.defaultOpen);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  return {
    className: className,
    disabled: disabled,
    direction: direction,
    group: group,
    nav: nav,
    active: active,
    addonType: addonType,
    size: size,
    toggle: toggle,
    inNavbar: inNavbar,
    setActiveFromChild: setActiveFromChild,
    dropup: dropup,
    defaultOpen: defaultOpen,
    isOpen: isOpen,
    func: func,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var UncontrolledButtonDropdown =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(UncontrolledButtonDropdown, _SvelteComponent);

  function UncontrolledButtonDropdown(options) {
    var _this;

    _classCallCheck(this, UncontrolledButtonDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UncontrolledButtonDropdown).call(this));
    init(_assertThisInitialized(_this), options, instance$13, create_fragment$13, safe_not_equal, ["class", "disabled", "direction", "group", "nav", "active", "addonType", "size", "toggle", "inNavbar", "setActiveFromChild", "dropup", "defaultOpen"]);
    return _this;
  }

  return UncontrolledButtonDropdown;
}(SvelteComponent);

function create_default_slot$6(ctx) {
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

function create_fragment$14(ctx) {
  var current;
  var collapse = new Collapse({
    props: {
      isOpen: ctx.isOpen,
      "class": ctx.className,
      $$slots: {
        "default": [create_default_slot$6]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  collapse.$on("introstart", ctx.introstart_handler);
  collapse.$on("introend", ctx.introend_handler);
  collapse.$on("outrostart", ctx.outrostart_handler);
  collapse.$on("outroend", ctx.outroend_handler);
  collapse.$on("introstart", ctx.onEntering);
  collapse.$on("introend", ctx.onEntered);
  collapse.$on("outrostart", ctx.onExiting);
  collapse.$on("outroend", ctx.onExited);
  return {
    c: function c() {
      collapse.$$.fragment.c();
    },
    m: function m(target, anchor) {
      mount_component(collapse, target, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var collapse_changes = {};
      if (changed.isOpen) collapse_changes.isOpen = ctx.isOpen;
      if (changed.className) collapse_changes["class"] = ctx.className;
      if (changed.$$scope) collapse_changes.$$scope = {
        changed: changed,
        ctx: ctx
      };
      collapse.$set(collapse_changes);
    },
    i: function i(local) {
      if (current) return;
      collapse.$$.fragment.i(local);
      current = true;
    },
    o: function o(local) {
      collapse.$$.fragment.o(local);
      current = false;
    },
    d: function d(detaching) {
      collapse.$destroy(detaching);
    }
  };
}

function instance$14($$self, $$props, $$invalidate) {
  var noop = function noop() {
    return undefined;
  };

  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$navbar = $$props.navbar,
      navbar = _$$props$navbar === void 0 ? false : _$$props$navbar,
      _$$props$defaultOpen = $$props.defaultOpen,
      defaultOpen = _$$props$defaultOpen === void 0 ? false : _$$props$defaultOpen,
      toggler = $$props.toggler,
      _$$props$onEntering = $$props.onEntering,
      onEntering = _$$props$onEntering === void 0 ? noop : _$$props$onEntering,
      _$$props$onEntered = $$props.onEntered,
      onEntered = _$$props$onEntered === void 0 ? noop : _$$props$onEntered,
      _$$props$onExiting = $$props.onExiting,
      onExiting = _$$props$onExiting === void 0 ? noop : _$$props$onExiting,
      _$$props$onExited = $$props.onExited,
      onExited = _$$props$onExited === void 0 ? noop : _$$props$onExited;
  var unbindEvents;
  var isOpen = defaultOpen;

  function togglerFn() {
    $$invalidate('isOpen', isOpen = !isOpen);
  }

  var defaultToggleEvents = ['touchstart', 'click'];
  onMount(function () {
    if (typeof toggler === 'string' && typeof window !== 'undefined' && window.document && window.document.createElement) {
      var selection = document.querySelectorAll(toggler);

      if (!selection.length) {
        selection = document.querySelectorAll("#".concat(toggler));
      }

      if (!selection.length) {
        throw new Error("The target '".concat(toggler, "' could not be identified in the dom, tip: check spelling"));
      }

      defaultToggleEvents.forEach(function (event) {
        selection.forEach(function (element) {
          element.addEventListener(event, togglerFn);
        });
      });

      unbindEvents = function unbindEvents() {
        defaultToggleEvents.forEach(function (event) {
          selection.forEach(function (element) {
            element.removeEventListener(event, togglerFn);
          });
        });
      };
    }
  });
  onDestroy(function () {
    if (typeof unbindEvents === 'function') {
      unbindEvents();
      unbindEvents = undefined;
    }
  });
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

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('navbar' in $$props) $$invalidate('navbar', navbar = $$props.navbar);
    if ('defaultOpen' in $$props) $$invalidate('defaultOpen', defaultOpen = $$props.defaultOpen);
    if ('toggler' in $$props) $$invalidate('toggler', toggler = $$props.toggler);
    if ('onEntering' in $$props) $$invalidate('onEntering', onEntering = $$props.onEntering);
    if ('onEntered' in $$props) $$invalidate('onEntered', onEntered = $$props.onEntered);
    if ('onExiting' in $$props) $$invalidate('onExiting', onExiting = $$props.onExiting);
    if ('onExited' in $$props) $$invalidate('onExited', onExited = $$props.onExited);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  return {
    className: className,
    navbar: navbar,
    defaultOpen: defaultOpen,
    toggler: toggler,
    onEntering: onEntering,
    onEntered: onEntered,
    onExiting: onExiting,
    onExited: onExited,
    isOpen: isOpen,
    introstart_handler: introstart_handler,
    introend_handler: introend_handler,
    outrostart_handler: outrostart_handler,
    outroend_handler: outroend_handler,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var UncontrolledCollapse =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(UncontrolledCollapse, _SvelteComponent);

  function UncontrolledCollapse(options) {
    var _this;

    _classCallCheck(this, UncontrolledCollapse);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UncontrolledCollapse).call(this));
    init(_assertThisInitialized(_this), options, instance$14, create_fragment$14, safe_not_equal, ["class", "navbar", "defaultOpen", "toggler", "onEntering", "onEntered", "onExiting", "onExited"]);
    return _this;
  }

  return UncontrolledCollapse;
}(SvelteComponent);

function create_default_slot$7(ctx) {
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

function create_fragment$15(ctx) {
  var current;
  var dropdown = new Dropdown({
    props: {
      isOpen: ctx.isOpen,
      toggle: ctx.func,
      "class": ctx.className,
      disabled: ctx.disabled,
      direction: ctx.direction,
      group: ctx.group,
      nav: ctx.nav,
      active: ctx.active,
      addonType: ctx.addonType,
      size: ctx.size,
      inNavbar: ctx.inNavbar,
      setActiveFromChild: ctx.setActiveFromChild,
      dropup: ctx.dropup,
      $$slots: {
        "default": [create_default_slot$7]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      dropdown.$$.fragment.c();
    },
    m: function m(target, anchor) {
      mount_component(dropdown, target, anchor);
      current = true;
    },
    p: function p(changed, ctx) {
      var dropdown_changes = {};
      if (changed.isOpen) dropdown_changes.isOpen = ctx.isOpen;
      if (changed.className) dropdown_changes["class"] = ctx.className;
      if (changed.disabled) dropdown_changes.disabled = ctx.disabled;
      if (changed.direction) dropdown_changes.direction = ctx.direction;
      if (changed.group) dropdown_changes.group = ctx.group;
      if (changed.nav) dropdown_changes.nav = ctx.nav;
      if (changed.active) dropdown_changes.active = ctx.active;
      if (changed.addonType) dropdown_changes.addonType = ctx.addonType;
      if (changed.size) dropdown_changes.size = ctx.size;
      if (changed.inNavbar) dropdown_changes.inNavbar = ctx.inNavbar;
      if (changed.setActiveFromChild) dropdown_changes.setActiveFromChild = ctx.setActiveFromChild;
      if (changed.dropup) dropdown_changes.dropup = ctx.dropup;
      if (changed.$$scope) dropdown_changes.$$scope = {
        changed: changed,
        ctx: ctx
      };
      dropdown.$set(dropdown_changes);
    },
    i: function i(local) {
      if (current) return;
      dropdown.$$.fragment.i(local);
      current = true;
    },
    o: function o(local) {
      dropdown.$$.fragment.o(local);
      current = false;
    },
    d: function d(detaching) {
      dropdown.$destroy(detaching);
    }
  };
}

function instance$15($$self, $$props, $$invalidate) {
  var _$$props$class = $$props["class"],
      className = _$$props$class === void 0 ? '' : _$$props$class,
      _$$props$disabled = $$props.disabled,
      disabled = _$$props$disabled === void 0 ? false : _$$props$disabled,
      _$$props$direction = $$props.direction,
      direction = _$$props$direction === void 0 ? 'down' : _$$props$direction,
      _$$props$group = $$props.group,
      group = _$$props$group === void 0 ? false : _$$props$group,
      _$$props$nav = $$props.nav,
      nav = _$$props$nav === void 0 ? false : _$$props$nav,
      _$$props$active = $$props.active,
      active = _$$props$active === void 0 ? false : _$$props$active,
      _$$props$addonType = $$props.addonType,
      addonType = _$$props$addonType === void 0 ? false : _$$props$addonType,
      _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size,
      _$$props$toggle = $$props.toggle,
      toggle = _$$props$toggle === void 0 ? undefined : _$$props$toggle,
      _$$props$inNavbar = $$props.inNavbar,
      inNavbar = _$$props$inNavbar === void 0 ? false : _$$props$inNavbar,
      _$$props$setActiveFro = $$props.setActiveFromChild,
      setActiveFromChild = _$$props$setActiveFro === void 0 ? false : _$$props$setActiveFro,
      _$$props$dropup = $$props.dropup,
      dropup = _$$props$dropup === void 0 ? false : _$$props$dropup,
      _$$props$defaultOpen = $$props.defaultOpen,
      defaultOpen = _$$props$defaultOpen === void 0 ? false : _$$props$defaultOpen;
  var isOpen = defaultOpen;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function func() {
    var $$result = isOpen = !isOpen;
    $$invalidate('isOpen', isOpen);
    return $$result;
  }

  $$self.$set = function ($$props) {
    if ('class' in $$props) $$invalidate('className', className = $$props["class"]);
    if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
    if ('direction' in $$props) $$invalidate('direction', direction = $$props.direction);
    if ('group' in $$props) $$invalidate('group', group = $$props.group);
    if ('nav' in $$props) $$invalidate('nav', nav = $$props.nav);
    if ('active' in $$props) $$invalidate('active', active = $$props.active);
    if ('addonType' in $$props) $$invalidate('addonType', addonType = $$props.addonType);
    if ('size' in $$props) $$invalidate('size', size = $$props.size);
    if ('toggle' in $$props) $$invalidate('toggle', toggle = $$props.toggle);
    if ('inNavbar' in $$props) $$invalidate('inNavbar', inNavbar = $$props.inNavbar);
    if ('setActiveFromChild' in $$props) $$invalidate('setActiveFromChild', setActiveFromChild = $$props.setActiveFromChild);
    if ('dropup' in $$props) $$invalidate('dropup', dropup = $$props.dropup);
    if ('defaultOpen' in $$props) $$invalidate('defaultOpen', defaultOpen = $$props.defaultOpen);
    if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
  };

  return {
    className: className,
    disabled: disabled,
    direction: direction,
    group: group,
    nav: nav,
    active: active,
    addonType: addonType,
    size: size,
    toggle: toggle,
    inNavbar: inNavbar,
    setActiveFromChild: setActiveFromChild,
    dropup: dropup,
    defaultOpen: defaultOpen,
    isOpen: isOpen,
    func: func,
    $$slots: $$slots,
    $$scope: $$scope
  };
}

var UncontrolledDropdown =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(UncontrolledDropdown, _SvelteComponent);

  function UncontrolledDropdown(options) {
    var _this;

    _classCallCheck(this, UncontrolledDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UncontrolledDropdown).call(this));
    init(_assertThisInitialized(_this), options, instance$15, create_fragment$15, safe_not_equal, ["class", "disabled", "direction", "group", "nav", "active", "addonType", "size", "toggle", "inNavbar", "setActiveFromChild", "dropup", "defaultOpen"]);
    return _this;
  }

  return UncontrolledDropdown;
}(SvelteComponent);

export { Alert, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonDropdown, ButtonGroup, ButtonToolbar, Card, CardBody, CardColumns, CardDeck, CardFooter, CardGroup, CardHeader, CardImg, CardImgOverlay, CardLink, CardSubtitle, CardText, CardTitle, Col, Collapse, Container, CustomInput, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormFeedback, FormGroup, FormText, Input, InputGroup, InputGroupAddon, InputGroupButtonDropdown, InputGroupText, Jumbotron, Label, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Media, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, Navbar, NavbarBrand, NavbarToggler, Pagination, PaginationItem, PaginationLink, Progress, Row, Spinner, TabContent, TabPane, Table, Toast, ToastBody, ToastHeader, UncontrolledAlert, UncontrolledButtonDropdown, UncontrolledCollapse, UncontrolledDropdown };
//# sourceMappingURL=sveltestrap.es.js.map
