var rep_post_block = '';
function DialogShowById(data_id, w, h)
{
	//var browser = new Browser();
	var obj_data = gid(data_id);
	var dialog_data = obj_data.innerHTML;
	ScreenConvert();
	var oh =h+10;
	var ow =w+10;
	DialogShow(dialog_data, ow, oh, w, h);
	return false;
}

function DialogShowByData(dialog_data, w, h)
{
	ScreenConvert();
	var oh =h-50;
	var ow =w+10;
	DialogShow(dialog_data, ow, oh, w, h);
	return false;
}

//-----------------------Login start -----------------//

function loginUser(obj_frm, msg_div, after_login)
{
	var account_value = StrCode(obj_frm.account.value);
	var passwd_value = StrCode(obj_frm.passwd.value);
	var remember_id = '';
	if (obj_frm.remember_id.checked)
	{
		remember_id='1';
	}
	var ajax_url = '/cgi/proc_signin.php';
	var opt = {
		method: 'post',
		postBody: 'account='+account_value+'&passwd='+passwd_value+'&remember_id='+remember_id,
		// Handle successful response
		onSuccess: function(t) {
            if( t.responseText == 'FAST' ) {
                document.location = '/register/register.php?fast=' + obj_frm.account.value;
            } else if (t.responseText=='OK')
			{
				if (typeof after_login == "object")
				{
					if (after_login['url'])
						document.location.href = UnStrCode(after_login['url']);
					else
						document.location.reload();
				} else if( typeof after_login == 'function' ) {
                                    if( after_login() )
					document.location.reload();
                                    else
                                        DialogHide();
                                } else
					document.location.reload();
			}else if (t.responseText=='LOGINED')
			{
				DialogHide();
			}else
			{
				if (gid(msg_div))
				{
					gid(msg_div).innerHTML=t.responseText;
				}
				obj_frm.account.focus();
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供登入服務！');
		}
	}

	//clear msg
	if (gid(msg_div))
	{
		gid(msg_div).innerHTML='';
	}
	//form check	
	if (obj_frm.account.value!='' && obj_frm.account.value!='')
	{
		new Ajax.Request(ajax_url, opt);
	}else
	{
		if (gid(msg_div))
		{
			gid(msg_div).innerHTML="帳號或密碼有誤，請重新確認!!";
		}
		obj_frm.account.focus();
	}
	return false;
}

function dialogLogin ( next ) {
    if( typeof(next) != 'string' )
        next = window.location;
    window.location = '/login/?next=' + encodeURIComponent(next);
}

/*
function dialogLogin(after_login)
{
	DialogHide();	//close other dialog

	var after_login_url = '';
	var after_login_op = '';
	if (typeof after_login == "object")
	{
		if (after_login['url'])
		{
			after_login_url = StrCode(after_login['url']);
			after_login_op = "{url:'"+after_login_url+"'}";
		}else if (after_login['runfun'])	//call function after login
		{
			after_login_url ='';
			after_login_op = "{runfun:'"+after_login['runfun']+"'}";
		}
	}else if (typeof after_login == "string")
	{
		after_login_url = StrCode(after_login);
		after_login_op = "{url:'"+after_login_url+"'}";
        } else if( typeof after_login == 'function' ) {
                after_login_url = '';
                after_login_op = after_login;
	}else
	{
		after_login_url = '';
		after_login_op = "''";
	}

	var def_acc = getCookie('remacc');
	var if_check_remember = '';
	if (def_acc!='')
	{
		if_check_remember = 'checked="checked"';
	}
	//MM_preloadImages('/images/signon_new/x_click.gif');
    

    var div_str =  getLoginAction(after_login_op , def_acc , if_check_remember  );

var browser = new Browser();
if(browser.isIE && document.readyState != "complete"){	
   setTimeout(function () {dialogLogin();},100); return false;}
else{DialogShowByData(div_str, 405,250); }
	document.getElementById('account').focus();
	return false;
}
*/

//-----------------------Login end -----------------//

//----------------------Header Member Icon start-----------------------------//
function showHeaderMemberIcon() {
	var str = '';
	var ulvl = getCookie('ulvl');
	if (ulvl == '') {
		str += '<img src="/images/levelicon/loginyet.gif" width="72" height="72" />';		
	} else {
		var n = Math.ceil(Number(ulvl)/5);
		str += '<img src="/images/levelicon/lv_icon'+n+'.gif" width="72" height="72" />';
	}
	document.write(str);
}
//-------------------------Header Member Icon end-----------------------//

//----------------------myinfo login start-----------------------------//
function showMyinfoLogin()
{
	var str = "";
	var unick = getCookie('unick');
	if (unick=="")
	{
		str +='<a href="javascript:void(0);" onclick="dialogLogin(\'/myinfo/my_info.php\');" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'my\',\'\',\'/images/searchbar/select05-w.gif\',1)">';
		//alert(str);
	}else
	{
		str +='<a href="/myinfo/my_info.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'my\',\'\',\'/images/searchbar/select05-w.gif\',1);">';
		//alert(str);
	}
	document.write(str);
}
//-------------------------myinfo login end-----------------------//

function showGBLogin(id)
{
	var str = "";
	var unick = getCookie('unick');
	if (unick=="")
	{
		str +='<a href="javascript:void(0);" onclick="dialogLogin(\'/bmyinfo/bmy_guestbook_write.php?id='+id+'\');" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'my\',\'\',\'/images/searchbar/select05-w.gif\',1)">';

	}else
	{
		str +='<a href="/bmyinfo/bmy_guestbook_write.php?id='+id+'" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'my\',\'\',\'/images/searchbar/select05-w.gif\',1);">';

	}
	document.write(str);
}
//-------------------------new Header-----------------------//
function showHeaderLogin_ipeen(x)
{
	var now = new Date();
	var nowhour = now.getHours();
	var hello_str = "";
	if (nowhour>=3 && nowhour<11)
	{
		hello_str ="早安";
	}else if (nowhour>=11 && nowhour<17)
	{
		hello_str ="午安";
	}else
	{
		hello_str ="晚安";
	}
	
	var str = "";
	var unick = getCookie('unick');
	var umsgno = getCookie('umsgno');
	var ulvl = getCookie('ulvl');
	var upo = getCookie('upo');
	var home = '/home/' + getCookie('uhome') + '/';
	if (unick=="")
	{
	  str +='<label class="login_info">'+hello_str+'，訪客您好</label><label class="login_info">|</label>';
	  if (x==1)
	  str +='<label class="login_info"><a href="/login/" class="a_login">登入</a></label>';
	  else
	  str +='<label class="login_info"><a href="#" onclick="return dialogLogin()" class="a_login">登入</a></label>';
	  str +='<label class="login_info">|</label><label class="login_info"><a href="/register" class="a_login">免費註冊會員</a></label>';
	  if (x!=1)
	  str +='<label class="login_info">|</label><label class="login_info"><a href="/" class="a_login">愛評首頁</a></label>';
	   str +='<label class="login_info">|</label><label class="login_info"><font color="#FF0000"><b>NEW!!&nbsp;</b></font><a href="http://www.ipeen.com.tw/newcmm/newcmm.php" class="a_login">最新分享</a></label><label class="login_info">|</label><label class="login_info"><a href="/service/service_seal.php" class="a_login">愛評小玩意</a></label>';
	}
	else
	{
		if (umsgno=="") umsgno="0";
		str +='<label class="login_info">'+hello_str+'，'+unick+'</label><label class="login_info">|</label><label class="login_info"><a href="' + home + 'mail" class="a_login">('+umsgno+')封新訊息</a></label><label class="login_info">|</label><label class="login_info"><a href="#" onclick="MM_showHideLayers(\'fdoorway\',\'\',\'show\');if(document.getElementById(\'fdoorway\'))document.getElementById(\'fdoorway\').style.left=screenbroswer(735);" class="a_login">任意門</a></label><label class="login_info">|</label>';
		//------------------------------------------------
		str +='<div id="fdoorway" style="visibility:hidden"  onmouseover="MM_showHideLayers(\'fdoorway\',\'\',\'show\')">';
		str +='	<div class="doorway_style" >';
		str +='		<table width="100%" border="0" cellpadding="6">';
		str +='		  <tr><td><a href="' + home + '" class="doorway">我的分享集</a></td></tr>';
		str +='		  <tr><td><a href="' + home + 'detail" class="doorway">我的P幣存摺</a></td></tr>';
		str +='		  <tr><td><a href="' + home + 'detail/candy" class="doorway">我的棒棒糖紀錄</a></td></tr>';	
		if (ulvl>=3)
		{
			str +='		  <tr><td><a href="' + home + 'board" class="doorway">我的留言版</a></td></tr>';
		}
		str +='		  <tr><td><a href="' + home + 'detail/cmmreply" class="doorway">我的回應追蹤</a></td></tr>';
		str +='		  <tr><td><a href="' + home + 'bookmark/shop" class="doorway">我的名片夾</a></td></tr>';
		str +='		  <tr><td><a href="' + home + 'friend" class="doorway">我的好友名單</a></td></tr>';
		str +='		  <tr><td><a href="' + home + 'info/edit" class="doorway">個人資料設定</a></td></tr>';
		

		//str +='		  <tr><td><a href="/group/mygroup.php" class="doorway">我的幫會</a></td></tr>';
		str +='		  <td align="center" onclick="MM_showHideLayers(\'fdoorway\',\'\',\'hide\')"><span style="color:#999999; font-size:12px; cursor: pointer;">-&nbsp;關閉&nbsp;-</span></td>';
		str +='	  </table></div></div>';
		//-------------------------------------------------
		str +='<label class="login_info"><a href="#" onclick="document.location.href=\'/cgi/logout.php\'" class="a_login">登出</a></label>';
		str +='<label class="login_info">|</label><label class="login_info"><font color="#FF0000"><b>NEW!!&nbsp;</b></font><a href="http://www.ipeen.com.tw/newcmm/newcmm.php" class="a_login">最新分享</a></label><label class="login_info">|&nbsp;<a href="/service/service_seal.php" class="a_login">愛評小玩意</a></label>';
	}
	document.write(str);
}
//group header login
function getHeaderLogin_ipeen_group (  ) {
var now = new Date();
var nowhour = now.getHours();
var hello_str = "";

    if( nowhour >= 3 && nowhour < 11 )
        hello_str ="早安";
    else if( nowhour >= 11 && nowhour < 17 )
        hello_str ="午安";
    else
        hello_str ="晚安";
var str;
var unick = getCookie('unick');
var umsgno = getCookie('umsgno');
var ulvl = getCookie('ulvl');
var upo = getCookie('upo');
var home = '/home/' + getCookie('uhome') + '/';
    if( unick == "" )
        str = [
            hello_str, '，訪客您好&nbsp;&nbsp;|&nbsp;&nbsp;',
            '<a href="/login/?next=', encodeURIComponent(window.location), '" class="a35">登入</a>&nbsp;&nbsp;|&nbsp;&nbsp;',
            '<a class="facebookiPeen" href="javascript: void(0)"><img src="/images/v2/hp/search/btn_fblogin.gif" align="absmiddle" alt="使用Facebook帳號登入" title="使用Facebook帳號登入"/></a>&nbsp;&nbsp;|&nbsp;&nbsp;',
            '<a class="yahooiPeen" href="javascript:location.href=\'/login/yahoo_auth.php?login=1&next=\'+window.location;"><img src="/images/v2/hp/search/btn_yahoologin.gif" align="absmiddle" alt="使用yahoo帳號登入" title="使用yahoo帳號登入"/></a>&nbsp;&nbsp;|&nbsp;&nbsp;',
            '<a href="/register/registration.php" class="a35">免費註冊會員</a>&nbsp;&nbsp;|&nbsp;&nbsp;',
            '<font color="#FF0000"><b>NEW!!&nbsp;</b></font><a href="/newcmm/newcmm.php" class="a35">最新分享</a>'
        ].join('');
    else {
    	if(!rep_post_block)
    		rep_post_block = '';
        if( umsgno == "" )
            umsgno = "0";
        str = [
            '<font>', hello_str, '，<a class="a35" href="',home,'">', unick, '</a><a href="javascript:showhdQuick();" id="hdArrow" class="hdSlide"><div class="hdArrow"></div></a><div id="hdQuick" class="hdQuick hide"><ul><li><a href="',home,'bookmark/shop">我的收藏</a></li><li><a href="',home,'detail/ifeedback">我的回饋金</a></li><li><a href="',home,'detail">我的P幣</a></li><li><a href="',home,'friend">好友名單</a></li><li><a href="',home,'badge/?t=myself">我的徽章</a></li><li><a href="',home,'detail/cmmreply">文章最新回應</a></li><li><a href="/home/account/home.php">個人資料設定</a></li></ul>	<a class="quickClose"  href="javascript:quickClose();">x&nbsp;關閉&nbsp;x</a></div></font>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="', home, 'mail" class="a35">(', umsgno, ')封新訊息</a>&nbsp;&nbsp;|&nbsp;&nbsp;',
            '<a href="/logout/" class="a35">登出</a>&nbsp;&nbsp;|&nbsp;&nbsp;',
            rep_post_block,
            '<font color="#FF0000"><b>NEW!!&nbsp;</b></font><a href="/newcmm/newcmm.php" class="a35">最新分享</a>&nbsp;&nbsp;|&nbsp;&nbsp;',
            '<a href="https://ishopping.ipeen.com.tw/my/my_list.php" class="a35">我的購物</a>'
        ].join('');
    }
    return str;
}

function updateHeaderLogin_ipeen_group (  ) {
var header = document.getElementById('mini_top_loginmess');
    header.innerHTML = getHeaderLogin_ipeen_group();
}

function showHeaderLogin_ipeen_group (  ) {
    document.write(getHeaderLogin_ipeen_group());
}
/* defualt*/
function topselect(x,y,z)
{
	var str = "";
	if (x==null)
	x=1;
	if (x==1)
	str +=	'<div class="selects_items"><a href="/" ><img src="/images/v2/hp/select/toptag_01s.gif" alt="首頁" title="首頁" name="Image18" border="0" id="Image18" /></a></div>';
	else
		str +=	'<div class="selects_items"><a href="/" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image18\',\'\',\'/images/v2/hp/select/toptag_01over.gif\',1)"><img src="/images/v2/hp/select/toptag_01.gif" alt="首頁" title="首頁" name="Image18" border="0" id="Image18" /></a></div>';
	if (x==2)	
	str += '<div class="selects_items"><a href="/media/media_index.php"><img src="/images/v2/hp/select/toptag_02s.gif" alt="媒體情報" title="媒體情報"name="Image5"  border="0" id="Image5" /></a></div>';
	else
	str +=	'<div class="selects_items"><a href="/media/media_index.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image5\',\'\',\'/images/v2/hp/select/toptag_02over.gif\',1)"><img src="/images/v2/hp/select/toptag_02.gif" alt="媒體情報" title="媒體情報"name="Image5" border="0" id="Image5" /></a></div>';
	if (x==3)
	str +=	'<div class="selects_items"><a href="/focus"><img src="/images/v2/hp/select/toptag_03s.gif" alt="精選特輯" title="精選特輯" name="Image19" border="0" id="Image19" /></a></div>';
	else
	str +=	'<div class="selects_items"><a href="/focus" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image19\',\'\',\'/images/v2/hp/select/toptag_03over.gif\',1)"><img src="/images/v2/hp/select/toptag_03.gif" alt="精選特輯" title="精選特輯" name="Image19" border="0" id="Image19" /></a></div>';
	if (x==4)
	str +='<div class="selects_items"><a href="/rank" ><img src="/images/v2/hp/select/toptag_07s.gif" alt="分類排行" title="分類排行" name="Image12" border="0" id="Image12" /></a></div>';
	else
	str +='<div class="selects_items"><a href="/rank" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image12\',\'\',\'/images/v2/hp/select/toptag_07over.gif\',1)"><img src="/images/v2/hp/select/toptag_07.gif" alt="分類排行" title="分類排行" name="Image12" border="0" id="Image12" /></a></div>';
	
	//if (x==5)
	//str +='<div class="selects_items"><a href="/reputation" ><img src="/images/v2/hp/select/toptag_13s.gif" alt="口碑卷" title="口碑卷" name="Image13" border="0" id="Image13" /></a></div>';
	//else
	//str +='<div class="selects_items"><a href="/reputation" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image13\',\'\',\'/images/v2/hp/select/toptag_13over.gif\',1)"><img src="/images/v2/hp/select/toptag_13.gif" alt="口碑卷" title="口碑卷" name="Image13" border="0" id="Image13" /></a></div>';

	if (x==5)
	str +='<div class="selects_items"><a href="/reputation" ><img src="/images/v2/hp/select/toptag_14s.gif" alt="愛評分享團" title="愛評分享團" name="Image16" border="0" id="Image16" /></a></div>';
	else
	str +='<div class="selects_items"><a href="/reputation" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'toptag_14\',\'\',\'/images/v2/hp/select/toptag_14over.gif\',1)"><img src="/images/v2/hp/select/toptag_14.gif" alt="愛評分享團" title="愛評分享團" name="toptag_14" border="0" id="toptag_14" /></a></div>';	

	str +='<div class="selects_items"><a href="http://ishopping.ipeen.com.tw/" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'toptag_16\',\'\',\'/images/v2/hp/select/toptag_16over.gif\',1)"><img src="/images/v2/hp/select/toptag_16.gif" alt="愛評嚴選團購" title="愛評嚴選團購" name="toptag_16" border="0" id="toptag_16" /></a></div>';

	if (x==6)
	str	+='<div class="selects_items"><a href="/map/"><img src="/images/v2/hp/select/toptag_09s.gif" alt="地圖快搜" title="地圖快搜" name="Image14" border="0" id="Image14" /></a></div>';
	else
	str	+='<div class="selects_items"><a href="/map/" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image14\',\'\',\'/images/v2/hp/select/toptag_09over.gif\',1)"><img src="/images/v2/hp/select/toptag_09.gif" alt="地圖快搜" title="地圖快搜" name="Image14" border="0" id="Image14" /></a></div>';
	if (x==7)
	str	+='<div class="selects_items"><a href="http://www.ipeen.com.tw/group/index.php" ><img src="/images/v2/hp/select/toptag_15s.gif" alt="幫會" title="幫會" name="Image15" border="0" id="Image15"/></a></div>';
	else
	str	+='<div class="selects_items"><a href="http://www.ipeen.com.tw/group/index.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image15\',\'\',\'/images/v2/hp/select/toptag_15over.gif\',1)"><img src="/images/v2/hp/select/toptag_15.gif" alt="幫會" title="幫會" name="Image15" border="0" id="Image15"/></a></div>';
	if (x==8)
	str +='<div class="selects_items"><a href="/coupon/coupon_list.php" ><img src="/images/v2/hp/select/toptag_11s.gif" alt="店家優惠" title="店家優惠" name="Image16" border="0" id="Image16" /></a></div>';
	else
	str +='<div class="selects_items"><a href="/coupon/coupon_list.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'toptag_11\',\'\',\'/images/v2/hp/select/toptag_11over.gif\',1)"><img src="/images/v2/hp/select/toptag_11.gif" alt="店家優惠" title="店家優惠" name="toptag_11" border="0" id="toptag_11" /></a></div>';	
	
	//if (x==9)
	//str +='<div class="selects_items"><a href="/service/service_seal.php" ><img src="/images/v2/hp/select/toptag_12s.gif" alt="小玩意兒" title="小玩意兒" name="Image17" border="0" id="Image17" /></a></div>'; 
	//else
	//str +='<div class="selects_items"><a href="/service/service_seal.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image17\',\'\',\'/images/v2/hp/select/toptag_12over.gif\',1)"><img src="/images/v2/hp/select/toptag_12.gif" alt="小玩意兒" title="小玩意兒" name="Image17" border="0" id="Image17" /></a></div>';
	
	if (x==10)
	str +='<div class="selects_items"><a href="/reputation/reputation_bid.php" ><img src="/images/v2/hp/select/toptag_08s.gif" alt="獎勵" title="獎勵" name="Image16" border="0" id="Image16" /></a></div>';
	else
	str +='<div class="selects_items"><a href="/reputation/reputation_bid.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'toptag_08\',\'\',\'/images/v2/hp/select/toptag_08over.gif\',1)"><img src="/images/v2/hp/select/toptag_08.gif" alt="獎勵" title="獎勵" name="toptag_08" border="0" id="toptag_08" /></a></div>';

	if (z!=1)			
								str +='<div class="selects_items_btn"><a href="/cellphone/cellphone_step_1.php"  onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image160\',\'\',\'/images/v2/addbtn/cellphone_btn_over.gif\',1)"><img src="/images/v2/addbtn/cellphone_btn.gif" name="Image159" alt="手機驗證" title="手機驗證" width="89" height="24" border="0" id="Image160" /></a></div>';
			 document.write(str);
}


/*chameleon
function topselect(x,y,z)
{
	var str = "";
	if (x==null)
	x=1;
	if (x==1)
	str +=	'<div class="selects_items"><a href="/" ><img src="/images/v2/chameleon/toptag_01s.gif" alt="首頁" title="首頁" name="Image18" border="0" id="Image18" /></a></div>';
	else
		str +=	'<div class="selects_items"><a href="/" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image18\',\'\',\'/images/v2/chameleon/toptag_01over.gif\',1)"><img src="/images/v2/chameleon/toptag_01.gif" alt="首頁" title="首頁" name="Image18" border="0" id="Image18" /></a></div>';
	if (x==2)	
	str += '<div class="selects_items"><a href="/media/media_index.php"><img src="/images/v2/chameleon/toptag_02s.gif" alt="媒體情報" title="媒體情報"name="Image5"  border="0" id="Image5" /></a></div>';
	else
	str +=	'<div class="selects_items"><a href="/media/media_index.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image5\',\'\',\'/images/v2/chameleon/toptag_02over.gif\',1)"><img src="/images/v2/chameleon/toptag_02.gif" alt="媒體情報" title="媒體情報"name="Image5" border="0" id="Image5" /></a></div>';
	if (x==3)
	str +=	'<div class="selects_items"><a href="/focus"><img src="/images/v2/chameleon/toptag_03s.gif" alt="精選特輯" title="精選特輯" name="Image19" border="0" id="Image19" /></a></div>';
	else
	str +=	'<div class="selects_items"><a href="/focus" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image19\',\'\',\'/images/v2/chameleon/toptag_03over.gif\',1)"><img src="/images/v2/chameleon/toptag_03.gif" alt="精選特輯" title="精選特輯" name="Image19" border="0" id="Image19" /></a></div>';
	if (x==4)
	str +='<div class="selects_items"><a href="/rank" ><img src="/images/v2/chameleon/toptag_07s.gif" alt="分類排行" title="分類排行" name="Image12" border="0" id="Image12" /></a></div>';
	else
	str +='<div class="selects_items"><a href="/rank" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image12\',\'\',\'/images/v2/chameleon/toptag_07over.gif\',1)"><img src="/images/v2/chameleon/toptag_07.gif" alt="分類排行" title="分類排行" name="Image12" border="0" id="Image12" /></a></div>';
	
	//if (x==5)
	//str +='<div class="selects_items"><a href="/reputation" ><img src="/images/v2/chameleon/toptag_13s.gif" alt="口碑卷" title="口碑卷" name="Image13" border="0" id="Image13" /></a></div>';
	//else
	//str +='<div class="selects_items"><a href="/reputation" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image13\',\'\',\'/images/v2/chameleon/toptag_13over.gif\',1)"><img src="/images/v2/chameleon/toptag_13.gif" alt="口碑卷" title="口碑卷" name="Image13" border="0" id="Image13" /></a></div>';

	if (x==5)
	str +='<div class="selects_items"><a href="/reputation" ><img src="/images/v2/chameleon/toptag_14s.gif" alt="愛評分享團" title="愛評分享團" name="Image16" border="0" id="Image16" /></a></div>';
	else
	str +='<div class="selects_items"><a href="/reputation" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'toptag_14\',\'\',\'/images/v2/chameleon/toptag_14over.gif\',1)"><img src="/images/v2/chameleon/toptag_14.gif" alt="愛評分享團" title="愛評分享團" name="toptag_14" border="0" id="toptag_14" /></a></div>';	
	
	if (x==6)
	str	+='<div class="selects_items"><a href="/mapeji3b06e><img src="/images/v2/chameleon/toptag_09s.gif" alt="地圖快搜" title="地圖快搜" name="Image14" border="0" id="Image14" /></a></div>';
	else
	str	+='<div class="selects_items"><a href="/map" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image14\',\'\',\'/images/v2/chameleon/toptag_09over.gif\',1)"><img src="/images/v2/chameleon/toptag_09.gif" alt="地圖快搜" title="地圖快搜" name="Image14" border="0" id="Image14" /></a></div>';
	if (x==7)
	str	+='<div class="selects_items"><a href="/group/index.php" ><img src="/images/v2/chameleon/toptag_15s.gif" alt="幫會" title="幫會" name="Image15" border="0" id="Image15"/></a></div>';
	else
	str	+='<div class="selects_items"><a href="/group/index.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image15\',\'\',\'/images/v2/chameleon/toptag_15over.gif\',1)"><img src="/images/v2/chameleon/toptag_15.gif" alt="幫會" title="幫會" name="Image15" border="0" id="Image15"/></a></div>';
	if (x==8)
	str +='<div class="selects_items"><a href="/coupon/coupon_list.php" ><img src="/images/v2/chameleon/toptag_11s.gif" alt="店家優惠" title="店家優惠" name="Image16" border="0" id="Image16" /></a></div>';
	else
	str +='<div class="selects_items"><a href="/coupon/coupon_list.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'toptag_11\',\'\',\'/images/v2/chameleon/toptag_11over.gif\',1)"><img src="/images/v2/chameleon/toptag_11.gif" alt="店家優惠" title="店家優惠" name="toptag_11" border="0" id="toptag_11" /></a></div>';	
	
	//if (x==9)
	//str +='<div class="selects_items"><a href="/service/service_seal.php" ><img src="/images/v2/chameleon/toptag_12s.gif" alt="小玩意兒" title="小玩意兒" name="Image17" border="0" id="Image17" /></a></div>'; 
	//else
	//str +='<div class="selects_items"><a href="/service/service_seal.php" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image17\',\'\',\'/images/v2/chameleon/toptag_12over.gif\',1)"><img src="/images/v2/chameleon/toptag_12.gif" alt="小玩意兒" title="小玩意兒" name="Image17" border="0" id="Image17" /></a></div>';
	
	if (x==10)
	str +='<div class="selects_items"><a href="/lottery/" ><img src="/images/v2/chameleon/toptag_08s.gif" alt="獎勵" title="獎勵" name="Image16" border="0" id="Image16" /></a></div>';
	else
	str +='<div class="selects_items"><a href="/lottery/" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'toptag_08\',\'\',\'/images/v2/chameleon/toptag_08over.gif\',1)"><img src="/images/v2/chameleon/toptag_08.gif" alt="獎勵" title="獎勵" name="toptag_08" border="0" id="toptag_08" /></a></div>';
	if (z!=1)			
								str +='<div class="selects_items_btn"><a href="/cellphone/cellphone_step1.php"  onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'Image160\',\'\',\'/images/v2/addbtn/cellphone_btn_over.gif\',1)"><img src="/images/v2/addbtn/cellphone_btn.gif" name="Image159" alt="手機驗證" title="手機驗證" width="89" height="24" border="0" id="Image160" /></a></div>';
			 document.write(str);
}
*/
//-----------------------New Header end----------------------------------------------------------------------------------
//-----------------------Comment start -----------------//
function comment_pv(id)
{
	var ajax_url = '/cgi/comment_pv.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id,
		// Handle successful response
		onSuccess: function(t) {},
		// Handle other errors
		onFailure: function(t) {}
	}
	new Ajax.Request(ajax_url, opt);
}

function comment_extend(obj_btn, txt_id, labl_id)
{

	if (gid(txt_id))
	{
		var obj_c = gid(txt_id);
		var cid = txt_id.replace('comment', '');
		cid = parseInt(cid);
		
	var title_close = '<a href="#cmmmyextend'+cid+'" class="a37" onclick="comment_extend(this, \''+txt_id+'\', \''+labl_id+'\');" >點我 收起</a>';
	var title_open = '<a href="#cmmmyextend'+cid+'" class="a37" onclick="comment_extend(this, \''+txt_id+'\', \''+labl_id+'\');" >點我 展開 看全文</a>';
		
		if (obj_c.className=='to_close')
		{
			obj_btn.className ='DownBtn';
			obj_c.className='to_openup';
			gid(labl_id).innerHTML = title_open;
		}else
		{
			obj_btn.className ='UpBtn';
			obj_c.className='to_close';
			gid(labl_id).innerHTML = title_close;
			if (cid>0)
			{
				comment_pv(cid);
			}
		}
	}
}

function addCommentErrReport(id)
{
	var now_url = document.location.href;
	var next_url = encodeURIComponent(now_url);
	document.location.href = '/report/report_offense_cmm.php?id='+id+'&url='+next_url;
}

function addComment(sid, islogin, isOverCommentLimit)
{
	var sul = encodeURIComponent(document.location.pathname+document.location.search);
	var next_url = '/addcmm/choose_draft.php?id='+sid+'&d=A&sul='+sul;
	if (islogin=='0')
	{
		dialogLogin(next_url);
	}else
	{
		if (isOverCommentLimit=='0')
		{
			document.location.href = next_url;
		}else
		{
			alert("喔哦!!\n您今日的發表評論數已達上限囉!!");
		}
	}
}

function editComment(id)
{
	if (id>0)
	{
		var sul = encodeURIComponent(document.location.pathname+document.location.search);
		var next_url = '/addcmm/choose_draft.php?cid='+id+'&d=E&sul='+sul;
		document.location.href = next_url;
	}
}
//-----------------------Comment end -----------------//

//-----------------------Upload start -----------------//
function dialogUploadShopPicLoading(obj_frm)
{
	var notice_str = '<div class="addarea"><div class="lyaeriIcon"><div class="addfont">圖片上傳中!! <br />若上傳成功，待iPeen管理小組審查後即可顯示囉!!</div></div></div>';
	obj_frm.submit();
	DialogShowByData(notice_str,250,58);
	//setTimeout("DialogHide()",2500);
	//return false;
}

function dialogUploadShopPic(data_id)
{
	var now_url = document.location.href;
	var next_url = encodeURIComponent(now_url);
	var div_str = "";
	div_str = div_str +'<div class="addarea">';
	div_str = div_str +'<div class="lyaeriIcon">';
	div_str = div_str +'<div class="top_Subject">選擇照片：</div><br />';
	div_str = div_str +'<form name="tmp_shop_upload" id="tmp_shop_upload" method="post" enctype="multipart/form-data" method="post" action="/cgi/proc_shop_pic.php" >';
	div_str = div_str +'<div class="add_btn">';
	div_str = div_str +'<div class="select_photo"><input name="data_file" type="file" /></div>';
	div_str = div_str +'<label class="imp_notice">提醒您，請勿上傳違法圖片。</label>';
	div_str = div_str +'<div class="select_btn">';
	div_str = div_str +'<input name="data_id" type="hidden" id="data_id" value="'+data_id+'" /><input name="back_url" type="hidden" id="back_url" value="'+next_url+'" />'
	//div_str = div_str +'<input type="image" src="/images/btn/btn_sure.jpg" border="0" />';
	div_str = div_str +'<input type="button" name="tmp_btn_upload" style="background-image:url(/images/btn/btn_sure.jpg);height: 22px;width: 47px;border: 0px;background-repeat: no-repeat;cursor: pointer;" onclick="dialogUploadShopPicLoading(this.form);return false;" >';
	//div_str = div_str +'<a href="javascript:void(0);" onClick="DialogHide()"><img src="/images/btn/btn_cancel.jpg" border="0"/></a>';
	div_str = div_str +'<input type="button" name="tmp_btn_cancel" style="background-image:url(/images/btn/btn_cancel.jpg);height: 22px;width: 47px;border: 0px;background-repeat: no-repeat;cursor: pointer;" onclick="DialogHide()" >';
	div_str = div_str +'</div>';
	div_str = div_str +'</div>';
	div_str = div_str +'</form>';
	div_str = div_str +'</div>';
	div_str = div_str +'<div class="notice_area">																';
	div_str = div_str +'<div class="addfont">請注意，系統只接受JPG格式。</div>';
	div_str = div_str +'<div class="addfont">且每張相片大小不能超過5MB。</div>';
	div_str = div_str +'</div>';
	div_str = div_str +'</div>';
	
	return DialogShowByData(div_str,320,155);
}
//-----------------------Upload End -----------------//

//-----------------------Message start -----------------//
//-----------------------Message start -----------------//
function checkValidateCodeForGuest(obj_frm, obj_code)
{
	var val_code = StrCode(obj_code.value);
	var ajax_url = '/cgi/validatecode_chk_wlk.php';
	var opt = {
		method: 'post',
		postBody: 'page=group&code='+val_code,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else if (t.responseText=='OK')
			{
				if (obj_frm.cmmtCnt)
				{
					var str = '<div class="addarea"><div class="lyaeriIcon"><div class="addfont">上傳中，請稍候...</div></div></div>';
					DialogShowByData(str,250,30);
				}
				obj_frm.submit();	//check pass
			}else
			{
				alert('驗證碼錯誤！');//check fail
				obj_code.focus();
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('驗證碼錯誤！');//check fail
			obj_code.focus();
		},
        asynchronous:true, 
        evalScripts:true
	}
	var obj_ajax = new Ajax.Request(ajax_url, opt);
}
function checkValidateCode(obj_frm, obj_code)
{
	var val_code = StrCode(obj_code.value);
	var ajax_url = '/cgi/validatecode_chk.php';
	var opt = {
		method: 'post',
		postBody: 'page=group&code='+val_code,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else if (t.responseText=='OK')
			{
				if (obj_frm.cmmtCnt)
				{
					var str = '<div class="addarea"><div class="lyaeriIcon"><div class="addfont">上傳中，請稍候...</div></div></div>';
					DialogShowByData(str,250,30);
				}
				obj_frm.submit();	//check pass
			}else
			{
				alert('驗證碼錯誤！');//check fail
				obj_code.focus();
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('驗證碼錯誤！');//check fail
			obj_code.focus();
		},
        asynchronous:true, 
        evalScripts:true
	}
	var obj_ajax = new Ajax.Request(ajax_url, opt);
}
//-----------------------Message end -----------------//

//-----------------------Block start -----------------//
function dialogAddBlock(id)
{
	var ajax_url = '/cgi/userblock_add.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else
			{
				div_str = '<div class="addarea"><div class="lyaeriIcon"><div class="addfont">'+t.responseText+'</div></div></div>';
				DialogShowByData(div_str, 250,45);
				setTimeout("DialogHide()",2500);
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供加入服務！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
//-----------------------Block End -----------------//

//-----------------------shopErrReport start -----------------//

function chk_frm_shopreport(obj_frm)
{
	var result = true;
	if (obj_frm.acc_content.value=='')
	{
		obj_frm.acc_content.focus();
		alert('請輸入錯誤回報內容！');
	}else
	{
		senndShopErrReport(obj_frm);
	}
	return false;
}

function senndShopErrReport(obj_frm)
{
	var def_id = StrCode(obj_frm.def_id.value);
	var acc_content = StrCode(obj_frm.acc_content.value);
	var def_content = StrCode(obj_frm.def_content.value);
	var ajax_url = '/cgi/report_offense_prc.php';
	var opt = {
		method: 'post',
		postBody: 'def_id='+def_id+'&def_content='+def_content+'&acc_content='+acc_content,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else if (t.responseText=='OK')
			{
				alert("感謝您的回報！");
			}else
			{
				alert('抱歉!目前系統維護中，暫停加入錯誤回報服務！');
			}
			DialogHide();
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供加入錯誤回報服務！');
		}
	}
	var obj_ajax = new Ajax.Request(ajax_url, opt);
}

function addShopErrReport(sid, store_title, store_subname, user_nickname, islogin)
{
	if(islogin=='0')
	{
		return dialogLogin();
	}else
	{
		return dialogShopErrReport(sid, store_title, store_subname, user_nickname);
	}
}

function dialogShopErrReport(sid, store_title, store_subname, user_nickname)
{
	var str = '';
	var def_content="";
	if (store_subname!='')
	{
		def_content = store_title +"("+store_subname+")";
	}else
	{
		def_content = store_title;
	}
	str = str +'<div class="error_report">';
	str = str +'<form method="post" onsubmit="return chk_frm_shopreport(this);">';
	str = str +'	<div class="title">';
	str = str +'		<div class="layerFont">商家資訊錯誤回報</div>';
	str = str +'	</div>';
	str = str +'	<div class="TitleForm">';
	str = str +'		<div class="From">';
	str = str +'			<div class="TitleFormFont">商家名稱：</div>';
	str = str +'			<label class="NameFont">'+def_content+'<input name="def_content" type="hidden" value="店家名稱：'+def_content+'" /></label>';
	str = str +'		</div>';
	str = str +'		<div class="To">';
	str = str +'			<div class="TitleFormFont">錯誤回報者：</div>';
	str = str +'			<label class="NameFont">'+user_nickname+'</label>';
	str = str +'		</div>									';
	str = str +'		<div class="mail_content_font">錯誤回報內容</div>';
	str = str +'	</div>';
	str = str +'		<div class="MessageContent">';
	str = str +'			<textarea name="acc_content" cols="" rows="8" style="width:200px; "></textarea>';
	str = str +'		</div>';
	str = str +'	<div class="SendBtn">';
	str = str +'		<input name="def_id" type="hidden" value="'+sid+'" /><input name="btn_submit" type="submit" value="確定" />';
	str = str +'		<input name="btn_cancel" type="button" value="取消" onClick="DialogHide();" />';
	str = str +'	</div>';
	str = str +'</form>';
	str = str +'</div>';
	return DialogShowByData(str,250,350);
}
//-----------------------shopErrReport end -----------------//
//-----------------------Shopcard start -----------------//
function addAddress(sid, islogin)
{
	if (islogin)
		dialogAddShopcard(sid);
	else
		dialogLogin();

	return false;
}
function dialogAddShopcard(id)
{
	var ajax_url = '/cgi/shopcard_add.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else
			{
				div_str = '<div class="addarea"><div class="lyaeriIcon"><div class="addfont">'+t.responseText+'</div></div></div>';
				DialogShowByData(div_str, 250,45);
				setTimeout("DialogHide()",2500);
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供加入名片服務！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
//-----------------------Shopcard end -----------------//
function GBCheckValidateCode(obj_frm, obj_code)
{
	var val_code = StrCode(obj_code.value);
	var ajax_url = '/cgi/gb_validatecode_chk.php';
	var check_result = 2;
	var opt = {
		method: 'post',
		postBody: 'page=group&code='+val_code,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
				check_result=3;	//no login
			}else if (t.responseText=='OK')
			{
				//memberSendMsg(obj_frm);
				
				obj_frm.submit();	//check pass
			}else
			{
				alert('驗證碼錯誤！');//check fail
				obj_code.focus();
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('驗證碼錯誤！');//check fail
			obj_code.focus();
		},
        asynchronous:true, 
        evalScripts:true
	}
	var obj_ajax = new Ajax.Request(ajax_url, opt);
}
// ------------ member send msg start -----------------//
function memberCheckValidateCode(obj_frm, obj_code)
{
	var val_code = StrCode(obj_code.value);
	var ajax_url = '/cgi/validatecode_chk.php';
	var check_result = 2;
	var opt = {
		method: 'post',
		postBody: 'page=group&code='+val_code,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
				check_result=3;	//no login
			}else if (t.responseText=='OK')
			{
				memberSendMsg(obj_frm);
				
				//obj_frm.submit();	//check pass
			}else
			{
				alert('驗證碼錯誤！');//check fail
				obj_code.focus();
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('驗證碼錯誤！');//check fail
			obj_code.focus();
		},
        asynchronous:true, 
        evalScripts:true
	}
	var obj_ajax = new Ajax.Request(ajax_url, opt);
}


function memberSendMsg(objForm) {
	var msg_to_name = StrCode(objForm.msg_to_name.value);
	var msg_subject = StrCode(objForm.msg_subject.value);
	var msg_content = StrCode(objForm.msg_content.value);
	var ajax_url = '/cgi/send_msg_prc.php';
		var opt = {
			method: 'post',
			postBody:'msg_to_id='+objForm.msg_to_id.value+'&msg_to_name='+msg_to_name+'&msg_subject='+msg_subject+'&msg_content='+msg_content,
			// Handle successful response
			onSuccess: function(t) {
				if(t.responseText == 'OK') {
					DialogRemove();
				} else {
					DialogRemove();
					// ...
				}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停服務，請稍候再試！');
		}
	}
	new Ajax.Request(ajax_url, opt);
}

function dialogSendMsg(to_id,to_name,from_name)
{
    var sul = encodeURIComponent(document.location.pathname+document.location.search);
	DialogHide();	//close other dialog
	var div_str = '';
	var code_img = new Image();
	code_img.src = '/validatecode.php';
	div_str = div_str+'<div id="sendmail" >';
	div_str = div_str+'<form action="/cgi/send_msg_prc.php" name="msgform1" id="msgform1" enctype="multipart/form-data" method="post" onsubmit="return chk_frm_sendmsg(this);">';
	div_str = div_str+'<div class="mailbody">';
	div_str = div_str+'	<div class="title">';
	div_str = div_str+'		<div class="layerFont">發送訊息</div>';
	div_str = div_str+'	</div>';
	div_str = div_str+'	<div class="TitleForm">';
	div_str = div_str+'		<div class="From">';
	div_str = div_str+'			<div class="TitleFormFont">收件者：</div>';
	div_str = div_str+'				<label class="NameFont">'+to_name+'</label>';
	div_str = div_str+'				<input type="hidden" name="msg_to_id" value="'+to_id+'" />';
	div_str = div_str+'				<input type="hidden" name="msg_to_name" value="'+to_name+'" />';
	div_str = div_str+'				<input type="hidden" name="sul" value="'+sul+'" />';
	div_str = div_str+'			</div>';
	div_str = div_str+'		<div class="To">';
	div_str = div_str+'			<div class="TitleFormFont">寄件者：</div>';
	div_str = div_str+'				<label class="NameFont">'+from_name+'</label>';
	div_str = div_str+'			</div>';
	div_str = div_str+'		<div class="To">';
	div_str = div_str+'			<div class="TitleFormFont">主　旨：</div>';
	div_str = div_str+'				<div class="topicfont">';
	div_str = div_str+'					<input type="text" name="msg_subject" value="" size="" style="width:350px;"/>';
	div_str = div_str+'				</div>';
	div_str = div_str+'			</div>';
	div_str = div_str+'			<div class="mail_content_font">訊息內容：</div>';
	div_str = div_str+'		</div>';
	div_str = div_str+'		<div class="MessageContent">';
	div_str = div_str+'			<textarea name="msg_content" cols="" rows="8" style="width:420px; "></textarea>';
	div_str = div_str+'			<div class="ValidateArea">';
	div_str = div_str+'				<div id="reloadimg" style="margin-top:8px;"><img src="/validatecode.php" /></div>';
	div_str = div_str+'					<div class="verity_img" style="margin-top:8px;">請輸入上圖顯示數字：<input name="verity" type="text" maxlength="6" style="width:100px;" value="" size="" />';
	div_str = div_str+'						<a  onclick="reloadimg();" border="1"><input name="re" type="button" value="重新取得認證碼"/></a></div>';
	div_str = div_str+'				</div>';
	div_str = div_str+'			</div>';
	div_str = div_str+'			<div class="SendBtn">';
	div_str = div_str+'	 			<input id="sentbtn" name="sentbtn" type="image" src="/images/btn/btn_send.jpg" onmouseover="this.src=\'/images/btn/btn_send_over.jpg\';" onmouseout="this.src=\'/images/btn/btn_send.jpg\';" />';
	div_str = div_str+'				<img id="sentcancelbtn" name="sentcancelbtn" src="/images/btn/btn_cancel.jpg" border="0" ';
	div_str = div_str+'				 onclick="DialogRemove();" class="change_to_hand_show" onmouseover="this.src=\'/images/btn/btn_cancel_over.jpg\';" onmouseout="this.src=\'/images/btn/btn_cancel.jpg\';" />';
	div_str = div_str+'			</div>';
	div_str = div_str+'		</div>';
	div_str = div_str+'	</form>';
	div_str = div_str+'</div>';
	return DialogShowByData(div_str, 515,443);
}
// ------------ member send msg end -------------------// 
//-----------------------Friend start -----------------//
function dialogAddFriend(id)
{
	var ajax_url = '/cgi/friend_add.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else
			{
				div_str = '<div class="addarea"><div class="lyaeriIcon"><div class="addfont">'+t.responseText+'</div></div></div>';
				DialogShowByData(div_str, 250,40);
				setTimeout("DialogHide()",2500);
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供加入好友服務！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
function JQAddFriend(id){
	$.ajax({
		url		: '/cgi/friend_add.php',
		data	: { id : id },
		dataType: 'text', type	: 'POST',
		success: function(res){	
			if(res == 'NOLOGIN'){
				dialogLogin();
			}else{ alert(res); }
		}
	});
}
//-----------------------Friend end -----------------//

//-----------------------review start -----------------//
function dialogCommentReview(id, review, div_review)
{
	
	var ajax_url = '/cgi/proc_comment_review.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id+'&r='+review,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else if (t.responseText=='OK')
			{
				if (document.getElementById(div_review))
				{
				   cmm_update_pushdata(div_review , 'cmm_read_finger_number'  , review , id);

				}
			}else
			{
				if (t.responseText!=''){alert(t.responseText);}
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供加入好友服務！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}

function cmm_update_pushdata(nurl , type  , review , id)
{
	if(type == '' ) return false;
     
	var msg_no='<img src="/images/comment/bad.jpg" />';
	var msg_yes='<img src="/images/comment/good.jpg" />';
	var msg_normal='<img src="/images/comment/normalhart.jpg" />';
	
	increase_pushed_value_cb = function(type , data_block , msg_pic, msg_value , id)
	{
		
		type = type ? type : '';
		pushed_value_block = data_block.find("."+type);
		pushed_value = parseInt(pushed_value_block.html().strip()) ;
		pushed_value_block_good = data_block.find(".cmm_read_mark");
		pushed_value_good = pushed_value_block_good.html().strip() ;
		if(msg_value == 'Y' ) pushed_value = pushed_value + 1 ;
		
		var str= '';
	    str +='<div class="read_cmm_finger_complete">';
	    str +='<label class="your_finger">您的評價：'+msg_pic+'&nbsp;&nbsp;</label>，';
	    str +='此文共有：';
	    if(pushed_value > 0) {
        str +='<label class="cmm_read_finger_number"><a href="/comment/comment_useful.php?id='+id+'" class="a38" target="_blank">'+pushed_value+'</a></label>';
        } else str +='<label class="cmm_read_finger_number">'+pushed_value+'</label>';
        str +='人好評&nbsp;';
        str += pushed_value_good+'</div>';
       	data_block.html(str);
	}

	rls_block = $j("#"+nurl);
	if(review == 'y') {
	   increase_pushed_value_cb(type , rls_block , msg_yes , 'Y' , id);
	}else if(review == 'n') {
	   increase_pushed_value_cb(type , rls_block , msg_no , 'N' , id);
	}else if(review == 'r') {
	   increase_pushed_value_cb(type , rls_block , msg_normal , 'N' , id);
	}
}


//-----------------------review end -----------------//

//-----------------------bang start -----------------//
function dialogBangReview(id,  div_review ,nurl)
{
	var nurl="candy"+nurl;
	var msg_yes='<div class="Evaluated"><div class="Evaluated_Font">已經送給他囉!你目前還有枝棒棒糖</div></div>';
	var ajax_url = '/cgi/proc_comment_bang.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN') {
			      dialogLogin();
			}
			else if (t.responseText=='NOBANG') {
			
				  if (confirm('你目前沒有棒棒糖可以送人喔! 要知道怎麼取得嗎?') ) 
				  window.open('/announcement/announcement_content.php?id=99') ;
			}
			else if (t.responseText=='NOME') {
			    alert('喔喔~不能送給自己的文章棒棒糖喔~');
			}
			else if (t.responseText=='ALREADY') {
				alert('您已經送過這篇文章棒棒糖囉~');
			}
			else 
			  {
			    if (t.responseText!='' ){
			    alert(t.responseText);
				//document.location.href=nurl ;
				//Element.hide(nurl);
				bang_update_pushdata(nurl , 'now_candy_num');
				}
			  }
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供加入好友服務！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}

function bang_update_pushdata(nurl , type)
{
	if(type == '' ) return false;
	
	increase_pushed_value_cb = function(type , data_block)
	{
		type = type ? type : '';
		pushed_value_block = data_block.find("."+type);
		old_pushed_value = parseInt(pushed_value_block.html().strip()) ;
		pushed_value_block.html( old_pushed_value + 1 );	
	}

	// get the value of the pushed total, and increase it.
	rls_block = $j("#"+nurl);
	increase_pushed_value_cb(type , rls_block);
}


//-----------------------bang end -----------------//

// -- chg pwd************************************** -- //
function chgPasswd(objForm, msgDiv) {
	var oldpwd = StrCode(objForm.oldpwd.value);
	var newpwd = StrCode(objForm.newpwd.value);
	var cfmpwd = StrCode(objForm.cfmpwd.value);
	var ajax_url = '/cgi/my_info_edit_chgpwd_prc.php';
		var opt = {
			method: 'post',
			postBody: 'oldpwd='+oldpwd+'&newpwd='+newpwd+'&cfmpwd='+cfmpwd,
			// Handle successful response
			onSuccess: function(t) {		
					var objMsgDiv = gname(msgDiv);
					for(var i=0;i<objMsgDiv.length;i++) {
						objMsgDiv[i].innerHTML=t.responseText.split(":")[1];
					}
					if(t.responseText.split(":")[0] == '0') {
						setTimeout("DialogHide()",1500);
						setTimeout("clearErrMsg('chg_pwd_err_msg')",1500);
					}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停服務，請稍候再試！');
		}
	}
	new Ajax.Request(ajax_url, opt);
}
// -- chg pwd************************************** -- //
function chkForgetPasswd(obj_frm, obj_mail, obj_yr, obj_mn, obj_dy)
{
	var val_email = StrCode(obj_mail);
	var val_byr = StrCode(obj_yr);
	var val_bmn = StrCode(obj_mn);
	var val_bdy = StrCode(obj_dy);
	var ajax_url = '/cgi/forget_passwd_prc.php';
	var opt = {
		method: 'post',
		postBody: 'email='+val_email+'&byear='+val_byr+'&bmonth='+val_bmn+'&bday='+val_bdy,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='0') {
				//document.getElementById('ForgetPasswdBody').innerHTML ='信件已送出!!';
				alert('信件已送出');
				location.href = "/login/";
			} else {
				alert('查無此email的註冊資訊或您的email輸入不正確，請重新輸入');
			} 
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供服務!!');
		}
	}
	new Ajax.Request(ajax_url, opt);
}

// -- discountinfo review add by jb at 20070312
function dialogDiscountinfoReviewVIP(id, review, div_review)
{
	var msg_no='<div class="Evaluated_new"><div class="Evaluated_Font_new">您給予此篇&quot;無用&quot;</div></div>';
	var msg_yes='<div class="Evaluated_new"><div class="Evaluated_Font_new">您給予此篇&quot;有用&quot;</div></div>';
	var msg_normal='<div class="Evaluated_new"><div class="Evaluated_Font_new">您給予此篇&quot;普通&quot;</div></div>';
	var ajax_url = '/cgi/proc_discountinfo_review_vip.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id+'&r='+review,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else if (t.responseText=='OK')
			{
				if (document.getElementById(div_review))
				{
					if (review=='y')
					{
						document.getElementById(div_review).innerHTML = msg_yes;
					}else if (review=='n')
					{
						document.getElementById(div_review).innerHTML = msg_no;
					}else if (review=='r')
					{
						document.getElementById(div_review).innerHTML = msg_normal;
					}
				}
			}else
			{
				if (t.responseText!=''){alert(t.responseText);}
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供加入好友服務！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
function dialogDiscountinfoReview(id, review, div_review)
{
	var msg_no='<div class="Evaluated_new"><div class="Evaluated_Font_new">您給予此篇&quot;無用&quot;</div></div>';
	var msg_yes='<div class="Evaluated_new"><div class="Evaluated_Font_new">您給予此篇&quot;有用&quot;</div></div>';
	var msg_normal='<div class="Evaluated_new"><div class="Evaluated_Font_new">您給予此篇&quot;普通&quot;</div></div>';
	var ajax_url = '/cgi/proc_discountinfo_review.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id+'&r='+review,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else if (t.responseText=='OK')
			{
				if (document.getElementById(div_review))
				{
					if (review=='y')
					{
						document.getElementById(div_review).innerHTML = msg_yes;
					}else if (review=='n')
					{
						document.getElementById(div_review).innerHTML = msg_no;
					}else if (review=='r')
					{
						document.getElementById(div_review).innerHTML = msg_normal;
					}
				}
			}else
			{
				if (t.responseText!=''){alert(t.responseText);}
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供加入好友服務！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
// add by jb at 20070313 1228
function check_UserNickname(form_id, obj_nick_name,pop_pass, pop_nopass, pop_empty)
{
	var msg_pass = '恭喜你， '+obj_nick_name.value+' 此暱稱尚無人使用呢!';
	var msg_nopass = '喔哦! 你使用的暱稱 '+obj_nick_name.value+' 重複囉，換一個更響亮的吧!';
	var msg_empty = '請勿填入空白字元或非法字元!';
	var ajax_url = '/cgi/check_nick_name_prc.php';
	var opt = {
		method: 'post',
		postBody: 'nickname='+obj_nick_name.value,                                
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='YES')
			{	
				if(pop_pass =='Y') {
					alert(msg_pass);
				}
				if(pop_pass =='N') {
					document.getElementById(form_id).submit();
				}
			}else if (t.responseText=='NO')
			{
				if(pop_nopass =='Y') {
					alert(msg_nopass);
				}
				obj_nick_name.focus();
			}else if (t.responseText=='EMPTY')
			{
				if(pop_empty =='Y') {
					alert(msg_empty);
				}
				obj_nick_name.focus();
			}else
			{
				if (t.responseText!=''){alert(t.responseText);}
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
function check_MyInfoUserNickname(form_id, obj_nick_name,pop_pass, pop_nopass, pop_empty)
{
	var msg_pass = '恭喜你， '+obj_nick_name.value+' 此暱稱尚無人使用呢!';
	var msg_nopass = '喔哦! 你使用的暱稱 '+obj_nick_name.value+' 重複囉，換一個更響亮的吧!';
	var msg_empty = '請勿填入空白字元或非法字元!';
	var ajax_url = '/cgi/check_myinfo_nick_name_prc.php';
	var opt = {
		method: 'post',
		postBody: 'nickname='+obj_nick_name.value,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='YES')
			{	
				if(pop_pass =='Y') {
					alert(msg_pass);
				}
				if(pop_pass =='N') {
					document.getElementById(form_id).submit();
				}
			}else if (t.responseText=='NO')
			{
				if(pop_nopass =='Y') {
					alert(msg_nopass);
				}
				obj_nick_name.focus();
			}else if (t.responseText=='EMPTY')
			{
				if(pop_empty =='Y') {
					alert(msg_empty);
				}
				obj_nick_name.focus();
			}else
			{
				if (t.responseText!=''){alert(t.responseText);}
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
//--------------------------------------------------------
function check_DiscountinfoValidateCode(obj_frm, obj_code, obj_url)
{
	var val_code = StrCode(obj_code.value);
	var ajax_url = '/cgi/validatecode_chk.php';
	var opt = {
		method: 'post',
		postBody: 'code='+val_code,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else if (t.responseText=='OK')
			{
				if(obj_url.value.length > 0 && obj_url.value!='http://') {
					check_DiscountinfoWebUrl(obj_frm, obj_url);
				} else {
					obj_frm.submit();	//check pass
				}
			}else
			{
				alert('驗證碼錯誤！');//check fail
				obj_code.focus();
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('驗證碼錯誤！');//check fail
			obj_code.focus();
		},
        asynchronous:true, 
        evalScripts:true
	}
	var obj_ajax = new Ajax.Request(ajax_url, opt);
}

function check_DiscountinfoWebUrl(obj_frm, obj_url)
{
	var msg_nopass = '喔哦! 此好康相關網址已有人新增過囉!';
	var ajax_url = '/cgi/proc_chk_dis_url.php';
	var opt = {
		method: 'post',
		postBody: 'dis_webtitle='+encodeURIComponent(obj_url.value),
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOPASS')
			{
				alert(msg_nopass);
			} else {
				obj_frm.submit();
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}

// ----
function check_ClickDiscountinfoWebUrl(obj_url)
{
	var msg_nopass = '喔哦！此好康相關網址已有人新增過囉！！';
	var msg_pass = '喔耶！！此好康相關網址未刊登！';
	var ajax_url = '/cgi/proc_chk_dis_url.php';
	var opt = {
		method: 'post',
		postBody: 'dis_webtitle='+encodeURIComponent(obj_url.value),
		// Handle successful response
		onSuccess: function(t) {
			
			if (t.responseText=='NOPASS')
			{
				alert(msg_nopass);
			} else if(t.responseText=='PASS'){
				alert(msg_pass);
			} else {
				//
//				alert(t.responseText);
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
//-----------------------TraceBid start -----------------//
function addBidTrace(id)
{
	var unick = getCookie('unick');
	if (unick=="")
		dialogLogin();
	else
		dialogAddBidTrace(id);

	return false;
}
function rdAddBidTrace()
{
	document.location.href="/myinfo/autrack.php";
}
function dialogAddBidTrace(id)
{
	var ajax_url = '/cgi/bid_add.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else
			{
				div_str = '<div class="addarea"><div class="lyaeriIcon"><div class="addfont">成功加入追蹤清單</div></div></div>';
				DialogShowByData(div_str, 250,45);
				setTimeout("rdAddBidTrace()",3000);
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供服務！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
//-----------------------TrackBid end -----------------//
//-----------------------TraceLottery start -----------------//
function addLotteryTrace(id)
{
	var unick = getCookie('unick');
	if (unick=="")
		dialogLogin();
	else
		dialogAddLotteryTrace(id);

	return false;
}
function rdAddLotteryTrace()
{
	document.location.href="/myinfo/lottery_track.php";
}
function dialogAddLotteryTrace(id)
{
	var ajax_url = '/lottery/proc_track.php';
	var div_str = '';
	var opt = {
		method: 'post',
		postBody: 'id='+id,
		// Handle successful response
		onSuccess: function(t) {
			if (t.responseText=='NOLOGIN')
			{
				dialogLogin();
			}else
			{
				div_str = '<div class="addarea"><div class="lyaeriIcon"><div class="addfont">成功加入追蹤清單</div></div></div>';
				DialogShowByData(div_str, 250,45);
				setTimeout("rdAddLotteryTrace()",3000);
			}
		},
		// Handle other errors
		onFailure: function(t) {
			alert('抱歉!目前系統維護中，暫停提供服務！');
		}
	}
	new Ajax.Request(ajax_url, opt);
	return false;
}
//-----------------------TrackLottery end -----------------//
var infoIsOpen = 0;
var bodyHitAdd =0;
function showhdQuick(){
	document.getElementById('hdQuick').className='hdQuick';
	document.getElementById('hdArrow').className='hdSlide selected';
	infoIsOpen = 1;
	add=1;
}
function quickClose(){
	document.getElementById('hdQuick').className='hdQuick hide';
	document.getElementById('hdArrow').className='hdSlide';
	infoIsOpen =0;
}
function bodyhit(){
	if(infoIsOpen!=1){
	}else{
		document.getElementById('hdQuick').className='hdQuick hide';
		document.getElementById('hdArrow').className='hdSlide';
	}
}
