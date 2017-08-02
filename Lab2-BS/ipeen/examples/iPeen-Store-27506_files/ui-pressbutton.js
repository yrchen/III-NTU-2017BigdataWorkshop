/**
 * Class UIPressButton
 *
 * Javascript: 
 *   new UIPressButton( target [, options] )
 *     options.click( pressed )
 *
 * API:
 *   press:    let button pressed
 *   unpress:  let button un-pressed
 *
 * Sample Callback:
 *   click: function ( pressed ) {
 *     var self = this;
 *     if ( pressed ) {
 *       $.ajax('subscribe.html', {
 *         success: function () {
 *           self.press();
 *         }
 *       });
 *     } else {
 *       $.ajax('unsubscribe.html', {
 *         success: function () {
 *           self.unpress();
 *         }
 *       });
 *     }
 *   }
 * 
 * HTML:
 *   Pressed
 *     <a class="pressed" href="#" data-unpress="我要收藏" data-press="已收藏">已收藏</a>
 *   Unpressed
 *     <a class="" href="#" data-unpress="我要收藏" data-press="已收藏">我要收藏</a>
 */
(function( $, ipeen ){
  
  ipeen.Class('UIPressButton', (function(){
    
    var defaultOptions = {
      click: function ( pressed ) {
        if ( pressed ) {
          this.press();
        } else {
          this.unpress();
        }
      }
    };

    return {
      __construct: function ( root, options ) {
        var node = this.node = {};
        node.root = $(root);
        this.options = $.extend( {}, defaultOptions, options );
        this.prepare();
        this.observe();
      },
    
      prepare: function () {
        var root = this.node.root,
            text = root.html();
        this.isPressed = root.hasClass('pressed');
        this.pressText = root.data('press') || text;
        this.unpressText = root.data('unpress') || text;
        this.updateText();
      },
    
      observe: function () {
        this.node.root.on('click', this.click.bind( this ) );
      },
    
      click: function ( event ) {
        $(event.target).blur();
        event.preventDefault();
        this.options.click.call( this, ! this.isPressed );
      },
      
      press: function () {
        this.isPressed = true;
        this.node.root.addClass('pressed');
        this.updateText();
      },
      
      unpress: function () {
        this.isPressed = false;
        this.node.root.removeClass('pressed');
        this.updateText();
      },
    
      updateText: function () {
        this.node.root.html( this.isPressed ? this.pressText : this.unpressText );
      }
    
    }
  })());
  
})( this.jQuery, this.ipeen );