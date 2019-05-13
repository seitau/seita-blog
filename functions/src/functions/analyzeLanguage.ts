import firebase from '../common/firebase';
import language from '@google-cloud/language';
import * as cors from 'cors';
const corsHandler = cors({origin: true});

let serviceAccount;
if (process.env.NODE_ENV === 'test') {
    serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
} else {
    serviceAccount = firebase.functions.config().gcloud_service_account;
}
const client = new language.LanguageServiceClient(serviceAccount);

export default firebase.functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        if (!/application\/json/g.test(req.get('content-type'))) {
            console.error("Error: request has to be application/json format");
            return res.status(400).json({ error: "request has to be application/json format" });

        } else if (req.method !== "POST") {
            console.error("Error: request has to be post method");
            return res.status(400).json({ error: "request has to be post method" });
        }

        const params = req.body;
        const hasText = params.hasOwnProperty('line'); 
        const hasBook = params.hasOwnProperty('book'); 
        const hasUserId = params.hasOwnProperty('userId'); 
        if (!hasText || !hasBook || !hasUserId){
            return res.status(400).json({ error: "Invalid request: required params missing"});
        }

        const userRef = firebase.db.collection('users').doc(params.userId);
        const bookRef = userRef.collection('books').doc(params.book);
        const lineDoc: any = await bookRef.collection('lines').doc(params.line).get()
            .catch((err) => {
                return res.status(500).json({ error: err });
            });
        const lineData = lineDoc.data();
        if (lineData.hasOwnProperty('tags') && lineData.hasOwnProperty('contents')) {
            return res.status(200).json({ result: {
                tags: lineData.tags,
                contents: lineData.contents,
            }});
        }
        const document = {
            content: params.line,
            type: 'PLAIN_TEXT',
        };
        try {
            const [ syntax ] = await client.analyzeSyntax({ document });
            const tags = new Array();
            const contents = new Array();
            syntax.tokens.forEach(part => {
                tags.push(part.partOfSpeech.tag);
                contents.push(part.text.content);
            });
            await bookRef.collection('lines').doc(params.line).update({
                tags: tags,
                contents: contents,
            })
            return res.status(200).json({ result: {
                tags: tags,
                contents: contents,
            }});
        } catch (err) {
            return res.status(500).json({ error: err });
        }
    });
});
