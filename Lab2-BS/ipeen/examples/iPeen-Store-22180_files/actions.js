(function( $, ipeen ){
  
  
  ipeen.register('tour init', function () {
    TOURADD.trunk();
  });
  
  ipeen.register('register add tour', function ( root, sid ) {
    $(root).on('click', function ( event ) {
      event.preventDefault();
      TOURADD.add( sid );
    });
  });
  
  
})( this.jQuery, this.ipeen );