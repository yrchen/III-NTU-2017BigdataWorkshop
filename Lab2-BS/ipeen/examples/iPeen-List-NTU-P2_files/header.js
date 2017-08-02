(function ( $ ) {
	var header = {
		init : function(){
			this.promptedEditBox();
			this.object = {
							sclass		: $('#d'),
							kw			: $('#kw'),
							adkw		: $('#adkw'),
							addrs		: $('#addrs'),
							SELECTBAR	: $('#SELECTBAR'),
							has_addr	: [1, 2, 14, 16],
							length_txt	: [1, 14],
							length		: 300
						};
			this.addHomePage();
			this.addFavorite();
			this.teeth();
			this.channel();
			this.search();
			this.searchBar();
			this.door();
			this.selectBar();
		},
		//牙齒
		teeth : function(){
			var address = window.location.pathname;
			if(address.match('/reputation/exchange_ready.php') != null){
				$('.hdTags > ul > li:eq(4) > .hdNav > a:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(4)').addClass('select');
				$('.hdTags > ul > li:eq(4)').attr('select', '1');
			}else if(address.match('/reputation/reputation_exchange.php') != null){
				$('.hdTags > ul > li:eq(4) > .hdNav > a:eq(1)').addClass('select');
				$('.hdTags > ul > li:eq(4)').addClass('select');
				$('.hdTags > ul > li:eq(4)').attr('select', '1');
			}else if(address.match('/reputation/reputation_bid.php') != null){
				$('.hdTags > ul > li:eq(8) > .hdNav > a:eq(1)').addClass('select');
				$('.hdTags > ul > li:eq(8)').addClass('select');
				$('.hdTags > ul > li:eq(8)').attr('select', '1');
			}else if(address.match('/reputation') != null){
				$('.hdTags > ul > li:eq(4) > .hdNav > a:eq(2)').addClass('select');
				$('.hdTags > ul > li:eq(4)').addClass('select');
				$('.hdTags > ul > li:eq(4)').attr('select', '1');
			}else if(address.match('/coupon') != null){
				$('.hdTags > ul > li:eq(5) > .hdNav > a:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(5)').addClass('select');
				$('.hdTags > ul > li:eq(5)').attr('select', '1');
			}else if(address.match('/benefit') != null){
				$('.hdTags > ul > li:eq(5) > .hdNav > a:eq(1)').addClass('select');
				$('.hdTags > ul > li:eq(5)').addClass('select');
				$('.hdTags > ul > li:eq(5)').attr('select', '1');
			}else if(address.match('/focus') != null){
				$('.hdTags > ul > li:eq(3) > .hdNav > a:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(3)').addClass('select');
				$('.hdTags > ul > li:eq(3)').attr('select', '1');
			}else if(address.match('/media/') != null){
				$('.hdTags > ul > li:eq(3) > .hdNav > a:eq(1)').addClass('select');
				$('.hdTags > ul > li:eq(3)').addClass('select');
				$('.hdTags > ul > li:eq(3)').attr('select', '1');
			}else if(address.match('/rank') != null){
				$('.hdTags > ul > li:eq(2) > .hdNav > a:eq(1)').addClass('select');
				$('.hdTags > ul > li:eq(2)').addClass('select');
				$('.hdTags > ul > li:eq(2)').attr('select', '1');
			}else if(address.match('/newcmm') != null){
				$('.hdTags > ul > li:eq(1) > .hdNav > a:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(1)').addClass('select');
				$('.hdTags > ul > li:eq(1)').attr('select', '1');
			}else if(address.match('/announcement') != null){
				$('.hdTags > ul > li:eq(0) > .hdNav > a:eq(1)').addClass('select');
				$('.hdTags > ul > li:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(0)').attr('select', '1');
			}else if(address.match('/action') != null){
				$('.hdTags > ul > li:eq(0) > .hdNav > a:eq(2)').addClass('select');
				$('.hdTags > ul > li:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(0)').attr('select', '1');
			}else if(address.match('/vote') != null){
				$('.hdTags > ul > li:eq(0) > .hdNav > a:eq(3)').addClass('select');
				$('.hdTags > ul > li:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(0)').attr('select', '1');
			}else if(address.match('/checkin') != null){
				$('.hdTags > ul > li:eq(0) > .hdNav > a:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(0)').attr('select', '1');
			}else if(address.match('/lottery') != null){
				$('.hdTags > ul > li:eq(7) > .hdNav > a:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(7)').addClass('select');
				$('.hdTags > ul > li:eq(7)').attr('select', '1');
			}else{
				$('.hdTags > ul > li:eq(0)').addClass('select');
				$('.hdTags > ul > li:eq(0)').attr('select', '1');
			}
		},
		//頻道
		channel : function(){
			var address = window.location.pathname;
			var args = this.ReturnGet();
			var chk = (address.match('/channel') != null);
			if(address.match('/play') != null){
				$('.hdSelect > ul > li:eq(2)').addClass('select');
			}else if( chk && args.id && args.id=='F'){
				$('.hdSelect > ul > li:eq(0)').addClass('select');
			}else if( chk && args.id && args.id=='P'){
				$('.hdSelect > ul > li:eq(1)').addClass('select');
			}else if( chk && args.id && args.id=='C'){
				$('.hdSelect > ul > li:eq(4)').addClass('select');
			}else if( chk && args.id && args.id=='W'){
				$('.hdSelect > ul > li:eq(5)').addClass('select');
			}else if( chk && args.id && args.id=='L'){
				$('.hdSelect > ul > li:eq(3)').addClass('select');
			}
		},
		//提示文字
		promptedEditBox : function(){
			$('#kw').promptedEditBox(' 關鍵字 或 店名 ')
				.autocomplete(
					'/suggest/keywords.php', 
					{ 
						selectFirst: false, 
						extraParams: { S: 100 } 
					}
				);
			var ex_id = '#lbsSelector > label.selectorTarget';
			var ex_string = ($(ex_id).length > 0 && $(ex_id).text() != '')? $(ex_id).text(): '台北市羅斯福路';
			if(ex_string === '全台灣'){
				$('#adkw').promptedEditBox('  輸入地點').attr("placeholder","  輸入地點 ");
			}else{
				$('#adkw').promptedEditBox('  輸入地點，例如： '+ex_string).attr("placeholder","  輸入地點，例如： "+ex_string);
			}
			
			$('#addrs').promptedEditBox('  輸入地圖定位點，例： '+ex_string);
		},
		//加為首頁for ie
		addHomePage : function(){
			$('#header_homepage').click(function ( e ) {
				e.preventDefault();
				this.style.behavior='url(#default#homepage)';
				this.setHomePage('http://www.ipeen.com.tw/');
			});
		},
		//加為我的最愛
		addFavorite : function(){
			$('#header_favorite').click(function ( e ) {
				e.preventDefault();
				var title = 'iPeen愛評網', url = 'http://www.ipeen.com.tw';
				if( document.all )
					window.external.AddFavorite(url, title);
				else if( window.sidebar )
					window.sidebar.addPanel(title, url, '');
			});
		},
		//任意門
		door : function(){
			$('#header_gateway').click(function ( e ) {
				e.preventDefault();
				var o = $(this).offset();
				$('#fdoorway').css({
					'left' : o.left + 'px',
					'top' : (o.top + $(this).height() + 2) + 'px'
				}).slideToggle('fast');
			});
			$('#doorway_close').click(function ( e ) {
				e.preventDefault();
				$('#fdoorway').slideUp('fast');
			});
		},
		_set_search : function(){
			var SELECTBAR = header.object.SELECTBAR;
			var scls = SELECTBAR.attr('scls');
			var d = SELECTBAR.attr('c');
			var kw = "";
			var LBS = $('#lbsSelector > .hdTwDown .selected').attr('data-value');
			/**
			 * 地址未輸入以search LBS設定區域
			 */
			if(header.object.adkw.val() != '' || header.in_array(d, header.object.has_addr)){
				LBS = 'all';
			}
			var url = "/search/"+LBS+"/000/";
            if(window.location.host.substr(0, 5) == 'event') {
                url = '//www.ipeen.com.tw' + url;
            }
			if(header.in_array(d, header.object.has_addr)){
				header.object.adkw.attr('disabled', true);
			}
			
			if(header.object.sclass.val() == ''){
				header.object.sclass.attr('disabled', true);
			}else{
				d = header.object.sclass.val();
				header.object.sclass.attr('disabled', true);
			}
			if(header.object.adkw.val() == '')
				header.object.adkw.attr('disabled', true);
			if(header.object.addrs.val() == '')
				header.object.addrs.attr('disabled', true);
				
			url += '0-'+d+'-0-0/';
			if(header.object.kw.val() == ''){
				header.object.kw.attr('disabled', true);
			}else{					
				kw = header.object.kw.val();
				header.object.kw.attr('disabled', true);
				url += encodeURIComponent(kw) + '/';
			}
			
			if(scls == 'none'){
				$('#headersearch').attr('action', '/mapsearch/amount.php');
			}else{
				$('#headersearch').attr('action', url);
			}
			$('#headersearch').submit();
		},
		search : function(){
			$('.btnSearch').click(header._set_search);
			$('#kw,#adkw,#addrs').keydown(function(event){
				if (event.keyCode == '13') {
					header._set_search();
				}
			});
		},
		in_array : function(string, array){
			for (s = 0; s < array.length; s++) {
				thisEntry = array[s].toString();
				if (thisEntry == string) {
					return true;
				}
			}
			return false;
		},
		displayBar : function(type){
			if(type == 'map'){
				$('#mapblock').show();
				$('#kwblock, #adkwblock').hide();
			}else if(type == 'addr'){
				$('#mapblock').hide();
				$('#kwblock, #adkwblock').show();
			}else{
				$('#kwblock').show();
				$('#mapblock, #adkwblock').hide();
			}
		},
		searchBar : function(){
            $('.listType').bind('click', function(e) {
					$(this).hide();
                });
			$('.listType > li > a').click(function(){
				var search = {
								ShowName	: $(this).attr('ShowName'),
								itemName	: $(this).attr('item'),
								scls		: $(this).attr('scls'),
								sclass		: $(this).attr('c')
							};
				var object = header.object;
				//關閉搜尋方式
				if(search.ShowName == 'none'){
					$(this).hide();
				//搜尋地圖
				}else if(search.scls == 'none'){
					object.sclass.val('');
					header.displayBar('map');
					object.addrs.css('width', '360px');
					object.addrs.data('ph').css('width', '360px');
				//無地址輸入框字太長
				}else if(header.in_array(search.sclass, header.object.length_txt)){
					object.sclass.val(search.sclass);
					header.displayBar('');
					object.kw.css('width', header.object.length+'px');
					object.kw.data('ph').css('width', header.object.length+'px');
				//有地址輸入框
				}else if(header.in_array(search.sclass, header.object.has_addr)){
					object.sclass.val(search.sclass);
					header.displayBar('');
					object.kw.css('width', '360px');
					object.kw.data('ph').css('width', '360px');
				//有地址輸入框
				}else{
					object.sclass.val(search.sclass);
					header.displayBar('addr');
					object.kw.css('width', '110px');
					object.kw.data('ph').css('width', '110px');
					object.addrs.css('width', '220px');
					object.addrs.data('ph').css('width', '220px');
				}
				header.ChangeEditBox(search);
			});
			$('.selectType').click(function(){
				$('.listType').toggle();
			});
		},
		selectBar : function(){
			var args = this.ReturnGet(), item = null;
			var url_kw = window.location.pathname.split('/');
			if(url_kw[1]=="search"){
				var dis = "";
				if(url_kw[4] != ""  && typeof(url_kw[4]) !=  'undefined'){
					dis = url_kw[4].split('-');
					args.d = dis[1];
				}
			}
			var chek_d = (typeof(args.d)  !=  'undefined');
			if(chek_d && header.in_array(args.d, header.object.length_txt)){
				$('#d').val(args.d);
				item = $('.listType > li > a[c='+args.d+']');
				$('#mapblock, #adkwblock').hide();
				this.object.kw.css('width', header.object.length+'px');
				this.object.kw.data('ph').css('width', header.object.length+'px');
			}else if( chek_d && header.in_array(args.d, this.object.has_addr)){
				$('#d').val(args.d);
				item = $('.listType > li > a[c='+args.d+']');
				$('#mapblock, #adkwblock').hide();
				this.object.kw.css('width', '360px');
				this.object.kw.data('ph').css('width', '360px');
			}else if(chek_d){
				this.object.sclass.val(args.d);
				item = $('.listType > li > a[c='+args.d+']');
			}
			
			if(!item && chek_d){
				item = $('.listType > li > a[c=-1]');
			}
			if(item){
				this.object.SELECTBAR.attr('ShowName', item.attr('ShowName'));
				this.object.SELECTBAR.attr('scls', item.attr('scls'));
				this.object.SELECTBAR.attr('c', args.d);
				if(item.text()==''){
					this.object.SELECTBAR.text('全部');
				}else{
					this.object.SELECTBAR.text(item.text());
				}
			} else {
                var selected = $.cookie('_ipeen_search_category');
                if(selected !== null) {
                    if(selected == 'map') {
                        $('.listType a[scls=none]', '#headersearch').trigger('click');
                    } else {
                        $('.listType a[c=' + selected + ']', '#headersearch').trigger('click');
                    }
                }
            }
			
			if( args.kw )
				this.object.kw.val(decodeURIComponent(args.kw)).change();
			if( url_kw[5] )
				this.object.kw.val(decodeURIComponent(url_kw[5])).change();
			if( args.adkw )
				this.object.adkw.val(args.adkw).change();
		},
		ChangeEditBox : function(search){
            var category = search.sclass || 'map';
            $.cookie('_ipeen_search_category', category, { expires: 365 * 24, path: '/', domain: 'ipeen.com.tw' });
			if(search.ShowName != 'none'){
				$('.selectType').text(search.ShowName);
				$('.selectType').attr('scls', search.scls);
				$('.selectType').attr('c', search.sclass);
			}
			if(search.scls != 'none' && search.ShowName != 'none'){
				var name = search.itemName;
				if(header.in_array(search.sclass, [2, 16]) ){
					name = search.itemName 
				}
				this.object.kw.changeEditBoxPrompt(name);
				this.object.kw.flushCache()
						.setOptions({ extraParams: { S: search.sclass }})
						.focus();
			}
		},
		ReturnGet : function(){
			var args = {}, source = window.location.search.substr(1).split('&');
			for( k in source ){
				if( typeof(source[k]) == 'string' && source[k]!='') {
					var s = source[k].split('=');
					if(typeof s[1] != 'undefined'){
						args[s[0]] = decodeURIComponent(s[1].replace(/\+/g, ' '));
					}
				}
			}
		
			return args;
		}
	};
	header.init();
	$('.hdNav,.hdTags > ul > li > a').mouseenter(function(){
		if($(this).attr('menu') == 'child'){
			$(this).show();
			var obj = $(this).siblings(':first').parent();
		}else{
			$(this).siblings(':first').show();
			var obj = $(this).parent();
		}
		if(obj.attr('select') === '1')
			obj.removeClass('select');
	});
	$('.hdNav,.hdTags > ul > li > a').mouseleave(function(){
		if($(this).attr('menu') == 'child'){
			$(this).hide();
			var obj = $(this).siblings(':first').parent();
		}else{
			$(this).siblings(':first').hide();
			var obj = $(this).parent();
		}
		if(obj.attr('select') === '1')
			obj.addClass('select');
	});
	
	// LBS selector
	function CustomSelector ( name ) {
		
		this.name = $(name);
		this.prepare();
		this.observe();
		
	};

	CustomSelector.prototype = {
		
		status : false,
		
		prepare : function () {
			
			this.target    = this.name.find( '.selectorTarget ');
			this.menu      = this.name.find( '.selectorMenu' );
			this.itm       = this.name.find( 'li, .hdTwDown > .selectorMenu > .hdTwpart > b > a' );
			this.foreign   = this.name.find( '.showForeign a' );
			this.country   = this.name.find( '.otherCountry' );
			this.hideInput = this.name.find( '.selectorValue' );
			this.fakeLink  = this.name.find( 'li a');
		},
		
		observe : function () {
			
			this.target.live( 'click', $.proxy( this.targetCtrl, this ) );
			this.itm.live( 'click', $.proxy( this.itmCtrl, this ) );
			this.foreign.live( 'click', $.proxy( this.showCountry, this ));
			this.fakeLink.live ( 'click', this.prevent );
			$( 'body' ).live( ' click', $.proxy( this.outClose, this ) );
		},
		
		targetCtrl : function () {
			if ( !this.status ){
				
				this.menu.show( 300 );
				this.status = true;
			
			} else {
				
				this.menu.hide( 300 );
				this.status = false;
				
			}
			return false;
		},
		
		itmCtrl : function ( event ) {
			
			event.stopPropagation();
			var getItm = event.currentTarget;
			var value = $(getItm).find('a').innerHTML;
			
			this.choose = $( getItm );
			
			var lbsname = this.choose.attr('data-value');
			if(!this.choose.attr('data-value')){
				return false;
			}
			
			this.target.html( value );
			
			this.itm.removeClass();
			this.choose.addClass( 'selected' );
			
			var args = this.split_query_string(window.location.search.substr(1));
			var loc_args = lbsSelector.split_query_string(LBS_DATE_LIST.PATH_NAME);
			var href = this.pathname(lbsname, args, loc_args);
			if(href != ''){
				location.href = href;
			}else{
				this.setCookie(lbsname);
				location.reload();
			}
			
			this.status = false;
			return false;
			
		},
		
		showCountry : function () {
			
			this.country.slideDown();
			this.foreign.hide();
			return false;
			
		},
		
		outClose : function () {
			if( this.status ){
				
				this.menu.hide( 300 );
				this.status = false;
				
			}
			
		},
		
		process_get : function(args){
			var string_query = '?', k = 0;
			for(var i in args){
				if(k != 0){
					string_query += '&';
				}
				string_query += i+'='+args[i];
				k++;
			}
			return (k == 0)? '': string_query;
		},
		
		pathname : function(lbsname, args, loc_args){
			LBS_PATH_NAME = LBS_DATE_LIST.PATH_NAME;
			if( typeof args.p != 'undefined'){
				delete args.p;
			}
			if(LBS_PATH_NAME == '/rank/'){
				var check_loc_var = {
										ch : 'F', 
										e : 0 ,  f : 0, 
										food : 0, tag : 0, score : 0
									};
				for(var i in check_loc_var){
					if(typeof loc_args[i] != 'string'){
						loc_args[i] = check_loc_var[i];
					}
				}
				return '/'+lbsname+LBS_PATH_NAME+loc_args.ch+'_'+loc_args.e+'_'+loc_args.f+'_'+loc_args.food+'_'+loc_args.tag+'_'+loc_args.score;
			}else if(LBS_PATH_NAME == ''){
				return '';
			}
			return '/'+lbsname+LBS_PATH_NAME+this.process_get(args);
		},
		
		split_query_string : function(string){
			var args = {}, source = string.split('&');
			for( k in source ){
				if( typeof(source[k]) == 'string' && source[k]!='') {
					var s = source[k].split('=');
					if(typeof s[1] != 'undefined'){
						args[s[0]] = decodeURIComponent(s[1].replace(/\+/g, ' '));
					}
				}
			}
			return args;
		},
		
		setCookie : function(id){
			$.cookie(LBS_DATE_LIST.COOKIE_SET, 1, { domain : 'ipeen.com.tw', path: '/', expires : (parseInt(LBS_DATE_LIST.COOKIE_TIME)/60)});
			$.cookie(LBS_DATE_LIST.COOKIE_NAME, id, { domain : 'ipeen.com.tw', path: '/', expires : (parseInt(LBS_DATE_LIST.COOKIE_TIME)/60)});
		},
		/**** a link for SEO ****/
		prevent : function (event) {
		
			event.preventDefault();
		}
	};

	var lbsSelector = new CustomSelector('#lbsSelector');
	
	$('a').live('mousedown', function(){
		var href = $(this).attr('href');
		var http = $(this).attr('data-http');
		if(typeof href !== 'undefined' && typeof http !== 'undefined'){
			$(this).attr('href', http);
		}
	});
	
	$(document).ready( function () {
		function RepChoiceImg (root) {
			var node = {};
			node.root = $(root);
			function observe() {
				node.root.hover(showShop, hideShop);
			}
			function showShop(event) {
				var current = $(event.currentTarget);
				node.shop = current.find('.shop');
				node.shop.stop().animate({
					bottom : 0
				}, 200);
			}
			function hideShop(event) {
				var current = $(event.currentTarget);
				node.shop = current.find('.shop');
				var orignalOption = node.shop.outerHeight();
				node.shop.stop().animate({
					bottom : -orignalOption
				}, 200);
			}
			observe();
		}
		var repChoiceImg = new RepChoiceImg ('.repChoiceImg');
	});
})(jQuery);
