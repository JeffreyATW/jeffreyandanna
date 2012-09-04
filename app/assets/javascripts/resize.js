var resizeSections = function () {
  $('.main_section').css('min-height', /Firefox/.test(navigator.userAgent) ? $(window).height() - parseInt($('.main_section').css('padding-top'), 10) : $(window).height())
}

resizeSections()