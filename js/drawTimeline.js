(function($){
	//draw Dashline
	var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
	if (CP && CP.lineTo){
		CP.dashedLine = function(x,y,x2,y2,dashArray){
			if (!dashArray) dashArray=[10,5];
			if (dashLength==0) dashLength = 0.001; // Hack for Safari
			var dashCount = dashArray.length;
			this.moveTo(x, y);
			var dx = (x2-x), dy = (y2-y);
			var slope = (dx!=0) ? dy/dx : 90;
			var distRemaining = Math.sqrt( dx*dx + dy*dy );
			var dashIndex=0, draw=true;
			while (distRemaining>=0.1){
				var dashLength = dashArray[dashIndex++%dashCount];
				if (dashLength > distRemaining) dashLength = distRemaining;
				var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
				if (dx<0) xStep = -xStep;
				x += xStep
				y += slope*xStep;
				this[draw ? 'lineTo' : 'moveTo'](x,y);
				distRemaining -= dashLength;
				draw = !draw;
			}
		}
	}
	
	//stroke Dash Circle
	/*function calcPointsCirc( cx,cy, rad, dashLength){
		var n = rad/dashLength,
		alpha = Math.PI * 2 / n,
		pointObj = {},
		points = [],
		i = -1;
		
		while( i < n ){
			var theta = alpha * i,
			theta2 = alpha * (i+1);
			points.push({x : (Math.cos(theta) * rad) + cx, y : (Math.sin(theta) * rad) + cy, ex : (Math.cos(theta2) * rad) + cx, ey : (Math.sin(theta2) * rad) + cy});
			i+=2;
		}              
		return points;            
	} */

	//wrap context
	function wrapText(context, text, x, y, maxWidth, lineHeight) {
		var words = text.split(' ');
		var line = '';
		var lineCounter=1;
		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
				lineCounter++;
			}
			else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
		return (lineCounter*lineHeight+5);
	}
	
	function Timeline(element,settings){
		var container_width,
			ctx=document.getElementById(element.id).getContext('2d'),
			tlAry=[
				{yearFrom:'1994',yearEnd:'1998',title:'Bachelor of Arts in Industrial Design',com:'National CHENG KUNG University, Taiwan',desc:'Graduated: Jun 1998'},
				{yearFrom:'1998',yearEnd:'2000',title:'To Serve as A Soldier',com:'',desc:''},
				{yearFrom:'2000',yearEnd:'2003',title:'CG Designer',com:'SUNNET Technology Co.,Ltd.',desc:'Implementing modeling, fx, lighting, rendering and CG animation for the computer game “Thunder Area”.'},
				{yearFrom:'2003',yearEnd:'2004',title:'Studying in Graduate School',com:'National Taiwan University, Taiwan',desc:'Attended'},
				{yearFrom:'2004',yearEnd:'Present',title:'Senior Web Designer',com:'Fortune Motors Co.,Ltd.',desc:'Was responsible for layout, UI/UX and HTML/CSS design. Clients included Mercedes-Benz, Allianz, Qsquare, MOS Burger, Verico, Senao, Neogence...'},
				{yearFrom:'Present',yearEnd:'Present',title:'',com:'',desc:''}
			],
			tlNum=tlAry.length,
			radius_inner=14,
			radius_outer=20,
			circleBorderWidth=5,
			firstCircleY=50+radius_outer+circleBorderWidth,
			lastCircleY,
			timelinePosX=120,
			minGap=50,
			yearPosX=timelinePosX+radius_outer+circleBorderWidth*5,
			canvas={width:0, height:0};
			
		$(element).data('timeline',this);
		drawTimeline();

		this.resizeCanvas=function(){
			drawTimeline();
		}
		
		function drawTimeline(){
			container_width=settings.container.width();
			canvas={width:container_width, height:0};
			
	

			//set canvas for normal/retina display
			element.width=canvas.width*devicePixelRatio;
			element.height=fillContent(tlAry)*devicePixelRatio;
			ctx.scale(devicePixelRatio,devicePixelRatio);
			$(element).width(canvas.width);
			$(element).height(canvas.height);

			//fill content
			fillContent(tlAry);

			//timeline header
			var firstRun=true;
			var contextTitle={text:'Timeline',x:40,y:16};
			var timeIcon = new Image();
			ctx.font='1.2em "Fjalla One"';
			ctx.fillStyle='#333333';
			ctx.fillText(contextTitle.text, contextTitle.x, contextTitle.y);
			timeIcon.onload=drawIcon;
			timeIcon.src='images/icon-time.svg';
			if(!firstRun){
				drawIcon();
			}
			function drawIcon(){
				ctx.drawImage(timeIcon,contextTitle.x-34,0,30,30);
			}
	
			/*if(getHashStr()=='#about'){
				$('body').stop().animate({scrollTop:$(element).offset().top-100});
			}*/
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
		function fillContent(tlAry){
			var circleOrigin={x:0,y:0},yearHeight=0,titleHeight=0,comHeight=0,descHeight=0;
			var maxWrapWidth=canvas.width-timelinePosX-radius_outer*2;
			var curItemY=firstCircleY;
			var nextItemY=firstCircleY;
			var yearPosX=timelinePosX-70;
			ctx.textAlign='start';
			ctx.textBaseline='middle'; 
			for(var i=0;i<tlNum;i++){
				circleOrigin={
					x:timelinePosX,
					y:curItemY
				};
				ctx.save();

				//draw year background
				ctx.strokeStyle='#888';
				ctx.lineWidth=radius_outer+4;
				ctx.lineCap='round';
				ctx.beginPath();
				ctx.moveTo(yearPosX-5,circleOrigin.y);
				ctx.lineTo(circleOrigin.x,circleOrigin.y);
				ctx.stroke();

				ctx.font='300 0.9em "Fjalla One"';
				ctx.fillStyle='#FFFFFF';
				yearHeight=wrapText(ctx,tlAry[i].yearFrom,yearPosX,circleOrigin.y,maxWrapWidth,20);
				
				ctx.font='1.3em "Fjalla One"';
				ctx.fillStyle='#000';
				titleHeight=wrapText(ctx,tlAry[i].title,circleOrigin.x+radius_outer+10,circleOrigin.y,maxWrapWidth,24);
				
				ctx.font='1em AvenirNextCondensed-DemiBold, "Arial Narrow"';
				ctx.fillStyle='#333';
				comHeight=wrapText(ctx,tlAry[i].com,circleOrigin.x+radius_outer+10,circleOrigin.y+titleHeight,maxWrapWidth,20);
				
				ctx.font='0.9em Arial';
				ctx.fillStyle='#666';
				descHeight=wrapText(ctx,tlAry[i].desc,circleOrigin.x+radius_outer+10,circleOrigin.y+titleHeight+comHeight,maxWrapWidth,20);

				ctx.restore();
				
				//draw timeline cirle
				ctx.save();
				ctx.beginPath();
				ctx.fillStyle='#888';
				ctx.arc(circleOrigin.x,circleOrigin.y,radius_outer,0,Math.PI*2);
				ctx.fill();
				ctx.beginPath();
				ctx.fillStyle='#FFF';
				ctx.arc(circleOrigin.x,circleOrigin.y,radius_inner,0,Math.PI*2);
				ctx.fill();
				ctx.restore();

				nextItemY=curItemY+titleHeight+comHeight+descHeight+20;
				
				//timeline axis
				ctx.save();
				ctx.lineWidth=3;
				ctx.lineCap='round';
				
				if(i<tlNum-1){
					ctx.beginPath();
					ctx.strokeStyle='#888';
					ctx.moveTo(timelinePosX,circleOrigin.y+radius_outer);
					ctx.lineTo(timelinePosX,nextItemY);
					ctx.stroke();
				}else{
					ctx.beginPath();
					var grd=ctx.createLinearGradient(timelinePosX,circleOrigin.y+radius_outer,timelinePosX,canvas.height);
					grd.addColorStop(0,'rgba(102,102,102,0.7)');
					grd.addColorStop(1,'rgba(102,102,102,0)');
					ctx.strokeStyle=grd;
					ctx.dashedLine(timelinePosX,circleOrigin.y+radius_outer,timelinePosX,nextItemY,[15,8,1,8]);
					ctx.stroke();
				}
				ctx.restore();
				
				if(nextItemY > canvas.height){
					canvas.height=nextItemY;
				}
				curItemY=nextItemY;
				}
			return canvas.height;
		}
		
	}

	var devicePixelRatio=window.devicePixelRatio||1;
	$.fn.timeline=function(options){
		var settings=$.extend({
				container:$(window)
			},options);
		return this.each(function(){
			new Timeline(this,settings);
		})
	}
	
})(jQuery);