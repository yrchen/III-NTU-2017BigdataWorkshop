    var showChannelTime = null;
    function channelTimeHidden(){
        $('.hdSelect').hide();
        $('.hdAll').removeClass('hdshow');
    }
    (function ($) {
        if (header_template_script_name != '/index.php') {
            $('.hdChannel').mouseenter(function(){
                $('.hdSelect').show();
                $('.hdAll').addClass('hdshow');
                if(showChannelTime !== null){
                    clearTimeout(showChannelTime);
                    showChannelTime = null;
                }
            });
            $('.hdChannel').mouseleave(function(){  
                if(showChannelTime === null){
                    showChannelTime = setTimeout('channelTimeHidden();', 100);
                };
            });
        }
    })(jQuery);
