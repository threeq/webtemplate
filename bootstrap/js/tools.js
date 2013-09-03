// iframe自适应高度
function SetWinHeight(obj) 
{ 
	var win=obj; 
	if (document.getElementById) 
	{ 
		if (win && !window.opera) 
		{ 
			if (win.contentDocument && win.contentDocument.body.offsetHeight) 
				win.height = win.contentDocument.body.offsetHeight; 
			else if(win.Document && win.Document.body.scrollHeight) 
				win.height = win.Document.body.scrollHeight; 
		} 
	} 
} 
// iframe自适应高度
function dyniframesize(down) { 
	var pTar = null; 
	if (document.getElementById){ 
		pTar = document.getElementById(down); 
	} 
	else{ 
		eval('pTar = ' + down + ';'); 
	} 

	if (pTar && !window.opera){ 
	//begin resizing iframe 
		//pTar.style.display="block";
		if (pTar.contentDocument && pTar.contentDocument.body.offsetHeight){ 
		//ns6 syntax 
			pTar.height = pTar.contentDocument.body.offsetHeight +20; 
			pTar.width = pTar.contentDocument.body.scrollWidth+20; 
		} 
		else if (pTar.Document && pTar.Document.body.scrollHeight){ 
		//ie5+ syntax 
			pTar.height = pTar.Document.body.scrollHeight; 
			pTar.width = pTar.Document.body.scrollWidth; 
		} 
	} 
} 
// 加载html
function loadHtml(url, loadedFun) {
	$.ajax({
		url: url,
		dataType: 'html',
		success:loadedFun
	});
}
// 移除DOM元素
function removeDOM(selector){
	$(selector).remove();
}

function addDOM($DOM, selector, type) {
	$DOM.insertBefore(selector);
}
