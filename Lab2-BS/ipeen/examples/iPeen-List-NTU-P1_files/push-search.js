$(function() {
	$(document).ready(function() {
		var callback = {
						change: function(hasPush){
							this.run(function(e){ 
								$(e).html('<span>處理中..</span>'); 
							});
						},
						process: function(hasPush){
							var object = this;
							if(hasPush == 0){
								this.run(function(e){ 
									$(e).addClass('select').html('<span>%s</span>'.replace('%s', object.config.message)); 
								});
							}else{
								this.run(function(e){ 
									$(e).removeClass('select').html('<span>%s</span>'.replace('%s', object.config.message)); 
								});
							}
						},
						add: function(res){
							if(res.success == 1){
								var message = this.config.success[parseInt(this.get('type'))]
								alert(message.replace(/%VERB%/g, this.config.message).replace("%NAME%", res.title));
							}else{
								this.process(1);
								alert(res.message);
							}
						},
						del: function(res){
							if(res.success == 1){
							}else{
								this.process(0);
								alert(res.message);
							}
						},
						auto: function(e){
							location.href = "#shop_row_"+iPeenPush.prototype.autoObject.attr('data-id');
							$('.actBtn[data-id='+iPeenPush.prototype.autoObject.attr('data-id')+']').click();
							iPeenPush.prototype.autoObject = null;
						}
					};
		var push_id = [];
		var config = [{ 'element': '.collect'}];
		for(var i in config){
			push_id = [];
			$(config[i].element).each(function(){
				var data_id = parseInt($(this).attr('data-id'));
				if(push_id[data_id] == data_id){
					return;
				}
				push_id[data_id] = data_id;
				$(config[i].element+'[data-id='+data_id+']').iPeenPush('click', new iPeenPush(null, callback));
			});
		}
	});
});