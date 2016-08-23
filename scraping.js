var phantom = require('phantom');
var cheerio = require('cheerio');
var sitepage = null;
var sitepage2 = null;
var phInstance = null;
var phInstance2 = null;
var theater_name = 'ARION XXI';
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
        //console.log(content);
        var $ = cheerio.load(content);
        $('li').each(function(i, element){
          if($(this).parent().prev().text() != 'PLAYING AT Jakarta'){
            var li = $(this);
            if(theater_name == li.text()){
              console.log(li.children('a').attr('href'));
              show_movies(phInstance, 'http://m.21cineplex.com/' + li.children('a').attr('href'));
            }
              //show_movies(a.children('a').attr('href'));
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
            var li = $(this);
            console.log(li.text());

          });
          sitepage2.close();
          sitepage.close();
          phInstance.exit();
          phInstance2.exit();
      })
      .catch(error => {
          console.log(error);
          phInstance2.exit();
      });
}
