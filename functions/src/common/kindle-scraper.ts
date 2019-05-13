import firebase from './firebase';
//import moment from 'moment';
import { sha256 } from 'js-sha256';
const amazonKindleJapanUrl = 'https://read.amazon.co.jp/notebook?ref_=kcr_notebook_lib';
const amazonKindleUnitedStatesUrl = 'https://read.amazon.com/notebook?ref_=kcr_notebook_lib';
const pc = {
    name: 'Desktop 1920x1080',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
    viewport: {
        width: 1920,
        height: 1080
    }
};

export default class {
    browser: any;
    page: any;
    pages: any;
    amazonEmail: any;
    amazonPassword: any;
    userId: any;
    scrapeAll: any;
    amazonKindleUrl: any;
    additionalPageNum: any;
    userRef: any;

    constructor(browser, page, amazonEmail, amazonPassword, options: any = {}) {
        this.browser = browser
        this.page = page;
        this.pages = new Array();
        this.amazonEmail = amazonEmail;
        this.amazonPassword = amazonPassword;
        this.userId = sha256(amazonEmail + amazonPassword);
        this.scrapeAll = options.scrapeAll === undefined ? false : options.scrapeAll;
        this.amazonKindleUrl = options.amazonJapan === undefined ? amazonKindleJapanUrl : amazonKindleUnitedStatesUrl;
        this.additionalPageNum = options.additionalPageNum === undefined ? 2 : options.additionalPageNum;
    }

    async hasCookies() {
        const amazonCookiesDoc: any = await this.userRef.collection('cookies')
            .doc('amazon').get()
            .catch((err) => console.error(err));
        return amazonCookiesDoc.exists;
    }

    async setUpEnvironment() {
        console.log('Authenticating: ' + this.userId);
        await firebase.authenticate(this.userId);
        this.userRef = firebase.db.collection('users').doc(this.userId);
        console.log('Authenticated: ' + this.userId);

        const page = this.page;
        console.log('Emulating device');
        await page.emulate(pc);

        if (await this.hasCookies()) {
            console.log('Restoring cookie');
            await this.restoreCookies();
        }

        console.log('Opening amazon kindle website');
        await page.goto(this.amazonKindleUrl, {waitUntil: 'load'});

        const password_input = await page.$('#ap_password');
        if(password_input !== null) {
            console.log('Logging in to amazon kindle');
            await this.login();
        }
    }

    async login() {
        const page = this.page;
        const password_input = await page.$('#ap_password');
        console.log('Typing password');
        if(password_input !== null) {
            await page.type('#ap_password', this.amazonPassword);
        }

        const email_input = await page.$('#ap_email');
        console.log('Typing email');
        if(email_input !== null) {
            await page.type('#ap_email', this.amazonEmail);
        }

        //const buffer = await page.screenshot({fullPage: true});
        //const storageRef = firebase.storage().ref();
        //const now = moment().format('DD-MMM-YYYY');
        //const imagesRef = storageRef.child(`images/${now}.jpg`);
        //const image = new Blob([new Uint8Array(buffer)]);
        //imagesRef.put(image).then((snapshot) => {
            //console.log('Uploaded a screenshot');
        //});

        console.log('Submitting form');
        await page.click('#signInSubmit');
    }

    async restoreCookies() {
        const amazonCookiesDoc: any = await this.userRef.collection('cookies')
            .doc('amazon').get()
            .catch((err) => console.error(err));
        if (!amazonCookiesDoc.exists) {
            console.error('Amazon cookies does not exist');
        }
        const amazonCookies = amazonCookiesDoc.data();
        for (const name in amazonCookies) {
            await this.page.setCookie(amazonCookies[name]);
        }
    }

    async saveCookies() {
        const cookies = await this.page.cookies();
        const batch = firebase.db.batch();
        const docRef = await this.userRef.collection('cookies').doc('amazon');
        const data = new Object();
        for (const cookie of cookies) {
            data[cookie.name] = cookie;
        }
        batch.set(docRef, data);
        await batch.commit();
    }

    async scrapeBook(page, bookObject) {
        const id = bookObject.id;
        const book = bookObject.element;
        const title = await book.$eval('.kp-notebook-searchable', (e) => {
            return e.textContent;
        });
        const src = await book.$eval('.kp-notebook-cover-image', (img) =>  {
            return img.getAttribute('src').replace(/\._SY160/, '');
        });

        console.log('Scraping on page ' + page.num + ': ' + title);

        await page.click(`#` + id)
        await page.waitForSelector('.kp-notebook-annotation-container')
          .catch((err) => {
              console.error(err)
              return
          });

        const yellowHighlights = await page.$$('.kp-notebook-highlight-yellow');
        const blueHighlights = await page.$$('.kp-notebook-highlight-blue');

        const yellowAnnotations = (await Promise.all(yellowHighlights.map((yellowHl) => {
            return yellowHl.$eval('#highlight', (span) => span.textContent)
                .then((text) => text)
                .catch((err) => undefined);
        }))).filter((e) => e !== undefined);

        const blueAnnotations = (await Promise.all(blueHighlights.map((blueHl) => {
            return blueHl.$eval('#highlight', (span) => span.textContent)
                .then((text) => text)
                .catch((err) => undefined);
        }))).filter((e) => e !== undefined);

        return {
            title: title,
            image: src,
            yellowAnnotations: yellowAnnotations,
            blueAnnotations: blueAnnotations,
        };
    }

    async scrapeBooks(page, books) {
        if (books.length === 0) {
            return Promise.resolve([]);
        }

        const bookDatas = new Array();
        for (const book of books) {
            bookDatas.push(await this.scrapeBook(page, book))
        }
        return bookDatas;
    }

    async scrapeBooksParallelly(booksMap) {
        const pages = this.pages;
        const booksPromises = new Array();
        for (let i = 0; i < pages.length; i++) {
            booksPromises.push(this.scrapeBooks(pages[i], booksMap[i]));
        }
        return booksPromises;
    }

    async scrapeKindle() {
        const browser = this.browser;
        const page = this.page;
        const pages = this.pages;

        await this.setUpEnvironment();

        const eachBookSelector = 'div.kp-notebook-library-each-book';
        await page.waitForSelector(eachBookSelector);
        const bookList = await page.$$(eachBookSelector);
        let books = new Array();
        for(const book of bookList) {
            books.push({
                id: await (await book.getProperty('id')).jsonValue(),
                element: book,
            });
        }
        if (!this.scrapeAll) {
            books = books.slice(0, 10);
        }
        console.log('Book number: ' + books.length);

        page.num = 0
        pages.push(page);
        for (let i = 0; i < this.additionalPageNum; i++) {
            const newPage = await browser.newPage();
            newPage.num = i + 1;
            await newPage.goto(this.amazonKindleUrl);
            pages.push(newPage)
        }

        const pagesNum = pages.length;
        const additionalNum = books.length % pagesNum;
        const iterationNum = (books.length - additionalNum) / pagesNum;

        const booksMap = new Object();
        for (let i = 0; i < pages.length; i++) {
            booksMap[i] = new Array();
        }

        for (let i = 0; i < iterationNum; i++) {
            for (let j = 0; j < pages.length; j++) {
                booksMap[j].push(books[i + iterationNum * j]);
            }
        }

        //booksNumがpageNumより小さい場合
        if (iterationNum <= 0 && additionalNum === books.length) {
            for (let i = 0; i < additionalNum; i++) {
                booksMap[i].push(books[i]);
            }
        } else {
            for (let i = 0; i < additionalNum; i++) {
                booksMap[i].push(books[pagesNum * iterationNum + i]);
            }
        }

        try {
            const bookDatasList = await Promise.all(
                await this.scrapeBooksParallelly(booksMap)
            );

            console.log('Scraping finished'); 

            console.log('Storing into database'); 
            let bookDatas = new Array();
            for (const booksList of bookDatasList) {
                bookDatas = bookDatas.concat(booksList);
            }
            const batch = firebase.db.batch();
            for (const bookData of bookDatas) {
                const docRef = this.userRef.collection('books').doc(bookData.title);
                batch.set(docRef, {
                    title: bookData.title,
                    book_cover_image_url: bookData.image,
                });
                const lines = bookData.yellowAnnotations;
                const words = bookData.blueAnnotations;
                for (const line of lines) {
                    const lineRef = docRef.collection('lines').doc(line);
                    batch.set(lineRef, {
                        line: line,
                    });
                }
                for (const word of words) {
                    const wordRef = docRef.collection('words').doc(word);
                    batch.set(wordRef, {
                        word: word,
                    });
                }
            }
            await batch.commit();
        } catch(err) {
            console.error(err);
        }
        await this.saveCookies();
        return 
    }
}
