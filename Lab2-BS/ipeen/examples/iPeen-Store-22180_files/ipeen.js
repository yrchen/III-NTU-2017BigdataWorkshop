/*! ipeen.js | (c) ipeen.com.tw */
(function( window, document, undefined ){

  "use strict";

  var namespace = "ipeen",
      version = "0.2.0";
  
  /**
   * Check if XA is up to date
   */
  if ( window[namespace] && ( ver( window[namespace].version ) >= ver( version ) ) ) {
    return;
  }
  
  var XA = window[namespace] = { version: version },
      objectString = {}.toString,
      slice = [].slice,
      noop = function(){};
  
  window['__xans__'] = namespace;
  
  
  /**
   * Compatibility
   * Implementations for browser that do not natively support
   *
   **/
  function compatibility ( target, source ) {
    return lazyExtend( target, source );
  }

  compatibility( Function.prototype, {

    /**
     * Function.prototype.bind
     * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
     */
    bind: function (oThis) { if (typeof this !== "function") { throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); } var aArgs = slice.call(arguments, 1), fToBind = this,  fNOP = function () {}, fBound = function () { return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(slice.call(arguments))); }; fNOP.prototype = this.prototype; fBound.prototype = new fNOP(); return fBound; },

    /**
     * Function.prototype.curry
     * http://ejohn.org/blog/partial-functions-in-javascript/
     */
    curry: function () {
      if ( ! arguments.length ) return this;
      var fn = this,
          args = slice.call( arguments );
      return function() {
        return fn.apply(this, args.concat( slice.call( arguments ) ) );
      }
    },

    /**
     * Function.prototype.defer
     * Schedules the function to run as soon as the interpreter is idle.
     */
    defer: function () {
      return this.delay.apply( this, [1].concat( slice.call( arguments ) ) );
    },
    
    /**
     * Function.prototype.delay
     * Set a timer to delay execution.
     */
    delay: function ( time ) {
      var fn = this,
          args = slice.call( arguments, 1 );
      return window.setTimeout(function(){
        fn.apply(fn, args);
      }, time );
    }
    
  });
  
  compatibility( Array.prototype, {
    /**
     * Array.prototype.indexOf
     * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
     */
    indexOf: function (searchElement) { if (this == null) { throw new TypeError(); } var t = Object(this); var len = t.length >>> 0; if (len === 0) { return -1; } var n = 0; if (arguments.length > 0) { n = Number(arguments[1]); if (n != n) { n = 0; } else if (n != 0 && n != Infinity && n != -Infinity) { n = (n > 0 || -1) * Math.floor(Math.abs(n)); } } if (n >= len) { return -1; } var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); for (; k < len; k++) { if (k in t && t[k] === searchElement) { return k; } } return -1; },
    
    /**
     * Array.prototype.forEach
     * Executes a provided function once per array element.
     * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
     */
    forEach: function(fn, scope) {
      for(var i = 0, len = this.length; i < len; ++i) {
        fn.call(scope, this[i], i, this);
      }
    },
    
    /**
     * Array.prototype.contains
     * ['a','b','c'].contains('a');    // true
     */
    contains: function ( m ) {
      return !!~this.indexOf( m );
    },

    /**
     * Array.prototype._exec
     * batch execute functions
     */
    _exec: function () {
      var args = slice.call( arguments ),
          i = 0,
          len = this.length;
      for ( ; i < len; i ++ ) {
        this[i].apply( window, args );
      }
    },
    
    /**
     * Array.prototype._each
     * Similar to forEach, except loop breaks when callback returns FALSE
     */
    _each: function ( fn ) {
      for ( var i = 0, len = this.length ; i < len; i ++ ) {
        if ( false === fn.call( this, this[i], i, this ) ) {
          break;
        }
      }
    }
  });

  compatibility( String.prototype, {
    /**
     * String.prototype.contains
     * "Mozilla/5.0 Chrome/25.0.1364.160".contains("Chrome");   // true
     */
    contains: function ( m ) {
      return !!~this.indexOf( m );
    },

    /**
     * String.prototype.lpad
     * "9".lpad('0',2);     // 09
     */
    lpad: function( p, l ) { var s = this; while (s.length < l) { s = p + s; } return s; },

    /**
     * String.prototype.rpad
     * "9".rpad('0',2);     // 90
     */
    rpad: function( p, l ) { var s = this; while (s.length < l) { s += p; } return s; }
  });

  compatibility( Number.prototype, {
    /**
     * Number.prototype.times
     * Calls iterator the specified number of times
     *
     * @param   {Function}  An iterator function to call
     * @param   {Object}    An optional context (this value) to use when calling iterator.
     * (5).times(function(i){ xx(this[i]); }, myArray );
     */
    times: function ( fn, context ) {
      for ( var i = 0 ; i < this ; i ++ ) {
        (fn || noop).call( context || window, i );
      }
    }
  });
  
  compatibility( Object, {
    /**
     * Object.keys
     * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
     */
    keys: (function () { var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'), dontEnums = [ 'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ], dontEnumsLength = dontEnums.length; return function (obj) { if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object'); var result = []; for (var prop in obj) { if (hasOwnProperty.call(obj, prop)) result.push(prop); } if (hasDontEnumBug) { for (var i=0; i < dontEnumsLength; i++) { if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]); } } return result; } })()
  });


  /**
   * extend
   * overwrite properties by default
   */
  function extend ( target, source, lazy ) {
    var prop;
    target = target || {};
    source = source || {};
    for ( prop in source ) {
      if ( lazy && prop in target ) {
        continue;
      }
      target[prop] = source[prop];
    }
    return target;
  }
  
  /**
   * lazyExtend
   * skip if property already exists
   */
  function lazyExtend ( target, source ) {
    return extend( target, source, true );
  }
  
  lazyExtend( XA, {
    
    extend: extend,
    lazyExtend: lazyExtend,
    
    copy: extend,
    
    /**
     * Add method/property into XA object
     * overwrite the prop value if already exist
     */
    add: function ( target, value ) {
      var node = this,
          placed,
          part,
          k;
    
      if ( target.constructor === String ) {
        part = target.split('.');
        while ( undefined !== ( k = part.shift() ) ) {
          if ( k === "" ) { continue; }
          if ( ! node[k] ) {
            if ( part.length ) {
              node[k] = {};
            } else { /* last */
              node[k] = value;
              placed = true;
            }
          }
          node = node[k];
        }
        
      } else {
        node = target;
      }

      return placed ? node : extend( node, value );
    }

  } );


  /**
   * Utility
   */
  function isFunction ( a ) {
    return objectString.call(a) === "[object Function]";
  }
  
  function isArray ( a ) {
    return objectString.call(a) === "[object Array]";
  }
  
  function isObject ( a ) {
    return objectString.call(a) === "[object Object]";
  }
  
  function isRegExp ( a ) {
    return objectString.call(a) === "[object RegExp]";
  }
  
  function map ( v, a1, a2, b1, b2 ) {
    return ( v - a1 ) / ( a2 - a1 ) * ( b2 - b1 ) + b1;
  }
  
  XA.add('Util', {
    isFunction: isFunction,
    isArray: isArray,
    isObject: isObject,
    isRegExp: isRegExp,
    map: map,
    
    /**
     * ipeen.Util.random( a [, b ] );
     * randomize an integer
     * random( 5 );       // 0~5
     * random( -3, 10 );  // -3~10
     * random( 7, 20 );   // 7~20
     */
    random: function ( a, b ) {
      if ( b === undefined ) {
        b = 0;
      }
      return Math.floor( Math.random() * ( Math.abs( a - b ) + 1 ) ) + Math.min( a, b );
    }
  });


  /**
   * XA.Class
   * XA.Class( ClassName [, {Object} prototype ] )
   * XA.Class( ClassName [, {Function} constructor ] )
   *
   * use __construct method as constructor
   * 
   *   XA.Class( 'Person', {
   *     __construct: function ( name ) {
   *       this.name = name;
   *     },
   *     greet: function () {
   *       alert("Hi! This is " + this.name);
   *     }
   *   });
   *   
   *   var john = new XA.Class.Person('John');
   *   john.greet();   // This is John'
   *   
   *   XA.Class('American extends Person', {
   *     __construct: function ( name ) {
   *       this.nation = 'United States';
   *       this._super.__construct.call( this, name );
   *     },
   *     hello: function () {
   *       alert("Hello! I come from " + this.nation);
   *     }
   *   });
   *   var american = new XA.Class.American('Jessie');
   *   american.greet();   // This is Jessie
   *   american.hello();   // Hello! I come from United States
   */
  XA.Class = function ( name, proto ) {
    var Klass,
        k = {},
        isSubClass = false,
        parentClass,
        m,
        F,
        Parent;

    /** check subclass **/
    if ( m = name.match( /^(\w+)\s+extends?\s+(\w+)$/ ) ) {
      isSubClass = true;
      name = m[1];
      parentClass = m[2];
    }
    
    /** checkout arguments[1] input type **/
    if ( isFunction( proto ) ) {
      proto = { __construct: proto };
    }
    
    /** create constructor **/
    Klass = function () {
      (this.__construct || noop).apply( this, arguments );
    };
    
    /** inherit prototype **/
    if ( isSubClass ) {
      if ( ! isFunction( XA.Class[parentClass] ) ) {
        XA.error("Class." + parentClass, "Class " + parentClass + " is not defined");
      }
      
      Parent = XA.Class[parentClass];
      F = function(){};
      F.prototype = Parent.prototype;
      Klass.prototype = new F();
      Klass.prototype._super = Parent.prototype;
    }
    
    /** constructor & self prototype **/
    extend( Klass.prototype, proto );
    Klass.prototype.constructor = Klass;
    
    k[name] = Klass;
    XA.add('Class', k);
    return Klass;
  };
  
  
  
  /**
   * Console, Logging & Error Reporting
   */
  (function () {
    var debugMode = !! window[ namespace + 'Debug' ];
    
    if ( ! window.console ) {
      window.console = {};
    }

    console.log || ( console.log = noop );
    console.error || ( console.error = console.log );
    console.warn || ( console.warn = console.log );
    
    if ( debugMode ) {
      warn("DEBUG MODE!");
    }
    
    function Exception ( where, message ) {
      this.name = where ? "[" + namespace + "." + where + "]" : "";
      this.message = message;
    }
    
    function log ( t ) {
      if ( ! debugMode ) return;
      console.log( arguments.length === 1 ? t : slice.call( arguments ).join(', ') );
    }
    
    function error ( where, message ) {
      if ( ! debugMode ) return;
      try {
        throw new Exception( where, message );
      } catch ( e ) {
        console.error( e.name, e.message );
      }
    }
    
    function warn ( message ) {
      if ( ! debugMode ) return;
      console.warn( message );
    }
    
    window.xx = log;
    
    XA.add('', {
      log: log,
      error: error,
      warn: warn,
      debugging: function () {
        return debugMode;
      }
    });
    
  })();
  
  
  
  /**
   * Actions
   * 
   * XA.register( name, fn )
   * register an action
   * @param name  {String} action namespace
   * @param fn    {Function} method
   * @return      {Function} return fn itself
   *
   * XA.action( name [, args..] )
   * @param name  {String} action name which needs to call
   * @param args  arguments pass to the action method
   * @return      method's return value
   */
  (function(){
    var lib = {};
    
    function register ( name, fn ) {
      if ( typeof name !== "string" ) {
        XA.error( 'register', "Type error with action name." );
        return;
      }
      if ( lib[name] ) {
        XA.warn( namespace + '.register: Action `' + name + '` already exists.');
      }
      return lib[name] = fn;
    }
    
    XA.add('', {
      register: register,
      dumpAction: function () {
        XA.log( Object.keys( lib ).join('\n') );
      },
      action: function () {
        var args = slice.call( arguments ),
            name = args.shift();
        if ( ! lib[name] ) {
          XA.error('action', 'Action `' + name + '` is not defined.');
          return;
        }
        return lib[name].apply( XA, args );
      },
      batch: function () {
        var i = 0,
            len = arguments.length;
        for ( ; i < len; i ++ ) {
          XA.action.apply( XA, arguments[i] );
        }
      }
    });

  })();
  
  
  
  /**
   * Version String to Number Float
   *
   * @param v  {String}  the version string ( 1.2.7 )
   * @return   {Number}  version in number  ( 1.27 ) with pad = 1.2007
   */
  function ver ( v ) {
    var m = /(\d+)\.(\d+)(?:\.(\d+))?/.exec( v );
    if ( ""._rpad ) {
      return m[1] + "." + m[2].rpad( '0', 3 ) + ( m[3] ? m[3] : "0" ) - 0;
    }
    return m[1] + "." + m[2] + ( m[3] ? m[3] : "0" ) - 0;
  }
  
  

  /**
   * Defines a named constant
   */
  (function(){
    var lib = {};
    
    function define ( a, b ) {
      if ( defined( a ) ) {
        XA.error("define", a + " already exists.");
      } else if ( window[a] ) {
        XA.warn(namespace + ".define: " + a + " is an existing variable in global scope.");
      }
      return lib[a] = window[a] = b;
    }
    
    function defined ( a ) {
      return lib[a] !== undefined;
    }
    
    function constant ( a ) {
      if ( ! defined( a ) ) {
        XA.error("constant", a + " is not defined" );
      }
      return lib[a];
    }
    
    XA.add('', {
      define: define,
      constant: constant,
      defined: defined
    });
    
    XA.register('define', define);
  })();


  /**
   * Browser Check
   * save in XA.UA
   */
  (function(){
    var _ = {},
        userAgent = navigator.userAgent,
        rmsie    = /(msie) (\d+.\d+)/,
        ropera   = /(opera).*version\/(\d+.\d+)/,
        rfirefox = /(firefox)\/(\d+.\d+)/,
        rchrome  = /(chrom(?:e|ium))\/(\d+.\d+(?:.\d+)?)/,
        rsafari  = /version\/(\d+.\d+(?:.\d+)?) (safari)/,
        rwebkit  = /(webkit)\/(\d+.\d+(?:.\d+)?)/,
        ripad    = /(ipad)/,
        riphone  = /(ip(?:hone|od))/;

    function uaTransform ( d, safari ) {
      return {
        browser:  safari ? d[2] : 
                      d[1] === 'chromium' ? 'chrome' : 
                          d[1] === 'msie' ? 'ie' :
                              d[1],
        version: ver( safari ? d[1] : d[2] ),
        versionString: safari ? d[1] : d[2],
        originalMatchString: d[0]
      };
    }
    
    (function ( ua, m ) {
      _.msie    = ( m = rmsie   .exec( ua ) ) ? uaTransform( m ) : null;
      _.opera   = ( m = ropera  .exec( ua ) ) ? uaTransform( m ) : null;
      _.firefox = ( m = rfirefox.exec( ua ) ) ? uaTransform( m ) : null;
      _.chrome  = ( m = rchrome .exec( ua ) ) ? uaTransform( m ) : null;
      _.safari  = ( m = rsafari .exec( ua ) ) ? uaTransform( m, true ) : null;
      _.webkit  = ( m = rwebkit .exec( ua ) ) ? uaTransform( m ) : null;

      _.ipad    = ripad  .test( ua ) ? true : null ;
      _.iphone  = riphone.test( ua ) ? true : null ;

      _.current = _.msie ? 'msie' : 
                    _.opera ? 'opera' : 
                      _.firefox ? 'firefox' :
                        _.chrome ? 'chrome' :
                          _.safari ? 'safari' : 
                            _.webkit ? 'webkit' : 'unknown';
      
      _.unknown = _.current === 'unknown' ? uaTransform( ['unknown', 'unknown', '0.0.0'] ) : null; 
      
    })( userAgent.toLowerCase() );
    
    function is_browser ( browser_name ) {
      return _[browser_name] ? true : false;
    }
    
    function uaCheckVersion ( _v, v, comp ) {
      if ( comp === 'e'   ) return _v == v;
      if ( comp === 'lt'  ) return _v - v <  0;
      if ( comp === 'lte' ) return _v - v <= 0;
      if ( comp === 'gt'  ) return _v - v >  0;
      if ( comp === 'gte' ) return _v - v >= 0;
    }
    
    function uaCheck ( browser, v, comp ) {
      var hold = is_browser(browser);
      if ( ! hold || ! v ) return hold;
      return uaCheckVersion( parseInt( _[browser].version, 10 ), v, comp );
    }
    
    XA.add('UA', {
      ie:      function ( v, comp ) { return uaCheck('msie'   , v, comp || 'e' ); },
      opera:   function ( v, comp ) { return uaCheck('opera'  , v, comp || 'e' ); },
      firefox: function ( v, comp ) { return uaCheck('firefox', v, comp || 'e' ); },
      chrome:  function ( v, comp ) { return uaCheck('chrome' , v, comp || 'e' ); },
      safari:  function ( v, comp ) { return uaCheck('safari' , v, comp || 'e' ); },
      webkit:  function ( v, comp ) { return uaCheck('webkit' , v, comp || 'e' ); },
      
      lt_ie:   function ( v ) { return this.ie( v, 'lt'  ); },
      lte_ie:  function ( v ) { return this.ie( v, 'lte' ); },
      gt_ie:   function ( v ) { return this.ie( v, 'gt'  ); },
      gte_ie:  function ( v ) { return this.ie( v, 'gte' ); },
      
      ipad:    function () { return is_browser('ipad'  ); },
      iphone:  function () { return is_browser('iphone'); },
      
      uaStatus: _,
      
      /**
       * @return browser name ( ie | opera | firefox | chrome | safari )
       */
      browserName: function () {
        return _[_.current].browser;
      },

      /**
       * @return browser name with version ( ex: ie6 | ie8 | firefox10 )
       */
      browserFullName: function () {
        var c = _[_.current];
        return c.browser + parseInt( c.version, 10 )
      },
      
      /**
       * @return browser version with decimal integer ( ex: 10, 22, 6, 7, 8 )
       */
      browserVersion: function () {
        return parseInt( _[_.current].version, 10 );
      },
      
      /**
       * @return browser full version string ( ex: 10.6.1, 22.0.123, 6.0 )
       */
      browserFullVersion: function () {
        return _[_.current].versionString;
      }
      
    });

  })();
  

  
  /**
   * Registry
   */
  (function(){
    var lib = {};
    XA.add("Registry", {
      /**
       * XA.Registry.set( name, data )
       * save data to registry
       * @param name {String}    key to save
       * @param data {(any)}     data to save
       * @return data
       */
      set: function ( name, data ) {
        return lib[name] = data;
      },
      
      /**
       * XA.Registry.get( name )
       * get data from registry
       * @param name {String}    key to get
       * @return data
       */
      get: function ( name ) {
        return lib[name];
      }
    });
  })();


  /**
   * Event
   */
  (function(){
    
    var lib = {};
    
    /**
     * addEventListener( [ target, ] type, handler )
     * Registers a single event listener on a single target
     */
    function addEventListener ( target, type, handler ) {
      if ( typeof target === "string" ) {
        handler = type;
        type = target;
        target = window;
      }
      if ( ! lib[type] ) {
        lib[type] = [];
      }
      lib[type].push({
        target: target,
        handler: handler
      });
    }
    
    
    /**
     * removeEventListener( [ target, ] type, handler )
     * Remove event listeners from the event target
     */
    function removeEventListener ( target, type, handler ) {
      if ( typeof target === "string" ) {
        handler = type;
        type = target;
        target = window;
      }
      if ( ! lib[type] ) {
        return;
      }
      lib[type].forEach(function ( data ) {
        if ( data.target === target && data.handler === handler ) {
          data.target = null;
          data.handler = null;
        }
      });
    }
    
    /**
     * trigger( type [, event] )
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     */
    function trigger ( type, event ) {
      if ( ! lib[type] ) return;
      event || ( event = {});
      lib[type].forEach(function ( data ) {
        if ( ! data.target ) {
          return;
        }
        return data.handler.call( data.target, extend( event, {
          target: event.target || data.target,
          currentTarget: data.target,
          type: type
        } ) );
      });
    }

    
    XA.add('', {
      
      addEventListener: addEventListener,
      removeEventListener: removeEventListener,
      trigger: trigger,
      on: addEventListener,
      off: removeEventListener
      
    });
    
  })();
  
  
  /**
   * Require
   * load external scripts
   */
  XA.add('', {
    require: function ( url, callback ) {
      var script = document.createElement('script');
      script.type = "text/javascript";
      
      if ( script.readyState ) {
        script.onreadystatechange = function () {
          if ( script.readyState === "loaded" || script.readyState === "complete" ) {
            script.onreadystatechange = null;
            (callback || noop)();
          }
        };
      } else {
        script.onload = function () {
          (callback || noop)();
        };
      }
      
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  });

  
  /**
   * log vars from backend
   */
  XA.register('log vars', function ( data, id ) {
    XA.log(['log_id('+id+'):', document.getElementById('log_id_' + id)]);
    XA.log(data);
  });
})( this, this.document );
