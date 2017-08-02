/* script actions for shop v3 */
(function ($, ipeen) {

    /**
     * 首頁多媒體資訊版位
     */
    ipeen.register('#shop-richmedia', function (data) {

        var shopLatLng,
            photoTimerId,
            tabInstance,
            tabOptions,
            videoPreviewSource;

        if (data.lat > 0 && data.lng > 0) {
            shopLatLng = new google.maps.LatLng(data.lat, data.lng);
        }

        tabOptions = {

            'enter #s-video': function (box) {
                var image = box.find('img'),
                    description = box.find('.description'),
                    play = box.find('.play');

                loadImage();
                observeClick();

                function loadImage() {

                    videoPreviewSource = image.attr('src');
                    image.attr('src', '').on('load', onload).attr('src', videoPreviewSource);
                    box.addClass('loading');

                    function onload() {
                        var boxWidth = box.width(),
                            boxHeight = box.height(),
                            boxRatio = boxWidth / boxHeight,
                            width = this.naturalWidth || this.width || 1,
                            height = this.naturalHeight || this.height || 1,
                            ratio = width / height,
                            css = {
                                position: 'absolute'
                            };

                        if (boxRatio > ratio) {
                            // portrait
                            css.width = boxWidth;
                            css.height = boxWidth / ratio;
                            css.top = -( css.height - boxHeight ) / 2;
                            css.left = 0;

                        } else {
                            // landscape
                            css.height = boxHeight;
                            css.width = boxHeight * ratio;
                            css.left = -( css.width - boxWidth ) / 2;
                            css.top = 0;
                        }


                        image.css(css);
                        image.hide().removeClass('invisible').fadeIn();
                        box.removeClass('loading');
                    }
                }

                function observeClick() {
                    var pattern = "<iframe src=\"http://www.youtube.com/embed/%VIDEOID%?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>";
                    image.on('click', function () {
                        var html = pattern.replace("%VIDEOID%", box.data('videoid'));
                        box.find('.video').html(html);
                        description.hide();
                        play.hide();
                    });
                    play.on('click', function () {
                        image.trigger('click');
                    })
                }

            },

            'leave #s-video': function (box) {
                box.find('.video').html($('<img>').attr('src', videoPreviewSource));
                box.find('.description').show();
                box.find('.play').show();
            },

            'enter #s-photo': function (box) {
                var node = {},
                    lib = data.images,

                    loadIndex = 0,
                    currentIndex = false,

                    boxWidth = 1,
                    boxHeight = 1,
                    boxRatio = 1,

                    interval = 5000,
                    total = lib.length,
                    binding = false
                statusLib = [];

                prepare();
                return;

                function prepare() {
                    node.root = box.empty().addClass('loading');
                    node.ul = $('<ul>').appendTo(node.root);
                    node.text = $('<div class="description">').appendTo(node.root);

                    if (data.is_vip == 0) {
                        node.vip = $('<a>').addClass('button red buyvip ga_tracking').attr({
                            'href': '/public/index.php?id=fcda3202f01892b520d593d0cbf005f0',
                            'target': '_blank',
                            'data-category': 'WEB_shop_boss',
                            'data-action': 'wall_iamboss_photo',
                            'data-label': '看板左上角：我是老闆，上傳店家照片',
                        }).html('我是老闆，上傳店家照片').appendTo(node.root);
                    }

                    boxWidth = box.width();
                    boxHeight = box.height();
                    boxRatio = boxWidth / boxHeight;

                    lib.length.times(function (i) {
                        $('<li>').appendTo(node.ul).addClass('invisible');
                        statusLib[i] = false;
                    });

                    node.items = node.ul.find('li');
                    loadNextImage();
                }

                function loadNextImage() {
                    if (loadIndex === total) {
                        return;
                    }
                    $('<img>').on('load', loaded.curry(loadIndex)).appendTo(item(loadIndex)).attr('src', lib[loadIndex]['img']);
                }

                function loaded(i) {
                    var width = this.naturalWidth || this.width || 1,
                        height = this.naturalHeight || this.height || 1,
                        ratio = width / height,
                        diff = Math.abs(boxRatio - ratio) / boxRatio,
                        image = $(this),
                        css = {
                            position: 'absolute'
                        };

                    function originMode() {
                        image.wrap('<div class="origin">');
                    }

                    function fitMode() {
                        if (boxWidth > width && boxHeight > height) {
                            originMode();
                            return;

                        } else if (boxRatio > ratio) {
                            // portrait
                            css.width = boxWidth;
                            css.height = boxWidth / ratio;
                            css.top = -( css.height - boxHeight ) / 2;
                            css.left = 0;

                        } else {
                            // landscape
                            css.height = boxHeight;
                            css.width = boxHeight * ratio;
                            css.left = -( css.width - boxWidth ) / 2;
                            css.top = 0;
                        }

                        image.css(css);
                    }

                    function adjustMode() {
                        if (boxWidth > width && boxHeight > height) {
                            originMode();
                            return;

                        } else if (boxRatio > ratio) {
                            // portrait
                            css.height = boxHeight * 1.2;
                            css.width = css.height * ratio;

                        } else {
                            // landscape
                            css.width = boxWidth * 1.2;
                            css.height = css.width / ratio;

                        }

                        css.left = ( boxWidth - css.width ) / 2;
                        css.top = ( boxHeight - css.height ) / 2;
                        image.css(css);
                    }

                    // resize & position image
                    if (diff < 0.2) {
                        // fit mode
                        fitMode();
                    } else if (diff > 0.5) {
                        // adjust mode
                        adjustMode();
                    } else {
                        // origin mode
                        originMode();
                    }

                    statusLib[i] = true;
                    item(i).hide().removeClass('invisible');

                    if (binding) {
                        binding = false;
                        play(i);
                    }
                    if (i === 0) {
                        node.root.removeClass('loading');
                        play(i);
                    }
                    loadIndex++;
                    loadNextImage();
                }

                function play(i) {
                    var nextIndex;

                    if (statusLib[i] === false) {
                        binding = true;
                        return;
                    }

                    if (currentIndex !== false) {
                        item(currentIndex).fadeOut();
                    }

                    item(i).fadeIn();
                    node.text.html(lib[i].text || "");

                    currentIndex = i++;
                    nextIndex = i;
                    if (nextIndex === total) {
                        nextIndex = 0;
                    }
                    if (total !== 1) {
                        slideShowTimerId = play.curry(nextIndex).delay(interval);
                    }
                }

                function item(index) {
                    return node.items.eq(index);
                }

            },

            'leave #s-photo': function (box) {
                clearTimeout(photoTimerId);
                box.empty();
            },

            'enter #s-map': function me(box) {
                var map,
                    mapOptions,
                    marker,
                    markerOptions,
                    newMarker,
                    newMarkerOptions,
                    newShopLatLng,
                    currentMarker,
                    grayMarker,
                    bounds,
                    node = {};


                if (me.initialized) {
                    box.siblings("#map-report").show();
                    return;
                }
                me.initialized = true;
                node.parent = box.parent();
                node.reportMap = $("<div id='map-report'>").html('<a href="/map_error/index.php?id=' + data.sid + '" class="button">地圖錯誤回報</a>').appendTo(node.parent).show();
                // start

                // create map
                mapOptions = {
                    scrollwheel: false,
                    center: shopLatLng,
                    zoom: 15,
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById('s-map'), mapOptions);


                // create marker
                markerOptions = {
                    position: shopLatLng,
                    map: map
                };
                currentMarker = new google.maps.MarkerImage(
                    "/images/v2/new_map/marker.png",
                    new google.maps.Size(27, 40),
                    new google.maps.Point(59, 0),
                    new google.maps.Point(13.5, 40),
                    new google.maps.Size(154, 48));

                if (!shopMoved()) {

                    markerOptions.icon = currentMarker;
                    marker = new google.maps.Marker(markerOptions);

                } else {

                    newShopLatLng = new google.maps.LatLng(data.new_lat, data.new_lng);
                    grayMarker = new google.maps.MarkerImage(
                        "/images/v2/new_map/marker.png",
                        new google.maps.Size(14, 21),
                        new google.maps.Point(28, 0),
                        new google.maps.Point(7, 21),
                        new google.maps.Size(154, 48));
                    newMarkerOptions = {
                        position: newShopLatLng,
                        title: "店家新址",
                        map: map
                    };
                    newMarkerOptions.icon = currentMarker;
                    markerOptions.icon = grayMarker;
                    markerOptions.title = "店家舊址";
                    marker = new google.maps.Marker(markerOptions);

                    newMarker = new google.maps.Marker(newMarkerOptions);

                    bounds = new google.maps.LatLngBounds(
                        new google.maps.LatLng(Math.min(data.lat, data.new_lat), Math.min(data.lng, data.new_lng)),
                        new google.maps.LatLng(Math.max(data.lat, data.new_lat), Math.max(data.lng, data.new_lng)));

                    map.fitBounds(bounds);

                    // direction
                    // service
                    var service = new google.maps.DirectionsService();

                    // renderer
                    var renderer = new google.maps.DirectionsRenderer({
                        suppressMarkers: true,
                        draggable: true
                    });

                    var request = {
                        origin: shopLatLng,
                        destination: newShopLatLng,
                        travelMode: 'WALKING'
                    };
                    renderer.setMap(map);

                    service.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            renderer.setDirections(response);
                        } else {
                            renderer.setMap(null);
                        }
                    });
                }

                return;
                function shopMoved() {
                    return data.moved && data.new_lat && data.new_lng;
                }
            },
            'leave #s-map': function (box) {
                box.siblings("#map-report").hide();
            },
            'enter #s-streetview': function me() {
                if (me.initialized) {
                    return;
                }
                me.initialized = true;
                new google.maps.StreetViewPanorama(
                    document.getElementById('s-streetview'), {
                        position: shopLatLng
                    });
            },
            'enter #s-staticmap': function (box) {
                box.hide().fadeIn();
            },

        };

        tabInstance = new ipeen.Class.Tab('#shop-richmedia', tabOptions);

        (function () {
            function reset() {
                var id = tabInstance.getCurrentBoxId();
                (tabOptions['leave ' + id] || $.noop)($(id));
                (tabOptions['enter ' + id] || $.noop)($(id));
            }

            ipeen.on('compactin', reset);
            ipeen.on('cozyin', reset);
        }).defer();

    });


    /**
     * 首頁店家資訊（營業時間）過長
     */
    ipeen.register('shop info long description', function () {
        $('#big-glance .info').find('.no-break').each(function () {
            var root = $(this).next(),
                span = root.find('span');
            if (span.width() > root.width()) {
                root.addClass('overflow');
            }
        });
    });


    /**
     * 首頁店家簡介高度計算
     * 導購顯示
     */
    ipeen.register('shop summary fix height', function (data) {
        var node = {},
            rowHeight,
            summaryHeight,
            summaryMarginBottom,
            otherHeight,
            titleHeight,
            benefitHeight,
            infoHeight,
            adjustHeight,
            hasGuide = false,
            isShowGuideDetail = false,
            guideHeight = 120,
            is_vip = data.is_vip,
            sid = data.sid,
            show_precise = data.show_precise,
            shop_guide,
            ambiguous_guide,
            benefitIsShowed,
            is_show,
            tmpBenefitHeight,
            minBenefitHeight,
            maxBenefitHeight;


        $.ajax({
            type: 'GET',
            url: "http://partner.ipeen.com.tw/purchase_directing/data/retrieve",
            data: {
                source: "shop",
                s_id: sid,
                fuzzy_mode: is_vip,
                fuzzy_count: 4,
                precise_mode: show_precise,
                golden_mode: is_vip,
                source_id: sid
            },
            dataType: "jsonp",
            jsonpCallback: 'voucherCallback',
            success: success
        });

        function success(data) {
            shop_guide = data.precise;
            ambiguous_guide = data.fuzzy;
            golden_guide = data.golden;
            //顯示導購 首頁
            if (shop_guide.length > 0) {
                prepareGuide();
                guideOnTopBar();
                hasGuide = true;
                isShowGuideDetail = true;
            }

            //非VIP店家才有模糊導購
            if (is_vip !== "1" && ambiguous_guide.length > 0) {
                showBottomAmbiguousGuide();
            }

            //非vip店家且沒有精準 才有黃金板位
            if (is_vip !== "1" && shop_guide.length <= 0) {
                showGoldenGuide();
            }
        }

        node.root = $('#shop-summary');
        node.summary = node.root.find('.summary');
        node.benefitList = node.root.find('.benefitList');
        node.title = node.root.find('h2');
        node.benefit = node.root.find('.benefit-list');
        node.other = node.root.find('.other-info');

        node.middleGuide = $(".shop-guide");
        node.bottomGuide = $(".shop-guide-bottom");

        node.goldenGuide = $(".discount-guide-gold-container");

        // rowHeight = node.root.height();
        rowHeight = 360;
        summaryHeight = node.summary.height();
        summaryMarginBottom = parseInt(node.summary.css('marginBottom'), 10);
        titleHeight = parseInt(node.title.height(), 10) + parseInt(node.title.css('marginBottom'), 10) + parseInt(node.title.css('marginTop'), 10);
        otherHeight = parseInt(node.other.height(), 10);
        minBenefitHeight = 139;
        maxBenefitHeight = parseInt(node.benefit.height(), 10);

        checkAndResizeRightBlock();

        // 統一調整右側資訊
        function checkAndResizeRightBlock() {
            updateHeight();
            if (maxBenefitHeight >= minBenefitHeight) {
                if (!node.benefitBtn) {
                    benefitIsShowed = false;
                    node.benefitBtn = $('<a>').addClass('moreBenefit').attr('href', '#').html("<span>展開全部</span>").appendTo(node.benefitList);
                    node.benefit.height(minBenefitHeight);
                } else {
                    //refresh event
                    node.benefitList.off('click', '.moreBenefit');
                }
                attachBenefitMoreBtn();
            } else if (node.benefitBtn) {
                detachBenefitMoreBtn();
                node.benefit.height(maxBenefitHeight);
            }

            updateHeight();
            if (summaryHeight + infoHeight > rowHeight) {
                if (!node.innerWrapper) {
                    node.summary.html("<div class=\"summary-inner-wrapper\">" + node.summary.html() + "</div>");
                    node.innerWrapper = node.summary.find('.summary-inner-wrapper');
                    node.root.addClass('overflow');
                }
                node.innerWrapper.height(Math.max(0, adjustHeight));
                if (!node.button) {
                    attachSummaryMoreBtn();
                }
                is_show = false;
                node.root.find('.more').html("<span>展開全部</span>");
            } else if (node.button) {
                detachSummaryMoreBtn();
                node.innerWrapper.height(summaryHeight + 15);
            }
        }

        function attachBenefitMoreBtn() {
            node.benefitList.on('click', '.moreBenefit', function (event) {
                event.preventDefault();
                if (!benefitIsShowed) {
                    benefitIsShowed = true;
                    $(this).html("<span>收合</span>");
                    node.benefit.animate({
                        height: maxBenefitHeight
                    }, 500, 'easeOutQuart');
                    tmpBenefitHeight = maxBenefitHeight;
                } else {
                    benefitIsShowed = false;
                    $(this).html("<span>展開全部</span>");
                    node.benefit.animate({
                        height: minBenefitHeight
                    }, 500, 'easeOutQuart');
                    tmpBenefitHeight = minBenefitHeight;
                }
                checkAndResizeRightBlock();
            });
        }

        function detachBenefitMoreBtn() {
            node.benefitList.off('click', '.moreBenefit');
            node.benefitBtn.detach();
            node.benefitBtn.remove();
            node.benefitBtn = null;
        }

        function attachSummaryMoreBtn() {
            node.button = $('<a>').addClass('more').attr('href', '#').appendTo(node.summary);
            node.summary.on('click', '.more', function (event) {
                event.preventDefault();
                if (!is_show) {
                    is_show = true;
                    $(this).html("<span>收合</span>");
                    node.innerWrapper.animate({
                        height: summaryHeight + 15
                    }, 500, 'easeOutQuart');
                } else {
                    is_show = false;
                    $(this).html("<span>展開全部</span>");
                    node.innerWrapper.animate({
                        height: Math.max(0, adjustHeight)
                    }, 500, 'easeOutQuart');
                }
            });
        }

        function detachSummaryMoreBtn() {
            node.button.detach();
            node.button.remove();
            node.button = null;
            node.summary.off('click', '.more');
        }

        function updateHeight() {
            benefitHeight = parseInt(node.benefit.height(), 10) + parseInt(node.benefit.find('li:last-child').css('marginTop'), 10) + parseInt(node.benefit.find('li:last-child').css('marginBottom'), 10) || 0;
            benefitHeight = parseInt((tmpBenefitHeight > 0) ? tmpBenefitHeight : benefitHeight, 10);
            otherHeight = parseInt(node.other.height(), 10);
            infoHeight = titleHeight + otherHeight + benefitHeight;
            adjustHeight = rowHeight - summaryMarginBottom - infoHeight;
        }

        function prepareGuide() {
            shop_guide[0]['shop'] = escapeHtml(shop_guide[0]['shop']);
            var guide = "<li class='discount-guide-container'><a title='" + shop_guide[0]['shop'] + " 限時優惠' class='ga_tracking discount-guide' target='_blank' data-label='店家簡介上方：餐券展開整塊描述、圖片、立即購買的連結' data-action='introduction_buy_detail' data-category='WEB_shop_buy' href='" + shop_guide[0]['url'] + "'><span>限時優惠$" + shop_guide[0]['price'] + "元起<span class='sold-number'> / " + shop_guide[0]['num'] + "份已售</span><span class='buy-link'>&gt;&gt;立即購買</span></span><div class='discount-guide-content'><span class='close ga_tracking' data-label='店家簡介上方：餐券展開旁的XX' data-action='introduction_buy_delete' data-category='WEB_shop_buy'>X</span><div class='image'><img alt='" + shop_guide[0]['shop'] + " 限時優惠' src='" + shop_guide[0]['photo'] + "' class='landscape' style='margin-left:-27.92px;'></div><div class='infomation'><div class='headline'><span class='text' data-content='" + shop_guide[0]['desc'] + "' data-short='20' data-long='30'>" + shop_guide[0]['desc'] + "</span></div><div class='sales'><div class='price'><div class='sold'>" + shop_guide[0]['num'] + "份已販售</div><div><span class='percent'>" + shop_guide[0]['discount'] + "折<span class='original'>$" + shop_guide[0]['orig'] + "</span></span></div></div><div class='discount-price'>$" + shop_guide[0]['price'] + "</div><div class='action'> <span class='button'>立即購買</span> </div></div></div></div></a></li>";

            node.guide = $(guide).prependTo(node.benefit).hide();
            new Flexible_length(node.guide.find(".text"));
            node.guide.find(".close").on("click", closeGuide);

            hasGuide = true;
            isShowGuideDetail = true;

            //調整標題高度
            node.summary.find(".h1").addClass('hasBenefit');

            //替換破圖為預設圖
            //imageDetect($(guide).find('img'));
            showGuide();
            checkAndResizeRightBlock();
        }

        function showGuide() {
            node.guide.slideDown("fast", function () {
                var is_intro_removed = false;
                //顯示intro
                if ($.cookie('shop-introduction') !== "showed") {
                    var intro = "<div style='position:absolute;top:-30px;left:-360px;z-index:1;'><span class='close' style='position:absolute;top:210px;left:190px;z-index:2;display:block;width:120px;height:30px;cursor:pointer;'>&nbsp;</span><img src='/images/v2/shop/guide_intro.png' alt='新功能上線'></div>";
                    $(intro).appendTo(node.guide).find('.close').on('click', function (e) {
                        e.preventDefault();
                        $(e.currentTarget).parent().remove();
                        is_intro_removed = true;
                    });
                    $.cookie('shop-introduction', 'showed', {domain: 'ipeen.com.tw', path: '/'});
                } else {
                    is_intro_removed = true;
                }

                //info切換
                var info = "<div class='info-div' style='position:absolute;top:-30px;left:-360px;z-index:1;'><span class='close' style='position:absolute;top:200px;left:180px;z-index:2;display:block;width:120px;height:60px;cursor:pointer;'>&nbsp;</span><img src='/images/v2/shop/guide_intro.png' alt=''></div>";
                $(info).appendTo(node.guide).addClass('hide').find('.close').on('click', function (e) {
                    e.preventDefault();
                    $(e.currentTarget).parent().toggleClass('hide');
                });

                node.guide.hover(function () {
                    if (is_intro_removed) {
                        node.guide.find('.info-div').removeClass('hide');
                    }
                }, function () {
                    if (is_intro_removed) {
                        node.guide.find('.info-div').addClass('hide');
                    }
                });


            });

            node.benefit.addClass("show-guide");
            var guide = node.benefit.find(".discount-guide-container");
            guideHeight = parseInt((guide.height() > guideHeight)?guide.height():guideHeight, 10) + parseInt(guide.css('paddingTop'), 10) + parseInt(guide.css('paddingBottom'), 10);
            maxBenefitHeight = maxBenefitHeight + guideHeight;
            node.benefit.animate({
                height: minBenefitHeight
            }, 500, 'easeOutQuart');
        }

        function closeGuide(e) {
            e.preventDefault();
            node.guide.css("height", "auto");
            node.benefit.removeClass("show-guide");
            node.guide.find(".discount-guide-content").remove();
            isShowGuideDetail = false;

            maxBenefitHeight = maxBenefitHeight - guideHeight + 30;
            checkAndResizeRightBlock();
        }

        function guideOnTopBar() {
            node.topBarMeta = $(".top-bar .meta");
            node.headerMeta = $("#shop-header .info .meta");
            var shopGuideSticker = "<a class='mark shop-guide ga_tracking' target='_blank' href='" + shop_guide[0]['url'] + "' title='限時優惠$" + shop_guide[0]['price'] + "元起 / " + shop_guide[0]['num'] + "份已售' data-category='WEB_shop_buy' data-action='shopname_buy' data-label='店名右方的餐劵tag'>餐券</a>";
            $(shopGuideSticker).appendTo(node.topBarMeta).fadeIn(300);
            $(shopGuideSticker).appendTo(node.headerMeta).fadeIn(300);
        }

        //只顯示底部四則模糊導購
        function showBottomAmbiguousGuide() {
            if (ambiguous_guide.length <= 0) return;
            var numberOfGuide = (ambiguous_guide.length > 4) ? 4 : ambiguous_guide.length, bottom = "";
            for (var i = 0; i < numberOfGuide; i++) {
                var className = (i === (numberOfGuide - 1) && (i + 1) === 4) ? "last ga_tracking" : "ga_tracking", action = 'inexact_buy_up' + i, order = i + 1, label = '餐劵模糊比對模組(下方)_第' + order + '則';
                ambiguous_guide[i]['shop'] = escapeHtml(ambiguous_guide[i]['shop']);
                bottom += "<a href='" + ambiguous_guide[i]['url'] + "' target='_blank' class='" + className + "'' data-category='WEB_shop_buy' data-action='" + action + "' data-label='" + label + "' title='" + ambiguous_guide[i]['shop'] + " 限時優惠'><article><div class='image'><img alt='" + ambiguous_guide[i]['shop'] + " 限時優惠' src='" + ambiguous_guide[i]['photo'] + "' class='landscape' style=''></div><div class='info'><h5 class='discount-guide'>" + ambiguous_guide[i]['shop'] + " 限時優惠</h5><div class='sales'><div class='action'> <span class='button'>立即購買</span> </div><div class='discount-price'>$" + ambiguous_guide[i]['price'] + "</div><div class='price'><div class='sold'>" + ambiguous_guide[i]['num'] + "份已販售</div><div><span class='percent'>" + ambiguous_guide[i]['discount'] + "折 / <span class='original'>$" + ambiguous_guide[i]['orig'] + "</span></span></div></div></div></div></article></a>";
            }

            node.bottomGuide.append($(bottom)).slideDown(300);
            //底部導購高度調整
            var bObj = node.bottomGuide.find(".discount-guide"), bObjNum = bObj.length;
            var bHeight = 0;
            for (var j = 0; j < bObjNum; j++) {
                var temp = bObj.eq(j).height();
                if (temp > bHeight) {
                    bHeight = temp;
                }
            }
            bObj.each(function () {
                $(this).height(bHeight);
            });

            //替換破圖為預設圖
            // imageDetect(node.middleGuide.find('img'));
            // imageDetectBottom(node.bottomGuide.find('img'));
            //顯示intro
            if ($.cookie('shop-introduction-bottom') !== "showed") {
                node.bottomGuide.find('.tagAction').addClass('hide');
                var intro = "<div style='position:absolute;top:-300px;left:60%;z-index:1;'><span class='close' style='position:absolute;top:255px;left:180px;z-index:101;display:block;width:140px;height:30px;cursor:pointer;'>&nbsp;</span><img src='/images/v2/shop/guide_intro_b.png' alt='新功能上線'></div>";
                $(intro).appendTo(node.bottomGuide).find('.close').on('click', function (e) {
                    e.preventDefault();
                    $(e.currentTarget).parent().remove();
                    node.bottomGuide.find('.tagAction').removeClass('hide');
                });
                node.bottomGuide.find('.tagAction').addClass("hide");
                $.cookie('shop-introduction-bottom', 'showed', {domain: 'ipeen.com.tw', path: '/'});
            }
            //info切換
            var info = "<div class='info-div' style='position:absolute;top:-300px;left:60%;z-index:1;'><span class='close' style='position:absolute;top:250px;right:70px;z-index:101;display:block;width:160px;height:40px;cursor:pointer;'>&nbsp;</span><img src='/images/v2/shop/guide_intro_b.png' alt=''></div>";
            $(info).appendTo(node.bottomGuide).addClass('hide').find('.close').on('click', function (e) {
                e.preventDefault();
                $(e.currentTarget).parent().toggleClass('hide');
                node.bottomGuide.find('.tagAction').removeClass('hide');
            });
            node.bottomGuide.find('.tagAction').on('click', function (e) {
                e.preventDefault();
                $(this).addClass('hide');
                node.bottomGuide.find('.info-div').toggleClass('hide');
            });
        }


        //顯示中間和底部的模糊導購
        function showMiddleBottomAmbiguousGuide() {
            if (ambiguous_guide.length <= 0) return;
            var numberOfGuide = (ambiguous_guide.length > 6) ? 6 : ambiguous_guide.length, middle = "", bottom = "";

            if (numberOfGuide < 2) {
                ambiguous_guide[0]['shop'] = escapeHtml(ambiguous_guide[0]['shop']);
                bottom = "<a href='" + ambiguous_guide[0]['url'] + "' target='_blank' class='ga_tracking' data-category='WEB_shop_buy' data-action='inexact_buy_down0' data-label='餐劵模糊比對模組(下方)_第1則'><article><div class='image'><img title='" + ambiguous_guide[0]['url'] + "' alt='" + ambiguous_guide[0]['shop'] + "' src='" + ambiguous_guide[0]['photo'] + "' class='landscape' style=''></div><div class='info'><h5 class='discount-guide'>" + ambiguous_guide[0]['shop'] + " 限時優惠</h5><div class='sales'><div class='action'> <span class='button'>立即購買</span> </div><div class='discount-price'>$" + ambiguous_guide[0]['price'] + "</div><div class='price'><div class='sold'>" + ambiguous_guide[0]['num'] + "份已販售</div><div><span class='percent'>" + ambiguous_guide[0]['discount'] + "折 / <span class='original'>$" + ambiguous_guide[0]['orig'] + "</span></span></div></div></div></div></article></a>";
                node.bottomGuide.append($(bottom)).slideDown(300);
            } else {
                for (var i = 0; i < numberOfGuide; i++) {
                    ambiguous_guide[i]['shop'] = escapeHtml(ambiguous_guide[i]['shop']);
                    if (i < 2) {
                        var className = (i === 0) ? " class='left'" : "", action = 'inexact_buy_up' + i, order = i + 1, label = '餐劵模糊比對模組(上方)_第' + order + '則';
                        middle += "<a href='" + ambiguous_guide[i]['url'] + "' target='_blank' class='ga_tracking' data-category='WEB_shop_buy' data-action='" + action + "' data-label='" + label + "' title='" + ambiguous_guide[i]['shop'] + "'><article" + className + "><div class='image'><img title='" + ambiguous_guide[i]['shop'] + "' alt='" + ambiguous_guide[i]['shop'] + "' src='" + ambiguous_guide[i]['photo'] + "' class='landscape' style='margin-left:-117.865px;'></div><div class='info'><h5 class='discount-guide'>限時優惠 " + ambiguous_guide[i]['discount'] + "折</h5><div class='tagline'><span class='text' data-content='" + ambiguous_guide[i]['desc'] + "' data-short='25' data-long='40'>" + ambiguous_guide[i]['desc'] + "</div><div class='sales'><div class='action'> <span class='button'>立即購買</span> </div><div class='discount-price'>$" + ambiguous_guide[i]['price'] + "</div><div class='price'><div class='sold'>" + ambiguous_guide[i]['num'] + "份已販售</div><div><span class='percent'>" + ambiguous_guide[i]['discount'] + "折 / <span class='original'>$" + ambiguous_guide[i]['orig'] + "</span></span></div></div></div></div></article></a>";

                    } else {
                        var className = (i === (numberOfGuide - 1) && i > 4) ? " class='last'" : "", aOrder = i - 2, action = 'inexact_buy_up' + aOrder, order = aOrder + 1, label = '餐劵模糊比對模組(下方)_第' + order + '則';
                        bottom += "<a href='" + ambiguous_guide[i]['url'] + "' target='_blank' " + className + " class='ga_tracking' data-category='WEB_shop_buy' data-action='" + action + "' data-label='" + label + "' title='" + ambiguous_guide[i]['shop'] + "'><article><div class='image'><img title='" + ambiguous_guide[i]['url'] + "' alt='" + ambiguous_guide[i]['shop'] + "' src='" + ambiguous_guide[i]['photo'] + "' class='landscape' style=''></div><div class='info'><h5 class='discount-guide'>" + ambiguous_guide[i]['shop'] + " 限時優惠</h5><div class='sales'><div class='action'> <span class='button'>立即購買</span> </div><div class='discount-price'>$" + ambiguous_guide[i]['price'] + "</div><div class='price'><div class='sold'>" + ambiguous_guide[i]['num'] + "份已販售</div><div><span class='percent'>" + ambiguous_guide[i]['discount'] + "折 / <span class='original'>$" + ambiguous_guide[i]['orig'] + "</span></span></div></div></div></div></article></a>";
                    }
                }

                if (numberOfGuide > 2) {
                    node.bottomGuide.append($(bottom)).slideDown(300);
                    //底部導購高度調整
                    var bObj = node.bottomGuide.find(".discount-guide"), bObjNum = bObj.length;
                    var bHeight = 0;
                    for (var j = 0; j < bObjNum; j++) {
                        var temp = bObj.eq(j).height();
                        if (temp > bHeight) {
                            bHeight = temp;
                        }
                    }
                    bObj.each(function () {
                        $(this).height(bHeight);
                    });
                }

                node.middleGuide.append($(middle)).slideDown(300);
                //中間導購字數調整
                node.middleGuide.find('.text').each(function () {
                    new Flexible_length(this);
                });
            }
            //替換破圖為預設圖
            // imageDetect(node.middleGuide.find('img'));
            // imageDetectBottom(node.bottomGuide.find('img'));
        }

        //黃金版位
        function showGoldenGuide() {

            golden_guide[0]['shop'] = escapeHtml(golden_guide[0]['shop']);


            if (!golden_guide[0]['banner'] || golden_guide[0]['banner'] === null) {
                goldenGuideBasic();
            } else {
                goldenGuideSpeical();
            }

            checkAndResizeRightBlock();
        }

        function goldenGuideBasic() {
            var guide = '<a title="' + golden_guide[0]['shop'] + ' 限時優惠" class="ga_tracking discount-guide" target="_blank" data-label="店家簡介下方：黃金模組版位" data-action="introduction_buy_gold" data-category="WEB_shop_buy" href="' + golden_guide[0]['url'] + '"><div class="discount-guide-gold"><div class="information"><h4>去這間店的人也買了...</h4><div class="headline"><span class="name">' + golden_guide[0]['shop'] + '</span><span>&nbsp;限時優惠</span></div><div class="sales"><div class="action"><span class="button">立即購買</span></div><div class="discount-price">$' + golden_guide[0]['price'] + '</div><div class="price"><div class="sold">' + golden_guide[0]['num'] + '份已販售</div><div><span class="percent">' + golden_guide[0]['discount'] + '折/<span class="original">$' + golden_guide[0]['orig'] + '</span></span></div></div></div></div><div class="image"><img alt="' + golden_guide[0]['shop'] + ' 限時優惠" src="' + golden_guide[0]['photo'] + '"></div></div></a>';
            node.goldenGuide.append($(guide));
        }

        function goldenGuideSpeical() {
            var small_guide = '<a class="ga_tracking discount-guide-new" target="_blank" data-label="店家簡介下方：黃金模組版位" data-action="introduction_buy_gold" data-category="WEB_shop_buy" href="' + golden_guide[0]['url'] + '" style="background-image: url(' + golden_guide[0]['banner'] + ' );"><div class="discount-guide-gold-new"><div class="headline"><span class="name">' + golden_guide[0]['shop'] + '</span><span>&nbsp;限時優惠</span></div><div class="information">' + golden_guide[0]['title'] + '</div><div class="sales"><div class="action"><span class="button">立即購買</span></div><div class="discount-price">$' + golden_guide[0]['price'] + '</div><div class="price"><span class="percent">' + golden_guide[0]['discount'] + '折/<span class="original">$' + golden_guide[0]['orig'] + '</span></span></div><div class="sold">' + golden_guide[0]['num'] + '份已販售</div></div></div></a>';
            var large_guide = '<a class="ga_tracking discount-guide-new" target="_blank" data-label="店家簡介下方：黃金模組版位" data-action="introduction_buy_gold" data-category="WEB_shop_buy" href="' + golden_guide[0]['url'] + '" style="background-image: url(' + golden_guide[0]['banner_wide'] + ');"><div class="discount-guide-gold-new"><div class="headline"><span class="name">' + golden_guide[0]['shop'] + '</span><span>&nbsp;限時優惠</span></div><div class="information">' + golden_guide[0]['title'] + '</div><div class="sales"><div class="action"><span class="button">立即購買</span></div><div class="discount-price">$' + golden_guide[0]['price'] + '</div><div class="price"><span class="percent">' + golden_guide[0]['discount'] + '折/<span class="original">$' + golden_guide[0]['orig'] + '</span></span></div><div class="sold">' + golden_guide[0]['num'] + '份已販售</div></div></div></a>';

            if ($('html').hasClass('compact')) {
                node.goldenGuide.html("").append($(small_guide));
            } else {
                node.goldenGuide.html("").append($(large_guide));
            }

            ipeen.on('cozyin', function () {
                node.goldenGuide.html("").append($(large_guide));
            });
            ipeen.on('compactin', function () {
                node.goldenGuide.html("").append($(small_guide));
            });
        }


//替換破圖為預設圖
        function imageDetect(img) {
            img.each(function (i) {
                $(this).on('error', function (e) {
                    $(e.currentTarget).attr('src', '/images/v2/shop/pack_piczone200.jpg').css({
                        'left': '0',
                        'margin-left': '0'
                    });
                });
            });
        }

        function imageDetectBottom(img) {
            img.each(function (i) {
                $(this).on('error', function (e) {
                    $(e.currentTarget).attr('src', '/images/v2/shop/pack_piczone200.jpg').css({
                        'left': '0',
                        'margin-left': '60px'
                    });
                });
            });
        }

        //html escape
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };

        function escapeHtml(string) {
            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        }

        /**
         * Content lengh repsond to screen width
         * 在要變化的內容加上 data-content='內容' data-short='窄版文字長度' data-short='寬版文字長度'
         */
        function Flexible_length(container) {
            this.container = $(container);
            this.content = this.container.data("content").toString(),
                this.compact_number = parseInt(this.container.data("short")),
                this.cozy_number = parseInt(this.container.data("long"));

            var self = this;

            function cozy_content() {
                if (self.content.length > self.cozy_number) {
                    self.container.html(self.content.slice(0, self.cozy_number) + "<span class='more'>...看更多</span>");
                } else {
                    self.container.html(self.content);
                }

            }

            function compact_content() {
                if (self.content.length > self.cozy_number) {
                    self.container.html(self.content.slice(0, self.compact_number) + "<span class='more'>...看更多</span>");
                } else {
                    self.container.html(self.content);
                }
            }

            ipeen.on('cozyin', cozy_content);
            ipeen.on('compactin', compact_content);


        }

    });
    /**
     * 非首頁的精準導購呈現
     */
    ipeen.register('shop guide on top and header', function (data) {
        var is_vip = data.is_vip,
            sid = data.sid,
            node = {},
            shop_guide;


        $.ajax({
            type: 'GET',
            url: "http://partner.ipeen.com.tw/purchase_directing/data/retrieve",
            dataType: "jsonp",
            data: {
                source: "shop",
                s_id: sid,
                fuzzy_mode: 1,
                precise_mode: show_precise,
                source_id: sid,
                device: 'desktop'
            },
            jsonpCallback: 'voucherCallback',
            success: success
        });

        function success(data) {
            shop_guide = data.precise;
            guideOnTopBar();
        }

        function guideOnTopBar() {
            node.topBarMeta = $(".top-bar .meta");
            node.headerMeta = $("#shop-header .info .meta");
            var shopGuideSticker = "<a class='mark shop-guide ga_tracking' target='_blank' href='" + shop_guide[0]['url'] + "' title='限時優惠$" + shop_guide[0]['price'] + "元起 / " + shop_guide[0]['num'] + "份已售' data-category='WEB_shop' data-action='' data-label=''>餐券</a>";
            $(shopGuideSticker).appendTo(node.topBarMeta).fadeIn(300);
            $(shopGuideSticker).appendTo(node.headerMeta).fadeIn(300);
        }

    });

    /**
     * 口碑卷輪播
     */
    ipeen.register('reputation slider', function () {
        var node = {},
            unit = 157,
            interval = 5000,
            length,
            timerId;

        node.root = $('#reputation');
        node.box = node.root.find('>div');
        node.roller = node.root.find('ul');
        node.items = node.roller.find('li');

        // prepare
        length = node.items.length;
        node.roller.css('width', length * unit);
        $('<div class="shadow-left">').appendTo(node.box);
        $('<div class="shadow-right">').appendTo(node.box);

        function init() {
            var width = node.root.width(),
                max = width - length * unit + 10,
                left = 0;

            if (width > length * unit) {
                timerId = false;
                return;
            }

            function rolling() {
                left = left === 0 ? max : 0;
                node.roller.animate({
                    left: left
                }, 800, 'easeOutQuart');
                timerId = rolling.delay(interval);
            }

            timerId = rolling.delay(interval);
        }

        function destroy() {
            if (timerId !== false) {
                clearTimeout(timerId);
            }
            node.roller.css('left', 0);
        }

        ipeen.on('cozyin', init);
        ipeen.on('cozyout', destroy);
        ipeen.on('compactin', init);
        ipeen.on('compactout', destroy);

    });


    /**
     * 側欄即時愛評輪播
     */
    ipeen.register('#liveshare-broadcast', function () {
        var node = {},
            unit = 70,
            index = 0,
            interval = 4000,
            total,
            binding = false,
            delaying = false;

        node.root = $('#liveshare-broadcast');
        node.roller = node.root.find('ul');
        node.items = node.roller.find('li');

        total = node.items.length;
        if (total < 2) {
            return;
        }
        play.delay(interval);

        node.items.on({
            mouseenter: enter,
            mouseleave: leave
        });

        function play() {
            if (binding) {
                delaying = true;
                return;
            }

            index++;
            if (index === total) {
                index = 0;
            }
            var top = index * unit;
            node.roller.animate({
                top: -top
            }, 500, 'easeOutQuart');

            play.delay(interval);
        }

        function enter() {
            binding = true;
        }

        function leave() {
            binding = false;
            if (delaying) {
                delaying = false;
                play.delay(1000);
            }
        }
    });


    /**
     * 路徑規劃
     */
    ipeen.register('shop path planning', function () {
        var node = {},
            map,
            renderer,
            service,
            travelMode = {
                bicycling: "BICYCLING",
                driving: "DRIVING",
                transit: "TRANSIT",
                walking: "WALKING"
            },
            initialized = false;

        node.root = $('#path-planning');
        node.from = node.root.find('input.from');
        node.to = node.root.find('input.to');
        node.buttons = node.root.find('a.button');
        node.suggestion = node.root.find('#map-suggestion');
        node.result = node.suggestion.find('.result');
        node.canvas = node.suggestion.find('#map-canvas');

        observe();

        function initialize() {
            if (initialized) {
                return;
            }
            initialized = true;
            node.suggestion.show();

            map = new google.maps.Map(node.canvas.get(0), {
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            renderer = new google.maps.DirectionsRenderer({
                draggable: true
            });
            renderer.setPanel(node.result.get(0));

            service = new google.maps.DirectionsService();
        }

        function observe() {
            node.buttons.on('click', start);
        }

        function start(event) {
            var me = $(event.currentTarget),
                mode = travelMode[me.data('mode')],
                request = {
                    origin: node.from.val(),
                    destination: node.to.val(),
                    travelMode: mode
                };

            initialize();
            event.preventDefault();

            service.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    renderer.setMap(map);
                    renderer.setDirections(response);
                } else {
                    renderer.setMap(null);
                    node.result.empty();
                }
            });
        }

    });


    /**
     * Photo Page Lightbox
     */
    ipeen.register('shop photo page lightbox', function (target) {
        new LightView($(target), {
            content: ">div.text",
            complete: function (content) {
                content.find('*[data-readmore]').each(function () {
                    var me = $(this),
                        href = me.data('readmore'),
                        html = me.html(),
                        anchor = $('<a>').attr('href', href).html(html || "觀看全文");
                    me.empty().append(anchor);
                });
            }
        });
    });

    /**
     * 口碑券 Lightbox
     */
    ipeen.register('reputation lightbox', function (target) {
        new LightView($(target), {
            content: ">p"
        });
    });

    /**
     * 媒體情報 媒體牆
     */
    ipeen.register('slider init', function (root) {
        var node = {};
        node.root = $(root);

        node.items = node.root.find('li');
        node.prev = node.root.find('.prev');
        node.next = node.root.find('.next');
        node.mover = node.root.find('.mover');

        var item_width = node.items.outerWidth(true);
        var item_num = node.items.length;
        var index = 0;

        node.mover.css({
            width: item_width * item_num
        })

        node.prev.on('click', backward);
        node.next.on('click', forward);

        function forward() {
            if (index >= item_num - 2) return;
            index += 1;
            move(index);

        }

        function backward() {
            if (index <= 0) return;
            index -= 1;
            move(index);
        }

        function move(index) {
            node.mover.stop().animate({
                left: -item_width * index
            }, 800, 'easeOutQuart')
        }


    });

    /**
     * 媒體播放
     */
    ipeen.register('media show', function () {
        var node = {};
        node.root = $('#show');
        node.items = node.root.find('li');
        node.screne = node.root.find('.screne');
        node.hgroup = node.root.find('hgroup');
        node.h3 = node.hgroup.find('h3');
        node.h4 = node.hgroup.find('h4');

        var pattern = "<iframe src=\"%SWF_SRC%\" frameborder=\"0\" allowfullscreen></iframe>";
        var yotubePattern = "<iframe src=\"http://www.youtube.com/embed/%YOUTUBE_ID%\" frameborder=\"0\" allowfullscreen></iframe>";

        node.items.on('click', showing);
        node.items.on('click', replaceTitle);

        function showing(event) {
            var now = $(event.currentTarget);
            var source = now.data('src');
            var url = now.data('url');
            var type = now.data('type');
            var html = "";
            if (type == 'VIDEO') {
                var m = source.match(/v=([\w\d-]+)/);
                if (!m) {
                    m = source.match(/embed\/([\w\d-]+)/);
                }

                if (m) {
                    html = yotubePattern.replace("%YOUTUBE_ID%", m[1]);
                }

            } else if (type == 'IMG') {
                html = "<div class=\"picture\"><div class=\"align\"><a href=\"" + url + "\" target=\"_blank\"><img src=\"" + source + "\" alt=\"\" ></a></div></div>"
            }
            node.screne.html(html);
        }

        function replaceTitle(event) {
            var now = $(event.currentTarget),
                title = now.find('strong').html(),
                mname = now.find('b').html(),
                mdate = now.find('i').html();
            node.h3.html(mname + mdate);
            node.h4.html(title);
        }
    })

    /**
     * 側欄效果
     */
    ipeen.register('sidebar sticky', function () {


        var node = {};
        node.root = $('#sort');

        var sticking = false;
        var $window = $(window);

        var rootTop = node.root.offset().top;
        var rootHeight = node.root.height();
        var footer = $('#detail').offset().top;


        function init() {
            $window.on('scroll', sticky);
        };

        function sticky() {
            var top = $window.scrollTop();
            var limit = footer - rootHeight;


            if (top >= rootTop && top <= limit) {

                if (sticking) return;
                sticking = true;

                node.fake = node.root.clone().css('visibility', 'hidden');
                node.root.before(node.fake);

                node.root.css({
                    position: 'fixed',
                    top: 0
                });

            } else if (top < rootTop || top > limit) {
                if (!sticking) return;
                sticking = false;
                node.fake.remove();
                node.root.css({
                    position: 'static',
                    top: ''
                });
            }
            ;
        };

        function destroy() {
            if (node.fake) {
                node.fake.remove();
            }
            ;
            node.root.css({
                position: 'static',
                top: ''
            });
            $window.off('scroll', sticky);
        }

        ipeen.on('cozyin', init);
        ipeen.on('cozyout', destroy);
    });

    /**
     *菜單選取效果
     */
    ipeen.register('menu choose', function () {
        var node = {};
        node.menu = $('#sort');
        node.group = $('.group');
        node.cates = node.menu.find('li a');
        node.topBar = $(".top-bar");

        node.cates.on('click', scroll);
        function scroll(event) {
            var current = event.currentTarget;
            var order = ($.inArray(current, node.cates));
            var group = $('.group[data-order=' + (order + 1) + ']');
            var position = group.offset().top;
            var topBarHeight = node.topBar.height();

            node.group.removeClass('active');
            node.cates.removeClass('active');
            group.addClass('active');
            $(current).addClass('active');

            $('html, body').stop().animate({
                scrollTop: (position - topBarHeight - 25)
            }, 800, 'easeOutQuart');

        }
    });

    /**
     * 回饋金解說影片
     */
    ipeen.register('benefit mov', function (button, mov) {
        var classPrefix = "movielayer-";
        var youtube = mov + '?autoplay=1',
            iframeHTML = "<iframe width=\"600\" height=\"400\" src=\"" + youtube + "\" frameborder=\"0\" allowfullscreen></iframe>";
        root = $('<div>').addClass(classPrefix + "view").appendTo('body'),
            scene = $('<div>').addClass(classPrefix + "scene").appendTo(root),
            close = $('<a>').addClass(classPrefix + "close").addClass('lightview-close').appendTo(root),
            overLayer = $('<div>').appendTo('body').hide().css({
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: '#000',
                opacity: .7,
                zIndex: 0
            });

        root.hide().css({
            position: 'fixed',
            width: 600,
            height: 400,
            top: '50%',
            left: '50%',
            marginLeft: -300,
            marginTop: -200,
            zIndex: 5
        });

        $(button).on('click', mov_show);
        close.on('click', mov_close);

        function mov_show(event) {
            event.preventDefault();
            scene.html(iframeHTML)
            root.fadeIn();
            overLayer.fadeIn();
        }

        function mov_close() {
            scene.html('');
            root.fadeOut();
            overLayer.fadeOut();
        }
    })

    /**
     *
     */
    ipeen.register('buttom special AD', function (content) {

        var classPrefix = 'buttom_special_AD-'
        var conHTML = content,
            root = $('<div>').addClass(classPrefix + 'root').appendTo('body'),
            scene = $('<div>').addClass(classPrefix + 'scene').appendTo(root),
            close = $('<a href="#">').addClass(classPrefix + 'close').html('關閉廣告').appendTo(root);

        root.css({
            height: 160,
            zIndex: 10,
            bottom: -166,
            left: 0,
            right: 0,
            position: 'fixed',
            background: 'rgba(0, 0, 0, .3)',
            boxShadow: '0 -2px 3px 0 rgba(0, 0, 0, 0.2)'
        });

        scene.css({
            width: 780,
            height: 160,
            background: '#FFFFFF',
            margin: '0 auto'
        });

        close.css({
            width: 22,
            height: 130,
            marginLeft: 390,
            top: 0,
            fontSize: 15,
            paddingTop: 30,
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            display: 'block',
            background: '#222',
            color: '#FFF'
        });

        showAD.delay(3000);
        close.on('click', closeAD);
        close.on('mouseenter', function () {
            $(this).css({
                textDecoration: 'none'
            });
        });

        function showAD() {
            scene.html(conHTML);
            root.animate({
                bottom: 0
            }, 500, 'easeOutQuart');
        }

        function closeAD(event) {
            event.preventDefault();
            root.animate({
                bottom: -166
            }, 500, 'easeOutQuart')
        }

    })

    /**
     * 左邊社群按鈕效果
     */
    ipeen.register('social sticky', function () {
        var node = {};
        node.root = $('#social_left');

        var sticking = false;
        var $window = $(window);
        var rootTop = node.root.offset().top - 100;
        var rootHeight = node.root.height();
        var limit = $('#footer').offset().top - rootHeight - 20;

        init();
        sticky();

        function init() {
            $window.on('scroll', sticky);
            $(window).resize(function () {
                if ($window.width() < 1280) {
                    node.root.hide();
                } else {
                    node.root.show();
                }
            });
        };


        function sticky() {
            var top = $window.scrollTop();

            if (rootTop < top && top <= limit) {

                if (sticking) return;
                sticking = true;

                node.root.css({
                    position: 'fixed',
                    top: 100
                });

            } else if (rootTop >= top) {
                if (!sticking) return;
                sticking = false;
                node.root.css({
                    position: 'absolute',
                    top: 0
                });
            } else if (top > limit) {
                if (!sticking) return;
                sticking = false;
                // node.fake.remove();
                node.root.css({
                    position: 'absolute',
                    top: limit - rootTop - 20
                });
            }
            ;
        };


        // ipeen.on('cozyin', init);
        // ipeen.on('cozyout', destroy);
    });

    ipeen.register('fixed top bar', function () {
        var headerHeight = $("#header").height(), topBar = $(".top-bar"), $window = $(window);

        topBarDisplay();

        $window.on("scroll", topBarDisplay);

        function topBarDisplay() {
            if ($window.scrollTop() > headerHeight && !topBar.hasClass("fixed")) {
                topBar.addClass("fixed");
            } else if ($window.scrollTop() <= headerHeight && topBar.hasClass("fixed")) {
                topBar.removeClass("fixed");
            }
        }

    });


    ipeen.register('business hour popup', function () {
        function BusinessHour(root) {
            var root = $(root),
                pannel = root.find('.business-hour-pannel'),
                detail = root.find('.business-hour-detail'),
                anchor = root.find('.business-hour-show-all');

            if (anchor.length <= 0) return;

            anchor.on('mouseenter', function (e) {
                e.preventDefault();
                showInfo();
            });
            pannel.on('mouseenter', function (e) {
                e.preventDefault();
                showInfo();
            });
            anchor.on('mouseleave', function (e) {
                e.preventDefault();
                hideInfo();
            });
            pannel.on('mouseleave', function (e) {
                e.preventDefault();
                hideInfo();
            });
            anchor.on('click', function (e) {
                e.preventDefault();
            })

            function showInfo() {
                anchor.addClass('active');
                detail.removeClass('hide');
            }

            function hideInfo() {
                anchor.removeClass('active');
                detail.addClass('hide');
            }

        }

        new BusinessHour(".businessHour-left");
        new BusinessHour(".businessHour-bottom");
    });

    /**
     * 我的滿意度
     */
    ipeen.register('my score', function () {
        var trigger = $("#button-score"), trigger_top = $("#button-score-top"), login = trigger.attr("data-login");

        trigger.on('click', showPanel);
        trigger_top.on('click', showPanel);

        function showPanel(e) {
            e.preventDefault();
            reloadIframe();
            if (login != 1) {
                window.location.href = '/login/?next=' + encodeURIComponent(window.location);
                return;
            }
            $('.score-panel').show();
            $.screenBlock($('.score-panel'), {}, function () {
            });
        }

        $('.score-panel .cancel').on('click', function (e) {
            e.preventDefault();
            $.screenUnblock($(this));
        });
        $('.score-panel .save').on('click', function (e) {
            e.preventDefault();
            // save actions goes here.....
        });

        function SetScore(node) {
            var score_set = $(node), score_btn = score_set.find('a');
            var default_score = parseInt(score_set.data('score'), 10);
            if (!isNaN(default_score)) {
                set_star_count(score_set, default_score);
            }
            score_btn.on('click', function () {
                var score = $(this).data('value');
                set_star_count(score_set, score);
            });
            score_btn.on('mouseenter', function () {
                var score = $(this).data("value");
                temp_star_count(score_set, score);
            });
            score_btn.on('mouseleave', function () {
                var score = score_set.find("input").val();
                temp_star_count(score_set, score);
                if (score == "") {
                    score_set.find('span').text('請評分');
                    score_btn.removeClass('active');
                }
            });

        }

        function reloadIframe() {

            $('#scoreIframe').attr('src', function (i, val) {
                return val;
            });

        }

        new SetScore('.taste');
        new SetScore('.service');
        new SetScore('.decorate');


        function set_star_count(score_set, score) {
            score_set.find('input').val(score);
            var all_stars = score_set.find('a'), cmm_span = score_set.find('span');
            all_stars.filter(function () {
                return score >= $(this).data('value');

            }).addClass('active');
            all_stars.filter(function () {
                return score < $(this).data('value');
            }).removeClass('active');
            cmm_span.text(score_set.find('a.active').last().data("text"));
        }

        function temp_star_count(score_set, score) {
            //do not write value to the hidden input field
            var all_stars = score_set.find('a'), cmm_span = score_set.find('span');

            all_stars.filter(function () {
                return score >= $(this).data('value');

            }).addClass('active');
            all_stars.filter(function () {
                return score < $(this).data('value');
            }).removeClass('active');
            cmm_span.text(score_set.find('a.active').last().data("text"));
        }
    });
//教學
    ipeen.register('my score tour', function () {
        if ($.cookie('shop-score-tour') !== "showed") {
            //show tour
            var $body = $('body');
            var position_anchor_action = $("#button-score");
            var tour_string_action = "<div class='score-tour-action'>";
            tour_string_action += "<a href='#' class='close'>X</a>";
            tour_string_action += "<h5>Step 1:</h5>";
            tour_string_action += "<p>透過評分、寫分享文，即可建立您的滿意度分數，幫您所喜愛的店家給個好評吧!!</p>";
            tour_string_action += "</div>";
            var action_tour = $(tour_string_action)
                .appendTo($body)
                .css({
                    position: 'absolute',
                    top: position_anchor_action.offset().top,
                    left: position_anchor_action.offset().left,
                });
            action_tour.find('.close').on('click', function (e) {
                e.preventDefault();
                $(e.currentTarget).parent().fadeOut().remove();
            });
            var position_anchor_show = $(".scalar");
            var tour_string_show = "<div class='score-show-action'>";
            tour_string_show += "<a href='#' class='close'>X</a>";
            tour_string_show += "<h5>Step 2:</h5>";
            tour_string_show += "<p>評分完成後，您可以在此看見評分的結果囉!!</p>";
            tour_string_show += "</div>";
            var show_tour = $(tour_string_show)
                .appendTo($body)
                .css({
                    position: 'absolute',
                    top: position_anchor_show.offset().top - 90,
                    left: position_anchor_show.offset().left + 280
                });
            show_tour.find('.close').on('click', function (e) {
                e.preventDefault();
                $.cookie('shop-score-tour', 'showed', {expires: 365 * 24 * 60, domain: 'ipeen.com.tw', path: '/'});
                $(e.currentTarget).parent().fadeOut().remove();
            });
        }
    });


})(this.jQuery, this.ipeen);
