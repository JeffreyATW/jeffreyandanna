var resizeSections = function (windowHeight) {
  $('.main_section').css('min-height', /Firefox/.test(navigator.userAgent) ? windowHeight - parseInt($('.main_section').css('padding-top'), 10) : windowHeight)
}

resizeSections($(window).height())