'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = functions.config().service_account;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.ogp = functions.https.onRequest((req, res) => {
    const parser = require("ogp-parser");
    const params = req.query;
    //const chacheControl = 'private, no-cache, no-store';
    const chacheControl = 'public, max-age=31557600, s-maxage=31557600';
    if (!params.hasOwnProperty('url')) {
        console.error("Error getting ogp data: please provide url");
        return res.json({ error: "Error getting ogp data: please provide url" });
    }
    return parser(encodeURI(params['url']), false)
        .then((data) => {
            console.log(data);
            console.log(params['url']);
            if (!data.hasOwnProperty('title')) {
                console.error("Error getting ogp data: no ogpData returned");
                return res.json({ error: "no ogpData returned" });
            }
            let ogpData = {};
            ogpData['siteName'] = data.title;
            for(let prop in data.ogp) {
                if (/^og:/g.test(prop)) {
                    ogpData[prop.split(':')[1]] = data.ogp[prop][0];
                }
            }
            return res.set('Cache-Control', chacheControl).json(ogpData);
        })
        .catch((err) => {
            console.error("Error getting ogp data: " + err);
            return res.json({ error: err });
        });
});
