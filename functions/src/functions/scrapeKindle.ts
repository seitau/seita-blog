import firebase from '../common/firebase';

export default firebase.functions
    .runWith({
        timeoutSeconds: 200,
        memory: '1GB'
    })
    .https.onRequest(async (req, res) => {
        if (!/application\/json/g.test(req.get('content-type'))) {
            console.error("Error scraping kindle: request has to be application/json format");
            return res.status(400).json({ error: "Error scraping kindle: request has to be application/json format" });

        } else if (req.method !== "POST") {
            console.error("Error scraping kindle: request has to be post method");
            return res.status(400).json({ error: "Error scraping kindle: request has to be post method" });
        }

        const KindleScraper = require('../common/kindle-scraper').default;
        const puppeteer = require('puppeteer');
        const body = req.body;
        if (!body.hasOwnProperty('email') || !body.hasOwnProperty('password')) {
            console.error("Error scraping kindle: please provide email and password");
            return res.status(400).json({ error: "Error scraping kindle: please provide email and password" });
        }

        const options = new Object();
        if (body.hasOwnProperty('scrapeAll')) {
            options['scrapeAll'] = body.scrapeAll;
        };
        if (body.hasOwnProperty('amazonJapan')) {
            options['amazonJapan'] = body.amazonJapan;
        };
        const browser = await puppeteer.launch({
            headless: true,
            //headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        const scraper = new KindleScraper(browser, page, body.email, body.password, options);
        await scraper.scrapeKindle()
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: "Error scraping kindle: " + err });
            });

        return res.status(200).json({
            result: "Successfully scraped kindle",

        });
    });

