var request = require('request');
var cheerio = require('cheerio');
var request = request.defaults({jar:true})

var theater_name = 'ARION XXI';
request('http://m.21cineplex.com/gui.list_theater?sid=&p=th', function (error, response, html){
  if(! error && response.statusCode == 200){
    var $ = cheerio.load(html);
    $('li').each(function(i, element){
      if($(this).parent().prev().text() != 'PLAYING AT Jakarta'){
        var a = $(this);
        if(a.text() == theater_name ){
          console.log(a.text());
          show_movies(a.children('a').attr('href'));
        }
    }
    });
  }
})

function show_movies(theater_link){
  request('http://m.21cineplex.com/' + theater_link, function(error, response, html){
    var $ = cheerio.load(html);
    console.log('http://m.21cineplex.com/' + theater_link);
    //console.log(html);
    $('#menu_ol_schedule').each(function(i, element){
      console.log('hooho');
      var movie_name = $(this).children('li').children('a').text();
      console.log(movie_name);
    })
  })
}
