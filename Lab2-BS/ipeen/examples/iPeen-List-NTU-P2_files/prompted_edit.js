(function ( $ ) {
    function __checkPromptedEditBox (  )  {
        if( $(this).val() == '' || $(this).attr('force') == 1 )
            $(this).hide().data('ph').show();
        else
            $(this).show().data('ph').hide();
    }

    jQuery.fn.getEditBoxPrompt = function (  ) {
        return this.data('ph').val();
    };
    jQuery.fn.changeEditBoxPrompt = function ( text ) {
        return this.each(function (  ) {
                $(this).data('ph').val(text);
            });
    };
    jQuery.fn.promptedEditBox = function ( text, force ) {
        return this.each(function (  ) {
            var me = $(this), ph = $('<input type="text" />')
                .val(text)
                .data('real', me)
                .addClass(me.attr('class'))
                .css('color', '#888888')
                // .width(me.width())
                // .height(me.height())
                .css('width', me.css('width'))
                .css('height', me.css('height'))
                .focus(function (  ) {
                        $(this).hide();
                        $(this).data('real').show().focus();
                    });
                $(this)
                    .data('ph', ph)
                    .attr('force', force ? 1 : 0)
                    .hide()
                    .after(ph)
                    .change(__checkPromptedEditBox)
                    .blur(__checkPromptedEditBox)
                    .change();
            });
    };
})(jQuery);
