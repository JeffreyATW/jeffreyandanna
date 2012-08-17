!function () {
  "use strict";

  var controller

  var mobileWidth = function() {
      return $(window).width() < 620
  }

  var parseDecimal = function (x) {
    return parseInt(x, 10)
  }

  var resizeSections = function () {
    $('.main_section').css('min-height', /Firefox/.test(navigator.userAgent) ? $(window).height() - parseDecimal($('.main_section').css('padding-top')) : $(window).height())
  }
  
  var randomOffset = function (px) {
    return parseDecimal(Math.random() * px) - px
  }
  
  var addCharacterTween = function (character, id, bottomPercent, invalidate, offset) {
    var bottom = $(character).css('bottom')
      , tweenOpts
    if (bottom.match('%') === null) bottom = (parseDecimal(bottom) / parseDecimal($(window).height())) * 100
    tweenOpts = {
      css: {"bottom": parseDecimal(bottom) + bottomPercent + "%"},
      immediateRender: true,
      ease: Back.easeIn,
      onComplete: changeState,
      onCompleteParams: ["standing"],
      onReverseComplete: changeState,
      onReverseCompleteParams: ["standing"]
    }
    if (invalidate) {
      $.extend(tweenOpts, {
        onUpdate: function () {
          if (((this.ratio === 0 || this.ratio === 1) &&
               this.state !== "standing") ||
              currScroll <= 0) {
            changeState.call(this, "standing")
          } else if (this.ratio > 0 && currScroll > prevScroll && this.state !== "falling") {
            changeState.call(this, "falling")
          } else if (this.ratio > 0 && prevScroll > currScroll && this.state !== "jumping") {
            changeState.call(this, "jumping")
          } else if (this.ratio < 0 && currScroll > prevScroll && this.state !== "jumping") {
            changeState.call(this, "jumping")
          } else if (this.ratio < 0 && prevScroll > currScroll && this.state !== "falling") {
            changeState.call(this, "falling")
          }
        }
      })
    }
    if (typeof offset === "undefined") offset = -300

    controller.addTween(id, new TweenMax(character, 1, tweenOpts), 500, offset + randomOffset(50), invalidate)
  }
  
  var changeState = function (state) {
    this.state = state
    $(this.target).toggleClass("standing", state === "standing")
                  .toggleClass("falling", state === "falling")
                  .toggleClass("jumping", state === "jumping")
  }
  
  $(function () {
    controller = $.superscrollorama()
  
    resizeSections()
    $(window).resize(resizeSections)
    
    $('.character_container .object').each(function (i, e) {
      addCharacterTween(e, '#welcome', 0, false, 0)
      addCharacterTween(e, '#about_us', -100, true)
      addCharacterTween(e, '#updates', -200, true)
      addCharacterTween(e, '#events', -300, true)
      addCharacterTween(e, '#rsvp', -400, true)
    })
    
    $('.main_section').each(function (i, section) {
      $('.object', section).each(function (j, e) {
        controller.addTween($(section).next(), new TweenMax(e, 1, {
          css: {"bottom": "-100%"},
          immediateRender: true
        }), 400, randomOffset(100))
        if (!$(section).is('#welcome')) {
          controller.addTween($(section), TweenMax.from(e, 1, {
            css: {"bottom": "100%"}, 
            immediateRender: true
          }), 400, randomOffset(100))
        }
      })
    })
    
    $('[id$="_link"]').each(function(i, link) {
      $(link).click(function (e) {

        if (!mobileWidth()) {
          $.scrollTo($('#' + $(this).attr('id').replace(/_link/, '')), 2000)
          return false
        }
      })
      
      $(link).bind('activate', function() {
        var id = $(link).attr('id')
        $('.character_container .object').each(function(i, character) {
          //$(character).addClass('poof');
          $(character).toggleClass('home', id === "welcome_link")
                      .toggleClass('exercise', id === "about_us_link")
                      .toggleClass('travel', id === "updates_link")
                      .toggleClass('wedding', id === "events_link")
                      .toggleClass('cooking', id === "rsvp_link")
          //setTimeout(function() {
          //  $(character).removeClass('poof');
          //}, 100);
        })
      })
    })
    
    $(window).scrollspy({target: '.page_header a', offset: $(window).height() / 2})
    
    $('.carousel').each(function(i, el) {
        $(el).carousel({interval: false})
    })
    $('.regular_section').each(function(i, section) {
      $('nav a', section).each(function(j, el) {
        $(el).click(function() {
          $(this).closest('.regular_section').children('.carousel').carousel(j)
          return false
        })
      })
    })

    $('.carousel').on('mousewheel', '.container', function(e, d) {
        if (!mobileWidth() && ((d > 0 && $(this).scrollTop() == 0) || (d < 0 &&  $(this).scrollTop() == $(this).get(0).scrollHeight - $(this).innerHeight())))
          e.preventDefault()
    })
  })
}(window.jQuery);