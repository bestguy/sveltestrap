var Docs = (function () {
'use strict';

function appendNode ( node, target ) {
	target.appendChild( node );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function teardownEach ( iterations, detach, start ) {
	for ( var i = ( start || 0 ); i < iterations.length; i += 1 ) {
		iterations[i].teardown( detach );
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
	node.addEventListener ( event, handler, false );
}

function removeEventListener ( node, event, handler ) {
	node.removeEventListener ( event, handler, false );
}

function setAttribute ( node, attribute, value ) {
	node.setAttribute ( attribute, value );
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
	var group = ( options && options.defer ) ? this._observers.pre : this._observers.post;

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
	this._set( newState );
	( this._root || this )._flush();
}

function _flush () {
	if ( !this._renderHooks ) return;

	while ( this._renderHooks.length ) {
		var hook = this._renderHooks.pop();
		hook.fn.call( hook.context );
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

function noop () {}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

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

function renderMainFragment$2 ( root, component ) {
	var button = createElement( 'button' );
	button.type = "button";
	button.className = "close";
	setAttribute( button, 'aria-label', "Close" );
	
	function clickHandler ( event ) {
		component.fire('click');
	}
	
	addEventListener( button, 'click', clickHandler );
	
	var span = createElement( 'span' );
	setAttribute( span, 'aria-hidden', "true" );
	
	appendNode( span, button );
	appendNode( createText( "×" ), span );

	return {
		mount: function ( target, anchor ) {
			insertNode( button, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			removeEventListener( button, 'click', clickHandler );
			
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
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$2( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Close.prototype = Object.assign( {}, proto );

Close.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Close.prototype.teardown = Close.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$1 = (function () {
  // TODO handle fade transition when dismissing

  return {
    components: {
      Close
    },
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

function renderMainFragment$1 ( root, component ) {
	var ifBlock_anchor = createComment();
	
	function getBlock ( root ) {
		if ( root.isOpen ) return renderIfBlock_0$1;
		return null;
	}
	
	var currentBlock = getBlock( root );
	var ifBlock = currentBlock && currentBlock( root, component );

	return {
		mount: function ( target, anchor ) {
			insertNode( ifBlock_anchor, target, anchor );
			if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			var _currentBlock = currentBlock;
			currentBlock = getBlock( root );
			if ( _currentBlock === currentBlock && ifBlock) {
				ifBlock.update( changed, root );
			} else {
				if ( ifBlock ) ifBlock.teardown( true );
				ifBlock = currentBlock && currentBlock( root, component );
				if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
			}
		},
		
		teardown: function ( detach ) {
			if ( ifBlock ) ifBlock.teardown( detach );
			
			if ( detach ) {
				detachNode( ifBlock_anchor );
			}
		}
	};
}

function renderIfBlock_0$1 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "alert alert-" + ( root.color ) + ( root.dismissible ? ' alert-dismissible' : '' ) + " " + ( root.class );
	setAttribute( div, 'role', "alert" );
	
	var ifBlock1_anchor = createComment();
	appendNode( ifBlock1_anchor, div );
	
	function getBlock1 ( root ) {
		if ( root.dismissible ) return renderIfBlock1_0;
		return null;
	}
	
	var currentBlock1 = getBlock1( root );
	var ifBlock1 = currentBlock1 && currentBlock1( root, component );
	
	if ( ifBlock1 ) ifBlock1.mount( ifBlock1_anchor.parentNode, ifBlock1_anchor );
	appendNode( createText( "\n    " ), div );
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "alert alert-" + ( root.color ) + ( root.dismissible ? ' alert-dismissible' : '' ) + " " + ( root.class );
			
			var _currentBlock1 = currentBlock1;
			currentBlock1 = getBlock1( root );
			if ( _currentBlock1 === currentBlock1 && ifBlock1) {
				ifBlock1.update( changed, root );
			} else {
				if ( ifBlock1 ) ifBlock1.teardown( true );
				ifBlock1 = currentBlock1 && currentBlock1( root, component );
				if ( ifBlock1 ) ifBlock1.mount( ifBlock1_anchor.parentNode, ifBlock1_anchor );
			}
		},
		
		teardown: function ( detach ) {
			if ( ifBlock1 ) ifBlock1.teardown( false );
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function renderIfBlock1_0 ( root, component ) {
	var close = new template$1.components.Close({
		target: null,
		_root: component._root || component
	});
	
	close.on( 'click', function ( event ) {
		component.set({ isOpen: false });
	});

	return {
		mount: function ( target, anchor ) {
			close._fragment.mount( target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			close.destroy( detach );
		}
	};
}

function Alert ( options ) {
	options = options || {};
	this._state = Object.assign( template$1.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	this._renderHooks = [];
	
	this._fragment = renderMainFragment$1( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
	
	this._flush();
}

Alert.prototype = Object.assign( {}, proto );

Alert.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
	
	this._flush();
};

Alert.prototype.teardown = Alert.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$3 ( root, component ) {
	var span = createElement( 'span' );
	span.className = "badge badge-" + ( root.color ) + ( root.pill ? ' badge-pill' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, span );

	return {
		mount: function ( target, anchor ) {
			insertNode( span, target, anchor );
			component._yield && component._yield.mount( span, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			span.className = "badge badge-" + ( root.color ) + ( root.pill ? ' badge-pill' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( span );
			}
		}
	};
}

function Badge ( options ) {
	options = options || {};
	this._state = Object.assign( template$2.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$3( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Badge.prototype = Object.assign( {}, proto );

Badge.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Badge.prototype.teardown = Badge.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$4 ( root, component ) {
	var ol = createElement( 'ol' );
	ol.className = "breadcrumb " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, ol );

	return {
		mount: function ( target, anchor ) {
			insertNode( ol, target, anchor );
			component._yield && component._yield.mount( ol, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			ol.className = "breadcrumb " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( ol );
			}
		}
	};
}

function Breadcrumb ( options ) {
	options = options || {};
	this._state = Object.assign( template$3.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$4( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Breadcrumb.prototype = Object.assign( {}, proto );

Breadcrumb.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Breadcrumb.prototype.teardown = Breadcrumb.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$5 ( root, component ) {
	var li = createElement( 'li' );
	li.className = "breadcrumb-item" + ( root.active ? ' active' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, li );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			li.className = "breadcrumb-item" + ( root.active ? ' active' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( li );
			}
		}
	};
}

function BreadcrumbItem ( options ) {
	options = options || {};
	this._state = Object.assign( template$4.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$5( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

BreadcrumbItem.prototype = Object.assign( {}, proto );

BreadcrumbItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

BreadcrumbItem.prototype.teardown = BreadcrumbItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$6 ( root, component ) {
	var Button = createElement( 'Button' );
	Button.className = "btn btn" + ( root.outline ? '-outline' : '' ) + "-" + ( root.color ) + ( root.size ? ` btn-${root.size}` : '' ) + ( root.block ? ' btn-block' : '' ) + ( root.active ? ' active' : '' ) + ( root.disabled ? ' disabled' : '' ) + " " + ( root.class );
	
	function clickHandler ( event ) {
		component.onClick(event);
	}
	
	addEventListener( Button, 'click', clickHandler );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, Button );

	return {
		mount: function ( target, anchor ) {
			insertNode( Button, target, anchor );
			component._yield && component._yield.mount( Button, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			Button.className = "btn btn" + ( root.outline ? '-outline' : '' ) + "-" + ( root.color ) + ( root.size ? ` btn-${root.size}` : '' ) + ( root.block ? ' btn-block' : '' ) + ( root.active ? ' active' : '' ) + ( root.disabled ? ' disabled' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			removeEventListener( Button, 'click', clickHandler );
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( Button );
			}
		}
	};
}

function Button ( options ) {
	options = options || {};
	this._state = Object.assign( template$5.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$6( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Button.prototype = Object.assign( {}, template$5.methods, proto );

Button.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Button.prototype.teardown = Button.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$7 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "" + ( root.size ? `btn-group-${root.size} ` : '' ) + ( root.vertical ? 'btn-group-vertical' : 'btn-group' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "" + ( root.size ? `btn-group-${root.size} ` : '' ) + ( root.vertical ? 'btn-group-vertical' : 'btn-group' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function ButtonGroup ( options ) {
	options = options || {};
	this._state = Object.assign( template$6.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$7( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

ButtonGroup.prototype = Object.assign( {}, proto );

ButtonGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ButtonGroup.prototype.teardown = ButtonGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$8 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "btn-toolbar " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "btn-toolbar " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function ButtonToolbar ( options ) {
	options = options || {};
	this._state = Object.assign( template$7.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$8( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

ButtonToolbar.prototype = Object.assign( {}, proto );

ButtonToolbar.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ButtonToolbar.prototype.teardown = ButtonToolbar.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$9 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "card" + ( root.inverse ? ' card-inverse' : '' ) + ( root.block ? ' card-block' : '' ) + ( root.color ? ` card${root.outline ? '-outline' : ''}-${root.color}` : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "card" + ( root.inverse ? ' card-inverse' : '' ) + ( root.block ? ' card-block' : '' ) + ( root.color ? ` card${root.outline ? '-outline' : ''}-${root.color}` : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Card ( options ) {
	options = options || {};
	this._state = Object.assign( template$8.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$9( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Card.prototype = Object.assign( {}, proto );

Card.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Card.prototype.teardown = Card.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$10 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "card-block " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "card-block " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function CardBlock ( options ) {
	options = options || {};
	this._state = Object.assign( template$9.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$10( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardBlock.prototype = Object.assign( {}, proto );

CardBlock.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardBlock.prototype.teardown = CardBlock.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$11 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "card-columns " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "card-columns " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function CardColumns ( options ) {
	options = options || {};
	this._state = Object.assign( template$10.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$11( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardColumns.prototype = Object.assign( {}, proto );

CardColumns.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardColumns.prototype.teardown = CardColumns.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$12 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "card-deck " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "card-deck " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function CardDeck ( options ) {
	options = options || {};
	this._state = Object.assign( template$11.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$12( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardDeck.prototype = Object.assign( {}, proto );

CardDeck.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardDeck.prototype.teardown = CardDeck.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$13 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "card-footer " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "card-footer " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function CardFooter ( options ) {
	options = options || {};
	this._state = Object.assign( template$12.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$13( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardFooter.prototype = Object.assign( {}, proto );

CardFooter.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardFooter.prototype.teardown = CardFooter.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$14 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "card-group " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "card-group " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function CardGroup ( options ) {
	options = options || {};
	this._state = Object.assign( template$13.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$14( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardGroup.prototype = Object.assign( {}, proto );

CardGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardGroup.prototype.teardown = CardGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$15 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "card-header " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "card-header " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function CardHeader ( options ) {
	options = options || {};
	this._state = Object.assign( template$14.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$15( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardHeader.prototype = Object.assign( {}, proto );

CardHeader.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardHeader.prototype.teardown = CardHeader.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$16 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "card-img-overlay " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "card-img-overlay " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function CardImgOverlay ( options ) {
	options = options || {};
	this._state = Object.assign( template$15.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$16( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardImgOverlay.prototype = Object.assign( {}, proto );

CardImgOverlay.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardImgOverlay.prototype.teardown = CardImgOverlay.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$17 ( root, component ) {
	var h6 = createElement( 'h6' );
	h6.className = "card-subtitle " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, h6 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h6, target, anchor );
			component._yield && component._yield.mount( h6, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			h6.className = "card-subtitle " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( h6 );
			}
		}
	};
}

function CardSubtitle ( options ) {
	options = options || {};
	this._state = Object.assign( template$16.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$17( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardSubtitle.prototype = Object.assign( {}, proto );

CardSubtitle.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardSubtitle.prototype.teardown = CardSubtitle.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$18 ( root, component ) {
	var p = createElement( 'p' );
	p.className = "card-text " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, p );

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			component._yield && component._yield.mount( p, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			p.className = "card-text " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( p );
			}
		}
	};
}

function CardText ( options ) {
	options = options || {};
	this._state = Object.assign( template$17.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$18( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardText.prototype = Object.assign( {}, proto );

CardText.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardText.prototype.teardown = CardText.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$19 ( root, component ) {
	var h4 = createElement( 'h4' );
	h4.className = "card-title " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, h4 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			component._yield && component._yield.mount( h4, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			h4.className = "card-title " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( h4 );
			}
		}
	};
}

function CardTitle ( options ) {
	options = options || {};
	this._state = Object.assign( template$18.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$19( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

CardTitle.prototype = Object.assign( {}, proto );

CardTitle.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

CardTitle.prototype.teardown = CardTitle.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function applyComputations ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'widths' in newState && typeof state.widths === 'object' || state.widths !== oldState.widths ) || ( 'xs' in newState && typeof state.xs === 'object' || state.xs !== oldState.xs ) || ( 'sm' in newState && typeof state.sm === 'object' || state.sm !== oldState.sm ) || ( 'md' in newState && typeof state.md === 'object' || state.md !== oldState.md ) || ( 'lg' in newState && typeof state.lg === 'object' || state.lg !== oldState.lg ) || ( 'xl' in newState && typeof state.xl === 'object' || state.xl !== oldState.xl ) ) {
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

function renderMainFragment$20 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "" + ( root.classes ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "" + ( root.classes ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Col ( options ) {
	options = options || {};
	this._state = Object.assign( template$19.data(), options.data );
	applyComputations( this._state, this._state, {}, true );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$20( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Col.prototype = Object.assign( {}, proto );

Col.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	applyComputations( this._state, newState, oldState, false );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Col.prototype.teardown = Col.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$21 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "container" + ( root.fluid ? '-fluid' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "container" + ( root.fluid ? '-fluid' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Container ( options ) {
	options = options || {};
	this._state = Object.assign( template$20.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$21( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Container.prototype = Object.assign( {}, proto );

Container.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Container.prototype.teardown = Container.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$22 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "dropdown" + ( root.dropup ? ' dropup' : '' ) + ( root.open ? ' show' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "dropdown" + ( root.dropup ? ' dropup' : '' ) + ( root.open ? ' show' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Dropdown ( options ) {
	options = options || {};
	this._state = Object.assign( template$21.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$22( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Dropdown.prototype = Object.assign( {}, proto );

Dropdown.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Dropdown.prototype.teardown = Dropdown.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$23 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "dropdown-divider " + ( root.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "dropdown-divider " + ( root.class );
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function DropdownDivider ( options ) {
	options = options || {};
	this._state = Object.assign( template$22.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$23( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

DropdownDivider.prototype = Object.assign( {}, proto );

DropdownDivider.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownDivider.prototype.teardown = DropdownDivider.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$24 ( root, component ) {
	var h6 = createElement( 'h6' );
	h6.className = "dropdown-header " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, h6 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h6, target, anchor );
			component._yield && component._yield.mount( h6, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			h6.className = "dropdown-header " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( h6 );
			}
		}
	};
}

function DropdownHeader ( options ) {
	options = options || {};
	this._state = Object.assign( template$23.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$24( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

DropdownHeader.prototype = Object.assign( {}, proto );

DropdownHeader.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownHeader.prototype.teardown = DropdownHeader.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$25 ( root, component ) {
	var button = createElement( 'button' );
	button.className = "dropdown-item" + ( root.disabled ? ' disabled' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, button );

	return {
		mount: function ( target, anchor ) {
			insertNode( button, target, anchor );
			component._yield && component._yield.mount( button, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button.className = "dropdown-item" + ( root.disabled ? ' disabled' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( button );
			}
		}
	};
}

function DropdownItem ( options ) {
	options = options || {};
	this._state = Object.assign( template$24.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$25( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

DropdownItem.prototype = Object.assign( {}, proto );

DropdownItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownItem.prototype.teardown = DropdownItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$26 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "dropdown-menu" + ( root.right ? ' dropdown-menu-right' : '' ) + " " + ( root.class );
	setAttribute( div, 'tabIndex', "-1" );
	setAttribute( div, 'role', "menu" );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "dropdown-menu" + ( root.right ? ' dropdown-menu-right' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function DropdownMenu ( options ) {
	options = options || {};
	this._state = Object.assign( template$25.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$26( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

DropdownMenu.prototype = Object.assign( {}, proto );

DropdownMenu.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

DropdownMenu.prototype.teardown = DropdownMenu.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$27 ( root, component ) {
	var form = createElement( 'form' );
	form.className = "" + ( root.inline ? 'form-inline' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, form );

	return {
		mount: function ( target, anchor ) {
			insertNode( form, target, anchor );
			component._yield && component._yield.mount( form, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			form.className = "" + ( root.inline ? 'form-inline' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( form );
			}
		}
	};
}

function Form ( options ) {
	options = options || {};
	this._state = Object.assign( template$26.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$27( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Form.prototype = Object.assign( {}, proto );

Form.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Form.prototype.teardown = Form.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$28 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "form-control-feedback " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "form-control-feedback " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function FormFeedback ( options ) {
	options = options || {};
	this._state = Object.assign( template$27.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$28( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

FormFeedback.prototype = Object.assign( {}, proto );

FormFeedback.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

FormFeedback.prototype.teardown = FormFeedback.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$29 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "" + ( root.color ? `has-${root.color}` : '' ) + ( root.row ? ' row' : '' ) + ( root.check ? ' form-check' : ' form-group' ) + ( root.check && root.disabled ? ' disabled' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "" + ( root.color ? `has-${root.color}` : '' ) + ( root.row ? ' row' : '' ) + ( root.check ? ' form-check' : ' form-group' ) + ( root.check && root.disabled ? ' disabled' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function FormGroup ( options ) {
	options = options || {};
	this._state = Object.assign( template$28.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$29( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

FormGroup.prototype = Object.assign( {}, proto );

FormGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

FormGroup.prototype.teardown = FormGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$30 ( root, component ) {
	var small = createElement( 'small' );
	small.className = "" + ( !root.inline ? 'form-text' : '' ) + ( root.color ? ` text-${root.color}` : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, small );

	return {
		mount: function ( target, anchor ) {
			insertNode( small, target, anchor );
			component._yield && component._yield.mount( small, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			small.className = "" + ( !root.inline ? 'form-text' : '' ) + ( root.color ? ` text-${root.color}` : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( small );
			}
		}
	};
}

function FormText ( options ) {
	options = options || {};
	this._state = Object.assign( template$29.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$30( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

FormText.prototype = Object.assign( {}, proto );

FormText.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

FormText.prototype.teardown = FormText.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$31 ( root, component ) {
	var i = createElement( 'i' );
	i.className = "fa fa-" + ( root.name ) + ( root.size ? ' fa-' + root.size : '' ) + ( root.spin ? ' fa-spin' : '' ) + ( root.pulse ? ' fa-pulse' : '' ) + ( root.border ? ' fa-border' : '' ) + ( root.fixedWidth ? ' fa-fw' : '' ) + ( root.inverse ? ' fa-inverse' : '' ) + ( root.flip ? ' fa-flip-' + root.flip : '' ) + ( root.rotate ? ' fa-rotate-' + root.rotate : '' ) + ( root.stack ? ' fa-stack-' + root.stack : '' ) + " " + ( root.class );

	return {
		mount: function ( target, anchor ) {
			insertNode( i, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			i.className = "fa fa-" + ( root.name ) + ( root.size ? ' fa-' + root.size : '' ) + ( root.spin ? ' fa-spin' : '' ) + ( root.pulse ? ' fa-pulse' : '' ) + ( root.border ? ' fa-border' : '' ) + ( root.fixedWidth ? ' fa-fw' : '' ) + ( root.inverse ? ' fa-inverse' : '' ) + ( root.flip ? ' fa-flip-' + root.flip : '' ) + ( root.rotate ? ' fa-rotate-' + root.rotate : '' ) + ( root.stack ? ' fa-stack-' + root.stack : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( i );
			}
		}
	};
}

function Icon ( options ) {
	options = options || {};
	this._state = Object.assign( template$30.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$31( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Icon.prototype = Object.assign( {}, proto );

Icon.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Icon.prototype.teardown = Icon.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$32 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "input-group" + ( root.size ? ` input-group-${root.size}` : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "input-group" + ( root.size ? ` input-group-${root.size}` : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function InputGroup ( options ) {
	options = options || {};
	this._state = Object.assign( template$31.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$32( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

InputGroup.prototype = Object.assign( {}, proto );

InputGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

InputGroup.prototype.teardown = InputGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$33 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "input-group-addon " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "input-group-addon " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function InputGroupAddon ( options ) {
	options = options || {};
	this._state = Object.assign( template$32.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$33( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

InputGroupAddon.prototype = Object.assign( {}, proto );

InputGroupAddon.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

InputGroupAddon.prototype.teardown = InputGroupAddon.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$34 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "jumbotron" + ( root.fluid ? ' jumbotron-fluid' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "jumbotron" + ( root.fluid ? ' jumbotron-fluid' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Jumbotron ( options ) {
	options = options || {};
	this._state = Object.assign( template$33.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$34( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Jumbotron.prototype = Object.assign( {}, proto );

Jumbotron.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Jumbotron.prototype.teardown = Jumbotron.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$35 ( root, component ) {
	var ul = createElement( 'ul' );
	ul.className = "list-group" + ( root.flush ? ' list-group-flush' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, ul );

	return {
		mount: function ( target, anchor ) {
			insertNode( ul, target, anchor );
			component._yield && component._yield.mount( ul, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			ul.className = "list-group" + ( root.flush ? ' list-group-flush' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( ul );
			}
		}
	};
}

function ListGroup ( options ) {
	options = options || {};
	this._state = Object.assign( template$34.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$35( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

ListGroup.prototype = Object.assign( {}, proto );

ListGroup.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroup.prototype.teardown = ListGroup.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$36 ( root, component ) {
	var li = createElement( 'li' );
	li.className = "list-group-item" + ( root.active ? ' active' : '' ) + ( root.disabled ? ' disabled' : '' ) + ( root.action ? ' list-group-item-action' : '' ) + ( root.color ? ` list-group-item-${root.color}` : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, li );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			li.className = "list-group-item" + ( root.active ? ' active' : '' ) + ( root.disabled ? ' disabled' : '' ) + ( root.action ? ' list-group-item-action' : '' ) + ( root.color ? ` list-group-item-${root.color}` : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( li );
			}
		}
	};
}

function ListGroupItem ( options ) {
	options = options || {};
	this._state = Object.assign( template$35.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$36( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

ListGroupItem.prototype = Object.assign( {}, proto );

ListGroupItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroupItem.prototype.teardown = ListGroupItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$37 ( root, component ) {
	var h5 = createElement( 'h5' );
	h5.className = "list-group-item-heading " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, h5 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h5, target, anchor );
			component._yield && component._yield.mount( h5, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			h5.className = "list-group-item-heading " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( h5 );
			}
		}
	};
}

function ListGroupItemHeading ( options ) {
	options = options || {};
	this._state = Object.assign( template$36.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$37( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

ListGroupItemHeading.prototype = Object.assign( {}, proto );

ListGroupItemHeading.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroupItemHeading.prototype.teardown = ListGroupItemHeading.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$38 ( root, component ) {
	var p = createElement( 'p' );
	p.className = "list-group-item-text " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, p );

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			component._yield && component._yield.mount( p, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			p.className = "list-group-item-text " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( p );
			}
		}
	};
}

function ListGroupItemText ( options ) {
	options = options || {};
	this._state = Object.assign( template$37.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$38( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

ListGroupItemText.prototype = Object.assign( {}, proto );

ListGroupItemText.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ListGroupItemText.prototype.teardown = ListGroupItemText.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$39 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "media " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "media " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Media ( options ) {
	options = options || {};
	this._state = Object.assign( template$38.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$39( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Media.prototype = Object.assign( {}, proto );

Media.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Media.prototype.teardown = Media.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$40 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "media-body " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "media-body " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function MediaBody ( options ) {
	options = options || {};
	this._state = Object.assign( template$39.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$40( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

MediaBody.prototype = Object.assign( {}, proto );

MediaBody.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

MediaBody.prototype.teardown = MediaBody.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$41 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "modal-footer " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "modal-footer " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function ModalFooter ( options ) {
	options = options || {};
	this._state = Object.assign( template$40.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$41( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

ModalFooter.prototype = Object.assign( {}, proto );

ModalFooter.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ModalFooter.prototype.teardown = ModalFooter.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$42 ( root, component ) {
	var li = createElement( 'li' );
	li.className = "nav-item " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, li );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			li.className = "nav-item " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( li );
			}
		}
	};
}

function NavDropdown ( options ) {
	options = options || {};
	this._state = Object.assign( template$41.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$42( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

NavDropdown.prototype = Object.assign( {}, proto );

NavDropdown.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavDropdown.prototype.teardown = NavDropdown.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$43 ( root, component ) {
	var ul = createElement( 'ul' );
	ul.className = "" + ( root.navbar ? 'navbar-nav' : 'nav' ) + ( root.tabs ? ' nav-tabs' : '' ) + ( root.pills ? ' nav-pills' : '' ) + ( root.fill ? ' nav-fill' : root.justified ? ' nav-justified' : '' ) + ( root.vertical ? ' flex-column' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, ul );

	return {
		mount: function ( target, anchor ) {
			insertNode( ul, target, anchor );
			component._yield && component._yield.mount( ul, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			ul.className = "" + ( root.navbar ? 'navbar-nav' : 'nav' ) + ( root.tabs ? ' nav-tabs' : '' ) + ( root.pills ? ' nav-pills' : '' ) + ( root.fill ? ' nav-fill' : root.justified ? ' nav-justified' : '' ) + ( root.vertical ? ' flex-column' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( ul );
			}
		}
	};
}

function Nav ( options ) {
	options = options || {};
	this._state = Object.assign( template$42.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$43( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Nav.prototype = Object.assign( {}, proto );

Nav.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Nav.prototype.teardown = Nav.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function renderMainFragment$44 ( root, component ) {
	var li = createElement( 'li' );
	li.className = "nav-item" + ( root.active ? ' active' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, li );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			li.className = "nav-item" + ( root.active ? ' active' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( li );
			}
		}
	};
}

function NavItem ( options ) {
	options = options || {};
	this._state = Object.assign( template$43.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$44( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

NavItem.prototype = Object.assign( {}, proto );

NavItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavItem.prototype.teardown = NavItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$44 = (function () {
  return {
    data() {
      return {
        class: ''
      }
    }
  }
}());

function renderMainFragment$45 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "navbar-brand " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			component._yield && component._yield.mount( a, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			a.className = "navbar-brand " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function NavbarBrand ( options ) {
	options = options || {};
	this._state = Object.assign( template$44.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$45( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

NavbarBrand.prototype = Object.assign( {}, proto );

NavbarBrand.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

NavbarBrand.prototype.teardown = NavbarBrand.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$45 = (function () {
  return {
    data() {
      return {
        class: '',
        size: null
      }
    }
  }
}());

function renderMainFragment$46 ( root, component ) {
	var ul = createElement( 'ul' );
	ul.className = "pagination" + ( root.size ? ` pagination-${root.size}` : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, ul );

	return {
		mount: function ( target, anchor ) {
			insertNode( ul, target, anchor );
			component._yield && component._yield.mount( ul, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			ul.className = "pagination" + ( root.size ? ` pagination-${root.size}` : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( ul );
			}
		}
	};
}

function Pagination ( options ) {
	options = options || {};
	this._state = Object.assign( template$45.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$46( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Pagination.prototype = Object.assign( {}, proto );

Pagination.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Pagination.prototype.teardown = Pagination.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$46 = (function () {
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

function renderMainFragment$47 ( root, component ) {
	var li = createElement( 'li' );
	li.className = "page-item" + ( root.active ? ' active' : '' ) + ( root.disabled ? ' disabled' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, li );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
			component._yield && component._yield.mount( li, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			li.className = "page-item" + ( root.active ? ' active' : '' ) + ( root.disabled ? ' disabled' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( li );
			}
		}
	};
}

function PaginationItem ( options ) {
	options = options || {};
	this._state = Object.assign( template$46.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$47( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

PaginationItem.prototype = Object.assign( {}, proto );

PaginationItem.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

PaginationItem.prototype.teardown = PaginationItem.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$47 = (function () {
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

function renderMainFragment$48 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "page-link" + ( root.size ? ` pagination-${root.size}` : '' ) + " " + ( root.class );
	
	var ifBlock_anchor = createComment();
	appendNode( ifBlock_anchor, a );
	
	function getBlock ( root ) {
		if ( root.previous ) return renderIfBlock_0$2;
		if ( root.next ) return renderIfBlock_1$1;
		return renderIfBlock_2;
	}
	
	var currentBlock = getBlock( root );
	var ifBlock = currentBlock && currentBlock( root, component );
	
	if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			a.className = "page-link" + ( root.size ? ` pagination-${root.size}` : '' ) + " " + ( root.class );
			
			var _currentBlock = currentBlock;
			currentBlock = getBlock( root );
			if ( _currentBlock === currentBlock && ifBlock) {
				ifBlock.update( changed, root );
			} else {
				if ( ifBlock ) ifBlock.teardown( true );
				ifBlock = currentBlock && currentBlock( root, component );
				if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
			}
		},
		
		teardown: function ( detach ) {
			if ( ifBlock ) ifBlock.teardown( false );
			
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderIfBlock_2 ( root, component ) {
	var yield_anchor = createComment();

	return {
		mount: function ( target, anchor ) {
			insertNode( yield_anchor, target, anchor );
			component._yield && component._yield.mount( target, yield_anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( yield_anchor );
			}
		}
	};
}

function renderIfBlock_1$1 ( root, component ) {
	var text = createText( "»" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderIfBlock_0$2 ( root, component ) {
	var text = createText( "«" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function PaginationLink ( options ) {
	options = options || {};
	this._state = Object.assign( template$47.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$48( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

PaginationLink.prototype = Object.assign( {}, proto );

PaginationLink.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

PaginationLink.prototype.teardown = PaginationLink.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
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

function applyComputations$1 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'value' in newState && typeof state.value === 'object' || state.value !== oldState.value ) || ( 'max' in newState && typeof state.max === 'object' || state.max !== oldState.max ) ) {
		state.percent = newState.percent = template$48.computed.percent( state.value, state.max );
	}
}

var template$48 = (function () {
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

function renderMainFragment$49 ( root, component ) {
	var ifBlock_anchor = createComment();
	
	function getBlock ( root ) {
		if ( !root.bar ) return renderIfBlock_0$3;
		return renderIfBlock_1$2;
	}
	
	var currentBlock = getBlock( root );
	var ifBlock = currentBlock && currentBlock( root, component );

	return {
		mount: function ( target, anchor ) {
			insertNode( ifBlock_anchor, target, anchor );
			if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			var _currentBlock = currentBlock;
			currentBlock = getBlock( root );
			if ( _currentBlock === currentBlock && ifBlock) {
				ifBlock.update( changed, root );
			} else {
				if ( ifBlock ) ifBlock.teardown( true );
				ifBlock = currentBlock && currentBlock( root, component );
				if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
			}
		},
		
		teardown: function ( detach ) {
			if ( ifBlock ) ifBlock.teardown( detach );
			
			if ( detach ) {
				detachNode( ifBlock_anchor );
			}
		}
	};
}

function renderIfBlock_1$2 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "progress-bar" + ( root.animated ? ' progress-bar-animated' : '' ) + ( root.color ? ` bg-${root.color}` : '' ) + ( root.striped || root.animated ? ' progress-bar-striped' : '' );
	div.style.cssText = "width:" + ( root.percent ) + "%";
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "progress-bar" + ( root.animated ? ' progress-bar-animated' : '' ) + ( root.color ? ` bg-${root.color}` : '' ) + ( root.striped || root.animated ? ' progress-bar-striped' : '' );
			div.style.cssText = "width:" + ( root.percent ) + "%";
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function renderIfBlock_0$3 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "progress " + ( root.class );
	
	var ifBlock1_anchor = createComment();
	appendNode( ifBlock1_anchor, div );
	
	function getBlock1 ( root ) {
		if ( root.multi ) return renderIfBlock1_0$1;
		return renderIfBlock1_1;
	}
	
	var currentBlock1 = getBlock1( root );
	var ifBlock1 = currentBlock1 && currentBlock1( root, component );
	
	if ( ifBlock1 ) ifBlock1.mount( ifBlock1_anchor.parentNode, ifBlock1_anchor );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "progress " + ( root.class );
			
			var _currentBlock1 = currentBlock1;
			currentBlock1 = getBlock1( root );
			if ( _currentBlock1 === currentBlock1 && ifBlock1) {
				ifBlock1.update( changed, root );
			} else {
				if ( ifBlock1 ) ifBlock1.teardown( true );
				ifBlock1 = currentBlock1 && currentBlock1( root, component );
				if ( ifBlock1 ) ifBlock1.mount( ifBlock1_anchor.parentNode, ifBlock1_anchor );
			}
		},
		
		teardown: function ( detach ) {
			if ( ifBlock1 ) ifBlock1.teardown( false );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function renderIfBlock1_1 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "progress-bar" + ( root.animated ? ' progress-bar-animated' : '' ) + ( root.color ? ` bg-${root.color}` : '' ) + ( root.striped || root.animated ? ' progress-bar-striped' : '' );
	div.style.cssText = "width:" + ( root.percent ) + "%";
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "progress-bar" + ( root.animated ? ' progress-bar-animated' : '' ) + ( root.color ? ` bg-${root.color}` : '' ) + ( root.striped || root.animated ? ' progress-bar-striped' : '' );
			div.style.cssText = "width:" + ( root.percent ) + "%";
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function renderIfBlock1_0$1 ( root, component ) {
	var yield_anchor = createComment();

	return {
		mount: function ( target, anchor ) {
			insertNode( yield_anchor, target, anchor );
			component._yield && component._yield.mount( target, yield_anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( yield_anchor );
			}
		}
	};
}

function Progress ( options ) {
	options = options || {};
	this._state = Object.assign( template$48.data(), options.data );
	applyComputations$1( this._state, this._state, {}, true );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$49( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Progress.prototype = Object.assign( {}, proto );

Progress.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	applyComputations$1( this._state, newState, oldState, false );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Progress.prototype.teardown = Progress.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$49 = (function () {
  return {
    data() {
      return {
        class: '',
        noGutters: false
      }
    }
  };
}());

function renderMainFragment$50 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "row" + ( root.noGutters ? ' no-gutters' : '' ) + " " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( div, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			div.className = "row" + ( root.noGutters ? ' no-gutters' : '' ) + " " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Row ( options ) {
	options = options || {};
	this._state = Object.assign( template$49.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$50( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Row.prototype = Object.assign( {}, proto );

Row.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Row.prototype.teardown = Row.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$50 = (function () {
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

function renderMainFragment$51 ( root, component ) {
	var ifBlock_anchor = createComment();
	
	function getBlock ( root ) {
		if ( root.responsive ) return renderIfBlock_0$4;
		return renderIfBlock_1$3;
	}
	
	var currentBlock = getBlock( root );
	var ifBlock = currentBlock && currentBlock( root, component );

	return {
		mount: function ( target, anchor ) {
			insertNode( ifBlock_anchor, target, anchor );
			if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			var _currentBlock = currentBlock;
			currentBlock = getBlock( root );
			if ( _currentBlock === currentBlock && ifBlock) {
				ifBlock.update( changed, root );
			} else {
				if ( ifBlock ) ifBlock.teardown( true );
				ifBlock = currentBlock && currentBlock( root, component );
				if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
			}
		},
		
		teardown: function ( detach ) {
			if ( ifBlock ) ifBlock.teardown( detach );
			
			if ( detach ) {
				detachNode( ifBlock_anchor );
			}
		}
	};
}

function renderIfBlock_1$3 ( root, component ) {
	var table = createElement( 'table' );
	table.className = "table" + ( root.size ? ` table-${root.size}` : '' ) + ( root.bordered ? ' table-bordered' : '' ) + ( root.striped ? ' table-striped' : '' ) + ( root.inverse ? ' table-inverse' : '' ) + ( root.hover ? ' table-hover' : '' ) + ( root.reflow ? ' table-reflow' :'' ) + "\n   " + ( root.class );
	
	var yield_anchor = createComment();
	appendNode( yield_anchor, table );

	return {
		mount: function ( target, anchor ) {
			insertNode( table, target, anchor );
			component._yield && component._yield.mount( table, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			table.className = "table" + ( root.size ? ` table-${root.size}` : '' ) + ( root.bordered ? ' table-bordered' : '' ) + ( root.striped ? ' table-striped' : '' ) + ( root.inverse ? ' table-inverse' : '' ) + ( root.hover ? ' table-hover' : '' ) + ( root.reflow ? ' table-reflow' :'' ) + "\n   " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( table );
			}
		}
	};
}

function renderIfBlock_0$4 ( root, component ) {
	var div = createElement( 'div' );
	div.className = "table-responsive";
	
	var table = createElement( 'table' );
	table.className = "table" + ( root.size ? ` table-${root.size}` : '' ) + ( root.bordered ? ' table-bordered' : '' ) + ( root.striped ? ' table-striped' : '' ) + ( root.inverse ? ' table-inverse' : '' ) + ( root.hover ? ' table-hover' : '' ) + ( root.reflow ? ' table-reflow' :'' ) + "\n   " + ( root.class );
	
	appendNode( table, div );
	var yield_anchor = createComment();
	appendNode( yield_anchor, table );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			component._yield && component._yield.mount( table, yield_anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			table.className = "table" + ( root.size ? ` table-${root.size}` : '' ) + ( root.bordered ? ' table-bordered' : '' ) + ( root.striped ? ' table-striped' : '' ) + ( root.inverse ? ' table-inverse' : '' ) + ( root.hover ? ' table-hover' : '' ) + ( root.reflow ? ' table-reflow' :'' ) + "\n   " + ( root.class );
		},
		
		teardown: function ( detach ) {
			component._yield && component._yield.teardown( detach );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Table ( options ) {
	options = options || {};
	this._state = Object.assign( template$50.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = renderMainFragment$51( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Table.prototype = Object.assign( {}, proto );

Table.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Table.prototype.teardown = Table.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template = (function () {
  
  return {
    components: {
      Alert,
      Badge,
      Breadcrumb,
      BreadcrumbItem,
      Button,
      ButtonGroup,
      ButtonToolbar,
      Card,
      CardBlock,
      CardHeader,
      CardFooter,
      CardSubtitle,
      CardTitle,
      Close,
      Col,
      Container,
      Dropdown,
      DropdownDivider,
      DropdownHeader,
      DropdownItem,
      DropdownMenu,
      Form,
      FormGroup,
      InputGroup,
      InputGroupAddon,
      Jumbotron,
      ListGroup,
      ListGroupItem,
      ListGroupItemHeading,
      ListGroupItemText,
      Media,
      MediaBody,
      Nav,
      NavDropdown,
      NavbarBrand,
      NavItem,
      Pagination,
      PaginationItem,
      Progress,
      Row,
      Table
    },
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

function renderMainFragment ( root, component ) {
	var nav = createElement( 'nav' );
	nav.className = "navbar sticky-top navbar-dark bg-faded navbar-toggleable-xl";
	
	var a = createElement( 'a' );
	a.className = "navbar-brand";
	a.href = "https://github.com/bestguy/sveltestrap";
	
	appendNode( a, nav );
	
	var img = createElement( 'img' );
	img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUMAAABACAYAAACA0BUdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAEO5JREFUeNrsXQmUFcUVrVkYBEV2EZcEUXHDCGhccEXUBFEUIuJyRDG4xDVBQ+KWuCWaHLecxMQ9aIyIirKpKEYIRlRUohIxGkRUQAVFZHEYGJjUtW9nKp/fW3X1X2bePeed6fndXd1VXXXrvVevqioaGhqUQCAQNHdUCBkKBAKBBRkO63ellFrh0EPLYC3vaXlCikMgiMa46ddb3VcpRVfS6K/lRi1XSFEIBNlCyLC00YJ/q6UoBAIhw+aM9fy7VopCIBAyFAgEgswh5pdAEB87s800GMrEci2fStEIGQoEzQWjtNyc5/fVWnppeV+KSMxkQWmijZb7tNyvpZMUR2r0DPh9Cy3bSvEIGQpKF1tqGaFluJChE3wVck4GuIQMBSWMetXo21onxSEQCBkKBAKBkKHgG8gEdClfgZBhs8VnxrGEfqTHyphlLShTuAyt2VHLVlo6sqeM01tiutkHWt4KOL+Nln2UF8v1D8d5H6ilSsuzKpkDfBctXZU3WrsxTz7RwWzQslTLx/ybNXbje/m+wa+17GGcv1jLy1pah3wHDBDMZJ6SAt99ey1dmP/cNCooq0jM7zrMO0ZyO/HZNQneH9cu0TI7zzkMPvVluaxjno4ISet8LU/nKV+/XFF36wPu3U5Lb6MuVbBevq02Ddf5FqU9r8d7YZbSrAiyzsUOWjqz3Cotv7mvSM2OUcd7sI6uN+5FXl9i2zbLa1d+05qcMsM9a1h/5htplRQZoqGdoOUgy/tBht0Dzh2o5REe7+qwEZ2q5UEed45BhvgwP9VyrJb9EjwHH2+Klru1/C1DMhzPyhaEG2Km0zWhFjlAy+ksl9YJ7nuZ73wrO46kqCIBHaW8xSw2S1F2XfI05l9ouSRBGqMpQTiB+c2HB7T0y/P7XC3fMe4fzvLO12Z/pSVqOSkQ/IV8Vn+Hde8pKhZBgNLwvMoffjRWyyn8fijzIezUo4BVnGZouUfLq6VAhtDasKzUvsZvS0gAcVm7hj1qEJ5jepuzoG5wlO9h/Ise+/OIa6GZPqS82Qc+FlBj2MCePNd/hHx1oJY8jHJLwgaWBFMNLcbXxNpQ6/C/y4qI77BIhYeP5OI2doQ+UI5fBnz7BhJYS2ol+1NGkExfS/BcdEaIn9zdUdm1CNA2XaJjBBnnQy3/oiMdmSJ94CQtN6ls4iF3ijjfiVyRD+uojMyKkU6upgk5W8uvlaNVndKQ4SQte/N4HFl6umVPHwQ0ronsPQY6IsM21CiARyOu7UPTsRUb9NXsAObGeA6CcQ/Xcp6W7ylvBgNMnKEZVMhRlNxG9gmJsR97U1d42OhQoPneyd7/6xj39qKmcwUJ7QWapP+Mce+eWl4ksbpAXYCJ+LXj7xNmeQQ9aynr+8gY6a+LqBs3Z2iVrIk4X89rtgjQVscmJMJcXK6lG629VLAdQDnJIMIb+f9zjonQx0RDI+jmIL0B1FDMtINMsQkkws/p17k2JhECq9lhfJ+9l2/unKUKg1rjeKXDdM81iPA3NJGnJCCQN2jS9SZZb0ZyjUNwYxwSoV//Kx22C5ftDD7Kn8e8Nsg/3y9jIkyLwY5M9lPoxir4R4KmcRqP4Qe7LOMCe5bEUs2GlxZ+GnDefhhyHUhrex6D0N5M8UxoQY/z+Dqa/VmjlXHc2lGamxva+aMJGmsQKQ4xzJ4REdcfSU3dJVqo/AMbbRw/x8YCS+IHbR/w+x2q+eAaLW0L/ZF2pLkC3FWATMLXNY29yCAtv0+RVo1BhhMirv2R4QJ43UE+4GA/juYryHV8GVY4fIN21ERGOUgPAymPUWMeQVdLEIbEqCfoOGexw66OUfcx2r8sz7nfKW+Us5ImbmvWm6BpjfA9z8lDYLBAEHbzpIOyQsTFv2mlVBuKyWY0NXMxkJ1MGOA6eZsaenWA4lNL985xalP/uEvUs529w2dWGb93Ief0iOj8UYduKyQZdjIqxfoCNcIJbIgHa9la2cfNHWH0HpNCroPD1x/Ju9dRHhAmMZOmy+FlSoaHGRbBIkdpjiEZ7qU8B//igOvCtMIZtFZcvdMLFBMYAPtJSMf5r4zK/H2mPy3hfUMjzGqMLN8eM62WdLXUZJRHtAWMJs+LuO48KkNBFu0AdmRWQfA2ZnKNahyBqylQI5zKHroltaq0JrLfywahu9ErzXGYj1mGWViO8EenpztMEyRSRxO8W0SDzAcMgJztkAiDsCHC3M4CS6kATLO4d++QcxcnIEJFayArPMvOcF6Ma/+o5YKQ87vRcrWCDRliZMh3lhdqtY6l7P0VTWXbvA7m8eMR13bg31rldmRxCf9uWaZk2M6oA66AiIEvIsqlOoQMlYoOj3KB6iKQ4U00YZOijQoOZ1mskruaqjLKHzqYpAMff9KyMOBcV5UifMiGDD81zNQOBWyIvo+vv2VPdZBqjOmK8hfWGz4Tl7N0WhrpliPqU7hXwoikMqI+otGsC6nD+6mmh40x6mkQWoV8o1dLKI/zVPDsszDMDemwrBUNGzJEz/ISjy8oYME9zUaxpbIbjvc1SsxiebPIlUAm9icrF/y+LOS+20M0oXIFfIUfpiDSoCl2pbT24sKUnbIrTkt1oz/q14d2fCHwkfICboHjLO73RyNlM/byxPMh57pT4xnUhPK7QmWzDmUpbfVhG5dclYWiYUuGCCX4A48x0oXJ2kcV0FTGjI4ksXpwJu8Q00QWlCYejDgPzXAiv++hTSC/zWF/oqpSepk0kfYYmr+Ox9/V8ozyRksRhN0zo/edwr9YJeWQBPcda6jlrwivlCU+UvEC/GE1zFBeuMaBUmyCQpAhgNgg+O+m8v8DlDf1DA5OxKJhXuW3Hb7vf1TjpP4kprJ/7aSEz4PfZbXD969tIvXGpd9pTQJzCVM/404vG0ILZhw7a4EgUzIE4MsZQFMUU2L82RoILMaKG4gj82cZtHXwPN/nh2fGCWlATF8vSxMZpkpHh+XdoYnUm3aOyyTJ1LNLlRf8HHe+9YnKc+M8YNQDgSBTv8QcytXKCxQ9noSFQMgfUDD9CUGWiPN7yvI5k5W3fhumCO2nohd99U1khAPNTPgsTMOCYx5Ts9IGmNepxmDrmjKvN6OpeaEzqkhZJh2NDiduvN5t7Nh+qeWMmPecRhlLDfMtaf6CrMjQhD+daTQ1REwNOoom8w8pIM4rDBM7LuZS2+xJwo0iQ38UeaKyG73qptyslmOi3HerQ3hTnwzSTRLMvVB5c1Ex/QohXsNjkunJyltlCSvuXCYUIMiaDH2AfKZREBV/GCvjyWxMiB08nSZMEownGQ6k2RQErDrT1yBDG9IaqtwugQUsLvN6g9CqvzpOE/5Zm8EtrH4D3zRma5xPTXGLiHugzWLFnV1U9AIQAiFD51hFExeCsJwxyls9+n5qdwsSpDWFJhK2AsC6eEELgx7DvzBzbebTwoybJNVkEyDofkaJvRPmmiPCAQsqnEvrI8rfi+mZGJC5RD6poFi74yEEB+vT+UvRn5vwfowoz+fxoBgmMvyTNiOg/vL5gv9H+xJ+N+yp8zPlrTqExXiXRFw/KgM3iEDIMBEw1chfe8wmSNZfbCEoxAZaweE8lkDr5ocltB5Aig9FXHuGFJeg2Psm+yPK2Atj+4T3TuZfmMn5lsQayPwhTnCqfOpmC6yIg/0xpoRcc0jKZ9Q38TLMtyWuC5RUuRWbDBfQVIbDO+lE+xcNEyifduj/BiJc08wJYaMSwBwOiibAVM00y3C1KqNysFmQ2d/d0DVst3gNI1Hr9yw2GaJy+r68GosP5Adg5+6NAj/f0Ty2GQCpaCIE4PfmrgbKyrlcMHtpWQiZRTWiMLLsVIIWX1DbtvH3dlPZDLbuYnlfq5D6XleuZGhWQJtZDT7RYa3C7Yzfj2Svsz7CPMqqJy0FVBnk1dZx2uVaJmGaRpQZGDaVsm+J5WelCh4wxJTZpBuEjcjoPbHaUNKV69Gug6ZXrlPh+4OXvGaYZntRhMssZ6M3tUN/hBmzXb60SPcz/kWl6VimDbzWMCc6O0rTX5F6qzIsj54hGlyLGGQYtq/zRapxz5xSAIjwg4Bz6BhvSZAWBiHPyfBdb02oWf825PqFyn6NxKKToany2qi30FAm5hAgcDz/2o4iLyCRoHzKdeUTdALvGhXaBfwGdnSZlQU0t4dDTL1FMbTdlyK0FfiwEfS9dYnkOWzqKcgN6wb0DrkGMbxXKW/BlSyB52Du+KkRpIh3xdqpF4Zcg53+lti+SLHXTENBdKB2ON8yjQlU4/vx/z7s/TBoMNkyTWibf1feijyo4I+UKSFOpUZ0hpbLVfrRu8nUglAx91GNKwgVAv1VYwhMnAGh9dT4eqroqYOvxNAM0RHMUI07BOYCg4CYTGDGNvpuitkkoEK6FzBDKGx/kZGUeSxP/10beNxDZbe3Sy4wgIX1KuHTXZpzzh+82S1GOmPTvESxyXA0/85XyWagmMBUv9WsjFi4YX/+PsMwd23VdzRAhF2cnLagiwQ0zktpJt/twPfzHLVNOL7vVOE7sLnG5Q413Fz8JeZ1V6roufAd1KarE6HTv8TSZWMLbG2B/ZoHRly3ewnV184pXDrgj8fSPLxYZjJ6Hqx76O9Wd0+KtGoNDRCLzQ5PaSL7eFI1Tjl7yEi3nPAhTR1FrWqMSr/81gWGBo5y71KgvKzOKN0nIkxgEzCF77J4xieqOOFN5yl3sXx1GbzfSsd5TQVbzRB+vjYJChqqbmuqunsob97onoYv5uaU+ZhA7e1I47eJDgr4RGoCMBkwhxprMo6nebiInUmScJNKNooVBWwc1ysvNAJljkUxjqbG+Aq1h7V8L9SFr2JUemiHmNmBtSuPoaYIh/zLyhtkWG/RyVaT7MK2Zd2QQdnAx3RmwnvO4fue6egdsgxX+ojaNGZrpQn/uYrKwM6O3/8RfvOLUuYT+0A/UywyvJdaXZIK2jLP8x5lpUob3f40idlP/3VWhLRYRg1oDInwWNU4ar3KotFXMq9Y53FmzDIDNk+Zj5EkqqtphlzD39eR/Crpl7lPeT7SKFzL8sUyWFsZ6a21JMMqNthTQ65xPR8aHcKPLUkWHctsdgpdY1zfPqRM2macXyylt6+WO5TdPkUjWP+vCzifZg9wxBafpbzZZ4Mt7od7bZSyHxtwQoYIN7GJHgeBYB3D95S3HLurkapVOabsvQ4bDWavDKXWiXXwepEg0yzgEJcsfNNwuYN8YDvNsdRs4Fc9mA2uJue7xsUYauTYEKwv02ur7GcVRMW+wUQ9zDJtaOEYAHmDmiyc9e+kLE/4TB9mJ4m59Xspz/9WHaCBBsX9wfLYKc/vcxzWYeQdm6jB/z2MFlrvEJfJa7TY/sxOtIJll2+l8DRxvL62igVVjmdZom7uGPId3+E7Pc8278x8r2hoSKaUDesHH/I3DuIkvqcGCsywrJzIlapx9ZEFKltsp+xXq8YHXazijSyCWLZhuX3hOA9t85DfihTE206l29ZguYoOmO1uUdaVtBo+y8jvFadefBriAjDrba6Jm+Xc3U45Wp0/iowyWxhgpWyb5/eotgatDyPW+daYhEY3KOZzFMvj4yhLctz06wuqGS53pK24xMYCkKCPRQV6ztoM8/QVxRVWqBTR/zGxQJU2FpV4vTXxOSUu6gr0nnXF+s6VSiAQCARChgKBQCBkKBAIBEKGAoFAIGQoEAgEQoYCgaBgQMRKUOxpi1J6USFDgUCQJVap4BC+mlJ60Wr5VgKBIEMglhFT+Q7Ic+6eUnrRxDNQBAKBoClCyFAgEAiEDAUCgUDIUCAQCP6H/wowAFFJXHAnIN6pAAAAAElFTkSuQmCC";
	img.height = "32";
	
	appendNode( img, a );
	appendNode( createText( "\n  " ), nav );
	
	var ul = createElement( 'ul' );
	ul.className = "navbar-nav ml-auto";
	
	appendNode( ul, nav );
	var eachBlock_anchor = createComment();
	appendNode( eachBlock_anchor, ul );
	var eachBlock_value = root.themes;
	var eachBlock_iterations = [];
	
	for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
		eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
		eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
	}
	
	var text1 = createText( "\n\n" );
	var container_yieldFragment = rendercontainerYieldFragment( root, component );
	
	var container = new template.components.Container({
		target: null,
		_root: component._root || component,
		_yield: container_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( nav, target, anchor );
			insertNode( text1, target, anchor );
			container._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			var eachBlock_value = root.themes;
			
			for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
				if ( !eachBlock_iterations[i] ) {
					eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
					eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
				} else {
					eachBlock_iterations[i].update( changed, root, eachBlock_value, eachBlock_value[i], i );
				}
			}
			
			teardownEach( eachBlock_iterations, true, eachBlock_value.length );
			
			eachBlock_iterations.length = eachBlock_value.length;
			
			container_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			teardownEach( eachBlock_iterations, false );
			
			container.destroy( detach );
			
			if ( detach ) {
				detachNode( nav );
				detachNode( text1 );
			}
		}
	};
}

function rendercontainerYieldFragment ( root, component ) {
	var div = createElement( 'div' );
	div.className = "mt-3";
	
	var row_yieldFragment = renderrowYieldFragment( root, component );
	
	var row = new template.components.Row({
		target: div,
		_root: component._root || component,
		_yield: row_yieldFragment
	});
	
	var text = createText( "\n\n  " );
	var text1 = createText( "\n  " );
	
	var div1 = createElement( 'div' );
	div1.className = "mt-3";
	
	var row1_yieldFragment = renderrow1YieldFragment( root, component );
	
	var row1 = new template.components.Row({
		target: div1,
		_root: component._root || component,
		_yield: row1_yieldFragment
	});
	
	var text2 = createText( "\n\n\n  " );
	var text3 = createText( "\n  " );
	
	var div2 = createElement( 'div' );
	div2.className = "mt-3";
	
	var h1 = createElement( 'h1' );
	h1.id = "buttons";
	h1.className = "text-muted my-4";
	
	appendNode( h1, div2 );
	appendNode( createText( "Buttons" ), h1 );
	appendNode( createText( "\n\n    " ), div2 );
	var row2_yieldFragment = renderrow2YieldFragment( root, component );
	
	var row2 = new template.components.Row({
		target: div2,
		_root: component._root || component,
		_yield: row2_yieldFragment
	});
	
	appendNode( createText( "\n    \n    " ), div2 );
	var row3_yieldFragment = renderrow3YieldFragment( root, component );
	
	var row3 = new template.components.Row({
		target: div2,
		_root: component._root || component,
		_yield: row3_yieldFragment
	});
	
	var text7 = createText( "\n\n  " );
	var text8 = createText( "\n  " );
	
	var div3 = createElement( 'div' );
	div3.className = "mt-3";
	
	var h11 = createElement( 'h1' );
	h11.id = "typography";
	h11.className = "text-muted my-4";
	
	appendNode( h11, div3 );
	appendNode( createText( "Typography" ), h11 );
	appendNode( createText( "\n\n    " ), div3 );
	appendNode( createText( "\n\n    " ), div3 );
	var row4_yieldFragment = renderrow4YieldFragment( root, component );
	
	var row4 = new template.components.Row({
		target: div3,
		_root: component._root || component,
		_yield: row4_yieldFragment
	});
	
	appendNode( createText( "\n\n    " ), div3 );
	appendNode( createText( "\n\n    " ), div3 );
	
	var h2 = createElement( 'h2' );
	h2.id = "type-blockquotes";
	h2.className = "text-muted my-3";
	
	appendNode( h2, div3 );
	appendNode( createText( "Blockquotes" ), h2 );
	appendNode( createText( "\n\n    " ), div3 );
	var row5_yieldFragment = renderrow5YieldFragment( root, component );
	
	var row5 = new template.components.Row({
		target: div3,
		_root: component._root || component,
		_yield: row5_yieldFragment
	});
	
	var text16 = createText( "\n\n  " );
	var text17 = createText( "\n  " );
	
	var div4 = createElement( 'div' );
	div4.className = "mt-3";
	
	var h12 = createElement( 'h1' );
	h12.id = "tables";
	h12.className = "text-muted my-4";
	
	appendNode( h12, div4 );
	appendNode( createText( "Tables" ), h12 );
	appendNode( createText( "\n    " ), div4 );
	var row6_yieldFragment = renderrow6YieldFragment( root, component );
	
	var row6 = new template.components.Row({
		target: div4,
		_root: component._root || component,
		_yield: row6_yieldFragment
	});
	
	var text20 = createText( "\n\n  " );
	var text21 = createText( "\n  " );
	
	var div5 = createElement( 'div' );
	div5.className = "mt-3";
	
	var h13 = createElement( 'h1' );
	h13.id = "forms";
	h13.className = "text-muted my-4";
	
	appendNode( h13, div5 );
	appendNode( createText( "Forms" ), h13 );
	appendNode( createText( "\n\n    " ), div5 );
	var row7_yieldFragment = renderrow7YieldFragment( root, component );
	
	var row7 = new template.components.Row({
		target: div5,
		_root: component._root || component,
		_yield: row7_yieldFragment
	});
	
	var text24 = createText( "\n\n  " );
	var text25 = createText( "\n  " );
	
	var div6 = createElement( 'div' );
	div6.className = "mt-3";
	
	var h14 = createElement( 'h1' );
	h14.id = "navs";
	h14.className = "text-muted my-4";
	
	appendNode( h14, div6 );
	appendNode( createText( "Navs" ), h14 );
	appendNode( createText( "\n\n    " ), div6 );
	var row8_yieldFragment = renderrow8YieldFragment( root, component );
	
	var row8_initialData = {
		class: "mb-2"
	};
	var row8 = new template.components.Row({
		target: div6,
		_root: component._root || component,
		_yield: row8_yieldFragment,
		data: row8_initialData
	});
	
	appendNode( createText( "\n\n    " ), div6 );
	
	var h21 = createElement( 'h2' );
	h21.id = "nav-fill";
	h21.className = "text-muted my-4";
	
	appendNode( h21, div6 );
	appendNode( createText( "Fill" ), h21 );
	appendNode( createText( "\n    " ), div6 );
	var nav_yieldFragment = rendernavYieldFragment2( root, component );
	
	var nav_initialData = {
		pills: true,
		fill: true,
		class: "mb-2"
	};
	var nav = new template.components.Nav({
		target: div6,
		_root: component._root || component,
		_yield: nav_yieldFragment,
		data: nav_initialData
	});
	
	appendNode( createText( "\n\n    " ), div6 );
	
	var h22 = createElement( 'h2' );
	h22.id = "nav-fill";
	h22.className = "text-muted my-4";
	
	appendNode( h22, div6 );
	appendNode( createText( "Justified" ), h22 );
	appendNode( createText( "\n    " ), div6 );
	var nav1_yieldFragment = rendernav1YieldFragment1( root, component );
	
	var nav1_initialData = {
		pills: true,
		justified: true
	};
	var nav1 = new template.components.Nav({
		target: div6,
		_root: component._root || component,
		_yield: nav1_yieldFragment,
		data: nav1_initialData
	});
	
	appendNode( createText( "\n\n    " ), div6 );
	var row9_yieldFragment = renderrow9YieldFragment( root, component );
	
	var row9 = new template.components.Row({
		target: div6,
		_root: component._root || component,
		_yield: row9_yieldFragment
	});
	
	var text35 = createText( "\n\n  " );
	var text36 = createText( "\n  " );
	
	var div7 = createElement( 'div' );
	div7.className = "mt-3";
	
	var h15 = createElement( 'h1' );
	h15.id = "indicators";
	h15.className = "text-muted my-4";
	
	appendNode( h15, div7 );
	appendNode( createText( "Indicators" ), h15 );
	appendNode( createText( "\n\n    " ), div7 );
	
	var h23 = createElement( 'h2' );
	h23.className = "text-muted my-4";
	
	appendNode( h23, div7 );
	appendNode( createText( "Alerts" ), h23 );
	appendNode( createText( "\n    " ), div7 );
	var alert_yieldFragment = renderalertYieldFragment( root, component );
	
	var alert = new template.components.Alert({
		target: div7,
		_root: component._root || component,
		_yield: alert_yieldFragment
	});
	
	appendNode( createText( "\n\n    " ), div7 );
	var row10_yieldFragment = renderrow10YieldFragment( root, component );
	
	var row10 = new template.components.Row({
		target: div7,
		_root: component._root || component,
		_yield: row10_yieldFragment
	});
	
	appendNode( createText( "\n\n    " ), div7 );
	
	var div8 = createElement( 'div' );
	
	appendNode( div8, div7 );
	
	var h24 = createElement( 'h2' );
	h24.className = "text-muted my-4";
	
	appendNode( h24, div8 );
	appendNode( createText( "Badges" ), h24 );
	appendNode( createText( "\n      " ), div8 );
	
	var div9 = createElement( 'div' );
	div9.className = "mb-4";
	
	appendNode( div9, div8 );
	var badge_yieldFragment = renderbadgeYieldFragment( root, component );
	
	var badge = new template.components.Badge({
		target: div9,
		_root: component._root || component,
		_yield: badge_yieldFragment
	});
	
	appendNode( createText( "\n        " ), div9 );
	var badge1_yieldFragment = renderbadge1YieldFragment( root, component );
	
	var badge1_initialData = {
		color: "primary"
	};
	var badge1 = new template.components.Badge({
		target: div9,
		_root: component._root || component,
		_yield: badge1_yieldFragment,
		data: badge1_initialData
	});
	
	appendNode( createText( "\n        " ), div9 );
	var badge2_yieldFragment = renderbadge2YieldFragment( root, component );
	
	var badge2_initialData = {
		color: "success"
	};
	var badge2 = new template.components.Badge({
		target: div9,
		_root: component._root || component,
		_yield: badge2_yieldFragment,
		data: badge2_initialData
	});
	
	appendNode( createText( "\n        " ), div9 );
	var badge3_yieldFragment = renderbadge3YieldFragment( root, component );
	
	var badge3_initialData = {
		color: "warning"
	};
	var badge3 = new template.components.Badge({
		target: div9,
		_root: component._root || component,
		_yield: badge3_yieldFragment,
		data: badge3_initialData
	});
	
	appendNode( createText( "\n        " ), div9 );
	var badge4_yieldFragment = renderbadge4YieldFragment( root, component );
	
	var badge4_initialData = {
		color: "danger"
	};
	var badge4 = new template.components.Badge({
		target: div9,
		_root: component._root || component,
		_yield: badge4_yieldFragment,
		data: badge4_initialData
	});
	
	appendNode( createText( "\n        " ), div9 );
	var badge5_yieldFragment = renderbadge5YieldFragment( root, component );
	
	var badge5_initialData = {
		color: "info"
	};
	var badge5 = new template.components.Badge({
		target: div9,
		_root: component._root || component,
		_yield: badge5_yieldFragment,
		data: badge5_initialData
	});
	
	appendNode( createText( "\n      " ), div8 );
	
	var div10 = createElement( 'div' );
	
	appendNode( div10, div8 );
	var badge6_yieldFragment = renderbadge6YieldFragment( root, component );
	
	var badge6_initialData = {
		pill: true
	};
	var badge6 = new template.components.Badge({
		target: div10,
		_root: component._root || component,
		_yield: badge6_yieldFragment,
		data: badge6_initialData
	});
	
	appendNode( createText( "\n        " ), div10 );
	var badge7_yieldFragment = renderbadge7YieldFragment( root, component );
	
	var badge7_initialData = {
		pill: true,
		color: "primary"
	};
	var badge7 = new template.components.Badge({
		target: div10,
		_root: component._root || component,
		_yield: badge7_yieldFragment,
		data: badge7_initialData
	});
	
	appendNode( createText( "\n        " ), div10 );
	var badge8_yieldFragment = renderbadge8YieldFragment( root, component );
	
	var badge8_initialData = {
		pill: true,
		color: "success"
	};
	var badge8 = new template.components.Badge({
		target: div10,
		_root: component._root || component,
		_yield: badge8_yieldFragment,
		data: badge8_initialData
	});
	
	appendNode( createText( "\n        " ), div10 );
	var badge9_yieldFragment = renderbadge9YieldFragment( root, component );
	
	var badge9_initialData = {
		pill: true,
		color: "warning"
	};
	var badge9 = new template.components.Badge({
		target: div10,
		_root: component._root || component,
		_yield: badge9_yieldFragment,
		data: badge9_initialData
	});
	
	appendNode( createText( "\n        " ), div10 );
	var badge10_yieldFragment = renderbadge10YieldFragment( root, component );
	
	var badge10_initialData = {
		pill: true,
		color: "danger"
	};
	var badge10 = new template.components.Badge({
		target: div10,
		_root: component._root || component,
		_yield: badge10_yieldFragment,
		data: badge10_initialData
	});
	
	appendNode( createText( "\n        " ), div10 );
	var badge11_yieldFragment = renderbadge11YieldFragment( root, component );
	
	var badge11_initialData = {
		pill: true,
		color: "info"
	};
	var badge11 = new template.components.Badge({
		target: div10,
		_root: component._root || component,
		_yield: badge11_yieldFragment,
		data: badge11_initialData
	});
	
	var text56 = createText( "\n\n  " );
	var text57 = createText( "\n  " );
	
	var div11 = createElement( 'div' );
	div11.className = "mt-3";
	
	var row11_yieldFragment = renderrow11YieldFragment( root, component );
	
	var row11 = new template.components.Row({
		target: div11,
		_root: component._root || component,
		_yield: row11_yieldFragment
	});
	
	var text58 = createText( "\n\n  " );
	var text59 = createText( "\n  " );
	
	var div12 = createElement( 'div' );
	div12.className = "mt-3";
	
	var row12_yieldFragment = renderrow12YieldFragment( root, component );
	
	var row12 = new template.components.Row({
		target: div12,
		_root: component._root || component,
		_yield: row12_yieldFragment
	});
	
	appendNode( createText( "\n\n\n    " ), div12 );
	
	var h25 = createElement( 'h2' );
	
	appendNode( h25, div12 );
	appendNode( createText( "List groups" ), h25 );
	appendNode( createText( "\n    " ), div12 );
	var row13_yieldFragment = renderrow13YieldFragment( root, component );
	
	var row13 = new template.components.Row({
		target: div12,
		_root: component._root || component,
		_yield: row13_yieldFragment
	});
	
	appendNode( createText( "\n\n    " ), div12 );
	
	var h26 = createElement( 'h2' );
	
	appendNode( h26, div12 );
	appendNode( createText( "Cards" ), h26 );
	appendNode( createText( "\n    " ), div12 );
	var row14_yieldFragment = renderrow14YieldFragment( root, component );
	
	var row14 = new template.components.Row({
		target: div12,
		_root: component._root || component,
		_yield: row14_yieldFragment
	});
	
	appendNode( createText( "\n\n    " ), div12 );
	
	var h27 = createElement( 'h2' );
	
	appendNode( h27, div12 );
	appendNode( createText( "Media" ), h27 );
	appendNode( createText( "\n    " ), div12 );
	var row15_yieldFragment = renderrow15YieldFragment( root, component );
	
	var row15 = new template.components.Row({
		target: div12,
		_root: component._root || component,
		_yield: row15_yieldFragment
	});
	
	var text69 = createText( "\n\n  " );
	var text70 = createText( "\n  " );
	
	var div13 = createElement( 'div' );
	div13.className = "mt-3";
	
	var h16 = createElement( 'h1' );
	h16.id = "dialogs";
	
	appendNode( h16, div13 );
	appendNode( createText( "Dialogs" ), h16 );
	appendNode( createText( "\n    " ), div13 );
	var row16_yieldFragment = renderrow16YieldFragment( root, component );
	
	var row16 = new template.components.Row({
		target: div13,
		_root: component._root || component,
		_yield: row16_yieldFragment
	});
	
	var text73 = createText( "\n\n  " );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			insertNode( text, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( div1, target, anchor );
			insertNode( text2, target, anchor );
			insertNode( text3, target, anchor );
			insertNode( div2, target, anchor );
			insertNode( text7, target, anchor );
			insertNode( text8, target, anchor );
			insertNode( div3, target, anchor );
			insertNode( text16, target, anchor );
			insertNode( text17, target, anchor );
			insertNode( div4, target, anchor );
			insertNode( text20, target, anchor );
			insertNode( text21, target, anchor );
			insertNode( div5, target, anchor );
			insertNode( text24, target, anchor );
			insertNode( text25, target, anchor );
			insertNode( div6, target, anchor );
			insertNode( text35, target, anchor );
			insertNode( text36, target, anchor );
			insertNode( div7, target, anchor );
			insertNode( text56, target, anchor );
			insertNode( text57, target, anchor );
			insertNode( div11, target, anchor );
			insertNode( text58, target, anchor );
			insertNode( text59, target, anchor );
			insertNode( div12, target, anchor );
			insertNode( text69, target, anchor );
			insertNode( text70, target, anchor );
			insertNode( div13, target, anchor );
			insertNode( text73, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			row_yieldFragment.update( changed, root );
			row1_yieldFragment.update( changed, root );
			row2_yieldFragment.update( changed, root );
			row3_yieldFragment.update( changed, root );
			row4_yieldFragment.update( changed, root );
			row5_yieldFragment.update( changed, root );
			row6_yieldFragment.update( changed, root );
			row7_yieldFragment.update( changed, root );
			row8_yieldFragment.update( changed, root );
			nav_yieldFragment.update( changed, root );
			nav1_yieldFragment.update( changed, root );
			row9_yieldFragment.update( changed, root );
			alert_yieldFragment.update( changed, root );
			row10_yieldFragment.update( changed, root );
			badge_yieldFragment.update( changed, root );
			badge1_yieldFragment.update( changed, root );
			badge2_yieldFragment.update( changed, root );
			badge3_yieldFragment.update( changed, root );
			badge4_yieldFragment.update( changed, root );
			badge5_yieldFragment.update( changed, root );
			badge6_yieldFragment.update( changed, root );
			badge7_yieldFragment.update( changed, root );
			badge8_yieldFragment.update( changed, root );
			badge9_yieldFragment.update( changed, root );
			badge10_yieldFragment.update( changed, root );
			badge11_yieldFragment.update( changed, root );
			row11_yieldFragment.update( changed, root );
			row12_yieldFragment.update( changed, root );
			row13_yieldFragment.update( changed, root );
			row14_yieldFragment.update( changed, root );
			row15_yieldFragment.update( changed, root );
			row16_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			row.destroy( false );
			row1.destroy( false );
			row2.destroy( false );
			row3.destroy( false );
			row4.destroy( false );
			row5.destroy( false );
			row6.destroy( false );
			row7.destroy( false );
			row8.destroy( false );
			nav.destroy( false );
			nav1.destroy( false );
			row9.destroy( false );
			alert.destroy( false );
			row10.destroy( false );
			badge.destroy( false );
			badge1.destroy( false );
			badge2.destroy( false );
			badge3.destroy( false );
			badge4.destroy( false );
			badge5.destroy( false );
			badge6.destroy( false );
			badge7.destroy( false );
			badge8.destroy( false );
			badge9.destroy( false );
			badge10.destroy( false );
			badge11.destroy( false );
			row11.destroy( false );
			row12.destroy( false );
			row13.destroy( false );
			row14.destroy( false );
			row15.destroy( false );
			row16.destroy( false );
			
			if ( detach ) {
				detachNode( div );
				detachNode( text );
				detachNode( text1 );
				detachNode( div1 );
				detachNode( text2 );
				detachNode( text3 );
				detachNode( div2 );
				detachNode( text7 );
				detachNode( text8 );
				detachNode( div3 );
				detachNode( text16 );
				detachNode( text17 );
				detachNode( div4 );
				detachNode( text20 );
				detachNode( text21 );
				detachNode( div5 );
				detachNode( text24 );
				detachNode( text25 );
				detachNode( div6 );
				detachNode( text35 );
				detachNode( text36 );
				detachNode( div7 );
				detachNode( text56 );
				detachNode( text57 );
				detachNode( div11 );
				detachNode( text58 );
				detachNode( text59 );
				detachNode( div12 );
				detachNode( text69 );
				detachNode( text70 );
				detachNode( div13 );
				detachNode( text73 );
			}
		}
	};
}

function renderrow16YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment13( root, component );
	
	var col_initialData = {
		lg: 6
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});
	
	var text = createText( "\n      " );
	var col1_yieldFragment = rendercol1YieldFragment7( root, component );
	
	var col1_initialData = {
		lg: 6
	};
	var col1 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col1_yieldFragment,
		data: col1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
			col1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
			col1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercol1YieldFragment7 ( root, component ) {
	var h2 = createElement( 'h2' );
	
	appendNode( createText( "Popovers" ), h2 );
	var text1 = createText( "\n        " );
	
	var div = createElement( 'div' );
	div.className = "mb-3";
	
	var button = createElement( 'button' );
	button.type = "button";
	button.className = "btn btn-secondary";
	button.title = '';
	setAttribute( button, 'data-container', "body" );
	setAttribute( button, 'data-toggle', "popover" );
	setAttribute( button, 'data-placement', "left" );
	setAttribute( button, 'data-content', "Vivamus sagittis lacus vel augue laoreet rutrum faucibus." );
	setAttribute( button, 'data-original-title', "Popover Title" );
	
	appendNode( button, div );
	appendNode( createText( "Left" ), button );
	appendNode( createText( "\n\n          " ), div );
	
	var button1 = createElement( 'button' );
	button1.type = "button";
	button1.className = "btn btn-secondary";
	button1.title = '';
	setAttribute( button1, 'data-container', "body" );
	setAttribute( button1, 'data-toggle', "popover" );
	setAttribute( button1, 'data-placement', "top" );
	setAttribute( button1, 'data-content', "Vivamus sagittis lacus vel augue laoreet rutrum faucibus." );
	setAttribute( button1, 'data-original-title', "Popover Title" );
	
	appendNode( button1, div );
	appendNode( createText( "Top" ), button1 );
	appendNode( createText( "\n\n          " ), div );
	
	var button2 = createElement( 'button' );
	button2.type = "button";
	button2.className = "btn btn-secondary";
	button2.title = '';
	setAttribute( button2, 'data-container', "body" );
	setAttribute( button2, 'data-toggle', "popover" );
	setAttribute( button2, 'data-placement', "bottom" );
	setAttribute( button2, 'data-content', "Vivamus\n              sagittis lacus vel augue laoreet rutrum faucibus." );
	setAttribute( button2, 'data-original-title', "Popover Title" );
	
	appendNode( button2, div );
	appendNode( createText( "Bottom" ), button2 );
	appendNode( createText( "\n\n          " ), div );
	
	var button3 = createElement( 'button' );
	button3.type = "button";
	button3.className = "btn btn-secondary";
	button3.title = '';
	setAttribute( button3, 'data-container', "body" );
	setAttribute( button3, 'data-toggle', "popover" );
	setAttribute( button3, 'data-placement', "right" );
	setAttribute( button3, 'data-content', "Vivamus sagittis lacus vel augue laoreet rutrum faucibus." );
	setAttribute( button3, 'data-original-title', "Popover Title" );
	
	appendNode( button3, div );
	appendNode( createText( "Right" ), button3 );
	var text9 = createText( "\n\n        " );
	
	var h21 = createElement( 'h2' );
	
	appendNode( createText( "Tooltips" ), h21 );
	var text11 = createText( "\n        " );
	
	var div1 = createElement( 'div' );
	
	var button4 = createElement( 'button' );
	button4.type = "button";
	button4.className = "btn btn-secondary";
	setAttribute( button4, 'data-toggle', "tooltip" );
	setAttribute( button4, 'data-placement', "left" );
	button4.title = '';
	setAttribute( button4, 'data-original-title', "Tooltip on left" );
	
	appendNode( button4, div1 );
	appendNode( createText( "Left" ), button4 );
	appendNode( createText( "\n\n          " ), div1 );
	
	var button5 = createElement( 'button' );
	button5.type = "button";
	button5.className = "btn btn-secondary";
	setAttribute( button5, 'data-toggle', "tooltip" );
	setAttribute( button5, 'data-placement', "top" );
	button5.title = '';
	setAttribute( button5, 'data-original-title', "Tooltip on top" );
	
	appendNode( button5, div1 );
	appendNode( createText( "Top" ), button5 );
	appendNode( createText( "\n\n          " ), div1 );
	
	var button6 = createElement( 'button' );
	button6.type = "button";
	button6.className = "btn btn-secondary";
	setAttribute( button6, 'data-toggle', "tooltip" );
	setAttribute( button6, 'data-placement', "bottom" );
	button6.title = '';
	setAttribute( button6, 'data-original-title', "Tooltip on bottom" );
	
	appendNode( button6, div1 );
	appendNode( createText( "Bottom" ), button6 );
	appendNode( createText( "\n\n          " ), div1 );
	
	var button7 = createElement( 'button' );
	button7.type = "button";
	button7.className = "btn btn-secondary";
	setAttribute( button7, 'data-toggle', "tooltip" );
	setAttribute( button7, 'data-placement', "right" );
	button7.title = '';
	setAttribute( button7, 'data-original-title', "Tooltip on right" );
	
	appendNode( button7, div1 );
	appendNode( createText( "Right" ), button7 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( div, target, anchor );
			insertNode( text9, target, anchor );
			insertNode( h21, target, anchor );
			insertNode( text11, target, anchor );
			insertNode( div1, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( h2 );
				detachNode( text1 );
				detachNode( div );
				detachNode( text9 );
				detachNode( h21 );
				detachNode( text11 );
				detachNode( div1 );
			}
		}
	};
}

function rendercolYieldFragment13 ( root, component ) {
	var h2 = createElement( 'h2' );
	
	appendNode( createText( "Modals" ), h2 );
	var text1 = createText( "\n          " );

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text1, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( h2 );
				detachNode( text1 );
			}
		}
	};
}

function renderrow15YieldFragment ( root, component ) {
	var media_yieldFragment = rendermediaYieldFragment( root, component );
	
	var media = new template.components.Media({
		target: null,
		_root: component._root || component,
		_yield: media_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			media._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			media_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			media.destroy( detach );
		}
	};
}

function rendermediaYieldFragment ( root, component ) {
	var img = createElement( 'img' );
	img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAC7CAMAAAAXMCHDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRFHR4kyZt0cKYY1LCM////np6gY1lX8s6l4buR9uXSsn1bvL2+9dKp+9uwtdKO/+u5+Pbw893G2NjZ7seYUnQij7tO8Ovm3uvL38OnzOCx5tG86vHeOEYmfnx7OTk6////hsn4jgAAACB0Uk5T/////////////////////////////////////////wBcXBvtAAAMAUlEQVR42tydi5qiOBBGg4SAAhJBaS8Nvv9bbhICciepiraz1T3fzrgIOf5VlVuB5Pk/MfLGc9Myj+MgCKqqYuJPEMRxnvN/CqSMg4rVNZmzmgmknH49CBcM8wRjnDj/XpA8YMTC6irm3wfCYxMlJsaC/JtAaFwRsLGg/BKQHEGhnSz4exBuFxfL8ZL/KQgPiDNj+Z+BlBVxanX8JyCuMVAocBD6BgyFkn8WJCBvM1CsAEHimrzTKvoZEMrIuy3+BEhAPmCMvxuEM/IZi98LEpOPGXsnSEU+aDaZ2A6krMlnLXgPSEw+buwdIAH5A6tL5yAV+RMzDBTydVkXmIdNQXhN/s4CdyD5X3IYkZB/gUOMIt2A/DmHAYkJSIlKOnXNfpn4rev6nd5F3tad16w6+FGYppn4kb9pcvW9A2PvISHvyVesitJMmGj9ywSLfC3x2K97km0Q+0+QeYlASMJZS0JJEx1c9yfEOUflCwrZ4GUT4mSZZ/8J5QgQ23HJIZUUm6Z08a2dtgSDWI53WSgwktDQBIq7sTBxyeHTrAhtjNuO4CoYiF3C+t3T0o4jLDi9OkpdxFmgV5RyS46wCDm17KZyAEhgyUFTW5CwSMXbrBJKTa1BcqscLxpUWnMo57IkqaxBbCSPOUgQLQmN8f0icdKDSD1AgmhJrLaL5mfxxIVjyfig9AQDOak3V9jehDhwLKaawkEcsjNRb6+RzkUcZKxStWQPBCn26u02k57aHMTmtIFqCE2gICm1dq7KGMTirDXHeVbrW1bOlRuCxLYZC+5ZnW9ZZS5mCGIzNmk4QJ3I0Ldw8U6wglS6FSHCmjNwVAomWEFyig2Rpk/E9u8EmXprig0RAVLqDwMzxyJIQVrPOmFA9tQ+A48lIchpYYyO9W6UQmmAkIQgp1MLIMnmzxyI1cRhJAnBTUPa5Dvs15MiiqJi9Xc2/9qtzVYbIJbztRZkoEe0abMgFDHrJThBGJ3rRpLC/wRItQoSAEEmrgUBsVscGkzfCWaC+8q+4LHvINhti3XiFRDLJbkOJC0SByCWC7RsBcTyVAFd7UeSqblUpL8WTHCbIZ0i8z17MTGnivTXHQmuSKNaU0TE/Dh7+XMeCFeELYLYfiRsA2RihVPX6vkWwW2zsbWslYST7mReEWA/MvAtgiv/qenqvMowRuAgbAGkgoIszKtklhr8JKvLD9R+65jPg9hv65X4edVrZpVbX/7VJw5AuP2Jcicge8BcdzTeIsjKsoBPYn2x4xt1k9MgAVyfzYIASsuqYYjIqgC1ExWKv8zCNK/LqE97R3BQf9hPwAQXIjr/6n49SWUf6DUm+ox0slMtXhEHHLyD+PVELtYo2rcgNRbxDAggRHTaajwrTSNPtE+b+IsfDVWRBxz65vkNa5HYTxBHPQkBz6l6k/Ym1NOiQzi0f/GLnihpOMRQVihWlbdARazVDAioijRoBREcBy2E52tJxJ8XSVp0QjSYjUUpaFN0vMVAsGWkTId6o8fBk6MplZOKSMdKOuTwo0L1jCKaJJN4IdWrjbACqHIKAjpR3YR60ugRJbqwSeavsIn7ZniVhqrVXpOsmqqnxO80keEO4mijnaALSXPlWamvOJTDyzqmJolJuuYTD1PlSkVTcpOpAiJxQKQ8TeqTUmCddzAByYEnok3uLVovyqKq8rOkjf/m/zZNbg5IM6+qrpkm8fRCBPSerWoCAvxE6gZEeErT5Kbkp8r0ClfYhIgSxFeCJZlqsq9IkqLtFqEV0swVCLmm3fxDffTNq54mSfR/tAtJUv3RN4jtm1MfeHl96w/B3+MZZIMiLP3B1oO+MJEpy9Mt17FYDd8HLb3XtfMEf3vkod+gJPudA1G5V0d9RGZBwMW0Y5AcWsc6apCnFc/CsSJ+0qDKC4lme33UJAWDxO8BCVPWi4AXiNe6VisJywaShVAOnX9fIDEUhI1AUuGjrBgWBSYv1xKiFcL9qnSw8JIWzkCC2g2I8J2kGJeapn2QIsuKJBtuRICTlkOQOpuZdUyWuLqsNX9EBgepRiAVGCTdXr9Owp4ic3by3IGAz5RulyynI0WmNcDB34PUhSHImiJZ9QWK+NsgyaYi3wDiZfgYydgXgASZgxj5CpDtipqtGCm4OxBwPyKmVptboRsxIuaH3wBSbRc5bcRIAVucczzWkgspW4vY6zFS7Cn/BhCD+n61xLikiNx6Q9wiGLgaxjfLpuGGJkWxdIRaL83hIJP5SIVwrc1awJWtBlUJGLsDKcGjnabyF1eJDR9qTebs8AcI1JhyFECR/+jqpavloG4jMYTcP4LY42kd29FK4wsEfEcPpej+sA8Cz4D5XEHKzMb69KWu6IEhs+9gNR6+IDOpfxCtTU97Yemr3eIl+copfbEgSgXWQMB+2hU76RxcFMm+rQHgbVdZnLqXThq46CoFECC5ox2rtmvv7bcXYUl7pkQpuiplfVzRKxTA9IdzO1YxMv/qMHn5S/uaQEvK4Ws8GRwIz5hsBqR0AELDaE/HxjmfvEbTKHn9AzvRHe2z19i0JZ0mpYaW9OjgSSt2VDAwinagIYaMuaNalN6wEWHwEOlqf8nz6aJvz1Ec6An7pF6rxifgcRvLnnH3nhU4qqAbjuSnVh4OrK13EH9ZOArxoKhyHgSxADvfRJ8pgubnwCLXgtQLNY2ImfN8lESssYP6ZfMHIR7FUy3V/SJEnpfk6vnSZKWN54ezroV5Ily8BII46VIK5rzt2Ocj5E5ceNYYBPPgpjss9XrEhWdN7laA+1btQUj2PgYkXwZB+JbvhdYcJy/ynHjWBAS+dFlHkRdZcohUcPUc9IZztyYhNq4i3/NLC4xSHO9jFCnXQOCzKwEiWnYydyvJgVGErd+HCA73qOkxruZuJQ2hSLwOEmAUkSRG7qXcSoH4TgSZAQGHe8MhUbbz8N3z9OFwRYKtm44rnCJKFL7eCbZyYGKk5lsgUEk6DklyX5XjdSRckWD7xvwKq8hqpPTlwMRIuQ1SohVRJFe+KQdCkcDk4RUBXpHGv8Yo/OSPOKAxMnmkE3H30M8RR6PK/sVSnq4TDLAigdkDXgIXiugJVXS93+/Xa6T+MTVYjNTc8NlBtRNFtCyeuhNjwWCKxKYPQYodKbJtoBhh5s/XAoy4fJCBFMnNQexT8DmEkdx3v7ZPza1sHt1mFe+/593uQmGKPC673e58RkX66lMBmQ3EToLcPXsOb0930sQZzr/gSF8FMVn/qwXFZaeNgiShvH3/RfyYeFll+8DJwASiwxCK0L21JGLE34F0wtTGKw6GzzJla/7Uk6JTxNq55HSSj05z2fCy2B5kYaRS/zYf3bgBvfmrMYgYwDx2MyZOvyBMAHlMbjzrTzMQrSKWJJ7cN+XzZ1vwMgZ7AnMwyU9LFFoRyi1IPLXisgTSwJyHXlZz4DOxuzCpZ4JiThE1HTfD8PRjDdfPKi/6ymU5+CnlUtvfdSkGivQXSNY5Ij3Af+w2rQv/AP649XwlKOYVkaJsovQm9Q+jk6tOJsA8AP/HjGIAQvndX3EwbzB3/DE9/+6I+0qCm+l1hvPa/VXNQ6YQYtp46h9qDHLBftuFKcljsvdxkvNCfXe7nlxd7/vRRP52NuSg6O8fOZpd6bawz74/neTv/jS/0X50wmH2jTBm1zrCyh7MYvCy9WV8Zt/RY0JyvrwR5PJw9K1JRyPxQeZED/PvsbpZpy1De7jhMP9mMQOSHwjIDZt3bUGemx/dGRTtxzOqHwSAPB+XdwTJzg2H3fchXiA9CTJEfp5vANlKXgDfOuLDHALy/DEeNzoJkaN5y2y//HS9/7q59azb830gq3nYvnM/OnErGMhq9nq4y1lHu1aBvnv65ioD/ziSAwry5Bc3vfvFRXRgQBbTl12U/Cym8efHQBb9yyZxXc6wIbtbkOdCyuG48SIMAwUyj2IxdHSIgQSRKBewcx0dYqBBZKxcYM416dSPD0wz8CCihzxCMtcw0i83ZCNcgIh+ZSjL0dKxLscfdBPcgMho6bEYBPzNKYVLEMVyNA34n3PrUQ9HF3cJouLlpvLY+bYd6EIK7u7CrkGaiBEwayT8cjk+HF/0HSCNn63YO673NpBP238CDAApnx3WCaBrvAAAAABJRU5ErkJggg==";
	img.alt = "Generic placeholder image";
	img.width = "100";
	img.height = "100";
	img.className = "d-flex align-self-start mr-2";
	
	var text = createText( "\n        " );
	var mediaBody_yieldFragment = rendermediaBodyYieldFragment( root, component );
	
	var mediaBody = new template.components.MediaBody({
		target: null,
		_root: component._root || component,
		_yield: mediaBody_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( img, target, anchor );
			insertNode( text, target, anchor );
			mediaBody._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			mediaBody_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			mediaBody.destroy( detach );
			
			if ( detach ) {
				detachNode( img );
				detachNode( text );
			}
		}
	};
}

function rendermediaBodyYieldFragment ( root, component ) {
	var h4 = createElement( 'h4' );
	
	appendNode( createText( "Media heading" ), h4 );
	var text1 = createText( "\n          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus." );

	return {
		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			insertNode( text1, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( h4 );
				detachNode( text1 );
			}
		}
	};
}

function renderrow14YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment12( root, component );
	
	var col_initialData = {
		lg: 4
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});
	
	var text = createText( "\n\n      " );
	var col1_yieldFragment = rendercol1YieldFragment6( root, component );
	
	var col1_initialData = {
		lg: 4
	};
	var col1 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col1_yieldFragment,
		data: col1_initialData
	});
	
	var text1 = createText( "\n\n      " );
	var col2_yieldFragment = rendercol2YieldFragment1( root, component );
	
	var col2_initialData = {
		lg: 4
	};
	var col2 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col2_yieldFragment,
		data: col2_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			col2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
			col1_yieldFragment.update( changed, root );
			col2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
			col1.destroy( detach );
			col2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
			}
		}
	};
}

function rendercol2YieldFragment1 ( root, component ) {
	var card_yieldFragment = rendercardYieldFragment2( root, component );
	
	var card = new template.components.Card({
		target: null,
		_root: component._root || component,
		_yield: card_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			card._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			card_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			card.destroy( detach );
		}
	};
}

function rendercardYieldFragment2 ( root, component ) {
	var cardHeader_yieldFragment = rendercardHeaderYieldFragment( root, component );
	
	var cardHeader = new template.components.CardHeader({
		target: null,
		_root: component._root || component,
		_yield: cardHeader_yieldFragment
	});
	
	var text = createText( "\n          " );
	var cardBlock_yieldFragment = rendercardBlockYieldFragment2( root, component );
	
	var cardBlock = new template.components.CardBlock({
		target: null,
		_root: component._root || component,
		_yield: cardBlock_yieldFragment
	});
	
	var text1 = createText( "\n          " );
	
	var img = createElement( 'img' );
	img.style.cssText = "height: 200px; width: 100%; display: block;";
	img.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22318%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20318%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_158bd1d28ef%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_158bd1d28ef%22%3E%3Crect%20width%3D%22318%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22129.359375%22%20y%3D%2297.35%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
	img.alt = "Card image";
	
	var text2 = createText( "\n          " );
	var cardBlock1_yieldFragment = rendercardBlock1YieldFragment( root, component );
	
	var cardBlock1 = new template.components.CardBlock({
		target: null,
		_root: component._root || component,
		_yield: cardBlock1_yieldFragment
	});
	
	var text3 = createText( "\n          " );
	var cardFooter_yieldFragment = rendercardFooterYieldFragment( root, component );
	
	var cardFooter_initialData = {
		class: "text-muted text-xs-center"
	};
	var cardFooter = new template.components.CardFooter({
		target: null,
		_root: component._root || component,
		_yield: cardFooter_yieldFragment,
		data: cardFooter_initialData
	});

	return {
		mount: function ( target, anchor ) {
			cardHeader._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			cardBlock._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			insertNode( img, target, anchor );
			insertNode( text2, target, anchor );
			cardBlock1._fragment.mount( target, anchor );
			insertNode( text3, target, anchor );
			cardFooter._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			cardHeader_yieldFragment.update( changed, root );
			cardBlock_yieldFragment.update( changed, root );
			cardBlock1_yieldFragment.update( changed, root );
			cardFooter_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			cardHeader.destroy( detach );
			cardBlock.destroy( detach );
			cardBlock1.destroy( detach );
			cardFooter.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( img );
				detachNode( text2 );
				detachNode( text3 );
			}
		}
	};
}

function rendercardFooterYieldFragment ( root, component ) {
	var text = createText( "2 days ago" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercardBlock1YieldFragment ( root, component ) {
	var p = createElement( 'p' );
	p.className = "card-text";
	
	appendNode( createText( "Some quick example text to build on the card title and make up the bulk of the card's content." ), p );
	var text1 = createText( "\n            " );
	
	var a = createElement( 'a' );
	a.href = "#";
	a.className = "card-link";
	
	appendNode( createText( "Card link" ), a );
	var text3 = createText( "\n            " );
	
	var a1 = createElement( 'a' );
	a1.href = "#";
	a1.className = "card-link";
	
	appendNode( createText( "Another link" ), a1 );

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( a, target, anchor );
			insertNode( text3, target, anchor );
			insertNode( a1, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( p );
				detachNode( text1 );
				detachNode( a );
				detachNode( text3 );
				detachNode( a1 );
			}
		}
	};
}

function rendercardBlockYieldFragment2 ( root, component ) {
	var cardTitle_yieldFragment = rendercardTitleYieldFragment2( root, component );
	
	var cardTitle = new template.components.CardTitle({
		target: null,
		_root: component._root || component,
		_yield: cardTitle_yieldFragment
	});
	
	var text = createText( "\n            " );
	var cardSubtitle_yieldFragment = rendercardSubtitleYieldFragment( root, component );
	
	var cardSubtitle_initialData = {
		class: "text-muted"
	};
	var cardSubtitle = new template.components.CardSubtitle({
		target: null,
		_root: component._root || component,
		_yield: cardSubtitle_yieldFragment,
		data: cardSubtitle_initialData
	});

	return {
		mount: function ( target, anchor ) {
			cardTitle._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			cardSubtitle._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			cardTitle_yieldFragment.update( changed, root );
			cardSubtitle_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			cardTitle.destroy( detach );
			cardSubtitle.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercardSubtitleYieldFragment ( root, component ) {
	var text = createText( "Support card subtitle" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercardTitleYieldFragment2 ( root, component ) {
	var text = createText( "Special title treatment" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercardHeaderYieldFragment ( root, component ) {
	var text = createText( "Card header" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercol1YieldFragment6 ( root, component ) {
	var eachBlock4_anchor = createComment();
	var eachBlock4_value = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];
	var eachBlock4_iterations = [];
	
	for ( var i = 0; i < eachBlock4_value.length; i += 1 ) {
		eachBlock4_iterations[i] = renderEachBlock4( root, eachBlock4_value, eachBlock4_value[i], i, component );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( eachBlock4_anchor, target, anchor );
			
			for ( var i = 0; i < eachBlock4_iterations.length; i += 1 ) {
				eachBlock4_iterations[i].mount( eachBlock4_anchor.parentNode, eachBlock4_anchor );
			}
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			var eachBlock4_value = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];
			
			for ( var i = 0; i < eachBlock4_value.length; i += 1 ) {
				if ( !eachBlock4_iterations[i] ) {
					eachBlock4_iterations[i] = renderEachBlock4( root, eachBlock4_value, eachBlock4_value[i], i, component );
					eachBlock4_iterations[i].mount( eachBlock4_anchor.parentNode, eachBlock4_anchor );
				} else {
					eachBlock4_iterations[i].update( changed, root, eachBlock4_value, eachBlock4_value[i], i );
				}
			}
			
			teardownEach( eachBlock4_iterations, true, eachBlock4_value.length );
			
			eachBlock4_iterations.length = eachBlock4_value.length;
		},
		
		teardown: function ( detach ) {
			teardownEach( eachBlock4_iterations, detach );
			
			if ( detach ) {
				detachNode( eachBlock4_anchor );
			}
		}
	};
}

function renderEachBlock4 ( root, eachBlock4_value, color, color__index, component ) {
	var card_yieldFragment = rendercardYieldFragment1( root, eachBlock4_value, color, color__index, component );
	
	var card_initialData = {
		outline: true,
		class: "mb-3 text-xs-center",
		color: color
	};
	var card = new template.components.Card({
		target: null,
		_root: component._root || component,
		_yield: card_yieldFragment,
		data: card_initialData
	});

	return {
		mount: function ( target, anchor ) {
			card._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root, eachBlock4_value, color, color__index ) {
			var __tmp;
		
			card_yieldFragment.update( changed, root, eachBlock4_value, color, color__index );
			
			var card_changes = {};
			
			card_changes.color = color;
			
			if ( Object.keys( card_changes ).length ) card.set( card_changes );
		},
		
		teardown: function ( detach ) {
			card.destroy( detach );
		}
	};
}

function rendercardYieldFragment1 ( root, eachBlock4_value, color, color__index, component ) {
	var cardBlock_yieldFragment = rendercardBlockYieldFragment1( root, eachBlock4_value, color, color__index, component );
	
	var cardBlock = new template.components.CardBlock({
		target: null,
		_root: component._root || component,
		_yield: cardBlock_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			cardBlock._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root, eachBlock4_value, color, color__index ) {
			var __tmp;
		
			cardBlock_yieldFragment.update( changed, root, eachBlock4_value, color, color__index );
		},
		
		teardown: function ( detach ) {
			cardBlock.destroy( detach );
		}
	};
}

function rendercardBlockYieldFragment1 ( root, eachBlock4_value, color, color__index, component ) {
	var cardTitle_yieldFragment = rendercardTitleYieldFragment1( root, eachBlock4_value, color, color__index, component );
	
	var cardTitle = new template.components.CardTitle({
		target: null,
		_root: component._root || component,
		_yield: cardTitle_yieldFragment
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
	cite.title = "Source Title";
	
	appendNode( cite, footer );
	appendNode( createText( "Source Title" ), cite );

	return {
		mount: function ( target, anchor ) {
			cardTitle._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			insertNode( blockquote, target, anchor );
		},
		
		update: function ( changed, root, eachBlock4_value, color, color__index ) {
			var __tmp;
		
			cardTitle_yieldFragment.update( changed, root, eachBlock4_value, color, color__index );
		},
		
		teardown: function ( detach ) {
			cardTitle.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( blockquote );
			}
		}
	};
}

function rendercardTitleYieldFragment1 ( root, eachBlock4_value, color, color__index, component ) {
	var last_text = color;
	var text = createText( last_text );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: function ( changed, root, eachBlock4_value, color, color__index ) {
			var __tmp;
		
			if ( ( __tmp = color ) !== last_text ) {
				text.data = last_text = __tmp;
			}
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercolYieldFragment12 ( root, component ) {
	var eachBlock3_anchor = createComment();
	var eachBlock3_value = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];
	var eachBlock3_iterations = [];
	
	for ( var i = 0; i < eachBlock3_value.length; i += 1 ) {
		eachBlock3_iterations[i] = renderEachBlock3( root, eachBlock3_value, eachBlock3_value[i], i, component );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( eachBlock3_anchor, target, anchor );
			
			for ( var i = 0; i < eachBlock3_iterations.length; i += 1 ) {
				eachBlock3_iterations[i].mount( eachBlock3_anchor.parentNode, eachBlock3_anchor );
			}
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			var eachBlock3_value = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];
			
			for ( var i = 0; i < eachBlock3_value.length; i += 1 ) {
				if ( !eachBlock3_iterations[i] ) {
					eachBlock3_iterations[i] = renderEachBlock3( root, eachBlock3_value, eachBlock3_value[i], i, component );
					eachBlock3_iterations[i].mount( eachBlock3_anchor.parentNode, eachBlock3_anchor );
				} else {
					eachBlock3_iterations[i].update( changed, root, eachBlock3_value, eachBlock3_value[i], i );
				}
			}
			
			teardownEach( eachBlock3_iterations, true, eachBlock3_value.length );
			
			eachBlock3_iterations.length = eachBlock3_value.length;
		},
		
		teardown: function ( detach ) {
			teardownEach( eachBlock3_iterations, detach );
			
			if ( detach ) {
				detachNode( eachBlock3_anchor );
			}
		}
	};
}

function renderEachBlock3 ( root, eachBlock3_value, color, color__index, component ) {
	var card_yieldFragment = rendercardYieldFragment( root, eachBlock3_value, color, color__index, component );
	
	var card_initialData = {
		class: "mb-3 text-xs-center",
		color: color
	};
	var card = new template.components.Card({
		target: null,
		_root: component._root || component,
		_yield: card_yieldFragment,
		data: card_initialData
	});

	return {
		mount: function ( target, anchor ) {
			card._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root, eachBlock3_value, color, color__index ) {
			var __tmp;
		
			card_yieldFragment.update( changed, root, eachBlock3_value, color, color__index );
			
			var card_changes = {};
			
			card_changes.color = color;
			
			if ( Object.keys( card_changes ).length ) card.set( card_changes );
		},
		
		teardown: function ( detach ) {
			card.destroy( detach );
		}
	};
}

function rendercardYieldFragment ( root, eachBlock3_value, color, color__index, component ) {
	var cardBlock_yieldFragment = rendercardBlockYieldFragment( root, eachBlock3_value, color, color__index, component );
	
	var cardBlock = new template.components.CardBlock({
		target: null,
		_root: component._root || component,
		_yield: cardBlock_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			cardBlock._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root, eachBlock3_value, color, color__index ) {
			var __tmp;
		
			cardBlock_yieldFragment.update( changed, root, eachBlock3_value, color, color__index );
		},
		
		teardown: function ( detach ) {
			cardBlock.destroy( detach );
		}
	};
}

function rendercardBlockYieldFragment ( root, eachBlock3_value, color, color__index, component ) {
	var cardTitle_yieldFragment = rendercardTitleYieldFragment( root, eachBlock3_value, color, color__index, component );
	
	var cardTitle = new template.components.CardTitle({
		target: null,
		_root: component._root || component,
		_yield: cardTitle_yieldFragment
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
	cite.title = "Source Title";
	
	appendNode( cite, footer );
	appendNode( createText( "Source Title" ), cite );

	return {
		mount: function ( target, anchor ) {
			cardTitle._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			insertNode( blockquote, target, anchor );
		},
		
		update: function ( changed, root, eachBlock3_value, color, color__index ) {
			var __tmp;
		
			cardTitle_yieldFragment.update( changed, root, eachBlock3_value, color, color__index );
		},
		
		teardown: function ( detach ) {
			cardTitle.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( blockquote );
			}
		}
	};
}

function rendercardTitleYieldFragment ( root, eachBlock3_value, color, color__index, component ) {
	var last_text = color;
	var text = createText( last_text );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: function ( changed, root, eachBlock3_value, color, color__index ) {
			var __tmp;
		
			if ( ( __tmp = color ) !== last_text ) {
				text.data = last_text = __tmp;
			}
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderrow13YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment11( root, component );
	
	var col_initialData = {
		lg: 4
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});
	
	var text = createText( "\n\n      " );
	var col1_yieldFragment = rendercol1YieldFragment5( root, component );
	
	var col1_initialData = {
		lg: 4
	};
	var col1 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col1_yieldFragment,
		data: col1_initialData
	});
	
	var text1 = createText( "\n\n      " );
	var col2_yieldFragment = rendercol2YieldFragment( root, component );
	
	var col2_initialData = {
		lg: 4
	};
	var col2 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col2_yieldFragment,
		data: col2_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			col2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
			col1_yieldFragment.update( changed, root );
			col2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
			col1.destroy( detach );
			col2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
			}
		}
	};
}

function rendercol2YieldFragment ( root, component ) {
	var listGroup_yieldFragment = renderlistGroupYieldFragment3( root, component );
	
	var listGroup = new template.components.ListGroup({
		target: null,
		_root: component._root || component,
		_yield: listGroup_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			listGroup._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroup_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroup.destroy( detach );
		}
	};
}

function renderlistGroupYieldFragment3 ( root, component ) {
	var listGroupItem_yieldFragment = renderlistGroupItemYieldFragment3( root, component );
	
	var listGroupItem_initialData = {
		action: true,
		active: true
	};
	var listGroupItem = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem_yieldFragment,
		data: listGroupItem_initialData
	});
	
	var text = createText( "\n          " );
	var listGroupItem1_yieldFragment = renderlistGroupItem1YieldFragment3( root, component );
	
	var listGroupItem1_initialData = {
		action: true
	};
	var listGroupItem1 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem1_yieldFragment,
		data: listGroupItem1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			listGroupItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listGroupItem1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroupItem_yieldFragment.update( changed, root );
			listGroupItem1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroupItem.destroy( detach );
			listGroupItem1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItem1YieldFragment3 ( root, component ) {
	var listGroupItemHeading_yieldFragment = renderlistGroupItemHeadingYieldFragment1( root, component );
	
	var listGroupItemHeading = new template.components.ListGroupItemHeading({
		target: null,
		_root: component._root || component,
		_yield: listGroupItemHeading_yieldFragment
	});
	
	var text = createText( "\n            " );
	var listGroupItemText_yieldFragment = renderlistGroupItemTextYieldFragment1( root, component );
	
	var listGroupItemText = new template.components.ListGroupItemText({
		target: null,
		_root: component._root || component,
		_yield: listGroupItemText_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			listGroupItemHeading._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listGroupItemText._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroupItemHeading_yieldFragment.update( changed, root );
			listGroupItemText_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroupItemHeading.destroy( detach );
			listGroupItemText.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItemTextYieldFragment1 ( root, component ) {
	var text = createText( "Donec id elit non mi porta gravida at eget metus.\n              Maecenas sed diam eget risus varius blandit." );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItemHeadingYieldFragment1 ( root, component ) {
	var text = createText( "List group item heading" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItemYieldFragment3 ( root, component ) {
	var listGroupItemHeading_yieldFragment = renderlistGroupItemHeadingYieldFragment( root, component );
	
	var listGroupItemHeading = new template.components.ListGroupItemHeading({
		target: null,
		_root: component._root || component,
		_yield: listGroupItemHeading_yieldFragment
	});
	
	var text = createText( "\n            " );
	var listGroupItemText_yieldFragment = renderlistGroupItemTextYieldFragment( root, component );
	
	var listGroupItemText = new template.components.ListGroupItemText({
		target: null,
		_root: component._root || component,
		_yield: listGroupItemText_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			listGroupItemHeading._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listGroupItemText._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroupItemHeading_yieldFragment.update( changed, root );
			listGroupItemText_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroupItemHeading.destroy( detach );
			listGroupItemText.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItemTextYieldFragment ( root, component ) {
	var text = createText( "Donec id elit non mi porta gravida at eget metus.\n              Maecenas sed diam eget risus varius blandit." );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItemHeadingYieldFragment ( root, component ) {
	var text = createText( "List group item heading" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercol1YieldFragment5 ( root, component ) {
	var listGroup_yieldFragment = renderlistGroupYieldFragment2( root, component );
	
	var listGroup = new template.components.ListGroup({
		target: null,
		_root: component._root || component,
		_yield: listGroup_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			listGroup._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroup_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroup.destroy( detach );
		}
	};
}

function renderlistGroupYieldFragment2 ( root, component ) {
	var listGroupItem_yieldFragment = renderlistGroupItemYieldFragment2( root, component );
	
	var listGroupItem_initialData = {
		action: true,
		active: true
	};
	var listGroupItem = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem_yieldFragment,
		data: listGroupItem_initialData
	});
	
	var text = createText( "\n          " );
	var listGroupItem1_yieldFragment = renderlistGroupItem1YieldFragment2( root, component );
	
	var listGroupItem1_initialData = {
		action: true
	};
	var listGroupItem1 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem1_yieldFragment,
		data: listGroupItem1_initialData
	});
	
	var text1 = createText( "\n          " );
	var listGroupItem2_yieldFragment = renderlistGroupItem2YieldFragment2( root, component );
	
	var listGroupItem2_initialData = {
		action: true,
		disabled: true
	};
	var listGroupItem2 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem2_yieldFragment,
		data: listGroupItem2_initialData
	});

	return {
		mount: function ( target, anchor ) {
			listGroupItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listGroupItem1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			listGroupItem2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroupItem_yieldFragment.update( changed, root );
			listGroupItem1_yieldFragment.update( changed, root );
			listGroupItem2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroupItem.destroy( detach );
			listGroupItem1.destroy( detach );
			listGroupItem2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
			}
		}
	};
}

function renderlistGroupItem2YieldFragment2 ( root, component ) {
	var text = createText( "Morbi leo risus" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItem1YieldFragment2 ( root, component ) {
	var text = createText( "Dapibus ac facilisis in" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItemYieldFragment2 ( root, component ) {
	var text = createText( "Cras justo odio" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercolYieldFragment11 ( root, component ) {
	var listGroup_yieldFragment = renderlistGroupYieldFragment1( root, component );
	
	var listGroup = new template.components.ListGroup({
		target: null,
		_root: component._root || component,
		_yield: listGroup_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			listGroup._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroup_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroup.destroy( detach );
		}
	};
}

function renderlistGroupYieldFragment1 ( root, component ) {
	var listGroupItem_yieldFragment = renderlistGroupItemYieldFragment1( root, component );
	
	var listGroupItem_initialData = {
		class: "justify-content-between"
	};
	var listGroupItem = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem_yieldFragment,
		data: listGroupItem_initialData
	});
	
	var text = createText( "\n          " );
	var listGroupItem1_yieldFragment = renderlistGroupItem1YieldFragment1( root, component );
	
	var listGroupItem1_initialData = {
		class: "justify-content-between"
	};
	var listGroupItem1 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem1_yieldFragment,
		data: listGroupItem1_initialData
	});
	
	var text1 = createText( "\n          " );
	var listGroupItem2_yieldFragment = renderlistGroupItem2YieldFragment1( root, component );
	
	var listGroupItem2_initialData = {
		class: "justify-content-between"
	};
	var listGroupItem2 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem2_yieldFragment,
		data: listGroupItem2_initialData
	});

	return {
		mount: function ( target, anchor ) {
			listGroupItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listGroupItem1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			listGroupItem2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroupItem_yieldFragment.update( changed, root );
			listGroupItem1_yieldFragment.update( changed, root );
			listGroupItem2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroupItem.destroy( detach );
			listGroupItem1.destroy( detach );
			listGroupItem2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
			}
		}
	};
}

function renderlistGroupItem2YieldFragment1 ( root, component ) {
	var text = createText( "Morbi leo risus" );
	var badge_yieldFragment = renderbadgeYieldFragment3( root, component );
	
	var badge_initialData = {
		pill: true
	};
	var badge = new template.components.Badge({
		target: null,
		_root: component._root || component,
		_yield: badge_yieldFragment,
		data: badge_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			badge._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			badge_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			badge.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadgeYieldFragment3 ( root, component ) {
	var text = createText( "1" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItem1YieldFragment1 ( root, component ) {
	var text = createText( "Dapibus ac facilisis in" );
	var badge_yieldFragment = renderbadgeYieldFragment2( root, component );
	
	var badge_initialData = {
		pill: true
	};
	var badge = new template.components.Badge({
		target: null,
		_root: component._root || component,
		_yield: badge_yieldFragment,
		data: badge_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			badge._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			badge_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			badge.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadgeYieldFragment2 ( root, component ) {
	var text = createText( "2" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderlistGroupItemYieldFragment1 ( root, component ) {
	var text = createText( "Cras justo odio" );
	var badge_yieldFragment = renderbadgeYieldFragment1( root, component );
	
	var badge_initialData = {
		pill: true
	};
	var badge = new template.components.Badge({
		target: null,
		_root: component._root || component,
		_yield: badge_yieldFragment,
		data: badge_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			badge._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			badge_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			badge.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadgeYieldFragment1 ( root, component ) {
	var text = createText( "14" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderrow12YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment10( root, component );
	
	var col_initialData = {
		lg: 12
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
		}
	};
}

function rendercolYieldFragment10 ( root, component ) {
	var h1 = createElement( 'h1' );
	h1.id = "containers";
	
	appendNode( createText( "Containers" ), h1 );
	var text1 = createText( "\n        " );
	var jumbotron_yieldFragment = renderjumbotronYieldFragment( root, component );
	
	var jumbotron = new template.components.Jumbotron({
		target: null,
		_root: component._root || component,
		_yield: jumbotron_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text1, target, anchor );
			jumbotron._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			jumbotron_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			jumbotron.destroy( detach );
			
			if ( detach ) {
				detachNode( h1 );
				detachNode( text1 );
			}
		}
	};
}

function renderjumbotronYieldFragment ( root, component ) {
	var h1 = createElement( 'h1' );
	h1.className = "display-3";
	
	appendNode( createText( "Jumbotron" ), h1 );
	var text1 = createText( "\n          " );
	
	var p = createElement( 'p' );
	
	appendNode( createText( "This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information." ), p );
	var text3 = createText( "\n          " );
	
	var p1 = createElement( 'p' );
	
	var button_yieldFragment = renderbuttonYieldFragment11( root, component );
	
	var button_initialData = {
		color: "primary",
		size: "lg",
		href: "#"
	};
	var button = new template.components.Button({
		target: p1,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( p, target, anchor );
			insertNode( text3, target, anchor );
			insertNode( p1, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( false );
			
			if ( detach ) {
				detachNode( h1 );
				detachNode( text1 );
				detachNode( p );
				detachNode( text3 );
				detachNode( p1 );
			}
		}
	};
}

function renderbuttonYieldFragment11 ( root, component ) {
	var text = createText( "Learn more" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderrow11YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment9( root, component );
	
	var col_initialData = {
		lg: 12
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
		}
	};
}

function rendercolYieldFragment9 ( root, component ) {
	var h1 = createElement( 'h1' );
	h1.id = "progress";
	h1.className = "text-muted my-4";
	
	appendNode( createText( "Progress" ), h1 );
	var text1 = createText( "\n\n        " );
	
	var h3 = createElement( 'h3' );
	h3.id = "progress-basic";
	h3.className = "text-muted my-4";
	
	appendNode( createText( "Basic" ), h3 );
	var text3 = createText( "\n        " );
	
	var div = createElement( 'div' );
	
	var progress_initialData = {
		value: 25,
		min: 0,
		max: 100
	};
	var progress = new template.components.Progress({
		target: div,
		_root: component._root || component,
		data: progress_initialData
	});
	
	var text4 = createText( "\n\n        " );
	
	var h31 = createElement( 'h3' );
	h31.id = "progress-alternatives";
	h31.className = "text-muted my-4";
	
	appendNode( createText( "Contextual alternatives" ), h31 );
	var text6 = createText( "\n        " );
	
	var div1 = createElement( 'div' );
	
	var progress1_initialData = {
		color: "success",
		value: 25,
		min: 0,
		max: 100
	};
	var progress1 = new template.components.Progress({
		target: div1,
		_root: component._root || component,
		data: progress1_initialData
	});
	
	appendNode( createText( "\n          " ), div1 );
	
	var progress2_initialData = {
		color: "info",
		value: 50,
		min: 0,
		max: 100
	};
	var progress2 = new template.components.Progress({
		target: div1,
		_root: component._root || component,
		data: progress2_initialData
	});
	
	appendNode( createText( "\n          " ), div1 );
	
	var progress3_initialData = {
		color: "warning",
		value: 75,
		min: 0,
		max: 100
	};
	var progress3 = new template.components.Progress({
		target: div1,
		_root: component._root || component,
		data: progress3_initialData
	});
	
	appendNode( createText( "\n          " ), div1 );
	
	var progress4_initialData = {
		color: "danger",
		value: 100,
		min: 0,
		max: 100
	};
	var progress4 = new template.components.Progress({
		target: div1,
		_root: component._root || component,
		data: progress4_initialData
	});
	
	var text10 = createText( "\n\n        " );
	
	var h32 = createElement( 'h3' );
	h32.id = "progress-multiple";
	h32.className = "text-muted my-4";
	
	appendNode( createText( "Multiple bars" ), h32 );
	var text12 = createText( "\n        " );
	
	var div2 = createElement( 'div' );
	
	var progress5_yieldFragment = renderprogress5YieldFragment( root, component );
	
	var progress5_initialData = {
		multi: true
	};
	var progress5 = new template.components.Progress({
		target: div2,
		_root: component._root || component,
		_yield: progress5_yieldFragment,
		data: progress5_initialData
	});
	
	var text13 = createText( "\n\n        " );
	
	var h33 = createElement( 'h3' );
	h33.id = "progress-striped";
	h33.className = "text-muted my-4";
	
	appendNode( createText( "Striped" ), h33 );
	var text15 = createText( "\n        " );
	
	var div3 = createElement( 'div' );
	
	var progress6_initialData = {
		striped: true,
		value: 15,
		min: 0,
		max: 100
	};
	var progress6 = new template.components.Progress({
		target: div3,
		_root: component._root || component,
		data: progress6_initialData
	});
	
	appendNode( createText( "\n          " ), div3 );
	
	var progress7_initialData = {
		striped: true,
		color: "success",
		value: 25,
		min: 0,
		max: 100
	};
	var progress7 = new template.components.Progress({
		target: div3,
		_root: component._root || component,
		data: progress7_initialData
	});
	
	appendNode( createText( "\n          " ), div3 );
	
	var progress8_initialData = {
		striped: true,
		color: "info",
		value: 50,
		min: 0,
		max: 100
	};
	var progress8 = new template.components.Progress({
		target: div3,
		_root: component._root || component,
		data: progress8_initialData
	});
	
	appendNode( createText( "\n          " ), div3 );
	
	var progress9_initialData = {
		striped: true,
		color: "warning",
		value: 75,
		min: 0,
		max: 100
	};
	var progress9 = new template.components.Progress({
		target: div3,
		_root: component._root || component,
		data: progress9_initialData
	});
	
	appendNode( createText( "\n          " ), div3 );
	
	var progress10_initialData = {
		striped: true,
		color: "danger",
		value: 100,
		min: 0,
		max: 100
	};
	var progress10 = new template.components.Progress({
		target: div3,
		_root: component._root || component,
		data: progress10_initialData
	});
	
	var text20 = createText( "\n\n        " );
	
	var h34 = createElement( 'h3' );
	h34.id = "progress-animated";
	h34.className = "text-muted my-4";
	
	appendNode( createText( "Animated" ), h34 );
	var text22 = createText( "\n        " );
	
	var div4 = createElement( 'div' );
	
	var progress11_initialData = {
		animated: true,
		striped: true,
		value: 15,
		min: 0,
		max: 100
	};
	var progress11 = new template.components.Progress({
		target: div4,
		_root: component._root || component,
		data: progress11_initialData
	});
	
	appendNode( createText( "\n          " ), div4 );
	
	var progress12_initialData = {
		animated: true,
		striped: true,
		color: "success",
		value: 25,
		min: 0,
		max: 100
	};
	var progress12 = new template.components.Progress({
		target: div4,
		_root: component._root || component,
		data: progress12_initialData
	});
	
	appendNode( createText( "\n          " ), div4 );
	
	var progress13_initialData = {
		animated: true,
		striped: true,
		color: "info",
		value: 50,
		min: 0,
		max: 100
	};
	var progress13 = new template.components.Progress({
		target: div4,
		_root: component._root || component,
		data: progress13_initialData
	});
	
	appendNode( createText( "\n          " ), div4 );
	
	var progress14_initialData = {
		animated: true,
		striped: true,
		color: "warning",
		value: 75,
		min: 0,
		max: 100
	};
	var progress14 = new template.components.Progress({
		target: div4,
		_root: component._root || component,
		data: progress14_initialData
	});
	
	appendNode( createText( "\n          " ), div4 );
	
	var progress15_initialData = {
		animated: true,
		striped: true,
		color: "danger",
		value: 100,
		min: 0,
		max: 100
	};
	var progress15 = new template.components.Progress({
		target: div4,
		_root: component._root || component,
		data: progress15_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( h3, target, anchor );
			insertNode( text3, target, anchor );
			insertNode( div, target, anchor );
			insertNode( text4, target, anchor );
			insertNode( h31, target, anchor );
			insertNode( text6, target, anchor );
			insertNode( div1, target, anchor );
			insertNode( text10, target, anchor );
			insertNode( h32, target, anchor );
			insertNode( text12, target, anchor );
			insertNode( div2, target, anchor );
			insertNode( text13, target, anchor );
			insertNode( h33, target, anchor );
			insertNode( text15, target, anchor );
			insertNode( div3, target, anchor );
			insertNode( text20, target, anchor );
			insertNode( h34, target, anchor );
			insertNode( text22, target, anchor );
			insertNode( div4, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			progress5_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			progress.destroy( false );
			progress1.destroy( false );
			progress2.destroy( false );
			progress3.destroy( false );
			progress4.destroy( false );
			progress5.destroy( false );
			progress6.destroy( false );
			progress7.destroy( false );
			progress8.destroy( false );
			progress9.destroy( false );
			progress10.destroy( false );
			progress11.destroy( false );
			progress12.destroy( false );
			progress13.destroy( false );
			progress14.destroy( false );
			progress15.destroy( false );
			
			if ( detach ) {
				detachNode( h1 );
				detachNode( text1 );
				detachNode( h3 );
				detachNode( text3 );
				detachNode( div );
				detachNode( text4 );
				detachNode( h31 );
				detachNode( text6 );
				detachNode( div1 );
				detachNode( text10 );
				detachNode( h32 );
				detachNode( text12 );
				detachNode( div2 );
				detachNode( text13 );
				detachNode( h33 );
				detachNode( text15 );
				detachNode( div3 );
				detachNode( text20 );
				detachNode( h34 );
				detachNode( text22 );
				detachNode( div4 );
			}
		}
	};
}

function renderprogress5YieldFragment ( root, component ) {
	var progress_initialData = {
		bar: true,
		value: 25
	};
	var progress = new template.components.Progress({
		target: null,
		_root: component._root || component,
		data: progress_initialData
	});
	
	var text = createText( "\n            " );
	
	var progress1_initialData = {
		bar: true,
		color: "success",
		value: 30
	};
	var progress1 = new template.components.Progress({
		target: null,
		_root: component._root || component,
		data: progress1_initialData
	});
	
	var text1 = createText( "\n            " );
	
	var progress2_initialData = {
		bar: true,
		color: "info",
		value: 20
	};
	var progress2 = new template.components.Progress({
		target: null,
		_root: component._root || component,
		data: progress2_initialData
	});

	return {
		mount: function ( target, anchor ) {
			progress._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			progress1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			progress2._fragment.mount( target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			progress.destroy( detach );
			progress1.destroy( detach );
			progress2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
			}
		}
	};
}

function renderbadge11YieldFragment ( root, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge10YieldFragment ( root, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge9YieldFragment ( root, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge8YieldFragment ( root, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge7YieldFragment ( root, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge6YieldFragment ( root, component ) {
	var text = createText( "Default" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge5YieldFragment ( root, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge4YieldFragment ( root, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge3YieldFragment ( root, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge2YieldFragment ( root, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadge1YieldFragment ( root, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbadgeYieldFragment ( root, component ) {
	var text = createText( "Default" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderrow10YieldFragment ( root, component ) {
	var eachBlock2_anchor = createComment();
	var eachBlock2_value = ['success', 'info', 'warning', 'danger'];
	var eachBlock2_iterations = [];
	
	for ( var i = 0; i < eachBlock2_value.length; i += 1 ) {
		eachBlock2_iterations[i] = renderEachBlock2( root, eachBlock2_value, eachBlock2_value[i], i, component );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( eachBlock2_anchor, target, anchor );
			
			for ( var i = 0; i < eachBlock2_iterations.length; i += 1 ) {
				eachBlock2_iterations[i].mount( eachBlock2_anchor.parentNode, eachBlock2_anchor );
			}
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			var eachBlock2_value = ['success', 'info', 'warning', 'danger'];
			
			for ( var i = 0; i < eachBlock2_value.length; i += 1 ) {
				if ( !eachBlock2_iterations[i] ) {
					eachBlock2_iterations[i] = renderEachBlock2( root, eachBlock2_value, eachBlock2_value[i], i, component );
					eachBlock2_iterations[i].mount( eachBlock2_anchor.parentNode, eachBlock2_anchor );
				} else {
					eachBlock2_iterations[i].update( changed, root, eachBlock2_value, eachBlock2_value[i], i );
				}
			}
			
			teardownEach( eachBlock2_iterations, true, eachBlock2_value.length );
			
			eachBlock2_iterations.length = eachBlock2_value.length;
		},
		
		teardown: function ( detach ) {
			teardownEach( eachBlock2_iterations, detach );
			
			if ( detach ) {
				detachNode( eachBlock2_anchor );
			}
		}
	};
}

function renderEachBlock2 ( root, eachBlock2_value, color, color__index, component ) {
	var col_yieldFragment = rendercolYieldFragment8( root, eachBlock2_value, color, color__index, component );
	
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root, eachBlock2_value, color, color__index ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root, eachBlock2_value, color, color__index );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
		}
	};
}

function rendercolYieldFragment8 ( root, eachBlock2_value, color, color__index, component ) {
	var alert_yieldFragment = renderalertYieldFragment1( root, eachBlock2_value, color, color__index, component );
	
	var alert_initialData = {
		dismissible: true,
		color: color
	};
	var alert = new template.components.Alert({
		target: null,
		_root: component._root || component,
		_yield: alert_yieldFragment,
		data: alert_initialData
	});

	return {
		mount: function ( target, anchor ) {
			alert._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root, eachBlock2_value, color, color__index ) {
			var __tmp;
		
			alert_yieldFragment.update( changed, root, eachBlock2_value, color, color__index );
			
			var alert_changes = {};
			
			alert_changes.color = color;
			
			if ( Object.keys( alert_changes ).length ) alert.set( alert_changes );
		},
		
		teardown: function ( detach ) {
			alert.destroy( detach );
		}
	};
}

function renderalertYieldFragment1 ( root, eachBlock2_value, color, color__index, component ) {
	var h4 = createElement( 'h4' );
	
	var last_text = color;
	var text = createText( last_text );
	appendNode( text, h4 );
	var text1 = createText( "\n            " );
	
	var a = createElement( 'a' );
	a.href = "#";
	a.className = "alert-link";
	
	appendNode( createText( "Change a few things up" ), a );
	var text3 = createText( " and try submitting again." );

	return {
		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( a, target, anchor );
			insertNode( text3, target, anchor );
		},
		
		update: function ( changed, root, eachBlock2_value, color, color__index ) {
			var __tmp;
		
			if ( ( __tmp = color ) !== last_text ) {
				text.data = last_text = __tmp;
			}
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( h4 );
				detachNode( text1 );
				detachNode( a );
				detachNode( text3 );
			}
		}
	};
}

function renderalertYieldFragment ( root, component ) {
	var h4 = createElement( 'h4' );
	
	appendNode( createText( "Default" ), h4 );
	var text1 = createText( "\n      " );
	
	var p = createElement( 'p' );
	
	appendNode( createText( "Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna,\n        " ), p );
	
	var a = createElement( 'a' );
	a.href = "#";
	a.className = "alert-link";
	
	appendNode( a, p );
	appendNode( createText( "vel scelerisque nisl consectetur et" ), a );
	appendNode( createText( "." ), p );

	return {
		mount: function ( target, anchor ) {
			insertNode( h4, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( p, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( h4 );
				detachNode( text1 );
				detachNode( p );
			}
		}
	};
}

function renderrow9YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment7( root, component );
	
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment
	});
	
	var text = createText( "\n\n      " );
	var col1_yieldFragment = rendercol1YieldFragment4( root, component );
	
	var col1 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col1_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
			col1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
			col1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercol1YieldFragment4 ( root, component ) {
	var h2 = createElement( 'h2' );
	h2.id = "pagination";
	h2.className = "text-muted my-4";
	
	appendNode( createText( "Pagination" ), h2 );
	var text1 = createText( "\n        " );
	
	var div = createElement( 'div' );
	div.className = "bs-component";
	
	var eachBlock1_anchor = createComment();
	appendNode( eachBlock1_anchor, div );
	var eachBlock1_value = [null, 'lg', 'sm'];
	var eachBlock1_iterations = [];
	
	for ( var i = 0; i < eachBlock1_value.length; i += 1 ) {
		eachBlock1_iterations[i] = renderEachBlock1( root, eachBlock1_value, eachBlock1_value[i], i, component );
		eachBlock1_iterations[i].mount( eachBlock1_anchor.parentNode, eachBlock1_anchor );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			var eachBlock1_value = [null, 'lg', 'sm'];
			
			for ( var i = 0; i < eachBlock1_value.length; i += 1 ) {
				if ( !eachBlock1_iterations[i] ) {
					eachBlock1_iterations[i] = renderEachBlock1( root, eachBlock1_value, eachBlock1_value[i], i, component );
					eachBlock1_iterations[i].mount( eachBlock1_anchor.parentNode, eachBlock1_anchor );
				} else {
					eachBlock1_iterations[i].update( changed, root, eachBlock1_value, eachBlock1_value[i], i );
				}
			}
			
			teardownEach( eachBlock1_iterations, true, eachBlock1_value.length );
			
			eachBlock1_iterations.length = eachBlock1_value.length;
		},
		
		teardown: function ( detach ) {
			teardownEach( eachBlock1_iterations, false );
			
			if ( detach ) {
				detachNode( h2 );
				detachNode( text1 );
				detachNode( div );
			}
		}
	};
}

function renderEachBlock1 ( root, eachBlock1_value, size, size__index, component ) {
	var div = createElement( 'div' );
	
	var pagination_yieldFragment = renderpaginationYieldFragment( root, eachBlock1_value, size, size__index, component );
	
	var pagination_initialData = {
		size: size
	};
	var pagination = new template.components.Pagination({
		target: div,
		_root: component._root || component,
		_yield: pagination_yieldFragment,
		data: pagination_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root, eachBlock1_value, size, size__index ) {
			var __tmp;
		
			pagination_yieldFragment.update( changed, root, eachBlock1_value, size, size__index );
			
			var pagination_changes = {};
			
			pagination_changes.size = size;
			
			if ( Object.keys( pagination_changes ).length ) pagination.set( pagination_changes );
		},
		
		teardown: function ( detach ) {
			pagination.destroy( false );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function renderpaginationYieldFragment ( root, eachBlock1_value, size, size__index, component ) {
	var paginationItem_yieldFragment = renderpaginationItemYieldFragment( root, eachBlock1_value, size, size__index, component );
	
	var paginationItem_initialData = {
		disabled: true
	};
	var paginationItem = new template.components.PaginationItem({
		target: null,
		_root: component._root || component,
		_yield: paginationItem_yieldFragment,
		data: paginationItem_initialData
	});
	
	var text = createText( "\n                " );
	var paginationItem1_yieldFragment = renderpaginationItem1YieldFragment( root, eachBlock1_value, size, size__index, component );
	
	var paginationItem1_initialData = {
		active: true
	};
	var paginationItem1 = new template.components.PaginationItem({
		target: null,
		_root: component._root || component,
		_yield: paginationItem1_yieldFragment,
		data: paginationItem1_initialData
	});
	
	var text1 = createText( "\n                " );
	var paginationItem2_yieldFragment = renderpaginationItem2YieldFragment( root, eachBlock1_value, size, size__index, component );
	
	var paginationItem2 = new template.components.PaginationItem({
		target: null,
		_root: component._root || component,
		_yield: paginationItem2_yieldFragment
	});
	
	var text2 = createText( "\n                " );
	var paginationItem3_yieldFragment = renderpaginationItem3YieldFragment( root, eachBlock1_value, size, size__index, component );
	
	var paginationItem3 = new template.components.PaginationItem({
		target: null,
		_root: component._root || component,
		_yield: paginationItem3_yieldFragment
	});
	
	var text3 = createText( "\n                " );
	var paginationItem4_yieldFragment = renderpaginationItem4YieldFragment( root, eachBlock1_value, size, size__index, component );
	
	var paginationItem4 = new template.components.PaginationItem({
		target: null,
		_root: component._root || component,
		_yield: paginationItem4_yieldFragment
	});
	
	var text4 = createText( "\n                " );
	var paginationItem5_yieldFragment = renderpaginationItem5YieldFragment( root, eachBlock1_value, size, size__index, component );
	
	var paginationItem5 = new template.components.PaginationItem({
		target: null,
		_root: component._root || component,
		_yield: paginationItem5_yieldFragment
	});
	
	var text5 = createText( "\n                " );
	var paginationItem6_yieldFragment = renderpaginationItem6YieldFragment( root, eachBlock1_value, size, size__index, component );
	
	var paginationItem6 = new template.components.PaginationItem({
		target: null,
		_root: component._root || component,
		_yield: paginationItem6_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			paginationItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			paginationItem1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			paginationItem2._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			paginationItem3._fragment.mount( target, anchor );
			insertNode( text3, target, anchor );
			paginationItem4._fragment.mount( target, anchor );
			insertNode( text4, target, anchor );
			paginationItem5._fragment.mount( target, anchor );
			insertNode( text5, target, anchor );
			paginationItem6._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root, eachBlock1_value, size, size__index ) {
			var __tmp;
		
			paginationItem_yieldFragment.update( changed, root, eachBlock1_value, size, size__index );
			paginationItem1_yieldFragment.update( changed, root, eachBlock1_value, size, size__index );
			paginationItem2_yieldFragment.update( changed, root, eachBlock1_value, size, size__index );
			paginationItem3_yieldFragment.update( changed, root, eachBlock1_value, size, size__index );
			paginationItem4_yieldFragment.update( changed, root, eachBlock1_value, size, size__index );
			paginationItem5_yieldFragment.update( changed, root, eachBlock1_value, size, size__index );
			paginationItem6_yieldFragment.update( changed, root, eachBlock1_value, size, size__index );
		},
		
		teardown: function ( detach ) {
			paginationItem.destroy( detach );
			paginationItem1.destroy( detach );
			paginationItem2.destroy( detach );
			paginationItem3.destroy( detach );
			paginationItem4.destroy( detach );
			paginationItem5.destroy( detach );
			paginationItem6.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
				detachNode( text3 );
				detachNode( text4 );
				detachNode( text5 );
			}
		}
	};
}

function renderpaginationItem6YieldFragment ( root, eachBlock1_value, size, size__index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	
	appendNode( createText( "»" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderpaginationItem5YieldFragment ( root, eachBlock1_value, size, size__index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	
	appendNode( createText( "5" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderpaginationItem4YieldFragment ( root, eachBlock1_value, size, size__index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	
	appendNode( createText( "4" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderpaginationItem3YieldFragment ( root, eachBlock1_value, size, size__index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	
	appendNode( createText( "3" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderpaginationItem2YieldFragment ( root, eachBlock1_value, size, size__index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	
	appendNode( createText( "2" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderpaginationItem1YieldFragment ( root, eachBlock1_value, size, size__index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	
	appendNode( createText( "1" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderpaginationItemYieldFragment ( root, eachBlock1_value, size, size__index, component ) {
	var a = createElement( 'a' );
	a.className = "page-link";
	a.href = "#";
	
	appendNode( createText( "«" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendercolYieldFragment7 ( root, component ) {
	var h2 = createElement( 'h2' );
	h2.id = "nav-breadcrumbs";
	h2.className = "text-muted my-4";
	
	appendNode( createText( "Breadcrumbs" ), h2 );
	var text1 = createText( "\n\n        " );
	var breadcrumb_yieldFragment = renderbreadcrumbYieldFragment( root, component );
	
	var breadcrumb = new template.components.Breadcrumb({
		target: null,
		_root: component._root || component,
		_yield: breadcrumb_yieldFragment
	});
	
	var text2 = createText( "\n\n        " );
	var breadcrumb1_yieldFragment = renderbreadcrumb1YieldFragment( root, component );
	
	var breadcrumb1 = new template.components.Breadcrumb({
		target: null,
		_root: component._root || component,
		_yield: breadcrumb1_yieldFragment
	});
	
	var text3 = createText( "\n\n        " );
	var breadcrumb2_yieldFragment = renderbreadcrumb2YieldFragment( root, component );
	
	var breadcrumb2 = new template.components.Breadcrumb({
		target: null,
		_root: component._root || component,
		_yield: breadcrumb2_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text1, target, anchor );
			breadcrumb._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			breadcrumb1._fragment.mount( target, anchor );
			insertNode( text3, target, anchor );
			breadcrumb2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			breadcrumb_yieldFragment.update( changed, root );
			breadcrumb1_yieldFragment.update( changed, root );
			breadcrumb2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			breadcrumb.destroy( detach );
			breadcrumb1.destroy( detach );
			breadcrumb2.destroy( detach );
			
			if ( detach ) {
				detachNode( h2 );
				detachNode( text1 );
				detachNode( text2 );
				detachNode( text3 );
			}
		}
	};
}

function renderbreadcrumb2YieldFragment ( root, component ) {
	var breadcrumbItem_yieldFragment = renderbreadcrumbItemYieldFragment2( root, component );
	
	var breadcrumbItem = new template.components.BreadcrumbItem({
		target: null,
		_root: component._root || component,
		_yield: breadcrumbItem_yieldFragment
	});
	
	var text = createText( "\n          " );
	var breadcrumbItem1_yieldFragment = renderbreadcrumbItem1YieldFragment1( root, component );
	
	var breadcrumbItem1 = new template.components.BreadcrumbItem({
		target: null,
		_root: component._root || component,
		_yield: breadcrumbItem1_yieldFragment
	});
	
	var text1 = createText( "\n          " );
	var breadcrumbItem2_yieldFragment = renderbreadcrumbItem2YieldFragment( root, component );
	
	var breadcrumbItem2_initialData = {
		active: true
	};
	var breadcrumbItem2 = new template.components.BreadcrumbItem({
		target: null,
		_root: component._root || component,
		_yield: breadcrumbItem2_yieldFragment,
		data: breadcrumbItem2_initialData
	});

	return {
		mount: function ( target, anchor ) {
			breadcrumbItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			breadcrumbItem1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			breadcrumbItem2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			breadcrumbItem_yieldFragment.update( changed, root );
			breadcrumbItem1_yieldFragment.update( changed, root );
			breadcrumbItem2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			breadcrumbItem.destroy( detach );
			breadcrumbItem1.destroy( detach );
			breadcrumbItem2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
			}
		}
	};
}

function renderbreadcrumbItem2YieldFragment ( root, component ) {
	var text = createText( "Data" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbreadcrumbItem1YieldFragment1 ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	
	appendNode( createText( "Library" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderbreadcrumbItemYieldFragment2 ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	
	appendNode( createText( "Home" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderbreadcrumb1YieldFragment ( root, component ) {
	var breadcrumbItem_yieldFragment = renderbreadcrumbItemYieldFragment1( root, component );
	
	var breadcrumbItem = new template.components.BreadcrumbItem({
		target: null,
		_root: component._root || component,
		_yield: breadcrumbItem_yieldFragment
	});
	
	var text = createText( "\n          " );
	var breadcrumbItem1_yieldFragment = renderbreadcrumbItem1YieldFragment( root, component );
	
	var breadcrumbItem1_initialData = {
		active: true
	};
	var breadcrumbItem1 = new template.components.BreadcrumbItem({
		target: null,
		_root: component._root || component,
		_yield: breadcrumbItem1_yieldFragment,
		data: breadcrumbItem1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			breadcrumbItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			breadcrumbItem1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			breadcrumbItem_yieldFragment.update( changed, root );
			breadcrumbItem1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			breadcrumbItem.destroy( detach );
			breadcrumbItem1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbreadcrumbItem1YieldFragment ( root, component ) {
	var text = createText( "Library" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbreadcrumbItemYieldFragment1 ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	
	appendNode( createText( "Home" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderbreadcrumbYieldFragment ( root, component ) {
	var breadcrumbItem_yieldFragment = renderbreadcrumbItemYieldFragment( root, component );
	
	var breadcrumbItem_initialData = {
		active: true
	};
	var breadcrumbItem = new template.components.BreadcrumbItem({
		target: null,
		_root: component._root || component,
		_yield: breadcrumbItem_yieldFragment,
		data: breadcrumbItem_initialData
	});

	return {
		mount: function ( target, anchor ) {
			breadcrumbItem._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			breadcrumbItem_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			breadcrumbItem.destroy( detach );
		}
	};
}

function renderbreadcrumbItemYieldFragment ( root, component ) {
	var text = createText( "Home" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendernav1YieldFragment1 ( root, component ) {
	var navItem_yieldFragment = rendernavItemYieldFragment5( root, component );
	
	var navItem = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem_yieldFragment
	});
	
	var text = createText( "\n      " );
	var navItem1_yieldFragment = rendernavItem1YieldFragment5( root, component );
	
	var navItem1 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem1_yieldFragment
	});
	
	var text1 = createText( "\n      " );
	var navItem2_yieldFragment = rendernavItem2YieldFragment5( root, component );
	
	var navItem2 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem2_yieldFragment
	});
	
	var text2 = createText( "\n      " );
	var navItem3_yieldFragment = rendernavItem3YieldFragment2( root, component );
	
	var navItem3 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem3_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			navItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navItem1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			navItem2._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			navItem3._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			navItem_yieldFragment.update( changed, root );
			navItem1_yieldFragment.update( changed, root );
			navItem2_yieldFragment.update( changed, root );
			navItem3_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			navItem.destroy( detach );
			navItem1.destroy( detach );
			navItem2.destroy( detach );
			navItem3.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
			}
		}
	};
}

function rendernavItem3YieldFragment2 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link disabled";
	a.href = "#";
	
	appendNode( createText( "Rufus Xavier Sarsaparilla" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem2YieldFragment5 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Is" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem1YieldFragment5 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	setAttribute( a, 'data-toggle', "tab" );
	a.href = "#profile";
	
	appendNode( createText( "Name" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItemYieldFragment5 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link active";
	setAttribute( a, 'data-toggle', "tab" );
	a.href = "#home";
	
	appendNode( createText( "My" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavYieldFragment2 ( root, component ) {
	var navItem_yieldFragment = rendernavItemYieldFragment4( root, component );
	
	var navItem = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem_yieldFragment
	});
	
	var text = createText( "\n      " );
	var navItem1_yieldFragment = rendernavItem1YieldFragment4( root, component );
	
	var navItem1 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem1_yieldFragment
	});
	
	var text1 = createText( "\n      " );
	var navItem2_yieldFragment = rendernavItem2YieldFragment4( root, component );
	
	var navItem2 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem2_yieldFragment
	});
	
	var text2 = createText( "\n      " );
	var navItem3_yieldFragment = rendernavItem3YieldFragment1( root, component );
	
	var navItem3 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem3_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			navItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navItem1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			navItem2._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			navItem3._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			navItem_yieldFragment.update( changed, root );
			navItem1_yieldFragment.update( changed, root );
			navItem2_yieldFragment.update( changed, root );
			navItem3_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			navItem.destroy( detach );
			navItem1.destroy( detach );
			navItem2.destroy( detach );
			navItem3.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
			}
		}
	};
}

function rendernavItem3YieldFragment1 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link disabled";
	a.href = "#";
	
	appendNode( createText( "Rufus Xavier Sarsaparilla" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem2YieldFragment4 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Is" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem1YieldFragment4 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	setAttribute( a, 'data-toggle', "tab" );
	a.href = "#profile";
	
	appendNode( createText( "Name" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItemYieldFragment4 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link active";
	setAttribute( a, 'data-toggle', "tab" );
	a.href = "#home";
	
	appendNode( createText( "My" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderrow8YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment6( root, component );
	
	var col_initialData = {
		lg: 6
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});
	
	var text = createText( "\n\n      " );
	var col1_yieldFragment = rendercol1YieldFragment3( root, component );
	
	var col1_initialData = {
		lg: 6
	};
	var col1 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col1_yieldFragment,
		data: col1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
			col1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
			col1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercol1YieldFragment3 ( root, component ) {
	var h2 = createElement( 'h2' );
	h2.id = "nav-pills";
	h2.className = "text-muted my-4";
	
	appendNode( createText( "Pills" ), h2 );
	var text1 = createText( "\n        " );
	var nav_yieldFragment = rendernavYieldFragment1( root, component );
	
	var nav_initialData = {
		pills: true
	};
	var nav = new template.components.Nav({
		target: null,
		_root: component._root || component,
		_yield: nav_yieldFragment,
		data: nav_initialData
	});
	
	var text2 = createText( "\n\n        " );
	
	var br = createElement( 'br' );
	
	var text3 = createText( "\n        " );
	
	var div = createElement( 'div' );
	div.className = "bs-component";
	
	var nav1_yieldFragment = rendernav1YieldFragment( root, component );
	
	var nav1_initialData = {
		pills: true,
		stacked: true
	};
	var nav1 = new template.components.Nav({
		target: div,
		_root: component._root || component,
		_yield: nav1_yieldFragment,
		data: nav1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text1, target, anchor );
			nav._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			insertNode( br, target, anchor );
			insertNode( text3, target, anchor );
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			nav_yieldFragment.update( changed, root );
			nav1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			nav.destroy( detach );
			nav1.destroy( false );
			
			if ( detach ) {
				detachNode( h2 );
				detachNode( text1 );
				detachNode( text2 );
				detachNode( br );
				detachNode( text3 );
				detachNode( div );
			}
		}
	};
}

function rendernav1YieldFragment ( root, component ) {
	var navItem_yieldFragment = rendernavItemYieldFragment3( root, component );
	
	var navItem = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem_yieldFragment
	});
	
	var text = createText( "\n            " );
	var navDropdown_yieldFragment = rendernavDropdownYieldFragment1( root, component );
	
	var navDropdown = new template.components.NavDropdown({
		target: null,
		_root: component._root || component,
		_yield: navDropdown_yieldFragment
	});
	
	var text1 = createText( "\n            " );
	var navItem1_yieldFragment = rendernavItem1YieldFragment3( root, component );
	
	var navItem1 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem1_yieldFragment
	});
	
	var text2 = createText( "\n            " );
	var navItem2_yieldFragment = rendernavItem2YieldFragment3( root, component );
	
	var navItem2 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem2_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			navItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navDropdown._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			navItem1._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			navItem2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			navItem_yieldFragment.update( changed, root );
			navDropdown_yieldFragment.update( changed, root );
			navItem1_yieldFragment.update( changed, root );
			navItem2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			navItem.destroy( detach );
			navDropdown.destroy( detach );
			navItem1.destroy( detach );
			navItem2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
			}
		}
	};
}

function rendernavItem2YieldFragment3 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link disabled";
	a.href = "#";
	
	appendNode( createText( "Disabled" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem1YieldFragment3 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Link" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavDropdownYieldFragment1 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link dropdown-toggle";
	setAttribute( a, 'data-toggle', "dropdown" );
	a.href = "#";
	setAttribute( a, 'role', "button" );
	setAttribute( a, 'aria-haspopup', "true" );
	setAttribute( a, 'aria-expanded', "false" );
	
	appendNode( createText( "Dropdown" ), a );
	var text1 = createText( "\n              " );
	
	var div = createElement( 'div' );
	div.className = "dropdown-menu";
	
	var a1 = createElement( 'a' );
	a1.className = "dropdown-item";
	a1.href = "#";
	
	appendNode( a1, div );
	appendNode( createText( "Action" ), a1 );
	appendNode( createText( "\n                " ), div );
	
	var a2 = createElement( 'a' );
	a2.className = "dropdown-item";
	a2.href = "#";
	
	appendNode( a2, div );
	appendNode( createText( "Another action" ), a2 );
	appendNode( createText( "\n                " ), div );
	
	var a3 = createElement( 'a' );
	a3.className = "dropdown-item";
	a3.href = "#";
	
	appendNode( a3, div );
	appendNode( createText( "Something else here" ), a3 );
	appendNode( createText( "\n                " ), div );
	
	var div1 = createElement( 'div' );
	div1.className = "dropdown-divider";
	
	appendNode( div1, div );
	appendNode( createText( "\n                " ), div );
	
	var a4 = createElement( 'a' );
	a4.className = "dropdown-item";
	a4.href = "#";
	
	appendNode( a4, div );
	appendNode( createText( "Separated link" ), a4 );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( div, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
				detachNode( text1 );
				detachNode( div );
			}
		}
	};
}

function rendernavItemYieldFragment3 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link active";
	a.href = "#";
	
	appendNode( createText( "Active" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavYieldFragment1 ( root, component ) {
	var navItem_yieldFragment = rendernavItemYieldFragment2( root, component );
	
	var navItem = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem_yieldFragment
	});
	
	var text = createText( "\n          " );
	var navDropdown_yieldFragment = rendernavDropdownYieldFragment( root, component );
	
	var navDropdown = new template.components.NavDropdown({
		target: null,
		_root: component._root || component,
		_yield: navDropdown_yieldFragment
	});
	
	var text1 = createText( "\n          " );
	var navItem1_yieldFragment = rendernavItem1YieldFragment2( root, component );
	
	var navItem1 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem1_yieldFragment
	});
	
	var text2 = createText( "\n          " );
	var navItem2_yieldFragment = rendernavItem2YieldFragment2( root, component );
	
	var navItem2 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem2_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			navItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navDropdown._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			navItem1._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			navItem2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			navItem_yieldFragment.update( changed, root );
			navDropdown_yieldFragment.update( changed, root );
			navItem1_yieldFragment.update( changed, root );
			navItem2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			navItem.destroy( detach );
			navDropdown.destroy( detach );
			navItem1.destroy( detach );
			navItem2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
			}
		}
	};
}

function rendernavItem2YieldFragment2 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link disabled";
	a.href = "#";
	
	appendNode( createText( "Disabled" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem1YieldFragment2 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Link" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavDropdownYieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link dropdown-toggle";
	setAttribute( a, 'data-toggle', "dropdown" );
	a.href = "#";
	setAttribute( a, 'role', "button" );
	setAttribute( a, 'aria-haspopup', "true" );
	setAttribute( a, 'aria-expanded', "false" );
	
	appendNode( createText( "Dropdown" ), a );
	var text1 = createText( "\n            " );
	
	var div = createElement( 'div' );
	div.className = "dropdown-menu";
	
	var a1 = createElement( 'a' );
	a1.className = "dropdown-item";
	a1.href = "#";
	
	appendNode( a1, div );
	appendNode( createText( "Action" ), a1 );
	appendNode( createText( "\n              " ), div );
	
	var a2 = createElement( 'a' );
	a2.className = "dropdown-item";
	a2.href = "#";
	
	appendNode( a2, div );
	appendNode( createText( "Another action" ), a2 );
	appendNode( createText( "\n              " ), div );
	
	var a3 = createElement( 'a' );
	a3.className = "dropdown-item";
	a3.href = "#";
	
	appendNode( a3, div );
	appendNode( createText( "Something else here" ), a3 );
	appendNode( createText( "\n              " ), div );
	
	var div1 = createElement( 'div' );
	div1.className = "dropdown-divider";
	
	appendNode( div1, div );
	appendNode( createText( "\n              " ), div );
	
	var a4 = createElement( 'a' );
	a4.className = "dropdown-item";
	a4.href = "#";
	
	appendNode( a4, div );
	appendNode( createText( "Separated link" ), a4 );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( div, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
				detachNode( text1 );
				detachNode( div );
			}
		}
	};
}

function rendernavItemYieldFragment2 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link active";
	a.href = "#";
	
	appendNode( createText( "Active" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendercolYieldFragment6 ( root, component ) {
	var h2 = createElement( 'h2' );
	h2.id = "nav-tabs";
	h2.className = "text-muted my-4";
	
	appendNode( createText( "Tabs" ), h2 );
	var text1 = createText( "\n        " );
	
	var div = createElement( 'div' );
	div.className = "bs-component";
	
	var nav_yieldFragment = rendernavYieldFragment( root, component );
	
	var nav_initialData = {
		tabs: true
	};
	var nav = new template.components.Nav({
		target: div,
		_root: component._root || component,
		_yield: nav_yieldFragment,
		data: nav_initialData
	});
	
	appendNode( createText( "\n          " ), div );
	
	var div1 = createElement( 'div' );
	div1.id = "myTabContent";
	div1.className = "tab-content";
	
	appendNode( div1, div );
	
	var div2 = createElement( 'div' );
	div2.className = "tab-pane fade active in";
	div2.id = "home";
	
	appendNode( div2, div1 );
	
	var p = createElement( 'p' );
	
	appendNode( p, div2 );
	appendNode( createText( "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui." ), p );
	appendNode( createText( "\n            " ), div1 );
	
	var div3 = createElement( 'div' );
	div3.className = "tab-pane fade";
	div3.id = "profile";
	
	appendNode( div3, div1 );
	
	var p1 = createElement( 'p' );
	
	appendNode( p1, div3 );
	appendNode( createText( "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit." ), p1 );
	appendNode( createText( "\n            " ), div1 );
	
	var div4 = createElement( 'div' );
	div4.className = "tab-pane fade";
	div4.id = "dropdown1";
	
	appendNode( div4, div1 );
	
	var p2 = createElement( 'p' );
	
	appendNode( p2, div4 );
	appendNode( createText( "Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork." ), p2 );
	appendNode( createText( "\n            " ), div1 );
	
	var div5 = createElement( 'div' );
	div5.className = "tab-pane fade";
	div5.id = "dropdown2";
	
	appendNode( div5, div1 );
	
	var p3 = createElement( 'p' );
	
	appendNode( p3, div5 );
	appendNode( createText( "Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin. Cred vinyl keffiyeh DIY salvia PBR, banh mi before they sold out farm-to-table VHS viral locavore cosby sweater." ), p3 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			nav_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			nav.destroy( false );
			
			if ( detach ) {
				detachNode( h2 );
				detachNode( text1 );
				detachNode( div );
			}
		}
	};
}

function rendernavYieldFragment ( root, component ) {
	var navItem_yieldFragment = rendernavItemYieldFragment1( root, component );
	
	var navItem = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem_yieldFragment
	});
	
	var text = createText( "\n            " );
	var navItem1_yieldFragment = rendernavItem1YieldFragment1( root, component );
	
	var navItem1 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem1_yieldFragment
	});
	
	var text1 = createText( "\n            " );
	var navItem2_yieldFragment = rendernavItem2YieldFragment1( root, component );
	
	var navItem2 = new template.components.NavItem({
		target: null,
		_root: component._root || component,
		_yield: navItem2_yieldFragment
	});
	
	var text2 = createText( "\n            " );
	
	var li = createElement( 'li' );
	li.className = "nav-item dropdown";
	
	var a = createElement( 'a' );
	a.className = "nav-link dropdown-toggle";
	setAttribute( a, 'data-toggle', "dropdown" );
	a.href = "#";
	setAttribute( a, 'role', "button" );
	setAttribute( a, 'aria-haspopup', "true" );
	setAttribute( a, 'aria-expanded', "false" );
	
	appendNode( a, li );
	appendNode( createText( "Dropdown" ), a );
	appendNode( createText( "\n              " ), li );
	
	var div = createElement( 'div' );
	div.className = "dropdown-menu";
	
	appendNode( div, li );
	
	var a1 = createElement( 'a' );
	a1.className = "dropdown-item";
	a1.href = "#";
	
	appendNode( a1, div );
	appendNode( createText( "Action" ), a1 );
	appendNode( createText( "\n                " ), div );
	
	var a2 = createElement( 'a' );
	a2.className = "dropdown-item";
	a2.href = "#";
	
	appendNode( a2, div );
	appendNode( createText( "Another action" ), a2 );
	appendNode( createText( "\n                " ), div );
	
	var a3 = createElement( 'a' );
	a3.className = "dropdown-item";
	a3.href = "#";
	
	appendNode( a3, div );
	appendNode( createText( "Something else here" ), a3 );
	appendNode( createText( "\n                " ), div );
	
	var div1 = createElement( 'div' );
	div1.className = "dropdown-divider";
	
	appendNode( div1, div );
	appendNode( createText( "\n                " ), div );
	
	var a4 = createElement( 'a' );
	a4.className = "dropdown-item";
	a4.href = "#";
	
	appendNode( a4, div );
	appendNode( createText( "Separated link" ), a4 );

	return {
		mount: function ( target, anchor ) {
			navItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			navItem1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			navItem2._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			insertNode( li, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			navItem_yieldFragment.update( changed, root );
			navItem1_yieldFragment.update( changed, root );
			navItem2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			navItem.destroy( detach );
			navItem1.destroy( detach );
			navItem2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
				detachNode( li );
			}
		}
	};
}

function rendernavItem2YieldFragment1 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link disabled";
	a.href = "#";
	
	appendNode( createText( "Disabled" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem1YieldFragment1 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	setAttribute( a, 'data-toggle', "tab" );
	a.href = "#profile";
	
	appendNode( createText( "Profile" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItemYieldFragment1 ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link active";
	setAttribute( a, 'data-toggle', "tab" );
	a.href = "#home";
	
	appendNode( createText( "Home" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderrow7YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment5( root, component );
	
	var col_initialData = {
		lg: 6
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});
	
	var text = createText( "\n\n      " );
	var col1_yieldFragment = rendercol1YieldFragment2( root, component );
	
	var col1_initialData = {
		lg: { size: 4, offset: 1 }
	};
	var col1 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col1_yieldFragment,
		data: col1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
			col1_yieldFragment.update( changed, root );
			
			var col1_changes = {};
			
			col1_changes.lg = { size: 4, offset: 1 };
			
			if ( Object.keys( col1_changes ).length ) col1.set( col1_changes );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
			col1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercol1YieldFragment2 ( root, component ) {
	var form_yieldFragment = renderformYieldFragment2( root, component );
	
	var form = new template.components.Form({
		target: null,
		_root: component._root || component,
		_yield: form_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			form._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			form_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			form.destroy( detach );
		}
	};
}

function renderformYieldFragment2 ( root, component ) {
	var formGroup_yieldFragment = renderformGroupYieldFragment( root, component );
	
	var formGroup = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup_yieldFragment
	});
	
	var text = createText( "\n\n          " );
	var formGroup1_yieldFragment = renderformGroup1YieldFragment( root, component );
	
	var formGroup1 = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup1_yieldFragment
	});
	
	var text1 = createText( "\n\n          " );
	var formGroup2_yieldFragment = renderformGroup2YieldFragment( root, component );
	
	var formGroup2_initialData = {
		color: "success"
	};
	var formGroup2 = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup2_yieldFragment,
		data: formGroup2_initialData
	});
	
	var text2 = createText( "\n\n          " );
	var formGroup3_yieldFragment = renderformGroup3YieldFragment( root, component );
	
	var formGroup3_initialData = {
		color: "warning"
	};
	var formGroup3 = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup3_yieldFragment,
		data: formGroup3_initialData
	});
	
	var text3 = createText( "\n\n          " );
	var formGroup4_yieldFragment = renderformGroup4YieldFragment( root, component );
	
	var formGroup4_initialData = {
		color: "danger"
	};
	var formGroup4 = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup4_yieldFragment,
		data: formGroup4_initialData
	});
	
	var text4 = createText( "\n\n          " );
	var formGroup5_yieldFragment = renderformGroup5YieldFragment( root, component );
	
	var formGroup5 = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup5_yieldFragment
	});
	
	var text5 = createText( "\n\n          " );
	var formGroup6_yieldFragment = renderformGroup6YieldFragment( root, component );
	
	var formGroup6 = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup6_yieldFragment
	});
	
	var text6 = createText( "\n\n          " );
	var formGroup7_yieldFragment = renderformGroup7YieldFragment( root, component );
	
	var formGroup7 = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup7_yieldFragment
	});
	
	var text7 = createText( "\n\n          " );
	var formGroup8_yieldFragment = renderformGroup8YieldFragment( root, component );
	
	var formGroup8 = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup8_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			formGroup._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			formGroup1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			formGroup2._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			formGroup3._fragment.mount( target, anchor );
			insertNode( text3, target, anchor );
			formGroup4._fragment.mount( target, anchor );
			insertNode( text4, target, anchor );
			formGroup5._fragment.mount( target, anchor );
			insertNode( text5, target, anchor );
			formGroup6._fragment.mount( target, anchor );
			insertNode( text6, target, anchor );
			formGroup7._fragment.mount( target, anchor );
			insertNode( text7, target, anchor );
			formGroup8._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			formGroup_yieldFragment.update( changed, root );
			formGroup1_yieldFragment.update( changed, root );
			formGroup2_yieldFragment.update( changed, root );
			formGroup3_yieldFragment.update( changed, root );
			formGroup4_yieldFragment.update( changed, root );
			formGroup5_yieldFragment.update( changed, root );
			formGroup6_yieldFragment.update( changed, root );
			formGroup7_yieldFragment.update( changed, root );
			formGroup8_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			formGroup.destroy( detach );
			formGroup1.destroy( detach );
			formGroup2.destroy( detach );
			formGroup3.destroy( detach );
			formGroup4.destroy( detach );
			formGroup5.destroy( detach );
			formGroup6.destroy( detach );
			formGroup7.destroy( detach );
			formGroup8.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
				detachNode( text3 );
				detachNode( text4 );
				detachNode( text5 );
				detachNode( text6 );
				detachNode( text7 );
			}
		}
	};
}

function renderformGroup8YieldFragment ( root, component ) {
	var label = createElement( 'label' );
	label.className = "control-label";
	
	appendNode( createText( "Input addons" ), label );
	var text1 = createText( "\n            " );
	var formGroup_yieldFragment = renderformGroupYieldFragment1( root, component );
	
	var formGroup = new template.components.FormGroup({
		target: null,
		_root: component._root || component,
		_yield: formGroup_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text1, target, anchor );
			formGroup._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			formGroup_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			formGroup.destroy( detach );
			
			if ( detach ) {
				detachNode( label );
				detachNode( text1 );
			}
		}
	};
}

function renderformGroupYieldFragment1 ( root, component ) {
	var label = createElement( 'label' );
	label.className = "sr-only";
	label.htmlFor = "exampleInputAmount";
	
	appendNode( createText( "Amount (in dollars)" ), label );
	var text1 = createText( "\n              " );
	var inputGroup_yieldFragment = renderinputGroupYieldFragment( root, component );
	
	var inputGroup = new template.components.InputGroup({
		target: null,
		_root: component._root || component,
		_yield: inputGroup_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text1, target, anchor );
			inputGroup._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			inputGroup_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			inputGroup.destroy( detach );
			
			if ( detach ) {
				detachNode( label );
				detachNode( text1 );
			}
		}
	};
}

function renderinputGroupYieldFragment ( root, component ) {
	var inputGroupAddon_yieldFragment = renderinputGroupAddonYieldFragment( root, component );
	
	var inputGroupAddon = new template.components.InputGroupAddon({
		target: null,
		_root: component._root || component,
		_yield: inputGroupAddon_yieldFragment
	});
	
	var text = createText( "\n                " );
	
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control";
	input.id = "exampleInputAmount";
	input.placeholder = "Amount";
	
	var text1 = createText( "\n                " );
	var inputGroupAddon1_yieldFragment = renderinputGroupAddon1YieldFragment( root, component );
	
	var inputGroupAddon1 = new template.components.InputGroupAddon({
		target: null,
		_root: component._root || component,
		_yield: inputGroupAddon1_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			inputGroupAddon._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text1, target, anchor );
			inputGroupAddon1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			inputGroupAddon_yieldFragment.update( changed, root );
			inputGroupAddon1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			inputGroupAddon.destroy( detach );
			inputGroupAddon1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( input );
				detachNode( text1 );
			}
		}
	};
}

function renderinputGroupAddon1YieldFragment ( root, component ) {
	var text = createText( ".00" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderinputGroupAddonYieldFragment ( root, component ) {
	var text = createText( "$" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderformGroup7YieldFragment ( root, component ) {
	var label = createElement( 'label' );
	label.className = "col-form-label col-form-label-sm";
	label.htmlFor = "inputSmall";
	
	appendNode( createText( "Small input" ), label );
	var text1 = createText( "\n            " );
	
	var input = createElement( 'input' );
	input.className = "form-control form-control-sm";
	input.type = "text";
	input.id = "inputSmall";

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( input, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text1 );
				detachNode( input );
			}
		}
	};
}

function renderformGroup6YieldFragment ( root, component ) {
	var label = createElement( 'label' );
	label.className = "col-form-label";
	label.htmlFor = "inputDefault";
	
	appendNode( createText( "Default input" ), label );
	var text1 = createText( "\n            " );
	
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control";
	input.id = "inputDefault";

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( input, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text1 );
				detachNode( input );
			}
		}
	};
}

function renderformGroup5YieldFragment ( root, component ) {
	var label = createElement( 'label' );
	label.className = "col-form-label col-form-label-lg";
	label.htmlFor = "inputLarge";
	
	appendNode( createText( "Large input" ), label );
	var text1 = createText( "\n            " );
	
	var input = createElement( 'input' );
	input.className = "form-control form-control-lg";
	input.type = "text";
	input.id = "inputLarge";

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( input, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text1 );
				detachNode( input );
			}
		}
	};
}

function renderformGroup4YieldFragment ( root, component ) {
	var label = createElement( 'label' );
	label.className = "form-control-label";
	label.htmlFor = "inputDanger1";
	
	appendNode( createText( "Input with danger" ), label );
	var text1 = createText( "\n            " );
	
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control form-control-danger";
	input.id = "inputDanger1";
	
	var text2 = createText( "\n            " );
	
	var div = createElement( 'div' );
	div.className = "form-control-feedback";
	
	appendNode( createText( "Sorry, that username's taken. Try another?" ), div );

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text2, target, anchor );
			insertNode( div, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text1 );
				detachNode( input );
				detachNode( text2 );
				detachNode( div );
			}
		}
	};
}

function renderformGroup3YieldFragment ( root, component ) {
	var label = createElement( 'label' );
	label.className = "form-control-label";
	label.htmlFor = "inputWarning1";
	
	appendNode( createText( "Input with warning" ), label );
	var text1 = createText( "\n            " );
	
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control form-control-warning";
	input.id = "inputWarning1";
	
	var text2 = createText( "\n            " );
	
	var div = createElement( 'div' );
	div.className = "form-control-feedback";
	
	appendNode( createText( "Shucks, try again." ), div );

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text2, target, anchor );
			insertNode( div, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text1 );
				detachNode( input );
				detachNode( text2 );
				detachNode( div );
			}
		}
	};
}

function renderformGroup2YieldFragment ( root, component ) {
	var label = createElement( 'label' );
	label.className = "form-control-label";
	label.htmlFor = "inputSuccess1";
	
	appendNode( createText( "Input with success" ), label );
	var text1 = createText( "\n            " );
	
	var input = createElement( 'input' );
	input.type = "text";
	input.className = "form-control form-control-success";
	input.id = "inputSuccess1";
	
	var text2 = createText( "\n            " );
	
	var div = createElement( 'div' );
	div.className = "form-control-feedback";
	
	appendNode( createText( "Success! You've done it." ), div );

	return {
		mount: function ( target, anchor ) {
			insertNode( label, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( text2, target, anchor );
			insertNode( div, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( label );
				detachNode( text1 );
				detachNode( input );
				detachNode( text2 );
				detachNode( div );
			}
		}
	};
}

function renderformGroup1YieldFragment ( root, component ) {
	var fieldset = createElement( 'fieldset' );
	
	var label = createElement( 'label' );
	label.className = "control-label";
	label.htmlFor = "readOnlyInput";
	
	appendNode( label, fieldset );
	appendNode( createText( "Readonly input" ), label );
	appendNode( createText( "\n              " ), fieldset );
	
	var input = createElement( 'input' );
	input.className = "form-control";
	input.id = "readOnlyInput";
	input.type = "text";
	input.placeholder = "Readonly input here…";
	input.readOnly = '';
	
	appendNode( input, fieldset );

	return {
		mount: function ( target, anchor ) {
			insertNode( fieldset, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( fieldset );
			}
		}
	};
}

function renderformGroupYieldFragment ( root, component ) {
	var fieldset = createElement( 'fieldset' );
	fieldset.disabled = '';
	
	var label = createElement( 'label' );
	label.className = "control-label";
	label.htmlFor = "disabledInput";
	
	appendNode( label, fieldset );
	appendNode( createText( "Disabled input" ), label );
	appendNode( createText( "\n              " ), fieldset );
	
	var input = createElement( 'input' );
	input.className = "form-control";
	input.id = "disabledInput";
	input.type = "text";
	input.placeholder = "Disabled input here...";
	input.disabled = '';
	
	appendNode( input, fieldset );

	return {
		mount: function ( target, anchor ) {
			insertNode( fieldset, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( fieldset );
			}
		}
	};
}

function rendercolYieldFragment5 ( root, component ) {
	var form_yieldFragment = renderformYieldFragment1( root, component );
	
	var form = new template.components.Form({
		target: null,
		_root: component._root || component,
		_yield: form_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			form._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			form_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			form.destroy( detach );
		}
	};
}

function renderformYieldFragment1 ( root, component ) {
	var fieldset = createElement( 'fieldset' );
	
	var legend = createElement( 'legend' );
	
	appendNode( legend, fieldset );
	appendNode( createText( "Legend" ), legend );
	appendNode( createText( "\n            " ), fieldset );
	
	var div = createElement( 'div' );
	div.className = "form-group";
	
	appendNode( div, fieldset );
	
	var label = createElement( 'label' );
	label.htmlFor = "exampleInputEmail1";
	
	appendNode( label, div );
	appendNode( createText( "Email address" ), label );
	appendNode( createText( "\n              " ), div );
	
	var input = createElement( 'input' );
	input.type = "email";
	input.className = "form-control";
	input.id = "exampleInputEmail1";
	setAttribute( input, 'aria-describedby', "emailHelp" );
	input.placeholder = "Enter email";
	
	appendNode( input, div );
	appendNode( createText( "\n              " ), div );
	
	var small = createElement( 'small' );
	small.id = "emailHelp";
	small.className = "form-text text-muted";
	
	appendNode( small, div );
	appendNode( createText( "We'll never share your email with anyone else." ), small );
	appendNode( createText( "\n            " ), fieldset );
	
	var div1 = createElement( 'div' );
	div1.className = "form-group";
	
	appendNode( div1, fieldset );
	
	var label1 = createElement( 'label' );
	label1.htmlFor = "exampleInputPassword1";
	
	appendNode( label1, div1 );
	appendNode( createText( "Password" ), label1 );
	appendNode( createText( "\n              " ), div1 );
	
	var input1 = createElement( 'input' );
	input1.type = "password";
	input1.className = "form-control";
	input1.id = "exampleInputPassword1";
	input1.placeholder = "Password";
	
	appendNode( input1, div1 );
	appendNode( createText( "\n            " ), fieldset );
	
	var div2 = createElement( 'div' );
	div2.className = "form-group";
	
	appendNode( div2, fieldset );
	
	var label2 = createElement( 'label' );
	label2.htmlFor = "exampleSelect1";
	
	appendNode( label2, div2 );
	appendNode( createText( "Example select" ), label2 );
	appendNode( createText( "\n              " ), div2 );
	
	var select = createElement( 'select' );
	select.className = "form-control";
	select.id = "exampleSelect1";
	
	appendNode( select, div2 );
	
	var option = createElement( 'option' );
	
	appendNode( option, select );
	appendNode( createText( "1" ), option );
	
	option.__value = option.textContent;
	
	appendNode( createText( "\n                    " ), select );
	
	var option1 = createElement( 'option' );
	
	appendNode( option1, select );
	appendNode( createText( "2" ), option1 );
	
	option1.__value = option1.textContent;
	
	appendNode( createText( "\n                    " ), select );
	
	var option2 = createElement( 'option' );
	
	appendNode( option2, select );
	appendNode( createText( "3" ), option2 );
	
	option2.__value = option2.textContent;
	
	appendNode( createText( "\n                    " ), select );
	
	var option3 = createElement( 'option' );
	
	appendNode( option3, select );
	appendNode( createText( "4" ), option3 );
	
	option3.__value = option3.textContent;
	
	appendNode( createText( "\n                    " ), select );
	
	var option4 = createElement( 'option' );
	
	appendNode( option4, select );
	appendNode( createText( "5" ), option4 );
	
	option4.__value = option4.textContent;
	
	appendNode( createText( "\n            " ), fieldset );
	
	var div3 = createElement( 'div' );
	div3.className = "form-group";
	
	appendNode( div3, fieldset );
	
	var label3 = createElement( 'label' );
	label3.htmlFor = "exampleSelect2";
	
	appendNode( label3, div3 );
	appendNode( createText( "Example multiple select" ), label3 );
	appendNode( createText( "\n              " ), div3 );
	
	var select1 = createElement( 'select' );
	select1.multiple = '';
	select1.className = "form-control";
	select1.id = "exampleSelect2";
	
	appendNode( select1, div3 );
	
	var option5 = createElement( 'option' );
	
	appendNode( option5, select1 );
	appendNode( createText( "1" ), option5 );
	
	option5.__value = option5.textContent;
	
	appendNode( createText( "\n                    " ), select1 );
	
	var option6 = createElement( 'option' );
	
	appendNode( option6, select1 );
	appendNode( createText( "2" ), option6 );
	
	option6.__value = option6.textContent;
	
	appendNode( createText( "\n                    " ), select1 );
	
	var option7 = createElement( 'option' );
	
	appendNode( option7, select1 );
	appendNode( createText( "3" ), option7 );
	
	option7.__value = option7.textContent;
	
	appendNode( createText( "\n                    " ), select1 );
	
	var option8 = createElement( 'option' );
	
	appendNode( option8, select1 );
	appendNode( createText( "4" ), option8 );
	
	option8.__value = option8.textContent;
	
	appendNode( createText( "\n                    " ), select1 );
	
	var option9 = createElement( 'option' );
	
	appendNode( option9, select1 );
	appendNode( createText( "5" ), option9 );
	
	option9.__value = option9.textContent;
	
	appendNode( createText( "\n            " ), fieldset );
	
	var div4 = createElement( 'div' );
	div4.className = "form-group";
	
	appendNode( div4, fieldset );
	
	var label4 = createElement( 'label' );
	label4.htmlFor = "exampleTextarea";
	
	appendNode( label4, div4 );
	appendNode( createText( "Example textarea" ), label4 );
	appendNode( createText( "\n              " ), div4 );
	
	var textarea = createElement( 'textarea' );
	textarea.className = "form-control";
	textarea.id = "exampleTextarea";
	textarea.rows = "3";
	
	appendNode( textarea, div4 );
	appendNode( createText( "\n            " ), fieldset );
	
	var div5 = createElement( 'div' );
	div5.className = "form-group";
	
	appendNode( div5, fieldset );
	
	var label5 = createElement( 'label' );
	label5.htmlFor = "exampleInputFile";
	
	appendNode( label5, div5 );
	appendNode( createText( "File input" ), label5 );
	appendNode( createText( "\n              " ), div5 );
	
	var input2 = createElement( 'input' );
	input2.type = "file";
	input2.className = "form-control-file";
	input2.id = "exampleInputFile";
	setAttribute( input2, 'aria-describedby', "fileHelp" );
	
	appendNode( input2, div5 );
	appendNode( createText( "\n              " ), div5 );
	
	var small1 = createElement( 'small' );
	small1.id = "fileHelp";
	small1.className = "form-text text-muted";
	
	appendNode( small1, div5 );
	appendNode( createText( "This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line." ), small1 );
	appendNode( createText( "\n            " ), fieldset );
	
	var fieldset1 = createElement( 'fieldset' );
	fieldset1.className = "form-group";
	
	appendNode( fieldset1, fieldset );
	
	var legend1 = createElement( 'legend' );
	
	appendNode( legend1, fieldset1 );
	appendNode( createText( "Radio buttons" ), legend1 );
	appendNode( createText( "\n              " ), fieldset1 );
	
	var div6 = createElement( 'div' );
	div6.className = "form-check";
	
	appendNode( div6, fieldset1 );
	
	var label6 = createElement( 'label' );
	label6.className = "form-check-label";
	
	appendNode( label6, div6 );
	
	var input3 = createElement( 'input' );
	input3.type = "radio";
	input3.className = "form-check-input";
	input3.name = "optionsRadios";
	input3.id = "optionsRadios1";
	input3.__value = "option1";
	input3.value = input3.__value;
	input3.checked = '';
	
	appendNode( input3, label6 );
	appendNode( createText( "\n                      Option one is this and that—be sure to include why it's great" ), label6 );
	appendNode( createText( "\n              " ), fieldset1 );
	
	var div7 = createElement( 'div' );
	div7.className = "form-check";
	
	appendNode( div7, fieldset1 );
	
	var label7 = createElement( 'label' );
	label7.className = "form-check-label";
	
	appendNode( label7, div7 );
	
	var input4 = createElement( 'input' );
	input4.type = "radio";
	input4.className = "form-check-input";
	input4.name = "optionsRadios";
	input4.id = "optionsRadios2";
	input4.__value = "option2";
	input4.value = input4.__value;
	
	appendNode( input4, label7 );
	appendNode( createText( "\n                      Option two can be something else and selecting it will deselect option one" ), label7 );
	appendNode( createText( "\n              " ), fieldset1 );
	
	var div8 = createElement( 'div' );
	div8.className = "form-check disabled";
	
	appendNode( div8, fieldset1 );
	
	var label8 = createElement( 'label' );
	label8.className = "form-check-label";
	
	appendNode( label8, div8 );
	
	var input5 = createElement( 'input' );
	input5.type = "radio";
	input5.className = "form-check-input";
	input5.name = "optionsRadios";
	input5.id = "optionsRadios3";
	input5.__value = "option3";
	input5.value = input5.__value;
	input5.disabled = '';
	
	appendNode( input5, label8 );
	appendNode( createText( "\n                      Option three is disabled" ), label8 );
	appendNode( createText( "\n            " ), fieldset );
	
	var div9 = createElement( 'div' );
	div9.className = "form-check";
	
	appendNode( div9, fieldset );
	
	var label9 = createElement( 'label' );
	label9.className = "form-check-label";
	
	appendNode( label9, div9 );
	
	var input6 = createElement( 'input' );
	input6.type = "checkbox";
	input6.className = "form-check-input";
	
	appendNode( input6, label9 );
	appendNode( createText( "\n                    Check me out" ), label9 );
	appendNode( createText( "\n            " ), fieldset );
	
	var button = createElement( 'button' );
	button.type = "submit";
	button.className = "btn btn-primary";
	
	appendNode( button, fieldset );
	appendNode( createText( "Submit" ), button );

	return {
		mount: function ( target, anchor ) {
			insertNode( fieldset, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			option.__value = option.textContent;
			
			option1.__value = option1.textContent;
			
			option2.__value = option2.textContent;
			
			option3.__value = option3.textContent;
			
			option4.__value = option4.textContent;
			
			option5.__value = option5.textContent;
			
			option6.__value = option6.textContent;
			
			option7.__value = option7.textContent;
			
			option8.__value = option8.textContent;
			
			option9.__value = option9.textContent;
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( fieldset );
			}
		}
	};
}

function renderrow6YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment4( root, component );
	
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
		}
	};
}

function rendercolYieldFragment4 ( root, component ) {
	var table_yieldFragment = rendertableYieldFragment( root, component );
	
	var table_initialData = {
		striped: true,
		hover: true,
		bordered: true,
		responsive: true
	};
	var table = new template.components.Table({
		target: null,
		_root: component._root || component,
		_yield: table_yieldFragment,
		data: table_initialData
	});

	return {
		mount: function ( target, anchor ) {
			table._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			table_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			table.destroy( detach );
		}
	};
}

function rendertableYieldFragment ( root, component ) {
	var thead = createElement( 'thead' );
	thead.className = "thead-inverse";
	
	var tr = createElement( 'tr' );
	
	appendNode( tr, thead );
	
	var th = createElement( 'th' );
	
	appendNode( th, tr );
	appendNode( createText( "#" ), th );
	appendNode( createText( "\n                " ), tr );
	
	var th1 = createElement( 'th' );
	
	appendNode( th1, tr );
	appendNode( createText( "Column heading" ), th1 );
	appendNode( createText( "\n                " ), tr );
	
	var th2 = createElement( 'th' );
	
	appendNode( th2, tr );
	appendNode( createText( "Column heading" ), th2 );
	appendNode( createText( "\n                " ), tr );
	
	var th3 = createElement( 'th' );
	
	appendNode( th3, tr );
	appendNode( createText( "Column heading" ), th3 );
	var text7 = createText( "\n            " );
	
	var tbody = createElement( 'tbody' );
	
	var tr1 = createElement( 'tr' );
	
	appendNode( tr1, tbody );
	
	var td = createElement( 'td' );
	
	appendNode( td, tr1 );
	appendNode( createText( "1" ), td );
	appendNode( createText( "\n                " ), tr1 );
	
	var td1 = createElement( 'td' );
	
	appendNode( td1, tr1 );
	appendNode( createText( "Column content" ), td1 );
	appendNode( createText( "\n                " ), tr1 );
	
	var td2 = createElement( 'td' );
	
	appendNode( td2, tr1 );
	appendNode( createText( "Column content" ), td2 );
	appendNode( createText( "\n                " ), tr1 );
	
	var td3 = createElement( 'td' );
	
	appendNode( td3, tr1 );
	appendNode( createText( "Column content" ), td3 );
	appendNode( createText( "\n              " ), tbody );
	
	var tr2 = createElement( 'tr' );
	
	appendNode( tr2, tbody );
	
	var td4 = createElement( 'td' );
	
	appendNode( td4, tr2 );
	appendNode( createText( "2" ), td4 );
	appendNode( createText( "\n                " ), tr2 );
	
	var td5 = createElement( 'td' );
	
	appendNode( td5, tr2 );
	appendNode( createText( "Column content" ), td5 );
	appendNode( createText( "\n                " ), tr2 );
	
	var td6 = createElement( 'td' );
	
	appendNode( td6, tr2 );
	appendNode( createText( "Column content" ), td6 );
	appendNode( createText( "\n                " ), tr2 );
	
	var td7 = createElement( 'td' );
	
	appendNode( td7, tr2 );
	appendNode( createText( "Column content" ), td7 );
	appendNode( createText( "\n              " ), tbody );
	
	var tr3 = createElement( 'tr' );
	tr3.className = "table-info";
	
	appendNode( tr3, tbody );
	
	var td8 = createElement( 'td' );
	
	appendNode( td8, tr3 );
	appendNode( createText( "3" ), td8 );
	appendNode( createText( "\n                " ), tr3 );
	
	var td9 = createElement( 'td' );
	
	appendNode( td9, tr3 );
	appendNode( createText( "Column content" ), td9 );
	appendNode( createText( "\n                " ), tr3 );
	
	var td10 = createElement( 'td' );
	
	appendNode( td10, tr3 );
	appendNode( createText( "Column content" ), td10 );
	appendNode( createText( "\n                " ), tr3 );
	
	var td11 = createElement( 'td' );
	
	appendNode( td11, tr3 );
	appendNode( createText( "Column content" ), td11 );
	appendNode( createText( "\n              " ), tbody );
	
	var tr4 = createElement( 'tr' );
	tr4.className = "table-success";
	
	appendNode( tr4, tbody );
	
	var td12 = createElement( 'td' );
	
	appendNode( td12, tr4 );
	appendNode( createText( "4" ), td12 );
	appendNode( createText( "\n                " ), tr4 );
	
	var td13 = createElement( 'td' );
	
	appendNode( td13, tr4 );
	appendNode( createText( "Column content" ), td13 );
	appendNode( createText( "\n                " ), tr4 );
	
	var td14 = createElement( 'td' );
	
	appendNode( td14, tr4 );
	appendNode( createText( "Column content" ), td14 );
	appendNode( createText( "\n                " ), tr4 );
	
	var td15 = createElement( 'td' );
	
	appendNode( td15, tr4 );
	appendNode( createText( "Column content" ), td15 );
	appendNode( createText( "\n              " ), tbody );
	
	var tr5 = createElement( 'tr' );
	tr5.className = "table-danger";
	
	appendNode( tr5, tbody );
	
	var td16 = createElement( 'td' );
	
	appendNode( td16, tr5 );
	appendNode( createText( "5" ), td16 );
	appendNode( createText( "\n                " ), tr5 );
	
	var td17 = createElement( 'td' );
	
	appendNode( td17, tr5 );
	appendNode( createText( "Column content" ), td17 );
	appendNode( createText( "\n                " ), tr5 );
	
	var td18 = createElement( 'td' );
	
	appendNode( td18, tr5 );
	appendNode( createText( "Column content" ), td18 );
	appendNode( createText( "\n                " ), tr5 );
	
	var td19 = createElement( 'td' );
	
	appendNode( td19, tr5 );
	appendNode( createText( "Column content" ), td19 );
	appendNode( createText( "\n              " ), tbody );
	
	var tr6 = createElement( 'tr' );
	tr6.className = "table-warning";
	
	appendNode( tr6, tbody );
	
	var td20 = createElement( 'td' );
	
	appendNode( td20, tr6 );
	appendNode( createText( "6" ), td20 );
	appendNode( createText( "\n                " ), tr6 );
	
	var td21 = createElement( 'td' );
	
	appendNode( td21, tr6 );
	appendNode( createText( "Column content" ), td21 );
	appendNode( createText( "\n                " ), tr6 );
	
	var td22 = createElement( 'td' );
	
	appendNode( td22, tr6 );
	appendNode( createText( "Column content" ), td22 );
	appendNode( createText( "\n                " ), tr6 );
	
	var td23 = createElement( 'td' );
	
	appendNode( td23, tr6 );
	appendNode( createText( "Column content" ), td23 );
	appendNode( createText( "\n              " ), tbody );
	
	var tr7 = createElement( 'tr' );
	tr7.className = "table-active";
	
	appendNode( tr7, tbody );
	
	var td24 = createElement( 'td' );
	
	appendNode( td24, tr7 );
	appendNode( createText( "7" ), td24 );
	appendNode( createText( "\n                " ), tr7 );
	
	var td25 = createElement( 'td' );
	
	appendNode( td25, tr7 );
	appendNode( createText( "Column content" ), td25 );
	appendNode( createText( "\n                " ), tr7 );
	
	var td26 = createElement( 'td' );
	
	appendNode( td26, tr7 );
	appendNode( createText( "Column content" ), td26 );
	appendNode( createText( "\n                " ), tr7 );
	
	var td27 = createElement( 'td' );
	
	appendNode( td27, tr7 );
	appendNode( createText( "Column content" ), td27 );

	return {
		mount: function ( target, anchor ) {
			insertNode( thead, target, anchor );
			insertNode( text7, target, anchor );
			insertNode( tbody, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( thead );
				detachNode( text7 );
				detachNode( tbody );
			}
		}
	};
}

function renderrow5YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment3( root, component );
	
	var col_initialData = {
		lg: 6
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});
	
	var text = createText( "\n      " );
	var col1_yieldFragment = rendercol1YieldFragment1( root, component );
	
	var col1_initialData = {
		lg: 6
	};
	var col1 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col1_yieldFragment,
		data: col1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
			col1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
			col1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercol1YieldFragment1 ( root, component ) {
	var blockquote = createElement( 'blockquote' );
	blockquote.className = "blockquote blockquote-reverse";
	
	var p = createElement( 'p' );
	
	appendNode( p, blockquote );
	appendNode( createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." ), p );
	appendNode( createText( "\n          " ), blockquote );
	
	var footer = createElement( 'footer' );
	footer.className = "blockquote-footer";
	
	appendNode( footer, blockquote );
	appendNode( createText( "Someone famous in " ), footer );
	
	var cite = createElement( 'cite' );
	cite.title = "Source Title";
	
	appendNode( cite, footer );
	appendNode( createText( "Source Title" ), cite );

	return {
		mount: function ( target, anchor ) {
			insertNode( blockquote, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( blockquote );
			}
		}
	};
}

function rendercolYieldFragment3 ( root, component ) {
	var blockquote = createElement( 'blockquote' );
	blockquote.className = "blockquote";
	
	var p = createElement( 'p' );
	
	appendNode( p, blockquote );
	appendNode( createText( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante." ), p );
	appendNode( createText( "\n          " ), blockquote );
	
	var footer = createElement( 'footer' );
	footer.className = "blockquote-footer";
	
	appendNode( footer, blockquote );
	appendNode( createText( "Someone famous in " ), footer );
	
	var cite = createElement( 'cite' );
	cite.title = "Source Title";
	
	appendNode( cite, footer );
	appendNode( createText( "Source Title" ), cite );

	return {
		mount: function ( target, anchor ) {
			insertNode( blockquote, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( blockquote );
			}
		}
	};
}

function renderrow4YieldFragment ( root, component ) {
	var div = createElement( 'div' );
	div.className = "col-lg-4";
	
	var div1 = createElement( 'div' );
	div1.className = "bs-component";
	
	appendNode( div1, div );
	
	var h1 = createElement( 'h1' );
	
	appendNode( h1, div1 );
	appendNode( createText( "Heading 1" ), h1 );
	appendNode( createText( "\n          " ), div1 );
	
	var h2 = createElement( 'h2' );
	
	appendNode( h2, div1 );
	appendNode( createText( "Heading 2" ), h2 );
	appendNode( createText( "\n          " ), div1 );
	
	var h3 = createElement( 'h3' );
	
	appendNode( h3, div1 );
	appendNode( createText( "Heading 3" ), h3 );
	appendNode( createText( "\n          " ), div1 );
	
	var h4 = createElement( 'h4' );
	
	appendNode( h4, div1 );
	appendNode( createText( "Heading 4" ), h4 );
	appendNode( createText( "\n          " ), div1 );
	
	var h5 = createElement( 'h5' );
	
	appendNode( h5, div1 );
	appendNode( createText( "Heading 5" ), h5 );
	appendNode( createText( "\n          " ), div1 );
	
	var h6 = createElement( 'h6' );
	
	appendNode( h6, div1 );
	appendNode( createText( "Heading 6" ), h6 );
	appendNode( createText( "\n          " ), div1 );
	
	var h31 = createElement( 'h3' );
	
	appendNode( h31, div1 );
	appendNode( createText( "Heading\n            " ), h31 );
	
	var small = createElement( 'small' );
	small.className = "text-muted";
	
	appendNode( small, h31 );
	appendNode( createText( "with muted text" ), small );
	appendNode( createText( "\n          " ), div1 );
	
	var p = createElement( 'p' );
	p.className = "lead";
	
	appendNode( p, div1 );
	appendNode( createText( "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor." ), p );
	var text16 = createText( "\n      " );
	
	var div2 = createElement( 'div' );
	div2.className = "col-lg-4";
	
	var div3 = createElement( 'div' );
	div3.className = "bs-component";
	
	appendNode( div3, div2 );
	
	var h21 = createElement( 'h2' );
	
	appendNode( h21, div3 );
	appendNode( createText( "Example body text" ), h21 );
	appendNode( createText( "\n          " ), div3 );
	
	var p1 = createElement( 'p' );
	
	appendNode( p1, div3 );
	appendNode( createText( "Nullam quis risus eget " ), p1 );
	
	var a = createElement( 'a' );
	a.href = "#";
	
	appendNode( a, p1 );
	appendNode( createText( "urna mollis ornare" ), a );
	appendNode( createText( " vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula." ), p1 );
	appendNode( createText( "\n          " ), div3 );
	
	var p2 = createElement( 'p' );
	
	appendNode( p2, div3 );
	
	var small1 = createElement( 'small' );
	
	appendNode( small1, p2 );
	appendNode( createText( "This line of text is meant to be treated as fine print." ), small1 );
	appendNode( createText( "\n          " ), div3 );
	
	var p3 = createElement( 'p' );
	
	appendNode( p3, div3 );
	appendNode( createText( "The following is " ), p3 );
	
	var strong = createElement( 'strong' );
	
	appendNode( strong, p3 );
	appendNode( createText( "rendered as bold text" ), strong );
	appendNode( createText( "." ), p3 );
	appendNode( createText( "\n          " ), div3 );
	
	var p4 = createElement( 'p' );
	
	appendNode( p4, div3 );
	appendNode( createText( "The following is " ), p4 );
	
	var em = createElement( 'em' );
	
	appendNode( em, p4 );
	appendNode( createText( "rendered as italicized text" ), em );
	appendNode( createText( "." ), p4 );
	appendNode( createText( "\n          " ), div3 );
	
	var p5 = createElement( 'p' );
	
	appendNode( p5, div3 );
	appendNode( createText( "An abbreviation of the word attribute is " ), p5 );
	
	var abbr = createElement( 'abbr' );
	abbr.title = "attribute";
	
	appendNode( abbr, p5 );
	appendNode( createText( "attr" ), abbr );
	appendNode( createText( "." ), p5 );
	var text36 = createText( "\n      " );
	
	var div4 = createElement( 'div' );
	div4.className = "col-lg-4";
	
	var div5 = createElement( 'div' );
	div5.className = "bs-component";
	
	appendNode( div5, div4 );
	
	var h22 = createElement( 'h2' );
	
	appendNode( h22, div5 );
	appendNode( createText( "Emphasis classes" ), h22 );
	appendNode( createText( "\n          " ), div5 );
	
	var p6 = createElement( 'p' );
	p6.className = "text-muted";
	
	appendNode( p6, div5 );
	appendNode( createText( "Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh." ), p6 );
	appendNode( createText( "\n          " ), div5 );
	
	var p7 = createElement( 'p' );
	p7.className = "text-primary";
	
	appendNode( p7, div5 );
	appendNode( createText( "Nullam id dolor id nibh ultricies vehicula ut id elit." ), p7 );
	appendNode( createText( "\n          " ), div5 );
	
	var p8 = createElement( 'p' );
	p8.className = "text-warning";
	
	appendNode( p8, div5 );
	appendNode( createText( "Etiam porta sem malesuada magna mollis euismod." ), p8 );
	appendNode( createText( "\n          " ), div5 );
	
	var p9 = createElement( 'p' );
	p9.className = "text-danger";
	
	appendNode( p9, div5 );
	appendNode( createText( "Donec ullamcorper nulla non metus auctor fringilla." ), p9 );
	appendNode( createText( "\n          " ), div5 );
	
	var p10 = createElement( 'p' );
	p10.className = "text-success";
	
	appendNode( p10, div5 );
	appendNode( createText( "Duis mollis, est non commodo luctus, nisi erat porttitor ligula." ), p10 );
	appendNode( createText( "\n          " ), div5 );
	
	var p11 = createElement( 'p' );
	p11.className = "text-info";
	
	appendNode( p11, div5 );
	appendNode( createText( "Maecenas sed diam eget risus varius blandit sit amet non magna." ), p11 );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			insertNode( text16, target, anchor );
			insertNode( div2, target, anchor );
			insertNode( text36, target, anchor );
			insertNode( div4, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( div );
				detachNode( text16 );
				detachNode( div2 );
				detachNode( text36 );
				detachNode( div4 );
			}
		}
	};
}

function renderrow3YieldFragment ( root, component ) {
	var div = createElement( 'div' );
	
	var h2 = createElement( 'h2' );
	h2.className = "text-muted my-4";
	
	appendNode( h2, div );
	appendNode( createText( "Dropdowns" ), h2 );
	appendNode( createText( "\n        " ), div );
	
	var h4 = createElement( 'h4' );
	h4.className = "text-muted";
	
	appendNode( h4, div );
	appendNode( createText( "Dropdown" ), h4 );
	appendNode( createText( "\n\n        " ), div );
	var dropdown_yieldFragment = renderdropdownYieldFragment( root, component );
	
	var dropdown_initialData = {
		open: root.open
	};
	var dropdown = new template.components.Dropdown({
		target: div,
		_root: component._root || component,
		_yield: dropdown_yieldFragment,
		data: dropdown_initialData
	});
	
	appendNode( createText( "\n\n        " ), div );
	
	var h41 = createElement( 'h4' );
	h41.className = "text-muted";
	
	appendNode( h41, div );
	appendNode( createText( "Dropup" ), h41 );
	appendNode( createText( "\n\n        " ), div );
	var dropdown1_yieldFragment = renderdropdown1YieldFragment( root, component );
	
	var dropdown1_initialData = {
		dropup: true,
		open: root.open2
	};
	var dropdown1 = new template.components.Dropdown({
		target: div,
		_root: component._root || component,
		_yield: dropdown1_yieldFragment,
		data: dropdown1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			dropdown_yieldFragment.update( changed, root );
			
			var dropdown_changes = {};
			
			if ( 'open' in changed ) dropdown_changes.open = root.open;
			
			if ( Object.keys( dropdown_changes ).length ) dropdown.set( dropdown_changes );
			
			dropdown1_yieldFragment.update( changed, root );
			
			var dropdown1_changes = {};
			
			if ( 'open2' in changed ) dropdown1_changes.open = root.open2;
			
			if ( Object.keys( dropdown1_changes ).length ) dropdown1.set( dropdown1_changes );
		},
		
		teardown: function ( detach ) {
			dropdown.destroy( false );
			dropdown1.destroy( false );
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function renderdropdown1YieldFragment ( root, component ) {
	var button_yieldFragment = renderbuttonYieldFragment10( root, component );
	
	var button_initialData = {
		class: "dropdown-toggle",
		color: "success"
	};
	var button = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});
	
	button.on( 'click', function ( event ) {
		var root = this._context.root;
		
		component.set({ open2: !root.open2 });
	});
	
	button._context = {
		root: root
	};
	
	var text = createText( "\n          " );
	var dropdownMenu_yieldFragment = renderdropdownMenuYieldFragment1( root, component );
	
	var dropdownMenu = new template.components.DropdownMenu({
		target: null,
		_root: component._root || component,
		_yield: dropdownMenu_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			button._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownMenu._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
			
			button._context.root = root;
			
			dropdownMenu_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( detach );
			dropdownMenu.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderdropdownMenuYieldFragment1 ( root, component ) {
	var dropdownItem_yieldFragment = renderdropdownItemYieldFragment1( root, component );
	
	var dropdownItem = new template.components.DropdownItem({
		target: null,
		_root: component._root || component,
		_yield: dropdownItem_yieldFragment
	});
	
	var text = createText( "\n            " );
	var dropdownItem1_yieldFragment = renderdropdownItem1YieldFragment1( root, component );
	
	var dropdownItem1 = new template.components.DropdownItem({
		target: null,
		_root: component._root || component,
		_yield: dropdownItem1_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			dropdownItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownItem1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			dropdownItem_yieldFragment.update( changed, root );
			dropdownItem1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			dropdownItem.destroy( detach );
			dropdownItem1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderdropdownItem1YieldFragment1 ( root, component ) {
	var text = createText( "Dropdown link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderdropdownItemYieldFragment1 ( root, component ) {
	var text = createText( "Dropdown link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment10 ( root, component ) {
	var text = createText( "Dropup" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderdropdownYieldFragment ( root, component ) {
	var button_yieldFragment = renderbuttonYieldFragment9( root, component );
	
	var button_initialData = {
		class: "dropdown-toggle",
		color: "primary"
	};
	var button = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});
	
	button.on( 'click', function ( event ) {
		var root = this._context.root;
		
		component.set({ open: !root.open });
	});
	
	button._context = {
		root: root
	};
	
	var text = createText( "\n          " );
	var dropdownMenu_yieldFragment = renderdropdownMenuYieldFragment( root, component );
	
	var dropdownMenu = new template.components.DropdownMenu({
		target: null,
		_root: component._root || component,
		_yield: dropdownMenu_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			button._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownMenu._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
			
			button._context.root = root;
			
			dropdownMenu_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( detach );
			dropdownMenu.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderdropdownMenuYieldFragment ( root, component ) {
	var dropdownHeader_yieldFragment = renderdropdownHeaderYieldFragment( root, component );
	
	var dropdownHeader = new template.components.DropdownHeader({
		target: null,
		_root: component._root || component,
		_yield: dropdownHeader_yieldFragment
	});
	
	var text = createText( "\n            " );
	var dropdownItem_yieldFragment = renderdropdownItemYieldFragment( root, component );
	
	var dropdownItem = new template.components.DropdownItem({
		target: null,
		_root: component._root || component,
		_yield: dropdownItem_yieldFragment
	});
	
	var text1 = createText( "\n            " );
	
	var dropdownDivider = new template.components.DropdownDivider({
		target: null,
		_root: component._root || component
	});
	
	var text2 = createText( "\n            " );
	var dropdownItem1_yieldFragment = renderdropdownItem1YieldFragment( root, component );
	
	var dropdownItem1 = new template.components.DropdownItem({
		target: null,
		_root: component._root || component,
		_yield: dropdownItem1_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			dropdownHeader._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			dropdownItem._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			dropdownDivider._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			dropdownItem1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			dropdownHeader_yieldFragment.update( changed, root );
			dropdownItem_yieldFragment.update( changed, root );
			dropdownItem1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			dropdownHeader.destroy( detach );
			dropdownItem.destroy( detach );
			dropdownDivider.destroy( detach );
			dropdownItem1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
			}
		}
	};
}

function renderdropdownItem1YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	
	appendNode( createText( "Dropdown link" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderdropdownItemYieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	
	appendNode( createText( "Dropdown link" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderdropdownHeaderYieldFragment ( root, component ) {
	var text = createText( "Heading" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment9 ( root, component ) {
	var text = createText( "Dropdown" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderrow2YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment2( root, component );
	
	var col_initialData = {
		lg: 7
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});
	
	var text = createText( "\n      " );
	var col1_yieldFragment = rendercol1YieldFragment( root, component );
	
	var col1_initialData = {
		lg: 5
	};
	var col1 = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col1_yieldFragment,
		data: col1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			col1._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
			col1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
			col1.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercol1YieldFragment ( root, component ) {
	var p = createElement( 'p' );
	p.className = "bs-component";
	
	var button_yieldFragment = renderbuttonYieldFragment3( root, component );
	
	var button_initialData = {
		color: "primary",
		size: "lg",
		block: true
	};
	var button = new template.components.Button({
		target: p,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});
	
	var text = createText( "\n\n        " );
	
	var div = createElement( 'div' );
	div.className = "bs-component mb-1";
	
	var div1 = createElement( 'div' );
	div1.className = "btn-group";
	setAttribute( div1, 'data-toggle', "buttons" );
	
	appendNode( div1, div );
	
	var label = createElement( 'label' );
	label.className = "btn btn-primary active";
	
	appendNode( label, div1 );
	
	var input = createElement( 'input' );
	input.type = "checkbox";
	input.checked = '';
	
	appendNode( input, label );
	appendNode( createText( " Checkbox 1" ), label );
	appendNode( createText( "\n            " ), div1 );
	
	var label1 = createElement( 'label' );
	label1.className = "btn btn-primary";
	
	appendNode( label1, div1 );
	
	var input1 = createElement( 'input' );
	input1.type = "checkbox";
	
	appendNode( input1, label1 );
	appendNode( createText( " Checkbox 2" ), label1 );
	appendNode( createText( "\n            " ), div1 );
	
	var label2 = createElement( 'label' );
	label2.className = "btn btn-primary";
	
	appendNode( label2, div1 );
	
	var input2 = createElement( 'input' );
	input2.type = "checkbox";
	
	appendNode( input2, label2 );
	appendNode( createText( " Checkbox 3" ), label2 );
	var text6 = createText( "\n\n        " );
	
	var div2 = createElement( 'div' );
	div2.className = "bs-component";
	div2.style.cssText = "margin-bottom: 15px;";
	
	var div3 = createElement( 'div' );
	div3.className = "btn-group";
	setAttribute( div3, 'data-toggle', "buttons" );
	
	appendNode( div3, div2 );
	
	var label3 = createElement( 'label' );
	label3.className = "btn btn-primary active";
	
	appendNode( label3, div3 );
	
	var input3 = createElement( 'input' );
	input3.type = "radio";
	input3.name = "options";
	input3.id = "option1";
	input3.checked = '';
	
	appendNode( input3, label3 );
	appendNode( createText( " Radio 1" ), label3 );
	appendNode( createText( "\n            " ), div3 );
	
	var label4 = createElement( 'label' );
	label4.className = "btn btn-primary";
	
	appendNode( label4, div3 );
	
	var input4 = createElement( 'input' );
	input4.type = "radio";
	input4.name = "options";
	input4.id = "option2";
	
	appendNode( input4, label4 );
	appendNode( createText( " Radio 2" ), label4 );
	appendNode( createText( "\n            " ), div3 );
	
	var label5 = createElement( 'label' );
	label5.className = "btn btn-primary";
	
	appendNode( label5, div3 );
	
	var input5 = createElement( 'input' );
	input5.type = "radio";
	input5.name = "options";
	input5.id = "option3";
	
	appendNode( input5, label5 );
	appendNode( createText( " Radio 3" ), label5 );
	var text12 = createText( "\n\n        " );
	
	var div4 = createElement( 'div' );
	div4.className = "bs-component";
	
	var buttonGroup_yieldFragment = renderbuttonGroupYieldFragment( root, component );
	
	var buttonGroup_initialData = {
		vertical: true
	};
	var buttonGroup = new template.components.ButtonGroup({
		target: div4,
		_root: component._root || component,
		_yield: buttonGroup_yieldFragment,
		data: buttonGroup_initialData
	});
	
	var text13 = createText( "\n\n        " );
	
	var div5 = createElement( 'div' );
	div5.className = "bs-component";
	div5.style.cssText = "margin-bottom: 15px;";
	
	var buttonGroup1_yieldFragment = renderbuttonGroup1YieldFragment( root, component );
	
	var buttonGroup1 = new template.components.ButtonGroup({
		target: div5,
		_root: component._root || component,
		_yield: buttonGroup1_yieldFragment
	});
	
	var text14 = createText( "\n\n        " );
	
	var div6 = createElement( 'div' );
	div6.className = "bs-component";
	div6.style.cssText = "margin-bottom: 15px;";
	
	var buttonToolbar_yieldFragment = renderbuttonToolbarYieldFragment( root, component );
	
	var buttonToolbar = new template.components.ButtonToolbar({
		target: div6,
		_root: component._root || component,
		_yield: buttonToolbar_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			insertNode( text, target, anchor );
			insertNode( div, target, anchor );
			insertNode( text6, target, anchor );
			insertNode( div2, target, anchor );
			insertNode( text12, target, anchor );
			insertNode( div4, target, anchor );
			insertNode( text13, target, anchor );
			insertNode( div5, target, anchor );
			insertNode( text14, target, anchor );
			insertNode( div6, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
			buttonGroup_yieldFragment.update( changed, root );
			buttonGroup1_yieldFragment.update( changed, root );
			buttonToolbar_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( false );
			buttonGroup.destroy( false );
			buttonGroup1.destroy( false );
			buttonToolbar.destroy( false );
			
			if ( detach ) {
				detachNode( p );
				detachNode( text );
				detachNode( div );
				detachNode( text6 );
				detachNode( div2 );
				detachNode( text12 );
				detachNode( div4 );
				detachNode( text13 );
				detachNode( div5 );
				detachNode( text14 );
				detachNode( div6 );
			}
		}
	};
}

function renderbuttonToolbarYieldFragment ( root, component ) {
	var buttonGroup_yieldFragment = renderbuttonGroupYieldFragment1( root, component );
	
	var buttonGroup = new template.components.ButtonGroup({
		target: null,
		_root: component._root || component,
		_yield: buttonGroup_yieldFragment
	});
	
	var text = createText( "\n            " );
	var buttonGroup1_yieldFragment = renderbuttonGroup1YieldFragment1( root, component );
	
	var buttonGroup1 = new template.components.ButtonGroup({
		target: null,
		_root: component._root || component,
		_yield: buttonGroup1_yieldFragment
	});
	
	var text1 = createText( "\n            " );
	var buttonGroup2_yieldFragment = renderbuttonGroup2YieldFragment( root, component );
	
	var buttonGroup2 = new template.components.ButtonGroup({
		target: null,
		_root: component._root || component,
		_yield: buttonGroup2_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			buttonGroup._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			buttonGroup1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			buttonGroup2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			buttonGroup_yieldFragment.update( changed, root );
			buttonGroup1_yieldFragment.update( changed, root );
			buttonGroup2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			buttonGroup.destroy( detach );
			buttonGroup1.destroy( detach );
			buttonGroup2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
			}
		}
	};
}

function renderbuttonGroup2YieldFragment ( root, component ) {
	var button_yieldFragment = renderbuttonYieldFragment8( root, component );
	
	var button_initialData = {
		color: "secondary"
	};
	var button = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});

	return {
		mount: function ( target, anchor ) {
			button._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( detach );
		}
	};
}

function renderbuttonYieldFragment8 ( root, component ) {
	var text = createText( "8" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonGroup1YieldFragment1 ( root, component ) {
	var button_yieldFragment = renderbuttonYieldFragment7( root, component );
	
	var button_initialData = {
		color: "secondary"
	};
	var button = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});
	
	var text = createText( "\n              " );
	var button1_yieldFragment = renderbutton1YieldFragment4( root, component );
	
	var button1_initialData = {
		color: "secondary"
	};
	var button1 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button1_yieldFragment,
		data: button1_initialData
	});
	
	var text1 = createText( "\n              " );
	var button2_yieldFragment = renderbutton2YieldFragment4( root, component );
	
	var button2_initialData = {
		color: "secondary"
	};
	var button2 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button2_yieldFragment,
		data: button2_initialData
	});

	return {
		mount: function ( target, anchor ) {
			button._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			button2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
			button1_yieldFragment.update( changed, root );
			button2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( detach );
			button1.destroy( detach );
			button2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
			}
		}
	};
}

function renderbutton2YieldFragment4 ( root, component ) {
	var text = createText( "7" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton1YieldFragment4 ( root, component ) {
	var text = createText( "6" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment7 ( root, component ) {
	var text = createText( "5" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonGroupYieldFragment1 ( root, component ) {
	var button_yieldFragment = renderbuttonYieldFragment6( root, component );
	
	var button_initialData = {
		color: "secondary"
	};
	var button = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});
	
	var text = createText( "\n              " );
	var button1_yieldFragment = renderbutton1YieldFragment3( root, component );
	
	var button1_initialData = {
		color: "secondary"
	};
	var button1 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button1_yieldFragment,
		data: button1_initialData
	});
	
	var text1 = createText( "\n              " );
	var button2_yieldFragment = renderbutton2YieldFragment3( root, component );
	
	var button2_initialData = {
		color: "secondary"
	};
	var button2 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button2_yieldFragment,
		data: button2_initialData
	});
	
	var text2 = createText( "\n              " );
	var button3_yieldFragment = renderbutton3YieldFragment2( root, component );
	
	var button3_initialData = {
		color: "secondary"
	};
	var button3 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button3_yieldFragment,
		data: button3_initialData
	});

	return {
		mount: function ( target, anchor ) {
			button._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			button2._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			button3._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
			button1_yieldFragment.update( changed, root );
			button2_yieldFragment.update( changed, root );
			button3_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( detach );
			button1.destroy( detach );
			button2.destroy( detach );
			button3.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
			}
		}
	};
}

function renderbutton3YieldFragment2 ( root, component ) {
	var text = createText( "4" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton2YieldFragment3 ( root, component ) {
	var text = createText( "3" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton1YieldFragment3 ( root, component ) {
	var text = createText( "2" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment6 ( root, component ) {
	var text = createText( "1" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonGroup1YieldFragment ( root, component ) {
	var button_yieldFragment = renderbuttonYieldFragment5( root, component );
	
	var button_initialData = {
		color: "secondary"
	};
	var button = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});
	
	var text = createText( "\n            " );
	var button1_yieldFragment = renderbutton1YieldFragment2( root, component );
	
	var button1_initialData = {
		color: "secondary"
	};
	var button1 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button1_yieldFragment,
		data: button1_initialData
	});
	
	var text1 = createText( "\n            " );
	var button2_yieldFragment = renderbutton2YieldFragment2( root, component );
	
	var button2_initialData = {
		color: "secondary"
	};
	var button2 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button2_yieldFragment,
		data: button2_initialData
	});

	return {
		mount: function ( target, anchor ) {
			button._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			button2._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
			button1_yieldFragment.update( changed, root );
			button2_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( detach );
			button1.destroy( detach );
			button2.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
			}
		}
	};
}

function renderbutton2YieldFragment2 ( root, component ) {
	var text = createText( "Right" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton1YieldFragment2 ( root, component ) {
	var text = createText( "Middle" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment5 ( root, component ) {
	var text = createText( "Left" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonGroupYieldFragment ( root, component ) {
	var button_yieldFragment = renderbuttonYieldFragment4( root, component );
	
	var button_initialData = {
		color: "primary"
	};
	var button = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});
	
	var text = createText( "\n            " );
	var button1_yieldFragment = renderbutton1YieldFragment1( root, component );
	
	var button1_initialData = {
		color: "primary"
	};
	var button1 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button1_yieldFragment,
		data: button1_initialData
	});
	
	var text1 = createText( "\n            " );
	var button2_yieldFragment = renderbutton2YieldFragment1( root, component );
	
	var button2_initialData = {
		color: "primary"
	};
	var button2 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button2_yieldFragment,
		data: button2_initialData
	});
	
	var text2 = createText( "\n            " );
	var button3_yieldFragment = renderbutton3YieldFragment1( root, component );
	
	var button3_initialData = {
		color: "primary"
	};
	var button3 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button3_yieldFragment,
		data: button3_initialData
	});
	
	var text3 = createText( "\n            " );
	var button4_yieldFragment = renderbutton4YieldFragment1( root, component );
	
	var button4_initialData = {
		color: "primary"
	};
	var button4 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button4_yieldFragment,
		data: button4_initialData
	});
	
	var text4 = createText( "\n            " );
	var button5_yieldFragment = renderbutton5YieldFragment1( root, component );
	
	var button5_initialData = {
		color: "primary"
	};
	var button5 = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button5_yieldFragment,
		data: button5_initialData
	});

	return {
		mount: function ( target, anchor ) {
			button._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			button1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			button2._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			button3._fragment.mount( target, anchor );
			insertNode( text3, target, anchor );
			button4._fragment.mount( target, anchor );
			insertNode( text4, target, anchor );
			button5._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
			button1_yieldFragment.update( changed, root );
			button2_yieldFragment.update( changed, root );
			button3_yieldFragment.update( changed, root );
			button4_yieldFragment.update( changed, root );
			button5_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( detach );
			button1.destroy( detach );
			button2.destroy( detach );
			button3.destroy( detach );
			button4.destroy( detach );
			button5.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
				detachNode( text3 );
				detachNode( text4 );
			}
		}
	};
}

function renderbutton5YieldFragment1 ( root, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton4YieldFragment1 ( root, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton3YieldFragment1 ( root, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton2YieldFragment1 ( root, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton1YieldFragment1 ( root, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment4 ( root, component ) {
	var text = createText( "Button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment3 ( root, component ) {
	var text = createText( "Block level button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendercolYieldFragment2 ( root, component ) {
	var p = createElement( 'p' );
	p.className = "bs-component";
	
	var button_yieldFragment = renderbuttonYieldFragment2( root, component );
	
	var button_initialData = {
		color: "primary"
	};
	var button = new template.components.Button({
		target: p,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});
	
	appendNode( createText( "\n          " ), p );
	var button1_yieldFragment = renderbutton1YieldFragment( root, component );
	
	var button1_initialData = {
		color: "secondary"
	};
	var button1 = new template.components.Button({
		target: p,
		_root: component._root || component,
		_yield: button1_yieldFragment,
		data: button1_initialData
	});
	
	appendNode( createText( "\n          " ), p );
	var button2_yieldFragment = renderbutton2YieldFragment( root, component );
	
	var button2_initialData = {
		color: "success"
	};
	var button2 = new template.components.Button({
		target: p,
		_root: component._root || component,
		_yield: button2_yieldFragment,
		data: button2_initialData
	});
	
	appendNode( createText( "\n          " ), p );
	var button3_yieldFragment = renderbutton3YieldFragment( root, component );
	
	var button3_initialData = {
		color: "info"
	};
	var button3 = new template.components.Button({
		target: p,
		_root: component._root || component,
		_yield: button3_yieldFragment,
		data: button3_initialData
	});
	
	appendNode( createText( "\n          " ), p );
	var button4_yieldFragment = renderbutton4YieldFragment( root, component );
	
	var button4_initialData = {
		color: "warning"
	};
	var button4 = new template.components.Button({
		target: p,
		_root: component._root || component,
		_yield: button4_yieldFragment,
		data: button4_initialData
	});
	
	appendNode( createText( "\n          " ), p );
	var button5_yieldFragment = renderbutton5YieldFragment( root, component );
	
	var button5_initialData = {
		color: "danger"
	};
	var button5 = new template.components.Button({
		target: p,
		_root: component._root || component,
		_yield: button5_yieldFragment,
		data: button5_initialData
	});
	
	appendNode( createText( "\n          " ), p );
	var button6_yieldFragment = renderbutton6YieldFragment( root, component );
	
	var button6_initialData = {
		color: "link"
	};
	var button6 = new template.components.Button({
		target: p,
		_root: component._root || component,
		_yield: button6_yieldFragment,
		data: button6_initialData
	});
	
	var text6 = createText( "\n\n        " );
	
	var p1 = createElement( 'p' );
	p1.className = "bs-component";
	
	var button7_yieldFragment = renderbutton7YieldFragment( root, component );
	
	var button7_initialData = {
		color: "primary",
		disabled: true
	};
	var button7 = new template.components.Button({
		target: p1,
		_root: component._root || component,
		_yield: button7_yieldFragment,
		data: button7_initialData
	});
	
	appendNode( createText( "\n          " ), p1 );
	var button8_yieldFragment = renderbutton8YieldFragment( root, component );
	
	var button8_initialData = {
		color: "secondary",
		disabled: true
	};
	var button8 = new template.components.Button({
		target: p1,
		_root: component._root || component,
		_yield: button8_yieldFragment,
		data: button8_initialData
	});
	
	appendNode( createText( "\n          " ), p1 );
	var button9_yieldFragment = renderbutton9YieldFragment( root, component );
	
	var button9_initialData = {
		color: "success",
		disabled: true
	};
	var button9 = new template.components.Button({
		target: p1,
		_root: component._root || component,
		_yield: button9_yieldFragment,
		data: button9_initialData
	});
	
	appendNode( createText( "\n          " ), p1 );
	var button10_yieldFragment = renderbutton10YieldFragment( root, component );
	
	var button10_initialData = {
		color: "info",
		disabled: true
	};
	var button10 = new template.components.Button({
		target: p1,
		_root: component._root || component,
		_yield: button10_yieldFragment,
		data: button10_initialData
	});
	
	appendNode( createText( "\n          " ), p1 );
	var button11_yieldFragment = renderbutton11YieldFragment( root, component );
	
	var button11_initialData = {
		color: "warning",
		disabled: true
	};
	var button11 = new template.components.Button({
		target: p1,
		_root: component._root || component,
		_yield: button11_yieldFragment,
		data: button11_initialData
	});
	
	appendNode( createText( "\n          " ), p1 );
	var button12_yieldFragment = renderbutton12YieldFragment( root, component );
	
	var button12_initialData = {
		color: "danger",
		disabled: true
	};
	var button12 = new template.components.Button({
		target: p1,
		_root: component._root || component,
		_yield: button12_yieldFragment,
		data: button12_initialData
	});
	
	appendNode( createText( "\n          " ), p1 );
	var button13_yieldFragment = renderbutton13YieldFragment( root, component );
	
	var button13_initialData = {
		color: "link",
		disabled: true
	};
	var button13 = new template.components.Button({
		target: p1,
		_root: component._root || component,
		_yield: button13_yieldFragment,
		data: button13_initialData
	});
	
	var text13 = createText( "\n\n        " );
	
	var p2 = createElement( 'p' );
	p2.className = "bs-component";
	
	var button14_yieldFragment = renderbutton14YieldFragment( root, component );
	
	var button14_initialData = {
		outline: true,
		color: "primary"
	};
	var button14 = new template.components.Button({
		target: p2,
		_root: component._root || component,
		_yield: button14_yieldFragment,
		data: button14_initialData
	});
	
	appendNode( createText( "\n          " ), p2 );
	var button15_yieldFragment = renderbutton15YieldFragment( root, component );
	
	var button15_initialData = {
		outline: true,
		color: "secondary"
	};
	var button15 = new template.components.Button({
		target: p2,
		_root: component._root || component,
		_yield: button15_yieldFragment,
		data: button15_initialData
	});
	
	appendNode( createText( "\n          " ), p2 );
	var button16_yieldFragment = renderbutton16YieldFragment( root, component );
	
	var button16_initialData = {
		outline: true,
		color: "success"
	};
	var button16 = new template.components.Button({
		target: p2,
		_root: component._root || component,
		_yield: button16_yieldFragment,
		data: button16_initialData
	});
	
	appendNode( createText( "\n          " ), p2 );
	var button17_yieldFragment = renderbutton17YieldFragment( root, component );
	
	var button17_initialData = {
		outline: true,
		color: "info"
	};
	var button17 = new template.components.Button({
		target: p2,
		_root: component._root || component,
		_yield: button17_yieldFragment,
		data: button17_initialData
	});
	
	appendNode( createText( "\n          " ), p2 );
	var button18_yieldFragment = renderbutton18YieldFragment( root, component );
	
	var button18_initialData = {
		outline: true,
		color: "warning"
	};
	var button18 = new template.components.Button({
		target: p2,
		_root: component._root || component,
		_yield: button18_yieldFragment,
		data: button18_initialData
	});
	
	appendNode( createText( "\n          " ), p2 );
	var button19_yieldFragment = renderbutton19YieldFragment( root, component );
	
	var button19_initialData = {
		outline: true,
		color: "danger"
	};
	var button19 = new template.components.Button({
		target: p2,
		_root: component._root || component,
		_yield: button19_yieldFragment,
		data: button19_initialData
	});
	
	var text19 = createText( "\n\n        " );
	
	var div = createElement( 'div' );
	div.className = "bs-component";
	
	var button20_yieldFragment = renderbutton20YieldFragment( root, component );
	
	var button20_initialData = {
		color: "primary",
		size: "lg"
	};
	var button20 = new template.components.Button({
		target: div,
		_root: component._root || component,
		_yield: button20_yieldFragment,
		data: button20_initialData
	});
	
	appendNode( createText( "\n          " ), div );
	var button21_yieldFragment = renderbutton21YieldFragment( root, component );
	
	var button21_initialData = {
		color: "primary"
	};
	var button21 = new template.components.Button({
		target: div,
		_root: component._root || component,
		_yield: button21_yieldFragment,
		data: button21_initialData
	});
	
	appendNode( createText( "\n          " ), div );
	var button22_yieldFragment = renderbutton22YieldFragment( root, component );
	
	var button22_initialData = {
		color: "primary",
		size: "sm"
	};
	var button22 = new template.components.Button({
		target: div,
		_root: component._root || component,
		_yield: button22_yieldFragment,
		data: button22_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			insertNode( text6, target, anchor );
			insertNode( p1, target, anchor );
			insertNode( text13, target, anchor );
			insertNode( p2, target, anchor );
			insertNode( text19, target, anchor );
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
			button1_yieldFragment.update( changed, root );
			button2_yieldFragment.update( changed, root );
			button3_yieldFragment.update( changed, root );
			button4_yieldFragment.update( changed, root );
			button5_yieldFragment.update( changed, root );
			button6_yieldFragment.update( changed, root );
			button7_yieldFragment.update( changed, root );
			button8_yieldFragment.update( changed, root );
			button9_yieldFragment.update( changed, root );
			button10_yieldFragment.update( changed, root );
			button11_yieldFragment.update( changed, root );
			button12_yieldFragment.update( changed, root );
			button13_yieldFragment.update( changed, root );
			button14_yieldFragment.update( changed, root );
			button15_yieldFragment.update( changed, root );
			button16_yieldFragment.update( changed, root );
			button17_yieldFragment.update( changed, root );
			button18_yieldFragment.update( changed, root );
			button19_yieldFragment.update( changed, root );
			button20_yieldFragment.update( changed, root );
			button21_yieldFragment.update( changed, root );
			button22_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( false );
			button1.destroy( false );
			button2.destroy( false );
			button3.destroy( false );
			button4.destroy( false );
			button5.destroy( false );
			button6.destroy( false );
			button7.destroy( false );
			button8.destroy( false );
			button9.destroy( false );
			button10.destroy( false );
			button11.destroy( false );
			button12.destroy( false );
			button13.destroy( false );
			button14.destroy( false );
			button15.destroy( false );
			button16.destroy( false );
			button17.destroy( false );
			button18.destroy( false );
			button19.destroy( false );
			button20.destroy( false );
			button21.destroy( false );
			button22.destroy( false );
			
			if ( detach ) {
				detachNode( p );
				detachNode( text6 );
				detachNode( p1 );
				detachNode( text13 );
				detachNode( p2 );
				detachNode( text19 );
				detachNode( div );
			}
		}
	};
}

function renderbutton22YieldFragment ( root, component ) {
	var text = createText( "Small button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton21YieldFragment ( root, component ) {
	var text = createText( "Default button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton20YieldFragment ( root, component ) {
	var text = createText( "Large button" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton19YieldFragment ( root, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton18YieldFragment ( root, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton17YieldFragment ( root, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton16YieldFragment ( root, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton15YieldFragment ( root, component ) {
	var text = createText( "Secondary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton14YieldFragment ( root, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton13YieldFragment ( root, component ) {
	var text = createText( "Link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton12YieldFragment ( root, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton11YieldFragment ( root, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton10YieldFragment ( root, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton9YieldFragment ( root, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton8YieldFragment ( root, component ) {
	var text = createText( "Secondary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton7YieldFragment ( root, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton6YieldFragment ( root, component ) {
	var text = createText( "Link" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton5YieldFragment ( root, component ) {
	var text = createText( "Danger" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton4YieldFragment ( root, component ) {
	var text = createText( "Warning" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton3YieldFragment ( root, component ) {
	var text = createText( "Info" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton2YieldFragment ( root, component ) {
	var text = createText( "Success" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbutton1YieldFragment ( root, component ) {
	var text = createText( "Secondary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment2 ( root, component ) {
	var text = createText( "Primary" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderrow1YieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment1( root, component );
	
	var col_initialData = {
		lg: 12
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
		}
	};
}

function rendercolYieldFragment1 ( root, component ) {
	var h1 = createElement( 'h1' );
	h1.id = "navbars";
	h1.className = "text-muted my-4";
	
	appendNode( createText( "Navbars" ), h1 );
	var text1 = createText( "\n\n        " );
	
	var div = createElement( 'div' );
	div.className = "bs-component";
	
	var nav = createElement( 'nav' );
	nav.className = "navbar navbar-toggleable-md navbar-inverse bg-primary";
	
	appendNode( nav, div );
	
	var button = createElement( 'button' );
	button.className = "navbar-toggler navbar-toggler-right";
	button.type = "button";
	setAttribute( button, 'data-toggle', "collapse" );
	setAttribute( button, 'data-target', "#navbarColor01" );
	setAttribute( button, 'aria-controls', "navbarColor01" );
	setAttribute( button, 'aria-expanded', "false" );
	setAttribute( button, 'aria-label', "Toggle navigation" );
	
	appendNode( button, nav );
	
	var span = createElement( 'span' );
	span.className = "navbar-toggler-icon";
	
	appendNode( span, button );
	appendNode( createText( "\n            " ), nav );
	
	var a = createElement( 'a' );
	a.className = "navbar-brand";
	a.href = "#";
	
	appendNode( a, nav );
	appendNode( createText( "Navbar" ), a );
	appendNode( createText( "\n\n            " ), nav );
	
	var div1 = createElement( 'div' );
	div1.className = "collapse navbar-collapse";
	div1.id = "navbarColor01";
	
	appendNode( div1, nav );
	
	var ul = createElement( 'ul' );
	ul.className = "navbar-nav mr-auto";
	
	appendNode( ul, div1 );
	var navItem_yieldFragment = rendernavItemYieldFragment( root, component );
	
	var navItem_initialData = {
		active: true
	};
	var navItem = new template.components.NavItem({
		target: ul,
		_root: component._root || component,
		_yield: navItem_yieldFragment,
		data: navItem_initialData
	});
	
	appendNode( createText( "\n                " ), ul );
	var navItem1_yieldFragment = rendernavItem1YieldFragment( root, component );
	
	var navItem1 = new template.components.NavItem({
		target: ul,
		_root: component._root || component,
		_yield: navItem1_yieldFragment
	});
	
	appendNode( createText( "\n                " ), ul );
	var navItem2_yieldFragment = rendernavItem2YieldFragment( root, component );
	
	var navItem2 = new template.components.NavItem({
		target: ul,
		_root: component._root || component,
		_yield: navItem2_yieldFragment
	});
	
	appendNode( createText( "\n                " ), ul );
	var navItem3_yieldFragment = rendernavItem3YieldFragment( root, component );
	
	var navItem3 = new template.components.NavItem({
		target: ul,
		_root: component._root || component,
		_yield: navItem3_yieldFragment
	});
	
	appendNode( createText( "\n              " ), div1 );
	var form_yieldFragment = renderformYieldFragment( root, component );
	
	var form_initialData = {
		inline: true
	};
	var form = new template.components.Form({
		target: div1,
		_root: component._root || component,
		_yield: form_yieldFragment,
		data: form_initialData
	});
	
	var text9 = createText( "\n\n        " );
	
	var div2 = createElement( 'div' );
	div2.className = "bs-component";
	
	var nav1 = createElement( 'nav' );
	nav1.className = "navbar navbar-toggleable-md navbar-light bg-inverse";
	
	appendNode( nav1, div2 );
	
	var button1 = createElement( 'button' );
	button1.className = "navbar-toggler navbar-toggler-right";
	button1.type = "button";
	setAttribute( button1, 'data-toggle', "collapse" );
	setAttribute( button1, 'data-target', "#navbarColor01" );
	setAttribute( button1, 'aria-controls', "navbarColor01" );
	setAttribute( button1, 'aria-expanded', "false" );
	setAttribute( button1, 'aria-label', "Toggle navigation" );
	
	appendNode( button1, nav1 );
	
	var span1 = createElement( 'span' );
	span1.className = "navbar-toggler-icon";
	
	appendNode( span1, button1 );
	appendNode( createText( "\n            " ), nav1 );
	var navbarBrand_yieldFragment = rendernavbarBrandYieldFragment( root, component );
	
	var navbarBrand = new template.components.NavbarBrand({
		target: nav1,
		_root: component._root || component,
		_yield: navbarBrand_yieldFragment
	});
	
	appendNode( createText( "\n\n            " ), nav1 );
	
	var div3 = createElement( 'div' );
	div3.className = "collapse navbar-collapse";
	div3.id = "navbarColor01";
	
	appendNode( div3, nav1 );
	
	var ul1 = createElement( 'ul' );
	ul1.className = "navbar-nav mr-auto";
	
	appendNode( ul1, div3 );
	var navItem4_yieldFragment = rendernavItem4YieldFragment( root, component );
	
	var navItem4_initialData = {
		active: true
	};
	var navItem4 = new template.components.NavItem({
		target: ul1,
		_root: component._root || component,
		_yield: navItem4_yieldFragment,
		data: navItem4_initialData
	});
	
	appendNode( createText( "\n                " ), ul1 );
	var navItem5_yieldFragment = rendernavItem5YieldFragment( root, component );
	
	var navItem5 = new template.components.NavItem({
		target: ul1,
		_root: component._root || component,
		_yield: navItem5_yieldFragment
	});
	
	appendNode( createText( "\n                " ), ul1 );
	var navItem6_yieldFragment = rendernavItem6YieldFragment( root, component );
	
	var navItem6 = new template.components.NavItem({
		target: ul1,
		_root: component._root || component,
		_yield: navItem6_yieldFragment
	});
	
	appendNode( createText( "\n                " ), ul1 );
	var navItem7_yieldFragment = rendernavItem7YieldFragment( root, component );
	
	var navItem7 = new template.components.NavItem({
		target: ul1,
		_root: component._root || component,
		_yield: navItem7_yieldFragment
	});
	
	appendNode( createText( "\n              " ), div3 );
	var form1_yieldFragment = renderform1YieldFragment( root, component );
	
	var form1_initialData = {
		inline: true
	};
	var form1 = new template.components.Form({
		target: div3,
		_root: component._root || component,
		_yield: form1_yieldFragment,
		data: form1_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( div, target, anchor );
			insertNode( text9, target, anchor );
			insertNode( div2, target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			navItem_yieldFragment.update( changed, root );
			navItem1_yieldFragment.update( changed, root );
			navItem2_yieldFragment.update( changed, root );
			navItem3_yieldFragment.update( changed, root );
			form_yieldFragment.update( changed, root );
			navbarBrand_yieldFragment.update( changed, root );
			navItem4_yieldFragment.update( changed, root );
			navItem5_yieldFragment.update( changed, root );
			navItem6_yieldFragment.update( changed, root );
			navItem7_yieldFragment.update( changed, root );
			form1_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			navItem.destroy( false );
			navItem1.destroy( false );
			navItem2.destroy( false );
			navItem3.destroy( false );
			form.destroy( false );
			navbarBrand.destroy( false );
			navItem4.destroy( false );
			navItem5.destroy( false );
			navItem6.destroy( false );
			navItem7.destroy( false );
			form1.destroy( false );
			
			if ( detach ) {
				detachNode( h1 );
				detachNode( text1 );
				detachNode( div );
				detachNode( text9 );
				detachNode( div2 );
			}
		}
	};
}

function renderform1YieldFragment ( root, component ) {
	var input = createElement( 'input' );
	input.className = "form-control mr-sm-2";
	input.type = "text";
	input.placeholder = "Search";
	
	var text = createText( "\n                " );
	var button_yieldFragment = renderbuttonYieldFragment1( root, component );
	
	var button_initialData = {
		outline: true,
		class: "my-2 my-sm-0",
		type: "submit"
	};
	var button = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( input, target, anchor );
			insertNode( text, target, anchor );
			button._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( detach );
			
			if ( detach ) {
				detachNode( input );
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment1 ( root, component ) {
	var text = createText( "Search" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendernavItem7YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "About" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem6YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Pricing" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem5YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Features" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem4YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Home " ), a );
	
	var span = createElement( 'span' );
	span.className = "sr-only";
	
	appendNode( span, a );
	appendNode( createText( "(current)" ), span );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavbarBrandYieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#";
	
	appendNode( createText( "Navbar" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderformYieldFragment ( root, component ) {
	var input = createElement( 'input' );
	input.className = "form-control mr-sm-2";
	input.type = "text";
	input.placeholder = "Search";
	
	var text = createText( "\n                " );
	var button_yieldFragment = renderbuttonYieldFragment( root, component );
	
	var button_initialData = {
		outline: true,
		class: "my-2 my-sm-0",
		type: "submit"
	};
	var button = new template.components.Button({
		target: null,
		_root: component._root || component,
		_yield: button_yieldFragment,
		data: button_initialData
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( input, target, anchor );
			insertNode( text, target, anchor );
			button._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			button_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			button.destroy( detach );
			
			if ( detach ) {
				detachNode( input );
				detachNode( text );
			}
		}
	};
}

function renderbuttonYieldFragment ( root, component ) {
	var text = createText( "Search" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function rendernavItem3YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "About" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem2YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Pricing" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItem1YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Features" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function rendernavItemYieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.className = "nav-link";
	a.href = "#";
	
	appendNode( createText( "Home " ), a );
	
	var span = createElement( 'span' );
	span.className = "sr-only";
	
	appendNode( span, a );
	appendNode( createText( "(current)" ), span );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderrowYieldFragment ( root, component ) {
	var col_yieldFragment = rendercolYieldFragment( root, component );
	
	var col_initialData = {
		lg: 3,
		md: 3,
		sm: 4
	};
	var col = new template.components.Col({
		target: null,
		_root: component._root || component,
		_yield: col_yieldFragment,
		data: col_initialData
	});

	return {
		mount: function ( target, anchor ) {
			col._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			col_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			col.destroy( detach );
		}
	};
}

function rendercolYieldFragment ( root, component ) {
	var listGroup_yieldFragment = renderlistGroupYieldFragment( root, component );
	
	var listGroup = new template.components.ListGroup({
		target: null,
		_root: component._root || component,
		_yield: listGroup_yieldFragment
	});

	return {
		mount: function ( target, anchor ) {
			listGroup._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroup_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroup.destroy( detach );
		}
	};
}

function renderlistGroupYieldFragment ( root, component ) {
	var listGroupItem_yieldFragment = renderlistGroupItemYieldFragment( root, component );
	
	var listGroupItem_initialData = {
		action: true
	};
	var listGroupItem = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem_yieldFragment,
		data: listGroupItem_initialData
	});
	
	var text = createText( "\n          " );
	var listGroupItem1_yieldFragment = renderlistGroupItem1YieldFragment( root, component );
	
	var listGroupItem1_initialData = {
		action: true
	};
	var listGroupItem1 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem1_yieldFragment,
		data: listGroupItem1_initialData
	});
	
	var text1 = createText( "\n          " );
	var listGroupItem2_yieldFragment = renderlistGroupItem2YieldFragment( root, component );
	
	var listGroupItem2_initialData = {
		action: true
	};
	var listGroupItem2 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem2_yieldFragment,
		data: listGroupItem2_initialData
	});
	
	var text2 = createText( "\n          " );
	var listGroupItem3_yieldFragment = renderlistGroupItem3YieldFragment( root, component );
	
	var listGroupItem3_initialData = {
		action: true
	};
	var listGroupItem3 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem3_yieldFragment,
		data: listGroupItem3_initialData
	});
	
	var text3 = createText( "\n          " );
	var listGroupItem4_yieldFragment = renderlistGroupItem4YieldFragment( root, component );
	
	var listGroupItem4_initialData = {
		action: true
	};
	var listGroupItem4 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem4_yieldFragment,
		data: listGroupItem4_initialData
	});
	
	var text4 = createText( "\n          " );
	var listGroupItem5_yieldFragment = renderlistGroupItem5YieldFragment( root, component );
	
	var listGroupItem5_initialData = {
		action: true
	};
	var listGroupItem5 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem5_yieldFragment,
		data: listGroupItem5_initialData
	});
	
	var text5 = createText( "\n          " );
	var listGroupItem6_yieldFragment = renderlistGroupItem6YieldFragment( root, component );
	
	var listGroupItem6_initialData = {
		action: true
	};
	var listGroupItem6 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem6_yieldFragment,
		data: listGroupItem6_initialData
	});
	
	var text6 = createText( "\n          " );
	var listGroupItem7_yieldFragment = renderlistGroupItem7YieldFragment( root, component );
	
	var listGroupItem7_initialData = {
		action: true
	};
	var listGroupItem7 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem7_yieldFragment,
		data: listGroupItem7_initialData
	});
	
	var text7 = createText( "\n          " );
	var listGroupItem8_yieldFragment = renderlistGroupItem8YieldFragment( root, component );
	
	var listGroupItem8_initialData = {
		action: true
	};
	var listGroupItem8 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem8_yieldFragment,
		data: listGroupItem8_initialData
	});
	
	var text8 = createText( "\n          " );
	var listGroupItem9_yieldFragment = renderlistGroupItem9YieldFragment( root, component );
	
	var listGroupItem9_initialData = {
		action: true
	};
	var listGroupItem9 = new template.components.ListGroupItem({
		target: null,
		_root: component._root || component,
		_yield: listGroupItem9_yieldFragment,
		data: listGroupItem9_initialData
	});

	return {
		mount: function ( target, anchor ) {
			listGroupItem._fragment.mount( target, anchor );
			insertNode( text, target, anchor );
			listGroupItem1._fragment.mount( target, anchor );
			insertNode( text1, target, anchor );
			listGroupItem2._fragment.mount( target, anchor );
			insertNode( text2, target, anchor );
			listGroupItem3._fragment.mount( target, anchor );
			insertNode( text3, target, anchor );
			listGroupItem4._fragment.mount( target, anchor );
			insertNode( text4, target, anchor );
			listGroupItem5._fragment.mount( target, anchor );
			insertNode( text5, target, anchor );
			listGroupItem6._fragment.mount( target, anchor );
			insertNode( text6, target, anchor );
			listGroupItem7._fragment.mount( target, anchor );
			insertNode( text7, target, anchor );
			listGroupItem8._fragment.mount( target, anchor );
			insertNode( text8, target, anchor );
			listGroupItem9._fragment.mount( target, anchor );
		},
		
		update: function ( changed, root ) {
			var __tmp;
		
			listGroupItem_yieldFragment.update( changed, root );
			listGroupItem1_yieldFragment.update( changed, root );
			listGroupItem2_yieldFragment.update( changed, root );
			listGroupItem3_yieldFragment.update( changed, root );
			listGroupItem4_yieldFragment.update( changed, root );
			listGroupItem5_yieldFragment.update( changed, root );
			listGroupItem6_yieldFragment.update( changed, root );
			listGroupItem7_yieldFragment.update( changed, root );
			listGroupItem8_yieldFragment.update( changed, root );
			listGroupItem9_yieldFragment.update( changed, root );
		},
		
		teardown: function ( detach ) {
			listGroupItem.destroy( detach );
			listGroupItem1.destroy( detach );
			listGroupItem2.destroy( detach );
			listGroupItem3.destroy( detach );
			listGroupItem4.destroy( detach );
			listGroupItem5.destroy( detach );
			listGroupItem6.destroy( detach );
			listGroupItem7.destroy( detach );
			listGroupItem8.destroy( detach );
			listGroupItem9.destroy( detach );
			
			if ( detach ) {
				detachNode( text );
				detachNode( text1 );
				detachNode( text2 );
				detachNode( text3 );
				detachNode( text4 );
				detachNode( text5 );
				detachNode( text6 );
				detachNode( text7 );
				detachNode( text8 );
			}
		}
	};
}

function renderlistGroupItem9YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#dialogs";
	
	appendNode( createText( "Dialogs" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderlistGroupItem8YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#containers";
	
	appendNode( createText( "Containers" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderlistGroupItem7YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#progress";
	
	appendNode( createText( "Progress" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderlistGroupItem6YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#indicators";
	
	appendNode( createText( "Indicators" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderlistGroupItem5YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#navs";
	
	appendNode( createText( "Navs" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderlistGroupItem4YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#forms";
	
	appendNode( createText( "Forms" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderlistGroupItem3YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#tables";
	
	appendNode( createText( "Tables" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderlistGroupItem2YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#typography";
	
	appendNode( createText( "Typography" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderlistGroupItem1YieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#buttons";
	
	appendNode( createText( "Buttons" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderlistGroupItemYieldFragment ( root, component ) {
	var a = createElement( 'a' );
	a.href = "#navbars";
	
	appendNode( createText( "Navbars" ), a );

	return {
		mount: function ( target, anchor ) {
			insertNode( a, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( a );
			}
		}
	};
}

function renderEachBlock ( root, eachBlock_value, theme, theme__index, component ) {
	var li = createElement( 'li' );
	li.className = "nav-item " + ( root.current == theme.name ? 'active' : '' );
	
	var a = createElement( 'a' );
	a.className = "nav-link";
	
	function clickHandler ( event ) {
		var eachBlock_value = this.__svelte.eachBlock_value, theme__index = this.__svelte.theme__index, theme = eachBlock_value[theme__index];
		
		component.changeTheme(theme);
	}
	
	addEventListener( a, 'click', clickHandler );
	
	a.__svelte = {
		eachBlock_value: eachBlock_value,
		theme__index: theme__index
	};
	
	appendNode( a, li );
	
	var small = createElement( 'small' );
	
	appendNode( small, a );
	var ifBlock_anchor = createComment();
	appendNode( ifBlock_anchor, small );
	
	function getBlock ( root, eachBlock_value, theme, theme__index ) {
		if ( root.current == theme.name ) return renderIfBlock_0;
		return renderIfBlock_1;
	}
	
	var currentBlock = getBlock( root, eachBlock_value, theme, theme__index );
	var ifBlock = currentBlock && currentBlock( root, eachBlock_value, theme, theme__index, component );
	
	if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
		},
		
		update: function ( changed, root, eachBlock_value, theme, theme__index ) {
			var __tmp;
		
			li.className = "nav-item " + ( root.current == theme.name ? 'active' : '' );
			
			a.__svelte.eachBlock_value = eachBlock_value;
			a.__svelte.theme__index = theme__index;
			
			var _currentBlock = currentBlock;
			currentBlock = getBlock( root, eachBlock_value, theme, theme__index );
			if ( _currentBlock === currentBlock && ifBlock) {
				ifBlock.update( changed, root, eachBlock_value, theme, theme__index );
			} else {
				if ( ifBlock ) ifBlock.teardown( true );
				ifBlock = currentBlock && currentBlock( root, eachBlock_value, theme, theme__index, component );
				if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
			}
		},
		
		teardown: function ( detach ) {
			removeEventListener( a, 'click', clickHandler );
			if ( ifBlock ) ifBlock.teardown( false );
			
			if ( detach ) {
				detachNode( li );
			}
		}
	};
}

function renderIfBlock_1 ( root, eachBlock_value, theme, theme__index, component ) {
	var last_text = theme.name;
	var text = createText( last_text );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},
		
		update: function ( changed, root, eachBlock_value, theme, theme__index ) {
			var __tmp;
		
			if ( ( __tmp = theme.name ) !== last_text ) {
				text.data = last_text = __tmp;
			}
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function renderIfBlock_0 ( root, eachBlock_value, theme, theme__index, component ) {
	var b = createElement( 'b' );
	
	var last_text = theme.name;
	var text = createText( last_text );
	appendNode( text, b );

	return {
		mount: function ( target, anchor ) {
			insertNode( b, target, anchor );
		},
		
		update: function ( changed, root, eachBlock_value, theme, theme__index ) {
			var __tmp;
		
			if ( ( __tmp = theme.name ) !== last_text ) {
				text.data = last_text = __tmp;
			}
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( b );
			}
		}
	};
}

function Docs ( options ) {
	options = options || {};
	this._state = Object.assign( template.data(), options.data );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	this._renderHooks = [];
	
	this._fragment = renderMainFragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
	
	this._flush();
}

Docs.prototype = Object.assign( {}, template.methods, proto );

Docs.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
	
	this._flush();
};

Docs.prototype.teardown = Docs.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

return Docs;

}());
