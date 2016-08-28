module.exports = function (callback){
  var phantom = require('phantom');
  var cheerio = require('cheerio');
  var mymodule = require('./scraping_movies.js')
  var sitepage = null;
  var phInstance = null;
  var result = '';
  var arr_layout = [];
  var arr_texts = [];
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
            if($(this).parent().prev().text() == 'ALL THEATERS'){
              arr_layout.push(1);
              var li = $(this).text();
              arr_texts.push(li);
              result += li + '\n';
            }
          });
          sitepage.close();
          phInstance.exit();
          callback(null, result);
      })
      .catch(error => {
          console.log(error);
          phInstance.exit();
      });
}
