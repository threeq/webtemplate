(function($){
	$.fn.extend({
		'ebjhint':function(cset){
			return $(this)._tipsinput({
				colorset:cset
			});
		},
		'_tipsinput':function(options){
			options=$.extend({
				colorset:'#999'
			},options)
			$(this).each(function(i,e){
				$(e).attr('initval',$(e).val())
			})
			var oldval=''
			var color=$(this).css('color')
			$(this).css('color',options.colorset)
			$(this).click(function(){
				oldval=$(this).val()
				if($(this).val()==$(this).attr('initval')){
					$(this).val('').css('color',color)
				}
			})
			$(this).blur(function(){
				if($(this).val()==''){
					$(this).val($(this).attr('initval')).css('color',options.colorset)
				}
			})
		}
	})
})(jQuery)