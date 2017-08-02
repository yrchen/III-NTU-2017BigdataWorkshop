var TOURADD = {
	time : (new Date().getTime()),
	data : {},
	id : 0,
	show_trunk : true,
	gotofun : null,
	j : ($.ajax)?$:$j,
	view : function(){
		var block = '<div id="layer'+this.time+'" class="first_layer" style="position: absolute; top:'+(this.scrollY()+50)+'px; z-index:2001; left:32%;"  ></div>'+
					'<div id="mask'+this.time+'" class="mask" style="z-index:2000;height:'+$(window).height()+'px;"></div>';
		//
		this.j('body').append(block);
	},
	scrollY : function(){
		var yTop='';
		if(typeof window.scrollY!='undefined') yTop=window.scrollY;
		if(typeof document.documentElement=='undefined' && typeof document.documentElement.scrollLeft=='undefined') yTop=document.body.scrollTop;
		if(yTop == '') 
			yTop = document.documentElement.scrollTop;
		return yTop;
	},
	remove : function(){
		this.j('#layer'+this.time+','+'#mask'+this.time).remove();
		this.j('.trunk_block,.trunk_block2').remove();
	},
	list : function(p, o){
		this.gotofun = this._list;
		this.ajax({
			url : '/tour/step3.php', type : 'GET',
			data : { p : p, o : o }, dataType : 'html'
		});
	},
	setcookie : function(id){
		this.gotofun = this._setcookie;
		this.ajax({
			url : '/tour/location.php', type : 'GET',
			data : { id : id , type : 'json'}, dataType : 'json'
		});		
	},
	add : function (id){
		var IDTOUR = this.j.cookie('_ID_TOUR');
		if(IDTOUR > 0){
			this.gotofun = this._add;
			this.ajax({
				url : '/tour/cgi/pro_addshop.php', type : 'POST',
				data : { s : id }, dataType : 'json'
			});
		}else{
			this.id = id;
			this.view();
			this.list(1, 0);
		}
	},
	trunk : function (){
		var IDTOUR = this.j.cookie('_ID_TOUR');
		if(IDTOUR > 0){
			this.gotofun = this._trunk;
			this.ajax({
				url : '/tour/trunk.php', type : 'POST',
				data : { id : IDTOUR }, dataType : 'html'
			});
		}
	},
	_trunk : function (res){
		this.j('body').append(res);
		if(TOURADD.show_trunk){
			this.j('.trunk_block').show();
			this.j('.trunk_block2').hide();
		}else{
			this.j('.trunk_block').hide();
			this.j('.trunk_block2').show();
		}
	},
	ajax : function(item){
		this.j.ajax({
			url : item.url,
			data: item.data,
			dataType : item.dataType,
			type: item.type,
			success: function(res){	
				TOURADD.gotofun(res);				
			}
		});
	},
	_list : function(res){
		if(res == 'login'){
			location.href = "/login/?next="+encodeURIComponent(window.location);
		}else{
			this.j('#layer'+TOURADD.time).html(res);
		}
	},
	_add : function(res){
		if(res.login == false){
			location.href = "/login/?next="+encodeURIComponent(window.location);
		}else if(res.msg && res.code == 0){
			TOURADD.remove();
			TOURADD.trunk();
			alert('已加入行程');
		}else if(res.msg && res.code == 3){
			TOURADD.remove();
			TOURADD.trunk();
			alert('超過行程上限300');
		}else if(res.code == 2){
			TOURADD.add(TOURADD.id);
		}else{
			location.reload();
		}
	},
	_setcookie : function(res){
		if(res.msg == 'login'){
			location.href = res.url;
		}else if(res.msg == 'ok'){
			this.add(TOURADD.id);
		}else{
			alert('此行程不存在');
		}
	},
	opentrunk : function(){
		this.j('.trunk_block').toggle();
		this.j('.trunk_block2').toggle();
		TOURADD.show_trunk = (TOURADD.show_trunk)? false:true;
	},
	uncookie : function(){
		this.j.cookie('_ID_TOUR', 0, {domain : 'ipeen.com.tw', path: '/'});
		this.remove();
	}
};
