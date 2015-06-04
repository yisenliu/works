$.ajax({
  dataType: "json",
  url: 'techArticles.json',
  cache: false,
  success: function (data) {
    'use strict';
    var i, $el,
      taNum = data.articles.length,
      $homeTP = $('.home-technical-panes');
    if (data.articles.length !== 0) {
      $homeTP.append('<hgroup class="slideHeading"><h1>Technical</h1><i class="icon-test-tube icon-clear"></i><h2>Never stop learning. </h2></hgroup><section class="home-technical"></section>');
      for (i in data.articles) {
        $('.home-technical').append('<article><header><a><img /><h3></h3></a></header><p></p><footer></footer></article>');
        $el = $('.home-technical > article').eq(i);
        $el.find('header a').attr('href', data.articles[i].href);
        $el.find('img').attr('src', data.articles[i].img);
        $el.find('h3').html(data.articles[i].heading);
        $el.find('p').html(data.articles[i].context);
        $el.find('footer').html(data.articles[i].date).append('<cite></cite>');
        $el.find('cite').html('[<a></a>]');
        $el.find('cite a').attr('href', data.articles[i].citeLink).text(data.articles[i].cite);
      }
    } else {
      $homeTP.hide();
    }
  }
});
