var BadgeBlock = {
	time : (new Date().getTime()),
	gotofun : null,
	count : 0,
	widht : 0,
	setimtout : null,
	j : ($.ajax)? $: $j,
	layer : function(){
		var block = '<div id="layer'+this.time+'" class="first_layer" style="position: absolute;top:'+(this.scrollY()+50)+'px; z-index:800; left:32%;"  ></div>'+
					'<div id="mask'+this.time+'" style=" position:absolute; z-index:800; left:0; width:100%;" ></div>'; //style="height:'+document.body.clientHeight+'px;top:'+(this.scrollY()+50)+'px;"
		this.j('body').append(block);
	},
	scrollY : function(){
		
		/*var yTop='';
		if(typeof window.scrollY!='undefined') yTop=window.scrollY;
		if(typeof document.documentElement=='undefined' && typeof document.documentElement.scrollLeft=='undefined') yTop=document.body.scrollTop;
		if(yTop == '') 
			yTop = document.documentElement.scrollTop;*/
		return this.j(window).scrollTop();
	},
	remove : function(){
		this.j('#layer'+this.time+','+'#mask'+this.time).remove();
	},
	show : function(){
		this.gotofun = this._show;
		this.ajax({ 
			url : '/block/badge/getBadge.php',
			type : 'POST',
			dataType : 'HTML',
			data : {}
		});
	},
	_show : function(res){
		if(res != ''){
			BadgeBlock.layer();
			BadgeBlock.j('#mask'+this.time).html(res);
			BadgeBlock.count = parseInt(BadgeBlock.j('#BadgeNumber').val());
			BadgeBlock.widht = parseInt(BadgeBlock.j('#BadgeWidth').val());
		}
	},
	ajax : function(item){
		this.j.ajax({
			url : item.url,
			data: item.data,
			dataType : item.dataType,
			type: item.type,
			success: function(res){	
				BadgeBlock.gotofun(res);
			}
		});
	},
	auto : function(action){
		if(action == 1){
			BadgeBlock.setimtout = setTimeout('BadgeBlock.auto(1);', 100);
			BadgeBlock.left();
		}else{
			BadgeBlock.setimtout = setTimeout('BadgeBlock.auto(2);', 100);
			BadgeBlock.right();
		}
	},
	clear : function(){
		clearTimeout(BadgeBlock.setimtout);
	},
	left : function(){
		var mLeft = parseInt(BadgeBlock.j('.getMove').css('margin-left'));
		if(mLeft < 0){
			BadgeBlock.j('.getMove').css('margin-left', mLeft+10);
		}else{
			BadgeBlock.clear();
		}
	},
	right : function(){
		var mLeft = parseInt(BadgeBlock.j('.getMove').css('margin-left'));
		if(-(BadgeBlock.count-3)*BadgeBlock.widht < mLeft){
			BadgeBlock.j('.getMove').css('margin-left', mLeft-10);
		}else{
			BadgeBlock.clear();
		}
	}
};