var cymsrc = 1;

var cymtr=Math.floor(Math.random()*9999999999);

if(document.referrer.length <= 0)
{
	var cyrefth='';
}
else
{
	var cyrefth = document.referrer.split('/')[2]+document.referrer.substr(document.referrer.indexOf(document.referrer.split('/')[2])+document.referrer.split('/')[2].length);
}

<!-- CyFBcookie Mapping -->
function cy_padLeft(str,lenght){
	if(str.length >= lenght)
		return str;
	else
		return cy_padLeft("0" +str,lenght);
}

if(!document.getElementsByClassName){
	document.getElementsByClassName = function(className, element){
		var children = (element || document).getElementsByTagName('*');
		var elements = new Array();
		for (var i=0; i<children.length; i++){
			var child = children[i];
			var classNames = child.className.split(' ');
			for (var j=0; j<classNames.length; j++){
				if (classNames[j] == className){ 
					elements.push(child);
					break;
				}
			}
		} 
		return elements;
	};
}

function ipeen_pminfo_get()
{
	var cy_isMobile = {
		Android: function() {return navigator.userAgent.match(/Android/i);},
		BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
		iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
		Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
		Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
		any: function() {return navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);}
	};

	var addScript = function(){
		var device = cy_isMobile.any() ? 1 : 0;
		var referrer = document.referrer;
		var cy_src = 'pt.cymmetrics.com.tw/infoclient/pm_ipeen.php?device='+device+'&referrer='+referrer;
		var cym_ct = document.createElement('script'); cym_ct.type= 'text/javascript';
		var src = 'https://'; cym_ct.src = src+cy_src;
		var cym_cts = document.getElementsByTagName('script')[0];
		cym_cts.parentNode.insertBefore(cym_ct, cym_cts); 
	};
	if (window.addEventListener) 
	{
		document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', addScript, false) : addScript();
	} 
	else 
	{
		document.readyState == 'loading' ? document.attachEvent('onDOMContentLoaded', addScript, false) : addScript();
	}
}
ipeen_pminfo_get();

function cy_fb_pixel_cookie( cy_pc3, cy_pc4, cy_device, cy_referrer )
{
	!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
		n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
		n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
		t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
				document,'script','//connect.facebook.net/en_US/fbevents.js');
		fbq('init', '1520176291627027');
		fbq('track', "PageView");

		if( cy_pc3 == 'N/A' )
			cy_pc3 = (document.querySelector(".ga_tracking[data-label='詳細資訊_大分類']")?document.querySelector(".ga_tracking[data-label='詳細資訊_大分類']").innerHTML:'N/A');
		var cy_d = new Date();
		var cy_datetime=cy_d.getFullYear().toString()+cy_padLeft((cy_d.getMonth()+1).toString(),2)+cy_d.getDate().toString();
		var cy_mobile_de = cy_device;

		fbq.push(['trackCustom', 'ipeen_fb_pixel', { pc3: cy_pc3, pc4: cy_pc4, datetime: cy_datetime, device: cy_mobile_de ,referrer: cy_referrer }]);

}
//cy_fb_pixel_cookie();


	<!-- Cycookie Mapping Base  -->
function google_cookie_mapping_url()
{
	var addScript = function(){
		var cy_src = 'cm.g.doubleclick.net/pixel?google_nid=cymmetrics_dmp&google_cm&cymsrc='+cymsrc;
		var cym_ct = document.createElement('script'); cym_ct.type= 'text/javascript';
		var src = 'https://'; cym_ct.src = src+cy_src;
		var cym_cts = document.getElementsByTagName('script')[0];
		cym_cts.parentNode.insertBefore(cym_ct, cym_cts); 
	};
	if (window.addEventListener) 
	{
		document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', addScript, false) : addScript();
	} 
	else 
	{
		document.readyState == 'loading' ? document.attachEvent('onDOMContentLoaded', addScript, false) : addScript();
	}
}
google_cookie_mapping_url(); 
function vm_cookie_mapping_url()
{
    var cy_src = 'vawpro.vm5apis.com/man.js';
	var cym_ct = document.createElement('script'); cym_ct.type= 'text/javascript';
    cym_ct.id = 'vm5ad-js-sdk';   cym_ct.dataset.mode = 'cymmetrics';
	var src = 'https://'; cym_ct.src = src+cy_src;
	var cym_cts = document.getElementsByTagName('script')[0];
	cym_cts.parentNode.insertBefore(cym_ct, cym_cts);
}
vm_cookie_mapping_url();
function vm_cm_data(mg_id,mm_id)
{
    var cy_src = 'pt.cymmetrics.com.tw/ckmp/vm5_ckmp.php?gcookie_id='+mg_id+'&vm5_ck='+mm_id;
	var cym_ct = document.createElement('script'); cym_ct.type= 'text/javascript';
    cym_ct.id = 'vm5ad-js-sdk';   cym_ct.dataset.mode = 'cymmetrics';
	var src = 'https://'; cym_ct.src = src+cy_src;
	var cym_cts = document.getElementsByTagName('script')[0];
	cym_cts.parentNode.insertBefore(cym_ct, cym_cts);
}

<!-- Cycookie Parnter  -->
function google_cookie_CF_mapping_url(mpg_id)
{
        var google_cy_src = 'cm.g.doubleclick.net/pixel?google_nid=cymmetrics_dmp&google_cm&cymct_id=Cforce&mpg_id='+mpg_id;
		var google_cym_ct = document.createElement('img'); 
					google_cym_ct.width='1'; google_cym_ct.height='1'; google_cym_ct.frameborder='0'; google_cym_ct.style.display='none';google_cym_ct.style.visibility='hidden';
					var google_src = 'https://'; google_cym_ct.src = google_src+google_cy_src;
					var google_cym_cts = document.getElementsByTagName('script')[0]; 
					google_cym_cts.parentNode.insertBefore(google_cym_ct, google_cym_cts);
}

function onead_cookie_mapping_url()
{
	var addScript = function(){
        var cy_src = 'onead.onevision.com.tw/cookieRequest.php';
        var cym_ct = document.createElement('script'); cym_ct.type= 'text/javascript';
		var src = 'https://'; cym_ct.src = src+cy_src;
		var cym_cts = document.getElementsByTagName('script')[0];
        cym_cts.parentNode.insertBefore(cym_ct, cym_cts); 
		};
		if (window.addEventListener) {
			document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', addScript, false) : addScript();
		} else {
			document.readyState == 'loading' ? document.attachEvent('onDOMContentLoaded', addScript, false) : addScript();
		}
}

function cym_apply_log(pr_id,reff,cookie,rand_cy)
{
	/********************* custom_parameter定義 **************************/
	//member_id
	//	 var ipeen_uid=0;

	/********************************************************************/


	var cy_src = 'pt.cymmetrics.com.tw/aclient/ctl_iPeen.php?cymsrc='+pr_id+'&gcookie_id='+cookie+'&cymtr='+rand_cy+'&cyrefth='+encodeURIComponent(reff)+'&ipeen_uid='+ipeen_uid;
	var cym_ct = document.createElement('script'); 
	var src = 'https://'; cym_ct.src = src+cy_src;
	var cym_cts = document.getElementsByTagName('script')[0];
	cym_cts.parentNode.insertBefore(cym_ct, cym_cts);
}
function A3_cookie_mt_google(scookie)
{
	var addScript = function(){
	var cy_src = 'cm.g.doubleclick.net/pixel?google_nid=amnettw_dmp&google_cm&cygcookie='+scookie;
	var cym_ct = document.createElement('script'); cym_ct.type= 'text/javascript';
	var src = 'https://'; cym_ct.src = src+cy_src;
	var cym_cts = document.getElementsByTagName('script')[0];
	cym_cts.parentNode.insertBefore(cym_ct, cym_cts); 
	};
	if (window.addEventListener) 
	{
		document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', addScript, false) : addScript();
	} 
	else 
	{
		document.readyState == 'loading' ? document.attachEvent('onDOMContentLoaded', addScript, false) : addScript();
	}
}
function get_ck(ig_cookie) {this.g_cookie = ig_cookie;}

alget_ck=new get_ck("");

function gdatainfo(result) 
{ 
	alget_ck.g_cookie = result.cg_cookie;
	cym_apply_log(cymsrc,cyrefth,alget_ck.g_cookie,cymtr);
	if (window.VM5AD_BROWSER_ID)
	vm_cm_data(alget_ck.g_cookie,window.VM5AD_BROWSER_ID);
	A3_cookie_mt_google(alget_ck.g_cookie);
};

function pm_get_ck( icy_pc3, icy_pc4, icy_device, icy_referrer )
{
	this.pc3 = icy_pc3;
	this.pc4 = icy_pc4;
	this.device = icy_device;
	this.referrer = icy_referrer;
}
ipeen_pm_get_ck=new pm_get_ck("","","","");
function pm_datainfo(result) 
{ 
	ipeen_pm_get_ck.pc3 = result.cy_pc3;
	ipeen_pm_get_ck.pc4 = result.cy_pc4;
	ipeen_pm_get_ck.device = result.cy_device;
	ipeen_pm_get_ck.referrer = result.cy_referrer;
	cy_fb_pixel_cookie(ipeen_pm_get_ck.pc3,ipeen_pm_get_ck.pc4,ipeen_pm_get_ck.device,ipeen_pm_get_ck.referrer);
};
/*
<!-- CKMapping -->
onead_cookie_mapping_url();
function ovdatainfo(result) { 
google_cookie_CF_mapping_url(result.ov_cookie)
};*/
