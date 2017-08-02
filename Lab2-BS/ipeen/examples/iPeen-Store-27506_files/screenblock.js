(function ( $ ) {

jQuery.__resizeScreenBlock = function (  ) {
    var doc = $(document), win = $(window),
        width = win.width(), height = doc.height();
    this.__block.appendTo($('body'));
    return this;
};

jQuery.__initScreenBlock = function(clickToClose) {
    if(clickToClose === undefined) {
        clickToClose = false;
    }
    var b = this.__block;
    if(!b) {
        var b = $('<div></div>');
        b.css({
                'position':         'fixed',
                'background-color': 'black',
                'z-index':          1000,
                'left':             0,
                'top':              0,
                'right':			0,
                'bottom':			0,
                'opacity':          0
            }).fadeTo(0, 0.7)
			.addClass('ScreenBlock')
            .addClass('black');
        if(clickToClose) {
            b.bind('click', function(e) {
				if(typeof(clickToClose) === 'function'){
					clickToClose();
				}
				e.preventDefault();
				$.screenUnblock();
			});
        }
        this.__block = b;
        $(window).resize(function (  ) {
                $.__resizeScreenBlock();
		});
    }
    return this;
};

jQuery.__attachToScreenBlock = function ( target, css ) {
	var target_w = target.width();
	var target_h = target.height();
    var offset_w = Math.ceil(target_w / 2);
    var offset_h = Math.ceil(target_h  / 2);
    css = css || {},
    target.css({
            'position':     'fixed',
            'z-index':      '1001',
            'left':         '50%',
            'top':          '50%',
			'width':		 target_w+'px',
			'height':		 target_h+'px',
            'margin-left':  '-' + offset_w + 'px',
            'margin-top':  '-' + offset_h + 'px'
        })
        .css(css)
        .fadeIn('fast')
		.addClass('ScreenBlock');
    this.__attached = target;
};

jQuery.screenBlock = function(target, css, clickToClose) {
    this.__initScreenBlock(clickToClose);
    this.__resizeScreenBlock();
    this.__attachToScreenBlock(target, css);
    var b = this.__block.css('opacity', 0).show().fadeTo('fast', 0.7);
    return this;
};

jQuery.screenUnblock = function (  ) {
    var attached = this.__attached;
    this.__attached = null;
    if( attached )
        attached.fadeOut();
    if( this.__block )
        this.__block.fadeOut();
    return this;
};
jQuery.clearBlock = function (  ) {
	$('.ScreenBlock').unbind('click');
};
jQuery.clickBlock= function(clickToClose){
	$('.ScreenBlock').bind('click', function(e) {
		if(typeof(clickToClose) === 'function'){
			clickToClose();
		}
		e.preventDefault();
		$.screenUnblock();
	})
}
})(jQuery);
