(function($){
	function RingChart(element,settings){
		var container_width,
			skills=[
				{percent:92,name:'Web Visiual Design'},
				{percent:90,name:'Responsive Web Design'},
				{percent:66,name:'Single Page Application'},
				{percent:85,name:'User eXperience'},
				{percent:50,name:'Graphic Design'},
				{percent:75,name:'Mockup'},
				{percent:78,name:'Front-end Programing'},
				{percent:76,name:'3D Animation'},
				{percent:70,name:'Flash Animation'},
				{percent:92,name:'HTML 4/5'},
				{percent:95,name:'CSS/LESS/SASS'},
				{percent:78,name:'jQuery'},
				{percent:75,name:'Flash / ActionScript2'},
				{percent:85,name:'Photoshop'},
				{percent:45,name:'Illustrator'},
				{percent:92,name:'Dreamweaver'},
				{percent:75,name:'3DS Max'},
				{percent:65,name:'Maya'}
			],
			ctx=document.getElementById(element.id).getContext('2d'),
			startAngle=new Array(),
			endAngle=new Array(),
			radians=Math.PI/6,
			radius_level,
			radius_outer,
			radius_inner,
			radius_outerSkillItem,
			radius_innerSkillItem,
			radius_center,
			level=['Excellent','Good','Average','Fair','Poor'],
			canvas={width:0, height:0},
			arcOrigin={x:0, y:0};
			lineTexture=new Image(),
			skillsNum=skills.length,
			borderWidth=14,
			gap=4,
			largeCanvas=true,
			firstRun=true;

		$(element).data('ringChart', this);
		drawRingChart();
		
		this.resizeCanvas=function(){
			drawRingChart();
		}

		function drawRingChart(){
			container_width=settings.container.width();
			largeCanvas=(container_width>768);
			radius_level=(largeCanvas) ? 500 : container_width/2+30;
			radius_outer=(largeCanvas) ? radius_level-60 : radius_level-30;
			radius_inner=(largeCanvas) ? 80 : 50;
			radius_outerSkillItem=(largeCanvas) ? radius_level-110 : radius_level-container_width/10;
			radius_innerSkillItem=radius_inner/3;
			radius_center=(largeCanvas) ? 30 : 25;
			gap=(largeCanvas) ? 5 : 3;
			borderWidth=Math.floor((radius_outerSkillItem-radius_innerSkillItem)/skillsNum)-gap;
			canvas={
				width:container_width,
				height:radius_level+200
			};
			arcOrigin={
				x:canvas.width/2,
				y:radius_level
			};
			
			//set canvas for normal/retina display
			element.width=canvas.width*devicePixelRatio;
			element.height=canvas.height*devicePixelRatio;
			ctx.scale(devicePixelRatio,devicePixelRatio);
			$(element).width(canvas.width);
			$(element).height(canvas.height);
			
			ctx.font='0.8em Arial';
			ctx.strokeStyle='#CCC';
			ctx.lineWidth=1;
			ctx.translate(arcOrigin.x,arcOrigin.y);
			
			//draw line with texture
			lineTexture.onload = textureFill;
			lineTexture.src = 'images/border1.png';
			if(!firstRun){
				textureFill();
			}
			
			//guidelines & level text
			ctx.textAlign='end';
			for(var i=0;i<5;i++){
				ctx.beginPath();
				ctx.moveTo(radius_inner*Math.cos(-(i+1)*radians),radius_inner*Math.sin(-(i+1)*radians));
				ctx.lineTo(radius_level*Math.cos(-(i+1)*radians),radius_level*Math.sin(-(i+1)*radians));
				ctx.stroke();
				ctx.save();
				ctx.rotate(-(i+1)*radians);
				ctx.fillText(level[i],radius_level,-5);
				ctx.restore();
			}
			
			//locate fields & technologies
			ctx.save();
			ctx.lineWidth=3;
			ctx.textAlign='center';
			ctx.lineCap='square';
			var lineStart=-radius_outerSkillItem-borderWidth/2;
			ctx.beginPath();
			ctx.fillStyle='hsla(100,50%,40%,1)';
			ctx.strokeStyle='hsla(100,50%,40%,1)';
			ctx.moveTo(lineStart, 170);
			ctx.lineTo(lineStart+9*(borderWidth+gap),170);
			ctx.stroke();
			ctx.fillText('Fields',lineStart+4.5*(borderWidth+gap), 190);
			lineStart=lineStart+9*(borderWidth+gap)+gap;
			ctx.beginPath();
			ctx.fillStyle='hsla(200,50%,40%,1)';
			ctx.strokeStyle='hsla(200,50%,40%,1)';
			ctx.moveTo(lineStart, 150);
			ctx.lineTo(lineStart+9*(borderWidth+gap),150);
			ctx.stroke();
			ctx.fillText('Technologies',lineStart+4.5*(borderWidth+gap), 170);
			ctx.restore();
			
			//draw arc of each skill
			ctx.lineWidth=borderWidth;
			for(var i=0;i<skillsNum;i++){
				startAngle.push(Math.PI);
				endAngle.push(Math.PI);
				drawArc(i,firstRun);
			}
			
			//draw center circle
			ctx.save();
			ctx.fillStyle='#999999';
			ctx.beginPath();
			ctx.lineCap='square';
			ctx.lineWidth=0;
			ctx.arc(0,0,radius_center,0,2*Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.lineWidth=10;
			ctx.strokeStyle='#FFFFFF';
			ctx.moveTo(0,-radius_center+15);
			ctx.lineTo(0,radius_center-15);
			ctx.moveTo(radius_center-15,0);
			ctx.lineTo(-radius_center+15,0);
			ctx.stroke();
			ctx.restore();
			
			/*if(getHashStr()=='#skills'){
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
		function textureFill(){
			firstRun=false;
			ctx.save();
			var brush_dotted = ctx.createPattern(lineTexture, 'repeat');  
			ctx.strokeStyle = brush_dotted;
			ctx.lineWidth=10;
			ctx.beginPath();
			ctx.arc(0,0,radius_outer,Math.PI,0*Math.PI);
			ctx.stroke();
			ctx.restore();
		}
		
		function drawArc(j,firstRun){
			var percent=skills[j].percent;
			var color=(j<9) ? hsla(100,100-percent, 40, percent) : hsla(200,100-percent, 50, percent);

			//locate each skill name
			ctx.save();
			ctx.textAlign='start';
			ctx.fillStyle=color;
			ctx.rotate(Math.PI/2);
			ctx.fillText(skills[j].name,5,radius_outerSkillItem-j*(borderWidth+gap)+5);
			ctx.restore();

			
			if(!firstRun){
				//draw static arcs
				ctx.strokeStyle=color;
				ctx.beginPath();
				ctx.arc(0,0,radius_outerSkillItem-j*(borderWidth+gap),Math.PI,(percent+100)*Math.PI/100);
				ctx.stroke();
			}else{
				//animate arcs
				var arcInt=setInterval(function(){
					ctx.strokeStyle=color;
					endAngle[j]+=(Math.PI/30);
					if(endAngle[j]<=(percent+100)*Math.PI/100){
						ctx.beginPath();
						ctx.arc(0,0,radius_outerSkillItem-j*(borderWidth+gap),startAngle[j],endAngle[j]);
						ctx.stroke();
						startAngle[j]=endAngle[j];
					}else{
						clearInterval(arcInt);
						//console.count('clearInterval');
						if(j==skillsNum){
							firstRun=false;
						}
						startAngle[j]=Math.PI;
						endAngle[j]=Math.PI;
					}
				},10);
			}
			
		}
		//h:0~360, s:0~100, l:0~100, a:0~100, ex:hsla(200,50,40,1);
		function hsla(h,s,l,a){
			if(h>360) h=360;
			if(s<40) s=40;
			if(l>100) l=100;
			if(a<50) a=50;
			return 'hsla('+ h +','+ s +'%,'+ l +'%,'+ a/100 +')';
		}
	}
	
	
	var devicePixelRatio=window.devicePixelRatio||1;
	$.fn.ringChart=function(options){
		var settings=$.extend({
				container:$(window)
			}, options); 
		return this.each(function() {
			new RingChart(this, settings);
		});  
	}
})(jQuery);
