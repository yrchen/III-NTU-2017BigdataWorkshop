/**
 * support.js
 * check Modernizr for more details (http://modernizr.com/)
 */
(function( $, XA, window, document, namespace, undefined ){

  var prefix = '-webkit- -moz- -ms- -o- '.split(' '), // note: there's a space at the end!
      ucPrefix = 'Webkit Moz ms O'.split(' '),        // note: there's no space at the end!
      div = document.createElement('div'),
      mStyle = div.style,
      
      /** library **/
      lib = {},
      
      /** tests functions **/
      tests = {},
      
      /** prepare sandbox **/
      sandbox = $('<div>').css({
        position: 'absolute',
        left: -9999,
        top: -9999,
        opacity: 0
      }).appendTo( XA.$body );
  
  
  function setCss ( value ) {
    mStyle.cssText = value;
  }
  
  function styleContains ( prop, value ) {
    return (mStyle[prop] + "").contains( value );
  }
  
  function testPropsAll ( prop ) {
    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
        props = (prop + ' ' + ucPrefix.join(ucProp + ' ') + ucProp).split(' ');
    return testProps( props );
  }
  
  function testProps ( prop ) {
    var support = false,
        isSupport = function ( p ) {
          return mStyle[p] !== undefined;
        };
    if ( XA.Util.isArray( prop ) ) {
      prop._each(function(p){
        if ( isSupport(p) ) {
          support = true;
          return false; // break loop
        }
      });
      return support;
    }
    return isSupport( prop );
  }

  
  function generateCssText ( value ) {
    var result = [];
    prefix.forEach(function( str ){
      result.push( value.replace("%PREFIX%", str) );
    });
    return result.join(';');
  }
  
  function generateClassName ( name, support ) {
    return ( support ? '' : 'no-' ) + name;
  }
  
  function batchExec () {
    var classList = [];
    Object.keys( tests ).forEach(function( name ){
      var support = tests[name]();
      lib[name] = support;
      classList.push( generateClassName( name, support ) );
    });
    XA.addClass( classList );
  }
  
  tests['rgba'] = function () {
    setCss('background-color:rgba(1,1,1,.5)');
    return styleContains('backgroundColor', 'rgba');
  };
  
  tests['calc'] = function () {
    setCss( generateCssText( 'width:%PREFIX%calc( 100% - 50px )' ) );
    return styleContains('width', 'calc');
  };
  
  tests['columns'] = function () {
    return testPropsAll('columnCount');
  };
  
  tests['multibackground'] = function () {
    setCss('background:url(https://),url(https://),red url(https://)');
    return (/(url\s*\(.*?){3}/).test(mStyle.background);
  };
  
  tests['backgroundsize'] = function () {
    return testPropsAll('backgroundSize');
  };
  
  tests['touch'] = function () {
    return !! ( ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch );
  };
  
  tests['placeholder'] = function () {
    return !! ( 'placeholder' in document.createElement('input') );
  };
  
  tests['highpixeldensity'] = function () {
    return window.devicePixelRatio && window.devicePixelRatio > 1;
  };
  
  /**
   * smart scroll
   * Mac OS 10.7 later has a feature with window scrollbars always hidden
   */
  tests['smartscroll'] = function () {
    var html = "<div style='position:absolute;overflow:auto;width:100px;height:100px;'><div style='height:200px;'></div></div>";
    return sandbox.html( html ).find('div div').width() === 100;
  };
  
  /**
   * Getter: XA.support( name )
   * @return {Boolean}
   *
   * Setter: XA.support( name, support )
   */
  XA.add('',{
    support: function ( name, support ) {
      if ( support === undefined ) {
        if ( lib[name] === undefined ) {
          XA.error( "support", "Support name `" + name + "` is not defined.");
          return false;
        }
        return lib[name];
      } else if ( typeof support !== "boolean" ) {
        XA.warn( namespace + ".support() input value is not a boolean value with name `" + name + "`.");
        support = !!support;
      }
      lib[name] = support;
      XA.addClass( generateClassName( name, support ) );
    }
  });

  /** run features test **/
  batchExec();
  
  /** remove elements **/
  sandbox.remove();
  div = null;
  
  XA.add('support', lib);

})( this.jQuery, this[this['__xans__']], this, this.document, this['__xans__'] );
