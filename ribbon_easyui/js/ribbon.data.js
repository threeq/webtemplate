
var ribbon_template =
'<ul class="ribbon">																						'+
'	<li>																									'+
'		<ul class="orb">																					'+
'			<a href="javascript:void(0);" accesskey="{orbaccesskey}" class="orbButton">&nbsp;</a>			'+
'			<li><span>{orbtitle}</span>																		'+
'				<ul> {orbMenuList} </ul>																	'+
'			</li>																							'+
'		</ul>																								'+
'	</li>																									'+
'	<li>																									'+
'		<ul class="menu">																					'+
'			{menuMenuList}																					'+
'		</ul>																								'+
'	</li>																									'+
'</ul>																										';

var ribbonOrb_menuNode_t = 
'	<li><a href="{action}">																					'+
'		<img src="{ico}" /><span>{title}</span></a>															'+
'		{subMenuList}																						'+
'	</li>																									';

var ribbonMenu_Group_t = 
'			<li><a href="#{title}" accesskey="{accesskey}">{title}</a>										'+
'				<ul>																						'+
'					{subMenuGroup}																			'+
'				</ul>																						'+
'			</li>																							';

var ribbon_menu_menuItem_group_template = 
'					<li>																					'+
'						<h2><span>{groupTitle}</span></h2>													'+
'						{menuItemList}																		'+
'					</li>																					';

var ribbonMenu_MenuNode_t = 
'						<div>																				'+
'							<img src="{ico}" />																'+
'							{title}																			'+
'							{selectList}																	'+
'						</div>																				';


var ribbon_menu_ribbonList_checkboxItem_template = 
'							<div>																			'+
'								<input type="checkbox" id="{id}" />											'+
'								<label accesskey="{accesskey}" for="{id}">{title}</label>					'+
'							</div>																			';

var ribbonMenu_MenuNode_selectItem_t = 
'							<li onclick="{action}">																						'+
'								{ico}																		'+
'								{title}																		'+
'							</li>																			';

/*
* 工具类：判断对象是否为数组
× true：数组对象
× false：非数字对象
*/
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

/*
* 工具类：以字符串类型数据替换模板中的对应属性
*/
function parseHtml(template, data) {
	var html = template;
	for(var key in data) {
		if(typeof(data[key])=='string') {
			var regex = new RegExp('\\{'+key+'\\}', 'g');
			html = html.replace(regex, data[key]);
		}
	}
	return html;
}

/*
* 添加 ribbon菜单数据，并且初始换
*/
function ribbon_init(ribbonid, menuData) {
	var $ribbon = $("#"+ribbonid);
	var ribbonData = { // 生成数据
		orbtitle: menuData.orb.title,
		orbaccesskey: menuData.orb.accesskey,
		orbMenuList: createRibbon_orbMenu(menuData.orb.menuList), //生成ribbon->orb菜单
		menuMenuList: createRibbon_menuMenu(menuData.menu.menuList) //生成ribbon->menu菜单
	};

	$ribbon.html(parseHtml(ribbon_template, ribbonData));
	var ribbon_theme = (menuData.theme!=null && menuData.theme!='')?menuData.theme:'windows7'; // 设置主题
	$().Ribbon({ theme: menuData.theme });
}

/*
* 生成ribbon->orb菜单列表
*/
function createRibbon_orbMenu(orbMenuData){
	var ribbonOrb_menuItemList_html = "";

	// 生成菜单
	if(orbMenuData!=null && orbMenuData.length>0) {
		for(var i=0; i<orbMenuData.length; i++){  // 循环菜单列表

			var menuItemData = orbMenuData[i];
			var ribbonOrb_MenuNodeData = {};
			
			// 生成菜单项
			for(var key in menuItemData) {

				if(isArray(menuItemData[key])) { // 子菜单
					
					// 生成子菜单项
					var ribbonOrb_subItemList_html = createRibbon_orbMenu(menuItemData[key]);
					if(ribbonOrb_subItemList_html!=""){
						ribbonOrb_subItemList_html = '<ul>'+ribbonOrb_subItemList_html+'</ul>'
					}
					
					menuItemData[key] = ribbonOrb_subItemList_html;

				} // 子菜单
				
			} // 替换菜单数据
			
			ribbonOrb_menuItemList_html += parseHtml(ribbonOrb_menuNode_t, menuItemData)
												.replace(/\{.*\}/g, ""); // 清空没有子菜单的数据
		} // 循环菜单列表
	}
	return ribbonOrb_menuItemList_html;
}

/*
* 生成ribbon->menu菜单列表
*/
function createRibbon_menuMenu(menuMenuData){
	var ribbonMenu_groupList_html = "";

	// 生成菜单
	if(menuMenuData!=null && menuMenuData.length>0) {
		for(var i=0; i<menuMenuData.length; i++){
			var menuMenu = menuMenuData[i];
						
			var subMenuGroupHtml = "";

			for(var j=0; j<menuMenu.subMenuGroup.length; j++) {
				var subMenuGroup = menuMenu.subMenuGroup[j];
				
				var groupMenuItemListHtml = "";
				for(var k=0; k<subMenuGroup.itemList.length; k++) { // 生成菜单组的各个菜单
					var subMenuGroupItem = subMenuGroup.itemList[k];
					
					if(subMenuGroupItem.type=='ribbon-list') { // 列表菜单
						groupMenuItemListHtml += createMenu_RibbonMenu(subMenuGroupItem.menuList);
					} else { // 一般菜单项
						groupMenuItemListHtml += createMenu_NormalMenu(subMenuGroupItem);
					}

				}

				subMenuGroup.menuItemList = groupMenuItemListHtml;
				subMenuGroupHtml += parseHtml(ribbon_menu_menuItem_group_template, subMenuGroup);
				
			}

			menuMenu.subMenuGroup = subMenuGroupHtml;
			ribbonMenu_groupList_html += parseHtml(ribbonMenu_Group_t, menuMenu);
		}
	}

	return ribbonMenu_groupList_html;
};

/*
* 生成ribbon->menu菜单列表中的普通菜单项
*/
function createMenu_NormalMenu(menudata) {
	// 清理数据
	menudata['selectList'] = '';
	return parseHtml(ribbonMenu_MenuNode_t, menudata);
}

/*
* 生成ribbon->menu菜单列表中的ribbon-list列表菜单项
*/
function createMenu_RibbonMenu(menuListData) {
	var menuHtml='<div class="ribbon-list">';
	for(var i=0; i<menuListData.length; i++) {
		var menuItem = menuListData[i];
		
		if(menuItem.type=='select'){ // 创建select列表菜单
			menuHtml += createMenu_RibbonMenu_SelectMenu(menuItem);

		}else if(menuItem.type=='checkbox'){ // 创建checkbox列表菜单
			menuHtml += parseHtml(ribbon_menu_ribbonList_checkboxItem_template, menuItem);
		} else { // 创建普通列表菜单
			menuHtml += createMenu_NormalMenu(menuItem);
		}
	}
	menuHtml += '</div>';

	return menuHtml;
}
/*
* 生成ribbon->menu->ribbon-list菜单列表中的select菜单项
*/
function createMenu_RibbonMenu_SelectMenu(menuItem) {

	var selectHtml = '<ul>'
	for(var j=0; j<menuItem.selectList.length; j++){ // 生产选择项
		var selectItem = menuItem.selectList[j];
		selectItem.ico = (selectItem.ico!=null && selectItem.ico.length>0)
						? '<img src="'+selectItem.ico+'" />'
						: '';
		
		selectHtml += parseHtml(ribbonMenu_MenuNode_selectItem_t, selectItem);
	}

	selectHtml += '</ul>';
	menuItem.selectList = selectHtml;
	return parseHtml(ribbonMenu_MenuNode_t, menuItem);
}