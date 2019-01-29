var ogs = require('open-graph-scraper');
var parser = require('ogp-parser');
var options = {'url': 'https://ucsb.tokyo/post/2019-01-08-%E8%87%AA%E5%B7%B1%E7%B4%B9%E4%BB%8B/'};
//ogs(options, function (error, results) {
  //console.log('error:', error); // This is returns true or false. True if there was a error. The error it self is inside the results object.
  //console.log('results:', results);
//});

parser("https://ucsb.tokyo/post/2019-01-08-%E8%87%AA%E5%B7%B1%E7%B4%B9%E4%BB%8B/", false)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error("Error getting ogp data: " + err);
    });


