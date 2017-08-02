/**
 * Class UISelect
 * 
 * Javascript:
 *   new UISelect( root, options )
 *     options
 *       click    // true: open menu by click
 *                // false: open menu by mouseover
 *       behavior // defining additional actions
 *
 *
 * Sample
 *       behavior: function () {
 *         var self = this,
 *             anchors = this.node.content.find("li a");
 * 
 *         anchors.on('click', function ( event ) {
 *           event.preventDefault();
 *           self.node.label.html( $(event.currentTarget).html() );
 *           self.close();
 *         });
 *       }
 *
 * HTML:
 *   <div class="ui-select">
 *     <a></a>
 *     <div>
 *       <ul>
 *         <li>...</li>
 *       </ul>
 *     </div>
 *   </div>
 */
(function( $, ipeen ){
  
  var defaultUIGenerated = false;
  ipeen.register('ui select', function ( target ) {
    if ( ! target ) {
      if ( defaultUIGenerated ) {
        return;
      } else {
        defaultUIGenerated = true;
        target = ".ui-select";
      }
    }
    $(target).each(function(){
      new ipeen.Class.UISelect( this );
    });
  });
  
  
  ipeen.Class('UISelect', (function(){
    
    var defaultOption = {
      
      preventDefault: true,
      click: true,
      
      // default behavior
      behavior: function () {
        var close = this.close.bind( this );
        this.node.content.find('a').on('click', function () {
          close.delay(80);
        });
      }
    };
    
    return {
      
      isOpen: false,
      isSelfOpen: false,
      isClickContent: false,
      
      __construct: function ( root, options ) {
        var node = this.node = {},
            preventDefault = true;
        node.root = $(root);
        options = options || {};
        if ( node.root.data('preventdefault') !== undefined ) {
          preventDefault = node.root.data('preventdefault');
        }
        this.options = $.extend( {},
          defaultOption,
          {
            click: ! node.root.hasClass('hoverable') || ipeen.support.touch,
            preventDefault: preventDefault
          },
          options );

        this.prepare();
        this.observe();
      },
      
      prepare: function () {
        var node = this.node;
        node.label = node.root.find(">:first-child");
        node.box = node.root.find(">:last-child");
        node.content = node.box.find(">:first-child");
        node.box.css({
          position: 'relative'
        });
        
        node.content.css({
          position: 'absolute'
        });
      },
      
      observe: function () {
        var node = this.node,
            options = this.options;
        
        node.label.on('click', function ( event ) {
          if ( options.preventDefault ) {
            event.preventDefault();
          }
        });

        node.label.on('click', this.clickLabel.bind( this ) );
        node.content.on('click', this.clickContent.bind( this ) );
        ipeen.$document.on('click', this.clickDocument.bind( this ) );

        if ( ! this.options.click ) {
          node.root.on('mouseenter', this.open.bind( this ) );
          node.root.on('mouseleave', this.close.bind( this ) );
        }
        
        this.options.behavior.call( this );
      },
      
      clickLabel: function ( event ) {
        var node = this.node;
        if ( ! this.isOpen ) {
          this.open();
          this.isSelfOpen = true;
        } else {
          this.close();
        }
      },
      
      clickContent: function ( event ) {
        this.isClickContent = true;
        (function(){
          this.isClickContent = false;
        }).bind(this).delay(100);
        // event.stopPropagation();
      },
      
      clickDocument: function ( event ) {
        if ( this.isSelfOpen ) {
          this.isSelfOpen = false;
        } else if ( this.isClickContent ) {
          return;
        } else {
          this.close();
        }
      },
      
      open: function () {
        var node = this.node;
        node.content.removeClass('hide');
        node.root.addClass('open');
        node.label.addClass('active');
        this.isOpen = true;
      },
      
      close: function () {
        var node = this.node;
        node.content.addClass('hide');
        node.root.removeClass('open');
        node.label.removeClass('active');
        this.isOpen = false;
      }
    }
  })());
  
})( this.jQuery, this.ipeen );