const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = functions.config().service_account;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.ogp = functions.https.onRequest((req, res) => {
    const parser = require("ogp-parser");
    const params = req.query;
    const chacheControl = 'public, max-age=31557600, s-maxage=31557600';
    if (!params.hasOwnProperty('url')) {
        console.error("Error getting ogp data: please provide url");
        return res.json({ error: "Error getting ogp data: please provide url" });
    }
    return parser(params['url'], false)
        .then((ogpData) => {
            console.log(ogpData);
            return res.set('Cache-Control', chacheControl).json(ogpData);
        })
        .catch((err) => {
            console.error(err);
            return res.json({ error: "Error getting ogp data:" + err });
        });
});

