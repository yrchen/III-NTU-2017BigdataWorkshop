var facebook_utility = {
    PERMISSIONS:    'email,publish_stream,read_stream,user_likes',

    get_session_or_login: function ( callback, failure_callback ) {
        if( FB.getAuthResponse() )
            return callback(null);
        FB.login(function ( r ) {
            if( !r.authResponse ) {
                if( failure_callback )
                    failure_callback(r);
                return;
            }
            callback(r);
        }, { scope: this.PERMISSIONS });
    },
    login_and_test_fan_page: function ( page_id, callbacks ) {
        this.get_session_or_login(
            function ( r ) {
                facebook_utility.test_fan_page(page_id, callbacks.success, callbacks.check_failure);
            },
            callbacks.login_failure
        );
    },
    test_fan_page:  function ( page_id, callback, failure_callback ) {
        FB.api('/me/likes', function ( r ) {
                var data = r.data, length = data.length;
                for( i = 0; i < length; i++ )
                    if( data[i].id == page_id )
                        return callback();
                if( failure_callback )
                    failure_callback();
            });
    },
    check_autosize: function (  ) {
        if( FB.Canvas._timer !== null )
            return;
        FB.Canvas.setAutoResize();
        setTimeout('facebook_utility.check_autosize();', 400);
    },
0: null};
