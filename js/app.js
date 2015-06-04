// Exclude the iPad
Modernizr.addTest('ipad', function () {
  'use strict';
  return !!navigator.userAgent.match(/iPad/i);
});

// Exclude the iPhone
Modernizr.addTest('iphone', function () {
  'use strict';
  return !!navigator.userAgent.match(/iPhone/i);
});

// Exclude the iPod touch
Modernizr.addTest('ipod', function () {
  'use strict';
  return !!navigator.userAgent.match(/iPod/i);
});

// Exclude android phones and tablets
Modernizr.addTest('android', function () {
  'use strict';
  return !!navigator.userAgent.match(/android/i);
});

Modernizr.addTest('appleios', function () {
  'use strict';
  return (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone);
});


Modernizr.load([{
  test: Modernizr.hashchange,
  nope: 'plugin/jquery/jquery.ba-hashchange.min.js'
}, {
  test: Modernizr.appleios,
  yep: 'plugin/ios-viewport-scaling-bug-fix.js'
}]);

window.onload = function () {
  'use strict';
  $('#page-preloader').fadeOut('slow', function () {
    $('.container').css('visibility', 'visible');
    setTimeout(function () {
      $.activeSPA();
      if (Modernizr.canvas) {
        $('#timelineChart').timeline({
          container: $('.aboutDiv > .slideContent')
        });
      }
    }, 500);
  });
};

$(function () {
  'use strict';

  var $toggleNav = $('.navi > span'),
    $nav = $('.navi'),
    $navMask = $('.naviMask'),
    $win = $(window),
    winWidth = $win.width(),
    $isotopeContainer = $('.blinkfeed'),
    gutter = 0,
    columns,
    newColumnWidth,
    currRs;

  $('img').retina();

  $.getScript('js/activeSPA.js');
  $.getScript('js/load_techArticles.js');


  $toggleNav.on('click', function () {
    var isMobile = ($win.width() <= 480);
    if (isMobile) {
      $(this).toggleClass('show');
      $nav.toggleClass('show');
      $navMask.toggleClass('show');
    } else {
      $nav.toggleClass('hide');
    }
  });

  $navMask.on('click', function () {
    $toggleNav.trigger('click');
  });


  //////Isotope
  runIsotope();

  $win.smartresize(function () {
    runIsotope();
  });

  $('.thumbLink').on('click', function () {
    disable_scroll();
    $.ajax({
      url: $(this).attr('href'),
      success: function (data) {
        $('.rsLightbox').remove();
        $('#fullscr').show().append(data);
        $('.rsImg').retina();
        currRs = $('#fullscr').find('.rsLightbox').royalSlider({
          arrowsNav: !Modernizr.touch,
          arrowsNavAutoHide: false,
          autoScaleSlider: true,
          controlNavigationSpacing: 0,
          controlNavigation: 'bullets',
          fadeinLoadedSlide: false,
          imageScaleMode: 'fit-if-smaller',
          imageAlignCenter: true,
          keyboardNavEnabled: true,
          numImagesToPreload: 3,
          slidesSpacing: 0,
          usePreloader: true
        }).data('royalSlider');
      },
      statusCode: {
        404: function () {
          alert("page not found");
        }
      }
    });
    return false;
  });

  $('#fullscr .closeBtn').on('click', function (e) {
    e.preventDefault();
    $('#fullscr').hide();
    enable_scroll();
    currRs.destroy();
  });

  function runIsotope() {
    winWidth = $(window).width();
    if (winWidth <= 480) {
      columns = 3;
    } else if (winWidth > 480 && winWidth <= 768) {
      columns = 5;
    } else if (winWidth > 768 && winWidth <= 1024) {
      columns = 7;
    } else if (winWidth > 1024 && winWidth <= 1440) {
      columns = 9;
    } else {
      columns = 11;
    }
    newColumnWidth = Math.floor($isotopeContainer.width() / columns);
    $('.thumb').css('margin', gutter / 2 + 'px');
    $('.thumb').width(newColumnWidth - gutter);
    $('.thumb').height(newColumnWidth - gutter);
    $('.width2').width(newColumnWidth * 2 - gutter);
    $('.height2').height(newColumnWidth * 2 - gutter);
    $('.thumb').find('img').show();
    $isotopeContainer.isotope({
      itemSelector: '.thumb',
      resizable: false,
      masonry: {
        columnWidth: newColumnWidth
      }
    });
    $isotopeContainer.isotope('reLayout', $.updateCanvas);
  }

  $.updateCanvas = function () {
    var rc, tlc;
    if (Modernizr.canvas) {
      rc = $('#ringChart').data('ringChart');
      if (rc) {
        rc.resizeCanvas();
      }
      tlc = $('#timelineChart').data('timeline');
      if (tlc) {
        tlc.resizeCanvas();
      }
    }
    $.slideToHash();
  };

});
