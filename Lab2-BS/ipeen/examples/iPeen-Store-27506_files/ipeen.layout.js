/**
 * layout.js
 */
(function( $, XA, window, document, namespace, undefined ){
  
  "use strict";
  
  var lib = {},
      errorTypeLogged = {};

  
  XA.add('Layout', {
    
    /**
     * get window width
     * @return {Number} window width (scrollbar included)
     */
    getWindowWidth: function () {
      var width = 0,
          bodyStyle,
          htmlStyle;
      if ( window.innerWidth ) {
        width = window.innerWidth;
      } else {
        bodyStyle = document.body.style;
        htmlStyle = document.documentElement.style;
        bodyStyle.overflow = 'hidden';
        htmlStyle.overflow = 'hidden';
        width = document.documentElement.clientWidth;
        bodyStyle.overflow = '';
        htmlStyle.overflow = '';
      }
      return width;
    }
    
  });
  
  
  /**
   * add layout
   */
  function addLayout () {
    
    function initializeType ( type ) {
      var obj = {};
      if ( lib[ type ] !== undefined ) return;
      
      lib[ type ] = {
        data: [],
        current: "",
        previous: "",
        tester: $('<div>').attr('id', 'Layout-' + type  ).appendTo( document.body )
      };
      
      /**
       * ex: XA.Layout.view()
       * @return {String}     current layout name (ex: desktop)
       */
      obj[type] = function () { return lib[type].current; };
      XA.add('Layout', obj );
    }
    
    /** handle each input string **/
    [].slice.call( arguments ).forEach(function( layoutString ) {
      var data, type, layout, obj;
      data = layoutString.split('.');
      type = data[0];
      layout = data[1];
      
      initializeType( type );
      lib[ type ].data.push( layout );
      
      /**
       * ex: XA.Layout.is_desktop()
       * @return {Boolean}
       */
      obj = {};
      obj[ 'is_' + layout ] = (function ( _type, _layout ) {
        return _layout === lib[ _type ].current;
      }).curry( type, layout );
      XA.add('Layout', obj);
    });

    /** detect layout **/
    detectLayout();
  }
  
  
  /**
   * Detect Layout
   * get current css matched mediaquery string and trigger event
   */
  function detectLayout () {

    for ( var k in lib ) {
      test( k );
    }

    function enter ( type ) {
      XA.addClass( type );
      XA.trigger( type + 'in' );
    }
  
    function leave ( type ) {
      XA.removeClass( type );
      XA.trigger( type + 'out' );
    }
    
    function test ( type ) {
      var me = lib[type],
          tester = me.tester,
          key = tester.css('font-family'),
          pattern = new RegExp( "(" + me.data.join("|") + ")" ),
          m;

      m = pattern.exec( key );
      if ( ! m ) {
        if ( XA.debugging() && ! errorTypeLogged[type] ) {
          XA.warn(namespace + ".Layout: Cannot find layout type from CSS #Layout-" + type + ". (Window width: " + XA.Layout.getWindowWidth() + "px)" );
          errorTypeLogged[type] = true;
        }
        m = ["", ""];
      }
      
      me.current = m[1];
      if ( me.previous !== me.current ) {
        if ( me.previous !== "" ) {
          leave( me.previous );
        }
        if ( me.current !== "" ) {
          enter( me.current );
        }
      }
      
      me.previous = me.current;
    }
    
  }
  
  
  /**
   * trigger layout events while document onload
   */
  function triggerLayout () {
    for ( var k in lib ) {
      if ( lib[k].current !== "" ) {
        XA.trigger( lib[k].current + 'in' );
      }
    }
  }
  
  
  /**
   * Observe Window Resize
   */
  XA.on('resize', detectLayout );

  
  /**
   * let it public
   */
  XA.add('Layout', {
    add: addLayout,
    trigger: triggerLayout
  });
  
  XA.register('add layout', addLayout);
  XA.register('trigger layout', triggerLayout);
  
})( this.jQuery, this[this['__xans__']], this, this.document, this['__xans__'] );
