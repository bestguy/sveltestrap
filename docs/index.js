var Docs = (function () {
'use strict';

function noop() {}

function assign(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
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

// TODO this is out of date
function destroyEach(iterations, detach, start) {
	for (var i = start; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].destroy(detach);
	}
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

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, newState, oldState) {
	for (var key in group) {
		if (!(key in newState)) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		if (differs(newValue, oldValue)) {
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
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
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
	callAll(this._root._oncreate);
}

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

var proto = {
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set
};

function create_main_fragment$2 ( state, component ) {
	var button, span, text;

	function click_handler ( event ) {
		component.fire('click');
	}

	return {
		create: function () {
			button = createElement( 'button' );
			span = createElement( 'span' );
			text = createText( "×" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			button.type = "button";
			button.className = "close";
			setAttribute( button, 'aria-label', "Close" );
			addListener( button, 'click', click_handler );
			setAttribute( span, 'aria-hidden', "true" );
		},

		mount: function ( target, anchor ) {
			insertNode( button, target, anchor );
			appendNode( span, button );
			appendNode( text, span );
		},

		unmount: function () {
			detachNode( button );
		},

		destroy: function () {
			removeListener( button, 'click', click_handler );
		}
	};
}

function Close ( options ) {
	options = options || {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$2( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Close.prototype, proto );

Close.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Close.prototype.teardown = Close.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$1 = (function () {
  // TODO handle fade transition when dismissing

  return {
    data() {
      return {
        class: '',
        color: 'success',
        isOpen: true,
        dismissible: false
      };
    }
  }
}());

function create_main_fragment$1 ( state, component ) {
	var if_block_anchor;

	var if_block = (state.isOpen) && create_if_block$1( state, component );

	return {
		create: function () {
			if ( if_block ) if_block.create();
			if_block_anchor = createComment();
		},

		mount: function ( target, anchor ) {
			if ( if_block ) if_block.mount( target, anchor );
			insertNode( if_block_anchor, target, anchor );
		},

		update: function ( changed, state ) {
			if ( state.isOpen ) {
				if ( if_block ) {
					if_block.update( changed, state );
				} else {
					if_block = create_if_block$1( state, component );
					if_block.create();
					if_block.mount( if_block_anchor.parentNode, if_block_anchor );
				}
			} else if ( if_block ) {
				if_block.unmount();
				if_block.destroy();
				if_block = null;
			}
		},

		unmount: function () {
			if ( if_block ) if_block.unmount();
			detachNode( if_block_anchor );
		},

		destroy: function () {
			if ( if_block ) if_block.destroy();
		}
	};
}

function create_if_block_1$1 ( state, component ) {

	var close = new Close({
		_root: component._root
	});

	close.on( 'click', function ( event ) {
		component.set({ isOpen: false });
	});

	return {
		create: function () {
			close._fragment.create();
		},

		mount: function ( target, anchor ) {
			close._fragment.mount( target, anchor );
		},

		unmount: function () {
			close._fragment.unmount();
		},

		destroy: function () {
			close.destroy( false );
		}
	};
}

function create_if_block$1 ( state, component ) {
	var div, div_class_value, text;

	var if_block_1 = (state.dismissible) && create_if_block_1$1( state, component );

	return {
		create: function () {
			div = createElement( 'div' );
			if ( if_block_1 ) if_block_1.create();
			text = createText( "\n    " );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "alert alert-" + ( state.color ) + ( state.dismissible ? ' alert-dismissible' : '' ) + " " + ( state.class );
			setAttribute( div, 'role', "alert" );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( if_block_1 ) if_block_1.mount( div, null );
			appendNode( text, div );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "alert alert-" + ( state.color ) + ( state.dismissible ? ' alert-dismissible' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}

			if ( state.dismissible ) {
				if ( !if_block_1 ) {
					if_block_1 = create_if_block_1$1( state, component );
					if_block_1.create();
					if_block_1.mount( div, text );
				}
			} else if ( if_block_1 ) {
				if_block_1.unmount();
				if_block_1.destroy();
				if_block_1 = null;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( if_block_1 ) if_block_1.unmount();
			if ( component._yield ) component._yield.unmount();
		},

		destroy: function () {
			if ( if_block_1 ) if_block_1.destroy();
		}
	};
}

function Alert ( options ) {
	options = options || {};
	this._state = assign( template$1.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	this._oncreate = [];

	this._fragment = create_main_fragment$1( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

	callAll(this._oncreate);
}

assign( Alert.prototype, proto );

Alert.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
	callAll(this._oncreate);
};

Alert.prototype.teardown = Alert.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$2 = (function () {
  return {
    data() {
      return {
        class: '',
        color: 'default',
        pill: false
      };
    }
  };
}());

function create_main_fragment$3 ( state, component ) {
	var span, span_class_value;

	return {
		create: function () {
			span = createElement( 'span' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			span.className = span_class_value = "badge badge-" + ( state.color ) + ( state.pill ? ' badge-pill' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( span, target, anchor );
			if ( component._yield ) component._yield.mount( span, null );
		},

		update: function ( changed, state ) {
			if ( span_class_value !== ( span_class_value = "badge badge-" + ( state.color ) + ( state.pill ? ' badge-pill' : '' ) + " " + ( state.class ) ) ) {
				span.className = span_class_value;
			}
		},

		unmount: function () {
			detachNode( span );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Badge ( options ) {
	options = options || {};
	this._state = assign( template$2.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$3( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Badge.prototype, proto );

Badge.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Badge.prototype.teardown = Badge.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$3 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$4 ( state, component ) {
	var ol, ol_class_value;

	return {
		create: function () {
			ol = createElement( 'ol' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			ol.className = ol_class_value = "breadcrumb " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( ol, target, anchor );
			if ( component._yield ) component._yield.mount( ol, null );
		},

		update: function ( changed, state ) {
			if ( ol_class_value !== ( ol_class_value = "breadcrumb " + ( state.class ) ) ) {
				ol.className = ol_class_value;
			}
		},

		unmount: function () {
			detachNode( ol );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Breadcrumb ( options ) {
	options = options || {};
	this._state = assign( template$3.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$4( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Breadcrumb.prototype, proto );

Breadcrumb.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Breadcrumb.prototype.teardown = Breadcrumb.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$4 = (function () {
  return {
    data() {
      return {
        active: false,
        class: ''
      }
    }
  }
}());

function create_main_fragment$5 ( state, component ) {
	var li, li_class_value;

	return {
		create: function () {
			li = createElement( 'li' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			li.className = li_class_value = "breadcrumb-item" + ( state.active ? ' active' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			if ( component._yield ) component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "breadcrumb-item" + ( state.active ? ' active' : '' ) + " " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		unmount: function () {
			detachNode( li );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function BreadcrumbItem ( options ) {
	options = options || {};
	this._state = assign( template$4.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$5( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( BreadcrumbItem.prototype, proto );

BreadcrumbItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

BreadcrumbItem.prototype.teardown = BreadcrumbItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$5 = (function () {
  return {
    methods: {
      onClick(e) {
        const { disabled } = this.get();
        if (disabled) {
          e.preventDefault();
          return;
        } else {
          this.fire('click', e);
        }
      }
    },
    data() {
      return {
        active: false,
        block: false,
        class: '',
        color: 'secondary',
        outline: false,
        size: null
      }
    }
  }
}());

function create_main_fragment$6 ( state, component ) {
	var Button_1, Button_1_class_value;

	function click_handler ( event ) {
		component.onClick(event);
	}

	return {
		create: function () {
			Button_1 = createElement( 'Button' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			Button_1.className = Button_1_class_value = "btn btn" + ( state.outline ? '-outline' : '' ) + "-" + ( state.color ) + ( state.size ? ` btn-${state.size}` : '' ) + ( state.block ? ' btn-block' : '' ) + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class );
			addListener( Button_1, 'click', click_handler );
		},

		mount: function ( target, anchor ) {
			insertNode( Button_1, target, anchor );
			if ( component._yield ) component._yield.mount( Button_1, null );
		},

		update: function ( changed, state ) {
			if ( Button_1_class_value !== ( Button_1_class_value = "btn btn" + ( state.outline ? '-outline' : '' ) + "-" + ( state.color ) + ( state.size ? ` btn-${state.size}` : '' ) + ( state.block ? ' btn-block' : '' ) + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class ) ) ) {
				Button_1.className = Button_1_class_value;
			}
		},

		unmount: function () {
			detachNode( Button_1 );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: function () {
			removeListener( Button_1, 'click', click_handler );
		}
	};
}

function Button ( options ) {
	options = options || {};
	this._state = assign( template$5.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$6( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Button.prototype, template$5.methods, proto );

Button.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Button.prototype.teardown = Button.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$6 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$7 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "" + ( state.size ? `btn-group-${state.size} ` : '' ) + ( state.vertical ? 'btn-group-vertical' : 'btn-group' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "" + ( state.size ? `btn-group-${state.size} ` : '' ) + ( state.vertical ? 'btn-group-vertical' : 'btn-group' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function ButtonGroup ( options ) {
	options = options || {};
	this._state = assign( template$6.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$7( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( ButtonGroup.prototype, proto );

ButtonGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ButtonGroup.prototype.teardown = ButtonGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$7 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$8 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "btn-toolbar " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "btn-toolbar " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function ButtonToolbar ( options ) {
	options = options || {};
	this._state = assign( template$7.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$8( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( ButtonToolbar.prototype, proto );

ButtonToolbar.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ButtonToolbar.prototype.teardown = ButtonToolbar.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$8 = (function () {
  return {
    data() {
      return {
        block: false,
        class: '',
        inverse: false,
        outline: false
      }
    }
  }
}());

function create_main_fragment$9 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "card" + ( state.inverse ? ' card-inverse' : '' ) + ( state.block ? ' card-block' : '' ) + ( state.color ? ` card${state.outline ? '-outline' : ''}-${state.color}` : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card" + ( state.inverse ? ' card-inverse' : '' ) + ( state.block ? ' card-block' : '' ) + ( state.color ? ` card${state.outline ? '-outline' : ''}-${state.color}` : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Card ( options ) {
	options = options || {};
	this._state = assign( template$8.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$9( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Card.prototype, proto );

Card.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Card.prototype.teardown = Card.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$9 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$10 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "card-block " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-block " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardBlock ( options ) {
	options = options || {};
	this._state = assign( template$9.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$10( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardBlock.prototype, proto );

CardBlock.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardBlock.prototype.teardown = CardBlock.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$10 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$11 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "card-columns " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-columns " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardColumns ( options ) {
	options = options || {};
	this._state = assign( template$10.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$11( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardColumns.prototype, proto );

CardColumns.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardColumns.prototype.teardown = CardColumns.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$11 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$12 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "card-deck " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-deck " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardDeck ( options ) {
	options = options || {};
	this._state = assign( template$11.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$12( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardDeck.prototype, proto );

CardDeck.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardDeck.prototype.teardown = CardDeck.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$12 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$13 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "card-footer " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-footer " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardFooter ( options ) {
	options = options || {};
	this._state = assign( template$12.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$13( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardFooter.prototype, proto );

CardFooter.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardFooter.prototype.teardown = CardFooter.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$13 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$14 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "card-group " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-group " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardGroup ( options ) {
	options = options || {};
	this._state = assign( template$13.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$14( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardGroup.prototype, proto );

CardGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardGroup.prototype.teardown = CardGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$14 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$15 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "card-header " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-header " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardHeader ( options ) {
	options = options || {};
	this._state = assign( template$14.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$15( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardHeader.prototype, proto );

CardHeader.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardHeader.prototype.teardown = CardHeader.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$15 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$16 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "card-img-overlay " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-img-overlay " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardImgOverlay ( options ) {
	options = options || {};
	this._state = assign( template$15.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$16( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardImgOverlay.prototype, proto );

CardImgOverlay.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardImgOverlay.prototype.teardown = CardImgOverlay.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$16 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$17 ( state, component ) {
	var h6, h6_class_value;

	return {
		create: function () {
			h6 = createElement( 'h6' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h6.className = h6_class_value = "card-subtitle " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( h6, target, anchor );
			if ( component._yield ) component._yield.mount( h6, null );
		},

		update: function ( changed, state ) {
			if ( h6_class_value !== ( h6_class_value = "card-subtitle " + ( state.class ) ) ) {
				h6.className = h6_class_value;
			}
		},

		unmount: function () {
			detachNode( h6 );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardSubtitle ( options ) {
	options = options || {};
	this._state = assign( template$16.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$17( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardSubtitle.prototype, proto );

CardSubtitle.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardSubtitle.prototype.teardown = CardSubtitle.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$17 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$18 ( state, component ) {
	var p, p_class_value;

	return {
		create: function () {
			p = createElement( 'p' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			p.className = p_class_value = "card-text " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			if ( component._yield ) component._yield.mount( p, null );
		},

		update: function ( changed, state ) {
			if ( p_class_value !== ( p_class_value = "card-text " + ( state.class ) ) ) {
				p.className = p_class_value;
			}
		},

		unmount: function () {
			detachNode( p );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardText ( options ) {
	options = options || {};
	this._state = assign( template$17.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$18( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardText.prototype, proto );

CardText.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardText.prototype.teardown = CardText.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$18 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$19 ( state, component ) {
	var h4, h4_class_value;

	return {
		create: function () {
			h4 = createElement( 'h4' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h4.className = h4_class_value = "card-title " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			if ( component._yield ) component._yield.mount( h4, null );
		},

		update: function ( changed, state ) {
			if ( h4_class_value !== ( h4_class_value = "card-title " + ( state.class ) ) ) {
				h4.className = h4_class_value;
			}
		},

		unmount: function () {
			detachNode( h4 );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function CardTitle ( options ) {
	options = options || {};
	this._state = assign( template$18.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$19( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( CardTitle.prototype, proto );

CardTitle.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardTitle.prototype.teardown = CardTitle.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'widths' in newState && differs( state.widths, oldState.widths ) ) || ( 'xs' in newState && differs( state.xs, oldState.xs ) ) || ( 'sm' in newState && differs( state.sm, oldState.sm ) ) || ( 'md' in newState && differs( state.md, oldState.md ) ) || ( 'lg' in newState && differs( state.lg, oldState.lg ) ) || ( 'xl' in newState && differs( state.xl, oldState.xl ) ) ) {
		state.classes = newState.classes = template$19.computed.classes( state.widths, state.xs, state.sm, state.md, state.lg, state.xl );
	}
}

var template$19 = (function () {
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

  return {
    data() {
      return {
        class: '',
        widths
      }
    },
    computed: {
      classes(widths, xs, sm, md, lg, xl) {
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
    }
  }
}());

function create_main_fragment$20 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "" + ( state.classes ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "" + ( state.classes ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Col ( options ) {
	options = options || {};
	this._state = assign( template$19.data(), options.data );
	recompute( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$20( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Col.prototype, proto );

Col.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Col.prototype.teardown = Col.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$20 = (function () {
  return {
    data() {
      return {
        class: '',
        fluid: false
      }
    }
  };
}());

function create_main_fragment$21 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "container" + ( state.fluid ? '-fluid' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "container" + ( state.fluid ? '-fluid' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Container ( options ) {
	options = options || {};
	this._state = assign( template$20.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$21( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Container.prototype, proto );

Container.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Container.prototype.teardown = Container.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$21 = (function () {
  // TODO manage open logic internally to this component, if possible
  // TODO support closing from click outside
  return {
    data() {
      return {
        class: '',
        dropup: false,
        open: false
      }
    }
  }
}());

function create_main_fragment$22 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "dropdown" + ( state.dropup ? ' dropup' : '' ) + ( state.open ? ' show' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "dropdown" + ( state.dropup ? ' dropup' : '' ) + ( state.open ? ' show' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Dropdown ( options ) {
	options = options || {};
	this._state = assign( template$21.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$22( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Dropdown.prototype, proto );

Dropdown.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Dropdown.prototype.teardown = Dropdown.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$22 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }

}());

function create_main_fragment$23 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "dropdown-divider " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "dropdown-divider " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: noop
	};
}

function DropdownDivider ( options ) {
	options = options || {};
	this._state = assign( template$22.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$23( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( DropdownDivider.prototype, proto );

DropdownDivider.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownDivider.prototype.teardown = DropdownDivider.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$23 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }

}());

function create_main_fragment$24 ( state, component ) {
	var h6, h6_class_value;

	return {
		create: function () {
			h6 = createElement( 'h6' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h6.className = h6_class_value = "dropdown-header " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( h6, target, anchor );
			if ( component._yield ) component._yield.mount( h6, null );
		},

		update: function ( changed, state ) {
			if ( h6_class_value !== ( h6_class_value = "dropdown-header " + ( state.class ) ) ) {
				h6.className = h6_class_value;
			}
		},

		unmount: function () {
			detachNode( h6 );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function DropdownHeader ( options ) {
	options = options || {};
	this._state = assign( template$23.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$24( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( DropdownHeader.prototype, proto );

DropdownHeader.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownHeader.prototype.teardown = DropdownHeader.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$24 = (function () {
  return {
    data() {
      return {
        class: '',
        disabled: false
      }
    }
  }

}());

function create_main_fragment$25 ( state, component ) {
	var button, button_class_value;

	return {
		create: function () {
			button = createElement( 'button' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			button.className = button_class_value = "dropdown-item" + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( button, target, anchor );
			if ( component._yield ) component._yield.mount( button, null );
		},

		update: function ( changed, state ) {
			if ( button_class_value !== ( button_class_value = "dropdown-item" + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class ) ) ) {
				button.className = button_class_value;
			}
		},

		unmount: function () {
			detachNode( button );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function DropdownItem ( options ) {
	options = options || {};
	this._state = assign( template$24.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$25( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( DropdownItem.prototype, proto );

DropdownItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownItem.prototype.teardown = DropdownItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$25 = (function () {
  return {
    data() {
      return {
        class: '',
        right: false
      }
    }
  }
}());

function create_main_fragment$26 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "dropdown-menu" + ( state.right ? ' dropdown-menu-right' : '' ) + " " + ( state.class );
			setAttribute( div, 'tabIndex', "-1" );
			setAttribute( div, 'role', "menu" );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "dropdown-menu" + ( state.right ? ' dropdown-menu-right' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function DropdownMenu ( options ) {
	options = options || {};
	this._state = assign( template$25.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$26( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( DropdownMenu.prototype, proto );

DropdownMenu.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownMenu.prototype.teardown = DropdownMenu.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$26 = (function () {
  return {
    data() {
      return {
        class: '',
        inline: false
      }
    }
  }
}());

function create_main_fragment$27 ( state, component ) {
	var form, form_class_value;

	return {
		create: function () {
			form = createElement( 'form' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			form.className = form_class_value = "" + ( state.inline ? 'form-inline' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( form, target, anchor );
			if ( component._yield ) component._yield.mount( form, null );
		},

		update: function ( changed, state ) {
			if ( form_class_value !== ( form_class_value = "" + ( state.inline ? 'form-inline' : '' ) + " " + ( state.class ) ) ) {
				form.className = form_class_value;
			}
		},

		unmount: function () {
			detachNode( form );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Form ( options ) {
	options = options || {};
	this._state = assign( template$26.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$27( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Form.prototype, proto );

Form.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Form.prototype.teardown = Form.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$27 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$28 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "form-control-feedback " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "form-control-feedback " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function FormFeedback ( options ) {
	options = options || {};
	this._state = assign( template$27.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$28( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( FormFeedback.prototype, proto );

FormFeedback.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

FormFeedback.prototype.teardown = FormFeedback.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$28 = (function () {
  return {
    data() {
      return {
        check: false,
        class: '',
        color: null,
        disabled: false,
        row: false
      }
    }
  }
}());

function create_main_fragment$29 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "" + ( state.color ? `has-${state.color}` : '' ) + ( state.row ? ' row' : '' ) + ( state.check ? ' form-check' : ' form-group' ) + ( state.check && state.disabled ? ' disabled' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "" + ( state.color ? `has-${state.color}` : '' ) + ( state.row ? ' row' : '' ) + ( state.check ? ' form-check' : ' form-group' ) + ( state.check && state.disabled ? ' disabled' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function FormGroup ( options ) {
	options = options || {};
	this._state = assign( template$28.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$29( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( FormGroup.prototype, proto );

FormGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

FormGroup.prototype.teardown = FormGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$29 = (function () {
  return {
    data() {
      return {
        class: '',
        color: null,
        inline: false
      }
    }
  }
}());

function create_main_fragment$30 ( state, component ) {
	var small, small_class_value;

	return {
		create: function () {
			small = createElement( 'small' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			small.className = small_class_value = "" + ( !state.inline ? 'form-text' : '' ) + ( state.color ? ` text-${state.color}` : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( small, target, anchor );
			if ( component._yield ) component._yield.mount( small, null );
		},

		update: function ( changed, state ) {
			if ( small_class_value !== ( small_class_value = "" + ( !state.inline ? 'form-text' : '' ) + ( state.color ? ` text-${state.color}` : '' ) + " " + ( state.class ) ) ) {
				small.className = small_class_value;
			}
		},

		unmount: function () {
			detachNode( small );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function FormText ( options ) {
	options = options || {};
	this._state = assign( template$29.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$30( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( FormText.prototype, proto );

FormText.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

FormText.prototype.teardown = FormText.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$30 = (function () {
  return {
    data() {
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
  }
}());

function create_main_fragment$31 ( state, component ) {
	var i, i_class_value;

	return {
		create: function () {
			i = createElement( 'i' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			i.className = i_class_value = "fa fa-" + ( state.name ) + ( state.size ? ' fa-' + state.size : '' ) + ( state.spin ? ' fa-spin' : '' ) + ( state.pulse ? ' fa-pulse' : '' ) + ( state.border ? ' fa-border' : '' ) + ( state.fixedWidth ? ' fa-fw' : '' ) + ( state.inverse ? ' fa-inverse' : '' ) + ( state.flip ? ' fa-flip-' + state.flip : '' ) + ( state.rotate ? ' fa-rotate-' + state.rotate : '' ) + ( state.stack ? ' fa-stack-' + state.stack : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( i, target, anchor );
		},

		update: function ( changed, state ) {
			if ( i_class_value !== ( i_class_value = "fa fa-" + ( state.name ) + ( state.size ? ' fa-' + state.size : '' ) + ( state.spin ? ' fa-spin' : '' ) + ( state.pulse ? ' fa-pulse' : '' ) + ( state.border ? ' fa-border' : '' ) + ( state.fixedWidth ? ' fa-fw' : '' ) + ( state.inverse ? ' fa-inverse' : '' ) + ( state.flip ? ' fa-flip-' + state.flip : '' ) + ( state.rotate ? ' fa-rotate-' + state.rotate : '' ) + ( state.stack ? ' fa-stack-' + state.stack : '' ) + " " + ( state.class ) ) ) {
				i.className = i_class_value;
			}
		},

		unmount: function () {
			detachNode( i );
		},

		destroy: noop
	};
}

function Icon ( options ) {
	options = options || {};
	this._state = assign( template$30.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$31( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Icon.prototype, proto );

Icon.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Icon.prototype.teardown = Icon.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$31 = (function () {
  return {
    data() {
      return {
        class: '',
        size: null
      }
    }
  }
}());

function create_main_fragment$32 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "input-group" + ( state.size ? ` input-group-${state.size}` : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "input-group" + ( state.size ? ` input-group-${state.size}` : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function InputGroup ( options ) {
	options = options || {};
	this._state = assign( template$31.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$32( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( InputGroup.prototype, proto );

InputGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

InputGroup.prototype.teardown = InputGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$32 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$33 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "input-group-addon " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "input-group-addon " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function InputGroupAddon ( options ) {
	options = options || {};
	this._state = assign( template$32.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$33( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( InputGroupAddon.prototype, proto );

InputGroupAddon.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

InputGroupAddon.prototype.teardown = InputGroupAddon.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$33 = (function () {
  return {
    data() {
      return {
        class: '',
        fluid: false
      }
    }
  }
}());

function create_main_fragment$34 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "jumbotron" + ( state.fluid ? ' jumbotron-fluid' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "jumbotron" + ( state.fluid ? ' jumbotron-fluid' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Jumbotron ( options ) {
	options = options || {};
	this._state = assign( template$33.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$34( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Jumbotron.prototype, proto );

Jumbotron.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Jumbotron.prototype.teardown = Jumbotron.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$34 = (function () {
  return {
    data() {
      return {
        class: '',
        flush: false
      }
    }
  }
}());

function create_main_fragment$35 ( state, component ) {
	var ul, ul_class_value;

	return {
		create: function () {
			ul = createElement( 'ul' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			ul.className = ul_class_value = "list-group" + ( state.flush ? ' list-group-flush' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( ul, target, anchor );
			if ( component._yield ) component._yield.mount( ul, null );
		},

		update: function ( changed, state ) {
			if ( ul_class_value !== ( ul_class_value = "list-group" + ( state.flush ? ' list-group-flush' : '' ) + " " + ( state.class ) ) ) {
				ul.className = ul_class_value;
			}
		},

		unmount: function () {
			detachNode( ul );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function ListGroup ( options ) {
	options = options || {};
	this._state = assign( template$34.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$35( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( ListGroup.prototype, proto );

ListGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroup.prototype.teardown = ListGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$35 = (function () {
  return {
    data() {
      return {
        active: false,
        class: '',
        disabled: false,
        action: false,
        color: false
      }
    }
  }
}());

function create_main_fragment$36 ( state, component ) {
	var li, li_class_value;

	return {
		create: function () {
			li = createElement( 'li' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			li.className = li_class_value = "list-group-item" + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + ( state.action ? ' list-group-item-action' : '' ) + ( state.color ? ` list-group-item-${state.color}` : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			if ( component._yield ) component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "list-group-item" + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + ( state.action ? ' list-group-item-action' : '' ) + ( state.color ? ` list-group-item-${state.color}` : '' ) + " " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		unmount: function () {
			detachNode( li );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function ListGroupItem ( options ) {
	options = options || {};
	this._state = assign( template$35.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$36( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( ListGroupItem.prototype, proto );

ListGroupItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroupItem.prototype.teardown = ListGroupItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$36 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$37 ( state, component ) {
	var h5, h5_class_value;

	return {
		create: function () {
			h5 = createElement( 'h5' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h5.className = h5_class_value = "list-group-item-heading " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( h5, target, anchor );
			if ( component._yield ) component._yield.mount( h5, null );
		},

		update: function ( changed, state ) {
			if ( h5_class_value !== ( h5_class_value = "list-group-item-heading " + ( state.class ) ) ) {
				h5.className = h5_class_value;
			}
		},

		unmount: function () {
			detachNode( h5 );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function ListGroupItemHeading ( options ) {
	options = options || {};
	this._state = assign( template$36.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$37( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( ListGroupItemHeading.prototype, proto );

ListGroupItemHeading.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroupItemHeading.prototype.teardown = ListGroupItemHeading.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$37 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$38 ( state, component ) {
	var p, p_class_value;

	return {
		create: function () {
			p = createElement( 'p' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			p.className = p_class_value = "list-group-item-text " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			if ( component._yield ) component._yield.mount( p, null );
		},

		update: function ( changed, state ) {
			if ( p_class_value !== ( p_class_value = "list-group-item-text " + ( state.class ) ) ) {
				p.className = p_class_value;
			}
		},

		unmount: function () {
			detachNode( p );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function ListGroupItemText ( options ) {
	options = options || {};
	this._state = assign( template$37.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$38( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( ListGroupItemText.prototype, proto );

ListGroupItemText.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroupItemText.prototype.teardown = ListGroupItemText.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$38 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  };
}());

function create_main_fragment$39 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "media " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "media " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Media ( options ) {
	options = options || {};
	this._state = assign( template$38.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$39( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Media.prototype, proto );

Media.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Media.prototype.teardown = Media.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$39 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  };
}());

function create_main_fragment$40 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "media-body " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "media-body " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function MediaBody ( options ) {
	options = options || {};
	this._state = assign( template$39.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$40( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( MediaBody.prototype, proto );

MediaBody.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

MediaBody.prototype.teardown = MediaBody.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$40 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$41 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "modal-footer " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "modal-footer " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function ModalFooter ( options ) {
	options = options || {};
	this._state = assign( template$40.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$41( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( ModalFooter.prototype, proto );

ModalFooter.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ModalFooter.prototype.teardown = ModalFooter.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$41 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$42 ( state, component ) {
	var li, li_class_value;

	return {
		create: function () {
			li = createElement( 'li' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			li.className = li_class_value = "nav-item " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			if ( component._yield ) component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "nav-item " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		unmount: function () {
			detachNode( li );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function NavDropdown ( options ) {
	options = options || {};
	this._state = assign( template$41.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$42( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( NavDropdown.prototype, proto );

NavDropdown.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavDropdown.prototype.teardown = NavDropdown.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$42 = (function () {
  return {
    data() {
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
  }
}());

function create_main_fragment$43 ( state, component ) {
	var ul, ul_class_value;

	return {
		create: function () {
			ul = createElement( 'ul' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			ul.className = ul_class_value = "" + ( state.navbar ? 'navbar-nav' : 'nav' ) + ( state.tabs ? ' nav-tabs' : '' ) + ( state.pills ? ' nav-pills' : '' ) + ( state.fill ? ' nav-fill' : state.justified ? ' nav-justified' : '' ) + ( state.vertical ? ' flex-column' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( ul, target, anchor );
			if ( component._yield ) component._yield.mount( ul, null );
		},

		update: function ( changed, state ) {
			if ( ul_class_value !== ( ul_class_value = "" + ( state.navbar ? 'navbar-nav' : 'nav' ) + ( state.tabs ? ' nav-tabs' : '' ) + ( state.pills ? ' nav-pills' : '' ) + ( state.fill ? ' nav-fill' : state.justified ? ' nav-justified' : '' ) + ( state.vertical ? ' flex-column' : '' ) + " " + ( state.class ) ) ) {
				ul.className = ul_class_value;
			}
		},

		unmount: function () {
			detachNode( ul );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Nav ( options ) {
	options = options || {};
	this._state = assign( template$42.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$43( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Nav.prototype, proto );

Nav.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Nav.prototype.teardown = Nav.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$43 = (function () {
  return {
    data() {
      return {
        active: false,
        class: ''
      }
    }
  }
}());

function create_main_fragment$44 ( state, component ) {
	var li, li_class_value;

	return {
		create: function () {
			li = createElement( 'li' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			li.className = li_class_value = "nav-item" + ( state.active ? ' active' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			if ( component._yield ) component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "nav-item" + ( state.active ? ' active' : '' ) + " " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		unmount: function () {
			detachNode( li );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function NavItem ( options ) {
	options = options || {};
	this._state = assign( template$43.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$44( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( NavItem.prototype, proto );

NavItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavItem.prototype.teardown = NavItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$44 = (function () {
  return {
    data() {
      return {
        active: false,
        disabled: false,
        href: '#',
        class: ''
      }
    },
    methods: {
      onClick(e) {
        const { disabled, href } = this.get();
        if (disabled) {
          e.preventDefault();
          return;
        }

        if (href === '#') {
          e.preventDefault();
        }

        this.fire('click', e);
      }
    }
  }
}());

function create_main_fragment$45 ( state, component ) {
	var a, a_href_value, a_class_value;

	function click_handler ( event ) {
		component.onClick(event);
	}

	return {
		create: function () {
			a = createElement( 'a' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = a_href_value = state.href;
			a.className = a_class_value = "nav-link" + ( state.disabled ? ' disabled' : '' ) + ( state.active ? ' active' : '' ) + " " + ( state.class );
			addListener( a, 'click', click_handler );
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			if ( component._yield ) component._yield.mount( a, null );
		},

		update: function ( changed, state ) {
			if ( a_href_value !== ( a_href_value = state.href ) ) {
				a.href = a_href_value;
			}

			if ( a_class_value !== ( a_class_value = "nav-link" + ( state.disabled ? ' disabled' : '' ) + ( state.active ? ' active' : '' ) + " " + ( state.class ) ) ) {
				a.className = a_class_value;
			}
		},

		unmount: function () {
			detachNode( a );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: function () {
			removeListener( a, 'click', click_handler );
		}
	};
}

function NavLink ( options ) {
	options = options || {};
	this._state = assign( template$44.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$45( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( NavLink.prototype, template$44.methods, proto );

NavLink.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavLink.prototype.teardown = NavLink.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$45 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function create_main_fragment$46 ( state, component ) {
	var a, a_class_value;

	return {
		create: function () {
			a = createElement( 'a' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = a_class_value = "navbar-brand " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			if ( component._yield ) component._yield.mount( a, null );
		},

		update: function ( changed, state ) {
			if ( a_class_value !== ( a_class_value = "navbar-brand " + ( state.class ) ) ) {
				a.className = a_class_value;
			}
		},

		unmount: function () {
			detachNode( a );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function NavbarBrand ( options ) {
	options = options || {};
	this._state = assign( template$45.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$46( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( NavbarBrand.prototype, proto );

NavbarBrand.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavbarBrand.prototype.teardown = NavbarBrand.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$46 = (function () {
  return {
    data() {
      return {
        class: '',
        size: null
      }
    }
  }
}());

function create_main_fragment$47 ( state, component ) {
	var ul, ul_class_value;

	return {
		create: function () {
			ul = createElement( 'ul' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			ul.className = ul_class_value = "pagination" + ( state.size ? ` pagination-${state.size}` : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( ul, target, anchor );
			if ( component._yield ) component._yield.mount( ul, null );
		},

		update: function ( changed, state ) {
			if ( ul_class_value !== ( ul_class_value = "pagination" + ( state.size ? ` pagination-${state.size}` : '' ) + " " + ( state.class ) ) ) {
				ul.className = ul_class_value;
			}
		},

		unmount: function () {
			detachNode( ul );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Pagination ( options ) {
	options = options || {};
	this._state = assign( template$46.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$47( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Pagination.prototype, proto );

Pagination.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Pagination.prototype.teardown = Pagination.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$47 = (function () {
  return {
    data() {
      return {
        active: false,
        class: '',
        disabled: false
      }
    }
  }
}());

function create_main_fragment$48 ( state, component ) {
	var li, li_class_value;

	return {
		create: function () {
			li = createElement( 'li' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			li.className = li_class_value = "page-item" + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			if ( component._yield ) component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "page-item" + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		unmount: function () {
			detachNode( li );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function PaginationItem ( options ) {
	options = options || {};
	this._state = assign( template$47.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$48( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( PaginationItem.prototype, proto );

PaginationItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

PaginationItem.prototype.teardown = PaginationItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$48 = (function () {
  // TODO add state to this component, generate PaginationItems, Links, on:click, etc
  return {
    data() {
      return {
        class: '',
        next: false,
        previous: false
      }
    }
  }
}());

function create_main_fragment$49 ( state, component ) {
	var a, a_class_value;

	function get_block ( state ) {
		if ( state.previous ) return create_if_block$2;
		if ( state.next ) return create_if_block_1$2;
		return create_if_block_2;
	}

	var current_block = get_block( state );
	var if_block = current_block( state, component );

	return {
		create: function () {
			a = createElement( 'a' );
			if_block.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = a_class_value = "page-link" + ( state.size ? ` pagination-${state.size}` : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			if_block.mount( a, null );
		},

		update: function ( changed, state ) {
			if ( a_class_value !== ( a_class_value = "page-link" + ( state.size ? ` pagination-${state.size}` : '' ) + " " + ( state.class ) ) ) {
				a.className = a_class_value;
			}

			if ( current_block !== ( current_block = get_block( state ) ) ) {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block( state, component );
				if_block.create();
				if_block.mount( a, null );
			}
		},

		unmount: function () {
			detachNode( a );
			if_block.unmount();
		},

		destroy: function () {
			if_block.destroy();
		}
	};
}

function create_if_block$2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "«" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_if_block_1$2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "»" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_if_block_2 ( state, component ) {

	return {
		create: noop,

		mount: function ( target, anchor ) {
			if ( component._yield ) component._yield.mount( target, null );
		},

		unmount: function () {
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function PaginationLink ( options ) {
	options = options || {};
	this._state = assign( template$48.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$49( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( PaginationLink.prototype, proto );

PaginationLink.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

PaginationLink.prototype.teardown = PaginationLink.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

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
function isObject(value) {
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
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
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

function recompute$1 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'value' in newState && differs( state.value, oldState.value ) ) || ( 'max' in newState && differs( state.max, oldState.max ) ) ) {
		state.percent = newState.percent = template$49.computed.percent( state.value, state.max );
	}
}

var template$49 = (function () {
return {
  data() {
    return {
      bar: false,
      class: '',
      value: 0,
      max: 100,
      multi: false
    }
  },
  computed: {
    percent(value, max) {
      return (index(value) / index(max)) * 100;
    }
  }
}
}());

function create_main_fragment$50 ( state, component ) {
	var if_block_anchor;

	function get_block ( state ) {
		if ( !state.bar ) return create_if_block$3;
		return create_if_block_3;
	}

	var current_block = get_block( state );
	var if_block = current_block( state, component );

	return {
		create: function () {
			if_block.create();
			if_block_anchor = createComment();
		},

		mount: function ( target, anchor ) {
			if_block.mount( target, anchor );
			insertNode( if_block_anchor, target, anchor );
		},

		update: function ( changed, state ) {
			if ( current_block === ( current_block = get_block( state ) ) && if_block ) {
				if_block.update( changed, state );
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block( state, component );
				if_block.create();
				if_block.mount( if_block_anchor.parentNode, if_block_anchor );
			}
		},

		unmount: function () {
			if_block.unmount();
			detachNode( if_block_anchor );
		},

		destroy: function () {
			if_block.destroy();
		}
	};
}

function create_if_block_1$3 ( state, component ) {

	return {
		create: noop,

		mount: function ( target, anchor ) {
			if ( component._yield ) component._yield.mount( target, null );
		},

		update: noop,

		unmount: function () {
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function create_if_block_2$1 ( state, component ) {
	var div, div_class_value, div_style_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "progress-bar" + ( state.animated ? ' progress-bar-animated' : '' ) + ( state.color ? ` bg-${state.color}` : '' ) + ( state.striped || state.animated ? ' progress-bar-striped' : '' );
			div.style.cssText = div_style_value = "width:" + ( state.percent ) + "%";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "progress-bar" + ( state.animated ? ' progress-bar-animated' : '' ) + ( state.color ? ` bg-${state.color}` : '' ) + ( state.striped || state.animated ? ' progress-bar-striped' : '' ) ) ) {
				div.className = div_class_value;
			}

			if ( div_style_value !== ( div_style_value = "width:" + ( state.percent ) + "%" ) ) {
				div.style.cssText = div_style_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function create_if_block$3 ( state, component ) {
	var div, div_class_value;

	function get_block ( state ) {
		if ( state.multi ) return create_if_block_1$3;
		return create_if_block_2$1;
	}

	var current_block = get_block( state );
	var if_block_1 = current_block( state, component );

	return {
		create: function () {
			div = createElement( 'div' );
			if_block_1.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "progress " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if_block_1.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "progress " + ( state.class ) ) ) {
				div.className = div_class_value;
			}

			if ( current_block === ( current_block = get_block( state ) ) && if_block_1 ) {
				if_block_1.update( changed, state );
			} else {
				if_block_1.unmount();
				if_block_1.destroy();
				if_block_1 = current_block( state, component );
				if_block_1.create();
				if_block_1.mount( div, null );
			}
		},

		unmount: function () {
			detachNode( div );
			if_block_1.unmount();
		},

		destroy: function () {
			if_block_1.destroy();
		}
	};
}

function create_if_block_3 ( state, component ) {
	var div, div_class_value, div_style_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "progress-bar" + ( state.animated ? ' progress-bar-animated' : '' ) + ( state.color ? ` bg-${state.color}` : '' ) + ( state.striped || state.animated ? ' progress-bar-striped' : '' );
			div.style.cssText = div_style_value = "width:" + ( state.percent ) + "%";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "progress-bar" + ( state.animated ? ' progress-bar-animated' : '' ) + ( state.color ? ` bg-${state.color}` : '' ) + ( state.striped || state.animated ? ' progress-bar-striped' : '' ) ) ) {
				div.className = div_class_value;
			}

			if ( div_style_value !== ( div_style_value = "width:" + ( state.percent ) + "%" ) ) {
				div.style.cssText = div_style_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Progress ( options ) {
	options = options || {};
	this._state = assign( template$49.data(), options.data );
	recompute$1( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$50( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Progress.prototype, proto );

Progress.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute$1( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Progress.prototype.teardown = Progress.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$50 = (function () {
  return {
    data() {
      return {
        class: '',
        noGutters: false
      }
    }
  };
}());

function create_main_fragment$51 ( state, component ) {
	var div, div_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = div_class_value = "row" + ( state.noGutters ? ' no-gutters' : '' ) + " " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if ( component._yield ) component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "row" + ( state.noGutters ? ' no-gutters' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Row ( options ) {
	options = options || {};
	this._state = assign( template$50.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$51( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Row.prototype, proto );

Row.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Row.prototype.teardown = Row.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$51 = (function () {
  // TODO remove duplication of table above
  return {
    data() {
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
  }
}());

function create_main_fragment$52 ( state, component ) {
	var if_block_anchor;

	function get_block ( state ) {
		if ( state.responsive ) return create_if_block$4;
		return create_if_block_1$4;
	}

	var current_block = get_block( state );
	var if_block = current_block( state, component );

	return {
		create: function () {
			if_block.create();
			if_block_anchor = createComment();
		},

		mount: function ( target, anchor ) {
			if_block.mount( target, anchor );
			insertNode( if_block_anchor, target, anchor );
		},

		update: function ( changed, state ) {
			if ( current_block === ( current_block = get_block( state ) ) && if_block ) {
				if_block.update( changed, state );
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block( state, component );
				if_block.create();
				if_block.mount( if_block_anchor.parentNode, if_block_anchor );
			}
		},

		unmount: function () {
			if_block.unmount();
			detachNode( if_block_anchor );
		},

		destroy: function () {
			if_block.destroy();
		}
	};
}

function create_if_block$4 ( state, component ) {
	var div, table, table_class_value;

	return {
		create: function () {
			div = createElement( 'div' );
			table = createElement( 'table' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = "table-responsive";
			table.className = table_class_value = "table" + ( state.size ? ` table-${state.size}` : '' ) + ( state.bordered ? ' table-bordered' : '' ) + ( state.striped ? ' table-striped' : '' ) + ( state.inverse ? ' table-inverse' : '' ) + ( state.hover ? ' table-hover' : '' ) + ( state.reflow ? ' table-reflow' :'' ) + "\n   " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( table, div );
			if ( component._yield ) component._yield.mount( table, null );
		},

		update: function ( changed, state ) {
			if ( table_class_value !== ( table_class_value = "table" + ( state.size ? ` table-${state.size}` : '' ) + ( state.bordered ? ' table-bordered' : '' ) + ( state.striped ? ' table-striped' : '' ) + ( state.inverse ? ' table-inverse' : '' ) + ( state.hover ? ' table-hover' : '' ) + ( state.reflow ? ' table-reflow' :'' ) + "\n   " + ( state.class ) ) ) {
				table.className = table_class_value;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function create_if_block_1$4 ( state, component ) {
	var table, table_class_value;

	return {
		create: function () {
			table = createElement( 'table' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			table.className = table_class_value = "table" + ( state.size ? ` table-${state.size}` : '' ) + ( state.bordered ? ' table-bordered' : '' ) + ( state.striped ? ' table-striped' : '' ) + ( state.inverse ? ' table-inverse' : '' ) + ( state.hover ? ' table-hover' : '' ) + ( state.reflow ? ' table-reflow' :'' ) + "\n   " + ( state.class );
		},

		mount: function ( target, anchor ) {
			insertNode( table, target, anchor );
			if ( component._yield ) component._yield.mount( table, null );
		},

		update: function ( changed, state ) {
			if ( table_class_value !== ( table_class_value = "table" + ( state.size ? ` table-${state.size}` : '' ) + ( state.bordered ? ' table-bordered' : '' ) + ( state.striped ? ' table-striped' : '' ) + ( state.inverse ? ' table-inverse' : '' ) + ( state.hover ? ' table-hover' : '' ) + ( state.reflow ? ' table-reflow' :'' ) + "\n   " + ( state.class ) ) ) {
				table.className = table_class_value;
			}
		},

		unmount: function () {
			detachNode( table );
			if ( component._yield ) component._yield.unmount();
		},

		destroy: noop
	};
}

function Table ( options ) {
	options = options || {};
	this._state = assign( template$51.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$52( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Table.prototype, proto );

Table.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Table.prototype.teardown = Table.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template = (function () {
  return {
    data() {
      return {
        current: 'Bootstrap',
        themes: [
          { name: 'Bootstrap', url: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css' },
          { name: 'Cerulean', url: 'https://bootswatch.com/4-alpha/cerulean/bootstrap.min.css' },
          { name: 'Cosmo', url: 'https://bootswatch.com/4-alpha/cosmo/bootstrap.min.css' },
          { name: 'Cyborg', url: 'https://bootswatch.com/4-alpha/cyborg/bootstrap.min.css' },
          { name: 'Darkly', url: 'https://bootswatch.com/4-alpha/darkly/bootstrap.min.css' },
          { name: 'Flatly', url: 'https://bootswatch.com/4-alpha/flatly/bootstrap.min.css' },
          { name: 'Journal', url: 'https://bootswatch.com/4-alpha/journal/bootstrap.min.css' },
          { name: 'Litera', url: 'https://bootswatch.com/4-alpha/litera/bootstrap.min.css' },
          { name: 'Lumen', url: 'https://bootswatch.com/4-alpha/lumen/bootstrap.min.css' },
          { name: 'Lux', url: 'https://bootswatch.com/4-alpha/lux/bootstrap.min.css' },
          { name: 'Materia', url: 'https://bootswatch.com/4-alpha/materia/bootstrap.min.css' },
          { name: 'Minty', url: 'https://bootswatch.com/4-alpha/minty/bootstrap.min.css' },
          { name: 'Pulse', url: 'https://bootswatch.com/4-alpha/pulse/bootstrap.min.css' },
          { name: 'Sandstone', url: 'https://bootswatch.com/4-alpha/sandstone/bootstrap.min.css' },
          { name: 'Simplex', url: 'https://bootswatch.com/4-alpha/simplex/bootstrap.min.css' },
          { name: 'Slate', url: 'https://bootswatch.com/4-alpha/slate/bootstrap.min.css' },
          { name: 'Solar', url: 'https://bootswatch.com/4-alpha/solar/bootstrap.min.css' },
          { name: 'Spacelab', url: 'https://bootswatch.com/4-alpha/spacelab/bootstrap.min.css' },
          { name: 'Superhero', url: 'https://bootswatch.com/4-alpha/superhero/bootstrap.min.css' },
          { name: 'United', url: 'https://bootswatch.com/4-alpha/united/bootstrap.min.css' },
          { name: 'Yeti', url: 'https://bootswatch.com/4-alpha/yeti/bootstrap.min.css' }
        ]
      }
    },
    methods: {
      changeTheme(theme) {
        const link = document.getElementById('theme');
        link.href = theme.url;
        this.set({ current: theme.name });
      }
    }
  }
}());

function create_main_fragment ( state, component ) {
	var nav, text, ul, text_2;

	var navbarbrand_1_yield_fragment = create_navbarbrand_yield_fragment( state, component );

	var navbarbrand_1 = new NavbarBrand({
		_root: component._root,
		_yield: navbarbrand_1_yield_fragment,
		data: {
			href: "https://github.com/bestguy/sveltestrap"
		}
	});

	var each_block_value = state.themes;

	var each_block_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
	}

	var container_1_yield_fragment = create_container_yield_fragment( state, component );

	var container_1 = new Container({
		_root: component._root,
		_yield: container_1_yield_fragment,
		data: { fluid: true }
	});

	return {
		create: function () {
			nav = createElement( 'nav' );
			navbarbrand_1_yield_fragment.create();
			navbarbrand_1._fragment.create();
			text = createText( "\n  " );
			ul = createElement( 'ul' );

			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].create();
			}

			text_2 = createText( "\n\n" );
			container_1_yield_fragment.create();
			container_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			nav.className = "navbar sticky-top navbar-dark bg-faded navbar-toggleable-xl";
			ul.className = "navbar-nav ml-auto";
		},

		mount: function ( target, anchor ) {
			insertNode( nav, target, anchor );
			navbarbrand_1._fragment.mount( nav, null );
			appendNode( text, nav );
			appendNode( ul, nav );

			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].mount( ul, null );
			}

			insertNode( text_2, target, anchor );
			container_1._fragment.mount( target, anchor );
		},

		update: function ( changed, state ) {
			var each_block_value = state.themes;

			if ( 'current' in changed || 'themes' in changed ) {
				for ( var i = 0; i < each_block_value.length; i += 1 ) {
					if ( each_block_iterations[i] ) {
						each_block_iterations[i].update( changed, state, each_block_value, each_block_value[i], i );
					} else {
						each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
						each_block_iterations[i].create();
						each_block_iterations[i].mount( ul, null );
					}
				}

				for ( ; i < each_block_iterations.length; i += 1 ) {
					each_block_iterations[i].unmount();
					each_block_iterations[i].destroy();
				}
				each_block_iterations.length = each_block_value.length;
			}

			container_1_yield_fragment.update( changed, state );
		},

		unmount: function () {
			detachNode( nav );

			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].unmount();
			}

			detachNode( text_2 );
			container_1._fragment.unmount();
		},

		destroy: function () {
			navbarbrand_1_yield_fragment.destroy();
			navbarbrand_1.destroy( false );

			destroyEach( each_block_iterations, false, 0 );

			container_1_yield_fragment.destroy();
			container_1.destroy( false );
		}
	};
}

function create_navbarbrand_yield_fragment ( state, component ) {
	var img;

	return {
		create: function () {
			img = createElement( 'img' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUMAAABACAYAAACA0BUdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAEO5JREFUeNrsXQmUFcUVrVkYBEV2EZcEUXHDCGhccEXUBFEUIuJyRDG4xDVBQ+KWuCWaHLecxMQ9aIyIirKpKEYIRlRUohIxGkRUQAVFZHEYGJjUtW9nKp/fW3X1X2bePeed6fndXd1VXXXrvVevqioaGhqUQCAQNHdUCBkKBAKBBRkO63ellFrh0EPLYC3vaXlCikMgiMa46ddb3VcpRVfS6K/lRi1XSFEIBNlCyLC00YJ/q6UoBAIhw+aM9fy7VopCIBAyFAgEgswh5pdAEB87s800GMrEci2fStEIGQoEzQWjtNyc5/fVWnppeV+KSMxkQWmijZb7tNyvpZMUR2r0DPh9Cy3bSvEIGQpKF1tqGaFluJChE3wVck4GuIQMBSWMetXo21onxSEQCBkKBAKBkKHgG8gEdClfgZBhs8VnxrGEfqTHyphlLShTuAyt2VHLVlo6sqeM01tiutkHWt4KOL+Nln2UF8v1D8d5H6ilSsuzKpkDfBctXZU3WrsxTz7RwWzQslTLx/ybNXbje/m+wa+17GGcv1jLy1pah3wHDBDMZJ6SAt99ey1dmP/cNCooq0jM7zrMO0ZyO/HZNQneH9cu0TI7zzkMPvVluaxjno4ISet8LU/nKV+/XFF36wPu3U5Lb6MuVbBevq02Ddf5FqU9r8d7YZbSrAiyzsUOWjqz3Cotv7mvSM2OUcd7sI6uN+5FXl9i2zbLa1d+05qcMsM9a1h/5htplRQZoqGdoOUgy/tBht0Dzh2o5REe7+qwEZ2q5UEed45BhvgwP9VyrJb9EjwHH2+Klru1/C1DMhzPyhaEG2Km0zWhFjlAy+ksl9YJ7nuZ73wrO46kqCIBHaW8xSw2S1F2XfI05l9ouSRBGqMpQTiB+c2HB7T0y/P7XC3fMe4fzvLO12Z/pSVqOSkQ/IV8Vn+Hde8pKhZBgNLwvMoffjRWyyn8fijzIezUo4BVnGZouUfLq6VAhtDasKzUvsZvS0gAcVm7hj1qEJ5jepuzoG5wlO9h/Ise+/OIa6GZPqS82Qc+FlBj2MCePNd/hHx1oJY8jHJLwgaWBFMNLcbXxNpQ6/C/y4qI77BIhYeP5OI2doQ+UI5fBnz7BhJYS2ol+1NGkExfS/BcdEaIn9zdUdm1CNA2XaJjBBnnQy3/oiMdmSJ94CQtN6ls4iF3ijjfiVyRD+uojMyKkU6upgk5W8uvlaNVndKQ4SQte/N4HFl6umVPHwQ0ronsPQY6IsM21CiARyOu7UPTsRUb9NXsAObGeA6CcQ/Xcp6W7ylvBgNMnKEZVMhRlNxG9gmJsR97U1d42OhQoPneyd7/6xj39qKmcwUJ7QWapP+Mce+eWl4ksbpAXYCJ+LXj7xNmeQQ9aynr+8gY6a+LqBs3Z2iVrIk4X89rtgjQVscmJMJcXK6lG629VLAdQDnJIMIb+f9zjonQx0RDI+jmIL0B1FDMtINMsQkkws/p17k2JhECq9lhfJ+9l2/unKUKg1rjeKXDdM81iPA3NJGnJCCQN2jS9SZZb0ZyjUNwYxwSoV//Kx22C5ftDD7Kn8e8Nsg/3y9jIkyLwY5M9lPoxir4R4KmcRqP4Qe7LOMCe5bEUs2GlxZ+GnDefhhyHUhrex6D0N5M8UxoQY/z+Dqa/VmjlXHc2lGamxva+aMJGmsQKQ4xzJ4REdcfSU3dJVqo/AMbbRw/x8YCS+IHbR/w+x2q+eAaLW0L/ZF2pLkC3FWATMLXNY29yCAtv0+RVo1BhhMirv2R4QJ43UE+4GA/juYryHV8GVY4fIN21ERGOUgPAymPUWMeQVdLEIbEqCfoOGexw66OUfcx2r8sz7nfKW+Us5ImbmvWm6BpjfA9z8lDYLBAEHbzpIOyQsTFv2mlVBuKyWY0NXMxkJ1MGOA6eZsaenWA4lNL985xalP/uEvUs529w2dWGb93Ief0iOj8UYduKyQZdjIqxfoCNcIJbIgHa9la2cfNHWH0HpNCroPD1x/Ju9dRHhAmMZOmy+FlSoaHGRbBIkdpjiEZ7qU8B//igOvCtMIZtFZcvdMLFBMYAPtJSMf5r4zK/H2mPy3hfUMjzGqMLN8eM62WdLXUZJRHtAWMJs+LuO48KkNBFu0AdmRWQfA2ZnKNahyBqylQI5zKHroltaq0JrLfywahu9ErzXGYj1mGWViO8EenpztMEyRSRxO8W0SDzAcMgJztkAiDsCHC3M4CS6kATLO4d++QcxcnIEJFayArPMvOcF6Ma/+o5YKQ87vRcrWCDRliZMh3lhdqtY6l7P0VTWXbvA7m8eMR13bg31rldmRxCf9uWaZk2M6oA66AiIEvIsqlOoQMlYoOj3KB6iKQ4U00YZOijQoOZ1mskruaqjLKHzqYpAMff9KyMOBcV5UifMiGDD81zNQOBWyIvo+vv2VPdZBqjOmK8hfWGz4Tl7N0WhrpliPqU7hXwoikMqI+otGsC6nD+6mmh40x6mkQWoV8o1dLKI/zVPDsszDMDemwrBUNGzJEz/ISjy8oYME9zUaxpbIbjvc1SsxiebPIlUAm9icrF/y+LOS+20M0oXIFfIUfpiDSoCl2pbT24sKUnbIrTkt1oz/q14d2fCHwkfICboHjLO73RyNlM/byxPMh57pT4xnUhPK7QmWzDmUpbfVhG5dclYWiYUuGCCX4A48x0oXJ2kcV0FTGjI4ksXpwJu8Q00QWlCYejDgPzXAiv++hTSC/zWF/oqpSepk0kfYYmr+Ox9/V8ozyRksRhN0zo/edwr9YJeWQBPcda6jlrwivlCU+UvEC/GE1zFBeuMaBUmyCQpAhgNgg+O+m8v8DlDf1DA5OxKJhXuW3Hb7vf1TjpP4kprJ/7aSEz4PfZbXD969tIvXGpd9pTQJzCVM/404vG0ILZhw7a4EgUzIE4MsZQFMUU2L82RoILMaKG4gj82cZtHXwPN/nh2fGCWlATF8vSxMZpkpHh+XdoYnUm3aOyyTJ1LNLlRf8HHe+9YnKc+M8YNQDgSBTv8QcytXKCxQ9noSFQMgfUDD9CUGWiPN7yvI5k5W3fhumCO2nohd99U1khAPNTPgsTMOCYx5Ts9IGmNepxmDrmjKvN6OpeaEzqkhZJh2NDiduvN5t7Nh+qeWMmPecRhlLDfMtaf6CrMjQhD+daTQ1REwNOoom8w8pIM4rDBM7LuZS2+xJwo0iQ38UeaKyG73qptyslmOi3HerQ3hTnwzSTRLMvVB5c1Ex/QohXsNjkunJyltlCSvuXCYUIMiaDH2AfKZREBV/GCvjyWxMiB08nSZMEownGQ6k2RQErDrT1yBDG9IaqtwugQUsLvN6g9CqvzpOE/5Zm8EtrH4D3zRma5xPTXGLiHugzWLFnV1U9AIQAiFD51hFExeCsJwxyls9+n5qdwsSpDWFJhK2AsC6eEELgx7DvzBzbebTwoybJNVkEyDofkaJvRPmmiPCAQsqnEvrI8rfi+mZGJC5RD6poFi74yEEB+vT+UvRn5vwfowoz+fxoBgmMvyTNiOg/vL5gv9H+xJ+N+yp8zPlrTqExXiXRFw/KgM3iEDIMBEw1chfe8wmSNZfbCEoxAZaweE8lkDr5ocltB5Aig9FXHuGFJeg2Psm+yPK2Atj+4T3TuZfmMn5lsQayPwhTnCqfOpmC6yIg/0xpoRcc0jKZ9Q38TLMtyWuC5RUuRWbDBfQVIbDO+lE+xcNEyifduj/BiJc08wJYaMSwBwOiibAVM00y3C1KqNysFmQ2d/d0DVst3gNI1Hr9yw2GaJy+r68GosP5Adg5+6NAj/f0Ty2GQCpaCIE4PfmrgbKyrlcMHtpWQiZRTWiMLLsVIIWX1DbtvH3dlPZDLbuYnlfq5D6XleuZGhWQJtZDT7RYa3C7Yzfj2Svsz7CPMqqJy0FVBnk1dZx2uVaJmGaRpQZGDaVsm+J5WelCh4wxJTZpBuEjcjoPbHaUNKV69Gug6ZXrlPh+4OXvGaYZntRhMssZ6M3tUN/hBmzXb60SPcz/kWl6VimDbzWMCc6O0rTX5F6qzIsj54hGlyLGGQYtq/zRapxz5xSAIjwg4Bz6BhvSZAWBiHPyfBdb02oWf825PqFyn6NxKKToany2qi30FAm5hAgcDz/2o4iLyCRoHzKdeUTdALvGhXaBfwGdnSZlQU0t4dDTL1FMbTdlyK0FfiwEfS9dYnkOWzqKcgN6wb0DrkGMbxXKW/BlSyB52Du+KkRpIh3xdqpF4Zcg53+lti+SLHXTENBdKB2ON8yjQlU4/vx/z7s/TBoMNkyTWibf1feijyo4I+UKSFOpUZ0hpbLVfrRu8nUglAx91GNKwgVAv1VYwhMnAGh9dT4eqroqYOvxNAM0RHMUI07BOYCg4CYTGDGNvpuitkkoEK6FzBDKGx/kZGUeSxP/10beNxDZbe3Sy4wgIX1KuHTXZpzzh+82S1GOmPTvESxyXA0/85XyWagmMBUv9WsjFi4YX/+PsMwd23VdzRAhF2cnLagiwQ0zktpJt/twPfzHLVNOL7vVOE7sLnG5Q413Fz8JeZ1V6roufAd1KarE6HTv8TSZWMLbG2B/ZoHRly3ewnV184pXDrgj8fSPLxYZjJ6Hqx76O9Wd0+KtGoNDRCLzQ5PaSL7eFI1Tjl7yEi3nPAhTR1FrWqMSr/81gWGBo5y71KgvKzOKN0nIkxgEzCF77J4xieqOOFN5yl3sXx1GbzfSsd5TQVbzRB+vjYJChqqbmuqunsob97onoYv5uaU+ZhA7e1I47eJDgr4RGoCMBkwhxprMo6nebiInUmScJNKNooVBWwc1ysvNAJljkUxjqbG+Aq1h7V8L9SFr2JUemiHmNmBtSuPoaYIh/zLyhtkWG/RyVaT7MK2Zd2QQdnAx3RmwnvO4fue6egdsgxX+ojaNGZrpQn/uYrKwM6O3/8RfvOLUuYT+0A/UywyvJdaXZIK2jLP8x5lpUob3f40idlP/3VWhLRYRg1oDInwWNU4ar3KotFXMq9Y53FmzDIDNk+Zj5EkqqtphlzD39eR/Crpl7lPeT7SKFzL8sUyWFsZ6a21JMMqNthTQ65xPR8aHcKPLUkWHctsdgpdY1zfPqRM2macXyylt6+WO5TdPkUjWP+vCzifZg9wxBafpbzZZ4Mt7od7bZSyHxtwQoYIN7GJHgeBYB3D95S3HLurkapVOabsvQ4bDWavDKXWiXXwepEg0yzgEJcsfNNwuYN8YDvNsdRs4Fc9mA2uJue7xsUYauTYEKwv02ur7GcVRMW+wUQ9zDJtaOEYAHmDmiyc9e+kLE/4TB9mJ4m59Xspz/9WHaCBBsX9wfLYKc/vcxzWYeQdm6jB/z2MFlrvEJfJa7TY/sxOtIJll2+l8DRxvL62igVVjmdZom7uGPId3+E7Pc8278x8r2hoSKaUDesHH/I3DuIkvqcGCsywrJzIlapx9ZEFKltsp+xXq8YHXazijSyCWLZhuX3hOA9t85DfihTE206l29ZguYoOmO1uUdaVtBo+y8jvFadefBriAjDrba6Jm+Xc3U45Wp0/iowyWxhgpWyb5/eotgatDyPW+daYhEY3KOZzFMvj4yhLctz06wuqGS53pK24xMYCkKCPRQV6ztoM8/QVxRVWqBTR/zGxQJU2FpV4vTXxOSUu6gr0nnXF+s6VSiAQCARChgKBQCBkKBAIBEKGAoFAIGQoEAgEQoYCgaBgQMRKUOxpi1J6USFDgUCQJVap4BC+mlJ60Wr5VgKBIEMglhFT+Q7Ic+6eUnrRxDNQBAKBoClCyFAgEAiEDAUCgUDIUCAQCP6H/wowAFFJXHAnIN6pAAAAAElFTkSuQmCC";
			img.height = "32";
		},

		mount: function ( target, anchor ) {
			insertNode( img, target, anchor );
		},

		unmount: function () {
			detachNode( img );
		},

		destroy: noop
	};
}

function create_each_block ( state, each_block_value, theme, theme_index, component ) {

	var navitem_1_yield_fragment = create_navitem_yield_fragment( state, each_block_value, theme, theme_index, component );

	var navitem_1 = new NavItem({
		_root: component._root,
		_yield: navitem_1_yield_fragment,
		data: { active: state.current == theme.name }
	});

	return {
		create: function () {
			navitem_1_yield_fragment.create();
			navitem_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navitem_1._fragment.mount( target, anchor );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			navitem_1_yield_fragment.update( changed, state, each_block_value, theme, theme_index );

			var navitem_1_changes = {};

			if ( 'current' in changed||'themes' in changed ) navitem_1_changes.active = state.current == theme.name;

			if ( Object.keys( navitem_1_changes ).length ) navitem_1.set( navitem_1_changes );
		},

		unmount: function () {
			navitem_1._fragment.unmount();
		},

		destroy: function () {
			navitem_1_yield_fragment.destroy();
			navitem_1.destroy( false );
		}
	};
}

function create_navitem_yield_fragment ( state, each_block_value, theme, theme_index, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment( state, each_block_value, theme, theme_index, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	navlink_1.on( 'click', function ( event ) {
		var each_block_value = this._context.each_block_value, theme_index = this._context.theme_index, theme = each_block_value[theme_index];

		component.changeTheme(theme);
	});

	navlink_1._context = {
		each_block_value: each_block_value,
		theme_index: theme_index
	};

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			navlink_1_yield_fragment.update( changed, state, each_block_value, theme, theme_index );

			navlink_1._context.each_block_value = each_block_value;
			navlink_1._context.theme_index = theme_index;
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment ( state, each_block_value, theme, theme_index, component ) {
	var small;

	function get_block ( state, each_block_value, theme, theme_index ) {
		if ( state.current == theme.name ) return create_if_block;
		return create_if_block_1;
	}

	var current_block = get_block( state, each_block_value, theme, theme_index );
	var if_block = current_block( state, each_block_value, theme, theme_index, component );

	return {
		create: function () {
			small = createElement( 'small' );
			if_block.create();
		},

		mount: function ( target, anchor ) {
			insertNode( small, target, anchor );
			if_block.mount( small, null );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			if ( current_block === ( current_block = get_block( state, each_block_value, theme, theme_index ) ) && if_block ) {
				if_block.update( changed, state, each_block_value, theme, theme_index );
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block( state, each_block_value, theme, theme_index, component );
				if_block.create();
				if_block.mount( small, null );
			}
		},

		unmount: function () {
			detachNode( small );
			if_block.unmount();
		},

		destroy: function () {
			if_block.destroy();
		}
	};
}

function create_if_block ( state, each_block_value, theme, theme_index, component ) {
	var b, text_value, text;

	return {
		create: function () {
			b = createElement( 'b' );
			text = createText( text_value = theme.name );
		},

		mount: function ( target, anchor ) {
			insertNode( b, target, anchor );
			appendNode( text, b );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			if ( text_value !== ( text_value = theme.name ) ) {
				text.data = text_value;
			}
		},

		unmount: function () {
			detachNode( b );
		},

		destroy: noop
	};
}

function create_if_block_1 ( state, each_block_value, theme, theme_index, component ) {
	var text_value, text;

	return {
		create: function () {
			text = createText( text_value = theme.name );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			if ( text_value !== ( text_value = theme.name ) ) {
				text.data = text_value;
			}
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_container_yield_fragment ( state, component ) {

	var row_1_yield_fragment = create_row_yield_fragment( state, component );

	var row_1 = new Row({
		_root: component._root,
		_yield: row_1_yield_fragment
	});

	return {
		create: function () {
			row_1_yield_fragment.create();
			row_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			row_1._fragment.mount( target, anchor );
		},

		update: function ( changed, state ) {
			row_1_yield_fragment.update( changed, state );
		},

		unmount: function () {
			row_1._fragment.unmount();
		},

		destroy: function () {
			row_1_yield_fragment.destroy();
			row_1.destroy( false );
		}
	};
}

function create_row_yield_fragment ( state, component ) {
	var text;

	var col_2_yield_fragment = create_col_yield_fragment( state, component );

	var col_2 = new Col({
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { sm: 3, lg: 2 }
	});

	var col_3_yield_fragment = create_col_1_yield_fragment( state, component );

	var col_3 = new Col({
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { sm: 9 }
	});

	return {
		create: function () {
			col_2_yield_fragment.create();
			col_2._fragment.create();
			text = createText( "\n  \n  \n  " );
			col_3_yield_fragment.create();
			col_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		update: function ( changed, state ) {
			col_3_yield_fragment.update( changed, state );
		},

		unmount: function () {
			col_2._fragment.unmount();
			detachNode( text );
			col_3._fragment.unmount();
		},

		destroy: function () {
			col_2_yield_fragment.destroy();
			col_2.destroy( false );
			col_3_yield_fragment.destroy();
			col_3.destroy( false );
		}
	};
}

function create_col_yield_fragment ( state, component ) {
	var div;

	var listgroup_1_yield_fragment = create_listgroup_yield_fragment( state, component );

	var listgroup_1 = new ListGroup({
		_root: component._root,
		_yield: listgroup_1_yield_fragment
	});

	return {
		create: function () {
			div = createElement( 'div' );
			listgroup_1_yield_fragment.create();
			listgroup_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = "mt-3 sticky-top";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			listgroup_1._fragment.mount( div, null );
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			listgroup_1_yield_fragment.destroy();
			listgroup_1.destroy( false );
		}
	};
}

function create_listgroup_yield_fragment ( state, component ) {
	var text, text_1, text_2, text_3, text_4, text_5, text_6, text_7, text_8;

	var listgroupitem_10_yield_fragment = create_listgroupitem_yield_fragment( state, component );

	var listgroupitem_10 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_10_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_11_yield_fragment = create_listgroupitem_1_yield_fragment( state, component );

	var listgroupitem_11 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_11_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_12_yield_fragment = create_listgroupitem_2_yield_fragment( state, component );

	var listgroupitem_12 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_12_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_13_yield_fragment = create_listgroupitem_3_yield_fragment( state, component );

	var listgroupitem_13 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_13_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_14_yield_fragment = create_listgroupitem_4_yield_fragment( state, component );

	var listgroupitem_14 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_14_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_15_yield_fragment = create_listgroupitem_5_yield_fragment( state, component );

	var listgroupitem_15 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_15_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_16_yield_fragment = create_listgroupitem_6_yield_fragment( state, component );

	var listgroupitem_16 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_16_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_17_yield_fragment = create_listgroupitem_7_yield_fragment( state, component );

	var listgroupitem_17 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_17_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_18_yield_fragment = create_listgroupitem_8_yield_fragment( state, component );

	var listgroupitem_18 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_18_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_19_yield_fragment = create_listgroupitem_9_yield_fragment( state, component );

	var listgroupitem_19 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_19_yield_fragment,
		data: { action: true }
	});

	return {
		create: function () {
			listgroupitem_10_yield_fragment.create();
			listgroupitem_10._fragment.create();
			text = createText( "\n          " );
			listgroupitem_11_yield_fragment.create();
			listgroupitem_11._fragment.create();
			text_1 = createText( "\n          " );
			listgroupitem_12_yield_fragment.create();
			listgroupitem_12._fragment.create();
			text_2 = createText( "\n          " );
			listgroupitem_13_yield_fragment.create();
			listgroupitem_13._fragment.create();
			text_3 = createText( "\n          " );
			listgroupitem_14_yield_fragment.create();
			listgroupitem_14._fragment.create();
			text_4 = createText( "\n          " );
			listgroupitem_15_yield_fragment.create();
			listgroupitem_15._fragment.create();
			text_5 = createText( "\n          " );
			listgroupitem_16_yield_fragment.create();
			listgroupitem_16._fragment.create();
			text_6 = createText( "\n          " );
			listgroupitem_17_yield_fragment.create();
			listgroupitem_17._fragment.create();
			text_7 = createText( "\n          " );
			listgroupitem_18_yield_fragment.create();
			listgroupitem_18._fragment.create();
			text_8 = createText( "\n          " );
			listgroupitem_19_yield_fragment.create();
			listgroupitem_19._fragment.create();
		},

		mount: function ( target, anchor ) {
			listgroupitem_10._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitem_11._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			listgroupitem_12._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			listgroupitem_13._fragment.mount( target, anchor );
			insertNode( text_3, target, anchor );
			listgroupitem_14._fragment.mount( target, anchor );
			insertNode( text_4, target, anchor );
			listgroupitem_15._fragment.mount( target, anchor );
			insertNode( text_5, target, anchor );
			listgroupitem_16._fragment.mount( target, anchor );
			insertNode( text_6, target, anchor );
			listgroupitem_17._fragment.mount( target, anchor );
			insertNode( text_7, target, anchor );
			listgroupitem_18._fragment.mount( target, anchor );
			insertNode( text_8, target, anchor );
			listgroupitem_19._fragment.mount( target, anchor );
		},

		unmount: function () {
			listgroupitem_10._fragment.unmount();
			detachNode( text );
			listgroupitem_11._fragment.unmount();
			detachNode( text_1 );
			listgroupitem_12._fragment.unmount();
			detachNode( text_2 );
			listgroupitem_13._fragment.unmount();
			detachNode( text_3 );
			listgroupitem_14._fragment.unmount();
			detachNode( text_4 );
			listgroupitem_15._fragment.unmount();
			detachNode( text_5 );
			listgroupitem_16._fragment.unmount();
			detachNode( text_6 );
			listgroupitem_17._fragment.unmount();
			detachNode( text_7 );
			listgroupitem_18._fragment.unmount();
			detachNode( text_8 );
			listgroupitem_19._fragment.unmount();
		},

		destroy: function () {
			listgroupitem_10_yield_fragment.destroy();
			listgroupitem_10.destroy( false );
			listgroupitem_11_yield_fragment.destroy();
			listgroupitem_11.destroy( false );
			listgroupitem_12_yield_fragment.destroy();
			listgroupitem_12.destroy( false );
			listgroupitem_13_yield_fragment.destroy();
			listgroupitem_13.destroy( false );
			listgroupitem_14_yield_fragment.destroy();
			listgroupitem_14.destroy( false );
			listgroupitem_15_yield_fragment.destroy();
			listgroupitem_15.destroy( false );
			listgroupitem_16_yield_fragment.destroy();
			listgroupitem_16.destroy( false );
			listgroupitem_17_yield_fragment.destroy();
			listgroupitem_17.destroy( false );
			listgroupitem_18_yield_fragment.destroy();
			listgroupitem_18.destroy( false );
			listgroupitem_19_yield_fragment.destroy();
			listgroupitem_19.destroy( false );
		}
	};
}

function create_listgroupitem_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Navbars" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#navbars";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_listgroupitem_1_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Buttons" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#buttons";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_listgroupitem_2_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Typography" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#typography";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_listgroupitem_3_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Tables" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#tables";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_listgroupitem_4_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Forms" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#forms";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_listgroupitem_5_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Navs" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#navs";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_listgroupitem_6_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Indicators" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#indicators";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_listgroupitem_7_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Progress" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#progress";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_listgroupitem_8_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Containers" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#containers";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_listgroupitem_9_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Dialogs" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#dialogs";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_col_1_yield_fragment ( state, component ) {
	var div, text_1, div_1, h1, text_2, text_3, text_4, text_6, div_2, h1_1, text_7, text_8, text_9, h2, text_10, text_11, text_13, div_3, h1_2, text_14, text_15, text_17, div_4, h1_3, text_18, text_19, text_21, div_5, h1_4, text_22, text_23, text_24, h2_1, text_25, text_26, text_27, h2_2, text_28, text_29, text_30, text_32, div_6, h1_5, text_33, text_34, h2_3, text_35, text_36, text_37, text_38, div_7, h2_4, text_39, text_40, div_8, text_41, text_42, text_43, text_44, text_45, text_47, div_9, text_48, text_49, text_50, text_51, text_52, text_56, div_10, text_58, div_11, text_59, h2_5, text_60, text_61, text_62, h2_6, text_63, text_64, text_65, h2_7, text_66, text_67, text_69, div_12, h1_6, text_70, text_71;

	var row_16_yield_fragment = create_row_yield_fragment_1( state, component );

	var row_16 = new Row({
		_root: component._root,
		_yield: row_16_yield_fragment
	});

	var row_17_yield_fragment = create_row_1_yield_fragment( state, component );

	var row_17 = new Row({
		_root: component._root,
		_yield: row_17_yield_fragment
	});

	var row_18_yield_fragment = create_row_2_yield_fragment( state, component );

	var row_18 = new Row({
		_root: component._root,
		_yield: row_18_yield_fragment
	});

	var row_19_yield_fragment = create_row_3_yield_fragment( state, component );

	var row_19 = new Row({
		_root: component._root,
		_yield: row_19_yield_fragment
	});

	var row_20_yield_fragment = create_row_4_yield_fragment( state, component );

	var row_20 = new Row({
		_root: component._root,
		_yield: row_20_yield_fragment
	});

	var row_21_yield_fragment = create_row_5_yield_fragment( state, component );

	var row_21 = new Row({
		_root: component._root,
		_yield: row_21_yield_fragment
	});

	var row_22_yield_fragment = create_row_6_yield_fragment( state, component );

	var row_22 = new Row({
		_root: component._root,
		_yield: row_22_yield_fragment
	});

	var row_23_yield_fragment = create_row_7_yield_fragment( state, component );

	var row_23 = new Row({
		_root: component._root,
		_yield: row_23_yield_fragment,
		data: { class: "mb-2" }
	});

	var nav_2_yield_fragment = create_nav_yield_fragment_2( state, component );

	var nav_2 = new Nav({
		_root: component._root,
		_yield: nav_2_yield_fragment,
		data: { pills: true, fill: true, class: "mb-2" }
	});

	var nav_3_yield_fragment = create_nav_1_yield_fragment_1( state, component );

	var nav_3 = new Nav({
		_root: component._root,
		_yield: nav_3_yield_fragment,
		data: { pills: true, justified: true }
	});

	var row_24_yield_fragment = create_row_8_yield_fragment( state, component );

	var row_24 = new Row({
		_root: component._root,
		_yield: row_24_yield_fragment
	});

	var alert_1_yield_fragment = create_alert_yield_fragment( state, component );

	var alert_1 = new Alert({
		_root: component._root,
		_yield: alert_1_yield_fragment
	});

	var row_25_yield_fragment = create_row_9_yield_fragment( state, component );

	var row_25 = new Row({
		_root: component._root,
		_yield: row_25_yield_fragment
	});

	var badge_12_yield_fragment = create_badge_yield_fragment( state, component );

	var badge_12 = new Badge({
		_root: component._root,
		_yield: badge_12_yield_fragment
	});

	var badge_13_yield_fragment = create_badge_1_yield_fragment( state, component );

	var badge_13 = new Badge({
		_root: component._root,
		_yield: badge_13_yield_fragment,
		data: { color: "primary" }
	});

	var badge_14_yield_fragment = create_badge_2_yield_fragment( state, component );

	var badge_14 = new Badge({
		_root: component._root,
		_yield: badge_14_yield_fragment,
		data: { color: "success" }
	});

	var badge_15_yield_fragment = create_badge_3_yield_fragment( state, component );

	var badge_15 = new Badge({
		_root: component._root,
		_yield: badge_15_yield_fragment,
		data: { color: "warning" }
	});

	var badge_16_yield_fragment = create_badge_4_yield_fragment( state, component );

	var badge_16 = new Badge({
		_root: component._root,
		_yield: badge_16_yield_fragment,
		data: { color: "danger" }
	});

	var badge_17_yield_fragment = create_badge_5_yield_fragment( state, component );

	var badge_17 = new Badge({
		_root: component._root,
		_yield: badge_17_yield_fragment,
		data: { color: "info" }
	});

	var badge_18_yield_fragment = create_badge_6_yield_fragment( state, component );

	var badge_18 = new Badge({
		_root: component._root,
		_yield: badge_18_yield_fragment,
		data: { pill: true }
	});

	var badge_19_yield_fragment = create_badge_7_yield_fragment( state, component );

	var badge_19 = new Badge({
		_root: component._root,
		_yield: badge_19_yield_fragment,
		data: { pill: true, color: "primary" }
	});

	var badge_20_yield_fragment = create_badge_8_yield_fragment( state, component );

	var badge_20 = new Badge({
		_root: component._root,
		_yield: badge_20_yield_fragment,
		data: { pill: true, color: "success" }
	});

	var badge_21_yield_fragment = create_badge_9_yield_fragment( state, component );

	var badge_21 = new Badge({
		_root: component._root,
		_yield: badge_21_yield_fragment,
		data: { pill: true, color: "warning" }
	});

	var badge_22_yield_fragment = create_badge_10_yield_fragment( state, component );

	var badge_22 = new Badge({
		_root: component._root,
		_yield: badge_22_yield_fragment,
		data: { pill: true, color: "danger" }
	});

	var badge_23_yield_fragment = create_badge_11_yield_fragment( state, component );

	var badge_23 = new Badge({
		_root: component._root,
		_yield: badge_23_yield_fragment,
		data: { pill: true, color: "info" }
	});

	var row_26_yield_fragment = create_row_10_yield_fragment( state, component );

	var row_26 = new Row({
		_root: component._root,
		_yield: row_26_yield_fragment
	});

	var row_27_yield_fragment = create_row_11_yield_fragment( state, component );

	var row_27 = new Row({
		_root: component._root,
		_yield: row_27_yield_fragment
	});

	var row_28_yield_fragment = create_row_12_yield_fragment( state, component );

	var row_28 = new Row({
		_root: component._root,
		_yield: row_28_yield_fragment
	});

	var row_29_yield_fragment = create_row_13_yield_fragment( state, component );

	var row_29 = new Row({
		_root: component._root,
		_yield: row_29_yield_fragment
	});

	var row_30_yield_fragment = create_row_14_yield_fragment( state, component );

	var row_30 = new Row({
		_root: component._root,
		_yield: row_30_yield_fragment
	});

	var row_31_yield_fragment = create_row_15_yield_fragment( state, component );

	var row_31 = new Row({
		_root: component._root,
		_yield: row_31_yield_fragment
	});

	return {
		create: function () {
			div = createElement( 'div' );
			row_16_yield_fragment.create();
			row_16._fragment.create();
			text_1 = createText( "\n\n\n  \n  " );
			div_1 = createElement( 'div' );
			h1 = createElement( 'h1' );
			text_2 = createText( "Buttons" );
			text_3 = createText( "\n\n    " );
			row_17_yield_fragment.create();
			row_17._fragment.create();
			text_4 = createText( "\n    \n    " );
			row_18_yield_fragment.create();
			row_18._fragment.create();
			text_6 = createText( "\n\n  \n  " );
			div_2 = createElement( 'div' );
			h1_1 = createElement( 'h1' );
			text_7 = createText( "Typography" );
			text_8 = createText( "\n\n    \n\n    " );
			row_19_yield_fragment.create();
			row_19._fragment.create();
			text_9 = createText( "\n\n    \n\n    " );
			h2 = createElement( 'h2' );
			text_10 = createText( "Blockquotes" );
			text_11 = createText( "\n\n    " );
			row_20_yield_fragment.create();
			row_20._fragment.create();
			text_13 = createText( "\n\n  \n  " );
			div_3 = createElement( 'div' );
			h1_2 = createElement( 'h1' );
			text_14 = createText( "Tables" );
			text_15 = createText( "\n    " );
			row_21_yield_fragment.create();
			row_21._fragment.create();
			text_17 = createText( "\n\n  \n  " );
			div_4 = createElement( 'div' );
			h1_3 = createElement( 'h1' );
			text_18 = createText( "Forms" );
			text_19 = createText( "\n\n    " );
			row_22_yield_fragment.create();
			row_22._fragment.create();
			text_21 = createText( "\n\n  \n  " );
			div_5 = createElement( 'div' );
			h1_4 = createElement( 'h1' );
			text_22 = createText( "Navs" );
			text_23 = createText( "\n\n    " );
			row_23_yield_fragment.create();
			row_23._fragment.create();
			text_24 = createText( "\n\n    " );
			h2_1 = createElement( 'h2' );
			text_25 = createText( "Fill" );
			text_26 = createText( "\n    " );
			nav_2_yield_fragment.create();
			nav_2._fragment.create();
			text_27 = createText( "\n\n    " );
			h2_2 = createElement( 'h2' );
			text_28 = createText( "Justified" );
			text_29 = createText( "\n    " );
			nav_3_yield_fragment.create();
			nav_3._fragment.create();
			text_30 = createText( "\n\n    " );
			row_24_yield_fragment.create();
			row_24._fragment.create();
			text_32 = createText( "\n\n  \n  " );
			div_6 = createElement( 'div' );
			h1_5 = createElement( 'h1' );
			text_33 = createText( "Indicators" );
			text_34 = createText( "\n\n    " );
			h2_3 = createElement( 'h2' );
			text_35 = createText( "Alerts" );
			text_36 = createText( "\n    " );
			alert_1_yield_fragment.create();
			alert_1._fragment.create();
			text_37 = createText( "\n\n    " );
			row_25_yield_fragment.create();
			row_25._fragment.create();
			text_38 = createText( "\n\n    " );
			div_7 = createElement( 'div' );
			h2_4 = createElement( 'h2' );
			text_39 = createText( "Badges" );
			text_40 = createText( "\n      " );
			div_8 = createElement( 'div' );
			badge_12_yield_fragment.create();
			badge_12._fragment.create();
			text_41 = createText( "\n        " );
			badge_13_yield_fragment.create();
			badge_13._fragment.create();
			text_42 = createText( "\n        " );
			badge_14_yield_fragment.create();
			badge_14._fragment.create();
			text_43 = createText( "\n        " );
			badge_15_yield_fragment.create();
			badge_15._fragment.create();
			text_44 = createText( "\n        " );
			badge_16_yield_fragment.create();
			badge_16._fragment.create();
			text_45 = createText( "\n        " );
			badge_17_yield_fragment.create();
			badge_17._fragment.create();
			text_47 = createText( "\n      " );
			div_9 = createElement( 'div' );
			badge_18_yield_fragment.create();
			badge_18._fragment.create();
			text_48 = createText( "\n        " );
			badge_19_yield_fragment.create();
			badge_19._fragment.create();
			text_49 = createText( "\n        " );
			badge_20_yield_fragment.create();
			badge_20._fragment.create();
			text_50 = createText( "\n        " );
			badge_21_yield_fragment.create();
			badge_21._fragment.create();
			text_51 = createText( "\n        " );
			badge_22_yield_fragment.create();
			badge_22._fragment.create();
			text_52 = createText( "\n        " );
			badge_23_yield_fragment.create();
			badge_23._fragment.create();
			text_56 = createText( "\n\n  \n  " );
			div_10 = createElement( 'div' );
			row_26_yield_fragment.create();
			row_26._fragment.create();
			text_58 = createText( "\n\n  \n  " );
			div_11 = createElement( 'div' );
			row_27_yield_fragment.create();
			row_27._fragment.create();
			text_59 = createText( "\n\n\n    " );
			h2_5 = createElement( 'h2' );
			text_60 = createText( "List groups" );
			text_61 = createText( "\n    " );
			row_28_yield_fragment.create();
			row_28._fragment.create();
			text_62 = createText( "\n\n    " );
			h2_6 = createElement( 'h2' );
			text_63 = createText( "Cards" );
			text_64 = createText( "\n    " );
			row_29_yield_fragment.create();
			row_29._fragment.create();
			text_65 = createText( "\n\n    " );
			h2_7 = createElement( 'h2' );
			text_66 = createText( "Media" );
			text_67 = createText( "\n    " );
			row_30_yield_fragment.create();
			row_30._fragment.create();
			text_69 = createText( "\n\n  \n  " );
			div_12 = createElement( 'div' );
			h1_6 = createElement( 'h1' );
			text_70 = createText( "Dialogs" );
			text_71 = createText( "\n    " );
			row_31_yield_fragment.create();
			row_31._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = "mt-3";
			div_1.className = "mt-3";
			h1.id = "buttons";
			h1.className = "text-muted my-4";
			div_2.className = "mt-3";
			h1_1.id = "typography";
			h1_1.className = "text-muted my-4";
			h2.id = "type-blockquotes";
			h2.className = "text-muted my-3";
			div_3.className = "mt-3";
			h1_2.id = "tables";
			h1_2.className = "text-muted my-4";
			div_4.className = "mt-3";
			h1_3.id = "forms";
			h1_3.className = "text-muted my-4";
			div_5.className = "mt-3";
			h1_4.id = "navs";
			h1_4.className = "text-muted my-4";
			h2_1.id = "nav-fill";
			h2_1.className = "text-muted my-4";
			h2_2.id = "nav-fill";
			h2_2.className = "text-muted my-4";
			div_6.className = "mt-3";
			h1_5.id = "indicators";
			h1_5.className = "text-muted my-4";
			h2_3.className = "text-muted my-4";
			h2_4.className = "text-muted my-4";
			div_8.className = "mb-4";
			div_10.className = "mt-3";
			div_11.className = "mt-3";
			div_12.className = "mt-3";
			h1_6.id = "dialogs";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			row_16._fragment.mount( div, null );
			insertNode( text_1, target, anchor );
			insertNode( div_1, target, anchor );
			appendNode( h1, div_1 );
			appendNode( text_2, h1 );
			appendNode( text_3, div_1 );
			row_17._fragment.mount( div_1, null );
			appendNode( text_4, div_1 );
			row_18._fragment.mount( div_1, null );
			insertNode( text_6, target, anchor );
			insertNode( div_2, target, anchor );
			appendNode( h1_1, div_2 );
			appendNode( text_7, h1_1 );
			appendNode( text_8, div_2 );
			row_19._fragment.mount( div_2, null );
			appendNode( text_9, div_2 );
			appendNode( h2, div_2 );
			appendNode( text_10, h2 );
			appendNode( text_11, div_2 );
			row_20._fragment.mount( div_2, null );
			insertNode( text_13, target, anchor );
			insertNode( div_3, target, anchor );
			appendNode( h1_2, div_3 );
			appendNode( text_14, h1_2 );
			appendNode( text_15, div_3 );
			row_21._fragment.mount( div_3, null );
			insertNode( text_17, target, anchor );
			insertNode( div_4, target, anchor );
			appendNode( h1_3, div_4 );
			appendNode( text_18, h1_3 );
			appendNode( text_19, div_4 );
			row_22._fragment.mount( div_4, null );
			insertNode( text_21, target, anchor );
			insertNode( div_5, target, anchor );
			appendNode( h1_4, div_5 );
			appendNode( text_22, h1_4 );
			appendNode( text_23, div_5 );
			row_23._fragment.mount( div_5, null );
			appendNode( text_24, div_5 );
			appendNode( h2_1, div_5 );
			appendNode( text_25, h2_1 );
			appendNode( text_26, div_5 );
			nav_2._fragment.mount( div_5, null );
			appendNode( text_27, div_5 );
			appendNode( h2_2, div_5 );
			appendNode( text_28, h2_2 );
			appendNode( text_29, div_5 );
			nav_3._fragment.mount( div_5, null );
			appendNode( text_30, div_5 );
			row_24._fragment.mount( div_5, null );
			insertNode( text_32, target, anchor );
			insertNode( div_6, target, anchor );
			appendNode( h1_5, div_6 );
			appendNode( text_33, h1_5 );
			appendNode( text_34, div_6 );
			appendNode( h2_3, div_6 );
			appendNode( text_35, h2_3 );
			appendNode( text_36, div_6 );
			alert_1._fragment.mount( div_6, null );
			appendNode( text_37, div_6 );
			row_25._fragment.mount( div_6, null );
			appendNode( text_38, div_6 );
			appendNode( div_7, div_6 );
			appendNode( h2_4, div_7 );
			appendNode( text_39, h2_4 );
			appendNode( text_40, div_7 );
			appendNode( div_8, div_7 );
			badge_12._fragment.mount( div_8, null );
			appendNode( text_41, div_8 );
			badge_13._fragment.mount( div_8, null );
			appendNode( text_42, div_8 );
			badge_14._fragment.mount( div_8, null );
			appendNode( text_43, div_8 );
			badge_15._fragment.mount( div_8, null );
			appendNode( text_44, div_8 );
			badge_16._fragment.mount( div_8, null );
			appendNode( text_45, div_8 );
			badge_17._fragment.mount( div_8, null );
			appendNode( text_47, div_7 );
			appendNode( div_9, div_7 );
			badge_18._fragment.mount( div_9, null );
			appendNode( text_48, div_9 );
			badge_19._fragment.mount( div_9, null );
			appendNode( text_49, div_9 );
			badge_20._fragment.mount( div_9, null );
			appendNode( text_50, div_9 );
			badge_21._fragment.mount( div_9, null );
			appendNode( text_51, div_9 );
			badge_22._fragment.mount( div_9, null );
			appendNode( text_52, div_9 );
			badge_23._fragment.mount( div_9, null );
			insertNode( text_56, target, anchor );
			insertNode( div_10, target, anchor );
			row_26._fragment.mount( div_10, null );
			insertNode( text_58, target, anchor );
			insertNode( div_11, target, anchor );
			row_27._fragment.mount( div_11, null );
			appendNode( text_59, div_11 );
			appendNode( h2_5, div_11 );
			appendNode( text_60, h2_5 );
			appendNode( text_61, div_11 );
			row_28._fragment.mount( div_11, null );
			appendNode( text_62, div_11 );
			appendNode( h2_6, div_11 );
			appendNode( text_63, h2_6 );
			appendNode( text_64, div_11 );
			row_29._fragment.mount( div_11, null );
			appendNode( text_65, div_11 );
			appendNode( h2_7, div_11 );
			appendNode( text_66, h2_7 );
			appendNode( text_67, div_11 );
			row_30._fragment.mount( div_11, null );
			insertNode( text_69, target, anchor );
			insertNode( div_12, target, anchor );
			appendNode( h1_6, div_12 );
			appendNode( text_70, h1_6 );
			appendNode( text_71, div_12 );
			row_31._fragment.mount( div_12, null );
		},

		update: function ( changed, state ) {
			row_18_yield_fragment.update( changed, state );
		},

		unmount: function () {
			detachNode( div );
			detachNode( text_1 );
			detachNode( div_1 );
			detachNode( text_6 );
			detachNode( div_2 );
			detachNode( text_13 );
			detachNode( div_3 );
			detachNode( text_17 );
			detachNode( div_4 );
			detachNode( text_21 );
			detachNode( div_5 );
			detachNode( text_32 );
			detachNode( div_6 );
			detachNode( text_56 );
			detachNode( div_10 );
			detachNode( text_58 );
			detachNode( div_11 );
			detachNode( text_69 );
			detachNode( div_12 );
		},

		destroy: function () {
			row_16_yield_fragment.destroy();
			row_16.destroy( false );
			row_17_yield_fragment.destroy();
			row_17.destroy( false );
			row_18_yield_fragment.destroy();
			row_18.destroy( false );
			row_19_yield_fragment.destroy();
			row_19.destroy( false );
			row_20_yield_fragment.destroy();
			row_20.destroy( false );
			row_21_yield_fragment.destroy();
			row_21.destroy( false );
			row_22_yield_fragment.destroy();
			row_22.destroy( false );
			row_23_yield_fragment.destroy();
			row_23.destroy( false );
			nav_2_yield_fragment.destroy();
			nav_2.destroy( false );
			nav_3_yield_fragment.destroy();
			nav_3.destroy( false );
			row_24_yield_fragment.destroy();
			row_24.destroy( false );
			alert_1_yield_fragment.destroy();
			alert_1.destroy( false );
			row_25_yield_fragment.destroy();
			row_25.destroy( false );
			badge_12_yield_fragment.destroy();
			badge_12.destroy( false );
			badge_13_yield_fragment.destroy();
			badge_13.destroy( false );
			badge_14_yield_fragment.destroy();
			badge_14.destroy( false );
			badge_15_yield_fragment.destroy();
			badge_15.destroy( false );
			badge_16_yield_fragment.destroy();
			badge_16.destroy( false );
			badge_17_yield_fragment.destroy();
			badge_17.destroy( false );
			badge_18_yield_fragment.destroy();
			badge_18.destroy( false );
			badge_19_yield_fragment.destroy();
			badge_19.destroy( false );
			badge_20_yield_fragment.destroy();
			badge_20.destroy( false );
			badge_21_yield_fragment.destroy();
			badge_21.destroy( false );
			badge_22_yield_fragment.destroy();
			badge_22.destroy( false );
			badge_23_yield_fragment.destroy();
			badge_23.destroy( false );
			row_26_yield_fragment.destroy();
			row_26.destroy( false );
			row_27_yield_fragment.destroy();
			row_27.destroy( false );
			row_28_yield_fragment.destroy();
			row_28.destroy( false );
			row_29_yield_fragment.destroy();
			row_29.destroy( false );
			row_30_yield_fragment.destroy();
			row_30.destroy( false );
			row_31_yield_fragment.destroy();
			row_31.destroy( false );
		}
	};
}

function create_row_yield_fragment_1 ( state, component ) {

	var col_1_yield_fragment = create_col_yield_fragment_1( state, component );

	var col_1 = new Col({
		_root: component._root,
		_yield: col_1_yield_fragment,
		data: { lg: 12 }
	});

	return {
		create: function () {
			col_1_yield_fragment.create();
			col_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_1._fragment.unmount();
		},

		destroy: function () {
			col_1_yield_fragment.destroy();
			col_1.destroy( false );
		}
	};
}

function create_col_yield_fragment_1 ( state, component ) {
	var h1, text, text_1, div, nav, button, span, text_3, a, text_4, text_5, div_1, ul, text_6, text_10, div_2, nav_1, button_1, span_1, text_12, text_13, div_3, ul_1, text_14;

	var navitem_8_yield_fragment = create_navitem_yield_fragment_1( state, component );

	var navitem_8 = new NavItem({
		_root: component._root,
		_yield: navitem_8_yield_fragment,
		data: { active: true }
	});

	var navitem_9_yield_fragment = create_navitem_1_yield_fragment( state, component );

	var navitem_9 = new NavItem({
		_root: component._root,
		_yield: navitem_9_yield_fragment
	});

	var navitem_10_yield_fragment = create_navitem_2_yield_fragment( state, component );

	var navitem_10 = new NavItem({
		_root: component._root,
		_yield: navitem_10_yield_fragment
	});

	var navitem_11_yield_fragment = create_navitem_3_yield_fragment( state, component );

	var navitem_11 = new NavItem({
		_root: component._root,
		_yield: navitem_11_yield_fragment
	});

	var form_2_yield_fragment = create_form_yield_fragment( state, component );

	var form_2 = new Form({
		_root: component._root,
		_yield: form_2_yield_fragment,
		data: { inline: true }
	});

	var navbarbrand_1_yield_fragment = create_navbarbrand_yield_fragment_1( state, component );

	var navbarbrand_1 = new NavbarBrand({
		_root: component._root,
		_yield: navbarbrand_1_yield_fragment
	});

	var navitem_12_yield_fragment = create_navitem_4_yield_fragment( state, component );

	var navitem_12 = new NavItem({
		_root: component._root,
		_yield: navitem_12_yield_fragment,
		data: { active: true }
	});

	var navitem_13_yield_fragment = create_navitem_5_yield_fragment( state, component );

	var navitem_13 = new NavItem({
		_root: component._root,
		_yield: navitem_13_yield_fragment
	});

	var navitem_14_yield_fragment = create_navitem_6_yield_fragment( state, component );

	var navitem_14 = new NavItem({
		_root: component._root,
		_yield: navitem_14_yield_fragment
	});

	var navitem_15_yield_fragment = create_navitem_7_yield_fragment( state, component );

	var navitem_15 = new NavItem({
		_root: component._root,
		_yield: navitem_15_yield_fragment
	});

	var form_3_yield_fragment = create_form_1_yield_fragment( state, component );

	var form_3 = new Form({
		_root: component._root,
		_yield: form_3_yield_fragment,
		data: { inline: true }
	});

	return {
		create: function () {
			h1 = createElement( 'h1' );
			text = createText( "Navbars" );
			text_1 = createText( "\n\n        " );
			div = createElement( 'div' );
			nav = createElement( 'nav' );
			button = createElement( 'button' );
			span = createElement( 'span' );
			text_3 = createText( "\n            " );
			a = createElement( 'a' );
			text_4 = createText( "Navbar" );
			text_5 = createText( "\n\n            " );
			div_1 = createElement( 'div' );
			ul = createElement( 'ul' );
			navitem_8_yield_fragment.create();
			navitem_8._fragment.create();
			navitem_9_yield_fragment.create();
			navitem_9._fragment.create();
			navitem_10_yield_fragment.create();
			navitem_10._fragment.create();
			navitem_11_yield_fragment.create();
			navitem_11._fragment.create();
			text_6 = createText( "\n              " );
			form_2_yield_fragment.create();
			form_2._fragment.create();
			text_10 = createText( "\n\n        " );
			div_2 = createElement( 'div' );
			nav_1 = createElement( 'nav' );
			button_1 = createElement( 'button' );
			span_1 = createElement( 'span' );
			text_12 = createText( "\n            " );
			navbarbrand_1_yield_fragment.create();
			navbarbrand_1._fragment.create();
			text_13 = createText( "\n\n            " );
			div_3 = createElement( 'div' );
			ul_1 = createElement( 'ul' );
			navitem_12_yield_fragment.create();
			navitem_12._fragment.create();
			navitem_13_yield_fragment.create();
			navitem_13._fragment.create();
			navitem_14_yield_fragment.create();
			navitem_14._fragment.create();
			navitem_15_yield_fragment.create();
			navitem_15._fragment.create();
			text_14 = createText( "\n              " );
			form_3_yield_fragment.create();
			form_3._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h1.id = "navbars";
			h1.className = "text-muted my-4";
			div.className = "bs-component";
			nav.className = "navbar navbar-toggleable-md navbar-inverse bg-primary";
			button.className = "navbar-toggler navbar-toggler-right";
			button.type = "button";
			setAttribute( button, 'data-toggle', "collapse" );
			setAttribute( button, 'data-target', "\#navbarColor01" );
			setAttribute( button, 'aria-controls', "navbarColor01" );
			setAttribute( button, 'aria-expanded', "false" );
			setAttribute( button, 'aria-label', "Toggle navigation" );
			span.className = "navbar-toggler-icon";
			a.className = "navbar-brand";
			a.href = "\#";
			div_1.className = "collapse navbar-collapse";
			div_1.id = "navbarColor01";
			ul.className = "navbar-nav mr-auto";
			div_2.className = "bs-component";
			nav_1.className = "navbar navbar-toggleable-md navbar-light bg-inverse";
			button_1.className = "navbar-toggler navbar-toggler-right";
			button_1.type = "button";
			setAttribute( button_1, 'data-toggle', "collapse" );
			setAttribute( button_1, 'data-target', "\#navbarColor01" );
			setAttribute( button_1, 'aria-controls', "navbarColor01" );
			setAttribute( button_1, 'aria-expanded', "false" );
			setAttribute( button_1, 'aria-label', "Toggle navigation" );
			span_1.className = "navbar-toggler-icon";
			div_3.className = "collapse navbar-collapse";
			div_3.id = "navbarColor01";
			ul_1.className = "navbar-nav mr-auto";
		},

		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			appendNode( text, h1 );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
			appendNode( nav, div );
			appendNode( button, nav );
			appendNode( span, button );
			appendNode( text_3, nav );
			appendNode( a, nav );
			appendNode( text_4, a );
			appendNode( text_5, nav );
			appendNode( div_1, nav );
			appendNode( ul, div_1 );
			navitem_8._fragment.mount( ul, null );
			navitem_9._fragment.mount( ul, null );
			navitem_10._fragment.mount( ul, null );
			navitem_11._fragment.mount( ul, null );
			appendNode( text_6, div_1 );
			form_2._fragment.mount( div_1, null );
			insertNode( text_10, target, anchor );
			insertNode( div_2, target, anchor );
			appendNode( nav_1, div_2 );
			appendNode( button_1, nav_1 );
			appendNode( span_1, button_1 );
			appendNode( text_12, nav_1 );
			navbarbrand_1._fragment.mount( nav_1, null );
			appendNode( text_13, nav_1 );
			appendNode( div_3, nav_1 );
			appendNode( ul_1, div_3 );
			navitem_12._fragment.mount( ul_1, null );
			navitem_13._fragment.mount( ul_1, null );
			navitem_14._fragment.mount( ul_1, null );
			navitem_15._fragment.mount( ul_1, null );
			appendNode( text_14, div_3 );
			form_3._fragment.mount( div_3, null );
		},

		unmount: function () {
			detachNode( h1 );
			detachNode( text_1 );
			detachNode( div );
			detachNode( text_10 );
			detachNode( div_2 );
		},

		destroy: function () {
			navitem_8_yield_fragment.destroy();
			navitem_8.destroy( false );
			navitem_9_yield_fragment.destroy();
			navitem_9.destroy( false );
			navitem_10_yield_fragment.destroy();
			navitem_10.destroy( false );
			navitem_11_yield_fragment.destroy();
			navitem_11.destroy( false );
			form_2_yield_fragment.destroy();
			form_2.destroy( false );
			navbarbrand_1_yield_fragment.destroy();
			navbarbrand_1.destroy( false );
			navitem_12_yield_fragment.destroy();
			navitem_12.destroy( false );
			navitem_13_yield_fragment.destroy();
			navitem_13.destroy( false );
			navitem_14_yield_fragment.destroy();
			navitem_14.destroy( false );
			navitem_15_yield_fragment.destroy();
			navitem_15.destroy( false );
			form_3_yield_fragment.destroy();
			form_3.destroy( false );
		}
	};
}

function create_navitem_yield_fragment_1 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_1( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_1 ( state, component ) {
	var text, span, text_1;

	return {
		create: function () {
			text = createText( "Home " );
			span = createElement( 'span' );
			text_1 = createText( "(current)" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			span.className = "sr-only";
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			insertNode( span, target, anchor );
			appendNode( text_1, span );
		},

		unmount: function () {
			detachNode( text );
			detachNode( span );
		},

		destroy: noop
	};
}

function create_navitem_1_yield_fragment ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_2( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Features" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_2_yield_fragment ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_3( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_3 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Pricing" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_3_yield_fragment ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_4( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_4 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "About" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_form_yield_fragment ( state, component ) {
	var input, text;

	var button_1_yield_fragment = create_button_yield_fragment( state, component );

	var button_1 = new Button({
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: {
			outline: true,
			class: "my-2 my-sm-0",
			type: "submit"
		}
	});

	return {
		create: function () {
			input = createElement( 'input' );
			text = createText( "\n                " );
			button_1_yield_fragment.create();
			button_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			input.className = "form-control mr-sm-2";
			input.type = "text";
			input.placeholder = "Search";
		},

		mount: function ( target, anchor ) {
			insertNode( input, target, anchor );
			insertNode( text, target, anchor );
			button_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( input );
			detachNode( text );
			button_1._fragment.unmount();
		},

		destroy: function () {
			button_1_yield_fragment.destroy();
			button_1.destroy( false );
		}
	};
}

function create_button_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Search" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navbarbrand_yield_fragment_1 ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Navbar" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_navitem_4_yield_fragment ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_5( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_5 ( state, component ) {
	var text, span, text_1;

	return {
		create: function () {
			text = createText( "Home " );
			span = createElement( 'span' );
			text_1 = createText( "(current)" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			span.className = "sr-only";
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			insertNode( span, target, anchor );
			appendNode( text_1, span );
		},

		unmount: function () {
			detachNode( text );
			detachNode( span );
		},

		destroy: noop
	};
}

function create_navitem_5_yield_fragment ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_6( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_6 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Features" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_6_yield_fragment ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_7( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_7 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Pricing" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_7_yield_fragment ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_8( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_8 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "About" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_form_1_yield_fragment ( state, component ) {
	var input, text;

	var button_1_yield_fragment = create_button_yield_fragment_1( state, component );

	var button_1 = new Button({
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: {
			outline: true,
			class: "my-2 my-sm-0",
			type: "submit"
		}
	});

	return {
		create: function () {
			input = createElement( 'input' );
			text = createText( "\n                " );
			button_1_yield_fragment.create();
			button_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			input.className = "form-control mr-sm-2";
			input.type = "text";
			input.placeholder = "Search";
		},

		mount: function ( target, anchor ) {
			insertNode( input, target, anchor );
			insertNode( text, target, anchor );
			button_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( input );
			detachNode( text );
			button_1._fragment.unmount();
		},

		destroy: function () {
			button_1_yield_fragment.destroy();
			button_1.destroy( false );
		}
	};
}

function create_button_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Search" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_row_1_yield_fragment ( state, component ) {
	var text;

	var col_2_yield_fragment = create_col_yield_fragment_2( state, component );

	var col_2 = new Col({
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 7 }
	});

	var col_3_yield_fragment = create_col_1_yield_fragment_1( state, component );

	var col_3 = new Col({
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 5 }
	});

	return {
		create: function () {
			col_2_yield_fragment.create();
			col_2._fragment.create();
			text = createText( "\n      " );
			col_3_yield_fragment.create();
			col_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_2._fragment.unmount();
			detachNode( text );
			col_3._fragment.unmount();
		},

		destroy: function () {
			col_2_yield_fragment.destroy();
			col_2.destroy( false );
			col_3_yield_fragment.destroy();
			col_3.destroy( false );
		}
	};
}

function create_col_yield_fragment_2 ( state, component ) {
	var p, text, text_1, text_2, text_3, text_4, text_5, text_7, p_1, text_8, text_9, text_10, text_11, text_12, text_13, text_15, p_2, text_16, text_17, text_18, text_19, text_20, text_22, div, text_23, text_24;

	var button_23_yield_fragment = create_button_yield_fragment_2( state, component );

	var button_23 = new Button({
		_root: component._root,
		_yield: button_23_yield_fragment,
		data: { color: "primary" }
	});

	var button_24_yield_fragment = create_button_1_yield_fragment( state, component );

	var button_24 = new Button({
		_root: component._root,
		_yield: button_24_yield_fragment,
		data: { color: "secondary" }
	});

	var button_25_yield_fragment = create_button_2_yield_fragment( state, component );

	var button_25 = new Button({
		_root: component._root,
		_yield: button_25_yield_fragment,
		data: { color: "success" }
	});

	var button_26_yield_fragment = create_button_3_yield_fragment( state, component );

	var button_26 = new Button({
		_root: component._root,
		_yield: button_26_yield_fragment,
		data: { color: "info" }
	});

	var button_27_yield_fragment = create_button_4_yield_fragment( state, component );

	var button_27 = new Button({
		_root: component._root,
		_yield: button_27_yield_fragment,
		data: { color: "warning" }
	});

	var button_28_yield_fragment = create_button_5_yield_fragment( state, component );

	var button_28 = new Button({
		_root: component._root,
		_yield: button_28_yield_fragment,
		data: { color: "danger" }
	});

	var button_29_yield_fragment = create_button_6_yield_fragment( state, component );

	var button_29 = new Button({
		_root: component._root,
		_yield: button_29_yield_fragment,
		data: { color: "link" }
	});

	var button_30_yield_fragment = create_button_7_yield_fragment( state, component );

	var button_30 = new Button({
		_root: component._root,
		_yield: button_30_yield_fragment,
		data: { color: "primary", disabled: true }
	});

	var button_31_yield_fragment = create_button_8_yield_fragment( state, component );

	var button_31 = new Button({
		_root: component._root,
		_yield: button_31_yield_fragment,
		data: { color: "secondary", disabled: true }
	});

	var button_32_yield_fragment = create_button_9_yield_fragment( state, component );

	var button_32 = new Button({
		_root: component._root,
		_yield: button_32_yield_fragment,
		data: { color: "success", disabled: true }
	});

	var button_33_yield_fragment = create_button_10_yield_fragment( state, component );

	var button_33 = new Button({
		_root: component._root,
		_yield: button_33_yield_fragment,
		data: { color: "info", disabled: true }
	});

	var button_34_yield_fragment = create_button_11_yield_fragment( state, component );

	var button_34 = new Button({
		_root: component._root,
		_yield: button_34_yield_fragment,
		data: { color: "warning", disabled: true }
	});

	var button_35_yield_fragment = create_button_12_yield_fragment( state, component );

	var button_35 = new Button({
		_root: component._root,
		_yield: button_35_yield_fragment,
		data: { color: "danger", disabled: true }
	});

	var button_36_yield_fragment = create_button_13_yield_fragment( state, component );

	var button_36 = new Button({
		_root: component._root,
		_yield: button_36_yield_fragment,
		data: { color: "link", disabled: true }
	});

	var button_37_yield_fragment = create_button_14_yield_fragment( state, component );

	var button_37 = new Button({
		_root: component._root,
		_yield: button_37_yield_fragment,
		data: { outline: true, color: "primary" }
	});

	var button_38_yield_fragment = create_button_15_yield_fragment( state, component );

	var button_38 = new Button({
		_root: component._root,
		_yield: button_38_yield_fragment,
		data: { outline: true, color: "secondary" }
	});

	var button_39_yield_fragment = create_button_16_yield_fragment( state, component );

	var button_39 = new Button({
		_root: component._root,
		_yield: button_39_yield_fragment,
		data: { outline: true, color: "success" }
	});

	var button_40_yield_fragment = create_button_17_yield_fragment( state, component );

	var button_40 = new Button({
		_root: component._root,
		_yield: button_40_yield_fragment,
		data: { outline: true, color: "info" }
	});

	var button_41_yield_fragment = create_button_18_yield_fragment( state, component );

	var button_41 = new Button({
		_root: component._root,
		_yield: button_41_yield_fragment,
		data: { outline: true, color: "warning" }
	});

	var button_42_yield_fragment = create_button_19_yield_fragment( state, component );

	var button_42 = new Button({
		_root: component._root,
		_yield: button_42_yield_fragment,
		data: { outline: true, color: "danger" }
	});

	var button_43_yield_fragment = create_button_20_yield_fragment( state, component );

	var button_43 = new Button({
		_root: component._root,
		_yield: button_43_yield_fragment,
		data: { color: "primary", size: "lg" }
	});

	var button_44_yield_fragment = create_button_21_yield_fragment( state, component );

	var button_44 = new Button({
		_root: component._root,
		_yield: button_44_yield_fragment,
		data: { color: "primary" }
	});

	var button_45_yield_fragment = create_button_22_yield_fragment( state, component );

	var button_45 = new Button({
		_root: component._root,
		_yield: button_45_yield_fragment,
		data: { color: "primary", size: "sm" }
	});

	return {
		create: function () {
			p = createElement( 'p' );
			button_23_yield_fragment.create();
			button_23._fragment.create();
			text = createText( "\n          " );
			button_24_yield_fragment.create();
			button_24._fragment.create();
			text_1 = createText( "\n          " );
			button_25_yield_fragment.create();
			button_25._fragment.create();
			text_2 = createText( "\n          " );
			button_26_yield_fragment.create();
			button_26._fragment.create();
			text_3 = createText( "\n          " );
			button_27_yield_fragment.create();
			button_27._fragment.create();
			text_4 = createText( "\n          " );
			button_28_yield_fragment.create();
			button_28._fragment.create();
			text_5 = createText( "\n          " );
			button_29_yield_fragment.create();
			button_29._fragment.create();
			text_7 = createText( "\n\n        " );
			p_1 = createElement( 'p' );
			button_30_yield_fragment.create();
			button_30._fragment.create();
			text_8 = createText( "\n          " );
			button_31_yield_fragment.create();
			button_31._fragment.create();
			text_9 = createText( "\n          " );
			button_32_yield_fragment.create();
			button_32._fragment.create();
			text_10 = createText( "\n          " );
			button_33_yield_fragment.create();
			button_33._fragment.create();
			text_11 = createText( "\n          " );
			button_34_yield_fragment.create();
			button_34._fragment.create();
			text_12 = createText( "\n          " );
			button_35_yield_fragment.create();
			button_35._fragment.create();
			text_13 = createText( "\n          " );
			button_36_yield_fragment.create();
			button_36._fragment.create();
			text_15 = createText( "\n\n        " );
			p_2 = createElement( 'p' );
			button_37_yield_fragment.create();
			button_37._fragment.create();
			text_16 = createText( "\n          " );
			button_38_yield_fragment.create();
			button_38._fragment.create();
			text_17 = createText( "\n          " );
			button_39_yield_fragment.create();
			button_39._fragment.create();
			text_18 = createText( "\n          " );
			button_40_yield_fragment.create();
			button_40._fragment.create();
			text_19 = createText( "\n          " );
			button_41_yield_fragment.create();
			button_41._fragment.create();
			text_20 = createText( "\n          " );
			button_42_yield_fragment.create();
			button_42._fragment.create();
			text_22 = createText( "\n\n        " );
			div = createElement( 'div' );
			button_43_yield_fragment.create();
			button_43._fragment.create();
			text_23 = createText( "\n          " );
			button_44_yield_fragment.create();
			button_44._fragment.create();
			text_24 = createText( "\n          " );
			button_45_yield_fragment.create();
			button_45._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			p.className = "bs-component";
			p_1.className = "bs-component";
			p_2.className = "bs-component";
			div.className = "bs-component";
		},

		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			button_23._fragment.mount( p, null );
			appendNode( text, p );
			button_24._fragment.mount( p, null );
			appendNode( text_1, p );
			button_25._fragment.mount( p, null );
			appendNode( text_2, p );
			button_26._fragment.mount( p, null );
			appendNode( text_3, p );
			button_27._fragment.mount( p, null );
			appendNode( text_4, p );
			button_28._fragment.mount( p, null );
			appendNode( text_5, p );
			button_29._fragment.mount( p, null );
			insertNode( text_7, target, anchor );
			insertNode( p_1, target, anchor );
			button_30._fragment.mount( p_1, null );
			appendNode( text_8, p_1 );
			button_31._fragment.mount( p_1, null );
			appendNode( text_9, p_1 );
			button_32._fragment.mount( p_1, null );
			appendNode( text_10, p_1 );
			button_33._fragment.mount( p_1, null );
			appendNode( text_11, p_1 );
			button_34._fragment.mount( p_1, null );
			appendNode( text_12, p_1 );
			button_35._fragment.mount( p_1, null );
			appendNode( text_13, p_1 );
			button_36._fragment.mount( p_1, null );
			insertNode( text_15, target, anchor );
			insertNode( p_2, target, anchor );
			button_37._fragment.mount( p_2, null );
			appendNode( text_16, p_2 );
			button_38._fragment.mount( p_2, null );
			appendNode( text_17, p_2 );
			button_39._fragment.mount( p_2, null );
			appendNode( text_18, p_2 );
			button_40._fragment.mount( p_2, null );
			appendNode( text_19, p_2 );
			button_41._fragment.mount( p_2, null );
			appendNode( text_20, p_2 );
			button_42._fragment.mount( p_2, null );
			insertNode( text_22, target, anchor );
			insertNode( div, target, anchor );
			button_43._fragment.mount( div, null );
			appendNode( text_23, div );
			button_44._fragment.mount( div, null );
			appendNode( text_24, div );
			button_45._fragment.mount( div, null );
		},

		unmount: function () {
			detachNode( p );
			detachNode( text_7 );
			detachNode( p_1 );
			detachNode( text_15 );
			detachNode( p_2 );
			detachNode( text_22 );
			detachNode( div );
		},

		destroy: function () {
			button_23_yield_fragment.destroy();
			button_23.destroy( false );
			button_24_yield_fragment.destroy();
			button_24.destroy( false );
			button_25_yield_fragment.destroy();
			button_25.destroy( false );
			button_26_yield_fragment.destroy();
			button_26.destroy( false );
			button_27_yield_fragment.destroy();
			button_27.destroy( false );
			button_28_yield_fragment.destroy();
			button_28.destroy( false );
			button_29_yield_fragment.destroy();
			button_29.destroy( false );
			button_30_yield_fragment.destroy();
			button_30.destroy( false );
			button_31_yield_fragment.destroy();
			button_31.destroy( false );
			button_32_yield_fragment.destroy();
			button_32.destroy( false );
			button_33_yield_fragment.destroy();
			button_33.destroy( false );
			button_34_yield_fragment.destroy();
			button_34.destroy( false );
			button_35_yield_fragment.destroy();
			button_35.destroy( false );
			button_36_yield_fragment.destroy();
			button_36.destroy( false );
			button_37_yield_fragment.destroy();
			button_37.destroy( false );
			button_38_yield_fragment.destroy();
			button_38.destroy( false );
			button_39_yield_fragment.destroy();
			button_39.destroy( false );
			button_40_yield_fragment.destroy();
			button_40.destroy( false );
			button_41_yield_fragment.destroy();
			button_41.destroy( false );
			button_42_yield_fragment.destroy();
			button_42.destroy( false );
			button_43_yield_fragment.destroy();
			button_43.destroy( false );
			button_44_yield_fragment.destroy();
			button_44.destroy( false );
			button_45_yield_fragment.destroy();
			button_45.destroy( false );
		}
	};
}

function create_button_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Primary" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_1_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Secondary" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_2_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Success" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_3_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Info" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_4_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Warning" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_5_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Danger" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_6_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Link" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_7_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Primary" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_8_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Secondary" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_9_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Success" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_10_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Info" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_11_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Warning" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_12_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Danger" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_13_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Link" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_14_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Primary" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_15_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Secondary" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_16_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Success" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_17_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Info" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_18_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Warning" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_19_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Danger" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_20_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Large button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_21_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Default button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_22_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Small button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_col_1_yield_fragment_1 ( state, component ) {
	var p, text_1, div, div_1, label, input, text_2, text_3, label_1, input_1, text_4, text_5, label_2, input_2, text_6, text_9, div_2, div_3, label_3, input_3, text_10, text_11, label_4, input_4, text_12, text_13, label_5, input_5, text_14, text_17, div_4, text_19, div_5, text_21, div_6;

	var button_1_yield_fragment = create_button_yield_fragment_3( state, component );

	var button_1 = new Button({
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: {
			color: "primary",
			size: "lg",
			block: true
		}
	});

	var buttongroup_2_yield_fragment = create_buttongroup_yield_fragment( state, component );

	var buttongroup_2 = new ButtonGroup({
		_root: component._root,
		_yield: buttongroup_2_yield_fragment,
		data: { vertical: true }
	});

	var buttongroup_3_yield_fragment = create_buttongroup_1_yield_fragment( state, component );

	var buttongroup_3 = new ButtonGroup({
		_root: component._root,
		_yield: buttongroup_3_yield_fragment
	});

	var buttontoolbar_1_yield_fragment = create_buttontoolbar_yield_fragment( state, component );

	var buttontoolbar_1 = new ButtonToolbar({
		_root: component._root,
		_yield: buttontoolbar_1_yield_fragment
	});

	return {
		create: function () {
			p = createElement( 'p' );
			button_1_yield_fragment.create();
			button_1._fragment.create();
			text_1 = createText( "\n\n        " );
			div = createElement( 'div' );
			div_1 = createElement( 'div' );
			label = createElement( 'label' );
			input = createElement( 'input' );
			text_2 = createText( " Checkbox 1" );
			text_3 = createText( "\n            " );
			label_1 = createElement( 'label' );
			input_1 = createElement( 'input' );
			text_4 = createText( " Checkbox 2" );
			text_5 = createText( "\n            " );
			label_2 = createElement( 'label' );
			input_2 = createElement( 'input' );
			text_6 = createText( " Checkbox 3" );
			text_9 = createText( "\n\n        " );
			div_2 = createElement( 'div' );
			div_3 = createElement( 'div' );
			label_3 = createElement( 'label' );
			input_3 = createElement( 'input' );
			text_10 = createText( " Radio 1" );
			text_11 = createText( "\n            " );
			label_4 = createElement( 'label' );
			input_4 = createElement( 'input' );
			text_12 = createText( " Radio 2" );
			text_13 = createText( "\n            " );
			label_5 = createElement( 'label' );
			input_5 = createElement( 'input' );
			text_14 = createText( " Radio 3" );
			text_17 = createText( "\n\n        " );
			div_4 = createElement( 'div' );
			buttongroup_2_yield_fragment.create();
			buttongroup_2._fragment.create();
			text_19 = createText( "\n\n        " );
			div_5 = createElement( 'div' );
			buttongroup_3_yield_fragment.create();
			buttongroup_3._fragment.create();
			text_21 = createText( "\n\n        " );
			div_6 = createElement( 'div' );
			buttontoolbar_1_yield_fragment.create();
			buttontoolbar_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			p.className = "bs-component";
			div.className = "bs-component mb-1";
			div_1.className = "btn-group";
			setAttribute( div_1, 'data-toggle', "buttons" );
			label.className = "btn btn-primary active";
			input.type = "checkbox";
			input.checked = '';
			label_1.className = "btn btn-primary";
			input_1.type = "checkbox";
			label_2.className = "btn btn-primary";
			input_2.type = "checkbox";
			div_2.className = "bs-component";
			div_2.style.cssText = "margin-bottom: 15px;";
			div_3.className = "btn-group";
			setAttribute( div_3, 'data-toggle', "buttons" );
			label_3.className = "btn btn-primary active";
			input_3.type = "radio";
			input_3.name = "options";
			input_3.id = "option1";
			input_3.checked = '';
			label_4.className = "btn btn-primary";
			input_4.type = "radio";
			input_4.name = "options";
			input_4.id = "option2";
			label_5.className = "btn btn-primary";
			input_5.type = "radio";
			input_5.name = "options";
			input_5.id = "option3";
			div_4.className = "bs-component";
			div_5.className = "bs-component";
			div_5.style.cssText = "margin-bottom: 15px;";
			div_6.className = "bs-component";
			div_6.style.cssText = "margin-bottom: 15px;";
		},

		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			button_1._fragment.mount( p, null );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
			appendNode( div_1, div );
			appendNode( label, div_1 );
			appendNode( input, label );
			appendNode( text_2, label );
			appendNode( text_3, div_1 );
			appendNode( label_1, div_1 );
			appendNode( input_1, label_1 );
			appendNode( text_4, label_1 );
			appendNode( text_5, div_1 );
			appendNode( label_2, div_1 );
			appendNode( input_2, label_2 );
			appendNode( text_6, label_2 );
			insertNode( text_9, target, anchor );
			insertNode( div_2, target, anchor );
			appendNode( div_3, div_2 );
			appendNode( label_3, div_3 );
			appendNode( input_3, label_3 );
			appendNode( text_10, label_3 );
			appendNode( text_11, div_3 );
			appendNode( label_4, div_3 );
			appendNode( input_4, label_4 );
			appendNode( text_12, label_4 );
			appendNode( text_13, div_3 );
			appendNode( label_5, div_3 );
			appendNode( input_5, label_5 );
			appendNode( text_14, label_5 );
			insertNode( text_17, target, anchor );
			insertNode( div_4, target, anchor );
			buttongroup_2._fragment.mount( div_4, null );
			insertNode( text_19, target, anchor );
			insertNode( div_5, target, anchor );
			buttongroup_3._fragment.mount( div_5, null );
			insertNode( text_21, target, anchor );
			insertNode( div_6, target, anchor );
			buttontoolbar_1._fragment.mount( div_6, null );
		},

		unmount: function () {
			detachNode( p );
			detachNode( text_1 );
			detachNode( div );
			detachNode( text_9 );
			detachNode( div_2 );
			detachNode( text_17 );
			detachNode( div_4 );
			detachNode( text_19 );
			detachNode( div_5 );
			detachNode( text_21 );
			detachNode( div_6 );
		},

		destroy: function () {
			button_1_yield_fragment.destroy();
			button_1.destroy( false );
			buttongroup_2_yield_fragment.destroy();
			buttongroup_2.destroy( false );
			buttongroup_3_yield_fragment.destroy();
			buttongroup_3.destroy( false );
			buttontoolbar_1_yield_fragment.destroy();
			buttontoolbar_1.destroy( false );
		}
	};
}

function create_button_yield_fragment_3 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Block level button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_buttongroup_yield_fragment ( state, component ) {
	var text, text_1, text_2, text_3, text_4;

	var button_6_yield_fragment = create_button_yield_fragment_4( state, component );

	var button_6 = new Button({
		_root: component._root,
		_yield: button_6_yield_fragment,
		data: { color: "primary" }
	});

	var button_7_yield_fragment = create_button_1_yield_fragment_1( state, component );

	var button_7 = new Button({
		_root: component._root,
		_yield: button_7_yield_fragment,
		data: { color: "primary" }
	});

	var button_8_yield_fragment = create_button_2_yield_fragment_1( state, component );

	var button_8 = new Button({
		_root: component._root,
		_yield: button_8_yield_fragment,
		data: { color: "primary" }
	});

	var button_9_yield_fragment = create_button_3_yield_fragment_1( state, component );

	var button_9 = new Button({
		_root: component._root,
		_yield: button_9_yield_fragment,
		data: { color: "primary" }
	});

	var button_10_yield_fragment = create_button_4_yield_fragment_1( state, component );

	var button_10 = new Button({
		_root: component._root,
		_yield: button_10_yield_fragment,
		data: { color: "primary" }
	});

	var button_11_yield_fragment = create_button_5_yield_fragment_1( state, component );

	var button_11 = new Button({
		_root: component._root,
		_yield: button_11_yield_fragment,
		data: { color: "primary" }
	});

	return {
		create: function () {
			button_6_yield_fragment.create();
			button_6._fragment.create();
			text = createText( "\n            " );
			button_7_yield_fragment.create();
			button_7._fragment.create();
			text_1 = createText( "\n            " );
			button_8_yield_fragment.create();
			button_8._fragment.create();
			text_2 = createText( "\n            " );
			button_9_yield_fragment.create();
			button_9._fragment.create();
			text_3 = createText( "\n            " );
			button_10_yield_fragment.create();
			button_10._fragment.create();
			text_4 = createText( "\n            " );
			button_11_yield_fragment.create();
			button_11._fragment.create();
		},

		mount: function ( target, anchor ) {
			button_6._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button_7._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			button_8._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			button_9._fragment.mount( target, anchor );
			insertNode( text_3, target, anchor );
			button_10._fragment.mount( target, anchor );
			insertNode( text_4, target, anchor );
			button_11._fragment.mount( target, anchor );
		},

		unmount: function () {
			button_6._fragment.unmount();
			detachNode( text );
			button_7._fragment.unmount();
			detachNode( text_1 );
			button_8._fragment.unmount();
			detachNode( text_2 );
			button_9._fragment.unmount();
			detachNode( text_3 );
			button_10._fragment.unmount();
			detachNode( text_4 );
			button_11._fragment.unmount();
		},

		destroy: function () {
			button_6_yield_fragment.destroy();
			button_6.destroy( false );
			button_7_yield_fragment.destroy();
			button_7.destroy( false );
			button_8_yield_fragment.destroy();
			button_8.destroy( false );
			button_9_yield_fragment.destroy();
			button_9.destroy( false );
			button_10_yield_fragment.destroy();
			button_10.destroy( false );
			button_11_yield_fragment.destroy();
			button_11.destroy( false );
		}
	};
}

function create_button_yield_fragment_4 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_1_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_2_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_3_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_4_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_5_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Button" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_buttongroup_1_yield_fragment ( state, component ) {
	var text, text_1;

	var button_3_yield_fragment = create_button_yield_fragment_5( state, component );

	var button_3 = new Button({
		_root: component._root,
		_yield: button_3_yield_fragment,
		data: { color: "secondary" }
	});

	var button_4_yield_fragment = create_button_1_yield_fragment_2( state, component );

	var button_4 = new Button({
		_root: component._root,
		_yield: button_4_yield_fragment,
		data: { color: "secondary" }
	});

	var button_5_yield_fragment = create_button_2_yield_fragment_2( state, component );

	var button_5 = new Button({
		_root: component._root,
		_yield: button_5_yield_fragment,
		data: { color: "secondary" }
	});

	return {
		create: function () {
			button_3_yield_fragment.create();
			button_3._fragment.create();
			text = createText( "\n            " );
			button_4_yield_fragment.create();
			button_4._fragment.create();
			text_1 = createText( "\n            " );
			button_5_yield_fragment.create();
			button_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			button_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			button_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			button_3._fragment.unmount();
			detachNode( text );
			button_4._fragment.unmount();
			detachNode( text_1 );
			button_5._fragment.unmount();
		},

		destroy: function () {
			button_3_yield_fragment.destroy();
			button_3.destroy( false );
			button_4_yield_fragment.destroy();
			button_4.destroy( false );
			button_5_yield_fragment.destroy();
			button_5.destroy( false );
		}
	};
}

function create_button_yield_fragment_5 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Left" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_1_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Middle" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_2_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Right" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_buttontoolbar_yield_fragment ( state, component ) {
	var text, text_1;

	var buttongroup_3_yield_fragment = create_buttongroup_yield_fragment_1( state, component );

	var buttongroup_3 = new ButtonGroup({
		_root: component._root,
		_yield: buttongroup_3_yield_fragment
	});

	var buttongroup_4_yield_fragment = create_buttongroup_1_yield_fragment_1( state, component );

	var buttongroup_4 = new ButtonGroup({
		_root: component._root,
		_yield: buttongroup_4_yield_fragment
	});

	var buttongroup_5_yield_fragment = create_buttongroup_2_yield_fragment( state, component );

	var buttongroup_5 = new ButtonGroup({
		_root: component._root,
		_yield: buttongroup_5_yield_fragment
	});

	return {
		create: function () {
			buttongroup_3_yield_fragment.create();
			buttongroup_3._fragment.create();
			text = createText( "\n            " );
			buttongroup_4_yield_fragment.create();
			buttongroup_4._fragment.create();
			text_1 = createText( "\n            " );
			buttongroup_5_yield_fragment.create();
			buttongroup_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			buttongroup_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			buttongroup_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			buttongroup_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			buttongroup_3._fragment.unmount();
			detachNode( text );
			buttongroup_4._fragment.unmount();
			detachNode( text_1 );
			buttongroup_5._fragment.unmount();
		},

		destroy: function () {
			buttongroup_3_yield_fragment.destroy();
			buttongroup_3.destroy( false );
			buttongroup_4_yield_fragment.destroy();
			buttongroup_4.destroy( false );
			buttongroup_5_yield_fragment.destroy();
			buttongroup_5.destroy( false );
		}
	};
}

function create_buttongroup_yield_fragment_1 ( state, component ) {
	var text, text_1, text_2;

	var button_4_yield_fragment = create_button_yield_fragment_6( state, component );

	var button_4 = new Button({
		_root: component._root,
		_yield: button_4_yield_fragment,
		data: { color: "secondary" }
	});

	var button_5_yield_fragment = create_button_1_yield_fragment_3( state, component );

	var button_5 = new Button({
		_root: component._root,
		_yield: button_5_yield_fragment,
		data: { color: "secondary" }
	});

	var button_6_yield_fragment = create_button_2_yield_fragment_3( state, component );

	var button_6 = new Button({
		_root: component._root,
		_yield: button_6_yield_fragment,
		data: { color: "secondary" }
	});

	var button_7_yield_fragment = create_button_3_yield_fragment_2( state, component );

	var button_7 = new Button({
		_root: component._root,
		_yield: button_7_yield_fragment,
		data: { color: "secondary" }
	});

	return {
		create: function () {
			button_4_yield_fragment.create();
			button_4._fragment.create();
			text = createText( "\n              " );
			button_5_yield_fragment.create();
			button_5._fragment.create();
			text_1 = createText( "\n              " );
			button_6_yield_fragment.create();
			button_6._fragment.create();
			text_2 = createText( "\n              " );
			button_7_yield_fragment.create();
			button_7._fragment.create();
		},

		mount: function ( target, anchor ) {
			button_4._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button_5._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			button_6._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			button_7._fragment.mount( target, anchor );
		},

		unmount: function () {
			button_4._fragment.unmount();
			detachNode( text );
			button_5._fragment.unmount();
			detachNode( text_1 );
			button_6._fragment.unmount();
			detachNode( text_2 );
			button_7._fragment.unmount();
		},

		destroy: function () {
			button_4_yield_fragment.destroy();
			button_4.destroy( false );
			button_5_yield_fragment.destroy();
			button_5.destroy( false );
			button_6_yield_fragment.destroy();
			button_6.destroy( false );
			button_7_yield_fragment.destroy();
			button_7.destroy( false );
		}
	};
}

function create_button_yield_fragment_6 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "1" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_1_yield_fragment_3 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "2" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_2_yield_fragment_3 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "3" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_3_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "4" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_buttongroup_1_yield_fragment_1 ( state, component ) {
	var text, text_1;

	var button_3_yield_fragment = create_button_yield_fragment_7( state, component );

	var button_3 = new Button({
		_root: component._root,
		_yield: button_3_yield_fragment,
		data: { color: "secondary" }
	});

	var button_4_yield_fragment = create_button_1_yield_fragment_4( state, component );

	var button_4 = new Button({
		_root: component._root,
		_yield: button_4_yield_fragment,
		data: { color: "secondary" }
	});

	var button_5_yield_fragment = create_button_2_yield_fragment_4( state, component );

	var button_5 = new Button({
		_root: component._root,
		_yield: button_5_yield_fragment,
		data: { color: "secondary" }
	});

	return {
		create: function () {
			button_3_yield_fragment.create();
			button_3._fragment.create();
			text = createText( "\n              " );
			button_4_yield_fragment.create();
			button_4._fragment.create();
			text_1 = createText( "\n              " );
			button_5_yield_fragment.create();
			button_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			button_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			button_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			button_3._fragment.unmount();
			detachNode( text );
			button_4._fragment.unmount();
			detachNode( text_1 );
			button_5._fragment.unmount();
		},

		destroy: function () {
			button_3_yield_fragment.destroy();
			button_3.destroy( false );
			button_4_yield_fragment.destroy();
			button_4.destroy( false );
			button_5_yield_fragment.destroy();
			button_5.destroy( false );
		}
	};
}

function create_button_yield_fragment_7 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "5" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_1_yield_fragment_4 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "6" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_button_2_yield_fragment_4 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "7" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_buttongroup_2_yield_fragment ( state, component ) {

	var button_1_yield_fragment = create_button_yield_fragment_8( state, component );

	var button_1 = new Button({
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: { color: "secondary" }
	});

	return {
		create: function () {
			button_1_yield_fragment.create();
			button_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			button_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			button_1._fragment.unmount();
		},

		destroy: function () {
			button_1_yield_fragment.destroy();
			button_1.destroy( false );
		}
	};
}

function create_button_yield_fragment_8 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "8" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_row_2_yield_fragment ( state, component ) {
	var div, h2, text, text_1, h4, text_2, text_3, text_4, h4_1, text_5, text_6;

	var dropdown_2_yield_fragment = create_dropdown_yield_fragment( state, component );

	var dropdown_2 = new Dropdown({
		_root: component._root,
		_yield: dropdown_2_yield_fragment,
		data: { open: state.open }
	});

	var dropdown_3_yield_fragment = create_dropdown_1_yield_fragment( state, component );

	var dropdown_3 = new Dropdown({
		_root: component._root,
		_yield: dropdown_3_yield_fragment,
		data: { dropup: true, open: state.open2 }
	});

	return {
		create: function () {
			div = createElement( 'div' );
			h2 = createElement( 'h2' );
			text = createText( "Dropdowns" );
			text_1 = createText( "\n        " );
			h4 = createElement( 'h4' );
			text_2 = createText( "Dropdown" );
			text_3 = createText( "\n\n        " );
			dropdown_2_yield_fragment.create();
			dropdown_2._fragment.create();
			text_4 = createText( "\n\n        " );
			h4_1 = createElement( 'h4' );
			text_5 = createText( "Dropup" );
			text_6 = createText( "\n\n        " );
			dropdown_3_yield_fragment.create();
			dropdown_3._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h2.className = "text-muted my-4";
			h4.className = "text-muted";
			h4_1.className = "text-muted";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( h2, div );
			appendNode( text, h2 );
			appendNode( text_1, div );
			appendNode( h4, div );
			appendNode( text_2, h4 );
			appendNode( text_3, div );
			dropdown_2._fragment.mount( div, null );
			appendNode( text_4, div );
			appendNode( h4_1, div );
			appendNode( text_5, h4_1 );
			appendNode( text_6, div );
			dropdown_3._fragment.mount( div, null );
		},

		update: function ( changed, state ) {
			var dropdown_2_changes = {};

			if ( 'open' in changed ) dropdown_2_changes.open = state.open;

			if ( Object.keys( dropdown_2_changes ).length ) dropdown_2.set( dropdown_2_changes );

			var dropdown_3_changes = {};

			if ( 'open2' in changed ) dropdown_3_changes.open = state.open2;

			if ( Object.keys( dropdown_3_changes ).length ) dropdown_3.set( dropdown_3_changes );
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			dropdown_2_yield_fragment.destroy();
			dropdown_2.destroy( false );
			dropdown_3_yield_fragment.destroy();
			dropdown_3.destroy( false );
		}
	};
}

function create_dropdown_yield_fragment ( state, component ) {
	var text;

	var button_1_yield_fragment = create_button_yield_fragment_9( state, component );

	var button_1 = new Button({
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: {
			class: "dropdown-toggle",
			color: "primary"
		}
	});

	button_1.on( 'click', function ( event ) {
		var state = this._context.state;

		component.set({ open: !state.open });
	});

	button_1._context = {
		state: state
	};

	var dropdownmenu_1_yield_fragment = create_dropdownmenu_yield_fragment( state, component );

	var dropdownmenu_1 = new DropdownMenu({
		_root: component._root,
		_yield: dropdownmenu_1_yield_fragment
	});

	return {
		create: function () {
			button_1_yield_fragment.create();
			button_1._fragment.create();
			text = createText( "\n          " );
			dropdownmenu_1_yield_fragment.create();
			dropdownmenu_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			button_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownmenu_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			button_1._fragment.unmount();
			detachNode( text );
			dropdownmenu_1._fragment.unmount();
		},

		destroy: function () {
			button_1_yield_fragment.destroy();
			button_1.destroy( false );
			dropdownmenu_1_yield_fragment.destroy();
			dropdownmenu_1.destroy( false );
		}
	};
}

function create_button_yield_fragment_9 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Dropdown" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_dropdownmenu_yield_fragment ( state, component ) {
	var text, text_1, text_2;

	var dropdownheader_1_yield_fragment = create_dropdownheader_yield_fragment( state, component );

	var dropdownheader_1 = new DropdownHeader({
		_root: component._root,
		_yield: dropdownheader_1_yield_fragment
	});

	var dropdownitem_2_yield_fragment = create_dropdownitem_yield_fragment( state, component );

	var dropdownitem_2 = new DropdownItem({
		_root: component._root,
		_yield: dropdownitem_2_yield_fragment
	});

	var dropdowndivider = new DropdownDivider({
		_root: component._root
	});

	var dropdownitem_3_yield_fragment = create_dropdownitem_1_yield_fragment( state, component );

	var dropdownitem_3 = new DropdownItem({
		_root: component._root,
		_yield: dropdownitem_3_yield_fragment
	});

	return {
		create: function () {
			dropdownheader_1_yield_fragment.create();
			dropdownheader_1._fragment.create();
			text = createText( "\n            " );
			dropdownitem_2_yield_fragment.create();
			dropdownitem_2._fragment.create();
			text_1 = createText( "\n            " );
			dropdowndivider._fragment.create();
			text_2 = createText( "\n            " );
			dropdownitem_3_yield_fragment.create();
			dropdownitem_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			dropdownheader_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownitem_2._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			dropdowndivider._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			dropdownitem_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			dropdownheader_1._fragment.unmount();
			detachNode( text );
			dropdownitem_2._fragment.unmount();
			detachNode( text_1 );
			dropdowndivider._fragment.unmount();
			detachNode( text_2 );
			dropdownitem_3._fragment.unmount();
		},

		destroy: function () {
			dropdownheader_1_yield_fragment.destroy();
			dropdownheader_1.destroy( false );
			dropdownitem_2_yield_fragment.destroy();
			dropdownitem_2.destroy( false );
			dropdowndivider.destroy( false );
			dropdownitem_3_yield_fragment.destroy();
			dropdownitem_3.destroy( false );
		}
	};
}

function create_dropdownheader_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Heading" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_dropdownitem_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Dropdown link" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_dropdownitem_1_yield_fragment ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Dropdown link" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_dropdown_1_yield_fragment ( state, component ) {
	var text;

	var button_1_yield_fragment = create_button_yield_fragment_10( state, component );

	var button_1 = new Button({
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: {
			class: "dropdown-toggle",
			color: "success"
		}
	});

	button_1.on( 'click', function ( event ) {
		var state = this._context.state;

		component.set({ open2: !state.open2 });
	});

	button_1._context = {
		state: state
	};

	var dropdownmenu_1_yield_fragment = create_dropdownmenu_yield_fragment_1( state, component );

	var dropdownmenu_1 = new DropdownMenu({
		_root: component._root,
		_yield: dropdownmenu_1_yield_fragment
	});

	return {
		create: function () {
			button_1_yield_fragment.create();
			button_1._fragment.create();
			text = createText( "\n          " );
			dropdownmenu_1_yield_fragment.create();
			dropdownmenu_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			button_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownmenu_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			button_1._fragment.unmount();
			detachNode( text );
			dropdownmenu_1._fragment.unmount();
		},

		destroy: function () {
			button_1_yield_fragment.destroy();
			button_1.destroy( false );
			dropdownmenu_1_yield_fragment.destroy();
			dropdownmenu_1.destroy( false );
		}
	};
}

function create_button_yield_fragment_10 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Dropup" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_dropdownmenu_yield_fragment_1 ( state, component ) {
	var text;

	var dropdownitem_2_yield_fragment = create_dropdownitem_yield_fragment_1( state, component );

	var dropdownitem_2 = new DropdownItem({
		_root: component._root,
		_yield: dropdownitem_2_yield_fragment
	});

	var dropdownitem_3_yield_fragment = create_dropdownitem_1_yield_fragment_1( state, component );

	var dropdownitem_3 = new DropdownItem({
		_root: component._root,
		_yield: dropdownitem_3_yield_fragment
	});

	return {
		create: function () {
			dropdownitem_2_yield_fragment.create();
			dropdownitem_2._fragment.create();
			text = createText( "\n            " );
			dropdownitem_3_yield_fragment.create();
			dropdownitem_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			dropdownitem_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownitem_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			dropdownitem_2._fragment.unmount();
			detachNode( text );
			dropdownitem_3._fragment.unmount();
		},

		destroy: function () {
			dropdownitem_2_yield_fragment.destroy();
			dropdownitem_2.destroy( false );
			dropdownitem_3_yield_fragment.destroy();
			dropdownitem_3.destroy( false );
		}
	};
}

function create_dropdownitem_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Dropdown link" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_dropdownitem_1_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Dropdown link" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_row_3_yield_fragment ( state, component ) {
	var div, div_1, h1, text, text_1, h2, text_2, text_3, h3, text_4, text_5, h4, text_6, text_7, h5, text_8, text_9, h6, text_10, text_11, h3_1, text_12, small, text_13, text_15, p, text_16, text_19, div_2, div_3, h2_1, text_20, text_21, p_1, text_22, a, text_23, text_24, text_25, p_2, small_1, text_26, text_27, p_3, text_28, strong, text_29, text_30, text_31, p_4, text_32, em, text_33, text_34, text_35, p_5, text_36, abbr, text_37, text_38, text_41, div_4, div_5, h2_2, text_42, text_43, p_6, text_44, text_45, p_7, text_46, text_47, p_8, text_48, text_49, p_9, text_50, text_51, p_10, text_52, text_53, p_11, text_54;

	return {
		create: function () {
			div = createElement( 'div' );
			div_1 = createElement( 'div' );
			h1 = createElement( 'h1' );
			text = createText( "Heading 1" );
			text_1 = createText( "\n          " );
			h2 = createElement( 'h2' );
			text_2 = createText( "Heading 2" );
			text_3 = createText( "\n          " );
			h3 = createElement( 'h3' );
			text_4 = createText( "Heading 3" );
			text_5 = createText( "\n          " );
			h4 = createElement( 'h4' );
			text_6 = createText( "Heading 4" );
			text_7 = createText( "\n          " );
			h5 = createElement( 'h5' );
			text_8 = createText( "Heading 5" );
			text_9 = createText( "\n          " );
			h6 = createElement( 'h6' );
			text_10 = createText( "Heading 6" );
			text_11 = createText( "\n          " );
			h3_1 = createElement( 'h3' );
			text_12 = createText( "Heading\n            " );
			small = createElement( 'small' );
			text_13 = createText( "with muted text" );
			text_15 = createText( "\n          " );
			p = createElement( 'p' );
			text_16 = createText( "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor." );
			text_19 = createText( "\n      " );
			div_2 = createElement( 'div' );
			div_3 = createElement( 'div' );
			h2_1 = createElement( 'h2' );
			text_20 = createText( "Example body text" );
			text_21 = createText( "\n          " );
			p_1 = createElement( 'p' );
			text_22 = createText( "Nullam quis risus eget " );
			a = createElement( 'a' );
			text_23 = createText( "urna mollis ornare" );
			text_24 = createText( " vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula." );
			text_25 = createText( "\n          " );
			p_2 = createElement( 'p' );
			small_1 = createElement( 'small' );
			text_26 = createText( "This line of text is meant to be treated as fine print." );
			text_27 = createText( "\n          " );
			p_3 = createElement( 'p' );
			text_28 = createText( "The following is " );
			strong = createElement( 'strong' );
			text_29 = createText( "rendered as bold text" );
			text_30 = createText( "." );
			text_31 = createText( "\n          " );
			p_4 = createElement( 'p' );
			text_32 = createText( "The following is " );
			em = createElement( 'em' );
			text_33 = createText( "rendered as italicized text" );
			text_34 = createText( "." );
			text_35 = createText( "\n          " );
			p_5 = createElement( 'p' );
			text_36 = createText( "An abbreviation of the word attribute is " );
			abbr = createElement( 'abbr' );
			text_37 = createText( "attr" );
			text_38 = createText( "." );
			text_41 = createText( "\n      " );
			div_4 = createElement( 'div' );
			div_5 = createElement( 'div' );
			h2_2 = createElement( 'h2' );
			text_42 = createText( "Emphasis classes" );
			text_43 = createText( "\n          " );
			p_6 = createElement( 'p' );
			text_44 = createText( "Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh." );
			text_45 = createText( "\n          " );
			p_7 = createElement( 'p' );
			text_46 = createText( "Nullam id dolor id nibh ultricies vehicula ut id elit." );
			text_47 = createText( "\n          " );
			p_8 = createElement( 'p' );
			text_48 = createText( "Etiam porta sem malesuada magna mollis euismod." );
			text_49 = createText( "\n          " );
			p_9 = createElement( 'p' );
			text_50 = createText( "Donec ullamcorper nulla non metus auctor fringilla." );
			text_51 = createText( "\n          " );
			p_10 = createElement( 'p' );
			text_52 = createText( "Duis mollis, est non commodo luctus, nisi erat porttitor ligula." );
			text_53 = createText( "\n          " );
			p_11 = createElement( 'p' );
			text_54 = createText( "Maecenas sed diam eget risus varius blandit sit amet non magna." );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = "col-lg-4";
			div_1.className = "bs-component";
			small.className = "text-muted";
			p.className = "lead";
			div_2.className = "col-lg-4";
			div_3.className = "bs-component";
			a.href = "\#";
			abbr.title = "attribute";
			div_4.className = "col-lg-4";
			div_5.className = "bs-component";
			p_6.className = "text-muted";
			p_7.className = "text-primary";
			p_8.className = "text-warning";
			p_9.className = "text-danger";
			p_10.className = "text-success";
			p_11.className = "text-info";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( div_1, div );
			appendNode( h1, div_1 );
			appendNode( text, h1 );
			appendNode( text_1, div_1 );
			appendNode( h2, div_1 );
			appendNode( text_2, h2 );
			appendNode( text_3, div_1 );
			appendNode( h3, div_1 );
			appendNode( text_4, h3 );
			appendNode( text_5, div_1 );
			appendNode( h4, div_1 );
			appendNode( text_6, h4 );
			appendNode( text_7, div_1 );
			appendNode( h5, div_1 );
			appendNode( text_8, h5 );
			appendNode( text_9, div_1 );
			appendNode( h6, div_1 );
			appendNode( text_10, h6 );
			appendNode( text_11, div_1 );
			appendNode( h3_1, div_1 );
			appendNode( text_12, h3_1 );
			appendNode( small, h3_1 );
			appendNode( text_13, small );
			appendNode( text_15, div_1 );
			appendNode( p, div_1 );
			appendNode( text_16, p );
			insertNode( text_19, target, anchor );
			insertNode( div_2, target, anchor );
			appendNode( div_3, div_2 );
			appendNode( h2_1, div_3 );
			appendNode( text_20, h2_1 );
			appendNode( text_21, div_3 );
			appendNode( p_1, div_3 );
			appendNode( text_22, p_1 );
			appendNode( a, p_1 );
			appendNode( text_23, a );
			appendNode( text_24, p_1 );
			appendNode( text_25, div_3 );
			appendNode( p_2, div_3 );
			appendNode( small_1, p_2 );
			appendNode( text_26, small_1 );
			appendNode( text_27, div_3 );
			appendNode( p_3, div_3 );
			appendNode( text_28, p_3 );
			appendNode( strong, p_3 );
			appendNode( text_29, strong );
			appendNode( text_30, p_3 );
			appendNode( text_31, div_3 );
			appendNode( p_4, div_3 );
			appendNode( text_32, p_4 );
			appendNode( em, p_4 );
			appendNode( text_33, em );
			appendNode( text_34, p_4 );
			appendNode( text_35, div_3 );
			appendNode( p_5, div_3 );
			appendNode( text_36, p_5 );
			appendNode( abbr, p_5 );
			appendNode( text_37, abbr );
			appendNode( text_38, p_5 );
			insertNode( text_41, target, anchor );
			insertNode( div_4, target, anchor );
			appendNode( div_5, div_4 );
			appendNode( h2_2, div_5 );
			appendNode( text_42, h2_2 );
			appendNode( text_43, div_5 );
			appendNode( p_6, div_5 );
			appendNode( text_44, p_6 );
			appendNode( text_45, div_5 );
			appendNode( p_7, div_5 );
			appendNode( text_46, p_7 );
			appendNode( text_47, div_5 );
			appendNode( p_8, div_5 );
			appendNode( text_48, p_8 );
			appendNode( text_49, div_5 );
			appendNode( p_9, div_5 );
			appendNode( text_50, p_9 );
			appendNode( text_51, div_5 );
			appendNode( p_10, div_5 );
			appendNode( text_52, p_10 );
			appendNode( text_53, div_5 );
			appendNode( p_11, div_5 );
			appendNode( text_54, p_11 );
		},

		unmount: function () {
			detachNode( div );
			detachNode( text_19 );
			detachNode( div_2 );
			detachNode( text_41 );
			detachNode( div_4 );
		},

		destroy: noop
	};
}

function create_row_4_yield_fragment ( state, component ) {
	var text;

	var col_2_yield_fragment = create_col_yield_fragment_3( state, component );

	var col_2 = new Col({
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 6 }
	});

	var col_3_yield_fragment = create_col_1_yield_fragment_2( state, component );

	var col_3 = new Col({
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 6 }
	});

	return {
		create: function () {
			col_2_yield_fragment.create();
			col_2._fragment.create();
			text = createText( "\n      " );
			col_3_yield_fragment.create();
			col_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_2._fragment.unmount();
			detachNode( text );
			col_3._fragment.unmount();
		},

		destroy: function () {
			col_2_yield_fragment.destroy();
			col_2.destroy( false );
			col_3_yield_fragment.destroy();
			col_3.destroy( false );
		}
	};
}

function create_col_yield_fragment_3 ( state, component ) {
	var blockquote, p, text, text_1, footer, text_2, cite, text_3;

	return {
		create: function () {
			blockquote = createElement( 'blockquote' );
			p = createElement( 'p' );
			text = createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." );
			text_1 = createText( "\n          " );
			footer = createElement( 'footer' );
			text_2 = createText( "Someone famous in " );
			cite = createElement( 'cite' );
			text_3 = createText( "Source Title" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			blockquote.className = "blockquote";
			footer.className = "blockquote-footer";
			cite.title = "Source Title";
		},

		mount: function ( target, anchor ) {
			insertNode( blockquote, target, anchor );
			appendNode( p, blockquote );
			appendNode( text, p );
			appendNode( text_1, blockquote );
			appendNode( footer, blockquote );
			appendNode( text_2, footer );
			appendNode( cite, footer );
			appendNode( text_3, cite );
		},

		unmount: function () {
			detachNode( blockquote );
		},

		destroy: noop
	};
}

function create_col_1_yield_fragment_2 ( state, component ) {
	var blockquote, p, text, text_1, footer, text_2, cite, text_3;

	return {
		create: function () {
			blockquote = createElement( 'blockquote' );
			p = createElement( 'p' );
			text = createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." );
			text_1 = createText( "\n          " );
			footer = createElement( 'footer' );
			text_2 = createText( "Someone famous in " );
			cite = createElement( 'cite' );
			text_3 = createText( "Source Title" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			blockquote.className = "blockquote blockquote-reverse";
			footer.className = "blockquote-footer";
			cite.title = "Source Title";
		},

		mount: function ( target, anchor ) {
			insertNode( blockquote, target, anchor );
			appendNode( p, blockquote );
			appendNode( text, p );
			appendNode( text_1, blockquote );
			appendNode( footer, blockquote );
			appendNode( text_2, footer );
			appendNode( cite, footer );
			appendNode( text_3, cite );
		},

		unmount: function () {
			detachNode( blockquote );
		},

		destroy: noop
	};
}

function create_row_5_yield_fragment ( state, component ) {

	var col_1_yield_fragment = create_col_yield_fragment_4( state, component );

	var col_1 = new Col({
		_root: component._root,
		_yield: col_1_yield_fragment
	});

	return {
		create: function () {
			col_1_yield_fragment.create();
			col_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_1._fragment.unmount();
		},

		destroy: function () {
			col_1_yield_fragment.destroy();
			col_1.destroy( false );
		}
	};
}

function create_col_yield_fragment_4 ( state, component ) {

	var table_1_yield_fragment = create_table_yield_fragment( state, component );

	var table_1 = new Table({
		_root: component._root,
		_yield: table_1_yield_fragment,
		data: {
			striped: true,
			hover: true,
			bordered: true,
			responsive: true
		}
	});

	return {
		create: function () {
			table_1_yield_fragment.create();
			table_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			table_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			table_1._fragment.unmount();
		},

		destroy: function () {
			table_1_yield_fragment.destroy();
			table_1.destroy( false );
		}
	};
}

function create_table_yield_fragment ( state, component ) {
	var thead, tr, th, text, text_1, th_1, text_2, text_3, th_2, text_4, text_5, th_3, text_6, text_9, tbody, tr_1, td, text_10, text_11, td_1, text_12, text_13, td_2, text_14, text_15, td_3, text_16, text_18, tr_2, td_4, text_19, text_20, td_5, text_21, text_22, td_6, text_23, text_24, td_7, text_25, text_27, tr_3, td_8, text_28, text_29, td_9, text_30, text_31, td_10, text_32, text_33, td_11, text_34, text_36, tr_4, td_12, text_37, text_38, td_13, text_39, text_40, td_14, text_41, text_42, td_15, text_43, text_45, tr_5, td_16, text_46, text_47, td_17, text_48, text_49, td_18, text_50, text_51, td_19, text_52, text_54, tr_6, td_20, text_55, text_56, td_21, text_57, text_58, td_22, text_59, text_60, td_23, text_61, text_63, tr_7, td_24, text_64, text_65, td_25, text_66, text_67, td_26, text_68, text_69, td_27, text_70;

	return {
		create: function () {
			thead = createElement( 'thead' );
			tr = createElement( 'tr' );
			th = createElement( 'th' );
			text = createText( "\#" );
			text_1 = createText( "\n                " );
			th_1 = createElement( 'th' );
			text_2 = createText( "Column heading" );
			text_3 = createText( "\n                " );
			th_2 = createElement( 'th' );
			text_4 = createText( "Column heading" );
			text_5 = createText( "\n                " );
			th_3 = createElement( 'th' );
			text_6 = createText( "Column heading" );
			text_9 = createText( "\n            " );
			tbody = createElement( 'tbody' );
			tr_1 = createElement( 'tr' );
			td = createElement( 'td' );
			text_10 = createText( "1" );
			text_11 = createText( "\n                " );
			td_1 = createElement( 'td' );
			text_12 = createText( "Column content" );
			text_13 = createText( "\n                " );
			td_2 = createElement( 'td' );
			text_14 = createText( "Column content" );
			text_15 = createText( "\n                " );
			td_3 = createElement( 'td' );
			text_16 = createText( "Column content" );
			text_18 = createText( "\n              " );
			tr_2 = createElement( 'tr' );
			td_4 = createElement( 'td' );
			text_19 = createText( "2" );
			text_20 = createText( "\n                " );
			td_5 = createElement( 'td' );
			text_21 = createText( "Column content" );
			text_22 = createText( "\n                " );
			td_6 = createElement( 'td' );
			text_23 = createText( "Column content" );
			text_24 = createText( "\n                " );
			td_7 = createElement( 'td' );
			text_25 = createText( "Column content" );
			text_27 = createText( "\n              " );
			tr_3 = createElement( 'tr' );
			td_8 = createElement( 'td' );
			text_28 = createText( "3" );
			text_29 = createText( "\n                " );
			td_9 = createElement( 'td' );
			text_30 = createText( "Column content" );
			text_31 = createText( "\n                " );
			td_10 = createElement( 'td' );
			text_32 = createText( "Column content" );
			text_33 = createText( "\n                " );
			td_11 = createElement( 'td' );
			text_34 = createText( "Column content" );
			text_36 = createText( "\n              " );
			tr_4 = createElement( 'tr' );
			td_12 = createElement( 'td' );
			text_37 = createText( "4" );
			text_38 = createText( "\n                " );
			td_13 = createElement( 'td' );
			text_39 = createText( "Column content" );
			text_40 = createText( "\n                " );
			td_14 = createElement( 'td' );
			text_41 = createText( "Column content" );
			text_42 = createText( "\n                " );
			td_15 = createElement( 'td' );
			text_43 = createText( "Column content" );
			text_45 = createText( "\n              " );
			tr_5 = createElement( 'tr' );
			td_16 = createElement( 'td' );
			text_46 = createText( "5" );
			text_47 = createText( "\n                " );
			td_17 = createElement( 'td' );
			text_48 = createText( "Column content" );
			text_49 = createText( "\n                " );
			td_18 = createElement( 'td' );
			text_50 = createText( "Column content" );
			text_51 = createText( "\n                " );
			td_19 = createElement( 'td' );
			text_52 = createText( "Column content" );
			text_54 = createText( "\n              " );
			tr_6 = createElement( 'tr' );
			td_20 = createElement( 'td' );
			text_55 = createText( "6" );
			text_56 = createText( "\n                " );
			td_21 = createElement( 'td' );
			text_57 = createText( "Column content" );
			text_58 = createText( "\n                " );
			td_22 = createElement( 'td' );
			text_59 = createText( "Column content" );
			text_60 = createText( "\n                " );
			td_23 = createElement( 'td' );
			text_61 = createText( "Column content" );
			text_63 = createText( "\n              " );
			tr_7 = createElement( 'tr' );
			td_24 = createElement( 'td' );
			text_64 = createText( "7" );
			text_65 = createText( "\n                " );
			td_25 = createElement( 'td' );
			text_66 = createText( "Column content" );
			text_67 = createText( "\n                " );
			td_26 = createElement( 'td' );
			text_68 = createText( "Column content" );
			text_69 = createText( "\n                " );
			td_27 = createElement( 'td' );
			text_70 = createText( "Column content" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			thead.className = "thead-inverse";
			tr_3.className = "table-info";
			tr_4.className = "table-success";
			tr_5.className = "table-danger";
			tr_6.className = "table-warning";
			tr_7.className = "table-active";
		},

		mount: function ( target, anchor ) {
			insertNode( thead, target, anchor );
			appendNode( tr, thead );
			appendNode( th, tr );
			appendNode( text, th );
			appendNode( text_1, tr );
			appendNode( th_1, tr );
			appendNode( text_2, th_1 );
			appendNode( text_3, tr );
			appendNode( th_2, tr );
			appendNode( text_4, th_2 );
			appendNode( text_5, tr );
			appendNode( th_3, tr );
			appendNode( text_6, th_3 );
			insertNode( text_9, target, anchor );
			insertNode( tbody, target, anchor );
			appendNode( tr_1, tbody );
			appendNode( td, tr_1 );
			appendNode( text_10, td );
			appendNode( text_11, tr_1 );
			appendNode( td_1, tr_1 );
			appendNode( text_12, td_1 );
			appendNode( text_13, tr_1 );
			appendNode( td_2, tr_1 );
			appendNode( text_14, td_2 );
			appendNode( text_15, tr_1 );
			appendNode( td_3, tr_1 );
			appendNode( text_16, td_3 );
			appendNode( text_18, tbody );
			appendNode( tr_2, tbody );
			appendNode( td_4, tr_2 );
			appendNode( text_19, td_4 );
			appendNode( text_20, tr_2 );
			appendNode( td_5, tr_2 );
			appendNode( text_21, td_5 );
			appendNode( text_22, tr_2 );
			appendNode( td_6, tr_2 );
			appendNode( text_23, td_6 );
			appendNode( text_24, tr_2 );
			appendNode( td_7, tr_2 );
			appendNode( text_25, td_7 );
			appendNode( text_27, tbody );
			appendNode( tr_3, tbody );
			appendNode( td_8, tr_3 );
			appendNode( text_28, td_8 );
			appendNode( text_29, tr_3 );
			appendNode( td_9, tr_3 );
			appendNode( text_30, td_9 );
			appendNode( text_31, tr_3 );
			appendNode( td_10, tr_3 );
			appendNode( text_32, td_10 );
			appendNode( text_33, tr_3 );
			appendNode( td_11, tr_3 );
			appendNode( text_34, td_11 );
			appendNode( text_36, tbody );
			appendNode( tr_4, tbody );
			appendNode( td_12, tr_4 );
			appendNode( text_37, td_12 );
			appendNode( text_38, tr_4 );
			appendNode( td_13, tr_4 );
			appendNode( text_39, td_13 );
			appendNode( text_40, tr_4 );
			appendNode( td_14, tr_4 );
			appendNode( text_41, td_14 );
			appendNode( text_42, tr_4 );
			appendNode( td_15, tr_4 );
			appendNode( text_43, td_15 );
			appendNode( text_45, tbody );
			appendNode( tr_5, tbody );
			appendNode( td_16, tr_5 );
			appendNode( text_46, td_16 );
			appendNode( text_47, tr_5 );
			appendNode( td_17, tr_5 );
			appendNode( text_48, td_17 );
			appendNode( text_49, tr_5 );
			appendNode( td_18, tr_5 );
			appendNode( text_50, td_18 );
			appendNode( text_51, tr_5 );
			appendNode( td_19, tr_5 );
			appendNode( text_52, td_19 );
			appendNode( text_54, tbody );
			appendNode( tr_6, tbody );
			appendNode( td_20, tr_6 );
			appendNode( text_55, td_20 );
			appendNode( text_56, tr_6 );
			appendNode( td_21, tr_6 );
			appendNode( text_57, td_21 );
			appendNode( text_58, tr_6 );
			appendNode( td_22, tr_6 );
			appendNode( text_59, td_22 );
			appendNode( text_60, tr_6 );
			appendNode( td_23, tr_6 );
			appendNode( text_61, td_23 );
			appendNode( text_63, tbody );
			appendNode( tr_7, tbody );
			appendNode( td_24, tr_7 );
			appendNode( text_64, td_24 );
			appendNode( text_65, tr_7 );
			appendNode( td_25, tr_7 );
			appendNode( text_66, td_25 );
			appendNode( text_67, tr_7 );
			appendNode( td_26, tr_7 );
			appendNode( text_68, td_26 );
			appendNode( text_69, tr_7 );
			appendNode( td_27, tr_7 );
			appendNode( text_70, td_27 );
		},

		unmount: function () {
			detachNode( thead );
			detachNode( text_9 );
			detachNode( tbody );
		},

		destroy: noop
	};
}

function create_row_6_yield_fragment ( state, component ) {
	var text;

	var col_2_yield_fragment = create_col_yield_fragment_5( state, component );

	var col_2 = new Col({
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 6 }
	});

	var col_3_yield_fragment = create_col_1_yield_fragment_3( state, component );

	var col_3 = new Col({
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: { size: 4, offset: 1 } }
	});

	return {
		create: function () {
			col_2_yield_fragment.create();
			col_2._fragment.create();
			text = createText( "\n\n      " );
			col_3_yield_fragment.create();
			col_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_2._fragment.unmount();
			detachNode( text );
			col_3._fragment.unmount();
		},

		destroy: function () {
			col_2_yield_fragment.destroy();
			col_2.destroy( false );
			col_3_yield_fragment.destroy();
			col_3.destroy( false );
		}
	};
}

function create_col_yield_fragment_5 ( state, component ) {

	var form_1_yield_fragment = create_form_yield_fragment_1( state, component );

	var form_1 = new Form({
		_root: component._root,
		_yield: form_1_yield_fragment
	});

	return {
		create: function () {
			form_1_yield_fragment.create();
			form_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			form_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			form_1._fragment.unmount();
		},

		destroy: function () {
			form_1_yield_fragment.destroy();
			form_1.destroy( false );
		}
	};
}

function create_form_yield_fragment_1 ( state, component ) {
	var fieldset, legend, text, text_1, div, label, text_2, text_3, input, text_4, small, text_5, text_7, div_1, label_1, text_8, text_9, input_1, text_11, div_2, label_2, text_12, text_13, select, option, text_14, option_1, text_15, option_2, text_16, option_3, text_17, option_4, text_18, text_20, div_3, label_3, text_21, text_22, select_1, option_5, text_23, option_6, text_24, option_7, text_25, option_8, text_26, option_9, text_27, text_29, div_4, label_4, text_30, text_31, textarea, text_33, div_5, label_5, text_34, text_35, input_2, text_36, small_1, text_37, text_39, fieldset_1, legend_1, text_40, text_41, div_6, label_6, input_3, text_42, text_44, div_7, label_7, input_4, text_45, text_47, div_8, label_8, input_5, text_48, text_51, div_9, label_9, input_6, text_52, text_54, button, text_55;

	return {
		create: function () {
			fieldset = createElement( 'fieldset' );
			legend = createElement( 'legend' );
			text = createText( "Legend" );
			text_1 = createText( "\n            " );
			div = createElement( 'div' );
			label = createElement( 'label' );
			text_2 = createText( "Email address" );
			text_3 = createText( "\n              " );
			input = createElement( 'input' );
			text_4 = createText( "\n              " );
			small = createElement( 'small' );
			text_5 = createText( "We'll never share your email with anyone else." );
			text_7 = createText( "\n            " );
			div_1 = createElement( 'div' );
			label_1 = createElement( 'label' );
			text_8 = createText( "Password" );
			text_9 = createText( "\n              " );
			input_1 = createElement( 'input' );
			text_11 = createText( "\n            " );
			div_2 = createElement( 'div' );
			label_2 = createElement( 'label' );
			text_12 = createText( "Example select" );
			text_13 = createText( "\n              " );
			select = createElement( 'select' );
			option = createElement( 'option' );
			text_14 = createText( "1" );
			option_1 = createElement( 'option' );
			text_15 = createText( "2" );
			option_2 = createElement( 'option' );
			text_16 = createText( "3" );
			option_3 = createElement( 'option' );
			text_17 = createText( "4" );
			option_4 = createElement( 'option' );
			text_18 = createText( "5" );
			text_20 = createText( "\n            " );
			div_3 = createElement( 'div' );
			label_3 = createElement( 'label' );
			text_21 = createText( "Example multiple select" );
			text_22 = createText( "\n              " );
			select_1 = createElement( 'select' );
			option_5 = createElement( 'option' );
			text_23 = createText( "1" );
			option_6 = createElement( 'option' );
			text_24 = createText( "2" );
			option_7 = createElement( 'option' );
			text_25 = createText( "3" );
			option_8 = createElement( 'option' );
			text_26 = createText( "4" );
			option_9 = createElement( 'option' );
			text_27 = createText( "5" );
			text_29 = createText( "\n            " );
			div_4 = createElement( 'div' );
			label_4 = createElement( 'label' );
			text_30 = createText( "Example textarea" );
			text_31 = createText( "\n              " );
			textarea = createElement( 'textarea' );
			text_33 = createText( "\n            " );
			div_5 = createElement( 'div' );
			label_5 = createElement( 'label' );
			text_34 = createText( "File input" );
			text_35 = createText( "\n              " );
			input_2 = createElement( 'input' );
			text_36 = createText( "\n              " );
			small_1 = createElement( 'small' );
			text_37 = createText( "This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line." );
			text_39 = createText( "\n            " );
			fieldset_1 = createElement( 'fieldset' );
			legend_1 = createElement( 'legend' );
			text_40 = createText( "Radio buttons" );
			text_41 = createText( "\n              " );
			div_6 = createElement( 'div' );
			label_6 = createElement( 'label' );
			input_3 = createElement( 'input' );
			text_42 = createText( "\n                      Option one is this and that—be sure to include why it's great" );
			text_44 = createText( "\n              " );
			div_7 = createElement( 'div' );
			label_7 = createElement( 'label' );
			input_4 = createElement( 'input' );
			text_45 = createText( "\n                      Option two can be something else and selecting it will deselect option one" );
			text_47 = createText( "\n              " );
			div_8 = createElement( 'div' );
			label_8 = createElement( 'label' );
			input_5 = createElement( 'input' );
			text_48 = createText( "\n                      Option three is disabled" );
			text_51 = createText( "\n            " );
			div_9 = createElement( 'div' );
			label_9 = createElement( 'label' );
			input_6 = createElement( 'input' );
			text_52 = createText( "\n                    Check me out" );
			text_54 = createText( "\n            " );
			button = createElement( 'button' );
			text_55 = createText( "Submit" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = "form-group";
			label.htmlFor = "exampleInputEmail1";
			input.type = "email";
			input.className = "form-control";
			input.id = "exampleInputEmail1";
			setAttribute( input, 'aria-describedby', "emailHelp" );
			input.placeholder = "Enter email";
			small.id = "emailHelp";
			small.className = "form-text text-muted";
			div_1.className = "form-group";
			label_1.htmlFor = "exampleInputPassword1";
			input_1.type = "password";
			input_1.className = "form-control";
			input_1.id = "exampleInputPassword1";
			input_1.placeholder = "Password";
			div_2.className = "form-group";
			label_2.htmlFor = "exampleSelect1";
			select.className = "form-control";
			select.id = "exampleSelect1";
			div_3.className = "form-group";
			label_3.htmlFor = "exampleSelect2";
			select_1.multiple = '';
			select_1.className = "form-control";
			select_1.id = "exampleSelect2";
			div_4.className = "form-group";
			label_4.htmlFor = "exampleTextarea";
			textarea.className = "form-control";
			textarea.id = "exampleTextarea";
			textarea.rows = "3";
			div_5.className = "form-group";
			label_5.htmlFor = "exampleInputFile";
			input_2.type = "file";
			input_2.className = "form-control-file";
			input_2.id = "exampleInputFile";
			setAttribute( input_2, 'aria-describedby', "fileHelp" );
			small_1.id = "fileHelp";
			small_1.className = "form-text text-muted";
			fieldset_1.className = "form-group";
			div_6.className = "form-check";
			label_6.className = "form-check-label";
			input_3.type = "radio";
			input_3.className = "form-check-input";
			input_3.name = "optionsRadios";
			input_3.id = "optionsRadios1";
			input_3.value = "option1";
			input_3.checked = '';
			div_7.className = "form-check";
			label_7.className = "form-check-label";
			input_4.type = "radio";
			input_4.className = "form-check-input";
			input_4.name = "optionsRadios";
			input_4.id = "optionsRadios2";
			input_4.value = "option2";
			div_8.className = "form-check disabled";
			label_8.className = "form-check-label";
			input_5.type = "radio";
			input_5.className = "form-check-input";
			input_5.name = "optionsRadios";
			input_5.id = "optionsRadios3";
			input_5.value = "option3";
			input_5.disabled = '';
			div_9.className = "form-check";
			label_9.className = "form-check-label";
			input_6.type = "checkbox";
			input_6.className = "form-check-input";
			button.type = "submit";
			button.className = "btn btn-primary";
		},

		mount: function ( target, anchor ) {
			insertNode( fieldset, target, anchor );
			appendNode( legend, fieldset );
			appendNode( text, legend );
			appendNode( text_1, fieldset );
			appendNode( div, fieldset );
			appendNode( label, div );
			appendNode( text_2, label );
			appendNode( text_3, div );
			appendNode( input, div );
			appendNode( text_4, div );
			appendNode( small, div );
			appendNode( text_5, small );
			appendNode( text_7, fieldset );
			appendNode( div_1, fieldset );
			appendNode( label_1, div_1 );
			appendNode( text_8, label_1 );
			appendNode( text_9, div_1 );
			appendNode( input_1, div_1 );
			appendNode( text_11, fieldset );
			appendNode( div_2, fieldset );
			appendNode( label_2, div_2 );
			appendNode( text_12, label_2 );
			appendNode( text_13, div_2 );
			appendNode( select, div_2 );
			appendNode( option, select );
			appendNode( text_14, option );

			option.__value = option.textContent;

			appendNode( option_1, select );
			appendNode( text_15, option_1 );

			option_1.__value = option_1.textContent;

			appendNode( option_2, select );
			appendNode( text_16, option_2 );

			option_2.__value = option_2.textContent;

			appendNode( option_3, select );
			appendNode( text_17, option_3 );

			option_3.__value = option_3.textContent;

			appendNode( option_4, select );
			appendNode( text_18, option_4 );

			option_4.__value = option_4.textContent;

			appendNode( text_20, fieldset );
			appendNode( div_3, fieldset );
			appendNode( label_3, div_3 );
			appendNode( text_21, label_3 );
			appendNode( text_22, div_3 );
			appendNode( select_1, div_3 );
			appendNode( option_5, select_1 );
			appendNode( text_23, option_5 );

			option_5.__value = option_5.textContent;

			appendNode( option_6, select_1 );
			appendNode( text_24, option_6 );

			option_6.__value = option_6.textContent;

			appendNode( option_7, select_1 );
			appendNode( text_25, option_7 );

			option_7.__value = option_7.textContent;

			appendNode( option_8, select_1 );
			appendNode( text_26, option_8 );

			option_8.__value = option_8.textContent;

			appendNode( option_9, select_1 );
			appendNode( text_27, option_9 );

			option_9.__value = option_9.textContent;

			appendNode( text_29, fieldset );
			appendNode( div_4, fieldset );
			appendNode( label_4, div_4 );
			appendNode( text_30, label_4 );
			appendNode( text_31, div_4 );
			appendNode( textarea, div_4 );
			appendNode( text_33, fieldset );
			appendNode( div_5, fieldset );
			appendNode( label_5, div_5 );
			appendNode( text_34, label_5 );
			appendNode( text_35, div_5 );
			appendNode( input_2, div_5 );
			appendNode( text_36, div_5 );
			appendNode( small_1, div_5 );
			appendNode( text_37, small_1 );
			appendNode( text_39, fieldset );
			appendNode( fieldset_1, fieldset );
			appendNode( legend_1, fieldset_1 );
			appendNode( text_40, legend_1 );
			appendNode( text_41, fieldset_1 );
			appendNode( div_6, fieldset_1 );
			appendNode( label_6, div_6 );
			appendNode( input_3, label_6 );
			appendNode( text_42, label_6 );
			appendNode( text_44, fieldset_1 );
			appendNode( div_7, fieldset_1 );
			appendNode( label_7, div_7 );
			appendNode( input_4, label_7 );
			appendNode( text_45, label_7 );
			appendNode( text_47, fieldset_1 );
			appendNode( div_8, fieldset_1 );
			appendNode( label_8, div_8 );
			appendNode( input_5, label_8 );
			appendNode( text_48, label_8 );
			appendNode( text_51, fieldset );
			appendNode( div_9, fieldset );
			appendNode( label_9, div_9 );
			appendNode( input_6, label_9 );
			appendNode( text_52, label_9 );
			appendNode( text_54, fieldset );
			appendNode( button, fieldset );
			appendNode( text_55, button );
		},

		unmount: function () {
			detachNode( fieldset );
		},

		destroy: noop
	};
}

function create_col_1_yield_fragment_3 ( state, component ) {

	var form_1_yield_fragment = create_form_yield_fragment_2( state, component );

	var form_1 = new Form({
		_root: component._root,
		_yield: form_1_yield_fragment
	});

	return {
		create: function () {
			form_1_yield_fragment.create();
			form_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			form_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			form_1._fragment.unmount();
		},

		destroy: function () {
			form_1_yield_fragment.destroy();
			form_1.destroy( false );
		}
	};
}

function create_form_yield_fragment_2 ( state, component ) {
	var text, text_1, text_2, text_3, text_4, text_5, text_6, text_7;

	var formgroup_9_yield_fragment = create_formgroup_yield_fragment( state, component );

	var formgroup_9 = new FormGroup({
		_root: component._root,
		_yield: formgroup_9_yield_fragment
	});

	var formgroup_10_yield_fragment = create_formgroup_1_yield_fragment( state, component );

	var formgroup_10 = new FormGroup({
		_root: component._root,
		_yield: formgroup_10_yield_fragment
	});

	var formgroup_11_yield_fragment = create_formgroup_2_yield_fragment( state, component );

	var formgroup_11 = new FormGroup({
		_root: component._root,
		_yield: formgroup_11_yield_fragment,
		data: { color: "success" }
	});

	var formgroup_12_yield_fragment = create_formgroup_3_yield_fragment( state, component );

	var formgroup_12 = new FormGroup({
		_root: component._root,
		_yield: formgroup_12_yield_fragment,
		data: { color: "warning" }
	});

	var formgroup_13_yield_fragment = create_formgroup_4_yield_fragment( state, component );

	var formgroup_13 = new FormGroup({
		_root: component._root,
		_yield: formgroup_13_yield_fragment,
		data: { color: "danger" }
	});

	var formgroup_14_yield_fragment = create_formgroup_5_yield_fragment( state, component );

	var formgroup_14 = new FormGroup({
		_root: component._root,
		_yield: formgroup_14_yield_fragment
	});

	var formgroup_15_yield_fragment = create_formgroup_6_yield_fragment( state, component );

	var formgroup_15 = new FormGroup({
		_root: component._root,
		_yield: formgroup_15_yield_fragment
	});

	var formgroup_16_yield_fragment = create_formgroup_7_yield_fragment( state, component );

	var formgroup_16 = new FormGroup({
		_root: component._root,
		_yield: formgroup_16_yield_fragment
	});

	var formgroup_17_yield_fragment = create_formgroup_8_yield_fragment( state, component );

	var formgroup_17 = new FormGroup({
		_root: component._root,
		_yield: formgroup_17_yield_fragment
	});

	return {
		create: function () {
			formgroup_9_yield_fragment.create();
			formgroup_9._fragment.create();
			text = createText( "\n\n          " );
			formgroup_10_yield_fragment.create();
			formgroup_10._fragment.create();
			text_1 = createText( "\n\n          " );
			formgroup_11_yield_fragment.create();
			formgroup_11._fragment.create();
			text_2 = createText( "\n\n          " );
			formgroup_12_yield_fragment.create();
			formgroup_12._fragment.create();
			text_3 = createText( "\n\n          " );
			formgroup_13_yield_fragment.create();
			formgroup_13._fragment.create();
			text_4 = createText( "\n\n          " );
			formgroup_14_yield_fragment.create();
			formgroup_14._fragment.create();
			text_5 = createText( "\n\n          " );
			formgroup_15_yield_fragment.create();
			formgroup_15._fragment.create();
			text_6 = createText( "\n\n          " );
			formgroup_16_yield_fragment.create();
			formgroup_16._fragment.create();
			text_7 = createText( "\n\n          " );
			formgroup_17_yield_fragment.create();
			formgroup_17._fragment.create();
		},

		mount: function ( target, anchor ) {
			formgroup_9._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			formgroup_10._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			formgroup_11._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			formgroup_12._fragment.mount( target, anchor );
			insertNode( text_3, target, anchor );
			formgroup_13._fragment.mount( target, anchor );
			insertNode( text_4, target, anchor );
			formgroup_14._fragment.mount( target, anchor );
			insertNode( text_5, target, anchor );
			formgroup_15._fragment.mount( target, anchor );
			insertNode( text_6, target, anchor );
			formgroup_16._fragment.mount( target, anchor );
			insertNode( text_7, target, anchor );
			formgroup_17._fragment.mount( target, anchor );
		},

		unmount: function () {
			formgroup_9._fragment.unmount();
			detachNode( text );
			formgroup_10._fragment.unmount();
			detachNode( text_1 );
			formgroup_11._fragment.unmount();
			detachNode( text_2 );
			formgroup_12._fragment.unmount();
			detachNode( text_3 );
			formgroup_13._fragment.unmount();
			detachNode( text_4 );
			formgroup_14._fragment.unmount();
			detachNode( text_5 );
			formgroup_15._fragment.unmount();
			detachNode( text_6 );
			formgroup_16._fragment.unmount();
			detachNode( text_7 );
			formgroup_17._fragment.unmount();
		},

		destroy: function () {
			formgroup_9_yield_fragment.destroy();
			formgroup_9.destroy( false );
			formgroup_10_yield_fragment.destroy();
			formgroup_10.destroy( false );
			formgroup_11_yield_fragment.destroy();
			formgroup_11.destroy( false );
			formgroup_12_yield_fragment.destroy();
			formgroup_12.destroy( false );
			formgroup_13_yield_fragment.destroy();
			formgroup_13.destroy( false );
			formgroup_14_yield_fragment.destroy();
			formgroup_14.destroy( false );
			formgroup_15_yield_fragment.destroy();
			formgroup_15.destroy( false );
			formgroup_16_yield_fragment.destroy();
			formgroup_16.destroy( false );
			formgroup_17_yield_fragment.destroy();
			formgroup_17.destroy( false );
		}
	};
}

function create_formgroup_yield_fragment ( state, component ) {
	var fieldset, label, text, text_1, input;

	return {
		create: function () {
			fieldset = createElement( 'fieldset' );
			label = createElement( 'label' );
			text = createText( "Disabled input" );
			text_1 = createText( "\n              " );
			input = createElement( 'input' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			fieldset.disabled = '';
			label.className = "control-label";
			label.htmlFor = "disabledInput";
			input.className = "form-control";
			input.id = "disabledInput";
			input.type = "text";
			input.placeholder = "Disabled input here...";
			input.disabled = '';
		},

		mount: function ( target, anchor ) {
			insertNode( fieldset, target, anchor );
			appendNode( label, fieldset );
			appendNode( text, label );
			appendNode( text_1, fieldset );
			appendNode( input, fieldset );
		},

		unmount: function () {
			detachNode( fieldset );
		},

		destroy: noop
	};
}

function create_formgroup_1_yield_fragment ( state, component ) {
	var fieldset, label, text, text_1, input;

	return {
		create: function () {
			fieldset = createElement( 'fieldset' );
			label = createElement( 'label' );
			text = createText( "Readonly input" );
			text_1 = createText( "\n              " );
			input = createElement( 'input' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			label.className = "control-label";
			label.htmlFor = "readOnlyInput";
			input.className = "form-control";
			input.id = "readOnlyInput";
			input.type = "text";
			input.placeholder = "Readonly input here…";
			input.readOnly = '';
		},

		mount: function ( target, anchor ) {
			insertNode( fieldset, target, anchor );
			appendNode( label, fieldset );
			appendNode( text, label );
			appendNode( text_1, fieldset );
			appendNode( input, fieldset );
		},

		unmount: function () {
			detachNode( fieldset );
		},

		destroy: noop
	};
}

function create_formgroup_2_yield_fragment ( state, component ) {
	var label, text, text_1, input, text_2, div, text_3;

	return {
		create: function () {
			label = createElement( 'label' );
			text = createText( "Input with success" );
			text_1 = createText( "\n            " );
			input = createElement( 'input' );
			text_2 = createText( "\n            " );
			div = createElement( 'div' );
			text_3 = createText( "Success! You've done it." );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			label.className = "form-control-label";
			label.htmlFor = "inputSuccess1";
			input.type = "text";
			input.className = "form-control form-control-success";
			input.id = "inputSuccess1";
			div.className = "form-control-feedback";
		},

		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			appendNode( text, label );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( div, target, anchor );
			appendNode( text_3, div );
		},

		unmount: function () {
			detachNode( label );
			detachNode( text_1 );
			detachNode( input );
			detachNode( text_2 );
			detachNode( div );
		},

		destroy: noop
	};
}

function create_formgroup_3_yield_fragment ( state, component ) {
	var label, text, text_1, input, text_2, div, text_3;

	return {
		create: function () {
			label = createElement( 'label' );
			text = createText( "Input with warning" );
			text_1 = createText( "\n            " );
			input = createElement( 'input' );
			text_2 = createText( "\n            " );
			div = createElement( 'div' );
			text_3 = createText( "Shucks, try again." );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			label.className = "form-control-label";
			label.htmlFor = "inputWarning1";
			input.type = "text";
			input.className = "form-control form-control-warning";
			input.id = "inputWarning1";
			div.className = "form-control-feedback";
		},

		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			appendNode( text, label );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( div, target, anchor );
			appendNode( text_3, div );
		},

		unmount: function () {
			detachNode( label );
			detachNode( text_1 );
			detachNode( input );
			detachNode( text_2 );
			detachNode( div );
		},

		destroy: noop
	};
}

function create_formgroup_4_yield_fragment ( state, component ) {
	var label, text, text_1, input, text_2, div, text_3;

	return {
		create: function () {
			label = createElement( 'label' );
			text = createText( "Input with danger" );
			text_1 = createText( "\n            " );
			input = createElement( 'input' );
			text_2 = createText( "\n            " );
			div = createElement( 'div' );
			text_3 = createText( "Sorry, that username's taken. Try another?" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			label.className = "form-control-label";
			label.htmlFor = "inputDanger1";
			input.type = "text";
			input.className = "form-control form-control-danger";
			input.id = "inputDanger1";
			div.className = "form-control-feedback";
		},

		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			appendNode( text, label );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( div, target, anchor );
			appendNode( text_3, div );
		},

		unmount: function () {
			detachNode( label );
			detachNode( text_1 );
			detachNode( input );
			detachNode( text_2 );
			detachNode( div );
		},

		destroy: noop
	};
}

function create_formgroup_5_yield_fragment ( state, component ) {
	var label, text, text_1, input;

	return {
		create: function () {
			label = createElement( 'label' );
			text = createText( "Large input" );
			text_1 = createText( "\n            " );
			input = createElement( 'input' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			label.className = "col-form-label col-form-label-lg";
			label.htmlFor = "inputLarge";
			input.className = "form-control form-control-lg";
			input.type = "text";
			input.id = "inputLarge";
		},

		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			appendNode( text, label );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
		},

		unmount: function () {
			detachNode( label );
			detachNode( text_1 );
			detachNode( input );
		},

		destroy: noop
	};
}

function create_formgroup_6_yield_fragment ( state, component ) {
	var label, text, text_1, input;

	return {
		create: function () {
			label = createElement( 'label' );
			text = createText( "Default input" );
			text_1 = createText( "\n            " );
			input = createElement( 'input' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			label.className = "col-form-label";
			label.htmlFor = "inputDefault";
			input.type = "text";
			input.className = "form-control";
			input.id = "inputDefault";
		},

		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			appendNode( text, label );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
		},

		unmount: function () {
			detachNode( label );
			detachNode( text_1 );
			detachNode( input );
		},

		destroy: noop
	};
}

function create_formgroup_7_yield_fragment ( state, component ) {
	var label, text, text_1, input;

	return {
		create: function () {
			label = createElement( 'label' );
			text = createText( "Small input" );
			text_1 = createText( "\n            " );
			input = createElement( 'input' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			label.className = "col-form-label col-form-label-sm";
			label.htmlFor = "inputSmall";
			input.className = "form-control form-control-sm";
			input.type = "text";
			input.id = "inputSmall";
		},

		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			appendNode( text, label );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
		},

		unmount: function () {
			detachNode( label );
			detachNode( text_1 );
			detachNode( input );
		},

		destroy: noop
	};
}

function create_formgroup_8_yield_fragment ( state, component ) {
	var label, text, text_1;

	var formgroup_1_yield_fragment = create_formgroup_yield_fragment_1( state, component );

	var formgroup_1 = new FormGroup({
		_root: component._root,
		_yield: formgroup_1_yield_fragment
	});

	return {
		create: function () {
			label = createElement( 'label' );
			text = createText( "Input addons" );
			text_1 = createText( "\n            " );
			formgroup_1_yield_fragment.create();
			formgroup_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			label.className = "control-label";
		},

		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			appendNode( text, label );
			insertNode( text_1, target, anchor );
			formgroup_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( label );
			detachNode( text_1 );
			formgroup_1._fragment.unmount();
		},

		destroy: function () {
			formgroup_1_yield_fragment.destroy();
			formgroup_1.destroy( false );
		}
	};
}

function create_formgroup_yield_fragment_1 ( state, component ) {
	var label, text, text_1;

	var inputgroup_1_yield_fragment = create_inputgroup_yield_fragment( state, component );

	var inputgroup_1 = new InputGroup({
		_root: component._root,
		_yield: inputgroup_1_yield_fragment
	});

	return {
		create: function () {
			label = createElement( 'label' );
			text = createText( "Amount (in dollars)" );
			text_1 = createText( "\n              " );
			inputgroup_1_yield_fragment.create();
			inputgroup_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			label.className = "sr-only";
			label.htmlFor = "exampleInputAmount";
		},

		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			appendNode( text, label );
			insertNode( text_1, target, anchor );
			inputgroup_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( label );
			detachNode( text_1 );
			inputgroup_1._fragment.unmount();
		},

		destroy: function () {
			inputgroup_1_yield_fragment.destroy();
			inputgroup_1.destroy( false );
		}
	};
}

function create_inputgroup_yield_fragment ( state, component ) {
	var text, input, text_1;

	var inputgroupaddon_2_yield_fragment = create_inputgroupaddon_yield_fragment( state, component );

	var inputgroupaddon_2 = new InputGroupAddon({
		_root: component._root,
		_yield: inputgroupaddon_2_yield_fragment
	});

	var inputgroupaddon_3_yield_fragment = create_inputgroupaddon_1_yield_fragment( state, component );

	var inputgroupaddon_3 = new InputGroupAddon({
		_root: component._root,
		_yield: inputgroupaddon_3_yield_fragment
	});

	return {
		create: function () {
			inputgroupaddon_2_yield_fragment.create();
			inputgroupaddon_2._fragment.create();
			text = createText( "\n                " );
			input = createElement( 'input' );
			text_1 = createText( "\n                " );
			inputgroupaddon_3_yield_fragment.create();
			inputgroupaddon_3._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			input.type = "text";
			input.className = "form-control";
			input.id = "exampleInputAmount";
			input.placeholder = "Amount";
		},

		mount: function ( target, anchor ) {
			inputgroupaddon_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text_1, target, anchor );
			inputgroupaddon_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			inputgroupaddon_2._fragment.unmount();
			detachNode( text );
			detachNode( input );
			detachNode( text_1 );
			inputgroupaddon_3._fragment.unmount();
		},

		destroy: function () {
			inputgroupaddon_2_yield_fragment.destroy();
			inputgroupaddon_2.destroy( false );
			inputgroupaddon_3_yield_fragment.destroy();
			inputgroupaddon_3.destroy( false );
		}
	};
}

function create_inputgroupaddon_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "$" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_inputgroupaddon_1_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( ".00" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_row_7_yield_fragment ( state, component ) {
	var text;

	var col_2_yield_fragment = create_col_yield_fragment_6( state, component );

	var col_2 = new Col({
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 6 }
	});

	var col_3_yield_fragment = create_col_1_yield_fragment_4( state, component );

	var col_3 = new Col({
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 6 }
	});

	return {
		create: function () {
			col_2_yield_fragment.create();
			col_2._fragment.create();
			text = createText( "\n\n      " );
			col_3_yield_fragment.create();
			col_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_2._fragment.unmount();
			detachNode( text );
			col_3._fragment.unmount();
		},

		destroy: function () {
			col_2_yield_fragment.destroy();
			col_2.destroy( false );
			col_3_yield_fragment.destroy();
			col_3.destroy( false );
		}
	};
}

function create_col_yield_fragment_6 ( state, component ) {
	var h2, text, text_1, div, text_2, div_1, div_2, p, text_3, text_5, div_3, p_1, text_6, text_8, div_4, p_2, text_9, text_11, div_5, p_3, text_12;

	var nav_1_yield_fragment = create_nav_yield_fragment( state, component );

	var nav_1 = new Nav({
		_root: component._root,
		_yield: nav_1_yield_fragment,
		data: { tabs: true }
	});

	return {
		create: function () {
			h2 = createElement( 'h2' );
			text = createText( "Tabs" );
			text_1 = createText( "\n        " );
			div = createElement( 'div' );
			nav_1_yield_fragment.create();
			nav_1._fragment.create();
			text_2 = createText( "\n          " );
			div_1 = createElement( 'div' );
			div_2 = createElement( 'div' );
			p = createElement( 'p' );
			text_3 = createText( "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui." );
			text_5 = createText( "\n            " );
			div_3 = createElement( 'div' );
			p_1 = createElement( 'p' );
			text_6 = createText( "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit." );
			text_8 = createText( "\n            " );
			div_4 = createElement( 'div' );
			p_2 = createElement( 'p' );
			text_9 = createText( "Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork." );
			text_11 = createText( "\n            " );
			div_5 = createElement( 'div' );
			p_3 = createElement( 'p' );
			text_12 = createText( "Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin. Cred vinyl keffiyeh DIY salvia PBR, banh mi before they sold out farm-to-table VHS viral locavore cosby sweater." );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h2.id = "nav-tabs";
			h2.className = "text-muted my-4";
			div.className = "bs-component";
			div_1.id = "myTabContent";
			div_1.className = "tab-content";
			div_2.className = "tab-pane fade active in";
			div_2.id = "home";
			div_3.className = "tab-pane fade";
			div_3.id = "profile";
			div_4.className = "tab-pane fade";
			div_4.id = "dropdown1";
			div_5.className = "tab-pane fade";
			div_5.id = "dropdown2";
		},

		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			appendNode( text, h2 );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
			nav_1._fragment.mount( div, null );
			appendNode( text_2, div );
			appendNode( div_1, div );
			appendNode( div_2, div_1 );
			appendNode( p, div_2 );
			appendNode( text_3, p );
			appendNode( text_5, div_1 );
			appendNode( div_3, div_1 );
			appendNode( p_1, div_3 );
			appendNode( text_6, p_1 );
			appendNode( text_8, div_1 );
			appendNode( div_4, div_1 );
			appendNode( p_2, div_4 );
			appendNode( text_9, p_2 );
			appendNode( text_11, div_1 );
			appendNode( div_5, div_1 );
			appendNode( p_3, div_5 );
			appendNode( text_12, p_3 );
		},

		unmount: function () {
			detachNode( h2 );
			detachNode( text_1 );
			detachNode( div );
		},

		destroy: function () {
			nav_1_yield_fragment.destroy();
			nav_1.destroy( false );
		}
	};
}

function create_nav_yield_fragment ( state, component ) {
	var text, text_1, text_2, li, a, text_3, text_4, div, a_1, text_5, text_6, a_2, text_7, text_8, a_3, text_9, text_10, div_1, text_11, a_4, text_12;

	var navitem_3_yield_fragment = create_navitem_yield_fragment_2( state, component );

	var navitem_3 = new NavItem({
		_root: component._root,
		_yield: navitem_3_yield_fragment
	});

	var navitem_4_yield_fragment = create_navitem_1_yield_fragment_1( state, component );

	var navitem_4 = new NavItem({
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var navitem_5_yield_fragment = create_navitem_2_yield_fragment_1( state, component );

	var navitem_5 = new NavItem({
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	return {
		create: function () {
			navitem_3_yield_fragment.create();
			navitem_3._fragment.create();
			text = createText( "\n            " );
			navitem_4_yield_fragment.create();
			navitem_4._fragment.create();
			text_1 = createText( "\n            " );
			navitem_5_yield_fragment.create();
			navitem_5._fragment.create();
			text_2 = createText( "\n            " );
			li = createElement( 'li' );
			a = createElement( 'a' );
			text_3 = createText( "Dropdown" );
			text_4 = createText( "\n              " );
			div = createElement( 'div' );
			a_1 = createElement( 'a' );
			text_5 = createText( "Action" );
			text_6 = createText( "\n                " );
			a_2 = createElement( 'a' );
			text_7 = createText( "Another action" );
			text_8 = createText( "\n                " );
			a_3 = createElement( 'a' );
			text_9 = createText( "Something else here" );
			text_10 = createText( "\n                " );
			div_1 = createElement( 'div' );
			text_11 = createText( "\n                " );
			a_4 = createElement( 'a' );
			text_12 = createText( "Separated link" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			li.className = "nav-item dropdown";
			a.className = "nav-link dropdown-toggle";
			setAttribute( a, 'data-toggle', "dropdown" );
			a.href = "\#";
			setAttribute( a, 'role', "button" );
			setAttribute( a, 'aria-haspopup', "true" );
			setAttribute( a, 'aria-expanded', "false" );
			div.className = "dropdown-menu";
			a_1.className = "dropdown-item";
			a_1.href = "\#";
			a_2.className = "dropdown-item";
			a_2.href = "\#";
			a_3.className = "dropdown-item";
			a_3.href = "\#";
			div_1.className = "dropdown-divider";
			a_4.className = "dropdown-item";
			a_4.href = "\#";
		},

		mount: function ( target, anchor ) {
			navitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navitem_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_5._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( li, target, anchor );
			appendNode( a, li );
			appendNode( text_3, a );
			appendNode( text_4, li );
			appendNode( div, li );
			appendNode( a_1, div );
			appendNode( text_5, a_1 );
			appendNode( text_6, div );
			appendNode( a_2, div );
			appendNode( text_7, a_2 );
			appendNode( text_8, div );
			appendNode( a_3, div );
			appendNode( text_9, a_3 );
			appendNode( text_10, div );
			appendNode( div_1, div );
			appendNode( text_11, div );
			appendNode( a_4, div );
			appendNode( text_12, a_4 );
		},

		unmount: function () {
			navitem_3._fragment.unmount();
			detachNode( text );
			navitem_4._fragment.unmount();
			detachNode( text_1 );
			navitem_5._fragment.unmount();
			detachNode( text_2 );
			detachNode( li );
		},

		destroy: function () {
			navitem_3_yield_fragment.destroy();
			navitem_3.destroy( false );
			navitem_4_yield_fragment.destroy();
			navitem_4.destroy( false );
			navitem_5_yield_fragment.destroy();
			navitem_5.destroy( false );
		}
	};
}

function create_navitem_yield_fragment_2 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_9( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true, href: "\#home" }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_9 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Home" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_1_yield_fragment_1 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_10( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { href: "\#profile" }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_10 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Profile" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_2_yield_fragment_1 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_11( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_11 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Disabled" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_col_1_yield_fragment_4 ( state, component ) {
	var h2, text, text_1, text_2, br, text_3, div;

	var nav_2_yield_fragment = create_nav_yield_fragment_1( state, component );

	var nav_2 = new Nav({
		_root: component._root,
		_yield: nav_2_yield_fragment,
		data: { pills: true }
	});

	var nav_3_yield_fragment = create_nav_1_yield_fragment( state, component );

	var nav_3 = new Nav({
		_root: component._root,
		_yield: nav_3_yield_fragment,
		data: { pills: true, stacked: true }
	});

	return {
		create: function () {
			h2 = createElement( 'h2' );
			text = createText( "Pills" );
			text_1 = createText( "\n        " );
			nav_2_yield_fragment.create();
			nav_2._fragment.create();
			text_2 = createText( "\n\n        " );
			br = createElement( 'br' );
			text_3 = createText( "\n        " );
			div = createElement( 'div' );
			nav_3_yield_fragment.create();
			nav_3._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h2.id = "nav-pills";
			h2.className = "text-muted my-4";
			div.className = "bs-component";
		},

		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			appendNode( text, h2 );
			insertNode( text_1, target, anchor );
			nav_2._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( br, target, anchor );
			insertNode( text_3, target, anchor );
			insertNode( div, target, anchor );
			nav_3._fragment.mount( div, null );
		},

		unmount: function () {
			detachNode( h2 );
			detachNode( text_1 );
			nav_2._fragment.unmount();
			detachNode( text_2 );
			detachNode( br );
			detachNode( text_3 );
			detachNode( div );
		},

		destroy: function () {
			nav_2_yield_fragment.destroy();
			nav_2.destroy( false );
			nav_3_yield_fragment.destroy();
			nav_3.destroy( false );
		}
	};
}

function create_nav_yield_fragment_1 ( state, component ) {
	var text, text_1, text_2;

	var navitem_3_yield_fragment = create_navitem_yield_fragment_3( state, component );

	var navitem_3 = new NavItem({
		_root: component._root,
		_yield: navitem_3_yield_fragment
	});

	var navdropdown_1_yield_fragment = create_navdropdown_yield_fragment( state, component );

	var navdropdown_1 = new NavDropdown({
		_root: component._root,
		_yield: navdropdown_1_yield_fragment
	});

	var navitem_4_yield_fragment = create_navitem_1_yield_fragment_2( state, component );

	var navitem_4 = new NavItem({
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var navitem_5_yield_fragment = create_navitem_2_yield_fragment_2( state, component );

	var navitem_5 = new NavItem({
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	return {
		create: function () {
			navitem_3_yield_fragment.create();
			navitem_3._fragment.create();
			text = createText( "\n          " );
			navdropdown_1_yield_fragment.create();
			navdropdown_1._fragment.create();
			text_1 = createText( "\n          " );
			navitem_4_yield_fragment.create();
			navitem_4._fragment.create();
			text_2 = createText( "\n          " );
			navitem_5_yield_fragment.create();
			navitem_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			navitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navdropdown_1._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_4._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			navitem_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			navitem_3._fragment.unmount();
			detachNode( text );
			navdropdown_1._fragment.unmount();
			detachNode( text_1 );
			navitem_4._fragment.unmount();
			detachNode( text_2 );
			navitem_5._fragment.unmount();
		},

		destroy: function () {
			navitem_3_yield_fragment.destroy();
			navitem_3.destroy( false );
			navdropdown_1_yield_fragment.destroy();
			navdropdown_1.destroy( false );
			navitem_4_yield_fragment.destroy();
			navitem_4.destroy( false );
			navitem_5_yield_fragment.destroy();
			navitem_5.destroy( false );
		}
	};
}

function create_navitem_yield_fragment_3 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_12( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_12 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Active" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navdropdown_yield_fragment ( state, component ) {
	var a, text, text_1, div, a_1, text_2, text_3, a_2, text_4, text_5, a_3, text_6, text_7, div_1, text_8, a_4, text_9;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Dropdown" );
			text_1 = createText( "\n            " );
			div = createElement( 'div' );
			a_1 = createElement( 'a' );
			text_2 = createText( "Action" );
			text_3 = createText( "\n              " );
			a_2 = createElement( 'a' );
			text_4 = createText( "Another action" );
			text_5 = createText( "\n              " );
			a_3 = createElement( 'a' );
			text_6 = createText( "Something else here" );
			text_7 = createText( "\n              " );
			div_1 = createElement( 'div' );
			text_8 = createText( "\n              " );
			a_4 = createElement( 'a' );
			text_9 = createText( "Separated link" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = "nav-link dropdown-toggle";
			setAttribute( a, 'data-toggle', "dropdown" );
			a.href = "\#";
			setAttribute( a, 'role', "button" );
			setAttribute( a, 'aria-haspopup', "true" );
			setAttribute( a, 'aria-expanded', "false" );
			div.className = "dropdown-menu";
			a_1.className = "dropdown-item";
			a_1.href = "\#";
			a_2.className = "dropdown-item";
			a_2.href = "\#";
			a_3.className = "dropdown-item";
			a_3.href = "\#";
			div_1.className = "dropdown-divider";
			a_4.className = "dropdown-item";
			a_4.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
			appendNode( a_1, div );
			appendNode( text_2, a_1 );
			appendNode( text_3, div );
			appendNode( a_2, div );
			appendNode( text_4, a_2 );
			appendNode( text_5, div );
			appendNode( a_3, div );
			appendNode( text_6, a_3 );
			appendNode( text_7, div );
			appendNode( div_1, div );
			appendNode( text_8, div );
			appendNode( a_4, div );
			appendNode( text_9, a_4 );
		},

		unmount: function () {
			detachNode( a );
			detachNode( text_1 );
			detachNode( div );
		},

		destroy: noop
	};
}

function create_navitem_1_yield_fragment_2 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_13( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_13 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Link" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_2_yield_fragment_2 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_14( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_14 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Disabled" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_nav_1_yield_fragment ( state, component ) {
	var text, text_1, text_2;

	var navitem_3_yield_fragment = create_navitem_yield_fragment_4( state, component );

	var navitem_3 = new NavItem({
		_root: component._root,
		_yield: navitem_3_yield_fragment
	});

	var navdropdown_1_yield_fragment = create_navdropdown_yield_fragment_1( state, component );

	var navdropdown_1 = new NavDropdown({
		_root: component._root,
		_yield: navdropdown_1_yield_fragment
	});

	var navitem_4_yield_fragment = create_navitem_1_yield_fragment_3( state, component );

	var navitem_4 = new NavItem({
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var navitem_5_yield_fragment = create_navitem_2_yield_fragment_3( state, component );

	var navitem_5 = new NavItem({
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	return {
		create: function () {
			navitem_3_yield_fragment.create();
			navitem_3._fragment.create();
			text = createText( "\n            " );
			navdropdown_1_yield_fragment.create();
			navdropdown_1._fragment.create();
			text_1 = createText( "\n            " );
			navitem_4_yield_fragment.create();
			navitem_4._fragment.create();
			text_2 = createText( "\n            " );
			navitem_5_yield_fragment.create();
			navitem_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			navitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navdropdown_1._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_4._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			navitem_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			navitem_3._fragment.unmount();
			detachNode( text );
			navdropdown_1._fragment.unmount();
			detachNode( text_1 );
			navitem_4._fragment.unmount();
			detachNode( text_2 );
			navitem_5._fragment.unmount();
		},

		destroy: function () {
			navitem_3_yield_fragment.destroy();
			navitem_3.destroy( false );
			navdropdown_1_yield_fragment.destroy();
			navdropdown_1.destroy( false );
			navitem_4_yield_fragment.destroy();
			navitem_4.destroy( false );
			navitem_5_yield_fragment.destroy();
			navitem_5.destroy( false );
		}
	};
}

function create_navitem_yield_fragment_4 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_15( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_15 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Active" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navdropdown_yield_fragment_1 ( state, component ) {
	var a, text, text_1, div, a_1, text_2, text_3, a_2, text_4, text_5, a_3, text_6, text_7, div_1, text_8, a_4, text_9;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Dropdown" );
			text_1 = createText( "\n              " );
			div = createElement( 'div' );
			a_1 = createElement( 'a' );
			text_2 = createText( "Action" );
			text_3 = createText( "\n                " );
			a_2 = createElement( 'a' );
			text_4 = createText( "Another action" );
			text_5 = createText( "\n                " );
			a_3 = createElement( 'a' );
			text_6 = createText( "Something else here" );
			text_7 = createText( "\n                " );
			div_1 = createElement( 'div' );
			text_8 = createText( "\n                " );
			a_4 = createElement( 'a' );
			text_9 = createText( "Separated link" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = "nav-link dropdown-toggle";
			setAttribute( a, 'data-toggle', "dropdown" );
			a.href = "\#";
			setAttribute( a, 'role', "button" );
			setAttribute( a, 'aria-haspopup', "true" );
			setAttribute( a, 'aria-expanded', "false" );
			div.className = "dropdown-menu";
			a_1.className = "dropdown-item";
			a_1.href = "\#";
			a_2.className = "dropdown-item";
			a_2.href = "\#";
			a_3.className = "dropdown-item";
			a_3.href = "\#";
			div_1.className = "dropdown-divider";
			a_4.className = "dropdown-item";
			a_4.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
			appendNode( a_1, div );
			appendNode( text_2, a_1 );
			appendNode( text_3, div );
			appendNode( a_2, div );
			appendNode( text_4, a_2 );
			appendNode( text_5, div );
			appendNode( a_3, div );
			appendNode( text_6, a_3 );
			appendNode( text_7, div );
			appendNode( div_1, div );
			appendNode( text_8, div );
			appendNode( a_4, div );
			appendNode( text_9, a_4 );
		},

		unmount: function () {
			detachNode( a );
			detachNode( text_1 );
			detachNode( div );
		},

		destroy: noop
	};
}

function create_navitem_1_yield_fragment_3 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_16( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_16 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Link" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_2_yield_fragment_3 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_17( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_17 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Disabled" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_nav_yield_fragment_2 ( state, component ) {
	var text, text_1, text_2;

	var navitem_4_yield_fragment = create_navitem_yield_fragment_5( state, component );

	var navitem_4 = new NavItem({
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var navitem_5_yield_fragment = create_navitem_1_yield_fragment_4( state, component );

	var navitem_5 = new NavItem({
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	var navitem_6_yield_fragment = create_navitem_2_yield_fragment_4( state, component );

	var navitem_6 = new NavItem({
		_root: component._root,
		_yield: navitem_6_yield_fragment
	});

	var navitem_7_yield_fragment = create_navitem_3_yield_fragment_1( state, component );

	var navitem_7 = new NavItem({
		_root: component._root,
		_yield: navitem_7_yield_fragment
	});

	return {
		create: function () {
			navitem_4_yield_fragment.create();
			navitem_4._fragment.create();
			text = createText( "\n      " );
			navitem_5_yield_fragment.create();
			navitem_5._fragment.create();
			text_1 = createText( "\n      " );
			navitem_6_yield_fragment.create();
			navitem_6._fragment.create();
			text_2 = createText( "\n      " );
			navitem_7_yield_fragment.create();
			navitem_7._fragment.create();
		},

		mount: function ( target, anchor ) {
			navitem_4._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navitem_5._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_6._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			navitem_7._fragment.mount( target, anchor );
		},

		unmount: function () {
			navitem_4._fragment.unmount();
			detachNode( text );
			navitem_5._fragment.unmount();
			detachNode( text_1 );
			navitem_6._fragment.unmount();
			detachNode( text_2 );
			navitem_7._fragment.unmount();
		},

		destroy: function () {
			navitem_4_yield_fragment.destroy();
			navitem_4.destroy( false );
			navitem_5_yield_fragment.destroy();
			navitem_5.destroy( false );
			navitem_6_yield_fragment.destroy();
			navitem_6.destroy( false );
			navitem_7_yield_fragment.destroy();
			navitem_7.destroy( false );
		}
	};
}

function create_navitem_yield_fragment_5 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_18( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true, href: "\#home" }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_18 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "My" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_1_yield_fragment_4 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_19( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { href: "\#profile" }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_19 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Name" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_2_yield_fragment_4 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_20( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_20 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Is" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_3_yield_fragment_1 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_21( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_21 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Rufus Xavier Sarsaparilla" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_nav_1_yield_fragment_1 ( state, component ) {
	var text, text_1, text_2;

	var navitem_4_yield_fragment = create_navitem_yield_fragment_6( state, component );

	var navitem_4 = new NavItem({
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var navitem_5_yield_fragment = create_navitem_1_yield_fragment_5( state, component );

	var navitem_5 = new NavItem({
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	var navitem_6_yield_fragment = create_navitem_2_yield_fragment_5( state, component );

	var navitem_6 = new NavItem({
		_root: component._root,
		_yield: navitem_6_yield_fragment
	});

	var navitem_7_yield_fragment = create_navitem_3_yield_fragment_2( state, component );

	var navitem_7 = new NavItem({
		_root: component._root,
		_yield: navitem_7_yield_fragment
	});

	return {
		create: function () {
			navitem_4_yield_fragment.create();
			navitem_4._fragment.create();
			text = createText( "\n      " );
			navitem_5_yield_fragment.create();
			navitem_5._fragment.create();
			text_1 = createText( "\n      " );
			navitem_6_yield_fragment.create();
			navitem_6._fragment.create();
			text_2 = createText( "\n      " );
			navitem_7_yield_fragment.create();
			navitem_7._fragment.create();
		},

		mount: function ( target, anchor ) {
			navitem_4._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navitem_5._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_6._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			navitem_7._fragment.mount( target, anchor );
		},

		unmount: function () {
			navitem_4._fragment.unmount();
			detachNode( text );
			navitem_5._fragment.unmount();
			detachNode( text_1 );
			navitem_6._fragment.unmount();
			detachNode( text_2 );
			navitem_7._fragment.unmount();
		},

		destroy: function () {
			navitem_4_yield_fragment.destroy();
			navitem_4.destroy( false );
			navitem_5_yield_fragment.destroy();
			navitem_5.destroy( false );
			navitem_6_yield_fragment.destroy();
			navitem_6.destroy( false );
			navitem_7_yield_fragment.destroy();
			navitem_7.destroy( false );
		}
	};
}

function create_navitem_yield_fragment_6 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_22( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true, href: "\#home" }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_22 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "My" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_1_yield_fragment_5 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_23( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { href: "\#profile" }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_23 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Name" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_2_yield_fragment_5 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_24( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_24 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Is" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_navitem_3_yield_fragment_2 ( state, component ) {

	var navlink_1_yield_fragment = create_navlink_yield_fragment_25( state, component );

	var navlink_1 = new NavLink({
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		create: function () {
			navlink_1_yield_fragment.create();
			navlink_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			navlink_1._fragment.unmount();
		},

		destroy: function () {
			navlink_1_yield_fragment.destroy();
			navlink_1.destroy( false );
		}
	};
}

function create_navlink_yield_fragment_25 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Rufus Xavier Sarsaparilla" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_row_8_yield_fragment ( state, component ) {
	var text;

	var col_2_yield_fragment = create_col_yield_fragment_7( state, component );

	var col_2 = new Col({
		_root: component._root,
		_yield: col_2_yield_fragment
	});

	var col_3_yield_fragment = create_col_1_yield_fragment_5( state, component );

	var col_3 = new Col({
		_root: component._root,
		_yield: col_3_yield_fragment
	});

	return {
		create: function () {
			col_2_yield_fragment.create();
			col_2._fragment.create();
			text = createText( "\n\n      " );
			col_3_yield_fragment.create();
			col_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_2._fragment.unmount();
			detachNode( text );
			col_3._fragment.unmount();
		},

		destroy: function () {
			col_2_yield_fragment.destroy();
			col_2.destroy( false );
			col_3_yield_fragment.destroy();
			col_3.destroy( false );
		}
	};
}

function create_col_yield_fragment_7 ( state, component ) {
	var h2, text, text_1, text_2, text_3;

	var breadcrumb_3_yield_fragment = create_breadcrumb_yield_fragment( state, component );

	var breadcrumb_3 = new Breadcrumb({
		_root: component._root,
		_yield: breadcrumb_3_yield_fragment
	});

	var breadcrumb_4_yield_fragment = create_breadcrumb_1_yield_fragment( state, component );

	var breadcrumb_4 = new Breadcrumb({
		_root: component._root,
		_yield: breadcrumb_4_yield_fragment
	});

	var breadcrumb_5_yield_fragment = create_breadcrumb_2_yield_fragment( state, component );

	var breadcrumb_5 = new Breadcrumb({
		_root: component._root,
		_yield: breadcrumb_5_yield_fragment
	});

	return {
		create: function () {
			h2 = createElement( 'h2' );
			text = createText( "Breadcrumbs" );
			text_1 = createText( "\n\n        " );
			breadcrumb_3_yield_fragment.create();
			breadcrumb_3._fragment.create();
			text_2 = createText( "\n\n        " );
			breadcrumb_4_yield_fragment.create();
			breadcrumb_4._fragment.create();
			text_3 = createText( "\n\n        " );
			breadcrumb_5_yield_fragment.create();
			breadcrumb_5._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h2.id = "nav-breadcrumbs";
			h2.className = "text-muted my-4";
		},

		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			appendNode( text, h2 );
			insertNode( text_1, target, anchor );
			breadcrumb_3._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			breadcrumb_4._fragment.mount( target, anchor );
			insertNode( text_3, target, anchor );
			breadcrumb_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( h2 );
			detachNode( text_1 );
			breadcrumb_3._fragment.unmount();
			detachNode( text_2 );
			breadcrumb_4._fragment.unmount();
			detachNode( text_3 );
			breadcrumb_5._fragment.unmount();
		},

		destroy: function () {
			breadcrumb_3_yield_fragment.destroy();
			breadcrumb_3.destroy( false );
			breadcrumb_4_yield_fragment.destroy();
			breadcrumb_4.destroy( false );
			breadcrumb_5_yield_fragment.destroy();
			breadcrumb_5.destroy( false );
		}
	};
}

function create_breadcrumb_yield_fragment ( state, component ) {

	var breadcrumbitem_1_yield_fragment = create_breadcrumbitem_yield_fragment( state, component );

	var breadcrumbitem_1 = new BreadcrumbItem({
		_root: component._root,
		_yield: breadcrumbitem_1_yield_fragment,
		data: { active: true }
	});

	return {
		create: function () {
			breadcrumbitem_1_yield_fragment.create();
			breadcrumbitem_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			breadcrumbitem_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			breadcrumbitem_1._fragment.unmount();
		},

		destroy: function () {
			breadcrumbitem_1_yield_fragment.destroy();
			breadcrumbitem_1.destroy( false );
		}
	};
}

function create_breadcrumbitem_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Home" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_breadcrumb_1_yield_fragment ( state, component ) {
	var text;

	var breadcrumbitem_2_yield_fragment = create_breadcrumbitem_yield_fragment_1( state, component );

	var breadcrumbitem_2 = new BreadcrumbItem({
		_root: component._root,
		_yield: breadcrumbitem_2_yield_fragment
	});

	var breadcrumbitem_3_yield_fragment = create_breadcrumbitem_1_yield_fragment( state, component );

	var breadcrumbitem_3 = new BreadcrumbItem({
		_root: component._root,
		_yield: breadcrumbitem_3_yield_fragment,
		data: { active: true }
	});

	return {
		create: function () {
			breadcrumbitem_2_yield_fragment.create();
			breadcrumbitem_2._fragment.create();
			text = createText( "\n          " );
			breadcrumbitem_3_yield_fragment.create();
			breadcrumbitem_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			breadcrumbitem_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			breadcrumbitem_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			breadcrumbitem_2._fragment.unmount();
			detachNode( text );
			breadcrumbitem_3._fragment.unmount();
		},

		destroy: function () {
			breadcrumbitem_2_yield_fragment.destroy();
			breadcrumbitem_2.destroy( false );
			breadcrumbitem_3_yield_fragment.destroy();
			breadcrumbitem_3.destroy( false );
		}
	};
}

function create_breadcrumbitem_yield_fragment_1 ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Home" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_breadcrumbitem_1_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Library" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_breadcrumb_2_yield_fragment ( state, component ) {
	var text, text_1;

	var breadcrumbitem_3_yield_fragment = create_breadcrumbitem_yield_fragment_2( state, component );

	var breadcrumbitem_3 = new BreadcrumbItem({
		_root: component._root,
		_yield: breadcrumbitem_3_yield_fragment
	});

	var breadcrumbitem_4_yield_fragment = create_breadcrumbitem_1_yield_fragment_1( state, component );

	var breadcrumbitem_4 = new BreadcrumbItem({
		_root: component._root,
		_yield: breadcrumbitem_4_yield_fragment
	});

	var breadcrumbitem_5_yield_fragment = create_breadcrumbitem_2_yield_fragment( state, component );

	var breadcrumbitem_5 = new BreadcrumbItem({
		_root: component._root,
		_yield: breadcrumbitem_5_yield_fragment,
		data: { active: true }
	});

	return {
		create: function () {
			breadcrumbitem_3_yield_fragment.create();
			breadcrumbitem_3._fragment.create();
			text = createText( "\n          " );
			breadcrumbitem_4_yield_fragment.create();
			breadcrumbitem_4._fragment.create();
			text_1 = createText( "\n          " );
			breadcrumbitem_5_yield_fragment.create();
			breadcrumbitem_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			breadcrumbitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			breadcrumbitem_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			breadcrumbitem_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			breadcrumbitem_3._fragment.unmount();
			detachNode( text );
			breadcrumbitem_4._fragment.unmount();
			detachNode( text_1 );
			breadcrumbitem_5._fragment.unmount();
		},

		destroy: function () {
			breadcrumbitem_3_yield_fragment.destroy();
			breadcrumbitem_3.destroy( false );
			breadcrumbitem_4_yield_fragment.destroy();
			breadcrumbitem_4.destroy( false );
			breadcrumbitem_5_yield_fragment.destroy();
			breadcrumbitem_5.destroy( false );
		}
	};
}

function create_breadcrumbitem_yield_fragment_2 ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Home" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_breadcrumbitem_1_yield_fragment_1 ( state, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "Library" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_breadcrumbitem_2_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Data" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_col_1_yield_fragment_5 ( state, component ) {
	var h2, text, text_1, div;

	var each_block_value = [null, 'lg', 'sm'];

	var each_block_1_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_1_iterations[i] = create_each_block_1( state, each_block_value, each_block_value[i], i, component );
	}

	return {
		create: function () {
			h2 = createElement( 'h2' );
			text = createText( "Pagination" );
			text_1 = createText( "\n        " );
			div = createElement( 'div' );

			for ( var i = 0; i < each_block_1_iterations.length; i += 1 ) {
				each_block_1_iterations[i].create();
			}
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h2.id = "pagination";
			h2.className = "text-muted my-4";
			div.className = "bs-component";
		},

		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			appendNode( text, h2 );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );

			for ( var i = 0; i < each_block_1_iterations.length; i += 1 ) {
				each_block_1_iterations[i].mount( div, null );
			}
		},

		unmount: function () {
			detachNode( h2 );
			detachNode( text_1 );
			detachNode( div );

			for ( var i = 0; i < each_block_1_iterations.length; i += 1 ) {
				each_block_1_iterations[i].unmount();
			}
		},

		destroy: function () {
			destroyEach( each_block_1_iterations, false, 0 );
		}
	};
}

function create_each_block_1 ( state, each_block_value, size, size_index, component ) {
	var div;

	var pagination_1_yield_fragment = create_pagination_yield_fragment( state, each_block_value, size, size_index, component );

	var pagination_1 = new Pagination({
		_root: component._root,
		_yield: pagination_1_yield_fragment,
		data: { size: size }
	});

	return {
		create: function () {
			div = createElement( 'div' );
			pagination_1_yield_fragment.create();
			pagination_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			pagination_1._fragment.mount( div, null );
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			pagination_1_yield_fragment.destroy();
			pagination_1.destroy( false );
		}
	};
}

function create_pagination_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var text, text_1, text_2, text_3, text_4, text_5;

	var paginationitem_7_yield_fragment = create_paginationitem_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_7 = new PaginationItem({
		_root: component._root,
		_yield: paginationitem_7_yield_fragment,
		data: { disabled: true }
	});

	var paginationitem_8_yield_fragment = create_paginationitem_1_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_8 = new PaginationItem({
		_root: component._root,
		_yield: paginationitem_8_yield_fragment,
		data: { active: true }
	});

	var paginationitem_9_yield_fragment = create_paginationitem_2_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_9 = new PaginationItem({
		_root: component._root,
		_yield: paginationitem_9_yield_fragment
	});

	var paginationitem_10_yield_fragment = create_paginationitem_3_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_10 = new PaginationItem({
		_root: component._root,
		_yield: paginationitem_10_yield_fragment
	});

	var paginationitem_11_yield_fragment = create_paginationitem_4_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_11 = new PaginationItem({
		_root: component._root,
		_yield: paginationitem_11_yield_fragment
	});

	var paginationitem_12_yield_fragment = create_paginationitem_5_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_12 = new PaginationItem({
		_root: component._root,
		_yield: paginationitem_12_yield_fragment
	});

	var paginationitem_13_yield_fragment = create_paginationitem_6_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_13 = new PaginationItem({
		_root: component._root,
		_yield: paginationitem_13_yield_fragment
	});

	return {
		create: function () {
			paginationitem_7_yield_fragment.create();
			paginationitem_7._fragment.create();
			text = createText( "\n                " );
			paginationitem_8_yield_fragment.create();
			paginationitem_8._fragment.create();
			text_1 = createText( "\n                " );
			paginationitem_9_yield_fragment.create();
			paginationitem_9._fragment.create();
			text_2 = createText( "\n                " );
			paginationitem_10_yield_fragment.create();
			paginationitem_10._fragment.create();
			text_3 = createText( "\n                " );
			paginationitem_11_yield_fragment.create();
			paginationitem_11._fragment.create();
			text_4 = createText( "\n                " );
			paginationitem_12_yield_fragment.create();
			paginationitem_12._fragment.create();
			text_5 = createText( "\n                " );
			paginationitem_13_yield_fragment.create();
			paginationitem_13._fragment.create();
		},

		mount: function ( target, anchor ) {
			paginationitem_7._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			paginationitem_8._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			paginationitem_9._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			paginationitem_10._fragment.mount( target, anchor );
			insertNode( text_3, target, anchor );
			paginationitem_11._fragment.mount( target, anchor );
			insertNode( text_4, target, anchor );
			paginationitem_12._fragment.mount( target, anchor );
			insertNode( text_5, target, anchor );
			paginationitem_13._fragment.mount( target, anchor );
		},

		unmount: function () {
			paginationitem_7._fragment.unmount();
			detachNode( text );
			paginationitem_8._fragment.unmount();
			detachNode( text_1 );
			paginationitem_9._fragment.unmount();
			detachNode( text_2 );
			paginationitem_10._fragment.unmount();
			detachNode( text_3 );
			paginationitem_11._fragment.unmount();
			detachNode( text_4 );
			paginationitem_12._fragment.unmount();
			detachNode( text_5 );
			paginationitem_13._fragment.unmount();
		},

		destroy: function () {
			paginationitem_7_yield_fragment.destroy();
			paginationitem_7.destroy( false );
			paginationitem_8_yield_fragment.destroy();
			paginationitem_8.destroy( false );
			paginationitem_9_yield_fragment.destroy();
			paginationitem_9.destroy( false );
			paginationitem_10_yield_fragment.destroy();
			paginationitem_10.destroy( false );
			paginationitem_11_yield_fragment.destroy();
			paginationitem_11.destroy( false );
			paginationitem_12_yield_fragment.destroy();
			paginationitem_12.destroy( false );
			paginationitem_13_yield_fragment.destroy();
			paginationitem_13.destroy( false );
		}
	};
}

function create_paginationitem_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "«" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = "page-link";
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_paginationitem_1_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "1" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = "page-link";
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_paginationitem_2_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "2" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = "page-link";
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_paginationitem_3_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "3" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = "page-link";
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_paginationitem_4_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "4" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = "page-link";
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_paginationitem_5_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "5" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = "page-link";
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_paginationitem_6_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a, text;

	return {
		create: function () {
			a = createElement( 'a' );
			text = createText( "»" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.className = "page-link";
			a.href = "\#";
		},

		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			appendNode( text, a );
		},

		unmount: function () {
			detachNode( a );
		},

		destroy: noop
	};
}

function create_alert_yield_fragment ( state, component ) {
	var h4, text, text_1, p, text_2, a, text_3, text_4;

	return {
		create: function () {
			h4 = createElement( 'h4' );
			text = createText( "Default" );
			text_1 = createText( "\n      " );
			p = createElement( 'p' );
			text_2 = createText( "Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna,\n        " );
			a = createElement( 'a' );
			text_3 = createText( "vel scelerisque nisl consectetur et" );
			text_4 = createText( "." );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#";
			a.className = "alert-link";
		},

		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			appendNode( text, h4 );
			insertNode( text_1, target, anchor );
			insertNode( p, target, anchor );
			appendNode( text_2, p );
			appendNode( a, p );
			appendNode( text_3, a );
			appendNode( text_4, p );
		},

		unmount: function () {
			detachNode( h4 );
			detachNode( text_1 );
			detachNode( p );
		},

		destroy: noop
	};
}

function create_row_9_yield_fragment ( state, component ) {
	var each_block_2_anchor;

	var each_block_value = ['success', 'info', 'warning', 'danger'];

	var each_block_2_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_2_iterations[i] = create_each_block_2( state, each_block_value, each_block_value[i], i, component );
	}

	return {
		create: function () {
			for ( var i = 0; i < each_block_2_iterations.length; i += 1 ) {
				each_block_2_iterations[i].create();
			}

			each_block_2_anchor = createComment();
		},

		mount: function ( target, anchor ) {
			for ( var i = 0; i < each_block_2_iterations.length; i += 1 ) {
				each_block_2_iterations[i].mount( target, anchor );
			}

			insertNode( each_block_2_anchor, target, anchor );
		},

		unmount: function () {
			for ( var i = 0; i < each_block_2_iterations.length; i += 1 ) {
				each_block_2_iterations[i].unmount();
			}

			detachNode( each_block_2_anchor );
		},

		destroy: function () {
			destroyEach( each_block_2_iterations, false, 0 );
		}
	};
}

function create_each_block_2 ( state, each_block_value, color, color_index, component ) {

	var col_1_yield_fragment = create_col_yield_fragment_8( state, each_block_value, color, color_index, component );

	var col_1 = new Col({
		_root: component._root,
		_yield: col_1_yield_fragment
	});

	return {
		create: function () {
			col_1_yield_fragment.create();
			col_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_1._fragment.unmount();
		},

		destroy: function () {
			col_1_yield_fragment.destroy();
			col_1.destroy( false );
		}
	};
}

function create_col_yield_fragment_8 ( state, each_block_value, color, color_index, component ) {

	var alert_1_yield_fragment = create_alert_yield_fragment_1( state, each_block_value, color, color_index, component );

	var alert_1 = new Alert({
		_root: component._root,
		_yield: alert_1_yield_fragment,
		data: {
			dismissible: true,
			color: color
		}
	});

	return {
		create: function () {
			alert_1_yield_fragment.create();
			alert_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			alert_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			alert_1._fragment.unmount();
		},

		destroy: function () {
			alert_1_yield_fragment.destroy();
			alert_1.destroy( false );
		}
	};
}

function create_alert_yield_fragment_1 ( state, each_block_value, color, color_index, component ) {
	var h4, text_value, text, text_1, a, text_2, text_3;

	return {
		create: function () {
			h4 = createElement( 'h4' );
			text = createText( text_value = color );
			text_1 = createText( "\n            " );
			a = createElement( 'a' );
			text_2 = createText( "Change a few things up" );
			text_3 = createText( " and try submitting again." );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			a.href = "\#";
			a.className = "alert-link";
		},

		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			appendNode( text, h4 );
			insertNode( text_1, target, anchor );
			insertNode( a, target, anchor );
			appendNode( text_2, a );
			insertNode( text_3, target, anchor );
		},

		unmount: function () {
			detachNode( h4 );
			detachNode( text_1 );
			detachNode( a );
			detachNode( text_3 );
		},

		destroy: noop
	};
}

function create_badge_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Default" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_1_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Primary" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_2_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Success" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_3_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Warning" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_4_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Danger" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_5_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Info" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_6_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Default" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_7_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Primary" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_8_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Success" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_9_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Warning" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_10_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Danger" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_badge_11_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Info" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_row_10_yield_fragment ( state, component ) {

	var col_1_yield_fragment = create_col_yield_fragment_9( state, component );

	var col_1 = new Col({
		_root: component._root,
		_yield: col_1_yield_fragment,
		data: { lg: 12 }
	});

	return {
		create: function () {
			col_1_yield_fragment.create();
			col_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_1._fragment.unmount();
		},

		destroy: function () {
			col_1_yield_fragment.destroy();
			col_1.destroy( false );
		}
	};
}

function create_col_yield_fragment_9 ( state, component ) {
	var h1, text, text_1, h3, text_2, text_3, div, text_5, h3_1, text_6, text_7, div_1, text_8, text_9, text_10, text_12, h3_2, text_13, text_14, div_2, text_16, h3_3, text_17, text_18, div_3, text_19, text_20, text_21, text_22, text_24, h3_4, text_25, text_26, div_4, text_27, text_28, text_29, text_30;

	var progress_1 = new Progress({
		_root: component._root,
		data: { value: 25, min: 0, max: 100 }
	});

	var progress_2 = new Progress({
		_root: component._root,
		data: {
			color: "success",
			value: 25,
			min: 0,
			max: 100
		}
	});

	var progress_3 = new Progress({
		_root: component._root,
		data: {
			color: "info",
			value: 50,
			min: 0,
			max: 100
		}
	});

	var progress_4 = new Progress({
		_root: component._root,
		data: {
			color: "warning",
			value: 75,
			min: 0,
			max: 100
		}
	});

	var progress_5 = new Progress({
		_root: component._root,
		data: {
			color: "danger",
			value: 100,
			min: 0,
			max: 100
		}
	});

	var progress_6_yield_fragment = create_progress_yield_fragment( state, component );

	var progress_6 = new Progress({
		_root: component._root,
		_yield: progress_6_yield_fragment,
		data: { multi: true }
	});

	var progress_7 = new Progress({
		_root: component._root,
		data: {
			striped: true,
			value: 15,
			min: 0,
			max: 100
		}
	});

	var progress_8 = new Progress({
		_root: component._root,
		data: {
			striped: true,
			color: "success",
			value: 25,
			min: 0,
			max: 100
		}
	});

	var progress_9 = new Progress({
		_root: component._root,
		data: {
			striped: true,
			color: "info",
			value: 50,
			min: 0,
			max: 100
		}
	});

	var progress_10 = new Progress({
		_root: component._root,
		data: {
			striped: true,
			color: "warning",
			value: 75,
			min: 0,
			max: 100
		}
	});

	var progress_11 = new Progress({
		_root: component._root,
		data: {
			striped: true,
			color: "danger",
			value: 100,
			min: 0,
			max: 100
		}
	});

	var progress_12 = new Progress({
		_root: component._root,
		data: {
			animated: true,
			striped: true,
			value: 15,
			min: 0,
			max: 100
		}
	});

	var progress_13 = new Progress({
		_root: component._root,
		data: {
			animated: true,
			striped: true,
			color: "success",
			value: 25,
			min: 0,
			max: 100
		}
	});

	var progress_14 = new Progress({
		_root: component._root,
		data: {
			animated: true,
			striped: true,
			color: "info",
			value: 50,
			min: 0,
			max: 100
		}
	});

	var progress_15 = new Progress({
		_root: component._root,
		data: {
			animated: true,
			striped: true,
			color: "warning",
			value: 75,
			min: 0,
			max: 100
		}
	});

	var progress_16 = new Progress({
		_root: component._root,
		data: {
			animated: true,
			striped: true,
			color: "danger",
			value: 100,
			min: 0,
			max: 100
		}
	});

	return {
		create: function () {
			h1 = createElement( 'h1' );
			text = createText( "Progress" );
			text_1 = createText( "\n\n        " );
			h3 = createElement( 'h3' );
			text_2 = createText( "Basic" );
			text_3 = createText( "\n        " );
			div = createElement( 'div' );
			progress_1._fragment.create();
			text_5 = createText( "\n\n        " );
			h3_1 = createElement( 'h3' );
			text_6 = createText( "Contextual alternatives" );
			text_7 = createText( "\n        " );
			div_1 = createElement( 'div' );
			progress_2._fragment.create();
			text_8 = createText( "\n          " );
			progress_3._fragment.create();
			text_9 = createText( "\n          " );
			progress_4._fragment.create();
			text_10 = createText( "\n          " );
			progress_5._fragment.create();
			text_12 = createText( "\n\n        " );
			h3_2 = createElement( 'h3' );
			text_13 = createText( "Multiple bars" );
			text_14 = createText( "\n        " );
			div_2 = createElement( 'div' );
			progress_6_yield_fragment.create();
			progress_6._fragment.create();
			text_16 = createText( "\n\n        " );
			h3_3 = createElement( 'h3' );
			text_17 = createText( "Striped" );
			text_18 = createText( "\n        " );
			div_3 = createElement( 'div' );
			progress_7._fragment.create();
			text_19 = createText( "\n          " );
			progress_8._fragment.create();
			text_20 = createText( "\n          " );
			progress_9._fragment.create();
			text_21 = createText( "\n          " );
			progress_10._fragment.create();
			text_22 = createText( "\n          " );
			progress_11._fragment.create();
			text_24 = createText( "\n\n        " );
			h3_4 = createElement( 'h3' );
			text_25 = createText( "Animated" );
			text_26 = createText( "\n        " );
			div_4 = createElement( 'div' );
			progress_12._fragment.create();
			text_27 = createText( "\n          " );
			progress_13._fragment.create();
			text_28 = createText( "\n          " );
			progress_14._fragment.create();
			text_29 = createText( "\n          " );
			progress_15._fragment.create();
			text_30 = createText( "\n          " );
			progress_16._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h1.id = "progress";
			h1.className = "text-muted my-4";
			h3.id = "progress-basic";
			h3.className = "text-muted my-4";
			h3_1.id = "progress-alternatives";
			h3_1.className = "text-muted my-4";
			h3_2.id = "progress-multiple";
			h3_2.className = "text-muted my-4";
			h3_3.id = "progress-striped";
			h3_3.className = "text-muted my-4";
			h3_4.id = "progress-animated";
			h3_4.className = "text-muted my-4";
		},

		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			appendNode( text, h1 );
			insertNode( text_1, target, anchor );
			insertNode( h3, target, anchor );
			appendNode( text_2, h3 );
			insertNode( text_3, target, anchor );
			insertNode( div, target, anchor );
			progress_1._fragment.mount( div, null );
			insertNode( text_5, target, anchor );
			insertNode( h3_1, target, anchor );
			appendNode( text_6, h3_1 );
			insertNode( text_7, target, anchor );
			insertNode( div_1, target, anchor );
			progress_2._fragment.mount( div_1, null );
			appendNode( text_8, div_1 );
			progress_3._fragment.mount( div_1, null );
			appendNode( text_9, div_1 );
			progress_4._fragment.mount( div_1, null );
			appendNode( text_10, div_1 );
			progress_5._fragment.mount( div_1, null );
			insertNode( text_12, target, anchor );
			insertNode( h3_2, target, anchor );
			appendNode( text_13, h3_2 );
			insertNode( text_14, target, anchor );
			insertNode( div_2, target, anchor );
			progress_6._fragment.mount( div_2, null );
			insertNode( text_16, target, anchor );
			insertNode( h3_3, target, anchor );
			appendNode( text_17, h3_3 );
			insertNode( text_18, target, anchor );
			insertNode( div_3, target, anchor );
			progress_7._fragment.mount( div_3, null );
			appendNode( text_19, div_3 );
			progress_8._fragment.mount( div_3, null );
			appendNode( text_20, div_3 );
			progress_9._fragment.mount( div_3, null );
			appendNode( text_21, div_3 );
			progress_10._fragment.mount( div_3, null );
			appendNode( text_22, div_3 );
			progress_11._fragment.mount( div_3, null );
			insertNode( text_24, target, anchor );
			insertNode( h3_4, target, anchor );
			appendNode( text_25, h3_4 );
			insertNode( text_26, target, anchor );
			insertNode( div_4, target, anchor );
			progress_12._fragment.mount( div_4, null );
			appendNode( text_27, div_4 );
			progress_13._fragment.mount( div_4, null );
			appendNode( text_28, div_4 );
			progress_14._fragment.mount( div_4, null );
			appendNode( text_29, div_4 );
			progress_15._fragment.mount( div_4, null );
			appendNode( text_30, div_4 );
			progress_16._fragment.mount( div_4, null );
		},

		unmount: function () {
			detachNode( h1 );
			detachNode( text_1 );
			detachNode( h3 );
			detachNode( text_3 );
			detachNode( div );
			detachNode( text_5 );
			detachNode( h3_1 );
			detachNode( text_7 );
			detachNode( div_1 );
			detachNode( text_12 );
			detachNode( h3_2 );
			detachNode( text_14 );
			detachNode( div_2 );
			detachNode( text_16 );
			detachNode( h3_3 );
			detachNode( text_18 );
			detachNode( div_3 );
			detachNode( text_24 );
			detachNode( h3_4 );
			detachNode( text_26 );
			detachNode( div_4 );
		},

		destroy: function () {
			progress_1.destroy( false );
			progress_2.destroy( false );
			progress_3.destroy( false );
			progress_4.destroy( false );
			progress_5.destroy( false );
			progress_6_yield_fragment.destroy();
			progress_6.destroy( false );
			progress_7.destroy( false );
			progress_8.destroy( false );
			progress_9.destroy( false );
			progress_10.destroy( false );
			progress_11.destroy( false );
			progress_12.destroy( false );
			progress_13.destroy( false );
			progress_14.destroy( false );
			progress_15.destroy( false );
			progress_16.destroy( false );
		}
	};
}

function create_progress_yield_fragment ( state, component ) {
	var text, text_1;

	var progress = new Progress({
		_root: component._root,
		data: { bar: true, value: 25 }
	});

	var progress_1 = new Progress({
		_root: component._root,
		data: { bar: true, color: "success", value: 30 }
	});

	var progress_2 = new Progress({
		_root: component._root,
		data: { bar: true, color: "info", value: 20 }
	});

	return {
		create: function () {
			progress._fragment.create();
			text = createText( "\n            " );
			progress_1._fragment.create();
			text_1 = createText( "\n            " );
			progress_2._fragment.create();
		},

		mount: function ( target, anchor ) {
			progress._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			progress_1._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			progress_2._fragment.mount( target, anchor );
		},

		unmount: function () {
			progress._fragment.unmount();
			detachNode( text );
			progress_1._fragment.unmount();
			detachNode( text_1 );
			progress_2._fragment.unmount();
		},

		destroy: function () {
			progress.destroy( false );
			progress_1.destroy( false );
			progress_2.destroy( false );
		}
	};
}

function create_row_11_yield_fragment ( state, component ) {

	var col_1_yield_fragment = create_col_yield_fragment_10( state, component );

	var col_1 = new Col({
		_root: component._root,
		_yield: col_1_yield_fragment,
		data: { lg: 12 }
	});

	return {
		create: function () {
			col_1_yield_fragment.create();
			col_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_1._fragment.unmount();
		},

		destroy: function () {
			col_1_yield_fragment.destroy();
			col_1.destroy( false );
		}
	};
}

function create_col_yield_fragment_10 ( state, component ) {
	var h1, text, text_1;

	var jumbotron_1_yield_fragment = create_jumbotron_yield_fragment( state, component );

	var jumbotron_1 = new Jumbotron({
		_root: component._root,
		_yield: jumbotron_1_yield_fragment
	});

	return {
		create: function () {
			h1 = createElement( 'h1' );
			text = createText( "Containers" );
			text_1 = createText( "\n        " );
			jumbotron_1_yield_fragment.create();
			jumbotron_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h1.id = "containers";
		},

		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			appendNode( text, h1 );
			insertNode( text_1, target, anchor );
			jumbotron_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( h1 );
			detachNode( text_1 );
			jumbotron_1._fragment.unmount();
		},

		destroy: function () {
			jumbotron_1_yield_fragment.destroy();
			jumbotron_1.destroy( false );
		}
	};
}

function create_jumbotron_yield_fragment ( state, component ) {
	var h1, text, text_1, p, text_2, text_3, p_1;

	var button_1_yield_fragment = create_button_yield_fragment_11( state, component );

	var button_1 = new Button({
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: {
			color: "primary",
			size: "lg",
			href: "\#"
		}
	});

	return {
		create: function () {
			h1 = createElement( 'h1' );
			text = createText( "Jumbotron" );
			text_1 = createText( "\n          " );
			p = createElement( 'p' );
			text_2 = createText( "This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information." );
			text_3 = createText( "\n          " );
			p_1 = createElement( 'p' );
			button_1_yield_fragment.create();
			button_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			h1.className = "display-3";
		},

		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			appendNode( text, h1 );
			insertNode( text_1, target, anchor );
			insertNode( p, target, anchor );
			appendNode( text_2, p );
			insertNode( text_3, target, anchor );
			insertNode( p_1, target, anchor );
			button_1._fragment.mount( p_1, null );
		},

		unmount: function () {
			detachNode( h1 );
			detachNode( text_1 );
			detachNode( p );
			detachNode( text_3 );
			detachNode( p_1 );
		},

		destroy: function () {
			button_1_yield_fragment.destroy();
			button_1.destroy( false );
		}
	};
}

function create_button_yield_fragment_11 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Learn more" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_row_12_yield_fragment ( state, component ) {
	var text, text_1;

	var col_3_yield_fragment = create_col_yield_fragment_11( state, component );

	var col_3 = new Col({
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 4 }
	});

	var col_4_yield_fragment = create_col_1_yield_fragment_6( state, component );

	var col_4 = new Col({
		_root: component._root,
		_yield: col_4_yield_fragment,
		data: { lg: 4 }
	});

	var col_5_yield_fragment = create_col_2_yield_fragment( state, component );

	var col_5 = new Col({
		_root: component._root,
		_yield: col_5_yield_fragment,
		data: { lg: 4 }
	});

	return {
		create: function () {
			col_3_yield_fragment.create();
			col_3._fragment.create();
			text = createText( "\n\n      " );
			col_4_yield_fragment.create();
			col_4._fragment.create();
			text_1 = createText( "\n\n      " );
			col_5_yield_fragment.create();
			col_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			col_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_3._fragment.unmount();
			detachNode( text );
			col_4._fragment.unmount();
			detachNode( text_1 );
			col_5._fragment.unmount();
		},

		destroy: function () {
			col_3_yield_fragment.destroy();
			col_3.destroy( false );
			col_4_yield_fragment.destroy();
			col_4.destroy( false );
			col_5_yield_fragment.destroy();
			col_5.destroy( false );
		}
	};
}

function create_col_yield_fragment_11 ( state, component ) {

	var listgroup_1_yield_fragment = create_listgroup_yield_fragment_1( state, component );

	var listgroup_1 = new ListGroup({
		_root: component._root,
		_yield: listgroup_1_yield_fragment
	});

	return {
		create: function () {
			listgroup_1_yield_fragment.create();
			listgroup_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			listgroup_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			listgroup_1._fragment.unmount();
		},

		destroy: function () {
			listgroup_1_yield_fragment.destroy();
			listgroup_1.destroy( false );
		}
	};
}

function create_listgroup_yield_fragment_1 ( state, component ) {
	var text, text_1;

	var listgroupitem_3_yield_fragment = create_listgroupitem_yield_fragment_1( state, component );

	var listgroupitem_3 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_3_yield_fragment,
		data: { class: "justify-content-between" }
	});

	var listgroupitem_4_yield_fragment = create_listgroupitem_1_yield_fragment_1( state, component );

	var listgroupitem_4 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_4_yield_fragment,
		data: { class: "justify-content-between" }
	});

	var listgroupitem_5_yield_fragment = create_listgroupitem_2_yield_fragment_1( state, component );

	var listgroupitem_5 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_5_yield_fragment,
		data: { class: "justify-content-between" }
	});

	return {
		create: function () {
			listgroupitem_3_yield_fragment.create();
			listgroupitem_3._fragment.create();
			text = createText( "\n          " );
			listgroupitem_4_yield_fragment.create();
			listgroupitem_4._fragment.create();
			text_1 = createText( "\n          " );
			listgroupitem_5_yield_fragment.create();
			listgroupitem_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			listgroupitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitem_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			listgroupitem_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			listgroupitem_3._fragment.unmount();
			detachNode( text );
			listgroupitem_4._fragment.unmount();
			detachNode( text_1 );
			listgroupitem_5._fragment.unmount();
		},

		destroy: function () {
			listgroupitem_3_yield_fragment.destroy();
			listgroupitem_3.destroy( false );
			listgroupitem_4_yield_fragment.destroy();
			listgroupitem_4.destroy( false );
			listgroupitem_5_yield_fragment.destroy();
			listgroupitem_5.destroy( false );
		}
	};
}

function create_listgroupitem_yield_fragment_1 ( state, component ) {
	var text;

	var badge_1_yield_fragment = create_badge_yield_fragment_1( state, component );

	var badge_1 = new Badge({
		_root: component._root,
		_yield: badge_1_yield_fragment,
		data: { pill: true }
	});

	return {
		create: function () {
			text = createText( "Cras justo odio" );
			badge_1_yield_fragment.create();
			badge_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			badge_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( text );
			badge_1._fragment.unmount();
		},

		destroy: function () {
			badge_1_yield_fragment.destroy();
			badge_1.destroy( false );
		}
	};
}

function create_badge_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "14" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_listgroupitem_1_yield_fragment_1 ( state, component ) {
	var text;

	var badge_1_yield_fragment = create_badge_yield_fragment_2( state, component );

	var badge_1 = new Badge({
		_root: component._root,
		_yield: badge_1_yield_fragment,
		data: { pill: true }
	});

	return {
		create: function () {
			text = createText( "Dapibus ac facilisis in" );
			badge_1_yield_fragment.create();
			badge_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			badge_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( text );
			badge_1._fragment.unmount();
		},

		destroy: function () {
			badge_1_yield_fragment.destroy();
			badge_1.destroy( false );
		}
	};
}

function create_badge_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "2" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_listgroupitem_2_yield_fragment_1 ( state, component ) {
	var text;

	var badge_1_yield_fragment = create_badge_yield_fragment_3( state, component );

	var badge_1 = new Badge({
		_root: component._root,
		_yield: badge_1_yield_fragment,
		data: { pill: true }
	});

	return {
		create: function () {
			text = createText( "Morbi leo risus" );
			badge_1_yield_fragment.create();
			badge_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			badge_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( text );
			badge_1._fragment.unmount();
		},

		destroy: function () {
			badge_1_yield_fragment.destroy();
			badge_1.destroy( false );
		}
	};
}

function create_badge_yield_fragment_3 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "1" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_col_1_yield_fragment_6 ( state, component ) {

	var listgroup_1_yield_fragment = create_listgroup_yield_fragment_2( state, component );

	var listgroup_1 = new ListGroup({
		_root: component._root,
		_yield: listgroup_1_yield_fragment
	});

	return {
		create: function () {
			listgroup_1_yield_fragment.create();
			listgroup_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			listgroup_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			listgroup_1._fragment.unmount();
		},

		destroy: function () {
			listgroup_1_yield_fragment.destroy();
			listgroup_1.destroy( false );
		}
	};
}

function create_listgroup_yield_fragment_2 ( state, component ) {
	var text, text_1;

	var listgroupitem_3_yield_fragment = create_listgroupitem_yield_fragment_2( state, component );

	var listgroupitem_3 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_3_yield_fragment,
		data: { action: true, active: true }
	});

	var listgroupitem_4_yield_fragment = create_listgroupitem_1_yield_fragment_2( state, component );

	var listgroupitem_4 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_4_yield_fragment,
		data: { action: true }
	});

	var listgroupitem_5_yield_fragment = create_listgroupitem_2_yield_fragment_2( state, component );

	var listgroupitem_5 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_5_yield_fragment,
		data: { action: true, disabled: true }
	});

	return {
		create: function () {
			listgroupitem_3_yield_fragment.create();
			listgroupitem_3._fragment.create();
			text = createText( "\n          " );
			listgroupitem_4_yield_fragment.create();
			listgroupitem_4._fragment.create();
			text_1 = createText( "\n          " );
			listgroupitem_5_yield_fragment.create();
			listgroupitem_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			listgroupitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitem_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			listgroupitem_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			listgroupitem_3._fragment.unmount();
			detachNode( text );
			listgroupitem_4._fragment.unmount();
			detachNode( text_1 );
			listgroupitem_5._fragment.unmount();
		},

		destroy: function () {
			listgroupitem_3_yield_fragment.destroy();
			listgroupitem_3.destroy( false );
			listgroupitem_4_yield_fragment.destroy();
			listgroupitem_4.destroy( false );
			listgroupitem_5_yield_fragment.destroy();
			listgroupitem_5.destroy( false );
		}
	};
}

function create_listgroupitem_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Cras justo odio" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_listgroupitem_1_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Dapibus ac facilisis in" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_listgroupitem_2_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Morbi leo risus" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_col_2_yield_fragment ( state, component ) {

	var listgroup_1_yield_fragment = create_listgroup_yield_fragment_3( state, component );

	var listgroup_1 = new ListGroup({
		_root: component._root,
		_yield: listgroup_1_yield_fragment
	});

	return {
		create: function () {
			listgroup_1_yield_fragment.create();
			listgroup_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			listgroup_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			listgroup_1._fragment.unmount();
		},

		destroy: function () {
			listgroup_1_yield_fragment.destroy();
			listgroup_1.destroy( false );
		}
	};
}

function create_listgroup_yield_fragment_3 ( state, component ) {
	var text;

	var listgroupitem_2_yield_fragment = create_listgroupitem_yield_fragment_3( state, component );

	var listgroupitem_2 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_2_yield_fragment,
		data: { action: true, active: true }
	});

	var listgroupitem_3_yield_fragment = create_listgroupitem_1_yield_fragment_3( state, component );

	var listgroupitem_3 = new ListGroupItem({
		_root: component._root,
		_yield: listgroupitem_3_yield_fragment,
		data: { action: true }
	});

	return {
		create: function () {
			listgroupitem_2_yield_fragment.create();
			listgroupitem_2._fragment.create();
			text = createText( "\n          " );
			listgroupitem_3_yield_fragment.create();
			listgroupitem_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			listgroupitem_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitem_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			listgroupitem_2._fragment.unmount();
			detachNode( text );
			listgroupitem_3._fragment.unmount();
		},

		destroy: function () {
			listgroupitem_2_yield_fragment.destroy();
			listgroupitem_2.destroy( false );
			listgroupitem_3_yield_fragment.destroy();
			listgroupitem_3.destroy( false );
		}
	};
}

function create_listgroupitem_yield_fragment_3 ( state, component ) {
	var text;

	var listgroupitemheading_1_yield_fragment = create_listgroupitemheading_yield_fragment( state, component );

	var listgroupitemheading_1 = new ListGroupItemHeading({
		_root: component._root,
		_yield: listgroupitemheading_1_yield_fragment
	});

	var listgroupitemtext_1_yield_fragment = create_listgroupitemtext_yield_fragment( state, component );

	var listgroupitemtext_1 = new ListGroupItemText({
		_root: component._root,
		_yield: listgroupitemtext_1_yield_fragment
	});

	return {
		create: function () {
			listgroupitemheading_1_yield_fragment.create();
			listgroupitemheading_1._fragment.create();
			text = createText( "\n            " );
			listgroupitemtext_1_yield_fragment.create();
			listgroupitemtext_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			listgroupitemheading_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitemtext_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			listgroupitemheading_1._fragment.unmount();
			detachNode( text );
			listgroupitemtext_1._fragment.unmount();
		},

		destroy: function () {
			listgroupitemheading_1_yield_fragment.destroy();
			listgroupitemheading_1.destroy( false );
			listgroupitemtext_1_yield_fragment.destroy();
			listgroupitemtext_1.destroy( false );
		}
	};
}

function create_listgroupitemheading_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "List group item heading" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_listgroupitemtext_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Donec id elit non mi porta gravida at eget metus.\n              Maecenas sed diam eget risus varius blandit." );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_listgroupitem_1_yield_fragment_3 ( state, component ) {
	var text;

	var listgroupitemheading_1_yield_fragment = create_listgroupitemheading_yield_fragment_1( state, component );

	var listgroupitemheading_1 = new ListGroupItemHeading({
		_root: component._root,
		_yield: listgroupitemheading_1_yield_fragment
	});

	var listgroupitemtext_1_yield_fragment = create_listgroupitemtext_yield_fragment_1( state, component );

	var listgroupitemtext_1 = new ListGroupItemText({
		_root: component._root,
		_yield: listgroupitemtext_1_yield_fragment
	});

	return {
		create: function () {
			listgroupitemheading_1_yield_fragment.create();
			listgroupitemheading_1._fragment.create();
			text = createText( "\n            " );
			listgroupitemtext_1_yield_fragment.create();
			listgroupitemtext_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			listgroupitemheading_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitemtext_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			listgroupitemheading_1._fragment.unmount();
			detachNode( text );
			listgroupitemtext_1._fragment.unmount();
		},

		destroy: function () {
			listgroupitemheading_1_yield_fragment.destroy();
			listgroupitemheading_1.destroy( false );
			listgroupitemtext_1_yield_fragment.destroy();
			listgroupitemtext_1.destroy( false );
		}
	};
}

function create_listgroupitemheading_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "List group item heading" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_listgroupitemtext_yield_fragment_1 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Donec id elit non mi porta gravida at eget metus.\n              Maecenas sed diam eget risus varius blandit." );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_row_13_yield_fragment ( state, component ) {
	var text, text_1;

	var col_3_yield_fragment = create_col_yield_fragment_12( state, component );

	var col_3 = new Col({
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 4 }
	});

	var col_4_yield_fragment = create_col_1_yield_fragment_7( state, component );

	var col_4 = new Col({
		_root: component._root,
		_yield: col_4_yield_fragment,
		data: { lg: 4 }
	});

	var col_5_yield_fragment = create_col_2_yield_fragment_1( state, component );

	var col_5 = new Col({
		_root: component._root,
		_yield: col_5_yield_fragment,
		data: { lg: 4 }
	});

	return {
		create: function () {
			col_3_yield_fragment.create();
			col_3._fragment.create();
			text = createText( "\n\n      " );
			col_4_yield_fragment.create();
			col_4._fragment.create();
			text_1 = createText( "\n\n      " );
			col_5_yield_fragment.create();
			col_5._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			col_5._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_3._fragment.unmount();
			detachNode( text );
			col_4._fragment.unmount();
			detachNode( text_1 );
			col_5._fragment.unmount();
		},

		destroy: function () {
			col_3_yield_fragment.destroy();
			col_3.destroy( false );
			col_4_yield_fragment.destroy();
			col_4.destroy( false );
			col_5_yield_fragment.destroy();
			col_5.destroy( false );
		}
	};
}

function create_col_yield_fragment_12 ( state, component ) {
	var each_block_3_anchor;

	var each_block_value = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];

	var each_block_3_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_3_iterations[i] = create_each_block_3( state, each_block_value, each_block_value[i], i, component );
	}

	return {
		create: function () {
			for ( var i = 0; i < each_block_3_iterations.length; i += 1 ) {
				each_block_3_iterations[i].create();
			}

			each_block_3_anchor = createComment();
		},

		mount: function ( target, anchor ) {
			for ( var i = 0; i < each_block_3_iterations.length; i += 1 ) {
				each_block_3_iterations[i].mount( target, anchor );
			}

			insertNode( each_block_3_anchor, target, anchor );
		},

		unmount: function () {
			for ( var i = 0; i < each_block_3_iterations.length; i += 1 ) {
				each_block_3_iterations[i].unmount();
			}

			detachNode( each_block_3_anchor );
		},

		destroy: function () {
			destroyEach( each_block_3_iterations, false, 0 );
		}
	};
}

function create_each_block_3 ( state, each_block_value, color_1, color_index, component ) {

	var card_1_yield_fragment = create_card_yield_fragment( state, each_block_value, color_1, color_index, component );

	var card_1 = new Card({
		_root: component._root,
		_yield: card_1_yield_fragment,
		data: {
			class: "mb-3 text-xs-center",
			color: color_1
		}
	});

	return {
		create: function () {
			card_1_yield_fragment.create();
			card_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			card_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			card_1._fragment.unmount();
		},

		destroy: function () {
			card_1_yield_fragment.destroy();
			card_1.destroy( false );
		}
	};
}

function create_card_yield_fragment ( state, each_block_value, color_1, color_index, component ) {

	var cardblock_1_yield_fragment = create_cardblock_yield_fragment( state, each_block_value, color_1, color_index, component );

	var cardblock_1 = new CardBlock({
		_root: component._root,
		_yield: cardblock_1_yield_fragment
	});

	return {
		create: function () {
			cardblock_1_yield_fragment.create();
			cardblock_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			cardblock_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			cardblock_1._fragment.unmount();
		},

		destroy: function () {
			cardblock_1_yield_fragment.destroy();
			cardblock_1.destroy( false );
		}
	};
}

function create_cardblock_yield_fragment ( state, each_block_value, color_1, color_index, component ) {
	var text, blockquote, p, text_1, text_2, footer, text_3, cite, text_4;

	var cardtitle_1_yield_fragment = create_cardtitle_yield_fragment( state, each_block_value, color_1, color_index, component );

	var cardtitle_1 = new CardTitle({
		_root: component._root,
		_yield: cardtitle_1_yield_fragment
	});

	return {
		create: function () {
			cardtitle_1_yield_fragment.create();
			cardtitle_1._fragment.create();
			text = createText( "\n              " );
			blockquote = createElement( 'blockquote' );
			p = createElement( 'p' );
			text_1 = createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." );
			text_2 = createText( "\n                " );
			footer = createElement( 'footer' );
			text_3 = createText( "Someone famous in " );
			cite = createElement( 'cite' );
			text_4 = createText( "Source Title" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			blockquote.className = "card-blockquote";
			cite.title = "Source Title";
		},

		mount: function ( target, anchor ) {
			cardtitle_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			insertNode( blockquote, target, anchor );
			appendNode( p, blockquote );
			appendNode( text_1, p );
			appendNode( text_2, blockquote );
			appendNode( footer, blockquote );
			appendNode( text_3, footer );
			appendNode( cite, footer );
			appendNode( text_4, cite );
		},

		unmount: function () {
			cardtitle_1._fragment.unmount();
			detachNode( text );
			detachNode( blockquote );
		},

		destroy: function () {
			cardtitle_1_yield_fragment.destroy();
			cardtitle_1.destroy( false );
		}
	};
}

function create_cardtitle_yield_fragment ( state, each_block_value, color_1, color_index, component ) {
	var text_value, text;

	return {
		create: function () {
			text = createText( text_value = color_1 );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_col_1_yield_fragment_7 ( state, component ) {
	var each_block_4_anchor;

	var each_block_value = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];

	var each_block_4_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_4_iterations[i] = create_each_block_4( state, each_block_value, each_block_value[i], i, component );
	}

	return {
		create: function () {
			for ( var i = 0; i < each_block_4_iterations.length; i += 1 ) {
				each_block_4_iterations[i].create();
			}

			each_block_4_anchor = createComment();
		},

		mount: function ( target, anchor ) {
			for ( var i = 0; i < each_block_4_iterations.length; i += 1 ) {
				each_block_4_iterations[i].mount( target, anchor );
			}

			insertNode( each_block_4_anchor, target, anchor );
		},

		unmount: function () {
			for ( var i = 0; i < each_block_4_iterations.length; i += 1 ) {
				each_block_4_iterations[i].unmount();
			}

			detachNode( each_block_4_anchor );
		},

		destroy: function () {
			destroyEach( each_block_4_iterations, false, 0 );
		}
	};
}

function create_each_block_4 ( state, each_block_value, color_2, color_index, component ) {

	var card_1_yield_fragment = create_card_yield_fragment_1( state, each_block_value, color_2, color_index, component );

	var card_1 = new Card({
		_root: component._root,
		_yield: card_1_yield_fragment,
		data: {
			outline: true,
			class: "mb-3 text-xs-center",
			color: color_2
		}
	});

	return {
		create: function () {
			card_1_yield_fragment.create();
			card_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			card_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			card_1._fragment.unmount();
		},

		destroy: function () {
			card_1_yield_fragment.destroy();
			card_1.destroy( false );
		}
	};
}

function create_card_yield_fragment_1 ( state, each_block_value, color_2, color_index, component ) {

	var cardblock_1_yield_fragment = create_cardblock_yield_fragment_1( state, each_block_value, color_2, color_index, component );

	var cardblock_1 = new CardBlock({
		_root: component._root,
		_yield: cardblock_1_yield_fragment
	});

	return {
		create: function () {
			cardblock_1_yield_fragment.create();
			cardblock_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			cardblock_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			cardblock_1._fragment.unmount();
		},

		destroy: function () {
			cardblock_1_yield_fragment.destroy();
			cardblock_1.destroy( false );
		}
	};
}

function create_cardblock_yield_fragment_1 ( state, each_block_value, color_2, color_index, component ) {
	var text, blockquote, p, text_1, text_2, footer, text_3, cite, text_4;

	var cardtitle_1_yield_fragment = create_cardtitle_yield_fragment_1( state, each_block_value, color_2, color_index, component );

	var cardtitle_1 = new CardTitle({
		_root: component._root,
		_yield: cardtitle_1_yield_fragment
	});

	return {
		create: function () {
			cardtitle_1_yield_fragment.create();
			cardtitle_1._fragment.create();
			text = createText( "\n              " );
			blockquote = createElement( 'blockquote' );
			p = createElement( 'p' );
			text_1 = createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." );
			text_2 = createText( "\n                " );
			footer = createElement( 'footer' );
			text_3 = createText( "Someone famous in " );
			cite = createElement( 'cite' );
			text_4 = createText( "Source Title" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			blockquote.className = "card-blockquote";
			cite.title = "Source Title";
		},

		mount: function ( target, anchor ) {
			cardtitle_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			insertNode( blockquote, target, anchor );
			appendNode( p, blockquote );
			appendNode( text_1, p );
			appendNode( text_2, blockquote );
			appendNode( footer, blockquote );
			appendNode( text_3, footer );
			appendNode( cite, footer );
			appendNode( text_4, cite );
		},

		unmount: function () {
			cardtitle_1._fragment.unmount();
			detachNode( text );
			detachNode( blockquote );
		},

		destroy: function () {
			cardtitle_1_yield_fragment.destroy();
			cardtitle_1.destroy( false );
		}
	};
}

function create_cardtitle_yield_fragment_1 ( state, each_block_value, color_2, color_index, component ) {
	var text_value, text;

	return {
		create: function () {
			text = createText( text_value = color_2 );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_col_2_yield_fragment_1 ( state, component ) {

	var card_1_yield_fragment = create_card_yield_fragment_2( state, component );

	var card_1 = new Card({
		_root: component._root,
		_yield: card_1_yield_fragment
	});

	return {
		create: function () {
			card_1_yield_fragment.create();
			card_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			card_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			card_1._fragment.unmount();
		},

		destroy: function () {
			card_1_yield_fragment.destroy();
			card_1.destroy( false );
		}
	};
}

function create_card_yield_fragment_2 ( state, component ) {
	var text, text_1, img, text_2, text_3;

	var cardheader_1_yield_fragment = create_cardheader_yield_fragment( state, component );

	var cardheader_1 = new CardHeader({
		_root: component._root,
		_yield: cardheader_1_yield_fragment
	});

	var cardblock_2_yield_fragment = create_cardblock_yield_fragment_2( state, component );

	var cardblock_2 = new CardBlock({
		_root: component._root,
		_yield: cardblock_2_yield_fragment
	});

	var cardblock_3_yield_fragment = create_cardblock_1_yield_fragment( state, component );

	var cardblock_3 = new CardBlock({
		_root: component._root,
		_yield: cardblock_3_yield_fragment
	});

	var cardfooter_1_yield_fragment = create_cardfooter_yield_fragment( state, component );

	var cardfooter_1 = new CardFooter({
		_root: component._root,
		_yield: cardfooter_1_yield_fragment,
		data: { class: "text-muted text-xs-center" }
	});

	return {
		create: function () {
			cardheader_1_yield_fragment.create();
			cardheader_1._fragment.create();
			text = createText( "\n          " );
			cardblock_2_yield_fragment.create();
			cardblock_2._fragment.create();
			text_1 = createText( "\n          " );
			img = createElement( 'img' );
			text_2 = createText( "\n          " );
			cardblock_3_yield_fragment.create();
			cardblock_3._fragment.create();
			text_3 = createText( "\n          " );
			cardfooter_1_yield_fragment.create();
			cardfooter_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			img.style.cssText = "height: 200px; width: 100%; display: block;";
			img.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22318%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20318%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_158bd1d28ef%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_158bd1d28ef%22%3E%3Crect%20width%3D%22318%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22129.359375%22%20y%3D%2297.35%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
			img.alt = "Card image";
		},

		mount: function ( target, anchor ) {
			cardheader_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			cardblock_2._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( img, target, anchor );
			insertNode( text_2, target, anchor );
			cardblock_3._fragment.mount( target, anchor );
			insertNode( text_3, target, anchor );
			cardfooter_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			cardheader_1._fragment.unmount();
			detachNode( text );
			cardblock_2._fragment.unmount();
			detachNode( text_1 );
			detachNode( img );
			detachNode( text_2 );
			cardblock_3._fragment.unmount();
			detachNode( text_3 );
			cardfooter_1._fragment.unmount();
		},

		destroy: function () {
			cardheader_1_yield_fragment.destroy();
			cardheader_1.destroy( false );
			cardblock_2_yield_fragment.destroy();
			cardblock_2.destroy( false );
			cardblock_3_yield_fragment.destroy();
			cardblock_3.destroy( false );
			cardfooter_1_yield_fragment.destroy();
			cardfooter_1.destroy( false );
		}
	};
}

function create_cardheader_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Card header" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_cardblock_yield_fragment_2 ( state, component ) {
	var text;

	var cardtitle_1_yield_fragment = create_cardtitle_yield_fragment_2( state, component );

	var cardtitle_1 = new CardTitle({
		_root: component._root,
		_yield: cardtitle_1_yield_fragment
	});

	var cardsubtitle_1_yield_fragment = create_cardsubtitle_yield_fragment( state, component );

	var cardsubtitle_1 = new CardSubtitle({
		_root: component._root,
		_yield: cardsubtitle_1_yield_fragment,
		data: { class: "text-muted" }
	});

	return {
		create: function () {
			cardtitle_1_yield_fragment.create();
			cardtitle_1._fragment.create();
			text = createText( "\n            " );
			cardsubtitle_1_yield_fragment.create();
			cardsubtitle_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			cardtitle_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			cardsubtitle_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			cardtitle_1._fragment.unmount();
			detachNode( text );
			cardsubtitle_1._fragment.unmount();
		},

		destroy: function () {
			cardtitle_1_yield_fragment.destroy();
			cardtitle_1.destroy( false );
			cardsubtitle_1_yield_fragment.destroy();
			cardsubtitle_1.destroy( false );
		}
	};
}

function create_cardtitle_yield_fragment_2 ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Special title treatment" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_cardsubtitle_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "Support card subtitle" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_cardblock_1_yield_fragment ( state, component ) {
	var p, text, text_1, a, text_2, text_3, a_1, text_4;

	return {
		create: function () {
			p = createElement( 'p' );
			text = createText( "Some quick example text to build on the card title and make up the bulk of the card's content." );
			text_1 = createText( "\n            " );
			a = createElement( 'a' );
			text_2 = createText( "Card link" );
			text_3 = createText( "\n            " );
			a_1 = createElement( 'a' );
			text_4 = createText( "Another link" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			p.className = "card-text";
			a.href = "\#";
			a.className = "card-link";
			a_1.href = "\#";
			a_1.className = "card-link";
		},

		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			appendNode( text, p );
			insertNode( text_1, target, anchor );
			insertNode( a, target, anchor );
			appendNode( text_2, a );
			insertNode( text_3, target, anchor );
			insertNode( a_1, target, anchor );
			appendNode( text_4, a_1 );
		},

		unmount: function () {
			detachNode( p );
			detachNode( text_1 );
			detachNode( a );
			detachNode( text_3 );
			detachNode( a_1 );
		},

		destroy: noop
	};
}

function create_cardfooter_yield_fragment ( state, component ) {
	var text;

	return {
		create: function () {
			text = createText( "2 days ago" );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		unmount: function () {
			detachNode( text );
		},

		destroy: noop
	};
}

function create_row_14_yield_fragment ( state, component ) {

	var media_1_yield_fragment = create_media_yield_fragment( state, component );

	var media_1 = new Media({
		_root: component._root,
		_yield: media_1_yield_fragment
	});

	return {
		create: function () {
			media_1_yield_fragment.create();
			media_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			media_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			media_1._fragment.unmount();
		},

		destroy: function () {
			media_1_yield_fragment.destroy();
			media_1.destroy( false );
		}
	};
}

function create_media_yield_fragment ( state, component ) {
	var img, text;

	var mediabody_1_yield_fragment = create_mediabody_yield_fragment( state, component );

	var mediabody_1 = new MediaBody({
		_root: component._root,
		_yield: mediabody_1_yield_fragment
	});

	return {
		create: function () {
			img = createElement( 'img' );
			text = createText( "\n        " );
			mediabody_1_yield_fragment.create();
			mediabody_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAC7CAMAAAAXMCHDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRFHR4kyZt0cKYY1LCM////np6gY1lX8s6l4buR9uXSsn1bvL2+9dKp+9uwtdKO/+u5+Pbw893G2NjZ7seYUnQij7tO8Ovm3uvL38OnzOCx5tG86vHeOEYmfnx7OTk6////hsn4jgAAACB0Uk5T/////////////////////////////////////////wBcXBvtAAAMAUlEQVR42tydi5qiOBBGg4SAAhJBaS8Nvv9bbhICciepiraz1T3fzrgIOf5VlVuB5Pk/MfLGc9Myj+MgCKqqYuJPEMRxnvN/CqSMg4rVNZmzmgmknH49CBcM8wRjnDj/XpA8YMTC6irm3wfCYxMlJsaC/JtAaFwRsLGg/BKQHEGhnSz4exBuFxfL8ZL/KQgPiDNj+Z+BlBVxanX8JyCuMVAocBD6BgyFkn8WJCBvM1CsAEHimrzTKvoZEMrIuy3+BEhAPmCMvxuEM/IZi98LEpOPGXsnSEU+aDaZ2A6krMlnLXgPSEw+buwdIAH5A6tL5yAV+RMzDBTydVkXmIdNQXhN/s4CdyD5X3IYkZB/gUOMIt2A/DmHAYkJSIlKOnXNfpn4rev6nd5F3tad16w6+FGYppn4kb9pcvW9A2PvISHvyVesitJMmGj9ywSLfC3x2K97km0Q+0+QeYlASMJZS0JJEx1c9yfEOUflCwrZ4GUT4mSZZ/8J5QgQ23HJIZUUm6Z08a2dtgSDWI53WSgwktDQBIq7sTBxyeHTrAhtjNuO4CoYiF3C+t3T0o4jLDi9OkpdxFmgV5RyS46wCDm17KZyAEhgyUFTW5CwSMXbrBJKTa1BcqscLxpUWnMo57IkqaxBbCSPOUgQLQmN8f0icdKDSD1AgmhJrLaL5mfxxIVjyfig9AQDOak3V9jehDhwLKaawkEcsjNRb6+RzkUcZKxStWQPBCn26u02k57aHMTmtIFqCE2gICm1dq7KGMTirDXHeVbrW1bOlRuCxLYZC+5ZnW9ZZS5mCGIzNmk4QJ3I0Ldw8U6wglS6FSHCmjNwVAomWEFyig2Rpk/E9u8EmXprig0RAVLqDwMzxyJIQVrPOmFA9tQ+A48lIchpYYyO9W6UQmmAkIQgp1MLIMnmzxyI1cRhJAnBTUPa5Dvs15MiiqJi9Xc2/9qtzVYbIJbztRZkoEe0abMgFDHrJThBGJ3rRpLC/wRItQoSAEEmrgUBsVscGkzfCWaC+8q+4LHvINhti3XiFRDLJbkOJC0SByCWC7RsBcTyVAFd7UeSqblUpL8WTHCbIZ0i8z17MTGnivTXHQmuSKNaU0TE/Dh7+XMeCFeELYLYfiRsA2RihVPX6vkWwW2zsbWslYST7mReEWA/MvAtgiv/qenqvMowRuAgbAGkgoIszKtklhr8JKvLD9R+65jPg9hv65X4edVrZpVbX/7VJw5AuP2Jcicge8BcdzTeIsjKsoBPYn2x4xt1k9MgAVyfzYIASsuqYYjIqgC1ExWKv8zCNK/LqE97R3BQf9hPwAQXIjr/6n49SWUf6DUm+ox0slMtXhEHHLyD+PVELtYo2rcgNRbxDAggRHTaajwrTSNPtE+b+IsfDVWRBxz65vkNa5HYTxBHPQkBz6l6k/Ym1NOiQzi0f/GLnihpOMRQVihWlbdARazVDAioijRoBREcBy2E52tJxJ8XSVp0QjSYjUUpaFN0vMVAsGWkTId6o8fBk6MplZOKSMdKOuTwo0L1jCKaJJN4IdWrjbACqHIKAjpR3YR60ugRJbqwSeavsIn7ZniVhqrVXpOsmqqnxO80keEO4mijnaALSXPlWamvOJTDyzqmJolJuuYTD1PlSkVTcpOpAiJxQKQ8TeqTUmCddzAByYEnok3uLVovyqKq8rOkjf/m/zZNbg5IM6+qrpkm8fRCBPSerWoCAvxE6gZEeErT5Kbkp8r0ClfYhIgSxFeCJZlqsq9IkqLtFqEV0swVCLmm3fxDffTNq54mSfR/tAtJUv3RN4jtm1MfeHl96w/B3+MZZIMiLP3B1oO+MJEpy9Mt17FYDd8HLb3XtfMEf3vkod+gJPudA1G5V0d9RGZBwMW0Y5AcWsc6apCnFc/CsSJ+0qDKC4lme33UJAWDxO8BCVPWi4AXiNe6VisJywaShVAOnX9fIDEUhI1AUuGjrBgWBSYv1xKiFcL9qnSw8JIWzkCC2g2I8J2kGJeapn2QIsuKJBtuRICTlkOQOpuZdUyWuLqsNX9EBgepRiAVGCTdXr9Owp4ic3by3IGAz5RulyynI0WmNcDB34PUhSHImiJZ9QWK+NsgyaYi3wDiZfgYydgXgASZgxj5CpDtipqtGCm4OxBwPyKmVptboRsxIuaH3wBSbRc5bcRIAVucczzWkgspW4vY6zFS7Cn/BhCD+n61xLikiNx6Q9wiGLgaxjfLpuGGJkWxdIRaL83hIJP5SIVwrc1awJWtBlUJGLsDKcGjnabyF1eJDR9qTebs8AcI1JhyFECR/+jqpavloG4jMYTcP4LY42kd29FK4wsEfEcPpej+sA8Cz4D5XEHKzMb69KWu6IEhs+9gNR6+IDOpfxCtTU97Yemr3eIl+copfbEgSgXWQMB+2hU76RxcFMm+rQHgbVdZnLqXThq46CoFECC5ox2rtmvv7bcXYUl7pkQpuiplfVzRKxTA9IdzO1YxMv/qMHn5S/uaQEvK4Ws8GRwIz5hsBqR0AELDaE/HxjmfvEbTKHn9AzvRHe2z19i0JZ0mpYaW9OjgSSt2VDAwinagIYaMuaNalN6wEWHwEOlqf8nz6aJvz1Ec6An7pF6rxifgcRvLnnH3nhU4qqAbjuSnVh4OrK13EH9ZOArxoKhyHgSxADvfRJ8pgubnwCLXgtQLNY2ImfN8lESssYP6ZfMHIR7FUy3V/SJEnpfk6vnSZKWN54ezroV5Ily8BII46VIK5rzt2Ocj5E5ceNYYBPPgpjss9XrEhWdN7laA+1btQUj2PgYkXwZB+JbvhdYcJy/ynHjWBAS+dFlHkRdZcohUcPUc9IZztyYhNq4i3/NLC4xSHO9jFCnXQOCzKwEiWnYydyvJgVGErd+HCA73qOkxruZuJQ2hSLwOEmAUkSRG7qXcSoH4TgSZAQGHe8MhUbbz8N3z9OFwRYKtm44rnCJKFL7eCbZyYGKk5lsgUEk6DklyX5XjdSRckWD7xvwKq8hqpPTlwMRIuQ1SohVRJFe+KQdCkcDk4RUBXpHGv8Yo/OSPOKAxMnmkE3H30M8RR6PK/sVSnq4TDLAigdkDXgIXiugJVXS93+/Xa6T+MTVYjNTc8NlBtRNFtCyeuhNjwWCKxKYPQYodKbJtoBhh5s/XAoy4fJCBFMnNQexT8DmEkdx3v7ZPza1sHt1mFe+/593uQmGKPC673e58RkX66lMBmQ3EToLcPXsOb0930sQZzr/gSF8FMVn/qwXFZaeNgiShvH3/RfyYeFll+8DJwASiwxCK0L21JGLE34F0wtTGKw6GzzJla/7Uk6JTxNq55HSSj05z2fCy2B5kYaRS/zYf3bgBvfmrMYgYwDx2MyZOvyBMAHlMbjzrTzMQrSKWJJ7cN+XzZ1vwMgZ7AnMwyU9LFFoRyi1IPLXisgTSwJyHXlZz4DOxuzCpZ4JiThE1HTfD8PRjDdfPKi/6ymU5+CnlUtvfdSkGivQXSNY5Ij3Af+w2rQv/AP649XwlKOYVkaJsovQm9Q+jk6tOJsA8AP/HjGIAQvndX3EwbzB3/DE9/+6I+0qCm+l1hvPa/VXNQ6YQYtp46h9qDHLBftuFKcljsvdxkvNCfXe7nlxd7/vRRP52NuSg6O8fOZpd6bawz74/neTv/jS/0X50wmH2jTBm1zrCyh7MYvCy9WV8Zt/RY0JyvrwR5PJw9K1JRyPxQeZED/PvsbpZpy1De7jhMP9mMQOSHwjIDZt3bUGemx/dGRTtxzOqHwSAPB+XdwTJzg2H3fchXiA9CTJEfp5vANlKXgDfOuLDHALy/DEeNzoJkaN5y2y//HS9/7q59azb830gq3nYvnM/OnErGMhq9nq4y1lHu1aBvnv65ioD/ziSAwry5Bc3vfvFRXRgQBbTl12U/Cym8efHQBb9yyZxXc6wIbtbkOdCyuG48SIMAwUyj2IxdHSIgQSRKBewcx0dYqBBZKxcYM416dSPD0wz8CCihzxCMtcw0i83ZCNcgIh+ZSjL0dKxLscfdBPcgMho6bEYBPzNKYVLEMVyNA34n3PrUQ9HF3cJouLlpvLY+bYd6EIK7u7CrkGaiBEwayT8cjk+HF/0HSCNn63YO673NpBP238CDAApnx3WCaBrvAAAAABJRU5ErkJggg==";
			img.alt = "Generic placeholder image";
			img.width = "100";
			img.height = "100";
			img.className = "d-flex align-self-start mr-2";
		},

		mount: function ( target, anchor ) {
			insertNode( img, target, anchor );
			insertNode( text, target, anchor );
			mediabody_1._fragment.mount( target, anchor );
		},

		unmount: function () {
			detachNode( img );
			detachNode( text );
			mediabody_1._fragment.unmount();
		},

		destroy: function () {
			mediabody_1_yield_fragment.destroy();
			mediabody_1.destroy( false );
		}
	};
}

function create_mediabody_yield_fragment ( state, component ) {
	var h4, text, text_1;

	return {
		create: function () {
			h4 = createElement( 'h4' );
			text = createText( "Media heading" );
			text_1 = createText( "\n          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus." );
		},

		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			appendNode( text, h4 );
			insertNode( text_1, target, anchor );
		},

		unmount: function () {
			detachNode( h4 );
			detachNode( text_1 );
		},

		destroy: noop
	};
}

function create_row_15_yield_fragment ( state, component ) {
	var text;

	var col_2_yield_fragment = create_col_yield_fragment_13( state, component );

	var col_2 = new Col({
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 6 }
	});

	var col_3_yield_fragment = create_col_1_yield_fragment_8( state, component );

	var col_3 = new Col({
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 6 }
	});

	return {
		create: function () {
			col_2_yield_fragment.create();
			col_2._fragment.create();
			text = createText( "\n      " );
			col_3_yield_fragment.create();
			col_3._fragment.create();
		},

		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		unmount: function () {
			col_2._fragment.unmount();
			detachNode( text );
			col_3._fragment.unmount();
		},

		destroy: function () {
			col_2_yield_fragment.destroy();
			col_2.destroy( false );
			col_3_yield_fragment.destroy();
			col_3.destroy( false );
		}
	};
}

function create_col_yield_fragment_13 ( state, component ) {
	var h2, text;

	return {
		create: function () {
			h2 = createElement( 'h2' );
			text = createText( "Modals" );
		},

		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			appendNode( text, h2 );
		},

		unmount: function () {
			detachNode( h2 );
		},

		destroy: noop
	};
}

function create_col_1_yield_fragment_8 ( state, component ) {
	var h2, text, text_1, div, button, text_2, text_3, button_1, text_4, text_5, button_2, text_6, text_7, button_3, text_8, text_10, h2_1, text_11, text_12, div_1, button_4, text_13, text_14, button_5, text_15, text_16, button_6, text_17, text_18, button_7, text_19;

	return {
		create: function () {
			h2 = createElement( 'h2' );
			text = createText( "Popovers" );
			text_1 = createText( "\n        " );
			div = createElement( 'div' );
			button = createElement( 'button' );
			text_2 = createText( "Left" );
			text_3 = createText( "\n\n          " );
			button_1 = createElement( 'button' );
			text_4 = createText( "Top" );
			text_5 = createText( "\n\n          " );
			button_2 = createElement( 'button' );
			text_6 = createText( "Bottom" );
			text_7 = createText( "\n\n          " );
			button_3 = createElement( 'button' );
			text_8 = createText( "Right" );
			text_10 = createText( "\n\n        " );
			h2_1 = createElement( 'h2' );
			text_11 = createText( "Tooltips" );
			text_12 = createText( "\n        " );
			div_1 = createElement( 'div' );
			button_4 = createElement( 'button' );
			text_13 = createText( "Left" );
			text_14 = createText( "\n\n          " );
			button_5 = createElement( 'button' );
			text_15 = createText( "Top" );
			text_16 = createText( "\n\n          " );
			button_6 = createElement( 'button' );
			text_17 = createText( "Bottom" );
			text_18 = createText( "\n\n          " );
			button_7 = createElement( 'button' );
			text_19 = createText( "Right" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = "mb-3";
			button.type = "button";
			button.className = "btn btn-secondary";
			button.title = '';
			setAttribute( button, 'data-container', "body" );
			setAttribute( button, 'data-toggle', "popover" );
			setAttribute( button, 'data-placement', "left" );
			setAttribute( button, 'data-content', "Vivamus sagittis lacus vel augue laoreet rutrum faucibus." );
			setAttribute( button, 'data-original-title', "Popover Title" );
			button_1.type = "button";
			button_1.className = "btn btn-secondary";
			button_1.title = '';
			setAttribute( button_1, 'data-container', "body" );
			setAttribute( button_1, 'data-toggle', "popover" );
			setAttribute( button_1, 'data-placement', "top" );
			setAttribute( button_1, 'data-content', "Vivamus sagittis lacus vel augue laoreet rutrum faucibus." );
			setAttribute( button_1, 'data-original-title', "Popover Title" );
			button_2.type = "button";
			button_2.className = "btn btn-secondary";
			button_2.title = '';
			setAttribute( button_2, 'data-container', "body" );
			setAttribute( button_2, 'data-toggle', "popover" );
			setAttribute( button_2, 'data-placement', "bottom" );
			setAttribute( button_2, 'data-content', "Vivamus\n              sagittis lacus vel augue laoreet rutrum faucibus." );
			setAttribute( button_2, 'data-original-title', "Popover Title" );
			button_3.type = "button";
			button_3.className = "btn btn-secondary";
			button_3.title = '';
			setAttribute( button_3, 'data-container', "body" );
			setAttribute( button_3, 'data-toggle', "popover" );
			setAttribute( button_3, 'data-placement', "right" );
			setAttribute( button_3, 'data-content', "Vivamus sagittis lacus vel augue laoreet rutrum faucibus." );
			setAttribute( button_3, 'data-original-title', "Popover Title" );
			button_4.type = "button";
			button_4.className = "btn btn-secondary";
			setAttribute( button_4, 'data-toggle', "tooltip" );
			setAttribute( button_4, 'data-placement', "left" );
			button_4.title = '';
			setAttribute( button_4, 'data-original-title', "Tooltip on left" );
			button_5.type = "button";
			button_5.className = "btn btn-secondary";
			setAttribute( button_5, 'data-toggle', "tooltip" );
			setAttribute( button_5, 'data-placement', "top" );
			button_5.title = '';
			setAttribute( button_5, 'data-original-title', "Tooltip on top" );
			button_6.type = "button";
			button_6.className = "btn btn-secondary";
			setAttribute( button_6, 'data-toggle', "tooltip" );
			setAttribute( button_6, 'data-placement', "bottom" );
			button_6.title = '';
			setAttribute( button_6, 'data-original-title', "Tooltip on bottom" );
			button_7.type = "button";
			button_7.className = "btn btn-secondary";
			setAttribute( button_7, 'data-toggle', "tooltip" );
			setAttribute( button_7, 'data-placement', "right" );
			button_7.title = '';
			setAttribute( button_7, 'data-original-title', "Tooltip on right" );
		},

		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			appendNode( text, h2 );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
			appendNode( button, div );
			appendNode( text_2, button );
			appendNode( text_3, div );
			appendNode( button_1, div );
			appendNode( text_4, button_1 );
			appendNode( text_5, div );
			appendNode( button_2, div );
			appendNode( text_6, button_2 );
			appendNode( text_7, div );
			appendNode( button_3, div );
			appendNode( text_8, button_3 );
			insertNode( text_10, target, anchor );
			insertNode( h2_1, target, anchor );
			appendNode( text_11, h2_1 );
			insertNode( text_12, target, anchor );
			insertNode( div_1, target, anchor );
			appendNode( button_4, div_1 );
			appendNode( text_13, button_4 );
			appendNode( text_14, div_1 );
			appendNode( button_5, div_1 );
			appendNode( text_15, button_5 );
			appendNode( text_16, div_1 );
			appendNode( button_6, div_1 );
			appendNode( text_17, button_6 );
			appendNode( text_18, div_1 );
			appendNode( button_7, div_1 );
			appendNode( text_19, button_7 );
		},

		unmount: function () {
			detachNode( h2 );
			detachNode( text_1 );
			detachNode( div );
			detachNode( text_10 );
			detachNode( h2_1 );
			detachNode( text_12 );
			detachNode( div_1 );
		},

		destroy: noop
	};
}

function Docs ( options ) {
	options = options || {};
	this._state = assign( template.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	this._oncreate = [];

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

	callAll(this._oncreate);
}

assign( Docs.prototype, template.methods, proto );

Docs.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
	callAll(this._oncreate);
};

Docs.prototype.teardown = Docs.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

return Docs;

}());
