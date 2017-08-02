/**
 * Facebook
 */
(function( $, ipeen ){
  
  ipeen.register('facebook login process', function() {
    window.location = ['/login/facebook_login.php?next=', encodeURIComponent(window.location.href)].join('');
  });
  ipeen.register('facebook init', function ( options ) {

    // Assign fbAsyncInit Function
    window.fbAsyncInit = function () {
      var initOptions = {
        appId: options.app_id,
        oauth : true,
        status: true,
        cookie: true,
        xfbml: true
      };
      if ( options.fb_app_channel ) {
        initOptions.channelUrl = window.location.protocol + '//' + window.location.host + '/fb_channel.html';
      }
      if ( options.fb_app_session ) {
        initOptions.session = options.fb_app_session;
      }
      
      FB.init( initOptions );

      FB.Event.subscribe("xfbml.render", function(response) {
          //auto run(eat or collect)
          if(typeof iPeenPush!="undefined" && iPeenPush.prototype.autoObject !== null){
              iPeenPush.prototype.autoObject.click();
          }
      });

        FB.Event.subscribe('edge.create', function(targetUrl) {
            ga('send', 'social', 'facebook', 'like', targetUrl);
        });

        FB.Event.subscribe('edge.remove', function(targetUrl) {
            ga('send', 'social', 'facebook', 'unlike', targetUrl);
        });

        FB.Event.subscribe('message.send', function(targetUrl) {
            ga('send', 'social', 'facebook', 'share', targetUrl);
        });

      ( window.fbPostAsyncInit || $.noop )();
    };
    
    
    // Load Facebook Javascript SDK asynchronously
    document.write('<div id="fb-root"></div>');
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/zh_TW/all.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

    
    // Facebook 登入按鈕
    $('.fb-login').on('click', function ( event ) {
      event.preventDefault();
      ipeen.action('facebook login process');
    });
  });
  
  ipeen.register('FB.login', function ( onfulfilled, onrejected ) {
    FB.login( function ( response ) {
      if ( response.authResponse ) {
        (onfulfilled || $.noop)( response );
      } else {
        (onrejected || $.noop)( response );
      }
    } , {
      scope: 'email,user_birthday,publish_stream,user_likes,publish_actions'
    });
  });
  
})( this.jQuery, this.ipeen );
