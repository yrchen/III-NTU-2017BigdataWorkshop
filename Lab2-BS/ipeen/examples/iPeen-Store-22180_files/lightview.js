/**

<!-- overlay -->
<div></div>

<!-- box -->
<div class="lightview-box">
  <div class="lightview-scene">
    <img src="" />
  </div>
  <div class="lightview-content">
  </div>
  
  <a href="#">next button</a>
  <a href="#">prev button</a>
  <a href="#">close button</a>
</div>

 */
(function( $, window, document, undefined ){
  
  "use strict";

  var namespace = "LightView",
      $body     = $('body'),
      $window   = $(window),
      $document = $(document),
      
      /** settings **/
      defaultSettings = {
        content:           '+div',  // content: next sibling of the target
        complete:          $.noop   // callback
      },
      
      /** static variable **/
      dom    = {}, clone  = {},
      config = {
	      errorImage:               "/js/jquery/lightview/data/error.jpg",
                                              // default image
                                              
        background:               'black',    // overlay background
        opacity:                  .8,         // overlay opacity
        navOpacity:               .4,         // 'next', 'prev' button opacity when mouse is not focus on
        animationInterval:        300,        // animation duration
        zIndex:                   1000,       // default zIndex
        padding:                  10,         // box padding area
        margin:                   20,         // box's margin against the window
        minWidth:                 450,        // accept min value of the box width
        windowMinAcceptedHeight:  400,        // due to box will auto-resize depend on window size,
                                              //    if window height is less than 400px, keep the box dimension and doesnt resize it anymore
        classNamePrefix:          'lightview' // for css using, class prefix
      },
      
      layerIndex = { // zIndex order for each element, never change this
        overlay: 0,
        box:     1,
        scene:   2,
        content: 3,
        prev:    4,
        next:    5,
        close:   6
      };

  /**
   * construct
   */
  function __construct ( items, settings ) {
    if ( ! ( items instanceof $ ) ) items = $(items);
    
    var self = this,
        lib = [],
        winWidth, winHeight,
        currentIndex,
        is_loading = false,
        is_exit = true,
        is_holding = false;
    
    settings = $.extend( {}, defaultSettings, settings );
    
    function buildEnvironment () {
      dom.overlay = $('<div>')
        .hide()
        .css({
          zIndex: config.zIndex + layerIndex.overlay,
          position: 'fixed',
          left: 0, right: 0, top: 0, bottom: 0,
          background: config.background,
          opacity: config.opacity
        })
        .appendTo($body);
      
      dom.box = $('<div>')
        .hide()
        .css({
          zIndex: config.zIndex + layerIndex.box,
          position: 'fixed', top: 0, left: 0,
          padding: config.padding
        })
        .addClass( config.classNamePrefix + '-box' );
    
      dom.scene = $('<div>')
        .css({
          zIndex: config.zIndex + layerIndex.scene
        })
        .addClass( config.classNamePrefix + '-scene' );

      dom.content = $('<div>')
        .css({
          zIndex: config.zIndex + layerIndex.content
        })
        .addClass( config.classNamePrefix + '-content' );

      
      clone.box = dom.box.clone();
      clone.scene = dom.scene.clone();
      clone.content = dom.content.clone();
      
      dom.box.appendTo( $body );
      dom.scene.appendTo( dom.box );
      dom.content.appendTo( dom.box );
      
      clone.box.appendTo( $body ).css({
        position: 'absolute',
        top: -5000,
        left: -5000,
        opacity: 0
      });
      clone.scene.appendTo( clone.box );
      clone.content.appendTo( clone.box );
      
      dom.next = $('<a>')
        .css({
          zIndex: config.zIndex + layerIndex.next,
          opacity: config.navOpacity
        })
        .attr('href', '#' )
        .addClass( config.classNamePrefix + '-next' )
        .appendTo( dom.box );
      
      dom.prev = $('<a>')
        .css({
          zIndex: config.zIndex + layerIndex.prev,
          opacity: config.navOpacity
        })
        .attr('href', '#' )
        .addClass( config.classNamePrefix + '-prev' )
        .appendTo( dom.box );
      
      dom.close = $('<a>')
        .css({
          zIndex: config.zIndex + layerIndex.close
        })
        .attr('href', '#' )
        .addClass( config.classNamePrefix + '-close' )
        .appendTo( dom.box );
      
    }
    
    function prepare () {
      if ( ! dom.overlay ) buildEnvironment();
      $window.on( 'resize', saveDimension );
    }
    
    function add ( target ) {
      if ( ! target ) target = items;
      target.each(function(i, item){
        var $item = $(item),
            data = {};
        data.source = $item.attr('href');
        data.content = $item.find(settings.content);
        item.lightviewIndex = lib.length;
        lib.push( data );
      });
      target.on('click', start);
    }
    

    
    function start ( event ) {
      is_exit = false;
      currentIndex = event.currentTarget.lightviewIndex;
      dom.scene.css({ width: 100, height: 100 });
      
      /** observe **/
      dom.overlay.on( 'click', exit );
      $document.on( 'keydown', keydown );
      dom.close.on( 'click', exit );

      dom.next.on( 'click', go.next )
              .on( 'mouseover', go.mouseover )
              .on( 'mouseout', go.mouseout );
      dom.prev.on( 'click', go.prev )
              .on( 'mouseover', go.mouseover )
              .on( 'mouseout', go.mouseout );
      
      dom.box.css( getPosition() );
      dom.overlay.fadeIn();
      dom.box.fadeIn();
      
      gotoshow( currentIndex );
      return false;
    }
    
    function gotoshow ( index ) {
      function imageLoad ( event ) {
        if ( is_exit ) return;
        
        /************ calculate *************/
        var index = currentIndex,
            clone_image = lib[index].image.clone(),
            imageOriginalWidth,
            imageOriginalHeight,
            imageRatio,
            imageWidth,
            imageHeight,
            sceneWidth,
            sceneHeight,
        
            top,
            left,
        
            maxHeight,
            heightDiff,
        
            boxWidth,
            boxHeight,
            boxInnerWidth,
            boxInnerHeight,
            counter = 0,
            position;
            

        function calculate () {
          imageOriginalWidth  = clone_image.width(),
          imageOriginalHeight = clone_image.height();
          if ( counter++ < 100 && imageOriginalWidth == 0 && imageOriginalHeight == 0 ) {
            setTimeout( calculate, 30 );
          } else {
            calculate.end();
            go();
          }
        }
        
        calculate.prepare = function () {
          clone.box.show();

          maxHeight = winHeight - config.margin * 2;
          clone_image.appendTo( clone.scene );
          clone.content.html(lib[index].content.html());

        }
        calculate.end = function () {
          function set_content () {
            sceneWidth  = imageWidth < 450 ? 450 : imageWidth;
            sceneHeight = imageHeight;
        
            clone.scene.css({
              width: sceneWidth, height: sceneHeight
            });
            clone.box.css({
              width: sceneWidth
            });
          }

          function set_image () {
            heightDiff = boxInnerHeight - maxHeight;
            imageHeight = imageHeight - heightDiff;
            imageWidth = imageHeight * imageRatio;
            clone_image.css({
              height: imageHeight,
              width: imageWidth
            });
          }
      
          function check_height () {
            boxInnerHeight = clone.box.innerHeight();
            if ( maxHeight < config.windowMinAcceptedHeight ) maxHeight = config.windowMinAcceptedHeight;
            return boxInnerHeight > maxHeight;
          }
        
          imageRatio = imageOriginalWidth / imageOriginalHeight;
  
          imageWidth  = imageOriginalWidth;
          imageHeight = imageOriginalHeight;
  
          set_content();

          if ( check_height() ) {
            set_image();
            set_content();
            if ( check_height() ) {
              set_image();
              set_content();
            }
          }
  
          boxWidth  = clone.box.width();
          boxHeight = clone.box.height();
          boxInnerWidth = clone.box.innerWidth();
          boxInnerHeight = clone.box.innerHeight();
          top = ( winHeight - boxInnerHeight ) / 2;
          left = ( winWidth - boxInnerWidth ) / 2;

          if ( top < config.margin ) top = config.margin;
          if ( left < config.margin ) left = config.margin;
  
          position = {
            top: top,
            left: left,
            width: boxWidth,
            height: boxHeight,
            imageOriginalWidth: imageOriginalWidth,
            imageOriginalHeight: imageOriginalHeight,
            sceneWidth: sceneWidth,
            sceneHeight: sceneHeight,
            imageWidth: imageWidth,
            imageHeight: imageHeight
          };

          clone_image.remove();
          clone.scene.empty();
          clone.content.empty();
    
          clone.box.hide();
        }
        
        function go() {
          loading.end();
          lib[currentIndex].position = position;
          dom.close.hide();
          dom.box.animate({
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height
          }, config.animationInterval, show);
        }
        /************ calculate *************/

        calculate.prepare();
        calculate();

      }
      function imageError () {
        if ( is_exit ) return;
        lib[currentIndex].image = $('<img>')
          .on('load', imageLoad )
          .attr('src', config.errorImage );
      }
      
      loading.start();
      lib[currentIndex].image = $('<img>');
      lib[currentIndex].image.on('load', imageLoad )
                             .on('error', imageError )
                             .attr('src', lib[currentIndex].source );
    }
    
    function keydown ( event ) {
      var code = event.keyCode;
      if ( code == 27 ) { // ESC
        exit();
        return false;
      } else if ( code == 37 ) { // LEFT
        go.prev();
        return false
      } else if ( code == 39 ) { // RIGHT
        go.next();
        return false;
      }
    }
    
    function show () {
      var data = lib[currentIndex],
          position = data.position,
          navCSS = {
            width:  position.sceneWidth / 2 + config.padding,
            height: position.sceneHeight + config.padding
          };
      dom.close.show();
      dom.scene.css({
        width: position.sceneWidth,
        height: position.sceneHeight
      });
      data.image
        .hide()
        .appendTo( dom.scene )
        .css({
          width: position.imageWidth,
          height: position.imageHeight
        });
      
      dom.prev.css( navCSS );
      dom.next.css( navCSS );
      
      
      if ( currentIndex <= 0 ) {
        dom.prev.addClass('disabled');
      } else {
        dom.prev.removeClass('disabled');
      }
      
      if ( currentIndex >= lib.length - 1 ) {
        dom.next.addClass('disabled');
      } else {
        dom.next.removeClass('disabled');
      }
      
      dom.content.hide().html(data.content.html());
      dom.content
        .add( data.image )
        .add( dom.prev )
        .add( dom.next )
        .fadeIn( config.animationInterval );
      
      settings.complete( dom.content, data.image, currentIndex, self );
      is_holding = false;
    }
    
    function saveDimension () {
      winWidth = $window.width();
      winHeight = $window.height();
    }
    
    function getPosition () {
      var width  = dom.scene.width(),
          height = dom.scene.height(),
          totalWidth = width + config.padding * 2,
          totalHeight = height + config.padding * 2;
      
      return {
        top:  ( winHeight - totalHeight ) / 2,
        left: ( winWidth  - totalWidth  ) / 2
      };
      
    }
    
    function go ( index ) {
      dom.scene
        .add( dom.content )
        .add( dom.next )
        .add( dom.prev )
        .fadeOut( config.animationInterval );
      
      setTimeout( function(){
        dom.scene.empty().show();
        dom.content.empty().show();
        gotoshow( index );
      }, config.animationInterval + 100 );
    }

    go.mouseover = function ( event ) {
      $(event.currentTarget).animate({opacity: 1 });
    };

    go.mouseout = function ( event ) {
      $(event.currentTarget).animate({opacity: config.navOpacity });
    };

    go.next = function ( event ) {
      if ( ! is_holding && currentIndex < lib.length - 1 ) {
        is_holding = true;
        currentIndex++;
        go( currentIndex );
      }
      return false;
    };

    go.prev = function ( event ) {
      if ( ! is_holding && currentIndex > 0 ) {
        is_holding = true;
        currentIndex--;
        go( currentIndex );
      }
      return false;
    };
    
    function exit () {
      is_exit = true;
      currentIndex = -1;
      
      dom.scene
        .add( dom.content )
        .add( dom.overlay )
        .add( dom.box )
        .add( dom.prev )
        .add( dom.next )
        .fadeOut( config.animationInterval );
      
      setTimeout( function () {
        dom.scene.empty().show();
        dom.content.empty().show();
        dom.scene
          .add( dom.box )
          .add( dom.content )
          .add( dom.prev )
          .add( dom.next )
          .css({ width: 'auto', height: 'auto' });

      }, config.animationInterval + 100 );
      
      dom.overlay.off( 'click', exit );
      $document.off( 'keydown', keydown );
      dom.close.off( 'click', exit );
      
      dom.next.off( 'click', go.next )
              .off( 'mouseover', go.mouseover )
              .off( 'mouseout', go.mouseout );
      dom.prev.off( 'click', go.prev )
              .off( 'mouseover', go.mouseover )
              .off( 'mouseout', go.mouseout );

      
      return false;
    }
    
    function loading () {}

    loading.start = function () {
      is_loading = true;
      dom.scene.addClass('loading');
    };

    loading.end = function () {
      is_loading = false;
      dom.scene.removeClass('loading');
    };
    
    /** make it public **/
    this.add = add;
    
    /** go **/
    saveDimension();
    prepare();
    add();
  }
  
  /**
   * Class.create
   */
  (function(){
    var Klass = function ( items, settings ) {
      if ( ! ( this instanceof Klass ) ) {
        return new Klass( items, settings );
      }
      __construct.call( this, items, settings );
    };
  
    Klass.prototype = {
      constructor: Klass
    };
    
    /** let config configurable **/
    Klass.config = config;
  
    /**
     * let Klass global
     */
    window[namespace] = Klass;
  })();
  
})(jQuery, this, this.document );

function xx(t){console.log(arguments.length===1?t:[].slice.call(arguments).join(' '));}