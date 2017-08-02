(function($) {
    $(document).ready(function() {
        $('.loginLink').attr('href',$('.loginLink').attr('href')+encodeURIComponent(window.location));
        $('.facebookiPeen').click(function(e) {
                e.preventDefault();
                FB.login(function(r) {
                    if(r.authResponse) {
                        window.facebookLogin();
                        return;
                    }
                },
                {scope : 'email,user_birthday,publish_stream,publish_actions'});
        });
    }); 
})(jQuery);
