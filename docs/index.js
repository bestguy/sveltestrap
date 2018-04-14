var Docs = (function () {
'use strict';

function noop() {}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function reinsertBetween(before, after, target) {
	while (before.nextSibling && before.nextSibling !== after) {
		target.appendChild(before.parentNode.removeChild(before.nextSibling));
	}
}

function reinsertChildren(parent, target) {
	while (parent.firstChild) target.appendChild(parent.firstChild);
}

function reinsertAfter(before, target) {
	while (before.nextSibling) target.appendChild(before.nextSibling);
}

function destroyEach(iterations) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d();
	}
}

function createFragment() {
	return document.createDocumentFragment();
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function createComment() {
	return document.createComment('');
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function setAttributes(node, attributes) {
	for (var key in attributes) {
		if (key in node) {
			node[key] = attributes[key];
		} else {
			if (attributes[key] === undefined) removeAttribute(node, key);
			else setAttribute(node, key, attributes[key]);
		}
	}
}

function removeAttribute(node, attribute) {
	node.removeAttribute(attribute);
}

function setStyle(node, key, value) {
	node.style.setProperty(key, value);
}

function destroyBlock(block, lookup) {
	block.u();
	block.d();
	lookup[block.key] = null;
}

function outroAndDestroyBlock(block, lookup) {
	block.o(function() {
		destroyBlock(block, lookup);
	});
}

function getSpreadUpdate(levels, updates) {
	var update = {};

	var to_null_out = {};
	var accounted_for = {};

	var i = levels.length;
	while (i--) {
		var o = levels[i];
		var n = updates[i];

		if (n) {
			for (var key in o) {
				if (!(key in n)) to_null_out[key] = 1;
			}

			for (var key in n) {
				if (!accounted_for[key]) {
					update[key] = n[key];
					accounted_for[key] = 1;
				}
			}

			levels[i] = n;
		} else {
			for (var key in o) {
				accounted_for[key] = 1;
			}
		}
	}

	for (var key in to_null_out) {
		if (!(key in update)) update[key] = undefined;
	}

	return update;
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, changed, newState, oldState) {
	for (var key in group) {
		if (!changed[key]) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		var callbacks = group[key];
		if (!callbacks) continue;

		for (var i = 0; i < callbacks.length; i += 1) {
			var callback = callbacks[i];
			if (callback.__calling) continue;

			callback.__calling = true;
			callback.call(component, newValue, oldValue);
			callback.__calling = false;
		}
	}
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function init(component, options) {
	component._observers = { pre: blankObject(), post: blankObject() };
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		dispatchObservers(this, this._observers.pre, changed, this._state, oldState);
		this._fragment.p(changed, this._state);
		dispatchObservers(this, this._observers.post, changed, this._state, oldState);
	}
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

var proto = {
	destroy: destroy,
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	teardown: destroy,
	_recompute: noop,
	_set: _set,
	_mount: _mount,
	_unmount: _unmount,
	_differs: _differs
};

/* src/Close.html generated by Svelte v1.60.3 */
function create_main_fragment$2(component, state) {
	var button;

	function click_handler(event) {
		component.fire('click');
	}

	return {
		c: function create() {
			button = createElement("button");
			button.innerHTML = "<span aria-hidden=\"true\">×</span>";
			this.h();
		},

		h: function hydrate() {
			addListener(button, "click", click_handler);
			button.type = "button";
			button.className = "close";
			setAttribute(button, "aria-label", "Close");
		},

		m: function mount(target, anchor) {
			insertNode(button, target, anchor);
		},

		p: noop,

		u: function unmount() {
			detachNode(button);
		},

		d: function destroy$$1() {
			removeListener(button, "click", click_handler);
		}
	};
}

function Close(options) {
	init(this, options);
	this._state = assign({}, options.data);

	this._fragment = create_main_fragment$2(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Close.prototype, proto);

/* src/Alert.html generated by Svelte v1.60.3 */
// TODO handle fade transition when dismissing

function data$1() {
  return {
    class: '',
    color: 'success',
    isOpen: true,
    dismissible: false
  };
}

function create_main_fragment$1(component, state) {
	var if_block_anchor;

	var if_block = (state.isOpen) && create_if_block$1(component, state);

	return {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = createComment();
		},

		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insertNode(if_block_anchor, target, anchor);
		},

		p: function update(changed, state) {
			if (state.isOpen) {
				if (if_block) {
					if_block.p(changed, state);
				} else {
					if_block = create_if_block$1(component, state);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.u();
				if_block.d();
				if_block = null;
			}
		},

		u: function unmount() {
			if (if_block) if_block.u();
			detachNode(if_block_anchor);
		},

		d: function destroy$$1() {
			if (if_block) if_block.d();
		}
	};
}

// (3:4) {{#if dismissible}}
function create_if_block_1$1(component, state) {

	var close = new Close({
		root: component.root
	});

	close.on("click", function(event) {
		component.set({ isOpen: false });
	});

	return {
		c: function create() {
			close._fragment.c();
		},

		m: function mount(target, anchor) {
			close._mount(target, anchor);
		},

		u: function unmount() {
			close._unmount();
		},

		d: function destroy$$1() {
			close.destroy(false);
		}
	};
}

// (1:0) {{#if isOpen}}
function create_if_block$1(component, state) {
	var div, text, slot_content_default = component._slotted.default, slot_content_default_before, div_class_value;

	var if_block = (state.dismissible) && create_if_block_1$1(component, state);

	return {
		c: function create() {
			div = createElement("div");
			if (if_block) if_block.c();
			text = createText("\n    ");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "alert alert-" + state.color + (state.dismissible ? ' alert-dismissible' : '') + " " + state.class;
			setAttribute(div, "role", "alert");
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			if (if_block) if_block.m(div, null);
			appendNode(text, div);

			if (slot_content_default) {
				appendNode(slot_content_default_before || (slot_content_default_before = createComment()), div);
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if (state.dismissible) {
				if (!if_block) {
					if_block = create_if_block_1$1(component, state);
					if_block.c();
					if_block.m(div, text);
				}
			} else if (if_block) {
				if_block.u();
				if_block.d();
				if_block = null;
			}

			if ((changed.color || changed.dismissible || changed.class) && div_class_value !== (div_class_value = "alert alert-" + state.color + (state.dismissible ? ' alert-dismissible' : '') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);
			if (if_block) if_block.u();

			if (slot_content_default) {
				reinsertAfter(slot_content_default_before, slot_content_default);
			}
		},

		d: function destroy$$1() {
			if (if_block) if_block.d();
		}
	};
}

function Alert(options) {
	init(this, options);
	this._state = assign(data$1(), options.data);

	this._slotted = options.slots || {};

	if (!options.root) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this.slots = {};

	this._fragment = create_main_fragment$1(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign(Alert.prototype, proto);

/* src/Badge.html generated by Svelte v1.60.3 */
function data$2() {
  return {
    class: '',
    color: 'default',
    pill: false
  };
}

function create_main_fragment$3(component, state) {
	var span, slot_content_default = component._slotted.default, span_class_value;

	return {
		c: function create() {
			span = createElement("span");
			this.h();
		},

		h: function hydrate() {
			span.className = span_class_value = "badge badge-" + state.color + (state.pill ? ' badge-pill' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(span, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, span);
			}
		},

		p: function update(changed, state) {
			if ((changed.color || changed.pill || changed.class) && span_class_value !== (span_class_value = "badge badge-" + state.color + (state.pill ? ' badge-pill' : '') + " " + state.class)) {
				span.className = span_class_value;
			}
		},

		u: function unmount() {
			detachNode(span);

			if (slot_content_default) {
				reinsertChildren(span, slot_content_default);
			}
		},

		d: noop
	};
}

function Badge(options) {
	init(this, options);
	this._state = assign(data$2(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$3(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Badge.prototype, proto);

/* src/Breadcrumb.html generated by Svelte v1.60.3 */
function data$3() {
  return {
    class: ''
  }
}

function create_main_fragment$4(component, state) {
	var ol, slot_content_default = component._slotted.default, ol_class_value;

	return {
		c: function create() {
			ol = createElement("ol");
			this.h();
		},

		h: function hydrate() {
			ol.className = ol_class_value = "breadcrumb " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(ol, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, ol);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && ol_class_value !== (ol_class_value = "breadcrumb " + state.class)) {
				ol.className = ol_class_value;
			}
		},

		u: function unmount() {
			detachNode(ol);

			if (slot_content_default) {
				reinsertChildren(ol, slot_content_default);
			}
		},

		d: noop
	};
}

function Breadcrumb(options) {
	init(this, options);
	this._state = assign(data$3(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$4(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Breadcrumb.prototype, proto);

/* src/BreadcrumbItem.html generated by Svelte v1.60.3 */
function data$4() {
  return {
    active: false,
    class: ''
  }
}

function create_main_fragment$5(component, state) {
	var li, slot_content_default = component._slotted.default, li_class_value;

	function click_handler(event) {
		component.fire("click", event);
	}

	return {
		c: function create() {
			li = createElement("li");
			this.h();
		},

		h: function hydrate() {
			addListener(li, "click", click_handler);
			li.className = li_class_value = "breadcrumb-item" + (state.active ? ' active' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(li, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, li);
			}
		},

		p: function update(changed, state) {
			if ((changed.active || changed.class) && li_class_value !== (li_class_value = "breadcrumb-item" + (state.active ? ' active' : '') + " " + state.class)) {
				li.className = li_class_value;
			}
		},

		u: function unmount() {
			detachNode(li);

			if (slot_content_default) {
				reinsertChildren(li, slot_content_default);
			}
		},

		d: function destroy$$1() {
			removeListener(li, "click", click_handler);
		}
	};
}

function BreadcrumbItem(options) {
	init(this, options);
	this._state = assign(data$4(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$5(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(BreadcrumbItem.prototype, proto);

/* src/Button.html generated by Svelte v1.60.3 */
function data$5() {
  return {
    active: false,
    block: false,
    class: '',
    color: 'secondary',
    outline: false,
    size: null
  }
}

function create_main_fragment$6(component, state) {
	var button, slot_content_default = component._slotted.default;

	function click_handler(event) {
		component.fire("click", event);
	}

	var button_levels = [
		{ class: "btn btn" + (state.outline ? '-outline' : '') + "-" + state.color + (state.size ? ` btn-${state.size}` : '') + (state.block ? ' btn-block' : '') + (state.active ? ' active' : '') + (state.disabled ? ' disabled' : '') + " " + state.class },
		state.props
	];

	var button_data = {};
	for (var i = 0; i < button_levels.length; i += 1) {
		button_data = assign(button_data, button_levels[i]);
	}

	return {
		c: function create() {
			button = createElement("button");
			this.h();
		},

		h: function hydrate() {
			addListener(button, "click", click_handler);
			setAttributes(button, button_data);
		},

		m: function mount(target, anchor) {
			insertNode(button, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, button);
			}
		},

		p: function update(changed, state) {
			setAttributes(button, getSpreadUpdate(button_levels, [
				changed.outline || changed.color || changed.size || changed.block || changed.active || changed.disabled || changed.class && { class: "btn btn" + (state.outline ? '-outline' : '') + "-" + state.color + (state.size ? ` btn-${state.size}` : '') + (state.block ? ' btn-block' : '') + (state.active ? ' active' : '') + (state.disabled ? ' disabled' : '') + " " + state.class },
				changed.props && state.props
			]));
		},

		u: function unmount() {
			detachNode(button);

			if (slot_content_default) {
				reinsertChildren(button, slot_content_default);
			}
		},

		d: function destroy$$1() {
			removeListener(button, "click", click_handler);
		}
	};
}

function Button(options) {
	init(this, options);
	this._state = assign(data$5(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$6(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Button.prototype, proto);

/* src/ButtonGroup.html generated by Svelte v1.60.3 */
function data$6() {
  return {
    class: ''
  }
}

function create_main_fragment$7(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "" + (state.size ? `btn-group-${state.size} ` : '') + (state.vertical ? 'btn-group-vertical' : 'btn-group') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.size || changed.vertical || changed.class) && div_class_value !== (div_class_value = "" + (state.size ? `btn-group-${state.size} ` : '') + (state.vertical ? 'btn-group-vertical' : 'btn-group') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function ButtonGroup(options) {
	init(this, options);
	this._state = assign(data$6(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$7(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(ButtonGroup.prototype, proto);

/* src/ButtonToolbar.html generated by Svelte v1.60.3 */
function data$7() {
  return {
    class: ''
  }
}

function create_main_fragment$8(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "btn-toolbar " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "btn-toolbar " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function ButtonToolbar(options) {
	init(this, options);
	this._state = assign(data$7(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$8(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(ButtonToolbar.prototype, proto);

/* src/Card.html generated by Svelte v1.60.3 */
function data$8() {
  return {
    block: false,
    class: '',
    inverse: false,
    outline: false
  }
}

function create_main_fragment$9(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "card" + (state.inverse ? ' card-inverse' : '') + (state.block ? ' card-body' : '') + (state.color ? ` ${state.outline ? 'border' : 'bg'}-${state.color}` : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.inverse || changed.block || changed.color || changed.outline || changed.class) && div_class_value !== (div_class_value = "card" + (state.inverse ? ' card-inverse' : '') + (state.block ? ' card-body' : '') + (state.color ? ` ${state.outline ? 'border' : 'bg'}-${state.color}` : '') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function Card(options) {
	init(this, options);
	this._state = assign(data$8(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$9(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Card.prototype, proto);

/* src/CardBody.html generated by Svelte v1.60.3 */
function data$9() {
  return {
    class: ''
  }
}

function create_main_fragment$10(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "card-body " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "card-body " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function CardBody(options) {
	init(this, options);
	this._state = assign(data$9(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$10(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardBody.prototype, proto);

/* src/CardColumns.html generated by Svelte v1.60.3 */
function data$10() {
  return {
    class: ''
  }
}

function create_main_fragment$11(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "card-columns " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "card-columns " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function CardColumns(options) {
	init(this, options);
	this._state = assign(data$10(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$11(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardColumns.prototype, proto);

/* src/CardDeck.html generated by Svelte v1.60.3 */
function data$11() {
  return {
    class: ''
  }
}

function create_main_fragment$12(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "card-deck " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "card-deck " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function CardDeck(options) {
	init(this, options);
	this._state = assign(data$11(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$12(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardDeck.prototype, proto);

/* src/CardFooter.html generated by Svelte v1.60.3 */
function data$12() {
  return {
    class: ''
  }
}

function create_main_fragment$13(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "card-footer " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "card-footer " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function CardFooter(options) {
	init(this, options);
	this._state = assign(data$12(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$13(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardFooter.prototype, proto);

/* src/CardGroup.html generated by Svelte v1.60.3 */
function data$13() {
  return {
    class: ''
  }
}

function create_main_fragment$14(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "card-group " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "card-group " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function CardGroup(options) {
	init(this, options);
	this._state = assign(data$13(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$14(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardGroup.prototype, proto);

/* src/CardHeader.html generated by Svelte v1.60.3 */
function data$14() {
  return {
    class: ''
  }
}

function create_main_fragment$15(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "card-header " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "card-header " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function CardHeader(options) {
	init(this, options);
	this._state = assign(data$14(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$15(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardHeader.prototype, proto);

/* src/CardImgOverlay.html generated by Svelte v1.60.3 */
function data$15() {
  return {
    class: ''
  }
}

function create_main_fragment$16(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "card-img-overlay " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "card-img-overlay " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function CardImgOverlay(options) {
	init(this, options);
	this._state = assign(data$15(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$16(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardImgOverlay.prototype, proto);

/* src/CardSubtitle.html generated by Svelte v1.60.3 */
function data$16() {
  return {
    class: ''
  }
}

function create_main_fragment$17(component, state) {
	var h6, slot_content_default = component._slotted.default, h6_class_value;

	return {
		c: function create() {
			h6 = createElement("h6");
			this.h();
		},

		h: function hydrate() {
			h6.className = h6_class_value = "card-subtitle " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(h6, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, h6);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && h6_class_value !== (h6_class_value = "card-subtitle " + state.class)) {
				h6.className = h6_class_value;
			}
		},

		u: function unmount() {
			detachNode(h6);

			if (slot_content_default) {
				reinsertChildren(h6, slot_content_default);
			}
		},

		d: noop
	};
}

function CardSubtitle(options) {
	init(this, options);
	this._state = assign(data$16(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$17(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardSubtitle.prototype, proto);

/* src/CardText.html generated by Svelte v1.60.3 */
function data$17() {
  return {
    class: ''
  }
}

function create_main_fragment$18(component, state) {
	var p, slot_content_default = component._slotted.default, p_class_value;

	return {
		c: function create() {
			p = createElement("p");
			this.h();
		},

		h: function hydrate() {
			p.className = p_class_value = "card-text " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(p, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, p);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && p_class_value !== (p_class_value = "card-text " + state.class)) {
				p.className = p_class_value;
			}
		},

		u: function unmount() {
			detachNode(p);

			if (slot_content_default) {
				reinsertChildren(p, slot_content_default);
			}
		},

		d: noop
	};
}

function CardText(options) {
	init(this, options);
	this._state = assign(data$17(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$18(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardText.prototype, proto);

/* src/CardTitle.html generated by Svelte v1.60.3 */
function data$18() {
  return {
    class: ''
  }
}

function create_main_fragment$19(component, state) {
	var h4, slot_content_default = component._slotted.default, h4_class_value;

	return {
		c: function create() {
			h4 = createElement("h4");
			this.h();
		},

		h: function hydrate() {
			h4.className = h4_class_value = "card-title " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(h4, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, h4);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && h4_class_value !== (h4_class_value = "card-title " + state.class)) {
				h4.className = h4_class_value;
			}
		},

		u: function unmount() {
			detachNode(h4);

			if (slot_content_default) {
				reinsertChildren(h4, slot_content_default);
			}
		},

		d: noop
	};
}

function CardTitle(options) {
	init(this, options);
	this._state = assign(data$18(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$19(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(CardTitle.prototype, proto);

/* src/Col.html generated by Svelte v1.60.3 */
const widths = ['xs', 'sm', 'md', 'lg', 'xl'];

function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

const getColumnSizeClass = (isXs, colWidth, colSize) => {
  if (colSize === true || colSize === '') {
    return isXs ? 'col' : `col-${colWidth}`;
  } else if (colSize === 'auto') {
    return isXs ? 'col-auto' : `col-${colWidth}-auto`;
  }

  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
};

function classes(widths, xs, sm, md, lg, xl) {
  const colClasses = [];
  const props = {
    xs,
    sm,
    md,
    lg,
    xl
  };

  widths.forEach((colWidth, i) => {
    let columnProp = props[colWidth];

    if (!i && columnProp === undefined) {
      columnProp = true;
    }

    if (!columnProp) {
      return;
    }

    const isXs = !i;
    let colClass;

    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
      colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

      if (columnProp.size || columnProp.size === '') colClasses.push(colClass);
      if (columnProp.push) colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
      if (columnProp.pull) colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
      if (columnProp.offset) colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
    } else {
      colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });
  
  return colClasses.join(' ');
}

function data$19() {
  return {
    class: '',
    widths
  }
}

function create_main_fragment$20(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "" + state.classes + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.classes || changed.class) && div_class_value !== (div_class_value = "" + state.classes + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function Col(options) {
	init(this, options);
	this._state = assign(data$19(), options.data);
	this._recompute({ widths: 1, xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }, this._state);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$20(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Col.prototype, proto);

Col.prototype._recompute = function _recompute(changed, state) {
	if (changed.widths || changed.xs || changed.sm || changed.md || changed.lg || changed.xl) {
		if (this._differs(state.classes, (state.classes = classes(state.widths, state.xs, state.sm, state.md, state.lg, state.xl)))) changed.classes = true;
	}
};

/* src/Container.html generated by Svelte v1.60.3 */
function data$20() {
  return {
    class: '',
    fluid: false
  }
}

function create_main_fragment$21(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "container" + (state.fluid ? '-fluid' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.fluid || changed.class) && div_class_value !== (div_class_value = "container" + (state.fluid ? '-fluid' : '') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function Container(options) {
	init(this, options);
	this._state = assign(data$20(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$21(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Container.prototype, proto);

/* src/Dropdown.html generated by Svelte v1.60.3 */
// TODO manage open logic internally to this component, if possible
// TODO support closing from click outside
function data$21() {
  return {
    class: '',
    dropup: false,
    open: false
  }
}

function create_main_fragment$22(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "dropdown" + (state.dropup ? ' dropup' : '') + (state.open ? ' show' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.dropup || changed.open || changed.class) && div_class_value !== (div_class_value = "dropdown" + (state.dropup ? ' dropup' : '') + (state.open ? ' show' : '') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function Dropdown(options) {
	init(this, options);
	this._state = assign(data$21(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$22(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Dropdown.prototype, proto);

/* src/DropdownDivider.html generated by Svelte v1.60.3 */
function data$22() {
  return {
    class: ''
  }
}

function create_main_fragment$23(component, state) {
	var div, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "dropdown-divider " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "dropdown-divider " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);
		},

		d: noop
	};
}

function DropdownDivider(options) {
	init(this, options);
	this._state = assign(data$22(), options.data);

	this._fragment = create_main_fragment$23(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(DropdownDivider.prototype, proto);

/* src/DropdownHeader.html generated by Svelte v1.60.3 */
function data$23() {
  return {
    class: ''
  }
}

function create_main_fragment$24(component, state) {
	var h6, slot_content_default = component._slotted.default, h6_class_value;

	return {
		c: function create() {
			h6 = createElement("h6");
			this.h();
		},

		h: function hydrate() {
			h6.className = h6_class_value = "dropdown-header " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(h6, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, h6);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && h6_class_value !== (h6_class_value = "dropdown-header " + state.class)) {
				h6.className = h6_class_value;
			}
		},

		u: function unmount() {
			detachNode(h6);

			if (slot_content_default) {
				reinsertChildren(h6, slot_content_default);
			}
		},

		d: noop
	};
}

function DropdownHeader(options) {
	init(this, options);
	this._state = assign(data$23(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$24(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(DropdownHeader.prototype, proto);

/* src/DropdownItem.html generated by Svelte v1.60.3 */
function data$24() {
  return {
    class: '',
    disabled: false
  }
}

function create_main_fragment$25(component, state) {
	var button, slot_content_default = component._slotted.default, button_class_value;

	return {
		c: function create() {
			button = createElement("button");
			this.h();
		},

		h: function hydrate() {
			button.className = button_class_value = "dropdown-item" + (state.disabled ? ' disabled' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(button, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, button);
			}
		},

		p: function update(changed, state) {
			if ((changed.disabled || changed.class) && button_class_value !== (button_class_value = "dropdown-item" + (state.disabled ? ' disabled' : '') + " " + state.class)) {
				button.className = button_class_value;
			}
		},

		u: function unmount() {
			detachNode(button);

			if (slot_content_default) {
				reinsertChildren(button, slot_content_default);
			}
		},

		d: noop
	};
}

function DropdownItem(options) {
	init(this, options);
	this._state = assign(data$24(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$25(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(DropdownItem.prototype, proto);

/* src/DropdownMenu.html generated by Svelte v1.60.3 */
function data$25() {
  return {
    class: '',
    right: false
  }
}

function create_main_fragment$26(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "dropdown-menu" + (state.right ? ' dropdown-menu-right' : '') + " " + state.class;
			div.tabIndex = "-1";
			setAttribute(div, "role", "menu");
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.right || changed.class) && div_class_value !== (div_class_value = "dropdown-menu" + (state.right ? ' dropdown-menu-right' : '') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function DropdownMenu(options) {
	init(this, options);
	this._state = assign(data$25(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$26(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(DropdownMenu.prototype, proto);

/* src/Form.html generated by Svelte v1.60.3 */
function data$26() {
  return {
    class: '',
    inline: false
  }
}

function create_main_fragment$27(component, state) {
	var form, slot_content_default = component._slotted.default, form_class_value;

	return {
		c: function create() {
			form = createElement("form");
			this.h();
		},

		h: function hydrate() {
			form.className = form_class_value = "" + (state.inline ? 'form-inline' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(form, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, form);
			}
		},

		p: function update(changed, state) {
			if ((changed.inline || changed.class) && form_class_value !== (form_class_value = "" + (state.inline ? 'form-inline' : '') + " " + state.class)) {
				form.className = form_class_value;
			}
		},

		u: function unmount() {
			detachNode(form);

			if (slot_content_default) {
				reinsertChildren(form, slot_content_default);
			}
		},

		d: noop
	};
}

function Form(options) {
	init(this, options);
	this._state = assign(data$26(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$27(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Form.prototype, proto);

/* src/FormFeedback.html generated by Svelte v1.60.3 */
function data$27() {
  return {
    class: ''
  }
}

function create_main_fragment$28(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "form-control-feedback " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "form-control-feedback " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function FormFeedback(options) {
	init(this, options);
	this._state = assign(data$27(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$28(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(FormFeedback.prototype, proto);

/* src/FormGroup.html generated by Svelte v1.60.3 */
function data$28() {
  return {
    check: false,
    class: '',
    color: null,
    disabled: false,
    row: false
  }
}

function create_main_fragment$29(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "" + (state.color ? `has-${state.color}` : '') + (state.row ? ' row' : '') + (state.check ? ' form-check' : ' form-group') + (state.check && state.disabled ? ' disabled' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.color || changed.row || changed.check || changed.disabled || changed.class) && div_class_value !== (div_class_value = "" + (state.color ? `has-${state.color}` : '') + (state.row ? ' row' : '') + (state.check ? ' form-check' : ' form-group') + (state.check && state.disabled ? ' disabled' : '') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function FormGroup(options) {
	init(this, options);
	this._state = assign(data$28(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$29(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(FormGroup.prototype, proto);

/* src/FormText.html generated by Svelte v1.60.3 */
function data$29() {
  return {
    class: '',
    color: null,
    inline: false
  }
}

function create_main_fragment$30(component, state) {
	var small, slot_content_default = component._slotted.default, small_class_value;

	return {
		c: function create() {
			small = createElement("small");
			this.h();
		},

		h: function hydrate() {
			small.className = small_class_value = "" + (!state.inline ? 'form-text' : '') + (state.color ? ` text-${state.color}` : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(small, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, small);
			}
		},

		p: function update(changed, state) {
			if ((changed.inline || changed.color || changed.class) && small_class_value !== (small_class_value = "" + (!state.inline ? 'form-text' : '') + (state.color ? ` text-${state.color}` : '') + " " + state.class)) {
				small.className = small_class_value;
			}
		},

		u: function unmount() {
			detachNode(small);

			if (slot_content_default) {
				reinsertChildren(small, slot_content_default);
			}
		},

		d: noop
	};
}

function FormText(options) {
	init(this, options);
	this._state = assign(data$29(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$30(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(FormText.prototype, proto);

/* src/Icon.html generated by Svelte v1.60.3 */
function data$30() {
  return {
    border: false,
    class: '',
    fixedWidth: false,
    flip: false,
    inverse: false,
    pulse: false,
    rotate: false,
    size: false,
    spin: false,
    stack: false
  }
}

function create_main_fragment$31(component, state) {
	var i, i_class_value;

	return {
		c: function create() {
			i = createElement("i");
			this.h();
		},

		h: function hydrate() {
			i.className = i_class_value = "fa fa-" + state.name + (state.size ? ' fa-' + state.size : '') + (state.spin ? ' fa-spin' : '') + (state.pulse ? ' fa-pulse' : '') + (state.border ? ' fa-border' : '') + (state.fixedWidth ? ' fa-fw' : '') + (state.inverse ? ' fa-inverse' : '') + (state.flip ? ' fa-flip-' + state.flip : '') + (state.rotate ? ' fa-rotate-' + state.rotate : '') + (state.stack ? ' fa-stack-' + state.stack : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(i, target, anchor);
		},

		p: function update(changed, state) {
			if ((changed.name || changed.size || changed.spin || changed.pulse || changed.border || changed.fixedWidth || changed.inverse || changed.flip || changed.rotate || changed.stack || changed.class) && i_class_value !== (i_class_value = "fa fa-" + state.name + (state.size ? ' fa-' + state.size : '') + (state.spin ? ' fa-spin' : '') + (state.pulse ? ' fa-pulse' : '') + (state.border ? ' fa-border' : '') + (state.fixedWidth ? ' fa-fw' : '') + (state.inverse ? ' fa-inverse' : '') + (state.flip ? ' fa-flip-' + state.flip : '') + (state.rotate ? ' fa-rotate-' + state.rotate : '') + (state.stack ? ' fa-stack-' + state.stack : '') + " " + state.class)) {
				i.className = i_class_value;
			}
		},

		u: function unmount() {
			detachNode(i);
		},

		d: noop
	};
}

function Icon(options) {
	init(this, options);
	this._state = assign(data$30(), options.data);

	this._fragment = create_main_fragment$31(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Icon.prototype, proto);

/* src/InputGroup.html generated by Svelte v1.60.3 */
function data$31() {
  return {
    class: '',
    size: null
  }
}

function create_main_fragment$32(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "input-group" + (state.size ? ` input-group-${state.size}` : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.size || changed.class) && div_class_value !== (div_class_value = "input-group" + (state.size ? ` input-group-${state.size}` : '') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function InputGroup(options) {
	init(this, options);
	this._state = assign(data$31(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$32(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(InputGroup.prototype, proto);

/* src/InputGroupAddon.html generated by Svelte v1.60.3 */
function data$32() {
  return {
    class: ''
  }
}

function create_main_fragment$33(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "input-group-addon " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "input-group-addon " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function InputGroupAddon(options) {
	init(this, options);
	this._state = assign(data$32(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$33(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(InputGroupAddon.prototype, proto);

/* src/Jumbotron.html generated by Svelte v1.60.3 */
function data$33() {
  return {
    class: '',
    fluid: false
  }
}

function create_main_fragment$34(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "jumbotron" + (state.fluid ? ' jumbotron-fluid' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.fluid || changed.class) && div_class_value !== (div_class_value = "jumbotron" + (state.fluid ? ' jumbotron-fluid' : '') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function Jumbotron(options) {
	init(this, options);
	this._state = assign(data$33(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$34(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Jumbotron.prototype, proto);

/* src/ListGroup.html generated by Svelte v1.60.3 */
function data$34() {
  return {
    class: '',
    flush: false
  }
}

function create_main_fragment$35(component, state) {
	var ul, slot_content_default = component._slotted.default, ul_class_value;

	return {
		c: function create() {
			ul = createElement("ul");
			this.h();
		},

		h: function hydrate() {
			ul.className = ul_class_value = "list-group" + (state.flush ? ' list-group-flush' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(ul, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, ul);
			}
		},

		p: function update(changed, state) {
			if ((changed.flush || changed.class) && ul_class_value !== (ul_class_value = "list-group" + (state.flush ? ' list-group-flush' : '') + " " + state.class)) {
				ul.className = ul_class_value;
			}
		},

		u: function unmount() {
			detachNode(ul);

			if (slot_content_default) {
				reinsertChildren(ul, slot_content_default);
			}
		},

		d: noop
	};
}

function ListGroup(options) {
	init(this, options);
	this._state = assign(data$34(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$35(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(ListGroup.prototype, proto);

/* src/ListGroupItem.html generated by Svelte v1.60.3 */
function data$35() {
  return {
    active: false,
    class: '',
    disabled: false,
    action: false,
    color: false
  }
}

function create_main_fragment$36(component, state) {
	var li, slot_content_default = component._slotted.default, li_class_value;

	return {
		c: function create() {
			li = createElement("li");
			this.h();
		},

		h: function hydrate() {
			li.className = li_class_value = "list-group-item" + (state.active ? ' active' : '') + (state.disabled ? ' disabled' : '') + (state.action ? ' list-group-item-action' : '') + (state.color ? ` list-group-item-${state.color}` : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(li, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, li);
			}
		},

		p: function update(changed, state) {
			if ((changed.active || changed.disabled || changed.action || changed.color || changed.class) && li_class_value !== (li_class_value = "list-group-item" + (state.active ? ' active' : '') + (state.disabled ? ' disabled' : '') + (state.action ? ' list-group-item-action' : '') + (state.color ? ` list-group-item-${state.color}` : '') + " " + state.class)) {
				li.className = li_class_value;
			}
		},

		u: function unmount() {
			detachNode(li);

			if (slot_content_default) {
				reinsertChildren(li, slot_content_default);
			}
		},

		d: noop
	};
}

function ListGroupItem(options) {
	init(this, options);
	this._state = assign(data$35(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$36(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(ListGroupItem.prototype, proto);

/* src/ListGroupItemHeading.html generated by Svelte v1.60.3 */
function data$36() {
  return {
    class: ''
  }
}

function create_main_fragment$37(component, state) {
	var h5, slot_content_default = component._slotted.default, h5_class_value;

	return {
		c: function create() {
			h5 = createElement("h5");
			this.h();
		},

		h: function hydrate() {
			h5.className = h5_class_value = "list-group-item-heading " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(h5, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, h5);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && h5_class_value !== (h5_class_value = "list-group-item-heading " + state.class)) {
				h5.className = h5_class_value;
			}
		},

		u: function unmount() {
			detachNode(h5);

			if (slot_content_default) {
				reinsertChildren(h5, slot_content_default);
			}
		},

		d: noop
	};
}

function ListGroupItemHeading(options) {
	init(this, options);
	this._state = assign(data$36(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$37(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(ListGroupItemHeading.prototype, proto);

/* src/ListGroupItemText.html generated by Svelte v1.60.3 */
function data$37() {
  return {
    class: ''
  }
}

function create_main_fragment$38(component, state) {
	var p, slot_content_default = component._slotted.default, p_class_value;

	return {
		c: function create() {
			p = createElement("p");
			this.h();
		},

		h: function hydrate() {
			p.className = p_class_value = "list-group-item-text " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(p, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, p);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && p_class_value !== (p_class_value = "list-group-item-text " + state.class)) {
				p.className = p_class_value;
			}
		},

		u: function unmount() {
			detachNode(p);

			if (slot_content_default) {
				reinsertChildren(p, slot_content_default);
			}
		},

		d: noop
	};
}

function ListGroupItemText(options) {
	init(this, options);
	this._state = assign(data$37(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$38(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(ListGroupItemText.prototype, proto);

/* src/Media.html generated by Svelte v1.60.3 */
function data$38() {
  return {
    class: ''
  }
}

function create_main_fragment$39(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "media " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "media " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function Media(options) {
	init(this, options);
	this._state = assign(data$38(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$39(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Media.prototype, proto);

/* src/MediaBody.html generated by Svelte v1.60.3 */
function data$39() {
  return {
    class: ''
  }
}

function create_main_fragment$40(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "media-body " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "media-body " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function MediaBody(options) {
	init(this, options);
	this._state = assign(data$39(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$40(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(MediaBody.prototype, proto);

/* src/ModalFooter.html generated by Svelte v1.60.3 */
function data$40() {
  return {
    class: ''
  }
}

function create_main_fragment$41(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "modal-footer " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && div_class_value !== (div_class_value = "modal-footer " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function ModalFooter(options) {
	init(this, options);
	this._state = assign(data$40(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$41(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(ModalFooter.prototype, proto);

/* src/NavDropdown.html generated by Svelte v1.60.3 */
function data$41() {
  return {
    class: ''
  }
}

function create_main_fragment$42(component, state) {
	var li, slot_content_default = component._slotted.default, li_class_value;

	return {
		c: function create() {
			li = createElement("li");
			this.h();
		},

		h: function hydrate() {
			li.className = li_class_value = "nav-item " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(li, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, li);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && li_class_value !== (li_class_value = "nav-item " + state.class)) {
				li.className = li_class_value;
			}
		},

		u: function unmount() {
			detachNode(li);

			if (slot_content_default) {
				reinsertChildren(li, slot_content_default);
			}
		},

		d: noop
	};
}

function NavDropdown(options) {
	init(this, options);
	this._state = assign(data$41(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$42(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(NavDropdown.prototype, proto);

/* src/Nav.html generated by Svelte v1.60.3 */
function data$42() {
  return {
    class: '',
    fill: false,
    justified: false,
    navbar: false,
    pills: false,
    tabs: false,
    vertical: false
  }
}

function create_main_fragment$43(component, state) {
	var ul, slot_content_default = component._slotted.default, ul_class_value;

	return {
		c: function create() {
			ul = createElement("ul");
			this.h();
		},

		h: function hydrate() {
			ul.className = ul_class_value = "" + (state.navbar ? 'navbar-nav' : 'nav') + (state.tabs ? ' nav-tabs' : '') + (state.pills ? ' nav-pills' : '') + (state.fill ? ' nav-fill' : state.justified ? ' nav-justified' : '') + (state.vertical ? ' flex-column' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(ul, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, ul);
			}
		},

		p: function update(changed, state) {
			if ((changed.navbar || changed.tabs || changed.pills || changed.fill || changed.justified || changed.vertical || changed.class) && ul_class_value !== (ul_class_value = "" + (state.navbar ? 'navbar-nav' : 'nav') + (state.tabs ? ' nav-tabs' : '') + (state.pills ? ' nav-pills' : '') + (state.fill ? ' nav-fill' : state.justified ? ' nav-justified' : '') + (state.vertical ? ' flex-column' : '') + " " + state.class)) {
				ul.className = ul_class_value;
			}
		},

		u: function unmount() {
			detachNode(ul);

			if (slot_content_default) {
				reinsertChildren(ul, slot_content_default);
			}
		},

		d: noop
	};
}

function Nav(options) {
	init(this, options);
	this._state = assign(data$42(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$43(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Nav.prototype, proto);

/* src/NavItem.html generated by Svelte v1.60.3 */
function data$43() {
  return {
    active: false,
    class: ''
  }
}

function create_main_fragment$44(component, state) {
	var li, slot_content_default = component._slotted.default, li_class_value;

	return {
		c: function create() {
			li = createElement("li");
			this.h();
		},

		h: function hydrate() {
			li.className = li_class_value = "nav-item" + (state.active ? ' active' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(li, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, li);
			}
		},

		p: function update(changed, state) {
			if ((changed.active || changed.class) && li_class_value !== (li_class_value = "nav-item" + (state.active ? ' active' : '') + " " + state.class)) {
				li.className = li_class_value;
			}
		},

		u: function unmount() {
			detachNode(li);

			if (slot_content_default) {
				reinsertChildren(li, slot_content_default);
			}
		},

		d: noop
	};
}

function NavItem(options) {
	init(this, options);
	this._state = assign(data$43(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$44(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(NavItem.prototype, proto);

/* src/NavLink.html generated by Svelte v1.60.3 */
function data$44() {
  return {
    active: false,
    disabled: false,
    href: '#',
    class: ''
  }
}

function create_main_fragment$45(component, state) {
	var a, slot_content_default = component._slotted.default, a_class_value;

	function click_handler(event) {
		component.fire("click", event);
	}

	return {
		c: function create() {
			a = createElement("a");
			this.h();
		},

		h: function hydrate() {
			addListener(a, "click", click_handler);
			a.href = state.href;
			a.className = a_class_value = "nav-link" + (state.disabled ? ' disabled' : '') + (state.active ? ' active' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(a, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, a);
			}
		},

		p: function update(changed, state) {
			if (changed.href) {
				a.href = state.href;
			}

			if ((changed.disabled || changed.active || changed.class) && a_class_value !== (a_class_value = "nav-link" + (state.disabled ? ' disabled' : '') + (state.active ? ' active' : '') + " " + state.class)) {
				a.className = a_class_value;
			}
		},

		u: function unmount() {
			detachNode(a);

			if (slot_content_default) {
				reinsertChildren(a, slot_content_default);
			}
		},

		d: function destroy$$1() {
			removeListener(a, "click", click_handler);
		}
	};
}

function NavLink(options) {
	init(this, options);
	this._state = assign(data$44(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$45(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(NavLink.prototype, proto);

/* src/NavbarBrand.html generated by Svelte v1.60.3 */
function data$45() {
  return {
    class: ''
  }
}

function create_main_fragment$46(component, state) {
	var a, slot_content_default = component._slotted.default, a_class_value;

	return {
		c: function create() {
			a = createElement("a");
			this.h();
		},

		h: function hydrate() {
			a.className = a_class_value = "navbar-brand " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(a, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, a);
			}
		},

		p: function update(changed, state) {
			if ((changed.class) && a_class_value !== (a_class_value = "navbar-brand " + state.class)) {
				a.className = a_class_value;
			}
		},

		u: function unmount() {
			detachNode(a);

			if (slot_content_default) {
				reinsertChildren(a, slot_content_default);
			}
		},

		d: noop
	};
}

function NavbarBrand(options) {
	init(this, options);
	this._state = assign(data$45(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$46(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(NavbarBrand.prototype, proto);

/* src/Pagination.html generated by Svelte v1.60.3 */
function data$46() {
  return {
    class: '',
    size: null
  }
}

function create_main_fragment$47(component, state) {
	var ul, slot_content_default = component._slotted.default, ul_class_value;

	return {
		c: function create() {
			ul = createElement("ul");
			this.h();
		},

		h: function hydrate() {
			ul.className = ul_class_value = "pagination" + (state.size ? ` pagination-${state.size}` : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(ul, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, ul);
			}
		},

		p: function update(changed, state) {
			if ((changed.size || changed.class) && ul_class_value !== (ul_class_value = "pagination" + (state.size ? ` pagination-${state.size}` : '') + " " + state.class)) {
				ul.className = ul_class_value;
			}
		},

		u: function unmount() {
			detachNode(ul);

			if (slot_content_default) {
				reinsertChildren(ul, slot_content_default);
			}
		},

		d: noop
	};
}

function Pagination(options) {
	init(this, options);
	this._state = assign(data$46(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$47(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Pagination.prototype, proto);

/* src/PaginationItem.html generated by Svelte v1.60.3 */
function data$47() {
  return {
    active: false,
    class: '',
    disabled: false
  }
}

function create_main_fragment$48(component, state) {
	var li, slot_content_default = component._slotted.default, li_class_value;

	return {
		c: function create() {
			li = createElement("li");
			this.h();
		},

		h: function hydrate() {
			li.className = li_class_value = "page-item" + (state.active ? ' active' : '') + (state.disabled ? ' disabled' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(li, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, li);
			}
		},

		p: function update(changed, state) {
			if ((changed.active || changed.disabled || changed.class) && li_class_value !== (li_class_value = "page-item" + (state.active ? ' active' : '') + (state.disabled ? ' disabled' : '') + " " + state.class)) {
				li.className = li_class_value;
			}
		},

		u: function unmount() {
			detachNode(li);

			if (slot_content_default) {
				reinsertChildren(li, slot_content_default);
			}
		},

		d: noop
	};
}

function PaginationItem(options) {
	init(this, options);
	this._state = assign(data$47(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$48(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(PaginationItem.prototype, proto);

/* src/PaginationLink.html generated by Svelte v1.60.3 */
// TODO add state to this component, generate PaginationItems, Links, on:click, etc
function data$48() {
  return {
    class: '',
    next: false,
    previous: false
  }
}

function create_main_fragment$49(component, state) {
	var a, a_class_value;

	function select_block_type(state) {
		if (state.previous) return create_if_block$2;
		if (state.next) return create_if_block_1$2;
		return create_if_block_2;
	}

	var current_block_type = select_block_type(state);
	var if_block = current_block_type(component, state);

	function click_handler(event) {
		component.fire("click", event);
	}

	return {
		c: function create() {
			a = createElement("a");
			if_block.c();
			this.h();
		},

		h: function hydrate() {
			addListener(a, "click", click_handler);
			a.className = a_class_value = "page-link" + (state.size ? ` pagination-${state.size}` : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(a, target, anchor);
			if_block.m(a, null);
		},

		p: function update(changed, state) {
			if (current_block_type !== (current_block_type = select_block_type(state))) {
				if_block.u();
				if_block.d();
				if_block = current_block_type(component, state);
				if_block.c();
				if_block.m(a, null);
			}

			if ((changed.size || changed.class) && a_class_value !== (a_class_value = "page-link" + (state.size ? ` pagination-${state.size}` : '') + " " + state.class)) {
				a.className = a_class_value;
			}
		},

		u: function unmount() {
			detachNode(a);
			if_block.u();
		},

		d: function destroy$$1() {
			if_block.d();
			removeListener(a, "click", click_handler);
		}
	};
}

// (5:2) {{#if previous}}
function create_if_block$2(component, state) {
	var text;

	return {
		c: function create() {
			text = createText("«");
		},

		m: function mount(target, anchor) {
			insertNode(text, target, anchor);
		},

		u: function unmount() {
			detachNode(text);
		},

		d: noop
	};
}

// (7:17) 
function create_if_block_1$2(component, state) {
	var text;

	return {
		c: function create() {
			text = createText("»");
		},

		m: function mount(target, anchor) {
			insertNode(text, target, anchor);
		},

		u: function unmount() {
			detachNode(text);
		},

		d: noop
	};
}

// (9:2) {{else}}
function create_if_block_2(component, state) {
	var slot_content_default = component._slotted.default, slot_content_default_before, slot_content_default_after;

	return {
		c: noop,

		m: function mount(target, anchor) {
			if (slot_content_default) {
				insertNode(slot_content_default_before || (slot_content_default_before = createComment()), target, anchor);
				insertNode(slot_content_default, target, anchor);
				insertNode(slot_content_default_after || (slot_content_default_after = createComment()), target, anchor);
			}
		},

		u: function unmount() {
			if (slot_content_default) {
				reinsertBetween(slot_content_default_before, slot_content_default_after, slot_content_default);
				detachNode(slot_content_default_before);
				detachNode(slot_content_default_after);
			}
		},

		d: noop
	};
}

function PaginationLink(options) {
	init(this, options);
	this._state = assign(data$48(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$49(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(PaginationLink.prototype, proto);

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
  var type = typeof value;
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
  return !!value && typeof value == 'object';
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
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
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
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var index = toNumber$1;

/* src/Progress.html generated by Svelte v1.60.3 */
function percent(value, max) {
  return (index(value) / index(max)) * 100;
}

function data$49() {
  return {
    bar: false,
    class: '',
    value: 0,
    max: 100,
    multi: false
  }
}

function create_main_fragment$50(component, state) {
	var if_block_anchor;

	function select_block_type_1(state) {
		if (!state.bar) return create_if_block$3;
		return create_if_block_3;
	}

	var current_block_type = select_block_type_1(state);
	var if_block = current_block_type(component, state);

	return {
		c: function create() {
			if_block.c();
			if_block_anchor = createComment();
		},

		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insertNode(if_block_anchor, target, anchor);
		},

		p: function update(changed, state) {
			if (current_block_type === (current_block_type = select_block_type_1(state)) && if_block) {
				if_block.p(changed, state);
			} else {
				if_block.u();
				if_block.d();
				if_block = current_block_type(component, state);
				if_block.c();
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},

		u: function unmount() {
			if_block.u();
			detachNode(if_block_anchor);
		},

		d: function destroy$$1() {
			if_block.d();
		}
	};
}

// (3:4) {{#if multi}}
function create_if_block_1$3(component, state) {
	var slot_content_default = component._slotted.default, slot_content_default_before, slot_content_default_after;

	return {
		c: noop,

		m: function mount(target, anchor) {
			if (slot_content_default) {
				insertNode(slot_content_default_before || (slot_content_default_before = createComment()), target, anchor);
				insertNode(slot_content_default, target, anchor);
				insertNode(slot_content_default_after || (slot_content_default_after = createComment()), target, anchor);
			}
		},

		p: noop,

		u: function unmount() {
			if (slot_content_default) {
				reinsertBetween(slot_content_default_before, slot_content_default_after, slot_content_default);
				detachNode(slot_content_default_before);
				detachNode(slot_content_default_after);
			}
		},

		d: noop
	};
}

// (5:4) {{else}}
function create_if_block_2$1(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "progress-bar" + (state.animated ? ' progress-bar-animated' : '') + (state.color ? ` bg-${state.color}` : '') + (state.striped || state.animated ? ' progress-bar-striped' : '');
			setStyle(div, "width", "" + state.percent + "%");
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.animated || changed.color || changed.striped) && div_class_value !== (div_class_value = "progress-bar" + (state.animated ? ' progress-bar-animated' : '') + (state.color ? ` bg-${state.color}` : '') + (state.striped || state.animated ? ' progress-bar-striped' : ''))) {
				div.className = div_class_value;
			}

			if (changed.percent) {
				setStyle(div, "width", "" + state.percent + "%");
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

// (1:0) {{#if !bar}}
function create_if_block$3(component, state) {
	var div, div_class_value;

	function select_block_type(state) {
		if (state.multi) return create_if_block_1$3;
		return create_if_block_2$1;
	}

	var current_block_type = select_block_type(state);
	var if_block = current_block_type(component, state);

	return {
		c: function create() {
			div = createElement("div");
			if_block.c();
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "progress " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			if_block.m(div, null);
		},

		p: function update(changed, state) {
			if (current_block_type === (current_block_type = select_block_type(state)) && if_block) {
				if_block.p(changed, state);
			} else {
				if_block.u();
				if_block.d();
				if_block = current_block_type(component, state);
				if_block.c();
				if_block.m(div, null);
			}

			if ((changed.class) && div_class_value !== (div_class_value = "progress " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);
			if_block.u();
		},

		d: function destroy$$1() {
			if_block.d();
		}
	};
}

// (14:0) {{else}}
function create_if_block_3(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "progress-bar" + (state.animated ? ' progress-bar-animated' : '') + (state.color ? ` bg-${state.color}` : '') + (state.striped || state.animated ? ' progress-bar-striped' : '');
			setStyle(div, "width", "" + state.percent + "%");
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.animated || changed.color || changed.striped) && div_class_value !== (div_class_value = "progress-bar" + (state.animated ? ' progress-bar-animated' : '') + (state.color ? ` bg-${state.color}` : '') + (state.striped || state.animated ? ' progress-bar-striped' : ''))) {
				div.className = div_class_value;
			}

			if (changed.percent) {
				setStyle(div, "width", "" + state.percent + "%");
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function Progress(options) {
	init(this, options);
	this._state = assign(data$49(), options.data);
	this._recompute({ value: 1, max: 1 }, this._state);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$50(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Progress.prototype, proto);

Progress.prototype._recompute = function _recompute(changed, state) {
	if (changed.value || changed.max) {
		if (this._differs(state.percent, (state.percent = percent(state.value, state.max)))) changed.percent = true;
	}
};

/* src/Row.html generated by Svelte v1.60.3 */
function data$50() {
  return {
    class: '',
    noGutters: false
  }
}

function create_main_fragment$51(component, state) {
	var div, slot_content_default = component._slotted.default, div_class_value;

	return {
		c: function create() {
			div = createElement("div");
			this.h();
		},

		h: function hydrate() {
			div.className = div_class_value = "row" + (state.noGutters ? ' no-gutters' : '') + " " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, div);
			}
		},

		p: function update(changed, state) {
			if ((changed.noGutters || changed.class) && div_class_value !== (div_class_value = "row" + (state.noGutters ? ' no-gutters' : '') + " " + state.class)) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(div, slot_content_default);
			}
		},

		d: noop
	};
}

function Row(options) {
	init(this, options);
	this._state = assign(data$50(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$51(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Row.prototype, proto);

/* src/Table.html generated by Svelte v1.60.3 */
// TODO remove duplication of table above
function data$51() {
  return {
    class: '',
    size: null,
    bordered: false,
    striped: false,
    inverse: false,
    hover: false,
    reflow: false
  }
}

function create_main_fragment$52(component, state) {
	var if_block_anchor;

	function select_block_type(state) {
		if (state.responsive) return create_if_block$4;
		return create_if_block_1$4;
	}

	var current_block_type = select_block_type(state);
	var if_block = current_block_type(component, state);

	return {
		c: function create() {
			if_block.c();
			if_block_anchor = createComment();
		},

		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insertNode(if_block_anchor, target, anchor);
		},

		p: function update(changed, state) {
			if (current_block_type === (current_block_type = select_block_type(state)) && if_block) {
				if_block.p(changed, state);
			} else {
				if_block.u();
				if_block.d();
				if_block = current_block_type(component, state);
				if_block.c();
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},

		u: function unmount() {
			if_block.u();
			detachNode(if_block_anchor);
		},

		d: function destroy$$1() {
			if_block.d();
		}
	};
}

// (1:0) {{#if responsive}}
function create_if_block$4(component, state) {
	var div, table, slot_content_default = component._slotted.default, table_class_value;

	return {
		c: function create() {
			div = createElement("div");
			table = createElement("table");
			this.h();
		},

		h: function hydrate() {
			table.className = table_class_value = "table" + (state.size ? ` table-${state.size}` : '') + (state.bordered ? ' table-bordered' : '') + (state.striped ? ' table-striped' : '') + (state.inverse ? ' table-inverse' : '') + (state.hover ? ' table-hover' : '') + (state.reflow ? ' table-reflow' :'') + "\n   " + state.class;
			div.className = "table-responsive";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(table, div);

			if (slot_content_default) {
				appendNode(slot_content_default, table);
			}
		},

		p: function update(changed, state) {
			if ((changed.size || changed.bordered || changed.striped || changed.inverse || changed.hover || changed.reflow || changed.class) && table_class_value !== (table_class_value = "table" + (state.size ? ` table-${state.size}` : '') + (state.bordered ? ' table-bordered' : '') + (state.striped ? ' table-striped' : '') + (state.inverse ? ' table-inverse' : '') + (state.hover ? ' table-hover' : '') + (state.reflow ? ' table-reflow' :'') + "\n   " + state.class)) {
				table.className = table_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			if (slot_content_default) {
				reinsertChildren(table, slot_content_default);
			}
		},

		d: noop
	};
}

// (8:0) {{else}}
function create_if_block_1$4(component, state) {
	var table, slot_content_default = component._slotted.default, table_class_value;

	return {
		c: function create() {
			table = createElement("table");
			this.h();
		},

		h: function hydrate() {
			table.className = table_class_value = "table" + (state.size ? ` table-${state.size}` : '') + (state.bordered ? ' table-bordered' : '') + (state.striped ? ' table-striped' : '') + (state.inverse ? ' table-inverse' : '') + (state.hover ? ' table-hover' : '') + (state.reflow ? ' table-reflow' :'') + "\n   " + state.class;
		},

		m: function mount(target, anchor) {
			insertNode(table, target, anchor);

			if (slot_content_default) {
				appendNode(slot_content_default, table);
			}
		},

		p: function update(changed, state) {
			if ((changed.size || changed.bordered || changed.striped || changed.inverse || changed.hover || changed.reflow || changed.class) && table_class_value !== (table_class_value = "table" + (state.size ? ` table-${state.size}` : '') + (state.bordered ? ' table-bordered' : '') + (state.striped ? ' table-striped' : '') + (state.inverse ? ' table-inverse' : '') + (state.hover ? ' table-hover' : '') + (state.reflow ? ' table-reflow' :'') + "\n   " + state.class)) {
				table.className = table_class_value;
			}
		},

		u: function unmount() {
			detachNode(table);

			if (slot_content_default) {
				reinsertChildren(table, slot_content_default);
			}
		},

		d: noop
	};
}

function Table(options) {
	init(this, options);
	this._state = assign(data$51(), options.data);

	this._slotted = options.slots || {};

	this.slots = {};

	this._fragment = create_main_fragment$52(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Table.prototype, proto);

/* src/Docs.html generated by Svelte v1.60.3 */
function data() {
  return {
    current: 'Bootstrap',
    themes: [
      { name: 'Bootstrap', url: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' },
      { name: 'Cerulean', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/cerulean/bootstrap.min.css' },
      { name: 'Cosmo', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/cosmo/bootstrap.min.css' },
      { name: 'Cyborg', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/cyborg/bootstrap.min.css' },
      { name: 'Darkly', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/darkly/bootstrap.min.css' },
      { name: 'Flatly', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/flatly/bootstrap.min.css' },
      { name: 'Journal', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/journal/bootstrap.min.css' },
      { name: 'Litera', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/litera/bootstrap.min.css' },
      { name: 'Lumen', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/lumen/bootstrap.min.css' },
      { name: 'Lux', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/lux/bootstrap.min.css' },
      { name: 'Materia', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/materia/bootstrap.min.css' },
      { name: 'Minty', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/minty/bootstrap.min.css' },
      { name: 'Pulse', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/pulse/bootstrap.min.css' },
      { name: 'Sandstone', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/sandstone/bootstrap.min.css' },
      { name: 'Simplex', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/simplex/bootstrap.min.css' },
      { name: 'Slate', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/slate/bootstrap.min.css' },
      { name: 'Solar', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/solar/bootstrap.min.css' },
      { name: 'Spacelab', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/spacelab/bootstrap.min.css' },
      { name: 'Superhero', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/superhero/bootstrap.min.css' },
      { name: 'United', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/united/bootstrap.min.css' },
      { name: 'Yeti', url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.0/yeti/bootstrap.min.css' }
    ]
  }
}

var methods = {
  log(msg) {
    console.log(msg);
  },
  changeTheme(theme) {
    const link = document.getElementById('theme');
    link.href = theme.url;
    this.set({ current: theme.name });
  }
};

function create_main_fragment(component, state) {
	var nav, text, img, text_1, text_2, ul, text_4, text_5, text_6, text_7, div, text_8, a, text_9, text_10, a_1, text_11, text_12, a_2, text_13, text_14, a_3, text_15, text_16, a_4, text_17, text_18, a_5, text_19, text_20, a_6, text_21, text_22, a_7, text_23, text_24, a_8, text_25, text_26, a_9, text_27, text_28, text_30, text_31, text_32, text_33, div_1, text_34, text_35, h1, text_36, text_37, div_2, nav_1, button, text_39, a_10, text_41, div_3, ul_1, text_42, text_43, span_1, text_44, text_45, text_46, text_47, text_48, text_49, text_50, text_51, text_52, text_53, text_54, text_55, text_56, input, text_57, text_58, text_59, text_63, div_4, nav_2, button_2, text_65, a_11, text_66, text_67, div_5, ul_2, text_68, text_69, span_3, text_70, text_71, text_72, text_73, text_74, text_75, text_76, text_77, text_78, text_79, text_80, text_81, text_82, input_1, text_83, text_84, text_85, text_89, text_90, text_92, text_93, div_6, h1_1, text_95, text_96, text_97, p, text_98, text_99, text_100, text_101, text_102, text_103, text_104, text_105, text_106, text_107, text_108, text_109, text_110, text_112, p_1, text_113, text_114, text_115, text_116, text_117, text_118, text_119, text_120, text_121, text_122, text_123, text_124, text_125, text_127, p_2, text_128, text_129, text_130, text_131, text_132, text_133, text_134, text_135, text_136, text_137, text_138, text_140, div_7, text_141, text_142, text_143, text_144, text_145, text_147, text_148, text_149, p_3, text_150, text_152, div_8, div_9, text_160, div_10, div_11, text_168, div_12, text_169, text_170, text_171, text_172, text_173, text_174, text_175, text_176, text_177, text_178, text_179, text_180, text_181, text_183, div_13, text_184, text_185, text_186, text_187, text_188, text_189, text_190, text_192, div_14, text_193, text_194, text_195, text_196, text_197, text_198, text_199, text_200, text_201, text_202, text_203, text_204, text_205, text_206, text_207, text_208, text_209, text_210, text_211, text_212, text_213, text_214, text_215, text_217, text_218, text_219, text_220, div_15, h2, text_222, h4, text_224, text_225, text_226, text_227, text_228, text_229, text_230, text_231, a_12, text_232, text_233, text_234, text_235, text_236, a_13, text_237, text_238, text_239, text_240, text_241, h4_1, text_243, text_244, text_245, text_246, text_247, text_248, text_249, text_250, text_251, text_252, text_254, text_256, text_257, div_16, h1_2, text_259, text_260, div_17, div_18, text_280, div_19, div_20, text_302, div_21, div_22, text_318, text_319, h2_4, text_321, text_322, text_323, blockquote, p_16, text_325, footer, text_329, text_330, text_331, blockquote_1, p_17, text_333, footer_1, text_337, text_338, text_340, text_341, div_23, h1_4, text_343, text_344, text_345, text_346, thead, tr, text_356, tbody, tr_1, text_365, tr_2, text_374, tr_3, text_383, tr_4, text_392, tr_5, text_401, tr_6, text_410, tr_7, text_420, text_421, text_422, text_424, text_425, div_24, h1_5, text_427, text_428, text_429, text_430, fieldset, legend, text_432, div_25, text_438, div_26, text_442, div_27, label_8, text_444, select, option, text_445, option_1, text_446, option_2, text_447, option_3, text_448, option_4, text_449, text_451, div_28, label_9, text_453, select_1, option_5, text_454, option_6, text_455, option_7, text_456, option_8, text_457, option_9, text_458, text_460, div_29, text_464, div_30, text_470, fieldset_1, text_482, div_34, text_485, button_47, text_488, text_489, text_490, text_491, text_492, text_493, fieldset_2, label_16, text_495, input_15, text_497, text_498, text_499, fieldset_3, label_17, text_501, input_16, text_503, text_504, text_505, label_18, text_506, text_507, input_17, text_508, div_35, text_509, text_510, text_511, text_512, label_19, text_513, text_514, input_18, text_515, div_36, text_516, text_517, text_518, text_519, label_20, text_520, text_521, input_19, text_522, div_37, text_523, text_524, text_525, text_526, label_21, text_527, text_528, input_20, text_529, text_530, text_531, label_22, text_532, text_533, input_21, text_534, text_535, text_536, label_23, text_537, text_538, input_22, text_539, text_540, text_541, label_24, text_542, text_543, text_544, label_25, text_545, text_546, text_547, text_548, text_549, input_23, text_550, text_551, text_552, text_553, text_554, text_555, text_556, text_557, text_559, text_560, div_38, h1_6, text_562, text_563, text_564, h2_5, text_565, text_566, div_39, text_567, text_568, text_569, text_570, text_571, text_572, text_573, text_574, text_575, text_576, text_577, text_578, text_579, li, a_15, text_581, div_40, text_592, text_593, div_42, text_607, text_608, text_609, h2_6, text_610, text_611, text_612, text_613, text_614, text_615, text_616, text_617, a_20, text_618, text_619, div_47, a_21, text_621, a_22, text_623, a_23, text_625, div_48, text_626, a_24, text_629, text_630, text_631, text_632, text_633, text_634, text_635, text_636, text_637, text_638, text_639, br, text_640, div_49, text_641, text_642, text_643, text_644, text_645, text_646, a_25, text_647, text_648, div_50, a_26, text_650, a_27, text_652, a_28, text_654, div_51, text_655, a_29, text_658, text_659, text_660, text_661, text_662, text_663, text_664, text_665, text_666, text_667, text_669, text_670, text_671, h2_7, text_673, text_674, text_675, text_676, text_677, text_678, text_679, text_680, text_681, text_682, text_683, text_684, text_685, text_686, text_687, text_688, text_689, text_690, text_691, h2_8, text_693, text_694, text_695, text_696, text_697, text_698, text_699, text_700, text_701, text_702, text_703, text_704, text_705, text_706, text_707, text_708, text_709, text_710, text_711, text_712, text_713, h2_9, text_714, text_715, text_716, text_717, text_718, text_719, text_720, a_30, text_721, text_722, text_723, text_724, text_725, text_726, a_31, text_727, text_728, a_32, text_729, text_730, text_731, text_732, text_733, text_734, text_735, h2_10, text_736, text_737, div_52, text_739, text_740, text_742, text_743, div_53, h1_7, text_745, h2_11, text_747, text_748, h4_3, text_749, text_750, p_22, text_751, a_33, text_753, text_754, text_755, text_756, each_2_anchor, text_757, text_758, div_54, h2_12, text_760, div_55, text_761, text_762, text_763, text_764, text_765, text_766, text_767, text_768, text_769, text_770, text_771, text_773, div_56, text_774, text_775, text_776, text_777, text_778, text_779, text_780, text_781, text_782, text_783, text_784, text_788, text_789, div_57, text_790, text_791, h1_8, text_792, text_793, h3_2, text_794, text_795, div_58, text_797, h3_3, text_798, text_799, div_59, text_800, text_801, text_802, text_804, h3_4, text_805, text_806, div_60, text_807, text_808, text_809, text_810, text_812, h3_5, text_813, text_814, div_61, text_815, text_816, text_817, text_818, text_820, h3_6, text_821, text_822, div_62, text_823, text_824, text_825, text_826, text_828, text_829, text_831, text_832, div_63, text_833, text_834, h1_9, text_835, text_836, text_837, h1_10, text_838, text_839, p_23, text_840, text_841, p_24, text_842, text_843, text_844, text_845, text_846, h2_13, text_848, text_849, text_850, text_851, text_852, text_853, text_854, text_855, text_856, text_857, text_858, text_859, text_860, text_861, text_862, text_863, text_864, text_865, text_866, text_867, text_868, text_869, text_870, text_871, text_872, text_873, text_874, text_875, text_876, text_877, text_878, text_879, text_880, text_881, text_882, text_883, text_884, text_885, text_886, text_887, text_888, text_889, text_890, text_891, text_892, h2_14, text_894, text_895, text_896, each_3_anchor, text_897, text_898, text_899, each_4_anchor, text_900, text_901, text_902, text_903, text_904, text_905, text_906, text_907, text_908, text_909, text_910, text_911, img_1, text_912, text_913, p_25, text_914, text_915, a_34, text_916, text_917, a_35, text_918, text_919, text_920, text_921, text_922, text_923, text_924, text_925, h2_15, text_927, text_928, text_929, img_2, text_930, text_931, h4_4, text_932, text_933, text_934, text_935, text_937, text_938, div_64, h1_11, text_940, text_941, text_942, h2_16, text_943, text_944, text_945, text_946, text_947, h2_17, text_948, text_949, div_65, button_49, text_951, button_50, text_953, button_51, text_955, button_52, text_958, h2_18, text_959, text_960, div_66, button_53, text_962, button_54, text_964, button_55, text_966, button_56, text_969, text_970, text_972, text_973, text_974, text_975;

	var navbarbrand_initial_data = {
	 	href: "https://github.com/bestguy/sveltestrap"
	 };
	var navbarbrand = new NavbarBrand({
		root: component.root,
		slots: { default: createFragment() },
		data: navbarbrand_initial_data
	});

	var each_value = state.themes;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(component, assign(assign({}, state), {
			each_value: each_value,
			theme: each_value[i],
			theme_index: i
		}));
	}

	var listgroupitem_initial_data = { action: true };
	var listgroupitem = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_initial_data
	});

	var listgroupitem_1_initial_data = { action: true };
	var listgroupitem_1 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_1_initial_data
	});

	var listgroupitem_2_initial_data = { action: true };
	var listgroupitem_2 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_2_initial_data
	});

	var listgroupitem_3_initial_data = { action: true };
	var listgroupitem_3 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_3_initial_data
	});

	var listgroupitem_4_initial_data = { action: true };
	var listgroupitem_4 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_4_initial_data
	});

	var listgroupitem_5_initial_data = { action: true };
	var listgroupitem_5 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_5_initial_data
	});

	var listgroupitem_6_initial_data = { action: true };
	var listgroupitem_6 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_6_initial_data
	});

	var listgroupitem_7_initial_data = { action: true };
	var listgroupitem_7 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_7_initial_data
	});

	var listgroupitem_8_initial_data = { action: true };
	var listgroupitem_8 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_8_initial_data
	});

	var listgroupitem_9_initial_data = { action: true };
	var listgroupitem_9 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_9_initial_data
	});

	var listgroup = new ListGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_initial_data = { sm: 3, lg: 2 };
	var col = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_initial_data
	});

	var navlink = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_initial_data = { active: true };
	var navitem = new NavItem({
		root: component.root,
		slots: { default: createFragment() },
		data: navitem_initial_data
	});

	var navlink_1 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_1 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_2 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_2 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_3 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_3 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var button_1_initial_data = {
	 	outline: true,
	 	class: "my-2 my-sm-0",
	 	type: "submit"
	 };
	var button_1 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_1_initial_data
	});

	var form_initial_data = { inline: true };
	var form = new Form({
		root: component.root,
		slots: { default: createFragment() },
		data: form_initial_data
	});

	var navbarbrand_1 = new NavbarBrand({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_4 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_4_initial_data = { active: true };
	var navitem_4 = new NavItem({
		root: component.root,
		slots: { default: createFragment() },
		data: navitem_4_initial_data
	});

	var navlink_5 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_5 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_6 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_6 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_7 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_7 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var button_3_initial_data = {
	 	outline: true,
	 	class: "my-2 my-sm-0",
	 	type: "submit"
	 };
	var button_3 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_3_initial_data
	});

	var form_1_initial_data = { inline: true };
	var form_1 = new Form({
		root: component.root,
		slots: { default: createFragment() },
		data: form_1_initial_data
	});

	var col_2_initial_data = { lg: 12 };
	var col_2 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_2_initial_data
	});

	var row_1 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var button_4_initial_data = { color: "primary" };
	var button_4 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_4_initial_data
	});

	var button_5_initial_data = { color: "secondary" };
	var button_5 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_5_initial_data
	});

	var button_6_initial_data = { color: "success" };
	var button_6 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_6_initial_data
	});

	var button_7_initial_data = { color: "info" };
	var button_7 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_7_initial_data
	});

	var button_8_initial_data = { color: "warning" };
	var button_8 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_8_initial_data
	});

	var button_9_initial_data = { color: "danger" };
	var button_9 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_9_initial_data
	});

	var button_10_initial_data = { color: "link" };
	var button_10 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_10_initial_data
	});

	var button_11_initial_data = { color: "primary", disabled: true };
	var button_11 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_11_initial_data
	});

	var button_12_initial_data = { color: "secondary", disabled: true };
	var button_12 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_12_initial_data
	});

	var button_13_initial_data = { color: "success", disabled: true };
	var button_13 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_13_initial_data
	});

	var button_14_initial_data = { color: "info", disabled: true };
	var button_14 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_14_initial_data
	});

	var button_15_initial_data = { color: "warning", disabled: true };
	var button_15 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_15_initial_data
	});

	var button_16_initial_data = { color: "danger", disabled: true };
	var button_16 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_16_initial_data
	});

	var button_17_initial_data = { color: "link", disabled: true };
	var button_17 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_17_initial_data
	});

	var button_18_initial_data = { outline: true, color: "primary" };
	var button_18 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_18_initial_data
	});

	var button_19_initial_data = { outline: true, color: "secondary" };
	var button_19 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_19_initial_data
	});

	var button_20_initial_data = { outline: true, color: "success" };
	var button_20 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_20_initial_data
	});

	var button_21_initial_data = { outline: true, color: "info" };
	var button_21 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_21_initial_data
	});

	var button_22_initial_data = { outline: true, color: "warning" };
	var button_22 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_22_initial_data
	});

	var button_23_initial_data = { outline: true, color: "danger" };
	var button_23 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_23_initial_data
	});

	var button_24_initial_data = { color: "primary", size: "lg" };
	var button_24 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_24_initial_data
	});

	var button_25_initial_data = { color: "primary" };
	var button_25 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_25_initial_data
	});

	var button_26_initial_data = { color: "primary", size: "sm" };
	var button_26 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_26_initial_data
	});

	var col_3_initial_data = { lg: 7 };
	var col_3 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_3_initial_data
	});

	var button_27_initial_data = {
	 	color: "primary",
	 	size: "lg",
	 	block: true
	 };
	var button_27 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_27_initial_data
	});

	var button_28_initial_data = { color: "primary" };
	var button_28 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_28_initial_data
	});

	var button_29_initial_data = { color: "primary" };
	var button_29 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_29_initial_data
	});

	var button_30_initial_data = { color: "primary" };
	var button_30 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_30_initial_data
	});

	var button_31_initial_data = { color: "primary" };
	var button_31 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_31_initial_data
	});

	var button_32_initial_data = { color: "primary" };
	var button_32 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_32_initial_data
	});

	var button_33_initial_data = { color: "primary" };
	var button_33 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_33_initial_data
	});

	var buttongroup_initial_data = { vertical: true };
	var buttongroup = new ButtonGroup({
		root: component.root,
		slots: { default: createFragment() },
		data: buttongroup_initial_data
	});

	var button_34_initial_data = { color: "secondary" };
	var button_34 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_34_initial_data
	});

	var button_35_initial_data = { color: "secondary" };
	var button_35 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_35_initial_data
	});

	var button_36_initial_data = { color: "secondary" };
	var button_36 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_36_initial_data
	});

	var buttongroup_1 = new ButtonGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var button_37_initial_data = { color: "secondary" };
	var button_37 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_37_initial_data
	});

	var button_38_initial_data = { color: "secondary" };
	var button_38 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_38_initial_data
	});

	var button_39_initial_data = { color: "secondary" };
	var button_39 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_39_initial_data
	});

	var button_40_initial_data = { color: "secondary" };
	var button_40 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_40_initial_data
	});

	var buttongroup_2 = new ButtonGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var button_41_initial_data = { color: "secondary" };
	var button_41 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_41_initial_data
	});

	var button_42_initial_data = { color: "secondary" };
	var button_42 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_42_initial_data
	});

	var button_43_initial_data = { color: "secondary" };
	var button_43 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_43_initial_data
	});

	var buttongroup_3 = new ButtonGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var button_44_initial_data = { color: "secondary" };
	var button_44 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_44_initial_data
	});

	var buttongroup_4 = new ButtonGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var buttontoolbar = new ButtonToolbar({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_4_initial_data = { lg: 5 };
	var col_4 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_4_initial_data
	});

	var row_2 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var button_45_initial_data = {
	 	class: "dropdown-toggle",
	 	color: "primary"
	 };
	var button_45 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_45_initial_data
	});

	button_45.on("click", function(event) {
		component.set({ open: !state.open });
	});

	var dropdownheader = new DropdownHeader({
		root: component.root,
		slots: { default: createFragment() }
	});

	var dropdownitem = new DropdownItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var dropdowndivider = new DropdownDivider({
		root: component.root
	});

	var dropdownitem_1 = new DropdownItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var dropdownmenu = new DropdownMenu({
		root: component.root,
		slots: { default: createFragment() }
	});

	var dropdown_initial_data = { open: state.open };
	var dropdown = new Dropdown({
		root: component.root,
		slots: { default: createFragment() },
		data: dropdown_initial_data
	});

	var button_46_initial_data = {
	 	class: "dropdown-toggle",
	 	color: "success"
	 };
	var button_46 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_46_initial_data
	});

	button_46.on("click", function(event) {
		component.set({ open2: !state.open2 });
	});

	var dropdownitem_2 = new DropdownItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var dropdownitem_3 = new DropdownItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var dropdownmenu_1 = new DropdownMenu({
		root: component.root,
		slots: { default: createFragment() }
	});

	var dropdown_1_initial_data = { open: state.open2, dropup: true };
	var dropdown_1 = new Dropdown({
		root: component.root,
		slots: { default: createFragment() },
		data: dropdown_1_initial_data
	});

	var row_3 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var row_4 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_5_initial_data = { lg: 6 };
	var col_5 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_5_initial_data
	});

	var col_6_initial_data = { lg: 6 };
	var col_6 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_6_initial_data
	});

	var row_5 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var table_initial_data = {
	 	striped: true,
	 	hover: true,
	 	bordered: true,
	 	responsive: true
	 };
	var table = new Table({
		root: component.root,
		slots: { default: createFragment() },
		data: table_initial_data
	});

	var col_7 = new Col({
		root: component.root,
		slots: { default: createFragment() }
	});

	var row_6 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var form_2 = new Form({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_8_initial_data = { lg: 6 };
	var col_8 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_8_initial_data
	});

	var formgroup = new FormGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var formgroup_1 = new FormGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var formgroup_2_initial_data = { color: "success" };
	var formgroup_2 = new FormGroup({
		root: component.root,
		slots: { default: createFragment() },
		data: formgroup_2_initial_data
	});

	var formgroup_3_initial_data = { color: "warning" };
	var formgroup_3 = new FormGroup({
		root: component.root,
		slots: { default: createFragment() },
		data: formgroup_3_initial_data
	});

	var formgroup_4_initial_data = { color: "danger" };
	var formgroup_4 = new FormGroup({
		root: component.root,
		slots: { default: createFragment() },
		data: formgroup_4_initial_data
	});

	var formgroup_5 = new FormGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var formgroup_6 = new FormGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var formgroup_7 = new FormGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var inputgroupaddon = new InputGroupAddon({
		root: component.root,
		slots: { default: createFragment() }
	});

	var inputgroupaddon_1 = new InputGroupAddon({
		root: component.root,
		slots: { default: createFragment() }
	});

	var inputgroup = new InputGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var formgroup_9 = new FormGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var formgroup_8 = new FormGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var form_3 = new Form({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_9_initial_data = { lg: { size: 4, offset: 1 } };
	var col_9 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_9_initial_data
	});

	var row_7 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_8_initial_data = { active: true, href: "#home" };
	var navlink_8 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_8_initial_data
	});

	var navitem_8 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_9_initial_data = { href: "#profile" };
	var navlink_9 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_9_initial_data
	});

	var navitem_9 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_10_initial_data = { disabled: true };
	var navlink_10 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_10_initial_data
	});

	var navitem_10 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var nav_3_initial_data = { tabs: true };
	var nav_3 = new Nav({
		root: component.root,
		slots: { default: createFragment() },
		data: nav_3_initial_data
	});

	var col_10_initial_data = { lg: 6 };
	var col_10 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_10_initial_data
	});

	var navlink_11_initial_data = { active: true };
	var navlink_11 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_11_initial_data
	});

	var navitem_11 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navdropdown = new NavDropdown({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_12 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_12 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_13_initial_data = { disabled: true };
	var navlink_13 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_13_initial_data
	});

	var navitem_13 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var nav_4_initial_data = { pills: true };
	var nav_4 = new Nav({
		root: component.root,
		slots: { default: createFragment() },
		data: nav_4_initial_data
	});

	var navlink_14_initial_data = { active: true };
	var navlink_14 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_14_initial_data
	});

	var navitem_14 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navdropdown_1 = new NavDropdown({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_15 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_15 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_16_initial_data = { disabled: true };
	var navlink_16 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_16_initial_data
	});

	var navitem_16 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var nav_5_initial_data = { pills: true, stacked: true };
	var nav_5 = new Nav({
		root: component.root,
		slots: { default: createFragment() },
		data: nav_5_initial_data
	});

	var col_11_initial_data = { lg: 6 };
	var col_11 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_11_initial_data
	});

	var row_8_initial_data = { class: "mb-2" };
	var row_8 = new Row({
		root: component.root,
		slots: { default: createFragment() },
		data: row_8_initial_data
	});

	var navlink_17_initial_data = { active: true, href: "#home" };
	var navlink_17 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_17_initial_data
	});

	var navitem_17 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_18_initial_data = { href: "#profile" };
	var navlink_18 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_18_initial_data
	});

	var navitem_18 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_19 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_19 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_20_initial_data = { disabled: true };
	var navlink_20 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_20_initial_data
	});

	var navitem_20 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var nav_6_initial_data = { pills: true, fill: true, class: "mb-2" };
	var nav_6 = new Nav({
		root: component.root,
		slots: { default: createFragment() },
		data: nav_6_initial_data
	});

	var navlink_21_initial_data = { active: true, href: "#home" };
	var navlink_21 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_21_initial_data
	});

	var navitem_21 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_22_initial_data = { href: "#profile" };
	var navlink_22 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_22_initial_data
	});

	var navitem_22 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_23 = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navitem_23 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var navlink_24_initial_data = { disabled: true };
	var navlink_24 = new NavLink({
		root: component.root,
		slots: { default: createFragment() },
		data: navlink_24_initial_data
	});

	var navitem_24 = new NavItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var nav_7_initial_data = { pills: true, justified: true };
	var nav_7 = new Nav({
		root: component.root,
		slots: { default: createFragment() },
		data: nav_7_initial_data
	});

	var breadcrumbitem_initial_data = { active: true };
	var breadcrumbitem = new BreadcrumbItem({
		root: component.root,
		slots: { default: createFragment() },
		data: breadcrumbitem_initial_data
	});

	var breadcrumb = new Breadcrumb({
		root: component.root,
		slots: { default: createFragment() }
	});

	var breadcrumbitem_1 = new BreadcrumbItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var breadcrumbitem_2_initial_data = { active: true };
	var breadcrumbitem_2 = new BreadcrumbItem({
		root: component.root,
		slots: { default: createFragment() },
		data: breadcrumbitem_2_initial_data
	});

	var breadcrumb_1 = new Breadcrumb({
		root: component.root,
		slots: { default: createFragment() }
	});

	var breadcrumbitem_3 = new BreadcrumbItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var breadcrumbitem_4 = new BreadcrumbItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var breadcrumbitem_5_initial_data = { active: true };
	var breadcrumbitem_5 = new BreadcrumbItem({
		root: component.root,
		slots: { default: createFragment() },
		data: breadcrumbitem_5_initial_data
	});

	var breadcrumb_2 = new Breadcrumb({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_12 = new Col({
		root: component.root,
		slots: { default: createFragment() }
	});

	var each_value_1 = [null, 'lg', 'sm'];

	var each_1_blocks = [];

	for (var i = 0; i < each_value_1.length; i += 1) {
		each_1_blocks[i] = create_each_block_1(component, assign(assign({}, state), {
			each_value_1: each_value_1,
			size: each_value_1[i],
			size_index: i
		}));
	}

	var col_13 = new Col({
		root: component.root,
		slots: { default: createFragment() }
	});

	var row_9 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var alert = new Alert({
		root: component.root,
		slots: { default: createFragment() }
	});

	var each_value_2 = ['success', 'info', 'warning', 'danger'];

	var each_2_blocks = [];

	for (var i = 0; i < each_value_2.length; i += 1) {
		each_2_blocks[i] = create_each_block_2(component, assign(assign({}, state), {
			each_value_2: each_value_2,
			color: each_value_2[i],
			color_index: i
		}));
	}

	var row_10 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var badge = new Badge({
		root: component.root,
		slots: { default: createFragment() }
	});

	var badge_1_initial_data = { color: "primary" };
	var badge_1 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_1_initial_data
	});

	var badge_2_initial_data = { color: "success" };
	var badge_2 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_2_initial_data
	});

	var badge_3_initial_data = { color: "warning" };
	var badge_3 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_3_initial_data
	});

	var badge_4_initial_data = { color: "danger" };
	var badge_4 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_4_initial_data
	});

	var badge_5_initial_data = { color: "info" };
	var badge_5 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_5_initial_data
	});

	var badge_6_initial_data = { pill: true };
	var badge_6 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_6_initial_data
	});

	var badge_7_initial_data = { pill: true, color: "primary" };
	var badge_7 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_7_initial_data
	});

	var badge_8_initial_data = { pill: true, color: "success" };
	var badge_8 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_8_initial_data
	});

	var badge_9_initial_data = { pill: true, color: "warning" };
	var badge_9 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_9_initial_data
	});

	var badge_10_initial_data = { pill: true, color: "danger" };
	var badge_10 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_10_initial_data
	});

	var badge_11_initial_data = { pill: true, color: "info" };
	var badge_11 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_11_initial_data
	});

	var progress_initial_data = { value: 25, min: 0, max: 100 };
	var progress = new Progress({
		root: component.root,
		data: progress_initial_data
	});

	var progress_1_initial_data = {
	 	color: "success",
	 	value: 25,
	 	min: 0,
	 	max: 100
	 };
	var progress_1 = new Progress({
		root: component.root,
		data: progress_1_initial_data
	});

	var progress_2_initial_data = {
	 	color: "info",
	 	value: 50,
	 	min: 0,
	 	max: 100
	 };
	var progress_2 = new Progress({
		root: component.root,
		data: progress_2_initial_data
	});

	var progress_3_initial_data = {
	 	color: "warning",
	 	value: 75,
	 	min: 0,
	 	max: 100
	 };
	var progress_3 = new Progress({
		root: component.root,
		data: progress_3_initial_data
	});

	var progress_4_initial_data = {
	 	color: "danger",
	 	value: 100,
	 	min: 0,
	 	max: 100
	 };
	var progress_4 = new Progress({
		root: component.root,
		data: progress_4_initial_data
	});

	var progress_6_initial_data = { bar: true, value: 25 };
	var progress_6 = new Progress({
		root: component.root,
		data: progress_6_initial_data
	});

	var progress_7_initial_data = { bar: true, color: "success", value: 30 };
	var progress_7 = new Progress({
		root: component.root,
		data: progress_7_initial_data
	});

	var progress_8_initial_data = { bar: true, color: "info", value: 20 };
	var progress_8 = new Progress({
		root: component.root,
		data: progress_8_initial_data
	});

	var progress_5_initial_data = { multi: true };
	var progress_5 = new Progress({
		root: component.root,
		slots: { default: createFragment() },
		data: progress_5_initial_data
	});

	var progress_9_initial_data = {
	 	striped: true,
	 	value: 15,
	 	min: 0,
	 	max: 100
	 };
	var progress_9 = new Progress({
		root: component.root,
		data: progress_9_initial_data
	});

	var progress_10_initial_data = {
	 	striped: true,
	 	color: "success",
	 	value: 25,
	 	min: 0,
	 	max: 100
	 };
	var progress_10 = new Progress({
		root: component.root,
		data: progress_10_initial_data
	});

	var progress_11_initial_data = {
	 	striped: true,
	 	color: "info",
	 	value: 50,
	 	min: 0,
	 	max: 100
	 };
	var progress_11 = new Progress({
		root: component.root,
		data: progress_11_initial_data
	});

	var progress_12_initial_data = {
	 	striped: true,
	 	color: "warning",
	 	value: 75,
	 	min: 0,
	 	max: 100
	 };
	var progress_12 = new Progress({
		root: component.root,
		data: progress_12_initial_data
	});

	var progress_13_initial_data = {
	 	striped: true,
	 	color: "danger",
	 	value: 100,
	 	min: 0,
	 	max: 100
	 };
	var progress_13 = new Progress({
		root: component.root,
		data: progress_13_initial_data
	});

	var progress_14_initial_data = {
	 	animated: true,
	 	striped: true,
	 	value: 15,
	 	min: 0,
	 	max: 100
	 };
	var progress_14 = new Progress({
		root: component.root,
		data: progress_14_initial_data
	});

	var progress_15_initial_data = {
	 	animated: true,
	 	striped: true,
	 	color: "success",
	 	value: 25,
	 	min: 0,
	 	max: 100
	 };
	var progress_15 = new Progress({
		root: component.root,
		data: progress_15_initial_data
	});

	var progress_16_initial_data = {
	 	animated: true,
	 	striped: true,
	 	color: "info",
	 	value: 50,
	 	min: 0,
	 	max: 100
	 };
	var progress_16 = new Progress({
		root: component.root,
		data: progress_16_initial_data
	});

	var progress_17_initial_data = {
	 	animated: true,
	 	striped: true,
	 	color: "warning",
	 	value: 75,
	 	min: 0,
	 	max: 100
	 };
	var progress_17 = new Progress({
		root: component.root,
		data: progress_17_initial_data
	});

	var progress_18_initial_data = {
	 	animated: true,
	 	striped: true,
	 	color: "danger",
	 	value: 100,
	 	min: 0,
	 	max: 100
	 };
	var progress_18 = new Progress({
		root: component.root,
		data: progress_18_initial_data
	});

	var col_14_initial_data = { lg: 12 };
	var col_14 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_14_initial_data
	});

	var row_11 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var button_48_initial_data = { color: "primary", size: "lg" };
	var button_48 = new Button({
		root: component.root,
		slots: { default: createFragment() },
		data: button_48_initial_data
	});

	var jumbotron = new Jumbotron({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_15_initial_data = { lg: 12 };
	var col_15 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_15_initial_data
	});

	var row_12 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var badge_12_initial_data = { pill: true };
	var badge_12 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_12_initial_data
	});

	var listgroupitem_10_initial_data = { class: "justify-content-between" };
	var listgroupitem_10 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_10_initial_data
	});

	var badge_13_initial_data = { pill: true };
	var badge_13 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_13_initial_data
	});

	var listgroupitem_11_initial_data = { class: "justify-content-between" };
	var listgroupitem_11 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_11_initial_data
	});

	var badge_14_initial_data = { pill: true };
	var badge_14 = new Badge({
		root: component.root,
		slots: { default: createFragment() },
		data: badge_14_initial_data
	});

	var listgroupitem_12_initial_data = { class: "justify-content-between" };
	var listgroupitem_12 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_12_initial_data
	});

	var listgroup_1 = new ListGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_16_initial_data = { lg: 4 };
	var col_16 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_16_initial_data
	});

	var listgroupitem_13_initial_data = { action: true, active: true };
	var listgroupitem_13 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_13_initial_data
	});

	var listgroupitem_14_initial_data = { action: true };
	var listgroupitem_14 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_14_initial_data
	});

	var listgroupitem_15_initial_data = { action: true, disabled: true };
	var listgroupitem_15 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_15_initial_data
	});

	var listgroup_2 = new ListGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_17_initial_data = { lg: 4 };
	var col_17 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_17_initial_data
	});

	var listgroupitemheading = new ListGroupItemHeading({
		root: component.root,
		slots: { default: createFragment() }
	});

	var listgroupitemtext = new ListGroupItemText({
		root: component.root,
		slots: { default: createFragment() }
	});

	var listgroupitem_16_initial_data = { action: true, active: true };
	var listgroupitem_16 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_16_initial_data
	});

	var listgroupitemheading_1 = new ListGroupItemHeading({
		root: component.root,
		slots: { default: createFragment() }
	});

	var listgroupitemtext_1 = new ListGroupItemText({
		root: component.root,
		slots: { default: createFragment() }
	});

	var listgroupitem_17_initial_data = { action: true };
	var listgroupitem_17 = new ListGroupItem({
		root: component.root,
		slots: { default: createFragment() },
		data: listgroupitem_17_initial_data
	});

	var listgroup_3 = new ListGroup({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_18_initial_data = { lg: 4 };
	var col_18 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_18_initial_data
	});

	var row_13 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var each_value_3 = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];

	var each_3_blocks = [];

	for (var i = 0; i < each_value_3.length; i += 1) {
		each_3_blocks[i] = create_each_block_3(component, assign(assign({}, state), {
			each_value_3: each_value_3,
			color: each_value_3[i],
			color_index_1: i
		}));
	}

	var col_19_initial_data = { lg: 4 };
	var col_19 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_19_initial_data
	});

	var each_value_4 = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];

	var each_4_blocks = [];

	for (var i = 0; i < each_value_4.length; i += 1) {
		each_4_blocks[i] = create_each_block_4(component, assign(assign({}, state), {
			each_value_4: each_value_4,
			color: each_value_4[i],
			color_index_2: i
		}));
	}

	var col_20_initial_data = { lg: 4 };
	var col_20 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_20_initial_data
	});

	var cardheader = new CardHeader({
		root: component.root,
		slots: { default: createFragment() }
	});

	var cardtitle = new CardTitle({
		root: component.root,
		slots: { default: createFragment() }
	});

	var cardsubtitle_initial_data = { class: "text-muted" };
	var cardsubtitle = new CardSubtitle({
		root: component.root,
		slots: { default: createFragment() },
		data: cardsubtitle_initial_data
	});

	var cardbody = new CardBody({
		root: component.root,
		slots: { default: createFragment() }
	});

	var cardbody_1 = new CardBody({
		root: component.root,
		slots: { default: createFragment() }
	});

	var cardfooter_initial_data = { class: "text-muted text-xs-center" };
	var cardfooter = new CardFooter({
		root: component.root,
		slots: { default: createFragment() },
		data: cardfooter_initial_data
	});

	var card = new Card({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_21_initial_data = { lg: 4 };
	var col_21 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_21_initial_data
	});

	var row_14 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var mediabody = new MediaBody({
		root: component.root,
		slots: { default: createFragment() }
	});

	var media = new Media({
		root: component.root,
		slots: { default: createFragment() }
	});

	var row_15 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_22_initial_data = { lg: 6 };
	var col_22 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_22_initial_data
	});

	var col_23_initial_data = { lg: 6 };
	var col_23 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_23_initial_data
	});

	var row_16 = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var col_1_initial_data = { sm: 9 };
	var col_1 = new Col({
		root: component.root,
		slots: { default: createFragment() },
		data: col_1_initial_data
	});

	var row = new Row({
		root: component.root,
		slots: { default: createFragment() }
	});

	var container_initial_data = { fluid: true };
	var container = new Container({
		root: component.root,
		slots: { default: createFragment() },
		data: container_initial_data
	});

	return {
		c: function create() {
			nav = createElement("nav");
			text = createText("\n    ");
			img = createElement("img");
			text_1 = createText("\n  ");
			navbarbrand._fragment.c();
			text_2 = createText("\n  ");
			ul = createElement("ul");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			text_4 = createText("\n\n");
			text_5 = createText("\n  ");
			text_6 = createText("\n    ");
			text_7 = createText("\n      ");
			div = createElement("div");
			text_8 = createText("\n          ");
			a = createElement("a");
			text_9 = createText("Navbars");
			listgroupitem._fragment.c();
			text_10 = createText("\n          ");
			a_1 = createElement("a");
			text_11 = createText("Buttons");
			listgroupitem_1._fragment.c();
			text_12 = createText("\n          ");
			a_2 = createElement("a");
			text_13 = createText("Typography");
			listgroupitem_2._fragment.c();
			text_14 = createText("\n          ");
			a_3 = createElement("a");
			text_15 = createText("Tables");
			listgroupitem_3._fragment.c();
			text_16 = createText("\n          ");
			a_4 = createElement("a");
			text_17 = createText("Forms");
			listgroupitem_4._fragment.c();
			text_18 = createText("\n          ");
			a_5 = createElement("a");
			text_19 = createText("Navs");
			listgroupitem_5._fragment.c();
			text_20 = createText("\n          ");
			a_6 = createElement("a");
			text_21 = createText("Indicators");
			listgroupitem_6._fragment.c();
			text_22 = createText("\n          ");
			a_7 = createElement("a");
			text_23 = createText("Progress");
			listgroupitem_7._fragment.c();
			text_24 = createText("\n          ");
			a_8 = createElement("a");
			text_25 = createText("Containers");
			listgroupitem_8._fragment.c();
			text_26 = createText("\n          ");
			a_9 = createElement("a");
			text_27 = createText("Dialogs");
			listgroupitem_9._fragment.c();
			text_28 = createText("\n        ");
			listgroup._fragment.c();
			text_30 = createText("\n    ");
			col._fragment.c();
			text_31 = createText("\n  \n  ");
			text_32 = createText("\n  ");
			text_33 = createText("\n  ");
			div_1 = createElement("div");
			text_34 = createText("\n      ");
			text_35 = createText("\n        ");
			h1 = createElement("h1");
			text_36 = createText("Navbars");
			text_37 = createText("\n\n        ");
			div_2 = createElement("div");
			nav_1 = createElement("nav");
			button = createElement("button");
			button.innerHTML = "<span class=\"navbar-toggler-icon\"></span>";
			text_39 = createText("\n            ");
			a_10 = createElement("a");
			a_10.textContent = "Navbar";
			text_41 = createText("\n\n            ");
			div_3 = createElement("div");
			ul_1 = createElement("ul");
			text_42 = createText("\n                  ");
			text_43 = createText("Home ");
			span_1 = createElement("span");
			text_44 = createText("(current)");
			navlink._fragment.c();
			text_45 = createText("\n                ");
			navitem._fragment.c();
			text_46 = createText("\n                  ");
			text_47 = createText("Features");
			navlink_1._fragment.c();
			text_48 = createText("\n                ");
			navitem_1._fragment.c();
			text_49 = createText("\n                  ");
			text_50 = createText("Pricing");
			navlink_2._fragment.c();
			text_51 = createText("\n                ");
			navitem_2._fragment.c();
			text_52 = createText("\n                  ");
			text_53 = createText("About");
			navlink_3._fragment.c();
			text_54 = createText("\n                ");
			navitem_3._fragment.c();
			text_55 = createText("\n              ");
			text_56 = createText("\n                ");
			input = createElement("input");
			text_57 = createText("\n                ");
			text_58 = createText("Search");
			button_1._fragment.c();
			text_59 = createText("\n              ");
			form._fragment.c();
			text_63 = createText("\n\n        ");
			div_4 = createElement("div");
			nav_2 = createElement("nav");
			button_2 = createElement("button");
			button_2.innerHTML = "<span class=\"navbar-toggler-icon\"></span>";
			text_65 = createText("\n            ");
			a_11 = createElement("a");
			text_66 = createText("Navbar");
			navbarbrand_1._fragment.c();
			text_67 = createText("\n\n            ");
			div_5 = createElement("div");
			ul_2 = createElement("ul");
			text_68 = createText("\n                  ");
			text_69 = createText("Home ");
			span_3 = createElement("span");
			text_70 = createText("(current)");
			navlink_4._fragment.c();
			text_71 = createText("\n                ");
			navitem_4._fragment.c();
			text_72 = createText("\n                  ");
			text_73 = createText("Features");
			navlink_5._fragment.c();
			text_74 = createText("\n                ");
			navitem_5._fragment.c();
			text_75 = createText("\n                  ");
			text_76 = createText("Pricing");
			navlink_6._fragment.c();
			text_77 = createText("\n                ");
			navitem_6._fragment.c();
			text_78 = createText("\n                  ");
			text_79 = createText("About");
			navlink_7._fragment.c();
			text_80 = createText("\n                ");
			navitem_7._fragment.c();
			text_81 = createText("\n              ");
			text_82 = createText("\n                ");
			input_1 = createElement("input");
			text_83 = createText("\n                ");
			text_84 = createText("Search");
			button_3._fragment.c();
			text_85 = createText("\n              ");
			form_1._fragment.c();
			text_89 = createText("\n\n      ");
			col_2._fragment.c();
			text_90 = createText("\n    ");
			row_1._fragment.c();
			text_92 = createText("\n\n\n  ");
			text_93 = createText("\n  ");
			div_6 = createElement("div");
			h1_1 = createElement("h1");
			h1_1.textContent = "Buttons";
			text_95 = createText("\n\n    ");
			text_96 = createText("\n      ");
			text_97 = createText("\n\n        ");
			p = createElement("p");
			text_98 = createText("Primary");
			button_4._fragment.c();
			text_99 = createText("\n          ");
			text_100 = createText("Secondary");
			button_5._fragment.c();
			text_101 = createText("\n          ");
			text_102 = createText("Success");
			button_6._fragment.c();
			text_103 = createText("\n          ");
			text_104 = createText("Info");
			button_7._fragment.c();
			text_105 = createText("\n          ");
			text_106 = createText("Warning");
			button_8._fragment.c();
			text_107 = createText("\n          ");
			text_108 = createText("Danger");
			button_9._fragment.c();
			text_109 = createText("\n          ");
			text_110 = createText("Link");
			button_10._fragment.c();
			text_112 = createText("\n\n        ");
			p_1 = createElement("p");
			text_113 = createText("Primary");
			button_11._fragment.c();
			text_114 = createText("\n          ");
			text_115 = createText("Secondary");
			button_12._fragment.c();
			text_116 = createText("\n          ");
			text_117 = createText("Success");
			button_13._fragment.c();
			text_118 = createText("\n          ");
			text_119 = createText("Info");
			button_14._fragment.c();
			text_120 = createText("\n          ");
			text_121 = createText("Warning");
			button_15._fragment.c();
			text_122 = createText("\n          ");
			text_123 = createText("Danger");
			button_16._fragment.c();
			text_124 = createText("\n          ");
			text_125 = createText("Link");
			button_17._fragment.c();
			text_127 = createText("\n\n        ");
			p_2 = createElement("p");
			text_128 = createText("Primary");
			button_18._fragment.c();
			text_129 = createText("\n          ");
			text_130 = createText("Secondary");
			button_19._fragment.c();
			text_131 = createText("\n          ");
			text_132 = createText("Success");
			button_20._fragment.c();
			text_133 = createText("\n          ");
			text_134 = createText("Info");
			button_21._fragment.c();
			text_135 = createText("\n          ");
			text_136 = createText("Warning");
			button_22._fragment.c();
			text_137 = createText("\n          ");
			text_138 = createText("Danger");
			button_23._fragment.c();
			text_140 = createText("\n\n        ");
			div_7 = createElement("div");
			text_141 = createText("Large button");
			button_24._fragment.c();
			text_142 = createText("\n          ");
			text_143 = createText("Default button");
			button_25._fragment.c();
			text_144 = createText("\n          ");
			text_145 = createText("Small button");
			button_26._fragment.c();
			text_147 = createText("\n\n      ");
			col_3._fragment.c();
			text_148 = createText("\n      ");
			text_149 = createText("\n\n        ");
			p_3 = createElement("p");
			text_150 = createText("Block level button");
			button_27._fragment.c();
			text_152 = createText("\n\n        ");
			div_8 = createElement("div");
			div_9 = createElement("div");
			div_9.innerHTML = "<label class=\"btn btn-primary active\"><input type=\"checkbox\" checked=\"\"> Checkbox 1</label>\n            <label class=\"btn btn-primary\"><input type=\"checkbox\"> Checkbox 2</label>\n            <label class=\"btn btn-primary\"><input type=\"checkbox\"> Checkbox 3</label>";
			text_160 = createText("\n\n        ");
			div_10 = createElement("div");
			div_11 = createElement("div");
			div_11.innerHTML = "<label class=\"btn btn-primary active\"><input type=\"radio\" name=\"options\" id=\"option1\" checked=\"\"> Radio 1</label>\n            <label class=\"btn btn-primary\"><input type=\"radio\" name=\"options\" id=\"option2\"> Radio 2</label>\n            <label class=\"btn btn-primary\"><input type=\"radio\" name=\"options\" id=\"option3\"> Radio 3</label>";
			text_168 = createText("\n\n        ");
			div_12 = createElement("div");
			text_169 = createText("\n            ");
			text_170 = createText("Button");
			button_28._fragment.c();
			text_171 = createText("\n            ");
			text_172 = createText("Button");
			button_29._fragment.c();
			text_173 = createText("\n            ");
			text_174 = createText("Button");
			button_30._fragment.c();
			text_175 = createText("\n            ");
			text_176 = createText("Button");
			button_31._fragment.c();
			text_177 = createText("\n            ");
			text_178 = createText("Button");
			button_32._fragment.c();
			text_179 = createText("\n            ");
			text_180 = createText("Button");
			button_33._fragment.c();
			text_181 = createText("\n          ");
			buttongroup._fragment.c();
			text_183 = createText("\n\n        ");
			div_13 = createElement("div");
			text_184 = createText("\n            ");
			text_185 = createText("Left");
			button_34._fragment.c();
			text_186 = createText("\n            ");
			text_187 = createText("Middle");
			button_35._fragment.c();
			text_188 = createText("\n            ");
			text_189 = createText("Right");
			button_36._fragment.c();
			text_190 = createText("\n          ");
			buttongroup_1._fragment.c();
			text_192 = createText("\n\n        ");
			div_14 = createElement("div");
			text_193 = createText("\n            ");
			text_194 = createText("\n              ");
			text_195 = createText("1");
			button_37._fragment.c();
			text_196 = createText("\n              ");
			text_197 = createText("2");
			button_38._fragment.c();
			text_198 = createText("\n              ");
			text_199 = createText("3");
			button_39._fragment.c();
			text_200 = createText("\n              ");
			text_201 = createText("4");
			button_40._fragment.c();
			text_202 = createText("\n            ");
			buttongroup_2._fragment.c();
			text_203 = createText("\n            ");
			text_204 = createText("\n              ");
			text_205 = createText("5");
			button_41._fragment.c();
			text_206 = createText("\n              ");
			text_207 = createText("6");
			button_42._fragment.c();
			text_208 = createText("\n              ");
			text_209 = createText("7");
			button_43._fragment.c();
			text_210 = createText("\n            ");
			buttongroup_3._fragment.c();
			text_211 = createText("\n            ");
			text_212 = createText("\n              ");
			text_213 = createText("8");
			button_44._fragment.c();
			text_214 = createText("\n            ");
			buttongroup_4._fragment.c();
			text_215 = createText("\n          ");
			buttontoolbar._fragment.c();
			text_217 = createText("\n\n      ");
			col_4._fragment.c();
			text_218 = createText("\n    ");
			row_2._fragment.c();
			text_219 = createText("\n    \n    ");
			text_220 = createText("\n      ");
			div_15 = createElement("div");
			h2 = createElement("h2");
			h2.textContent = "Dropdowns";
			text_222 = createText("\n        ");
			h4 = createElement("h4");
			h4.textContent = "Dropdown";
			text_224 = createText("\n\n        ");
			text_225 = createText("\n          ");
			text_226 = createText("\n            Dropdown\n          ");
			button_45._fragment.c();
			text_227 = createText("\n          ");
			text_228 = createText("\n            ");
			text_229 = createText("Heading");
			dropdownheader._fragment.c();
			text_230 = createText("\n            ");
			text_231 = createText("\n              ");
			a_12 = createElement("a");
			text_232 = createText("Dropdown link");
			text_233 = createText("\n            ");
			dropdownitem._fragment.c();
			text_234 = createText("\n            ");
			dropdowndivider._fragment.c();
			text_235 = createText("\n            ");
			text_236 = createText("\n              ");
			a_13 = createElement("a");
			text_237 = createText("Dropdown link");
			text_238 = createText("\n            ");
			dropdownitem_1._fragment.c();
			text_239 = createText("\n          ");
			dropdownmenu._fragment.c();
			text_240 = createText("\n        ");
			dropdown._fragment.c();
			text_241 = createText("\n\n        ");
			h4_1 = createElement("h4");
			h4_1.textContent = "Dropup";
			text_243 = createText("\n\n        ");
			text_244 = createText("\n          ");
			text_245 = createText("\n            Dropup\n          ");
			button_46._fragment.c();
			text_246 = createText("\n          ");
			text_247 = createText("\n            ");
			text_248 = createText("Dropdown link");
			dropdownitem_2._fragment.c();
			text_249 = createText("\n            ");
			text_250 = createText("Dropdown link");
			dropdownitem_3._fragment.c();
			text_251 = createText("\n          ");
			dropdownmenu_1._fragment.c();
			text_252 = createText("\n        ");
			dropdown_1._fragment.c();
			text_254 = createText("\n    ");
			row_3._fragment.c();
			text_256 = createText("\n\n  ");
			text_257 = createText("\n  ");
			div_16 = createElement("div");
			h1_2 = createElement("h1");
			h1_2.textContent = "Typography";
			text_259 = createText("\n\n    \n\n    ");
			text_260 = createText("\n      ");
			div_17 = createElement("div");
			div_18 = createElement("div");
			div_18.innerHTML = "<h1>Heading 1</h1>\n          <h2>Heading 2</h2>\n          <h3>Heading 3</h3>\n          <h4>Heading 4</h4>\n          <h5>Heading 5</h5>\n          <h6>Heading 6</h6>\n          <h3>Heading\n            <small class=\"text-muted\">with muted text</small></h3>\n          <p class=\"lead\">Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>";
			text_280 = createText("\n      ");
			div_19 = createElement("div");
			div_20 = createElement("div");
			div_20.innerHTML = "<h2>Example body text</h2>\n          <p>Nullam quis risus eget <a>urna mollis ornare</a> vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.</p>\n          <p><small>This line of text is meant to be treated as fine print.</small></p>\n          <p>The following is <strong>rendered as bold text</strong>.</p>\n          <p>The following is <em>rendered as italicized text</em>.</p>\n          <p>An abbreviation of the word attribute is <abbr title=\"attribute\">attr</abbr>.</p>";
			text_302 = createText("\n      ");
			div_21 = createElement("div");
			div_22 = createElement("div");
			div_22.innerHTML = "<h2>Emphasis classes</h2>\n          <p class=\"text-muted\">Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh.</p>\n          <p class=\"text-primary\">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>\n          <p class=\"text-warning\">Etiam porta sem malesuada magna mollis euismod.</p>\n          <p class=\"text-danger\">Donec ullamcorper nulla non metus auctor fringilla.</p>\n          <p class=\"text-success\">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>\n          <p class=\"text-info\">Maecenas sed diam eget risus varius blandit sit amet non magna.</p>";
			text_318 = createText("\n    ");
			row_4._fragment.c();
			text_319 = createText("\n\n    \n\n    ");
			h2_4 = createElement("h2");
			h2_4.textContent = "Blockquotes";
			text_321 = createText("\n\n    ");
			text_322 = createText("\n      ");
			text_323 = createText("\n        ");
			blockquote = createElement("blockquote");
			p_16 = createElement("p");
			p_16.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.";
			text_325 = createText("\n          ");
			footer = createElement("footer");
			footer.innerHTML = "Someone famous in <cite title=\"Source Title\">Source Title</cite>";
			text_329 = createText("\n      ");
			col_5._fragment.c();
			text_330 = createText("\n      ");
			text_331 = createText("\n        ");
			blockquote_1 = createElement("blockquote");
			p_17 = createElement("p");
			p_17.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.";
			text_333 = createText("\n          ");
			footer_1 = createElement("footer");
			footer_1.innerHTML = "Someone famous in <cite title=\"Source Title\">Source Title</cite>";
			text_337 = createText("\n      ");
			col_6._fragment.c();
			text_338 = createText("\n    ");
			row_5._fragment.c();
			text_340 = createText("\n\n  ");
			text_341 = createText("\n  ");
			div_23 = createElement("div");
			h1_4 = createElement("h1");
			h1_4.textContent = "Tables";
			text_343 = createText("\n    ");
			text_344 = createText("\n      ");
			text_345 = createText("\n        ");
			text_346 = createText("\n            ");
			thead = createElement("thead");
			tr = createElement("tr");
			tr.innerHTML = "<th>#</th>\n                <th>Column heading</th>\n                <th>Column heading</th>\n                <th>Column heading</th>";
			text_356 = createText("\n            ");
			tbody = createElement("tbody");
			tr_1 = createElement("tr");
			tr_1.innerHTML = "<td>1</td>\n                <td>Column content</td>\n                <td>Column content</td>\n                <td>Column content</td>";
			text_365 = createText("\n              ");
			tr_2 = createElement("tr");
			tr_2.innerHTML = "<td>2</td>\n                <td>Column content</td>\n                <td>Column content</td>\n                <td>Column content</td>";
			text_374 = createText("\n              ");
			tr_3 = createElement("tr");
			tr_3.innerHTML = "<td>3</td>\n                <td>Column content</td>\n                <td>Column content</td>\n                <td>Column content</td>";
			text_383 = createText("\n              ");
			tr_4 = createElement("tr");
			tr_4.innerHTML = "<td>4</td>\n                <td>Column content</td>\n                <td>Column content</td>\n                <td>Column content</td>";
			text_392 = createText("\n              ");
			tr_5 = createElement("tr");
			tr_5.innerHTML = "<td>5</td>\n                <td>Column content</td>\n                <td>Column content</td>\n                <td>Column content</td>";
			text_401 = createText("\n              ");
			tr_6 = createElement("tr");
			tr_6.innerHTML = "<td>6</td>\n                <td>Column content</td>\n                <td>Column content</td>\n                <td>Column content</td>";
			text_410 = createText("\n              ");
			tr_7 = createElement("tr");
			tr_7.innerHTML = "<td>7</td>\n                <td>Column content</td>\n                <td>Column content</td>\n                <td>Column content</td>";
			text_420 = createText("\n          ");
			table._fragment.c();
			text_421 = createText("\n      ");
			col_7._fragment.c();
			text_422 = createText("\n    ");
			row_6._fragment.c();
			text_424 = createText("\n\n  ");
			text_425 = createText("\n  ");
			div_24 = createElement("div");
			h1_5 = createElement("h1");
			h1_5.textContent = "Forms";
			text_427 = createText("\n\n    ");
			text_428 = createText("\n      ");
			text_429 = createText("\n        ");
			text_430 = createText("\n          ");
			fieldset = createElement("fieldset");
			legend = createElement("legend");
			legend.textContent = "Legend";
			text_432 = createText("\n            ");
			div_25 = createElement("div");
			div_25.innerHTML = "<label for=\"exampleInputEmail1\">Email address</label>\n              <input type=\"email\" class=\"form-control\" id=\"exampleInputEmail1\" aria-describedby=\"emailHelp\" placeholder=\"Enter email\">\n              <small id=\"emailHelp\" class=\"form-text text-muted\">We'll never share your email with anyone else.</small>";
			text_438 = createText("\n            ");
			div_26 = createElement("div");
			div_26.innerHTML = "<label for=\"exampleInputPassword1\">Password</label>\n              <input type=\"password\" class=\"form-control\" id=\"exampleInputPassword1\" placeholder=\"Password\">";
			text_442 = createText("\n            ");
			div_27 = createElement("div");
			label_8 = createElement("label");
			label_8.textContent = "Example select";
			text_444 = createText("\n              ");
			select = createElement("select");
			option = createElement("option");
			text_445 = createText("1");
			option_1 = createElement("option");
			text_446 = createText("2");
			option_2 = createElement("option");
			text_447 = createText("3");
			option_3 = createElement("option");
			text_448 = createText("4");
			option_4 = createElement("option");
			text_449 = createText("5");
			text_451 = createText("\n            ");
			div_28 = createElement("div");
			label_9 = createElement("label");
			label_9.textContent = "Example multiple select";
			text_453 = createText("\n              ");
			select_1 = createElement("select");
			option_5 = createElement("option");
			text_454 = createText("1");
			option_6 = createElement("option");
			text_455 = createText("2");
			option_7 = createElement("option");
			text_456 = createText("3");
			option_8 = createElement("option");
			text_457 = createText("4");
			option_9 = createElement("option");
			text_458 = createText("5");
			text_460 = createText("\n            ");
			div_29 = createElement("div");
			div_29.innerHTML = "<label for=\"exampleTextarea\">Example textarea</label>\n              <textarea class=\"form-control\" id=\"exampleTextarea\" rows=\"3\"></textarea>";
			text_464 = createText("\n            ");
			div_30 = createElement("div");
			div_30.innerHTML = "<label for=\"exampleInputFile\">File input</label>\n              <input type=\"file\" class=\"form-control-file\" id=\"exampleInputFile\" aria-describedby=\"fileHelp\">\n              <small id=\"fileHelp\" class=\"form-text text-muted\">This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line.</small>";
			text_470 = createText("\n            ");
			fieldset_1 = createElement("fieldset");
			fieldset_1.innerHTML = "<legend>Radio buttons</legend>\n              <div class=\"form-check\"><label class=\"form-check-label\"><input type=\"radio\" class=\"form-check-input\" name=\"optionsRadios\" id=\"optionsRadios1\" value=\"option1\" checked=\"\">\n                      Option one is this and that—be sure to include why it's great</label></div>\n              <div class=\"form-check\"><label class=\"form-check-label\"><input type=\"radio\" class=\"form-check-input\" name=\"optionsRadios\" id=\"optionsRadios2\" value=\"option2\">\n                      Option two can be something else and selecting it will deselect option one</label></div>\n              <div class=\"form-check disabled\"><label class=\"form-check-label\"><input type=\"radio\" class=\"form-check-input\" name=\"optionsRadios\" id=\"optionsRadios3\" value=\"option3\" disabled=\"\">\n                      Option three is disabled</label></div>";
			text_482 = createText("\n            ");
			div_34 = createElement("div");
			div_34.innerHTML = "<label class=\"form-check-label\"><input type=\"checkbox\" class=\"form-check-input\">\n                    Check me out</label>";
			text_485 = createText("\n            ");
			button_47 = createElement("button");
			button_47.textContent = "Submit";
			text_488 = createText("\n        ");
			form_2._fragment.c();
			text_489 = createText("\n\n      ");
			col_8._fragment.c();
			text_490 = createText("\n\n      ");
			text_491 = createText("\n        ");
			text_492 = createText("\n\n          ");
			text_493 = createText("\n            ");
			fieldset_2 = createElement("fieldset");
			label_16 = createElement("label");
			label_16.textContent = "Disabled input";
			text_495 = createText("\n              ");
			input_15 = createElement("input");
			text_497 = createText("\n          ");
			formgroup._fragment.c();
			text_498 = createText("\n\n          ");
			text_499 = createText("\n            ");
			fieldset_3 = createElement("fieldset");
			label_17 = createElement("label");
			label_17.textContent = "Readonly input";
			text_501 = createText("\n              ");
			input_16 = createElement("input");
			text_503 = createText("\n          ");
			formgroup_1._fragment.c();
			text_504 = createText("\n\n          ");
			text_505 = createText("\n            ");
			label_18 = createElement("label");
			text_506 = createText("Input with success");
			text_507 = createText("\n            ");
			input_17 = createElement("input");
			text_508 = createText("\n            ");
			div_35 = createElement("div");
			text_509 = createText("Success! You've done it.");
			text_510 = createText("\n          ");
			formgroup_2._fragment.c();
			text_511 = createText("\n\n          ");
			text_512 = createText("\n            ");
			label_19 = createElement("label");
			text_513 = createText("Input with warning");
			text_514 = createText("\n            ");
			input_18 = createElement("input");
			text_515 = createText("\n            ");
			div_36 = createElement("div");
			text_516 = createText("Shucks, try again.");
			text_517 = createText("\n          ");
			formgroup_3._fragment.c();
			text_518 = createText("\n\n          ");
			text_519 = createText("\n            ");
			label_20 = createElement("label");
			text_520 = createText("Input with danger");
			text_521 = createText("\n            ");
			input_19 = createElement("input");
			text_522 = createText("\n            ");
			div_37 = createElement("div");
			text_523 = createText("Sorry, that username's taken. Try another?");
			text_524 = createText("\n          ");
			formgroup_4._fragment.c();
			text_525 = createText("\n\n          ");
			text_526 = createText("\n            ");
			label_21 = createElement("label");
			text_527 = createText("Large input");
			text_528 = createText("\n            ");
			input_20 = createElement("input");
			text_529 = createText("\n          ");
			formgroup_5._fragment.c();
			text_530 = createText("\n\n          ");
			text_531 = createText("\n            ");
			label_22 = createElement("label");
			text_532 = createText("Default input");
			text_533 = createText("\n            ");
			input_21 = createElement("input");
			text_534 = createText("\n          ");
			formgroup_6._fragment.c();
			text_535 = createText("\n\n          ");
			text_536 = createText("\n            ");
			label_23 = createElement("label");
			text_537 = createText("Small input");
			text_538 = createText("\n            ");
			input_22 = createElement("input");
			text_539 = createText("\n          ");
			formgroup_7._fragment.c();
			text_540 = createText("\n\n          ");
			text_541 = createText("\n            ");
			label_24 = createElement("label");
			text_542 = createText("Input addons");
			text_543 = createText("\n            ");
			text_544 = createText("\n              ");
			label_25 = createElement("label");
			text_545 = createText("Amount (in dollars)");
			text_546 = createText("\n              ");
			text_547 = createText("\n                ");
			text_548 = createText("$");
			inputgroupaddon._fragment.c();
			text_549 = createText("\n                ");
			input_23 = createElement("input");
			text_550 = createText("\n                ");
			text_551 = createText(".00");
			inputgroupaddon_1._fragment.c();
			text_552 = createText("\n              ");
			inputgroup._fragment.c();
			text_553 = createText("\n            ");
			formgroup_9._fragment.c();
			text_554 = createText("\n          ");
			formgroup_8._fragment.c();
			text_555 = createText("\n        ");
			form_3._fragment.c();
			text_556 = createText("\n\n      ");
			col_9._fragment.c();
			text_557 = createText("\n    ");
			row_7._fragment.c();
			text_559 = createText("\n\n  ");
			text_560 = createText("\n  ");
			div_38 = createElement("div");
			h1_6 = createElement("h1");
			h1_6.textContent = "Navs";
			text_562 = createText("\n\n    ");
			text_563 = createText("\n      ");
			text_564 = createText("\n        ");
			h2_5 = createElement("h2");
			text_565 = createText("Tabs");
			text_566 = createText("\n        ");
			div_39 = createElement("div");
			text_567 = createText("\n            ");
			text_568 = createText("\n              ");
			text_569 = createText("Home");
			navlink_8._fragment.c();
			text_570 = createText("\n            ");
			navitem_8._fragment.c();
			text_571 = createText("\n            ");
			text_572 = createText("\n              ");
			text_573 = createText("Profile");
			navlink_9._fragment.c();
			text_574 = createText("\n            ");
			navitem_9._fragment.c();
			text_575 = createText("\n            ");
			text_576 = createText("\n              ");
			text_577 = createText("Disabled");
			navlink_10._fragment.c();
			text_578 = createText("\n            ");
			navitem_10._fragment.c();
			text_579 = createText("\n            ");
			li = createElement("li");
			a_15 = createElement("a");
			a_15.textContent = "Dropdown";
			text_581 = createText("\n              ");
			div_40 = createElement("div");
			div_40.innerHTML = "<a class=\"dropdown-item\">Action</a>\n                <a class=\"dropdown-item\">Another action</a>\n                <a class=\"dropdown-item\">Something else here</a>\n                <div class=\"dropdown-divider\"></div>\n                <a class=\"dropdown-item\">Separated link</a>";
			text_592 = createText("\n          ");
			nav_3._fragment.c();
			text_593 = createText("\n          ");
			div_42 = createElement("div");
			div_42.innerHTML = "<div class=\"tab-pane fade active in\" id=\"home\"><p>Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p></div>\n            <div class=\"tab-pane fade\" id=\"profile\"><p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit.</p></div>\n            <div class=\"tab-pane fade\" id=\"dropdown1\"><p>Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.</p></div>\n            <div class=\"tab-pane fade\" id=\"dropdown2\"><p>Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin. Cred vinyl keffiyeh DIY salvia PBR, banh mi before they sold out farm-to-table VHS viral locavore cosby sweater.</p></div>";
			text_607 = createText("\n      ");
			col_10._fragment.c();
			text_608 = createText("\n\n      ");
			text_609 = createText("\n        ");
			h2_6 = createElement("h2");
			text_610 = createText("Pills");
			text_611 = createText("\n        ");
			text_612 = createText("\n          ");
			text_613 = createText("\n            ");
			text_614 = createText("Active");
			navlink_11._fragment.c();
			text_615 = createText("\n          ");
			navitem_11._fragment.c();
			text_616 = createText("\n          ");
			text_617 = createText("\n            ");
			a_20 = createElement("a");
			text_618 = createText("Dropdown");
			text_619 = createText("\n            ");
			div_47 = createElement("div");
			a_21 = createElement("a");
			a_21.textContent = "Action";
			text_621 = createText("\n              ");
			a_22 = createElement("a");
			a_22.textContent = "Another action";
			text_623 = createText("\n              ");
			a_23 = createElement("a");
			a_23.textContent = "Something else here";
			text_625 = createText("\n              ");
			div_48 = createElement("div");
			text_626 = createText("\n              ");
			a_24 = createElement("a");
			a_24.textContent = "Separated link";
			text_629 = createText("\n          ");
			navdropdown._fragment.c();
			text_630 = createText("\n          ");
			text_631 = createText("\n            ");
			text_632 = createText("Link");
			navlink_12._fragment.c();
			text_633 = createText("\n          ");
			navitem_12._fragment.c();
			text_634 = createText("\n          ");
			text_635 = createText("\n            ");
			text_636 = createText("Disabled");
			navlink_13._fragment.c();
			text_637 = createText("\n          ");
			navitem_13._fragment.c();
			text_638 = createText("\n        ");
			nav_4._fragment.c();
			text_639 = createText("\n\n        ");
			br = createElement("br");
			text_640 = createText("\n        ");
			div_49 = createElement("div");
			text_641 = createText("\n            ");
			text_642 = createText("\n              ");
			text_643 = createText("Active");
			navlink_14._fragment.c();
			text_644 = createText("\n            ");
			navitem_14._fragment.c();
			text_645 = createText("\n            ");
			text_646 = createText("\n              ");
			a_25 = createElement("a");
			text_647 = createText("Dropdown");
			text_648 = createText("\n              ");
			div_50 = createElement("div");
			a_26 = createElement("a");
			a_26.textContent = "Action";
			text_650 = createText("\n                ");
			a_27 = createElement("a");
			a_27.textContent = "Another action";
			text_652 = createText("\n                ");
			a_28 = createElement("a");
			a_28.textContent = "Something else here";
			text_654 = createText("\n                ");
			div_51 = createElement("div");
			text_655 = createText("\n                ");
			a_29 = createElement("a");
			a_29.textContent = "Separated link";
			text_658 = createText("\n            ");
			navdropdown_1._fragment.c();
			text_659 = createText("\n            ");
			text_660 = createText("\n              ");
			text_661 = createText("Link");
			navlink_15._fragment.c();
			text_662 = createText("\n            ");
			navitem_15._fragment.c();
			text_663 = createText("\n            ");
			text_664 = createText("\n              ");
			text_665 = createText("Disabled");
			navlink_16._fragment.c();
			text_666 = createText("\n            ");
			navitem_16._fragment.c();
			text_667 = createText("\n          ");
			nav_5._fragment.c();
			text_669 = createText("\n      ");
			col_11._fragment.c();
			text_670 = createText("\n    ");
			row_8._fragment.c();
			text_671 = createText("\n\n    ");
			h2_7 = createElement("h2");
			h2_7.textContent = "Fill";
			text_673 = createText("\n    ");
			text_674 = createText("\n      ");
			text_675 = createText("\n        ");
			text_676 = createText("My");
			navlink_17._fragment.c();
			text_677 = createText("\n      ");
			navitem_17._fragment.c();
			text_678 = createText("\n      ");
			text_679 = createText("\n        ");
			text_680 = createText("Name");
			navlink_18._fragment.c();
			text_681 = createText("\n      ");
			navitem_18._fragment.c();
			text_682 = createText("\n      ");
			text_683 = createText("\n        ");
			text_684 = createText("Is");
			navlink_19._fragment.c();
			text_685 = createText("\n      ");
			navitem_19._fragment.c();
			text_686 = createText("\n      ");
			text_687 = createText("\n        ");
			text_688 = createText("Rufus Xavier Sarsaparilla");
			navlink_20._fragment.c();
			text_689 = createText("\n      ");
			navitem_20._fragment.c();
			text_690 = createText("\n    ");
			nav_6._fragment.c();
			text_691 = createText("\n\n    ");
			h2_8 = createElement("h2");
			h2_8.textContent = "Justified";
			text_693 = createText("\n    ");
			text_694 = createText("\n      ");
			text_695 = createText("\n        ");
			text_696 = createText("My");
			navlink_21._fragment.c();
			text_697 = createText("\n      ");
			navitem_21._fragment.c();
			text_698 = createText("\n      ");
			text_699 = createText("\n        ");
			text_700 = createText("Name");
			navlink_22._fragment.c();
			text_701 = createText("\n      ");
			navitem_22._fragment.c();
			text_702 = createText("\n      ");
			text_703 = createText("\n        ");
			text_704 = createText("Is");
			navlink_23._fragment.c();
			text_705 = createText("\n      ");
			navitem_23._fragment.c();
			text_706 = createText("\n      ");
			text_707 = createText("\n        ");
			text_708 = createText("Rufus Xavier Sarsaparilla");
			navlink_24._fragment.c();
			text_709 = createText("\n      ");
			navitem_24._fragment.c();
			text_710 = createText("\n    ");
			nav_7._fragment.c();
			text_711 = createText("\n\n    ");
			text_712 = createText("\n      ");
			text_713 = createText("\n        ");
			h2_9 = createElement("h2");
			text_714 = createText("Breadcrumbs");
			text_715 = createText("\n\n        ");
			text_716 = createText("\n          ");
			text_717 = createText("Home");
			breadcrumbitem._fragment.c();
			text_718 = createText("\n        ");
			breadcrumb._fragment.c();
			text_719 = createText("\n\n        ");
			text_720 = createText("\n          ");
			a_30 = createElement("a");
			text_721 = createText("Home");
			breadcrumbitem_1._fragment.c();
			text_722 = createText("\n          ");
			text_723 = createText("Library");
			breadcrumbitem_2._fragment.c();
			text_724 = createText("\n        ");
			breadcrumb_1._fragment.c();
			text_725 = createText("\n\n        ");
			text_726 = createText("\n          ");
			a_31 = createElement("a");
			text_727 = createText("Home");
			breadcrumbitem_3._fragment.c();
			text_728 = createText("\n          ");
			a_32 = createElement("a");
			text_729 = createText("Library");
			breadcrumbitem_4._fragment.c();
			text_730 = createText("\n          ");
			text_731 = createText("Data");
			breadcrumbitem_5._fragment.c();
			text_732 = createText("\n        ");
			breadcrumb_2._fragment.c();
			text_733 = createText("\n\n      ");
			col_12._fragment.c();
			text_734 = createText("\n\n      ");
			text_735 = createText("\n        ");
			h2_10 = createElement("h2");
			text_736 = createText("Pagination");
			text_737 = createText("\n        ");
			div_52 = createElement("div");

			for (var i = 0; i < each_1_blocks.length; i += 1) {
				each_1_blocks[i].c();
			}

			text_739 = createText("\n      ");
			col_13._fragment.c();
			text_740 = createText("\n    ");
			row_9._fragment.c();
			text_742 = createText("\n\n  ");
			text_743 = createText("\n  ");
			div_53 = createElement("div");
			h1_7 = createElement("h1");
			h1_7.textContent = "Indicators";
			text_745 = createText("\n\n    ");
			h2_11 = createElement("h2");
			h2_11.textContent = "Alerts";
			text_747 = createText("\n    ");
			text_748 = createText("\n      ");
			h4_3 = createElement("h4");
			text_749 = createText("Default");
			text_750 = createText("\n      ");
			p_22 = createElement("p");
			text_751 = createText("Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna,\n        ");
			a_33 = createElement("a");
			a_33.textContent = "vel scelerisque nisl consectetur et";
			text_753 = createText(".");
			text_754 = createText("\n    ");
			alert._fragment.c();
			text_755 = createText("\n\n    ");
			text_756 = createText("\n      ");

			for (var i = 0; i < each_2_blocks.length; i += 1) {
				each_2_blocks[i].c();
			}

			each_2_anchor = createComment();
			text_757 = createText("\n    ");
			row_10._fragment.c();
			text_758 = createText("\n\n    ");
			div_54 = createElement("div");
			h2_12 = createElement("h2");
			h2_12.textContent = "Badges";
			text_760 = createText("\n      ");
			div_55 = createElement("div");
			text_761 = createText("Default");
			badge._fragment.c();
			text_762 = createText("\n        ");
			text_763 = createText("Primary");
			badge_1._fragment.c();
			text_764 = createText("\n        ");
			text_765 = createText("Success");
			badge_2._fragment.c();
			text_766 = createText("\n        ");
			text_767 = createText("Warning");
			badge_3._fragment.c();
			text_768 = createText("\n        ");
			text_769 = createText("Danger");
			badge_4._fragment.c();
			text_770 = createText("\n        ");
			text_771 = createText("Info");
			badge_5._fragment.c();
			text_773 = createText("\n      ");
			div_56 = createElement("div");
			text_774 = createText("Default");
			badge_6._fragment.c();
			text_775 = createText("\n        ");
			text_776 = createText("Primary");
			badge_7._fragment.c();
			text_777 = createText("\n        ");
			text_778 = createText("Success");
			badge_8._fragment.c();
			text_779 = createText("\n        ");
			text_780 = createText("Warning");
			badge_9._fragment.c();
			text_781 = createText("\n        ");
			text_782 = createText("Danger");
			badge_10._fragment.c();
			text_783 = createText("\n        ");
			text_784 = createText("Info");
			badge_11._fragment.c();
			text_788 = createText("\n\n  ");
			text_789 = createText("\n  ");
			div_57 = createElement("div");
			text_790 = createText("\n      ");
			text_791 = createText("\n        ");
			h1_8 = createElement("h1");
			text_792 = createText("Progress");
			text_793 = createText("\n\n        ");
			h3_2 = createElement("h3");
			text_794 = createText("Basic");
			text_795 = createText("\n        ");
			div_58 = createElement("div");
			progress._fragment.c();
			text_797 = createText("\n\n        ");
			h3_3 = createElement("h3");
			text_798 = createText("Contextual alternatives");
			text_799 = createText("\n        ");
			div_59 = createElement("div");
			progress_1._fragment.c();
			text_800 = createText("\n          ");
			progress_2._fragment.c();
			text_801 = createText("\n          ");
			progress_3._fragment.c();
			text_802 = createText("\n          ");
			progress_4._fragment.c();
			text_804 = createText("\n\n        ");
			h3_4 = createElement("h3");
			text_805 = createText("Multiple bars");
			text_806 = createText("\n        ");
			div_60 = createElement("div");
			text_807 = createText("\n            ");
			progress_6._fragment.c();
			text_808 = createText("\n            ");
			progress_7._fragment.c();
			text_809 = createText("\n            ");
			progress_8._fragment.c();
			text_810 = createText("\n          ");
			progress_5._fragment.c();
			text_812 = createText("\n\n        ");
			h3_5 = createElement("h3");
			text_813 = createText("Striped");
			text_814 = createText("\n        ");
			div_61 = createElement("div");
			progress_9._fragment.c();
			text_815 = createText("\n          ");
			progress_10._fragment.c();
			text_816 = createText("\n          ");
			progress_11._fragment.c();
			text_817 = createText("\n          ");
			progress_12._fragment.c();
			text_818 = createText("\n          ");
			progress_13._fragment.c();
			text_820 = createText("\n\n        ");
			h3_6 = createElement("h3");
			text_821 = createText("Animated");
			text_822 = createText("\n        ");
			div_62 = createElement("div");
			progress_14._fragment.c();
			text_823 = createText("\n          ");
			progress_15._fragment.c();
			text_824 = createText("\n          ");
			progress_16._fragment.c();
			text_825 = createText("\n          ");
			progress_17._fragment.c();
			text_826 = createText("\n          ");
			progress_18._fragment.c();
			text_828 = createText("\n      ");
			col_14._fragment.c();
			text_829 = createText("\n    ");
			row_11._fragment.c();
			text_831 = createText("\n\n  ");
			text_832 = createText("\n  ");
			div_63 = createElement("div");
			text_833 = createText("\n      ");
			text_834 = createText("\n        ");
			h1_9 = createElement("h1");
			text_835 = createText("Containers");
			text_836 = createText("\n        ");
			text_837 = createText("\n          ");
			h1_10 = createElement("h1");
			text_838 = createText("Jumbotron");
			text_839 = createText("\n          ");
			p_23 = createElement("p");
			text_840 = createText("This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.");
			text_841 = createText("\n          ");
			p_24 = createElement("p");
			text_842 = createText("Learn more");
			button_48._fragment.c();
			text_843 = createText("\n        ");
			jumbotron._fragment.c();
			text_844 = createText("\n      ");
			col_15._fragment.c();
			text_845 = createText("\n    ");
			row_12._fragment.c();
			text_846 = createText("\n\n\n    ");
			h2_13 = createElement("h2");
			h2_13.textContent = "List groups";
			text_848 = createText("\n    ");
			text_849 = createText("\n      ");
			text_850 = createText("\n\n        ");
			text_851 = createText("\n          ");
			text_852 = createText("\n            Cras justo odio");
			text_853 = createText("14");
			badge_12._fragment.c();
			text_854 = createText("\n          ");
			listgroupitem_10._fragment.c();
			text_855 = createText("\n          ");
			text_856 = createText("\n            Dapibus ac facilisis in");
			text_857 = createText("2");
			badge_13._fragment.c();
			text_858 = createText(" \n          ");
			listgroupitem_11._fragment.c();
			text_859 = createText("\n          ");
			text_860 = createText("\n            Morbi leo risus");
			text_861 = createText("1");
			badge_14._fragment.c();
			text_862 = createText(" \n          ");
			listgroupitem_12._fragment.c();
			text_863 = createText("\n        ");
			listgroup_1._fragment.c();
			text_864 = createText("\n\n      ");
			col_16._fragment.c();
			text_865 = createText("\n\n      ");
			text_866 = createText("\n        ");
			text_867 = createText("\n          ");
			text_868 = createText("\n            Cras justo odio\n          ");
			listgroupitem_13._fragment.c();
			text_869 = createText("\n          ");
			text_870 = createText("\n            Dapibus ac facilisis in\n          ");
			listgroupitem_14._fragment.c();
			text_871 = createText("\n          ");
			text_872 = createText("\n            Morbi leo risus\n          ");
			listgroupitem_15._fragment.c();
			text_873 = createText("\n        ");
			listgroup_2._fragment.c();
			text_874 = createText("\n      ");
			col_17._fragment.c();
			text_875 = createText("\n\n      ");
			text_876 = createText("\n\n        ");
			text_877 = createText("\n          ");
			text_878 = createText("\n            ");
			text_879 = createText("List group item heading");
			listgroupitemheading._fragment.c();
			text_880 = createText("\n            ");
			text_881 = createText("\n              Donec id elit non mi porta gravida at eget metus.\n              Maecenas sed diam eget risus varius blandit.\n            ");
			listgroupitemtext._fragment.c();
			text_882 = createText("\n          ");
			listgroupitem_16._fragment.c();
			text_883 = createText("\n          ");
			text_884 = createText("\n            ");
			text_885 = createText("List group item heading");
			listgroupitemheading_1._fragment.c();
			text_886 = createText("\n            ");
			text_887 = createText("\n              Donec id elit non mi porta gravida at eget metus.\n              Maecenas sed diam eget risus varius blandit.\n            ");
			listgroupitemtext_1._fragment.c();
			text_888 = createText("\n          ");
			listgroupitem_17._fragment.c();
			text_889 = createText("\n        ");
			listgroup_3._fragment.c();
			text_890 = createText("\n\n      ");
			col_18._fragment.c();
			text_891 = createText("\n\n    ");
			row_13._fragment.c();
			text_892 = createText("\n\n    ");
			h2_14 = createElement("h2");
			h2_14.textContent = "Cards";
			text_894 = createText("\n    ");
			text_895 = createText("\n      ");
			text_896 = createText("\n        ");

			for (var i = 0; i < each_3_blocks.length; i += 1) {
				each_3_blocks[i].c();
			}

			each_3_anchor = createComment();
			text_897 = createText("\n      ");
			col_19._fragment.c();
			text_898 = createText("\n\n      ");
			text_899 = createText("\n        ");

			for (var i = 0; i < each_4_blocks.length; i += 1) {
				each_4_blocks[i].c();
			}

			each_4_anchor = createComment();
			text_900 = createText("\n      ");
			col_20._fragment.c();
			text_901 = createText("\n\n      ");
			text_902 = createText("\n\n        ");
			text_903 = createText("\n          ");
			text_904 = createText("Card header");
			cardheader._fragment.c();
			text_905 = createText("\n          ");
			text_906 = createText("\n            ");
			text_907 = createText("Special title treatment");
			cardtitle._fragment.c();
			text_908 = createText("\n            ");
			text_909 = createText("Support card subtitle");
			cardsubtitle._fragment.c();
			text_910 = createText("\n          ");
			cardbody._fragment.c();
			text_911 = createText("\n          ");
			img_1 = createElement("img");
			text_912 = createText("\n          ");
			text_913 = createText("\n            ");
			p_25 = createElement("p");
			text_914 = createText("Some quick example text to build on the card title and make up the bulk of the card's content.");
			text_915 = createText("\n            ");
			a_34 = createElement("a");
			text_916 = createText("Card link");
			text_917 = createText("\n            ");
			a_35 = createElement("a");
			text_918 = createText("Another link");
			text_919 = createText("\n          ");
			cardbody_1._fragment.c();
			text_920 = createText("\n          ");
			text_921 = createText("\n            2 days ago\n          ");
			cardfooter._fragment.c();
			text_922 = createText("\n        ");
			card._fragment.c();
			text_923 = createText("\n\n      ");
			col_21._fragment.c();
			text_924 = createText("\n    ");
			row_14._fragment.c();
			text_925 = createText("\n\n    ");
			h2_15 = createElement("h2");
			h2_15.textContent = "Media";
			text_927 = createText("\n    ");
			text_928 = createText("\n      ");
			text_929 = createText("\n        ");
			img_2 = createElement("img");
			text_930 = createText("\n        ");
			text_931 = createText("\n          ");
			h4_4 = createElement("h4");
			text_932 = createText("Media heading");
			text_933 = createText("\n          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.\n        ");
			mediabody._fragment.c();
			text_934 = createText("\n      ");
			media._fragment.c();
			text_935 = createText("\n    ");
			row_15._fragment.c();
			text_937 = createText("\n\n  ");
			text_938 = createText("\n  ");
			div_64 = createElement("div");
			h1_11 = createElement("h1");
			h1_11.textContent = "Dialogs";
			text_940 = createText("\n    ");
			text_941 = createText("\n      ");
			text_942 = createText("\n        ");
			h2_16 = createElement("h2");
			text_943 = createText("Modals");
			text_944 = createText("\n          ");
			text_945 = createText("\n      ");
			col_22._fragment.c();
			text_946 = createText("\n      ");
			text_947 = createText("\n        ");
			h2_17 = createElement("h2");
			text_948 = createText("Popovers");
			text_949 = createText("\n        ");
			div_65 = createElement("div");
			button_49 = createElement("button");
			button_49.textContent = "Left";
			text_951 = createText("\n\n          ");
			button_50 = createElement("button");
			button_50.textContent = "Top";
			text_953 = createText("\n\n          ");
			button_51 = createElement("button");
			button_51.textContent = "Bottom";
			text_955 = createText("\n\n          ");
			button_52 = createElement("button");
			button_52.textContent = "Right";
			text_958 = createText("\n\n        ");
			h2_18 = createElement("h2");
			text_959 = createText("Tooltips");
			text_960 = createText("\n        ");
			div_66 = createElement("div");
			button_53 = createElement("button");
			button_53.textContent = "Left";
			text_962 = createText("\n\n          ");
			button_54 = createElement("button");
			button_54.textContent = "Top";
			text_964 = createText("\n\n          ");
			button_55 = createElement("button");
			button_55.textContent = "Bottom";
			text_966 = createText("\n\n          ");
			button_56 = createElement("button");
			button_56.textContent = "Right";
			text_969 = createText("\n      ");
			col_23._fragment.c();
			text_970 = createText("\n    ");
			row_16._fragment.c();
			text_972 = createText("\n\n  ");
			text_973 = createText("\n  ");
			col_1._fragment.c();
			text_974 = createText("\n  ");
			row._fragment.c();
			text_975 = createText("\n");
			container._fragment.c();
			this.h();
		},

		h: function hydrate() {
			img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUMAAABACAYAAACA0BUdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAEO5JREFUeNrsXQmUFcUVrVkYBEV2EZcEUXHDCGhccEXUBFEUIuJyRDG4xDVBQ+KWuCWaHLecxMQ9aIyIirKpKEYIRlRUohIxGkRUQAVFZHEYGJjUtW9nKp/fW3X1X2bePeed6fndXd1VXXXrvVevqioaGhqUQCAQNHdUCBkKBAKBBRkO63ellFrh0EPLYC3vaXlCikMgiMa46ddb3VcpRVfS6K/lRi1XSFEIBNlCyLC00YJ/q6UoBAIhw+aM9fy7VopCIBAyFAgEgswh5pdAEB87s800GMrEci2fStEIGQoEzQWjtNyc5/fVWnppeV+KSMxkQWmijZb7tNyvpZMUR2r0DPh9Cy3bSvEIGQpKF1tqGaFluJChE3wVck4GuIQMBSWMetXo21onxSEQCBkKBAKBkKHgG8gEdClfgZBhs8VnxrGEfqTHyphlLShTuAyt2VHLVlo6sqeM01tiutkHWt4KOL+Nln2UF8v1D8d5H6ilSsuzKpkDfBctXZU3WrsxTz7RwWzQslTLx/ybNXbje/m+wa+17GGcv1jLy1pah3wHDBDMZJ6SAt99ey1dmP/cNCooq0jM7zrMO0ZyO/HZNQneH9cu0TI7zzkMPvVluaxjno4ISet8LU/nKV+/XFF36wPu3U5Lb6MuVbBevq02Ddf5FqU9r8d7YZbSrAiyzsUOWjqz3Cotv7mvSM2OUcd7sI6uN+5FXl9i2zbLa1d+05qcMsM9a1h/5htplRQZoqGdoOUgy/tBht0Dzh2o5REe7+qwEZ2q5UEed45BhvgwP9VyrJb9EjwHH2+Klru1/C1DMhzPyhaEG2Km0zWhFjlAy+ksl9YJ7nuZ73wrO46kqCIBHaW8xSw2S1F2XfI05l9ouSRBGqMpQTiB+c2HB7T0y/P7XC3fMe4fzvLO12Z/pSVqOSkQ/IV8Vn+Hde8pKhZBgNLwvMoffjRWyyn8fijzIezUo4BVnGZouUfLq6VAhtDasKzUvsZvS0gAcVm7hj1qEJ5jepuzoG5wlO9h/Ise+/OIa6GZPqS82Qc+FlBj2MCePNd/hHx1oJY8jHJLwgaWBFMNLcbXxNpQ6/C/y4qI77BIhYeP5OI2doQ+UI5fBnz7BhJYS2ol+1NGkExfS/BcdEaIn9zdUdm1CNA2XaJjBBnnQy3/oiMdmSJ94CQtN6ls4iF3ijjfiVyRD+uojMyKkU6upgk5W8uvlaNVndKQ4SQte/N4HFl6umVPHwQ0ronsPQY6IsM21CiARyOu7UPTsRUb9NXsAObGeA6CcQ/Xcp6W7ylvBgNMnKEZVMhRlNxG9gmJsR97U1d42OhQoPneyd7/6xj39qKmcwUJ7QWapP+Mce+eWl4ksbpAXYCJ+LXj7xNmeQQ9aynr+8gY6a+LqBs3Z2iVrIk4X89rtgjQVscmJMJcXK6lG629VLAdQDnJIMIb+f9zjonQx0RDI+jmIL0B1FDMtINMsQkkws/p17k2JhECq9lhfJ+9l2/unKUKg1rjeKXDdM81iPA3NJGnJCCQN2jS9SZZb0ZyjUNwYxwSoV//Kx22C5ftDD7Kn8e8Nsg/3y9jIkyLwY5M9lPoxir4R4KmcRqP4Qe7LOMCe5bEUs2GlxZ+GnDefhhyHUhrex6D0N5M8UxoQY/z+Dqa/VmjlXHc2lGamxva+aMJGmsQKQ4xzJ4REdcfSU3dJVqo/AMbbRw/x8YCS+IHbR/w+x2q+eAaLW0L/ZF2pLkC3FWATMLXNY29yCAtv0+RVo1BhhMirv2R4QJ43UE+4GA/juYryHV8GVY4fIN21ERGOUgPAymPUWMeQVdLEIbEqCfoOGexw66OUfcx2r8sz7nfKW+Us5ImbmvWm6BpjfA9z8lDYLBAEHbzpIOyQsTFv2mlVBuKyWY0NXMxkJ1MGOA6eZsaenWA4lNL985xalP/uEvUs529w2dWGb93Ief0iOj8UYduKyQZdjIqxfoCNcIJbIgHa9la2cfNHWH0HpNCroPD1x/Ju9dRHhAmMZOmy+FlSoaHGRbBIkdpjiEZ7qU8B//igOvCtMIZtFZcvdMLFBMYAPtJSMf5r4zK/H2mPy3hfUMjzGqMLN8eM62WdLXUZJRHtAWMJs+LuO48KkNBFu0AdmRWQfA2ZnKNahyBqylQI5zKHroltaq0JrLfywahu9ErzXGYj1mGWViO8EenpztMEyRSRxO8W0SDzAcMgJztkAiDsCHC3M4CS6kATLO4d++QcxcnIEJFayArPMvOcF6Ma/+o5YKQ87vRcrWCDRliZMh3lhdqtY6l7P0VTWXbvA7m8eMR13bg31rldmRxCf9uWaZk2M6oA66AiIEvIsqlOoQMlYoOj3KB6iKQ4U00YZOijQoOZ1mskruaqjLKHzqYpAMff9KyMOBcV5UifMiGDD81zNQOBWyIvo+vv2VPdZBqjOmK8hfWGz4Tl7N0WhrpliPqU7hXwoikMqI+otGsC6nD+6mmh40x6mkQWoV8o1dLKI/zVPDsszDMDemwrBUNGzJEz/ISjy8oYME9zUaxpbIbjvc1SsxiebPIlUAm9icrF/y+LOS+20M0oXIFfIUfpiDSoCl2pbT24sKUnbIrTkt1oz/q14d2fCHwkfICboHjLO73RyNlM/byxPMh57pT4xnUhPK7QmWzDmUpbfVhG5dclYWiYUuGCCX4A48x0oXJ2kcV0FTGjI4ksXpwJu8Q00QWlCYejDgPzXAiv++hTSC/zWF/oqpSepk0kfYYmr+Ox9/V8ozyRksRhN0zo/edwr9YJeWQBPcda6jlrwivlCU+UvEC/GE1zFBeuMaBUmyCQpAhgNgg+O+m8v8DlDf1DA5OxKJhXuW3Hb7vf1TjpP4kprJ/7aSEz4PfZbXD969tIvXGpd9pTQJzCVM/404vG0ILZhw7a4EgUzIE4MsZQFMUU2L82RoILMaKG4gj82cZtHXwPN/nh2fGCWlATF8vSxMZpkpHh+XdoYnUm3aOyyTJ1LNLlRf8HHe+9YnKc+M8YNQDgSBTv8QcytXKCxQ9noSFQMgfUDD9CUGWiPN7yvI5k5W3fhumCO2nohd99U1khAPNTPgsTMOCYx5Ts9IGmNepxmDrmjKvN6OpeaEzqkhZJh2NDiduvN5t7Nh+qeWMmPecRhlLDfMtaf6CrMjQhD+daTQ1REwNOoom8w8pIM4rDBM7LuZS2+xJwo0iQ38UeaKyG73qptyslmOi3HerQ3hTnwzSTRLMvVB5c1Ex/QohXsNjkunJyltlCSvuXCYUIMiaDH2AfKZREBV/GCvjyWxMiB08nSZMEownGQ6k2RQErDrT1yBDG9IaqtwugQUsLvN6g9CqvzpOE/5Zm8EtrH4D3zRma5xPTXGLiHugzWLFnV1U9AIQAiFD51hFExeCsJwxyls9+n5qdwsSpDWFJhK2AsC6eEELgx7DvzBzbebTwoybJNVkEyDofkaJvRPmmiPCAQsqnEvrI8rfi+mZGJC5RD6poFi74yEEB+vT+UvRn5vwfowoz+fxoBgmMvyTNiOg/vL5gv9H+xJ+N+yp8zPlrTqExXiXRFw/KgM3iEDIMBEw1chfe8wmSNZfbCEoxAZaweE8lkDr5ocltB5Aig9FXHuGFJeg2Psm+yPK2Atj+4T3TuZfmMn5lsQayPwhTnCqfOpmC6yIg/0xpoRcc0jKZ9Q38TLMtyWuC5RUuRWbDBfQVIbDO+lE+xcNEyifduj/BiJc08wJYaMSwBwOiibAVM00y3C1KqNysFmQ2d/d0DVst3gNI1Hr9yw2GaJy+r68GosP5Adg5+6NAj/f0Ty2GQCpaCIE4PfmrgbKyrlcMHtpWQiZRTWiMLLsVIIWX1DbtvH3dlPZDLbuYnlfq5D6XleuZGhWQJtZDT7RYa3C7Yzfj2Svsz7CPMqqJy0FVBnk1dZx2uVaJmGaRpQZGDaVsm+J5WelCh4wxJTZpBuEjcjoPbHaUNKV69Gug6ZXrlPh+4OXvGaYZntRhMssZ6M3tUN/hBmzXb60SPcz/kWl6VimDbzWMCc6O0rTX5F6qzIsj54hGlyLGGQYtq/zRapxz5xSAIjwg4Bz6BhvSZAWBiHPyfBdb02oWf825PqFyn6NxKKToany2qi30FAm5hAgcDz/2o4iLyCRoHzKdeUTdALvGhXaBfwGdnSZlQU0t4dDTL1FMbTdlyK0FfiwEfS9dYnkOWzqKcgN6wb0DrkGMbxXKW/BlSyB52Du+KkRpIh3xdqpF4Zcg53+lti+SLHXTENBdKB2ON8yjQlU4/vx/z7s/TBoMNkyTWibf1feijyo4I+UKSFOpUZ0hpbLVfrRu8nUglAx91GNKwgVAv1VYwhMnAGh9dT4eqroqYOvxNAM0RHMUI07BOYCg4CYTGDGNvpuitkkoEK6FzBDKGx/kZGUeSxP/10beNxDZbe3Sy4wgIX1KuHTXZpzzh+82S1GOmPTvESxyXA0/85XyWagmMBUv9WsjFi4YX/+PsMwd23VdzRAhF2cnLagiwQ0zktpJt/twPfzHLVNOL7vVOE7sLnG5Q413Fz8JeZ1V6roufAd1KarE6HTv8TSZWMLbG2B/ZoHRly3ewnV184pXDrgj8fSPLxYZjJ6Hqx76O9Wd0+KtGoNDRCLzQ5PaSL7eFI1Tjl7yEi3nPAhTR1FrWqMSr/81gWGBo5y71KgvKzOKN0nIkxgEzCF77J4xieqOOFN5yl3sXx1GbzfSsd5TQVbzRB+vjYJChqqbmuqunsob97onoYv5uaU+ZhA7e1I47eJDgr4RGoCMBkwhxprMo6nebiInUmScJNKNooVBWwc1ysvNAJljkUxjqbG+Aq1h7V8L9SFr2JUemiHmNmBtSuPoaYIh/zLyhtkWG/RyVaT7MK2Zd2QQdnAx3RmwnvO4fue6egdsgxX+ojaNGZrpQn/uYrKwM6O3/8RfvOLUuYT+0A/UywyvJdaXZIK2jLP8x5lpUob3f40idlP/3VWhLRYRg1oDInwWNU4ar3KotFXMq9Y53FmzDIDNk+Zj5EkqqtphlzD39eR/Crpl7lPeT7SKFzL8sUyWFsZ6a21JMMqNthTQ65xPR8aHcKPLUkWHctsdgpdY1zfPqRM2macXyylt6+WO5TdPkUjWP+vCzifZg9wxBafpbzZZ4Mt7od7bZSyHxtwQoYIN7GJHgeBYB3D95S3HLurkapVOabsvQ4bDWavDKXWiXXwepEg0yzgEJcsfNNwuYN8YDvNsdRs4Fc9mA2uJue7xsUYauTYEKwv02ur7GcVRMW+wUQ9zDJtaOEYAHmDmiyc9e+kLE/4TB9mJ4m59Xspz/9WHaCBBsX9wfLYKc/vcxzWYeQdm6jB/z2MFlrvEJfJa7TY/sxOtIJll2+l8DRxvL62igVVjmdZom7uGPId3+E7Pc8278x8r2hoSKaUDesHH/I3DuIkvqcGCsywrJzIlapx9ZEFKltsp+xXq8YHXazijSyCWLZhuX3hOA9t85DfihTE206l29ZguYoOmO1uUdaVtBo+y8jvFadefBriAjDrba6Jm+Xc3U45Wp0/iowyWxhgpWyb5/eotgatDyPW+daYhEY3KOZzFMvj4yhLctz06wuqGS53pK24xMYCkKCPRQV6ztoM8/QVxRVWqBTR/zGxQJU2FpV4vTXxOSUu6gr0nnXF+s6VSiAQCARChgKBQCBkKBAIBEKGAoFAIGQoEAgEQoYCgaBgQMRKUOxpi1J6USFDgUCQJVap4BC+mlJ60Wr5VgKBIEMglhFT+Q7Ic+6eUnrRxDNQBAKBoClCyFAgEAiEDAUCgUDIUCAQCP6H/wowAFFJXHAnIN6pAAAAAElFTkSuQmCC";
			img.height = "32";
			ul.className = "navbar-nav";
			nav.className = "navbar sticky-top navbar-dark bg-primary navbar-toggleable-xl navbar-expand-lg";
			a.href = "#navbars";
			a_1.href = "#buttons";
			a_2.href = "#typography";
			a_3.href = "#tables";
			a_4.href = "#forms";
			a_5.href = "#navs";
			a_6.href = "#indicators";
			a_7.href = "#progress";
			a_8.href = "#containers";
			a_9.href = "#dialogs";
			div.className = "mt-3 sticky-top";
			h1.id = "navbars";
			h1.className = "text-muted my-4";
			button.className = "navbar-toggler navbar-toggler-right";
			button.type = "button";
			button.dataset.toggle = "collapse";
			button.dataset.target = "#navbarColor01";
			setAttribute(button, "aria-controls", "navbarColor01");
			setAttribute(button, "aria-expanded", "false");
			setAttribute(button, "aria-label", "Toggle navigation");
			a_10.className = "navbar-brand";
			span_1.className = "sr-only";
			ul_1.className = "navbar-nav mr-auto";
			input.className = "form-control mr-sm-2";
			setAttribute(input, "type", "text");
			input.placeholder = "Search";
			div_3.className = "collapse navbar-collapse";
			div_3.id = "navbarColor01";
			nav_1.className = "navbar navbar-toggleable-md navbar-inverse bg-primary";
			div_2.className = "bs-component";
			button_2.className = "navbar-toggler navbar-toggler-right";
			button_2.type = "button";
			button_2.dataset.toggle = "collapse";
			button_2.dataset.target = "#navbarColor01";
			setAttribute(button_2, "aria-controls", "navbarColor01");
			setAttribute(button_2, "aria-expanded", "false");
			setAttribute(button_2, "aria-label", "Toggle navigation");
			span_3.className = "sr-only";
			ul_2.className = "navbar-nav mr-auto";
			input_1.className = "form-control mr-sm-2";
			setAttribute(input_1, "type", "text");
			input_1.placeholder = "Search";
			div_5.className = "collapse navbar-collapse";
			div_5.id = "navbarColor01";
			nav_2.className = "navbar navbar-toggleable-md navbar-light bg-inverse";
			div_4.className = "bs-component";
			div_1.className = "mt-3";
			h1_1.id = "buttons";
			h1_1.className = "text-muted my-4";
			p.className = "bs-component";
			p_1.className = "bs-component";
			p_2.className = "bs-component";
			div_7.className = "bs-component";
			p_3.className = "bs-component";
			div_9.className = "btn-group";
			div_9.dataset.toggle = "buttons";
			div_8.className = "bs-component mb-1";
			div_11.className = "btn-group";
			div_11.dataset.toggle = "buttons";
			div_10.className = "bs-component";
			setStyle(div_10, "margin-bottom", "15px");
			div_12.className = "bs-component";
			div_13.className = "bs-component";
			setStyle(div_13, "margin-bottom", "15px");
			div_14.className = "bs-component";
			setStyle(div_14, "margin-bottom", "15px");
			h2.className = "text-muted my-4";
			h4.className = "text-muted";
			h4_1.className = "text-muted";
			div_6.className = "mt-3";
			h1_2.id = "typography";
			h1_2.className = "text-muted my-4";
			div_18.className = "bs-component";
			div_17.className = "col-lg-4";
			div_20.className = "bs-component";
			div_19.className = "col-lg-4";
			div_22.className = "bs-component";
			div_21.className = "col-lg-4";
			h2_4.id = "type-blockquotes";
			h2_4.className = "text-muted my-3";
			footer.className = "blockquote-footer";
			blockquote.className = "blockquote";
			footer_1.className = "blockquote-footer";
			blockquote_1.className = "blockquote blockquote-reverse";
			div_16.className = "mt-3";
			h1_4.id = "tables";
			h1_4.className = "text-muted my-4";
			thead.className = "thead-inverse";
			tr_3.className = "table-info";
			tr_4.className = "table-success";
			tr_5.className = "table-danger";
			tr_6.className = "table-warning";
			tr_7.className = "table-active";
			div_23.className = "mt-3";
			h1_5.id = "forms";
			h1_5.className = "text-muted my-4";
			div_25.className = "form-group";
			div_26.className = "form-group";
			label_8.htmlFor = "exampleSelect1";
			option.__value = "1";
			option.value = option.__value;
			option_1.__value = "2";
			option_1.value = option_1.__value;
			option_2.__value = "3";
			option_2.value = option_2.__value;
			option_3.__value = "4";
			option_3.value = option_3.__value;
			option_4.__value = "5";
			option_4.value = option_4.__value;
			select.className = "form-control";
			select.id = "exampleSelect1";
			div_27.className = "form-group";
			label_9.htmlFor = "exampleSelect2";
			option_5.__value = "1";
			option_5.value = option_5.__value;
			option_6.__value = "2";
			option_6.value = option_6.__value;
			option_7.__value = "3";
			option_7.value = option_7.__value;
			option_8.__value = "4";
			option_8.value = option_8.__value;
			option_9.__value = "5";
			option_9.value = option_9.__value;
			select_1.multiple = "";
			select_1.className = "form-control";
			select_1.id = "exampleSelect2";
			div_28.className = "form-group";
			div_29.className = "form-group";
			div_30.className = "form-group";
			fieldset_1.className = "form-group";
			div_34.className = "form-check";
			button_47.type = "submit";
			button_47.className = "btn btn-primary";
			label_16.className = "control-label";
			label_16.htmlFor = "disabledInput";
			input_15.className = "form-control";
			input_15.id = "disabledInput";
			setAttribute(input_15, "type", "text");
			input_15.placeholder = "Disabled input here...";
			input_15.disabled = "";
			fieldset_2.disabled = "";
			label_17.className = "control-label";
			label_17.htmlFor = "readOnlyInput";
			input_16.className = "form-control";
			input_16.id = "readOnlyInput";
			setAttribute(input_16, "type", "text");
			input_16.placeholder = "Readonly input here…";
			input_16.readOnly = "";
			label_18.className = "form-control-label";
			label_18.htmlFor = "inputSuccess1";
			setAttribute(input_17, "type", "text");
			input_17.className = "form-control form-control-success";
			input_17.id = "inputSuccess1";
			div_35.className = "form-control-feedback";
			label_19.className = "form-control-label";
			label_19.htmlFor = "inputWarning1";
			setAttribute(input_18, "type", "text");
			input_18.className = "form-control form-control-warning";
			input_18.id = "inputWarning1";
			div_36.className = "form-control-feedback";
			label_20.className = "form-control-label";
			label_20.htmlFor = "inputDanger1";
			setAttribute(input_19, "type", "text");
			input_19.className = "form-control form-control-danger";
			input_19.id = "inputDanger1";
			div_37.className = "form-control-feedback";
			label_21.className = "col-form-label col-form-label-lg";
			label_21.htmlFor = "inputLarge";
			input_20.className = "form-control form-control-lg";
			setAttribute(input_20, "type", "text");
			input_20.id = "inputLarge";
			label_22.className = "col-form-label";
			label_22.htmlFor = "inputDefault";
			setAttribute(input_21, "type", "text");
			input_21.className = "form-control";
			input_21.id = "inputDefault";
			label_23.className = "col-form-label col-form-label-sm";
			label_23.htmlFor = "inputSmall";
			input_22.className = "form-control form-control-sm";
			setAttribute(input_22, "type", "text");
			input_22.id = "inputSmall";
			label_24.className = "control-label";
			label_25.className = "sr-only";
			label_25.htmlFor = "exampleInputAmount";
			setAttribute(input_23, "type", "text");
			input_23.className = "form-control";
			input_23.id = "exampleInputAmount";
			input_23.placeholder = "Amount";
			div_24.className = "mt-3";
			h1_6.id = "navs";
			h1_6.className = "text-muted my-4";
			h2_5.id = "nav-tabs";
			h2_5.className = "text-muted my-4";
			a_15.className = "nav-link dropdown-toggle";
			a_15.dataset.toggle = "dropdown";
			setAttribute(a_15, "role", "button");
			setAttribute(a_15, "aria-haspopup", "true");
			setAttribute(a_15, "aria-expanded", "false");
			div_40.className = "dropdown-menu";
			li.className = "nav-item dropdown";
			div_42.id = "myTabContent";
			div_42.className = "tab-content";
			div_39.className = "bs-component";
			h2_6.id = "nav-pills";
			h2_6.className = "text-muted my-4";
			a_20.className = "nav-link dropdown-toggle";
			a_20.dataset.toggle = "dropdown";
			setAttribute(a_20, "role", "button");
			setAttribute(a_20, "aria-haspopup", "true");
			setAttribute(a_20, "aria-expanded", "false");
			a_21.className = "dropdown-item";
			a_22.className = "dropdown-item";
			a_23.className = "dropdown-item";
			div_48.className = "dropdown-divider";
			a_24.className = "dropdown-item";
			div_47.className = "dropdown-menu";
			a_25.className = "nav-link dropdown-toggle";
			a_25.dataset.toggle = "dropdown";
			setAttribute(a_25, "role", "button");
			setAttribute(a_25, "aria-haspopup", "true");
			setAttribute(a_25, "aria-expanded", "false");
			a_26.className = "dropdown-item";
			a_27.className = "dropdown-item";
			a_28.className = "dropdown-item";
			div_51.className = "dropdown-divider";
			a_29.className = "dropdown-item";
			div_50.className = "dropdown-menu";
			div_49.className = "bs-component";
			h2_7.id = "nav-fill";
			h2_7.className = "text-muted my-4";
			h2_8.id = "nav-fill";
			h2_8.className = "text-muted my-4";
			h2_9.id = "nav-breadcrumbs";
			h2_9.className = "text-muted my-4";
			h2_10.id = "pagination";
			h2_10.className = "text-muted my-4";
			div_52.className = "bs-component";
			div_38.className = "mt-3";
			h1_7.id = "indicators";
			h1_7.className = "text-muted my-4";
			h2_11.className = "text-muted my-4";
			a_33.className = "alert-link";
			h2_12.className = "text-muted my-4";
			div_55.className = "mb-4";
			div_53.className = "mt-3";
			h1_8.id = "progress";
			h1_8.className = "text-muted my-4";
			h3_2.id = "progress-basic";
			h3_2.className = "text-muted my-4";
			h3_3.id = "progress-alternatives";
			h3_3.className = "text-muted my-4";
			h3_4.id = "progress-multiple";
			h3_4.className = "text-muted my-4";
			h3_5.id = "progress-striped";
			h3_5.className = "text-muted my-4";
			h3_6.id = "progress-animated";
			h3_6.className = "text-muted my-4";
			div_57.className = "mt-3";
			h1_9.id = "containers";
			h1_10.className = "display-3";
			setStyle(img_1, "height", "200px");
			setStyle(img_1, "width", "100%");
			setStyle(img_1, "display", "block");
			img_1.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22318%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20318%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_158bd1d28ef%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_158bd1d28ef%22%3E%3Crect%20width%3D%22318%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22129.359375%22%20y%3D%2297.35%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
			img_1.alt = "Card image";
			p_25.className = "card-text";
			a_34.className = "card-link";
			a_35.className = "card-link";
			img_2.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAC7CAMAAAAXMCHDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRFHR4kyZt0cKYY1LCM////np6gY1lX8s6l4buR9uXSsn1bvL2+9dKp+9uwtdKO/+u5+Pbw893G2NjZ7seYUnQij7tO8Ovm3uvL38OnzOCx5tG86vHeOEYmfnx7OTk6////hsn4jgAAACB0Uk5T/////////////////////////////////////////wBcXBvtAAAMAUlEQVR42tydi5qiOBBGg4SAAhJBaS8Nvv9bbhICciepiraz1T3fzrgIOf5VlVuB5Pk/MfLGc9Myj+MgCKqqYuJPEMRxnvN/CqSMg4rVNZmzmgmknH49CBcM8wRjnDj/XpA8YMTC6irm3wfCYxMlJsaC/JtAaFwRsLGg/BKQHEGhnSz4exBuFxfL8ZL/KQgPiDNj+Z+BlBVxanX8JyCuMVAocBD6BgyFkn8WJCBvM1CsAEHimrzTKvoZEMrIuy3+BEhAPmCMvxuEM/IZi98LEpOPGXsnSEU+aDaZ2A6krMlnLXgPSEw+buwdIAH5A6tL5yAV+RMzDBTydVkXmIdNQXhN/s4CdyD5X3IYkZB/gUOMIt2A/DmHAYkJSIlKOnXNfpn4rev6nd5F3tad16w6+FGYppn4kb9pcvW9A2PvISHvyVesitJMmGj9ywSLfC3x2K97km0Q+0+QeYlASMJZS0JJEx1c9yfEOUflCwrZ4GUT4mSZZ/8J5QgQ23HJIZUUm6Z08a2dtgSDWI53WSgwktDQBIq7sTBxyeHTrAhtjNuO4CoYiF3C+t3T0o4jLDi9OkpdxFmgV5RyS46wCDm17KZyAEhgyUFTW5CwSMXbrBJKTa1BcqscLxpUWnMo57IkqaxBbCSPOUgQLQmN8f0icdKDSD1AgmhJrLaL5mfxxIVjyfig9AQDOak3V9jehDhwLKaawkEcsjNRb6+RzkUcZKxStWQPBCn26u02k57aHMTmtIFqCE2gICm1dq7KGMTirDXHeVbrW1bOlRuCxLYZC+5ZnW9ZZS5mCGIzNmk4QJ3I0Ldw8U6wglS6FSHCmjNwVAomWEFyig2Rpk/E9u8EmXprig0RAVLqDwMzxyJIQVrPOmFA9tQ+A48lIchpYYyO9W6UQmmAkIQgp1MLIMnmzxyI1cRhJAnBTUPa5Dvs15MiiqJi9Xc2/9qtzVYbIJbztRZkoEe0abMgFDHrJThBGJ3rRpLC/wRItQoSAEEmrgUBsVscGkzfCWaC+8q+4LHvINhti3XiFRDLJbkOJC0SByCWC7RsBcTyVAFd7UeSqblUpL8WTHCbIZ0i8z17MTGnivTXHQmuSKNaU0TE/Dh7+XMeCFeELYLYfiRsA2RihVPX6vkWwW2zsbWslYST7mReEWA/MvAtgiv/qenqvMowRuAgbAGkgoIszKtklhr8JKvLD9R+65jPg9hv65X4edVrZpVbX/7VJw5AuP2Jcicge8BcdzTeIsjKsoBPYn2x4xt1k9MgAVyfzYIASsuqYYjIqgC1ExWKv8zCNK/LqE97R3BQf9hPwAQXIjr/6n49SWUf6DUm+ox0slMtXhEHHLyD+PVELtYo2rcgNRbxDAggRHTaajwrTSNPtE+b+IsfDVWRBxz65vkNa5HYTxBHPQkBz6l6k/Ym1NOiQzi0f/GLnihpOMRQVihWlbdARazVDAioijRoBREcBy2E52tJxJ8XSVp0QjSYjUUpaFN0vMVAsGWkTId6o8fBk6MplZOKSMdKOuTwo0L1jCKaJJN4IdWrjbACqHIKAjpR3YR60ugRJbqwSeavsIn7ZniVhqrVXpOsmqqnxO80keEO4mijnaALSXPlWamvOJTDyzqmJolJuuYTD1PlSkVTcpOpAiJxQKQ8TeqTUmCddzAByYEnok3uLVovyqKq8rOkjf/m/zZNbg5IM6+qrpkm8fRCBPSerWoCAvxE6gZEeErT5Kbkp8r0ClfYhIgSxFeCJZlqsq9IkqLtFqEV0swVCLmm3fxDffTNq54mSfR/tAtJUv3RN4jtm1MfeHl96w/B3+MZZIMiLP3B1oO+MJEpy9Mt17FYDd8HLb3XtfMEf3vkod+gJPudA1G5V0d9RGZBwMW0Y5AcWsc6apCnFc/CsSJ+0qDKC4lme33UJAWDxO8BCVPWi4AXiNe6VisJywaShVAOnX9fIDEUhI1AUuGjrBgWBSYv1xKiFcL9qnSw8JIWzkCC2g2I8J2kGJeapn2QIsuKJBtuRICTlkOQOpuZdUyWuLqsNX9EBgepRiAVGCTdXr9Owp4ic3by3IGAz5RulyynI0WmNcDB34PUhSHImiJZ9QWK+NsgyaYi3wDiZfgYydgXgASZgxj5CpDtipqtGCm4OxBwPyKmVptboRsxIuaH3wBSbRc5bcRIAVucczzWkgspW4vY6zFS7Cn/BhCD+n61xLikiNx6Q9wiGLgaxjfLpuGGJkWxdIRaL83hIJP5SIVwrc1awJWtBlUJGLsDKcGjnabyF1eJDR9qTebs8AcI1JhyFECR/+jqpavloG4jMYTcP4LY42kd29FK4wsEfEcPpej+sA8Cz4D5XEHKzMb69KWu6IEhs+9gNR6+IDOpfxCtTU97Yemr3eIl+copfbEgSgXWQMB+2hU76RxcFMm+rQHgbVdZnLqXThq46CoFECC5ox2rtmvv7bcXYUl7pkQpuiplfVzRKxTA9IdzO1YxMv/qMHn5S/uaQEvK4Ws8GRwIz5hsBqR0AELDaE/HxjmfvEbTKHn9AzvRHe2z19i0JZ0mpYaW9OjgSSt2VDAwinagIYaMuaNalN6wEWHwEOlqf8nz6aJvz1Ec6An7pF6rxifgcRvLnnH3nhU4qqAbjuSnVh4OrK13EH9ZOArxoKhyHgSxADvfRJ8pgubnwCLXgtQLNY2ImfN8lESssYP6ZfMHIR7FUy3V/SJEnpfk6vnSZKWN54ezroV5Ily8BII46VIK5rzt2Ocj5E5ceNYYBPPgpjss9XrEhWdN7laA+1btQUj2PgYkXwZB+JbvhdYcJy/ynHjWBAS+dFlHkRdZcohUcPUc9IZztyYhNq4i3/NLC4xSHO9jFCnXQOCzKwEiWnYydyvJgVGErd+HCA73qOkxruZuJQ2hSLwOEmAUkSRG7qXcSoH4TgSZAQGHe8MhUbbz8N3z9OFwRYKtm44rnCJKFL7eCbZyYGKk5lsgUEk6DklyX5XjdSRckWD7xvwKq8hqpPTlwMRIuQ1SohVRJFe+KQdCkcDk4RUBXpHGv8Yo/OSPOKAxMnmkE3H30M8RR6PK/sVSnq4TDLAigdkDXgIXiugJVXS93+/Xa6T+MTVYjNTc8NlBtRNFtCyeuhNjwWCKxKYPQYodKbJtoBhh5s/XAoy4fJCBFMnNQexT8DmEkdx3v7ZPza1sHt1mFe+/593uQmGKPC673e58RkX66lMBmQ3EToLcPXsOb0930sQZzr/gSF8FMVn/qwXFZaeNgiShvH3/RfyYeFll+8DJwASiwxCK0L21JGLE34F0wtTGKw6GzzJla/7Uk6JTxNq55HSSj05z2fCy2B5kYaRS/zYf3bgBvfmrMYgYwDx2MyZOvyBMAHlMbjzrTzMQrSKWJJ7cN+XzZ1vwMgZ7AnMwyU9LFFoRyi1IPLXisgTSwJyHXlZz4DOxuzCpZ4JiThE1HTfD8PRjDdfPKi/6ymU5+CnlUtvfdSkGivQXSNY5Ij3Af+w2rQv/AP649XwlKOYVkaJsovQm9Q+jk6tOJsA8AP/HjGIAQvndX3EwbzB3/DE9/+6I+0qCm+l1hvPa/VXNQ6YQYtp46h9qDHLBftuFKcljsvdxkvNCfXe7nlxd7/vRRP52NuSg6O8fOZpd6bawz74/neTv/jS/0X50wmH2jTBm1zrCyh7MYvCy9WV8Zt/RY0JyvrwR5PJw9K1JRyPxQeZED/PvsbpZpy1De7jhMP9mMQOSHwjIDZt3bUGemx/dGRTtxzOqHwSAPB+XdwTJzg2H3fchXiA9CTJEfp5vANlKXgDfOuLDHALy/DEeNzoJkaN5y2y//HS9/7q59azb830gq3nYvnM/OnErGMhq9nq4y1lHu1aBvnv65ioD/ziSAwry5Bc3vfvFRXRgQBbTl12U/Cym8efHQBb9yyZxXc6wIbtbkOdCyuG48SIMAwUyj2IxdHSIgQSRKBewcx0dYqBBZKxcYM416dSPD0wz8CCihzxCMtcw0i83ZCNcgIh+ZSjL0dKxLscfdBPcgMho6bEYBPzNKYVLEMVyNA34n3PrUQ9HF3cJouLlpvLY+bYd6EIK7u7CrkGaiBEwayT8cjk+HF/0HSCNn63YO673NpBP238CDAApnx3WCaBrvAAAAABJRU5ErkJggg==";
			img_2.alt = "Generic placeholder image";
			img_2.width = "100";
			img_2.height = "100";
			img_2.className = "d-flex align-self-start mr-2";
			div_63.className = "mt-3";
			h1_11.id = "dialogs";
			button_49.type = "button";
			button_49.className = "btn btn-secondary";
			button_49.title = "";
			button_49.dataset.container = "body";
			button_49.dataset.toggle = "popover";
			button_49.dataset.placement = "left";
			button_49.dataset.content = "Vivamus sagittis lacus vel augue laoreet rutrum faucibus.";
			button_49.dataset.originalTitle = "Popover Title";
			button_50.type = "button";
			button_50.className = "btn btn-secondary";
			button_50.title = "";
			button_50.dataset.container = "body";
			button_50.dataset.toggle = "popover";
			button_50.dataset.placement = "top";
			button_50.dataset.content = "Vivamus sagittis lacus vel augue laoreet rutrum faucibus.";
			button_50.dataset.originalTitle = "Popover Title";
			button_51.type = "button";
			button_51.className = "btn btn-secondary";
			button_51.title = "";
			button_51.dataset.container = "body";
			button_51.dataset.toggle = "popover";
			button_51.dataset.placement = "bottom";
			button_51.dataset.content = "Vivamus\n              sagittis lacus vel augue laoreet rutrum faucibus.";
			button_51.dataset.originalTitle = "Popover Title";
			button_52.type = "button";
			button_52.className = "btn btn-secondary";
			button_52.title = "";
			button_52.dataset.container = "body";
			button_52.dataset.toggle = "popover";
			button_52.dataset.placement = "right";
			button_52.dataset.content = "Vivamus sagittis lacus vel augue laoreet rutrum faucibus.";
			button_52.dataset.originalTitle = "Popover Title";
			div_65.className = "mb-3";
			button_53.type = "button";
			button_53.className = "btn btn-secondary";
			button_53.dataset.toggle = "tooltip";
			button_53.dataset.placement = "left";
			button_53.title = "";
			button_53.dataset.originalTitle = "Tooltip on left";
			button_54.type = "button";
			button_54.className = "btn btn-secondary";
			button_54.dataset.toggle = "tooltip";
			button_54.dataset.placement = "top";
			button_54.title = "";
			button_54.dataset.originalTitle = "Tooltip on top";
			button_55.type = "button";
			button_55.className = "btn btn-secondary";
			button_55.dataset.toggle = "tooltip";
			button_55.dataset.placement = "bottom";
			button_55.title = "";
			button_55.dataset.originalTitle = "Tooltip on bottom";
			button_56.type = "button";
			button_56.className = "btn btn-secondary";
			button_56.dataset.toggle = "tooltip";
			button_56.dataset.placement = "right";
			button_56.title = "";
			button_56.dataset.originalTitle = "Tooltip on right";
			div_64.className = "mt-3";
		},

		m: function mount(target, anchor) {
			insertNode(nav, target, anchor);
			appendNode(text, navbarbrand._slotted.default);
			appendNode(img, navbarbrand._slotted.default);
			appendNode(text_1, navbarbrand._slotted.default);
			navbarbrand._mount(nav, null);
			appendNode(text_2, nav);
			appendNode(ul, nav);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}

			insertNode(text_4, target, anchor);
			appendNode(text_5, container._slotted.default);
			appendNode(text_6, row._slotted.default);
			appendNode(text_7, col._slotted.default);
			appendNode(div, col._slotted.default);
			appendNode(text_8, listgroup._slotted.default);
			appendNode(a, listgroupitem._slotted.default);
			appendNode(text_9, a);
			listgroupitem._mount(listgroup._slotted.default, null);
			appendNode(text_10, listgroup._slotted.default);
			appendNode(a_1, listgroupitem_1._slotted.default);
			appendNode(text_11, a_1);
			listgroupitem_1._mount(listgroup._slotted.default, null);
			appendNode(text_12, listgroup._slotted.default);
			appendNode(a_2, listgroupitem_2._slotted.default);
			appendNode(text_13, a_2);
			listgroupitem_2._mount(listgroup._slotted.default, null);
			appendNode(text_14, listgroup._slotted.default);
			appendNode(a_3, listgroupitem_3._slotted.default);
			appendNode(text_15, a_3);
			listgroupitem_3._mount(listgroup._slotted.default, null);
			appendNode(text_16, listgroup._slotted.default);
			appendNode(a_4, listgroupitem_4._slotted.default);
			appendNode(text_17, a_4);
			listgroupitem_4._mount(listgroup._slotted.default, null);
			appendNode(text_18, listgroup._slotted.default);
			appendNode(a_5, listgroupitem_5._slotted.default);
			appendNode(text_19, a_5);
			listgroupitem_5._mount(listgroup._slotted.default, null);
			appendNode(text_20, listgroup._slotted.default);
			appendNode(a_6, listgroupitem_6._slotted.default);
			appendNode(text_21, a_6);
			listgroupitem_6._mount(listgroup._slotted.default, null);
			appendNode(text_22, listgroup._slotted.default);
			appendNode(a_7, listgroupitem_7._slotted.default);
			appendNode(text_23, a_7);
			listgroupitem_7._mount(listgroup._slotted.default, null);
			appendNode(text_24, listgroup._slotted.default);
			appendNode(a_8, listgroupitem_8._slotted.default);
			appendNode(text_25, a_8);
			listgroupitem_8._mount(listgroup._slotted.default, null);
			appendNode(text_26, listgroup._slotted.default);
			appendNode(a_9, listgroupitem_9._slotted.default);
			appendNode(text_27, a_9);
			listgroupitem_9._mount(listgroup._slotted.default, null);
			appendNode(text_28, listgroup._slotted.default);
			listgroup._mount(div, null);
			appendNode(text_30, col._slotted.default);
			col._mount(row._slotted.default, null);
			appendNode(text_31, row._slotted.default);
			appendNode(text_32, row._slotted.default);
			appendNode(text_33, col_1._slotted.default);
			appendNode(div_1, col_1._slotted.default);
			appendNode(text_34, row_1._slotted.default);
			appendNode(text_35, col_2._slotted.default);
			appendNode(h1, col_2._slotted.default);
			appendNode(text_36, h1);
			appendNode(text_37, col_2._slotted.default);
			appendNode(div_2, col_2._slotted.default);
			appendNode(nav_1, div_2);
			appendNode(button, nav_1);
			appendNode(text_39, nav_1);
			appendNode(a_10, nav_1);
			appendNode(text_41, nav_1);
			appendNode(div_3, nav_1);
			appendNode(ul_1, div_3);
			appendNode(text_42, navitem._slotted.default);
			appendNode(text_43, navlink._slotted.default);
			appendNode(span_1, navlink._slotted.default);
			appendNode(text_44, span_1);
			navlink._mount(navitem._slotted.default, null);
			appendNode(text_45, navitem._slotted.default);
			navitem._mount(ul_1, null);
			appendNode(text_46, navitem_1._slotted.default);
			appendNode(text_47, navlink_1._slotted.default);
			navlink_1._mount(navitem_1._slotted.default, null);
			appendNode(text_48, navitem_1._slotted.default);
			navitem_1._mount(ul_1, null);
			appendNode(text_49, navitem_2._slotted.default);
			appendNode(text_50, navlink_2._slotted.default);
			navlink_2._mount(navitem_2._slotted.default, null);
			appendNode(text_51, navitem_2._slotted.default);
			navitem_2._mount(ul_1, null);
			appendNode(text_52, navitem_3._slotted.default);
			appendNode(text_53, navlink_3._slotted.default);
			navlink_3._mount(navitem_3._slotted.default, null);
			appendNode(text_54, navitem_3._slotted.default);
			navitem_3._mount(ul_1, null);
			appendNode(text_55, div_3);
			appendNode(text_56, form._slotted.default);
			appendNode(input, form._slotted.default);
			appendNode(text_57, form._slotted.default);
			appendNode(text_58, button_1._slotted.default);
			button_1._mount(form._slotted.default, null);
			appendNode(text_59, form._slotted.default);
			form._mount(div_3, null);
			appendNode(text_63, col_2._slotted.default);
			appendNode(div_4, col_2._slotted.default);
			appendNode(nav_2, div_4);
			appendNode(button_2, nav_2);
			appendNode(text_65, nav_2);
			appendNode(a_11, navbarbrand_1._slotted.default);
			appendNode(text_66, a_11);
			navbarbrand_1._mount(nav_2, null);
			appendNode(text_67, nav_2);
			appendNode(div_5, nav_2);
			appendNode(ul_2, div_5);
			appendNode(text_68, navitem_4._slotted.default);
			appendNode(text_69, navlink_4._slotted.default);
			appendNode(span_3, navlink_4._slotted.default);
			appendNode(text_70, span_3);
			navlink_4._mount(navitem_4._slotted.default, null);
			appendNode(text_71, navitem_4._slotted.default);
			navitem_4._mount(ul_2, null);
			appendNode(text_72, navitem_5._slotted.default);
			appendNode(text_73, navlink_5._slotted.default);
			navlink_5._mount(navitem_5._slotted.default, null);
			appendNode(text_74, navitem_5._slotted.default);
			navitem_5._mount(ul_2, null);
			appendNode(text_75, navitem_6._slotted.default);
			appendNode(text_76, navlink_6._slotted.default);
			navlink_6._mount(navitem_6._slotted.default, null);
			appendNode(text_77, navitem_6._slotted.default);
			navitem_6._mount(ul_2, null);
			appendNode(text_78, navitem_7._slotted.default);
			appendNode(text_79, navlink_7._slotted.default);
			navlink_7._mount(navitem_7._slotted.default, null);
			appendNode(text_80, navitem_7._slotted.default);
			navitem_7._mount(ul_2, null);
			appendNode(text_81, div_5);
			appendNode(text_82, form_1._slotted.default);
			appendNode(input_1, form_1._slotted.default);
			appendNode(text_83, form_1._slotted.default);
			appendNode(text_84, button_3._slotted.default);
			button_3._mount(form_1._slotted.default, null);
			appendNode(text_85, form_1._slotted.default);
			form_1._mount(div_5, null);
			appendNode(text_89, col_2._slotted.default);
			col_2._mount(row_1._slotted.default, null);
			appendNode(text_90, row_1._slotted.default);
			row_1._mount(div_1, null);
			appendNode(text_92, col_1._slotted.default);
			appendNode(text_93, col_1._slotted.default);
			appendNode(div_6, col_1._slotted.default);
			appendNode(h1_1, div_6);
			appendNode(text_95, div_6);
			appendNode(text_96, row_2._slotted.default);
			appendNode(text_97, col_3._slotted.default);
			appendNode(p, col_3._slotted.default);
			appendNode(text_98, button_4._slotted.default);
			button_4._mount(p, null);
			appendNode(text_99, p);
			appendNode(text_100, button_5._slotted.default);
			button_5._mount(p, null);
			appendNode(text_101, p);
			appendNode(text_102, button_6._slotted.default);
			button_6._mount(p, null);
			appendNode(text_103, p);
			appendNode(text_104, button_7._slotted.default);
			button_7._mount(p, null);
			appendNode(text_105, p);
			appendNode(text_106, button_8._slotted.default);
			button_8._mount(p, null);
			appendNode(text_107, p);
			appendNode(text_108, button_9._slotted.default);
			button_9._mount(p, null);
			appendNode(text_109, p);
			appendNode(text_110, button_10._slotted.default);
			button_10._mount(p, null);
			appendNode(text_112, col_3._slotted.default);
			appendNode(p_1, col_3._slotted.default);
			appendNode(text_113, button_11._slotted.default);
			button_11._mount(p_1, null);
			appendNode(text_114, p_1);
			appendNode(text_115, button_12._slotted.default);
			button_12._mount(p_1, null);
			appendNode(text_116, p_1);
			appendNode(text_117, button_13._slotted.default);
			button_13._mount(p_1, null);
			appendNode(text_118, p_1);
			appendNode(text_119, button_14._slotted.default);
			button_14._mount(p_1, null);
			appendNode(text_120, p_1);
			appendNode(text_121, button_15._slotted.default);
			button_15._mount(p_1, null);
			appendNode(text_122, p_1);
			appendNode(text_123, button_16._slotted.default);
			button_16._mount(p_1, null);
			appendNode(text_124, p_1);
			appendNode(text_125, button_17._slotted.default);
			button_17._mount(p_1, null);
			appendNode(text_127, col_3._slotted.default);
			appendNode(p_2, col_3._slotted.default);
			appendNode(text_128, button_18._slotted.default);
			button_18._mount(p_2, null);
			appendNode(text_129, p_2);
			appendNode(text_130, button_19._slotted.default);
			button_19._mount(p_2, null);
			appendNode(text_131, p_2);
			appendNode(text_132, button_20._slotted.default);
			button_20._mount(p_2, null);
			appendNode(text_133, p_2);
			appendNode(text_134, button_21._slotted.default);
			button_21._mount(p_2, null);
			appendNode(text_135, p_2);
			appendNode(text_136, button_22._slotted.default);
			button_22._mount(p_2, null);
			appendNode(text_137, p_2);
			appendNode(text_138, button_23._slotted.default);
			button_23._mount(p_2, null);
			appendNode(text_140, col_3._slotted.default);
			appendNode(div_7, col_3._slotted.default);
			appendNode(text_141, button_24._slotted.default);
			button_24._mount(div_7, null);
			appendNode(text_142, div_7);
			appendNode(text_143, button_25._slotted.default);
			button_25._mount(div_7, null);
			appendNode(text_144, div_7);
			appendNode(text_145, button_26._slotted.default);
			button_26._mount(div_7, null);
			appendNode(text_147, col_3._slotted.default);
			col_3._mount(row_2._slotted.default, null);
			appendNode(text_148, row_2._slotted.default);
			appendNode(text_149, col_4._slotted.default);
			appendNode(p_3, col_4._slotted.default);
			appendNode(text_150, button_27._slotted.default);
			button_27._mount(p_3, null);
			appendNode(text_152, col_4._slotted.default);
			appendNode(div_8, col_4._slotted.default);
			appendNode(div_9, div_8);
			appendNode(text_160, col_4._slotted.default);
			appendNode(div_10, col_4._slotted.default);
			appendNode(div_11, div_10);
			appendNode(text_168, col_4._slotted.default);
			appendNode(div_12, col_4._slotted.default);
			appendNode(text_169, buttongroup._slotted.default);
			appendNode(text_170, button_28._slotted.default);
			button_28._mount(buttongroup._slotted.default, null);
			appendNode(text_171, buttongroup._slotted.default);
			appendNode(text_172, button_29._slotted.default);
			button_29._mount(buttongroup._slotted.default, null);
			appendNode(text_173, buttongroup._slotted.default);
			appendNode(text_174, button_30._slotted.default);
			button_30._mount(buttongroup._slotted.default, null);
			appendNode(text_175, buttongroup._slotted.default);
			appendNode(text_176, button_31._slotted.default);
			button_31._mount(buttongroup._slotted.default, null);
			appendNode(text_177, buttongroup._slotted.default);
			appendNode(text_178, button_32._slotted.default);
			button_32._mount(buttongroup._slotted.default, null);
			appendNode(text_179, buttongroup._slotted.default);
			appendNode(text_180, button_33._slotted.default);
			button_33._mount(buttongroup._slotted.default, null);
			appendNode(text_181, buttongroup._slotted.default);
			buttongroup._mount(div_12, null);
			appendNode(text_183, col_4._slotted.default);
			appendNode(div_13, col_4._slotted.default);
			appendNode(text_184, buttongroup_1._slotted.default);
			appendNode(text_185, button_34._slotted.default);
			button_34._mount(buttongroup_1._slotted.default, null);
			appendNode(text_186, buttongroup_1._slotted.default);
			appendNode(text_187, button_35._slotted.default);
			button_35._mount(buttongroup_1._slotted.default, null);
			appendNode(text_188, buttongroup_1._slotted.default);
			appendNode(text_189, button_36._slotted.default);
			button_36._mount(buttongroup_1._slotted.default, null);
			appendNode(text_190, buttongroup_1._slotted.default);
			buttongroup_1._mount(div_13, null);
			appendNode(text_192, col_4._slotted.default);
			appendNode(div_14, col_4._slotted.default);
			appendNode(text_193, buttontoolbar._slotted.default);
			appendNode(text_194, buttongroup_2._slotted.default);
			appendNode(text_195, button_37._slotted.default);
			button_37._mount(buttongroup_2._slotted.default, null);
			appendNode(text_196, buttongroup_2._slotted.default);
			appendNode(text_197, button_38._slotted.default);
			button_38._mount(buttongroup_2._slotted.default, null);
			appendNode(text_198, buttongroup_2._slotted.default);
			appendNode(text_199, button_39._slotted.default);
			button_39._mount(buttongroup_2._slotted.default, null);
			appendNode(text_200, buttongroup_2._slotted.default);
			appendNode(text_201, button_40._slotted.default);
			button_40._mount(buttongroup_2._slotted.default, null);
			appendNode(text_202, buttongroup_2._slotted.default);
			buttongroup_2._mount(buttontoolbar._slotted.default, null);
			appendNode(text_203, buttontoolbar._slotted.default);
			appendNode(text_204, buttongroup_3._slotted.default);
			appendNode(text_205, button_41._slotted.default);
			button_41._mount(buttongroup_3._slotted.default, null);
			appendNode(text_206, buttongroup_3._slotted.default);
			appendNode(text_207, button_42._slotted.default);
			button_42._mount(buttongroup_3._slotted.default, null);
			appendNode(text_208, buttongroup_3._slotted.default);
			appendNode(text_209, button_43._slotted.default);
			button_43._mount(buttongroup_3._slotted.default, null);
			appendNode(text_210, buttongroup_3._slotted.default);
			buttongroup_3._mount(buttontoolbar._slotted.default, null);
			appendNode(text_211, buttontoolbar._slotted.default);
			appendNode(text_212, buttongroup_4._slotted.default);
			appendNode(text_213, button_44._slotted.default);
			button_44._mount(buttongroup_4._slotted.default, null);
			appendNode(text_214, buttongroup_4._slotted.default);
			buttongroup_4._mount(buttontoolbar._slotted.default, null);
			appendNode(text_215, buttontoolbar._slotted.default);
			buttontoolbar._mount(div_14, null);
			appendNode(text_217, col_4._slotted.default);
			col_4._mount(row_2._slotted.default, null);
			appendNode(text_218, row_2._slotted.default);
			row_2._mount(div_6, null);
			appendNode(text_219, div_6);
			appendNode(text_220, row_3._slotted.default);
			appendNode(div_15, row_3._slotted.default);
			appendNode(h2, div_15);
			appendNode(text_222, div_15);
			appendNode(h4, div_15);
			appendNode(text_224, div_15);
			appendNode(text_225, dropdown._slotted.default);
			appendNode(text_226, button_45._slotted.default);
			button_45._mount(dropdown._slotted.default, null);
			appendNode(text_227, dropdown._slotted.default);
			appendNode(text_228, dropdownmenu._slotted.default);
			appendNode(text_229, dropdownheader._slotted.default);
			dropdownheader._mount(dropdownmenu._slotted.default, null);
			appendNode(text_230, dropdownmenu._slotted.default);
			appendNode(text_231, dropdownitem._slotted.default);
			appendNode(a_12, dropdownitem._slotted.default);
			appendNode(text_232, a_12);
			appendNode(text_233, dropdownitem._slotted.default);
			dropdownitem._mount(dropdownmenu._slotted.default, null);
			appendNode(text_234, dropdownmenu._slotted.default);
			dropdowndivider._mount(dropdownmenu._slotted.default, null);
			appendNode(text_235, dropdownmenu._slotted.default);
			appendNode(text_236, dropdownitem_1._slotted.default);
			appendNode(a_13, dropdownitem_1._slotted.default);
			appendNode(text_237, a_13);
			appendNode(text_238, dropdownitem_1._slotted.default);
			dropdownitem_1._mount(dropdownmenu._slotted.default, null);
			appendNode(text_239, dropdownmenu._slotted.default);
			dropdownmenu._mount(dropdown._slotted.default, null);
			appendNode(text_240, dropdown._slotted.default);
			dropdown._mount(div_15, null);
			appendNode(text_241, div_15);
			appendNode(h4_1, div_15);
			appendNode(text_243, div_15);
			appendNode(text_244, dropdown_1._slotted.default);
			appendNode(text_245, button_46._slotted.default);
			button_46._mount(dropdown_1._slotted.default, null);
			appendNode(text_246, dropdown_1._slotted.default);
			appendNode(text_247, dropdownmenu_1._slotted.default);
			appendNode(text_248, dropdownitem_2._slotted.default);
			dropdownitem_2._mount(dropdownmenu_1._slotted.default, null);
			appendNode(text_249, dropdownmenu_1._slotted.default);
			appendNode(text_250, dropdownitem_3._slotted.default);
			dropdownitem_3._mount(dropdownmenu_1._slotted.default, null);
			appendNode(text_251, dropdownmenu_1._slotted.default);
			dropdownmenu_1._mount(dropdown_1._slotted.default, null);
			appendNode(text_252, dropdown_1._slotted.default);
			dropdown_1._mount(div_15, null);
			appendNode(text_254, row_3._slotted.default);
			row_3._mount(div_6, null);
			appendNode(text_256, col_1._slotted.default);
			appendNode(text_257, col_1._slotted.default);
			appendNode(div_16, col_1._slotted.default);
			appendNode(h1_2, div_16);
			appendNode(text_259, div_16);
			appendNode(text_260, row_4._slotted.default);
			appendNode(div_17, row_4._slotted.default);
			appendNode(div_18, div_17);
			appendNode(text_280, row_4._slotted.default);
			appendNode(div_19, row_4._slotted.default);
			appendNode(div_20, div_19);
			appendNode(text_302, row_4._slotted.default);
			appendNode(div_21, row_4._slotted.default);
			appendNode(div_22, div_21);
			appendNode(text_318, row_4._slotted.default);
			row_4._mount(div_16, null);
			appendNode(text_319, div_16);
			appendNode(h2_4, div_16);
			appendNode(text_321, div_16);
			appendNode(text_322, row_5._slotted.default);
			appendNode(text_323, col_5._slotted.default);
			appendNode(blockquote, col_5._slotted.default);
			appendNode(p_16, blockquote);
			appendNode(text_325, blockquote);
			appendNode(footer, blockquote);
			appendNode(text_329, col_5._slotted.default);
			col_5._mount(row_5._slotted.default, null);
			appendNode(text_330, row_5._slotted.default);
			appendNode(text_331, col_6._slotted.default);
			appendNode(blockquote_1, col_6._slotted.default);
			appendNode(p_17, blockquote_1);
			appendNode(text_333, blockquote_1);
			appendNode(footer_1, blockquote_1);
			appendNode(text_337, col_6._slotted.default);
			col_6._mount(row_5._slotted.default, null);
			appendNode(text_338, row_5._slotted.default);
			row_5._mount(div_16, null);
			appendNode(text_340, col_1._slotted.default);
			appendNode(text_341, col_1._slotted.default);
			appendNode(div_23, col_1._slotted.default);
			appendNode(h1_4, div_23);
			appendNode(text_343, div_23);
			appendNode(text_344, row_6._slotted.default);
			appendNode(text_345, col_7._slotted.default);
			appendNode(text_346, table._slotted.default);
			appendNode(thead, table._slotted.default);
			appendNode(tr, thead);
			appendNode(text_356, table._slotted.default);
			appendNode(tbody, table._slotted.default);
			appendNode(tr_1, tbody);
			appendNode(text_365, tbody);
			appendNode(tr_2, tbody);
			appendNode(text_374, tbody);
			appendNode(tr_3, tbody);
			appendNode(text_383, tbody);
			appendNode(tr_4, tbody);
			appendNode(text_392, tbody);
			appendNode(tr_5, tbody);
			appendNode(text_401, tbody);
			appendNode(tr_6, tbody);
			appendNode(text_410, tbody);
			appendNode(tr_7, tbody);
			appendNode(text_420, table._slotted.default);
			table._mount(col_7._slotted.default, null);
			appendNode(text_421, col_7._slotted.default);
			col_7._mount(row_6._slotted.default, null);
			appendNode(text_422, row_6._slotted.default);
			row_6._mount(div_23, null);
			appendNode(text_424, col_1._slotted.default);
			appendNode(text_425, col_1._slotted.default);
			appendNode(div_24, col_1._slotted.default);
			appendNode(h1_5, div_24);
			appendNode(text_427, div_24);
			appendNode(text_428, row_7._slotted.default);
			appendNode(text_429, col_8._slotted.default);
			appendNode(text_430, form_2._slotted.default);
			appendNode(fieldset, form_2._slotted.default);
			appendNode(legend, fieldset);
			appendNode(text_432, fieldset);
			appendNode(div_25, fieldset);
			appendNode(text_438, fieldset);
			appendNode(div_26, fieldset);
			appendNode(text_442, fieldset);
			appendNode(div_27, fieldset);
			appendNode(label_8, div_27);
			appendNode(text_444, div_27);
			appendNode(select, div_27);
			appendNode(option, select);
			appendNode(text_445, option);
			appendNode(option_1, select);
			appendNode(text_446, option_1);
			appendNode(option_2, select);
			appendNode(text_447, option_2);
			appendNode(option_3, select);
			appendNode(text_448, option_3);
			appendNode(option_4, select);
			appendNode(text_449, option_4);
			appendNode(text_451, fieldset);
			appendNode(div_28, fieldset);
			appendNode(label_9, div_28);
			appendNode(text_453, div_28);
			appendNode(select_1, div_28);
			appendNode(option_5, select_1);
			appendNode(text_454, option_5);
			appendNode(option_6, select_1);
			appendNode(text_455, option_6);
			appendNode(option_7, select_1);
			appendNode(text_456, option_7);
			appendNode(option_8, select_1);
			appendNode(text_457, option_8);
			appendNode(option_9, select_1);
			appendNode(text_458, option_9);
			appendNode(text_460, fieldset);
			appendNode(div_29, fieldset);
			appendNode(text_464, fieldset);
			appendNode(div_30, fieldset);
			appendNode(text_470, fieldset);
			appendNode(fieldset_1, fieldset);
			appendNode(text_482, fieldset);
			appendNode(div_34, fieldset);
			appendNode(text_485, fieldset);
			appendNode(button_47, fieldset);
			appendNode(text_488, form_2._slotted.default);
			form_2._mount(col_8._slotted.default, null);
			appendNode(text_489, col_8._slotted.default);
			col_8._mount(row_7._slotted.default, null);
			appendNode(text_490, row_7._slotted.default);
			appendNode(text_491, col_9._slotted.default);
			appendNode(text_492, form_3._slotted.default);
			appendNode(text_493, formgroup._slotted.default);
			appendNode(fieldset_2, formgroup._slotted.default);
			appendNode(label_16, fieldset_2);
			appendNode(text_495, fieldset_2);
			appendNode(input_15, fieldset_2);
			appendNode(text_497, formgroup._slotted.default);
			formgroup._mount(form_3._slotted.default, null);
			appendNode(text_498, form_3._slotted.default);
			appendNode(text_499, formgroup_1._slotted.default);
			appendNode(fieldset_3, formgroup_1._slotted.default);
			appendNode(label_17, fieldset_3);
			appendNode(text_501, fieldset_3);
			appendNode(input_16, fieldset_3);
			appendNode(text_503, formgroup_1._slotted.default);
			formgroup_1._mount(form_3._slotted.default, null);
			appendNode(text_504, form_3._slotted.default);
			appendNode(text_505, formgroup_2._slotted.default);
			appendNode(label_18, formgroup_2._slotted.default);
			appendNode(text_506, label_18);
			appendNode(text_507, formgroup_2._slotted.default);
			appendNode(input_17, formgroup_2._slotted.default);
			appendNode(text_508, formgroup_2._slotted.default);
			appendNode(div_35, formgroup_2._slotted.default);
			appendNode(text_509, div_35);
			appendNode(text_510, formgroup_2._slotted.default);
			formgroup_2._mount(form_3._slotted.default, null);
			appendNode(text_511, form_3._slotted.default);
			appendNode(text_512, formgroup_3._slotted.default);
			appendNode(label_19, formgroup_3._slotted.default);
			appendNode(text_513, label_19);
			appendNode(text_514, formgroup_3._slotted.default);
			appendNode(input_18, formgroup_3._slotted.default);
			appendNode(text_515, formgroup_3._slotted.default);
			appendNode(div_36, formgroup_3._slotted.default);
			appendNode(text_516, div_36);
			appendNode(text_517, formgroup_3._slotted.default);
			formgroup_3._mount(form_3._slotted.default, null);
			appendNode(text_518, form_3._slotted.default);
			appendNode(text_519, formgroup_4._slotted.default);
			appendNode(label_20, formgroup_4._slotted.default);
			appendNode(text_520, label_20);
			appendNode(text_521, formgroup_4._slotted.default);
			appendNode(input_19, formgroup_4._slotted.default);
			appendNode(text_522, formgroup_4._slotted.default);
			appendNode(div_37, formgroup_4._slotted.default);
			appendNode(text_523, div_37);
			appendNode(text_524, formgroup_4._slotted.default);
			formgroup_4._mount(form_3._slotted.default, null);
			appendNode(text_525, form_3._slotted.default);
			appendNode(text_526, formgroup_5._slotted.default);
			appendNode(label_21, formgroup_5._slotted.default);
			appendNode(text_527, label_21);
			appendNode(text_528, formgroup_5._slotted.default);
			appendNode(input_20, formgroup_5._slotted.default);
			appendNode(text_529, formgroup_5._slotted.default);
			formgroup_5._mount(form_3._slotted.default, null);
			appendNode(text_530, form_3._slotted.default);
			appendNode(text_531, formgroup_6._slotted.default);
			appendNode(label_22, formgroup_6._slotted.default);
			appendNode(text_532, label_22);
			appendNode(text_533, formgroup_6._slotted.default);
			appendNode(input_21, formgroup_6._slotted.default);
			appendNode(text_534, formgroup_6._slotted.default);
			formgroup_6._mount(form_3._slotted.default, null);
			appendNode(text_535, form_3._slotted.default);
			appendNode(text_536, formgroup_7._slotted.default);
			appendNode(label_23, formgroup_7._slotted.default);
			appendNode(text_537, label_23);
			appendNode(text_538, formgroup_7._slotted.default);
			appendNode(input_22, formgroup_7._slotted.default);
			appendNode(text_539, formgroup_7._slotted.default);
			formgroup_7._mount(form_3._slotted.default, null);
			appendNode(text_540, form_3._slotted.default);
			appendNode(text_541, formgroup_8._slotted.default);
			appendNode(label_24, formgroup_8._slotted.default);
			appendNode(text_542, label_24);
			appendNode(text_543, formgroup_8._slotted.default);
			appendNode(text_544, formgroup_9._slotted.default);
			appendNode(label_25, formgroup_9._slotted.default);
			appendNode(text_545, label_25);
			appendNode(text_546, formgroup_9._slotted.default);
			appendNode(text_547, inputgroup._slotted.default);
			appendNode(text_548, inputgroupaddon._slotted.default);
			inputgroupaddon._mount(inputgroup._slotted.default, null);
			appendNode(text_549, inputgroup._slotted.default);
			appendNode(input_23, inputgroup._slotted.default);
			appendNode(text_550, inputgroup._slotted.default);
			appendNode(text_551, inputgroupaddon_1._slotted.default);
			inputgroupaddon_1._mount(inputgroup._slotted.default, null);
			appendNode(text_552, inputgroup._slotted.default);
			inputgroup._mount(formgroup_9._slotted.default, null);
			appendNode(text_553, formgroup_9._slotted.default);
			formgroup_9._mount(formgroup_8._slotted.default, null);
			appendNode(text_554, formgroup_8._slotted.default);
			formgroup_8._mount(form_3._slotted.default, null);
			appendNode(text_555, form_3._slotted.default);
			form_3._mount(col_9._slotted.default, null);
			appendNode(text_556, col_9._slotted.default);
			col_9._mount(row_7._slotted.default, null);
			appendNode(text_557, row_7._slotted.default);
			row_7._mount(div_24, null);
			appendNode(text_559, col_1._slotted.default);
			appendNode(text_560, col_1._slotted.default);
			appendNode(div_38, col_1._slotted.default);
			appendNode(h1_6, div_38);
			appendNode(text_562, div_38);
			appendNode(text_563, row_8._slotted.default);
			appendNode(text_564, col_10._slotted.default);
			appendNode(h2_5, col_10._slotted.default);
			appendNode(text_565, h2_5);
			appendNode(text_566, col_10._slotted.default);
			appendNode(div_39, col_10._slotted.default);
			appendNode(text_567, nav_3._slotted.default);
			appendNode(text_568, navitem_8._slotted.default);
			appendNode(text_569, navlink_8._slotted.default);
			navlink_8._mount(navitem_8._slotted.default, null);
			appendNode(text_570, navitem_8._slotted.default);
			navitem_8._mount(nav_3._slotted.default, null);
			appendNode(text_571, nav_3._slotted.default);
			appendNode(text_572, navitem_9._slotted.default);
			appendNode(text_573, navlink_9._slotted.default);
			navlink_9._mount(navitem_9._slotted.default, null);
			appendNode(text_574, navitem_9._slotted.default);
			navitem_9._mount(nav_3._slotted.default, null);
			appendNode(text_575, nav_3._slotted.default);
			appendNode(text_576, navitem_10._slotted.default);
			appendNode(text_577, navlink_10._slotted.default);
			navlink_10._mount(navitem_10._slotted.default, null);
			appendNode(text_578, navitem_10._slotted.default);
			navitem_10._mount(nav_3._slotted.default, null);
			appendNode(text_579, nav_3._slotted.default);
			appendNode(li, nav_3._slotted.default);
			appendNode(a_15, li);
			appendNode(text_581, li);
			appendNode(div_40, li);
			appendNode(text_592, nav_3._slotted.default);
			nav_3._mount(div_39, null);
			appendNode(text_593, div_39);
			appendNode(div_42, div_39);
			appendNode(text_607, col_10._slotted.default);
			col_10._mount(row_8._slotted.default, null);
			appendNode(text_608, row_8._slotted.default);
			appendNode(text_609, col_11._slotted.default);
			appendNode(h2_6, col_11._slotted.default);
			appendNode(text_610, h2_6);
			appendNode(text_611, col_11._slotted.default);
			appendNode(text_612, nav_4._slotted.default);
			appendNode(text_613, navitem_11._slotted.default);
			appendNode(text_614, navlink_11._slotted.default);
			navlink_11._mount(navitem_11._slotted.default, null);
			appendNode(text_615, navitem_11._slotted.default);
			navitem_11._mount(nav_4._slotted.default, null);
			appendNode(text_616, nav_4._slotted.default);
			appendNode(text_617, navdropdown._slotted.default);
			appendNode(a_20, navdropdown._slotted.default);
			appendNode(text_618, a_20);
			appendNode(text_619, navdropdown._slotted.default);
			appendNode(div_47, navdropdown._slotted.default);
			appendNode(a_21, div_47);
			appendNode(text_621, div_47);
			appendNode(a_22, div_47);
			appendNode(text_623, div_47);
			appendNode(a_23, div_47);
			appendNode(text_625, div_47);
			appendNode(div_48, div_47);
			appendNode(text_626, div_47);
			appendNode(a_24, div_47);
			appendNode(text_629, navdropdown._slotted.default);
			navdropdown._mount(nav_4._slotted.default, null);
			appendNode(text_630, nav_4._slotted.default);
			appendNode(text_631, navitem_12._slotted.default);
			appendNode(text_632, navlink_12._slotted.default);
			navlink_12._mount(navitem_12._slotted.default, null);
			appendNode(text_633, navitem_12._slotted.default);
			navitem_12._mount(nav_4._slotted.default, null);
			appendNode(text_634, nav_4._slotted.default);
			appendNode(text_635, navitem_13._slotted.default);
			appendNode(text_636, navlink_13._slotted.default);
			navlink_13._mount(navitem_13._slotted.default, null);
			appendNode(text_637, navitem_13._slotted.default);
			navitem_13._mount(nav_4._slotted.default, null);
			appendNode(text_638, nav_4._slotted.default);
			nav_4._mount(col_11._slotted.default, null);
			appendNode(text_639, col_11._slotted.default);
			appendNode(br, col_11._slotted.default);
			appendNode(text_640, col_11._slotted.default);
			appendNode(div_49, col_11._slotted.default);
			appendNode(text_641, nav_5._slotted.default);
			appendNode(text_642, navitem_14._slotted.default);
			appendNode(text_643, navlink_14._slotted.default);
			navlink_14._mount(navitem_14._slotted.default, null);
			appendNode(text_644, navitem_14._slotted.default);
			navitem_14._mount(nav_5._slotted.default, null);
			appendNode(text_645, nav_5._slotted.default);
			appendNode(text_646, navdropdown_1._slotted.default);
			appendNode(a_25, navdropdown_1._slotted.default);
			appendNode(text_647, a_25);
			appendNode(text_648, navdropdown_1._slotted.default);
			appendNode(div_50, navdropdown_1._slotted.default);
			appendNode(a_26, div_50);
			appendNode(text_650, div_50);
			appendNode(a_27, div_50);
			appendNode(text_652, div_50);
			appendNode(a_28, div_50);
			appendNode(text_654, div_50);
			appendNode(div_51, div_50);
			appendNode(text_655, div_50);
			appendNode(a_29, div_50);
			appendNode(text_658, navdropdown_1._slotted.default);
			navdropdown_1._mount(nav_5._slotted.default, null);
			appendNode(text_659, nav_5._slotted.default);
			appendNode(text_660, navitem_15._slotted.default);
			appendNode(text_661, navlink_15._slotted.default);
			navlink_15._mount(navitem_15._slotted.default, null);
			appendNode(text_662, navitem_15._slotted.default);
			navitem_15._mount(nav_5._slotted.default, null);
			appendNode(text_663, nav_5._slotted.default);
			appendNode(text_664, navitem_16._slotted.default);
			appendNode(text_665, navlink_16._slotted.default);
			navlink_16._mount(navitem_16._slotted.default, null);
			appendNode(text_666, navitem_16._slotted.default);
			navitem_16._mount(nav_5._slotted.default, null);
			appendNode(text_667, nav_5._slotted.default);
			nav_5._mount(div_49, null);
			appendNode(text_669, col_11._slotted.default);
			col_11._mount(row_8._slotted.default, null);
			appendNode(text_670, row_8._slotted.default);
			row_8._mount(div_38, null);
			appendNode(text_671, div_38);
			appendNode(h2_7, div_38);
			appendNode(text_673, div_38);
			appendNode(text_674, nav_6._slotted.default);
			appendNode(text_675, navitem_17._slotted.default);
			appendNode(text_676, navlink_17._slotted.default);
			navlink_17._mount(navitem_17._slotted.default, null);
			appendNode(text_677, navitem_17._slotted.default);
			navitem_17._mount(nav_6._slotted.default, null);
			appendNode(text_678, nav_6._slotted.default);
			appendNode(text_679, navitem_18._slotted.default);
			appendNode(text_680, navlink_18._slotted.default);
			navlink_18._mount(navitem_18._slotted.default, null);
			appendNode(text_681, navitem_18._slotted.default);
			navitem_18._mount(nav_6._slotted.default, null);
			appendNode(text_682, nav_6._slotted.default);
			appendNode(text_683, navitem_19._slotted.default);
			appendNode(text_684, navlink_19._slotted.default);
			navlink_19._mount(navitem_19._slotted.default, null);
			appendNode(text_685, navitem_19._slotted.default);
			navitem_19._mount(nav_6._slotted.default, null);
			appendNode(text_686, nav_6._slotted.default);
			appendNode(text_687, navitem_20._slotted.default);
			appendNode(text_688, navlink_20._slotted.default);
			navlink_20._mount(navitem_20._slotted.default, null);
			appendNode(text_689, navitem_20._slotted.default);
			navitem_20._mount(nav_6._slotted.default, null);
			appendNode(text_690, nav_6._slotted.default);
			nav_6._mount(div_38, null);
			appendNode(text_691, div_38);
			appendNode(h2_8, div_38);
			appendNode(text_693, div_38);
			appendNode(text_694, nav_7._slotted.default);
			appendNode(text_695, navitem_21._slotted.default);
			appendNode(text_696, navlink_21._slotted.default);
			navlink_21._mount(navitem_21._slotted.default, null);
			appendNode(text_697, navitem_21._slotted.default);
			navitem_21._mount(nav_7._slotted.default, null);
			appendNode(text_698, nav_7._slotted.default);
			appendNode(text_699, navitem_22._slotted.default);
			appendNode(text_700, navlink_22._slotted.default);
			navlink_22._mount(navitem_22._slotted.default, null);
			appendNode(text_701, navitem_22._slotted.default);
			navitem_22._mount(nav_7._slotted.default, null);
			appendNode(text_702, nav_7._slotted.default);
			appendNode(text_703, navitem_23._slotted.default);
			appendNode(text_704, navlink_23._slotted.default);
			navlink_23._mount(navitem_23._slotted.default, null);
			appendNode(text_705, navitem_23._slotted.default);
			navitem_23._mount(nav_7._slotted.default, null);
			appendNode(text_706, nav_7._slotted.default);
			appendNode(text_707, navitem_24._slotted.default);
			appendNode(text_708, navlink_24._slotted.default);
			navlink_24._mount(navitem_24._slotted.default, null);
			appendNode(text_709, navitem_24._slotted.default);
			navitem_24._mount(nav_7._slotted.default, null);
			appendNode(text_710, nav_7._slotted.default);
			nav_7._mount(div_38, null);
			appendNode(text_711, div_38);
			appendNode(text_712, row_9._slotted.default);
			appendNode(text_713, col_12._slotted.default);
			appendNode(h2_9, col_12._slotted.default);
			appendNode(text_714, h2_9);
			appendNode(text_715, col_12._slotted.default);
			appendNode(text_716, breadcrumb._slotted.default);
			appendNode(text_717, breadcrumbitem._slotted.default);
			breadcrumbitem._mount(breadcrumb._slotted.default, null);
			appendNode(text_718, breadcrumb._slotted.default);
			breadcrumb._mount(col_12._slotted.default, null);
			appendNode(text_719, col_12._slotted.default);
			appendNode(text_720, breadcrumb_1._slotted.default);
			appendNode(a_30, breadcrumbitem_1._slotted.default);
			appendNode(text_721, a_30);
			breadcrumbitem_1._mount(breadcrumb_1._slotted.default, null);
			appendNode(text_722, breadcrumb_1._slotted.default);
			appendNode(text_723, breadcrumbitem_2._slotted.default);
			breadcrumbitem_2._mount(breadcrumb_1._slotted.default, null);
			appendNode(text_724, breadcrumb_1._slotted.default);
			breadcrumb_1._mount(col_12._slotted.default, null);
			appendNode(text_725, col_12._slotted.default);
			appendNode(text_726, breadcrumb_2._slotted.default);
			appendNode(a_31, breadcrumbitem_3._slotted.default);
			appendNode(text_727, a_31);
			breadcrumbitem_3._mount(breadcrumb_2._slotted.default, null);
			appendNode(text_728, breadcrumb_2._slotted.default);
			appendNode(a_32, breadcrumbitem_4._slotted.default);
			appendNode(text_729, a_32);
			breadcrumbitem_4._mount(breadcrumb_2._slotted.default, null);
			appendNode(text_730, breadcrumb_2._slotted.default);
			appendNode(text_731, breadcrumbitem_5._slotted.default);
			breadcrumbitem_5._mount(breadcrumb_2._slotted.default, null);
			appendNode(text_732, breadcrumb_2._slotted.default);
			breadcrumb_2._mount(col_12._slotted.default, null);
			appendNode(text_733, col_12._slotted.default);
			col_12._mount(row_9._slotted.default, null);
			appendNode(text_734, row_9._slotted.default);
			appendNode(text_735, col_13._slotted.default);
			appendNode(h2_10, col_13._slotted.default);
			appendNode(text_736, h2_10);
			appendNode(text_737, col_13._slotted.default);
			appendNode(div_52, col_13._slotted.default);

			for (var i = 0; i < each_1_blocks.length; i += 1) {
				each_1_blocks[i].m(div_52, null);
			}

			appendNode(text_739, col_13._slotted.default);
			col_13._mount(row_9._slotted.default, null);
			appendNode(text_740, row_9._slotted.default);
			row_9._mount(div_38, null);
			appendNode(text_742, col_1._slotted.default);
			appendNode(text_743, col_1._slotted.default);
			appendNode(div_53, col_1._slotted.default);
			appendNode(h1_7, div_53);
			appendNode(text_745, div_53);
			appendNode(h2_11, div_53);
			appendNode(text_747, div_53);
			appendNode(text_748, alert._slotted.default);
			appendNode(h4_3, alert._slotted.default);
			appendNode(text_749, h4_3);
			appendNode(text_750, alert._slotted.default);
			appendNode(p_22, alert._slotted.default);
			appendNode(text_751, p_22);
			appendNode(a_33, p_22);
			appendNode(text_753, p_22);
			appendNode(text_754, alert._slotted.default);
			alert._mount(div_53, null);
			appendNode(text_755, div_53);
			appendNode(text_756, row_10._slotted.default);

			for (var i = 0; i < each_2_blocks.length; i += 1) {
				each_2_blocks[i].m(row_10._slotted.default, null);
			}

			appendNode(each_2_anchor, row_10._slotted.default);
			appendNode(text_757, row_10._slotted.default);
			row_10._mount(div_53, null);
			appendNode(text_758, div_53);
			appendNode(div_54, div_53);
			appendNode(h2_12, div_54);
			appendNode(text_760, div_54);
			appendNode(div_55, div_54);
			appendNode(text_761, badge._slotted.default);
			badge._mount(div_55, null);
			appendNode(text_762, div_55);
			appendNode(text_763, badge_1._slotted.default);
			badge_1._mount(div_55, null);
			appendNode(text_764, div_55);
			appendNode(text_765, badge_2._slotted.default);
			badge_2._mount(div_55, null);
			appendNode(text_766, div_55);
			appendNode(text_767, badge_3._slotted.default);
			badge_3._mount(div_55, null);
			appendNode(text_768, div_55);
			appendNode(text_769, badge_4._slotted.default);
			badge_4._mount(div_55, null);
			appendNode(text_770, div_55);
			appendNode(text_771, badge_5._slotted.default);
			badge_5._mount(div_55, null);
			appendNode(text_773, div_54);
			appendNode(div_56, div_54);
			appendNode(text_774, badge_6._slotted.default);
			badge_6._mount(div_56, null);
			appendNode(text_775, div_56);
			appendNode(text_776, badge_7._slotted.default);
			badge_7._mount(div_56, null);
			appendNode(text_777, div_56);
			appendNode(text_778, badge_8._slotted.default);
			badge_8._mount(div_56, null);
			appendNode(text_779, div_56);
			appendNode(text_780, badge_9._slotted.default);
			badge_9._mount(div_56, null);
			appendNode(text_781, div_56);
			appendNode(text_782, badge_10._slotted.default);
			badge_10._mount(div_56, null);
			appendNode(text_783, div_56);
			appendNode(text_784, badge_11._slotted.default);
			badge_11._mount(div_56, null);
			appendNode(text_788, col_1._slotted.default);
			appendNode(text_789, col_1._slotted.default);
			appendNode(div_57, col_1._slotted.default);
			appendNode(text_790, row_11._slotted.default);
			appendNode(text_791, col_14._slotted.default);
			appendNode(h1_8, col_14._slotted.default);
			appendNode(text_792, h1_8);
			appendNode(text_793, col_14._slotted.default);
			appendNode(h3_2, col_14._slotted.default);
			appendNode(text_794, h3_2);
			appendNode(text_795, col_14._slotted.default);
			appendNode(div_58, col_14._slotted.default);
			progress._mount(div_58, null);
			appendNode(text_797, col_14._slotted.default);
			appendNode(h3_3, col_14._slotted.default);
			appendNode(text_798, h3_3);
			appendNode(text_799, col_14._slotted.default);
			appendNode(div_59, col_14._slotted.default);
			progress_1._mount(div_59, null);
			appendNode(text_800, div_59);
			progress_2._mount(div_59, null);
			appendNode(text_801, div_59);
			progress_3._mount(div_59, null);
			appendNode(text_802, div_59);
			progress_4._mount(div_59, null);
			appendNode(text_804, col_14._slotted.default);
			appendNode(h3_4, col_14._slotted.default);
			appendNode(text_805, h3_4);
			appendNode(text_806, col_14._slotted.default);
			appendNode(div_60, col_14._slotted.default);
			appendNode(text_807, progress_5._slotted.default);
			progress_6._mount(progress_5._slotted.default, null);
			appendNode(text_808, progress_5._slotted.default);
			progress_7._mount(progress_5._slotted.default, null);
			appendNode(text_809, progress_5._slotted.default);
			progress_8._mount(progress_5._slotted.default, null);
			appendNode(text_810, progress_5._slotted.default);
			progress_5._mount(div_60, null);
			appendNode(text_812, col_14._slotted.default);
			appendNode(h3_5, col_14._slotted.default);
			appendNode(text_813, h3_5);
			appendNode(text_814, col_14._slotted.default);
			appendNode(div_61, col_14._slotted.default);
			progress_9._mount(div_61, null);
			appendNode(text_815, div_61);
			progress_10._mount(div_61, null);
			appendNode(text_816, div_61);
			progress_11._mount(div_61, null);
			appendNode(text_817, div_61);
			progress_12._mount(div_61, null);
			appendNode(text_818, div_61);
			progress_13._mount(div_61, null);
			appendNode(text_820, col_14._slotted.default);
			appendNode(h3_6, col_14._slotted.default);
			appendNode(text_821, h3_6);
			appendNode(text_822, col_14._slotted.default);
			appendNode(div_62, col_14._slotted.default);
			progress_14._mount(div_62, null);
			appendNode(text_823, div_62);
			progress_15._mount(div_62, null);
			appendNode(text_824, div_62);
			progress_16._mount(div_62, null);
			appendNode(text_825, div_62);
			progress_17._mount(div_62, null);
			appendNode(text_826, div_62);
			progress_18._mount(div_62, null);
			appendNode(text_828, col_14._slotted.default);
			col_14._mount(row_11._slotted.default, null);
			appendNode(text_829, row_11._slotted.default);
			row_11._mount(div_57, null);
			appendNode(text_831, col_1._slotted.default);
			appendNode(text_832, col_1._slotted.default);
			appendNode(div_63, col_1._slotted.default);
			appendNode(text_833, row_12._slotted.default);
			appendNode(text_834, col_15._slotted.default);
			appendNode(h1_9, col_15._slotted.default);
			appendNode(text_835, h1_9);
			appendNode(text_836, col_15._slotted.default);
			appendNode(text_837, jumbotron._slotted.default);
			appendNode(h1_10, jumbotron._slotted.default);
			appendNode(text_838, h1_10);
			appendNode(text_839, jumbotron._slotted.default);
			appendNode(p_23, jumbotron._slotted.default);
			appendNode(text_840, p_23);
			appendNode(text_841, jumbotron._slotted.default);
			appendNode(p_24, jumbotron._slotted.default);
			appendNode(text_842, button_48._slotted.default);
			button_48._mount(p_24, null);
			appendNode(text_843, jumbotron._slotted.default);
			jumbotron._mount(col_15._slotted.default, null);
			appendNode(text_844, col_15._slotted.default);
			col_15._mount(row_12._slotted.default, null);
			appendNode(text_845, row_12._slotted.default);
			row_12._mount(div_63, null);
			appendNode(text_846, div_63);
			appendNode(h2_13, div_63);
			appendNode(text_848, div_63);
			appendNode(text_849, row_13._slotted.default);
			appendNode(text_850, col_16._slotted.default);
			appendNode(text_851, listgroup_1._slotted.default);
			appendNode(text_852, listgroupitem_10._slotted.default);
			appendNode(text_853, badge_12._slotted.default);
			badge_12._mount(listgroupitem_10._slotted.default, null);
			appendNode(text_854, listgroupitem_10._slotted.default);
			listgroupitem_10._mount(listgroup_1._slotted.default, null);
			appendNode(text_855, listgroup_1._slotted.default);
			appendNode(text_856, listgroupitem_11._slotted.default);
			appendNode(text_857, badge_13._slotted.default);
			badge_13._mount(listgroupitem_11._slotted.default, null);
			appendNode(text_858, listgroupitem_11._slotted.default);
			listgroupitem_11._mount(listgroup_1._slotted.default, null);
			appendNode(text_859, listgroup_1._slotted.default);
			appendNode(text_860, listgroupitem_12._slotted.default);
			appendNode(text_861, badge_14._slotted.default);
			badge_14._mount(listgroupitem_12._slotted.default, null);
			appendNode(text_862, listgroupitem_12._slotted.default);
			listgroupitem_12._mount(listgroup_1._slotted.default, null);
			appendNode(text_863, listgroup_1._slotted.default);
			listgroup_1._mount(col_16._slotted.default, null);
			appendNode(text_864, col_16._slotted.default);
			col_16._mount(row_13._slotted.default, null);
			appendNode(text_865, row_13._slotted.default);
			appendNode(text_866, col_17._slotted.default);
			appendNode(text_867, listgroup_2._slotted.default);
			appendNode(text_868, listgroupitem_13._slotted.default);
			listgroupitem_13._mount(listgroup_2._slotted.default, null);
			appendNode(text_869, listgroup_2._slotted.default);
			appendNode(text_870, listgroupitem_14._slotted.default);
			listgroupitem_14._mount(listgroup_2._slotted.default, null);
			appendNode(text_871, listgroup_2._slotted.default);
			appendNode(text_872, listgroupitem_15._slotted.default);
			listgroupitem_15._mount(listgroup_2._slotted.default, null);
			appendNode(text_873, listgroup_2._slotted.default);
			listgroup_2._mount(col_17._slotted.default, null);
			appendNode(text_874, col_17._slotted.default);
			col_17._mount(row_13._slotted.default, null);
			appendNode(text_875, row_13._slotted.default);
			appendNode(text_876, col_18._slotted.default);
			appendNode(text_877, listgroup_3._slotted.default);
			appendNode(text_878, listgroupitem_16._slotted.default);
			appendNode(text_879, listgroupitemheading._slotted.default);
			listgroupitemheading._mount(listgroupitem_16._slotted.default, null);
			appendNode(text_880, listgroupitem_16._slotted.default);
			appendNode(text_881, listgroupitemtext._slotted.default);
			listgroupitemtext._mount(listgroupitem_16._slotted.default, null);
			appendNode(text_882, listgroupitem_16._slotted.default);
			listgroupitem_16._mount(listgroup_3._slotted.default, null);
			appendNode(text_883, listgroup_3._slotted.default);
			appendNode(text_884, listgroupitem_17._slotted.default);
			appendNode(text_885, listgroupitemheading_1._slotted.default);
			listgroupitemheading_1._mount(listgroupitem_17._slotted.default, null);
			appendNode(text_886, listgroupitem_17._slotted.default);
			appendNode(text_887, listgroupitemtext_1._slotted.default);
			listgroupitemtext_1._mount(listgroupitem_17._slotted.default, null);
			appendNode(text_888, listgroupitem_17._slotted.default);
			listgroupitem_17._mount(listgroup_3._slotted.default, null);
			appendNode(text_889, listgroup_3._slotted.default);
			listgroup_3._mount(col_18._slotted.default, null);
			appendNode(text_890, col_18._slotted.default);
			col_18._mount(row_13._slotted.default, null);
			appendNode(text_891, row_13._slotted.default);
			row_13._mount(div_63, null);
			appendNode(text_892, div_63);
			appendNode(h2_14, div_63);
			appendNode(text_894, div_63);
			appendNode(text_895, row_14._slotted.default);
			appendNode(text_896, col_19._slotted.default);

			for (var i = 0; i < each_3_blocks.length; i += 1) {
				each_3_blocks[i].m(col_19._slotted.default, null);
			}

			appendNode(each_3_anchor, col_19._slotted.default);
			appendNode(text_897, col_19._slotted.default);
			col_19._mount(row_14._slotted.default, null);
			appendNode(text_898, row_14._slotted.default);
			appendNode(text_899, col_20._slotted.default);

			for (var i = 0; i < each_4_blocks.length; i += 1) {
				each_4_blocks[i].m(col_20._slotted.default, null);
			}

			appendNode(each_4_anchor, col_20._slotted.default);
			appendNode(text_900, col_20._slotted.default);
			col_20._mount(row_14._slotted.default, null);
			appendNode(text_901, row_14._slotted.default);
			appendNode(text_902, col_21._slotted.default);
			appendNode(text_903, card._slotted.default);
			appendNode(text_904, cardheader._slotted.default);
			cardheader._mount(card._slotted.default, null);
			appendNode(text_905, card._slotted.default);
			appendNode(text_906, cardbody._slotted.default);
			appendNode(text_907, cardtitle._slotted.default);
			cardtitle._mount(cardbody._slotted.default, null);
			appendNode(text_908, cardbody._slotted.default);
			appendNode(text_909, cardsubtitle._slotted.default);
			cardsubtitle._mount(cardbody._slotted.default, null);
			appendNode(text_910, cardbody._slotted.default);
			cardbody._mount(card._slotted.default, null);
			appendNode(text_911, card._slotted.default);
			appendNode(img_1, card._slotted.default);
			appendNode(text_912, card._slotted.default);
			appendNode(text_913, cardbody_1._slotted.default);
			appendNode(p_25, cardbody_1._slotted.default);
			appendNode(text_914, p_25);
			appendNode(text_915, cardbody_1._slotted.default);
			appendNode(a_34, cardbody_1._slotted.default);
			appendNode(text_916, a_34);
			appendNode(text_917, cardbody_1._slotted.default);
			appendNode(a_35, cardbody_1._slotted.default);
			appendNode(text_918, a_35);
			appendNode(text_919, cardbody_1._slotted.default);
			cardbody_1._mount(card._slotted.default, null);
			appendNode(text_920, card._slotted.default);
			appendNode(text_921, cardfooter._slotted.default);
			cardfooter._mount(card._slotted.default, null);
			appendNode(text_922, card._slotted.default);
			card._mount(col_21._slotted.default, null);
			appendNode(text_923, col_21._slotted.default);
			col_21._mount(row_14._slotted.default, null);
			appendNode(text_924, row_14._slotted.default);
			row_14._mount(div_63, null);
			appendNode(text_925, div_63);
			appendNode(h2_15, div_63);
			appendNode(text_927, div_63);
			appendNode(text_928, row_15._slotted.default);
			appendNode(text_929, media._slotted.default);
			appendNode(img_2, media._slotted.default);
			appendNode(text_930, media._slotted.default);
			appendNode(text_931, mediabody._slotted.default);
			appendNode(h4_4, mediabody._slotted.default);
			appendNode(text_932, h4_4);
			appendNode(text_933, mediabody._slotted.default);
			mediabody._mount(media._slotted.default, null);
			appendNode(text_934, media._slotted.default);
			media._mount(row_15._slotted.default, null);
			appendNode(text_935, row_15._slotted.default);
			row_15._mount(div_63, null);
			appendNode(text_937, col_1._slotted.default);
			appendNode(text_938, col_1._slotted.default);
			appendNode(div_64, col_1._slotted.default);
			appendNode(h1_11, div_64);
			appendNode(text_940, div_64);
			appendNode(text_941, row_16._slotted.default);
			appendNode(text_942, col_22._slotted.default);
			appendNode(h2_16, col_22._slotted.default);
			appendNode(text_943, h2_16);
			appendNode(text_944, col_22._slotted.default);
			appendNode(text_945, col_22._slotted.default);
			col_22._mount(row_16._slotted.default, null);
			appendNode(text_946, row_16._slotted.default);
			appendNode(text_947, col_23._slotted.default);
			appendNode(h2_17, col_23._slotted.default);
			appendNode(text_948, h2_17);
			appendNode(text_949, col_23._slotted.default);
			appendNode(div_65, col_23._slotted.default);
			appendNode(button_49, div_65);
			appendNode(text_951, div_65);
			appendNode(button_50, div_65);
			appendNode(text_953, div_65);
			appendNode(button_51, div_65);
			appendNode(text_955, div_65);
			appendNode(button_52, div_65);
			appendNode(text_958, col_23._slotted.default);
			appendNode(h2_18, col_23._slotted.default);
			appendNode(text_959, h2_18);
			appendNode(text_960, col_23._slotted.default);
			appendNode(div_66, col_23._slotted.default);
			appendNode(button_53, div_66);
			appendNode(text_962, div_66);
			appendNode(button_54, div_66);
			appendNode(text_964, div_66);
			appendNode(button_55, div_66);
			appendNode(text_966, div_66);
			appendNode(button_56, div_66);
			appendNode(text_969, col_23._slotted.default);
			col_23._mount(row_16._slotted.default, null);
			appendNode(text_970, row_16._slotted.default);
			row_16._mount(div_64, null);
			appendNode(text_972, col_1._slotted.default);
			appendNode(text_973, col_1._slotted.default);
			col_1._mount(row._slotted.default, null);
			appendNode(text_974, row._slotted.default);
			row._mount(container._slotted.default, null);
			appendNode(text_975, container._slotted.default);
			container._mount(target, anchor);
		},

		p: function update(changed, state) {
			var each_value = state.themes;

			if (changed.current || changed.themes) {
				for (var i = 0; i < each_value.length; i += 1) {
					var each_context = assign(assign({}, state), {
						each_value: each_value,
						theme: each_value[i],
						theme_index: i
					});

					if (each_blocks[i]) {
						each_blocks[i].p(changed, each_context);
					} else {
						each_blocks[i] = create_each_block(component, each_context);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].u();
					each_blocks[i].d();
				}
				each_blocks.length = each_value.length;
			}

			var dropdown_changes = {};
			if (changed.open) dropdown_changes.open = state.open;
			dropdown._set(dropdown_changes);

			var dropdown_1_changes = {};
			if (changed.open2) dropdown_1_changes.open = state.open2;
			dropdown_1._set(dropdown_1_changes);

			var col_9_changes = {};
			col_9_changes.lg = { size: 4, offset: 1 };
			col_9._set(col_9_changes);
		},

		u: function unmount() {
			detachNode(nav);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].u();
			}

			detachNode(text_4);

			for (var i = 0; i < each_1_blocks.length; i += 1) {
				each_1_blocks[i].u();
			}

			for (var i = 0; i < each_2_blocks.length; i += 1) {
				each_2_blocks[i].u();
			}

			for (var i = 0; i < each_3_blocks.length; i += 1) {
				each_3_blocks[i].u();
			}

			for (var i = 0; i < each_4_blocks.length; i += 1) {
				each_4_blocks[i].u();
			}

			container._unmount();
		},

		d: function destroy$$1() {
			navbarbrand.destroy(false);

			destroyEach(each_blocks);

			listgroupitem.destroy(false);
			listgroupitem_1.destroy(false);
			listgroupitem_2.destroy(false);
			listgroupitem_3.destroy(false);
			listgroupitem_4.destroy(false);
			listgroupitem_5.destroy(false);
			listgroupitem_6.destroy(false);
			listgroupitem_7.destroy(false);
			listgroupitem_8.destroy(false);
			listgroupitem_9.destroy(false);
			listgroup.destroy(false);
			col.destroy(false);
			navlink.destroy(false);
			navitem.destroy(false);
			navlink_1.destroy(false);
			navitem_1.destroy(false);
			navlink_2.destroy(false);
			navitem_2.destroy(false);
			navlink_3.destroy(false);
			navitem_3.destroy(false);
			button_1.destroy(false);
			form.destroy(false);
			navbarbrand_1.destroy(false);
			navlink_4.destroy(false);
			navitem_4.destroy(false);
			navlink_5.destroy(false);
			navitem_5.destroy(false);
			navlink_6.destroy(false);
			navitem_6.destroy(false);
			navlink_7.destroy(false);
			navitem_7.destroy(false);
			button_3.destroy(false);
			form_1.destroy(false);
			col_2.destroy(false);
			row_1.destroy(false);
			button_4.destroy(false);
			button_5.destroy(false);
			button_6.destroy(false);
			button_7.destroy(false);
			button_8.destroy(false);
			button_9.destroy(false);
			button_10.destroy(false);
			button_11.destroy(false);
			button_12.destroy(false);
			button_13.destroy(false);
			button_14.destroy(false);
			button_15.destroy(false);
			button_16.destroy(false);
			button_17.destroy(false);
			button_18.destroy(false);
			button_19.destroy(false);
			button_20.destroy(false);
			button_21.destroy(false);
			button_22.destroy(false);
			button_23.destroy(false);
			button_24.destroy(false);
			button_25.destroy(false);
			button_26.destroy(false);
			col_3.destroy(false);
			button_27.destroy(false);
			button_28.destroy(false);
			button_29.destroy(false);
			button_30.destroy(false);
			button_31.destroy(false);
			button_32.destroy(false);
			button_33.destroy(false);
			buttongroup.destroy(false);
			button_34.destroy(false);
			button_35.destroy(false);
			button_36.destroy(false);
			buttongroup_1.destroy(false);
			button_37.destroy(false);
			button_38.destroy(false);
			button_39.destroy(false);
			button_40.destroy(false);
			buttongroup_2.destroy(false);
			button_41.destroy(false);
			button_42.destroy(false);
			button_43.destroy(false);
			buttongroup_3.destroy(false);
			button_44.destroy(false);
			buttongroup_4.destroy(false);
			buttontoolbar.destroy(false);
			col_4.destroy(false);
			row_2.destroy(false);
			button_45.destroy(false);
			dropdownheader.destroy(false);
			dropdownitem.destroy(false);
			dropdowndivider.destroy(false);
			dropdownitem_1.destroy(false);
			dropdownmenu.destroy(false);
			dropdown.destroy(false);
			button_46.destroy(false);
			dropdownitem_2.destroy(false);
			dropdownitem_3.destroy(false);
			dropdownmenu_1.destroy(false);
			dropdown_1.destroy(false);
			row_3.destroy(false);
			row_4.destroy(false);
			col_5.destroy(false);
			col_6.destroy(false);
			row_5.destroy(false);
			table.destroy(false);
			col_7.destroy(false);
			row_6.destroy(false);
			form_2.destroy(false);
			col_8.destroy(false);
			formgroup.destroy(false);
			formgroup_1.destroy(false);
			formgroup_2.destroy(false);
			formgroup_3.destroy(false);
			formgroup_4.destroy(false);
			formgroup_5.destroy(false);
			formgroup_6.destroy(false);
			formgroup_7.destroy(false);
			inputgroupaddon.destroy(false);
			inputgroupaddon_1.destroy(false);
			inputgroup.destroy(false);
			formgroup_9.destroy(false);
			formgroup_8.destroy(false);
			form_3.destroy(false);
			col_9.destroy(false);
			row_7.destroy(false);
			navlink_8.destroy(false);
			navitem_8.destroy(false);
			navlink_9.destroy(false);
			navitem_9.destroy(false);
			navlink_10.destroy(false);
			navitem_10.destroy(false);
			nav_3.destroy(false);
			col_10.destroy(false);
			navlink_11.destroy(false);
			navitem_11.destroy(false);
			navdropdown.destroy(false);
			navlink_12.destroy(false);
			navitem_12.destroy(false);
			navlink_13.destroy(false);
			navitem_13.destroy(false);
			nav_4.destroy(false);
			navlink_14.destroy(false);
			navitem_14.destroy(false);
			navdropdown_1.destroy(false);
			navlink_15.destroy(false);
			navitem_15.destroy(false);
			navlink_16.destroy(false);
			navitem_16.destroy(false);
			nav_5.destroy(false);
			col_11.destroy(false);
			row_8.destroy(false);
			navlink_17.destroy(false);
			navitem_17.destroy(false);
			navlink_18.destroy(false);
			navitem_18.destroy(false);
			navlink_19.destroy(false);
			navitem_19.destroy(false);
			navlink_20.destroy(false);
			navitem_20.destroy(false);
			nav_6.destroy(false);
			navlink_21.destroy(false);
			navitem_21.destroy(false);
			navlink_22.destroy(false);
			navitem_22.destroy(false);
			navlink_23.destroy(false);
			navitem_23.destroy(false);
			navlink_24.destroy(false);
			navitem_24.destroy(false);
			nav_7.destroy(false);
			breadcrumbitem.destroy(false);
			breadcrumb.destroy(false);
			breadcrumbitem_1.destroy(false);
			breadcrumbitem_2.destroy(false);
			breadcrumb_1.destroy(false);
			breadcrumbitem_3.destroy(false);
			breadcrumbitem_4.destroy(false);
			breadcrumbitem_5.destroy(false);
			breadcrumb_2.destroy(false);
			col_12.destroy(false);

			destroyEach(each_1_blocks);

			col_13.destroy(false);
			row_9.destroy(false);
			alert.destroy(false);

			destroyEach(each_2_blocks);

			row_10.destroy(false);
			badge.destroy(false);
			badge_1.destroy(false);
			badge_2.destroy(false);
			badge_3.destroy(false);
			badge_4.destroy(false);
			badge_5.destroy(false);
			badge_6.destroy(false);
			badge_7.destroy(false);
			badge_8.destroy(false);
			badge_9.destroy(false);
			badge_10.destroy(false);
			badge_11.destroy(false);
			progress.destroy(false);
			progress_1.destroy(false);
			progress_2.destroy(false);
			progress_3.destroy(false);
			progress_4.destroy(false);
			progress_6.destroy(false);
			progress_7.destroy(false);
			progress_8.destroy(false);
			progress_5.destroy(false);
			progress_9.destroy(false);
			progress_10.destroy(false);
			progress_11.destroy(false);
			progress_12.destroy(false);
			progress_13.destroy(false);
			progress_14.destroy(false);
			progress_15.destroy(false);
			progress_16.destroy(false);
			progress_17.destroy(false);
			progress_18.destroy(false);
			col_14.destroy(false);
			row_11.destroy(false);
			button_48.destroy(false);
			jumbotron.destroy(false);
			col_15.destroy(false);
			row_12.destroy(false);
			badge_12.destroy(false);
			listgroupitem_10.destroy(false);
			badge_13.destroy(false);
			listgroupitem_11.destroy(false);
			badge_14.destroy(false);
			listgroupitem_12.destroy(false);
			listgroup_1.destroy(false);
			col_16.destroy(false);
			listgroupitem_13.destroy(false);
			listgroupitem_14.destroy(false);
			listgroupitem_15.destroy(false);
			listgroup_2.destroy(false);
			col_17.destroy(false);
			listgroupitemheading.destroy(false);
			listgroupitemtext.destroy(false);
			listgroupitem_16.destroy(false);
			listgroupitemheading_1.destroy(false);
			listgroupitemtext_1.destroy(false);
			listgroupitem_17.destroy(false);
			listgroup_3.destroy(false);
			col_18.destroy(false);
			row_13.destroy(false);

			destroyEach(each_3_blocks);

			col_19.destroy(false);

			destroyEach(each_4_blocks);

			col_20.destroy(false);
			cardheader.destroy(false);
			cardtitle.destroy(false);
			cardsubtitle.destroy(false);
			cardbody.destroy(false);
			cardbody_1.destroy(false);
			cardfooter.destroy(false);
			card.destroy(false);
			col_21.destroy(false);
			row_14.destroy(false);
			mediabody.destroy(false);
			media.destroy(false);
			row_15.destroy(false);
			col_22.destroy(false);
			col_23.destroy(false);
			row_16.destroy(false);
			col_1.destroy(false);
			row.destroy(false);
			container.destroy(false);
		}
	};
}

// (6:4) {{#each themes as theme}}
function create_each_block(component, state) {
	var theme = state.theme, each_value = state.each_value, theme_index = state.theme_index;
	var text, text_1, small, text_3, text_4;

	function select_block_type(state) {
		if (state.current == theme.name) return create_if_block;
		return create_if_block_1;
	}

	var current_block_type = select_block_type(state);
	var if_block = current_block_type(component, state);

	var navlink = new NavLink({
		root: component.root,
		slots: { default: createFragment() }
	});

	navlink.on("click", function(event) {
		component.changeTheme(theme);
	});

	var navitem_initial_data = { active: state.current == theme.name };
	var navitem = new NavItem({
		root: component.root,
		slots: { default: createFragment() },
		data: navitem_initial_data
	});

	return {
		c: function create() {
			text = createText("\n        ");
			text_1 = createText("\n          ");
			small = createElement("small");
			if_block.c();
			text_3 = createText("\n        ");
			navlink._fragment.c();
			text_4 = createText("\n      ");
			navitem._fragment.c();
		},

		m: function mount(target, anchor) {
			appendNode(text, navitem._slotted.default);
			appendNode(text_1, navlink._slotted.default);
			appendNode(small, navlink._slotted.default);
			if_block.m(small, null);
			appendNode(text_3, navlink._slotted.default);
			navlink._mount(navitem._slotted.default, null);
			appendNode(text_4, navitem._slotted.default);
			navitem._mount(target, anchor);
		},

		p: function update(changed, state) {
			theme = state.theme;
			each_value = state.each_value;
			theme_index = state.theme_index;
			if (current_block_type === (current_block_type = select_block_type(state)) && if_block) {
				if_block.p(changed, state);
			} else {
				if_block.u();
				if_block.d();
				if_block = current_block_type(component, state);
				if_block.c();
				if_block.m(small, null);
			}

			var navitem_changes = {};
			if (changed.current || changed.themes) navitem_changes.active = state.current == theme.name;
			navitem._set(navitem_changes);
		},

		u: function unmount() {
			if_block.u();
			navitem._unmount();
		},

		d: function destroy$$1() {
			if_block.d();
			navlink.destroy(false);
			navitem.destroy(false);
		}
	};
}

// (10:12) {{#if current == theme.name}}
function create_if_block(component, state) {
	var theme = state.theme, each_value = state.each_value, theme_index = state.theme_index;
	var b, text_value = theme.name, text;

	return {
		c: function create() {
			b = createElement("b");
			text = createText(text_value);
		},

		m: function mount(target, anchor) {
			insertNode(b, target, anchor);
			appendNode(text, b);
		},

		p: function update(changed, state) {
			theme = state.theme;
			each_value = state.each_value;
			theme_index = state.theme_index;
			if ((changed.themes) && text_value !== (text_value = theme.name)) {
				text.data = text_value;
			}
		},

		u: function unmount() {
			detachNode(b);
		},

		d: noop
	};
}

// (12:12) {{else}}
function create_if_block_1(component, state) {
	var theme = state.theme, each_value = state.each_value, theme_index = state.theme_index;
	var text_value = theme.name, text;

	return {
		c: function create() {
			text = createText(text_value);
		},

		m: function mount(target, anchor) {
			insertNode(text, target, anchor);
		},

		p: function update(changed, state) {
			theme = state.theme;
			each_value = state.each_value;
			theme_index = state.theme_index;
			if ((changed.themes) && text_value !== (text_value = theme.name)) {
				text.data = text_value;
			}
		},

		u: function unmount() {
			detachNode(text);
		},

		d: noop
	};
}

// (714:10) {{#each [null, 'lg', 'sm'] as size}}
function create_each_block_1(component, state) {
	var size = state.size, each_value_1 = state.each_value_1, size_index = state.size_index;
	var div, text, text_1, a, text_2, text_3, text_4, text_5, a_1, text_6, text_7, text_8, text_9, a_2, text_10, text_11, text_12, text_13, a_3, text_14, text_15, text_16, text_17, a_4, text_18, text_19, text_20, text_21, a_5, text_22, text_23, text_24, text_25, a_6, text_26, text_27, text_28;

	var paginationitem_initial_data = { disabled: true };
	var paginationitem = new PaginationItem({
		root: component.root,
		slots: { default: createFragment() },
		data: paginationitem_initial_data
	});

	var paginationitem_1_initial_data = { active: true };
	var paginationitem_1 = new PaginationItem({
		root: component.root,
		slots: { default: createFragment() },
		data: paginationitem_1_initial_data
	});

	var paginationitem_2 = new PaginationItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var paginationitem_3 = new PaginationItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var paginationitem_4 = new PaginationItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var paginationitem_5 = new PaginationItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var paginationitem_6 = new PaginationItem({
		root: component.root,
		slots: { default: createFragment() }
	});

	var pagination_initial_data = { size: size };
	var pagination = new Pagination({
		root: component.root,
		slots: { default: createFragment() },
		data: pagination_initial_data
	});

	return {
		c: function create() {
			div = createElement("div");
			text = createText("\n                ");
			text_1 = createText("\n                  ");
			a = createElement("a");
			text_2 = createText("«");
			text_3 = createText("\n                ");
			paginationitem._fragment.c();
			text_4 = createText("\n                ");
			text_5 = createText("\n                  ");
			a_1 = createElement("a");
			text_6 = createText("1");
			text_7 = createText("\n                ");
			paginationitem_1._fragment.c();
			text_8 = createText("\n                ");
			text_9 = createText("\n                  ");
			a_2 = createElement("a");
			text_10 = createText("2");
			text_11 = createText("\n                ");
			paginationitem_2._fragment.c();
			text_12 = createText("\n                ");
			text_13 = createText("\n                  ");
			a_3 = createElement("a");
			text_14 = createText("3");
			text_15 = createText("\n                ");
			paginationitem_3._fragment.c();
			text_16 = createText("\n                ");
			text_17 = createText("\n                  ");
			a_4 = createElement("a");
			text_18 = createText("4");
			text_19 = createText("\n                ");
			paginationitem_4._fragment.c();
			text_20 = createText("\n                ");
			text_21 = createText("\n                  ");
			a_5 = createElement("a");
			text_22 = createText("5");
			text_23 = createText("\n                ");
			paginationitem_5._fragment.c();
			text_24 = createText("\n                ");
			text_25 = createText("\n                  ");
			a_6 = createElement("a");
			text_26 = createText("»");
			text_27 = createText("\n                ");
			paginationitem_6._fragment.c();
			text_28 = createText("\n              ");
			pagination._fragment.c();
			this.h();
		},

		h: function hydrate() {
			a.className = "page-link";
			a_1.className = "page-link";
			a_2.className = "page-link";
			a_3.className = "page-link";
			a_4.className = "page-link";
			a_5.className = "page-link";
			a_6.className = "page-link";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(text, pagination._slotted.default);
			appendNode(text_1, paginationitem._slotted.default);
			appendNode(a, paginationitem._slotted.default);
			appendNode(text_2, a);
			appendNode(text_3, paginationitem._slotted.default);
			paginationitem._mount(pagination._slotted.default, null);
			appendNode(text_4, pagination._slotted.default);
			appendNode(text_5, paginationitem_1._slotted.default);
			appendNode(a_1, paginationitem_1._slotted.default);
			appendNode(text_6, a_1);
			appendNode(text_7, paginationitem_1._slotted.default);
			paginationitem_1._mount(pagination._slotted.default, null);
			appendNode(text_8, pagination._slotted.default);
			appendNode(text_9, paginationitem_2._slotted.default);
			appendNode(a_2, paginationitem_2._slotted.default);
			appendNode(text_10, a_2);
			appendNode(text_11, paginationitem_2._slotted.default);
			paginationitem_2._mount(pagination._slotted.default, null);
			appendNode(text_12, pagination._slotted.default);
			appendNode(text_13, paginationitem_3._slotted.default);
			appendNode(a_3, paginationitem_3._slotted.default);
			appendNode(text_14, a_3);
			appendNode(text_15, paginationitem_3._slotted.default);
			paginationitem_3._mount(pagination._slotted.default, null);
			appendNode(text_16, pagination._slotted.default);
			appendNode(text_17, paginationitem_4._slotted.default);
			appendNode(a_4, paginationitem_4._slotted.default);
			appendNode(text_18, a_4);
			appendNode(text_19, paginationitem_4._slotted.default);
			paginationitem_4._mount(pagination._slotted.default, null);
			appendNode(text_20, pagination._slotted.default);
			appendNode(text_21, paginationitem_5._slotted.default);
			appendNode(a_5, paginationitem_5._slotted.default);
			appendNode(text_22, a_5);
			appendNode(text_23, paginationitem_5._slotted.default);
			paginationitem_5._mount(pagination._slotted.default, null);
			appendNode(text_24, pagination._slotted.default);
			appendNode(text_25, paginationitem_6._slotted.default);
			appendNode(a_6, paginationitem_6._slotted.default);
			appendNode(text_26, a_6);
			appendNode(text_27, paginationitem_6._slotted.default);
			paginationitem_6._mount(pagination._slotted.default, null);
			appendNode(text_28, pagination._slotted.default);
			pagination._mount(div, null);
		},

		p: function update(changed, state) {
			size = state.size;
			each_value_1 = state.each_value_1;
			size_index = state.size_index;
			var pagination_changes = {};
			pagination_changes.size = size;
			pagination._set(pagination_changes);
		},

		u: function unmount() {
			detachNode(div);
		},

		d: function destroy$$1() {
			paginationitem.destroy(false);
			paginationitem_1.destroy(false);
			paginationitem_2.destroy(false);
			paginationitem_3.destroy(false);
			paginationitem_4.destroy(false);
			paginationitem_5.destroy(false);
			paginationitem_6.destroy(false);
			pagination.destroy(false);
		}
	};
}

// (763:6) {{#each ['success', 'info', 'warning', 'danger'] as color}}
function create_each_block_2(component, state) {
	var color = state.color, each_value_2 = state.each_value_2, color_index = state.color_index;
	var text, text_1, h4, text_2_value = color, text_2, text_3, a, text_4, text_5, text_6;

	var alert_initial_data = {
	 	dismissible: true,
	 	color: color
	 };
	var alert = new Alert({
		root: component.root,
		slots: { default: createFragment() },
		data: alert_initial_data
	});

	var col = new Col({
		root: component.root,
		slots: { default: createFragment() }
	});

	return {
		c: function create() {
			text = createText("\n          ");
			text_1 = createText("\n            ");
			h4 = createElement("h4");
			text_2 = createText(text_2_value);
			text_3 = createText("\n            ");
			a = createElement("a");
			text_4 = createText("Change a few things up");
			text_5 = createText(" and try submitting again.\n          ");
			alert._fragment.c();
			text_6 = createText("\n        ");
			col._fragment.c();
			this.h();
		},

		h: function hydrate() {
			a.className = "alert-link";
		},

		m: function mount(target, anchor) {
			appendNode(text, col._slotted.default);
			appendNode(text_1, alert._slotted.default);
			appendNode(h4, alert._slotted.default);
			appendNode(text_2, h4);
			appendNode(text_3, alert._slotted.default);
			appendNode(a, alert._slotted.default);
			appendNode(text_4, a);
			appendNode(text_5, alert._slotted.default);
			alert._mount(col._slotted.default, null);
			appendNode(text_6, col._slotted.default);
			col._mount(target, anchor);
		},

		p: function update(changed, state) {
			color = state.color;
			each_value_2 = state.each_value_2;
			color_index = state.color_index;
			var alert_changes = {};
			alert_changes.color = color;
			alert._set(alert_changes);
		},

		u: function unmount() {
			col._unmount();
		},

		d: function destroy$$1() {
			alert.destroy(false);
			col.destroy(false);
		}
	};
}

// (919:8) {{#each ['primary', 'secondary', 'success', 'info', 'warning', 'danger'] as color}}
function create_each_block_3(component, state) {
	var color = state.color, each_value_3 = state.each_value_3, color_index_1 = state.color_index_1;
	var text, text_1, text_2_value = color, text_2, text_3, blockquote, p, text_5, footer, text_9, text_10;

	var cardtitle = new CardTitle({
		root: component.root,
		slots: { default: createFragment() }
	});

	var cardbody = new CardBody({
		root: component.root,
		slots: { default: createFragment() }
	});

	var card_initial_data = {
	 	color: color,
	 	class: "mb-3 text-xs-center"
	 };
	var card = new Card({
		root: component.root,
		slots: { default: createFragment() },
		data: card_initial_data
	});

	return {
		c: function create() {
			text = createText("\n            ");
			text_1 = createText("\n              ");
			text_2 = createText(text_2_value);
			cardtitle._fragment.c();
			text_3 = createText("\n              ");
			blockquote = createElement("blockquote");
			p = createElement("p");
			p.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.";
			text_5 = createText("\n                ");
			footer = createElement("footer");
			footer.innerHTML = "Someone famous in <cite title=\"Source Title\">Source Title</cite>";
			text_9 = createText("\n            ");
			cardbody._fragment.c();
			text_10 = createText("\n          ");
			card._fragment.c();
			this.h();
		},

		h: function hydrate() {
			blockquote.className = "card-blockquote";
		},

		m: function mount(target, anchor) {
			appendNode(text, card._slotted.default);
			appendNode(text_1, cardbody._slotted.default);
			appendNode(text_2, cardtitle._slotted.default);
			cardtitle._mount(cardbody._slotted.default, null);
			appendNode(text_3, cardbody._slotted.default);
			appendNode(blockquote, cardbody._slotted.default);
			appendNode(p, blockquote);
			appendNode(text_5, blockquote);
			appendNode(footer, blockquote);
			appendNode(text_9, cardbody._slotted.default);
			cardbody._mount(card._slotted.default, null);
			appendNode(text_10, card._slotted.default);
			card._mount(target, anchor);
		},

		p: function update(changed, state) {
			color = state.color;
			each_value_3 = state.each_value_3;
			color_index_1 = state.color_index_1;
			var card_changes = {};
			card_changes.color = color;
			card._set(card_changes);
		},

		u: function unmount() {
			card._unmount();
		},

		d: function destroy$$1() {
			cardtitle.destroy(false);
			cardbody.destroy(false);
			card.destroy(false);
		}
	};
}

// (933:8) {{#each ['primary', 'secondary', 'success', 'info', 'warning', 'danger'] as color}}
function create_each_block_4(component, state) {
	var color = state.color, each_value_4 = state.each_value_4, color_index_2 = state.color_index_2;
	var text, text_1, text_2_value = color, text_2, text_3, blockquote, p, text_5, footer, text_9, text_10;

	var cardtitle = new CardTitle({
		root: component.root,
		slots: { default: createFragment() }
	});

	var cardbody = new CardBody({
		root: component.root,
		slots: { default: createFragment() }
	});

	var card_initial_data = {
	 	outline: true,
	 	color: color,
	 	class: "mb-3 text-xs-center"
	 };
	var card = new Card({
		root: component.root,
		slots: { default: createFragment() },
		data: card_initial_data
	});

	return {
		c: function create() {
			text = createText("\n            ");
			text_1 = createText("\n              ");
			text_2 = createText(text_2_value);
			cardtitle._fragment.c();
			text_3 = createText("\n              ");
			blockquote = createElement("blockquote");
			p = createElement("p");
			p.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.";
			text_5 = createText("\n                ");
			footer = createElement("footer");
			footer.innerHTML = "Someone famous in <cite title=\"Source Title\">Source Title</cite>";
			text_9 = createText("\n            ");
			cardbody._fragment.c();
			text_10 = createText("\n          ");
			card._fragment.c();
			this.h();
		},

		h: function hydrate() {
			blockquote.className = "card-blockquote";
		},

		m: function mount(target, anchor) {
			appendNode(text, card._slotted.default);
			appendNode(text_1, cardbody._slotted.default);
			appendNode(text_2, cardtitle._slotted.default);
			cardtitle._mount(cardbody._slotted.default, null);
			appendNode(text_3, cardbody._slotted.default);
			appendNode(blockquote, cardbody._slotted.default);
			appendNode(p, blockquote);
			appendNode(text_5, blockquote);
			appendNode(footer, blockquote);
			appendNode(text_9, cardbody._slotted.default);
			cardbody._mount(card._slotted.default, null);
			appendNode(text_10, card._slotted.default);
			card._mount(target, anchor);
		},

		p: function update(changed, state) {
			color = state.color;
			each_value_4 = state.each_value_4;
			color_index_2 = state.color_index_2;
			var card_changes = {};
			card_changes.color = color;
			card._set(card_changes);
		},

		u: function unmount() {
			card._unmount();
		},

		d: function destroy$$1() {
			cardtitle.destroy(false);
			cardbody.destroy(false);
			card.destroy(false);
		}
	};
}

function Docs(options) {
	init(this, options);
	this._state = assign(data(), options.data);

	if (!options.root) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign(assign(Docs.prototype, methods), proto);

return Docs;

}());
