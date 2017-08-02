(function( $, ipeen ){
  
  var node = {},
      updatePlaceholder = function ( input ) {
        var self = input.get(0);
        self.lastPlaceholderString = self.placeholderString || "";
        self.placeholderString = input.attr('placeholder');
        input.trigger('blur');
      };
  
  node.root = $('#search-top');
  node.typeRoot = node.root.find('.type');
  node.select = node.typeRoot.find('select');
  node.label = node.typeRoot.find('label');
  node.options = node.select.find('option');
  node.inputsDiv = node.root.find('.inputs');
  node.inputs = node.inputsDiv.find('input');
  node.input1 = node.inputs.eq(0);
  node.input2 = node.inputs.eq(1);
  
  /**
   * Action Name: search form init
   */
  ipeen.register('search form shop top init', function () {
    placeholderInit();
    switchSearchTarget();
    searchSuggestions();
    sumitValidator();
  });
  
  /**
   * activate placeholder features for IE8 & IE9
   */
  function placeholderInit () {
    node.input1.val("");
    node.input2.val("");
    if ( ipeen.support.placeholder ) {
      return;
    }
    placeholderize.call( node.input1.get(0), node.input1 );
    placeholderize.call( node.input2.get(0), node.input2 );
    
    function placeholderize ( input ) {
      
      input.on({
        focus: function () {
          var value = input.val();
          if ( value === "" || value === this.lastPlaceholderString || value === this.placeholderString ) {
            input.val("");
            input.removeClass('placeholder');
          }
        },
        blur: function () {
          var value = input.val();
          if ( value === "" || value === this.lastPlaceholderString || value === this.placeholderString ) {
            input.val( this.placeholderString );
            input.addClass('placeholder');
          }
        }
      });
      
      updatePlaceholder( input );
    }
  }
  
  /**
   * switch search target
   */
  function switchSearchTarget () {
    function observe () {
      node.select.on({
        change: change,
        focus: focus,
        blur: blur
      });
    }
    
    function go () {
      node.select.trigger('change');
    }
    
    function focus () {
      node.typeRoot.addClass('active');
    }
    
    function blur () {
      node.typeRoot.removeClass('active');
    }
    
    function change ( event ) {
      var option, width;
      
      option = node.options.eq(this.selectedIndex);
      node.inputsDiv.addClass('hide');
      node.label.html( option.html() ).removeClass("active");
      
      width = node.typeRoot.width();
      node.inputsDiv.css('margin-left', width );
      
      node.input1.attr('placeholder', option.data('placeholder'));
      updatePlaceholder( node.input1 );
      
      if ( 'pfood netbuy mov book map'.split(' ').contains( option.data('type') ) ) {
        node.input2.addClass('hide');
        node.inputsDiv.addClass('wide');
      } else {
        node.input2.removeClass('hide');
        node.inputsDiv.removeClass('wide');
      }
      
      node.inputsDiv.removeClass('hide');

      if ( ! event.isTrigger && ipeen.support.placeholder ) {
        node.input1.focus();
      }
    }
    
    observe();
    go();
  }
  
  
  /**
   * Setup Search Suggestion
   */
  function searchSuggestions () {
    var classPrefix = "suggestion-",
        ajaxUrlPattern = "/suggest/keywords.php?q=%KEYWORD%&limit=10&timestamp=%TIMESTAMP%&S=%CATEGORY%",
        currentKeyword = "",
        isOpening = false,
        isPrepareClosing = false,
        currentIndex = -1,
        lastIndex = -1,
        lastTrigger = 'keyboard',
        resultLength,
        xhr;
    
    prepare();
    observe();
    
    function onchange () {
      var keyword = node.keyword.val();
      if ( keyword === currentKeyword ) {
        return;
      }
      currentKeyword = keyword;
      if ( currentKeyword === "" ) {
        close();
      } else {
        getSuggestions();
      }
    }
    
    function close () {
      resultLength = 0;
      currentIndex = -1;
      lastIndex = -1;
      isOpening = false;
      isPrepareClosing = false;
      node.suggestList.empty();
      node.suggestRoot.hide();
    }
    
    function getSuggestions () {
      var url;
      
      isOpening = true;
      currentTimestamp = (new Date()).getTime();
      currentCategory = $('#search-type-top').val();
      url = ajaxUrlPattern.replace( '%KEYWORD%', currentKeyword ).replace( '%TIMESTAMP%', currentTimestamp ).replace( '%CATEGORY%', currentCategory);

      if ( xhr ) {
        xhr.abort();
      }
    
      xhr = $.ajax( url, {
        success: function ( timestamp, text ) {
          var data;
          if ( isPrepareClosing || ! isOpening ) return;
          if ( currentTimestamp !== timestamp ) return;

          data = $.trim(text).split(/\n/);
          resultLength = data.length;

          if ( resultLength === 1 && data[0] === "" ) {
            close();
            return;
          }
        
          currentIndex = -1;
          
          positionSuggestion();
          node.suggestRoot.show();
          node.suggestList.empty();
        
          data.forEach(function( data ){
            $('<li>').appendTo( node.suggestList ).html( data );
          });
          node.items = node.suggestList.find('li');
          node.items.on( 'mouseover', mouseHighlight );
          node.items.on( 'click', mouseFillText );
        }.curry( currentTimestamp )
      });
    }
    
    function positionSuggestion () {
      var position = node.keyword._absPosition(),
          offsetTop = 5;
      node.suggestRoot.css({
        left: position.left,
        top: position.top + node.keyword.height() + offsetTop,
        width: node.keyword.innerWidth()
      });
    }
    
    function mouseHighlight ( event ) {
      lastTrigger = 'mouse';
      currentIndex = $.inArray( event.currentTarget, node.items );
      highlight();
    }
    
    function highlight () {
      if ( lastIndex === currentIndex ) return;
      
      if ( lastIndex !== -1 ) {
        node.items.eq( lastIndex ).removeClass('active');
      }
    
      if ( currentIndex !== -1 ) {
        node.items.eq( currentIndex ).addClass('active');
      }

      lastIndex = currentIndex;
    }
    
    function mouseFillText () {
      fillText();
    }
    
    function fillText () {
      var text = node.items.eq( currentIndex ).text();
      node.keyword.val( text );
      currentKeyword = text;
      close();
    }
    
    function keywordNavigation ( event ) {
      var key = event.keyCode,
          DOWN = 40,
          UP = 38,
          ESC = 27,
          ENTER = 13;
      
      if ( key === ESC ) {
        close();
        return false;
      }
    
      if ( key === DOWN && currentKeyword !== "" && isOpening === false ) {
        getSuggestions();
        return false;
      }
      
      if ( key === ENTER && currentKeyword !== "" && currentIndex === -1 ) {
        close();
        return true;
      }
      
      if ( key === ENTER && currentIndex !== -1 ) {
        fillText();
        return false;
      }
    
      if ( key === UP && currentIndex > -1 ) {
        currentIndex--;
        lastTrigger = 'keyboard'; 
        
        event.preventDefault();
      }
      if ( key === DOWN && currentIndex < resultLength - 1 ) {
        currentIndex++;
        lastTrigger = 'keyboard';
        event.preventDefault();
      }
      highlight();
    }
    
    function keywordLoseFocus () {
      isPrepareClosing = true;
      close.delay(250);
    }
    
    function prepare () {
      node.keyword = node.input1;
      node.suggestRoot = $('<div>').addClass(classPrefix+"root").appendTo('.top-bar').hide();
      node.suggestList = $('<ul>').addClass(classPrefix+"list").appendTo( node.suggestRoot );
    }
    
    function observe () {
      node.keyword.on({
        'propertychange keyup input paste': onchange,
        keydown: keywordNavigation,
        blur: keywordLoseFocus
      });
    }
    
    
  }
  
  /**
   * sumitValidator
   */
  function sumitValidator () {
    node.root.on('submit', function ( event ) {
      function testPlaceholder ( input ) {
        if ( input.val() === input.get(0).placeholderString ) {
          input.val("");
        }
      }
      
      testPlaceholder( node.input1 );
      testPlaceholder( node.input2 );
      
      if ( node.input1.val() === "" && node.input2.val() === "" ) {
        event.preventDefault();
        node.input1.trigger('blur');
        node.input2.trigger('blur');
        node.input1.focus();
      }
    });
  }
  
})( this.jQuery, this.ipeen );