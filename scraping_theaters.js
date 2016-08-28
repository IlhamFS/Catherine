module.exports = function (dict, callback){
  var phantom = require('phantom');
  var cheerio = require('cheerio');
  var sitepage = null;
  var sitepage2 = null;
  var phInstance = null;
  var phInstance2 = null;
  var result = '';
  var arr = [];
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
              arr.push(1);
              var li = $(this).text();
              dict[li] = () => {};
            }
          });
          sitepage.close();
          phInstance.exit();
          dict.layout = arr;
          callback(null, dict);
      })
      .catch(error => {
          console.log(error);
          phInstance.exit();
      });
}
