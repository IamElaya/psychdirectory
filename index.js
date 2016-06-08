var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  url = 'http://www.psychologists.bc.ca/users/hollymclean?param=search_view';
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var title, release, rating;
      var scraped = [];
      
      $('#inner').filter(function(){
        var data = $(this);
        name = data.children().first().children().first().text()
        office_address = ((data.children().first().children().eq(2).text()) + (data.children().first().children().eq(3).text()))
        work_phone = data.children().first().children().eq(4).text()
        adult_assessment = data.children().eq(1).children().eq(1).children().eq(1).text()
        adult_treatment = data.children().eq(1).children().eq(1).children().eq(2).text()
        adolescent_assessment = data.children().eq(1).children().eq(1).children().eq(3).text()
        adolescent_treatment = data.children().eq(1).children().eq(1).children().eq(4).text()
        child_assessment = data.children().eq(1).children().eq(1).children().eq(5).text()
        client_considerations = data.children().eq(1).children().eq(1).children().eq(6).text()
        approaches_used = data.children().eq(1).children().last().text()

        scraped.push({
          name : name,
          office_address : office_address,
          work_phone : work_phone,
          adult_assessment : adult_assessment,
          adult_treatment : adult_treatment,
          adolescent_assessment : adolescent_assessment,
          adolescent_treatment : adolescent_treatment,
          child_assessment : child_assessment,
          client_considerations : client_considerations,
          approaches_used : approaches_used


        });
      });
      console.log(scraped);
      console.log(adult_treatment)
    }
    scraped.forEach(function (output){
      
      // object to string
      var keys = Object.keys(output);
      var values = keys.map(function(key) {
        return output[key];
      });

      // var line = values.toString() + '\n';
      var line = values.join(', ') + '\n';

      fs.appendFile('output.csv', line, 'utf8', function(err){
        if (err) {
        console.log(error);
      } else {
        console.log('File successfully written! - Check your project directory for the output.csv file');
      }
      });
    }); 
   
    res.send('Check your console!')
  });

})

app.listen('3000')
console.log('xD');
exports = module.exports = app;