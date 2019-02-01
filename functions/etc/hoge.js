const parser = require('ogp-parser');

//parser("https://tech.ginco.io/post/neo-hackathon/", false)
    //.then((data) => {
        //return console.log(data);
    //})
    //.catch((err) => {
        //return console.error("Error getting ogp data: " + err);
    //});

const cheerio = require('cheerio');
const request = require('request');

request({
    method: 'GET',
    url: 'https://www.ivysoho.net/article.php/uikit-fan-7'
}, (err, res, body) => {
    if (err) {
        console.error(err);
    };

    const $ = cheerio.load(res.body);
    let ogp = new Object();
    ogp['siteName'] = $('title').text();
    $('head').contents().filter('meta').each((i, elem) => {
        if (elem.hasOwnProperty('attribs')) {
            const attrs = elem.attribs;
            if (Object.prototype.hasOwnProperty.call(attrs, 'property')) {
                if (/^og:/g.test(attrs.property)) {
                    let prop = attrs.property;
                    let content = attrs.content;
                    ogp[prop.split(':')[1]] = content;
                };
            }
        };
    });    

    console.log(ogp)
    return ogp;
});

