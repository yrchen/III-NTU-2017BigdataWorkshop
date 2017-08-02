/*
load 
	/js/facebook/common.js
	/js/jquery/jquery.cookie.js
 */
function iPeenPush(config, callback){

	if(typeof config!= "undefined" && config !== null){
		this.config = config;
	}else{
		this.config = {
				data: {
					type: 0, id: 0, 
					hasPush: 0, auth: 0, 
					login: 0, notified: 0
				},
				message: '',
				success: [
					"您已%VERB%【%NAME%】。",
					"已成功%VERB%【%NAME%】。",
					"%NAME%。"
				],
				cancel: [
					"已取消%VERB%【%NAME%】。",
					"已取消%VERB%【%NAME%】。",
					"%NAME%。"
				]
			};
	}
	
	this.object = [];
	
	var def_status = (typeof callback == "undefined");

	//define click process
	if(def_status || typeof callback.process == "undefined"){
		this.process = function(hasPush){
		}
	}else{
		this.process = callback.process;
		
	}
	//define add callback
	if(def_status || typeof callback.change == "undefined"){
		this.change = function(hasPush){}
	}else{
		this.change = callback.change;
	}
	
	//define add callback
	if(def_status || typeof callback.add == "undefined"){
		this.addCallBack = function(res){
			if(res.success == 1){
				var message = this.config.success[parseInt(this.get('type'))]
				alert(message.replace(/%VERB%/g, this.config.message).replace("%NAME%", res.title));
			}else{
				this.process(1);
				alert(res.message);
			}
		}
	}else{
		this.addCallBack = callback.add;
	}
	
	//define delete call back
	if(def_status || typeof callback.del == "undefined"){
		this.delCallBack = function(res){
			if(res.success == 1){
				var message = this.config.cancel[parseInt(this.get('type'))]
				alert(message.replace(/%VERB%/g, this.config.message).replace("%NAME%", res.title));
			}else{
				this.process(0);
				alert(res.message);
			}
		}
	}else{
		this.delCallBack = callback.del;
	}
	
	if(def_status || typeof callback.auto == "undefined"){
		this.autoCallBack = function(e){
			$(e).focus();
			iPeenPush.prototype.autoObject = null;
		};
	}else{
		this.autoCallBack = callback.auto;
	}
}

(function($) {
	
	iPeenPush.prototype.ajax = function(targetUrl, data, fun){
		$.ajax({ url: targetUrl, type: 'post', dataType: 'json', data: data, success: fun });
	}
	
	iPeenPush.prototype.lock = false;
	
	iPeenPush.prototype.loginUrl = "/login/";
	
	iPeenPush.prototype.addUrl = "/cgi/push/add.php";
	
	iPeenPush.prototype.delUrl = "/cgi/push/del.php";
	
	iPeenPush.prototype.autoObject = null;
	
	iPeenPush.prototype.layer = function(){
		alert('layer');
	};
	
	iPeenPush.prototype.get = function(key){
		return this.config.data[key];
	};
	
	iPeenPush.prototype.run = function(fun){
		var count = this.object.length;
		for(var i=0; i < count; i++){
			fun(this.object[i]);
		}
	}

	iPeenPush.prototype.action = function(){
		if(this.lock === true){
			return alert('請稍候...');
		}
		
		this.lock = true;
			
		//to loing page
		if(this.get('login') != '1'){
			this.setCookie();
			window.location = this.loginUrl+"?next=" + encodeURIComponent( window.location.href );
			return;
		}
		//to facebook page
		if(this.get('notified') == 1){
			this.__action(null);
		}else{
			facebook_utility.get_session_or_login($.proxy(this.__action, this), $.proxy(this.__action, this));
		}
	}
	
	iPeenPush.prototype.setCookie = function(){
		$.cookie('p-url', window.location.href, {domain : 'ipeen.com.tw', path: '/'});
		$.cookie('p-action', this.get('hasPush'), {domain : 'ipeen.com.tw', path: '/'});
		$.cookie('p-id', this.get('id'), {domain : 'ipeen.com.tw', path: '/'});
		$.cookie('p-type', this.get('type'), {domain : 'ipeen.com.tw', path: '/'});
	}
	
	iPeenPush.prototype.unsetCookie = function(){
		$.cookie('p-url', '', {domain : 'ipeen.com.tw', path: '/'});
		$.cookie('p-action', '', {domain : 'ipeen.com.tw', path: '/'});
		$.cookie('p-id', '', {domain : 'ipeen.com.tw', path: '/'});
		$.cookie('p-type', '', {domain : 'ipeen.com.tw', path: '/'});
	}
	
	iPeenPush.prototype.checkCookie = function(){
		var action = ($.cookie('p-action') === null || $.cookie('p-action') == '')? 0: $.cookie('p-action');
		var hasPush = (this.get('hasPush') === null || this.get('hasPush') == '')? 0: this.get('hasPush');
		if(this.get('login') == '1' && $.cookie('p-url') == window.location.href && parseInt(action)==parseInt(hasPush) && $.cookie('p-id')==this.get('id') && $.cookie('p-type')==this.get('type')){
			this.unsetCookie();
			return true;
		}
		return false;
	}

	iPeenPush.prototype.__action = function(r){
		
		if( r && r.authResponse ) {
			this.config.data.auth = 1
		}
		
		this.change(this.get('hasPush'));
		
		var targetUrl = (this.get('hasPush') == 0)? this.addUrl: this.delUrl;
		
		this.ajax(targetUrl, this.config.data, $.proxy(this.CallBack, this));
		
	}
	
	iPeenPush.prototype.CallBack = function(res){
		var hasPush = this.get('hasPush');
		
		this.process(this.get('hasPush'));
		
		this.lock = false;
		
		if(res.success != 1){
			this.initProcess(hasPush);
		}else{
			this.config.data.hasPush = (hasPush == 1)? 0: 1;
		}
		if(hasPush != 1){
			if(typeof BadgeBlock != "undefined") {
				BadgeBlock.show();
			}
			this.addCallBack(res);
		}else{
			this.delCallBack(res);
		}
	}
	
	iPeenPush.prototype.initProcess = function(hasPush){
		if(hasPush != 1){
			this.process(1);
		}else{
			this.process(0);
		}
	}
	
	//show log
	iPeenPush.prototype.log = function(log){
		console.log(log);
	}
	
	$.fn.iPeenPush = function(event, PushTemp) {
		PushTemp.config.data = {
								type: $(this).attr('data-type'), 
								id: $(this).attr('data-id'),  
								hasPush: $(this).attr('data-has'),  
								login: $(this).attr('data-login'),
								notified: $(this).attr('data-notified')
							};
		PushTemp.config.message = $(this).attr('data-msg');
		PushTemp.object.push(this);
		PushTemp.initProcess(PushTemp.get('hasPush'));
		
		if(event == 'click'){
			$(this).click(function(){
				if(iPeenPush.prototype.autoObject != null){
					PushTemp.autoCallBack(this);
				}
				PushTemp.action(this);
			});
		}
		
		//auto run
		if(PushTemp.checkCookie()){
			iPeenPush.prototype.autoObject = $(this);
		}
		
	};

})(jQuery);