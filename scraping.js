var phantom = require('phantom');
var cheerio = require('cheerio');
var sitepage = null;
var sitepage2 = null;
var phInstance = null;
var phInstance2 = null;
var theater_name = 'ARION XXI';
var result = '';
phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        sitepage = page;
        return page.open('http://m.21cineplex.com/gui.list_theater?sid=&p=th');
    })
    .then(status => {
        console.log(status);
        return sitepage.property('content');
    })
    .then(content => {
        var $ = cheerio.load(content);
        $('li').each(function(i, element){
          if($(this).parent().prev().text() != 'PLAYING AT Jakarta'){
            var li = $(this);
            if(theater_name == li.text()){
              show_movies(phInstance, 'http://m.21cineplex.com/' + li.children('a').attr('href'));
            }
          }
        });

    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });

function show_movies(ph, url){
      phInstance2 = ph;
      ph.createPage()
      .then(page => {
        sitepage2 = page;
        return page.open(url);
      })
      .then(status => {
        console.log(status);
        return sitepage2.property('content');
      })
      .then(content => {
          var $ = cheerio.load(content);
          $('ol').each(function(i, element){
            var movie_name = $(this);
            var movie_schedule = $(this).next();
            var scrap_date = movie_schedule.children('.p_date');
            var scrap_time = movie_schedule.children('.p_time');
            var scrap_price = movie_schedule.children('.p_price');
            result += movie_name.text();
            var dates = scrap_date.map(function(i, element){
              return $(this).text();
            }).get();
            var times = scrap_time.map(function(i, element){
              return $(this).text();
            }).get();
            var prices = scrap_price.map(function(i, element){
              return $(this).text();
            }).get();
            for(var i = 0; i < dates.length; i++){
              result += dates[i] + '\n';
              result += times[i] + '\n';
              result += prices[i] + '\n\n';
            }
          });
          sitepage2.close();
          sitepage.close();
          phInstance.exit();
          phInstance2.exit();
          console.log(result);
      })
      .catch(error => {
          console.log(error);
          phInstance2.exit();
      });
}
