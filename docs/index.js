var Docs = (function () {
'use strict';

function noop () {}

function assign ( target ) {
	for ( var i = 1; i < arguments.length; i += 1 ) {
		var source = arguments[i];
		for ( var k in source ) target[k] = source[k];
	}

	return target;
}

function appendNode ( node, target ) {
	target.appendChild( node );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function destroyEach ( iterations, detach, start ) {
	for ( var i = start; i < iterations.length; i += 1 ) {
		iterations[i].destroy( detach );
	}
}

function createElement ( name ) {
	return document.createElement( name );
}

function createText ( data ) {
	return document.createTextNode( data );
}

function createComment () {
	return document.createComment( '' );
}

function addEventListener ( node, event, handler ) {
	node.addEventListener( event, handler, false );
}

function removeEventListener ( node, event, handler ) {
	node.removeEventListener( event, handler, false );
}

function setAttribute ( node, attribute, value ) {
	node.setAttribute( attribute, value );
}

var transitionManager = {
	running: false,
	transitions: [],

	add: function ( transition ) {
		transitionManager.transitions.push( transition );

		if ( !this.running ) {
			this.running = true;
			this.next();
		}
	},

	next: function () {
		transitionManager.running = false;

		var now = window.performance.now();
		var i = transitionManager.transitions.length;

		while ( i-- ) {
			var transition = transitionManager.transitions[i];

			if ( transition.running ) {
				if ( now >= transition.end ) {
					transition.running = false;
					transition.done();
				} else if ( now > transition.start ) {
					transition.update( now );
				}

				transitionManager.running = true;
			} else {
				transitionManager.transitions.splice( i, 1 );
			}
		}

		if ( transitionManager.running ) {
			requestAnimationFrame( transitionManager.next );
		}
	}
};

function differs ( a, b ) {
	return ( a !== b ) || ( a && ( typeof a === 'object' ) || ( typeof a === 'function' ) );
}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( differs( newValue, oldValue ) ) {
			var callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( var i = 0; i < callbacks.length; i += 1 ) {
				var callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}
}

function get ( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire ( eventName, data ) {
	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) return;

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this, data );
	}
}

function observe ( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.post : this._observers.pre;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) group[ key ].splice( index, 1 );
		}
	};
}

function on ( eventName, handler ) {
	if ( eventName === 'teardown' ) return this.on( 'destroy', handler );

	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) handlers.splice( index, 1 );
		}
	};
}

function set ( newState ) {
	this._set( assign( {}, newState ) );
	this._root._flush();
}

function _flush () {
	if ( !this._renderHooks ) return;

	while ( this._renderHooks.length ) {
		this._renderHooks.pop()();
	}
}

var proto = {
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	_flush: _flush
};

function create_main_fragment$2 ( state, component ) {
	var button = createElement( 'button' );
	button.type = "button";
	button.className = "close";
	setAttribute( button, 'aria-label', "Close" );

	function click_handler ( event ) {
		component.fire('click');
	}

	addEventListener( button, 'click', click_handler );
	var span = createElement( 'span' );
	appendNode( span, button );
	setAttribute( span, 'aria-hidden', "true" );
	appendNode( createText( "×" ), span );

	return {
		mount: function ( target, anchor ) {
			insertNode( button, target, anchor );
		},

		destroy: function ( detach ) {
			removeEventListener( button, 'click', click_handler );

			if ( detach ) {
				detachNode( button );
			}
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
	if ( options.target ) this._fragment.mount( options.target, null );
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

	this._fragment.destroy( detach !== false );
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
	var if_block_anchor = createComment();

	var if_block = (state.isOpen) && create_if_block$1( state, component );

	return {
		mount: function ( target, anchor ) {
			insertNode( if_block_anchor, target, anchor );
			if ( if_block ) if_block.mount( target, null );
		},

		update: function ( changed, state ) {
			if ( state.isOpen ) {
				if ( if_block ) {
					if_block.update( changed, state );
				} else {
					if_block = create_if_block$1( state, component );
					if_block.mount( if_block_anchor.parentNode, if_block_anchor );
				}
			} else if ( if_block ) {
				if_block.destroy( true );
				if_block = null;
			}
		},

		destroy: function ( detach ) {
			if ( if_block ) if_block.destroy( detach );

			if ( detach ) {
				detachNode( if_block_anchor );
			}
		}
	};
}

function create_if_block_1$1 ( state, component ) {
	var close = new Close({
		target: null,
		_root: component._root
	});

	close.on( 'click', function ( event ) {
		component.set({ isOpen: false });
	});

	return {
		mount: function ( target, anchor ) {
			close._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			close.destroy( detach );
		}
	};
}

function create_if_block$1 ( state, component ) {
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "alert alert-" + ( state.color ) + ( state.dismissible ? ' alert-dismissible' : '' ) + " " + ( state.class );
	setAttribute( div, 'role', "alert" );

	var if_block_1 = (state.dismissible) && create_if_block_1$1( state, component );

	if ( if_block_1 ) if_block_1.mount( div, null );
	var text = createText( "\n    " );
	appendNode( text, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "alert alert-" + ( state.color ) + ( state.dismissible ? ' alert-dismissible' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}

			if ( state.dismissible ) {
				if ( !if_block_1 ) {
					if_block_1 = create_if_block_1$1( state, component );
					if_block_1.mount( div, text );
				}
			} else if ( if_block_1 ) {
				if_block_1.destroy( true );
				if_block_1 = null;
			}
		},

		destroy: function ( detach ) {
			if ( if_block_1 ) if_block_1.destroy( false );
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
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
	this._renderHooks = [];

	this._fragment = create_main_fragment$1( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );

	this._flush();
}

assign( Alert.prototype, proto );

Alert.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );

	this._flush();
};

Alert.prototype.teardown = Alert.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var span_class_value;

	var span = createElement( 'span' );
	span.className = span_class_value = "badge badge-" + ( state.color ) + ( state.pill ? ' badge-pill' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( span, target, anchor );
			component._yield && component._yield.mount( span, null );
		},

		update: function ( changed, state ) {
			if ( span_class_value !== ( span_class_value = "badge badge-" + ( state.color ) + ( state.pill ? ' badge-pill' : '' ) + " " + ( state.class ) ) ) {
				span.className = span_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( span );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Badge.prototype, proto );

Badge.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Badge.prototype.teardown = Badge.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var ol_class_value;

	var ol = createElement( 'ol' );
	ol.className = ol_class_value = "breadcrumb " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( ol, target, anchor );
			component._yield && component._yield.mount( ol, null );
		},

		update: function ( changed, state ) {
			if ( ol_class_value !== ( ol_class_value = "breadcrumb " + ( state.class ) ) ) {
				ol.className = ol_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( ol );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Breadcrumb.prototype, proto );

Breadcrumb.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Breadcrumb.prototype.teardown = Breadcrumb.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var li_class_value;

	var li = createElement( 'li' );
	li.className = li_class_value = "breadcrumb-item" + ( state.active ? ' active' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "breadcrumb-item" + ( state.active ? ' active' : '' ) + " " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( li );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( BreadcrumbItem.prototype, proto );

BreadcrumbItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

BreadcrumbItem.prototype.teardown = BreadcrumbItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var Button_1_class_value;

	var Button_1 = createElement( 'Button' );
	Button_1.className = Button_1_class_value = "btn btn" + ( state.outline ? '-outline' : '' ) + "-" + ( state.color ) + ( state.size ? ` btn-${state.size}` : '' ) + ( state.block ? ' btn-block' : '' ) + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class );

	function click_handler ( event ) {
		component.onClick(event);
	}

	addEventListener( Button_1, 'click', click_handler );

	return {
		mount: function ( target, anchor ) {
			insertNode( Button_1, target, anchor );
			component._yield && component._yield.mount( Button_1, null );
		},

		update: function ( changed, state ) {
			if ( Button_1_class_value !== ( Button_1_class_value = "btn btn" + ( state.outline ? '-outline' : '' ) + "-" + ( state.color ) + ( state.size ? ` btn-${state.size}` : '' ) + ( state.block ? ' btn-block' : '' ) + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class ) ) ) {
				Button_1.className = Button_1_class_value;
			}
		},

		destroy: function ( detach ) {
			removeEventListener( Button_1, 'click', click_handler );
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( Button_1 );
			}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Button.prototype, template$5.methods, proto );

Button.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Button.prototype.teardown = Button.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "" + ( state.size ? `btn-group-${state.size} ` : '' ) + ( state.vertical ? 'btn-group-vertical' : 'btn-group' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "" + ( state.size ? `btn-group-${state.size} ` : '' ) + ( state.vertical ? 'btn-group-vertical' : 'btn-group' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( ButtonGroup.prototype, proto );

ButtonGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ButtonGroup.prototype.teardown = ButtonGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "btn-toolbar " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "btn-toolbar " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( ButtonToolbar.prototype, proto );

ButtonToolbar.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ButtonToolbar.prototype.teardown = ButtonToolbar.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "card" + ( state.inverse ? ' card-inverse' : '' ) + ( state.block ? ' card-block' : '' ) + ( state.color ? ` card${state.outline ? '-outline' : ''}-${state.color}` : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card" + ( state.inverse ? ' card-inverse' : '' ) + ( state.block ? ' card-block' : '' ) + ( state.color ? ` card${state.outline ? '-outline' : ''}-${state.color}` : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Card.prototype, proto );

Card.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Card.prototype.teardown = Card.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "card-block " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-block " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardBlock.prototype, proto );

CardBlock.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardBlock.prototype.teardown = CardBlock.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "card-columns " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-columns " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardColumns.prototype, proto );

CardColumns.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardColumns.prototype.teardown = CardColumns.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "card-deck " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-deck " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardDeck.prototype, proto );

CardDeck.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardDeck.prototype.teardown = CardDeck.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "card-footer " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-footer " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardFooter.prototype, proto );

CardFooter.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardFooter.prototype.teardown = CardFooter.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "card-group " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-group " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardGroup.prototype, proto );

CardGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardGroup.prototype.teardown = CardGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "card-header " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-header " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardHeader.prototype, proto );

CardHeader.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardHeader.prototype.teardown = CardHeader.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "card-img-overlay " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "card-img-overlay " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardImgOverlay.prototype, proto );

CardImgOverlay.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardImgOverlay.prototype.teardown = CardImgOverlay.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var h6_class_value;

	var h6 = createElement( 'h6' );
	h6.className = h6_class_value = "card-subtitle " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( h6, target, anchor );
			component._yield && component._yield.mount( h6, null );
		},

		update: function ( changed, state ) {
			if ( h6_class_value !== ( h6_class_value = "card-subtitle " + ( state.class ) ) ) {
				h6.className = h6_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( h6 );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardSubtitle.prototype, proto );

CardSubtitle.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardSubtitle.prototype.teardown = CardSubtitle.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var p_class_value;

	var p = createElement( 'p' );
	p.className = p_class_value = "card-text " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			component._yield && component._yield.mount( p, null );
		},

		update: function ( changed, state ) {
			if ( p_class_value !== ( p_class_value = "card-text " + ( state.class ) ) ) {
				p.className = p_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( p );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardText.prototype, proto );

CardText.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardText.prototype.teardown = CardText.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var h4_class_value;

	var h4 = createElement( 'h4' );
	h4.className = h4_class_value = "card-title " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			component._yield && component._yield.mount( h4, null );
		},

		update: function ( changed, state ) {
			if ( h4_class_value !== ( h4_class_value = "card-title " + ( state.class ) ) ) {
				h4.className = h4_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( h4 );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( CardTitle.prototype, proto );

CardTitle.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardTitle.prototype.teardown = CardTitle.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "" + ( state.classes ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "" + ( state.classes ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Col.prototype, proto );

Col.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Col.prototype.teardown = Col.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "container" + ( state.fluid ? '-fluid' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "container" + ( state.fluid ? '-fluid' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Container.prototype, proto );

Container.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Container.prototype.teardown = Container.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "dropdown" + ( state.dropup ? ' dropup' : '' ) + ( state.open ? ' show' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "dropdown" + ( state.dropup ? ' dropup' : '' ) + ( state.open ? ' show' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Dropdown.prototype, proto );

Dropdown.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Dropdown.prototype.teardown = Dropdown.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "dropdown-divider " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "dropdown-divider " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( DropdownDivider.prototype, proto );

DropdownDivider.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownDivider.prototype.teardown = DropdownDivider.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var h6_class_value;

	var h6 = createElement( 'h6' );
	h6.className = h6_class_value = "dropdown-header " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( h6, target, anchor );
			component._yield && component._yield.mount( h6, null );
		},

		update: function ( changed, state ) {
			if ( h6_class_value !== ( h6_class_value = "dropdown-header " + ( state.class ) ) ) {
				h6.className = h6_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( h6 );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( DropdownHeader.prototype, proto );

DropdownHeader.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownHeader.prototype.teardown = DropdownHeader.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var button_class_value;

	var button = createElement( 'button' );
	button.className = button_class_value = "dropdown-item" + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( button, target, anchor );
			component._yield && component._yield.mount( button, null );
		},

		update: function ( changed, state ) {
			if ( button_class_value !== ( button_class_value = "dropdown-item" + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class ) ) ) {
				button.className = button_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( button );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( DropdownItem.prototype, proto );

DropdownItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownItem.prototype.teardown = DropdownItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "dropdown-menu" + ( state.right ? ' dropdown-menu-right' : '' ) + " " + ( state.class );
	setAttribute( div, 'tabIndex', "-1" );
	setAttribute( div, 'role', "menu" );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "dropdown-menu" + ( state.right ? ' dropdown-menu-right' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( DropdownMenu.prototype, proto );

DropdownMenu.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownMenu.prototype.teardown = DropdownMenu.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var form_class_value;

	var form = createElement( 'form' );
	form.className = form_class_value = "" + ( state.inline ? 'form-inline' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( form, target, anchor );
			component._yield && component._yield.mount( form, null );
		},

		update: function ( changed, state ) {
			if ( form_class_value !== ( form_class_value = "" + ( state.inline ? 'form-inline' : '' ) + " " + ( state.class ) ) ) {
				form.className = form_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( form );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Form.prototype, proto );

Form.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Form.prototype.teardown = Form.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "form-control-feedback " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "form-control-feedback " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( FormFeedback.prototype, proto );

FormFeedback.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

FormFeedback.prototype.teardown = FormFeedback.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "" + ( state.color ? `has-${state.color}` : '' ) + ( state.row ? ' row' : '' ) + ( state.check ? ' form-check' : ' form-group' ) + ( state.check && state.disabled ? ' disabled' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "" + ( state.color ? `has-${state.color}` : '' ) + ( state.row ? ' row' : '' ) + ( state.check ? ' form-check' : ' form-group' ) + ( state.check && state.disabled ? ' disabled' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( FormGroup.prototype, proto );

FormGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

FormGroup.prototype.teardown = FormGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var small_class_value;

	var small = createElement( 'small' );
	small.className = small_class_value = "" + ( !state.inline ? 'form-text' : '' ) + ( state.color ? ` text-${state.color}` : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( small, target, anchor );
			component._yield && component._yield.mount( small, null );
		},

		update: function ( changed, state ) {
			if ( small_class_value !== ( small_class_value = "" + ( !state.inline ? 'form-text' : '' ) + ( state.color ? ` text-${state.color}` : '' ) + " " + ( state.class ) ) ) {
				small.className = small_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( small );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( FormText.prototype, proto );

FormText.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

FormText.prototype.teardown = FormText.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var i_class_value;

	var i = createElement( 'i' );
	i.className = i_class_value = "fa fa-" + ( state.name ) + ( state.size ? ' fa-' + state.size : '' ) + ( state.spin ? ' fa-spin' : '' ) + ( state.pulse ? ' fa-pulse' : '' ) + ( state.border ? ' fa-border' : '' ) + ( state.fixedWidth ? ' fa-fw' : '' ) + ( state.inverse ? ' fa-inverse' : '' ) + ( state.flip ? ' fa-flip-' + state.flip : '' ) + ( state.rotate ? ' fa-rotate-' + state.rotate : '' ) + ( state.stack ? ' fa-stack-' + state.stack : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( i, target, anchor );
		},

		update: function ( changed, state ) {
			if ( i_class_value !== ( i_class_value = "fa fa-" + ( state.name ) + ( state.size ? ' fa-' + state.size : '' ) + ( state.spin ? ' fa-spin' : '' ) + ( state.pulse ? ' fa-pulse' : '' ) + ( state.border ? ' fa-border' : '' ) + ( state.fixedWidth ? ' fa-fw' : '' ) + ( state.inverse ? ' fa-inverse' : '' ) + ( state.flip ? ' fa-flip-' + state.flip : '' ) + ( state.rotate ? ' fa-rotate-' + state.rotate : '' ) + ( state.stack ? ' fa-stack-' + state.stack : '' ) + " " + ( state.class ) ) ) {
				i.className = i_class_value;
			}
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( i );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Icon.prototype, proto );

Icon.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Icon.prototype.teardown = Icon.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "input-group" + ( state.size ? ` input-group-${state.size}` : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "input-group" + ( state.size ? ` input-group-${state.size}` : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( InputGroup.prototype, proto );

InputGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

InputGroup.prototype.teardown = InputGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "input-group-addon " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "input-group-addon " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( InputGroupAddon.prototype, proto );

InputGroupAddon.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

InputGroupAddon.prototype.teardown = InputGroupAddon.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "jumbotron" + ( state.fluid ? ' jumbotron-fluid' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "jumbotron" + ( state.fluid ? ' jumbotron-fluid' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Jumbotron.prototype, proto );

Jumbotron.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Jumbotron.prototype.teardown = Jumbotron.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var ul_class_value;

	var ul = createElement( 'ul' );
	ul.className = ul_class_value = "list-group" + ( state.flush ? ' list-group-flush' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( ul, target, anchor );
			component._yield && component._yield.mount( ul, null );
		},

		update: function ( changed, state ) {
			if ( ul_class_value !== ( ul_class_value = "list-group" + ( state.flush ? ' list-group-flush' : '' ) + " " + ( state.class ) ) ) {
				ul.className = ul_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( ul );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( ListGroup.prototype, proto );

ListGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroup.prototype.teardown = ListGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var li_class_value;

	var li = createElement( 'li' );
	li.className = li_class_value = "list-group-item" + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + ( state.action ? ' list-group-item-action' : '' ) + ( state.color ? ` list-group-item-${state.color}` : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "list-group-item" + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + ( state.action ? ' list-group-item-action' : '' ) + ( state.color ? ` list-group-item-${state.color}` : '' ) + " " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( li );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( ListGroupItem.prototype, proto );

ListGroupItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroupItem.prototype.teardown = ListGroupItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var h5_class_value;

	var h5 = createElement( 'h5' );
	h5.className = h5_class_value = "list-group-item-heading " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( h5, target, anchor );
			component._yield && component._yield.mount( h5, null );
		},

		update: function ( changed, state ) {
			if ( h5_class_value !== ( h5_class_value = "list-group-item-heading " + ( state.class ) ) ) {
				h5.className = h5_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( h5 );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( ListGroupItemHeading.prototype, proto );

ListGroupItemHeading.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroupItemHeading.prototype.teardown = ListGroupItemHeading.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var p_class_value;

	var p = createElement( 'p' );
	p.className = p_class_value = "list-group-item-text " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			component._yield && component._yield.mount( p, null );
		},

		update: function ( changed, state ) {
			if ( p_class_value !== ( p_class_value = "list-group-item-text " + ( state.class ) ) ) {
				p.className = p_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( p );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( ListGroupItemText.prototype, proto );

ListGroupItemText.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroupItemText.prototype.teardown = ListGroupItemText.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "media " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "media " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Media.prototype, proto );

Media.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Media.prototype.teardown = Media.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "media-body " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "media-body " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( MediaBody.prototype, proto );

MediaBody.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

MediaBody.prototype.teardown = MediaBody.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "modal-footer " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "modal-footer " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( ModalFooter.prototype, proto );

ModalFooter.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ModalFooter.prototype.teardown = ModalFooter.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var li_class_value;

	var li = createElement( 'li' );
	li.className = li_class_value = "nav-item " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "nav-item " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( li );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( NavDropdown.prototype, proto );

NavDropdown.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavDropdown.prototype.teardown = NavDropdown.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var ul_class_value;

	var ul = createElement( 'ul' );
	ul.className = ul_class_value = "" + ( state.navbar ? 'navbar-nav' : 'nav' ) + ( state.tabs ? ' nav-tabs' : '' ) + ( state.pills ? ' nav-pills' : '' ) + ( state.fill ? ' nav-fill' : state.justified ? ' nav-justified' : '' ) + ( state.vertical ? ' flex-column' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( ul, target, anchor );
			component._yield && component._yield.mount( ul, null );
		},

		update: function ( changed, state ) {
			if ( ul_class_value !== ( ul_class_value = "" + ( state.navbar ? 'navbar-nav' : 'nav' ) + ( state.tabs ? ' nav-tabs' : '' ) + ( state.pills ? ' nav-pills' : '' ) + ( state.fill ? ' nav-fill' : state.justified ? ' nav-justified' : '' ) + ( state.vertical ? ' flex-column' : '' ) + " " + ( state.class ) ) ) {
				ul.className = ul_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( ul );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Nav.prototype, proto );

Nav.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Nav.prototype.teardown = Nav.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var li_class_value;

	var li = createElement( 'li' );
	li.className = li_class_value = "nav-item" + ( state.active ? ' active' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "nav-item" + ( state.active ? ' active' : '' ) + " " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( li );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( NavItem.prototype, proto );

NavItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavItem.prototype.teardown = NavItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var a_href_value, a_class_value;

	var a = createElement( 'a' );
	a.href = a_href_value = state.href;
	a.className = a_class_value = "nav-link" + ( state.disabled ? ' disabled' : '' ) + ( state.active ? ' active' : '' ) + " " + ( state.class );

	function click_handler ( event ) {
		component.onClick(event);
	}

	addEventListener( a, 'click', click_handler );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			component._yield && component._yield.mount( a, null );
		},

		update: function ( changed, state ) {
			if ( a_href_value !== ( a_href_value = state.href ) ) {
				a.href = a_href_value;
			}

			if ( a_class_value !== ( a_class_value = "nav-link" + ( state.disabled ? ' disabled' : '' ) + ( state.active ? ' active' : '' ) + " " + ( state.class ) ) ) {
				a.className = a_class_value;
			}
		},

		destroy: function ( detach ) {
			removeEventListener( a, 'click', click_handler );
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( a );
			}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( NavLink.prototype, template$44.methods, proto );

NavLink.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavLink.prototype.teardown = NavLink.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var a_class_value;

	var a = createElement( 'a' );
	a.className = a_class_value = "navbar-brand " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			component._yield && component._yield.mount( a, null );
		},

		update: function ( changed, state ) {
			if ( a_class_value !== ( a_class_value = "navbar-brand " + ( state.class ) ) ) {
				a.className = a_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( a );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( NavbarBrand.prototype, proto );

NavbarBrand.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavbarBrand.prototype.teardown = NavbarBrand.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var ul_class_value;

	var ul = createElement( 'ul' );
	ul.className = ul_class_value = "pagination" + ( state.size ? ` pagination-${state.size}` : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( ul, target, anchor );
			component._yield && component._yield.mount( ul, null );
		},

		update: function ( changed, state ) {
			if ( ul_class_value !== ( ul_class_value = "pagination" + ( state.size ? ` pagination-${state.size}` : '' ) + " " + ( state.class ) ) ) {
				ul.className = ul_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( ul );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Pagination.prototype, proto );

Pagination.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Pagination.prototype.teardown = Pagination.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var li_class_value;

	var li = createElement( 'li' );
	li.className = li_class_value = "page-item" + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, null );
		},

		update: function ( changed, state ) {
			if ( li_class_value !== ( li_class_value = "page-item" + ( state.active ? ' active' : '' ) + ( state.disabled ? ' disabled' : '' ) + " " + ( state.class ) ) ) {
				li.className = li_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( li );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( PaginationItem.prototype, proto );

PaginationItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

PaginationItem.prototype.teardown = PaginationItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var a_class_value;

	var a = createElement( 'a' );
	a.className = a_class_value = "page-link" + ( state.size ? ` pagination-${state.size}` : '' ) + " " + ( state.class );

	function get_block ( state ) {
		if ( state.previous ) return create_if_block$2;
		if ( state.next ) return create_if_block_1$2;
		return create_if_block_2;
	}

	var current_block = get_block( state );
	var if_block = current_block && current_block( state, component );

	if ( if_block ) if_block.mount( a, null );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		update: function ( changed, state ) {
			if ( a_class_value !== ( a_class_value = "page-link" + ( state.size ? ` pagination-${state.size}` : '' ) + " " + ( state.class ) ) ) {
				a.className = a_class_value;
			}

			if ( current_block !== ( current_block = get_block( state ) ) ) {
				if ( if_block ) if_block.destroy( true );
				if_block = current_block && current_block( state, component );
				if ( if_block ) if_block.mount( a, null );
			}
		},

		destroy: function ( detach ) {
			if ( if_block ) if_block.destroy( false );

			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_if_block$2 ( state, component ) {
	var text = createText( "«" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_if_block_1$2 ( state, component ) {
	var text = createText( "»" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_if_block_2 ( state, component ) {


	return {
		mount: function ( target, anchor ) {
			component._yield && component._yield.mount( target, null );
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( PaginationLink.prototype, proto );

PaginationLink.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

PaginationLink.prototype.teardown = PaginationLink.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
function toNumber(value) {
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

var index = toNumber;

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
	var if_block_anchor = createComment();

	function get_block ( state ) {
		if ( !state.bar ) return create_if_block$3;
		return create_if_block_3;
	}

	var current_block = get_block( state );
	var if_block = current_block && current_block( state, component );

	return {
		mount: function ( target, anchor ) {
			insertNode( if_block_anchor, target, anchor );
			if ( if_block ) if_block.mount( target, null );
		},

		update: function ( changed, state ) {
			if ( current_block === ( current_block = get_block( state ) ) && if_block ) {
				if_block.update( changed, state );
			} else {
				if ( if_block ) if_block.destroy( true );
				if_block = current_block && current_block( state, component );
				if ( if_block ) if_block.mount( if_block_anchor.parentNode, if_block_anchor );
			}
		},

		destroy: function ( detach ) {
			if ( if_block ) if_block.destroy( detach );

			if ( detach ) {
				detachNode( if_block_anchor );
			}
		}
	};
}

function create_if_block_1$3 ( state, component ) {


	return {
		mount: function ( target, anchor ) {
			component._yield && component._yield.mount( target, null );
		},

		update: noop,

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );
		}
	};
}

function create_if_block_2$1 ( state, component ) {
	var div_class_value, div_style_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "progress-bar" + ( state.animated ? ' progress-bar-animated' : '' ) + ( state.color ? ` bg-${state.color}` : '' ) + ( state.striped || state.animated ? ' progress-bar-striped' : '' );
	div.style.cssText = div_style_value = "width:" + ( state.percent ) + "%";

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "progress-bar" + ( state.animated ? ' progress-bar-animated' : '' ) + ( state.color ? ` bg-${state.color}` : '' ) + ( state.striped || state.animated ? ' progress-bar-striped' : '' ) ) ) {
				div.className = div_class_value;
			}

			if ( div_style_value !== ( div_style_value = "width:" + ( state.percent ) + "%" ) ) {
				div.style.cssText = div_style_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function create_if_block$3 ( state, component ) {
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "progress " + ( state.class );

	function get_block ( state ) {
		if ( state.multi ) return create_if_block_1$3;
		return create_if_block_2$1;
	}

	var current_block = get_block( state );
	var if_block_1 = current_block && current_block( state, component );

	if ( if_block_1 ) if_block_1.mount( div, null );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "progress " + ( state.class ) ) ) {
				div.className = div_class_value;
			}

			if ( current_block === ( current_block = get_block( state ) ) && if_block_1 ) {
				if_block_1.update( changed, state );
			} else {
				if ( if_block_1 ) if_block_1.destroy( true );
				if_block_1 = current_block && current_block( state, component );
				if ( if_block_1 ) if_block_1.mount( div, null );
			}
		},

		destroy: function ( detach ) {
			if ( if_block_1 ) if_block_1.destroy( false );

			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function create_if_block_3 ( state, component ) {
	var div_class_value, div_style_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "progress-bar" + ( state.animated ? ' progress-bar-animated' : '' ) + ( state.color ? ` bg-${state.color}` : '' ) + ( state.striped || state.animated ? ' progress-bar-striped' : '' );
	div.style.cssText = div_style_value = "width:" + ( state.percent ) + "%";

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "progress-bar" + ( state.animated ? ' progress-bar-animated' : '' ) + ( state.color ? ` bg-${state.color}` : '' ) + ( state.striped || state.animated ? ' progress-bar-striped' : '' ) ) ) {
				div.className = div_class_value;
			}

			if ( div_style_value !== ( div_style_value = "width:" + ( state.percent ) + "%" ) ) {
				div.style.cssText = div_style_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Progress.prototype, proto );

Progress.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute$1( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Progress.prototype.teardown = Progress.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var div_class_value;

	var div = createElement( 'div' );
	div.className = div_class_value = "row" + ( state.noGutters ? ' no-gutters' : '' ) + " " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "row" + ( state.noGutters ? ' no-gutters' : '' ) + " " + ( state.class ) ) ) {
				div.className = div_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Row.prototype, proto );

Row.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Row.prototype.teardown = Row.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var if_block_anchor = createComment();

	function get_block ( state ) {
		if ( state.responsive ) return create_if_block$4;
		return create_if_block_1$4;
	}

	var current_block = get_block( state );
	var if_block = current_block && current_block( state, component );

	return {
		mount: function ( target, anchor ) {
			insertNode( if_block_anchor, target, anchor );
			if ( if_block ) if_block.mount( target, null );
		},

		update: function ( changed, state ) {
			if ( current_block === ( current_block = get_block( state ) ) && if_block ) {
				if_block.update( changed, state );
			} else {
				if ( if_block ) if_block.destroy( true );
				if_block = current_block && current_block( state, component );
				if ( if_block ) if_block.mount( if_block_anchor.parentNode, if_block_anchor );
			}
		},

		destroy: function ( detach ) {
			if ( if_block ) if_block.destroy( detach );

			if ( detach ) {
				detachNode( if_block_anchor );
			}
		}
	};
}

function create_if_block$4 ( state, component ) {
	var table_class_value;

	var div = createElement( 'div' );
	div.className = "table-responsive";
	var table = createElement( 'table' );
	appendNode( table, div );
	table.className = table_class_value = "table" + ( state.size ? ` table-${state.size}` : '' ) + ( state.bordered ? ' table-bordered' : '' ) + ( state.striped ? ' table-striped' : '' ) + ( state.inverse ? ' table-inverse' : '' ) + ( state.hover ? ' table-hover' : '' ) + ( state.reflow ? ' table-reflow' :'' ) + "\n   " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( table, null );
		},

		update: function ( changed, state ) {
			if ( table_class_value !== ( table_class_value = "table" + ( state.size ? ` table-${state.size}` : '' ) + ( state.bordered ? ' table-bordered' : '' ) + ( state.striped ? ' table-striped' : '' ) + ( state.inverse ? ' table-inverse' : '' ) + ( state.hover ? ' table-hover' : '' ) + ( state.reflow ? ' table-reflow' :'' ) + "\n   " + ( state.class ) ) ) {
				table.className = table_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function create_if_block_1$4 ( state, component ) {
	var table_class_value;

	var table = createElement( 'table' );
	table.className = table_class_value = "table" + ( state.size ? ` table-${state.size}` : '' ) + ( state.bordered ? ' table-bordered' : '' ) + ( state.striped ? ' table-striped' : '' ) + ( state.inverse ? ' table-inverse' : '' ) + ( state.hover ? ' table-hover' : '' ) + ( state.reflow ? ' table-reflow' :'' ) + "\n   " + ( state.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( table, target, anchor );
			component._yield && component._yield.mount( table, null );
		},

		update: function ( changed, state ) {
			if ( table_class_value !== ( table_class_value = "table" + ( state.size ? ` table-${state.size}` : '' ) + ( state.bordered ? ' table-bordered' : '' ) + ( state.striped ? ' table-striped' : '' ) + ( state.inverse ? ' table-inverse' : '' ) + ( state.hover ? ' table-hover' : '' ) + ( state.reflow ? ' table-reflow' :'' ) + "\n   " + ( state.class ) ) ) {
				table.className = table_class_value;
			}
		},

		destroy: function ( detach ) {
			component._yield && component._yield.destroy( detach );

			if ( detach ) {
				detachNode( table );
			}
		}
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
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Table.prototype, proto );

Table.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Table.prototype.teardown = Table.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
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
	var nav = createElement( 'nav' );
	nav.className = "navbar sticky-top navbar-dark bg-faded navbar-toggleable-xl";
	var a = createElement( 'a' );
	appendNode( a, nav );
	a.className = "navbar-brand";
	a.href = "https://github.com/bestguy/sveltestrap";
	var img = createElement( 'img' );
	appendNode( img, a );
	img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUMAAABACAYAAACA0BUdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAEO5JREFUeNrsXQmUFcUVrVkYBEV2EZcEUXHDCGhccEXUBFEUIuJyRDG4xDVBQ+KWuCWaHLecxMQ9aIyIirKpKEYIRlRUohIxGkRUQAVFZHEYGJjUtW9nKp/fW3X1X2bePeed6fndXd1VXXXrvVevqioaGhqUQCAQNHdUCBkKBAKBBRkO63ellFrh0EPLYC3vaXlCikMgiMa46ddb3VcpRVfS6K/lRi1XSFEIBNlCyLC00YJ/q6UoBAIhw+aM9fy7VopCIBAyFAgEgswh5pdAEB87s800GMrEci2fStEIGQoEzQWjtNyc5/fVWnppeV+KSMxkQWmijZb7tNyvpZMUR2r0DPh9Cy3bSvEIGQpKF1tqGaFluJChE3wVck4GuIQMBSWMetXo21onxSEQCBkKBAKBkKHgG8gEdClfgZBhs8VnxrGEfqTHyphlLShTuAyt2VHLVlo6sqeM01tiutkHWt4KOL+Nln2UF8v1D8d5H6ilSsuzKpkDfBctXZU3WrsxTz7RwWzQslTLx/ybNXbje/m+wa+17GGcv1jLy1pah3wHDBDMZJ6SAt99ey1dmP/cNCooq0jM7zrMO0ZyO/HZNQneH9cu0TI7zzkMPvVluaxjno4ISet8LU/nKV+/XFF36wPu3U5Lb6MuVbBevq02Ddf5FqU9r8d7YZbSrAiyzsUOWjqz3Cotv7mvSM2OUcd7sI6uN+5FXl9i2zbLa1d+05qcMsM9a1h/5htplRQZoqGdoOUgy/tBht0Dzh2o5REe7+qwEZ2q5UEed45BhvgwP9VyrJb9EjwHH2+Klru1/C1DMhzPyhaEG2Km0zWhFjlAy+ksl9YJ7nuZ73wrO46kqCIBHaW8xSw2S1F2XfI05l9ouSRBGqMpQTiB+c2HB7T0y/P7XC3fMe4fzvLO12Z/pSVqOSkQ/IV8Vn+Hde8pKhZBgNLwvMoffjRWyyn8fijzIezUo4BVnGZouUfLq6VAhtDasKzUvsZvS0gAcVm7hj1qEJ5jepuzoG5wlO9h/Ise+/OIa6GZPqS82Qc+FlBj2MCePNd/hHx1oJY8jHJLwgaWBFMNLcbXxNpQ6/C/y4qI77BIhYeP5OI2doQ+UI5fBnz7BhJYS2ol+1NGkExfS/BcdEaIn9zdUdm1CNA2XaJjBBnnQy3/oiMdmSJ94CQtN6ls4iF3ijjfiVyRD+uojMyKkU6upgk5W8uvlaNVndKQ4SQte/N4HFl6umVPHwQ0ronsPQY6IsM21CiARyOu7UPTsRUb9NXsAObGeA6CcQ/Xcp6W7ylvBgNMnKEZVMhRlNxG9gmJsR97U1d42OhQoPneyd7/6xj39qKmcwUJ7QWapP+Mce+eWl4ksbpAXYCJ+LXj7xNmeQQ9aynr+8gY6a+LqBs3Z2iVrIk4X89rtgjQVscmJMJcXK6lG629VLAdQDnJIMIb+f9zjonQx0RDI+jmIL0B1FDMtINMsQkkws/p17k2JhECq9lhfJ+9l2/unKUKg1rjeKXDdM81iPA3NJGnJCCQN2jS9SZZb0ZyjUNwYxwSoV//Kx22C5ftDD7Kn8e8Nsg/3y9jIkyLwY5M9lPoxir4R4KmcRqP4Qe7LOMCe5bEUs2GlxZ+GnDefhhyHUhrex6D0N5M8UxoQY/z+Dqa/VmjlXHc2lGamxva+aMJGmsQKQ4xzJ4REdcfSU3dJVqo/AMbbRw/x8YCS+IHbR/w+x2q+eAaLW0L/ZF2pLkC3FWATMLXNY29yCAtv0+RVo1BhhMirv2R4QJ43UE+4GA/juYryHV8GVY4fIN21ERGOUgPAymPUWMeQVdLEIbEqCfoOGexw66OUfcx2r8sz7nfKW+Us5ImbmvWm6BpjfA9z8lDYLBAEHbzpIOyQsTFv2mlVBuKyWY0NXMxkJ1MGOA6eZsaenWA4lNL985xalP/uEvUs529w2dWGb93Ief0iOj8UYduKyQZdjIqxfoCNcIJbIgHa9la2cfNHWH0HpNCroPD1x/Ju9dRHhAmMZOmy+FlSoaHGRbBIkdpjiEZ7qU8B//igOvCtMIZtFZcvdMLFBMYAPtJSMf5r4zK/H2mPy3hfUMjzGqMLN8eM62WdLXUZJRHtAWMJs+LuO48KkNBFu0AdmRWQfA2ZnKNahyBqylQI5zKHroltaq0JrLfywahu9ErzXGYj1mGWViO8EenpztMEyRSRxO8W0SDzAcMgJztkAiDsCHC3M4CS6kATLO4d++QcxcnIEJFayArPMvOcF6Ma/+o5YKQ87vRcrWCDRliZMh3lhdqtY6l7P0VTWXbvA7m8eMR13bg31rldmRxCf9uWaZk2M6oA66AiIEvIsqlOoQMlYoOj3KB6iKQ4U00YZOijQoOZ1mskruaqjLKHzqYpAMff9KyMOBcV5UifMiGDD81zNQOBWyIvo+vv2VPdZBqjOmK8hfWGz4Tl7N0WhrpliPqU7hXwoikMqI+otGsC6nD+6mmh40x6mkQWoV8o1dLKI/zVPDsszDMDemwrBUNGzJEz/ISjy8oYME9zUaxpbIbjvc1SsxiebPIlUAm9icrF/y+LOS+20M0oXIFfIUfpiDSoCl2pbT24sKUnbIrTkt1oz/q14d2fCHwkfICboHjLO73RyNlM/byxPMh57pT4xnUhPK7QmWzDmUpbfVhG5dclYWiYUuGCCX4A48x0oXJ2kcV0FTGjI4ksXpwJu8Q00QWlCYejDgPzXAiv++hTSC/zWF/oqpSepk0kfYYmr+Ox9/V8ozyRksRhN0zo/edwr9YJeWQBPcda6jlrwivlCU+UvEC/GE1zFBeuMaBUmyCQpAhgNgg+O+m8v8DlDf1DA5OxKJhXuW3Hb7vf1TjpP4kprJ/7aSEz4PfZbXD969tIvXGpd9pTQJzCVM/404vG0ILZhw7a4EgUzIE4MsZQFMUU2L82RoILMaKG4gj82cZtHXwPN/nh2fGCWlATF8vSxMZpkpHh+XdoYnUm3aOyyTJ1LNLlRf8HHe+9YnKc+M8YNQDgSBTv8QcytXKCxQ9noSFQMgfUDD9CUGWiPN7yvI5k5W3fhumCO2nohd99U1khAPNTPgsTMOCYx5Ts9IGmNepxmDrmjKvN6OpeaEzqkhZJh2NDiduvN5t7Nh+qeWMmPecRhlLDfMtaf6CrMjQhD+daTQ1REwNOoom8w8pIM4rDBM7LuZS2+xJwo0iQ38UeaKyG73qptyslmOi3HerQ3hTnwzSTRLMvVB5c1Ex/QohXsNjkunJyltlCSvuXCYUIMiaDH2AfKZREBV/GCvjyWxMiB08nSZMEownGQ6k2RQErDrT1yBDG9IaqtwugQUsLvN6g9CqvzpOE/5Zm8EtrH4D3zRma5xPTXGLiHugzWLFnV1U9AIQAiFD51hFExeCsJwxyls9+n5qdwsSpDWFJhK2AsC6eEELgx7DvzBzbebTwoybJNVkEyDofkaJvRPmmiPCAQsqnEvrI8rfi+mZGJC5RD6poFi74yEEB+vT+UvRn5vwfowoz+fxoBgmMvyTNiOg/vL5gv9H+xJ+N+yp8zPlrTqExXiXRFw/KgM3iEDIMBEw1chfe8wmSNZfbCEoxAZaweE8lkDr5ocltB5Aig9FXHuGFJeg2Psm+yPK2Atj+4T3TuZfmMn5lsQayPwhTnCqfOpmC6yIg/0xpoRcc0jKZ9Q38TLMtyWuC5RUuRWbDBfQVIbDO+lE+xcNEyifduj/BiJc08wJYaMSwBwOiibAVM00y3C1KqNysFmQ2d/d0DVst3gNI1Hr9yw2GaJy+r68GosP5Adg5+6NAj/f0Ty2GQCpaCIE4PfmrgbKyrlcMHtpWQiZRTWiMLLsVIIWX1DbtvH3dlPZDLbuYnlfq5D6XleuZGhWQJtZDT7RYa3C7Yzfj2Svsz7CPMqqJy0FVBnk1dZx2uVaJmGaRpQZGDaVsm+J5WelCh4wxJTZpBuEjcjoPbHaUNKV69Gug6ZXrlPh+4OXvGaYZntRhMssZ6M3tUN/hBmzXb60SPcz/kWl6VimDbzWMCc6O0rTX5F6qzIsj54hGlyLGGQYtq/zRapxz5xSAIjwg4Bz6BhvSZAWBiHPyfBdb02oWf825PqFyn6NxKKToany2qi30FAm5hAgcDz/2o4iLyCRoHzKdeUTdALvGhXaBfwGdnSZlQU0t4dDTL1FMbTdlyK0FfiwEfS9dYnkOWzqKcgN6wb0DrkGMbxXKW/BlSyB52Du+KkRpIh3xdqpF4Zcg53+lti+SLHXTENBdKB2ON8yjQlU4/vx/z7s/TBoMNkyTWibf1feijyo4I+UKSFOpUZ0hpbLVfrRu8nUglAx91GNKwgVAv1VYwhMnAGh9dT4eqroqYOvxNAM0RHMUI07BOYCg4CYTGDGNvpuitkkoEK6FzBDKGx/kZGUeSxP/10beNxDZbe3Sy4wgIX1KuHTXZpzzh+82S1GOmPTvESxyXA0/85XyWagmMBUv9WsjFi4YX/+PsMwd23VdzRAhF2cnLagiwQ0zktpJt/twPfzHLVNOL7vVOE7sLnG5Q413Fz8JeZ1V6roufAd1KarE6HTv8TSZWMLbG2B/ZoHRly3ewnV184pXDrgj8fSPLxYZjJ6Hqx76O9Wd0+KtGoNDRCLzQ5PaSL7eFI1Tjl7yEi3nPAhTR1FrWqMSr/81gWGBo5y71KgvKzOKN0nIkxgEzCF77J4xieqOOFN5yl3sXx1GbzfSsd5TQVbzRB+vjYJChqqbmuqunsob97onoYv5uaU+ZhA7e1I47eJDgr4RGoCMBkwhxprMo6nebiInUmScJNKNooVBWwc1ysvNAJljkUxjqbG+Aq1h7V8L9SFr2JUemiHmNmBtSuPoaYIh/zLyhtkWG/RyVaT7MK2Zd2QQdnAx3RmwnvO4fue6egdsgxX+ojaNGZrpQn/uYrKwM6O3/8RfvOLUuYT+0A/UywyvJdaXZIK2jLP8x5lpUob3f40idlP/3VWhLRYRg1oDInwWNU4ar3KotFXMq9Y53FmzDIDNk+Zj5EkqqtphlzD39eR/Crpl7lPeT7SKFzL8sUyWFsZ6a21JMMqNthTQ65xPR8aHcKPLUkWHctsdgpdY1zfPqRM2macXyylt6+WO5TdPkUjWP+vCzifZg9wxBafpbzZZ4Mt7od7bZSyHxtwQoYIN7GJHgeBYB3D95S3HLurkapVOabsvQ4bDWavDKXWiXXwepEg0yzgEJcsfNNwuYN8YDvNsdRs4Fc9mA2uJue7xsUYauTYEKwv02ur7GcVRMW+wUQ9zDJtaOEYAHmDmiyc9e+kLE/4TB9mJ4m59Xspz/9WHaCBBsX9wfLYKc/vcxzWYeQdm6jB/z2MFlrvEJfJa7TY/sxOtIJll2+l8DRxvL62igVVjmdZom7uGPId3+E7Pc8278x8r2hoSKaUDesHH/I3DuIkvqcGCsywrJzIlapx9ZEFKltsp+xXq8YHXazijSyCWLZhuX3hOA9t85DfihTE206l29ZguYoOmO1uUdaVtBo+y8jvFadefBriAjDrba6Jm+Xc3U45Wp0/iowyWxhgpWyb5/eotgatDyPW+daYhEY3KOZzFMvj4yhLctz06wuqGS53pK24xMYCkKCPRQV6ztoM8/QVxRVWqBTR/zGxQJU2FpV4vTXxOSUu6gr0nnXF+s6VSiAQCARChgKBQCBkKBAIBEKGAoFAIGQoEAgEQoYCgaBgQMRKUOxpi1J6USFDgUCQJVap4BC+mlJ60Wr5VgKBIEMglhFT+Q7Ic+6eUnrRxDNQBAKBoClCyFAgEAiEDAUCgUDIUCAQCP6H/wowAFFJXHAnIN6pAAAAAElFTkSuQmCC";
	img.height = "32";
	appendNode( createText( "\n  " ), nav );
	var ul = createElement( 'ul' );
	appendNode( ul, nav );
	ul.className = "navbar-nav ml-auto";
	var each_block_value = state.themes;
	var each_block_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
		each_block_iterations[i].mount( ul, null );
	}

	var text_1 = createText( "\n\n" );
	var container_1_yield_fragment = create_container_yield_fragment( state, component );

	var container_1 = new Container({
		target: null,
		_root: component._root,
		_yield: container_1_yield_fragment,
		data: { fluid: true }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( nav, target, anchor );
			insertNode( text_1, target, anchor );
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
						each_block_iterations[i].mount( ul, null );
					}
				}

				destroyEach( each_block_iterations, true, each_block_value.length );
				each_block_iterations.length = each_block_value.length;
			}

			container_1_yield_fragment.update( changed, state );
		},

		destroy: function ( detach ) {
			destroyEach( each_block_iterations, false, 0 );

			container_1.destroy( detach );

			if ( detach ) {
				detachNode( nav );
				detachNode( text_1 );
			}
		}
	};
}

function create_each_block ( state, each_block_value, theme, theme_index, component ) {
	var navitem_1_yield_fragment = create_navitem_yield_fragment( state, each_block_value, theme, theme_index, component );

	var navitem_1 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_1_yield_fragment,
		data: { active: state.current == theme.name }
	});

	return {
		mount: function ( target, anchor ) {
			navitem_1._fragment.mount( target, anchor );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			navitem_1_yield_fragment.update( changed, state, each_block_value, theme, theme_index );

			var navitem_1_changes = {};

			if ( 'current' in changed||'themes' in changed ) navitem_1_changes.active = state.current == theme.name;

			if ( Object.keys( navitem_1_changes ).length ) navitem_1.set( navitem_1_changes );
		},

		destroy: function ( detach ) {
			navitem_1.destroy( detach );
		}
	};
}

function create_navitem_yield_fragment ( state, each_block_value, theme, theme_index, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment( state, each_block_value, theme, theme_index, component );

	var navlink_1 = new NavLink({
		target: null,
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
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			navlink_1_yield_fragment.update( changed, state, each_block_value, theme, theme_index );

			navlink_1._context.each_block_value = each_block_value;
			navlink_1._context.theme_index = theme_index;
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment ( state, each_block_value, theme, theme_index, component ) {
	var small = createElement( 'small' );

	function get_block ( state, each_block_value, theme, theme_index ) {
		if ( state.current == theme.name ) return create_if_block;
		return create_if_block_1;
	}

	var current_block = get_block( state, each_block_value, theme, theme_index );
	var if_block = current_block && current_block( state, each_block_value, theme, theme_index, component );

	if ( if_block ) if_block.mount( small, null );

	return {
		mount: function ( target, anchor ) {
			insertNode( small, target, anchor );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			if ( current_block === ( current_block = get_block( state, each_block_value, theme, theme_index ) ) && if_block ) {
				if_block.update( changed, state, each_block_value, theme, theme_index );
			} else {
				if ( if_block ) if_block.destroy( true );
				if_block = current_block && current_block( state, each_block_value, theme, theme_index, component );
				if ( if_block ) if_block.mount( small, null );
			}
		},

		destroy: function ( detach ) {
			if ( if_block ) if_block.destroy( false );

			if ( detach ) {
				detachNode( small );
			}
		}
	};
}

function create_if_block ( state, each_block_value, theme, theme_index, component ) {
	var text_value;

	var b = createElement( 'b' );
	var text = createText( text_value = theme.name );
	appendNode( text, b );

	return {
		mount: function ( target, anchor ) {
			insertNode( b, target, anchor );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			if ( text_value !== ( text_value = theme.name ) ) {
				text.data = text_value;
			}
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( b );
			}
		}
	};
}

function create_if_block_1 ( state, each_block_value, theme, theme_index, component ) {
	var text_value;

	var text = createText( text_value = theme.name );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		update: function ( changed, state, each_block_value, theme, theme_index ) {
			if ( text_value !== ( text_value = theme.name ) ) {
				text.data = text_value;
			}
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_container_yield_fragment ( state, component ) {
	var row_1_yield_fragment = create_row_yield_fragment( state, component );

	var row_1 = new Row({
		target: null,
		_root: component._root,
		_yield: row_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			row_1._fragment.mount( target, anchor );
		},

		update: function ( changed, state ) {
			row_1_yield_fragment.update( changed, state );
		},

		destroy: function ( detach ) {
			row_1.destroy( detach );
		}
	};
}

function create_row_yield_fragment ( state, component ) {
	var col_2_yield_fragment = create_col_yield_fragment( state, component );

	var col_2 = new Col({
		target: null,
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { sm: 3, lg: 2 }
	});

	var text = createText( "\n  \n  \n  " );
	var col_3_yield_fragment = create_col_1_yield_fragment( state, component );

	var col_3 = new Col({
		target: null,
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { sm: 9 }
	});

	return {
		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		update: function ( changed, state ) {
			col_3_yield_fragment.update( changed, state );
		},

		destroy: function ( detach ) {
			col_2.destroy( detach );
			col_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_yield_fragment ( state, component ) {
	var div = createElement( 'div' );
	div.className = "mt-3 sticky-top";
	var listgroup_1_yield_fragment = create_listgroup_yield_fragment( state, component );

	var listgroup_1 = new ListGroup({
		target: div,
		_root: component._root,
		_yield: listgroup_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			listgroup_1.destroy( false );

			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function create_listgroup_yield_fragment ( state, component ) {
	var listgroupitem_10_yield_fragment = create_listgroupitem_yield_fragment( state, component );

	var listgroupitem_10 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_10_yield_fragment,
		data: { action: true }
	});

	var text = createText( "\n          " );
	var listgroupitem_11_yield_fragment = create_listgroupitem_1_yield_fragment( state, component );

	var listgroupitem_11 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_11_yield_fragment,
		data: { action: true }
	});

	var text_1 = createText( "\n          " );
	var listgroupitem_12_yield_fragment = create_listgroupitem_2_yield_fragment( state, component );

	var listgroupitem_12 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_12_yield_fragment,
		data: { action: true }
	});

	var text_2 = createText( "\n          " );
	var listgroupitem_13_yield_fragment = create_listgroupitem_3_yield_fragment( state, component );

	var listgroupitem_13 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_13_yield_fragment,
		data: { action: true }
	});

	var text_3 = createText( "\n          " );
	var listgroupitem_14_yield_fragment = create_listgroupitem_4_yield_fragment( state, component );

	var listgroupitem_14 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_14_yield_fragment,
		data: { action: true }
	});

	var text_4 = createText( "\n          " );
	var listgroupitem_15_yield_fragment = create_listgroupitem_5_yield_fragment( state, component );

	var listgroupitem_15 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_15_yield_fragment,
		data: { action: true }
	});

	var text_5 = createText( "\n          " );
	var listgroupitem_16_yield_fragment = create_listgroupitem_6_yield_fragment( state, component );

	var listgroupitem_16 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_16_yield_fragment,
		data: { action: true }
	});

	var text_6 = createText( "\n          " );
	var listgroupitem_17_yield_fragment = create_listgroupitem_7_yield_fragment( state, component );

	var listgroupitem_17 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_17_yield_fragment,
		data: { action: true }
	});

	var text_7 = createText( "\n          " );
	var listgroupitem_18_yield_fragment = create_listgroupitem_8_yield_fragment( state, component );

	var listgroupitem_18 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_18_yield_fragment,
		data: { action: true }
	});

	var text_8 = createText( "\n          " );
	var listgroupitem_19_yield_fragment = create_listgroupitem_9_yield_fragment( state, component );

	var listgroupitem_19 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_19_yield_fragment,
		data: { action: true }
	});

	return {
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

		destroy: function ( detach ) {
			listgroupitem_10.destroy( detach );
			listgroupitem_11.destroy( detach );
			listgroupitem_12.destroy( detach );
			listgroupitem_13.destroy( detach );
			listgroupitem_14.destroy( detach );
			listgroupitem_15.destroy( detach );
			listgroupitem_16.destroy( detach );
			listgroupitem_17.destroy( detach );
			listgroupitem_18.destroy( detach );
			listgroupitem_19.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
				detachNode( text_3 );
				detachNode( text_4 );
				detachNode( text_5 );
				detachNode( text_6 );
				detachNode( text_7 );
				detachNode( text_8 );
			}
		}
	};
}

function create_listgroupitem_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#navbars";
	appendNode( createText( "Navbars" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_listgroupitem_1_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#buttons";
	appendNode( createText( "Buttons" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_listgroupitem_2_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#typography";
	appendNode( createText( "Typography" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_listgroupitem_3_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#tables";
	appendNode( createText( "Tables" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_listgroupitem_4_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#forms";
	appendNode( createText( "Forms" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_listgroupitem_5_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#navs";
	appendNode( createText( "Navs" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_listgroupitem_6_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#indicators";
	appendNode( createText( "Indicators" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_listgroupitem_7_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#progress";
	appendNode( createText( "Progress" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_listgroupitem_8_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#containers";
	appendNode( createText( "Containers" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_listgroupitem_9_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#dialogs";
	appendNode( createText( "Dialogs" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_col_1_yield_fragment ( state, component ) {
	var div = createElement( 'div' );
	div.className = "mt-3";
	var row_16_yield_fragment = create_row_yield_fragment_1( state, component );

	var row_16 = new Row({
		target: div,
		_root: component._root,
		_yield: row_16_yield_fragment
	});

	var text = createText( "\n\n\n  \n  " );
	var div_1 = createElement( 'div' );
	div_1.className = "mt-3";
	var h1 = createElement( 'h1' );
	appendNode( h1, div_1 );
	h1.id = "buttons";
	h1.className = "text-muted my-4";
	appendNode( createText( "Buttons" ), h1 );
	appendNode( createText( "\n\n    " ), div_1 );
	var row_17_yield_fragment = create_row_1_yield_fragment( state, component );

	var row_17 = new Row({
		target: div_1,
		_root: component._root,
		_yield: row_17_yield_fragment
	});

	appendNode( createText( "\n    \n    " ), div_1 );
	var row_18_yield_fragment = create_row_2_yield_fragment( state, component );

	var row_18 = new Row({
		target: div_1,
		_root: component._root,
		_yield: row_18_yield_fragment
	});

	var text_4 = createText( "\n\n  \n  " );
	var div_2 = createElement( 'div' );
	div_2.className = "mt-3";
	var h1_1 = createElement( 'h1' );
	appendNode( h1_1, div_2 );
	h1_1.id = "typography";
	h1_1.className = "text-muted my-4";
	appendNode( createText( "Typography" ), h1_1 );
	appendNode( createText( "\n\n    \n\n    " ), div_2 );
	var row_19_yield_fragment = create_row_3_yield_fragment( state, component );

	var row_19 = new Row({
		target: div_2,
		_root: component._root,
		_yield: row_19_yield_fragment
	});

	appendNode( createText( "\n\n    \n\n    " ), div_2 );
	var h2 = createElement( 'h2' );
	appendNode( h2, div_2 );
	h2.id = "type-blockquotes";
	h2.className = "text-muted my-3";
	appendNode( createText( "Blockquotes" ), h2 );
	appendNode( createText( "\n\n    " ), div_2 );
	var row_20_yield_fragment = create_row_4_yield_fragment( state, component );

	var row_20 = new Row({
		target: div_2,
		_root: component._root,
		_yield: row_20_yield_fragment
	});

	var text_10 = createText( "\n\n  \n  " );
	var div_3 = createElement( 'div' );
	div_3.className = "mt-3";
	var h1_2 = createElement( 'h1' );
	appendNode( h1_2, div_3 );
	h1_2.id = "tables";
	h1_2.className = "text-muted my-4";
	appendNode( createText( "Tables" ), h1_2 );
	appendNode( createText( "\n    " ), div_3 );
	var row_21_yield_fragment = create_row_5_yield_fragment( state, component );

	var row_21 = new Row({
		target: div_3,
		_root: component._root,
		_yield: row_21_yield_fragment
	});

	var text_13 = createText( "\n\n  \n  " );
	var div_4 = createElement( 'div' );
	div_4.className = "mt-3";
	var h1_3 = createElement( 'h1' );
	appendNode( h1_3, div_4 );
	h1_3.id = "forms";
	h1_3.className = "text-muted my-4";
	appendNode( createText( "Forms" ), h1_3 );
	appendNode( createText( "\n\n    " ), div_4 );
	var row_22_yield_fragment = create_row_6_yield_fragment( state, component );

	var row_22 = new Row({
		target: div_4,
		_root: component._root,
		_yield: row_22_yield_fragment
	});

	var text_16 = createText( "\n\n  \n  " );
	var div_5 = createElement( 'div' );
	div_5.className = "mt-3";
	var h1_4 = createElement( 'h1' );
	appendNode( h1_4, div_5 );
	h1_4.id = "navs";
	h1_4.className = "text-muted my-4";
	appendNode( createText( "Navs" ), h1_4 );
	appendNode( createText( "\n\n    " ), div_5 );
	var row_23_yield_fragment = create_row_7_yield_fragment( state, component );

	var row_23 = new Row({
		target: div_5,
		_root: component._root,
		_yield: row_23_yield_fragment,
		data: { class: "mb-2" }
	});

	appendNode( createText( "\n\n    " ), div_5 );
	var h2_1 = createElement( 'h2' );
	appendNode( h2_1, div_5 );
	h2_1.id = "nav-fill";
	h2_1.className = "text-muted my-4";
	appendNode( createText( "Fill" ), h2_1 );
	appendNode( createText( "\n    " ), div_5 );
	var nav_2_yield_fragment = create_nav_yield_fragment_2( state, component );

	var nav_2 = new Nav({
		target: div_5,
		_root: component._root,
		_yield: nav_2_yield_fragment,
		data: { pills: true, fill: true, class: "mb-2" }
	});

	appendNode( createText( "\n\n    " ), div_5 );
	var h2_2 = createElement( 'h2' );
	appendNode( h2_2, div_5 );
	h2_2.id = "nav-fill";
	h2_2.className = "text-muted my-4";
	appendNode( createText( "Justified" ), h2_2 );
	appendNode( createText( "\n    " ), div_5 );
	var nav_3_yield_fragment = create_nav_1_yield_fragment_1( state, component );

	var nav_3 = new Nav({
		target: div_5,
		_root: component._root,
		_yield: nav_3_yield_fragment,
		data: { pills: true, justified: true }
	});

	appendNode( createText( "\n\n    " ), div_5 );
	var row_24_yield_fragment = create_row_8_yield_fragment( state, component );

	var row_24 = new Row({
		target: div_5,
		_root: component._root,
		_yield: row_24_yield_fragment
	});

	var text_26 = createText( "\n\n  \n  " );
	var div_6 = createElement( 'div' );
	div_6.className = "mt-3";
	var h1_5 = createElement( 'h1' );
	appendNode( h1_5, div_6 );
	h1_5.id = "indicators";
	h1_5.className = "text-muted my-4";
	appendNode( createText( "Indicators" ), h1_5 );
	appendNode( createText( "\n\n    " ), div_6 );
	var h2_3 = createElement( 'h2' );
	appendNode( h2_3, div_6 );
	h2_3.className = "text-muted my-4";
	appendNode( createText( "Alerts" ), h2_3 );
	appendNode( createText( "\n    " ), div_6 );
	var alert_1_yield_fragment = create_alert_yield_fragment( state, component );

	var alert_1 = new Alert({
		target: div_6,
		_root: component._root,
		_yield: alert_1_yield_fragment
	});

	appendNode( createText( "\n\n    " ), div_6 );
	var row_25_yield_fragment = create_row_9_yield_fragment( state, component );

	var row_25 = new Row({
		target: div_6,
		_root: component._root,
		_yield: row_25_yield_fragment
	});

	appendNode( createText( "\n\n    " ), div_6 );
	var div_7 = createElement( 'div' );
	appendNode( div_7, div_6 );
	var h2_4 = createElement( 'h2' );
	appendNode( h2_4, div_7 );
	h2_4.className = "text-muted my-4";
	appendNode( createText( "Badges" ), h2_4 );
	appendNode( createText( "\n      " ), div_7 );
	var div_8 = createElement( 'div' );
	appendNode( div_8, div_7 );
	div_8.className = "mb-4";
	var badge_12_yield_fragment = create_badge_yield_fragment( state, component );

	var badge_12 = new Badge({
		target: div_8,
		_root: component._root,
		_yield: badge_12_yield_fragment
	});

	appendNode( createText( "\n        " ), div_8 );
	var badge_13_yield_fragment = create_badge_1_yield_fragment( state, component );

	var badge_13 = new Badge({
		target: div_8,
		_root: component._root,
		_yield: badge_13_yield_fragment,
		data: { color: "primary" }
	});

	appendNode( createText( "\n        " ), div_8 );
	var badge_14_yield_fragment = create_badge_2_yield_fragment( state, component );

	var badge_14 = new Badge({
		target: div_8,
		_root: component._root,
		_yield: badge_14_yield_fragment,
		data: { color: "success" }
	});

	appendNode( createText( "\n        " ), div_8 );
	var badge_15_yield_fragment = create_badge_3_yield_fragment( state, component );

	var badge_15 = new Badge({
		target: div_8,
		_root: component._root,
		_yield: badge_15_yield_fragment,
		data: { color: "warning" }
	});

	appendNode( createText( "\n        " ), div_8 );
	var badge_16_yield_fragment = create_badge_4_yield_fragment( state, component );

	var badge_16 = new Badge({
		target: div_8,
		_root: component._root,
		_yield: badge_16_yield_fragment,
		data: { color: "danger" }
	});

	appendNode( createText( "\n        " ), div_8 );
	var badge_17_yield_fragment = create_badge_5_yield_fragment( state, component );

	var badge_17 = new Badge({
		target: div_8,
		_root: component._root,
		_yield: badge_17_yield_fragment,
		data: { color: "info" }
	});

	appendNode( createText( "\n      " ), div_7 );
	var div_9 = createElement( 'div' );
	appendNode( div_9, div_7 );
	var badge_18_yield_fragment = create_badge_6_yield_fragment( state, component );

	var badge_18 = new Badge({
		target: div_9,
		_root: component._root,
		_yield: badge_18_yield_fragment,
		data: { pill: true }
	});

	appendNode( createText( "\n        " ), div_9 );
	var badge_19_yield_fragment = create_badge_7_yield_fragment( state, component );

	var badge_19 = new Badge({
		target: div_9,
		_root: component._root,
		_yield: badge_19_yield_fragment,
		data: { pill: true, color: "primary" }
	});

	appendNode( createText( "\n        " ), div_9 );
	var badge_20_yield_fragment = create_badge_8_yield_fragment( state, component );

	var badge_20 = new Badge({
		target: div_9,
		_root: component._root,
		_yield: badge_20_yield_fragment,
		data: { pill: true, color: "success" }
	});

	appendNode( createText( "\n        " ), div_9 );
	var badge_21_yield_fragment = create_badge_9_yield_fragment( state, component );

	var badge_21 = new Badge({
		target: div_9,
		_root: component._root,
		_yield: badge_21_yield_fragment,
		data: { pill: true, color: "warning" }
	});

	appendNode( createText( "\n        " ), div_9 );
	var badge_22_yield_fragment = create_badge_10_yield_fragment( state, component );

	var badge_22 = new Badge({
		target: div_9,
		_root: component._root,
		_yield: badge_22_yield_fragment,
		data: { pill: true, color: "danger" }
	});

	appendNode( createText( "\n        " ), div_9 );
	var badge_23_yield_fragment = create_badge_11_yield_fragment( state, component );

	var badge_23 = new Badge({
		target: div_9,
		_root: component._root,
		_yield: badge_23_yield_fragment,
		data: { pill: true, color: "info" }
	});

	var text_46 = createText( "\n\n  \n  " );
	var div_10 = createElement( 'div' );
	div_10.className = "mt-3";
	var row_26_yield_fragment = create_row_10_yield_fragment( state, component );

	var row_26 = new Row({
		target: div_10,
		_root: component._root,
		_yield: row_26_yield_fragment
	});

	var text_47 = createText( "\n\n  \n  " );
	var div_11 = createElement( 'div' );
	div_11.className = "mt-3";
	var row_27_yield_fragment = create_row_11_yield_fragment( state, component );

	var row_27 = new Row({
		target: div_11,
		_root: component._root,
		_yield: row_27_yield_fragment
	});

	appendNode( createText( "\n\n\n    " ), div_11 );
	var h2_5 = createElement( 'h2' );
	appendNode( h2_5, div_11 );
	appendNode( createText( "List groups" ), h2_5 );
	appendNode( createText( "\n    " ), div_11 );
	var row_28_yield_fragment = create_row_12_yield_fragment( state, component );

	var row_28 = new Row({
		target: div_11,
		_root: component._root,
		_yield: row_28_yield_fragment
	});

	appendNode( createText( "\n\n    " ), div_11 );
	var h2_6 = createElement( 'h2' );
	appendNode( h2_6, div_11 );
	appendNode( createText( "Cards" ), h2_6 );
	appendNode( createText( "\n    " ), div_11 );
	var row_29_yield_fragment = create_row_13_yield_fragment( state, component );

	var row_29 = new Row({
		target: div_11,
		_root: component._root,
		_yield: row_29_yield_fragment
	});

	appendNode( createText( "\n\n    " ), div_11 );
	var h2_7 = createElement( 'h2' );
	appendNode( h2_7, div_11 );
	appendNode( createText( "Media" ), h2_7 );
	appendNode( createText( "\n    " ), div_11 );
	var row_30_yield_fragment = create_row_14_yield_fragment( state, component );

	var row_30 = new Row({
		target: div_11,
		_root: component._root,
		_yield: row_30_yield_fragment
	});

	var text_57 = createText( "\n\n  \n  " );
	var div_12 = createElement( 'div' );
	div_12.className = "mt-3";
	var h1_6 = createElement( 'h1' );
	appendNode( h1_6, div_12 );
	h1_6.id = "dialogs";
	appendNode( createText( "Dialogs" ), h1_6 );
	appendNode( createText( "\n    " ), div_12 );
	var row_31_yield_fragment = create_row_15_yield_fragment( state, component );

	var row_31 = new Row({
		target: div_12,
		_root: component._root,
		_yield: row_31_yield_fragment
	});

	var text_60 = createText( "\n\n  " );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			insertNode( text, target, anchor );
			insertNode( div_1, target, anchor );
			insertNode( text_4, target, anchor );
			insertNode( div_2, target, anchor );
			insertNode( text_10, target, anchor );
			insertNode( div_3, target, anchor );
			insertNode( text_13, target, anchor );
			insertNode( div_4, target, anchor );
			insertNode( text_16, target, anchor );
			insertNode( div_5, target, anchor );
			insertNode( text_26, target, anchor );
			insertNode( div_6, target, anchor );
			insertNode( text_46, target, anchor );
			insertNode( div_10, target, anchor );
			insertNode( text_47, target, anchor );
			insertNode( div_11, target, anchor );
			insertNode( text_57, target, anchor );
			insertNode( div_12, target, anchor );
			insertNode( text_60, target, anchor );
		},

		update: function ( changed, state ) {
			row_18_yield_fragment.update( changed, state );
		},

		destroy: function ( detach ) {
			row_16.destroy( false );
			row_17.destroy( false );
			row_18.destroy( false );
			row_19.destroy( false );
			row_20.destroy( false );
			row_21.destroy( false );
			row_22.destroy( false );
			row_23.destroy( false );
			nav_2.destroy( false );
			nav_3.destroy( false );
			row_24.destroy( false );
			alert_1.destroy( false );
			row_25.destroy( false );
			badge_12.destroy( false );
			badge_13.destroy( false );
			badge_14.destroy( false );
			badge_15.destroy( false );
			badge_16.destroy( false );
			badge_17.destroy( false );
			badge_18.destroy( false );
			badge_19.destroy( false );
			badge_20.destroy( false );
			badge_21.destroy( false );
			badge_22.destroy( false );
			badge_23.destroy( false );
			row_26.destroy( false );
			row_27.destroy( false );
			row_28.destroy( false );
			row_29.destroy( false );
			row_30.destroy( false );
			row_31.destroy( false );

			if ( detach ) {
				detachNode( div );
				detachNode( text );
				detachNode( div_1 );
				detachNode( text_4 );
				detachNode( div_2 );
				detachNode( text_10 );
				detachNode( div_3 );
				detachNode( text_13 );
				detachNode( div_4 );
				detachNode( text_16 );
				detachNode( div_5 );
				detachNode( text_26 );
				detachNode( div_6 );
				detachNode( text_46 );
				detachNode( div_10 );
				detachNode( text_47 );
				detachNode( div_11 );
				detachNode( text_57 );
				detachNode( div_12 );
				detachNode( text_60 );
			}
		}
	};
}

function create_row_yield_fragment_1 ( state, component ) {
	var col_1_yield_fragment = create_col_yield_fragment_1( state, component );

	var col_1 = new Col({
		target: null,
		_root: component._root,
		_yield: col_1_yield_fragment,
		data: { lg: 12 }
	});

	return {
		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_1.destroy( detach );
		}
	};
}

function create_col_yield_fragment_1 ( state, component ) {
	var h1 = createElement( 'h1' );
	h1.id = "navbars";
	h1.className = "text-muted my-4";
	appendNode( createText( "Navbars" ), h1 );
	var text_1 = createText( "\n\n        " );
	var div = createElement( 'div' );
	div.className = "bs-component";
	var nav = createElement( 'nav' );
	appendNode( nav, div );
	nav.className = "navbar navbar-toggleable-md navbar-inverse bg-primary";
	var button = createElement( 'button' );
	appendNode( button, nav );
	button.className = "navbar-toggler navbar-toggler-right";
	button.type = "button";
	setAttribute( button, 'data-toggle', "collapse" );
	setAttribute( button, 'data-target', "#navbarColor01" );
	setAttribute( button, 'aria-controls', "navbarColor01" );
	setAttribute( button, 'aria-expanded', "false" );
	setAttribute( button, 'aria-label', "Toggle navigation" );
	var span = createElement( 'span' );
	appendNode( span, button );
	span.className = "navbar-toggler-icon";
	appendNode( createText( "\n            " ), nav );
	var a = createElement( 'a' );
	appendNode( a, nav );
	a.className = "navbar-brand";
	a.href = "#";
	appendNode( createText( "Navbar" ), a );
	appendNode( createText( "\n\n            " ), nav );
	var div_1 = createElement( 'div' );
	appendNode( div_1, nav );
	div_1.className = "collapse navbar-collapse";
	div_1.id = "navbarColor01";
	var ul = createElement( 'ul' );
	appendNode( ul, div_1 );
	ul.className = "navbar-nav mr-auto";
	var navitem_8_yield_fragment = create_navitem_yield_fragment_1( state, component );

	var navitem_8 = new NavItem({
		target: ul,
		_root: component._root,
		_yield: navitem_8_yield_fragment,
		data: { active: true }
	});

	var navitem_9_yield_fragment = create_navitem_1_yield_fragment( state, component );

	var navitem_9 = new NavItem({
		target: ul,
		_root: component._root,
		_yield: navitem_9_yield_fragment
	});

	var navitem_10_yield_fragment = create_navitem_2_yield_fragment( state, component );

	var navitem_10 = new NavItem({
		target: ul,
		_root: component._root,
		_yield: navitem_10_yield_fragment
	});

	var navitem_11_yield_fragment = create_navitem_3_yield_fragment( state, component );

	var navitem_11 = new NavItem({
		target: ul,
		_root: component._root,
		_yield: navitem_11_yield_fragment
	});

	appendNode( createText( "\n              " ), div_1 );
	var form_2_yield_fragment = create_form_yield_fragment( state, component );

	var form_2 = new Form({
		target: div_1,
		_root: component._root,
		_yield: form_2_yield_fragment,
		data: { inline: true }
	});

	var text_6 = createText( "\n\n        " );
	var div_2 = createElement( 'div' );
	div_2.className = "bs-component";
	var nav_1 = createElement( 'nav' );
	appendNode( nav_1, div_2 );
	nav_1.className = "navbar navbar-toggleable-md navbar-light bg-inverse";
	var button_1 = createElement( 'button' );
	appendNode( button_1, nav_1 );
	button_1.className = "navbar-toggler navbar-toggler-right";
	button_1.type = "button";
	setAttribute( button_1, 'data-toggle', "collapse" );
	setAttribute( button_1, 'data-target', "#navbarColor01" );
	setAttribute( button_1, 'aria-controls', "navbarColor01" );
	setAttribute( button_1, 'aria-expanded', "false" );
	setAttribute( button_1, 'aria-label', "Toggle navigation" );
	var span_1 = createElement( 'span' );
	appendNode( span_1, button_1 );
	span_1.className = "navbar-toggler-icon";
	appendNode( createText( "\n            " ), nav_1 );
	var navbarbrand_1_yield_fragment = create_navbarbrand_yield_fragment( state, component );

	var navbarbrand_1 = new NavbarBrand({
		target: nav_1,
		_root: component._root,
		_yield: navbarbrand_1_yield_fragment
	});

	appendNode( createText( "\n\n            " ), nav_1 );
	var div_3 = createElement( 'div' );
	appendNode( div_3, nav_1 );
	div_3.className = "collapse navbar-collapse";
	div_3.id = "navbarColor01";
	var ul_1 = createElement( 'ul' );
	appendNode( ul_1, div_3 );
	ul_1.className = "navbar-nav mr-auto";
	var navitem_12_yield_fragment = create_navitem_4_yield_fragment( state, component );

	var navitem_12 = new NavItem({
		target: ul_1,
		_root: component._root,
		_yield: navitem_12_yield_fragment,
		data: { active: true }
	});

	var navitem_13_yield_fragment = create_navitem_5_yield_fragment( state, component );

	var navitem_13 = new NavItem({
		target: ul_1,
		_root: component._root,
		_yield: navitem_13_yield_fragment
	});

	var navitem_14_yield_fragment = create_navitem_6_yield_fragment( state, component );

	var navitem_14 = new NavItem({
		target: ul_1,
		_root: component._root,
		_yield: navitem_14_yield_fragment
	});

	var navitem_15_yield_fragment = create_navitem_7_yield_fragment( state, component );

	var navitem_15 = new NavItem({
		target: ul_1,
		_root: component._root,
		_yield: navitem_15_yield_fragment
	});

	appendNode( createText( "\n              " ), div_3 );
	var form_3_yield_fragment = create_form_1_yield_fragment( state, component );

	var form_3 = new Form({
		target: div_3,
		_root: component._root,
		_yield: form_3_yield_fragment,
		data: { inline: true }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
			insertNode( text_6, target, anchor );
			insertNode( div_2, target, anchor );
		},

		destroy: function ( detach ) {
			navitem_8.destroy( false );
			navitem_9.destroy( false );
			navitem_10.destroy( false );
			navitem_11.destroy( false );
			form_2.destroy( false );
			navbarbrand_1.destroy( false );
			navitem_12.destroy( false );
			navitem_13.destroy( false );
			navitem_14.destroy( false );
			navitem_15.destroy( false );
			form_3.destroy( false );

			if ( detach ) {
				detachNode( h1 );
				detachNode( text_1 );
				detachNode( div );
				detachNode( text_6 );
				detachNode( div_2 );
			}
		}
	};
}

function create_navitem_yield_fragment_1 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_1( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_1 ( state, component ) {
	var text = createText( "Home " );
	var span = createElement( 'span' );
	span.className = "sr-only";
	appendNode( createText( "(current)" ), span );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			insertNode( span, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
				detachNode( span );
			}
		}
	};
}

function create_navitem_1_yield_fragment ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_2( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_2 ( state, component ) {
	var text = createText( "Features" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_2_yield_fragment ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_3( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_3 ( state, component ) {
	var text = createText( "Pricing" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_3_yield_fragment ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_4( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_4 ( state, component ) {
	var text = createText( "About" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_form_yield_fragment ( state, component ) {
	var input = createElement( 'input' );
	input.className = "form-control mr-sm-2";
	input.type = "text";
	input.placeholder = "Search";
	var text = createText( "\n                " );
	var button_1_yield_fragment = create_button_yield_fragment( state, component );

	var button_1 = new Button({
		target: null,
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: {
			outline: true,
			class: "my-2 my-sm-0",
			type: "submit"
		}
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( input, target, anchor );
			insertNode( text, target, anchor );
			button_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			button_1.destroy( detach );

			if ( detach ) {
				detachNode( input );
				detachNode( text );
			}
		}
	};
}

function create_button_yield_fragment ( state, component ) {
	var text = createText( "Search" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navbarbrand_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	appendNode( createText( "Navbar" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_navitem_4_yield_fragment ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_5( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_5 ( state, component ) {
	var text = createText( "Home " );
	var span = createElement( 'span' );
	span.className = "sr-only";
	appendNode( createText( "(current)" ), span );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			insertNode( span, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
				detachNode( span );
			}
		}
	};
}

function create_navitem_5_yield_fragment ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_6( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_6 ( state, component ) {
	var text = createText( "Features" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_6_yield_fragment ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_7( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_7 ( state, component ) {
	var text = createText( "Pricing" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_7_yield_fragment ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_8( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_8 ( state, component ) {
	var text = createText( "About" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_form_1_yield_fragment ( state, component ) {
	var input = createElement( 'input' );
	input.className = "form-control mr-sm-2";
	input.type = "text";
	input.placeholder = "Search";
	var text = createText( "\n                " );
	var button_1_yield_fragment = create_button_yield_fragment_1( state, component );

	var button_1 = new Button({
		target: null,
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: {
			outline: true,
			class: "my-2 my-sm-0",
			type: "submit"
		}
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( input, target, anchor );
			insertNode( text, target, anchor );
			button_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			button_1.destroy( detach );

			if ( detach ) {
				detachNode( input );
				detachNode( text );
			}
		}
	};
}

function create_button_yield_fragment_1 ( state, component ) {
	var text = createText( "Search" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_row_1_yield_fragment ( state, component ) {
	var col_2_yield_fragment = create_col_yield_fragment_2( state, component );

	var col_2 = new Col({
		target: null,
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 7 }
	});

	var text = createText( "\n      " );
	var col_3_yield_fragment = create_col_1_yield_fragment_1( state, component );

	var col_3 = new Col({
		target: null,
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 5 }
	});

	return {
		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_2.destroy( detach );
			col_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_yield_fragment_2 ( state, component ) {
	var p = createElement( 'p' );
	p.className = "bs-component";
	var button_23_yield_fragment = create_button_yield_fragment_2( state, component );

	var button_23 = new Button({
		target: p,
		_root: component._root,
		_yield: button_23_yield_fragment,
		data: { color: "primary" }
	});

	appendNode( createText( "\n          " ), p );
	var button_24_yield_fragment = create_button_1_yield_fragment( state, component );

	var button_24 = new Button({
		target: p,
		_root: component._root,
		_yield: button_24_yield_fragment,
		data: { color: "secondary" }
	});

	appendNode( createText( "\n          " ), p );
	var button_25_yield_fragment = create_button_2_yield_fragment( state, component );

	var button_25 = new Button({
		target: p,
		_root: component._root,
		_yield: button_25_yield_fragment,
		data: { color: "success" }
	});

	appendNode( createText( "\n          " ), p );
	var button_26_yield_fragment = create_button_3_yield_fragment( state, component );

	var button_26 = new Button({
		target: p,
		_root: component._root,
		_yield: button_26_yield_fragment,
		data: { color: "info" }
	});

	appendNode( createText( "\n          " ), p );
	var button_27_yield_fragment = create_button_4_yield_fragment( state, component );

	var button_27 = new Button({
		target: p,
		_root: component._root,
		_yield: button_27_yield_fragment,
		data: { color: "warning" }
	});

	appendNode( createText( "\n          " ), p );
	var button_28_yield_fragment = create_button_5_yield_fragment( state, component );

	var button_28 = new Button({
		target: p,
		_root: component._root,
		_yield: button_28_yield_fragment,
		data: { color: "danger" }
	});

	appendNode( createText( "\n          " ), p );
	var button_29_yield_fragment = create_button_6_yield_fragment( state, component );

	var button_29 = new Button({
		target: p,
		_root: component._root,
		_yield: button_29_yield_fragment,
		data: { color: "link" }
	});

	var text_6 = createText( "\n\n        " );
	var p_1 = createElement( 'p' );
	p_1.className = "bs-component";
	var button_30_yield_fragment = create_button_7_yield_fragment( state, component );

	var button_30 = new Button({
		target: p_1,
		_root: component._root,
		_yield: button_30_yield_fragment,
		data: { color: "primary", disabled: true }
	});

	appendNode( createText( "\n          " ), p_1 );
	var button_31_yield_fragment = create_button_8_yield_fragment( state, component );

	var button_31 = new Button({
		target: p_1,
		_root: component._root,
		_yield: button_31_yield_fragment,
		data: { color: "secondary", disabled: true }
	});

	appendNode( createText( "\n          " ), p_1 );
	var button_32_yield_fragment = create_button_9_yield_fragment( state, component );

	var button_32 = new Button({
		target: p_1,
		_root: component._root,
		_yield: button_32_yield_fragment,
		data: { color: "success", disabled: true }
	});

	appendNode( createText( "\n          " ), p_1 );
	var button_33_yield_fragment = create_button_10_yield_fragment( state, component );

	var button_33 = new Button({
		target: p_1,
		_root: component._root,
		_yield: button_33_yield_fragment,
		data: { color: "info", disabled: true }
	});

	appendNode( createText( "\n          " ), p_1 );
	var button_34_yield_fragment = create_button_11_yield_fragment( state, component );

	var button_34 = new Button({
		target: p_1,
		_root: component._root,
		_yield: button_34_yield_fragment,
		data: { color: "warning", disabled: true }
	});

	appendNode( createText( "\n          " ), p_1 );
	var button_35_yield_fragment = create_button_12_yield_fragment( state, component );

	var button_35 = new Button({
		target: p_1,
		_root: component._root,
		_yield: button_35_yield_fragment,
		data: { color: "danger", disabled: true }
	});

	appendNode( createText( "\n          " ), p_1 );
	var button_36_yield_fragment = create_button_13_yield_fragment( state, component );

	var button_36 = new Button({
		target: p_1,
		_root: component._root,
		_yield: button_36_yield_fragment,
		data: { color: "link", disabled: true }
	});

	var text_13 = createText( "\n\n        " );
	var p_2 = createElement( 'p' );
	p_2.className = "bs-component";
	var button_37_yield_fragment = create_button_14_yield_fragment( state, component );

	var button_37 = new Button({
		target: p_2,
		_root: component._root,
		_yield: button_37_yield_fragment,
		data: { outline: true, color: "primary" }
	});

	appendNode( createText( "\n          " ), p_2 );
	var button_38_yield_fragment = create_button_15_yield_fragment( state, component );

	var button_38 = new Button({
		target: p_2,
		_root: component._root,
		_yield: button_38_yield_fragment,
		data: { outline: true, color: "secondary" }
	});

	appendNode( createText( "\n          " ), p_2 );
	var button_39_yield_fragment = create_button_16_yield_fragment( state, component );

	var button_39 = new Button({
		target: p_2,
		_root: component._root,
		_yield: button_39_yield_fragment,
		data: { outline: true, color: "success" }
	});

	appendNode( createText( "\n          " ), p_2 );
	var button_40_yield_fragment = create_button_17_yield_fragment( state, component );

	var button_40 = new Button({
		target: p_2,
		_root: component._root,
		_yield: button_40_yield_fragment,
		data: { outline: true, color: "info" }
	});

	appendNode( createText( "\n          " ), p_2 );
	var button_41_yield_fragment = create_button_18_yield_fragment( state, component );

	var button_41 = new Button({
		target: p_2,
		_root: component._root,
		_yield: button_41_yield_fragment,
		data: { outline: true, color: "warning" }
	});

	appendNode( createText( "\n          " ), p_2 );
	var button_42_yield_fragment = create_button_19_yield_fragment( state, component );

	var button_42 = new Button({
		target: p_2,
		_root: component._root,
		_yield: button_42_yield_fragment,
		data: { outline: true, color: "danger" }
	});

	var text_19 = createText( "\n\n        " );
	var div = createElement( 'div' );
	div.className = "bs-component";
	var button_43_yield_fragment = create_button_20_yield_fragment( state, component );

	var button_43 = new Button({
		target: div,
		_root: component._root,
		_yield: button_43_yield_fragment,
		data: { color: "primary", size: "lg" }
	});

	appendNode( createText( "\n          " ), div );
	var button_44_yield_fragment = create_button_21_yield_fragment( state, component );

	var button_44 = new Button({
		target: div,
		_root: component._root,
		_yield: button_44_yield_fragment,
		data: { color: "primary" }
	});

	appendNode( createText( "\n          " ), div );
	var button_45_yield_fragment = create_button_22_yield_fragment( state, component );

	var button_45 = new Button({
		target: div,
		_root: component._root,
		_yield: button_45_yield_fragment,
		data: { color: "primary", size: "sm" }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			insertNode( text_6, target, anchor );
			insertNode( p_1, target, anchor );
			insertNode( text_13, target, anchor );
			insertNode( p_2, target, anchor );
			insertNode( text_19, target, anchor );
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			button_23.destroy( false );
			button_24.destroy( false );
			button_25.destroy( false );
			button_26.destroy( false );
			button_27.destroy( false );
			button_28.destroy( false );
			button_29.destroy( false );
			button_30.destroy( false );
			button_31.destroy( false );
			button_32.destroy( false );
			button_33.destroy( false );
			button_34.destroy( false );
			button_35.destroy( false );
			button_36.destroy( false );
			button_37.destroy( false );
			button_38.destroy( false );
			button_39.destroy( false );
			button_40.destroy( false );
			button_41.destroy( false );
			button_42.destroy( false );
			button_43.destroy( false );
			button_44.destroy( false );
			button_45.destroy( false );

			if ( detach ) {
				detachNode( p );
				detachNode( text_6 );
				detachNode( p_1 );
				detachNode( text_13 );
				detachNode( p_2 );
				detachNode( text_19 );
				detachNode( div );
			}
		}
	};
}

function create_button_yield_fragment_2 ( state, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_1_yield_fragment ( state, component ) {
	var text = createText( "Secondary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_2_yield_fragment ( state, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_3_yield_fragment ( state, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_4_yield_fragment ( state, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_5_yield_fragment ( state, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_6_yield_fragment ( state, component ) {
	var text = createText( "Link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_7_yield_fragment ( state, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_8_yield_fragment ( state, component ) {
	var text = createText( "Secondary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_9_yield_fragment ( state, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_10_yield_fragment ( state, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_11_yield_fragment ( state, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_12_yield_fragment ( state, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_13_yield_fragment ( state, component ) {
	var text = createText( "Link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_14_yield_fragment ( state, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_15_yield_fragment ( state, component ) {
	var text = createText( "Secondary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_16_yield_fragment ( state, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_17_yield_fragment ( state, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_18_yield_fragment ( state, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_19_yield_fragment ( state, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_20_yield_fragment ( state, component ) {
	var text = createText( "Large button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_21_yield_fragment ( state, component ) {
	var text = createText( "Default button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_22_yield_fragment ( state, component ) {
	var text = createText( "Small button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_1_yield_fragment_1 ( state, component ) {
	var p = createElement( 'p' );
	p.className = "bs-component";
	var button_1_yield_fragment = create_button_yield_fragment_3( state, component );

	var button_1 = new Button({
		target: p,
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: {
			color: "primary",
			size: "lg",
			block: true
		}
	});

	var text = createText( "\n\n        " );
	var div = createElement( 'div' );
	div.className = "bs-component mb-1";
	var div_1 = createElement( 'div' );
	appendNode( div_1, div );
	div_1.className = "btn-group";
	setAttribute( div_1, 'data-toggle', "buttons" );
	var label = createElement( 'label' );
	appendNode( label, div_1 );
	label.className = "btn btn-primary active";
	var input = createElement( 'input' );
	appendNode( input, label );
	input.type = "checkbox";
	input.checked = '';
	appendNode( createText( " Checkbox 1" ), label );
	appendNode( createText( "\n            " ), div_1 );
	var label_1 = createElement( 'label' );
	appendNode( label_1, div_1 );
	label_1.className = "btn btn-primary";
	var input_1 = createElement( 'input' );
	appendNode( input_1, label_1 );
	input_1.type = "checkbox";
	appendNode( createText( " Checkbox 2" ), label_1 );
	appendNode( createText( "\n            " ), div_1 );
	var label_2 = createElement( 'label' );
	appendNode( label_2, div_1 );
	label_2.className = "btn btn-primary";
	var input_2 = createElement( 'input' );
	appendNode( input_2, label_2 );
	input_2.type = "checkbox";
	appendNode( createText( " Checkbox 3" ), label_2 );
	var text_6 = createText( "\n\n        " );
	var div_2 = createElement( 'div' );
	div_2.className = "bs-component";
	div_2.style.cssText = "margin-bottom: 15px;";
	var div_3 = createElement( 'div' );
	appendNode( div_3, div_2 );
	div_3.className = "btn-group";
	setAttribute( div_3, 'data-toggle', "buttons" );
	var label_3 = createElement( 'label' );
	appendNode( label_3, div_3 );
	label_3.className = "btn btn-primary active";
	var input_3 = createElement( 'input' );
	appendNode( input_3, label_3 );
	input_3.type = "radio";
	input_3.name = "options";
	input_3.id = "option1";
	input_3.checked = '';
	appendNode( createText( " Radio 1" ), label_3 );
	appendNode( createText( "\n            " ), div_3 );
	var label_4 = createElement( 'label' );
	appendNode( label_4, div_3 );
	label_4.className = "btn btn-primary";
	var input_4 = createElement( 'input' );
	appendNode( input_4, label_4 );
	input_4.type = "radio";
	input_4.name = "options";
	input_4.id = "option2";
	appendNode( createText( " Radio 2" ), label_4 );
	appendNode( createText( "\n            " ), div_3 );
	var label_5 = createElement( 'label' );
	appendNode( label_5, div_3 );
	label_5.className = "btn btn-primary";
	var input_5 = createElement( 'input' );
	appendNode( input_5, label_5 );
	input_5.type = "radio";
	input_5.name = "options";
	input_5.id = "option3";
	appendNode( createText( " Radio 3" ), label_5 );
	var text_12 = createText( "\n\n        " );
	var div_4 = createElement( 'div' );
	div_4.className = "bs-component";
	var buttongroup_2_yield_fragment = create_buttongroup_yield_fragment( state, component );

	var buttongroup_2 = new ButtonGroup({
		target: div_4,
		_root: component._root,
		_yield: buttongroup_2_yield_fragment,
		data: { vertical: true }
	});

	var text_13 = createText( "\n\n        " );
	var div_5 = createElement( 'div' );
	div_5.className = "bs-component";
	div_5.style.cssText = "margin-bottom: 15px;";
	var buttongroup_3_yield_fragment = create_buttongroup_1_yield_fragment( state, component );

	var buttongroup_3 = new ButtonGroup({
		target: div_5,
		_root: component._root,
		_yield: buttongroup_3_yield_fragment
	});

	var text_14 = createText( "\n\n        " );
	var div_6 = createElement( 'div' );
	div_6.className = "bs-component";
	div_6.style.cssText = "margin-bottom: 15px;";
	var buttontoolbar_1_yield_fragment = create_buttontoolbar_yield_fragment( state, component );

	var buttontoolbar_1 = new ButtonToolbar({
		target: div_6,
		_root: component._root,
		_yield: buttontoolbar_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			insertNode( text, target, anchor );
			insertNode( div, target, anchor );
			insertNode( text_6, target, anchor );
			insertNode( div_2, target, anchor );
			insertNode( text_12, target, anchor );
			insertNode( div_4, target, anchor );
			insertNode( text_13, target, anchor );
			insertNode( div_5, target, anchor );
			insertNode( text_14, target, anchor );
			insertNode( div_6, target, anchor );
		},

		destroy: function ( detach ) {
			button_1.destroy( false );
			buttongroup_2.destroy( false );
			buttongroup_3.destroy( false );
			buttontoolbar_1.destroy( false );

			if ( detach ) {
				detachNode( p );
				detachNode( text );
				detachNode( div );
				detachNode( text_6 );
				detachNode( div_2 );
				detachNode( text_12 );
				detachNode( div_4 );
				detachNode( text_13 );
				detachNode( div_5 );
				detachNode( text_14 );
				detachNode( div_6 );
			}
		}
	};
}

function create_button_yield_fragment_3 ( state, component ) {
	var text = createText( "Block level button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_buttongroup_yield_fragment ( state, component ) {
	var button_6_yield_fragment = create_button_yield_fragment_4( state, component );

	var button_6 = new Button({
		target: null,
		_root: component._root,
		_yield: button_6_yield_fragment,
		data: { color: "primary" }
	});

	var text = createText( "\n            " );
	var button_7_yield_fragment = create_button_1_yield_fragment_1( state, component );

	var button_7 = new Button({
		target: null,
		_root: component._root,
		_yield: button_7_yield_fragment,
		data: { color: "primary" }
	});

	var text_1 = createText( "\n            " );
	var button_8_yield_fragment = create_button_2_yield_fragment_1( state, component );

	var button_8 = new Button({
		target: null,
		_root: component._root,
		_yield: button_8_yield_fragment,
		data: { color: "primary" }
	});

	var text_2 = createText( "\n            " );
	var button_9_yield_fragment = create_button_3_yield_fragment_1( state, component );

	var button_9 = new Button({
		target: null,
		_root: component._root,
		_yield: button_9_yield_fragment,
		data: { color: "primary" }
	});

	var text_3 = createText( "\n            " );
	var button_10_yield_fragment = create_button_4_yield_fragment_1( state, component );

	var button_10 = new Button({
		target: null,
		_root: component._root,
		_yield: button_10_yield_fragment,
		data: { color: "primary" }
	});

	var text_4 = createText( "\n            " );
	var button_11_yield_fragment = create_button_5_yield_fragment_1( state, component );

	var button_11 = new Button({
		target: null,
		_root: component._root,
		_yield: button_11_yield_fragment,
		data: { color: "primary" }
	});

	return {
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

		destroy: function ( detach ) {
			button_6.destroy( detach );
			button_7.destroy( detach );
			button_8.destroy( detach );
			button_9.destroy( detach );
			button_10.destroy( detach );
			button_11.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
				detachNode( text_3 );
				detachNode( text_4 );
			}
		}
	};
}

function create_button_yield_fragment_4 ( state, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_1_yield_fragment_1 ( state, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_2_yield_fragment_1 ( state, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_3_yield_fragment_1 ( state, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_4_yield_fragment_1 ( state, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_5_yield_fragment_1 ( state, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_buttongroup_1_yield_fragment ( state, component ) {
	var button_3_yield_fragment = create_button_yield_fragment_5( state, component );

	var button_3 = new Button({
		target: null,
		_root: component._root,
		_yield: button_3_yield_fragment,
		data: { color: "secondary" }
	});

	var text = createText( "\n            " );
	var button_4_yield_fragment = create_button_1_yield_fragment_2( state, component );

	var button_4 = new Button({
		target: null,
		_root: component._root,
		_yield: button_4_yield_fragment,
		data: { color: "secondary" }
	});

	var text_1 = createText( "\n            " );
	var button_5_yield_fragment = create_button_2_yield_fragment_2( state, component );

	var button_5 = new Button({
		target: null,
		_root: component._root,
		_yield: button_5_yield_fragment,
		data: { color: "secondary" }
	});

	return {
		mount: function ( target, anchor ) {
			button_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			button_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			button_3.destroy( detach );
			button_4.destroy( detach );
			button_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
			}
		}
	};
}

function create_button_yield_fragment_5 ( state, component ) {
	var text = createText( "Left" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_1_yield_fragment_2 ( state, component ) {
	var text = createText( "Middle" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_2_yield_fragment_2 ( state, component ) {
	var text = createText( "Right" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_buttontoolbar_yield_fragment ( state, component ) {
	var buttongroup_3_yield_fragment = create_buttongroup_yield_fragment_1( state, component );

	var buttongroup_3 = new ButtonGroup({
		target: null,
		_root: component._root,
		_yield: buttongroup_3_yield_fragment
	});

	var text = createText( "\n            " );
	var buttongroup_4_yield_fragment = create_buttongroup_1_yield_fragment_1( state, component );

	var buttongroup_4 = new ButtonGroup({
		target: null,
		_root: component._root,
		_yield: buttongroup_4_yield_fragment
	});

	var text_1 = createText( "\n            " );
	var buttongroup_5_yield_fragment = create_buttongroup_2_yield_fragment( state, component );

	var buttongroup_5 = new ButtonGroup({
		target: null,
		_root: component._root,
		_yield: buttongroup_5_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			buttongroup_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			buttongroup_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			buttongroup_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			buttongroup_3.destroy( detach );
			buttongroup_4.destroy( detach );
			buttongroup_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
			}
		}
	};
}

function create_buttongroup_yield_fragment_1 ( state, component ) {
	var button_4_yield_fragment = create_button_yield_fragment_6( state, component );

	var button_4 = new Button({
		target: null,
		_root: component._root,
		_yield: button_4_yield_fragment,
		data: { color: "secondary" }
	});

	var text = createText( "\n              " );
	var button_5_yield_fragment = create_button_1_yield_fragment_3( state, component );

	var button_5 = new Button({
		target: null,
		_root: component._root,
		_yield: button_5_yield_fragment,
		data: { color: "secondary" }
	});

	var text_1 = createText( "\n              " );
	var button_6_yield_fragment = create_button_2_yield_fragment_3( state, component );

	var button_6 = new Button({
		target: null,
		_root: component._root,
		_yield: button_6_yield_fragment,
		data: { color: "secondary" }
	});

	var text_2 = createText( "\n              " );
	var button_7_yield_fragment = create_button_3_yield_fragment_2( state, component );

	var button_7 = new Button({
		target: null,
		_root: component._root,
		_yield: button_7_yield_fragment,
		data: { color: "secondary" }
	});

	return {
		mount: function ( target, anchor ) {
			button_4._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button_5._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			button_6._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			button_7._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			button_4.destroy( detach );
			button_5.destroy( detach );
			button_6.destroy( detach );
			button_7.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
			}
		}
	};
}

function create_button_yield_fragment_6 ( state, component ) {
	var text = createText( "1" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_1_yield_fragment_3 ( state, component ) {
	var text = createText( "2" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_2_yield_fragment_3 ( state, component ) {
	var text = createText( "3" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_3_yield_fragment_2 ( state, component ) {
	var text = createText( "4" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_buttongroup_1_yield_fragment_1 ( state, component ) {
	var button_3_yield_fragment = create_button_yield_fragment_7( state, component );

	var button_3 = new Button({
		target: null,
		_root: component._root,
		_yield: button_3_yield_fragment,
		data: { color: "secondary" }
	});

	var text = createText( "\n              " );
	var button_4_yield_fragment = create_button_1_yield_fragment_4( state, component );

	var button_4 = new Button({
		target: null,
		_root: component._root,
		_yield: button_4_yield_fragment,
		data: { color: "secondary" }
	});

	var text_1 = createText( "\n              " );
	var button_5_yield_fragment = create_button_2_yield_fragment_4( state, component );

	var button_5 = new Button({
		target: null,
		_root: component._root,
		_yield: button_5_yield_fragment,
		data: { color: "secondary" }
	});

	return {
		mount: function ( target, anchor ) {
			button_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			button_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			button_3.destroy( detach );
			button_4.destroy( detach );
			button_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
			}
		}
	};
}

function create_button_yield_fragment_7 ( state, component ) {
	var text = createText( "5" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_1_yield_fragment_4 ( state, component ) {
	var text = createText( "6" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_2_yield_fragment_4 ( state, component ) {
	var text = createText( "7" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_buttongroup_2_yield_fragment ( state, component ) {
	var button_1_yield_fragment = create_button_yield_fragment_8( state, component );

	var button_1 = new Button({
		target: null,
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: { color: "secondary" }
	});

	return {
		mount: function ( target, anchor ) {
			button_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			button_1.destroy( detach );
		}
	};
}

function create_button_yield_fragment_8 ( state, component ) {
	var text = createText( "8" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_row_2_yield_fragment ( state, component ) {
	var div = createElement( 'div' );
	var h2 = createElement( 'h2' );
	appendNode( h2, div );
	h2.className = "text-muted my-4";
	appendNode( createText( "Dropdowns" ), h2 );
	appendNode( createText( "\n        " ), div );
	var h4 = createElement( 'h4' );
	appendNode( h4, div );
	h4.className = "text-muted";
	appendNode( createText( "Dropdown" ), h4 );
	appendNode( createText( "\n\n        " ), div );
	var dropdown_2_yield_fragment = create_dropdown_yield_fragment( state, component );

	var dropdown_2 = new Dropdown({
		target: div,
		_root: component._root,
		_yield: dropdown_2_yield_fragment,
		data: { open: state.open }
	});

	appendNode( createText( "\n\n        " ), div );
	var h4_1 = createElement( 'h4' );
	appendNode( h4_1, div );
	h4_1.className = "text-muted";
	appendNode( createText( "Dropup" ), h4_1 );
	appendNode( createText( "\n\n        " ), div );
	var dropdown_3_yield_fragment = create_dropdown_1_yield_fragment( state, component );

	var dropdown_3 = new Dropdown({
		target: div,
		_root: component._root,
		_yield: dropdown_3_yield_fragment,
		data: { dropup: true, open: state.open2 }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},

		update: function ( changed, state ) {
			var dropdown_2_changes = {};

			if ( 'open' in changed ) dropdown_2_changes.open = state.open;

			if ( Object.keys( dropdown_2_changes ).length ) dropdown_2.set( dropdown_2_changes );

			var dropdown_3_changes = {};

			if ( 'open2' in changed ) dropdown_3_changes.open = state.open2;

			if ( Object.keys( dropdown_3_changes ).length ) dropdown_3.set( dropdown_3_changes );
		},

		destroy: function ( detach ) {
			dropdown_2.destroy( false );
			dropdown_3.destroy( false );

			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function create_dropdown_yield_fragment ( state, component ) {
	var button_1_yield_fragment = create_button_yield_fragment_9( state, component );

	var button_1 = new Button({
		target: null,
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

	var text = createText( "\n          " );
	var dropdownmenu_1_yield_fragment = create_dropdownmenu_yield_fragment( state, component );

	var dropdownmenu_1 = new DropdownMenu({
		target: null,
		_root: component._root,
		_yield: dropdownmenu_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			button_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownmenu_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			button_1.destroy( detach );
			dropdownmenu_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_yield_fragment_9 ( state, component ) {
	var text = createText( "Dropdown" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_dropdownmenu_yield_fragment ( state, component ) {
	var dropdownheader_1_yield_fragment = create_dropdownheader_yield_fragment( state, component );

	var dropdownheader_1 = new DropdownHeader({
		target: null,
		_root: component._root,
		_yield: dropdownheader_1_yield_fragment
	});

	var text = createText( "\n            " );
	var dropdownitem_2_yield_fragment = create_dropdownitem_yield_fragment( state, component );

	var dropdownitem_2 = new DropdownItem({
		target: null,
		_root: component._root,
		_yield: dropdownitem_2_yield_fragment
	});

	var text_1 = createText( "\n            " );

	var dropdowndivider = new DropdownDivider({
		target: null,
		_root: component._root
	});

	var text_2 = createText( "\n            " );
	var dropdownitem_3_yield_fragment = create_dropdownitem_1_yield_fragment( state, component );

	var dropdownitem_3 = new DropdownItem({
		target: null,
		_root: component._root,
		_yield: dropdownitem_3_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			dropdownheader_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownitem_2._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			dropdowndivider._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			dropdownitem_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			dropdownheader_1.destroy( detach );
			dropdownitem_2.destroy( detach );
			dropdowndivider.destroy( detach );
			dropdownitem_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
			}
		}
	};
}

function create_dropdownheader_yield_fragment ( state, component ) {
	var text = createText( "Heading" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_dropdownitem_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	appendNode( createText( "Dropdown link" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_dropdownitem_1_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	appendNode( createText( "Dropdown link" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_dropdown_1_yield_fragment ( state, component ) {
	var button_1_yield_fragment = create_button_yield_fragment_10( state, component );

	var button_1 = new Button({
		target: null,
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

	var text = createText( "\n          " );
	var dropdownmenu_1_yield_fragment = create_dropdownmenu_yield_fragment_1( state, component );

	var dropdownmenu_1 = new DropdownMenu({
		target: null,
		_root: component._root,
		_yield: dropdownmenu_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			button_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownmenu_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			button_1.destroy( detach );
			dropdownmenu_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_button_yield_fragment_10 ( state, component ) {
	var text = createText( "Dropup" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_dropdownmenu_yield_fragment_1 ( state, component ) {
	var dropdownitem_2_yield_fragment = create_dropdownitem_yield_fragment_1( state, component );

	var dropdownitem_2 = new DropdownItem({
		target: null,
		_root: component._root,
		_yield: dropdownitem_2_yield_fragment
	});

	var text = createText( "\n            " );
	var dropdownitem_3_yield_fragment = create_dropdownitem_1_yield_fragment_1( state, component );

	var dropdownitem_3 = new DropdownItem({
		target: null,
		_root: component._root,
		_yield: dropdownitem_3_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			dropdownitem_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownitem_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			dropdownitem_2.destroy( detach );
			dropdownitem_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_dropdownitem_yield_fragment_1 ( state, component ) {
	var text = createText( "Dropdown link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_dropdownitem_1_yield_fragment_1 ( state, component ) {
	var text = createText( "Dropdown link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_row_3_yield_fragment ( state, component ) {
	var div = createElement( 'div' );
	div.className = "col-lg-4";
	var div_1 = createElement( 'div' );
	appendNode( div_1, div );
	div_1.className = "bs-component";
	var h1 = createElement( 'h1' );
	appendNode( h1, div_1 );
	appendNode( createText( "Heading 1" ), h1 );
	appendNode( createText( "\n          " ), div_1 );
	var h2 = createElement( 'h2' );
	appendNode( h2, div_1 );
	appendNode( createText( "Heading 2" ), h2 );
	appendNode( createText( "\n          " ), div_1 );
	var h3 = createElement( 'h3' );
	appendNode( h3, div_1 );
	appendNode( createText( "Heading 3" ), h3 );
	appendNode( createText( "\n          " ), div_1 );
	var h4 = createElement( 'h4' );
	appendNode( h4, div_1 );
	appendNode( createText( "Heading 4" ), h4 );
	appendNode( createText( "\n          " ), div_1 );
	var h5 = createElement( 'h5' );
	appendNode( h5, div_1 );
	appendNode( createText( "Heading 5" ), h5 );
	appendNode( createText( "\n          " ), div_1 );
	var h6 = createElement( 'h6' );
	appendNode( h6, div_1 );
	appendNode( createText( "Heading 6" ), h6 );
	appendNode( createText( "\n          " ), div_1 );
	var h3_1 = createElement( 'h3' );
	appendNode( h3_1, div_1 );
	appendNode( createText( "Heading\n            " ), h3_1 );
	var small = createElement( 'small' );
	appendNode( small, h3_1 );
	small.className = "text-muted";
	appendNode( createText( "with muted text" ), small );
	appendNode( createText( "\n          " ), div_1 );
	var p = createElement( 'p' );
	appendNode( p, div_1 );
	p.className = "lead";
	appendNode( createText( "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor." ), p );
	var text_16 = createText( "\n      " );
	var div_2 = createElement( 'div' );
	div_2.className = "col-lg-4";
	var div_3 = createElement( 'div' );
	appendNode( div_3, div_2 );
	div_3.className = "bs-component";
	var h2_1 = createElement( 'h2' );
	appendNode( h2_1, div_3 );
	appendNode( createText( "Example body text" ), h2_1 );
	appendNode( createText( "\n          " ), div_3 );
	var p_1 = createElement( 'p' );
	appendNode( p_1, div_3 );
	appendNode( createText( "Nullam quis risus eget " ), p_1 );
	var a = createElement( 'a' );
	appendNode( a, p_1 );
	a.href = "#";
	appendNode( createText( "urna mollis ornare" ), a );
	appendNode( createText( " vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula." ), p_1 );
	appendNode( createText( "\n          " ), div_3 );
	var p_2 = createElement( 'p' );
	appendNode( p_2, div_3 );
	var small_1 = createElement( 'small' );
	appendNode( small_1, p_2 );
	appendNode( createText( "This line of text is meant to be treated as fine print." ), small_1 );
	appendNode( createText( "\n          " ), div_3 );
	var p_3 = createElement( 'p' );
	appendNode( p_3, div_3 );
	appendNode( createText( "The following is " ), p_3 );
	var strong = createElement( 'strong' );
	appendNode( strong, p_3 );
	appendNode( createText( "rendered as bold text" ), strong );
	appendNode( createText( "." ), p_3 );
	appendNode( createText( "\n          " ), div_3 );
	var p_4 = createElement( 'p' );
	appendNode( p_4, div_3 );
	appendNode( createText( "The following is " ), p_4 );
	var em = createElement( 'em' );
	appendNode( em, p_4 );
	appendNode( createText( "rendered as italicized text" ), em );
	appendNode( createText( "." ), p_4 );
	appendNode( createText( "\n          " ), div_3 );
	var p_5 = createElement( 'p' );
	appendNode( p_5, div_3 );
	appendNode( createText( "An abbreviation of the word attribute is " ), p_5 );
	var abbr = createElement( 'abbr' );
	appendNode( abbr, p_5 );
	abbr.title = "attribute";
	appendNode( createText( "attr" ), abbr );
	appendNode( createText( "." ), p_5 );
	var text_36 = createText( "\n      " );
	var div_4 = createElement( 'div' );
	div_4.className = "col-lg-4";
	var div_5 = createElement( 'div' );
	appendNode( div_5, div_4 );
	div_5.className = "bs-component";
	var h2_2 = createElement( 'h2' );
	appendNode( h2_2, div_5 );
	appendNode( createText( "Emphasis classes" ), h2_2 );
	appendNode( createText( "\n          " ), div_5 );
	var p_6 = createElement( 'p' );
	appendNode( p_6, div_5 );
	p_6.className = "text-muted";
	appendNode( createText( "Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh." ), p_6 );
	appendNode( createText( "\n          " ), div_5 );
	var p_7 = createElement( 'p' );
	appendNode( p_7, div_5 );
	p_7.className = "text-primary";
	appendNode( createText( "Nullam id dolor id nibh ultricies vehicula ut id elit." ), p_7 );
	appendNode( createText( "\n          " ), div_5 );
	var p_8 = createElement( 'p' );
	appendNode( p_8, div_5 );
	p_8.className = "text-warning";
	appendNode( createText( "Etiam porta sem malesuada magna mollis euismod." ), p_8 );
	appendNode( createText( "\n          " ), div_5 );
	var p_9 = createElement( 'p' );
	appendNode( p_9, div_5 );
	p_9.className = "text-danger";
	appendNode( createText( "Donec ullamcorper nulla non metus auctor fringilla." ), p_9 );
	appendNode( createText( "\n          " ), div_5 );
	var p_10 = createElement( 'p' );
	appendNode( p_10, div_5 );
	p_10.className = "text-success";
	appendNode( createText( "Duis mollis, est non commodo luctus, nisi erat porttitor ligula." ), p_10 );
	appendNode( createText( "\n          " ), div_5 );
	var p_11 = createElement( 'p' );
	appendNode( p_11, div_5 );
	p_11.className = "text-info";
	appendNode( createText( "Maecenas sed diam eget risus varius blandit sit amet non magna." ), p_11 );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			insertNode( text_16, target, anchor );
			insertNode( div_2, target, anchor );
			insertNode( text_36, target, anchor );
			insertNode( div_4, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( div );
				detachNode( text_16 );
				detachNode( div_2 );
				detachNode( text_36 );
				detachNode( div_4 );
			}
		}
	};
}

function create_row_4_yield_fragment ( state, component ) {
	var col_2_yield_fragment = create_col_yield_fragment_3( state, component );

	var col_2 = new Col({
		target: null,
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 6 }
	});

	var text = createText( "\n      " );
	var col_3_yield_fragment = create_col_1_yield_fragment_2( state, component );

	var col_3 = new Col({
		target: null,
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 6 }
	});

	return {
		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_2.destroy( detach );
			col_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_yield_fragment_3 ( state, component ) {
	var blockquote = createElement( 'blockquote' );
	blockquote.className = "blockquote";
	var p = createElement( 'p' );
	appendNode( p, blockquote );
	appendNode( createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." ), p );
	appendNode( createText( "\n          " ), blockquote );
	var footer = createElement( 'footer' );
	appendNode( footer, blockquote );
	footer.className = "blockquote-footer";
	appendNode( createText( "Someone famous in " ), footer );
	var cite = createElement( 'cite' );
	appendNode( cite, footer );
	cite.title = "Source Title";
	appendNode( createText( "Source Title" ), cite );

	return {
		mount: function ( target, anchor ) {
			insertNode( blockquote, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( blockquote );
			}
		}
	};
}

function create_col_1_yield_fragment_2 ( state, component ) {
	var blockquote = createElement( 'blockquote' );
	blockquote.className = "blockquote blockquote-reverse";
	var p = createElement( 'p' );
	appendNode( p, blockquote );
	appendNode( createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." ), p );
	appendNode( createText( "\n          " ), blockquote );
	var footer = createElement( 'footer' );
	appendNode( footer, blockquote );
	footer.className = "blockquote-footer";
	appendNode( createText( "Someone famous in " ), footer );
	var cite = createElement( 'cite' );
	appendNode( cite, footer );
	cite.title = "Source Title";
	appendNode( createText( "Source Title" ), cite );

	return {
		mount: function ( target, anchor ) {
			insertNode( blockquote, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( blockquote );
			}
		}
	};
}

function create_row_5_yield_fragment ( state, component ) {
	var col_1_yield_fragment = create_col_yield_fragment_4( state, component );

	var col_1 = new Col({
		target: null,
		_root: component._root,
		_yield: col_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_1.destroy( detach );
		}
	};
}

function create_col_yield_fragment_4 ( state, component ) {
	var table_1_yield_fragment = create_table_yield_fragment( state, component );

	var table_1 = new Table({
		target: null,
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
		mount: function ( target, anchor ) {
			table_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			table_1.destroy( detach );
		}
	};
}

function create_table_yield_fragment ( state, component ) {
	var thead = createElement( 'thead' );
	thead.className = "thead-inverse";
	var tr = createElement( 'tr' );
	appendNode( tr, thead );
	var th = createElement( 'th' );
	appendNode( th, tr );
	appendNode( createText( "#" ), th );
	appendNode( createText( "\n                " ), tr );
	var th_1 = createElement( 'th' );
	appendNode( th_1, tr );
	appendNode( createText( "Column heading" ), th_1 );
	appendNode( createText( "\n                " ), tr );
	var th_2 = createElement( 'th' );
	appendNode( th_2, tr );
	appendNode( createText( "Column heading" ), th_2 );
	appendNode( createText( "\n                " ), tr );
	var th_3 = createElement( 'th' );
	appendNode( th_3, tr );
	appendNode( createText( "Column heading" ), th_3 );
	var text_7 = createText( "\n            " );
	var tbody = createElement( 'tbody' );
	var tr_1 = createElement( 'tr' );
	appendNode( tr_1, tbody );
	var td = createElement( 'td' );
	appendNode( td, tr_1 );
	appendNode( createText( "1" ), td );
	appendNode( createText( "\n                " ), tr_1 );
	var td_1 = createElement( 'td' );
	appendNode( td_1, tr_1 );
	appendNode( createText( "Column content" ), td_1 );
	appendNode( createText( "\n                " ), tr_1 );
	var td_2 = createElement( 'td' );
	appendNode( td_2, tr_1 );
	appendNode( createText( "Column content" ), td_2 );
	appendNode( createText( "\n                " ), tr_1 );
	var td_3 = createElement( 'td' );
	appendNode( td_3, tr_1 );
	appendNode( createText( "Column content" ), td_3 );
	appendNode( createText( "\n              " ), tbody );
	var tr_2 = createElement( 'tr' );
	appendNode( tr_2, tbody );
	var td_4 = createElement( 'td' );
	appendNode( td_4, tr_2 );
	appendNode( createText( "2" ), td_4 );
	appendNode( createText( "\n                " ), tr_2 );
	var td_5 = createElement( 'td' );
	appendNode( td_5, tr_2 );
	appendNode( createText( "Column content" ), td_5 );
	appendNode( createText( "\n                " ), tr_2 );
	var td_6 = createElement( 'td' );
	appendNode( td_6, tr_2 );
	appendNode( createText( "Column content" ), td_6 );
	appendNode( createText( "\n                " ), tr_2 );
	var td_7 = createElement( 'td' );
	appendNode( td_7, tr_2 );
	appendNode( createText( "Column content" ), td_7 );
	appendNode( createText( "\n              " ), tbody );
	var tr_3 = createElement( 'tr' );
	appendNode( tr_3, tbody );
	tr_3.className = "table-info";
	var td_8 = createElement( 'td' );
	appendNode( td_8, tr_3 );
	appendNode( createText( "3" ), td_8 );
	appendNode( createText( "\n                " ), tr_3 );
	var td_9 = createElement( 'td' );
	appendNode( td_9, tr_3 );
	appendNode( createText( "Column content" ), td_9 );
	appendNode( createText( "\n                " ), tr_3 );
	var td_10 = createElement( 'td' );
	appendNode( td_10, tr_3 );
	appendNode( createText( "Column content" ), td_10 );
	appendNode( createText( "\n                " ), tr_3 );
	var td_11 = createElement( 'td' );
	appendNode( td_11, tr_3 );
	appendNode( createText( "Column content" ), td_11 );
	appendNode( createText( "\n              " ), tbody );
	var tr_4 = createElement( 'tr' );
	appendNode( tr_4, tbody );
	tr_4.className = "table-success";
	var td_12 = createElement( 'td' );
	appendNode( td_12, tr_4 );
	appendNode( createText( "4" ), td_12 );
	appendNode( createText( "\n                " ), tr_4 );
	var td_13 = createElement( 'td' );
	appendNode( td_13, tr_4 );
	appendNode( createText( "Column content" ), td_13 );
	appendNode( createText( "\n                " ), tr_4 );
	var td_14 = createElement( 'td' );
	appendNode( td_14, tr_4 );
	appendNode( createText( "Column content" ), td_14 );
	appendNode( createText( "\n                " ), tr_4 );
	var td_15 = createElement( 'td' );
	appendNode( td_15, tr_4 );
	appendNode( createText( "Column content" ), td_15 );
	appendNode( createText( "\n              " ), tbody );
	var tr_5 = createElement( 'tr' );
	appendNode( tr_5, tbody );
	tr_5.className = "table-danger";
	var td_16 = createElement( 'td' );
	appendNode( td_16, tr_5 );
	appendNode( createText( "5" ), td_16 );
	appendNode( createText( "\n                " ), tr_5 );
	var td_17 = createElement( 'td' );
	appendNode( td_17, tr_5 );
	appendNode( createText( "Column content" ), td_17 );
	appendNode( createText( "\n                " ), tr_5 );
	var td_18 = createElement( 'td' );
	appendNode( td_18, tr_5 );
	appendNode( createText( "Column content" ), td_18 );
	appendNode( createText( "\n                " ), tr_5 );
	var td_19 = createElement( 'td' );
	appendNode( td_19, tr_5 );
	appendNode( createText( "Column content" ), td_19 );
	appendNode( createText( "\n              " ), tbody );
	var tr_6 = createElement( 'tr' );
	appendNode( tr_6, tbody );
	tr_6.className = "table-warning";
	var td_20 = createElement( 'td' );
	appendNode( td_20, tr_6 );
	appendNode( createText( "6" ), td_20 );
	appendNode( createText( "\n                " ), tr_6 );
	var td_21 = createElement( 'td' );
	appendNode( td_21, tr_6 );
	appendNode( createText( "Column content" ), td_21 );
	appendNode( createText( "\n                " ), tr_6 );
	var td_22 = createElement( 'td' );
	appendNode( td_22, tr_6 );
	appendNode( createText( "Column content" ), td_22 );
	appendNode( createText( "\n                " ), tr_6 );
	var td_23 = createElement( 'td' );
	appendNode( td_23, tr_6 );
	appendNode( createText( "Column content" ), td_23 );
	appendNode( createText( "\n              " ), tbody );
	var tr_7 = createElement( 'tr' );
	appendNode( tr_7, tbody );
	tr_7.className = "table-active";
	var td_24 = createElement( 'td' );
	appendNode( td_24, tr_7 );
	appendNode( createText( "7" ), td_24 );
	appendNode( createText( "\n                " ), tr_7 );
	var td_25 = createElement( 'td' );
	appendNode( td_25, tr_7 );
	appendNode( createText( "Column content" ), td_25 );
	appendNode( createText( "\n                " ), tr_7 );
	var td_26 = createElement( 'td' );
	appendNode( td_26, tr_7 );
	appendNode( createText( "Column content" ), td_26 );
	appendNode( createText( "\n                " ), tr_7 );
	var td_27 = createElement( 'td' );
	appendNode( td_27, tr_7 );
	appendNode( createText( "Column content" ), td_27 );

	return {
		mount: function ( target, anchor ) {
			insertNode( thead, target, anchor );
			insertNode( text_7, target, anchor );
			insertNode( tbody, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( thead );
				detachNode( text_7 );
				detachNode( tbody );
			}
		}
	};
}

function create_row_6_yield_fragment ( state, component ) {
	var col_2_yield_fragment = create_col_yield_fragment_5( state, component );

	var col_2 = new Col({
		target: null,
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 6 }
	});

	var text = createText( "\n\n      " );
	var col_3_yield_fragment = create_col_1_yield_fragment_3( state, component );

	var col_3 = new Col({
		target: null,
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: { size: 4, offset: 1 } }
	});

	return {
		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_2.destroy( detach );
			col_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_yield_fragment_5 ( state, component ) {
	var form_1_yield_fragment = create_form_yield_fragment_1( state, component );

	var form_1 = new Form({
		target: null,
		_root: component._root,
		_yield: form_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			form_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			form_1.destroy( detach );
		}
	};
}

function create_form_yield_fragment_1 ( state, component ) {
	var fieldset = createElement( 'fieldset' );
	var legend = createElement( 'legend' );
	appendNode( legend, fieldset );
	appendNode( createText( "Legend" ), legend );
	appendNode( createText( "\n            " ), fieldset );
	var div = createElement( 'div' );
	appendNode( div, fieldset );
	div.className = "form-group";
	var label = createElement( 'label' );
	appendNode( label, div );
	label.htmlFor = "exampleInputEmail1";
	appendNode( createText( "Email address" ), label );
	appendNode( createText( "\n              " ), div );
	var input = createElement( 'input' );
	appendNode( input, div );
	input.type = "email";
	input.className = "form-control";
	input.id = "exampleInputEmail1";
	setAttribute( input, 'aria-describedby', "emailHelp" );
	input.placeholder = "Enter email";
	appendNode( createText( "\n              " ), div );
	var small = createElement( 'small' );
	appendNode( small, div );
	small.id = "emailHelp";
	small.className = "form-text text-muted";
	appendNode( createText( "We'll never share your email with anyone else." ), small );
	appendNode( createText( "\n            " ), fieldset );
	var div_1 = createElement( 'div' );
	appendNode( div_1, fieldset );
	div_1.className = "form-group";
	var label_1 = createElement( 'label' );
	appendNode( label_1, div_1 );
	label_1.htmlFor = "exampleInputPassword1";
	appendNode( createText( "Password" ), label_1 );
	appendNode( createText( "\n              " ), div_1 );
	var input_1 = createElement( 'input' );
	appendNode( input_1, div_1 );
	input_1.type = "password";
	input_1.className = "form-control";
	input_1.id = "exampleInputPassword1";
	input_1.placeholder = "Password";
	appendNode( createText( "\n            " ), fieldset );
	var div_2 = createElement( 'div' );
	appendNode( div_2, fieldset );
	div_2.className = "form-group";
	var label_2 = createElement( 'label' );
	appendNode( label_2, div_2 );
	label_2.htmlFor = "exampleSelect1";
	appendNode( createText( "Example select" ), label_2 );
	appendNode( createText( "\n              " ), div_2 );
	var select = createElement( 'select' );
	appendNode( select, div_2 );
	var option = createElement( 'option' );
	appendNode( option, select );
	appendNode( createText( "1" ), option );

	option.__value = option.textContent;

	var option_1 = createElement( 'option' );
	appendNode( option_1, select );
	appendNode( createText( "2" ), option_1 );

	option_1.__value = option_1.textContent;

	var option_2 = createElement( 'option' );
	appendNode( option_2, select );
	appendNode( createText( "3" ), option_2 );

	option_2.__value = option_2.textContent;

	var option_3 = createElement( 'option' );
	appendNode( option_3, select );
	appendNode( createText( "4" ), option_3 );

	option_3.__value = option_3.textContent;

	var option_4 = createElement( 'option' );
	appendNode( option_4, select );
	appendNode( createText( "5" ), option_4 );

	option_4.__value = option_4.textContent;

	select.className = "form-control";
	select.id = "exampleSelect1";
	appendNode( createText( "\n            " ), fieldset );
	var div_3 = createElement( 'div' );
	appendNode( div_3, fieldset );
	div_3.className = "form-group";
	var label_3 = createElement( 'label' );
	appendNode( label_3, div_3 );
	label_3.htmlFor = "exampleSelect2";
	appendNode( createText( "Example multiple select" ), label_3 );
	appendNode( createText( "\n              " ), div_3 );
	var select_1 = createElement( 'select' );
	appendNode( select_1, div_3 );
	var option_5 = createElement( 'option' );
	appendNode( option_5, select_1 );
	appendNode( createText( "1" ), option_5 );

	option_5.__value = option_5.textContent;

	var option_6 = createElement( 'option' );
	appendNode( option_6, select_1 );
	appendNode( createText( "2" ), option_6 );

	option_6.__value = option_6.textContent;

	var option_7 = createElement( 'option' );
	appendNode( option_7, select_1 );
	appendNode( createText( "3" ), option_7 );

	option_7.__value = option_7.textContent;

	var option_8 = createElement( 'option' );
	appendNode( option_8, select_1 );
	appendNode( createText( "4" ), option_8 );

	option_8.__value = option_8.textContent;

	var option_9 = createElement( 'option' );
	appendNode( option_9, select_1 );
	appendNode( createText( "5" ), option_9 );

	option_9.__value = option_9.textContent;

	select_1.multiple = '';
	select_1.className = "form-control";
	select_1.id = "exampleSelect2";
	appendNode( createText( "\n            " ), fieldset );
	var div_4 = createElement( 'div' );
	appendNode( div_4, fieldset );
	div_4.className = "form-group";
	var label_4 = createElement( 'label' );
	appendNode( label_4, div_4 );
	label_4.htmlFor = "exampleTextarea";
	appendNode( createText( "Example textarea" ), label_4 );
	appendNode( createText( "\n              " ), div_4 );
	var textarea = createElement( 'textarea' );
	appendNode( textarea, div_4 );
	textarea.className = "form-control";
	textarea.id = "exampleTextarea";
	textarea.rows = "3";
	appendNode( createText( "\n            " ), fieldset );
	var div_5 = createElement( 'div' );
	appendNode( div_5, fieldset );
	div_5.className = "form-group";
	var label_5 = createElement( 'label' );
	appendNode( label_5, div_5 );
	label_5.htmlFor = "exampleInputFile";
	appendNode( createText( "File input" ), label_5 );
	appendNode( createText( "\n              " ), div_5 );
	var input_2 = createElement( 'input' );
	appendNode( input_2, div_5 );
	input_2.type = "file";
	input_2.className = "form-control-file";
	input_2.id = "exampleInputFile";
	setAttribute( input_2, 'aria-describedby', "fileHelp" );
	appendNode( createText( "\n              " ), div_5 );
	var small_1 = createElement( 'small' );
	appendNode( small_1, div_5 );
	small_1.id = "fileHelp";
	small_1.className = "form-text text-muted";
	appendNode( createText( "This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line." ), small_1 );
	appendNode( createText( "\n            " ), fieldset );
	var fieldset_1 = createElement( 'fieldset' );
	appendNode( fieldset_1, fieldset );
	fieldset_1.className = "form-group";
	var legend_1 = createElement( 'legend' );
	appendNode( legend_1, fieldset_1 );
	appendNode( createText( "Radio buttons" ), legend_1 );
	appendNode( createText( "\n              " ), fieldset_1 );
	var div_6 = createElement( 'div' );
	appendNode( div_6, fieldset_1 );
	div_6.className = "form-check";
	var label_6 = createElement( 'label' );
	appendNode( label_6, div_6 );
	label_6.className = "form-check-label";
	var input_3 = createElement( 'input' );
	appendNode( input_3, label_6 );
	input_3.type = "radio";
	input_3.className = "form-check-input";
	input_3.name = "optionsRadios";
	input_3.id = "optionsRadios1";
	input_3.__value = "option1";
	input_3.value = input_3.__value;
	input_3.checked = '';
	appendNode( createText( "\n                      Option one is this and that—be sure to include why it's great" ), label_6 );
	appendNode( createText( "\n              " ), fieldset_1 );
	var div_7 = createElement( 'div' );
	appendNode( div_7, fieldset_1 );
	div_7.className = "form-check";
	var label_7 = createElement( 'label' );
	appendNode( label_7, div_7 );
	label_7.className = "form-check-label";
	var input_4 = createElement( 'input' );
	appendNode( input_4, label_7 );
	input_4.type = "radio";
	input_4.className = "form-check-input";
	input_4.name = "optionsRadios";
	input_4.id = "optionsRadios2";
	input_4.__value = "option2";
	input_4.value = input_4.__value;
	appendNode( createText( "\n                      Option two can be something else and selecting it will deselect option one" ), label_7 );
	appendNode( createText( "\n              " ), fieldset_1 );
	var div_8 = createElement( 'div' );
	appendNode( div_8, fieldset_1 );
	div_8.className = "form-check disabled";
	var label_8 = createElement( 'label' );
	appendNode( label_8, div_8 );
	label_8.className = "form-check-label";
	var input_5 = createElement( 'input' );
	appendNode( input_5, label_8 );
	input_5.type = "radio";
	input_5.className = "form-check-input";
	input_5.name = "optionsRadios";
	input_5.id = "optionsRadios3";
	input_5.__value = "option3";
	input_5.value = input_5.__value;
	input_5.disabled = '';
	appendNode( createText( "\n                      Option three is disabled" ), label_8 );
	appendNode( createText( "\n            " ), fieldset );
	var div_9 = createElement( 'div' );
	appendNode( div_9, fieldset );
	div_9.className = "form-check";
	var label_9 = createElement( 'label' );
	appendNode( label_9, div_9 );
	label_9.className = "form-check-label";
	var input_6 = createElement( 'input' );
	appendNode( input_6, label_9 );
	input_6.type = "checkbox";
	input_6.className = "form-check-input";
	appendNode( createText( "\n                    Check me out" ), label_9 );
	appendNode( createText( "\n            " ), fieldset );
	var button = createElement( 'button' );
	appendNode( button, fieldset );
	button.type = "submit";
	button.className = "btn btn-primary";
	appendNode( createText( "Submit" ), button );

	return {
		mount: function ( target, anchor ) {
			insertNode( fieldset, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( fieldset );
			}
		}
	};
}

function create_col_1_yield_fragment_3 ( state, component ) {
	var form_1_yield_fragment = create_form_yield_fragment_2( state, component );

	var form_1 = new Form({
		target: null,
		_root: component._root,
		_yield: form_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			form_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			form_1.destroy( detach );
		}
	};
}

function create_form_yield_fragment_2 ( state, component ) {
	var formgroup_9_yield_fragment = create_formgroup_yield_fragment( state, component );

	var formgroup_9 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_9_yield_fragment
	});

	var text = createText( "\n\n          " );
	var formgroup_10_yield_fragment = create_formgroup_1_yield_fragment( state, component );

	var formgroup_10 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_10_yield_fragment
	});

	var text_1 = createText( "\n\n          " );
	var formgroup_11_yield_fragment = create_formgroup_2_yield_fragment( state, component );

	var formgroup_11 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_11_yield_fragment,
		data: { color: "success" }
	});

	var text_2 = createText( "\n\n          " );
	var formgroup_12_yield_fragment = create_formgroup_3_yield_fragment( state, component );

	var formgroup_12 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_12_yield_fragment,
		data: { color: "warning" }
	});

	var text_3 = createText( "\n\n          " );
	var formgroup_13_yield_fragment = create_formgroup_4_yield_fragment( state, component );

	var formgroup_13 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_13_yield_fragment,
		data: { color: "danger" }
	});

	var text_4 = createText( "\n\n          " );
	var formgroup_14_yield_fragment = create_formgroup_5_yield_fragment( state, component );

	var formgroup_14 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_14_yield_fragment
	});

	var text_5 = createText( "\n\n          " );
	var formgroup_15_yield_fragment = create_formgroup_6_yield_fragment( state, component );

	var formgroup_15 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_15_yield_fragment
	});

	var text_6 = createText( "\n\n          " );
	var formgroup_16_yield_fragment = create_formgroup_7_yield_fragment( state, component );

	var formgroup_16 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_16_yield_fragment
	});

	var text_7 = createText( "\n\n          " );
	var formgroup_17_yield_fragment = create_formgroup_8_yield_fragment( state, component );

	var formgroup_17 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_17_yield_fragment
	});

	return {
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

		destroy: function ( detach ) {
			formgroup_9.destroy( detach );
			formgroup_10.destroy( detach );
			formgroup_11.destroy( detach );
			formgroup_12.destroy( detach );
			formgroup_13.destroy( detach );
			formgroup_14.destroy( detach );
			formgroup_15.destroy( detach );
			formgroup_16.destroy( detach );
			formgroup_17.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
				detachNode( text_3 );
				detachNode( text_4 );
				detachNode( text_5 );
				detachNode( text_6 );
				detachNode( text_7 );
			}
		}
	};
}

function create_formgroup_yield_fragment ( state, component ) {
	var fieldset = createElement( 'fieldset' );
	fieldset.disabled = '';
	var label = createElement( 'label' );
	appendNode( label, fieldset );
	label.className = "control-label";
	label.htmlFor = "disabledInput";
	appendNode( createText( "Disabled input" ), label );
	appendNode( createText( "\n              " ), fieldset );
	var input = createElement( 'input' );
	appendNode( input, fieldset );
	input.className = "form-control";
	input.id = "disabledInput";
	input.type = "text";
	input.placeholder = "Disabled input here...";
	input.disabled = '';

	return {
		mount: function ( target, anchor ) {
			insertNode( fieldset, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( fieldset );
			}
		}
	};
}

function create_formgroup_1_yield_fragment ( state, component ) {
	var fieldset = createElement( 'fieldset' );
	var label = createElement( 'label' );
	appendNode( label, fieldset );
	label.className = "control-label";
	label.htmlFor = "readOnlyInput";
	appendNode( createText( "Readonly input" ), label );
	appendNode( createText( "\n              " ), fieldset );
	var input = createElement( 'input' );
	appendNode( input, fieldset );
	input.className = "form-control";
	input.id = "readOnlyInput";
	input.type = "text";
	input.placeholder = "Readonly input here…";
	input.readOnly = '';

	return {
		mount: function ( target, anchor ) {
			insertNode( fieldset, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( fieldset );
			}
		}
	};
}

function create_formgroup_2_yield_fragment ( state, component ) {
	var label = createElement( 'label' );
	label.className = "form-control-label";
	label.htmlFor = "inputSuccess1";
	appendNode( createText( "Input with success" ), label );
	var text_1 = createText( "\n            " );
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control form-control-success";
	input.id = "inputSuccess1";
	var text_2 = createText( "\n            " );
	var div = createElement( 'div' );
	div.className = "form-control-feedback";
	appendNode( createText( "Success! You've done it." ), div );

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text_1 );
				detachNode( input );
				detachNode( text_2 );
				detachNode( div );
			}
		}
	};
}

function create_formgroup_3_yield_fragment ( state, component ) {
	var label = createElement( 'label' );
	label.className = "form-control-label";
	label.htmlFor = "inputWarning1";
	appendNode( createText( "Input with warning" ), label );
	var text_1 = createText( "\n            " );
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control form-control-warning";
	input.id = "inputWarning1";
	var text_2 = createText( "\n            " );
	var div = createElement( 'div' );
	div.className = "form-control-feedback";
	appendNode( createText( "Shucks, try again." ), div );

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text_1 );
				detachNode( input );
				detachNode( text_2 );
				detachNode( div );
			}
		}
	};
}

function create_formgroup_4_yield_fragment ( state, component ) {
	var label = createElement( 'label' );
	label.className = "form-control-label";
	label.htmlFor = "inputDanger1";
	appendNode( createText( "Input with danger" ), label );
	var text_1 = createText( "\n            " );
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control form-control-danger";
	input.id = "inputDanger1";
	var text_2 = createText( "\n            " );
	var div = createElement( 'div' );
	div.className = "form-control-feedback";
	appendNode( createText( "Sorry, that username's taken. Try another?" ), div );

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text_1 );
				detachNode( input );
				detachNode( text_2 );
				detachNode( div );
			}
		}
	};
}

function create_formgroup_5_yield_fragment ( state, component ) {
	var label = createElement( 'label' );
	label.className = "col-form-label col-form-label-lg";
	label.htmlFor = "inputLarge";
	appendNode( createText( "Large input" ), label );
	var text_1 = createText( "\n            " );
	var input = createElement( 'input' );
	input.className = "form-control form-control-lg";
	input.type = "text";
	input.id = "inputLarge";

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text_1 );
				detachNode( input );
			}
		}
	};
}

function create_formgroup_6_yield_fragment ( state, component ) {
	var label = createElement( 'label' );
	label.className = "col-form-label";
	label.htmlFor = "inputDefault";
	appendNode( createText( "Default input" ), label );
	var text_1 = createText( "\n            " );
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control";
	input.id = "inputDefault";

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text_1 );
				detachNode( input );
			}
		}
	};
}

function create_formgroup_7_yield_fragment ( state, component ) {
	var label = createElement( 'label' );
	label.className = "col-form-label col-form-label-sm";
	label.htmlFor = "inputSmall";
	appendNode( createText( "Small input" ), label );
	var text_1 = createText( "\n            " );
	var input = createElement( 'input' );
	input.className = "form-control form-control-sm";
	input.type = "text";
	input.id = "inputSmall";

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( input, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text_1 );
				detachNode( input );
			}
		}
	};
}

function create_formgroup_8_yield_fragment ( state, component ) {
	var label = createElement( 'label' );
	label.className = "control-label";
	appendNode( createText( "Input addons" ), label );
	var text_1 = createText( "\n            " );
	var formgroup_1_yield_fragment = create_formgroup_yield_fragment_1( state, component );

	var formgroup_1 = new FormGroup({
		target: null,
		_root: component._root,
		_yield: formgroup_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text_1, target, anchor );
			formgroup_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			formgroup_1.destroy( detach );

			if ( detach ) {
				detachNode( label );
				detachNode( text_1 );
			}
		}
	};
}

function create_formgroup_yield_fragment_1 ( state, component ) {
	var label = createElement( 'label' );
	label.className = "sr-only";
	label.htmlFor = "exampleInputAmount";
	appendNode( createText( "Amount (in dollars)" ), label );
	var text_1 = createText( "\n              " );
	var inputgroup_1_yield_fragment = create_inputgroup_yield_fragment( state, component );

	var inputgroup_1 = new InputGroup({
		target: null,
		_root: component._root,
		_yield: inputgroup_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text_1, target, anchor );
			inputgroup_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			inputgroup_1.destroy( detach );

			if ( detach ) {
				detachNode( label );
				detachNode( text_1 );
			}
		}
	};
}

function create_inputgroup_yield_fragment ( state, component ) {
	var inputgroupaddon_2_yield_fragment = create_inputgroupaddon_yield_fragment( state, component );

	var inputgroupaddon_2 = new InputGroupAddon({
		target: null,
		_root: component._root,
		_yield: inputgroupaddon_2_yield_fragment
	});

	var text = createText( "\n                " );
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control";
	input.id = "exampleInputAmount";
	input.placeholder = "Amount";
	var text_1 = createText( "\n                " );
	var inputgroupaddon_3_yield_fragment = create_inputgroupaddon_1_yield_fragment( state, component );

	var inputgroupaddon_3 = new InputGroupAddon({
		target: null,
		_root: component._root,
		_yield: inputgroupaddon_3_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			inputgroupaddon_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text_1, target, anchor );
			inputgroupaddon_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			inputgroupaddon_2.destroy( detach );
			inputgroupaddon_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( input );
				detachNode( text_1 );
			}
		}
	};
}

function create_inputgroupaddon_yield_fragment ( state, component ) {
	var text = createText( "$" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_inputgroupaddon_1_yield_fragment ( state, component ) {
	var text = createText( ".00" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_row_7_yield_fragment ( state, component ) {
	var col_2_yield_fragment = create_col_yield_fragment_6( state, component );

	var col_2 = new Col({
		target: null,
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 6 }
	});

	var text = createText( "\n\n      " );
	var col_3_yield_fragment = create_col_1_yield_fragment_4( state, component );

	var col_3 = new Col({
		target: null,
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 6 }
	});

	return {
		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_2.destroy( detach );
			col_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_yield_fragment_6 ( state, component ) {
	var h2 = createElement( 'h2' );
	h2.id = "nav-tabs";
	h2.className = "text-muted my-4";
	appendNode( createText( "Tabs" ), h2 );
	var text_1 = createText( "\n        " );
	var div = createElement( 'div' );
	div.className = "bs-component";
	var nav_1_yield_fragment = create_nav_yield_fragment( state, component );

	var nav_1 = new Nav({
		target: div,
		_root: component._root,
		_yield: nav_1_yield_fragment,
		data: { tabs: true }
	});

	appendNode( createText( "\n          " ), div );
	var div_1 = createElement( 'div' );
	appendNode( div_1, div );
	div_1.id = "myTabContent";
	div_1.className = "tab-content";
	var div_2 = createElement( 'div' );
	appendNode( div_2, div_1 );
	div_2.className = "tab-pane fade active in";
	div_2.id = "home";
	var p = createElement( 'p' );
	appendNode( p, div_2 );
	appendNode( createText( "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui." ), p );
	appendNode( createText( "\n            " ), div_1 );
	var div_3 = createElement( 'div' );
	appendNode( div_3, div_1 );
	div_3.className = "tab-pane fade";
	div_3.id = "profile";
	var p_1 = createElement( 'p' );
	appendNode( p_1, div_3 );
	appendNode( createText( "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit." ), p_1 );
	appendNode( createText( "\n            " ), div_1 );
	var div_4 = createElement( 'div' );
	appendNode( div_4, div_1 );
	div_4.className = "tab-pane fade";
	div_4.id = "dropdown1";
	var p_2 = createElement( 'p' );
	appendNode( p_2, div_4 );
	appendNode( createText( "Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork." ), p_2 );
	appendNode( createText( "\n            " ), div_1 );
	var div_5 = createElement( 'div' );
	appendNode( div_5, div_1 );
	div_5.className = "tab-pane fade";
	div_5.id = "dropdown2";
	var p_3 = createElement( 'p' );
	appendNode( p_3, div_5 );
	appendNode( createText( "Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin. Cred vinyl keffiyeh DIY salvia PBR, banh mi before they sold out farm-to-table VHS viral locavore cosby sweater." ), p_3 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			nav_1.destroy( false );

			if ( detach ) {
				detachNode( h2 );
				detachNode( text_1 );
				detachNode( div );
			}
		}
	};
}

function create_nav_yield_fragment ( state, component ) {
	var navitem_3_yield_fragment = create_navitem_yield_fragment_2( state, component );

	var navitem_3 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_3_yield_fragment
	});

	var text = createText( "\n            " );
	var navitem_4_yield_fragment = create_navitem_1_yield_fragment_1( state, component );

	var navitem_4 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var text_1 = createText( "\n            " );
	var navitem_5_yield_fragment = create_navitem_2_yield_fragment_1( state, component );

	var navitem_5 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	var text_2 = createText( "\n            " );
	var li = createElement( 'li' );
	li.className = "nav-item dropdown";
	var a = createElement( 'a' );
	appendNode( a, li );
	a.className = "nav-link dropdown-toggle";
	setAttribute( a, 'data-toggle', "dropdown" );
	a.href = "#";
	setAttribute( a, 'role', "button" );
	setAttribute( a, 'aria-haspopup', "true" );
	setAttribute( a, 'aria-expanded', "false" );
	appendNode( createText( "Dropdown" ), a );
	appendNode( createText( "\n              " ), li );
	var div = createElement( 'div' );
	appendNode( div, li );
	div.className = "dropdown-menu";
	var a_1 = createElement( 'a' );
	appendNode( a_1, div );
	a_1.className = "dropdown-item";
	a_1.href = "#";
	appendNode( createText( "Action" ), a_1 );
	appendNode( createText( "\n                " ), div );
	var a_2 = createElement( 'a' );
	appendNode( a_2, div );
	a_2.className = "dropdown-item";
	a_2.href = "#";
	appendNode( createText( "Another action" ), a_2 );
	appendNode( createText( "\n                " ), div );
	var a_3 = createElement( 'a' );
	appendNode( a_3, div );
	a_3.className = "dropdown-item";
	a_3.href = "#";
	appendNode( createText( "Something else here" ), a_3 );
	appendNode( createText( "\n                " ), div );
	var div_1 = createElement( 'div' );
	appendNode( div_1, div );
	div_1.className = "dropdown-divider";
	appendNode( createText( "\n                " ), div );
	var a_4 = createElement( 'a' );
	appendNode( a_4, div );
	a_4.className = "dropdown-item";
	a_4.href = "#";
	appendNode( createText( "Separated link" ), a_4 );

	return {
		mount: function ( target, anchor ) {
			navitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navitem_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_5._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( li, target, anchor );
		},

		destroy: function ( detach ) {
			navitem_3.destroy( detach );
			navitem_4.destroy( detach );
			navitem_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
				detachNode( li );
			}
		}
	};
}

function create_navitem_yield_fragment_2 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_9( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true, href: "#home" }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_9 ( state, component ) {
	var text = createText( "Home" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_1_yield_fragment_1 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_10( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { href: "#profile" }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_10 ( state, component ) {
	var text = createText( "Profile" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_2_yield_fragment_1 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_11( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_11 ( state, component ) {
	var text = createText( "Disabled" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_1_yield_fragment_4 ( state, component ) {
	var h2 = createElement( 'h2' );
	h2.id = "nav-pills";
	h2.className = "text-muted my-4";
	appendNode( createText( "Pills" ), h2 );
	var text_1 = createText( "\n        " );
	var nav_2_yield_fragment = create_nav_yield_fragment_1( state, component );

	var nav_2 = new Nav({
		target: null,
		_root: component._root,
		_yield: nav_2_yield_fragment,
		data: { pills: true }
	});

	var text_2 = createText( "\n\n        " );
	var br = createElement( 'br' );
	var text_3 = createText( "\n        " );
	var div = createElement( 'div' );
	div.className = "bs-component";
	var nav_3_yield_fragment = create_nav_1_yield_fragment( state, component );

	var nav_3 = new Nav({
		target: div,
		_root: component._root,
		_yield: nav_3_yield_fragment,
		data: { pills: true, stacked: true }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text_1, target, anchor );
			nav_2._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( br, target, anchor );
			insertNode( text_3, target, anchor );
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			nav_2.destroy( detach );
			nav_3.destroy( false );

			if ( detach ) {
				detachNode( h2 );
				detachNode( text_1 );
				detachNode( text_2 );
				detachNode( br );
				detachNode( text_3 );
				detachNode( div );
			}
		}
	};
}

function create_nav_yield_fragment_1 ( state, component ) {
	var navitem_3_yield_fragment = create_navitem_yield_fragment_3( state, component );

	var navitem_3 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_3_yield_fragment
	});

	var text = createText( "\n          " );
	var navdropdown_1_yield_fragment = create_navdropdown_yield_fragment( state, component );

	var navdropdown_1 = new NavDropdown({
		target: null,
		_root: component._root,
		_yield: navdropdown_1_yield_fragment
	});

	var text_1 = createText( "\n          " );
	var navitem_4_yield_fragment = create_navitem_1_yield_fragment_2( state, component );

	var navitem_4 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var text_2 = createText( "\n          " );
	var navitem_5_yield_fragment = create_navitem_2_yield_fragment_2( state, component );

	var navitem_5 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navdropdown_1._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_4._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			navitem_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navitem_3.destroy( detach );
			navdropdown_1.destroy( detach );
			navitem_4.destroy( detach );
			navitem_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
			}
		}
	};
}

function create_navitem_yield_fragment_3 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_12( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_12 ( state, component ) {
	var text = createText( "Active" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navdropdown_yield_fragment ( state, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link dropdown-toggle";
	setAttribute( a, 'data-toggle', "dropdown" );
	a.href = "#";
	setAttribute( a, 'role', "button" );
	setAttribute( a, 'aria-haspopup', "true" );
	setAttribute( a, 'aria-expanded', "false" );
	appendNode( createText( "Dropdown" ), a );
	var text_1 = createText( "\n            " );
	var div = createElement( 'div' );
	div.className = "dropdown-menu";
	var a_1 = createElement( 'a' );
	appendNode( a_1, div );
	a_1.className = "dropdown-item";
	a_1.href = "#";
	appendNode( createText( "Action" ), a_1 );
	appendNode( createText( "\n              " ), div );
	var a_2 = createElement( 'a' );
	appendNode( a_2, div );
	a_2.className = "dropdown-item";
	a_2.href = "#";
	appendNode( createText( "Another action" ), a_2 );
	appendNode( createText( "\n              " ), div );
	var a_3 = createElement( 'a' );
	appendNode( a_3, div );
	a_3.className = "dropdown-item";
	a_3.href = "#";
	appendNode( createText( "Something else here" ), a_3 );
	appendNode( createText( "\n              " ), div );
	var div_1 = createElement( 'div' );
	appendNode( div_1, div );
	div_1.className = "dropdown-divider";
	appendNode( createText( "\n              " ), div );
	var a_4 = createElement( 'a' );
	appendNode( a_4, div );
	a_4.className = "dropdown-item";
	a_4.href = "#";
	appendNode( createText( "Separated link" ), a_4 );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
				detachNode( text_1 );
				detachNode( div );
			}
		}
	};
}

function create_navitem_1_yield_fragment_2 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_13( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_13 ( state, component ) {
	var text = createText( "Link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_2_yield_fragment_2 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_14( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_14 ( state, component ) {
	var text = createText( "Disabled" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_nav_1_yield_fragment ( state, component ) {
	var navitem_3_yield_fragment = create_navitem_yield_fragment_4( state, component );

	var navitem_3 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_3_yield_fragment
	});

	var text = createText( "\n            " );
	var navdropdown_1_yield_fragment = create_navdropdown_yield_fragment_1( state, component );

	var navdropdown_1 = new NavDropdown({
		target: null,
		_root: component._root,
		_yield: navdropdown_1_yield_fragment
	});

	var text_1 = createText( "\n            " );
	var navitem_4_yield_fragment = create_navitem_1_yield_fragment_3( state, component );

	var navitem_4 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var text_2 = createText( "\n            " );
	var navitem_5_yield_fragment = create_navitem_2_yield_fragment_3( state, component );

	var navitem_5 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navdropdown_1._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_4._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			navitem_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navitem_3.destroy( detach );
			navdropdown_1.destroy( detach );
			navitem_4.destroy( detach );
			navitem_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
			}
		}
	};
}

function create_navitem_yield_fragment_4 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_15( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_15 ( state, component ) {
	var text = createText( "Active" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navdropdown_yield_fragment_1 ( state, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link dropdown-toggle";
	setAttribute( a, 'data-toggle', "dropdown" );
	a.href = "#";
	setAttribute( a, 'role', "button" );
	setAttribute( a, 'aria-haspopup', "true" );
	setAttribute( a, 'aria-expanded', "false" );
	appendNode( createText( "Dropdown" ), a );
	var text_1 = createText( "\n              " );
	var div = createElement( 'div' );
	div.className = "dropdown-menu";
	var a_1 = createElement( 'a' );
	appendNode( a_1, div );
	a_1.className = "dropdown-item";
	a_1.href = "#";
	appendNode( createText( "Action" ), a_1 );
	appendNode( createText( "\n                " ), div );
	var a_2 = createElement( 'a' );
	appendNode( a_2, div );
	a_2.className = "dropdown-item";
	a_2.href = "#";
	appendNode( createText( "Another action" ), a_2 );
	appendNode( createText( "\n                " ), div );
	var a_3 = createElement( 'a' );
	appendNode( a_3, div );
	a_3.className = "dropdown-item";
	a_3.href = "#";
	appendNode( createText( "Something else here" ), a_3 );
	appendNode( createText( "\n                " ), div );
	var div_1 = createElement( 'div' );
	appendNode( div_1, div );
	div_1.className = "dropdown-divider";
	appendNode( createText( "\n                " ), div );
	var a_4 = createElement( 'a' );
	appendNode( a_4, div );
	a_4.className = "dropdown-item";
	a_4.href = "#";
	appendNode( createText( "Separated link" ), a_4 );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
				detachNode( text_1 );
				detachNode( div );
			}
		}
	};
}

function create_navitem_1_yield_fragment_3 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_16( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_16 ( state, component ) {
	var text = createText( "Link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_2_yield_fragment_3 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_17( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_17 ( state, component ) {
	var text = createText( "Disabled" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_nav_yield_fragment_2 ( state, component ) {
	var navitem_4_yield_fragment = create_navitem_yield_fragment_5( state, component );

	var navitem_4 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var text = createText( "\n      " );
	var navitem_5_yield_fragment = create_navitem_1_yield_fragment_4( state, component );

	var navitem_5 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	var text_1 = createText( "\n      " );
	var navitem_6_yield_fragment = create_navitem_2_yield_fragment_4( state, component );

	var navitem_6 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_6_yield_fragment
	});

	var text_2 = createText( "\n      " );
	var navitem_7_yield_fragment = create_navitem_3_yield_fragment_1( state, component );

	var navitem_7 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_7_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navitem_4._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navitem_5._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_6._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			navitem_7._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navitem_4.destroy( detach );
			navitem_5.destroy( detach );
			navitem_6.destroy( detach );
			navitem_7.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
			}
		}
	};
}

function create_navitem_yield_fragment_5 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_18( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true, href: "#home" }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_18 ( state, component ) {
	var text = createText( "My" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_1_yield_fragment_4 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_19( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { href: "#profile" }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_19 ( state, component ) {
	var text = createText( "Name" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_2_yield_fragment_4 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_20( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_20 ( state, component ) {
	var text = createText( "Is" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_3_yield_fragment_1 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_21( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_21 ( state, component ) {
	var text = createText( "Rufus Xavier Sarsaparilla" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_nav_1_yield_fragment_1 ( state, component ) {
	var navitem_4_yield_fragment = create_navitem_yield_fragment_6( state, component );

	var navitem_4 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_4_yield_fragment
	});

	var text = createText( "\n      " );
	var navitem_5_yield_fragment = create_navitem_1_yield_fragment_5( state, component );

	var navitem_5 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_5_yield_fragment
	});

	var text_1 = createText( "\n      " );
	var navitem_6_yield_fragment = create_navitem_2_yield_fragment_5( state, component );

	var navitem_6 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_6_yield_fragment
	});

	var text_2 = createText( "\n      " );
	var navitem_7_yield_fragment = create_navitem_3_yield_fragment_2( state, component );

	var navitem_7 = new NavItem({
		target: null,
		_root: component._root,
		_yield: navitem_7_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navitem_4._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navitem_5._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			navitem_6._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			navitem_7._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navitem_4.destroy( detach );
			navitem_5.destroy( detach );
			navitem_6.destroy( detach );
			navitem_7.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
			}
		}
	};
}

function create_navitem_yield_fragment_6 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_22( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { active: true, href: "#home" }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_22 ( state, component ) {
	var text = createText( "My" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_1_yield_fragment_5 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_23( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { href: "#profile" }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_23 ( state, component ) {
	var text = createText( "Name" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_2_yield_fragment_5 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_24( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_24 ( state, component ) {
	var text = createText( "Is" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_navitem_3_yield_fragment_2 ( state, component ) {
	var navlink_1_yield_fragment = create_navlink_yield_fragment_25( state, component );

	var navlink_1 = new NavLink({
		target: null,
		_root: component._root,
		_yield: navlink_1_yield_fragment,
		data: { disabled: true }
	});

	return {
		mount: function ( target, anchor ) {
			navlink_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			navlink_1.destroy( detach );
		}
	};
}

function create_navlink_yield_fragment_25 ( state, component ) {
	var text = createText( "Rufus Xavier Sarsaparilla" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_row_8_yield_fragment ( state, component ) {
	var col_2_yield_fragment = create_col_yield_fragment_7( state, component );

	var col_2 = new Col({
		target: null,
		_root: component._root,
		_yield: col_2_yield_fragment
	});

	var text = createText( "\n\n      " );
	var col_3_yield_fragment = create_col_1_yield_fragment_5( state, component );

	var col_3 = new Col({
		target: null,
		_root: component._root,
		_yield: col_3_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_2.destroy( detach );
			col_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_yield_fragment_7 ( state, component ) {
	var h2 = createElement( 'h2' );
	h2.id = "nav-breadcrumbs";
	h2.className = "text-muted my-4";
	appendNode( createText( "Breadcrumbs" ), h2 );
	var text_1 = createText( "\n\n        " );
	var breadcrumb_3_yield_fragment = create_breadcrumb_yield_fragment( state, component );

	var breadcrumb_3 = new Breadcrumb({
		target: null,
		_root: component._root,
		_yield: breadcrumb_3_yield_fragment
	});

	var text_2 = createText( "\n\n        " );
	var breadcrumb_4_yield_fragment = create_breadcrumb_1_yield_fragment( state, component );

	var breadcrumb_4 = new Breadcrumb({
		target: null,
		_root: component._root,
		_yield: breadcrumb_4_yield_fragment
	});

	var text_3 = createText( "\n\n        " );
	var breadcrumb_5_yield_fragment = create_breadcrumb_2_yield_fragment( state, component );

	var breadcrumb_5 = new Breadcrumb({
		target: null,
		_root: component._root,
		_yield: breadcrumb_5_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text_1, target, anchor );
			breadcrumb_3._fragment.mount( target, anchor );
			insertNode( text_2, target, anchor );
			breadcrumb_4._fragment.mount( target, anchor );
			insertNode( text_3, target, anchor );
			breadcrumb_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			breadcrumb_3.destroy( detach );
			breadcrumb_4.destroy( detach );
			breadcrumb_5.destroy( detach );

			if ( detach ) {
				detachNode( h2 );
				detachNode( text_1 );
				detachNode( text_2 );
				detachNode( text_3 );
			}
		}
	};
}

function create_breadcrumb_yield_fragment ( state, component ) {
	var breadcrumbitem_1_yield_fragment = create_breadcrumbitem_yield_fragment( state, component );

	var breadcrumbitem_1 = new BreadcrumbItem({
		target: null,
		_root: component._root,
		_yield: breadcrumbitem_1_yield_fragment,
		data: { active: true }
	});

	return {
		mount: function ( target, anchor ) {
			breadcrumbitem_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			breadcrumbitem_1.destroy( detach );
		}
	};
}

function create_breadcrumbitem_yield_fragment ( state, component ) {
	var text = createText( "Home" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_breadcrumb_1_yield_fragment ( state, component ) {
	var breadcrumbitem_2_yield_fragment = create_breadcrumbitem_yield_fragment_1( state, component );

	var breadcrumbitem_2 = new BreadcrumbItem({
		target: null,
		_root: component._root,
		_yield: breadcrumbitem_2_yield_fragment
	});

	var text = createText( "\n          " );
	var breadcrumbitem_3_yield_fragment = create_breadcrumbitem_1_yield_fragment( state, component );

	var breadcrumbitem_3 = new BreadcrumbItem({
		target: null,
		_root: component._root,
		_yield: breadcrumbitem_3_yield_fragment,
		data: { active: true }
	});

	return {
		mount: function ( target, anchor ) {
			breadcrumbitem_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			breadcrumbitem_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			breadcrumbitem_2.destroy( detach );
			breadcrumbitem_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_breadcrumbitem_yield_fragment_1 ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	appendNode( createText( "Home" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_breadcrumbitem_1_yield_fragment ( state, component ) {
	var text = createText( "Library" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_breadcrumb_2_yield_fragment ( state, component ) {
	var breadcrumbitem_3_yield_fragment = create_breadcrumbitem_yield_fragment_2( state, component );

	var breadcrumbitem_3 = new BreadcrumbItem({
		target: null,
		_root: component._root,
		_yield: breadcrumbitem_3_yield_fragment
	});

	var text = createText( "\n          " );
	var breadcrumbitem_4_yield_fragment = create_breadcrumbitem_1_yield_fragment_1( state, component );

	var breadcrumbitem_4 = new BreadcrumbItem({
		target: null,
		_root: component._root,
		_yield: breadcrumbitem_4_yield_fragment
	});

	var text_1 = createText( "\n          " );
	var breadcrumbitem_5_yield_fragment = create_breadcrumbitem_2_yield_fragment( state, component );

	var breadcrumbitem_5 = new BreadcrumbItem({
		target: null,
		_root: component._root,
		_yield: breadcrumbitem_5_yield_fragment,
		data: { active: true }
	});

	return {
		mount: function ( target, anchor ) {
			breadcrumbitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			breadcrumbitem_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			breadcrumbitem_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			breadcrumbitem_3.destroy( detach );
			breadcrumbitem_4.destroy( detach );
			breadcrumbitem_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
			}
		}
	};
}

function create_breadcrumbitem_yield_fragment_2 ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	appendNode( createText( "Home" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_breadcrumbitem_1_yield_fragment_1 ( state, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	appendNode( createText( "Library" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_breadcrumbitem_2_yield_fragment ( state, component ) {
	var text = createText( "Data" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_1_yield_fragment_5 ( state, component ) {
	var h2 = createElement( 'h2' );
	h2.id = "pagination";
	h2.className = "text-muted my-4";
	appendNode( createText( "Pagination" ), h2 );
	var text_1 = createText( "\n        " );
	var div = createElement( 'div' );
	div.className = "bs-component";
	var each_block_value = [null, 'lg', 'sm'];
	var each_block_1_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_1_iterations[i] = create_each_block_1( state, each_block_value, each_block_value[i], i, component );
		each_block_1_iterations[i].mount( div, null );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			destroyEach( each_block_1_iterations, false, 0 );

			if ( detach ) {
				detachNode( h2 );
				detachNode( text_1 );
				detachNode( div );
			}
		}
	};
}

function create_each_block_1 ( state, each_block_value, size, size_index, component ) {
	var div = createElement( 'div' );
	var pagination_1_yield_fragment = create_pagination_yield_fragment( state, each_block_value, size, size_index, component );

	var pagination_1 = new Pagination({
		target: div,
		_root: component._root,
		_yield: pagination_1_yield_fragment,
		data: { size: size }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},

		destroy: function ( detach ) {
			pagination_1.destroy( false );

			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function create_pagination_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var paginationitem_7_yield_fragment = create_paginationitem_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_7 = new PaginationItem({
		target: null,
		_root: component._root,
		_yield: paginationitem_7_yield_fragment,
		data: { disabled: true }
	});

	var text = createText( "\n                " );
	var paginationitem_8_yield_fragment = create_paginationitem_1_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_8 = new PaginationItem({
		target: null,
		_root: component._root,
		_yield: paginationitem_8_yield_fragment,
		data: { active: true }
	});

	var text_1 = createText( "\n                " );
	var paginationitem_9_yield_fragment = create_paginationitem_2_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_9 = new PaginationItem({
		target: null,
		_root: component._root,
		_yield: paginationitem_9_yield_fragment
	});

	var text_2 = createText( "\n                " );
	var paginationitem_10_yield_fragment = create_paginationitem_3_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_10 = new PaginationItem({
		target: null,
		_root: component._root,
		_yield: paginationitem_10_yield_fragment
	});

	var text_3 = createText( "\n                " );
	var paginationitem_11_yield_fragment = create_paginationitem_4_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_11 = new PaginationItem({
		target: null,
		_root: component._root,
		_yield: paginationitem_11_yield_fragment
	});

	var text_4 = createText( "\n                " );
	var paginationitem_12_yield_fragment = create_paginationitem_5_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_12 = new PaginationItem({
		target: null,
		_root: component._root,
		_yield: paginationitem_12_yield_fragment
	});

	var text_5 = createText( "\n                " );
	var paginationitem_13_yield_fragment = create_paginationitem_6_yield_fragment( state, each_block_value, size, size_index, component );

	var paginationitem_13 = new PaginationItem({
		target: null,
		_root: component._root,
		_yield: paginationitem_13_yield_fragment
	});

	return {
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

		destroy: function ( detach ) {
			paginationitem_7.destroy( detach );
			paginationitem_8.destroy( detach );
			paginationitem_9.destroy( detach );
			paginationitem_10.destroy( detach );
			paginationitem_11.destroy( detach );
			paginationitem_12.destroy( detach );
			paginationitem_13.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( text_2 );
				detachNode( text_3 );
				detachNode( text_4 );
				detachNode( text_5 );
			}
		}
	};
}

function create_paginationitem_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	appendNode( createText( "«" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_paginationitem_1_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	appendNode( createText( "1" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_paginationitem_2_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	appendNode( createText( "2" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_paginationitem_3_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	appendNode( createText( "3" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_paginationitem_4_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	appendNode( createText( "4" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_paginationitem_5_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	appendNode( createText( "5" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_paginationitem_6_yield_fragment ( state, each_block_value, size, size_index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	appendNode( createText( "»" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function create_alert_yield_fragment ( state, component ) {
	var h4 = createElement( 'h4' );
	appendNode( createText( "Default" ), h4 );
	var text_1 = createText( "\n      " );
	var p = createElement( 'p' );
	appendNode( createText( "Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna,\n        " ), p );
	var a = createElement( 'a' );
	appendNode( a, p );
	a.href = "#";
	a.className = "alert-link";
	appendNode( createText( "vel scelerisque nisl consectetur et" ), a );
	appendNode( createText( "." ), p );

	return {
		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( p, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( h4 );
				detachNode( text_1 );
				detachNode( p );
			}
		}
	};
}

function create_row_9_yield_fragment ( state, component ) {
	var each_block_value = ['success', 'info', 'warning', 'danger'];
	var each_block_2_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_2_iterations[i] = create_each_block_2( state, each_block_value, each_block_value[i], i, component );
	}

	var each_block_2_anchor = createComment();

	return {
		mount: function ( target, anchor ) {
			for ( var i = 0; i < each_block_2_iterations.length; i += 1 ) {
				each_block_2_iterations[i].mount( target, null );
			}

			insertNode( each_block_2_anchor, target, anchor );
		},

		destroy: function ( detach ) {
			destroyEach( each_block_2_iterations, detach, 0 );

			if ( detach ) {
				detachNode( each_block_2_anchor );
			}
		}
	};
}

function create_each_block_2 ( state, each_block_value, color, color_index, component ) {
	var col_1_yield_fragment = create_col_yield_fragment_8( state, each_block_value, color, color_index, component );

	var col_1 = new Col({
		target: null,
		_root: component._root,
		_yield: col_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_1.destroy( detach );
		}
	};
}

function create_col_yield_fragment_8 ( state, each_block_value, color, color_index, component ) {
	var alert_1_yield_fragment = create_alert_yield_fragment_1( state, each_block_value, color, color_index, component );

	var alert_1 = new Alert({
		target: null,
		_root: component._root,
		_yield: alert_1_yield_fragment,
		data: {
			dismissible: true,
			color: color
		}
	});

	return {
		mount: function ( target, anchor ) {
			alert_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			alert_1.destroy( detach );
		}
	};
}

function create_alert_yield_fragment_1 ( state, each_block_value, color, color_index, component ) {
	var text_value;

	var h4 = createElement( 'h4' );
	var text = createText( text_value = color );
	appendNode( text, h4 );
	var text_1 = createText( "\n            " );
	var a = createElement( 'a' );
	a.href = "#";
	a.className = "alert-link";
	appendNode( createText( "Change a few things up" ), a );
	var text_3 = createText( " and try submitting again." );

	return {
		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( a, target, anchor );
			insertNode( text_3, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( h4 );
				detachNode( text_1 );
				detachNode( a );
				detachNode( text_3 );
			}
		}
	};
}

function create_badge_yield_fragment ( state, component ) {
	var text = createText( "Default" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_1_yield_fragment ( state, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_2_yield_fragment ( state, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_3_yield_fragment ( state, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_4_yield_fragment ( state, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_5_yield_fragment ( state, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_6_yield_fragment ( state, component ) {
	var text = createText( "Default" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_7_yield_fragment ( state, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_8_yield_fragment ( state, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_9_yield_fragment ( state, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_10_yield_fragment ( state, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_11_yield_fragment ( state, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_row_10_yield_fragment ( state, component ) {
	var col_1_yield_fragment = create_col_yield_fragment_9( state, component );

	var col_1 = new Col({
		target: null,
		_root: component._root,
		_yield: col_1_yield_fragment,
		data: { lg: 12 }
	});

	return {
		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_1.destroy( detach );
		}
	};
}

function create_col_yield_fragment_9 ( state, component ) {
	var h1 = createElement( 'h1' );
	h1.id = "progress";
	h1.className = "text-muted my-4";
	appendNode( createText( "Progress" ), h1 );
	var text_1 = createText( "\n\n        " );
	var h3 = createElement( 'h3' );
	h3.id = "progress-basic";
	h3.className = "text-muted my-4";
	appendNode( createText( "Basic" ), h3 );
	var text_3 = createText( "\n        " );
	var div = createElement( 'div' );

	var progress_1 = new Progress({
		target: div,
		_root: component._root,
		data: { value: 25, min: 0, max: 100 }
	});

	var text_4 = createText( "\n\n        " );
	var h3_1 = createElement( 'h3' );
	h3_1.id = "progress-alternatives";
	h3_1.className = "text-muted my-4";
	appendNode( createText( "Contextual alternatives" ), h3_1 );
	var text_6 = createText( "\n        " );
	var div_1 = createElement( 'div' );

	var progress_2 = new Progress({
		target: div_1,
		_root: component._root,
		data: {
			color: "success",
			value: 25,
			min: 0,
			max: 100
		}
	});

	appendNode( createText( "\n          " ), div_1 );

	var progress_3 = new Progress({
		target: div_1,
		_root: component._root,
		data: {
			color: "info",
			value: 50,
			min: 0,
			max: 100
		}
	});

	appendNode( createText( "\n          " ), div_1 );

	var progress_4 = new Progress({
		target: div_1,
		_root: component._root,
		data: {
			color: "warning",
			value: 75,
			min: 0,
			max: 100
		}
	});

	appendNode( createText( "\n          " ), div_1 );

	var progress_5 = new Progress({
		target: div_1,
		_root: component._root,
		data: {
			color: "danger",
			value: 100,
			min: 0,
			max: 100
		}
	});

	var text_10 = createText( "\n\n        " );
	var h3_2 = createElement( 'h3' );
	h3_2.id = "progress-multiple";
	h3_2.className = "text-muted my-4";
	appendNode( createText( "Multiple bars" ), h3_2 );
	var text_12 = createText( "\n        " );
	var div_2 = createElement( 'div' );
	var progress_6_yield_fragment = create_progress_yield_fragment( state, component );

	var progress_6 = new Progress({
		target: div_2,
		_root: component._root,
		_yield: progress_6_yield_fragment,
		data: { multi: true }
	});

	var text_13 = createText( "\n\n        " );
	var h3_3 = createElement( 'h3' );
	h3_3.id = "progress-striped";
	h3_3.className = "text-muted my-4";
	appendNode( createText( "Striped" ), h3_3 );
	var text_15 = createText( "\n        " );
	var div_3 = createElement( 'div' );

	var progress_7 = new Progress({
		target: div_3,
		_root: component._root,
		data: {
			striped: true,
			value: 15,
			min: 0,
			max: 100
		}
	});

	appendNode( createText( "\n          " ), div_3 );

	var progress_8 = new Progress({
		target: div_3,
		_root: component._root,
		data: {
			striped: true,
			color: "success",
			value: 25,
			min: 0,
			max: 100
		}
	});

	appendNode( createText( "\n          " ), div_3 );

	var progress_9 = new Progress({
		target: div_3,
		_root: component._root,
		data: {
			striped: true,
			color: "info",
			value: 50,
			min: 0,
			max: 100
		}
	});

	appendNode( createText( "\n          " ), div_3 );

	var progress_10 = new Progress({
		target: div_3,
		_root: component._root,
		data: {
			striped: true,
			color: "warning",
			value: 75,
			min: 0,
			max: 100
		}
	});

	appendNode( createText( "\n          " ), div_3 );

	var progress_11 = new Progress({
		target: div_3,
		_root: component._root,
		data: {
			striped: true,
			color: "danger",
			value: 100,
			min: 0,
			max: 100
		}
	});

	var text_20 = createText( "\n\n        " );
	var h3_4 = createElement( 'h3' );
	h3_4.id = "progress-animated";
	h3_4.className = "text-muted my-4";
	appendNode( createText( "Animated" ), h3_4 );
	var text_22 = createText( "\n        " );
	var div_4 = createElement( 'div' );

	var progress_12 = new Progress({
		target: div_4,
		_root: component._root,
		data: {
			animated: true,
			striped: true,
			value: 15,
			min: 0,
			max: 100
		}
	});

	appendNode( createText( "\n          " ), div_4 );

	var progress_13 = new Progress({
		target: div_4,
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

	appendNode( createText( "\n          " ), div_4 );

	var progress_14 = new Progress({
		target: div_4,
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

	appendNode( createText( "\n          " ), div_4 );

	var progress_15 = new Progress({
		target: div_4,
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

	appendNode( createText( "\n          " ), div_4 );

	var progress_16 = new Progress({
		target: div_4,
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
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( h3, target, anchor );
			insertNode( text_3, target, anchor );
			insertNode( div, target, anchor );
			insertNode( text_4, target, anchor );
			insertNode( h3_1, target, anchor );
			insertNode( text_6, target, anchor );
			insertNode( div_1, target, anchor );
			insertNode( text_10, target, anchor );
			insertNode( h3_2, target, anchor );
			insertNode( text_12, target, anchor );
			insertNode( div_2, target, anchor );
			insertNode( text_13, target, anchor );
			insertNode( h3_3, target, anchor );
			insertNode( text_15, target, anchor );
			insertNode( div_3, target, anchor );
			insertNode( text_20, target, anchor );
			insertNode( h3_4, target, anchor );
			insertNode( text_22, target, anchor );
			insertNode( div_4, target, anchor );
		},

		destroy: function ( detach ) {
			progress_1.destroy( false );
			progress_2.destroy( false );
			progress_3.destroy( false );
			progress_4.destroy( false );
			progress_5.destroy( false );
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

			if ( detach ) {
				detachNode( h1 );
				detachNode( text_1 );
				detachNode( h3 );
				detachNode( text_3 );
				detachNode( div );
				detachNode( text_4 );
				detachNode( h3_1 );
				detachNode( text_6 );
				detachNode( div_1 );
				detachNode( text_10 );
				detachNode( h3_2 );
				detachNode( text_12 );
				detachNode( div_2 );
				detachNode( text_13 );
				detachNode( h3_3 );
				detachNode( text_15 );
				detachNode( div_3 );
				detachNode( text_20 );
				detachNode( h3_4 );
				detachNode( text_22 );
				detachNode( div_4 );
			}
		}
	};
}

function create_progress_yield_fragment ( state, component ) {
	var progress = new Progress({
		target: null,
		_root: component._root,
		data: { bar: true, value: 25 }
	});

	var text = createText( "\n            " );

	var progress_1 = new Progress({
		target: null,
		_root: component._root,
		data: { bar: true, color: "success", value: 30 }
	});

	var text_1 = createText( "\n            " );

	var progress_2 = new Progress({
		target: null,
		_root: component._root,
		data: { bar: true, color: "info", value: 20 }
	});

	return {
		mount: function ( target, anchor ) {
			progress._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			progress_1._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			progress_2._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			progress.destroy( detach );
			progress_1.destroy( detach );
			progress_2.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
			}
		}
	};
}

function create_row_11_yield_fragment ( state, component ) {
	var col_1_yield_fragment = create_col_yield_fragment_10( state, component );

	var col_1 = new Col({
		target: null,
		_root: component._root,
		_yield: col_1_yield_fragment,
		data: { lg: 12 }
	});

	return {
		mount: function ( target, anchor ) {
			col_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_1.destroy( detach );
		}
	};
}

function create_col_yield_fragment_10 ( state, component ) {
	var h1 = createElement( 'h1' );
	h1.id = "containers";
	appendNode( createText( "Containers" ), h1 );
	var text_1 = createText( "\n        " );
	var jumbotron_1_yield_fragment = create_jumbotron_yield_fragment( state, component );

	var jumbotron_1 = new Jumbotron({
		target: null,
		_root: component._root,
		_yield: jumbotron_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text_1, target, anchor );
			jumbotron_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			jumbotron_1.destroy( detach );

			if ( detach ) {
				detachNode( h1 );
				detachNode( text_1 );
			}
		}
	};
}

function create_jumbotron_yield_fragment ( state, component ) {
	var h1 = createElement( 'h1' );
	h1.className = "display-3";
	appendNode( createText( "Jumbotron" ), h1 );
	var text_1 = createText( "\n          " );
	var p = createElement( 'p' );
	appendNode( createText( "This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information." ), p );
	var text_3 = createText( "\n          " );
	var p_1 = createElement( 'p' );
	var button_1_yield_fragment = create_button_yield_fragment_11( state, component );

	var button_1 = new Button({
		target: p_1,
		_root: component._root,
		_yield: button_1_yield_fragment,
		data: { color: "primary", size: "lg", href: "#" }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( p, target, anchor );
			insertNode( text_3, target, anchor );
			insertNode( p_1, target, anchor );
		},

		destroy: function ( detach ) {
			button_1.destroy( false );

			if ( detach ) {
				detachNode( h1 );
				detachNode( text_1 );
				detachNode( p );
				detachNode( text_3 );
				detachNode( p_1 );
			}
		}
	};
}

function create_button_yield_fragment_11 ( state, component ) {
	var text = createText( "Learn more" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_row_12_yield_fragment ( state, component ) {
	var col_3_yield_fragment = create_col_yield_fragment_11( state, component );

	var col_3 = new Col({
		target: null,
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 4 }
	});

	var text = createText( "\n\n      " );
	var col_4_yield_fragment = create_col_1_yield_fragment_6( state, component );

	var col_4 = new Col({
		target: null,
		_root: component._root,
		_yield: col_4_yield_fragment,
		data: { lg: 4 }
	});

	var text_1 = createText( "\n\n      " );
	var col_5_yield_fragment = create_col_2_yield_fragment( state, component );

	var col_5 = new Col({
		target: null,
		_root: component._root,
		_yield: col_5_yield_fragment,
		data: { lg: 4 }
	});

	return {
		mount: function ( target, anchor ) {
			col_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			col_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_3.destroy( detach );
			col_4.destroy( detach );
			col_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
			}
		}
	};
}

function create_col_yield_fragment_11 ( state, component ) {
	var listgroup_1_yield_fragment = create_listgroup_yield_fragment_1( state, component );

	var listgroup_1 = new ListGroup({
		target: null,
		_root: component._root,
		_yield: listgroup_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			listgroup_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			listgroup_1.destroy( detach );
		}
	};
}

function create_listgroup_yield_fragment_1 ( state, component ) {
	var listgroupitem_3_yield_fragment = create_listgroupitem_yield_fragment_1( state, component );

	var listgroupitem_3 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_3_yield_fragment,
		data: { class: "justify-content-between" }
	});

	var text = createText( "\n          " );
	var listgroupitem_4_yield_fragment = create_listgroupitem_1_yield_fragment_1( state, component );

	var listgroupitem_4 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_4_yield_fragment,
		data: { class: "justify-content-between" }
	});

	var text_1 = createText( "\n          " );
	var listgroupitem_5_yield_fragment = create_listgroupitem_2_yield_fragment_1( state, component );

	var listgroupitem_5 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_5_yield_fragment,
		data: { class: "justify-content-between" }
	});

	return {
		mount: function ( target, anchor ) {
			listgroupitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitem_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			listgroupitem_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			listgroupitem_3.destroy( detach );
			listgroupitem_4.destroy( detach );
			listgroupitem_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
			}
		}
	};
}

function create_listgroupitem_yield_fragment_1 ( state, component ) {
	var text = createText( "Cras justo odio" );
	var badge_1_yield_fragment = create_badge_yield_fragment_1( state, component );

	var badge_1 = new Badge({
		target: null,
		_root: component._root,
		_yield: badge_1_yield_fragment,
		data: { pill: true }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			badge_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			badge_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_yield_fragment_1 ( state, component ) {
	var text = createText( "14" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitem_1_yield_fragment_1 ( state, component ) {
	var text = createText( "Dapibus ac facilisis in" );
	var badge_1_yield_fragment = create_badge_yield_fragment_2( state, component );

	var badge_1 = new Badge({
		target: null,
		_root: component._root,
		_yield: badge_1_yield_fragment,
		data: { pill: true }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			badge_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			badge_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_yield_fragment_2 ( state, component ) {
	var text = createText( "2" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitem_2_yield_fragment_1 ( state, component ) {
	var text = createText( "Morbi leo risus" );
	var badge_1_yield_fragment = create_badge_yield_fragment_3( state, component );

	var badge_1 = new Badge({
		target: null,
		_root: component._root,
		_yield: badge_1_yield_fragment,
		data: { pill: true }
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			badge_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			badge_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_badge_yield_fragment_3 ( state, component ) {
	var text = createText( "1" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_1_yield_fragment_6 ( state, component ) {
	var listgroup_1_yield_fragment = create_listgroup_yield_fragment_2( state, component );

	var listgroup_1 = new ListGroup({
		target: null,
		_root: component._root,
		_yield: listgroup_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			listgroup_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			listgroup_1.destroy( detach );
		}
	};
}

function create_listgroup_yield_fragment_2 ( state, component ) {
	var listgroupitem_3_yield_fragment = create_listgroupitem_yield_fragment_2( state, component );

	var listgroupitem_3 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_3_yield_fragment,
		data: { action: true, active: true }
	});

	var text = createText( "\n          " );
	var listgroupitem_4_yield_fragment = create_listgroupitem_1_yield_fragment_2( state, component );

	var listgroupitem_4 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_4_yield_fragment,
		data: { action: true }
	});

	var text_1 = createText( "\n          " );
	var listgroupitem_5_yield_fragment = create_listgroupitem_2_yield_fragment_2( state, component );

	var listgroupitem_5 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_5_yield_fragment,
		data: { action: true, disabled: true }
	});

	return {
		mount: function ( target, anchor ) {
			listgroupitem_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitem_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			listgroupitem_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			listgroupitem_3.destroy( detach );
			listgroupitem_4.destroy( detach );
			listgroupitem_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
			}
		}
	};
}

function create_listgroupitem_yield_fragment_2 ( state, component ) {
	var text = createText( "Cras justo odio" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitem_1_yield_fragment_2 ( state, component ) {
	var text = createText( "Dapibus ac facilisis in" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitem_2_yield_fragment_2 ( state, component ) {
	var text = createText( "Morbi leo risus" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_2_yield_fragment ( state, component ) {
	var listgroup_1_yield_fragment = create_listgroup_yield_fragment_3( state, component );

	var listgroup_1 = new ListGroup({
		target: null,
		_root: component._root,
		_yield: listgroup_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			listgroup_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			listgroup_1.destroy( detach );
		}
	};
}

function create_listgroup_yield_fragment_3 ( state, component ) {
	var listgroupitem_2_yield_fragment = create_listgroupitem_yield_fragment_3( state, component );

	var listgroupitem_2 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_2_yield_fragment,
		data: { action: true, active: true }
	});

	var text = createText( "\n          " );
	var listgroupitem_3_yield_fragment = create_listgroupitem_1_yield_fragment_3( state, component );

	var listgroupitem_3 = new ListGroupItem({
		target: null,
		_root: component._root,
		_yield: listgroupitem_3_yield_fragment,
		data: { action: true }
	});

	return {
		mount: function ( target, anchor ) {
			listgroupitem_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitem_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			listgroupitem_2.destroy( detach );
			listgroupitem_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitem_yield_fragment_3 ( state, component ) {
	var listgroupitemheading_1_yield_fragment = create_listgroupitemheading_yield_fragment( state, component );

	var listgroupitemheading_1 = new ListGroupItemHeading({
		target: null,
		_root: component._root,
		_yield: listgroupitemheading_1_yield_fragment
	});

	var text = createText( "\n            " );
	var listgroupitemtext_1_yield_fragment = create_listgroupitemtext_yield_fragment( state, component );

	var listgroupitemtext_1 = new ListGroupItemText({
		target: null,
		_root: component._root,
		_yield: listgroupitemtext_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			listgroupitemheading_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitemtext_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			listgroupitemheading_1.destroy( detach );
			listgroupitemtext_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitemheading_yield_fragment ( state, component ) {
	var text = createText( "List group item heading" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitemtext_yield_fragment ( state, component ) {
	var text = createText( "Donec id elit non mi porta gravida at eget metus.\n              Maecenas sed diam eget risus varius blandit." );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitem_1_yield_fragment_3 ( state, component ) {
	var listgroupitemheading_1_yield_fragment = create_listgroupitemheading_yield_fragment_1( state, component );

	var listgroupitemheading_1 = new ListGroupItemHeading({
		target: null,
		_root: component._root,
		_yield: listgroupitemheading_1_yield_fragment
	});

	var text = createText( "\n            " );
	var listgroupitemtext_1_yield_fragment = create_listgroupitemtext_yield_fragment_1( state, component );

	var listgroupitemtext_1 = new ListGroupItemText({
		target: null,
		_root: component._root,
		_yield: listgroupitemtext_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			listgroupitemheading_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listgroupitemtext_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			listgroupitemheading_1.destroy( detach );
			listgroupitemtext_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitemheading_yield_fragment_1 ( state, component ) {
	var text = createText( "List group item heading" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_listgroupitemtext_yield_fragment_1 ( state, component ) {
	var text = createText( "Donec id elit non mi porta gravida at eget metus.\n              Maecenas sed diam eget risus varius blandit." );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_row_13_yield_fragment ( state, component ) {
	var col_3_yield_fragment = create_col_yield_fragment_12( state, component );

	var col_3 = new Col({
		target: null,
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 4 }
	});

	var text = createText( "\n\n      " );
	var col_4_yield_fragment = create_col_1_yield_fragment_7( state, component );

	var col_4 = new Col({
		target: null,
		_root: component._root,
		_yield: col_4_yield_fragment,
		data: { lg: 4 }
	});

	var text_1 = createText( "\n\n      " );
	var col_5_yield_fragment = create_col_2_yield_fragment_1( state, component );

	var col_5 = new Col({
		target: null,
		_root: component._root,
		_yield: col_5_yield_fragment,
		data: { lg: 4 }
	});

	return {
		mount: function ( target, anchor ) {
			col_3._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_4._fragment.mount( target, anchor );
			insertNode( text_1, target, anchor );
			col_5._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_3.destroy( detach );
			col_4.destroy( detach );
			col_5.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
			}
		}
	};
}

function create_col_yield_fragment_12 ( state, component ) {
	var each_block_value = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];
	var each_block_3_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_3_iterations[i] = create_each_block_3( state, each_block_value, each_block_value[i], i, component );
	}

	var each_block_3_anchor = createComment();

	return {
		mount: function ( target, anchor ) {
			for ( var i = 0; i < each_block_3_iterations.length; i += 1 ) {
				each_block_3_iterations[i].mount( target, null );
			}

			insertNode( each_block_3_anchor, target, anchor );
		},

		destroy: function ( detach ) {
			destroyEach( each_block_3_iterations, detach, 0 );

			if ( detach ) {
				detachNode( each_block_3_anchor );
			}
		}
	};
}

function create_each_block_3 ( state, each_block_value, color_1, color_index, component ) {
	var card_1_yield_fragment = create_card_yield_fragment( state, each_block_value, color_1, color_index, component );

	var card_1 = new Card({
		target: null,
		_root: component._root,
		_yield: card_1_yield_fragment,
		data: {
			class: "mb-3 text-xs-center",
			color: color_1
		}
	});

	return {
		mount: function ( target, anchor ) {
			card_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			card_1.destroy( detach );
		}
	};
}

function create_card_yield_fragment ( state, each_block_value, color_1, color_index, component ) {
	var cardblock_1_yield_fragment = create_cardblock_yield_fragment( state, each_block_value, color_1, color_index, component );

	var cardblock_1 = new CardBlock({
		target: null,
		_root: component._root,
		_yield: cardblock_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			cardblock_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			cardblock_1.destroy( detach );
		}
	};
}

function create_cardblock_yield_fragment ( state, each_block_value, color_1, color_index, component ) {
	var cardtitle_1_yield_fragment = create_cardtitle_yield_fragment( state, each_block_value, color_1, color_index, component );

	var cardtitle_1 = new CardTitle({
		target: null,
		_root: component._root,
		_yield: cardtitle_1_yield_fragment
	});

	var text = createText( "\n              " );
	var blockquote = createElement( 'blockquote' );
	blockquote.className = "card-blockquote";
	var p = createElement( 'p' );
	appendNode( p, blockquote );
	appendNode( createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." ), p );
	appendNode( createText( "\n                " ), blockquote );
	var footer = createElement( 'footer' );
	appendNode( footer, blockquote );
	appendNode( createText( "Someone famous in " ), footer );
	var cite = createElement( 'cite' );
	appendNode( cite, footer );
	cite.title = "Source Title";
	appendNode( createText( "Source Title" ), cite );

	return {
		mount: function ( target, anchor ) {
			cardtitle_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			insertNode( blockquote, target, anchor );
		},

		destroy: function ( detach ) {
			cardtitle_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( blockquote );
			}
		}
	};
}

function create_cardtitle_yield_fragment ( state, each_block_value, color_1, color_index, component ) {
	var text_value;

	var text = createText( text_value = color_1 );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_1_yield_fragment_7 ( state, component ) {
	var each_block_value = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];
	var each_block_4_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_4_iterations[i] = create_each_block_4( state, each_block_value, each_block_value[i], i, component );
	}

	var each_block_4_anchor = createComment();

	return {
		mount: function ( target, anchor ) {
			for ( var i = 0; i < each_block_4_iterations.length; i += 1 ) {
				each_block_4_iterations[i].mount( target, null );
			}

			insertNode( each_block_4_anchor, target, anchor );
		},

		destroy: function ( detach ) {
			destroyEach( each_block_4_iterations, detach, 0 );

			if ( detach ) {
				detachNode( each_block_4_anchor );
			}
		}
	};
}

function create_each_block_4 ( state, each_block_value, color_2, color_index, component ) {
	var card_1_yield_fragment = create_card_yield_fragment_1( state, each_block_value, color_2, color_index, component );

	var card_1 = new Card({
		target: null,
		_root: component._root,
		_yield: card_1_yield_fragment,
		data: {
			outline: true,
			class: "mb-3 text-xs-center",
			color: color_2
		}
	});

	return {
		mount: function ( target, anchor ) {
			card_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			card_1.destroy( detach );
		}
	};
}

function create_card_yield_fragment_1 ( state, each_block_value, color_2, color_index, component ) {
	var cardblock_1_yield_fragment = create_cardblock_yield_fragment_1( state, each_block_value, color_2, color_index, component );

	var cardblock_1 = new CardBlock({
		target: null,
		_root: component._root,
		_yield: cardblock_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			cardblock_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			cardblock_1.destroy( detach );
		}
	};
}

function create_cardblock_yield_fragment_1 ( state, each_block_value, color_2, color_index, component ) {
	var cardtitle_1_yield_fragment = create_cardtitle_yield_fragment_1( state, each_block_value, color_2, color_index, component );

	var cardtitle_1 = new CardTitle({
		target: null,
		_root: component._root,
		_yield: cardtitle_1_yield_fragment
	});

	var text = createText( "\n              " );
	var blockquote = createElement( 'blockquote' );
	blockquote.className = "card-blockquote";
	var p = createElement( 'p' );
	appendNode( p, blockquote );
	appendNode( createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." ), p );
	appendNode( createText( "\n                " ), blockquote );
	var footer = createElement( 'footer' );
	appendNode( footer, blockquote );
	appendNode( createText( "Someone famous in " ), footer );
	var cite = createElement( 'cite' );
	appendNode( cite, footer );
	cite.title = "Source Title";
	appendNode( createText( "Source Title" ), cite );

	return {
		mount: function ( target, anchor ) {
			cardtitle_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			insertNode( blockquote, target, anchor );
		},

		destroy: function ( detach ) {
			cardtitle_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( blockquote );
			}
		}
	};
}

function create_cardtitle_yield_fragment_1 ( state, each_block_value, color_2, color_index, component ) {
	var text_value;

	var text = createText( text_value = color_2 );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_2_yield_fragment_1 ( state, component ) {
	var card_1_yield_fragment = create_card_yield_fragment_2( state, component );

	var card_1 = new Card({
		target: null,
		_root: component._root,
		_yield: card_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			card_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			card_1.destroy( detach );
		}
	};
}

function create_card_yield_fragment_2 ( state, component ) {
	var cardheader_1_yield_fragment = create_cardheader_yield_fragment( state, component );

	var cardheader_1 = new CardHeader({
		target: null,
		_root: component._root,
		_yield: cardheader_1_yield_fragment
	});

	var text = createText( "\n          " );
	var cardblock_2_yield_fragment = create_cardblock_yield_fragment_2( state, component );

	var cardblock_2 = new CardBlock({
		target: null,
		_root: component._root,
		_yield: cardblock_2_yield_fragment
	});

	var text_1 = createText( "\n          " );
	var img = createElement( 'img' );
	img.style.cssText = "height: 200px; width: 100%; display: block;";
	img.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22318%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20318%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_158bd1d28ef%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_158bd1d28ef%22%3E%3Crect%20width%3D%22318%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22129.359375%22%20y%3D%2297.35%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
	img.alt = "Card image";
	var text_2 = createText( "\n          " );
	var cardblock_3_yield_fragment = create_cardblock_1_yield_fragment( state, component );

	var cardblock_3 = new CardBlock({
		target: null,
		_root: component._root,
		_yield: cardblock_3_yield_fragment
	});

	var text_3 = createText( "\n          " );
	var cardfooter_1_yield_fragment = create_cardfooter_yield_fragment( state, component );

	var cardfooter_1 = new CardFooter({
		target: null,
		_root: component._root,
		_yield: cardfooter_1_yield_fragment,
		data: { class: "text-muted text-xs-center" }
	});

	return {
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

		destroy: function ( detach ) {
			cardheader_1.destroy( detach );
			cardblock_2.destroy( detach );
			cardblock_3.destroy( detach );
			cardfooter_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
				detachNode( text_1 );
				detachNode( img );
				detachNode( text_2 );
				detachNode( text_3 );
			}
		}
	};
}

function create_cardheader_yield_fragment ( state, component ) {
	var text = createText( "Card header" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_cardblock_yield_fragment_2 ( state, component ) {
	var cardtitle_1_yield_fragment = create_cardtitle_yield_fragment_2( state, component );

	var cardtitle_1 = new CardTitle({
		target: null,
		_root: component._root,
		_yield: cardtitle_1_yield_fragment
	});

	var text = createText( "\n            " );
	var cardsubtitle_1_yield_fragment = create_cardsubtitle_yield_fragment( state, component );

	var cardsubtitle_1 = new CardSubtitle({
		target: null,
		_root: component._root,
		_yield: cardsubtitle_1_yield_fragment,
		data: { class: "text-muted" }
	});

	return {
		mount: function ( target, anchor ) {
			cardtitle_1._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			cardsubtitle_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			cardtitle_1.destroy( detach );
			cardsubtitle_1.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_cardtitle_yield_fragment_2 ( state, component ) {
	var text = createText( "Special title treatment" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_cardsubtitle_yield_fragment ( state, component ) {
	var text = createText( "Support card subtitle" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_cardblock_1_yield_fragment ( state, component ) {
	var p = createElement( 'p' );
	p.className = "card-text";
	appendNode( createText( "Some quick example text to build on the card title and make up the bulk of the card's content." ), p );
	var text_1 = createText( "\n            " );
	var a = createElement( 'a' );
	a.href = "#";
	a.className = "card-link";
	appendNode( createText( "Card link" ), a );
	var text_3 = createText( "\n            " );
	var a_1 = createElement( 'a' );
	a_1.href = "#";
	a_1.className = "card-link";
	appendNode( createText( "Another link" ), a_1 );

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( a, target, anchor );
			insertNode( text_3, target, anchor );
			insertNode( a_1, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( p );
				detachNode( text_1 );
				detachNode( a );
				detachNode( text_3 );
				detachNode( a_1 );
			}
		}
	};
}

function create_cardfooter_yield_fragment ( state, component ) {
	var text = createText( "2 days ago" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_row_14_yield_fragment ( state, component ) {
	var media_1_yield_fragment = create_media_yield_fragment( state, component );

	var media_1 = new Media({
		target: null,
		_root: component._root,
		_yield: media_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			media_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			media_1.destroy( detach );
		}
	};
}

function create_media_yield_fragment ( state, component ) {
	var img = createElement( 'img' );
	img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAC7CAMAAAAXMCHDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRFHR4kyZt0cKYY1LCM////np6gY1lX8s6l4buR9uXSsn1bvL2+9dKp+9uwtdKO/+u5+Pbw893G2NjZ7seYUnQij7tO8Ovm3uvL38OnzOCx5tG86vHeOEYmfnx7OTk6////hsn4jgAAACB0Uk5T/////////////////////////////////////////wBcXBvtAAAMAUlEQVR42tydi5qiOBBGg4SAAhJBaS8Nvv9bbhICciepiraz1T3fzrgIOf5VlVuB5Pk/MfLGc9Myj+MgCKqqYuJPEMRxnvN/CqSMg4rVNZmzmgmknH49CBcM8wRjnDj/XpA8YMTC6irm3wfCYxMlJsaC/JtAaFwRsLGg/BKQHEGhnSz4exBuFxfL8ZL/KQgPiDNj+Z+BlBVxanX8JyCuMVAocBD6BgyFkn8WJCBvM1CsAEHimrzTKvoZEMrIuy3+BEhAPmCMvxuEM/IZi98LEpOPGXsnSEU+aDaZ2A6krMlnLXgPSEw+buwdIAH5A6tL5yAV+RMzDBTydVkXmIdNQXhN/s4CdyD5X3IYkZB/gUOMIt2A/DmHAYkJSIlKOnXNfpn4rev6nd5F3tad16w6+FGYppn4kb9pcvW9A2PvISHvyVesitJMmGj9ywSLfC3x2K97km0Q+0+QeYlASMJZS0JJEx1c9yfEOUflCwrZ4GUT4mSZZ/8J5QgQ23HJIZUUm6Z08a2dtgSDWI53WSgwktDQBIq7sTBxyeHTrAhtjNuO4CoYiF3C+t3T0o4jLDi9OkpdxFmgV5RyS46wCDm17KZyAEhgyUFTW5CwSMXbrBJKTa1BcqscLxpUWnMo57IkqaxBbCSPOUgQLQmN8f0icdKDSD1AgmhJrLaL5mfxxIVjyfig9AQDOak3V9jehDhwLKaawkEcsjNRb6+RzkUcZKxStWQPBCn26u02k57aHMTmtIFqCE2gICm1dq7KGMTirDXHeVbrW1bOlRuCxLYZC+5ZnW9ZZS5mCGIzNmk4QJ3I0Ldw8U6wglS6FSHCmjNwVAomWEFyig2Rpk/E9u8EmXprig0RAVLqDwMzxyJIQVrPOmFA9tQ+A48lIchpYYyO9W6UQmmAkIQgp1MLIMnmzxyI1cRhJAnBTUPa5Dvs15MiiqJi9Xc2/9qtzVYbIJbztRZkoEe0abMgFDHrJThBGJ3rRpLC/wRItQoSAEEmrgUBsVscGkzfCWaC+8q+4LHvINhti3XiFRDLJbkOJC0SByCWC7RsBcTyVAFd7UeSqblUpL8WTHCbIZ0i8z17MTGnivTXHQmuSKNaU0TE/Dh7+XMeCFeELYLYfiRsA2RihVPX6vkWwW2zsbWslYST7mReEWA/MvAtgiv/qenqvMowRuAgbAGkgoIszKtklhr8JKvLD9R+65jPg9hv65X4edVrZpVbX/7VJw5AuP2Jcicge8BcdzTeIsjKsoBPYn2x4xt1k9MgAVyfzYIASsuqYYjIqgC1ExWKv8zCNK/LqE97R3BQf9hPwAQXIjr/6n49SWUf6DUm+ox0slMtXhEHHLyD+PVELtYo2rcgNRbxDAggRHTaajwrTSNPtE+b+IsfDVWRBxz65vkNa5HYTxBHPQkBz6l6k/Ym1NOiQzi0f/GLnihpOMRQVihWlbdARazVDAioijRoBREcBy2E52tJxJ8XSVp0QjSYjUUpaFN0vMVAsGWkTId6o8fBk6MplZOKSMdKOuTwo0L1jCKaJJN4IdWrjbACqHIKAjpR3YR60ugRJbqwSeavsIn7ZniVhqrVXpOsmqqnxO80keEO4mijnaALSXPlWamvOJTDyzqmJolJuuYTD1PlSkVTcpOpAiJxQKQ8TeqTUmCddzAByYEnok3uLVovyqKq8rOkjf/m/zZNbg5IM6+qrpkm8fRCBPSerWoCAvxE6gZEeErT5Kbkp8r0ClfYhIgSxFeCJZlqsq9IkqLtFqEV0swVCLmm3fxDffTNq54mSfR/tAtJUv3RN4jtm1MfeHl96w/B3+MZZIMiLP3B1oO+MJEpy9Mt17FYDd8HLb3XtfMEf3vkod+gJPudA1G5V0d9RGZBwMW0Y5AcWsc6apCnFc/CsSJ+0qDKC4lme33UJAWDxO8BCVPWi4AXiNe6VisJywaShVAOnX9fIDEUhI1AUuGjrBgWBSYv1xKiFcL9qnSw8JIWzkCC2g2I8J2kGJeapn2QIsuKJBtuRICTlkOQOpuZdUyWuLqsNX9EBgepRiAVGCTdXr9Owp4ic3by3IGAz5RulyynI0WmNcDB34PUhSHImiJZ9QWK+NsgyaYi3wDiZfgYydgXgASZgxj5CpDtipqtGCm4OxBwPyKmVptboRsxIuaH3wBSbRc5bcRIAVucczzWkgspW4vY6zFS7Cn/BhCD+n61xLikiNx6Q9wiGLgaxjfLpuGGJkWxdIRaL83hIJP5SIVwrc1awJWtBlUJGLsDKcGjnabyF1eJDR9qTebs8AcI1JhyFECR/+jqpavloG4jMYTcP4LY42kd29FK4wsEfEcPpej+sA8Cz4D5XEHKzMb69KWu6IEhs+9gNR6+IDOpfxCtTU97Yemr3eIl+copfbEgSgXWQMB+2hU76RxcFMm+rQHgbVdZnLqXThq46CoFECC5ox2rtmvv7bcXYUl7pkQpuiplfVzRKxTA9IdzO1YxMv/qMHn5S/uaQEvK4Ws8GRwIz5hsBqR0AELDaE/HxjmfvEbTKHn9AzvRHe2z19i0JZ0mpYaW9OjgSSt2VDAwinagIYaMuaNalN6wEWHwEOlqf8nz6aJvz1Ec6An7pF6rxifgcRvLnnH3nhU4qqAbjuSnVh4OrK13EH9ZOArxoKhyHgSxADvfRJ8pgubnwCLXgtQLNY2ImfN8lESssYP6ZfMHIR7FUy3V/SJEnpfk6vnSZKWN54ezroV5Ily8BII46VIK5rzt2Ocj5E5ceNYYBPPgpjss9XrEhWdN7laA+1btQUj2PgYkXwZB+JbvhdYcJy/ynHjWBAS+dFlHkRdZcohUcPUc9IZztyYhNq4i3/NLC4xSHO9jFCnXQOCzKwEiWnYydyvJgVGErd+HCA73qOkxruZuJQ2hSLwOEmAUkSRG7qXcSoH4TgSZAQGHe8MhUbbz8N3z9OFwRYKtm44rnCJKFL7eCbZyYGKk5lsgUEk6DklyX5XjdSRckWD7xvwKq8hqpPTlwMRIuQ1SohVRJFe+KQdCkcDk4RUBXpHGv8Yo/OSPOKAxMnmkE3H30M8RR6PK/sVSnq4TDLAigdkDXgIXiugJVXS93+/Xa6T+MTVYjNTc8NlBtRNFtCyeuhNjwWCKxKYPQYodKbJtoBhh5s/XAoy4fJCBFMnNQexT8DmEkdx3v7ZPza1sHt1mFe+/593uQmGKPC673e58RkX66lMBmQ3EToLcPXsOb0930sQZzr/gSF8FMVn/qwXFZaeNgiShvH3/RfyYeFll+8DJwASiwxCK0L21JGLE34F0wtTGKw6GzzJla/7Uk6JTxNq55HSSj05z2fCy2B5kYaRS/zYf3bgBvfmrMYgYwDx2MyZOvyBMAHlMbjzrTzMQrSKWJJ7cN+XzZ1vwMgZ7AnMwyU9LFFoRyi1IPLXisgTSwJyHXlZz4DOxuzCpZ4JiThE1HTfD8PRjDdfPKi/6ymU5+CnlUtvfdSkGivQXSNY5Ij3Af+w2rQv/AP649XwlKOYVkaJsovQm9Q+jk6tOJsA8AP/HjGIAQvndX3EwbzB3/DE9/+6I+0qCm+l1hvPa/VXNQ6YQYtp46h9qDHLBftuFKcljsvdxkvNCfXe7nlxd7/vRRP52NuSg6O8fOZpd6bawz74/neTv/jS/0X50wmH2jTBm1zrCyh7MYvCy9WV8Zt/RY0JyvrwR5PJw9K1JRyPxQeZED/PvsbpZpy1De7jhMP9mMQOSHwjIDZt3bUGemx/dGRTtxzOqHwSAPB+XdwTJzg2H3fchXiA9CTJEfp5vANlKXgDfOuLDHALy/DEeNzoJkaN5y2y//HS9/7q59azb830gq3nYvnM/OnErGMhq9nq4y1lHu1aBvnv65ioD/ziSAwry5Bc3vfvFRXRgQBbTl12U/Cym8efHQBb9yyZxXc6wIbtbkOdCyuG48SIMAwUyj2IxdHSIgQSRKBewcx0dYqBBZKxcYM416dSPD0wz8CCihzxCMtcw0i83ZCNcgIh+ZSjL0dKxLscfdBPcgMho6bEYBPzNKYVLEMVyNA34n3PrUQ9HF3cJouLlpvLY+bYd6EIK7u7CrkGaiBEwayT8cjk+HF/0HSCNn63YO673NpBP238CDAApnx3WCaBrvAAAAABJRU5ErkJggg==";
	img.alt = "Generic placeholder image";
	img.width = "100";
	img.height = "100";
	img.className = "d-flex align-self-start mr-2";
	var text = createText( "\n        " );
	var mediabody_1_yield_fragment = create_mediabody_yield_fragment( state, component );

	var mediabody_1 = new MediaBody({
		target: null,
		_root: component._root,
		_yield: mediabody_1_yield_fragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( img, target, anchor );
			insertNode( text, target, anchor );
			mediabody_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			mediabody_1.destroy( detach );

			if ( detach ) {
				detachNode( img );
				detachNode( text );
			}
		}
	};
}

function create_mediabody_yield_fragment ( state, component ) {
	var h4 = createElement( 'h4' );
	appendNode( createText( "Media heading" ), h4 );
	var text_1 = createText( "\n          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus." );

	return {
		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			insertNode( text_1, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( h4 );
				detachNode( text_1 );
			}
		}
	};
}

function create_row_15_yield_fragment ( state, component ) {
	var col_2_yield_fragment = create_col_yield_fragment_13( state, component );

	var col_2 = new Col({
		target: null,
		_root: component._root,
		_yield: col_2_yield_fragment,
		data: { lg: 6 }
	});

	var text = createText( "\n      " );
	var col_3_yield_fragment = create_col_1_yield_fragment_8( state, component );

	var col_3 = new Col({
		target: null,
		_root: component._root,
		_yield: col_3_yield_fragment,
		data: { lg: 6 }
	});

	return {
		mount: function ( target, anchor ) {
			col_2._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col_3._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			col_2.destroy( detach );
			col_3.destroy( detach );

			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_col_yield_fragment_13 ( state, component ) {
	var h2 = createElement( 'h2' );
	appendNode( createText( "Modals" ), h2 );
	var text_1 = createText( "\n          " );

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text_1, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( h2 );
				detachNode( text_1 );
			}
		}
	};
}

function create_col_1_yield_fragment_8 ( state, component ) {
	var h2 = createElement( 'h2' );
	appendNode( createText( "Popovers" ), h2 );
	var text_1 = createText( "\n        " );
	var div = createElement( 'div' );
	div.className = "mb-3";
	var button = createElement( 'button' );
	appendNode( button, div );
	button.type = "button";
	button.className = "btn btn-secondary";
	button.title = '';
	setAttribute( button, 'data-container', "body" );
	setAttribute( button, 'data-toggle', "popover" );
	setAttribute( button, 'data-placement', "left" );
	setAttribute( button, 'data-content', "Vivamus sagittis lacus vel augue laoreet rutrum faucibus." );
	setAttribute( button, 'data-original-title', "Popover Title" );
	appendNode( createText( "Left" ), button );
	appendNode( createText( "\n\n          " ), div );
	var button_1 = createElement( 'button' );
	appendNode( button_1, div );
	button_1.type = "button";
	button_1.className = "btn btn-secondary";
	button_1.title = '';
	setAttribute( button_1, 'data-container', "body" );
	setAttribute( button_1, 'data-toggle', "popover" );
	setAttribute( button_1, 'data-placement', "top" );
	setAttribute( button_1, 'data-content', "Vivamus sagittis lacus vel augue laoreet rutrum faucibus." );
	setAttribute( button_1, 'data-original-title', "Popover Title" );
	appendNode( createText( "Top" ), button_1 );
	appendNode( createText( "\n\n          " ), div );
	var button_2 = createElement( 'button' );
	appendNode( button_2, div );
	button_2.type = "button";
	button_2.className = "btn btn-secondary";
	button_2.title = '';
	setAttribute( button_2, 'data-container', "body" );
	setAttribute( button_2, 'data-toggle', "popover" );
	setAttribute( button_2, 'data-placement', "bottom" );
	setAttribute( button_2, 'data-content', "Vivamus\n              sagittis lacus vel augue laoreet rutrum faucibus." );
	setAttribute( button_2, 'data-original-title', "Popover Title" );
	appendNode( createText( "Bottom" ), button_2 );
	appendNode( createText( "\n\n          " ), div );
	var button_3 = createElement( 'button' );
	appendNode( button_3, div );
	button_3.type = "button";
	button_3.className = "btn btn-secondary";
	button_3.title = '';
	setAttribute( button_3, 'data-container', "body" );
	setAttribute( button_3, 'data-toggle', "popover" );
	setAttribute( button_3, 'data-placement', "right" );
	setAttribute( button_3, 'data-content', "Vivamus sagittis lacus vel augue laoreet rutrum faucibus." );
	setAttribute( button_3, 'data-original-title', "Popover Title" );
	appendNode( createText( "Right" ), button_3 );
	var text_9 = createText( "\n\n        " );
	var h2_1 = createElement( 'h2' );
	appendNode( createText( "Tooltips" ), h2_1 );
	var text_11 = createText( "\n        " );
	var div_1 = createElement( 'div' );
	var button_4 = createElement( 'button' );
	appendNode( button_4, div_1 );
	button_4.type = "button";
	button_4.className = "btn btn-secondary";
	setAttribute( button_4, 'data-toggle', "tooltip" );
	setAttribute( button_4, 'data-placement', "left" );
	button_4.title = '';
	setAttribute( button_4, 'data-original-title', "Tooltip on left" );
	appendNode( createText( "Left" ), button_4 );
	appendNode( createText( "\n\n          " ), div_1 );
	var button_5 = createElement( 'button' );
	appendNode( button_5, div_1 );
	button_5.type = "button";
	button_5.className = "btn btn-secondary";
	setAttribute( button_5, 'data-toggle', "tooltip" );
	setAttribute( button_5, 'data-placement', "top" );
	button_5.title = '';
	setAttribute( button_5, 'data-original-title', "Tooltip on top" );
	appendNode( createText( "Top" ), button_5 );
	appendNode( createText( "\n\n          " ), div_1 );
	var button_6 = createElement( 'button' );
	appendNode( button_6, div_1 );
	button_6.type = "button";
	button_6.className = "btn btn-secondary";
	setAttribute( button_6, 'data-toggle', "tooltip" );
	setAttribute( button_6, 'data-placement', "bottom" );
	button_6.title = '';
	setAttribute( button_6, 'data-original-title', "Tooltip on bottom" );
	appendNode( createText( "Bottom" ), button_6 );
	appendNode( createText( "\n\n          " ), div_1 );
	var button_7 = createElement( 'button' );
	appendNode( button_7, div_1 );
	button_7.type = "button";
	button_7.className = "btn btn-secondary";
	setAttribute( button_7, 'data-toggle', "tooltip" );
	setAttribute( button_7, 'data-placement', "right" );
	button_7.title = '';
	setAttribute( button_7, 'data-original-title', "Tooltip on right" );
	appendNode( createText( "Right" ), button_7 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( div, target, anchor );
			insertNode( text_9, target, anchor );
			insertNode( h2_1, target, anchor );
			insertNode( text_11, target, anchor );
			insertNode( div_1, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( h2 );
				detachNode( text_1 );
				detachNode( div );
				detachNode( text_9 );
				detachNode( h2_1 );
				detachNode( text_11 );
				detachNode( div_1 );
			}
		}
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
	this._renderHooks = [];

	this._fragment = create_main_fragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );

	this._flush();
}

assign( Docs.prototype, template.methods, proto );

Docs.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );

	this._flush();
};

Docs.prototype.teardown = Docs.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

return Docs;

}());
