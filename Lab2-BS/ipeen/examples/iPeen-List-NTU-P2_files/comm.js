// last modified by kevin on 1228.1854
// JavaScript Document
function getCookie(c_name)
{
if (document.cookie.length>0)
  {
   var c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 
    var c_end=document.cookie.indexOf(";",c_start)
    if (c_end==-1) c_end=document.cookie.length
    return UnStrCode(document.cookie.substring(c_start,c_end))
    } 
  }
return ""
}

function setCookie(name, value, expires, path, domain, secure ) {
 var today = new Date();
 today.setTime(today.getTime());

 if (expires) {
  expires = expires * 1000 * 60 * 60 * 24;
 }

 var expires_date = new Date( today.getTime() + (expires) );
 document.cookie = name+'='+StrCode(value) +
 ((expires) ? ';expires='+expires_date.toGMTString() : '') + 
 ((path) ? ';path=' + path : '') +
 ((domain) ? ';domain=' + domain : '') +
 ((secure) ? ';secure' : '');
}
function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_jumpMenu(targ,selObj,restore){ //v3.0
  eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
  if (restore) selObj.selectedIndex=0;
}

function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}
//----------------------------------------------------------//
// added on 1212.1741 by jb
function addFav(e){
	var url="http://www.ipeen.com.tw";
	var title="iPeen 愛評網 - 美食消費經驗分享";
	var nav = navigator.userAgent;
 
	if(document.all) {
	 	e.href = 'javascript:void(0);';
		window.external.AddFavorite(url, title);
		return false;
	} else if(nav.indexOf("SeaMonkey") != -1) {
  		e.href = 'javascript:void(0);';
		window.sidebar.addPanel(title, url, '');
		return false;
	}
}
//----------------------------------------------------------//

function add_reply_all(c_id)
{
   add_reply_cgi(c_id);
}

function add_reply_cgi(c_id , limit){
    
    form_name = 'reply_form_'+c_id;
    form_text = 'reply_form_text_'+c_id;
    var qstr = 'uid='+document.getElementById(form_name).uid.value+'&cid='+document.getElementById(form_name).cid.value+'&reply_txt='+encodeURIComponent(document.getElementById(form_name).reply_txt.value);
    document.getElementById(form_name).reply_txt.value = ''; 
    formhtml = document.getElementById(form_text).innerHTML;
    Element.update(form_text, '<div style="text-align:center"><img src="/images/loading.gif" /></div>');
    var url = '/comment/cgi/proc_comment_reply.php?id='+c_id;
    var opt = {
				method: 'post',
				parameters: qstr,
				onSuccess: function(t) {
					add_reply_done(c_id , limit);
                    Element.update(form_text, formhtml);
				},
				onFailure: function(t) {
					alert('抱歉!目前系統維護中，暫停提供服務！');
				}
			  }

    var obj_ajax = new Ajax.Request(url, opt);  
     
			
}

function add_reply_done(c_id , limit) {
     
    comment_reply_name = 'comment_reply'+c_id;
  	var urlt = '/comment/comment_reply_case.php?id='+c_id+'&limit='+limit;

	var ajaxt = new Ajax.Request (urlt, 
			{
				method: 'get',
				onComplete: function testa(reqObj){
				Element.update(comment_reply_name, reqObj.responseText);
				}
			});

}

function StrCode(str){if(encodeURIComponent) return encodeURIComponent(str);if(escape) return escape(str);}
function UnStrCode(str){if(decodeURIComponent ) return decodeURIComponent (str);if(unescape) return unescape(str);}
function Trim(s){var m = s.match(/^\s*(\S+(\s+\S+)*)\s*$/);return (m == null)?"":m[1];}
function HtmlEncode(text){var re = {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'};for (i in re) text = text.replace(new RegExp(i,'g'), re[i]);return text;}
function HtmlDecode(text){var re = {'&lt;':'<','&gt;':'>','&amp;':'&','&quot;':'"'};for (i in re) text = text.replace(new RegExp(i,'g'), re[i]);return text;}
function gid(id){return document.getElementById?document.getElementById(id):null;}
function gname(id){return document.getElementsByName?document.getElementsByName(id):null;}
function gtname(name){return document.getElementsByTagName?document.getElementsByTagName(name):new Array()}

var get_e_src = function(e){if(e) return e.target;if(window.event) return window.event.srcElement;return null;};
function addEvent(obj,evType,fn,useCapture ){if (obj.addEventListener){obj.addEventListener( evType, fn, useCapture );return true;}if (obj.attachEvent) return obj.attachEvent( "on" + evType, fn );alert( "Unable to add event listener for " + evType + " to " + obj.tagName );}
function Browser(){var ua, s, i;this.isIE = false;this.isNS = false;this.isOP = false;this.isSF = false;ua = navigator.userAgent.toLowerCase();s = "opera";if ((i = ua.indexOf(s)) >= 0){this.isOP = true;return;}s = "msie";if ((i = ua.indexOf(s)) >= 0) {this.isIE = true;return;}s = "netscape6/";if ((i = ua.indexOf(s)) >= 0) {this.isNS = true;return;}s = "gecko";if ((i = ua.indexOf(s)) >= 0) {this.isNS = true;return;}s = "safari";if ((i = ua.indexOf(s)) >= 0) {this.isSF = true;return;}}
function ClickButton(event, buttonid){var btnObj = gid(buttonid);if (btnObj){var e = (event||window.event);if (e.keyCode == 13){btnObj.click();return false;}}return true;}
function WarpClass(eID,tID,fID,ev){var eObj = document.getElementById(eID);var tObj = document.getElementById(tID);var fObj = document.getElementById(fID);if (eObj && tObj){if (!tObj.style.display || tObj.style.display == "block"){tObj.style.display = "none";eObj.className = "Warp";if (fObj) fObj.style.display = "none";}else{tObj.style.display = "block";eObj.className = "UnWarp";if (ev) eval(ev);if (fObj) fObj.style.display = "block";}}}

function mcl(show, div, btn, over, padd){var objdiv = gid(div);var objbtn = gid(btn);if (objdiv && objbtn){var browser = new Browser();if (show){objdiv.style.display = "block";if (browser.isIE && over){var allselect = gtname("select");for (var i=0; i<allselect.length; i++){allselect[i].style.visibility = "hidden";}}objdiv.style.top = (objbtn.offsetTop + objbtn.offsetHeight - 2) + "px";objdiv.style.left = (objbtn.offsetLeft - (padd?0:50)) + "px";}else{objdiv.style.display = "none";if (browser.isIE && over){var allselect = gtname("select");for (var i=0; i<allselect.length; i++){allselect[i].style.visibility = "visible";}}}}}

//function InitRequest(){var C_req = null;try{C_req = new ActiveXObject("Msxml2.XMLHTTP");}catch(e){try{C_req = new ActiveXObject("Microsoft.XMLHTTP");}catch(oc){C_req = null;}}if (!C_req && typeof XMLHttpRequest != "undefined"){try{C_req = new XMLHttpRequest();}catch(fa){alert("Sorry, please use Internet Explorer 6.0 or FireFoxI");C_req = null;}}return C_req;}
//function PostRequest(url, data){var AjaxRequestObj = InitRequest();if (AjaxRequestObj != null){AjaxRequestObj.onreadystatechange = function (){if (AjaxRequestObj.readyState == 4 && AjaxRequestObj.responseText){ProcessAjaxData(AjaxRequestObj.responseText);}};AjaxRequestObj.open("POST", url, true);AjaxRequestObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");AjaxRequestObj.send(data);}}
//function ProcessAjaxData(data){eval(data);}
function ScreenConvert(){var browser = new Browser();var objScreen = gid("ScreenOver");if(!objScreen) var objScreen = document.createElement("div");var oS = objScreen.style;objScreen.id = "ScreenOver";oS.display = "block";oS.top = oS.left = oS.margin = oS.padding = "0px";var wh=1000;var ww=1000;if(browser.isIE){wh=document.documentElement.scrollHeight;ww=document.documentElement.scrollWidth;}else if(document.documentElement.scrollHeight){wh=document.documentElement.scrollHeight+"px";ww=document.documentElement.scrollWidth+"px";}oS.width=ww;oS.height=wh;oS.position ="absolute";oS.zIndex = "3";if ((!browser.isSF) && (!browser.isOP)){oS.background = "#cccccc";}else{oS.background = "#cccccc";}oS.filter = "alpha(opacity=40)";oS.opacity = 40/100;oS.MozOpacity = 40/100;document.body.appendChild(objScreen);var allselect = gtname("select");for (var i=0; i<allselect.length; i++) allselect[i].style.visibility = "hidden";}
function ScreenClean(){var objScreen = document.getElementById("ScreenOver");if (objScreen) objScreen.style.display = "none";var allselect = gtname("select");for (var i=0; i<allselect.length; i++) allselect[i].style.visibility = "visible";}
var t_DiglogX,t_DiglogY,t_DiglogW,t_DiglogH;
function DialogLoc(){var dde = document.documentElement;if (window.innerWidth){var ww = window.innerWidth;var wh = window.innerHeight;var bgX = window.pageXOffset;var bgY = window.pageYOffset;}else{var ww = dde.offsetWidth;var wh = dde.offsetHeight;var bgX = dde.scrollLeft;var bgY = dde.scrollTop;}t_DiglogX = (bgX + ((ww - t_DiglogW)/2));t_DiglogY = (bgY + ((wh - t_DiglogH)/2));}
function DialogShow(showdata,ow,oh,w,h){var objDialog = document.getElementById("DialogMove");if (!objDialog) objDialog = document.createElement("div");t_DiglogW = ow;t_DiglogH = oh;DialogLoc();objDialog.id = "DialogMove";var oS = objDialog.style;oS.display = "block";oS.top = t_DiglogY + "px";oS.left = t_DiglogX + "px";oS.margin = "0px";oS.padding = "0px";oS.width = w + "px";oS.height = h + "px";oS.position = "absolute";oS.zIndex = "5";oS.background = "#FFF";objDialog.innerHTML = showdata;document.body.appendChild(objDialog);}
function DialogHide(){ScreenClean();var objDialog = document.getElementById("DialogMove");if (objDialog) objDialog.style.display = "none";}
function DialogRemove(){
	var objDialog = document.getElementById("DialogMove");
	if(objDialog){
		if (objDialog.parentNode){
			objDialog.parentNode.removeChild(objDialog);
		};
		objDialog = null;
	}
	ScreenClean();
}
/*
function Logout(){PostRequest(window.location.protocol + "//" + window.location.host + "/AJAX_Comm.aspx", "do=logout");}
function SearchKeyword(city, sel1, sel2){var sel1Obj = gid(sel1);var sel2Obj = gid(sel2);if (sel1Obj && sel2Obj){var sel1Value = sel1Obj.value;var sel2Value = sel2Obj.value;if (!sel2Value){alert("??Jj??r!");sel2Obj.focus();return;}sel2Value = Trim(sel2Value);sel2Value = sel2Value.replace("%","");sel2Value = sel2Value.replace("\"","");var SearchURL = "/search_k/" + city + "/" + sel1Value + "_" + StrCode(sel2Value);location.href = SearchURL;}}
function SelectTagGet(svalue,tvalue){if(svalue!=null){if(tvalue=="10")location.href = "/" + svalue + "/food";else if(tvalue=="20")location.href = "/" + svalue + "/shopping";else if(tvalue=="30")location.href = "/" + svalue + "/life";else if(tvalue=="40")location.href = "/" + svalue + "/service";else location.href = "/" + svalue + "/food";}}
function SearchClass(city, sel1, sel2, sel3){var sel1Obj = gid(sel1);var sel2Obj = gid(sel2);var sel3Obj = gid(sel3);if (sel1Obj && sel2Obj && sel3Obj){var sel1Value = sel1Obj.value;var sel2Value = sel2Obj.value;var sel3Value = sel3Obj.value;if (sel2Value == "0") sel2Value = "";if (sel3Value == "0"){sel3Value = "";} var SearchURL = "/search_m/" + city + "/" + sel1Value + "_" + sel2Value + sel3Value;TrackShop(1106);location.href=SearchURL;}}
*/