/* script actions for shop v3 */
(function( $, ipeen ){
	var process = function(hasPush){
						if(hasPush == 0){
							this.run(function(e){ 
								// $(e).addClass('pressed');
								var idName = e.data("button-group");
								$("#"+idName).addClass('pressed');
								$("#"+idName+"-top").addClass('pressed');
							});
						}else{
							this.run(function(e){ 
								// $(e).removeClass('pressed');
								var idName = e.data("button-group");
								$("#"+idName).removeClass('pressed');
								$("#"+idName+"-top").removeClass('pressed');
							});
						}
					};
	
	/**
	 * done Yet
	 */
	$('#button-done').iPeenPush('click', new iPeenPush(null, { change: process, process: process }));
	
	/**
	 * collect
	 */
	$('#button-collect').iPeenPush('click', new iPeenPush(null, { change: process, process: process }));
	
/**
	 * done Yet on top bar
	 */
	$('#button-done-top').iPeenPush('click', new iPeenPush(null, { change: process, process: process }));
	
	/**
	 * collect on top bar
	 */
	$('#button-collect-top').iPeenPush('click', new iPeenPush(null, { change: process, process: process }));

})( this.jQuery, this.ipeen );