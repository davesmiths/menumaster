// jQuery Menu 1.9

// 
// 
// 
//  li
//      a
//          .ctrl.ctrl-link
//              .text.text-item
// 
// li      a .ctrl.ctrl-togg        span.text.text-item
//                                                         span.text.text-togg
// 
// li      div.item.item-split     a.ctrl.ctrl-link        span.text.text-item
//                                 a.ctrl.ctrl-togg        span.text.text-togg
// 
// 
// 
// 
// 
// 
// 
// 
// 


(function($) {
	// easyMenu(), defaults to tree sub-plugin
	// easyMenu({options}), defaults to tree sub-plugin
	// easyMenu('sub-plugin'),
	// easyMenu('sub-plugin', {options})
	// The above will apply to whole menu
	// What about mixed menus like horizontal menus? An option to limit depth.
	
	"use strict";
	
	var easyMenu = 'menumaster',
		version = 'Version: 19';
	
	$.fn[easyMenu] = function(method, options) {
	
		var $this = $(this), o;
		
		// Check if Method is an object on the plugin.
		if ($.fn[easyMenu][method]) {
			o = $.extend({}, $.fn[easyMenu].d || {}, $.fn[easyMenu][method].d || {}, options || {});
			
			// All methods run init first before running the given method, except for those listed below
			if (method !== 'destroy' && method !== 'init') {
				$this = $.fn[easyMenu].init.apply(this, [o]);
			}
			// Apply the given method
			return $.fn[easyMenu][method].apply($this, [o]);
		}
		// Else check if Method is an object or not supplied at all.
		else if (typeof method === 'object' || ! method) {
			method = method || {};
			if (!(method.type && $.fn[easyMenu][method.type])) {
				method.type = 'tree';
			}
			o = $.extend({}, $.fn[easyMenu].d || {}, $.fn[easyMenu][method.type].d || {}, method);
			$this = $.fn[easyMenu].init.apply(this, [o]);
			return $.fn[easyMenu][method.type].apply($this, [o]);
		}
		else {
			$.error('The method "' +  method + '" does not exist on jQuery.' + easyMenu);
		}
	};
	
	// Defaults.
	$.fn[easyMenu].namespace = easyMenu;
	
	// Defaults.
	$.fn[easyMenu].d = {
		
		namespace: $.fn[easyMenu].namespace,
		
		// Menu class name, applied when initialised.
		easyMenuClass: $.fn[easyMenu].namespace,
		destroyRemoveClass: $.fn[easyMenu].namespace + 'El',
		destroyUnwrapClass: $.fn[easyMenu].namespace + 'ElWrap',
			
		// Content of the toggle when closed and open.
		toggClosedHTML: '+<span class="ir"></span>',
		toggOpenHTML: '&minus;<span class="ir"></span>',
			
		// Sub menu and sub menu closed list item classes.
		openClass: 'open',
		selectedClass: 'selected',
		
		// Item link classes
		//toggleClass: 'toggle',
		splitClass: 'split',
		
		// Span text and togg classes
		toggClass: 'togg',
		textClass: 'text',
		innerClass: 'inner',
			
		// Default type.
		type: 'tree'
		
	};
	
	// Methods.
	$.fn[easyMenu].init = function(o) {
		
		// Go through each menu.
		return this.each(function() {
			
			var $menu = $(this),
				$li = $menu.find('li'),
				liContents,
				$a,
				tabindex = '';
			
			$menu.addClass(o.easyMenuClass);
			
			// In case text only LI elements exist, wrap the text with an A element.
			$li.filter(':not(:has(> a))').each(function(i) {
				liContents = $(this).contents();
				if (liContents.length) {
					liContents.eq(0).wrap('<a class="' + o.destroyUnwrapClass + '"></a>');
				}
			});
			
			// Finish the basic structure; innerwrap all A elements with a SPAN element.
			$a = $menu.find('a');
			
			$a
    			.filter(':not(:has(> span.' + o.textClass + '))')
    			.wrapInner('<span class="' + o.destroyUnwrapClass + ' ' + o.textClass + '"><span class="' + o.destroyUnwrapClass + ' ' + o.innerClass + '"></span></span>')
            ;
			
			$a
    			.filter(':not([tabindex])')
    			.attr('tabindex', 0)
            ;
			
			// Deal with sub-menus by adding/making toggles.
			$menu.find('ul,ol').each(function() {
			    var $a;
				$a = $(this).prev();
				if ($a.attr('href')) {
					$a.addClass(o.splitClass);
					tabindex = ' tabindex="0"';
				}
				//$a.addClass(o.toggleClass);
				if ($a.find('.' + o.toggClass).length === 0) {
					$a.append('<span class="' + o.destroyRemoveClass + ' ' + o.toggClass + '" '+tabindex+'><span class="' + o.destroyRemoveClass + ' ' + o.innerClass + '">'+o.toggClosedHTML+'</span></span>');
				}
			});
		});
	};
	
	
	$.fn[easyMenu].destroy = function(o) {
		
		// Get and set the options.
		//var o = $.extend({}, $.fn[easyMenu].d, options);
		
		return this.each(function() {
			var $this = $(this);
			$this.find('.' + o.destroyRemoveClass).remove();
			$this.find('.' + o.destroyUnwrapClass).contents().unwrap();
			$this.find('li,ul,a').removeClass(o.openClass).removeClass(o.splitClass);
			$this.removeClass(o.easyMenuClass + ' ' + o.namespace + 'Theme-' + $this.data('theme.' + o.namespace, o.theme));
		});
	};
	
})(jQuery);

// 



(function($) {

    "use strict";

	var easyMenu = 'menumaster';
	
	// Regular Vertical Tree.
	$.fn[easyMenu].tree = function(o) {
		
		// Go through each menu.
		return this.each(function() {
			
			var menu = $(this);
			
			menu
			.addClass(o.namespace + 'Theme-' + o.theme)
			.data('theme.' + o.namespace, o.theme)
			.off('.' + o.namespace)
			
			.on('close.' + o.namespace, 'li', function(e) {
				var $this = $(this),
					$ul = $this.find('> ul'),
					$a = $this.find('> a');
				
				$this.add($ul).add($a).removeClass(o.openClass);
				
				$a.find('.' + o.toggClass + ' .' + o.innerClass)
				.html(o.toggClosedHTML);
				return false;
			})
			
			.on('open.' + o.namespace, 'li', function(e) {
				var $this = $(this),
					$ul = $this.find('> ul'),
					$a = $this.find('> a');
				
				if ($this.closest('li').has('li').not('.'+o.openClass).length) {
					
					$this.add($ul).add($a).addClass(o.openClass);
				
					$a.find('.' + o.toggClass + ' .' + o.innerClass)
					.html(o.toggOpenHTML);
				}
			})
				
			// Event Capture.
			.on('click.' + o.namespace + ' keydown.' + o.namespace, 'li:has(li) > a[href] span.togg, li:has(li) > a:not([href])', function(e) {
				var rtn = true,
					$li = $(this).closest('li');
				if (e.type === 'click' || e.which === 13) {
					rtn = false;
					if ($li.hasClass('open')) {
						$li.trigger('close');
					}
					else {
						$li.trigger('open');
					}
				}
				return rtn;
			})
						
			.on('focus.' + o.namespace, 'a', function() {
				menu.data('selectedLI.'+o.namespace, $(this).closest('li'));
			})
			
			.on('keydown.' + o.namespace, function(e) {
				var rtn = true
				    ,flag
				    ,selectedLI
				    ,nextLI
				;
				e.which = e.which || e.keyCode;
				selectedLI = menu.data('selectedLI.' + o.namespace);
				
				// DOWN key
				if (e.which === 40) {
					rtn = false;
					nextLI = selectedLI.next();
					
					if (selectedLI.is('.' + o.openClass)) {
						nextLI = selectedLI.find('> ul li:first');
					}
					else if (nextLI.length === 0 && selectedLI.parent().parent('li').length) {
						// Check next level up.
						do {
							selectedLI = selectedLI.parent().parent('li');
						}
						while (selectedLI.next().length === 0 && selectedLI.parent().parent('li').length);
						
						nextLI = selectedLI.next();
					}
					
					nextLI.find('> a:first').focus();
				}
				
				// UP key
				else if (e.which === 38) {
					rtn = false;
					selectedLI = menu.data('selectedLI.' + o.namespace);
					nextLI = selectedLI.prev();
					
					// Check if there is a previous LI.
					if (nextLI.length) {	
						// Check if the previous item is a menu item and is open.
						if (nextLI.hasClass('open')) {
							nextLI = nextLI.find('li:visible:last');
						}
					}
					else {
						nextLI = selectedLI.parents('li:first');
					}
					nextLI.find('> a:first').focus();
				}
				
				// RIGHT key
				else if (e.which === 39) {
					rtn = false;
					selectedLI = menu.data('selectedLI.' + o.namespace);
					flag = true;
					if (selectedLI.has('ul').length) {
						// Is the LI closed?
						if (!selectedLI.hasClass(o.openClass)) {
							selectedLI.trigger('open');
							flag = false;
						}
						else {	
							var dubLIs, bubLIs;
							var subLIs = selectedLI;
							do {
								bubLIs = dubLIs = $();
								bubLIs = bubLIs.add(subLIs.find('> ul:not(.' + o.namespace + ') > li:has(ul):not(.' + o.openClass+')'));
								subLIs = dubLIs.add(subLIs.find('> ul:not(.' + o.namespace + ') > li:has(ul)'));
							}
							while (subLIs.length && bubLIs.length == 0);
							if (bubLIs.length) {
								bubLIs.trigger('open');
								flag = false;
							}
						}
					}
					if (flag) {
						var subLIs = selectedLI.nextAll('li:has(ul)');
						if (!subLIs.is('.' + o.openClass)) {
							subLIs.trigger('open');
						}
						else {	
							var dubLIs, bubLIs;
							do {
								bubLIs = dubLIs = $();
								bubLIs = bubLIs.add(subLIs.find('> ul:not(.' + o.namespace + ') > li:has(ul):not(.' + o.openClass+')'));
								subLIs = dubLIs.add(subLIs.find('> ul:not(.' + o.namespace + ') > li:has(ul)'));
							}
							while (subLIs.length && bubLIs.length == 0);
							bubLIs.trigger('open');
						}
					}
				}
				
				// LEFT key
				else if (e.which === 37) {
					rtn = false;
					selectedLI = menu.data('selectedLI.' + o.namespace);
					
					// Is the menu open?
					if (selectedLI.hasClass(o.openClass)) {
						selectedLI.trigger('close');
					}
					else {
						// Is the LI in the top level?
						if (selectedLI.closest(':not(ul,li)').find('> ul')[0] === selectedLI.parent()[0]) {
							// Is the LI the first?
							if (selectedLI.prevAll('li').length === 0) {
								selectedLI.parent().find('li.open').trigger('close');
							}
							else {
								selectedLI.parent().find('li:visible:first > a').focus();
							}
						}
						else {
							selectedLI.parent().closest('li').find('> a').focus();
						}
					}
				}
				return rtn;
			});
			menu.find('.' + o.selectedClass).trigger('open');
		});
	};
	$.fn[easyMenu].tree.d = {
		// Default theme.
		theme: 'tree'
	};
	// End of Tree View.
})(jQuery);

