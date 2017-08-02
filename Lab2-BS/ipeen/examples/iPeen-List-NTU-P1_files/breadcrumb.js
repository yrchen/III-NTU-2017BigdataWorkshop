(function( $ ){
	function SelectorWidth(name) {
		var node = {};
		node.root = $(name);
		node.list = node.root.find('.bradCrumbsList');
		node.item = node.root.find('a');
		var max = 0;
		
		node.list.css({
			display: 'block',
			visibility: 'hidden',
			position: 'static',
			'max-height': ''
		})
		
		node.item.each(function(i, el){	
			var width = $(el).outerWidth(true);
			if( width > max ){
				max = width;
			}
		})
		node.list.css({
			display: 'none',
			visibility: '',
			position: 'absolute',
			'max-height': 176
			
		})
		node.root.css({
			width: max + 28
		})
	}
	
	window.CustomSelectBox = function ( rootSelector ) {
		this.root = $(rootSelector);
		this.prepare();
		this.observe();
	};

	window.CustomSelectBox.prototype = {
		status : false,
		is_selfopening: false,

		prepare: function () {
			this.target    = this.root.find('.showingPath');
			this.menu      = this.root.find('.bradCrumbsList');
			this.itm       = this.root.find('li');
		},

		observe : function () {
			$(document).on( ' click', $.proxy(this.outClose, this));
			this.root.on( 'click', $.proxy(this.targetCtrl, this));
			this.target.on('click', function (event) {
				event.stopPropagation();
			})
		},
		targetCtrl : function () {
			if ( ! this.status ){	
				this.menu.slideDown( 300 );
				this.status = true;
				this.is_selfopening = true;
			}
		},
		outClose : function () {
			if ( this.is_selfopening ) {
				this.is_selfopening = false;
				return;
			}
			if( this.status ){
				this.menu.slideUp( 100 );
				this.status = false;
			}
		}
	};
	$('.selector').each( function () {
			new CustomSelectBox(this);
		
	})
	new SelectorWidth('#breadCrumbsCity');
	new SelectorWidth('#breadCrumbsCate1');
	new SelectorWidth('#breadCrumbsCate2');
})( jQuery );	