$(document).ready(function() {
  // 初始化页面
  initPage();
});

// 初始化页面方法
function initPage() {
	$("#leftMenuContainer").mCustomScrollbar({
		scrollButtons:{
			enable:true
		},
		theme:"dark-thick"
	});
	$('[data-toggle=offcanvas]').click(function() {
	  	$('.row-offcanvas').toggleClass('active');
  	});
 	$('#main-nav a').click(function(){
		$('#main-nav li').removeClass('active');
		$(this).parent().addClass('active');
  	});
 	$('label.tree-toggler').click(function () {
 		$self = $(this);
		$(this).parent().children('ul.tree').toggle(300,function(){
			$("#leftMenuContainer").mCustomScrollbar("update");
			if($(this).is(":hidden")) {
				$self.find('.glyphicon').removeClass('glyphicon-chevron-down');
				$self.find('.glyphicon').addClass('glyphicon-chevron-right');
			} else {
				$self.find('.glyphicon').removeClass('glyphicon-chevron-right');
				$self.find('.glyphicon').addClass('glyphicon-chevron-down');
			}
		});
	});
 	$('label.tree-toggler').click();
 	
	// 显示欢迎页面
 	//showPage('welcome.htm');
 	//loadJson('manage/leftMenu.html', function(data){
 		//alert(data);
 	//});
};

function showLeftMenu(data) {
	
}

// 显示子页面
function showPage(url) {
	loadHtml(url, function(html){
		$('#mainPanel').html(html);
	});
}
// 显示查询条件
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
