/**
 * mobile.js
 */
(function( $, XA, window, document, namespace, undefined ){
  
  var $event = $.event;
  
  /**
   * Tap Event
   */
  (function() {
    var eventName = 'tap',
        time, 
        moved;
    
    function touchstart () {
      time = new Date();
      moved = false;
    }
    
    function touchmove () {
      if ( moved ) {
        return;
      }
      moved = true;
    }
    
    function touchend ( e ) {
      if ( ! moved && new Date() - time < 300 ) {
        e.type = eventName;
        $event.dispatch.apply( this, arguments );
      }
    }
    
    $event.special[eventName] = {
    	setup: function() {
    		$(this).on({
    		  touchstart: touchstart,
    		  touchmove: touchmove,
    		  touchend: touchend
    		});
    	},
    	teardown: function() {
    	  $(this).off({
    	    touchstart: touchstart,
    	    touchmove: touchmove,
    	    touchend: touchend
    	  });
    	}
    }

  })();
  

  /**
   * TapClick Event
   */
  (function() {
	  var eventType = XA.support.touch ? 'tap' : 'click',
	      eventName = 'tapclick';

    function action ( e ) {
      e.type = eventName;
      $event.dispatch.apply( this, arguments );
    }
    $event.special[eventName] = {
    	setup: function() {
    	  $(this).on( eventType, action );
    	},
    	teardown: function() {
    	  $(this).off( eventType, action );
    	}
    }
  })();

})( this.jQuery, this[this['__xans__']], this, this.document, this['__xans__'] );
