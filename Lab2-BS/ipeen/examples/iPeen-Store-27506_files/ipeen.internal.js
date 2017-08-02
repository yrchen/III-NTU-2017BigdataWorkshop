/**
 * internal.js
 */
(function( $, XA, window, document, namespace, undefined ){
  
  "use strict";
  
  /**
   * DOM save
   */
  XA.add('', {
    '$window': $(window),
    '$document': $(document),
    '$body': $(document.body),
    '$html': $(document.documentElement)
  });
  
  
  /**
   * Add & Remove <html> Class
   * 
   * classList support: Chrome 8+ , Firefox 3.6+, Opera 11.5+, Safari 5.1+
   * jQuery did not detect classList if browsers implement this feature.
   */
  (function(){
    var html = document.documentElement,
        smart = html.classList && html.classList.add && html.classList.remove;
    
    function addClass ( className ) {
      if ( smart ) {
        if ( typeof className === "string" ) {
          className = className.split(' ');
        }
        className.forEach(function( str ){
          if ( str !== "" ) {
            html.classList.add( str );
          }
        });
      } else {
        if ( XA.Util.isArray( className ) ) {
          className = className.join(' ');
        }
        XA.$html.addClass( className );
      }
    }
    
    function removeClass ( className ) {
        if ( smart ) {
          html.classList.remove( className );
        } else {
          XA.$html.removeClass( className );
        }
      }
    
    XA.add('', {
      
      addClass: addClass,
      removeClass: removeClass
      
    });
    
    /** remove no-js, add js **/
    removeClass( 'no-js' );
    addClass( 'js' );
    
    /** add browser info (ex: ie ie6 | firefox firefox11) **/
    addClass( XA.UA.browserName() );
    addClass( XA.UA.browserFullName() );
    XA.UA.ipad() && addClass('ipad');
    XA.UA.iphone() && addClass('iphone');

  })();
  
  
  
  /**
   * bind Window Smart Resize
   * resize: a bit delay (40ms)
   * smartresize: till user stop resizing (150ms)
   *
   *  XA.on('resize', function (e) {
   *    xx('resize!');
   *  });
   *  XA.on('smartresize', function (e) {
   *    xx('done!');
   *  });
   */
  (function(){
    var timer = {
      'resize' : false,
      'smartresize' : false
    };
    
    function resize ( type, duration ) {
      var inside;
      function exec () {
        if ( timer[type] != inside ) return;
        XA.trigger( type );
      }

      if ( timer[type] ) {
        window.clearTimeout( timer[type] );
      }
      inside = timer[type] = window.setTimeout( exec, duration );
    }
    
    XA.$window.on( 'resize', resize.curry( 'resize', 40 ) );
    XA.$window.on( 'resize', resize.curry( 'smartresize', 150 ) );
  })();
  
  
  
})( this.jQuery, this[this['__xans__']], this, this.document, this['__xans__'] );
