(function($) { 'use strict';

    var w=window,d=document,
    e=d.documentElement,
    g=d.getElementsByTagName('body')[0];

    $(document).ready(function($){

        var x=w.innerWidth||e.clientWidth||g.clientWidth, // Viewport Width
        y=w.innerHeight||e.clientHeight||g.clientHeight; // Viewport Height

        // Global Vars

		var $window = $(window);
		var wScrollTop = $window.scrollTop();
		var body = $('body');
        var htmlOffsetTop = parseInt($('html').css('margin-top'));
		var mainHeader = $('#masthead');
		var sidebar = $('#secondary');
    	var mainContent = $('#content');
        var primaryContent = $('#primary');
    	var mainContentPaddingTop = parseInt(mainContent.css('padding-top'));
        var comments = $('#comments');
        var hero = $('.page .site > div.hero, .single .hero');

		// Outline none on mousedown for focused elements

	    body.on('mousedown', '*', function(e) {
	        if(($(this).is(':focus') || $(this).is(e.target)) && $(this).css('outline-style') == 'none') {
	            $(this).css('outline', 'none').on('blur', function() {
	                $(this).off('blur').css('outline', '');
	            });
	        }
	    });

        // Retina Logo

        if($('.retina-logo img').length){
            var retinaImage = $('.retina-logo img');

            var imageLoaded = function () {
                var theImage = new Image();

                theImage.src = retinaImage.attr('src');

                var imageWidth = theImage.width;

                retinaImage.width(imageWidth / 2);
            };

            retinaImage.each(function() {
                if( this.complete ) {
                    imageLoaded.call( this );
                } else {
                    $(this).one('load', imageLoaded);
                }
            });
        }

        // Disable search submit if input empty
        $( '.search-submit' ).prop( 'disabled', true );
        $( '.search-field' ).keyup( function() {
            $('.search-submit').prop( 'disabled', this.value === "" ? true : false );
        });

        // Sicky Header

        if(body.hasClass('sticky-header') && x > 767){
            mainHeader.css({top: htmlOffsetTop});
        }

        // Main Menu

        var menuMarker = $('#menuMarker');
        var mainNav = $('.site-header ul.nav-menu');

        mainNav.prepend(menuMarker);

        // Remove bottom padding if comments are enabled

        if(comments.length){
            mainContent.css({paddingBottom: 0});
        }

        // dropdown button

        var mainMenuDropdownLink = $('.nav-menu .menu-item-has-children > a, .nav-menu .page_item_has_children > a');
        var dropDownArrow = $('<span class="dropdown-toggle"><span class="screen-reader-text">toggle child menu</span><i class="icon-drop-down"></i></span>');

        mainMenuDropdownLink.after(dropDownArrow);

        // dropdown open on click

        var dropDownButton = mainMenuDropdownLink.next('span.dropdown-toggle');

        dropDownButton.on('click', function(){
            var $this = $(this);
            $this.parent('li').toggleClass('toggle-on').find('.toggle-on').removeClass('toggle-on');
            $this.parent('li').siblings().removeClass('toggle-on');
        });

        // Social menu

        var socialMenuTrig = $('#socMenuTrig');

        if(socialMenuTrig.length && x > 767){
            var socialMenu = socialMenuTrig.next('div[class*=menu-]');
            socialMenu.prepend(socialMenuTrig);
            socialMenuTrig.css({display: 'inline-block'});
        }

        // Center aligned images

        if((body.hasClass('single') || body.hasClass('page')) && !body.hasClass('split-layout')){

            var centerAlignImg = primaryContent.find('.aligncenter');
            var contentImg = primaryContent.find('a img');

            if(centerAlignImg.length){

                primaryContent.imagesLoaded(function (){

                    centerAlignImg.each(function(){
                        var $this = $(this);

                        var centerAlignImgWidth = $this.width();
                        var entryContentWidth = $('.entry-content').width();

                        if(x > 1280){
                            if(centerAlignImgWidth > entryContentWidth){
                                $this.css({marginLeft: -((centerAlignImgWidth - entryContentWidth) / 2), opacity: 1});
                            }
                            else{
                                $this.css({marginLeft: '', opacity: 1});
                            }
                        }
                        else{
                            $this.css({marginLeft: ''});
                        }
                    });

                });

            }

            if(contentImg.length){
                contentImg.parent('a').css({border: 'none'});
            }

        }

        // On Infinite Scroll Load

        var $container = $('div#post-load'),
            infiniteHandle = $('#infinite-handle'),
            no_more_posts  = js_vars.no_more_text,
            loadNumber     = 1;

        if(infiniteHandle.length){

            if(!body.hasClass('layout-three-columns') && !body.hasClass('layout-four-columns')){
                $('article.hentry').addClass('post-loaded');
            }
        }

        var opts = {
            lines: 7 // The number of lines to draw
            , length: 12 // The length of each line
            , width: 5 // The line thickness
            , radius: 9 // The radius of the inner circle
            , scale: 0.5 // Scales overall size of the spinner
            , corners: 0 // Corner roundness (0..1)
            , color: '#000' // #rgb or #rrggbb or array of colors
            , opacity: 0.25 // Opacity of the lines
            , rotate: 0 // The rotation offset
            , direction: 1 // 1: clockwise, -1: counterclockwise
            , speed: 1 // Rounds per second
            , trail: 49 // Afterglow percentage
            , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            , zIndex: 2e9 // The z-index (defaults to 2000000000)
            , className: 'spinner' // The CSS class to assign to the spinner
            , top: 'auto' // Top position relative to parent
            , left: 'auto' // Left position relative to parent
            , shadow: false // Whether to render a shadow
            , hwaccel: false // Whether to use hardware acceleration
        };

        var target = document.getElementById('loading-is');
        var spinner = new Spinner(opts).spin(target);

        function spinnerShow(){
            $('#loading-is').show();
        }

        function spinnerHide(){
            $('#loading-is').hide();
        }

        $container.infinitescroll({
            navSelector  : '#infinite-handle',    // selector for the paged navigation
            nextSelector : '#infinite-handle a',  // selector for the NEXT link (to page 2)
            itemSelector : 'div#post-load .hentry',
            loading: {
                finishedMsg: no_more_posts,
                msgText: '',
                //img: loadingImg,
                selector: '#loading-is'
            }
        },
        function(){

            // Reactivate on post load

            var newEl = $container.children().not('article.post-loaded, span.infinite-loader, div.grid-sizer').addClass('post-loaded');

            newEl.hide();
            newEl.imagesLoaded(function () {

                radio_checkbox_animation();

                // Reactivate masonry on post load

                var infiniteContainer = $('#post-load');

                if(infiniteContainer.hasClass('masonry')){
                    $container.masonry('appended', newEl, true).masonry('layout');
                }

                if(!infiniteContainer.hasClass('masonry')){
                    newEl.show();
                }

                setTimeout(function(){
                    newEl.each(function(i){
                        var $this = $(this);

                        if($this.find('iframe').length && infiniteContainer.hasClass('masonry')){
                            var $iframe = $this.find('iframe');
                            var $iframeSrc = $iframe.attr('src');

                            $iframe.load($iframeSrc, function(){
                                $container.masonry('layout');
                            });
                        }

                        // Gallery with full size images

                        var fullSizeThumbGallery = $this.find('div.gallery-size-full');

                        if(fullSizeThumbGallery.length){
                            fullSizeThumbGallery.each(function(){
                                var $this = $(this);
                                var galleryItemCount = $this.find('.gallery-item').length;
                                if(body.hasClass('single')){
                                    $this.append('<span class="gallery-count">01 / 0'+galleryItemCount+'</span>');
                                }
                                else{
                                    $this.parent().addClass('fullsize-gallery').siblings().find('.edit-link').append('<span class="gallery-count">01 / 0'+galleryItemCount+'</span>');
                                }
                            });
                        }

                    });
                }, 150);

                // Checkbox and Radio buttons

                radio_checkbox_animation();

                // Sharedaddy

                shareDaddy();

                // Format Video

                videoFormat();

                // Thickbox

                videoThickbox();

            });

            // The maximum number of pages the current query can return.
            var max = parseInt( js_vars.maxPages );
            loadNumber++;
            spinnerHide();

            if ( js_vars.is_type == 'click' && loadNumber < max ) {
                // Display Load More button
                $('#infinite-handle').show();
            }

        });

        if ( 'infinite-scroll' == js_vars.paging_type && js_vars.is_type == 'scroll' ) {
            spinnerShow();
        }

        // If Infinite Scroll on click is choosen
        if ( 'infinite-scroll' == js_vars.paging_type && js_vars.is_type == 'click' ) {

            //Onclick InfiniteScroll
            $(window).unbind('.infscr');

            $("#infinite-handle a").on('click', function(e){
                e.preventDefault();

                $container.infinitescroll('retrieve');
                spinnerShow();
                return false;
            });

        }


        // Checkbox and Radio buttons

        //if buttons are inside label
        function radio_checkbox_animation() {
            var checkBtn = $('label').find('input[type="checkbox"]');
            var checkLabel = checkBtn.parent('label');
            var radioBtn = $('label').find('input[type="radio"]');

            checkLabel.addClass('checkbox');

            checkLabel.click(function(){
                var $this = $(this);
                if($this.find('input').is(':checked')){
                    $this.addClass('checked');
                }
                else{
                    $this.removeClass('checked');
                }
            });

            var checkBtnAfter = $('label + input[type="checkbox"]');
            var checkLabelBefore = checkBtnAfter.prev('label');

            checkLabelBefore.click(function(){
                var $this = $(this);
                $this.toggleClass('checked');
            });

            radioBtn.change(function(){
                var $this = $(this);
                if($this.is(':checked')){
                    $this.parent('label').siblings().removeClass('checked');
                    $this.parent('label').addClass('checked');
                }
                else{
                    $this.parent('label').removeClass('checked');
                }
            });
        }

        radio_checkbox_animation();

        // Sharedaddy

        function shareDaddy(){
            var shareTitle = $('.sd-title');

            if(shareTitle.length){
                shareTitle.on('click', function(){
                    $(this).closest('.sd-social').toggleClass('sd-open');
                });
            }
        }

        shareDaddy();

        // Gallery with full size images

        function galleryFullSizeImg(){
            var fullSizeThumbGallery = $('div.gallery-size-full');

            if(fullSizeThumbGallery.length){
                fullSizeThumbGallery.each(function(){
                    var $this = $(this);
                    var galleryItemCount = $this.find('.gallery-item').length;
                    if(body.hasClass('single')){
                        $this.find('a').append('<span class="gallery-count">1<i></i>'+galleryItemCount+'</span>');
                    }
                    else{
                        $this.find('a').append('<span class="gallery-count">1<i></i>'+galleryItemCount+'</span>');
                    }
                });
            }
        }

        galleryFullSizeImg();

        // Format Video

        function videoFormat(){
            var entryVideo = $('div.entry-video');

            if(entryVideo.length){
                entryVideo.each(function(){
                    var $this = $(this);

                    $this.find('.featured-image').closest('.entry-video').addClass('has-img');
                });
            }
        }

        videoFormat();

        // Thickbox

        function videoThickbox(){
            var thickboxVideo = $('.format-video a.thickbox');

            if(thickboxVideo.length){
                thickboxVideo.on('click touchstart', function(){
                    setTimeout(function(){
                        $('#TB_window').addClass('format-video');
                    }, 200);
                });
            }
        }

        videoThickbox();

	    // Big search field

	    var bigSearchWrap = $('div.search-wrap');
	    var bigSearchField = bigSearchWrap.find('.search-field');
	    var bigSearchTrigger = $('#big-search-trigger');
	    var bigSearchCloseBtn = $('#big-search-close');
        var bigSearchClose = bigSearchWrap.add(bigSearchCloseBtn);

	    function closeSearch(){
            if(body.hasClass('big-search')){
                body.removeClass('big-search');
                setTimeout(function(){
                    $('.search-wrap').find('.search-field').blur();
                }, 100);
            }
        }

        bigSearchClose.on('touchend click', function(){
            closeSearch();
        });

        $(document).keyup(function(e) {
            if (e.keyCode == 27) {
                closeSearch();
            }
        });

	    bigSearchTrigger.on('touchend click', function(e){
	        e.preventDefault();
	        e.stopPropagation();
	        var $this = $(this);
	        body.addClass('big-search');
	        setTimeout(function(){
	            $this.siblings('.search-wrap').find('.search-field').focus();
	        }, 100);
	    });

	    bigSearchField.on('touchend click', function(e){
	        e.stopPropagation();
	    });

        // Portfolio single with excerpt

        if(body.hasClass('single-portfolio')){

            if(hero.length){
                body.addClass('single-portfolio-headline');
            }
        }

        // Headline animation

        if(body.hasClass('headline-template') || body.hasClass('single-portfolio-headline')){

            setTimeout(function(){
                hero.addClass('show-headline');
            }, 800);

        }

        // Scroll up and down

        var scrollUpBtn = $('#scrollUpBtn');

        scrollUpBtn.on('click touchstart', function (e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, 900, 'easeInOutExpo');
            return false;
        });

        if((!hero.length || body.hasClass('single-post')) && x > 1024){

            if($window.scrollTop() > y) {
                scrollUpBtn.fadeIn(300).removeClass('hide');
            }
            else{
                scrollUpBtn.addClass('hide').fadeOut(300);
            }

            $window.scroll(function () {
                var $this = $(this);

                setTimeout(function(){
                    if($this.scrollTop() > y) {
                        scrollUpBtn.fadeIn(300).removeClass('hide');
                    }
                    else{
                        scrollUpBtn.addClass('hide').fadeOut(300);
                    }
                }, 200);
            });
        }

        if(hero.length && x > 1024 && !body.hasClass('single-post')){
            var scrollDownBtn = $('#scrollDownBtn');
            var primaryContentOffsetTop = primaryContent.offset().top;
            var scrollToPrimaryContent;
            setTimeout(function(){
                var mainHeaderHeight = mainHeader.outerHeight();
                if(body.hasClass('single')){
                    scrollToPrimaryContent = primaryContentOffsetTop - mainHeaderHeight - htmlOffsetTop;
                }
                else{
                    scrollToPrimaryContent = primaryContentOffsetTop - mainContentPaddingTop - mainHeaderHeight - htmlOffsetTop;
                }
            }, 200);

            scrollDownBtn.show();
            scrollDownBtn.on('click touchstart', function(e) {
                e.preventDefault();
                $('html, body').animate({scrollTop: (scrollToPrimaryContent)}, 900, 'easeInOutExpo');
                fired = 1;
                return false;
            });

            if($window.scrollTop() > scrollToPrimaryContent - 4) {
                scrollDownBtn.addClass('hide').fadeOut(300);
                scrollUpBtn.fadeIn(300).removeClass('hide');
            }
            else{
                scrollUpBtn.addClass('hide').fadeOut(300);
                scrollDownBtn.fadeIn(300).removeClass('hide');
            }

            var iScrollPos = 0;
            var fired = 0;

            // left: 37, up: 38, right: 39, down: 40,
            // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
            var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1};

            var preventDefault = function (e) {
              e = e || window.event;
              if (e.preventDefault)
                  e.preventDefault();
              e.returnValue = false;
            };

            var preventDefaultForScrollKeys = function (e) {
                if (keys[e.keyCode]) {
                    preventDefault(e);
                    return false;
                }
            };

            var disableScroll = function () {
                if (window.addEventListener) // older FF
                  window.addEventListener('DOMMouseScroll', preventDefault, false);
                window.onwheel = preventDefault; // modern standard
                window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
                window.ontouchmove  = preventDefault; // mobile
                document.onkeydown  = preventDefaultForScrollKeys;
            };

            var enableScroll = function () {
                if (window.removeEventListener)
                    window.removeEventListener('DOMMouseScroll', preventDefault, false);
                window.onmousewheel = document.onmousewheel = null;
                window.onwheel = null;
                window.ontouchmove = null;
                document.onkeydown = null;
            };

            $window.scroll(function () {
                var $this = $(this);
                var iCurScrollPos = $(this).scrollTop();

                setTimeout(function(){

                    if($this.scrollTop() > scrollToPrimaryContent - 4) {
                        scrollDownBtn.addClass('hide').fadeOut(300);
                        scrollUpBtn.fadeIn(300).removeClass('hide');
                    }
                    else{
                        scrollUpBtn.addClass('hide').fadeOut(300);
                        scrollDownBtn.fadeIn(300).removeClass('hide');
                    }


                    if(body.hasClass('headline-template') || body.hasClass('single-portfolio-headline')){

                        if($this.scrollTop() > y / 10 && $this.scrollTop() < y / 2 && iCurScrollPos > iScrollPos && fired === 0) {
                            $('html, body').animate({scrollTop: (scrollToPrimaryContent)}, 900, 'easeInOutExpo');
                            // disable scrolling
                            disableScroll();

                            fired = 1;
                            setTimeout(function(){
                                enableScroll();
                            }, 1000);
                            return false;
                        }
                        else if($this.scrollTop() === 0 && iCurScrollPos < iScrollPos && fired === 1){
                            fired = 0;
                        }

                        iScrollPos = iCurScrollPos;
                    }

                }, 100);
            });
        }

	    // Featured image - Portrait

	    if(body.hasClass('single-post') || body.hasClass('blog') || body.hasClass('archive') || body.hasClass('single-portfolio')){

	    	var portraitImg = $('.featured-portrait');

	    	if(portraitImg.length){
	    		if(body.hasClass('single-post') || body.hasClass('single-portfolio')){
	    			portraitImg.closest('.hero').addClass('portrait-wrap');
	    		}
	    		if(body.hasClass('single-post')  || body.hasClass('blog') || body.hasClass('archive') || body.hasClass('single-portfolio')){
	    			portraitImg.parent().addClass('portrait-wrap');
	    		}
	    	}

	    }

	    // Dropcaps

	    if(body.hasClass('single') || body.hasClass('page')){

	    	var dropcap = $('span.dropcap');
	    	if(dropcap.length){
	    		dropcap.each(function(){
	    			var $this = $(this);
	    			$this.attr('data-dropcap', $this.text());
	    		});
	    	}

	    }

	    // Sidebar trigger

	    var sidebarTrigg = $('#sidebar-trigger');

	    if(sidebarTrigg.length){
            var closeSidebar = $window.add('#closeSidebar');
	    	closeSidebar.on('click touchstart', function(){
                body.removeClass('sidebar-opened');
            });

	    	sidebarTrigg.on('click touchstart', function(e){
	    		e.preventDefault();
	    		e.stopPropagation();
	    		body.toggleClass('sidebar-opened');
	    	});

	    	sidebar.on('click touchstart', function(e){
	    		e.stopPropagation();
	    	});
	    }

        // Portfolio

        if(body.hasClass('slider-initialized') || body.hasClass('headline-template') || $('.single-portfolio div.hero').length){

            var slider = $('div.featured-slider');
            var sliderWrap = slider.closest('.featured-slider-wrap');
            var slide = slider.find('article');
            var direction;

            if(x > 1024 && body.hasClass('slider-initialized')){
                if(body.hasClass('sticky-header')){
                    mainContent.css({marginTop: (y - htmlOffsetTop)});
                }
                else{
                    setTimeout(function(){
                        var mainHeaderHeight = mainHeader.outerHeight();
                        mainContent.css({marginTop: (y - mainHeaderHeight - htmlOffsetTop)});
                    }, 200);
                }
            }
            else{
                mainContent.css({marginTop: ''});
            }

            if(body.hasClass('slider-initialized')){

                if(body.hasClass('rtl')){
                    direction = true;
                }
                else{
                    direction = false;
                }

                if(x > 991){
                    sliderWrap.css({top: htmlOffsetTop, height: y - htmlOffsetTop});

                    slide.each(function(){
                        var featuredImg = $(this).find('img');
                        if(featuredImg.length){
                            var slideImgSrc = featuredImg.attr('src');
                            $(this).find('.featured-image').css({backgroundImage: 'url('+slideImgSrc+')'});
                        }
                    });
                }
                else{
                    sliderWrap.css({top: '', height: ''});

                    slide.find('.featured-image').css({backgroundImage: ''});
                }


                slider.slick({
                    slide: 'article',
                    infinite: true,
                    speed: 800,
                    fade: true,
                    useTransform: true,
                    centerMode: true,
                    centerPadding: 0,
                    initialSlide: 0,
                    dots: true,
                    touchThreshold: 20,
                    slidesToShow: 1,
                    cssEase: 'cubic-bezier(0.28, 0.12, 0.22, 1)',
                    rtl: direction,
                    responsive: [
                    {
                      breakpoint: 1025,
                      settings: {
                        dots: false
                      }
                    },
                    {
                      breakpoint: 992,
                      settings: {
                        arrows: false,
                        draggable: true,
                        centerPadding: 0
                      }
                    }
                  ]
                });

                if(x > 1024){
                    var sliderCounter = slider.find('.slick-dots');
                    var counterElNumber = sliderCounter.find('li').length;
                    sliderCounter.append('<span>'+counterElNumber+'</span>');
                }

                setTimeout(function(){
                    slider.addClass('show-slider');
                }, 800);

            }

            var heroOnScroll = function() {
                var heroHeight = hero.outerHeight();
                if(x > 1024){
                    if(wScrollTop > 0){
                        hero.css({opacity: (heroHeight - (y / 8) - wScrollTop) / heroHeight});
                    }
                    else{
                        hero.css({opacity: 1});
                    }
                }
            };
            heroOnScroll();

            $window.scroll(function(){
                wScrollTop = $(window).scrollTop();
                heroOnScroll();
            });
        }

        // Shuffle layout

        if(body.hasClass('shuffle-layout')){
            if(x > 1024){
                var shufflePostCategoryList = $('.shuffle-layout .category-list');

                shufflePostCategoryList.each(function(){
                    var $this = $(this);
                    var shufflePostCategoryItem = $this.find('a');

                    if(shufflePostCategoryItem.length > 2){
                        var excessItems = shufflePostCategoryItem.slice(2);
                        excessItems.detach();
                        shufflePostCategoryItem.eq(1).addClass('last');

                        $this.append('<span class="more-categories">...</span>');
                        $('.more-categories').on('click', function(){
                            excessItems.appendTo($this);
                            $(this).remove();
                            shufflePostCategoryItem.eq(1).removeClass('last');
                        });
                    }
                });
            }


            $('div.grid-sizer').remove();
        }

        // Split Layout

        if(body.hasClass('split-layout') && x >= 1280){
            setTimeout(function(){
                var splitEntryContent = $('.container > article');
                var splitEntryContentOffsetTop = splitEntryContent.offset().top;
                var splitEntryContentHeight = splitEntryContent.height();
                var splitMediaBoxHeight = splitEntryContent.siblings('.featured-media').height();
                var limitVal;

                splitEntryContent.closest('#primary').css({minHeight: splitEntryContentHeight});

                if(splitMediaBoxHeight >=  splitEntryContentHeight){
                    var relatedPortfolios = $('#jp-relatedposts');
                    if(relatedPortfolios.length){
                        var relatedPortfoliosOffsetTop = relatedPortfolios.offset().top;

                        limitVal = relatedPortfoliosOffsetTop - y - htmlOffsetTop - (splitEntryContentHeight - (y - splitEntryContentOffsetTop));
                    }
                    else{
                        var navigationOffsetTop = $('nav.post-navigation').offset().top;

                        limitVal = navigationOffsetTop - y - htmlOffsetTop - (splitEntryContentHeight - (y - splitEntryContentOffsetTop));
                    }

                    var mainHeaderHeight = mainHeader.outerHeight();
                    splitEntryContent.scrollToFixed({
                        marginTop: function() {
                            var marginTop = (mainHeaderHeight);
                            return marginTop;
                        },
                        limit: function() {
                            var limit = limitVal;
                            return limit;
                        }
                    });

                }
            }, 500);
        }

        // Add show class to body

        body.addClass('show');

        // Footer

        var mainFooter = $('#colophon');

        if(mainFooter.find('.widget-area').length){
            mainFooter.addClass('yes-widgets');
        }

    }); // End Document Ready

    $(window).load(function(){

        // Masonry call

        if($('#post-load').hasClass('masonry')){
            var $container = $('div.masonry');

            $container.imagesLoaded( function() {
                $container.masonry({
                    columnWidth: '.grid-sizer',
                    itemSelector: '.masonry article',
                    transitionDuration: 0
                }).masonry('layout').css({opacity: 1});



                var masonryChild = $container.find('article.hentry');

                masonryChild.each(function(i){
                    setTimeout(function(){
                        masonryChild.eq(i).addClass('post-loaded');
                    }, 200 * (i+1));
                });
            });
        }

    }); // End Window Load

    $(window).resize(function(){

        var x=w.innerWidth||e.clientWidth||g.clientWidth, // Viewport Width
        y=w.innerHeight||e.clientHeight||g.clientHeight; // Viewport Height

        // Global Vars

        var body = $('body');
        var htmlOffsetTop = parseInt($('html').css('margin-top'));
        var mainHeader = $('#masthead');
        var primaryContent = $('#primary');

        // Sicky Header

        if(body.hasClass('sticky-header') && x > 767){
            mainHeader.css({top: htmlOffsetTop});
        }
        else{
            mainHeader.css({top: ''});
        }

        // Center aligned images

        if((body.hasClass('single') || body.hasClass('page')) && !body.hasClass('split-layout')){

            var centerAlignImg = primaryContent.find('.aligncenter');

            if(centerAlignImg.length){
                centerAlignImg.each(function(){
                    var $this = $(this);

                    var centerAlignImgWidth = $this.width();
                    var entryContentWidth = $('.entry-content').width();

                    if(x > 1280){
                        if(centerAlignImgWidth > entryContentWidth){
                            $this.css({marginLeft: -((centerAlignImgWidth - entryContentWidth) / 2), opacity: 1});
                        }
                        else{
                            $this.css({marginLeft: '', opacity: 1});
                        }
                    }
                    else{
                        $this.css({marginLeft: ''});
                    }
                });

            }

        }

        if(body.hasClass('slider-initialized')){
            var slider = $('div.featured-slider');
            var sliderWrap = slider.closest('.featured-slider-wrap');
            var slide = slider.find('article');

            if(x > 991){
                sliderWrap.css({top: htmlOffsetTop, height: y - htmlOffsetTop});

                slide.each(function(){
                    var featuredImg = $(this).find('img');
                    if(featuredImg.length){
                        var slideImgSrc = featuredImg.attr('src');
                        $(this).find('.featured-image').css({backgroundImage: 'url('+slideImgSrc+')'});
                    }
                });
            }
            else{
                sliderWrap.css({top: '', height: ''});

                slide.find('.featured-image').css({backgroundImage: ''});
            }
        }

        // Split Layout

        if(x < 1280){
            var splitEntryContent = $('.split-layout .container > article');
            splitEntryContent.closest('#primary').css({minHeight: ''});
        }

    });

})(jQuery);