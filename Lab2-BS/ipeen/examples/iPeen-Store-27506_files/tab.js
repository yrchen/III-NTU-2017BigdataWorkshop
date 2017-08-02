/*

new Tab( target, options )

options
{
  defaultIndex: 0 (random 亂數指定)
  handler: '>ul a'
  hoverHandler: '>ul.hoverable a',
  hoverInterval: 300,
  boxes: '>div',
  
  // Event Handler
  change: function(){} // trigger if tab switches
  
  'enter #box-id': function(){}
}

*/
(function( $, ipeen ){
  
  ipeen.Class('Tab', (function(){
    
    var defaultOptions = {
      defaultIndex: 0,
      handler: '>ul a',
      hoverHandler: '>ul.hoverable a',
      hoverInterval: 300,
      boxes: '>div',
      change: $.noop
    };
    
    return {
      
      __construct: function ( target, options ) {
        var node;
        
        node = this.node = {};
        this.currentIndex = false;
        this.options = $.extend( {}, defaultOptions, options );
        
        node.root = $(target);
        node.handler = node.root.find( this.options.handler );
        node.hoverHandler = node.root.find( this.options.hoverHandler );
        node.boxes = node.root.find( this.options.boxes );
        
        // prepare
        if(this.options.defaultIndex === "random"){
          this.options.defaultIndex = this._getRandomIndex();
        }
        node.boxes.hide();
        this.switchTab( this.options.defaultIndex );
        
        // observe
        node.handler.on('click', this._clickTab.bind( this ) );
        node.hoverHandler.on('mouseenter', this._hoverTab.bind( this ) );
      },

      _getRandomIndex:function(){
        var node = this.node, handlerNum = node.handler.length || node.hoverHandler.length;
        return Math.floor(Math.random()*handlerNum);
      },
      
      _clickTab: function ( event ) {
        var index = $.inArray( event.currentTarget, this.node.handler );
        event.preventDefault();
        this.switchTab( index );
      },

      _hoverTab: function ( event ) {
        var index = $.inArray( event.currentTarget, this.node.hoverHandler );
        this.hoverTimer = setTimeout(timer.bind(this), this.options.hoverInterval);
        function timer(){
          this.switchTab( index );
        }
        this.node.hoverHandler.on('mouseleave', this._leaveTab.bind( this ));
      },

      _leaveTab:function(event){
        clearTimeout(this.hoverTimer);
      },
      
      switchTab: function ( index ) {
        var id,
            anchor,
            node = this.node,
            currentIndex = this.currentIndex,
            options = this.options;
        
        function box ( i ) {
          return node.boxes.eq( i );
        }
        
        if ( index === currentIndex ) {
          return;
        }
        
        // leave
        if ( currentIndex !== false ) {
          box( currentIndex ).hide();
          anchor = node.handler.eq( currentIndex );
          anchor.removeClass('active');
          id = anchor.attr('href');
          (options['leave ' + id] || $.noop).call( this, box( currentIndex ), currentIndex );
        }
        
        // change (tab switches)
        options.change.call( this, box( index ), index );
        
        // enter
        box( index ).show();
        anchor = node.handler.eq( index );
        anchor.addClass('active');
        id = anchor.attr('href');
        (options['enter ' + id] || $.noop).call( this, box( index ), index );
        
        // save index
        this.currentIndex = index;
      },
      
      getCurrentIndex: function () {
        return this.currentIndex;
      },
      
      getCurrentBoxId: function () {
        return this.node.handler.eq( this.currentIndex ).attr('href');
      }
      
    };
  })());
  
})( this.jQuery, this.ipeen );