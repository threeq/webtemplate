$(function(){
	var leftdheight=wd.height-$('div.leftup').height()-$('div.paging').height();
	var rightdheight=wd.height-$('div.plugarea').height()-34;
	$('#appbox').height(rightdheight);
	$('div.win8style').win8style();
	$('div.ebjscroll').ebjscroll({
		height:leftdheight-30
	});
	$('input.searchinput').ebjhint();
	$('div.pagingone').on('click',function(){
		if($('#w8sanimal').is(':animated'))return false;
		var $this=$(this);
		var distance=$('div.ebjscroll').width();
		var index=parseInt($(this).text())-1;
		var $animal=$('#w8sanimal');
		paging(distance,index,$animal);
		$('div.pagingone').removeClass('pagingclicked');
		$this.addClass('pagingclicked');
	});
});
function paging(distance,index,$animal){
	$animal.animate({'left':-distance*index},'swing');
}
var wd={
	width:document.documentElement.clientWidth||document.body.offsetWidth||window.innerWidth,
	height:document.documentElement.clientHeight||document.body.offsetHeight||window.innerHeight
}