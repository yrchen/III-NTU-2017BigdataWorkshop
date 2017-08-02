(function( $ ) {

  ipeen.register('plurk push', function ( root, url, content ) {
    var node = {},
        fullURL = ['/cgi/plurk_push_url.php?url=', encodeURIComponent(url), '&c=', encodeURIComponent(content)].join('');
    node.root = $(root);
    node.button = node.root.find('a');
    node.counter = node.root.find('.counter span');
    node.button.attr('href', fullURL).attr('target', '_blank');
    if ( node.counter.length ) {
      node.button.on('click', function () {
        node.counter.text( parseInt( node.counter.text(), 10 ) + 1 );
      });
    }
  });

})( jQuery );
