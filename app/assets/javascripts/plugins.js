window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());


/*
	SUPERSCROLLORAMA - The jQuery plugin for doing scroll animations
	by John Polacek (@johnpolacek)
	
	Powered by the Greensock Tweening Platform
	http://www.greensock.com
	Greensock License info at http://www.greensock.com/licensing/
	
	Dual licensed under MIT and GPL.
*/

var animObjs;
var prevScroll;
var currScroll;

(function($) {
    $.superscrollorama = function(options) {
		
		var superscrollorama = this;
		var defaults = {isVertical:true};
		superscrollorama.settings = $.extend({}, defaults, options);

		
		// PRIVATE VARS
		
		var animObjects = [],
			pinnedObjects = [],
			didScrollCheck = false,
			timeline = new TimelineLite();
			
		animObjs = animObjects;
		
		// PRIVATE FUNCTIONS

		function init() {
			// scroll to top of page
			$('html, body').animate({ scrollTop: 0 }, 0);
			
			$(window).scroll(function() {
				didScrollCheck = true;
			});
			setInterval(function() {
				if (didScrollCheck) {
					checkScrollAnim();
					didScrollCheck = false;
				}
			}, 10);
		}
		
		function checkScrollAnim() {
		  prevScroll = currScroll;
			var currScrollPoint = superscrollorama.settings.isVertical ? $(window).scrollTop() : $(window).scrollLeft();
			currScroll = currScrollPoint;
			var offsetAdjust = superscrollorama.settings.isVertical ? -$(window).height()/2 : -$(window).width()/2;
			var i, startPoint, endPoint;
			
			// check all animObjects
			var numAnim = animObjects.length;
			for (i=0; i<numAnim; i++) {
				var animObj = animObjects[i],
					target = animObj.target,
					offset = animObj.offset;
			
				if (typeof(target) === 'string') {
					startPoint = superscrollorama.settings.isVertical ? $(target).offset().top : $(target).offset().left;
					offset += offsetAdjust;
				} else if (typeof(target) === 'number')	{
					startPoint = target;
				} else {
					startPoint = superscrollorama.settings.isVertical ? target.offset().top : target.offset().left;
					offset += offsetAdjust;
				}
				
				startPoint += offset;
				endPoint = animObj.dur ? startPoint + animObj.dur : startPoint;
				
				if ((currScrollPoint > startPoint && currScrollPoint < endPoint) && animObj.state !== 'TWEENING') {
				  if (animObj.state === 'BEFORE' && animObj.invalidate) animObj.tween.invalidate();
					// if it should be TWEENING and isn't..
					animObj.state = 'TWEENING';
					animObj.start = startPoint;
					animObj.end = endPoint;
					animObj.tween.progress((currScrollPoint - animObj.start)/(animObj.end - animObj.start)).pause();
				} else if (currScrollPoint < startPoint && animObj.state !== 'BEFORE') {
					// if it should be at the BEFORE tween state and isn't..
					animObj.tween.reverse();
					animObj.state = 'BEFORE';
				} else if (currScrollPoint > endPoint && animObj.state !== 'AFTER') {
					// if it should be at the AFTER tween state and isn't..
          if (animObj.invalidate)
					animObj.tween.play();
					animObj.state = 'AFTER';
				} else if (animObj.state === 'TWEENING') {
					// if it is TWEENING..
					animObj.tween.progress((currScrollPoint - animObj.start)/(animObj.end - animObj.start)).pause();
				}
			}
				
			// check all pinned elements
			var numPinned = pinnedObjects.length;
			for (i=0; i<numPinned; i++) {
				var pinObj = pinnedObjects[i];
				var el = pinObj.el;
				
				// should object be pinned?
				if (pinObj.state != 'PINNED') {
					
					startPoint = pinObj.spacer ?
						superscrollorama.settings.isVertical ? pinObj.spacer.offset().top : pinObj.spacer.offset().left :
						superscrollorama.settings.isVertical ? el.offset().top : el.offset().left;
					
					startPoint += pinObj.offset;
					endPoint = startPoint + pinObj.dur;
					
					if (currScrollPoint > startPoint && currScrollPoint < endPoint && pinObj.state !== 'PINNED') {
						// pin it
						pinObj.state = 'PINNED';
						
						// set original position value for unpinning
						pinObj.origPositionVal = superscrollorama.settings.isVertical ? el.css('top') : el.css('left');
						if (pinObj.origPositionVal === 'auto')
							pinObj.origPositionVal = 0;
						else
							pinObj.origPositionVal = parseInt(pinObj.origPositionVal, 10);
						
						// change to fixed position
						el.css('position','fixed');
						if (superscrollorama.settings.isVertical)
							el.css('top', 0);
						else
							el.css('left', 0);
						
						pinObj.pinStart = startPoint;
						pinObj.pinEnd = endPoint;

						if (pinObj.spacer)
							pinObj.spacer.css('height', pinObj.dur + el.outerHeight());

						if (pinObj.onPin)
							pinObj.onPin();
					}

				// Check to see if object should be unpinned
				} else {
					
					if (currScrollPoint < pinObj.pinStart || currScrollPoint > pinObj.pinEnd) {
						// unpin it
						pinObj.state = currScrollPoint < pinObj.pinStart ? 'BEFORE' : 'AFTER';

						// revert to original position value
						el.css('position',pinObj.origPosition);
						if (superscrollorama.settings.isVertical)
							el.css('top', pinObj.origPositionVal);
						else
							el.css('left', pinObj.origPositionVal);
						
						if (pinObj.spacer)
							pinObj.spacer.css('height', currScrollPoint < pinObj.pinStart ? 0 : pinObj.dur);

						if (pinObj.onUnpin)
							pinObj.onUnpin();
					}
					else if (pinObj.anim) {
						// do animation
						pinObj.anim.progress((currScrollPoint - pinObj.pinStart)/(pinObj.pinEnd - pinObj.pinStart));
					}
				}
			}
		}
		
		// PUBLIC FUNCTIONS
		superscrollorama.addTween = function(target, tween, dur, offset, invalidate) {
			
			tween.pause();
						
			animObjects.push({
				target:target,
				tween: tween,
				offset: offset || 0,
				dur: dur || 0,
				state:'BEFORE',
				invalidate: invalidate || false
			});
		};
		
		superscrollorama.pin = function(el, dur, vars) {
			if (typeof(el) === 'string') el = $(el);
			if (vars.anim) vars.anim.pause();
			
			// create wrapper for pinned elements that aren't absolute or fixed position
			var pinSpacer = null;
			if (el.css('position') === 'relative' || el.css('position') === 'static') {
				pinSpacer = $('<div class="pin-spacer"></div>');
				el.before(pinSpacer);
			}
			
			pinnedObjects.push({
				el:el,
				state:'BEFORE',
				dur:dur,
				offset: vars.offset || 0,
				anim:vars.anim,
				origPosition:el.css('position'),
				spacer:pinSpacer,
				onPin:vars.onPin,
				onUnpin:vars.onUnpin
			});
		};
		
		
		// INIT
		init();
		
		return superscrollorama;
    };
     
})(jQuery);


/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);


/* ===================================================
 * bootstrap-transition.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd'
            ,  'msTransition'     : 'MSTransitionEnd'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);


/* =============================================================
 * bootstrap-scrollspy.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy( element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') // removing opinionated selector - Jeffrey
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        $(selector)
          .parent('li')
          .addClass('active')

        $(selector).trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);


/* ==========================================================
 * bootstrap-carousel.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide')

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (typeof option == 'string' || (option = options.slide)) data[option]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);


// jquery.event.move
//
// 1.0.2
//
// Stephen Band
//
// Triggers 'movestart', 'move' and 'moveend' events after
// mousemoves following a mousedown cross a distance threshold,
// similar to the native 'dragstart', 'drag' and 'dragend' events.
// Move events are throttled to animation frames. Move event objects
// have the properties:
//
// pageX:
// pageY:   Page coordinates of pointer.
// startX:
// startY:  Page coordinates of pointer at movestart.
// distX:
// distY:  Distance the pointer has moved since movestart.
// deltaX:
// deltaY:  Distance the finger has moved since last event.
// velocityX:
// velocityY:  Average velocity over last few events.


(function(jQuery, undefined){
	var threshold = 6,
	
	    add = jQuery.event.add,
	
	    remove = jQuery.event.remove,

	    // Just sugar, so we can have arguments in the same order as
	    // add and remove.
	    trigger = function(node, type, data) {
	    	jQuery.event.trigger(type, data, node);
	    },

	    // Shim for requestAnimationFrame, falling back to timer. See:
	    // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	    requestFrame = (function(){
	    	return (
	    		window.requestAnimationFrame ||
	    		window.webkitRequestAnimationFrame ||
	    		window.mozRequestAnimationFrame ||
	    		window.oRequestAnimationFrame ||
	    		window.msRequestAnimationFrame ||
	    		function(fn, element){
	    			return window.setTimeout(function(){
	    				fn();
	    			}, 25);
	    		}
	    	);
	    })(),
	    
	    ignoreTags = {
	    	textarea: true,
	    	input: true,
	    	select: true
	    },
	    
	    mouseevents = {
	    	move: 'mousemove',
	    	cancel: 'mouseup dragstart',
	    	end: 'mouseup'
	    },
	    
	    touchevents = {
	    	move: 'touchmove',
	    	cancel: 'touchend',
	    	end: 'touchend'
	    };
	
	// Constructors
	
	function Timer(fn){
		var callback = fn,
				active = false,
				running = false;
		
		function trigger(time) {
			if (active){
				callback();
				requestFrame(trigger);
				running = true;
				active = false;
			}
			else {
				running = false;
			}
		}
		
		this.kick = function(fn) {
			active = true;
			if (!running) { trigger(); }
		};
		
		this.end = function(fn) {
			var cb = callback;
			
			if (!fn) { return; }
			
			// If the timer is not running, simply call the end callback.
			if (!running) {
				fn();
			}
			// If the timer is running, and has been kicked lately, then
			// queue up the current callback and the end callback, otherwise
			// just the end callback.
			else {
				callback = active ?
					function(){ cb(); fn(); } : 
					fn ;
				
				active = true;
			}
		};
	}
	
	// Functions
	
	function returnFalse(e) {
		return false;
	}
	
	function preventDefault(e) {
		e.preventDefault();
	}
	
	function preventIgnoreTags(e) {
		// Don't prevent interaction with form elements.
		if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }
		
		e.preventDefault();
	}

	function isLeftButton(e) {
		// Ignore mousedowns on any button other than the left (or primary)
		// mouse button, or when a modifier key is pressed.
		return (e.which === 1 && !e.ctrlKey && !e.altKey);
	}

	function identifiedTouch(touchList, id) {
		var i, l;

		if (touchList.identifiedTouch) {
			return touchList.identifiedTouch(id);
		}
		
		// touchList.identifiedTouch() does not exist in
		// webkit yet… we must do the search ourselves...
		
		i = -1;
		l = touchList.length;
		
		while (++i < l) {
			if (touchList[i].identifier === id) {
				return touchList[i];
			}
		}
	}

	function changedTouch(e, event) {
		var touch = identifiedTouch(e.changedTouches, event.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		// Chrome Android (at least) includes touches that have not
		// changed in e.changedTouches. That's a bit annoying. Check
		// that this touch has changed.
		if (touch.pageX === event.pageX && touch.pageY === event.pageY) { return; }

		return touch;
	}

	// Handlers that decide when the first movestart is triggered
	
	function mousedown(e){
		var data;

		if (!isLeftButton(e)) { return; }

		data = {
			target: e.target,
			startX: e.pageX,
			startY: e.pageY,
			pageX: e.pageX,
			pageY: e.pageY,
			timeStamp: e.timeStamp
		};

		add(document, mouseevents.move, mousemove, data);
		add(document, mouseevents.cancel, mouseend, data);
	}

	function mousemove(e){
		var data = e.data;

		checkThreshold(e, data, e, removeMouse);
	}

	function mouseend(e) {
		removeMouse();
	}

	function removeMouse() {
		remove(document, mouseevents.move, mousemove);
		remove(document, mouseevents.cancel, removeMouse);
	}

	function touchstart(e) {
		var touch, data;

		// Don't get in the way of interaction with form elements.
		if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

		touch = e.changedTouches[0];
		
		// iOS live updates the touch objects whereas Android gives us copies.
		// That means we can't trust the touchstart object to stay the same,
		// so let's copy the data. This object will act as a template for
		// movestart, move and moveend events.
		data = {
			target: touch.target,
			startX: touch.pageX,
			startY: touch.pageY,
			pageX: touch.pageX,
			pageY: touch.pageY,
			timeStamp: e.timeStamp,
			identifier: touch.identifier
		};

		// Use the touch identifier as a namespace, so that we can later
		// remove handlers pertaining only to this touch.
		add(document, touchevents.move + '.' + touch.identifier, touchmove, data);
		add(document, touchevents.cancel + '.' + touch.identifier, touchend, data);
	}

	function touchmove(e){
		var data = e.data,
		    touch = changedTouch(e, data);

		if (!touch) { return; }

		checkThreshold(e, data, touch, removeTouch);
	}

	function touchend(e) {
		var data = e.data,
		    touch = identifiedTouch(e.changedTouches, data.identifier);

		if (!touch) { return; }

		removeTouch(data);
	}

	function removeTouch(touchstart) {
		remove(document, '.' + touchstart.identifier, touchmove);
		remove(document, '.' + touchstart.identifier, touchend);
	}


	// Logic for deciding when to trigger a movestart.

	function checkThreshold(e, data, touch, fn) {
		var distX = touch.pageX - data.startX,
		    distY = touch.pageY - data.startY;

		// Do nothing if the threshold has not been crossed.
		if ((distX * distX) + (distY * distY) < (threshold * threshold)) { return; }

		return triggerStart(e, data, touch, distX, distY, fn);
	}

	function triggerStart(e, data, touch, distX, distY, fn) {
		var node = data.target,
		    events, touches, time;

		// Climb the parents of this target to find out if one of the
		// move events is bound somewhere. This is an optimisation that
		// may or may not be good. I should test.
		while (node !== document.documentElement) {
			events = jQuery.data(node, 'events');
			
			// Test to see if one of the move events has been bound.
			if (events && (events.movestart || events.move || events.moveend)) {
				touches = e.targetTouches;
				time = e.timeStamp - data.timeStamp;

				data.type = 'movestart';
				data.distX = distX;
				data.distY = distY;
				data.deltaX = distX;
				data.deltaY = distY;
				data.pageX = touch.pageX;
				data.pageY = touch.pageY;
				data.velocityX = distX / time;
				data.velocityY = distY / time;
				data.targetTouches = touches;
				data.finger = touches ? touches.length : 1;

				// Trigger the movestart event using data as a template, and pass
				// a clean copy of data for use as a template for the move and
				// moveend events. Also, pass the touchmove event so it can be
				// prevented when movestart is fired.
				trigger(data.target, data, [data, e]);

				return fn(data);
			}
			
			node = node.parentNode;
		}
	}


	// Handlers that control what happens following a movestart

	function activeMousemove(e) {
		var event = e.data.event,
		    timer = e.data.timer;

		updateEvent(event, e, e.timeStamp, timer);
	}

	function activeMouseend(e) {
		var event = e.data.event,
		    timer = e.data.timer;
		
		removeActiveMouse();

		endEvent(event, timer, function() {
			// Unbind the click suppressor, waiting until after mouseup
			// has been handled.
			setTimeout(function(){
				remove(event.target, 'click', returnFalse);
			}, 0);
		});
	}

	function removeActiveMouse(event) {
		remove(document, mouseevents.move, activeMousemove);
		remove(document, mouseevents.end, activeMouseend);
	}

	function activeTouchmove(e) {
		var event = e.data.event,
		    timer = e.data.timer,
		    touch = changedTouch(e, event);

		if (!touch) { return; }

		// Stop the interface from gesturing
		e.preventDefault();

		event.targetTouches = e.targetTouches;
		updateEvent(event, touch, e.timeStamp, timer);
	}

	function activeTouchend(e) {
		var event = e.data.event,
		    timer = e.data.timer,
		    touch = identifiedTouch(e.changedTouches, event.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		removeActiveTouch(event);
		endEvent(event, timer);
	}

	function removeActiveTouch(event) {
		remove(document, '.' + event.identifier, activeTouchmove);
		remove(document, '.' + event.identifier, activeTouchend);
	}


	// Logic for triggering move and moveend events

	function updateEvent(event, touch, timeStamp, timer) {
		var time = timeStamp - event.timeStamp;

		event.type = 'move';
		event.distX =  touch.pageX - event.startX;
		event.distY =  touch.pageY - event.startY;
		event.deltaX = touch.pageX - event.pageX;
		event.deltaY = touch.pageY - event.pageY;
		// Average the velocity of the last few events over a decay curve
		// to even out spurious jumps in values.
		event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
		event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
		event.pageX =  touch.pageX;
		event.pageY =  touch.pageY;

		timer.kick();
	}

	function endEvent(event, timer, fn) {
		timer.end(function(){
			event.type = 'moveend';

			trigger(event.target, event);
			
			return fn && fn();
		});
	}


	// jQuery special event definition

	function isSetup(events) {
		return ((events.movestart ? 1 : 0) +
		        (events.move ? 1 : 0) +
		        (events.moveend ? 1 : 0)) > 1;
	}

	function setup(data, namespaces, eventHandle) {
		var events = jQuery.data(this, 'events');

		// If another move event is already setup, don't setup again.
		if (isSetup(events)) { return; }
		
		// Stop the node from being dragged
		add(this, 'dragstart.move drag.move', preventDefault);
		// Prevent text selection and touch interface scrolling
		add(this, 'mousedown.move', preventIgnoreTags);

		// Don't bind to the DOM. For speed.
		return true;
	}
	
	function teardown(namespaces) {
		var events = jQuery.data(this, 'events');

		// If another move event is already setup, don't setup again.
		if (isSetup(events)) { return; }
		
		remove(this, 'dragstart drag', preventDefault);
		remove(this, 'mousedown touchstart', preventIgnoreTags);

		// Don't bind to the DOM. For speed.
		return true;
	}
	
	jQuery.event.special.movestart = {
		setup: setup,
		teardown: teardown,

		_default: function(e, event, touchmove) {
			var data = {
			      event: event,
			      timer: new Timer(function(time){
			        trigger(e.target, event);
			      })
			    };

			if (event.identifier === undefined) {
				// We're dealing with a mouse
				// Stop clicks from propagating during a move
				add(event.target, 'click', returnFalse);
				add(document, mouseevents.move, activeMousemove, data);
				add(document, mouseevents.end, activeMouseend, data);
			}
			else {
				touchmove.preventDefault();
				
				add(document, touchevents.move + '.' + event.identifier, activeTouchmove, data);
				add(document, touchevents.end + '.' + event.identifier, activeTouchend, data);
			}
		}
	};

	jQuery.event.special.move =
	jQuery.event.special.moveend = {
		setup: setup,
		teardown: teardown
	};

	add(document, 'mousedown.move', mousedown);
	add(document, 'touchstart.move', touchstart);
	
})(jQuery);


// Make jQuery copy touch event properties over to the jQuery event
// object, if they are not already listed. But only do the ones we
// really need.

(function(jQuery, undefined){
	var props = ["changedTouches", "targetTouches"],
	    l = props.length;
	
	while (l--) {
		if (jQuery.event.props.indexOf(props[l]) === -1) {
			jQuery.event.props.push(props[l]);
		}
	}
})(jQuery);


// jQuery.event.swipe
// 0.4
// Stephen Band

// Dependencies
// jQuery.event.move

// One of swipeleft, swiperight, swipeup or swipedown is triggered on
// moveend, when the move has covered a threshold ratio of the dimension
// of the target node. The default is 0.4. It can be changed with:
// 
// jQuery.event.special.swipe.settings

(function(jQuery, undefined){
	var add = jQuery.event.add,
	   
	    remove = jQuery.event.remove,

	    // Just sugar, so we can have arguments in the same order as
	    // add and remove.
	    trigger = function(node, type, data) {
	    	jQuery.event.trigger(type, data, node);
	    },

	    // Ratio of the width (or height) of the target node must be
	    // swiped before being considered a swipe.
	    settings = {
	    	// Ratio of distance over target finger must travel to be
	    	// considered a swipe.
	    	threshold: 0.4,
	    	// Faster fingers can travel shorter distances to be considered
	    	// swipes. 'sensitivity' controls how much. Bigger is shorter.
	    	sensitivity: 2
	    };

	function moveend(e) {
		var w, h, event;

		w = e.target.offsetWidth;
		h = e.target.offsetHeight;

		// Copy over some useful properties from the move event
		event = {
			distX: e.distX,
			distY: e.distY,
			velocityX: e.velocityX,
			velocityY: e.velocityY,
			finger: e.finger
		};

		// Find out which of the four directions was swiped
		if (e.distX > e.distY) {
			if (e.distX > -e.distY) {
				if (e.distX/w > settings.threshold || e.velocityX * e.distX/w * settings.sensitivity > 1) {
					event.type = 'swiperight';
					trigger(e.currentTarget, event);
				}
			}
			else {
				if (-e.distY/h > settings.threshold || e.velocityY * e.distY/w * settings.sensitivity > 1) {
					event.type = 'swipeup';
					trigger(e.currentTarget, event);
				}
			}
		}
		else {
			if (e.distX > -e.distY) {
				if (e.distY/h > settings.threshold || e.velocityY * e.distY/w * settings.sensitivity > 1) {
					event.type = 'swipedown';
					trigger(e.currentTarget, event);
				}
			}
			else {
				if (-e.distX/w > settings.threshold || e.velocityX * e.distX/w * settings.sensitivity > 1) {
					event.type = 'swipeleft';
					trigger(e.currentTarget, event);
				}
			}
		}
	}

	function isSetup(node) {
		var events = jQuery.data(node, 'events');

		return ((events.swipe ? 1 : 0) +
			      (events.swipeleft ? 1 : 0) +
		        (events.swiperight ? 1 : 0) +
		        (events.swipeup ? 1 : 0) +
		        (events.swipedown ? 1 : 0)) > 1;
	}

	jQuery.event.special.swipe =
	jQuery.event.special.swipeleft =
	jQuery.event.special.swiperight =
	jQuery.event.special.swipeup =
	jQuery.event.special.swipedown = {
		setup: function( data, namespaces, eventHandle ) {
			// If another swipe event is already setup, don't setup again.
			if (isSetup(this)) { return; }

			add(this, 'moveend', moveend);

			return true;
		},

		teardown: function() {
			// If another swipe event is still setup, don't teardown yet.
			if (isSetup(this)) { return; }

			remove(this, 'moveend', moveend);

			return true;
		},

		settings: settings
	};
})(jQuery);