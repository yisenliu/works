(function ($) {
  'use strict';
  var section = [],
    sectionLoaded = [],
    sectionNum = 0,
    hashStr = getHashStr(),
    currentHashIndex = 0,
    $root = $('html') ,
    fromClick = false,
    firstLoad = true,
    $header = $('#header'),
    headerHeight = $header.height(),
    $section = $('.section'),
    title;

  function getHashStr() {
    var newHash = window.location.hash;
    if (!newHash) {
      newHash = '#home';
    }
    return newHash;
  }

  function posNavi() {
    var wst = $(window).scrollTop();
    if (wst > headerHeight) {
      $('.navi').removeClass('no-float').addClass('float');
      $header.addClass('hide');
    } else {
      $header.removeClass('hide');
      $('.navi').removeClass('float').addClass('no-float');
    }
  }

  function getHashIndex() {
    var hashIndex;
    for (hashIndex = 0; hashIndex < sectionNum; hashIndex++) {
      if (getHashStr() === section[hashIndex].hash) {
        break;
      }
    }
    return hashIndex;
  }

  function onHashChange() {
    posNavi();
    hashStr = getHashStr();
    if (!window.location.hash) {
      window.location.hash = '#home';
    }
    currentHashIndex = getHashIndex();
    switch (getHashStr()) {
      case '#home':
        title = 'Home';
        if (!sectionLoaded[currentHashIndex]) {
          setTimeout(function () {
            var totalTime = 3000;
            $('.home-statistics li').each(function (index, element) {
              var num = $(element).data('num'),
                i = 0,
                rollInt = setInterval(rollNum, totalTime / num);

              function rollNum() {
                $(element).find('p').text((i <= 1000) ? i++ : '999+');
                if (i === num) {
                  clearInterval(rollInt);
                }
              }
            });
          }, 500);
        }
        break;
      case '#works':
        title = 'Works';
        break;
      case '#skills':
        title = 'Skills';
        if (!sectionLoaded[currentHashIndex]) {
          setTimeout(function () {
            if (Modernizr.canvas) {
              $('#ringChart').ringChart({
                container: $('.skillsDiv > .slideContent')
              });
            } else {
              //////IE7-8
              $('.barChart ul li').each(function (index, element) {
                var percent = $(element).data('percentage');
                $(element).delay(50 * index).fadeIn('slow', function () {
                  $(this).children('h4').animate({
                    width: percent + '%'
                  }, 200, function () {
                    if (!$.browser.msie) {
                      $(this).finish();
                    }
                  });
                });
              });
            }
          }, 500);
        }
        break;
      case '#about':
        title = 'About me';
        break;
      case '#clients':
        title = 'Clients';
        break;
      default:
    }
    if (fromClick || firstLoad) {
      slideToHash();
    }
    $('.navi li').each(function () {
      var $el = $(this);
      $el[$el.find('a').attr('href') === hashStr ? 'addClass' : 'removeClass']('current');
    });
    sectionLoaded[currentHashIndex] = true;
    document.title = 'Yisen | ' + title;
    return;
  }



  function slideToHash() {
    $root.stop().animate({
      scrollTop: $section.eq(currentHashIndex).offset().top
    }, 500, function () {
      var temp = section[currentHashIndex].hash,
        bodyId = temp.charAt(1).toUpperCase() + temp.slice(2);
      $('body').attr('class', bodyId);
      fromClick = false;
      firstLoad = false;
    });
  }


  $.slideToHash = function () {
    slideToHash();
  };

  $.activeSPA = function () {
    sectionNum = $section.length;
    var newFooterHeight = $(window).height() - $section.eq(sectionNum - 1).height(),
      i;
    if ($('#footer').height() < newFooterHeight) {
      $('#footer').height(newFooterHeight);
    }
    for (i = 0; i < sectionNum; i++) {
      section.push({
        top: $section.eq(i).offset().top,
        hash: $section.eq(i).data('section')
      });
      sectionLoaded.push(false);
    }
    if (Modernizr.hashchange) {
      window.onhashchange = onHashChange;
    } else {
      $(window).hashchange(onHashChange);
    }
    onHashChange();

    $('.navi a').on('click', function () {
      fromClick = true;
      if (getHashStr() === $(this).attr('href')) {
        slideToHash();
      }
    });

    $('.scrollDown').on('click', function () {
      $root.stop().animate({
        scrollTop: $(this).offset().top - $('#header').height() + $(this).outerHeight()
      }, 500);
      return false;
    });

    $(window).scrollStopped(function () {
      var wst = $(this).scrollTop(),
        j;
      for (j = 0; j < sectionNum; j++) {
        if (wst < Math.floor($section.eq(j).offset().top + $section.eq(j).height())) {
          $('.navi li').eq(j).addClass('current').siblings().removeClass('current');
          location.hash = section[j].hash;
          break;
        }
      }
      posNavi();
    });
  };

}(jQuery));
