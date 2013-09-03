/**
 * @filename ebj
 * @extends jquery-1.8.3
 * @fileOverview 
 * @author 
 * @email 359378856@qq.com
 * @version 0.1
 * @date 2013-01-10
 * @example
 *    $("a").ebj();
 */
(function($){
	$.fn.ebjscroll=function(options){
		var opts=$.extend({},$.fn.ebjscroll.defaults,options);
		$('body').attr('ondragstart','return false');
		this.each(function(i,e){
			$this=$(this);
			var o=$.meta?$.extend({},opts,$this.data()):opts;
			var bartoplimit;
			var bodytoplimit;
			var imgheight;
			var conheight;
			var width=o.width==0?$this.width()+20:o.width;
			var height=o.height==0?$this.height():o.height;
			$.fn.ebjscroll.struct($this,i,width,height);
			$.fn.ebjscroll.bind($this,i);
		});
		return this;
	}
	$.fn.ebjscroll.struct=function($scrolldiv,index,width,height){
		$scrolldiv.width(width);
		$scrolldiv.height(height);
		$scrolldiv.wrapInner('<div class="ebjscrollinner"></div>');
		var $inner=$scrolldiv.children('div');
		$inner.wrapInner('<div class="ebjscrollcon" id="esc'+index+'"></div>');
		var $con=$inner.children('div');
		conheight=$con.height();//内容高度
		var innerheight=$scrolldiv.innerHeight();//scrolldiv内部高度
		$inner.height(innerheight);
		var $scrollimg=$('<img alt="" src="ebjscroll/img/ebjscrollbg.png" class="ebjscrollimg">');
		imgheight=innerheight*innerheight/conheight;
		$scrollimg.height(imgheight);
		bartoplimit=innerheight-imgheight;
		bodytoplimit=innerheight-conheight;
		if(conheight>innerheight){
			$inner.append($scrollimg);
		}
	}
	$.fn.ebjscroll.bind=function($scrolldiv,index){
		var top,y;
		$('img.ebjscrollimg',$scrolldiv).hover(function(){
			$(this).css('opacity',0.7);
		},function(){
			$(this).css('opacity',1);
		});
		$('img.ebjscrollimg',$scrolldiv).on('mousedown',function(e){
			$(this).attr('drag','yes');
			top=parseInt($(this).css('top'));
			y=e.pageY;
		});
		$('img.ebjscrollimg',$scrolldiv).on('mouseup',function(){
			$(this).removeAttr('drag');
		});
		$('img.ebjscrollimg',$scrolldiv).on('mouseleave',function(){
			$(this).removeAttr('drag');
		});
		$('img.ebjscrollimg',$scrolldiv).on('mousemove',function(e){
			if(e.which!=1)return false;
			if($(this).attr('drag')!='yes')return false;
			var calcimg=top+e.pageY-y;
			var calccon=-calcimg*conheight/imgheight;
			if(calcimg<=0||calcimg>=bartoplimit)return false;
			$(this).css('top',calcimg);
			$('div.ebjscrollcon',$scrolldiv).css('top',calccon);
		});
		/*$('div.ebjscrollcon',$scrolldiv).on('mousewheel',function(e){
			//alert(e.detail)
			//a.wheel(20,0,bodytoplimit,$('div.ebjscrollcon',$scrolldiv),$('img.ebjscrollimg',$scrolldiv));
		});*/
		var scr=0;
		document.getElementById('esc'+index).onmousewheel=function(e){
			e=e||window.event;
			d=e.wheelDelta||e.detail;
			if(d<0){
				scr-=20;
			}else{
				scr+=20;
			}
			if(scr>0)scr=0;
			if(scr<bodytoplimit)scr=bodytoplimit
			a.wheel(scr,0,bodytoplimit,$('div.ebjscrollcon',$scrolldiv),$('img.ebjscrollimg',$scrolldiv));
		}
	}
	var a={
		wheel:function(distance,uplimit,downlimit,$body,$scrollbar){
			if(distance<downlimit||distance>uplimit)return false;
			$body.css('top',distance);
			$scrollbar.css('top',-distance*$scrollbar.height()/$body.height());
		}
	}
	$.fn.ebjscroll.defaults={
		width:0,
		height:0
	}
})(jQuery);
/*$(function(){
	$('div.ebjscroll').ebjscroll();
});*/



