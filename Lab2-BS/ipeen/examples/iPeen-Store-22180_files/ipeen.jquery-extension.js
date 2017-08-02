/**
 * jquery-extension.js
 */
(function( $, XA, window, document, namespace, undefined ){
  
  "use strict";
  
  /**
   * jQuery methods
   */
  $.fn.extend({
    /**
     * isEmpty
     * check jQuery object is empty or not
     * @return {Boolean}
     */
    _isEmpty: function () {
      return this.length === 0;
    },

    /**
     * absPosition
     * @return {Object} left, top
     */
    _absPosition: function () {
      var node = this.get(0),
          data = { top: 0, left: 0 };
      do {
        data.top += node.offsetTop;
        data.left += node.offsetLeft;
      } while ( node = node.offsetParent );
      return data;
    },
    
    /**
     * content
     * create DOM
     *
     * $('<div>')._content(
     *   $('<p>')._content('hello'),
     *   document.createElement('hr'),
     *   ['$',$('<span>')._content('100'),' per each']
     * ).appendTo('body');
     *
     */
    _content: function me () {
      var args = Array.prototype.slice.call(arguments),
          obj = args.shift();
  
      if ( XA.Util.isArray( obj ) ) {
        return me.apply( this, obj );
      } else if ( obj instanceof $ ) {
        obj.appendTo( this );
      } else {
        if ( typeof obj === "string" ) {
          obj = document.createTextNode( obj );
        }
        this.each(function(){
          this.appendChild( obj.cloneNode() );
        });
      }
      if ( args.length != 0 ) {
        return me.apply( this, args );
      }
      return this;
    }
    
  });
  
  
  /**
   * easing
   */
  $.extend($.easing, {
  	easeInQuad: function (x, t, b, c, d) {
  		return c*(t/=d)*t + b;
  	},
    easeOutQuart: function (x, t, b, c, d) {
    	return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
    	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    }
  });
  
  
})( this.jQuery, this[this['__xans__']], this, this.document, this['__xans__'] );
