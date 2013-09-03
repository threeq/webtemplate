$(document).ready(function() {
  // 初始化页面
  initPage();
});

// 初始化页面方法
function initPage() {
	$('[data-toggle=offcanvas]').click(function() {
	  	$('.row-offcanvas').toggleClass('active');
  	});
 	$('#main-nav a').click(function(){
		$('#main-nav li').removeClass('active');
		$(this).parent().addClass('active');
  	});
	showPage('test-welcome.htm');
};
// 显示子页面
function showPage(url) {
	loadHtml(url, function(html){
		$('#mainPanel').html(html);
	});
}

function showQueryConditions(text, params) {
	var defaultP = {
		removedEnd:function(){},
		removeBefore:function(){}
	};
	params = defaultP || params;
	if($("#queryCond"+text).length>0)
		return;
	var showText = '<a id="queryCond'+text+'" class="queryCondShow">'+text+'&nbsp;&nbsp;<span class="glyphicon glyphicon-remove" style="cursor:pointer;" onclick="removeDOM(\'#queryCond'+text+'\')" data-opts="'+JSON.stringify(defaultP)+'"></span></a>'
	addDOM($(showText), '#queryNav', 'before');
}
