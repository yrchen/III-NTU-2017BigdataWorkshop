(function( $, ipeen ){
  
  /**
   * block click tracking
   */
  ipeen.register('blockclick tracking init', function ( page ) {
    var urlPattern = "/ad/blockclick.php?page=%PAGE%&block=%BLOCK%&key=%KEY%&next=%NEXT%";

    $(document).on('click', 'a[data-key]', function ( event ) {
      if ( this._urlModified ) {
        return;
      }
      this._urlModified = true;
      
      var me = $(this),
          key = me.data('key'),
          block = me.closest('[data-block]').data('block'),
          next = encodeURIComponent(me.attr('href'));

      me.attr('href', urlPattern.replace("%PAGE%", page)
                                .replace("%BLOCK%", block)
                                .replace("%KEY%", key)
                                .replace("%NEXT%", next) );
    });
  });
  
  
  /**
   * 顯示徽章
   */
  ipeen.register('show badge', function () {
    BadgeBlock.show();
  });
  
  
  /**
   * redirect to login page
   */
  ipeen.register('redirect to login page', function ( retUrl ) {
    retUrl = encodeURIComponent( retUrl || window.location.href );
    window.location = "/login/?next=" + retUrl;
  });
  
  
  /**
   * Breadcrumb
   */
  ipeen.register('breadcrumb init', function () {
    if ( ipeen.support.touch ) {
      return;
    }
    
    $('#breadcrumb a').each(function(){
      var anchor = $(this),
          lib = anchor.data('lib');
      if ( lib ) {
        generateSubMenu( anchor, lib );
      }
    });
    
    function generateSubMenu ( anchor, lib ) {
      var wrapper,
          url,
          name,
          maxLength = 1,
          unit = 13,
          listWidth = 100,
          items = [];
      
      wrapper = anchor.parent();

      for ( url in lib ) {
        name = lib[url];
        maxLength = Math.max( maxLength, name.length );
        items.push( 
          $('<li>')._content(
            $('<a>').attr('href', url).html( name )
          )
        );
      }

      listWidth = Math.max( listWidth, ( maxLength + 2 ) * unit );
      
      $('<div>')._content(
        $('<ul class="hide g-droplist">').css('width', listWidth)._content(
          items
        )
      ).appendTo( wrapper );
      
      new ipeen.Class.UISelect( wrapper, {
        preventDefault: false,
        click: false
      });
    }
    
  });
  
  /**
   * LBS
   */
  ipeen.register('lbs init', function ( LBS_DATE_LIST ) {
    var node = {},
        refresh = LBS_DATE_LIST.PATH_NAME === "";
    prepare();
    return;
    
    function prepare () {
      node.root = $('#region');
      node.button = node.root.find('.area a');
      LBS_DATE_LIST || ( LBS_DATE_LIST = {} );
      node.button.on('click', clickButton);
    }

    function clickButton ( event ) {
      if ( refresh ) {
        event.preventDefault();
        setCookie( $(this).data('lbsname') );
        window.location.reload();
      }
    }
    
    function setCookie ( region_key ) {
      $.cookie(LBS_DATE_LIST.COOKIE_SET, 1, { domain : 'ipeen.com.tw', path: '/', expires : (parseInt(LBS_DATE_LIST.COOKIE_TIME)/60)});
      $.cookie(LBS_DATE_LIST.COOKIE_NAME, region_key, { domain : 'ipeen.com.tw', path: '/', expires : (parseInt(LBS_DATE_LIST.COOKIE_TIME)/60)});
    }

  });

  
  /**
   * 網址後帶有 &sul= 者全部加上現在網址(path)
   */
  ipeen.register('write &sul= url', function me() {
    if ( me.initialized ) {
      return;
    }
    me.initialized = true;
    var retUrl = encodeURIComponent( window.location.pathname + window.location.search );
    $('a[href$="sul="]').each(function(){
      this.setAttribute('href', this.getAttribute('href') + retUrl );
    });
  });
  
  /**
   * 網址後帶有 &next= 者全部加上現在網址(full url)
   */
  ipeen.register('write &next= url', function me() {
    if ( me.initialized ) {
      return;
    }
    me.initialized = true;
    var retUrl = encodeURIComponent( window.location.href );
    $('a[href$="next="]').each(function(){
      this.setAttribute('href', this.getAttribute('href') + retUrl );
    });
  });

  //image lazy load
  ipeen.register('lazy load', function( selector ){
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
        $window.on({
          scroll: scroll,
          resize: resize
        });
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
    lazyLoad(selector);
  });

  /**
   * 美食查詢選單 類Amazon plugin
   */
  ipeen.register('query dropdown', function () {
    var query_menu =$("#query-list"),isMenuOpen = false;
   query_menu.menuAim({
            activate: activateSubmenu,
            deactivate: deactivateSubmenu,
            exitMenu: hideSubmenu
        });
     function activateSubmenu(row) {
            var $row = $(row).addClass("active"),
                submenuId = $row.data("submenuId"),
                $submenu = $("#" + submenuId);
            // Show the submenu
            if(!isMenuOpen){
              $submenu.removeClass("hide").css("width",0).animate({
                width:"590px"
              },300,function(){
                isMenuOpen = true;
              });

            }else{
              $submenu.removeClass("hide");
            }
            // Keep the currently activated row's highlighted look
            $submenu.parent("li").addClass("active");
        }

        function deactivateSubmenu(row) {
            var $row = $(row).removeClass("active"),
                submenuId = $row.data("submenuId"),
                $submenu = $("#" + submenuId);
            // Hide the submenu and remove the row's highlighted look
            $submenu.addClass("hide");
            $submenu.parent("li").removeClass("active");
        }

        function hideSubmenu(){
            isMenuOpen = false;
             return true;
             //true wipe out last activate row
             //false remember last active row
        }
  });
  

})( this.jQuery, this.ipeen );
