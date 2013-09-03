/**
 * @filename ebj
 * @extends jquery-1.8.3
 * @fileOverview &#x6D60;&#xFFFD;&#x7B9E;&#x6D60;&#xFFFD;&#x7B9E;
 * @author &#x935B;&#x3125;&#x2589;
 * @email 359378856@qq.com
 * @version 0.1
 * @date 2013-01-10
 * @example
 *    $("a").ebj();
 */
(function($){
	$.fn.win8style=function(options){
		var opts=$.extend({},$.fn.win8style.defaults,options);
		$('body').attr('ondragstart','return false');
		w8s.pagingPosition();
		this.each(function(i,e){
			var $this=$(this);
			var o=$.meta?$.extend({},opts,$this.data()):opts;
			$.fn.win8style.init($this,i,o.margin,o.col,o.during,o.callback);
		});
	}
	$.fn.win8style.init=function($box,boxi,margin,col,during,callback){
		w8s.w8sary.push([]);
		w8s.boxresize($box,margin,w8s.arrange($box,boxi,margin,col,during),callback);
		$.fn.win8style.bind($box,boxi,margin,col,during,callback);
		//alert(w8s.w8sary)
	}
	$.fn.win8style.bind=function($box,boxi,margin,col,during,callback){
		var left,top,x,y;
		$box.on('mousedown','div.w8sapp',function(e){
			if(e.which!=1)return false;
			if($('div.w8sapp',$box).is(':animated'))return false;
			$('div.w8sapp',$box).removeClass('graging');
			x=e.pageX;
			y=e.pageY;
			left=parseInt($(this).css('left'));
			top=parseInt($(this).css('top'));
			$(this).addClass('draging');
		});
		$box.on('mouseup','div.w8sapp',function(e){
			if(e.which!=1)return false;
			if($('div.w8sapp',$box).is(':animated'))return false;
			if(!$(this).hasClass('draging'))return false;
			var $app=$(this);
			var appleft=parseInt($app.css('left'));
			var apptop=parseInt($app.css('top'));
			var seat=w8s.findseat(w8s.findheart($app,appleft,apptop),w8s.w8sary[boxi]);
			var thisid=$app.attr('id');
			var thisidstr=thisid.slice(0,w8s.appID.length+4);
			var intid=parseInt(thisid.slice(w8s.appID.length+4));
			var previd=thisidstr+(intid-1);
			var nextid=thisidstr+(intid+1);
			if(seat.id==thisid||seat.id==previd&&seat.p=='after'||seat.id==nextid&&seat.p=='before'){
				$app.removeClass('draging').animate({'left':left,'top':top},function(){
					$app.removeAttr('moving');
				});
			}else{
				if(seat.p=='after'){
					//alert($app.attr('id')+'----'+seat.id)
					$app.removeClass('draging').removeAttr('moving').insertAfter($('#'+seat.id));
					w8s.boxresize($box,margin,w8s.arrange($box,boxi,margin,col,during));
				}else if(seat.p=='before'){
					$app.removeClass('draging').removeAttr('moving').insertBefore($('#'+seat.id));
					w8s.boxresize($box,margin,w8s.arrange($box,boxi,margin,col,during));
				}
			}
		});
		$box.on('mouseleave','div.w8sapp',function(){
			if($(this).hasClass('draging')){
				$(this).removeClass('draging').removeAttr('moving').animate({'left':left,'top':top},during);
			}
		});
		$box.on('click','div.w8sapp',function(){
			if($(this).attr('moving')=='yes')return false;
			var $this=$(this);
			app.creat($this);
		});
		$box.on('mousemove','div.w8sapp',function(e){
			if(e.which!=1)return false;
			if($('div.w8sapp',$box).is(':animated'))return false;
			if(!$(this).hasClass('draging'))return false;
			$(this).css({'left':left+e.pageX-x,'top':top+e.pageY-y});
			$(this).attr('moving','yes');
			if(e.pageY>w8s.pagtop){
				for(var i=0;i<w8s.paging.length;i++){
					if(w8s.paging[i][0]<e.pageX&&e.pageX<w8s.paging[i][0]+w8s.pagwidth){
						if(!$('#'+w8s.paging[i][1]).hasClass('pagingclicked')){
							var i0=parseInt($('div.pagingnum').find('div.pagingclicked').text());
							var i1=parseInt(w8s.paging[i][1].slice(-1));
							//alert(i0+'---'+i1)
							//var w=$(this).width();
							//var h=$(this).height();
							//$(this).css({'position':'fixed','left':e.pageX-w/2,'top':e.pageY-h/2});
							$(this).removeClass('draging').removeAttr('moving');
							
							//$('#'+w8s.paging[i][1]).click();
							$(this).animate({'opacity':'0'},'swing',function(){
								//var boxleft=$('#w8spag'+i1).offset().left;
								//var boxtop=$('#w8spag'+i1).offset().top;
								//$(this).css({'position':'absolute','left':e.pageX-boxleft-w/2,'top':e.pageY-boxtop-h/2});
								$(this).css('opacity','');
								$(this).appendTo($('#w8spag'+i1));
								w8s.boxresize($('#w8spag'+i0),margin,w8s.arrange($('#w8spag'+i0),i0-1,margin,col,during),callback);
								w8s.boxresize($('#w8spag'+i1),margin,w8s.arrange($('#w8spag'+i1),i1-1,margin,col,during),callback);
								
							});
							return false;
						}
					}
				}
			}
		});
	}
	Array.prototype.del=function(n){
		if(n<0)
			return this;
		else
			return this.slice(0,n).concat(this.slice(n+1,this.length));
	}
	Array.prototype.clone=function(){
		return this.slice(0);  
	}
	String.prototype.zeroize=function(len){
		if(this.length>len)return false;
		var result=this;
		while(true){
			result='0'+result;
			if(result.length==len)return result;
		}
	}
	var app={
		appbox:'#appbox',
		apptask:'#task',
		panel:'apppanel',
		task:'task',
		live:new Array(),
		active:new Array(),
		creat:function($w8sapp){
			if($w8sapp.attr('appstate')=='created')return false;
			$('div.apppanel',$(app.appbox)).hide();
			var index=parseInt($w8sapp.attr('id').slice(w8s.appID.length));
			var $panel=$('<div class="apppanel" id="'+this.panel+index+'">'+
						 '	<img alt="" src="img/apppanel.png" class="apppanelimg">'+
						 '	<div>'+
						 '		<div class="appphead">'+
						 '			<table class="appctrltable">'+
						 '				<tr>'+
						 '					<td><img alt="" src="img/minico.png" class="min"></td>'+
						 '					<td><img alt="" src="img/whatico.png"></td>'+
						 '					<td><img alt="" src="img/xico.png" class="xx"></td>'+
						 '				</tr>'+
						 '			</table>'+
						 '			<div class="appptit">'+$w8sapp.find('div.appname').text()+'</div>'+
						 '		</div>'+
						 '	</div>'+
						 '</div>');
			var $task=$('<div class="taskone" id="'+this.task+index+'">'+
						'	<table>'+
						'		<tr>'+
						'			<td><img alt="" src="img/appico/ssmapico.png"></td>'+
						'			<td valign="bottom">'+$w8sapp.find('div.appname').text()+'</td>'+
						'		</tr>'+
						'	</table>'+
						'</div>');
			$(app.appbox).append($panel);
			$(app.apptask).append($task);
			$panel.find('img.xx').on('click',function(){
				app.del(index); 
			});
			$panel.find('img.min').on('click',function(){
				app.min(index);
			});
			$task.on('click',function(){
				app.min(app.active[0],index);
			});
			$w8sapp.attr('appstate','created');
			this.live.unshift(index);
			this.active.unshift(index);
		},
		del:function(index){
			$('#'+this.panel+index).remove();
			$('#'+this.task+index).remove();
			$('#'+w8s.appID+index).removeAttr('appstate');
			for(var i=0;i<this.live.length;i++){
				if(this.live[i]==index){
					this.live.shift();
					this.active.shift();
					break;
				}
			}
			if(this.active.length<1)return false;
			$('#'+this.panel+this.active[0]).show();
		},
		min:function(hideindex,showindex){
			if(showindex==null){
				$('#'+this.panel+hideindex).hide();
				this.active.shift();
			}else if(hideindex==undefined){
				this.active.unshift(showindex);
				$('#'+this.panel+this.active[0]).show();
			}else{
				$('#'+this.panel+this.active[0]).hide();
				this.active.push(this.active.shift());
				this.active.unshift(showindex);
				$('#'+this.panel+this.active[0]).show();
			}
		}
	}
	var w8s={
		appID:'w8sapp',
		w8sary:new Array(),
		paging:new Array(),
		pagwidth:0,
		pagheight:0,
		pagtop:0,
		arrange:function($box,boxi,margin,col,during){
			w8s.w8sary[boxi].length=0;
			//var appID=w8s.appID+'_'+boxi.toString().zeroize(2)+'_';
			var colary=new Array(col);
			for(var i=0;i<colary.length;i++){
				colary[i]=[0];
			}
			var squarewidth=$.fn.win8style.defaults.squarewidth;
			var squareheight=$.fn.win8style.defaults.squareheight;
			var retanglewidth=squarewidth*2+margin;
			var bigsquareheight=squareheight*2+margin;
			$('div.w8sretangle',$box).width(retanglewidth);
			$('div.w8sbigsquare',$box).width(retanglewidth); 
			$('div.w8sbigsquare',$box).height(bigsquareheight);
			var index;
			$box.children('div').each(function(i,e){//锟斤拷锟斤拷锟斤拷锟叫凤拷锟斤拷
				//alert(colary)
				index=ar.findMinAry(colary);//锟斤拷锟斤拷锟�
				if($(e).hasClass('w8ssquare')){//锟斤拷锟斤拷锟叫★拷锟斤拷锟�
					var left1=(squarewidth+margin)*index+margin;
					var top1=colary[index][0]+margin;
					$(e).animate({'left':left1,'top':top1},during);
					var prev1=colary[index].shift();
					if(colary[index].length==0){
						colary[index].push(squareheight+margin+prev1);
					} 
					var ary1=[left1,top1+squareheight/2,left1+squarewidth,top1+squareheight/2,$(e).attr('id')];
					w8s.w8sary[boxi].push(ary1);
				}else if($(e).hasClass('w8sretangle')){//锟斤拷锟斤拷浅锟斤拷锟斤拷锟�
					var temary=colary.clone();//锟斤拷隆锟斤拷锟斤拷
					for(var v=0;v<temary.length;v++){//去锟斤拷漏锟斤拷
						temary[v]=[temary[v][temary[v].length-1]];
					}
					index=ar.findMinAry(temary);//锟斤拷锟斤拷锟�
					//锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟揭伙拷谢锟斤拷锟斤拷锟斤拷锟叫碉拷锟斤拷一锟叫憋拷锟斤拷
					while(index==col-1||temary[index+1][temary[index+1].length-1]>temary[index][temary[index].length-1]){
						//锟节革拷锟叫诧拷锟斤拷一锟斤拷小锟斤拷锟斤拷
						temary[index].push(temary[index][temary[index].length-1]+margin+squareheight);
						temary[index].shift();//去锟斤拷锟斤拷锟叫碉拷一锟斤拷
						index=ar.findMinAry(temary);//锟斤拷锟斤拷锟�
					}
					//alert(colary+'----'+temary)
					var left2=(squarewidth+margin)*index+margin;//锟斤拷锟斤拷锟�
					var top2=temary[index][temary[index].length-1]+margin;//锟斤拷锟斤拷锟�
					$(e).animate({'left':left2,'top':top2},during);//锟斤拷id锟斤拷锟狡讹拷锟斤拷锟斤拷应位锟斤拷
					if(colary[index][colary[index].length-1]==top2-margin){
						colary[index].pop();
					}
					if(colary[index+1][colary[index+1].length-1]==top2-margin){
						colary[index+1].pop();
					}
					colary[index].push(top2+squareheight);
					colary[index+1].push(top2+squareheight);
					var ary2=[left2,top2+squareheight/2,left2+retanglewidth,top2+squareheight/2,$(e).attr('id')];
					w8s.w8sary[boxi].push(ary2);
				}else if($(e).hasClass('w8sbigsquare')){//锟斤拷锟斤拷谴蠓娇锟�
					var temary2=colary.clone();
					for(var vv=0;vv<temary2.length;vv++){
						temary2[vv]=[temary2[vv][temary2[vv].length-1]];
					}
					index=ar.findMinAry(temary2);//锟斤拷锟斤拷锟�
					while(index==col-1||temary2[index+1][temary2[index+1].length-1]>temary2[index][temary2[index].length-1]){
						temary2[index].push(temary2[index][temary2[index].length-1]+margin+squareheight);
						temary2[index].shift();
						index=ar.findMinAry(temary2);//锟斤拷锟斤拷锟�
					}
					var left3=(squarewidth+margin)*index+margin;
					var top3=temary2[index][temary2[index].length-1]+margin;
					$(e).animate({'left':left3,'top':top3},during);
					if(colary[index][colary[index].length-1]==top3-margin){
						colary[index].pop();
					}
					if(colary[index+1][colary[index+1].length-1]==top3-margin){
						colary[index+1].pop();
					}
					colary[index].push(top3+bigsquareheight);
					colary[index+1].push(top3+bigsquareheight);
					var ary3=[left3,top3+bigsquareheight/2,left3+retanglewidth,top3+bigsquareheight/2,$(e).attr('id')];
					w8s.w8sary[boxi].push(ary3);
				}
			});
			return colary;
		},
		boxresize:function($box,margin,colary,callback){
			var col=$.fn.win8style.defaults.col;
			var swidth=$('div.w8ssquare').width();
			var sheight=$('div.w8ssquare').height();
			var boxwidth=swidth*col+margin*(col+1);
			var boxheight=colary[ar.findMaxAry(colary)][0]+margin;
			$box.width(boxwidth).height(boxheight);
			if(callback!=null){
				callback();
			}
		},
		findheart:function(appbox,left,top){
			var p={};
			var w=appbox.width();
			var h=appbox.height();
			p.x=left+w/2;
			p.y=top+h/2;
			return p;
		},
		findseat:function(heart,ary){
			var result={};
			var diff=Math.abs(heart.y-ary[0][1]);//偏锟斤拷值
			var rowary=new Array();
			for(var m=1;m<ary.length;m++){
				if(diff>Math.abs(heart.y-ary[m][1])){
					diff=Math.abs(heart.y-ary[m][1]);
				}
			}
			for(var n=0;n<ary.length;n++){
				if(diff==Math.abs(heart.y-ary[n][1])){
					rowary.push(n);
				}
			}
			var dx1=Math.abs(heart.x-ary[rowary[0]][0]);
			var cxi1;//锟斤拷咏锟絰值锟斤拷锟斤拷锟斤拷锟铰憋拷
			for(var l=1;l<rowary.length;l++){
				if(dx1>Math.abs(heart.x-ary[rowary[l]][0])){
					dx1=Math.abs(heart.x-ary[rowary[l]][0]);
				}
			}
			for(var k=0;k<rowary.length;k++){
				if(dx1==Math.abs(heart.x-ary[rowary[k]][0])){
					cxi1=rowary[k];
					break;
				}
			}
			var dx2=Math.abs(heart.x-ary[rowary[0]][2]);
			var cxi2;//锟斤拷咏锟絰值锟斤拷锟斤拷锟斤拷锟铰憋拷
			for(var j=1;j<rowary.length;j++){
				if(dx2>Math.abs(heart.x-ary[rowary[j]][2])){
					dx2=Math.abs(heart.x-ary[rowary[j]][2]);
				}
			}
			for(var h=0;h<rowary.length;h++){
				if(dx2==Math.abs(heart.x-ary[rowary[h]][2])){
					cxi2=rowary[h];
					break;
				}
			}
			if(dx1<dx2){
				result.p='before';
				result.id=ary[cxi1][4];
			}else{
				result.p='after';
				result.id=ary[cxi2][4];
			}
			return result;
		},
		pagingPosition:function(){
			$('div.pagingone').each(function(i,e){
				var ary=new Array();
				ary[0]=$(e).offset().left;
				ary[1]=$(e).attr('id');
				w8s.paging.push(ary);
			});
			w8s.pagtop=$('div.pagingone').offset().top;
			w8s.pagwidth=$('div.pagingone').width();
			w8s.pagheight=$('div.pagingone').height();
		}
	}
	var ar={
		/**
		 * 锟饺较讹拷维锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷牡锟揭伙拷睿拷锟斤拷锟斤拷锟叫★拷锟斤拷歉锟斤拷锟斤拷锟斤拷椋拷锟斤拷锟叫讹拷锟斤拷锟叫★拷蚍祷锟斤拷卤锟斤拷锟叫★拷锟斤拷锟斤拷锟斤拷锟�
		 */
		findMinAry:function(twoary,exclude){
			var ii=0;
			var temp=twoary[0][0];
			for(var i=1;i<twoary.length;i++){
				if(i==exclude)continue;
				if(twoary[i][0]<temp){
					temp=twoary[i][0];
					ii=i;
				}
			}
			return ii;
		},
		/**
		 * 锟饺较讹拷维锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷牡锟揭伙拷睿拷锟斤拷锟斤拷锟斤拷锟斤拷歉锟斤拷锟斤拷锟斤拷椋拷锟斤拷锟叫讹拷锟斤拷锟斤拷锟津返伙拷锟铰憋拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷
		 */
		findMaxAry:function(twoary,exclude){
			var ii=0;
			var temp=twoary[0][0];
			for(var i=1;i<twoary.length;i++){
				if(i==exclude)continue;
				if(twoary[i][0]>temp){
					temp=twoary[i][0];
					ii=i;
				}
			}
			return ii;
		}
	}
	$.fn.win8style.defaults={
		squarewidth:58,
		squareheight:55,
		margin:8,
		col:4,
		during:500,
		callback:function(){;}
	}
})(jQuery);
/*$(function(){
	$('div.win8style').win8style();
});*/