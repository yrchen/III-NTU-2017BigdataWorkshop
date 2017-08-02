function lazyLoad ( selector ) {
    var images = $(selector),
        windowHeight = 0,
        $window = $(window),
        $document = $(document);
  
    prepare();
    observe();
    resize();
    scroll();
    
    function prepare() {
      images.each(function(){
        var image = $(this),
            source = image.attr('src');
        image.data('source', source);
        image.attr('src', "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D");
      });
    }
    
    function observe() {
      $window.scroll(scroll);
      $window.resize(resize);
    }
    
    function scroll() {
      var scrollTop = $document.scrollTop(),
          visibleHeight = scrollTop + windowHeight;
      
      images.each(function(){
        var image = $(this),
            source = image.data('source');
        if ( source === false ) {
          return;
        }

        var imageTop = image.offset().top;
        if ( imageTop < visibleHeight ) {
          // show
          image.attr('src', source );
          image.data('source', false);
        }
      });
    }
    function resize() {
      windowHeight = $window.height();
    }
  }
  lazyLoad("img.lazy");
