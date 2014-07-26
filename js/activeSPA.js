(function($){
	var section=[];
	var sectionLoaded=[];
	var sectionNum=0;
	var hashStr=getHashStr();
	var currentHashIndex=0;
	var $body=(($.browser.msie && parseInt($.browser.version) <= 9)||$.browser.mozilla) ? $('html') : $('body');
	var timelineChartDone=false;
	var fromClick=false;
	var firstLoad=true;
	var headerHeight=$('#header').height();
	var $header=$('#header');
	var $section=$('.section');

	$.slideToHash=function(){
		slideToHash();
	}
	$.activeSPA=function(){
		sectionNum=$section.length;
		var newFooterHeight=$(window).height()-$section.eq(sectionNum-1).height();
		if($('#footer').height()<newFooterHeight)
			$('#footer').height(newFooterHeight);
		for(var i=0;i<sectionNum;i++){
			section.push({
				top:$section.eq(i).offset().top,
				hash:$section.eq(i).data('section')
			});
			sectionLoaded.push(false);
		}
		if(Modernizr.hashchange){
			window.onhashchange=onHashChange;
		}else{
			$(window).hashchange(onHashChange);
		}
		onHashChange();
		
		
		$('.navi a').click(function(e){
			fromClick=true;
			if(getHashStr()==$(this).attr('href'))
				slideToHash();
		})
		$('.scrollDown').click(function(e){
			$body.stop().animate({scrollTop:$(this).offset().top-$('#header').height()+$(this).outerHeight()},500);
			return false;
		})
		$(window).scrollStopped(function(){
			var wst=$(this).scrollTop();
			for(var j=0;j<sectionNum;j++){
				if(wst < Math.floor($section.eq(j).offset().top+$section.eq(j).height())){
					$('.navi li').eq(j).addClass('current').siblings().removeClass('current');
					location.hash=section[j].hash;
					break;
				}
			}
			posNavi();
		})
	
	}

	function onHashChange(event){
		posNavi();
		hashStr=getHashStr();
		if(!window.location.hash){
			window.location.hash='#home';
		}
		currentHashIndex=getHashIndex();
		switch (getHashStr()){
			case '#home':
				title='Home';
				if(!sectionLoaded[currentHashIndex]){
					setTimeout(function(){
						var totalTime=3000;
						$('.home-statistics li').each(function(index,element){
							var num=$(element).data('num');
							var i=0;
							var rollInt=setInterval(rollNum,totalTime/num);
							function rollNum(){
								i++;
								$(element).find('p').text(i);
								$(element).find('p').text((i<1000)?i:'999+');
								if(i==num){
									clearInterval(rollInt);
								}
							}
						})
					},500);
				}
				break;
			case '#works':
				title='Works';
				break;
			case '#skills':
				title='Skills';
				if(!sectionLoaded[currentHashIndex]){
					setTimeout(function(){
						if(Modernizr.canvas){
							$('#ringChart').ringChart({container:$('.skillsDiv > .slideContent')});
						}else{
							//////IE7-8
							$('.barChart ul li').each(function(index,element){
								var percent=$(element).data('percentage');
								$(element).delay(50*index).fadeIn('slow',function(){
									$(this).children('h4').animate(
										{width:percent+'%'},
										200,
										function(){
											if(!$.browser.msie){
												$(this).finish();
											}
										}
									);
								})
							})
						}
					},500);
				}
				break;
			case '#about':
				title='About me';
				break;
			case '#clients':
				title='Clients';
				break;
			default :
		}
		if(fromClick||firstLoad){
			slideToHash();
		}
		$('.navi li').each(function(){
			var $el=$(this);
			$el[$el.find('a').attr('href')===hashStr?'addClass':'removeClass']('current');
		});
		sectionLoaded[currentHashIndex]=true;
		document.title='Yisen | '+title;
		return;
	}
	function getHashStr(){
		var hashStr=window.location.hash;
		if(!hashStr){
			hashStr='#home';
		}else if(hashStr.indexOf('?')==-1){
			hashStr=hashStr;
		}else{
			hashStr=hashStr.slice(0,hashStr.indexOf('?'));
		}
		return hashStr;
	}
	function getHashIndex(){
		var hashIndex;
		for( hashIndex=0;hashIndex<sectionNum;hashIndex++){
			if(getHashStr()==section[hashIndex].hash){
				break;
			}
		}
		return hashIndex;
	}
	function slideToHash(){
		$body.stop().animate({scrollTop:$section.eq(currentHashIndex).offset().top},500,function(){
			var hashStr=section[currentHashIndex].hash;
			var bodyId=hashStr.charAt(1).toUpperCase()+hashStr.slice(2);
			$('body').attr('class',bodyId);
			fromClick=false;
			firstLoad=false;
		});
	}
	function posNavi(){
		var wst=$(window).scrollTop();
		if(wst>headerHeight){
			$('.navi').removeClass('no-float').addClass('float');
			$header.addClass('hide');
		}else {
			$header.removeClass('hide');
			$('.navi').removeClass('float').addClass('no-float');
		}
	}

})(jQuery);